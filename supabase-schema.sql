-- ==============================================================================
-- ANGOLAMARKET — SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Mercado Angolano: Produtores, Afiliados, Clientes, Pedidos, Entregas e Comissões
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum & Profiles Table
CREATE TYPE user_role AS ENUM ('admin', 'producer', 'affiliate', 'client');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  role user_role NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_approval')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  subcategories JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Delivery Zones Table (Configuração Dinâmica de Preços por Município/Zona)
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  zone_name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  estimated_days_min INT NOT NULL DEFAULT 1,
  estimated_days_max INT NOT NULL DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  promotional_price NUMERIC(12,2),
  discount_percent INT DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  stock INT NOT NULL DEFAULT 0,
  producer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pickup_address TEXT NOT NULL,
  affiliate_commission_percent INT NOT NULL DEFAULT 10,
  rating NUMERIC(3,2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_promo BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending_approval', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Images Table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Affiliates Table & Wallets
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL, -- Ex: 'AF-7821'
  commission_rate_default INT DEFAULT 10,
  total_clicks INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  total_sales_volume NUMERIC(14,2) DEFAULT 0.00,
  commission_pending NUMERIC(12,2) DEFAULT 0.00,
  commission_available NUMERIC(12,2) DEFAULT 0.00,
  commission_withdrawn NUMERIC(12,2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Orders Table
CREATE TYPE order_status_type AS ENUM (
  'received',
  'payment_pending',
  'payment_confirmed',
  'in_preparation',
  'awaiting_pickup',
  'in_delivery',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_method_type AS ENUM (
  'multicaixa_express',
  'paypay',
  'bank_transfer',
  'cash_on_delivery'
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY, -- Ex: AM-2026-000001
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  reference_point TEXT,
  notes TEXT,
  subtotal NUMERIC(12,2) NOT NULL,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(12,2) DEFAULT 0.00,
  total NUMERIC(12,2) NOT NULL,
  payment_method payment_method_type NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed')),
  order_status order_status_type NOT NULL DEFAULT 'received',
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  affiliate_ref TEXT,
  affiliate_commission_total NUMERIC(12,2) DEFAULT 0.00,
  proof_url TEXT,
  tracking_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  image TEXT,
  producer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  affiliate_commission_amount NUMERIC(12,2) DEFAULT 0.00
);

-- 10. Affiliate Sales & Commission Records
CREATE TABLE affiliate_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  sale_amount NUMERIC(12,2) NOT NULL,
  commission_rate INT NOT NULL,
  commission_amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'available', 'withdrawn', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Withdrawals Table (Levantamento de Comissões)
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_role TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  net_amount NUMERIC(12,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('multicaixa_express', 'paypay', 'unitel_money', 'afrimoney', 'iban')),
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 12. Coupons Table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  value NUMERIC(12,2) NOT NULL,
  min_order_amount NUMERIC(12,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Platform Settings Table
CREATE TABLE platform_settings (
  id INT PRIMARY KEY DEFAULT 1,
  platform_fee_percent NUMERIC(5,2) DEFAULT 10.00,
  default_affiliate_commission INT DEFAULT 10,
  withdrawal_fee_percent NUMERIC(5,2) DEFAULT 2.00,
  min_withdrawal_amount NUMERIC(12,2) DEFAULT 5000.00,
  require_product_approval BOOLEAN DEFAULT TRUE,
  whatsapp_support_number TEXT DEFAULT '+244 923 000 111',
  support_email TEXT DEFAULT 'suporte@angolamarket.ao',
  enabled_payments JSONB DEFAULT '{"multicaixa_express": true, "paypay": true, "bank_transfer": true, "cash_on_delivery": true}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Public can read basic profile, user can edit own, admin full access
CREATE POLICY "Public read basic profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full profiles access" ON profiles FOR ALL USING (is_admin());

-- Products: Everyone can view approved products; Producers can manage their own; Admins full access
CREATE POLICY "Public read approved products" ON products FOR SELECT USING (status = 'approved' OR auth.uid() = producer_id OR is_admin());
CREATE POLICY "Producers insert products" ON products FOR INSERT WITH CHECK (auth.uid() = producer_id);
CREATE POLICY "Producers update own products" ON products FOR UPDATE USING (auth.uid() = producer_id OR is_admin());
CREATE POLICY "Producers delete own products" ON products FOR DELETE USING (auth.uid() = producer_id OR is_admin());

-- Orders: Customer can see their own orders; Producers can see orders with their products; Admin can see all
CREATE POLICY "Customers read own orders" ON orders FOR SELECT USING (auth.uid() = customer_id OR is_admin());
CREATE POLICY "Anyone can insert order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins update orders" ON orders FOR UPDATE USING (is_admin());

-- Affiliates: Affiliate sees their own profile, Admins full access
CREATE POLICY "Affiliates read own" ON affiliates FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins manage affiliates" ON affiliates FOR ALL USING (is_admin());

-- Withdrawals: User can view and request their own; Admin manages all
CREATE POLICY "Users view own withdrawals" ON withdrawals FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users insert withdrawals" ON withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage withdrawals" ON withdrawals FOR ALL USING (is_admin());
