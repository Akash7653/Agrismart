"""
Real Plant Disease Detection Model
Uses TensorFlow/Keras CNN for image classification
Supports: Tomato, Potato, Rice, Wheat
Diseases: Leaf Spot, Early Blight, Late Blight, Powdery Mildew, Rust, Healthy
"""

import numpy as np
import pandas as pd
import os
import json
import joblib
from datetime import datetime
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import warnings

warnings.filterwarnings('ignore')

class DiseaseDetectionModel:
    """
    CNN-based plant disease detection model
    Supports multiple crops and disease types
    """
    
    # Disease metadata
    DISEASE_DATA = {
        'tomato': {
            'leaf_spot': {
                'symptoms': ['Brown circular spots on leaves', 'Yellow halo around spots'],
                'causes': ['Fungal infection', 'High humidity'],
                'treatments': ['Fungicide applications', 'Remove infected leaves', 'Improve drainage'],
                'organic_solutions': ['Copper sulfate spray', 'Baking soda solution', 'Neem oil'],
                'severity_level': 'Medium'
            },
            'early_blight': {
                'symptoms': ['Concentric rings on lower leaves', 'Brown lesions', 'Yellowing'],
                'causes': ['Alternaria fungus', 'Wet foliage', 'Poor air circulation'],
                'treatments': ['Fungicide spray', 'Prune lower leaves', 'Improve ventilation'],
                'organic_solutions': ['Copper fungicide', 'Sulfur dust', 'Chlorothalonil'],
                'severity_level': 'High'
            },
            'late_blight': {
                'symptoms': ['Water-soaked spots', 'White mold on leaf undersides', 'Rapid spread'],
                'causes': ['Phytophthora infestans', 'Cool wet weather'],
                'treatments': ['Fungicide immediately', 'Remove infected plants', 'Improve drainage'],
                'organic_solutions': ['Copper sulfate', 'Bordeaux mixture', 'Potassium bicarbonate'],
                'severity_level': 'Critical'
            },
            'powdery_mildew': {
                'symptoms': ['White powder on leaves', 'Leaf curling', 'Stunted growth'],
                'causes': ['Fungal spores', 'Warm dry weather'],
                'treatments': ['Sulfur spray', 'Fungicide application', 'Prune infected areas'],
                'organic_solutions': ['Sulfur dust', 'Milk spray solution', 'Baking soda'],
                'severity_level': 'Medium'
            },
            'rust': {
                'symptoms': ['Orange-brown pustules', 'Leaf yellowing', 'Early defoliation'],
                'causes': ['Rust fungus', 'High humidity'],
                'treatments': ['Fungicide spray', 'Remove infected leaves', 'Improve air flow'],
                'organic_solutions': ['Sulfur', 'Neem oil', 'Copper fungicide'],
                'severity_level': 'Medium'
            },
            'healthy': {
                'symptoms': ['Normal green color', 'No lesions', 'Vigorous growth'],
                'causes': ['None - plant is healthy'],
                'treatments': ['Regular watering', 'Fertilization', 'Pruning'],
                'organic_solutions': ['Continue normal care', 'Compost application', 'Mulching'],
                'severity_level': 'None'
            }
        },
        'potato': {
            'early_blight': {
                'symptoms': ['Brown necrotic spots', 'Concentric rings', 'Yellow halos'],
                'causes': ['Alternaria solani', 'Warm moist conditions'],
                'treatments': ['Fungicide spray', 'Crop rotation', 'Remove crop debris'],
                'organic_solutions': ['Copper fungicide', 'Sulfur', 'Bacillus subtilis'],
                'severity_level': 'High'
            },
            'late_blight': {
                'symptoms': ['Water-soaked spots on leaves and stems', 'White mold on undersides'],
                'causes': ['Phytophthora infestans', 'Cool humid weather'],
                'treatments': ['Immediate fungicide', 'Remove infected plants', 'Improve drainage'],
                'organic_solutions': ['Copper compound', 'Bordeaux mixture', 'Mancozeb'],
                'severity_level': 'Critical'
            },
            'healthy': {
                'symptoms': ['Green foliage', 'No spots or lesions', 'Normal growth'],
                'causes': ['None - plant is healthy'],
                'treatments': ['Regular watering', 'Hilling up soil', 'Weed control'],
                'organic_solutions': ['Continue good practices', 'Mulching', 'Crop rotation'],
                'severity_level': 'None'
            }
        },
        'rice': {
            'leaf_spot': {
                'symptoms': ['Brown oval spots on leaves', 'Yellow borders'],
                'causes': ['Fungal infection', 'High humidity'],
                'treatments': ['Fungicide spray', 'Improve drainage', 'Good hygiene'],
                'organic_solutions': ['Trichoderma', 'Pseudomonas fluorescens', 'Copper sulfate'],
                'severity_level': 'Low'
            },
            'rust': {
                'symptoms': ['Orange-brown pustules on leaves', 'Reduced photosynthesis'],
                'causes': ['Puccinia graminis', 'High humidity'],
                'treatments': ['Fungicide application', 'Remove infected leaves', 'Monitor spread'],
                'organic_solutions': ['Sulfur', 'Neem oil', 'Bioagents'],
                'severity_level': 'Medium'
            },
            'healthy': {
                'symptoms': ['Golden tillers', 'Healthy panicles', 'No discoloration'],
                'causes': ['None - plant is healthy'],
                'treatments': ['Regular irrigation', 'Nutrient management', 'Pest monitoring'],
                'organic_solutions': ['Organic FYM', 'Biofertilizers', 'Vermicompost'],
                'severity_level': 'None'
            }
        },
        'wheat': {
            'powdery_mildew': {
                'symptoms': ['White powder on leaves', 'Leaf discoloration'],
                'causes': ['Blumeria graminis', 'Dry weather'],
                'treatments': ['Sulfur dust', 'Fungicide spray', 'Improve air circulation'],
                'organic_solutions': ['Sulfur', 'Potassium bicarbonate', 'Neem oil'],
                'severity_level': 'Medium'
            },
            'rust': {
                'symptoms': ['Brown -red pustules', 'Leaf yellowing', 'Stem rust'],
                'causes': ['Puccinia species', 'Moisture and cool weather'],
                'treatments': ['Fungicide spray', 'Resistant varieties', 'Timely sowing'],
                'organic_solutions': ['Sulfur dust', 'Copper sulfate', 'Bioagents'],
                'severity_level': 'High'
            },
            'healthy': {
                'symptoms': ['Green leaves', 'Normal heads', 'Vigorous growth'],
                'causes': ['None - plant is healthy'],
                'treatments': ['Proper irrigation', 'Weed management', 'Nutrient supply'],
                'organic_solutions': ['Vermicompost', 'Biofertilizers', 'Mulching'],
                'severity_level': 'None'
            }
        }
    }
    
    def __init__(self, img_height=224, img_width=224):
        self.img_height = img_height
        self.img_width = img_width
        self.model = None
        self.class_names = None
        self.metrics = {}
        
    def build_model(self, num_classes):
        """
        Build CNN model using MobileNetV2 as base (lightweight for production)
        Transfer learning approach for better accuracy
        """
        print("[*] Building CNN model with MobileNetV2 transfer learning...")
        
        # Load pre-trained MobileNetV2
        base_model = keras.applications.MobileNetV2(
            input_shape=(self.img_height, self.img_width, 3),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers
        base_model.trainable = False
        
        # Create custom top layers
        model = models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dense(512, activation='relu', name='fc1'),
            layers.Dropout(0.3),
            layers.Dense(256, activation='relu', name='fc2'),
            layers.Dropout(0.3),
            layers.Dense(128, activation='relu', name='fc3'),
            layers.Dropout(0.2),
            layers.Dense(num_classes, activation='softmax', name='output')
        ])
        
        # Compile model
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        print("[+] Model built successfully!")
        return model
    
    def create_synthetic_images(self, num_samples=1000):
        """
        Create synthetic training data for demonstration
        In production, use actual PlantVillage dataset
        """
        print("[*] Generating synthetic training images...")
        
        crops = list(self.DISEASE_DATA.keys())
        diseases_by_crop = {
            crop: list(diseases.keys()) for crop, diseases in self.DISEASE_DATA.items()
        }
        
        X_train = []
        y_train = []
        
        # Generate synthetic images
        for crop_idx, crop in enumerate(crops):
            diseases = diseases_by_crop[crop]
            samples_per_disease = num_samples // len(crops) // len(diseases)
            
            for disease_idx, disease in enumerate(diseases):
                for _ in range(samples_per_disease):
                    # Create random synthetic image (in production, use real images)
                    image = np.random.randint(0, 256, (self.img_height, self.img_width, 3), dtype=np.uint8)
                    X_train.append(image / 255.0)
                    
                    # Create label
                    label = f"{crop}_{disease}"
                    y_train.append(label)
        
        print(f"[+] Generated {len(X_train)} synthetic images")
        return np.array(X_train), y_train
    
    def prepare_data(self, X_train, y_train):
        """Prepare training data"""
        # Get unique classes
        unique_classes = sorted(list(set(y_train)))
        self.class_names = unique_classes
        
        print(f"[+] Found {len(unique_classes)} disease classes")
        
        # Encode labels
        class_to_idx = {cls: idx for idx, cls in enumerate(unique_classes)}
        y_encoded = np.array([class_to_idx[cls] for cls in y_train])
        y_onehot = keras.utils.to_categorical(y_encoded, num_classes=len(unique_classes))
        
        return X_train, y_onehot, len(unique_classes)
    
    def train(self, X_train, y_train, epochs=10, batch_size=32):
        """Train the model"""
        print("[*] Training disease detection model...")
        
        # Data augmentation
        datagen = ImageDataGenerator(
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        
        # Create batches
        train_generator = datagen.flow(X_train, y_train, batch_size=batch_size)
        
        # Train model
        history = self.model.fit(
            train_generator,
            steps_per_epoch=len(X_train) // batch_size,
            epochs=epochs,
            verbose=1
        )
        
        print("[+] Model training completed!")
        return history
    
    def predict_disease(self, image_path=None, image_array=None):
        """
        Predict disease from image
        Returns disease info with treatment recommendations
        """
        if image_path:
            # Load image from file
            from tensorflow.keras.preprocessing import image
            img = image.load_img(image_path, target_size=(self.img_height, self.img_width))
            img_array = image.img_to_array(img) / 255.0
        elif image_array is not None:
            img_array = image_array.reshape(1, self.img_height, self.img_width, 3)
        else:
            raise ValueError("Provide either image_path or image_array")
        
        # Make prediction
        predictions = self.model.predict(np.array([img_array[0]]))
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        
        # Parse predicted class
        predicted_class = self.class_names[predicted_idx]
        crop, disease = predicted_class.rsplit('_', 1)
        
        # Get disease information
        disease_info = self.DISEASE_DATA.get(crop, {}).get(disease, {})
        
        return {
            'crop_type': crop,
            'disease_name': disease,
            'confidence': round(confidence, 4),
            'severity_level': disease_info.get('severity_level', 'Unknown'),
            'symptoms': disease_info.get('symptoms', []),
            'causes': disease_info.get('causes', []),
            'treatment_recommendations': disease_info.get('treatments', []),
            'organic_solutions': disease_info.get('organic_solutions', []),
            'all_classes_confidence': {
                self.class_names[i]: float(predictions[0][i]) 
                for i in range(len(self.class_names))
            }
        }
    
    def save_model(self, model_dir='models'):
        """Save trained model"""
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, 'disease_detection_model.h5')
        classes_path = os.path.join(model_dir, 'disease_classes.json')
        
        self.model.save(model_path)
        
        with open(classes_path, 'w') as f:
            json.dump(self.class_names, f)
        
        print(f"[+] Disease detection model saved to {model_path}")
        print(f"[+] Classes saved to {classes_path}")
    
    def load_model(self, model_dir='models'):
        """Load trained model"""
        model_path = os.path.join(model_dir, 'disease_detection_model.h5')
        classes_path = os.path.join(model_dir, 'disease_classes.json')
        
        self.model = keras.models.load_model(model_path)
        
        with open(classes_path, 'r') as f:
            self.class_names = json.load(f)
        
        print(f"[+] Disease detection model loaded from {model_path}")


def main():
    """Main training pipeline"""
    print("=" * 60)
    print("DISEASE DETECTION MODEL - TRAINING PIPELINE")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Initialize model
    disease_model = DiseaseDetectionModel(img_height=224, img_width=224)
    
    # Create synthetic dataset
    print("\n[*] Preparing training data...")
    X_train, y_train = disease_model.create_synthetic_images(num_samples=800)
    X_train, y_train_encoded, num_classes = disease_model.prepare_data(X_train, y_train)
    
    # Build model
    disease_model.build_model(num_classes=num_classes)
    
    # Train model
    print("\n[*] Starting model training...")
    history = disease_model.train(X_train, y_train_encoded, epochs=5, batch_size=16)
    
    # Save model
    disease_model.save_model()
    
    # Test prediction
    print("\n[*] Testing prediction on synthetic image...")
    test_image = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8) / 255.0
    result = disease_model.predict_disease(image_array=test_image)
    
    print("\n[+] Prediction Result:")
    print(f"    Crop: {result['crop_type']}")
    print(f"    Disease: {result['disease_name']}")
    print(f"    Confidence: {result['confidence']}")
    print(f"    Severity: {result['severity_level']}")
    print(f"    Symptoms: {', '.join(result['symptoms'][:2])}")
    print(f"    Treatment: {', '.join(result['treatment_recommendations'][:2])}")
    print(f"    Organic Solutions: {', '.join(result['organic_solutions'][:2])}")
    
    print("\n" + "=" * 60)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)


if __name__ == "__main__":
    main()
