# CFO Bot — System Specification (SSOT)
**Version:** 1.0.0 | **Status:** APPROVED | **Date:** 2025-06-01

---

## 1. EXECUTIVE SUMMARY

CFO Bot estimates monthly infrastructure costs for a Chat Bot application. The user inputs usage assumptions (messages/day, users, token sizes) and selects a cloud provider + AI model. The system outputs a full cost breakdown in **USD** with a KZT equivalent shown alongside (1 USD = 450 KZT, configurable).

---

## 2. SUPPORTED PROVIDERS & COMPUTE PRICING

### Hosting / Compute

| Provider | Tier / Plan | Monthly USD | Notes |
|---|---|---|---|
| **Firebase (Google)** | Spark Free | $0.00 | 125K fn invocations free |
| **Firebase (Google)** | Blaze Pay-as-you-go | $0.40/1M fn calls | +$0.00001/GB-sec |
| **AWS** | EC2 t3.micro | $7.59 | 2 vCPU, 1 GB RAM, us-east-1 |
| **AWS** | EC2 t3.small | $15.18 | 2 vCPU, 2 GB RAM |
| **AWS** | Lambda (serverless) | $0.20/1M req | +$0.00001667/GB-sec |
| **GCP** | Cloud Run (serverless) | $0.00 first 2M req | $0.40/1M after |
| **GCP** | Compute e2-micro | $6.11 | 2 vCPU, 1 GB RAM |
| **GCP** | Compute e2-small | $12.23 | 2 vCPU, 2 GB RAM |
| **Azure** | B1s (Standard) | $7.59 | 1 vCPU, 1 GB RAM |
| **Azure** | B2s (Standard) | $15.18 | 2 vCPU, 4 GB RAM |
| **Digital Ocean** | Basic Droplet | $4.00 | 1 vCPU, 1 GB RAM |
| **Digital Ocean** | Basic Droplet | $6.00 | 1 vCPU, 2 GB RAM |
| **PS Cloud (KZ)** | Стандартный VPS | $7.80 | ≈3 500 ₸, 2 vCPU, 4 GB |
| **Qaztelecom (KZ)** | VPS Lite | $4.44 | ≈2 000 ₸, 1 vCPU, 1 GB |
| **Qaztelecom (KZ)** | VPS Standard | $8.89 | ≈4 000 ₸, 2 vCPU, 2 GB |

### Storage

| Provider | Free Tier | Price Beyond Free |
|---|---|---|
| Firebase Firestore | 1 GB | $0.18/GB |
| AWS S3 | 5 GB (12mo) | $0.023/GB |
| GCP Cloud Storage | 5 GB | $0.020/GB |
| Azure Blob Storage | 5 GB (12mo) | $0.018/GB |
| Digital Ocean Spaces | 250 GB included | $0.02/GB |
| PS Cloud / Qaztelecom | 20 GB included | $0.022/GB |

### Bandwidth / Egress

| Provider | Free Tier | Price Beyond Free |
|---|---|---|
| Firebase Hosting | 10 GB/mo | $0.08/GB |
| AWS CloudFront | 1 TB/mo | $0.085/GB |
| GCP CDN | 10 GB/mo | $0.08/GB |
| Azure CDN | 5 GB/mo | $0.087/GB |
| Digital Ocean CDN | 1 TB included | $0.01/GB |
| PS Cloud / Qaztelecom | 100 GB included | $0.05/GB |

---

## 3. AI MODEL PRICING

All prices per **1 million tokens** (USD).

| Provider | Model | Input $/1M | Output $/1M | Multiplier | Notes |
|---|---|---|---|---|---|
| **OpenAI** | GPT-4.1o (Free/Beta) | $0.00 | $0.00 | 0x | Beta access |
| **OpenAI** | GPT-4o | $2.50 | $10.00 | — | Included in some plans |
| **OpenAI** | GPT-5 mini | $0.40 | $1.60 | — | Included in some plans |
| **Anthropic** | Claude Haiku 4.5 | $0.80 | $4.00 | 0.33x | $0.25 effective cost |
| **Google** | Gemini 2.5 Pro | $1.25 | $10.00 | 1x | $3.50 reference cost |
| **Google** | Gemini 3 Flash (Preview) | $0.075 | $0.30 | 0.33x | $0.10 effective |
| **Google** | Gemini 3 Pro (Preview) | $1.25 | $5.00 | 1x | $3.50 effective |
| **Google** | Gemini 3.1 Pro (Preview) | $1.25 | $5.00 | 1x | $3.50 effective |
| **PS Cloud** | Raptor mini (Preview) | $0.00 | $0.00 | 0x | Free preview |

---

## 4. MATHEMATICAL COST MODELS

### 4.1 Variables
```
daily_messages         — messages processed per day
monthly_messages       = daily_messages × 30
monthly_active_users   — unique users per month
tokens_in              — avg input tokens per message (incl. system prompt)
tokens_out             — avg output tokens per response
avg_exec_ms            — avg Cloud Function execution time (ms)
memory_gb              — function memory allocation (GB)
stored_gb              — total data stored (GB)
```

### 4.2 AI API Cost
```
cost_ai = (monthly_messages × tokens_in  / 1_000_000 × price_input)
        + (monthly_messages × tokens_out / 1_000_000 × price_output)
```

### 4.3 Compute Cost

**Serverless (Firebase Blaze / AWS Lambda / GCP Cloud Run):**
```
invocations    = monthly_messages × 2           // req + response
gb_seconds     = invocations × (avg_exec_ms/1000) × memory_gb

// Firebase Blaze example:
free_inv       = 2_000_000
cost_inv       = max(0, invocations - free_inv) / 1_000_000 × 0.40
free_gb_sec    = 400_000
cost_compute   = max(0, gb_seconds - free_gb_sec) × 0.00001
cost_functions = cost_inv + cost_compute
```

**Fixed VPS (AWS EC2 / Azure / DO / PS Cloud / Qaztelecom):**
```
cost_compute = fixed_monthly_usd   // flat rate from pricing table
```

### 4.4 Storage Cost
```
billable_storage = max(0, stored_gb - free_tier_gb)
cost_storage     = billable_storage × price_per_gb
```
Storage estimate:
```
stored_gb = (monthly_messages × 2_000 bytes + monthly_active_users × 1_000 bytes) / 1_073_741_824
```

### 4.5 Bandwidth Cost
```
msg_egress_gb   = monthly_messages × 500 / 1_073_741_824
asset_egress_gb = monthly_active_users × 2 / 1_024        // 2 MB per user (cached assets)
total_egress_gb = msg_egress_gb + asset_egress_gb

billable_egress = max(0, total_egress_gb - free_egress_gb)
cost_bandwidth  = billable_egress × price_per_gb
```

### 4.6 Total Monthly Cost
```
TOTAL = cost_ai + cost_compute + cost_storage + cost_bandwidth
COST_PER_MESSAGE = TOTAL / monthly_messages
KZT_EQUIVALENT  = TOTAL × 450
```

---

## 5. INPUT PARAMETERS

| Parameter | Type | Default | Min | Max |
|---|---|---|---|---|
| daily_messages | integer | 1,000 | 1 | 10,000,000 |
| monthly_active_users | integer | 500 | 1 | 1,000,000 |
| tokens_in | integer | 500 | 50 | 128,000 |
| tokens_out | integer | 300 | 10 | 16,000 |
| avg_exec_ms | integer | 800 | 100 | 30,000 |
| memory_gb | float | 0.25 | 0.125 | 8 |
| provider | enum | firebase | — | — |
| ai_model | enum | gemini-flash | — | — |

---

## 6. EDGE CASES

| Scenario | Handling |
|---|---|
| daily_messages = 0 | Error: "Must be > 0" |
| All infra within free tier | Show $0.00 + "Free tier" badge |
| tokens_in > model context limit | Warning displayed |
| Free AI model selected | cost_ai = $0.00, note shown |
| KZ provider selected | Show ₸ price prominently |

---

## 7. UI/UX REQUIREMENTS

- Dark theme, professional CFO aesthetic
- Left: input sliders + dropdowns
- Right: real-time cost cards per component
- Bottom: comparison bar chart (all providers)
- Color: green < $50, yellow $50–$500, red > $500
- Dual display: USD primary, KZT secondary
- Export to CSV button
- Fully responsive (mobile-first)

---

*SSOT v1.0.0 — Single Source of Truth for CFO Bot*
