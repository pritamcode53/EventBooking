CREATE TABLE IF NOT EXISTS cancelled_bookings (
    cancelled_id SERIAL PRIMARY KEY,
    bookingid INT NOT NULL,
    venueid INT,
    customerid INT,
    bookingdate TIMESTAMP,
    timeduration VARCHAR(50),
    duration_hours INT,
    duration_days INT,
    totalprice DECIMAL(10,2),
    status VARCHAR(50),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ispaid BOOLEAN,
    cancel_reason TEXT,
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
