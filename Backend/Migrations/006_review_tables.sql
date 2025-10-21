CREATE TABLE IF NOT EXISTS venue_reviews (
    reviewid SERIAL PRIMARY KEY,
    venueid INT NOT NULL REFERENCES venues(venueid) ON DELETE CASCADE,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    imagepath TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
