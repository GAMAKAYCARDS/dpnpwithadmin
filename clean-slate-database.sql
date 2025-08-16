-- Clean Slate Database Setup
-- This creates a completely empty database ready for admin uploads

-- First, clear all existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;

-- Reset the auto-increment counters
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- The database is now completely clean and ready for admin uploads
-- No products will be inserted - you can add them through the admin panel

-- Show the count of products (should be 0)
SELECT COUNT(*) as total_products FROM products;
