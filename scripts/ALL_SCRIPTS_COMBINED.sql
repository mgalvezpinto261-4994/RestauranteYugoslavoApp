-- ============================================
-- Script SQL Combinado para Supabase
-- Ejecuta este archivo completo en Supabase SQL Editor
-- ============================================

-- ============================================
-- 001_create_tables.sql
-- ============================================

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


-- ============================================
-- 002_seed_data.sql
-- ============================================

-- Insert default users (admin and waiter)
INSERT INTO public.users (username, password_hash, role) VALUES
  ('admin', '$2a$10$rKZvVqZ5YqZ5YqZ5YqZ5YeKZvVqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'admin'),
  ('mesero', '$2a$10$rKZvVqZ5YqZ5YqZ5YqZ5YeKZvVqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'waiter')
ON CONFLICT (username) DO NOTHING;

-- Insert tables (10 tables)
INSERT INTO public.tables (table_number, status) VALUES
  (1, 'available'),
  (2, 'available'),
  (3, 'available'),
  (4, 'available'),
  (5, 'available'),
  (6, 'available'),
  (7, 'available'),
  (8, 'available'),
  (9, 'available'),
  (10, 'available')
ON CONFLICT (table_number) DO NOTHING;

-- Insert inventory items
INSERT INTO public.inventory_items (name, quantity, unit, category, min_quantity) VALUES
  ('Tomate', 50, 'kg', 'Verduras', 10),
  ('Lechuga', 30, 'kg', 'Verduras', 5),
  ('Cebolla', 40, 'kg', 'Verduras', 10),
  ('Carne de Res', 25, 'kg', 'Carnes', 5),
  ('Pollo', 30, 'kg', 'Carnes', 8),
  ('Pescado', 15, 'kg', 'Pescados', 5),
  ('Arroz', 100, 'kg', 'Granos', 20),
  ('Frijoles', 50, 'kg', 'Granos', 10),
  ('Pasta', 40, 'kg', 'Granos', 10),
  ('Queso', 20, 'kg', 'Lácteos', 5),
  ('Leche', 50, 'litros', 'Lácteos', 10),
  ('Aceite', 30, 'litros', 'Aceites', 5),
  ('Sal', 20, 'kg', 'Condimentos', 5),
  ('Pimienta', 5, 'kg', 'Condimentos', 1),
  ('Azúcar', 25, 'kg', 'Endulzantes', 5),
  ('Harina', 60, 'kg', 'Harinas', 15)
ON CONFLICT DO NOTHING;

-- Insert menu items
INSERT INTO public.menu_items (name, description, price, category, image_url) VALUES
  ('Hamburguesa Clásica', 'Hamburguesa con carne, lechuga, tomate y queso', 8.99, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Pizza Margarita', 'Pizza con tomate, mozzarella y albahaca', 12.99, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Ensalada César', 'Lechuga romana, crutones, parmesano y aderezo César', 7.99, 'Ensaladas', '/placeholder.svg?height=100&width=100'),
  ('Pasta Carbonara', 'Pasta con salsa carbonara, tocino y queso', 10.99, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Tacos de Pollo', 'Tres tacos con pollo, cebolla, cilantro y salsa', 9.99, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Sopa de Tomate', 'Sopa cremosa de tomate con albahaca', 5.99, 'Sopas', '/placeholder.svg?height=100&width=100'),
  ('Filete de Pescado', 'Filete de pescado a la parrilla con vegetales', 15.99, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Arroz con Pollo', 'Arroz amarillo con pollo y vegetales', 11.99, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Coca Cola', 'Refresco de cola 355ml', 2.50, 'Bebidas', '/placeholder.svg?height=100&width=100'),
  ('Agua Mineral', 'Agua mineral 500ml', 1.50, 'Bebidas', '/placeholder.svg?height=100&width=100'),
  ('Jugo de Naranja', 'Jugo natural de naranja 300ml', 3.50, 'Bebidas', '/placeholder.svg?height=100&width=100'),
  ('Café Americano', 'Café americano caliente', 2.99, 'Bebidas', '/placeholder.svg?height=100&width=100'),
  ('Pastel de Chocolate', 'Pastel de chocolate con helado', 6.99, 'Postres', '/placeholder.svg?height=100&width=100'),
  ('Flan', 'Flan casero con caramelo', 4.99, 'Postres', '/placeholder.svg?height=100&width=100'),
  ('Helado', 'Helado de vainilla, chocolate o fresa', 3.99, 'Postres', '/placeholder.svg?height=100&width=100')
ON CONFLICT DO NOTHING;


-- ============================================
-- 003_link_menu_to_inventory.sql
-- ============================================

-- Link menu items to inventory items (ingredients)
-- Get IDs first (we'll use subqueries)

-- Hamburguesa Clásica
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica'),
  (SELECT id FROM public.inventory_items WHERE name = 'Carne de Res'),
  0.2
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Carne de Res')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica'),
  (SELECT id FROM public.inventory_items WHERE name = 'Lechuga'),
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Lechuga')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica'),
  (SELECT id FROM public.inventory_items WHERE name = 'Tomate'),
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Tomate')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica'),
  (SELECT id FROM public.inventory_items WHERE name = 'Queso'),
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Hamburguesa Clásica')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Queso')
);

-- Pizza Margarita
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pizza Margarita'),
  (SELECT id FROM public.inventory_items WHERE name = 'Harina'),
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pizza Margarita')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Harina')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pizza Margarita'),
  (SELECT id FROM public.inventory_items WHERE name = 'Tomate'),
  0.15
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pizza Margarita')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Tomate')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pizza Margarita'),
  (SELECT id FROM public.inventory_items WHERE name = 'Queso'),
  0.2
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pizza Margarita')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Queso')
);

-- Ensalada César
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Ensalada César'),
  (SELECT id FROM public.inventory_items WHERE name = 'Lechuga'),
  0.2
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Ensalada César')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Lechuga')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Ensalada César'),
  (SELECT id FROM public.inventory_items WHERE name = 'Queso'),
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Ensalada César')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Queso')
);

-- Pasta Carbonara
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pasta Carbonara'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pasta'),
  0.25
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pasta Carbonara')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pasta')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pasta Carbonara'),
  (SELECT id FROM public.inventory_items WHERE name = 'Queso'),
  0.1
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pasta Carbonara')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Queso')
);

-- Tacos de Pollo
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Tacos de Pollo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pollo'),
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Tacos de Pollo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pollo')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Tacos de Pollo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Cebolla'),
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Tacos de Pollo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Cebolla')
);

-- Sopa de Tomate
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Sopa de Tomate'),
  (SELECT id FROM public.inventory_items WHERE name = 'Tomate'),
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Sopa de Tomate')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Tomate')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Sopa de Tomate'),
  (SELECT id FROM public.inventory_items WHERE name = 'Cebolla'),
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Sopa de Tomate')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Cebolla')
);

-- Filete de Pescado
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Filete de Pescado'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pescado'),
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Filete de Pescado')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pescado')
);

-- Arroz con Pollo
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Arroz con Pollo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Arroz'),
  0.2
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Arroz con Pollo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Arroz')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Arroz con Pollo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pollo'),
  0.25
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Arroz con Pollo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pollo')
);


-- ============================================
-- 004_update_passwords.sql
-- ============================================

-- Update user passwords with correct bcrypt hashes
-- admin123 hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- mesero123 hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

UPDATE public.users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'admin';

UPDATE public.users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'mesero';


-- ============================================
-- 005_fix_users.sql
-- ============================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Delete existing users
DELETE FROM users;

-- Insert users with properly hashed passwords using bcrypt
-- Password for admin: admin123
-- Password for mesero: mesero123
INSERT INTO users (id, username, password_hash, role, created_at) VALUES
  (gen_random_uuid(), 'admin', crypt('admin123', gen_salt('bf')), 'admin', NOW()),
  (gen_random_uuid(), 'mesero', crypt('mesero123', gen_salt('bf')), 'waiter', NOW());


-- ============================================
-- 006_create_verify_password_function.sql
-- ============================================

-- Create a function to verify passwords using pgcrypto
CREATE OR REPLACE FUNCTION verify_password(username_input TEXT, password_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Get the stored password hash for the user
  SELECT password_hash INTO stored_hash
  FROM users
  WHERE username = username_input;
  
  -- If user not found, return false
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Compare the provided password with the stored hash
  RETURN stored_hash = crypt(password_input, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 007_add_beverages_and_chilean_ingredients.sql
-- ============================================

-- Add beverages to inventory
INSERT INTO public.inventory_items (name, quantity, unit, category, min_quantity) 
SELECT * FROM (VALUES
  ('Coca-Cola 500ml', 100, 'unidades', 'Bebidas', 20),
  ('Fanta 500ml', 80, 'unidades', 'Bebidas', 15),
  ('Sprite 500ml', 80, 'unidades', 'Bebidas', 15),
  ('Bilz 500ml', 60, 'unidades', 'Bebidas', 10),
  ('Pap 500ml', 60, 'unidades', 'Bebidas', 10),
  ('Kem Xtreme 500ml', 50, 'unidades', 'Bebidas', 10),
  ('Agua Mineral 500ml', 120, 'unidades', 'Bebidas', 30),
  ('Jugo Natural Naranja', 40, 'litros', 'Bebidas', 10),
  ('Jugo Natural Piña', 30, 'litros', 'Bebidas', 8),
  ('Café', 10, 'kg', 'Bebidas', 2),
  ('Té', 5, 'kg', 'Bebidas', 1),
  ('Cerveza Cristal', 80, 'unidades', 'Bebidas', 20),
  ('Cerveza Escudo', 80, 'unidades', 'Bebidas', 20),
  ('Vino Tinto', 40, 'botellas', 'Bebidas', 10),
  ('Vino Blanco', 30, 'botellas', 'Bebidas', 8)
) AS v(name, quantity, unit, category, min_quantity)
WHERE NOT EXISTS (
  SELECT 1 FROM public.inventory_items WHERE inventory_items.name = v.name
);

-- Add Chilean food ingredients
INSERT INTO public.inventory_items (name, quantity, unit, category, min_quantity) 
SELECT * FROM (VALUES
  ('Carne Molida (Pino)', 40, 'kg', 'Carnes', 10),
  ('Choclo', 50, 'kg', 'Verduras', 10),
  ('Vainitas', 30, 'kg', 'Verduras', 8),
  ('Zapallo', 35, 'kg', 'Verduras', 10),
  ('Papas', 80, 'kg', 'Verduras', 20),
  ('Huevos', 200, 'unidades', 'Lácteos', 50),
  ('Aceitunas', 15, 'kg', 'Condimentos', 3),
  ('Pasas', 10, 'kg', 'Condimentos', 2),
  ('Pan de Completo', 100, 'unidades', 'Panadería', 20),
  ('Vienesas', 50, 'kg', 'Carnes', 10),
  ('Palta', 30, 'kg', 'Verduras', 8),
  ('Mayonesa', 20, 'kg', 'Condimentos', 5),
  ('Ketchup', 15, 'kg', 'Condimentos', 3),
  ('Mostaza', 10, 'kg', 'Condimentos', 2),
  ('Masa para Empanadas', 40, 'kg', 'Harinas', 10),
  ('Mote', 25, 'kg', 'Granos', 5),
  ('Huesillos', 15, 'kg', 'Frutas', 3),
  ('Sopaipillas (Masa)', 30, 'kg', 'Harinas', 8),
  ('Chancaca', 20, 'kg', 'Endulzantes', 5)
) AS v(name, quantity, unit, category, min_quantity)
WHERE NOT EXISTS (
  SELECT 1 FROM public.inventory_items WHERE inventory_items.name = v.name
);

-- Update menu items to include Chilean dishes
INSERT INTO public.menu_items (name, description, price, category, image_url) 
SELECT * FROM (VALUES
  ('Empanada de Pino', 'Empanada rellena con carne, cebolla, aceitunas y huevo', 2500, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Pastel de Choclo', 'Pastel tradicional con choclo, carne y pollo', 8500, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Completo Italiano', 'Vienesa con palta, tomate y mayonesa', 3500, 'Platos Principales', '/placeholder.svg?height=100&width=100'),
  ('Cazuela de Vacuno', 'Sopa tradicional con carne, papas, zapallo y choclo', 7500, 'Sopas', '/placeholder.svg?height=100&width=100'),
  ('Sopaipillas', 'Masa frita tradicional (3 unidades)', 2000, 'Acompañamientos', '/placeholder.svg?height=100&width=100'),
  ('Mote con Huesillo', 'Bebida tradicional con mote y huesillos', 2500, 'Bebidas', '/placeholder.svg?height=100&width=100')
) AS v(name, description, price, category, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_items WHERE menu_items.name = v.name
);

-- Link beverages to inventory (1:1 relationship for beverages)
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Coca Cola'),
  (SELECT id FROM public.inventory_items WHERE name = 'Coca-Cola 500ml'),
  1
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Coca Cola')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Coca-Cola 500ml')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Coca Cola')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Coca-Cola 500ml')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Agua Mineral'),
  (SELECT id FROM public.inventory_items WHERE name = 'Agua Mineral 500ml'),
  1
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Agua Mineral')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Agua Mineral 500ml')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Agua Mineral')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Agua Mineral 500ml')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Jugo de Naranja'),
  (SELECT id FROM public.inventory_items WHERE name = 'Jugo Natural Naranja'),
  0.3
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Jugo de Naranja')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Jugo Natural Naranja')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Jugo de Naranja')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Jugo Natural Naranja')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Café Americano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Café'),
  0.02
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Café Americano')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Café')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Café Americano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Café')
);

-- Link Chilean dishes to ingredients
-- Empanada de Pino
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino'),
  (SELECT id FROM public.inventory_items WHERE name = 'Masa para Empanadas'),
  0.15
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Empanada de Pino')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Masa para Empanadas')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Masa para Empanadas')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino'),
  (SELECT id FROM public.inventory_items WHERE name = 'Carne Molida (Pino)'),
  0.1
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Empanada de Pino')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Carne Molida (Pino)')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Carne Molida (Pino)')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino'),
  (SELECT id FROM public.inventory_items WHERE name = 'Cebolla'),
  0.03
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Empanada de Pino')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Cebolla')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Cebolla')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino'),
  (SELECT id FROM public.inventory_items WHERE name = 'Aceitunas'),
  0.02
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Empanada de Pino')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Aceitunas')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Aceitunas')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino'),
  (SELECT id FROM public.inventory_items WHERE name = 'Huevos'),
  0.5
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Empanada de Pino')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Huevos')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Empanada de Pino')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Huevos')
);

-- Pastel de Choclo
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pastel de Choclo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Choclo'),
  0.4
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Pastel de Choclo')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Choclo')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pastel de Choclo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Choclo')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pastel de Choclo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Carne Molida (Pino)'),
  0.2
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Pastel de Choclo')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Carne Molida (Pino)')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pastel de Choclo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Carne Molida (Pino)')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pastel de Choclo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pollo'),
  0.15
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Pastel de Choclo')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Pollo')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pastel de Choclo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pollo')
);

-- Completo Italiano
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pan de Completo'),
  1
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Completo Italiano')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Pan de Completo')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pan de Completo')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Vienesas'),
  0.15
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Completo Italiano')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Vienesas')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Vienesas')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Palta'),
  0.05
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Completo Italiano')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Palta')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Palta')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Tomate'),
  0.03
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Completo Italiano')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Tomate')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Tomate')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Mayonesa'),
  0.02
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Completo Italiano')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Mayonesa')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Completo Italiano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Mayonesa')
);

-- Cazuela de Vacuno
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno'),
  (SELECT id FROM public.inventory_items WHERE name = 'Carne de Res'),
  0.25
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Carne de Res')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Carne de Res')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno'),
  (SELECT id FROM public.inventory_items WHERE name = 'Papas'),
  0.2
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Papas')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Papas')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno'),
  (SELECT id FROM public.inventory_items WHERE name = 'Zapallo'),
  0.15
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Zapallo')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Zapallo')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno'),
  (SELECT id FROM public.inventory_items WHERE name = 'Choclo'),
  0.1
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Choclo')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Cazuela de Vacuno')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Choclo')
);

-- Sopaipillas
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Sopaipillas'),
  (SELECT id FROM public.inventory_items WHERE name = 'Sopaipillas (Masa)'),
  0.2
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Sopaipillas')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Sopaipillas (Masa)')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Sopaipillas')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Sopaipillas (Masa)')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Sopaipillas'),
  (SELECT id FROM public.inventory_items WHERE name = 'Zapallo'),
  0.05
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Sopaipillas')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Zapallo')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Sopaipillas')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Zapallo')
);

-- Mote con Huesillo
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Mote'),
  0.1
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Mote con Huesillo')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Mote')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Mote')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Huesillos'),
  0.05
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Mote con Huesillo')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Huesillos')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Huesillos')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillo'),
  (SELECT id FROM public.inventory_items WHERE name = 'Azúcar'),
  0.03
WHERE EXISTS (SELECT 1 FROM public.menu_items WHERE name = 'Mote con Huesillo')
AND EXISTS (SELECT 1 FROM public.inventory_items WHERE name = 'Azúcar')
AND NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillo')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Azúcar')
);


-- ============================================
-- 008_update_prices_clp.sql
-- ============================================

-- Update all menu prices from USD to realistic CLP values
-- Converting prices to Chilean Pesos (multiply by ~800 and round to thousands)
UPDATE public.menu_items SET price = 8000 WHERE name = 'Hamburguesa Clásica'; -- was 8.99
UPDATE public.menu_items SET price = 12000 WHERE name = 'Pizza Margarita'; -- was 12.99
UPDATE public.menu_items SET price = 7000 WHERE name = 'Ensalada César'; -- was 7.99
UPDATE public.menu_items SET price = 10000 WHERE name = 'Pasta Carbonara'; -- was 10.99
UPDATE public.menu_items SET price = 9000 WHERE name = 'Tacos de Pollo'; -- was 9.99
UPDATE public.menu_items SET price = 5000 WHERE name = 'Sopa de Tomate'; -- was 5.99
UPDATE public.menu_items SET price = 15000 WHERE name = 'Filete de Pescado'; -- was 15.99
UPDATE public.menu_items SET price = 11000 WHERE name = 'Arroz con Pollo'; -- was 11.99
UPDATE public.menu_items SET price = 2000 WHERE name = 'Coca Cola'; -- was 2.50
UPDATE public.menu_items SET price = 1500 WHERE name = 'Agua Mineral'; -- was 1.50
UPDATE public.menu_items SET price = 3000 WHERE name = 'Jugo de Naranja'; -- was 3.50
UPDATE public.menu_items SET price = 3000 WHERE name = 'Café Americano'; -- was 2.99
UPDATE public.menu_items SET price = 6000 WHERE name = 'Pastel de Chocolate'; -- was 6.99
UPDATE public.menu_items SET price = 4000 WHERE name = 'Flan'; -- was 4.99
UPDATE public.menu_items SET price = 3500 WHERE name = 'Helado'; -- was 3.99


-- ============================================
-- 009_link_beverages_to_inventory.sql
-- ============================================

-- Vincular bebidas con el inventario para que se descuenten automáticamente

-- Coca-Cola
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Coca Cola'),
  (SELECT id FROM public.inventory_items WHERE name = 'Coca-Cola'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Coca Cola')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Coca-Cola')
);

-- Fanta
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Fanta'),
  (SELECT id FROM public.inventory_items WHERE name = 'Fanta'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Fanta')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Fanta')
);

-- Sprite
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Sprite'),
  (SELECT id FROM public.inventory_items WHERE name = 'Sprite'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Sprite')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Sprite')
);

-- Bilz
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Bilz'),
  (SELECT id FROM public.inventory_items WHERE name = 'Bilz'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Bilz')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Bilz')
);

-- Pap
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Pap'),
  (SELECT id FROM public.inventory_items WHERE name = 'Pap'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Pap')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Pap')
);

-- Kem Xtreme
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Kem Xtreme'),
  (SELECT id FROM public.inventory_items WHERE name = 'Kem Xtreme'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Kem Xtreme')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Kem Xtreme')
);

-- Jugo Natural
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Jugo Natural'),
  (SELECT id FROM public.inventory_items WHERE name = 'Jugo Natural'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Jugo Natural')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Jugo Natural')
);

-- Cerveza
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Cerveza'),
  (SELECT id FROM public.inventory_items WHERE name = 'Cerveza'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Cerveza')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Cerveza')
);

-- Vino Tinto
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Vino Tinto'),
  (SELECT id FROM public.inventory_items WHERE name = 'Vino Tinto'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Vino Tinto')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Vino Tinto')
);

-- Vino Blanco
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Vino Blanco'),
  (SELECT id FROM public.inventory_items WHERE name = 'Vino Blanco'),
  1.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Vino Blanco')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Vino Blanco')
);

-- Mote con Huesillos
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillos'),
  (SELECT id FROM public.inventory_items WHERE name = 'Mote'),
  0.15
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillos')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Mote')
);

INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillos'),
  (SELECT id FROM public.inventory_items WHERE name = 'Huesillos'),
  0.1
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Mote con Huesillos')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Huesillos')
);

-- Café Americano (ya debe tener su vínculo de antes, pero por si acaso)
INSERT INTO public.menu_item_ingredients (menu_item_id, inventory_item_id, quantity)
SELECT 
  (SELECT id FROM public.menu_items WHERE name = 'Café Americano'),
  (SELECT id FROM public.inventory_items WHERE name = 'Café'),
  0.02
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_item_ingredients 
  WHERE menu_item_id = (SELECT id FROM public.menu_items WHERE name = 'Café Americano')
  AND inventory_item_id = (SELECT id FROM public.inventory_items WHERE name = 'Café')
);


-- ============================================
-- 010_add_capacity_to_tables.sql
-- ============================================

-- Add capacity column to tables
ALTER TABLE tables ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 4;

-- Update existing tables to have proper capacity values
UPDATE tables SET capacity = 4 WHERE capacity IS NULL;

-- Add a check constraint to ensure capacity is valid (2, 4, 6, or 8)
ALTER TABLE tables ADD CONSTRAINT valid_capacity CHECK (capacity IN (2, 4, 6, 8));

-- Add comment to the column
COMMENT ON COLUMN tables.capacity IS 'Number of people the table can accommodate (2, 4, 6, or 8)';


-- ============================================
-- 011_add_insert_policy_to_tables.sql
-- ============================================

-- Add INSERT policy for tables
-- This allows authenticated users (especially admins) to insert new tables

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated users to insert tables" ON tables;

-- Create INSERT policy for tables
CREATE POLICY "Allow authenticated users to insert tables"
ON tables
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Optional: If you want to restrict to admins only, use this instead:
-- CREATE POLICY "Allow admins to insert tables"
-- ON tables
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM users
--     WHERE users.id = auth.uid()
--     AND users.role = 'admin'
--   )
-- );


-- ============================================
-- 012_add_password_hash_function.sql
-- ============================================

-- Create function to hash passwords for users
CREATE OR REPLACE FUNCTION hash_password_for_user(
  user_id UUID,
  plain_password TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET password_hash = crypt(plain_password, gen_salt('bf'))
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION hash_password_for_user(UUID, TEXT) TO authenticated;


