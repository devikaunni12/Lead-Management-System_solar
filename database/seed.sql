-- This file inserts 5 sample leads so we can test the app immediately
INSERT INTO leads (full_name, phone, email, location, property_type, system_size_kw, source, status) VALUES
('Rajesh Kumar',   '9876543210', 'rajesh@example.com',  'Kochi',              'Residential', 5,  'Website',      'New Lead'),
('Priya Menon',    '8765432109', 'priya@example.com',   'Thrissur',           'Commercial',  20, 'Referral',     'Site Visit Scheduled'),
('Arun Nair',      '7654321098', 'arun@example.com',    'Thiruvananthapuram', 'Industrial',  50, 'Walk-in',      'Proposal Sent'),
('Sunitha Das',    '6543210987', 'sunitha@example.com', 'Kozhikode',          'Residential', 8,  'Social Media', 'Won'),
('Mohammed Riyas', '9123456780', 'riyas@example.com',   'Palakkad',           'Commercial',  15, 'Website',      'Lost');
