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
