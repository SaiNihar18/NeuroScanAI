#!/usr/bin/env python3
"""
Test script to verify model loading and prediction functionality
"""

import os
import sys
from PIL import Image
import numpy as np
from tensorflow.keras.applications.xception import preprocess_input

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

try:
    from app.model_loader import model, index_to_class
    print("✅ Model loaded successfully!")
    print(f"Model input shape: {model.input_shape}")
    print(f"Class indices: {index_to_class}")
    
    # Test with a dummy image
    print("\n🧪 Testing with dummy image...")
    try:
        # Create a dummy RGB image
        dummy_image = Image.new('RGB', (299, 299), color='red')
        
        # Preprocess
        img_array = np.expand_dims(np.array(dummy_image), axis=0)
        img_array = preprocess_input(img_array)
        
        # Predict
        print("🔮 Running prediction...")
        predictions = model.predict(img_array)
        print(f"Prediction shape: {predictions.shape}")
        print(f"Predictions: {predictions}")
        
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        predicted_class = index_to_class.get(predicted_index, "Unknown")
        
        print(f"✅ Prediction successful!")
        print(f"  Predicted class: {predicted_class}")
        print(f"  Confidence: {confidence}")
        
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        import traceback
        traceback.print_exc()
        
except Exception as e:
    print(f"❌ Error loading model: {e}")
    import traceback
    traceback.print_exc()