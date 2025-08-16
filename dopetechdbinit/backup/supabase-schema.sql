-- DopeTech E-commerce Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  features JSONB,
  rating INTEGER DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  hidden_on_home BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_city VARCHAR(100),
  customer_state VARCHAR(100),
  customer_zip_code VARCHAR(20),
  customer_address TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_option VARCHAR(20) DEFAULT 'full',
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'processing',
  receipt_url TEXT,
  receipt_file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access to products)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Allow authenticated users to create orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true);

-- Allow order items to be created with orders
CREATE POLICY "Order items can be created with orders" ON order_items
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, price, original_price, description, category, image_url, features, discount, in_stock, stock_quantity) VALUES
('DopeTech Mechanical Keyboard', 299.99, 349.99, 'Premium mechanical keyboard with Cherry MX switches', 'keyboard', '/products/keyboard.png', '["RGB Backlight", "Wireless", "Programmable Keys"]', 14, true, 50),
('DopeTech Gaming Mouse', 89.99, 119.99, 'High-precision gaming mouse with 25,600 DPI', 'mouse', '/products/Screenshot 2025-08-02 215024.png', '["25,600 DPI", "RGB", "Programmable Buttons"]', 25, true, 75),
('DopeTech Wireless Headphones', 199.99, 249.99, 'Studio-grade wireless headphones with ANC', 'audio', '/products/Screenshot 2025-08-02 215007.png', '["Active Noise Cancellation", "40h Battery", "Bluetooth 5.0"]', 20, true, 30),
('DopeTech Smart Speaker', 149.99, 179.99, '360-degree smart speaker with voice control', 'speaker', '/products/Screenshot 2025-08-02 215110.png', '["360° Audio", "Voice Control", "Smart Home Integration"]', 17, true, 25),
('DopeTech Security Key', 49.99, 59.99, 'Biometric security key for enhanced protection', 'accessory', '/products/key.png', '["Fingerprint Sensor", "NFC", "Water Resistant"]', 17, true, 100);
