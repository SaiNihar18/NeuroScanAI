# 🧠 Brain Tumor Classification using Deep Learning (Xception + Transfer Learning)

## 📘 Overview
This project aims to classify brain MRI scans into **four tumor categories** — **Glioma**, **Meningioma**, **Pituitary**, and **No Tumor** — using a **deep learning model** developed with **TensorFlow and Keras**.

The model leverages **transfer learning** with the **Xception architecture pre-trained on ImageNet**, enabling effective feature extraction, faster convergence, and improved generalization even with a limited dataset.  
The project follows an end-to-end workflow, covering dataset preparation, model training, evaluation, and deployment readiness.

---

## 🏗️ Project Structure

NeuroScanAI/
├── frontend/        # React + TypeScript frontend (Vercel)
├── backend/         # FastAPI backend service
│   └── app/
│       ├── main.py            # API entrypoint
│       ├── predict.py         # Inference logic
│       └── model_loader.py    # Model loading utilities
├── ml/              # Machine learning assets
│   └── model/       # Trained model & class mappings
├── scripts/         # Helper and automation scripts
├── tests/           # API and model tests
└── README.md

---

## 🎯 Objectives
- Develop a **deep learning model** to classify brain MRI images into multiple tumor categories.
- Apply **transfer learning (Xception)** to improve model performance and training efficiency.
- Use **data augmentation and rescaling** to enhance generalization.
- Evaluate model performance using **classification metrics and visualizations**.
- Enable **single-image inference** for practical use cases.
- Save trained models in formats suitable for **web deployment and further research**.

---

## 📁 Dataset
The dataset used in this project is the **Brain Tumor MRI Dataset** available on Kaggle.

Dataset link:  
https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset

### Dataset Structure
The dataset is organized into:
- **Training set:** Training/
- **Testing set:** Testing/

Each directory contains the following classes:
- glioma/
- meningioma/
- pituitary/
- notumor/

The MRI scans vary in quality and acquisition conditions, making the dataset suitable for evaluating the robustness of deep learning models.

---

## 🧩 Model Architecture

### 🔹 Base Model
- **Xception (pre-trained on ImageNet)**  
  Used as the feature extractor, with convolutional layers initially frozen to preserve learned representations.

### 🔹 Custom Classification Head

| Layer Type | Description |
|------------|-------------|
| Flatten | Converts feature maps into a one-dimensional feature vector |
| Dropout (0.30, 0.25) | Reduces overfitting |
| Dense (128, ReLU) | Learns task-specific features |
| Dense (4, Softmax) | Outputs probabilities for the four tumor classes |

### 🔹 Training Configuration
- **Optimizer:** Adamax (learning rate = 0.001)
- **Loss Function:** Categorical Crossentropy
- **Evaluation Metrics:** Accuracy, Precision, Recall

This configuration balances training stability with generalization performance.

---

## ⚙️ System Requirements

### 📦 Dependencies
Install all required dependencies using:

    pip install tensorflow keras pillow numpy pandas matplotlib seaborn tqdm scikit-learn

---

## 🧪 Model Output
The trained model produces a **probability distribution** across the four tumor classes, allowing both **classification** and **confidence estimation** for each prediction.

---

## 🚀 Deployment Notes
The trained model has been adapted for **web-based inference**, enabling real-time predictions through a backend API and a browser-based frontend.

Large trained model files are intentionally excluded from this repository to keep the codebase lightweight and manageable under version control.

---

## 📌 Use Cases
- Academic research and experimentation
- Medical imaging AI demonstrations
- Educational projects in deep learning and computer vision
- Prototype systems for clinical decision support (non-diagnostic use)

---

## 🚀 Deployment Overview

The project is deployed using a decoupled architecture:

- **Frontend** is deployed on **Vercel**, providing a responsive web interface for uploading MRI images and viewing predictions.
- **Backend API** is deployed on **Hugging Face Spaces** using **FastAPI**, handling image preprocessing and model inference.
- The trained deep learning model is loaded once at startup to ensure efficient inference.

This setup allows independent scaling and clean separation between UI, API, and machine learning components.

---

## 📈 Future Enhancements
- Model explainability using Grad-CAM or saliency maps
- Improved confidence calibration
- Support for batch inference
- Model optimization for lightweight or edge deployment

This project builds upon publicly available datasets and well-established deep learning architectures.  
If you find this repository useful, consider giving it a ⭐.
