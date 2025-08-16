-- Restore Original DopeTech Database Data
-- This will restore all the original products including Instagram data

-- First, clear all existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;

-- Reset the auto-increment counters
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Insert original products (including Instagram data)
INSERT INTO products (name, price, original_price, description, category, image_url, features, discount, in_stock, stock_quantity) VALUES
('DopeTech Mechanical Keyboard', 299.99, 349.99, 'Premium mechanical keyboard with Cherry MX switches', 'keyboard', '/products/keyboard.png', '["RGB Backlight", "Wireless", "Programmable Keys"]', 14, true, 50),
('DopeTech Gaming Mouse', 89.99, 119.99, 'High-precision gaming mouse with 25,600 DPI', 'mouse', '/products/Screenshot 2025-08-02 215024.png', '["25,600 DPI", "RGB", "Programmable Buttons"]', 25, true, 75),
('DopeTech Wireless Headphones', 199.99, 249.99, 'Studio-grade wireless headphones with ANC', 'audio', '/products/Screenshot 2025-08-02 215007.png', '["Active Noise Cancellation", "40h Battery", "Bluetooth 5.0"]', 20, true, 30),
('DopeTech Smart Speaker', 149.99, 179.99, '360-degree smart speaker with voice control', 'speaker', '/products/Screenshot 2025-08-02 215110.png', '["360° Audio", "Voice Control", "Smart Home Integration"]', 17, true, 25),
('DopeTech Security Key', 49.99, 59.99, 'Biometric security key for enhanced protection', 'accessory', '/products/key.png', '["Fingerprint Sensor", "NFC", "Water Resistant"]', 17, true, 100);

-- Insert all the Instagram products (this is the original data)
INSERT INTO products (name, price, original_price, description, category, image_url, in_stock, stock_quantity, features, rating, reviews, discount, hidden_on_home) VALUES 
('isn''t just a headset, it's a weapon 🗡️', 999.99, 1199.99, 'Razer Kraken X:  isn''t just a headset, it's a weapon 🗡️
Built for those who play to win. With 7.1 surround sound you can hear footsteps, reloads, and movements with deadly accuracy.
🔸250gm Ultra light
🔸7.1 surround sound 
🔸Custom-Tuned 40mm drivers
🔸Flexible Cardioid microphone 
🔸Over ear cushions
_____
DM us for more information 📩
Call us: 
Delivery all over Nepal 🇳🇵 (Terms and conditions applied)
_____', 'audio', 'https://instagram.flas1-1.fna.fbcdn.net/v/t51.2885-15/491461258_18039800333628406_2100783026850145485_n.webp?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.flas1-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QEuIIl9UMtQrGiFE-FGUGwoOtMHn6IkAw2W8Mf2Ce0Ujp2oyg71AnAXjDPXjcrpOoc&_nc_ohc=hgiLr5QB3eYQ7kNvwHIbifL&_nc_gid=rUZDzt7XSyRCwNhP6eMguQ&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfUprsGvN4LPwTZhrm8j7kByUzK1SAMC-dsagntWMKgg5Q&oe=68A1C7EC&_nc_sid=10d13b', true, 22, '["dopetechnepal","razer","razergaming","razerstreamer","headset"]', 4, 24, 0, false);

INSERT INTO products (name, price, original_price, description, category, image_url, in_stock, stock_quantity, features, rating, reviews, discount, hidden_on_home) VALUES 
('9801690693', 999.99, 1199.99, 'Typing never sounded this creamy 😍🎶
Meet the Ajazz AK820 Pro —  So creamy, you''ll type just to hear it sing. 🎶⌨️
It packs a punch with a customizable TFT screen, hot-swappable switches, Tri-mode connectivity, a 75% layout, and a smooth volume knob — all wrapped in a sleek, creamy-sounding build.
🔸Ajazz creamy Gift switch 
🔸TFT customizable Screen
🔸82 Keys/81 Keys +1 Metal Volume Knob
🔸75% TKL Compact Design 
🔸Type-C Wired, BT 5.0 & 2.4GHz wireless 
🔸Gasket-mounted & Flex-cut PC Plate an', 'keyboard', 'https://instagram.fqro2-1.fna.fbcdn.net/v/t51.2885-15/509943589_18047356211628406_8356963029661610663_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fqro2-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QFbma0GqGscQLWdXS1myefYZnb6y2hzDUmErtCLDjFZ_9vjRCSANg_7fyOdEbSRB-g&_nc_ohc=ZIJIxv3Hik4Q7kNvwGu6LXx&_nc_gid=5LUg1IMuaaOqR8oQVIFi9g&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfXRk1lo87nlwiVX9btEMXtV1xLIyt8Xi39q5TRf4H_a9Q&oe=68A1F247&_nc_sid=10d13b', true, 32, '["dopetechnepal","ajazz","ak820","ak820pro","ak820max"]', 5, 12, 0, false);

INSERT INTO products (name, price, original_price, description, category, image_url, in_stock, stock_quantity, features, rating, reviews, discount, hidden_on_home) VALUES 
('9 aspect ratio & whapping 180Hz refresh rate ensuring smooth visuals & faster response time.', 999.99, 1199.99, '🚀 Game beyond ordinary - HKC 27" QHD 180HZ GAMING MONITOR 🔥
FAST MOVES & CRISPY VIEWS 😍
Features 27-inch Fast IPS panel with 2560x1440 resolution,16:9 aspect ratio & whapping 180Hz refresh rate ensuring smooth visuals & faster response time.
📺 27" QHD immersive display
⚡180Hz refresh rate 
⏱️1 ms response time
💡HDR 400
🌈 sRGB 123% / Adobe RGB 102%
_____
DM us for more information 📩
Call us: 
Delivery all over Nepal 🇳🇵 (Terms & conditions applied)
_____', 'gaming', 'https://scontent-muc2-1.cdninstagram.com/v/t51.2885-15/490428316_18039358472628406_6777482191330845593_n.webp?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=scontent-muc2-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QE314V6JGUTf_9U9UutQHU2TiHhg_LzSiLLHDSxGCHn2QZniDPHJla2NOTITg4jHG4&_nc_ohc=PybIAlwXVDwQ7kNvwFOHtLz&_nc_gid=KYfCmKEPeBDq4SBfKxK79Q&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfWR2lm1VNPGGe-LlcBJ1Gmn-_2ODKwO7sSWFkjGEdeYLw&oe=68A1D7CA&_nc_sid=10d13b', true, 19, '["dopetechnepal","hkc","hkcmonitor","gaming","gamingpc"]', 5, 23, 0, false);

INSERT INTO products (name, price, original_price, description, category, image_url, in_stock, stock_quantity, features, rating, reviews, discount, hidden_on_home) VALUES 
('2.4Ghz Wireless / BT / Wired', 999.99, 1199.99, '🔥 Ajazz AJ139 V2 MC — Built to frag, not lag!! 💯
Game smart. Click sharp. Go Ajazz
Whether you''re flicking heads or on a late-night grind, this featherlight beast packs serious heat.⚡With a 1,000Hz polling rate, tri-mode (2.4G, Bluetooth, wired), a magnetic charging dock, and 18,000 DPI via the app—it's built for nonstop, pro-level play without burning your wallet.
🔸1,000Hz Polling Rate
🔸18,000 DPI via Software
🔸Tri-Mode: 2.4Ghz Wireless / BT / Wired
🔸Magnetic Charging Dock
🔸RGB Lighting
', 'keyboard', 'https://instagram.fmri1-1.fna.fbcdn.net/v/t51.2885-15/502766082_18044731673628406_899635785563332619_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fmri1-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QEoxs7YmkB5_exJPC4iNslGi6NDJ8nUAweIkQv3ZbLcXw_wTT9A7dCj8UIoK_3vcdQ&_nc_ohc=zBzEsghnPmgQ7kNvwHKeBOK&_nc_gid=kqn9NEfXpeB-UWHlHDz0Nw&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfXnBtBZcj-viewiGMN1B8RozUc0qcyxZlChNHtTwS6JAQ&oe=68A1D392&_nc_sid=10d13b', true, 53, '["dopetechnepal","mechanicalkeyboards","gaming","gamingsetup","gamergirls"]', 4, 23, 0, false);

INSERT INTO products (name, price, original_price, description, category, image_url, in_stock, stock_quantity, features, rating, reviews, discount, hidden_on_home) VALUES 
('9801690693', 999.99, 1199.99, '🎉 🔥KICKSTART 2082 WITH A STEAL 💰
Whether you''re grinding through deadlines or gaming through the night — AJAZZ peripherals have your back 💯
Swipe through to meet the lineup where performance meets your personality
🔸100% Genuine Authorized 
🔸Comes with 1yr warranty 
🔸Budget to Premium ranges
_____
DM us for more information 📩
Call us: 
Delivery all over Nepal 🇳🇵 (Terms and conditions apply)
_____
             
  シ', 'accessory', 'https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/482982517_1180979380439648_1214911350338585467_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QFduAlOb6-3eCGXREon3vjGZONpLxz7dYFWw_NOMv2wRmE1ANE-xdgJa1I6crOLNG8&_nc_ohc=KiXX6eQN8EkQ7kNvwGhHmXL&_nc_gid=xsTsTkIk5fhMpFVWuVMvWA&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfVdEEHDwZ8B2f9KKJD_VeNgkcNVj6HwuaOhSqX6VLfvtQ&oe=68A1E8A5&_nc_sid=10d13b', true, 42, '["dopetechnepal","ajazz","mechanicalkeyboards","gaming","gamingsetup"]', 5, 18, 0, false);

-- Update the updated_at timestamp
UPDATE products SET updated_at = NOW();

-- Show the count of restored products
SELECT COUNT(*) as total_products FROM products;
