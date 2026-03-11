import json
import os
import time

# Try to import TensorFlow, but make it optional for development
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("⚠️  TensorFlow not available. Running in development mode (predictions disabled).")

print("🔄 Recreating EXACT model architecture from training code...")
print("📁 Checking model file exists...")

# Verify model file exists and get size
# Get the parent directory of backend (which is the project root)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
MODEL_PATH = os.path.join(PROJECT_ROOT, "ml", "model", "brain_tumor_model.keras")
CLASS_INDEX_PATH = os.path.join(PROJECT_ROOT, "ml", "model", "tumor_class_indices.json")

# Load model only if TensorFlow is available
model = None
if TF_AVAILABLE and os.path.exists(MODEL_PATH):
    model_size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print(f"✅ Model file found: {model_size_mb:.1f} MB")
    
    print("🔄 Loading Keras saved model (.keras)...")
    load_start = time.time()
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    load_time = time.time() - load_start
    
    print("⚙️ Compiling model for inference...")
    model.compile(optimizer='adamax', loss='categorical_crossentropy', metrics=['accuracy'])
    
    # VERIFICATION
    total_params = model.count_params()
    print(f"✅ Model loaded in {load_time:.1f}s!")
    print(f"📏 Total parameters: {total_params:,} ({total_params/1e6:.1f}M)")
    print(f"📏 Input shape: {model.input_shape}")
    print(f"📏 Output shape: {model.output_shape}")
    print("🎯 READY - YOUR MODEL IS ACTIVE!")
else:
    print("⚠️  Model not loaded (TensorFlow unavailable or model file not found)")

# Load class indices
with open(CLASS_INDEX_PATH, "r") as f:
    class_indices = json.load(f)

# Reverse mapping: index → class label
index_to_class = {v: k for k, v in class_indices.items()}

# Class names in order
CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary']
