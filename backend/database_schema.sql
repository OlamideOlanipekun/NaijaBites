-- NaijaBites Database Schema
-- Run this SQL script in your MySQL/phpMyAdmin to set up the database

CREATE DATABASE IF NOT EXISTS naijabites_db;
USE naijabites_db;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dishes Table
CREATE TABLE IF NOT EXISTS dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(500),
    is_chef_special BOOLEAN DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_chef_special (is_chef_special)
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests_count INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_status (status)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    customer_email VARCHAR(255),
    items_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reference (reference),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read)
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Categories (if not exists)
INSERT IGNORE INTO categories (id, name) VALUES 
    (1, 'Starters'),
    (2, 'Main'),
    (3, 'Soups'),
    (4, 'Grills'),
    (5, 'Drinks');

-- Insert Sample Menu Items (if not exists)
INSERT IGNORE INTO dishes (id, name, price, category_id, description, image_url, is_chef_special, tags) VALUES 
(1, 'Party Jollof Rice', 3500, 2, 
    'The legendary smoky long-grain rice, cooked in a rich reduction of tomatoes, peppers, and secret spices. Served with fried plantain.',
    'https://images.unsplash.com/photo-1628102476629-f80511d273d2?auto=format&fit=crop&q=80&w=800',
    1, '["Chef Special", "Spicy"]'),
(2, 'Pounded Yam & Egusi', 4500, 3,
    'Silky smooth pounded yam paired with rich melon seed soup, fortified with spinach, stockfish, and assorted meats.',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    1, '["Chef Special"]'),
(3, 'Beef Suya Platter', 2800, 4,
    'Thinly sliced beef marinated in Yaji spice (kuli-kuli base), grilled over open flames. Served with onions and tomatoes.',
    'https://images.unsplash.com/photo-1603360946369-dc9bb025810f?auto=format&fit=crop&q=80&w=800',
    0, '["Spicy"]'),
(4, 'Pepper Soup (Catfish)', 3200, 3,
    'Hot and soothing broth infused with aromatic African spices, herbs, and fresh catfish. A Lagos evening favorite.',
    'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800',
    0, '["Spicy", "Gluten-Free"]'),
(5, 'Zobo House Special', 1200, 5,
    'Chilled hibiscus flower extract infused with ginger, cloves, and a hint of pineapple. Natural and refreshing.',
    'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=800',
    0, '["Vegan", "Gluten-Free"]'),
(6, 'Ewa Agoyin & Bread', 2500, 2,
    'Mashed beans served with a notoriously spicy palm oil sauce and soft Agege bread. The ultimate comfort food.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    0, '["Spicy", "Vegan"]');

-- Insert Default Admin User
-- Username: admin
-- Password: naijabites2024
-- Note: This hash is generated from password_hash('naijabites2024', PASSWORD_DEFAULT)
-- IMPORTANT: Change this password after first login!
-- Run backend/utils/create_admin.php to properly set up the admin user
INSERT IGNORE INTO admin_users (id, username, password_hash, role) VALUES 
    (1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- To update admin password manually, you can use:
-- UPDATE admin_users SET password_hash = '[generated_hash]' WHERE username = 'admin';
-- Generate hash using PHP: password_hash('your_password', PASSWORD_DEFAULT);
