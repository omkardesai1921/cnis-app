# 🚀 CNIS - Quick Start Guide

**Get CNIS running in 5 minutes!**

---

## Prerequisites Check

Open your terminal/command prompt and verify:

```bash
# Check Node.js (need v18+)
node -v
# Should show: v18.x.x or higher

# Check npm (need v9+)
npm -v
# Should show: v9.x.x or higher

# Check Git
git --version
# Should show: git version 2.x.x
```

**Don't have these?**
- Install Node.js: https://nodejs.org/ (LTS version)
- Git comes with Node.js installer on Windows
- Mac: `brew install node git`
- Linux: `sudo apt install nodejs npm git`

---

## Step-by-Step Setup

### 1️⃣ Get the Code

```bash
# Clone the repository
git clone https://github.com/yourusername/cnis-app.git

# Go into the folder
cd cnis-app
```

---

### 2️⃣ Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

⏱️ **This takes ~2 minutes** (downloading packages)

---

### 3️⃣ Get API Keys (Required for AI Chatbot)

#### Option A: OpenAI (Recommended)

1. Go to https://platform.openai.com/
2. Sign up / Log in
3. Click "API Keys" → "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)

#### Option B: Google Gemini (Free Alternative)

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create/select a project
4. Copy the key

---

### 4️⃣ Set Up Environment Variables

**Frontend Config:**

Create `.env` file in the root folder:

```bash
# Copy the example
cp .env.example .env

# Edit it (use any text editor)
notepad .env  # Windows
nano .env     # Mac/Linux
```

Paste this (replace with your Firebase keys):

```bash
VITE_FIREBASE_API_KEY=AIzaSyBEaf8c69TU9adFlPed5gLcV18tSJIiinA
VITE_FIREBASE_AUTH_DOMAIN=cnis-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cnis-app
VITE_FIREBASE_STORAGE_BUCKET=cnis-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=552904966490
VITE_FIREBASE_APP_ID=1:552904966490:web:37a77439975f20d61ff363

VITE_BACKEND_URL=http://localhost:3001
```

**Backend Config:**

Create `backend/.env`:

```bash
# Copy the example
cp backend/.env.example backend/.env

# Edit it
notepad backend/.env  # Windows
nano backend/.env     # Mac/Linux
```

Paste this (add your OpenAI key):

```bash
NODE_ENV=development
PORT=3001

OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE  # ← Paste your key

FRONTEND_URL=http://localhost:5173

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

---

### 5️⃣ Run the Servers

**You need TWO terminal windows:**

**Terminal 1 - Frontend:**
```bash
npm run dev
```

You should see:
```
VITE v6.0.7  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
==================================================
🚀 CNIS Backend API Server
==================================================
✅ Environment: development
✅ Server running on: http://localhost:3001
✅ OpenAI API key detected
✅ Rate limit: 10 requests per 60s
==================================================
```

---

### 6️⃣ Open the App

Go to your browser: **http://localhost:5173**

You should see the CNIS landing page!

---

## Test the App

### Test Login

Use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| ASHA Worker | `asha@test.com` | `test123` |
| Parent | `parent@test.com` | `test123` |
| Health Official | `official@test.com` | `test123` |

### Test the AI Chatbot

1. Log in with any account
2. Click "AI Assistant" in the menu
3. Type a question: "My child has fever"
4. Wait for AI response

**If it works:** ✅ You're all set!  
**If it fails:** Check troubleshooting below

---

## Troubleshooting

### ❌ "Cannot find module"

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules
npm install

cd backend
rm -rf node_modules
npm install
```

---

### ❌ "Port 5173 is already in use"

**Solution:**
```bash
# Kill the process using that port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

---

### ❌ "API service configuration missing"

**Problem:** OpenAI API key not configured

**Solution:**
1. Check `backend/.env` has `OPENAI_API_KEY=sk-proj-...`
2. Restart backend server (Ctrl+C, then `npm run dev`)

---

### ❌ Chatbot returns offline responses only

**Problem:** Backend not running or can't connect

**Checklist:**
- [ ] Backend server running? (Terminal 2 should show server logs)
- [ ] Backend URL correct in frontend `.env`? (`VITE_BACKEND_URL=http://localhost:3001`)
- [ ] No firewall blocking port 3001?
- [ ] Try: http://localhost:3001/health (should return JSON)

---

### ❌ "Too many requests" error

**Problem:** Hit rate limit during testing

**Solution:**
```bash
# Edit backend/.env
RATE_LIMIT_MAX_REQUESTS=100  # Increase from 10

# Restart backend
```

---

## Next Steps

### Explore Features

- 📸 **Nutrition Screening**: Click "Screening" → Enter child measurements
- 🤖 **AI Chatbot**: Click "AI Assistant" → Ask health questions
- 📊 **Dashboard**: View case statistics and trends
- 🌍 **Language**: Click language switcher (🌐) → Try Hindi/Marathi

### Customize

1. **Add more districts**: Edit `src/data/nfhsStats.js`
2. **Add translations**: Edit `src/locales/en.json`, `hi.json`, `mr.json`
3. **Change colors**: Edit `src/index.css` (CSS variables at top)

### Read Documentation

- **Full README**: [README.md](README.md) - Complete project overview
- **Security Details**: [SECURITY_REPORT.md](SECURITY_REPORT.md) - Security audit
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- **API Docs**: [backend/README.md](backend/README.md) - Backend API reference

---

## Common Questions

**Q: Do I need Firebase?**  
A: The demo works without Firebase setup! Auth is in "dev bypass" mode.  
For production, you'll need a Firebase project.

**Q: Do I need to pay for OpenAI?**  
A: OpenAI has a free trial ($5 credit). After that, GPT-4o costs ~$0.01 per chat.  
Alternative: Use Gemini (free tier available).

**Q: Can I run this offline?**  
A: Partially! The AI chatbot falls back to rule-based responses when offline.  
Full offline support (PWA) planned for v1.1.

**Q: Is this production-ready?**  
A: **Yes!** (after enabling Firebase auth)  
Security score: 93/100. See [SECURITY_REPORT.md](SECURITY_REPORT.md)

**Q: Can I use this for my hackathon?**  
A: **Absolutely!** Just credit the original authors.

---

## Need Help?

- **Issues**: https://github.com/yourusername/cnis-app/issues
- **Discussions**: https://github.com/yourusername/cnis-app/discussions
- **Email**: support@cnis-app.com

---

## Quick Commands Reference

```bash
# Start frontend
npm run dev

# Start backend
cd backend && npm run dev

# Install dependencies
npm install

# Clean restart
rm -rf node_modules package-lock.json
npm install

# Check backend health
curl http://localhost:3001/health

# Test backend API
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","lang":"en","systemPrompt":"helpful"}'
```

---

**🎉 Congratulations! You're now running CNIS locally!**

Happy coding! 🚀
