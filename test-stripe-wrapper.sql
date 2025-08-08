-- Test queries to see your Stripe data via the wrapper

-- 1. Check if we can access Stripe data
SELECT 'Stripe wrapper is working!' as status;

-- 2. See all your products
SELECT 
  id,
  name,
  description,
  active,
  created
FROM christtask.products;

-- 3. See all your prices
SELECT 
  id,
  product_id,
  unit_amount,
  currency,
  recurring_interval,
  recurring_interval_count,
  active
FROM christtask.prices;

-- 4. See your customers (if any)
SELECT 
  id,
  email,
  created
FROM christtask.customers;

-- 5. See your subscriptions (if any)
SELECT 
  id,
  customer_id,
  status,
  current_period_start,
  current_period_end
FROM christtask.subscriptions;

-- 6. Get products with their prices
SELECT 
  p.name as product_name,
  p.description,
  pr.unit_amount,
  pr.currency,
  pr.recurring_interval,
  pr.recurring_interval_count
FROM christtask.products p
JOIN christtask.prices pr ON p.id = pr.product_id
WHERE pr.active = true;
