# NeuroScan AI - Brain Tumor Detection

A modern, fully responsive web application for brain tumor classification using deep learning. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

- **AI-Powered Analysis**: Upload brain MRI scans for instant AI classification
- **Beautiful UI**: Modern, premium SaaS-like design with smooth animations
- **Dark/Light Mode**: Persistent theme with smooth transitions
- **Drag & Drop**: Easy image upload with preview
- **Real-time Results**: Instant predictions with confidence scores
- **History Tracking**: Local storage of recent analyses
- **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- **Toast Notifications**: User-friendly feedback system

## 🧠 About the Model

The application uses the **Xception CNN** architecture to classify brain MRI scans into four categories:
- Glioma Tumor
- Meningioma Tumor
- Pituitary Tumor
- No Tumor

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the API endpoint in `.env`:
```env
VITE_API_BASE=http://localhost:8000
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🔌 Backend Integration

### FastAPI Endpoint

The frontend expects a FastAPI backend with the following endpoint:

**POST** `/predict`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "class": "Glioma Tumor",
  "confidence": 0.94
}
```

### Updating the API URL

Edit the `.env` file to point to your FastAPI backend:
```env
VITE_API_BASE=https://your-backend-url.com
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Hero.tsx        # Landing hero section
│   ├── Navbar.tsx      # Navigation bar
│   ├── AnalysisWorkspace.tsx   # Upload, analysis & results
│   ├── ResultCard.tsx  # Results display
│   ├── HistorySection.tsx  # Recent analyses
│   ├── Footer.tsx      # Footer component
│   └── ThemeToggle.tsx # Dark/light mode toggle
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── About.tsx       # About page
│   └── NotFound.tsx    # 404 page
├── services/           # API services
│   └── api.ts          # Backend API calls
├── utils/              # Utility functions
│   ├── theme.ts        # Theme management
│   └── history.ts      # History management
├── types/              # TypeScript types
│   └── prediction.ts   # Prediction types
└── index.css           # Global styles & design system
```

## 🎨 Design System

The app uses a carefully crafted design system with:
- **Primary Color**: Medical blue/teal (trust, technology)
- **Accent Color**: Purple gradient (AI/innovation)
- **Glass-morphism effects**
- **Smooth animations with Framer Motion**
- **Semantic color tokens** for consistent theming

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Dropzone** - File upload
- **Sonner** - Toast notifications
- **shadcn/ui** - UI components

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📲 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## ⚠️ Important Notice

This tool is designed for **educational and research purposes only**. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by cutting-edge AI medical applications
- Designed for ease of use and accessibility

---

Made with ❤️ for advancing AI in healthcare
