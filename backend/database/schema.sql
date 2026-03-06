-- AgriSmart Database Schema
-- Natural Farming Focus Database

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    farming_experience INT,
    land_size DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Farm Categories (Natural Farming Focus)
CREATE TABLE farm_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Natural Farming Products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2),
    stock_quantity INT DEFAULT 0,
    min_order_quantity INT DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'kg',
    is_organic BOOLEAN DEFAULT TRUE,
    certification VARCHAR(100),
    origin VARCHAR(100),
    shelf_life VARCHAR(100),
    usage_instructions TEXT,
    benefits TEXT,
    image_url VARCHAR(500),
    images JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seller_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES farm_categories(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Product Variants (for different sizes/packages)
CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    unit VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Agricultural Experts/Consultants
CREATE TABLE experts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    bio TEXT,
    experience_years INT NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    languages JSON,
    education VARCHAR(255),
    certifications JSON,
    availability_schedule JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Consultation Types
CREATE TABLE consultation_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultation Bookings
CREATE TABLE consultations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expert_id INT NOT NULL,
    user_id INT NOT NULL,
    consultation_type_id INT NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    fee DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    meeting_link VARCHAR(500),
    notes TEXT,
    user_notes TEXT,
    expert_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expert_id) REFERENCES experts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (consultation_type_id) REFERENCES consultation_types(id)
);

-- Orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    shipping_address JSON,
    billing_address JSON,
    estimated_delivery DATE,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- Product Reviews
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    images JSON,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Expert Reviews
CREATE TABLE expert_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expert_id INT NOT NULL,
    user_id INT NOT NULL,
    consultation_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expert_id) REFERENCES experts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id)
);

-- Shopping Cart
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- Wishlist
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- Crop Disease Database
CREATE TABLE crop_diseases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    description TEXT NOT NULL,
    causes TEXT,
    symptoms TEXT,
    treatments JSON,
    prevention_methods JSON,
    affected_crops JSON,
    severity_level ENUM('low', 'medium', 'high') NOT NULL,
    image_url VARCHAR(500),
    confidence_threshold DECIMAL(3,2) DEFAULT 0.80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease Detection History
CREATE TABLE disease_detections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    disease_id INT,
    image_url VARCHAR(500),
    confidence_score DECIMAL(5,2),
    affected_area_percentage DECIMAL(5,2),
    detection_result JSON,
    user_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (disease_id) REFERENCES crop_diseases(id)
);

-- Insert Natural Farming Categories
INSERT INTO farm_categories (name, description, icon) VALUES
('Organic Seeds', 'Certified organic and heirloom seeds for sustainable farming', 'seeds'),
('Natural Fertilizers', 'Organic and bio-fertilizers for soil health', 'fertilizer'),
('Bio-Pesticides', 'Natural pest control solutions', 'pesticide'),
('Farm Tools', 'Sustainable farming equipment and tools', 'tools'),
('Irrigation Systems', 'Water conservation and efficient irrigation', 'irrigation'),
('Compost & Manure', 'Organic soil amendments and compost', 'compost'),
('Beneficial Insects', 'Natural pest control through beneficial organisms', 'insects'),
('Greenhouse Supplies', 'Sustainable greenhouse and polyhouse materials', 'greenhouse');

-- Insert Consultation Types
INSERT INTO consultation_types (name, description, duration_minutes, icon) VALUES
('Video Call', 'Face-to-face video consultation with agricultural expert', 30, 'video'),
('Chat Session', 'Text-based consultation with quick responses', 20, 'chat'),
('Phone Call', 'Voice consultation with agricultural expert', 25, 'phone'),
('Farm Visit', 'On-site farm visit and consultation (Available in select areas)', 120, 'visit');

-- Insert Sample Natural Products
INSERT INTO products (name, description, category_id, price, original_price, stock_quantity, unit, is_organic, certification, origin, benefits, image_url, rating, review_count) VALUES
('Organic Wheat Seeds - Heritage Variety', 'Premium heritage wheat seeds with high nutritional value and excellent drought resistance. Perfect for organic farming practices.', 1, 450.00, 550.00, 1000, 'kg', TRUE, 'INDIA ORGANIC', 'Madhya Pradesh, India', 'High yield, drought resistant, rich in nutrients, traditional variety', '/images/products/organic-wheat-seeds.jpg', 4.8, 127),
('Vermicompost - Premium Grade', '100% organic vermicompost produced from cow dung and agricultural waste. Rich in essential nutrients and beneficial microorganisms.', 6, 12.00, 15.00, 5000, 'kg', TRUE, 'ORGANIC INDIA', 'Punjab, India', 'Improves soil structure, increases water retention, provides balanced nutrition', '/images/products/vermicompost.jpg', 4.7, 89),
('Neem Oil Bio-Pesticide', 'Cold-pressed neem oil for natural pest control. Effective against over 200 types of pests without harming beneficial insects.', 3, 180.00, NULL, 2000, 'liter', TRUE, 'NPOP CERTIFIED', 'Rajasthan, India', 'Broad spectrum pest control, biodegradable, safe for edible crops', '/images/products/neem-oil.jpg', 4.6, 156),
('Organic Basmati Rice Seeds', 'Aromatic basmati rice seeds with exceptional grain quality and natural disease resistance.', 1, 680.00, 850.00, 500, 'kg', TRUE, 'INDIA ORGANIC', 'Uttar Pradesh, India', 'Premium aroma, long grain, disease resistant, high market value', '/images/products/basmati-rice-seeds.jpg', 4.9, 203),
('Cow Dung Manure - Dry', 'Aged cow dung manure rich in nitrogen, phosphorus, and potassium. Essential for organic farming.', 6, 8.00, NULL, 10000, 'kg', TRUE, 'ORGANIC INDIA', 'Gujarat, India', 'Balanced NPK, improves soil fertility, increases microbial activity', '/images/products/cow-dung-manure.jpg', 4.5, 178),
('Bio-Fungicide - Trichoderma', 'Beneficial fungus-based bio-fungicide for natural disease control in crops.', 3, 220.00, 280.00, 1500, 'kg', TRUE, 'BIO CONTROL', 'Karnataka, India', 'Prevents root rot, promotes growth, eco-friendly solution', '/images/products/trichoderma.jpg', 4.4, 92),
('Organic Vegetable Seed Kit', 'Complete kit with 10 varieties of organic vegetable seeds for home gardening.', 1, 299.00, 399.00, 800, 'kit', TRUE, 'HEIRLOOM CERTIFIED', 'Maharashtra, India', 'Diverse varieties, seasonal vegetables, high germination rate', '/images/products/vegetable-seed-kit.jpg', 4.8, 145),
('Earthworms for Vermicomposting', 'Live earthworms (Eisenia fetida) for starting your own vermicompost unit.', 7, 1500.00, NULL, 200, 'kg', TRUE, 'ORGANIC INDIA', 'Tamil Nadu, India', 'Fast composting, high quality vermicompost, sustainable solution', '/images/products/earthworms.jpg', 4.7, 67);

-- Insert Sample Experts
INSERT INTO experts (user_id, specialty, bio, experience_years, consultation_fee, rating, review_count, languages, education, certifications, is_verified) VALUES
(1, 'Organic Farming & Soil Health', 'Dr. Rajesh Kumar is a renowned expert in organic farming with over 15 years of experience in sustainable agriculture practices.', 15, 450.00, 4.9, 127, '["English", "Hindi", "Punjabi"]', 'PhD in Organic Agriculture', '["NABET Certified", "Organic Farming Expert"]', TRUE),
(2, 'Natural Pest Management', 'Dr. Sarah Johnson specializes in biological pest control and integrated pest management for organic farms.', 12, 380.00, 4.8, 89, '["English", "Spanish"]', 'MSc in Entomology', '["Bio-Pest Control Certified", "IPM Specialist"]', TRUE),
(3, 'Sustainable Crop Production', 'Dr. Priya Sharma focuses on sustainable crop production and water conservation techniques.', 10, 320.00, 4.7, 156, '["English", "Hindi", "Tamil"]', 'PhD in Agronomy', '["Sustainable Farming Certified", "Water Management Expert"]', TRUE),
(4, 'Organic Certification & Standards', 'Dr. Michael Chen helps farmers obtain organic certification and maintain compliance with international standards.', 20, 550.00, 4.9, 203, '["English", "Mandarin"]', 'PhD in Agricultural Standards', '["ISO Auditor", "Organic Certification Specialist"]', TRUE);

-- Insert Sample Diseases
INSERT INTO crop_diseases (name, scientific_name, description, causes, symptoms, treatments, prevention_methods, affected_crops, severity_level, image_url) VALUES
('Leaf Blight', 'Alternaria alternata', 'A fungal disease causing yellowing and browning of leaf margins, leading to reduced photosynthesis.', 'High humidity, poor air circulation, overhead irrigation', 'Yellowing of leaf tips, brown spots, premature leaf drop', '["Apply neem oil spray", "Remove infected leaves", "Improve air circulation", "Apply copper-based fungicide"]', '["Proper plant spacing", "Water at base of plants", "Monitor humidity levels", "Use resistant varieties"]', '["Wheat", "Tomato", "Potato"]', 'high', '/images/diseases/leaf-blight.jpg'),
('Powdery Mildew', 'Erysiphe cichoracearum', 'Fungal disease appearing as white powdery coating on leaves, affecting plant growth.', 'High humidity, moderate temperatures, poor ventilation', 'White powdery coating on leaves, stunted growth', '["Apply sulfur spray", "Use baking soda solution", "Increase air circulation", "Apply neem oil"]', '["Ensure proper spacing", "Monitor humidity", "Prune affected areas", "Use resistant varieties"]', '["Squash", "Cucumber", "Melon"]', 'medium', '/images/diseases/powdery-mildew.jpg'),
('Root Rot', 'Fusarium spp.', 'Soil-borne fungal disease causing root decay and plant wilting.', 'Overwatering, poor drainage, soil compaction', 'Wilting, yellowing leaves, brown mushy roots', '["Reduce watering", "Apply beneficial fungi", "Improve drainage", "Remove affected plants"]', '["Well-draining soil", "Proper watering schedule", "Crop rotation", "Soil solarization"]', '["Tomato", "Pepper", "Eggplant"]', 'high', '/images/diseases/root-rot.jpg'),
('Bacterial Leaf Spot', 'Xanthomonas campestris', 'Bacterial infection causing water-soaked spots on leaves that turn brown or black.', 'High humidity, leaf wetness, contaminated seeds', 'Water-soaked spots, yellow halos, leaf drop', '["Apply copper spray", "Remove infected leaves", "Avoid overhead watering", "Use certified seeds"]', '["Crop rotation", "Seed treatment", "Proper spacing", "Resistant varieties"]', '["Pepper", "Tomato", "Cabbage"]', 'medium', '/images/diseases/bacterial-leaf-spot.jpg');
