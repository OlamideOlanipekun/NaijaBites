-- Gallery Images Table
-- Run this in phpMyAdmin or MySQL to add the gallery_images table

USE naijabites_db;

CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) NOT NULL,
    category ENUM('Cuisine', 'Ambiance', 'Culture') NOT NULL DEFAULT 'Cuisine',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_sort_order (sort_order)
);

-- Insert default gallery images from constants
INSERT IGNORE INTO gallery_images (id, url, caption, category, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'The Grand Dining Room', 'Ambiance', 1),
(2, 'https://images.unsplash.com/photo-1547592166-23ac45744acd', 'Hand-pounded Excellence', 'Cuisine', 2),
(3, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', 'The Art of Plating', 'Cuisine', 3),
(4, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6', 'Our Traditional Chefs', 'Culture', 4),
(5, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'Morning Vibe at Naija Bites', 'Ambiance', 5),
(6, 'https://images.unsplash.com/photo-1603360946369-dc9bb025810f', 'Street Style Suya Grills', 'Culture', 6);
