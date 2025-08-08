-- Create RPC functions for Stripe wrapper integration

-- Function to get or create a customer
CREATE OR REPLACE FUNCTION public.get_or_create_customer(
  customer_email TEXT,
  payment_method_id TEXT
)
RETURNS TABLE(customer_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_customer_id TEXT;
BEGIN
  -- Check if customer exists in christtask.customers
  SELECT id INTO existing_customer_id 
  FROM christtask.customers 
  WHERE email = customer_email;
  
  IF existing_customer_id IS NOT NULL THEN
    -- Customer exists, return the ID
    RETURN QUERY SELECT existing_customer_id;
  ELSE
    -- Create new customer using Stripe wrapper
    INSERT INTO christtask.customers (email, payment_method_id)
    VALUES (customer_email, payment_method_id)
    RETURNING id INTO existing_customer_id;
    
    RETURN QUERY SELECT existing_customer_id;
  END IF;
END;
$$;

-- Function to get active prices
CREATE OR REPLACE FUNCTION public.get_prices()
RETURNS TABLE(
  id TEXT,
  active BOOLEAN,
  currency TEXT,
  unit_amount INTEGER,
  recurring_interval TEXT,
  recurring_interval_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    c.id,
    c.active,
    c.currency,
    c.unit_amount,
    c.recurring_interval,
    c.recurring_interval_count
  FROM christtask.prices c
  WHERE c.active = true;
END;
$$;

-- Function to validate coupon (queries actual Stripe wrapper data)
CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code TEXT)
RETURNS TABLE(valid BOOLEAN, coupon JSONB, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coupon_record RECORD;
BEGIN
  -- Check if coupon exists in christtask.coupons table
  SELECT * INTO coupon_record 
  FROM christtask.coupons 
  WHERE id = coupon_code AND valid = true;
  
  IF coupon_record IS NOT NULL THEN
    -- Coupon exists and is valid
    RETURN QUERY SELECT 
      true as valid,
      jsonb_build_object(
        'id', coupon_record.id,
        'name', coupon_record.name,
        'percent_off', coupon_record.percent_off,
        'amount_off', coupon_record.amount_off,
        'currency', coupon_record.currency
      ) as coupon,
      NULL as error;
  ELSE
    -- Coupon doesn't exist or is invalid
    RETURN QUERY SELECT 
      false as valid,
      NULL as coupon,
      'Invalid coupon code' as error;
  END IF;
END;
$$;
