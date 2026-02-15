# CNIS Backend API

Secure Node.js/Express backend proxy for the CNIS Health Intelligence App.

## 🎯 Features

- ✅ **Firebase Authentication** - Only logged-in users can access AI
- ✅ **Rate Limiting** - Prevents abuse (10 requests/min general, 5/min AI)
- ✅ **API Key Protection** - OpenAI/Gemini keys hidden from frontend
- ✅ **Multi-Provider Failover** - OpenAI → Gemini automatic fallback
- ✅ **Request Logging** - Track usage and debug issues
- ✅ **CORS Security** - Only your frontend can make requests
- ✅ **Production Ready** - Deploy to Render, Railway, Heroku, etc.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy example and fill in your keys
cp .env.example .env
```

Edit `.env`:
```bash
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here  # Optional
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```

Server starts at `http://localhost:3001`

## 📡 API Endpoints

| Endpoint | Method | Auth | Rate Limit | Description |
|----------|--------|------|------------|-------------|
| `/health` | GET | No | - | Health check |
| `/api/chat` | POST | Yes* | 5/min | Chat completion proxy |

*Currently in dev bypass mode. See **Firebase Setup** below for production auth.

## 🔐 Firebase Authentication Setup (Optional for Hackathon)

For **full production security**, enable Firebase authentication:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `backend/serviceAccountKey.json`
4. Update `.env`:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```
5. In `server.js`, change line 32 from `devBypassAuth` to `verifyToken`

**For hackathon demos:** The current dev bypass mode works fine!

## 📦 Deployment

### Deploy to Render.com (Free Tier)

1. Push backend to GitHub
2. Create new Web Service on Render
3. Connect your repo
4. Set Environment Variables:
   - `OPENAI_API_KEY`
   - `FRONTEND_URL` (your deployed frontend URL)
5. Deploy!

### Deploy to Railway

```bash
railway login
railway init
railway up
```

## 🔧 Development

```bash
# Start with auto-reload
npm run dev

# Production mode
npm start

# Test the API
curl http://localhost:3001/health
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Origin whitelisting
- **Rate Limiting** - Per-user and per-IP
- **Input Validation** - Message length and type checks
- **Error Sanitization** - No sensitive data in responses

## 📊 Monitoring

Check logs for:
- ✅ Authenticated requests: `User uid@example.com`
- ⚠️  Rate limit exceeded
- ❌ Authentication failures

## 🐛 Troubleshooting

**"AI service configuration missing"**
- Add `OPENAI_API_KEY` or `GEMINI_API_KEY` to `.env`

**"Unauthorized"**
- Frontend not sending Firebase token
- Or Firebase Admin not configured (use dev bypass mode)

**"Too many requests"**
- User hit rate limit
- Increase `RATE_LIMIT_MAX_REQUESTS` in `.env`

## 📝 License

MIT - Built for CNIS Health Intelligence Project
