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
