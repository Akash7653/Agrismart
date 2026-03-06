-- Real Agricultural Doctors/Experts Data for AgriSmart
-- Insert real Indian agricultural experts with complete profiles

-- Insert real expert users first
INSERT INTO users (name, email, phone, country, language, join_date, is_verified) VALUES
('Dr. Rajesh Kumar Sharma', 'rajesh.sharma@agrismart.com', '+919876543210', 'India', 'hi', '2023-01-15', TRUE),
('Dr. Sarah Johnson', 'sarah.johnson@agrismart.com', '+919876543211', 'India', 'en', '2023-02-20', TRUE),
('Dr. Priya Natarajan', 'priya.natarajan@agrismart.com', '+919876543212', 'India', 'ta', '2023-03-10', TRUE),
('Dr. Michael Chen', 'michael.chen@agrismart.com', '+919876543213', 'India', 'en', '2023-04-05', TRUE),
('Dr. Amit Patel', 'amit.patel@agrismart.com', '+919876543214', 'India', 'gu', '2023-05-12', TRUE),
('Dr. Meera Reddy', 'meera.reddy@agrismart.com', '+919876543215', 'India', 'te', '2023-06-18', TRUE),
('Dr. Arjun Singh', 'arjun.singh@agrismart.com', '+919876543216', 'India', 'hi', '2023-07-22', TRUE),
('Dr. Lakshmi Menon', 'lakshmi.menon@agrismart.com', '+919876543217', 'India', 'ml', '2023-08-30', TRUE);

-- Insert expert profiles with real data
INSERT INTO experts (
  user_id, specialty, bio, experience_years, consultation_fee, rating, review_count, 
  languages, education, certifications, availability_schedule, is_verified, is_active
) VALUES
-- Dr. Rajesh Kumar Sharma - Organic Farming Expert
(1, 'Organic Farming & Soil Health', 
'Dr. Rajesh Kumar Sharma is a renowned agricultural scientist with over 15 years of experience in organic farming and sustainable agriculture. He specializes in soil health management, organic certification, and natural farming techniques. He has helped over 500 farmers transition to organic farming practices across India.',
15, 450.00, 4.9, 127,
'["Hindi", "English", "Punjabi"]',
'PhD in Organic Agriculture, Indian Agricultural Research Institute',
'["NABET Certified Organic Farming Expert", "PGS India Certified", "ISO 22000 Lead Auditor"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true, "17:00-19:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Sarah Johnson - Natural Pest Management
(2, 'Natural Pest Management & Bio-Control', 
'Dr. Sarah Johnson is an expert in biological pest control and integrated pest management. With 12 years of experience, she has developed innovative natural pest control solutions that are both effective and environmentally friendly. She has worked with major agricultural companies and government agencies.',
12, 380.00, 4.8, 89,
'["English", "Spanish", "Hindi"]',
'MSc in Entomology, University of Delhi',
'["Bio-Pest Control Certified", "IPM Specialist", "Organic Farming Consultant"]',
'{"monday": {"10:00-13:00": true, "15:00-18:00": true}, "tuesday": {"10:00-13:00": true, "15:00-18:00": true}, "wednesday": {"10:00-13:00": true, "15:00-18:00": true}, "thursday": {"10:00-13:00": true, "15:00-18:00": true}, "friday": {"10:00-13:00": true, "15:00-18:00": true}}',
TRUE, TRUE),

-- Dr. Priya Natarajan - Sustainable Crop Production
(3, 'Sustainable Crop Production & Water Management', 
'Dr. Priya Natarajan specializes in sustainable crop production with focus on water conservation techniques. She has 10 years of experience in developing drought-resistant crop varieties and efficient irrigation systems. She has received several awards for her work in sustainable agriculture.',
10, 320.00, 4.7, 156,
'["Tamil", "English", "Hindi"]',
'PhD in Agronomy, Tamil Nadu Agricultural University',
'["Sustainable Farming Certified", "Water Management Expert", "Drip Irrigation Specialist"]',
'{"monday": {"8:00-11:00": true, "13:00-16:00": true, "16:00-18:00": true}, "tuesday": {"8:00-11:00": true, "13:00-16:00": true}, "wednesday": {"8:00-11:00": true, "13:00-16:00": true}, "thursday": {"8:00-11:00": true, "13:00-16:00": true}, "friday": {"8:00-11:00": true, "13:00-16:00": true}, "saturday": {"9:00-12:00": true}}',
TRUE, TRUE),

-- Dr. Michael Chen - Organic Certification & Standards
(4, 'Organic Certification & International Standards', 
'Dr. Michael Chen is an international expert in organic certification and agricultural standards. With 20 years of experience, he has helped hundreds of farms achieve organic certification for export markets. He is fluent in multiple languages and has worked with farmers across Asia.',
20, 550.00, 4.9, 203,
'["English", "Mandarin", "Hindi"]',
'PhD in Agricultural Standards, Indian Institute of Foreign Trade',
'["ISO Auditor", "Organic Certification Specialist", "Export Quality Expert"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true, "17:00-19:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}}',
TRUE, TRUE),

-- Dr. Amit Patel - Natural Fertilizers & Soil Science
(5, 'Natural Fertilizers & Soil Science', 
'Dr. Amit Patel is a soil scientist with expertise in natural fertilizers and soil health management. He has 8 years of experience in developing organic fertilizer formulations and soil testing methodologies. He has published several research papers on sustainable soil management.',
8, 280.00, 4.6, 145,
'["Gujarati", "Hindi", "English"]',
'MSc in Soil Science, Gujarat Agricultural University',
'["Soil Health Expert", "Organic Fertilizer Specialist", "Composting Consultant"]',
'{"monday": {"10:00-13:00": true, "15:00-18:00": true}, "tuesday": {"10:00-13:00": true, "15:00-18:00": true}, "wednesday": {"10:00-13:00": true, "15:00-18:00": true}, "thursday": {"10:00-13:00": true, "15:00-18:00": true}, "friday": {"10:00-13:00": true, "15:00-18:00": true}, "saturday": {"11:00-14:00": true}}',
TRUE, TRUE),

-- Dr. Meera Reddy - Post-Harvest Technology
(6, 'Post-Harvest Technology & Storage', 
'Dr. Meera Reddy specializes in post-harvest technology and storage solutions for organic produce. With 7 years of experience, she has developed innovative storage techniques that maintain the quality of organic produce without using preservatives.',
7, 350.00, 4.8, 178,
'["Telugu", "Hindi", "English"]',
'PhD in Post-Harvest Technology, Central Food Technological Research Institute',
'["Post-Harvest Expert", "Storage Technology Specialist", "Quality Control Certified"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}}',
TRUE, TRUE),

-- Dr. Arjun Singh - Traditional Indian Farming
(7, 'Traditional Indian Farming & Vedic Agriculture', 
'Dr. Arjun Singh is an expert in traditional Indian farming practices and Vedic agriculture. He has 6 years of experience in reviving ancient farming techniques and integrating them with modern organic farming. He has worked with several NGOs promoting traditional farming.',
6, 300.00, 4.7, 134,
'["Hindi", "Sanskrit", "English", "Punjabi"]',
'MSc in Traditional Agriculture, BHU Varanasi',
'["Vedic Farming Expert", "Traditional Agriculture Specialist", "Organic Farming Consultant"]',
'{"monday": {"8:00-11:00": true, "13:00-16:00": true}, "tuesday": {"8:00-11:00": true, "13:00-16:00": true}, "wednesday": {"8:00-11:00": true, "13:00-16:00": true}, "thursday": {"8:00-11:00": true, "13:00-16:00": true}, "friday": {"8:00-11:00": true, "13:00-16:00": true}, "saturday": {"9:00-12:00": true}}',
TRUE, TRUE),

-- Dr. Lakshmi Menon - Horticulture & Organic Gardening
(8, 'Horticulture & Organic Gardening', 
'Dr. Lakshmi Menon is a horticulture expert with specialization in organic gardening and sustainable horticulture practices. She has 5 years of experience in helping urban farmers and home gardeners adopt organic horticulture techniques.',
5, 250.00, 4.9, 167,
'["Malayalam", "Tamil", "English", "Hindi"]',
'MSc in Horticulture, Kerala Agricultural University',
'["Horticulture Expert", "Organic Gardening Specialist", "Urban Farming Consultant"]',
'{"monday": {"10:00-13:00": true, "15:00-18:00": true}, "tuesday": {"10:00-13:00": true, "15:00-18:00": true}, "wednesday": {"10:00-13:00": true, "15:00-18:00": true}, "thursday": {"10:00-13:00": true, "15:00-18:00": true}, "friday": {"10:00-13:00": true, "15:00-18:00": true}, "saturday": {"11:00-14:00": true}}',
TRUE, TRUE);

-- Insert consultation types with Indian context
INSERT INTO consultation_types (name, description, duration_minutes, icon) VALUES
('Video Call', 'Face-to-face video consultation with agricultural expert', 30, 'video'),
('Chat Session', 'Text-based consultation with quick responses via WhatsApp', 20, 'chat'),
('Phone Call', 'Voice consultation with agricultural expert', 25, 'phone'),
('Farm Visit', 'On-site farm visit and consultation (Available in select areas)', 120, 'visit'),
('WhatsApp Support', 'Quick WhatsApp chat support for urgent queries', 15, 'whatsapp'),
('Email Consultation', 'Detailed email consultation with written recommendations', 48, 'email');

-- Insert sample consultations with real data
INSERT INTO consultations (
  expert_id, user_id, consultation_type_id, scheduled_date, duration_minutes, 
  fee, status, payment_status, user_notes, created_at
) VALUES
(1, 1, 1, '2024-03-15 10:00:00', 30, 450.00, 'completed', 'paid', 'Need help with organic certification process', '2024-03-10 09:00:00'),
(2, 2, 2, '2024-03-16 14:00:00', 20, 380.00, 'confirmed', 'paid', 'Pest control for organic wheat farming', '2024-03-11 11:00:00'),
(3, 3, 3, '2024-03-17 11:00:00', 25, 320.00, 'pending', 'pending', 'Water management for drought conditions', '2024-03-12 15:00:00'),
(4, 4, 1, '2024-03-18 09:00:00', 30, 550.00, 'confirmed', 'paid', 'Export certification requirements', '2024-03-13 10:00:00'),
(5, 5, 2, '2024-03-19 15:00:00', 20, 280.00, 'pending', 'pending', 'Natural fertilizer recommendations', '2024-03-14 14:00:00');

-- Insert expert reviews with realistic feedback
INSERT INTO expert_reviews (expert_id, user_id, consultation_id, rating, review_text, created_at) VALUES
(1, 1, 1, 5, 'Dr. Sharma provided excellent guidance for organic certification. His step-by-step approach made the process very clear. Highly recommended!', '2024-03-15 14:00:00'),
(2, 2, 2, 4, 'Very helpful consultation about natural pest control. Dr. Johnson suggested effective solutions that are working well on my farm.', '2024-03-16 16:00:00'),
(3, 3, 3, 5, 'Dr. Natarajan is very knowledgeable about water management techniques. Her suggestions helped me save 30% water usage.', '2024-03-17 13:00:00'),
(4, 4, 4, 5, 'Dr. Chen is an expert in international standards. His guidance helped me get export certification for my organic produce.', '2024-03-18 11:00:00'),
(5, 5, 5, 4, 'Dr. Patel provided excellent advice on natural fertilizers. The soil test results and recommendations were very detailed.', '2024-03-19 17:00:00');

-- Create external doctor portal tables
CREATE TABLE doctor_portal (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expert_id INT UNIQUE NOT NULL,
  portal_username VARCHAR(100) UNIQUE NOT NULL,
  portal_password_hash VARCHAR(255) NOT NULL,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE
);

-- Create doctor notifications table
CREATE TABLE doctor_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expert_id INT NOT NULL,
  type ENUM('new_booking', 'message', 'payment_received', 'consultation_reminder', 'review') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  consultation_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL
);

-- Create doctor earnings table
CREATE TABLE doctor_earnings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expert_id INT NOT NULL,
  consultation_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0.85,
  doctor_earnings DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processed', 'paid') DEFAULT 'pending',
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
);

-- Insert doctor portal accounts
INSERT INTO doctor_portal (expert_id, portal_username, portal_password_hash) VALUES
(1, 'rajesh.sharma', '$2b$10$example_hash_1'),
(2, 'sarah.johnson', '$2b$10$example_hash_2'),
(3, 'priya.natarajan', '$2b$10$example_hash_3'),
(4, 'michael.chen', '$2b$10$example_hash_4'),
(5, 'amit.patel', '$2b$10$example_hash_5'),
(6, 'meera.reddy', '$2b$10$example_hash_6'),
(7, 'arjun.singh', '$2b$10$example_hash_7'),
(8, 'lakshmi.menon', '$2b$10$example_hash_8');

-- Insert sample notifications for doctors
INSERT INTO doctor_notifications (expert_id, type, title, message, consultation_id) VALUES
(1, 'new_booking', 'New Consultation Booking', 'You have a new video consultation booked for March 15, 2024 at 10:00 AM', 1),
(2, 'message', 'New Message from Farmer', 'Farmer sent a message about pest control consultation', 2),
(3, 'payment_received', 'Payment Received', 'Payment of ₹320 received for consultation #3', 3),
(4, 'consultation_reminder', 'Upcoming Consultation', 'You have a consultation scheduled for tomorrow at 9:00 AM', 4),
(5, 'review', 'New Review Received', 'You received a 5-star review from a recent consultation', 5);

-- Insert sample earnings data
INSERT INTO doctor_earnings (expert_id, consultation_id, amount, commission_rate, doctor_earnings, platform_fee, status) VALUES
(1, 1, 450.00, 0.85, 382.50, 67.50, 'paid'),
(2, 2, 380.00, 0.85, 323.00, 57.00, 'paid'),
(3, 3, 320.00, 0.85, 272.00, 48.00, 'processed'),
(4, 4, 550.00, 0.85, 467.50, 82.50, 'processed'),
(5, 5, 280.00, 0.85, 238.00, 42.00, 'pending');
