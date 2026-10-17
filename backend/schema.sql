DROP TABLE IF EXISTS portfolio;

CREATE TABLE portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample records
INSERT INTO portfolio (owner_name) VALUES 
('Gloria - Portfolio Record 1'),
('Gloria - Portfolio Record 2');