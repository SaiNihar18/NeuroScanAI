🧠 Brain Tumor Classification using Deep Learning

Xception + Transfer Learning

📘 Overview

This project focuses on the classification of brain MRI scans into four clinically relevant categories — Glioma, Meningioma, Pituitary Tumor, and No Tumor — using a deep learning approach built with TensorFlow and Keras.

The model is developed using transfer learning with the Xception architecture, pre-trained on ImageNet, allowing the system to achieve strong performance while reducing training time and overfitting.
The work combines model development, evaluation, and deployment considerations, making it suitable both for academic study and real-world application.

🎯 Objectives

Design and train a deep learning model for multi-class brain tumor classification from MRI images.

Leverage transfer learning (Xception) to improve feature extraction and convergence.

Apply data preprocessing and augmentation to enhance generalization.

Evaluate model performance using classification metrics and visual analysis.

Support single-image inference for practical usage.

Prepare trained models in formats suitable for web-based deployment and future research.

📁 Dataset

The project uses the Brain Tumor MRI Dataset available on Kaggle:

🔗 Dataset link:
Brain Tumor MRI Dataset – Kaggle

Dataset Structure

The dataset is organized into:

Training set: Training/

Testing set: Testing/

Each split contains four classes:

glioma/

meningioma/

pituitary/

notumor/

All images are MRI scans captured under varying conditions, making the classification task non-trivial and well-suited for deep learning techniques.

🧩 Model Architecture
🔹 Base Model

Xception (pre-trained on ImageNet)
Used as the backbone for feature extraction with convolutional layers initially frozen to preserve learned representations.

🔹 Custom Classification Head
Layer	Purpose
Flatten	Converts convolutional features into a 1D vector
Dropout (0.30, 0.25)	Reduces overfitting
Dense (128, ReLU)	Learns task-specific features
Dense (4, Softmax)	Outputs class probabilities
🔹 Training Configuration

Optimizer: Adamax (learning rate = 0.001)

Loss Function: Categorical Crossentropy

Evaluation Metrics: Accuracy, Precision, Recall

This setup balances training stability with generalization performance.

⚙️ System Requirements
📦 Dependencies

All required dependencies can be installed using:

pip install tensorflow keras pillow numpy pandas matplotlib seaborn tqdm scikit-learn

🧪 Model Output

The trained model produces a probability distribution across the four tumor classes, enabling both classification and confidence estimation for each prediction.

🚀 Deployment Notes

The trained model has been adapted for web-based inference, enabling real-time predictions through a backend API and a browser-based frontend.
Large model files are intentionally excluded from this repository to keep the codebase lightweight and version-controlled.

A live demo and API documentation are available via hosted services.

📌 Use Cases

Academic research and experimentation

Medical imaging AI demonstrations

Educational projects in deep learning and computer vision

Prototype systems for clinical decision support (non-diagnostic)
