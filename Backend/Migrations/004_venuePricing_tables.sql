CREATE TABLE IF NOT EXISTS venue_pricings (
    venuepricingid SERIAL PRIMARY KEY,
    venueid INT NOT NULL REFERENCES venues(venueid) ON DELETE CASCADE,
    type INT NOT NULL,  -- Should match PricingType enum: PerHour, PerDay, PerEvent
    price NUMERIC(12, 2) NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
