-- Create a checkout session via the Stripe wrapper and return the hosted URL
-- Uses christtask.checkout_sessions with params in attrs JSON

CREATE OR REPLACE FUNCTION public.create_checkout_session(
  price_id TEXT,
  customer_id TEXT,
  success_url TEXT,
  cancel_url TEXT,
  coupon_code TEXT DEFAULT NULL
)
RETURNS TABLE(session_id TEXT, url TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
  customer_email TEXT;
  new_session_id TEXT;
  session_url TEXT;
  attrs_base JSONB;
BEGIN
  -- Ensure caller is authenticated and owns the customer email
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

  attrs_base := jsonb_build_object(
    'mode', 'subscription',
    'line_items', jsonb_build_array(jsonb_build_object('price', price_id, 'quantity', 1)),
    'success_url', success_url,
    'cancel_url', cancel_url
  );

  IF coupon_code IS NOT NULL AND length(coupon_code) > 0 THEN
    attrs_base := attrs_base || jsonb_build_object(
      'discounts', jsonb_build_array(jsonb_build_object('coupon', coupon_code))
    );
  END IF;

  INSERT INTO christtask.checkout_sessions (customer, attrs)
  VALUES (customer_id, attrs_base)
  RETURNING id, attrs ->> 'url' INTO new_session_id, session_url;

  RETURN QUERY SELECT new_session_id, session_url;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_checkout_session(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;


