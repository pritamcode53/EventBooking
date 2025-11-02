ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS bookingcode VARCHAR(50);


ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS paidamount NUMERIC(10,2) DEFAULT 0.00;

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS dueamount NUMERIC(10,2) GENERATED ALWAYS AS (totalprice - paidamount) STORED;


ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS paymentstatus VARCHAR(10)
    DEFAULT 'Unpaid'
    CHECK (paymentstatus IN ('Unpaid', 'Partial', 'Paid'));

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS customnewprice NUMERIC(10,2);


ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS isuserapproved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ownerreview TEXT;


ALTER TABLE custom_booking_requests
ADD COLUMN IF NOT EXISTS booking_id INT REFERENCES bookings(bookingid);