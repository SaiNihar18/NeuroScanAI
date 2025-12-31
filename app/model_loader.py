import json
import os
import time
import tensorflow as tf

print("🔄 Recreating EXACT model architecture from training code...")
print("📁 Checking model file exists...")

# Verify model file exists and get size
MODEL_PATH = os.path.join("model", "brain_tumor_model.keras")
CLASS_INDEX_PATH = os.path.join("model", "tumor_class_indices.json")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("❌ brain_tumor_model.keras NOT FOUND! Put it in model/ folder.")

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

# Load class indices
with open(CLASS_INDEX_PATH, "r") as f:
    class_indices = json.load(f)

# Reverse mapping: index → class label
index_to_class = {v: k for k, v in class_indices.items()}

# Class names in order
CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary']
