# Changelog

All notable changes to the CNIS (Child Nutrition Intelligence System) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Offline-first PWA support
- SMS notifications via Twilio
- WhatsApp integration for alerts
- PDF export for screening reports
- Mobile app (React Native)

---

## [1.0.0] - 2026-02-16

### 🎉 Initial Release

The first production-ready version of CNIS with comprehensive features for child nutrition screening and AI-powered health advisory.

### Added

#### Core Features
- **AI Health Chatbot (Medibot)** with RAG (Retrieval-Augmented Generation)
  - Integration of 16 curated health PDFs (WHO, UNICEF, NFHS, POSHAN Abhiyaan)
  - Search across 74 knowledge base entries
  - Location-aware responses mentioning district + NFHS stats
  - OpenAI GPT-4o primary provider
  - Google Gemini Flash 2.0 automatic failover
  - Offline rule-based fallback responses
  
- **Nutrition Screening Module**
  - WHO growth standards (WAZ, HAZ, WHZ calculations)
  - MUAC (Mid-Upper Arm Circumference) measurements
  - Automated SAM/MAM classification
  - Follow-up recommendations

- **Location Intelligence**
  - GPS-based district detection via Nominatim API
  - Coordinate-to-district fallback for 200+ districts
  - NFHS-5 baseline statistics integration
  - High-risk region alerts

- **Multi-Language Support**
  - English, Hindi, Marathi translations
  - i18next integration
  - Language-aware AI responses
  - Voice input/output in all languages

- **Dashboard & Analytics**
  - Real-time case tracking
  - District-wise malnutrition trends
  - Pending follow-ups management
  - Case statistics visualization

#### Security (93% Security Score)
- **Backend API Proxy Architecture**
  - Secure OpenAI/Gemini API key storage (backend only)
  - Environment variable validation on startup
  - API keys never exposed to frontend/Git

- **Multi-Tier Rate Limiting**
  - Client-side request throttling (5 chat / 3 images per minute)
  - Backend enforcement (10 general / 5 AI / 3 images per minute)
  - Per-user (Firebase UID) and per-IP tracking
  - Custom retry-after error messages

- **Authentication & Authorization**
  - Firebase Authentication integration
  - JWT token verification middleware
  - Dev bypass mode for easy testing
  - Session management via Firebase

- **HTTP Security**
  - Helmet.js security headers
  - CORS origin whitelisting
  - Request size limits (10MB max)
  - Request timeout protection (30 seconds)

- **Input Validation & Error Handling**
  - Comprehensive type and length validation
  - Try-catch coverage on all API routes
  - Sanitized error messages (no data leaks)
  - Provider failover with graceful degradation

- **Logging & Monitoring**
  - Morgan request logging
  - Security event logging (auth failures, rate limits)
  - Health check endpoint (`/health`)
  - Error context logging

#### User Roles & Authentication
- **ASHA Worker** role with screening permissions
- **Parent** role with child tracking
- **Health Official** role with analytics access
- Firebase email/password authentication
- Role-based dashboard views

#### Data Sources
- **NFHS-5 Data**: 200+ districts across India
- **WHO Guidelines**: Child growth standards, malnutrition protocols
- **UNICEF Documentation**: Nutrition recommendations, feeding guidelines
- **POSHAN Abhiyaan**: Government nutrition program data

#### Technical Infrastructure
- **Frontend**: React 18.3 + Vite 6.0
- **Backend**: Node.js 18 + Express 4.18
- **Authentication**: Firebase SDK 11.1 + Admin SDK 12.0
- **AI Models**: OpenAI GPT-4o, Google Gemini Flash 2.0
- **Geocoding**: OpenStreetMap Nominatim API
- **Security**: Helmet 7.1, CORS 2.8, express-rate-limit 7.1

### Documentation
- Comprehensive README with architecture diagrams
- Security audit report (93/100 score)
- API key rotation guide
- Backend deployment guide
- Contributing guidelines
- Setup instructions for local development

---

## [0.5.0] - 2026-02-10 (Pre-Release)

### Added
- Basic chatbot functionality with OpenAI integration
- Simple screening form (height, weight, age)
- Firebase authentication setup
- Dashboard skeleton

### Fixed
- Language switching bugs in dashboard
- Translation missing issues for Marathi

---

## [0.3.0] - 2026-02-08 (Alpha)

### Added
- Initial React app structure
- Firebase configuration
- Basic routing with React Router
- Multilingual support (English, Hindi)

### Changed
- Refactored authentication context
- Updated UI color scheme

---

## [0.1.0] - 2026-02-04 (Initial Prototype)

### Added
- Project initialization
- Landing page design
- Login/registration components
- Basic Firebase setup

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-02-16 | **Production Release** - Full features + security |
| 0.5.0 | 2026-02-10 | Pre-release with basic AI chatbot |
| 0.3.0 | 2026-02-08 | Alpha with multilingual support |
| 0.1.0 | 2026-02-04 | Initial prototype |

---

## Migration Guides

### Upgrading from 0.5.0 to 1.0.0

**Breaking Changes:**
1. **API Keys Moved to Backend**
   - Remove `VITE_OPENAI_API_KEY` from frontend `.env`
   - Add to `backend/.env` instead
   - Frontend now calls secure backend proxy

2. **Backend Server Required**
   - Start backend server: `cd backend && npm run dev`
   - Update frontend `.env`: `VITE_BACKEND_URL=http://localhost:3001`

**Migration Steps:**
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Move API key
# FROM: frontend/.env
VITE_OPENAI_API_KEY=sk-xxx
# TO: backend/.env
OPENAI_API_KEY=sk-xxx

# 3. Run both servers
# Terminal 1: npm run dev (frontend)
# Terminal 2: cd backend && npm run dev
```

---

## Security Advisories

### SA-2026-001: API Key Exposure (Fixed in v1.0.0)
**Severity**: High  
**Date**: 2026-02-16  
**Description**: API keys were previously stored in frontend `.env` and could be extracted from browser DevTools.

**Fix**: All API keys moved to backend-only storage. Frontend calls secure proxy endpoint.

**Action Required**: 
1. Upgrade to v1.0.0
2. Remove `VITE_OPENAI_API_KEY` from frontend
3. Add to backend `.env`

---

## Contributors

This project exists thanks to the amazing people who contribute:

- **Omkar** - Initial development, architecture
- **Antigravity AI** - Security audit & implementation

Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Future Roadmap

### v1.1.0 (Planned: Q1 2026)
- [ ] PWA support with offline mode
- [ ] SMS notification system
- [ ] Bulk import for ASHA workers
- [ ] Advanced analytics dashboard

### v1.2.0 (Planned: Q2 2026)
- [ ] WhatsApp bot integration
- [ ] Mobile app (React Native)
- [ ] Integration with Anganwadi systems
- [ ] Real-time alerts for officials

### v2.0.0 (Planned: Q3 2026)
- [ ] AI predictions for malnutrition trends
- [ ] Multi-tenant architecture
- [ ] Advanced reporting engine
- [ ] Blockchain-based health records

---

[Unreleased]: https://github.com/yourusername/cnis-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/cnis-app/releases/tag/v1.0.0
[0.5.0]: https://github.com/yourusername/cnis-app/releases/tag/v0.5.0
[0.3.0]: https://github.com/yourusername/cnis-app/releases/tag/v0.3.0
[0.1.0]: https://github.com/yourusername/cnis-app/releases/tag/v0.1.0
