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
