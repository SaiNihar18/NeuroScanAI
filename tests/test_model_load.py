from tensorflow.keras.models import load_model

model = load_model("model/brain_tumor_model.keras")
print(model.summary())
