-- Update create_subscription to accept plan and upsert app-level subscription
-- Add mark_subscription_active to flip status after client confirmation

-- Replace existing create_subscription signature
DROP FUNCTION IF EXISTS public.create_subscription(TEXT, TEXT, TEXT);

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
BEGIN
  -- Validate plan
  IF plan NOT IN ('weekly', 'monthly') THEN
    RAISE EXCEPTION 'Invalid plan';
  END IF;

  -- Caller must be authenticated and own the customer email
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

  IF coupon_code IS NOT NULL AND length(coupon_code) > 0 THEN
    discounts := jsonb_build_array(jsonb_build_object('coupon', coupon_code));
  ELSE
    discounts := NULL;
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

  -- Get client_secret from the expanded latest invoice payment_intent stored in invoice attrs
  SELECT (i.attrs -> 'payment_intent' ->> 'client_secret') INTO client_secret_out
  FROM christtask.invoices i
  WHERE i.subscription = sub_id
  ORDER BY i.period_start DESC NULLS LAST
  LIMIT 1;

  IF client_secret_out IS NULL THEN
    RAISE EXCEPTION 'Failed to create subscription payment intent';
  END IF;

  -- Upsert app-level subscription row as incomplete
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

-- Mark subscription active after successful client confirmation
CREATE OR REPLACE FUNCTION public.mark_subscription_active(stripe_subscription_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = 'active', updated_at = NOW()
  WHERE user_id = auth.uid() AND stripe_subscription_id = mark_subscription_active.stripe_subscription_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_subscription_active(TEXT) TO authenticated;


