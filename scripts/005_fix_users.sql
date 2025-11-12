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
