# Stripe1 Schema Setup Guide

## ✅ What We've Fixed

### 1. **Supabase Client Configuration**
- Main `supabase` client now points to `stripe1` schema
- Separate `supabaseAuth` client for authentication (uses default `public` schema)
- All subscription and account data now goes to `stripe1` schema

### 2. **Authentication Flow Fixed**
- **Login page**: Now uses `supabaseAuth` for proper authentication
- **Signup page**: Now uses `supabaseAuth` and creates account records
- **Payment page**: All auth operations use `supabaseAuth`

### 3. **Account Creation System**
- New API endpoint: `/api/create-account` creates records in `stripe1.accounts`
- Account creation happens automatically after:
  - Direct signup via `/signup`
  - Payment completion with new user signup
  - Setup intent completion (free trials/coupons)

## 🗄️ Required Database Schema

Make sure your `stripe1` schema has these tables:

### `stripe1.accounts`
```sql
CREATE TABLE stripe1.accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE stripe1.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own account" ON stripe1.accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own account" ON stripe1.accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### `stripe1.subscriptions`
```sql
CREATE TABLE stripe1.subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT,
  price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE stripe1.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions" ON stripe1.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON stripe1.subscriptions
  FOR ALL USING (current_setting('role') = 'service_role');
```

## 🔧 Flow Summary

1. **User signs up** → Creates auth user + `stripe1.accounts` record
2. **User makes payment** → Creates `stripe1.subscriptions` record
3. **All data lives in `stripe1` schema** (except auth which stays in `public`)

## 🚀 Next Steps

1. **Test the flow**:
   - Try signing up a new user
   - Complete a payment
   - Check both `stripe1.accounts` and `stripe1.subscriptions` tables

2. **Optional: Add database triggers** (alternative to API calls):
   ```sql
   -- Auto-create account when auth user is created
   CREATE OR REPLACE FUNCTION create_account_for_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO stripe1.accounts (user_id, email)
     VALUES (NEW.id, NEW.email);
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER create_account_trigger
     AFTER INSERT ON auth.users
     FOR EACH ROW
     EXECUTE FUNCTION create_account_for_user();
   ```

## ⚠️ Important Notes

- **Authentication** uses the default `public` schema (Supabase auth)
- **Business data** (accounts, subscriptions) uses `stripe1` schema
- **Both schemas** are in the same database, just separated logically
- **RLS policies** ensure users can only access their own data

Your accounts table should now populate when users sign up! 🎉
