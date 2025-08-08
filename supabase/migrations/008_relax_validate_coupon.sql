-- Relax validate_coupon: treat active promotion codes as valid even if coupon details are not expanded

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
  -- Try promotion code first
  SELECT * INTO pc
  FROM christtask.promotion_codes
  WHERE code = coupon_code AND active = true;

  IF pc IS NOT NULL THEN
    coupon_id := COALESCE(pc.attrs -> 'coupon' ->> 'id', NULL);
    IF coupon_id IS NOT NULL THEN
      SELECT * INTO c FROM christtask.coupons WHERE id = coupon_id AND valid = true;
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
      -- Valid promo code, but no coupon details available: still valid
      RETURN QUERY SELECT true, NULL, NULL, true, pc.id;
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

GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT) TO anon, authenticated;


