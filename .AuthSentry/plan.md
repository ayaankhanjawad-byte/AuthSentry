

## AuthSentry – Fraud & Credential Protection System
**Tagline:** Stops scams before users click.

### Overview
A modern fraud detection dashboard that scans emails, SMS, and messages to detect phishing, fake logins, and credential theft attempts. Features AI-powered analysis, real-time risk scoring, and a clean, judge-friendly interface.

---

### 🎯 Core Features

#### 1. **Dashboard Home**
- Overview of recent scans with risk distribution chart
- Quick stats: Total scans, threats detected, safe messages
- Recent activity feed showing latest analyzed messages
- Clean, modern design with subtle risk-level color coding (green/yellow/red)

#### 2. **Gmail Integration (OAuth)**
- "Connect Gmail" button with Google OAuth flow
- Scan inbox for suspicious emails
- Display email list with risk indicators
- Detailed view showing detected threats in each email

#### 3. **SMS/WhatsApp Scanner**
- Text input area to paste message content
- Bulk upload option for demo datasets
- Sample messages preloaded for demo purposes
- Real-time analysis as messages are submitted

#### 4. **URL/Link Scanner**
- Dedicated URL input field
- Checks for: shortened links, suspicious domains, fake login pages
- Visual breakdown of URL reputation factors
- Safe preview of suspicious sites (screenshot without visiting)

---

### 🧠 AI-Powered Fraud Detection Engine

Using Lovable AI to analyze content for:
- **Suspicious keywords** (urgent, verify, account suspended, etc.)
- **Urgency language** patterns
- **Fake domain detection** (misspelled brands, lookalike URLs)
- **Shortened link identification**
- **Login/money request detection**
- **Social engineering patterns**

---

### 📊 Risk Scoring System

**Visual Risk Meter Display:**
- **0-30:** Safe (Green) ✓
- **31-60:** Suspicious (Yellow) ⚠️
- **61-100:** Dangerous (Red) 🚨

Each analysis includes:
- Overall risk score with animated meter
- Breakdown of detected threat types
- Specific reasons/explanations for the score
- Actionable recommendations

---

### 🎨 Design Approach

- **Clean & Modern** aesthetic with light backgrounds
- Color-coded risk badges (not overwhelming, subtle)
- Card-based layout for scan results
- Smooth animations for risk meter and analysis progress
- Mobile-responsive for demo flexibility

---

### 💻 Technical Architecture

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Lovable Cloud with Supabase
- **AI:** Lovable AI (Gemini) for fraud pattern detection
- **Auth:** Google OAuth for Gmail access
- **Edge Functions:** Message analysis, URL scanning, Gmail API calls

---

### 📱 Demo Flow (for Judges)

1. Show dashboard with pre-scanned sample data
2. Connect Gmail (live demo of OAuth)
3. Scan a real email and show analysis
4. Paste a phishing SMS example → watch real-time detection
5. Test suspicious URL → show risk breakdown

