CREATE TABLE IF NOT EXISTS bookings (
    bookingid SERIAL PRIMARY KEY,
    venueid INT NOT NULL REFERENCES venues(venueid) ON DELETE CASCADE,
    customerid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    bookingdate TIMESTAMP NOT NULL,
    timeduration INT NOT NULL,  -- corresponds to PricingType enum (PerHour=0, PerDay=1, PerEvent=2)
    totalprice NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- corresponds to BookingStatus enum (Pending=0, Approved=1, Cancelled=2, etc.)
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    duration_hours INT ,
    duration_days INT,
    ispaid Boolean
);
