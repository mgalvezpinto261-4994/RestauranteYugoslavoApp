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
