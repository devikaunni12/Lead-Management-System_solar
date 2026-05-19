-- This file creates all the tables needed for our lead management system

-- This table stores the allowed status values for a lead
CREATE TABLE IF NOT EXISTS status_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- unique ID for each status
  label TEXT NOT NULL UNIQUE             -- status name like "New Lead", "Won" etc
);

-- Insert all 6 allowed pipeline stages
INSERT OR IGNORE INTO status_options (id, label) VALUES
  (1, 'New Lead'),
  (2, 'Contacted'),
  (3, 'Site Visit Scheduled'),
  (4, 'Proposal Sent'),
  (5, 'Won'),
  (6, 'Lost');

-- This is the main table that stores all customer lead information
CREATE TABLE IF NOT EXISTS leads (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name        TEXT NOT NULL,
  phone            CHAR(10) NOT NULL,
  email            TEXT NOT NULL,
  location         TEXT NOT NULL,
  property_type    TEXT NOT NULL CHECK(property_type IN ('Residential','Commercial','Industrial')),
  system_size_kw   REAL NOT NULL CHECK(system_size_kw >= 1 AND system_size_kw <= 100),
  source           TEXT NOT NULL CHECK(source IN ('Website','Referral','Walk-in','Social Media')),
  status           TEXT NOT NULL DEFAULT 'New Lead',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (status) REFERENCES status_options(label)
);

-- Indexes make searching/filtering faster on these columns
CREATE INDEX IF NOT EXISTS idx_status     ON leads(status);
CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_location   ON leads(location);
