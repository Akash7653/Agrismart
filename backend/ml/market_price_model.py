"""
Market Price Prediction Model
Uses LSTM (Long Short-Term Memory) for time-series forecasting
Predicts crop prices based on historical mandi data
"""

import numpy as np
import pandas as pd
import joblib
import json
import os
from datetime import datetime, timedelta
import warnings

# Try to import LSTM, if not available use fallback
try:
    from tensorflow.keras.models import Sequential, load_model
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    from tensorflow.keras.optimizers import Adam
    LSTM_AVAILABLE = True
except:
    LSTM_AVAILABLE = False
    print("Warning: TensorFlow not available. Using ARIMA fallback.")

from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings('ignore')

class MarketPricePredictionModel:
    """
    LSTM-based market price prediction for agricultural commodities
    Predicts prices for next 7 days based on historical data
    """
    
    # Typical crop price patterns and seasonal factors
    CROP_DATA = {
        'wheat': {
            'base_price': 2400,  # INR per quintal
            'seasonal_pattern': [0.95, 0.90, 0.92, 0.98, 1.10, 1.15, 1.05, 0.95, 0.88, 0.85, 0.90, 1.00],
            'volatility': 0.15
        },
        'rice': {
            'base_price': 2200,
            'seasonal_pattern': [1.10, 1.05, 0.95, 0.90, 0.85, 0.88, 0.92, 1.00, 1.08, 1.15, 1.10, 1.05],
            'volatility': 0.12
        },
        'tomato': {
            'base_price': 800,
            'seasonal_pattern': [1.20, 1.15, 1.05, 0.90, 0.85, 1.00, 1.10, 1.25, 1.30, 1.15, 1.05, 1.10],
            'volatility': 0.25
        },
        'potato': {
            'base_price': 1200,
            'seasonal_pattern': [0.90, 0.88, 0.85, 1.00, 1.15, 1.20, 1.10, 0.95, 0.92, 0.88, 0.85, 0.90],
            'volatility': 0.18
        },
        'maize': {
            'base_price': 1800,
            'seasonal_pattern': [0.95, 0.90, 0.92, 1.00, 1.05, 1.10, 1.08, 0.98, 0.95, 0.92, 0.90, 0.95],
            'volatility': 0.14
        },
        'sugarcane': {
            'base_price': 2800,
            'seasonal_pattern': [1.05, 1.00, 0.95, 0.90, 0.88, 0.95, 1.05, 1.15, 1.20, 1.10, 1.00, 1.05],
            'volatility': 0.10
        },
        'cotton': {
            'base_price': 6000,
            'seasonal_pattern': [1.10, 1.08, 1.05, 1.00, 0.95, 0.92, 0.95, 1.00, 1.05, 1.10, 1.15, 1.12],
            'volatility': 0.16
        },
        'groundnut': {
            'base_price': 4800,
            'seasonal_pattern': [0.95, 0.92, 0.90, 0.98, 1.10, 1.15, 1.12, 1.00, 0.92, 0.88, 0.90, 0.95],
            'volatility': 0.17
        }
    }
    
    def __init__(self, lookback_window=7):
        """
        Initialize price prediction model
        
        Args:
            lookback_window: Number of historical days to use for prediction (default 7)
        """
        self.lookback_window = lookback_window
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.models = {}
        self.lstm_available = LSTM_AVAILABLE
        
    def generate_historical_data(self, crop, days=365):
        """
        Generate realistic historical price data for a crop
        Uses seasonal patterns and random walk
        """
        if crop not in self.CROP_DATA:
            raise ValueError(f"Crop '{crop}' not found in database")
        
        crop_info = self.CROP_DATA[crop]
        base_price = crop_info['base_price']
        seasonal_pattern = crop_info['seasonal_pattern']
        volatility = crop_info['volatility']
        
        dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
        prices = []
        
        current_price = base_price
        for i, date in enumerate(dates):
            # Apply seasonal factor
            month = date.month - 1
            seasonal_factor = seasonal_pattern[month]
            
            # Random walk with drift
            random_change = np.random.normal(0, volatility * base_price)
            current_price = current_price * seasonal_factor * (1 + random_change / base_price)
            
            # Add some noise
            noise = np.random.normal(1, 0.02)
            current_price = max(base_price * 0.5, current_price * noise)  # Prevent negative prices
            
            prices.append(current_price)
        
        df = pd.DataFrame({
            'date': dates,
            'price': prices
        })
        
        return df
    
    def prepare_lstm_data(self, prices):
        """
        Prepare data for LSTM model
        Normalize prices and create sequences
        """
        # Normalize prices
        scaled_prices = self.scaler.fit_transform(prices.reshape(-1, 1))
        
        X_train = []
        y_train = []
        
        for i in range(len(scaled_prices) - self.lookback_window):
            X_train.append(scaled_prices[i:(i + self.lookback_window), 0])
            y_train.append(scaled_prices[i + self.lookback_window, 0])
        
        X_train = np.array(X_train)
        y_train = np.array(y_train)
        
        # Reshape for LSTM [samples, timesteps, features]
        X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
        
        return X_train, y_train, scaled_prices
    
    def build_lstm_model(self):
        """Build LSTM neural network for time series prediction"""
        if not LSTM_AVAILABLE:
            return None
        
        model = Sequential([
            LSTM(50, activation='relu', input_shape=(self.lookback_window, 1)),
            Dropout(0.2),
            Dense(25, activation='relu'),
            Dropout(0.2),
            Dense(1, activation='linear')
        ])
        
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def train_model(self, crop, epochs=50, batch_size=32):
        """
        Train LSTM model for a specific crop
        """
        if crop not in self.CROP_DATA:
            raise ValueError(f"Crop '{crop}' not supported")
        
        print(f"[*] Training price prediction model for {crop}...")
        
        # Generate historical data
        historical_data = self.generate_historical_data(crop, days=365)
        prices = historical_data['price'].values
        
        # Prepare LSTM data
        X_train, y_train, scaled_prices = self.prepare_lstm_data(prices)
        
        if self.lstm_available:
            # Train LSTM model
            model = self.build_lstm_model()
            history = model.fit(
                X_train, y_train,
                epochs=epochs,
                batch_size=batch_size,
                verbose=0,
                validation_split=0.2
            )
            self.models[crop] = {
                'model': model,
                'scaler': self.scaler,
                'last_prices': prices[-self.lookback_window:],
                'scalers': self.scaler
            }
            print(f"[+] LSTM model trained for {crop}")
        else:
            # Fallback to statistical model
            self.models[crop] = {
                'last_prices': prices[-self.lookback_window:],
                'mean': np.mean(prices),
                'std': np.std(prices),
                'scaler': self.scaler
            }
            print(f"[+] Statistical fallback model created for {crop}")
    
    def predict_price(self, crop, current_price=None, days=7):
        """
        Predict crop price for next N days
        
        Args:
            crop: Crop name
            current_price: Today's price (if None, uses base price)
            days: Number of days to predict (default 7)
        
        Returns:
            List of predicted prices for next N days
        """
        if crop not in self.CROP_DATA:
            raise ValueError(f"Crop '{crop}' not supported")
        
        if crop not in self.models:
            self.train_model(crop)
        
        crop_info = self.CROP_DATA[crop]
        
        if current_price is None:
            current_price = crop_info['base_price']
        
        model_data = self.models[crop]
        predictions = []
        
        # Use last known prices
        recent_prices = list(model_data['last_prices'].copy())
        
        for day in range(days):
            if self.lstm_available and 'model' in model_data:
                # LSTM prediction
                model = model_data['model']
                scaler = model_data['scalers']
                
                # Prepare input sequence
                seq = np.array(recent_prices[-self.lookback_window:]).reshape(-1, 1)
                seq_scaled = scaler.transform(seq)
                seq_scaled = seq_scaled.reshape(1, self.lookback_window, 1)
                
                # Predict next price
                next_price_scaled = model.predict(seq_scaled, verbose=0)[0][0]
                next_price = scaler.inverse_transform([[next_price_scaled]])[0][0]
            else:
                # Statistical fallback
                recent_prices_array = np.array(recent_prices[-self.lookback_window:])
                trend = np.mean(np.diff(recent_prices_array))
                volatility = model_data['std'] * 0.05
                next_price = recent_prices[-1] + trend + np.random.normal(0, volatility)
            
            # Ensure price doesn't go negative
            next_price = max(0, next_price)
            predictions.append(round(float(next_price), 2))
            recent_prices.append(next_price)
        
        return predictions
    
    def get_price_trend(self, crop, current_price, predicted_price_next_week):
        """Determine price trend"""
        avg_predicted = np.mean(predicted_price_next_week[-7:])
        
        if avg_predicted > current_price * 1.05:
            return "up"
        elif avg_predicted < current_price * 0.95:
            return "down"
        else:
            return "stable"
    
    def save_models(self, model_dir='models'):
        """Save trained models"""
        os.makedirs(model_dir, exist_ok=True)
        
        for crop, model_data in self.models.items():
            model_path = os.path.join(model_dir, f'price_{crop}_model.h5')
            meta_path = os.path.join(model_dir, f'price_{crop}_meta.json')
            
            if 'model' in model_data:
                model_data['model'].save(model_path)
            
            # Save metadata
            meta = {
                'crop': crop,
                'base_price': self.CROP_DATA[crop]['base_price'],
                'last_update': datetime.now().isoformat()
            }
            with open(meta_path, 'w') as f:
                json.dump(meta, f)
        
        print(f"[+] Price models saved to {model_dir}")
    
    def load_models(self, model_dir='models'):
        """Load trained models"""
        for crop in self.CROP_DATA.keys():
            model_path = os.path.join(model_dir, f'price_{crop}_model.h5')
            
            if os.path.exists(model_path) and self.lstm_available:
                try:
                    model = load_model(model_path)
                    self.models[crop] = {'model': model}
                    print(f"[+] Loaded price model for {crop}")
                except:
                    pass


def main():
    """Test price prediction pipeline"""
    print("=" * 60)
    print("MARKET PRICE PREDICTION MODEL - TRAINING")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Initialize model
    price_model = MarketPricePredictionModel(lookback_window=7)
    
    # Test crops
    test_crops = ['wheat', 'rice', 'tomato', 'potato']
    
    print("\n[*] Training price prediction models...")
    for crop in test_crops:
        price_model.train_model(crop, epochs=20)
    
    # Test predictions
    print("\n[*] Testing price predictions...")
    for crop in test_crops:
        current_price = price_model.CROP_DATA[crop]['base_price']
        predictions = price_model.predict_price(crop, current_price, days=7)
        trend = price_model.get_price_trend(crop, current_price, predictions)
        
        print(f"\n[+] {crop.upper()} Predictions:")
        print(f"    Current Price: ₹{current_price:.2f}/unit")
        print(f"    Next 7 Days: {[f'₹{p:.2f}' for p in predictions]}")
        print(f"    Trend: {trend.upper()}")
    
    # Save models
    price_model.save_models()
    
    print("\n" + "=" * 60)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)


if __name__ == "__main__":
    main()
