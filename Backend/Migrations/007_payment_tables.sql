CREATE TABLE IF NOT EXISTS payments (
    paymentid SERIAL PRIMARY KEY,
    bookingid INT NOT NULL REFERENCES bookings(bookingid) ON DELETE CASCADE,
    venueid INT NOT NULL REFERENCES venues(venueid) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    paymentmethod VARCHAR(50),  -- e.g., "Credit Card", "UPI", "Cash"
    status VARCHAR(50) NOT NULL, -- "Pending", "Success", "Failed"
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
