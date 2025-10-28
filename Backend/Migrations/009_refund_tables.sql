CREATE TABLE IF NOT EXISTS refunds (
    refundid SERIAL PRIMARY KEY,
    bookingid INT NOT NULL,
    cancelledid INT NULL, -- If refund is due to cancellation
    refundamount DECIMAL(10,2) NOT NULL,
    refunddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refundstatus VARCHAR(50) DEFAULT 'Pending',
    refundedby INT NOT NULL, -- VenueOwner/Admin ID
    remarks TEXT,

    -- FOREIGN KEY (bookingid) REFERENCES bookings(bookingid),
    FOREIGN KEY (cancelledid) REFERENCES cancelled_bookings(cancelled_id)
);
