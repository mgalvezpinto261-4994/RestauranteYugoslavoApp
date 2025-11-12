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
