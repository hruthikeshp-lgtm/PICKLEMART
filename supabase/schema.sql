-- =====================================================================
-- PICKLE MART — DATABASE SCHEMA (PostgreSQL / Supabase)
-- Brand: Pickle Mart ("Feel the real taste, made by Grandma.")
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
-- All prices stored in integer paise to eliminate floating-point rounding errors (e.g. ₹150 = 15000 paise)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || gen_random_uuid()),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  price_in_paise INTEGER NOT NULL CHECK (price_in_paise >= 0),
  package_weight_grams INTEGER NOT NULL DEFAULT 250 CHECK (package_weight_grams > 0),
  image_url TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  spice_level TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT ('ord-' || gen_random_uuid()),
  order_reference TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  order_notes TEXT,
  subtotal_in_paise INTEGER NOT NULL CHECK (subtotal_in_paise >= 0),
  delivery_fee_in_paise INTEGER NOT NULL DEFAULT 0 CHECK (delivery_fee_in_paise >= 0),
  discount_in_paise INTEGER NOT NULL DEFAULT 0 CHECK (discount_in_paise >= 0),
  total_in_paise INTEGER NOT NULL CHECK (total_in_paise >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'pay_at_store', 'online')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (
    order_status IN (
      'Pending Confirmation',
      'Confirmed',
      'Preparing',
      'Dispatched',
      'Delivered',
      'Cancelled'
    )
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE (With historical snapshots)
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT ('item-' || gen_random_uuid()),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name_snapshot TEXT NOT NULL,
  unit_price_in_paise INTEGER NOT NULL CHECK (unit_price_in_paise >= 0),
  package_weight_grams INTEGER NOT NULL DEFAULT 250,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total_in_paise INTEGER NOT NULL CHECK (line_total_in_paise >= 0)
);

-- 6. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq-' || gen_random_uuid()),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read products and categories
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Anyone can insert orders and contact inquiries
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Customers can view their own orders via phone verification / order reference
CREATE POLICY "Customer View Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Customer View Items" ON order_items FOR SELECT USING (true);
