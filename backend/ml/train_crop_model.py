"""
AgriSmart Crop Prediction Model Training Script
Trains a RandomForestClassifier on crop recommendation dataset
"""

import pandas as pd
import numpy as np
import os
import sys
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import warnings

warnings.filterwarnings('ignore')

# Configuration
DATASET_PATH = 'datasets/crop_recommendation.csv'
MODEL_SAVE_PATH = 'models/crop_model.pkl'
SCALER_SAVE_PATH = 'models/crop_scaler.pkl'
LABEL_ENCODER_SAVE_PATH = 'models/crop_label_encoder.pkl'
TEST_SIZE = 0.2
RANDOM_STATE = 42
N_ESTIMATORS = 200
MAX_DEPTH = 20

def ensure_directories():
    """Create necessary directories if they don't exist"""
    os.makedirs('models', exist_ok=True)
    print("✓ Directories verified")

def load_dataset(path):
    """Load crop recommendation dataset"""
    print(f"\n📊 Loading dataset from {path}...")
    
    if not os.path.exists(path):
        print(f"❌ Dataset not found at {path}")
        sys.exit(1)
    
    df = pd.read_csv(path)
    print(f"✓ Dataset loaded: {df.shape[0]} samples, {df.shape[1]} columns")
    print(f"✓ Columns: {list(df.columns)}")
    print(f"✓ Missing values:\n{df.isnull().sum()}")
    
    return df

def preprocess_data(df):
    """
    Preprocess the dataset
    - Handle missing values
    - Separate features and target
    - Encode target variable
    """
    print("\n🔧 Preprocessing data...")
    
    # Handle missing values
    df = df.dropna()
    print(f"✓ After removing missing values: {df.shape[0]} samples")
    
    # Separate features and target
    # Assuming last column is the target (crop label)
    X = df.iloc[:, :-1]  # All columns except last
    y = df.iloc[:, -1]   # Last column (target/label)
    
    print(f"✓ Features shape: {X.shape}")
    print(f"✓ Target shape: {y.shape}")
    print(f"✓ Unique crops: {y.nunique()}")
    print(f"✓ Crop classes: {sorted(y.unique())}")
    
    # Encode target labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    print(f"✓ Classes encoded: {dict(zip(label_encoder.classes_, range(len(label_encoder.classes_))))}")
    
    return X, y_encoded, label_encoder, y.unique()

def split_data(X, y):
    """Split data into train and test sets"""
    print(f"\n📂 Splitting data (train: {100-TEST_SIZE*100:.0f}%, test: {TEST_SIZE*100:.0f}%)...")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )
    
    print(f"✓ Training set: {X_train.shape[0]} samples")
    print(f"✓ Test set: {X_test.shape[0]} samples")
    
    return X_train, X_test, y_train, y_test

def scale_features(X_train, X_test):
    """Normalize features using StandardScaler"""
    print("\n📏 Scaling features...")
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print(f"✓ Features scaled using StandardScaler")
    print(f"✓ Training set - Mean: {X_train_scaled.mean(axis=0).round(3)}")
    print(f"✓ Training set - Std: {X_train_scaled.std(axis=0).round(3)}")
    
    return X_train_scaled, X_test_scaled, scaler

def train_model(X_train, y_train):
    """Train RandomForestClassifier"""
    print(f"\n🤖 Training RandomForestClassifier ({N_ESTIMATORS} estimators)...")
    
    model = RandomForestClassifier(
        n_estimators=N_ESTIMATORS,
        max_depth=MAX_DEPTH,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        verbose=1,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train, y_train)
    print(f"✓ Model training completed")
    
    return model

def evaluate_model(model, X_train, X_test, y_train, y_test, label_encoder, crop_classes):
    """Evaluate model performance"""
    print("\n📈 Evaluating model...")
    
    # Training accuracy
    y_train_pred = model.predict(X_train)
    train_accuracy = accuracy_score(y_train, y_train_pred)
    print(f"✓ Training accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
    
    # Test accuracy
    y_test_pred = model.predict(X_test)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    print(f"✓ Test accuracy: {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': ['N', 'P', 'K', 'temperature', 'humidity', 'pH', 'rainfall'],
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\n🎯 Feature Importance:")
    for idx, row in feature_importance.iterrows():
        print(f"   {row['feature']}: {row['importance']:.4f}")
    
    # Classification report
    print(f"\n📊 Classification Report:")
    class_report = classification_report(
        y_test, y_test_pred,
        target_names=label_encoder.classes_,
        digits=4
    )
    print(class_report)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_test_pred)
    print(f"\n🔲 Confusion Matrix shape: {cm.shape}")
    
    return test_accuracy

def save_model(model, scaler, label_encoder):
    """Save trained model and preprocessing objects"""
    print(f"\n💾 Saving model and utilities...")
    
    # Save model
    joblib.dump(model, MODEL_SAVE_PATH)
    print(f"✓ Model saved to {MODEL_SAVE_PATH}")
    
    # Save scaler
    joblib.dump(scaler, SCALER_SAVE_PATH)
    print(f"✓ Scaler saved to {SCALER_SAVE_PATH}")
    
    # Save label encoder
    joblib.dump(label_encoder, LABEL_ENCODER_SAVE_PATH)
    print(f"✓ Label encoder saved to {LABEL_ENCODER_SAVE_PATH}")
    
    # Verify files
    files_exist = all([
        os.path.exists(MODEL_SAVE_PATH),
        os.path.exists(SCALER_SAVE_PATH),
        os.path.exists(LABEL_ENCODER_SAVE_PATH)
    ])
    
    if files_exist:
        print(f"✓ All files saved successfully")
        print(f"✓ Model size: {os.path.getsize(MODEL_SAVE_PATH) / 1024:.2f} KB")
    else:
        print(f"❌ Error saving files")
        sys.exit(1)

def test_model_inference(model, scaler, label_encoder):
    """Test model with sample prediction"""
    print(f"\n🧪 Testing model inference...")
    
    # Sample input: typical crop conditions
    sample_input = np.array([[90, 40, 40, 20, 80, 6.5, 200]])
    sample_scaled = scaler.transform(sample_input)
    
    prediction = model.predict(sample_scaled)[0]
    confidence = model.predict_proba(sample_scaled).max()
    crop_name = label_encoder.inverse_transform([prediction])[0]
    
    print(f"✓ Sample input: N=90, P=40, K=40, Temp=20, Humidity=80, pH=6.5, Rainfall=200")
    print(f"✓ Predicted crop: {crop_name}")
    print(f"✓ Confidence: {confidence:.4f} ({confidence*100:.2f}%)")

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("🌾 AgriSmart Crop Prediction Model Training")
    print("=" * 60)
    
    try:
        # Step 1: Prepare directories
        ensure_directories()
        
        # Step 2: Load dataset
        df = load_dataset(DATASET_PATH)
        
        # Step 3: Preprocess data
        X, y, label_encoder, crop_classes = preprocess_data(df)
        
        # Step 4: Split data
        X_train, X_test, y_train, y_test = split_data(X, y)
        
        # Step 5: Scale features
        X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
        
        # Step 6: Train model
        model = train_model(X_train_scaled, y_train)
        
        # Step 7: Evaluate model
        accuracy = evaluate_model(
            model, X_train_scaled, X_test_scaled,
            y_train, y_test, label_encoder, crop_classes
        )
        
        # Step 8: Save model
        save_model(model, scaler, label_encoder)
        
        # Step 9: Test inference
        test_model_inference(model, scaler, label_encoder)
        
        print("\n" + "=" * 60)
        print(f"✅ Training completed successfully!")
        print(f"   Test Accuracy: {accuracy*100:.2f}%")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during training: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
