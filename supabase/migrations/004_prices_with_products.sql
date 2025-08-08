-- Enhance get_active_prices to include product info for client mapping

-- Drop existing function to allow changing return signature
DROP FUNCTION IF EXISTS public.get_active_prices();

CREATE OR REPLACE FUNCTION public.get_active_prices()
RETURNS TABLE(
  id TEXT,
  active BOOLEAN,
  currency TEXT,
  unit_amount INTEGER,
  product TEXT,
  product_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.active,
    p.currency,
    p.unit_amount,
    p.product,
    prod.name as product_name
  FROM christtask.prices p
  JOIN christtask.products prod ON prod.id = p.product
  WHERE p.active = true
$$;

GRANT EXECUTE ON FUNCTION public.get_active_prices() TO authenticated;


