# CFO Bot - Cloud Cost Estimator for Chat Bot Apps

TSIS 3 - Information Systems | Spec-Driven Development Project
Deployed on Firebase Hosting, built with React + Vite


## Live Demo

**[https://cfo-bot-cloud.web.app](https://cfo-bot-cloud.web.app)**

---

## Project Overview

CFO Bot estimates the monthly cloud infrastructure cost of running a Chat Bot application. It supports:

- 7 cloud providers: Firebase, AWS, GCP, Azure, Digital Ocean, PS Cloud (KZ), Qaztelecom (KZ)
- 9 AI models: GPT-4.1o (Free), GPT-4o, GPT-5 mini, Claude Haiku 4.5, Gemini 2.5 Pro, Gemini 3 Flash, Gemini 3 Pro, Gemini 3.1 Pro, Raptor mini (Free)
- Dual currency: USD + KZT
- 4 cost components: AI API, Compute, Storage, Bandwidth
- User authentication with session persistence
- Export results to CSV or PDF

---

## Architecture

```
cfo-bot/
├── docs/
│   ├── SSOT_SPECIFICATION.md      - Phase 1: Single Source of Truth
│   ├── IMPLEMENTATION_PLAN.md     - Phase 2: Antigravity Artifacts
│   └── PRICING_STRATEGY.md        - Phase 4: Business Strategy
├── src/
│   ├── config/pricing.config.js   - All pricing data
│   ├── utils/calculator.js        - Math engine (matches SSOT exactly)
│   ├── utils/auth.js              - Auth and session logic
│   └── components/                - React UI
├── firebase.json                  - Firebase Hosting config
└── vite.config.js
```

All calculations run 100% client-side in JavaScript - no backend needed, instant results, no API costs. Authentication state and user preferences are persisted via localStorage.

---

## Local Setup

```bash
# Clone
git clone https://github.com/al1naaa/cfo-bot.git
cd cfo-bot

# Install
npm install

# Run locally
npm run dev
# Opens at http://localhost:5173

# Build
npm run build
```

---

## Firebase Deployment

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
# App goes live at https://cfo-bot-cloud.web.app
```

---

## Cost Model

The calculator applies the following formulas (see docs/SSOT_SPECIFICATION.md for full derivation):

```
TOTAL = cost_ai + cost_compute + cost_storage + cost_bandwidth

cost_ai = (monthly_messages * tokens_in  / 1,000,000 * price_input)
        + (monthly_messages * tokens_out / 1,000,000 * price_output)

cost_compute = fixed_usd                          (VPS providers)
             OR max(0, invocations - free_inv)
                / 1,000,000 * inv_price
              + max(0, gb_seconds - free_gb_sec)
                * gb_sec_price                    (serverless)

cost_storage = max(0, stored_gb - free_gb) * price_per_gb

cost_bandwidth = max(0, egress_gb - free_gb) * price_per_gb

KZT_equivalent = total_usd * 480
```

---

## SDD Workflow (Antigravity)

| Phase   | Artifact                        | Status  |
|---------|---------------------------------|---------|
| Phase 1 | SSOT Specification              | docs/SSOT_SPECIFICATION.md |
| Phase 2 | Implementation Plan             | docs/IMPLEMENTATION_PLAN.md |
| Phase 2 | Test Specifications (14 tests)  | All PASSED |
| Phase 3 | Firebase Deployment             | Live URL |
| Phase 4 | Pricing Strategy Document       | docs/PRICING_STRATEGY.md |

