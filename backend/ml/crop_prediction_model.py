"""
Real Crop Prediction Model Training Script
Uses RandomForest + GradientBoosting Ensemble for accurate crop recommendations
"""

import pandas as pd
import numpy as np
import joblib
import warnings
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import os
from datetime import datetime

warnings.filterwarnings('ignore')

class CropPredictionModel:
    """
    Ensemble ML model for crop recommendation
    Combines RandomForest and GradientBoosting classifiers
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 
                             'humidity', 'ph', 'rainfall']
        self.crop_names = None
        self.metrics = {}
        
    def create_synthetic_dataset(self, n_samples=5000):
        """
        Create realistic synthetic crop dataset
        Based on typical agricultural conditions
        """
        np.random.seed(42)
        
        # Define crop-specific ranges for better training
        crop_configs = {
            'rice': {
                'nitrogen': (20, 100),
                'phosphorus': (10, 50),
                'potassium': (10, 60),
                'temperature': (20, 30),
                'humidity': (70, 95),
                'ph': (5.5, 7.5),
                'rainfall': (150, 300)
            },
            'wheat': {
                'nitrogen': (30, 120),
                'phosphorus': (15, 60),
                'potassium': (15, 80),
                'temperature': (10, 25),
                'humidity': (40, 70),
                'ph': (6.0, 8.0),
                'rainfall': (30, 100)
            },
            'maize': {
                'nitrogen': (40, 140),
                'phosphorus': (20, 70),
                'potassium': (20, 100),
                'temperature': (24, 30),
                'humidity': (60, 85),
                'ph': (5.5, 8.0),
                'rainfall': (60, 150)
            },
            'chickpea': {
                'nitrogen': (10, 60),
                'phosphorus': (10, 80),
                'potassium': (10, 70),
                'temperature': (15, 25),
                'humidity': (30, 60),
                'ph': (6.0, 9.0),
                'rainfall': (30, 90)
            },
            'kidneybeans': {
                'nitrogen': (20, 80),
                'phosphorus': (15, 70),
                'potassium': (15, 80),
                'temperature': (20, 28),
                'humidity': (50, 85),
                'ph': (5.5, 8.0),
                'rainfall': (50, 150)
            },
            'pigeonpeas': {
                'nitrogen': (15, 70),
                'phosphorus': (10, 60),
                'potassium': (10, 70),
                'temperature': (21, 30),
                'humidity': (45, 80),
                'ph': (5.0, 8.5),
                'rainfall': (60, 150)
            },
            'mothbeans': {
                'nitrogen': (15, 70),
                'phosphorus': (10, 50),
                'potassium': (10, 60),
                'temperature': (25, 35),
                'humidity': (15, 55),
                'ph': (6.5, 8.5),
                'rainfall': (10, 50)
            },
            'mungbean': {
                'nitrogen': (15, 70),
                'phosphorus': (10, 60),
                'potassium': (10, 70),
                'temperature': (24, 30),
                'humidity': (50, 85),
                'ph': (5.5, 8.0),
                'rainfall': (40, 100)
            },
            'apple': {
                'nitrogen': (30, 100),
                'phosphorus': (15, 50),
                'potassium': (20, 80),
                'temperature': (10, 25),
                'humidity': (40, 75),
                'ph': (6.0, 7.5),
                'rainfall': (70, 150)
            },
            'banana': {
                'nitrogen': (50, 150),
                'phosphorus': (20, 70),
                'potassium': (40, 120),
                'temperature': (24, 30),
                'humidity': (70, 95),
                'ph': (5.5, 7.5),
                'rainfall': (150, 300)
            },
            'blackgram': {
                'nitrogen': (15, 70),
                'phosphorus': (10, 60),
                'potassium': (10, 70),
                'temperature': (22, 30),
                'humidity': (45, 75),
                'ph': (6.0, 8.0),
                'rainfall': (30, 80)
            },
            'coconut': {
                'nitrogen': (60, 150),
                'phosphorus': (20, 60),
                'potassium': (50, 150),
                'temperature': (24, 32),
                'humidity': (70, 95),
                'ph': (5.5, 8.0),
                'rainfall': (150, 300)
            },
            'coffee': {
                'nitrogen': (40, 120),
                'phosphorus': (15, 50),
                'potassium': (40, 100),
                'temperature': (15, 24),
                'humidity': (60, 85),
                'ph': (5.5, 7.0),
                'rainfall': (150, 200)
            },
            'cotton': {
                'nitrogen': (40, 120),
                'phosphorus': (20, 70),
                'potassium': (30, 100),
                'temperature': (21, 30),
                'humidity': (50, 85),
                'ph': (5.5, 8.0),
                'rainfall': (50, 150)
            },
            'lentil': {
                'nitrogen': (10, 60),
                'phosphorus': (10, 70),
                'potassium': (10, 70),
                'temperature': (15, 25),
                'humidity': (30, 65),
                'ph': (6.0, 9.0),
                'rainfall': (30, 80)
            },
            'muskmelon': {
                'nitrogen': (30, 100),
                'phosphorus': (15, 60),
                'potassium': (20, 80),
                'temperature': (24, 32),
                'humidity': (50, 80),
                'ph': (6.0, 8.0),
                'rainfall': (10, 50)
            },
            'orange': {
                'nitrogen': (40, 120),
                'phosphorus': (15, 50),
                'potassium': (40, 100),
                'temperature': (15, 28),
                'humidity': (50, 80),
                'ph': (6.0, 8.0),
                'rainfall': (100, 200)
            },
            'papaya': {
                'nitrogen': (40, 120),
                'phosphorus': (20, 60),
                'potassium': (30, 100),
                'temperature': (22, 30),
                'humidity': (70, 95),
                'ph': (5.5, 8.0),
                'rainfall': (150, 200)
            },
            'sugarcane': {
                'nitrogen': (60, 150),
                'phosphorus': (30, 80),
                'potassium': (80, 150),
                'temperature': (21, 30),
                'humidity': (50, 85),
                'ph': (5.5, 8.0),
                'rainfall': (75, 150)
            },
            'watermelon': {
                'nitrogen': (20, 80),
                'phosphorus': (15, 60),
                'potassium': (20, 80),
                'temperature': (24, 35),
                'humidity': (40, 75),
                'ph': (6.0, 8.0),
                'rainfall': (10, 60)
            },
            'grapes': {
                'nitrogen': (30, 100),
                'phosphorus': (15, 50),
                'potassium': (40, 120),
                'temperature': (14, 28),
                'humidity': (30, 70),
                'ph': (5.5, 8.0),
                'rainfall': (50, 100)
            },
            'jute': {
                'nitrogen': (40, 120),
                'phosphorus': (20, 60),
                'potassium': (20, 80),
                'temperature': (25, 35),
                'humidity': (60, 90),
                'ph': (5.5, 8.0),
                'rainfall': (150, 225)
            }
        }
        
        data = []
        samples_per_crop = n_samples // len(crop_configs)
        
        for crop, ranges in crop_configs.items():
            for _ in range(samples_per_crop):
                sample = {
                    'nitrogen': np.random.uniform(*ranges['nitrogen']),
                    'phosphorus': np.random.uniform(*ranges['phosphorus']),
                    'potassium': np.random.uniform(*ranges['potassium']),
                    'temperature': np.random.uniform(*ranges['temperature']),
                    'humidity': np.random.uniform(*ranges['humidity']),
                    'ph': np.random.uniform(*ranges['ph']),
                    'rainfall': np.random.uniform(*ranges['rainfall']),
                    'label': crop
                }
                data.append(sample)
        
        df = pd.DataFrame(data)
        return df
    
    def prepare_data(self, df):
        """Prepare and preprocess data"""
        X = df[self.feature_names].copy()
        y = df['label'].copy()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        
        return X_scaled, y_encoded
    
    def train(self, X, y):
        """Train ensemble model"""
        print("[*] Training ensemble model...")
        
        # RandomForest component
        rf = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        )
        
        # GradientBoosting component
        gb = GradientBoostingClassifier(
            n_estimators=150,
            learning_rate=0.1,
            max_depth=7,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            subsample=0.8
        )
        
        # Voting classifier ensemble
        self.model = VotingClassifier(
            estimators=[('rf', rf), ('gb', gb)],
            voting='soft',
            n_jobs=-1
        )
        
        self.model.fit(X, y)
        print("[+] Model trained successfully!")
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        y_pred = self.model.predict(X_test)
        
        self.metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, average='weighted', zero_division=0),
            'recall': recall_score(y_test, y_pred, average='weighted', zero_division=0),
            'f1': f1_score(y_test, y_pred, average='weighted', zero_division=0)
        }
        
        print("\n[*] Model Performance:")
        print(f"    Accuracy:  {self.metrics['accuracy']:.4f}")
        print(f"    Precision: {self.metrics['precision']:.4f}")
        print(f"    Recall:    {self.metrics['recall']:.4f}")
        print(f"    F1-Score:  {self.metrics['f1']:.4f}")
        
        return self.metrics
    
    def predict_crops(self, input_features):
        """
        Predict recommended crops for given conditions
        Returns top crops with confidence scores and estimations
        """
        # Ensure input is properly formatted
        features_array = np.array(input_features).reshape(1, -1)
        features_scaled = self.scaler.transform(features_array)
        
        # Get predictions
        prediction = self.model.predict(features_scaled)
        probabilities = self.model.predict_proba(features_scaled)
        
        # Get top 3 crops with highest confidence
        top_indices = np.argsort(probabilities[0])[-3:][::-1]
        
        result = {
            'recommended_crops': [],
            'confidence_scores': [],
            'yield_estimation_kg_per_hectare': self._estimate_yield(features_array[0]),
            'profit_estimation_per_hectare': self._estimate_profit(features_array[0])
        }
        
        for idx in top_indices:
            crop_name = self.label_encoder.inverse_transform([idx])[0]
            confidence = float(probabilities[0][idx])
            
            result['recommended_crops'].append(crop_name)
            result['confidence_scores'].append(round(confidence, 4))
        
        return result
    
    def _estimate_yield(self, features):
        """Estimate yield based on input features"""
        # Simplified yield estimation based on fertilizer and rainfall
        base_yield = 2000  # kg/hectare
        
        # Nutrients contribution (40 kg base)
        npk_sum = features[0] + features[1] + features[2]  # nitrogen, phosphorus, potassium
        nutrient_factor = 1 + (npk_sum / 200) * 0.5
        
        # Water contribution
        rainfall = features[6]
        water_factor = 1 + (rainfall / 300) * 0.4
        
        # Temperature contribution (optimal around 25°C)
        temp = features[3]
        temp_factor = 1 - abs(temp - 25) / 50 * 0.3
        
        # Final yield
        yield_kg = base_yield * nutrient_factor * water_factor * max(temp_factor, 0.5)
        
        return round(float(yield_kg), 2)
    
    def _estimate_profit(self, features):
        """Estimate profit per hectare"""
        # Average crop price in INR per kg
        avg_price_per_kg = 25  # INR
        
        # Cost of cultivation (INR per hectare)
        cultivation_cost = 10000  # INR
        
        yield_kg = self._estimate_yield(features)
        revenue = yield_kg * avg_price_per_kg
        profit = revenue - cultivation_cost
        
        return round(float(profit), 2)
    
    def save_model(self, model_dir='models'):
        """Save trained model and scaler"""
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, 'crop_prediction_model.pkl')
        scaler_path = os.path.join(model_dir, 'crop_scaler.pkl')
        encoder_path = os.path.join(model_dir, 'crop_label_encoder.pkl')
        
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
        joblib.dump(self.label_encoder, encoder_path)
        
        print(f"\n[+] Model saved to {model_path}")
        print(f"[+] Scaler saved to {scaler_path}")
        print(f"[+] Encoder saved to {encoder_path}")
    
    def load_model(self, model_dir='models'):
        """Load trained model and scaler"""
        model_path = os.path.join(model_dir, 'crop_prediction_model.pkl')
        scaler_path = os.path.join(model_dir, 'crop_scaler.pkl')
        encoder_path = os.path.join(model_dir, 'crop_label_encoder.pkl')
        
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.label_encoder = joblib.load(encoder_path)
        
        print(f"[+] Model loaded from {model_path}")


def main():
    """Main training pipeline"""
    print("=" * 60)
    print("CROP PREDICTION MODEL - TRAINING PIPELINE")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Initialize model
    crop_model = CropPredictionModel()
    
    # Create synthetic dataset
    print("\n[*] Creating synthetic crop dataset...")
    df = crop_model.create_synthetic_dataset(n_samples=5000)
    print(f"[+] Dataset created with {len(df)} samples")
    print(f"[+] Crops: {df['label'].nunique()} unique crops")
    print(f"[+] Crops: {', '.join(sorted(df['label'].unique()))}")
    
    # Prepare data
    print("\n[*] Preparing data...")
    X_scaled, y_encoded = crop_model.prepare_data(df)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"[+] Training set: {len(X_train)} samples")
    print(f"[+] Testing set: {len(X_test)} samples")
    
    # Train model
    crop_model.train(X_train, y_train)
    
    # Evaluate model
    print("\n[*] Evaluating model...")
    crop_model.evaluate(X_test, y_test)
    
    # Save model
    crop_model.save_model()
    
    # Test predictions
    print("\n[*] Testing predictions...")
    test_input = [90, 40, 40, 20, 80, 6.5, 200]
    print(f"[*] Input: N={test_input[0]}, P={test_input[1]}, K={test_input[2]}, "
          f"T={test_input[3]}, H={test_input[4]}, pH={test_input[5]}, R={test_input[6]}")
    
    result = crop_model.predict_crops(test_input)
    print("\n[+] Prediction Result:")
    print(f"    Top Crops: {result['recommended_crops']}")
    print(f"    Confidence: {result['confidence_scores']}")
    print(f"    Yield Estimate: {result['yield_estimation_kg_per_hectare']} kg/ha")
    print(f"    Profit Estimate: ₹{result['profit_estimation_per_hectare']}/ha")
    
    print("\n" + "=" * 60)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)


if __name__ == "__main__":
    main()
