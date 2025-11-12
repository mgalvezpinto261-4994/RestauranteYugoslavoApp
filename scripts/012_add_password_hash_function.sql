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
