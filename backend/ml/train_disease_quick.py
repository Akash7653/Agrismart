"""
Quick Disease Detection Model for Demo
Uses mock data to demonstrate the ML pipeline
"""

import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import pickle

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

# disease class names
DISEASE_CLASSES = [
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

def create_mock_data(num_classes=18, samples_per_class=300):
    """Create mock disease data"""
    print("🔄 Creating mock disease dataset...")
    
    # Create synthetic features (simulating plant leaf characteristics)
    # Features could represent: color channels, texture, edges, etc.
    X = []
    y = []
    
    for class_idx in range(num_classes):
        # Create class-specific features with some variation
        for _ in range(samples_per_class):
            # Random features with class bias
            features = np.random.randn(64) * 0.5 + (class_idx * 0.1)
            X.append(features)
            y.append(class_idx)
    
    X = np.array(X)
    y = np.array(y)
    
    print(f"✓ Created {len(X)} mock samples from {num_classes} classes")
    print(f"✓ Feature shape: {X.shape}")
    
    return X, y, DISEASE_CLASSES[:num_classes]

def train_classifier(X, y):
    """Train RandomForest classifier"""
    print("\n🏗️  Training RandomForest Disease Classifier...")
    
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        n_jobs=-1,
        random_state=42,
        verbose=1
    )
    
    clf.fit(X, y)
    
    # Evaluate
    score = clf.score(X, y)
    print(f"✓ Training accuracy: {score:.4f}")
    
    return clf

def save_models(clf, class_names):
    """Save models"""
    print("\n💾 Saving models...")
    
    joblib.dump(clf, 'models/disease_classifier_rf.pkl')
    
    with open('models/disease_classes.pkl', 'wb') as f:
        pickle.dump(class_names, f)
    
    print("✓ Classifier saved to models/disease_classifier_rf.pkl")
    print("✓ Classes saved to models/disease_classes.pkl")

def test_inference(clf, class_names):
    """Test inference"""
    print("\n🧪 Testing model inference...")
    
    # Random test features
    test_features = np.random.randn(1, 64)
    
    # Predict
    prediction = clf.predict(test_features)
    confidence = clf.predict_proba(test_features).max()
    
    predicted_disease = class_names[prediction[0]]
    
    print(f"✓ Test input: Random features (shape: {test_features.shape})")
    print(f"✓ Predicted disease: {predicted_disease}")
    print(f"✓ Confidence: {confidence:.4f}")

def main():
    print("\n" + "="*60)
    print("🌿 AgriSmart Disease Detection Model Training")
    print("="*60 + "\n")
    
    # Create data
    X, y, class_names = create_mock_data()
    
    # Train
    clf = train_classifier(X, y)
    
    # Save
    save_models(clf, class_names)
    
    # Test
    test_inference(clf, class_names)
    
    print("\n" + "="*60)
    print("✓ Disease detection model training complete!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
