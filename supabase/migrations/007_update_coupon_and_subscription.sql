-- Update validate_coupon to allow anonymous access and accept promotion codes
-- Update create_subscription to accept either a coupon ID or a promotion code

-- 1) validate_coupon: checks promotion_codes.code first, then coupons.id
DROP FUNCTION IF EXISTS public.validate_coupon(TEXT);
CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code TEXT)
RETURNS TABLE(valid BOOLEAN, coupon JSONB, error TEXT, is_promotion_code BOOLEAN, promotion_code_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pc RECORD;
  c RECORD;
  coupon_id TEXT;
BEGIN
  -- Try promotion code (human-readable)
  SELECT * INTO pc
  FROM christtask.promotion_codes
  WHERE code = coupon_code AND active = true;

  IF pc IS NOT NULL THEN
    -- Extract coupon id from attrs JSON if present
    coupon_id := COALESCE(pc.attrs -> 'coupon' ->> 'id', NULL);
    IF coupon_id IS NOT NULL THEN
      SELECT * INTO c
      FROM christtask.coupons
      WHERE id = coupon_id AND valid = true;
    END IF;

    IF c IS NOT NULL THEN
      RETURN QUERY SELECT
        true,
        jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'percent_off', c.percent_off,
          'amount_off', c.amount_off,
          'currency', c.currency
        ),
        NULL,
        true,
        pc.id;
    ELSE
      RETURN QUERY SELECT false, NULL, 'Invalid or inactive promotion code', true, pc.id;
    END IF;
  END IF;

  -- Try direct coupon id
  SELECT * INTO c
  FROM christtask.coupons
  WHERE id = coupon_code AND valid = true;

  IF c IS NOT NULL THEN
    RETURN QUERY SELECT
      true,
      jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'percent_off', c.percent_off,
        'amount_off', c.amount_off,
        'currency', c.currency
      ),
      NULL,
      false,
      NULL;
  END IF;

  RETURN QUERY SELECT false, NULL, 'Invalid coupon code', NULL, NULL;
END;
$$;

-- Allow both anon (for pre-login validation) and authenticated to call
GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT) TO anon, authenticated;

-- 2) create_subscription: accept coupon_code as either promotion code or coupon id
CREATE OR REPLACE FUNCTION public.create_subscription(
  price_id TEXT,
  customer_id TEXT,
  plan TEXT,
  coupon_code TEXT DEFAULT NULL
)
RETURNS TABLE(client_secret TEXT, stripe_subscription_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
  customer_email TEXT;
  sub_id TEXT;
  client_secret_out TEXT;
  discounts JSONB;
  attrs JSONB;
  pc RECORD;
  c RECORD;
BEGIN
  IF plan NOT IN ('weekly', 'monthly') THEN
    RAISE EXCEPTION 'Invalid plan';
  END IF;

  SELECT email INTO caller_email
  FROM public.profiles
  WHERE id = auth.uid();
  IF caller_email IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT email INTO customer_email
  FROM christtask.customers
  WHERE id = customer_id;
  IF customer_email IS NULL OR customer_email <> caller_email THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  discounts := NULL;
  IF coupon_code IS NOT NULL AND length(coupon_code) > 0 THEN
    -- Prefer promotion code by human-readable code
    SELECT * INTO pc
    FROM christtask.promotion_codes
    WHERE code = coupon_code AND active = true;
    IF pc IS NOT NULL THEN
      discounts := jsonb_build_array(jsonb_build_object('promotion_code', pc.id));
    ELSE
      -- Fallback to coupon id
      SELECT * INTO c FROM christtask.coupons WHERE id = coupon_code AND valid = true;
      IF c IS NOT NULL THEN
        discounts := jsonb_build_array(jsonb_build_object('coupon', coupon_code));
      END IF;
    END IF;
  END IF;

  attrs := jsonb_build_object(
    'items', jsonb_build_array(jsonb_build_object('price', price_id, 'quantity', 1)),
    'payment_behavior', 'default_incomplete',
    'expand', jsonb_build_array('latest_invoice.payment_intent')
  );
  IF discounts IS NOT NULL THEN
    attrs := attrs || jsonb_build_object('discounts', discounts);
  END IF;

  INSERT INTO christtask.subscriptions (customer, attrs)
  VALUES (customer_id, attrs)
  RETURNING id INTO sub_id;

  SELECT (i.attrs -> 'payment_intent' ->> 'client_secret') INTO client_secret_out
  FROM christtask.invoices i
  WHERE i.subscription = sub_id
  ORDER BY i.period_start DESC NULLS LAST
  LIMIT 1;

  IF client_secret_out IS NULL THEN
    RAISE EXCEPTION 'Failed to create subscription payment intent';
  END IF;

  INSERT INTO public.subscriptions (
    user_id,
    stripe_customer_id,
    stripe_subscription_id,
    plan,
    status
  ) VALUES (
    auth.uid(),
    customer_id,
    sub_id,
    plan,
    'incomplete'
  );

  RETURN QUERY SELECT client_secret_out, sub_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_subscription(TEXT, TEXT, TEXT, TEXT) TO authenticated;


