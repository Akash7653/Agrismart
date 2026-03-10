"""
Fast Disease Detection Model using MobileNetV2 Feature Extraction + Logistic Regression
This uses transfer learning with pre-trained MobileNetV2 to extract features,
then trains a fast logistic regression classifier on top.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image
from sklearn.linear_model import LogisticRegression
import joblib
import pickle
from pathlib import Path

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

def load_mobilenetv2_feature_extractor():
    """Load pre-trained MobileNetV2 for feature extraction"""
    print("✓ Loading MobileNetV2 feature extractor...")
    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet',
        pooling='avg'
    )
    base_model.trainable = False
    return base_model

def load_plant_disease_data(dataset_path='datasets/plant_disease', max_images_per_class=500):
    """Load plant disease dataset with feature extraction"""
    
    print(f"📂 Loading dataset from {dataset_path}...")
    
    if not os.path.exists(dataset_path):
        print("⚠️ Dataset not found! Creating mock dataset...")
        return create_mock_disease_data()
    
    feature_extractor = load_mobilenetv2_feature_extractor()
    
    X = []
    y = []
    class_names = []
    class_idx = 0
    
    # Load all disease classes
    for disease_class in sorted(os.listdir(dataset_path))[:18]:  # Limit to 18 classes
        class_path = os.path.join(dataset_path, disease_class)
        if not os.path.isdir(class_path):
            continue
            
        class_names.append(disease_class)
        image_files = [f for f in os.listdir(class_path) if f.lower().endswith(('.jpg', '.png', '.jpeg'))]
        
        print(f"\n  Processing {disease_class} ({len(image_files)} images)...")
        
        # Process up to max_images_per_class for speed
        for img_file in image_files[:max_images_per_class]:
            try:
                img_path = os.path.join(class_path, img_file)
                # Load and preprocess image
                img = image.load_img(img_path, target_size=(224, 224))
                img_array = image.img_to_array(img)
                img_array = np.expand_dims(img_array, axis=0)
                img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
                
                # Extract features
                features = feature_extractor.predict(img_array, verbose=0)
                X.append(features.flatten())
                y.append(class_idx)
                
                if len(X) % 100 == 0:
                    print(f"    Loaded {len(X)} images...", end='\r')
            except Exception as e:
                print(f"    Error loading {img_file}: {e}")
        
        class_idx += 1
    
    X = np.array(X)
    y = np.array(y)
    
    print(f"\n✓ Loaded {len(X)} images from {len(class_names)} disease classes")
    print(f"✓ Feature shape: {X.shape}")
    
    return X, y, class_names

def create_mock_disease_data(num_classes=18, samples_per_class=200):
    """Create mock disease data for demo"""
    print("🔄 Creating mock disease detection data...")
    
    X = np.random.randn(num_classes * samples_per_class, 1280)  # MobileNetV2 output size
    y = np.repeat(np.arange(num_classes), samples_per_class)
    
    class_names = [
        'Apple___Apple_scab',
        'Apple___Black_rot',
        'Apple___Cedar_apple_rust',
        'Apple___healthy',
        'Blueberry___healthy',
        'Cherry___Powdery_mildew',
        'Cherry___healthy',
        'Corn___Cercospora_leaf_spot',
        'Corn___Common_rust',
        'Corn___Northern_Leaf_Blight',
        'Corn___healthy',
        'Grape___Black_rot',
        'Grape___Esca',
        'Grape___Leaf_blight',
        'Grape___healthy',
        'Orange___Haunglongbing',
        'Peach___Bacterial_spot',
        'Peach___healthy'
    ]
    
    print(f"✓ Created {len(X)} mock samples from {len(class_names)} classes")
    return X, y, class_names

def train_classifier(X, y):
    """Train logistic regression classifier on extracted features"""
    print("\n🏗️  Training Logistic Regression classifier...")
    
    clf = LogisticRegression(
        max_iter=1000,
        random_state=42,
        n_jobs=-1,
        verbose=1
    )
    
    clf.fit(X, y)
    
    # Evaluate on training data
    score = clf.score(X, y)
    print(f"✓ Training accuracy: {score:.4f}")
    
    return clf

def save_models(clf, class_names):
    """Save trained classifier and class names"""
    print("\n💾 Saving models...")
    
    joblib.dump(clf, 'models/disease_classifier.pkl')
    
    with open('models/disease_classes.pkl', 'wb') as f:
        pickle.dump(class_names, f)
    
    print("✓ Classifier saved to models/disease_classifier.pkl")
    print("✓ Classes saved to models/disease_classes.pkl")

def test_model_inference(clf, class_names):
    """Test model with random input"""
    print("\n🧪 Testing model inference...")
    
    # Create random feature vector (simulating MobileNetV2 output)
    test_features = np.random.randn(1, 1280)
    
    # Make prediction
    prediction = clf.predict(test_features)
    confidence = clf.predict_proba(test_features).max()
    
    predicted_class = class_names[prediction[0]]
    
    print(f"✓ Test input: Random features (shape: {test_features.shape})")
    print(f"✓ Predicted disease: {predicted_class}")
    print(f"✓ Confidence: {confidence:.4f}")
    
    return predicted_class, confidence

def main():
    """Main training pipeline"""
    print("\n" + "="*60)
    print("🌿 AgriSmart Plant Disease Detection (Fast Training)")
    print("="*60)
    
    # Load data (uses real dataset if available, otherwise creates mock)
    X, y, class_names = load_plant_disease_data()
    
    # Train classifier
    clf = train_classifier(X, y)
    
    # Save models
    save_models(clf, class_names)
    
    # Test inference
    test_model_inference(clf, class_names)
    
    print("\n" + "="*60)
    print("✓ Disease detection model training complete!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
