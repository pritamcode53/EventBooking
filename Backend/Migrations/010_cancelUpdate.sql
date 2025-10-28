-- Add new columns to track payment details in cancelled_bookings table
ALTER TABLE cancelled_bookings
ADD COLUMN IF NOT EXISTS paidamount DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE cancelled_bookings
ADD COLUMN IF NOT EXISTS dueamount DECIMAL(10,2) DEFAULT 0.00;
