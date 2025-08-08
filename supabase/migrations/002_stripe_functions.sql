-- RPCs for Stripe wrapper (schema: christtask)
-- Functions: get_active_prices, validate_coupon, get_or_create_customer

-- 1) List active prices from the wrapper
CREATE OR REPLACE FUNCTION public.get_active_prices()
RETURNS TABLE(
  id TEXT,
  active BOOLEAN,
  currency TEXT,
  unit_amount INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.active,
    p.currency,
    p.unit_amount
  FROM christtask.prices p
  WHERE p.active = true
$$;

GRANT EXECUTE ON FUNCTION public.get_active_prices() TO authenticated;

-- 2) Validate a coupon from the wrapper catalog
CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code TEXT)
RETURNS TABLE(valid BOOLEAN, coupon JSONB, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  c RECORD;
BEGIN
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
      NULL;
  ELSE
    RETURN QUERY SELECT false, NULL, 'Invalid coupon code';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT) TO authenticated;

-- 3) Get or create a customer in the wrapper by email
CREATE OR REPLACE FUNCTION public.get_or_create_customer(user_email TEXT)
RETURNS TABLE(customer_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_id TEXT;
  caller_email TEXT;
BEGIN
  -- Ensure caller acts on their own email (profiles must be populated)
  SELECT email INTO caller_email
  FROM public.profiles
  WHERE id = auth.uid();

  IF caller_email IS NULL OR caller_email <> user_email THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Look for existing customer by email
  SELECT id INTO existing_id
  FROM christtask.customers
  WHERE email = user_email;

  IF existing_id IS NOT NULL THEN
    RETURN QUERY SELECT existing_id;
  END IF;

  -- Create new customer via the wrapper
  INSERT INTO christtask.customers (email)
  VALUES (user_email)
  RETURNING id INTO existing_id;

  RETURN QUERY SELECT existing_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_or_create_customer(TEXT) TO authenticated;


