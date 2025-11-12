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
