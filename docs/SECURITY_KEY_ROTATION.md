# 🔄 API Keys & Secrets Rotation Guide

## 🎯 Why Rotate Keys?

- **Security breach:** If you suspect keys were exposed
- **Employee turnover:** When team members leave
- **Regular maintenance:** Industry best practice (monthly/quarterly)
- **Compliance:** Required for some certifications

---

## 🔑 How to Rotate Each Key

### 1. OpenAI API Key

**When to rotate:** Monthly, or immediately if exposed

**Steps:**
1. Go to https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Copy the new key
4. Update `backend/.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-NEW_KEY_HERE
   ```
5. Restart backend server
6. **Wait 24 hours** (to ensure all systems use new key)
7. Delete old key from OpenAI dashboard

**Verification:**
```bash
# Test that new key works
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "lang": "en", "systemPrompt": "You are helpful"}'
```

---

### 2. Google Gemini API Key

**When to rotate:** Monthly, or if exposed

**Steps:**
1. Go to https://ai.google.dev/
2. API Keys → "Create API Key"
3. Copy new key
4. Update `backend/.env`:
   ```bash
   GEMINI_API_KEY=NEW_KEY_HERE
   ```
5. Restart server
6. Wait 24 hours
7. Delete old key from Google Cloud Console

---

### 3. Firebase API Keys

**Frontend (Public Keys - Low Priority)**
Firebase frontend keys (`VITE_FIREBASE_API_KEY`) are **safe to expose publicly**. They're restricted by Firebase Security Rules, not the key itself.

**Only rotate if:**
- You want to completely reset the project
- Firebase explicitly flags it as compromised

**Backend (Service Account - CRITICAL)**

**When to rotate:** Quarterly, or immediately if exposed

**Steps:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download `serviceAccountKey.json`
4. Replace `backend/serviceAccountKey.json`
5. Restart server
6. **Important:** Delete old service account from Firebase Console

---

## 🚨 Emergency Key Rotation (Suspected Breach)

If you think a key was exposed (e.g., accidentally committed to GitHub):

### Immediate Actions (Do in this order)

**1. Revoke Compromised Key (FIRST!)**
- OpenAI: Delete key immediately in dashboard
- Gemini: Disable key in Google Cloud Console
- Firebase: Delete service account

**2. Deploy Backend with Placeholder**
```bash
# Temporarily disable AI to stop attackers
cd backend
# Comment out API keys in .env
OPENAI_API_KEY=
GEMINI_API_KEY=
# Restart server (will use offline mode)
```

**3. Generate New Keys**
- Follow rotation steps above

**4. Update All Deployments**
- Production server
- Staging server
- Any team member's local `.env`

**5. Monitor Usage**
- Check OpenAI usage dashboard for suspicious activity
- Set up billing alerts if not already done

---

## 📊 Rotation Schedule

| Key Type | Rotation Frequency | Risk Level |
|----------|-------------------|------------|
| OpenAI API Key | **Monthly** | 🔴 High |
| Gemini API Key | **Monthly** | 🔴 High |
| Firebase Service Account | **Quarterly** | 🔴 High |
| Firebase Web Config | **Yearly** | 🟡 Low |

---

## ✅ Post-Rotation Checklist

After rotating ANY key:

- [ ] Old key deleted from provider dashboard
- [ ] New key updated in `backend/.env`
- [ ] New key added to deployment platform (Render/Railway/Vercel)
- [ ] Backend server restarted
- [ ] Functionality tested (health check + sample request)
- [ ] Team notified (if applicable)
- [ ] Rotation documented (date + reason)

---

## 🔒 Best Practices

1. **Never commit keys to Git**
   - Use `.env` files (always in `.gitignore`)
   - Use environment variables on deployment platforms

2. **Use different keys for different environments**
   ```
   Dev: sk-proj-dev-xxx
   Staging: sk-proj-staging-xxx
   Production: sk-proj-prod-xxx
   ```

3. **Set up billing alerts**
   - OpenAI: $50, $100, $200 thresholds
   - Prevents surprise bills if key is compromised

4. **Use key restrictions**
   - OpenAI: Restrict by IP if possible
   - Google Cloud: Enable API restrictions

5. **Log key usage**
   - Monitor unusual patterns
   - Track which users/services use which keys

---

## 🆘 Emergency Contacts

**If keys are compromised:**
1. **OpenAI Support:** help@openai.com
2. **Google Cloud Support:** https://cloud.google.com/support
3. **Firebase Support:** https://firebase.google.com/support

**Report security breaches within 24 hours**

---

## 📝 Rotation Log Template

Keep a log of all key rotations:

```
Date: 2026-02-16
Key Type: OpenAI API Key
Reason: Monthly rotation
Old Key (last 4): ...uHcA
New Key (last 4): ...xyz3
Rotated By: Your Name
Verification: ✅ Passed
```

---

**Need help rotating keys? Ask your team lead or DevOps engineer.**
