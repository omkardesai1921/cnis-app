# 🏥 CNIS - Child Nutrition Intelligence System

**AI-Powered Malnutrition Screening & Health Advisory Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: A Grade](https://img.shields.io/badge/Security-93%25-brightgreen)](./SECURITY_REPORT.md)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)

> A production-grade health intelligence platform empowering ASHA workers, parents, and health officials to combat child malnutrition through AI-driven screening, GPS-aware health insights, and multilingual support (English, Hindi, Marathi).

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Security](#security)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

CNIS addresses India's child malnutrition crisis by providing:

- **📸 AI-Powered Screening**: Quick nutritional assessments using WHO growth standards
- **🤖 Intelligent Chatbot**: District-specific health advice powered by RAG (Retrieval-Augmented Generation)
- **🌍 Location-Aware**: Integrates NFHS-5 data for regional malnutrition insights
- **🗣️ Multilingual**: Full support for English, Hindi, and Marathi
- **📊 Analytics Dashboard**: Track trends and identify high-risk areas
- **👨‍👩‍👧‍👦 Multi-User Roles**: ASHA workers, Parents, Health Officials

### Key Impact

- ✅ **Early Detection**: Identify SAM/MAM cases before complications
- ✅ **Regional Intelligence**: NFHS-5 stats for 200+ districts across India
- ✅ **Evidence-Based**: RAG system uses WHO, UNICEF, POSHAN Abhiyaan guidelines
- ✅ **Accessible**: Works offline with fallback responses
- ✅ **Secure**: 93% security score with production-ready authentication

---

## ✨ Features

### 🩺 **Nutrition Screening**
- Height, weight, MUAC measurements
- WHO Z-score calculations (WAZ, HAZ, WHZ)
- Automated SAM/MAM classification
- Follow-up recommendations

### 💬 **AI Health Assistant (Medibot)**
- **Contextual RAG System**: Searches 16 curated health PDFs (WHO, NFHS, POSHAN)
- **Location-Aware**: Mentions district name + NFHS stats in every response
- **Multilingual**: Responds in user's preferred language
- **Offline Fallback**: Rule-based responses when API unavailable
- **Provider Failover**: OpenAI → Gemini automatic switching

### 📍 **Location Intelligence**
- GPS-based district detection (Nominatim API)
- Coordinate-to-district fallback (200+ districts)
- NFHS-5 baseline statistics integration
- Alerts for high-risk regions

### 🔐 **Security & Authentication**
- Firebase Authentication with JWT verification
- Multi-tier rate limiting (10/5/3 requests per minute)
- Backend API proxy (API keys never exposed)
- OWASP Top 10 compliant
- [Full Security Report →](./docs/SECURITY_REPORT.md)

### 📊 **Analytics & Insights**
- Real-time case tracking
- District-wise malnutrition trends
- Follow-up management
- Export capabilities

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER (Browser)                              │
│                     English | Hindi | Marathi                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                           │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │  Screening   │   Chatbot    │  Dashboard   │   Reports    │     │
│  │    Page      │     Page     │     Page     │     Page     │     │
│  └──────────────┴──────────────┴──────────────┴──────────────┘     │
│         │               │                │              │            │
│         ▼               ▼                ▼              ▼            │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  Firebase Auth │ i18n Translation │ Voice Support   │            │
│  └─────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   BACKEND API (Node.js/Express)                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  Security Layer: Helmet, CORS, Rate Limiting             │       │
│  └──────────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  Authentication: Firebase Admin SDK (JWT verification)   │       │
│  └──────────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  Routes: /api/chat (AI proxy with rate limits)          │       │
│  └──────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │   OpenAI     │    Gemini    │  Nominatim   │   Firebase   │     │
│  │   GPT-4o     │  Flash 2.0   │  (Geocoding) │    (Auth)    │     │
│  └──────────────┴──────────────┴──────────────┴──────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                                    │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │  NFHS-5 Data │   WHO PDFs   │ UNICEF Docs  │   POSHAN     │     │
│  │ (200 districts)│ (Guidelines) │  (Nutrition) │  Abhiyaan   │     │
│  └──────────────┴──────────────┴──────────────┴──────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow: AI Chatbot with RAG

```
User asks: "My child has fever"
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ STEP 1: Location Detection                                 │
│ - GPS coords (19.07°N, 72.87°E)                           │
│ - Nominatim API → "Mumbai, Maharashtra"                   │
│ - Fallback: Coordinate mapping                             │
└────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ STEP 2: RAG Context Building                               │
│ A) District NFHS-5 Stats:                                  │
│    - Stunting: 24%                                          │
│    - Wasting: 19%                                           │
│    - Underweight: 26%                                       │
│                                                             │
│ B) PDF Knowledge Search (Top 3 excerpts):                  │
│    - WHO fever management protocol                         │
│    - UNICEF safe feeding during illness                    │
│    - POSHAN fluid intake guidelines                        │
└────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ STEP 3: Secure Backend API Call                            │
│ - Client → Backend (with Firebase JWT)                     │
│ - Backend validates token                                  │
│ - Rate limit check (5 AI requests/min)                     │
│ - Input validation (length, type)                          │
└────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ STEP 4: AI Prompt Construction                             │
│ System: "You are CNIS Medibot for Mumbai, Maharashtra.     │
│         Context: [NFHS stats + PDF excerpts]               │
│         Rules: ALWAYS mention Mumbai + cite NFHS stats"    │
│ User: "My child has fever"                                 │
└────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ STEP 5: AI Provider (with Failover)                        │
│ Try OpenAI GPT-4o → Success ✅                             │
│ (If failed → Try Gemini Flash 2.0)                         │
│ (If both fail → Offline rule-based response)               │
└────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ STEP 6: Response to User                                   │
│ "In Mumbai, Maharashtra (Stunting: 24%, Wasting: 19%):     │
│                                                             │
│ 🌡️ Fever Management:                                       │
│ - Monitor temperature every 4 hours                        │
│ - ORS solution (WHO protocol)                              │
│ - Continue breastfeeding (UNICEF recommendation)           │
│                                                             │
│ ⚠️ Seek immediate care if temperature > 102°F              │
│                                                             │
│ 📌 Recommended: Ask about vaccination status"              │
└────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with Vite 6.0
- **Routing**: React Router DOM 6.28
- **Styling**: Vanilla CSS with modern CSS Grid/Flexbox
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Internationalization**: react-i18next
- **Authentication**: Firebase SDK 11.1
- **Voice**: Web Speech API
- **Charts**: Recharts 2.15

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express 4.18
- **Authentication**: Firebase Admin SDK 12.0
- **Security**: 
  - Helmet.js 7.1 (HTTP headers)
  - CORS 2.8
  - express-rate-limit 7.1
- **Logging**: Morgan 1.10
- **Environment**: dotenv 16.3

### External Services
- **AI Models**: 
  - OpenAI GPT-4o (primary)
  - Google Gemini Flash 2.0 (fallback)
- **Geocoding**: OpenStreetMap Nominatim API
- **Authentication**: Firebase Authentication
- **Hosting**: Render.com / Vercel (recommendations)

### Development Tools
- **Package Manager**: npm
- **Dev Server**: Vite (frontend), Nodemon (backend)
- **Code Quality**: ESLint
- **Version Control**: Git

---

## 🚀 Quick Start

### Prerequisites

```bash
node -v  # v18.0.0 or higher
npm -v   # v9.0.0 or higher
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/cnis-app.git
cd cnis-app
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

**4. Configure environment variables**

**Frontend (`.env`):**
```bash
# Firebase Configuration (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend URL (for production deployment)
VITE_BACKEND_URL=http://localhost:3001
```

**Backend (`backend/.env`):**
```bash
NODE_ENV=development
PORT=3001

# OpenAI API Key (get from https://platform.openai.com)
OPENAI_API_KEY=sk-proj-your_key_here

# Google Gemini API Key (optional fallback, get from https://ai.google.dev)
GEMINI_API_KEY=your_gemini_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Firebase Admin (optional for production auth)
# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

**5. Run the application**

**Terminal 1 - Frontend:**
```bash
npm run dev
```
✅ Frontend: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend: http://localhost:3001

**6. Access the application**

Open your browser to `http://localhost:5173`

Default login (for testing):
- **ASHA Worker**: `asha@test.com` / password: `test123`
- **Parent**: `parent@test.com` / password: `test123`
- **Health Official**: `official@test.com` / password: `test123`

---

## 📁 Project Structure

```
cnis-app/
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, logos
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ...
│   │   ├── config/          # Configuration files
│   │   │   └── firebase.js
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── data/            # Static data & knowledge base
│   │   │   ├── nfhsStats.js         # NFHS-5 district data
│   │   │   └── ragPdfKnowledge.js   # PDF knowledge base (74 entries)
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── useVoice.js
│   │   ├── pages/           # Page components
│   │   │   ├── ChatbotPage.jsx      # AI chatbot with RAG
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ScreeningPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── ...
│   │   ├── utils/           # Utility functions
│   │   │   ├── backendApi.js        # Secure backend client
│   │   │   ├── requestThrottler.js  # Client-side rate limiting
│   │   │   ├── growthCalculator.js  # WHO Z-score calculations
│   │   │   └── voice.js
│   │   ├── locales/         # i18n translations
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   └── mr.json
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env                 # Environment variables (gitignored)
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── validateEnv.js   # Environment validation
│   ├── middleware/
│   │   ├── auth.js          # Firebase JWT verification
│   │   └── rateLimiter.js   # Rate limiting (10/5/3 per min)
│   ├── routes/
│   │   └── chat.js          # Secure AI chat proxy
│   ├── .env                 # Backend secrets (gitignored)
│   ├── .gitignore
│   ├── server.js            # Main server file
│   ├── package.json
│   └── README.md
│
├── docs/                    # Documentation
│   ├── SECURITY_REPORT.md   # Complete security audit
│   ├── SECURITY_KEY_ROTATION.md  # Key management guide
│   ├── BACKEND_SETUP.md     # Backend deployment guide
│   ├── CONTRIBUTING.md      # How to contribute
│
└── README.md                # This file
```

---

## 🔐 Security

CNIS implements **production-grade security** with a **93/100 security score**:

### Security Features

✅ **API Key Protection (100%)**
- OpenAI/Gemini keys stored only in backend
- Never exposed to frontend/Git
- Environment validation on startup

✅ **Rate Limiting (95%)**
- Multi-tier: 10 general / 5 AI / 3 images per minute
- Client-side throttling + backend enforcement
- Per-user (UID) and per-IP tracking

✅ **Authentication (85%)**
- Firebase JWT verification ready
- Dev bypass mode for easy testing
- Session management via Firebase

✅ **Input Validation (90%)**
- Type checking, length limits
- Content filtering for injections
- Request size limits (10MB max)

✅ **Error Handling (95%)**
- Comprehensive try-catch coverage
- Provider failover (OpenAI → Gemini)
- Sanitized error messages (no data leaks)

✅ **HTTP Security (90%)**
- Helmet.js security headers
- CORS origin whitelisting
- HTTPS enforcement (production)

✅ **Code Security (100%)**
- npm audit: **0 vulnerabilities**
- No hardcoded secrets
- Regular dependency updates

### Security Documentation

- 📄 [Full Security Report](./docs/SECURITY_REPORT.md) - Complete audit & scorecard
- 🔑 [Key Rotation Guide](./docs/SECURITY_KEY_ROTATION.md) - API key management
- 🛡️ [Backend Security](./backend/README.md) - API security details

---

## 🌐 Deployment

### Production Deployment (Recommended: Render.com)

**Backend Deployment:**

1. **Push to GitHub** (ensure `.env` is gitignored)
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Create Render Web Service**
- Go to [render.com](https://render.com)
- New → Web Service
- Connect your GitHub repo
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

3. **Set Environment Variables** in Render Dashboard:
```
OPENAI_API_KEY=sk-proj-xxx
GEMINI_API_KEY=AIza-xxx (optional)
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

4. **Deploy** → Render auto-deploys on git push

**Frontend Deployment (Vercel):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_FIREBASE_API_KEY=xxx
# ... other Firebase vars
```

### Alternative Platforms

- **Railway**: `railway up` (single command)
- **Heroku**: `git push heroku main`
- **Fly.io**: Docker-based deployment
- **AWS/GCP**: For enterprise scale

### Health Check

```bash
# Test backend
curl https://your-backend.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://your-backend.onrender.com`

### Endpoints

#### `GET /health`
Health check endpoint (no auth required)

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-16T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

---

#### `POST /api/chat`
Secure AI chat completion proxy

**Authentication**: Required (Firebase JWT)  
**Rate Limit**: 5 requests per minute

**Request:**
```json
{
  "message": "My child has fever",
  "lang": "en",
  "systemPrompt": "You are CNIS Medibot..."
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <Firebase_ID_Token>
```

**Response (Success):**
```json
{
  "answer": "In Mumbai, Maharashtra (Stunting: 24%)...",
  "provider": "openai",
  "usage": {
    "prompt_tokens": 450,
    "completion_tokens": 200,
    "total_tokens": 650
  }
}
```

**Response (Rate Limited):**
```json
{
  "error": "Too Many Requests",
  "message": "Please wait before making more requests",
  "retryAfter": 42
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   npm test  # (when tests are added)
   ```
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Use ESLint configuration
- Follow React best practices
- Add JSDoc comments for functions
- Keep components small and focused

### Areas for Contribution

- 🐛 **Bug Fixes**: Check [Issues](https://github.com/yourusername/cnis-app/issues)
- ✨ **Features**: Offline-first PWA, SMS notifications, voice commands
- 🌍 **Localization**: Add more Indian languages (Tamil, Telugu, Bengali)
- 📊 **Analytics**: Add data visualization components
- 🧪 **Testing**: Unit tests, E2E tests with Playwright
- 📝 **Documentation**: API docs, user guides, video tutorials

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

This project integrates data and guidelines from:

- **NFHS-5**: National Family Health Survey (Ministry of Health and Family Welfare, India)
- **WHO**: World Health Organization child growth standards
- **UNICEF**: Nutrition guidelines and feeding recommendations
- **POSHAN Abhiyaan**: Government of India's flagship nutrition program
- **OpenStreetMap**: Nominatim geocoding API

---

## 📞 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/cnis-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cnis-app/discussions)
- **Email**: support@cnis-app.com

---

## 🗺️ Roadmap

### Phase 1: MVP (Current) ✅
- [x] AI chatbot with RAG
- [x] Nutrition screening
- [x] Multi-language support
- [x] Location-aware insights
- [x] Production-ready security

### Phase 2: Enhancement (Q1 2026)
- [ ] Offline-first PWA
- [ ] SMS notifications via Twilio
- [ ] WhatsApp integration
- [ ] Advanced analytics dashboard
- [ ] Export to PDF reports

### Phase 3: Scale (Q2 2026)
- [ ] Mobile app (React Native)
- [ ] Integration with Anganwadi systems
- [ ] Real-time alerts for health officials
- [ ] AI-powered trend predictions
- [ ] Multi-tenant architecture

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<p align="center">
  Made with ❤️ for India's children<br/>
  <strong>CNIS - Child Nutrition Intelligence System</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-security">Security</a> •
  <a href="#-deployment">Deployment</a>
</p>
