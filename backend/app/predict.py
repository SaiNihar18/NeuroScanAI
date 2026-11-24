import numpy as np
import time
from PIL import Image, UnidentifiedImageError
from fastapi import HTTPException, UploadFile
from .model_loader import model, CLASS_NAMES

IMG_SIZE = (299, 299)
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

def predict_image(image_file: UploadFile) -> dict:
    # Check if model is available
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not available. Please ensure TensorFlow is installed and restart the server."
        )
    
    # ✅ Check MIME type
    if not image_file.content_type or not image_file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image (JPG/PNG)"
        )

    image_file.file.seek(0, 2)
    size = image_file.file.tell()
    image_file.file.seek(0)
    if size > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large. Maximum size is 10 MB.")

    try:
        image = Image.open(image_file.file).convert("RGB")
        image = image.resize(IMG_SIZE)
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image. Please upload a proper image file."
        )

    # Preprocess: normalize by dividing by 255.0 (matching your training code)
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict and measure time
    predict_start = time.time()
    predictions = model.predict(img_array, verbose=0)[0]
    predict_time = time.time() - predict_start

    predicted_idx = int(np.argmax(predictions))
    confidence = float(predictions[predicted_idx])
    predicted_class = CLASS_NAMES[predicted_idx]

    print(f"🧠 Prediction: {predicted_class} ({confidence:.3f}) in {predict_time*1000:.1f}ms")

    return {
        "predicted_class": predicted_class,
        "confidence": float(confidence),
        "probabilities": {name: float(p) for name, p in zip(CLASS_NAMES, predictions)},
        "all_probs": predictions.tolist(),
        "classes": CLASS_NAMES,
        "predict_time_ms": float(predict_time * 1000)
    }