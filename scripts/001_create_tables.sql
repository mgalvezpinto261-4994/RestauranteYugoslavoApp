-- Create users table (for restaurant staff)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'waiter')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tables table (restaurant tables)
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'reserved')) DEFAULT 'available',
  current_order_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  min_quantity DECIMAL(10, 2) NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create menu_item_ingredients table (junction table)
CREATE TABLE IF NOT EXISTS public.menu_item_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(menu_item_id, inventory_item_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'paid')) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for current_order_id in tables
ALTER TABLE public.tables 
  DROP CONSTRAINT IF EXISTS tables_current_order_id_fkey,
  ADD CONSTRAINT tables_current_order_id_fkey 
  FOREIGN KEY (current_order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tables_status ON public.tables(status);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON public.orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_ingredients_menu_item_id ON public.menu_item_ingredients(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_ingredients_inventory_item_id ON public.menu_item_ingredients(inventory_item_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (only admins can manage users)
CREATE POLICY "Allow authenticated users to read users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to insert users" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins to update users" ON public.users
  FOR UPDATE USING (true);

CREATE POLICY "Allow admins to delete users" ON public.users
  FOR DELETE USING (true);

-- RLS Policies for tables (all authenticated users can read, admins can modify)
CREATE POLICY "Allow all authenticated users to read tables" ON public.tables
  FOR SELECT USING (true);

CREATE POLICY "Allow all authenticated users to update tables" ON public.tables
  FOR UPDATE USING (true);

-- RLS Policies for menu_items (all can read, admins can modify)
CREATE POLICY "Allow all authenticated users to read menu_items" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to insert menu_items" ON public.menu_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins to update menu_items" ON public.menu_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow admins to delete menu_items" ON public.menu_items
  FOR DELETE USING (true);

-- RLS Policies for inventory_items (all can read, admins can modify)
CREATE POLICY "Allow all authenticated users to read inventory_items" ON public.inventory_items
  FOR SELECT USING (true);

CREATE POLICY "Allow all authenticated users to update inventory_items" ON public.inventory_items
  FOR UPDATE USING (true);

-- RLS Policies for menu_item_ingredients (all can read, admins can modify)
CREATE POLICY "Allow all authenticated users to read menu_item_ingredients" ON public.menu_item_ingredients
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to insert menu_item_ingredients" ON public.menu_item_ingredients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins to update menu_item_ingredients" ON public.menu_item_ingredients
  FOR UPDATE USING (true);

CREATE POLICY "Allow admins to delete menu_item_ingredients" ON public.menu_item_ingredients
  FOR DELETE USING (true);

-- RLS Policies for orders (all authenticated users can manage orders)
CREATE POLICY "Allow all authenticated users to read orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Allow all authenticated users to insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update orders" ON public.orders
  FOR UPDATE USING (true);

CREATE POLICY "Allow all authenticated users to delete orders" ON public.orders
  FOR DELETE USING (true);

-- RLS Policies for order_items (all authenticated users can manage order items)
CREATE POLICY "Allow all authenticated users to read order_items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow all authenticated users to insert order_items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update order_items" ON public.order_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow all authenticated users to delete order_items" ON public.order_items
  FOR DELETE USING (true);
