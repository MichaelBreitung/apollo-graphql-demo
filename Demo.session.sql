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

-- Get all rows from users table where user id is < 3
SELECT * FROM users WHERE id < 3;

-- Delete users table
DROP TABLE users;

-- Get multiple users with one call
SELECT * FROM users WHERE id in (1, 3);
