"""
AgriSmart Plant Disease Detection Model Training Script
Trains a CNN classifier using MobileNetV2 transfer learning on plant disease dataset
"""

import os
import sys
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.optimizers import Adam
from sklearn.metrics import classification_report, confusion_matrix
import warnings

warnings.filterwarnings('ignore')

# Configuration
DATASET_PATH = 'datasets/plant_disease'
MODEL_SAVE_PATH = 'models/disease_model.h5'
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
VALIDATION_SPLIT = 0.2
LEARNING_RATE = 0.01

def check_gpu():
    """Check if GPU is available"""
    print("\n💻 GPU Configuration:")
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        print(f"✓ GPU(s) detected: {len(gpus)} GPU(s)")
        for gpu in gpus:
            print(f"  - {gpu}")
    else:
        print("⚠ No GPU detected - using CPU (slower)")
    
    # Set memory growth
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print("✓ GPU memory growth enabled")
    except:
        pass

def check_dataset(path):
    """Check if dataset exists and has proper structure"""
    print(f"\n📂 Checking dataset at {path}...")
    
    if not os.path.exists(path):
        print(f"❌ Dataset directory not found at {path}")
        print("\nExpected structure:")
        print(f"  {path}/")
        print(f"    ├── class1/")
        print(f"    │   ├── image1.jpg")
        print(f"    │   └── image2.jpg")
        print(f"    ├── class2/")
        print(f"    └── class3/")
        sys.exit(1)
    
    # Count classes and images
    classes = [d for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))]
    classes.sort()
    
    if not classes:
        print(f"❌ No disease class directories found in {path}")
        sys.exit(1)
    
    print(f"✓ Found {len(classes)} disease classes:")
    
    total_images = 0
    for cls in classes:
        cls_path = os.path.join(path, cls)
        images = [f for f in os.listdir(cls_path) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]
        total_images += len(images)
        print(f"   - {cls}: {len(images)} images")
    
    print(f"✓ Total images: {total_images}")
    
    if total_images == 0:
        print("❌ No images found in dataset")
        sys.exit(1)
    
    return len(classes), total_images

def create_data_generators():
    """Create ImageDataGenerator with augmentation for training and validation"""
    print(f"\n🔧 Creating data generators...")
    
    # Training data generator with augmentation
    train_datagen = ImageDataGenerator(
        rescale=1.0/255.0,
        rotation_range=20,           # Random rotation
        width_shift_range=0.2,        # Random horizontal shift
        height_shift_range=0.2,       # Random vertical shift
        shear_range=0.2,              # Random shear
        zoom_range=0.2,               # Random zoom
        horizontal_flip=True,         # Random horizontal flip
        fill_mode='nearest',
        validation_split=VALIDATION_SPLIT
    )
    
    # Test data generator (only rescaling)
    test_datagen = ImageDataGenerator(rescale=1.0/255.0)
    
    print(f"✓ Training data generator created with augmentation:")
    print(f"   - Rotation: 20°")
    print(f"   - Width shift: 20%")
    print(f"   - Height shift: 20%")
    print(f"   - Shear: 20%")
    print(f"   - Zoom: 20%")
    print(f"   - Horizontal flip: Yes")
    print(f"✓ Validation split: {VALIDATION_SPLIT*100:.0f}%")
    
    return train_datagen, test_datagen

def load_data_generators(train_datagen, test_datagen):
    """Load data using flow_from_directory"""
    print(f"\n📥 Loading training and validation data...")
    
    # Training data
    train_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        color_mode='rgb',
        seed=42
    )
    
    # Validation data
    validation_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        color_mode='rgb',
        seed=42
    )
    
    print(f"✓ Training samples: {train_generator.samples}")
    print(f"✓ Validation samples: {validation_generator.samples}")
    print(f"✓ Number of classes: {train_generator.num_classes}")
    print(f"✓ Classes: {sorted(train_generator.class_indices.items())}")
    
    return train_generator, validation_generator

def build_model(num_classes):
    """Build CNN model using MobileNetV2 transfer learning"""
    print(f"\n🏗️  Building model with MobileNetV2 transfer learning...")
    
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers
    base_model.trainable = False
    print(f"✓ MobileNetV2 loaded with imagenet weights")
    print(f"✓ Base model layers frozen for transfer learning")
    
    # Build custom head
    model = keras.Sequential([
        layers.Input(shape=(*IMAGE_SIZE, 3)),
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu', name='dense_1'),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu', name='dense_2'),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu', name='dense_3'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax', name='output')
    ])
    
    # Compile model
    optimizer = Adam(learning_rate=LEARNING_RATE)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
    )
    
    print(f"✓ Model architecture created:")
    print(f"   - MobileNetV2 base (frozen)")
    print(f"   - Global Average Pooling")
    print(f"   - Dense 512 + Dropout 0.5")
    print(f"   - Dense 256 + Dropout 0.3")
    print(f"   - Dense 128 + Dropout 0.2")
    print(f"   - Output Dense {num_classes} (softmax)")
    print(f"✓ Optimizer: Adam (lr={LEARNING_RATE})")
    print(f"✓ Loss: Categorical Crossentropy")
    
    return model, base_model

def train_model(model, train_gen, val_gen):
    """Train the model"""
    print(f"\n🤖 Training model for {EPOCHS} epochs...")
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Calculate steps
    steps_per_epoch = max(1, train_gen.samples // BATCH_SIZE)
    validation_steps = max(1, val_gen.samples // BATCH_SIZE)
    
    print(f"✓ Steps per epoch: {steps_per_epoch}")
    print(f"✓ Validation steps: {validation_steps}")
    
    # Train model
    history = model.fit(
        train_gen,
        steps_per_epoch=steps_per_epoch,
        epochs=EPOCHS,
        validation_data=val_gen,
        validation_steps=validation_steps,
        callbacks=callbacks,
        verbose=1
    )
    
    print(f"✓ Training completed")
    
    return history

def unfreeze_and_finetune(model, base_model, train_gen, val_gen):
    """Unfreeze some base model layers and continue training"""
    print(f"\n🔓 Unfreezing base model layers for fine-tuning...")
    
    # Unfreeze last 50 layers of base model
    base_model.trainable = True
    for layer in base_model.layers[:-50]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE / 10),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"✓ Last 50 layers unfrozen for fine-tuning")
    print(f"✓ Learning rate reduced to {LEARNING_RATE / 10}")
    
    # Fine-tune
    epochs_finetune = 10
    print(f"✓ Fine-tuning for {epochs_finetune} additional epochs...")
    
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        )
    ]
    
    steps_per_epoch = max(1, train_gen.samples // BATCH_SIZE)
    validation_steps = max(1, val_gen.samples // BATCH_SIZE)
    
    history_finetune = model.fit(
        train_gen,
        steps_per_epoch=steps_per_epoch,
        epochs=epochs_finetune,
        validation_data=val_gen,
        validation_steps=validation_steps,
        callbacks=callbacks,
        verbose=1
    )
    
    print(f"✓ Fine-tuning completed")
    
    return history_finetune

def evaluate_model(model, val_gen):
    """Evaluate model on validation set"""
    print(f"\n📈 Evaluating model on validation set...")
    
    # Evaluate
    val_loss, val_accuracy, val_top3_accuracy = model.evaluate(val_gen, verbose=0)
    
    print(f"✓ Validation Loss: {val_loss:.4f}")
    print(f"✓ Validation Accuracy: {val_accuracy:.4f} ({val_accuracy*100:.2f}%)")
    print(f"✓ Top-3 Accuracy: {val_top3_accuracy:.4f} ({val_top3_accuracy*100:.2f}%)")
    
    return val_accuracy

def save_model(model):
    """Save trained model"""
    print(f"\n💾 Saving model...")
    
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    model.save(MODEL_SAVE_PATH)
    
    file_size = os.path.getsize(MODEL_SAVE_PATH) / (1024 * 1024)
    print(f"✓ Model saved to {MODEL_SAVE_PATH}")
    print(f"✓ Model size: {file_size:.2f} MB")
    
    # Verify
    if os.path.exists(MODEL_SAVE_PATH):
        print(f"✓ Model saved successfully")
    else:
        print(f"❌ Error saving model")
        sys.exit(1)

def test_model_inference(model, train_gen):
    """Test model inference with sample images"""
    print(f"\n🧪 Testing model inference...")
    
    # Get a batch of test data
    test_images, test_labels = next(iter(train_gen))
    
    # Make predictions
    predictions = model.predict(test_images[:5], verbose=0)
    
    print(f"✓ Sample predictions:")
    for i, (pred, label) in enumerate(zip(predictions[:3], test_labels[:3])):
        predicted_class = np.argmax(pred)
        predicted_prob = pred[predicted_class]
        actual_class = np.argmax(label)
        
        class_names = list(train_gen.class_indices.keys())
        actual_name = class_names[actual_class]
        predicted_name = class_names[predicted_class]
        
        print(f"   Sample {i+1}: Predicted={predicted_name} ({predicted_prob*100:.2f}%), Actual={actual_name}")

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("🌿 AgriSmart Plant Disease Detection Model Training")
    print("=" * 60)
    
    try:
        # Step 1: Check GPU
        check_gpu()
        
        # Step 2: Check dataset
        num_classes, total_images = check_dataset(DATASET_PATH)
        
        # Step 3: Create data generators
        train_datagen, test_datagen = create_data_generators()
        
        # Step 4: Load data
        train_gen, val_gen = load_data_generators(train_datagen, test_datagen)
        
        # Step 5: Build model
        model, base_model = build_model(train_gen.num_classes)
        
        # Step 6: Display model summary
        print(f"\n📋 Model Summary:")
        model.summary()
        
        # Step 7: Train model
        history = train_model(model, train_gen, val_gen)
        
        # Step 8: Fine-tune
        history_finetune = unfreeze_and_finetune(model, base_model, train_gen, val_gen)
        
        # Step 9: Evaluate model
        accuracy = evaluate_model(model, val_gen)
        
        # Step 10: Save model
        save_model(model)
        
        # Step 11: Test inference
        test_model_inference(model, train_gen)
        
        print("\n" + "=" * 60)
        print(f"✅ Training completed successfully!")
        print(f"   Validation Accuracy: {accuracy*100:.2f}%")
        print(f"   Model saved: {MODEL_SAVE_PATH}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during training: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
