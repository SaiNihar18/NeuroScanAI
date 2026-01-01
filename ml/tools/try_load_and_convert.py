"""
try_load_and_convert.py

This script attempts multiple safe ways to load an existing .h5 Keras model.
If successful it saves a modern .keras file: brain_tumor_model.keras
It also prints helpful diagnostics.

Run:
    python tools/try_load_and_convert.py
"""

import os
import traceback
from pathlib import Path

MODEL_H5 = Path("model/brain_tumor_classifier_model.h5")
OUTPUT_KERAS = Path("model/brain_tumor_model.keras")

if not MODEL_H5.exists():
    print(f"ERROR: {MODEL_H5} not found. Place your .h5 model there and re-run.")
    raise SystemExit(1)

print("Using Python:", os.sys.version)
print("Model path:", MODEL_H5.resolve())

# Attempt 1: TensorFlow Keras load_model with compile=False
try:
    import tensorflow as tf
    print("\nAttempt 1: tf.keras.models.load_model(..., compile=False)")
    model = tf.keras.models.load_model(str(MODEL_H5), compile=False)
    print("✅ Loaded with tf.keras successfully.")
    print("Model summary (first 20 lines):")
    summary_lines = []
    model.summary(print_fn=lambda s: summary_lines.append(s))
    for ln in summary_lines[:20]:
        print(ln)
    # Save in new format
    model.save(OUTPUT_KERAS, save_format="keras")
    print(f"Saved converted model as: {OUTPUT_KERAS}")
    raise SystemExit(0)
except Exception as e:
    print("❌ Attempt 1 failed:")
    traceback.print_exc()

# Attempt 2: standalone keras (if installed)
try:
    print("\nAttempt 2: keras.models.load_model(..., compile=False) — standalone keras")
    import keras
    model = keras.models.load_model(str(MODEL_H5), compile=False)
    print("✅ Loaded with standalone keras successfully.")
    summary_lines = []
    model.summary(print_fn=lambda s: summary_lines.append(s))
    for ln in summary_lines[:20]:
        print(ln)
    model.save(OUTPUT_KERAS, save_format="keras")
    print(f"Saved converted model as: {OUTPUT_KERAS}")
    raise SystemExit(0)
except Exception:
    print("❌ Attempt 2 failed (standalone keras). Continuing...")
    traceback.print_exc()

# Attempt 3: Rebuild the architecture (Xception base + Flatten + Dense as in your training code),
# then try to load weights by name from HDF5. This often works when full-model deserialization fails.
try:
    print("\nAttempt 3: Rebuild architecture & load weights by name")

    import tensorflow as tf
    from tensorflow.keras import Sequential
    from tensorflow.keras.layers import Flatten, Dropout, Dense
    from tensorflow.keras.applications import Xception

    input_shape = (299, 299, 3)
    base = tf.keras.applications.Xception(include_top=False, weights="imagenet",
                                          input_shape=input_shape, pooling='max')

    rebuilt = Sequential([
        base,
        Flatten(),
        Dropout(rate=0.3),
        Dense(128, activation='relu', name='feature_layer'),
        Dropout(rate=0.25),
        Dense(4, activation='softmax', name='classification_layer')
    ])
    print("Rebuilt model architecture. Now attempting to load weights (by_name=True) from .h5")
    # load_weights can accept a full .h5 if weights are stored in HDF5 groups by layer names.
    rebuilt.load_weights(str(MODEL_H5), by_name=True)
    print("✅ Weights loaded by name. Validate with a summary (first 20 lines):")
    summary_lines = []
    rebuilt.summary(print_fn=lambda s: summary_lines.append(s))
    for ln in summary_lines[:20]:
        print(ln)
    # Optionally run a dummy predict to ensure graph builds
    import numpy as np
    dummy = np.zeros((1, 299, 299, 3), dtype=np.float32)
    try:
        preds = rebuilt.predict(dummy)
        print("Dummy predict succeeded, preds shape:", preds.shape)
    except Exception as err:
        print("Warning: dummy predict raised an error (may still be OK):", err)

    # Save to new .keras format
    rebuilt.save(OUTPUT_KERAS, save_format="keras")
    print(f"Saved rebuilt model as: {OUTPUT_KERAS}")
    raise SystemExit(0)
except Exception:
    print("❌ Attempt 3 failed.")
    traceback.print_exc()

# If all attempts failed:
print("\nAll automatic load attempts failed.")
print("Next steps:")
print("  1) Share the exact TensorFlow/Keras version used during training (if you know it).")
print("  2) If you still have the original training notebook, re-run model.save('model.keras', save_format='keras') there.")
print("  3) As a last resort, provide the .h5 file and I can suggest more targeted fixes.")
raise SystemExit(2)
