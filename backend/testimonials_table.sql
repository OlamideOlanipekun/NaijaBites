-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);

-- Insert Sample Testimonials
INSERT INTO testimonials (name, role, content, rating, avatar_url) VALUES 
('Chioma Adeleke', 'Food Blogger', 'The Jollof rice here takes me straight back to my grandmother''s kitchen in Lagos. Absolutely authentic and smoky!', 5, 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200'),
('David Okonkwo', 'Chef', 'I''ve tasted Egusi soup in top restaurants across London, but NaijaBites stands alone. The texture is perfect.', 5, 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=200'),
('Sarah Johnson', 'Tourist', 'My first time trying Nigerian food and I am hooked! The Suya was spicy but incredibly flavorful. Highly recommend.', 5, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');
