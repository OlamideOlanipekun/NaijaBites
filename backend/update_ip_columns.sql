-- Add ip_address to contact_messages and testimonials
ALTER TABLE contact_messages ADD COLUMN ip_address VARCHAR(45) NULL AFTER message;
ALTER TABLE testimonials ADD COLUMN ip_address VARCHAR(45) NULL AFTER content;
