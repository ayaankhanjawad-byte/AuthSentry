
---

# AuthSentry 🔐

**AuthSentry** is an AI-powered cybersecurity application designed to detect phishing attempts, scam messages, and credential-harvesting attacks.
It analyzes user-submitted **emails, SMS messages, and URLs** to generate a **fraud risk score** along with clear threat insights and actionable recommendations.

---

## 🚀 Features

* 📧 **Email phishing detection**
* 📱 **SMS scam analysis**
* 🔗 **Malicious URL risk assessment**
* 🤖 **AI-based fraud risk scoring**
* 🧠 **Threat explanations & safety recommendations**
* 📊 **Clean and intuitive dashboard interface**

---

## 🛠 Tech Stack

* **Vite**
* **TypeScript**
* **React**
* **Tailwind CSS**
* **shadcn/ui**
* **Node.js**
* **Supabase** (Auth & Database)
* **AI API** (for content analysis)

---

## 📦 Getting Started

### Prerequisites

Make sure you have:

* **Node.js v18+**
* **npm**

---

### Installation

```bash
git clone https://github.com/ayaankhanjawad-byte/AuthSentry.git
cd authsentry
cp .env.example .env
# Edit .env and paste your Supabase anon key (see Environment variables below)
npm install
npm run dev
```

The application will start locally at:

```
http://localhost:8080
```

---

## 🔐 Environment variables

Vite only exposes variables prefixed with `VITE_`. They are baked into the build at **build time** (including on Vercel).

Copy [`.env.example`](.env.example) to `.env` and set your Supabase anon key. Never commit `.env` files to GitHub.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | No (has default) | `https://trlegeualmmmkcwomdtm.supabase.co` — also set in `vercel.json` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | **Yes** | Supabase **anon / public** key (preferred name) |
| `VITE_SUPABASE_ANON_KEY` | **Yes** (alternative) | Same value as above if you use the legacy name |

**Where to get the anon key:** [Supabase Dashboard](https://supabase.com/dashboard/project/trlegeualmmmkcwomdtm/settings/api) → **Project Settings** → **API** → **Project API keys** → copy the `anon` `public` key (starts with `eyJ`).

### Deploying to Vercel

1. Open your project on [vercel.com](https://vercel.com) → **Settings** → **Environment Variables**.
2. Add:

   | Name | Value | Environments |
   |------|--------|----------------|
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon public key | Production, Preview, Development |

   Optional (already defaulted in the repo / `vercel.json`):

   | Name | Value |
   |------|--------|
   | `VITE_SUPABASE_URL` | `https://trlegeualmmmkcwomdtm.supabase.co` |

   If you previously used `VITE_SUPABASE_ANON_KEY` in Vercel, that name still works.

3. **Redeploy** (Deployments → ⋯ on latest → **Redeploy**) so the new variables are included in the build.

Without the anon key, the UI loads but scanning and the dashboard data API stay disabled.

---

## 🧠 Learning Outcomes

* Secure handling of environment variables
* Real-world AI integration for cybersecurity use cases
* Frontend architecture with modern React tooling
* Supabase authentication and backend integration

---

## 👥 Team

* **Project Name:** AuthSentry
* **Team:** CloudX
* **Developer:** Ayaan Khan

---

## 📄 License

This project is developed for **educational and learning purposes**.

---
