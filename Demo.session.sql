-- Check database demo existence
SELECT * FROM pg_database WHERE datname = 'demo';

-- Check existence of users table
SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_schema = 'public'
      AND    table_name   = 'users'
      );

-- Get all rows from users table
SELECT * FROM users;

-- Delete users table
DROP TABLE users