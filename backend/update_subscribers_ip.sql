-- Add ip_address column to subscribers table
ALTER TABLE subscribers ADD COLUMN ip_address VARCHAR(45) NULL AFTER email;
