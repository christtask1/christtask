-- Test your Stripe wrapper data

-- 1. Check if wrapper is working
SELECT 'Stripe wrapper test' as status;

-- 2. See your products
SELECT 
  id,
  name,
  description,
  active
FROM christtask.products;

-- 3. See your prices
SELECT 
  id,
  product_id,
  unit_amount,
  currency,
  recurring_interval,
  recurring_interval_count,
  active
FROM christtask.prices;

-- 4. Get products with their prices
SELECT 
  p.name as product_name,
  p.description,
  pr.id as price_id,
  pr.unit_amount,
  pr.currency,
  pr.recurring_interval,
  pr.recurring_interval_count
FROM christtask.products p
JOIN christtask.prices pr ON p.id = pr.product_id
WHERE pr.active = true;
