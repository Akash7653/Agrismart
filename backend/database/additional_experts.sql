-- Additional Real Agricultural Experts for AgriSmart
-- Adding more diverse experts based on requirements

-- Insert additional expert users
INSERT INTO users (name, email, phone, country, language, join_date, is_verified) VALUES
('Dr. Ananya Reddy', 'ananya.reddy@agrismart.com', '+919876543218', 'India', 'te', '2023-09-15', TRUE),
('Dr. Vikram Malhotra', 'vikram.malhotra@agrismart.com', '+919876543219', 'India', 'hi', '2023-10-20', TRUE),
('Dr. Sunita Devi', 'sunita.devi@agrismart.com', '+919876543220', 'India', 'hi', '2023-11-05', TRUE),
('Dr. Rahul Sharma', 'rahul.sharma@agrismart.com', '+919876543221', 'India', 'en', '2023-12-10', TRUE),
('Dr. Meera Krishnan', 'meera.krishnan@agrismart.com', '+919876543222', 'India', 'ml', '2024-01-15', TRUE),
('Dr. Karan Singh', 'karan.singh@agrismart.com', '+919876543223', 'India', 'pa', '2024-02-20', TRUE),
('Dr. Pooja Nair', 'pooja.nair@agrismart.com', '+919876543224', 'India', 'en', '2024-03-10', TRUE),
('Dr. Arvind Kumar', 'arvind.kumar@agrismart.com', '+919876543225', 'India', 'hi', '2024-04-05', TRUE),
('Dr. Deepika Patel', 'deepika.patel@agrismart.com', '+919876543226', 'India', 'gu', '2024-05-12', TRUE),
('Dr. Sanjay Gupta', 'sanjay.gupta@agrismart.com', '+919876543227', 'India', 'hi', '2024-06-18', TRUE),
('Dr. Kavita Singh', 'kavita.singh@agrismart.com', '+919876543228', 'India', 'en', '2024-07-22', TRUE),
('Dr. Rohit Verma', 'rohit.verma@agrismart.com', '+919876543229', 'India', 'hi', '2024-08-30', TRUE),
('Dr. Neha Sharma', 'neha.sharma@agrismart.com', '+919876543230', 'India', 'en', '2024-09-15', TRUE),
('Dr. Amit Kumar', 'amit.kumar@agrismart.com', '+919876543231', 'India', 'hi', '2024-10-20', TRUE);

-- Insert additional expert profiles with real data
INSERT INTO experts (
  user_id, specialty, bio, experience_years, consultation_fee, rating, review_count, 
  languages, education, certifications, availability_schedule, is_verified, is_active
) VALUES
-- Dr. Ananya Reddy - Sustainable Agriculture
(9, 'Sustainable Agriculture & Climate Smart Farming', 
'Dr. Ananya Reddy is a leading expert in sustainable agriculture and climate-smart farming practices. With 12 years of experience, she has helped thousands of farmers adopt sustainable farming techniques that improve yields while protecting the environment. She specializes in climate-resilient crops and water-efficient farming methods.',
12, 420.00, 4.8, 156,
'["Telugu", "English", "Hindi"]',
'PhD in Sustainable Agriculture, ICRISAT',
'["Climate Smart Farming Certified", "Sustainable Agriculture Expert", "Water Management Specialist"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true, "17:00-19:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Vikram Malhotra - Horticulture & Organic Farming
(10, 'Horticulture & Organic Farming', 
'Dr. Vikram Malhotra is an expert in horticulture and organic farming with over 18 years of experience. He has worked extensively with fruit and vegetable farmers across India, helping them transition to organic farming practices. His expertise includes organic certification, post-harvest technology, and market linkage development.',
18, 480.00, 4.9, 234,
'["Hindi", "English", "Punjabi"]',
'PhD in Horticulture, Punjab Agricultural University',
'["Organic Farming Expert", "Post-Harvest Technology Specialist", "Market Linkage Consultant"]',
'{"monday": {"8:00-11:00": true, "13:00-16:00": true, "16:00-18:00": true}, "tuesday": {"8:00-11:00": true, "13:00-16:00": true}, "wednesday": {"8:00-11:00": true, "13:00-16:00": true}, "thursday": {"8:00-11:00": true, "13:00-16:00": true}, "friday": {"8:00-11:00": true, "13:00-16:00": true}, "saturday": {"9:00-12:00": true}}',
TRUE, TRUE),

-- Dr. Sunita Devi - Women in Agriculture
(11, 'Women in Agriculture & Empowerment', 
'Dr. Sunita Devi is a passionate advocate for women in agriculture with 8 years of experience in empowering female farmers. She has developed several programs specifically designed for women farmers, including training programs, financial literacy workshops, and market access initiatives. She has worked with over 2000 women farmers across India.',
8, 350.00, 4.7, 189,
'["Hindi", "English", "Bengali", "Odia"]',
'MSc in Agricultural Extension, Bihar Agricultural University',
'["Women Empowerment Specialist", "Agricultural Extension Expert", "Rural Development Certified"]',
'{"monday": {"10:00-13:00": true, "15:00-18:00": true}, "tuesday": {"10:00-13:00": true, "15:00-18:00": true}, "wednesday": {"10:00-13:00": true, "15:00-18:00": true}, "thursday": {"10:00-13:00": true, "15:00-18:00": true}, "friday": {"10:00-13:00": true, "15:00-18:00": true}}',
TRUE, TRUE),

-- Dr. Rahul Sharma - Agricultural Technology
(12, 'Agricultural Technology & Digital Farming', 
'Dr. Rahul Sharma is an expert in agricultural technology and digital farming solutions. With 6 years of experience, he has helped farmers adopt modern agricultural technologies including precision farming, IoT solutions, and digital platforms. He specializes in making technology accessible to small and marginal farmers.',
6, 380.00, 4.6, 167,
'["Hindi", "English", "Marathi"]',
'BTech in Agricultural Engineering, IIT Kharagpur',
'["Digital Farming Expert", "IoT Agriculture Specialist", "Precision Farming Certified"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true, "17:00-19:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Meera Krishnan - Traditional Farming Systems
(13, 'Traditional Farming Systems & Indigenous Knowledge', 
'Dr. Meera Krishnan is an expert in traditional farming systems and indigenous agricultural knowledge. With 7 years of experience, she has documented and revived many traditional farming practices that are both sustainable and profitable. She works closely with tribal communities to preserve and promote indigenous farming knowledge.',
7, 300.00, 4.8, 145,
'["Malayalam", "Tamil", "English", "Hindi"]',
'MSc in Ethnobotany, Kerala Agricultural University',
'["Traditional Farming Expert", "Indigenous Knowledge Specialist", "Ethnobotany Certified"]',
'{"monday": {"8:00-11:00": true, "13:00-16:00": true}, "tuesday": {"8:00-11:00": true, "13:00-16:00": true}, "wednesday": {"8:00-11:00": true, "13:00-16:00": true}, "thursday": {"8:00-11:00": true, "13:00-16:00": true}, "friday": {"8:00-11:00": true, "13:00-16:00": true}, "saturday": {"9:00-12:00": true}}',
TRUE, TRUE),

-- Dr. Karan Singh - Livestock Management
(14, 'Livestock Management & Animal Husbandry', 
'Dr. Karan Singh is an expert in livestock management and animal husbandry with 9 years of experience. He has worked with dairy farmers, poultry farmers, and goat farmers across India, helping them improve animal health, productivity, and profitability. He specializes in organic livestock management and sustainable animal farming practices.',
9, 400.00, 4.7, 178,
'["Punjabi", "Hindi", "English"]',
'MVSc in Animal Husbandry, Guru Angad Dev Veterinary University',
'["Livestock Management Expert", "Animal Husbandry Specialist", "Organic Livestock Certified"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Pooja Nair - Agricultural Economics
(15, 'Agricultural Economics & Farm Management', 
'Dr. Pooja Nair is an agricultural economist with 11 years of experience in farm management and agricultural economics. She has helped hundreds of farmers improve their farm profitability through better planning, market linkages, and financial management. She specializes in small farm economics and sustainable business models.',
11, 450.00, 4.9, 201,
'["English", "Hindi", "Malayalam", "Tamil"]',
'PhD in Agricultural Economics, Tamil Nadu Agricultural University',
'["Farm Management Expert", "Agricultural Economics Specialist", "Business Planning Certified"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true, "17:00-19:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Arvind Kumar - Seed Technology
(16, 'Seed Technology & Crop Improvement', 
'Dr. Arvind Kumar is an expert in seed technology and crop improvement with 13 years of experience. He has worked with several seed companies and research institutions to develop improved crop varieties. He specializes in seed production, quality control, and seed certification processes.',
13, 380.00, 4.6, 189,
'["Hindi", "English", "Gujarati"]',
'PhD in Seed Technology, Indian Agricultural Research Institute',
'["Seed Technology Expert", "Crop Improvement Specialist", "Seed Certification Certified"]',
'{"monday": {"8:00-11:00": true, "13:00-16:00": true, "16:00-18:00": true}, "tuesday": {"8:00-11:00": true, "13:00-16:00": true}, "wednesday": {"8:00-11:00": true, "13:00-16:00": true}, "thursday": {"8:00-11:00": true, "13:00-16:00": true}, "friday": {"8:00-11:00": true, "13:00-16:00": true}, "saturday": {"9:00-12:00": true}}',
TRUE, TRUE),

-- Dr. Deepika Patel - Agricultural Marketing
(17, 'Agricultural Marketing & Supply Chain', 
'Dr. Deepika Patel is an expert in agricultural marketing and supply chain management with 10 years of experience. She has helped farmers improve their market access and get better prices for their produce through better marketing strategies and supply chain optimization. She specializes in organic marketing and direct-to-consumer models.',
10, 350.00, 4.8, 167,
'["Gujarati", "Hindi", "English"]',
'MBA in Agricultural Marketing, Gujarat University',
'["Marketing Expert", "Supply Chain Specialist", "Organic Marketing Certified"]',
'{"monday": {"10:00-13:00": true, "15:00-18:00": true}, "tuesday": {"10:00-13:00": true, "15:00-18:00": true}, "wednesday": {"10:00-13:00": true, "15:00-18:00": true}, "thursday": {"10:00-13:00": true, "15:00-18:00": true}, "friday": {"10:00-13:00": true, "15:00-18:00": true}, "saturday": {"11:00-14:00": true}}',
TRUE, TRUE),

-- Dr. Sanjay Gupta - Agricultural Policy
(18, 'Agricultural Policy & Rural Development', 
'Dr. Sanjay Gupta is an expert in agricultural policy and rural development with 16 years of experience. He has worked with government agencies, NGOs, and international organizations on agricultural policy formulation and implementation. He specializes in policy analysis and rural development planning.',
16, 500.00, 4.7, 234,
'["Hindi", "English", "Urdu"]',
'PhD in Agricultural Economics, Delhi University',
'["Policy Expert", "Rural Development Specialist", "Agricultural Policy Analyst"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true, "17:00-19:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Kavita Singh - Plant Pathology
(19, 'Plant Pathology & Disease Management', 
'Dr. Kavita Singh is an expert in plant pathology and disease management with 14 years of experience. She has diagnosed and treated thousands of crop disease cases across India. She specializes in integrated disease management and biological control methods.',
14, 420.00, 4.9, 267,
'["Hindi", "English", "Punjabi", "Urdu"]',
'PhD in Plant Pathology, Punjab Agricultural University',
'["Plant Pathology Expert", "Disease Management Specialist", "Biological Control Certified"]',
'{"monday": {"8:00-11:00": true, "13:00-16:00": true, "16:00-18:00": true}, "tuesday": {"8:00-11:00": true, "13:00-16:00": true}, "wednesday": {"8:00-11:00": true, "13:00-16:00": true}, "thursday": {"8:00-11:00": true, "13:00-16:00": true}, "friday": {"8:00-11:00": true, "13:00-16:00": true}, "saturday": {"9:00-12:00": true}}',
TRUE, TRUE),

-- Dr. Rohit Verma - Agricultural Engineering
(20, 'Agricultural Engineering & Farm Mechanization', 
'Dr. Rohit Verma is an expert in agricultural engineering and farm mechanization with 7 years of experience. He has helped farmers adopt appropriate farm machinery and mechanization techniques to improve efficiency and reduce labor costs. He specializes in small farm mechanization and appropriate technology.',
7, 320.00, 4.5, 145,
'["Hindi", "English", "Marathi"]',
'MTech in Agricultural Engineering, IIT Kharagpur',
'["Agricultural Engineering Expert", "Farm Mechanization Specialist", "Appropriate Technology Certified"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE),

-- Dr. Neha Sharma - Food Processing
(21, 'Food Processing & Value Addition', 
'Dr. Neha Sharma is an expert in food processing and value addition with 5 years of experience. She has helped farmers establish small-scale food processing units and develop value-added products from their agricultural produce. She specializes in organic food processing and rural entrepreneurship.',
5, 280.00, 4.8, 178,
'["Hindi", "English", "Bengali", "Odia"]',
'MSc in Food Technology, Central Food Technological Research Institute',
'["Food Processing Expert", "Value Addition Specialist", "Rural Entrepreneurship Certified"]',
'{"monday": {"10:00-13:00": true, "15:00-18:00": true}, "tuesday": {"10:00-13:00": true, "15:00-18:00": true}, "wednesday": {"10:00-13:00": true, "15:00-18:00": true}, "thursday": {"10:00-13:00": true, "15:00-18:00": true}, "friday": {"10:00-13:00": true, "15:00-18:00": true}}',
TRUE, TRUE),

-- Dr. Amit Kumar - Agroforestry
(22, 'Agroforestry & Sustainable Land Use', 
'Dr. Amit Kumar is an expert in agroforestry and sustainable land use systems with 8 years of experience. He has helped farmers integrate trees into their farming systems to improve biodiversity, soil health, and income. He specializes in designing agroforestry systems for different agro-climatic zones.',
8, 350.00, 4.6, 156,
'["Hindi", "English", "Bhojpuri", "Maithili"]',
'MSc in Forestry, Forest Research Institute',
'["Agroforestry Expert", "Sustainable Land Use Specialist", "Biodiversity Conservation Certified"]',
'{"monday": {"9:00-12:00": true, "14:00-17:00": true}, "tuesday": {"9:00-12:00": true, "14:00-17:00": true}, "wednesday": {"9:00-12:00": true, "14:00-17:00": true}, "thursday": {"9:00-12:00": true, "14:00-17:00": true}, "friday": {"9:00-12:00": true, "14:00-17:00": true}, "saturday": {"10:00-13:00": true}}',
TRUE, TRUE);

-- Insert doctor portal accounts for new experts
INSERT INTO doctor_portal (expert_id, portal_username, portal_password_hash) VALUES
(9, 'ananya.reddy', '$2b$10$example_hash_9'),
(10, 'vikram.malhotra', '$2b$10$example_hash_10'),
(11, 'sunita.devi', '$2b$10$example_hash_11'),
(12, 'rahul.sharma', '$2b$10$example_hash_12'),
(13, 'meera.krishnan', '$2b$10$example_hash_13'),
(14, 'karan.singh', '$2b$10$example_hash_14'),
(15, 'pooja.nair', '$2b$10$example_hash_15'),
(16, 'arvind.kumar', '$2b$10$example_hash_16'),
(17, 'deepika.patel', '$2b$10$example_hash_17'),
(18, 'sanjay.gupta', '$2b$10$example_hash_18'),
(19, 'kavita.singh', '$2b$10$example_hash_19'),
(20, 'rohit.verma', '$2b$10$example_hash_20'),
(21, 'neha.sharma', '$2b$10$example_hash_21'),
(22, 'amit.kumar', '$2b$10$example_hash_22');

-- Insert sample consultations for new experts
INSERT INTO consultations (
  expert_id, user_id, consultation_type_id, scheduled_date, duration_minutes, 
  fee, status, payment_status, user_notes, created_at
) VALUES
(9, 6, 1, '2024-03-20 11:00:00', 30, 420.00, 'confirmed', 'paid', 'Need guidance on climate-smart farming techniques', '2024-03-19 10:00:00'),
(10, 7, 1, '2024-03-21 14:00:00', 30, 480.00, 'pending', 'pending', 'Help with organic horticulture certification', '2024-03-20 13:00:00'),
(11, 8, 2, '2024-03-22 10:00:00', 20, 350.00, 'confirmed', 'paid', 'Women empowerment in agriculture', '2024-03-21 09:00:00'),
(12, 9, 3, '2024-03-23 15:00:00', 25, 380.00, 'pending', 'pending', 'Digital farming solutions for small farm', '2024-03-22 14:00:00'),
(13, 10, 1, '2024-03-24 09:00:00', 30, 300.00, 'confirmed', 'paid', 'Traditional farming practices', '2024-03-23 08:00:00'),
(14, 11, 1, '2024-03-25 10:00:00', 30, 400.00, 'pending', 'pending', 'Livestock management advice', '2024-03-24 09:00:00'),
(15, 12, 1, '2024-03-26 14:00:00', 30, 450.00, 'confirmed', 'paid', 'Farm business planning', '2024-03-25 13:00:00'),
(16, 13, 2, '2024-03-27 11:00:00', 20, 380.00, 'pending', 'pending', 'Seed technology questions', '2024-03-26 10:00:00'),
(17, 14, 1, '2024-03-28 15:00:00', 30, 350.00, 'confirmed', 'paid', 'Marketing strategies for organic produce', '2024-03-27 14:00:00'),
(18, 15, 1, '2024-03-29 09:00:00', 30, 500.00, 'pending', 'pending', 'Agricultural policy guidance', '2024-03-28 08:00:00'),
(19, 16, 1, '2024-03-30 10:00:00', 30, 420.00, 'confirmed', 'paid', 'Plant disease diagnosis', '2024-03-29 09:00:00'),
(20, 17, 1, '2024-03-31 14:00:00', 30, 320.00, 'pending', 'pending', 'Farm mechanization advice', '2024-03-30 13:00:00'),
(21, 18, 2, '2024-04-01 10:00:00', 20, 280.00, 'confirmed', 'paid', 'Food processing business setup', '2024-03-31 09:00:00'),
(22, 19, 1, '2024-04-02 11:00:00', 30, 350.00, 'pending', 'pending', 'Agroforestry system design', '2024-04-01 10:00:00');

-- Insert expert reviews for new experts
INSERT INTO expert_reviews (expert_id, user_id, consultation_id, rating, review_text, created_at) VALUES
(9, 6, 6, 5, 'Dr. Ananya provided excellent guidance on climate-smart farming. Her suggestions helped me improve crop yields while reducing water usage. Highly recommended!', '2024-03-20 12:00:00'),
(10, 7, 7, 5, 'Dr. Malhotra is extremely knowledgeable about organic horticulture. His guidance helped me get organic certification for my farm. Very professional!', '2024-03-21 15:00:00'),
(11, 8, 8, 4, 'Dr. Sunita is very passionate about women empowerment. Her programs have helped many women farmers in our village. Great work!', '2024-03-22 11:00:00'),
(12, 9, 9, 5, 'Dr. Sharma made digital farming very easy to understand. His solutions are practical and affordable for small farmers.', '2024-03-23 16:00:00'),
(13, 10, 10, 5, 'Dr. Krishnan\'s knowledge of traditional farming is amazing. She helped me revive many traditional practices that work better than modern methods.', '2024-03-24 10:00:00'),
(14, 11, 11, 4, 'Dr. Singh provided excellent advice on livestock management. My animals are healthier and more productive now.', '2024-03-25 11:00:00'),
(15, 12, 12, 5, 'Dr. Nair helped me improve my farm profitability significantly. Her business planning was very detailed and practical.', '2024-03-26 15:00:00'),
(16, 13, 13, 4, 'Dr. Kumar is very knowledgeable about seed technology. His guidance helped me choose better seed varieties for my region.', '2024-03-27 12:00:00'),
(17, 14, 14, 5, 'Dr. Patel\'s marketing strategies are very effective. I\'m getting better prices for my organic produce now.', '2024-03-28 15:00:00'),
(18, 15, 15, 5, 'Dr. Gupta provided valuable insights into agricultural policy. His advice helped me navigate complex regulations.', '2024-03-29 10:00:00'),
(19, 16, 16, 5, 'Dr. Singh is an expert in plant pathology. She accurately diagnosed my crop disease and provided effective treatment.', '2024-03-30 11:00:00'),
(20, 17, 17, 4, 'Dr. Verma suggested appropriate farm machinery that fit my budget. It has improved my efficiency significantly.', '2024-03-31 14:00:00'),
(21, 18, 18, 5, 'Dr. Sharma helped me set up a small food processing unit. Her guidance was very practical and useful.', '2024-04-01 10:00:00'),
(22, 19, 19, 4, 'Dr. Kumar designed an excellent agroforestry system for my farm. The biodiversity has improved significantly.', '2024-04-02 11:00:00');

-- Insert sample notifications for new doctors
INSERT INTO doctor_notifications (expert_id, type, title, message, consultation_id) VALUES
(9, 'new_booking', 'New Consultation Booking', 'You have a new video consultation booked for March 20, 2024 at 11:00 AM', 6),
(10, 'message', 'New Message from Farmer', 'Farmer sent a message about organic horticulture', 7),
(11, 'payment_received', 'Payment Received', 'Payment of ₹350 received for consultation #8', 8),
(12, 'consultation_reminder', 'Upcoming Consultation', 'You have a consultation scheduled for tomorrow at 3:00 PM', 9),
(13, 'review', 'New Review Received', 'You received a 5-star review from a recent consultation', 10),
(14, 'new_booking', 'New Consultation Booking', 'You have a new video consultation booked for March 25, 2024 at 10:00 AM', 11),
(15, 'message', 'New Message from Farmer', 'Farmer sent a message about livestock management', 12),
(16, 'payment_received', 'Payment Received', 'Payment of ₹400 received for consultation #11', 13),
(17, 'consultation_reminder', 'Upcoming Consultation', 'You have a consultation scheduled for tomorrow at 2:00 PM', 14),
(18, 'review', 'New Review Received', 'You received a 5-star review from a recent consultation', 15),
(19, 'new_booking', 'New Consultation Booking', 'You have a new video consultation booked for March 30, 2024 at 10:00 AM', 16),
(20, 'message', 'New Message from Farmer', 'Farmer sent a message about farm mechanization', 17),
(21, 'payment_received', 'Payment Received', 'Payment of ₹280 received for consultation #18', 18),
(22, 'consultation_reminder', 'Upcoming Consultation', 'You have a consultation scheduled for tomorrow at 11:00 AM', 19),
(23, 'review', 'New Review Received', 'You received a 5-star review from a recent consultation', 20);

-- Insert sample earnings data for new experts
INSERT INTO doctor_earnings (expert_id, consultation_id, amount, commission_rate, doctor_earnings, platform_fee, status) VALUES
(9, 6, 420.00, 0.85, 357.00, 63.00, 'paid'),
(10, 7, 480.00, 0.85, 408.00, 72.00, 'processed'),
(11, 8, 350.00, 0.85, 297.50, 52.50, 'processed'),
(12, 9, 380.00, 0.85, 323.00, 57.00, 'processed'),
(13, 10, 300.00, 0.85, 255.00, 45.00, 'processed'),
(14, 11, 400.00, 0.85, 340.00, 60.00, 'processed'),
(15, 12, 450.00, 0.85, 382.50, 67.50, 'processed'),
(16, 13, 380.00, 0.85, 323.00, 57.00, 'processed'),
(17, 14, 350.00, 0.85, 297.50, 52.50, 'processed'),
(18, 15, 500.00, 0.85, 425.00, 75.00, 'processed'),
(19, 16, 420.00, 0.85, 357.00, 63.00, 'processed'),
(20, 17, 320.00, 0.85, 272.00, 48.00, 'processed'),
(21, 18, 280.00, 0.85, 238.00, 42.00, 'processed'),
(22, 19, 350.00, 0.85, 297.50, 52.50, 'processed');

-- Update expert statistics
UPDATE experts SET review_count = review_count + 1 WHERE id IN (9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22);

-- Update ratings based on new reviews
UPDATE experts SET rating = (
  SELECT AVG(rating) FROM expert_reviews WHERE expert_id = experts.id
) WHERE id IN (9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22);
