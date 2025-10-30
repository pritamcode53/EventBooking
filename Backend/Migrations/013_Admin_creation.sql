INSERT INTO users (name, email, passwordhash, role)
SELECT 'Admin', 'admin@gmail.com',
       'admin', 
       'Admin'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE role = 'Admin'
);