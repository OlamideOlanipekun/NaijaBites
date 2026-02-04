-- SQL Script to Populate Menu with Rich Nigerian Cuisine
-- Run this in phpMyAdmin or MySQL CLI

USE naijabites_db;

-- Clear existing data to avoid duplicates (Optional)
-- DELETE FROM dishes;
-- DELETE FROM categories;

-- Ensure Categories Exist
INSERT INTO categories (name) VALUES 
('Starters'), 
('Main'), 
('Soups'), 
('Grills'), 
('Drinks')
ON DUPLICATE KEY UPDATE name=name;

-- Starters
INSERT INTO dishes (name, description, price, category_id, image_url, is_chef_special, tags) VALUES
('Peppered Snail', 'Giant African land snails in spicy pepper sauce.', 3500.00, (SELECT id FROM categories WHERE name='Starters' LIMIT 1), 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80', 0, '["Spicy", "Seafood"]'),
('Asun (Spicy Goat Meat)', 'Slow-roasted goat meat sautéed in habanero peppers.', 4500.00, (SELECT id FROM categories WHERE name='Starters' LIMIT 1), 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80', 1, '["Spicy", "Meat", "Popular"]'),
('Puff Puff Platter', 'Sweet deep-fried dough balls served with spicy dip.', 1500.00, (SELECT id FROM categories WHERE name='Starters' LIMIT 1), 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80', 0, '["Snack", "Vegetarian"]'),
('Nkwobi', 'Spicy cow foot delicacy in rich palm oil paste.', 4000.00, (SELECT id FROM categories WHERE name='Starters' LIMIT 1), 'https://i.ibb.co/6y1j6H9/nkwobi.jpg', 0, '["Traditional", "Meat"]');

-- Main Dishes
INSERT INTO dishes (name, description, price, category_id, image_url, is_chef_special, tags) VALUES
('Smoky Jollof Rice', 'Classic Nigerian Jollof Rice with smoke flavor, served with plantain and chicken.', 4500.00, (SELECT id FROM categories WHERE name='Main' LIMIT 1), 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80', 1, '["Classic", "Spicy", "Rice"]'),
('Fried Rice & Turkey', 'Rich Nigerian Fried Rice with veggies, liver, and grilled turkey wings.', 5500.00, (SELECT id FROM categories WHERE name='Main' LIMIT 1), 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80', 0, '["Rice", "Poultry"]'),
('Ofada Rice & Sauce', 'Local brown rice served with spicy Ayamase sauce and assorted meats.', 5000.00, (SELECT id FROM categories WHERE name='Main' LIMIT 1), 'https://i.ibb.co/3s3K3n5/ofada.jpg', 0, '["Spicy", "Traditional"]'),
('Pounded Yam & Egusi', 'Smooth Pounded Yam paired with rich Egusi soup containing stockfish and beef.', 6000.00, (SELECT id FROM categories WHERE name='Main' LIMIT 1), 'https://i.ibb.co/w0z3j4H/egusi.jpg', 1, '["Swallow", "Soup", "Popular"]'),
('Amala & Ewedu', 'Soft Amala (Yam Flour) served with Ewedu, Gbegiri and goat meat.', 5500.00, (SELECT id FROM categories WHERE name='Main' LIMIT 1), 'https://i.ibb.co/9h7K4yL/amala.jpg', 0, '["Traditional", "Swallow"]'),
('Ewa Agoyin', 'Mashed beans with spicy pepper sauce and fried plantain.', 3000.00, (SELECT id FROM categories WHERE name='Main' LIMIT 1), 'https://i.ibb.co/5L9J4x2/ewa-agoyin.jpg', 0, '["Beans", "Spicy"]');

-- Soups
INSERT INTO dishes (name, description, price, category_id, image_url, is_chef_special, tags) VALUES
('Seafood Okra', 'Fresh okra soup loaded with prawns, crabs, and fish.', 7000.00, (SELECT id FROM categories WHERE name='Soups' LIMIT 1), 'https://images.unsplash.com/photo-1551024601-563d65b4f480?auto=format&fit=crop&q=80', 1, '["Seafood", "Healthy"]'),
('Banga Soup', 'Rich palm nut soup served with starch or eba and catfish.', 6500.00, (SELECT id FROM categories WHERE name='Soups' LIMIT 1), 'https://i.ibb.co/bLF8q3P/banga.jpg', 0, '["Traditional", "Fish"]'),
('Edikang Ikong', 'Vegetable soup with pumpkin leaves and waterleaf, rich in assorted meats.', 6000.00, (SELECT id FROM categories WHERE name='Soups' LIMIT 1), 'https://i.ibb.co/7J4yL9K/edikang-ikong.jpg', 0, '["Vegetable", "Healthy"]'),
('Oha Soup', 'Traditional Igbo soup made with Oha leaves and cocoa yam thickener.', 5500.00, (SELECT id FROM categories WHERE name='Soups' LIMIT 1), 'https://i.ibb.co/4P6qJ8R/oha.jpg', 0, '["Traditional"]');

-- Grills
INSERT INTO dishes (name, description, price, category_id, image_url, is_chef_special, tags) VALUES
('Suya Platter', 'Spicy grilled beef skewers with yaji spice, onions, and cabbage.', 3500.00, (SELECT id FROM categories WHERE name='Grills' LIMIT 1), 'https://images.unsplash.com/photo-1529193591184-b1d580690dd0?auto=format&fit=crop&q=80', 1, '["Spicy", "Meat", "Street Food"]'),
('Grilled Catfish', 'Whole grilled catfish marinated in spicy sauce, served with chips.', 8000.00, (SELECT id FROM categories WHERE name='Grills' LIMIT 1), 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2b7b?auto=format&fit=crop&q=80', 0, '["Fish", "Spicy"]'),
('Chicken & Chips', 'Half grilled chicken with crispy fries and ketchup.', 4500.00, (SELECT id FROM categories WHERE name='Grills' LIMIT 1), 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80', 0, '["Poultry", "Fries"]'),
('Beef Kebab', 'Marinated beef cubes grilled with bell peppers and onions.', 3000.00, (SELECT id FROM categories WHERE name='Grills' LIMIT 1), 'https://images.unsplash.com/photo-1532597327428-c4308a4e507d?auto=format&fit=crop&q=80', 0, '["Meat"]');

-- Drinks
INSERT INTO dishes (name, description, price, category_id, image_url, is_chef_special, tags) VALUES
('Chapman', 'Classic Nigerian cocktail with fruity flavors and bitters.', 2500.00, (SELECT id FROM categories WHERE name='Drinks' LIMIT 1), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80', 0, '["Cocktail", "Sweet"]'),
('Zobo Drink', 'Refreshing hibiscus tea with ginger and pineapple.', 1500.00, (SELECT id FROM categories WHERE name='Drinks' LIMIT 1), 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80', 0, '["Healthy", "Natural"]'),
('Palm Wine', 'Freshly tapped palm wine served in a calabash.', 2000.00, (SELECT id FROM categories WHERE name='Drinks' LIMIT 1), 'https://i.ibb.co/8bJ3q5L/palmwine.jpg', 0, '["Traditional", "Alcohol"]'),
('Fresh Juice', 'Blend of seasonal fruits (Watermelon, Pineapple, Orange).', 2000.00, (SELECT id FROM categories WHERE name='Drinks' LIMIT 1), 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80', 0, '["Healthy", "Natural"]');
