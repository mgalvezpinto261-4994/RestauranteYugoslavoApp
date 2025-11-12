-- Script para corregir el login
-- Este script asegura que los usuarios y la función de verificación estén correctos

-- 1. Asegurar que la extensión pgcrypto esté habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Eliminar usuarios existentes si hay problemas
DELETE FROM public.users WHERE username IN ('admin', 'mesero');

-- 3. Crear usuarios con contraseñas hasheadas correctamente usando crypt
INSERT INTO public.users (username, password_hash, role, created_at) VALUES
  ('admin', crypt('admin123', gen_salt('bf')), 'admin', NOW()),
  ('mesero', crypt('mesero123', gen_salt('bf')), 'waiter', NOW())
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- 4. Crear o reemplazar la función verify_password
CREATE OR REPLACE FUNCTION public.verify_password(username_input TEXT, password_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Obtener el hash almacenado para el usuario
  SELECT password_hash INTO stored_hash
  FROM public.users
  WHERE username = username_input;
  
  -- Si no se encuentra el usuario, retornar false
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar la contraseña usando crypt
  RETURN stored_hash = crypt(password_input, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Verificar que los usuarios se crearon correctamente
SELECT username, role, 
       CASE 
         WHEN password_hash IS NOT NULL THEN 'Password hash exists'
         ELSE 'No password hash'
       END as password_status
FROM public.users
WHERE username IN ('admin', 'mesero');

