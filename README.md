# 💹 CFO Bot — Cloud Cost Estimator for Chat Bot Apps

> **TSIS 3 — Information Systems | Spec-Driven Development Project**  
> Deployed on Firebase Hosting · Built with React + Vite

## 🌐 Live Demo
**[https://cfo-bot-YOUR-ID.web.app](https://cfo-bot-YOUR-ID.web.app)**

---

## 📋 Project Overview

CFO Bot estimates the **monthly cloud infrastructure cost** of running a Chat Bot application. It supports:

- **7 Cloud Providers:** Firebase, AWS, GCP, Azure, Digital Ocean, PS Cloud (🇰🇿), Qaztelecom (🇰🇿)
- **9 AI Models:** GPT-4.1o (Free), GPT-4o, GPT-5 mini, Claude Haiku 4.5, Gemini 2.5 Pro, Gemini 3 Flash, Gemini 3 Pro, Gemini 3.1 Pro, Raptor mini (Free)
- **Dual Currency:** USD + KZT (₸)
- **4 Cost Components:** AI API, Compute, Storage, Bandwidth

---

## 🏗️ Architecture

```
cfo-bot/
├── docs/
│   ├── SSOT_SPECIFICATION.md      ← Phase 1: Single Source of Truth
│   ├── IMPLEMENTATION_PLAN.md     ← Phase 2: Antigravity Artifacts
│   └── PRICING_STRATEGY.md        ← Phase 4: Business Strategy
├── src/
│   ├── config/pricing.config.js   ← All pricing data (NFR-05)
│   ├── utils/calculator.js        ← Math engine (matches SSOT exactly)
│   └── components/                ← React UI
├── firebase.json                  ← Firebase Hosting config
└── vite.config.js
```

**Key decision:** All calculations run **100% client-side in JavaScript** — no backend needed, instant results, no API costs.

---

## 🚀 Local Setup

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/cfo-bot.git
cd cfo-bot

# 2. Install
npm install

# 3. Run locally
npm run dev
# → http://localhost:5173

# 4. Build
npm run build
```

---

## 🔥 Firebase Deployment

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting, use dist/ folder)
firebase init hosting

# Deploy
npm run build
firebase deploy

# → Your app is live at https://YOUR-PROJECT.web.app
```

---

## 🧮 Cost Model (from SSOT)

```
TOTAL = cost_ai + cost_compute + cost_storage + cost_bandwidth

cost_ai = (monthly_messages × tokens_in  / 1M × price_input)
        + (monthly_messages × tokens_out / 1M × price_output)

cost_compute = fixed_usd  (VPS)  OR  serverless_formula  (Lambda/Cloud Run)

cost_storage = max(0, stored_gb - free_gb) × price_per_gb

cost_bandwidth = max(0, egress_gb - free_gb) × price_per_gb

KZT = total_usd × 450
```

---

## 📊 SDD Workflow (Antigravity)

| Phase | Artifact | Status |
|---|---|---|
| Phase 1 | SSOT Specification | ✅ `docs/SSOT_SPECIFICATION.md` |
| Phase 2 | Implementation Plan | ✅ `docs/IMPLEMENTATION_PLAN.md` |
| Phase 2 | Test Specifications (14 tests) | ✅ All PASSED |
| Phase 3 | Firebase Deployment | ✅ Live URL |
| Phase 4 | Pricing Strategy Document | ✅ `docs/PRICING_STRATEGY.md` |

---

## 📄 License
MIT — TSIS-3 Academic Project
