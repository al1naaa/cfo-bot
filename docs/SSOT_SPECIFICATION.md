# CFO Bot - System Specification (SSOT)

---

## 1. Executive Summary

CFO Bot estimates monthly infrastructure costs for a Chat Bot application. The user inputs usage assumptions (messages per day, users, token sizes) and selects a cloud provider and AI model. The system outputs a full cost breakdown in USD with a KZT equivalent shown alongside (1 USD = 450 KZT, configurable).

---

## 2. Supported Providers and Compute Pricing

### Hosting / Compute

| Provider          | Tier / Plan             | Monthly USD        | Notes                          |
|-------------------|-------------------------|--------------------|--------------------------------|
| Firebase (Google) | Spark Free              | $0.00              | 125K fn invocations free       |
| Firebase (Google) | Blaze Pay-as-you-go     | $0.40/1M fn calls  | +$0.00001/GB-sec               |
| AWS               | EC2 t3.micro            | $7.59              | 2 vCPU, 1 GB RAM, us-east-1   |
| AWS               | EC2 t3.small            | $15.18             | 2 vCPU, 2 GB RAM               |
| AWS               | Lambda (serverless)     | $0.20/1M req       | +$0.00001667/GB-sec            |
| GCP               | Cloud Run (serverless)  | $0.00 first 2M req | $0.40/1M after                 |
| GCP               | Compute e2-micro        | $6.11              | 2 vCPU, 1 GB RAM               |
| GCP               | Compute e2-small        | $12.23             | 2 vCPU, 2 GB RAM               |
| Azure             | B1s (Standard)          | $7.59              | 1 vCPU, 1 GB RAM               |
| Azure             | B2s (Standard)          | $15.18             | 2 vCPU, 4 GB RAM               |
| Digital Ocean     | Basic Droplet           | $4.00              | 1 vCPU, 1 GB RAM               |
| Digital Ocean     | Basic Droplet           | $6.00              | 1 vCPU, 2 GB RAM               |
| PS Cloud (KZ)     | Standard VPS            | $7.80              | ~3,500 KZT, 2 vCPU, 4 GB      |
| Qaztelecom (KZ)   | VPS Lite                | $4.44              | ~2,000 KZT, 1 vCPU, 1 GB      |
| Qaztelecom (KZ)   | VPS Standard            | $8.89              | ~4,000 KZT, 2 vCPU, 2 GB      |

### Storage

| Provider                | Free Tier    | Price Beyond Free |
|-------------------------|--------------|-------------------|
| Firebase Firestore      | 1 GB         | $0.18/GB          |
| AWS S3                  | 5 GB (12mo)  | $0.023/GB         |
| GCP Cloud Storage       | 5 GB         | $0.020/GB         |
| Azure Blob Storage      | 5 GB (12mo)  | $0.018/GB         |
| Digital Ocean Spaces    | 250 GB       | $0.02/GB          |
| PS Cloud / Qaztelecom   | 20 GB        | $0.022/GB         |

### Bandwidth / Egress

| Provider                | Free Tier    | Price Beyond Free |
|-------------------------|--------------|-------------------|
| Firebase Hosting        | 10 GB/mo     | $0.08/GB          |
| AWS CloudFront          | 1 TB/mo      | $0.085/GB         |
| GCP CDN                 | 10 GB/mo     | $0.08/GB          |
| Azure CDN               | 5 GB/mo      | $0.087/GB         |
| Digital Ocean CDN       | 1 TB         | $0.01/GB          |
| PS Cloud / Qaztelecom   | 100 GB       | $0.05/GB          |

---

## 3. AI Model Pricing

All prices per 1 million tokens (USD).

| Provider   | Model                      | Input $/1M | Output $/1M | Notes          |
|------------|----------------------------|------------|-------------|----------------|
| OpenAI     | GPT-4.1o (Free/Beta)       | $0.00      | $0.00       | Beta access    |
| OpenAI     | GPT-4o                     | $2.50      | $10.00      | -              |
| OpenAI     | GPT-5 mini                 | $0.40      | $1.60       | -              |
| Anthropic  | Claude Haiku 4.5           | $0.80      | $4.00       | 0.33x cost tag |
| Google     | Gemini 2.5 Pro             | $1.25      | $10.00      | -              |
| Google     | Gemini 3 Flash (Preview)   | $0.075     | $0.30       | 0.33x cost tag |
| Google     | Gemini 3 Pro (Preview)     | $1.25      | $5.00       | -              |
| Google     | Gemini 3.1 Pro (Preview)   | $1.25      | $5.00       | -              |
| PS Cloud   | Raptor mini (Preview)      | $0.00      | $0.00       | Free preview   |

---

## 4. Mathematical Cost Models

### 4.1 Input Variables

```
daily_messages         - messages processed per day (integer, 1 to 10,000,000)
monthly_messages       = daily_messages * 30
monthly_active_users   - unique users per month (integer, 1 to 1,000,000)
tokens_in              - avg input tokens per message including system prompt (integer, 50 to 128,000)
tokens_out             - avg output tokens per response (integer, 10 to 16,000)
avg_exec_ms            - avg Cloud Function execution time in milliseconds (integer, 100 to 30,000)
memory_gb              - function memory allocation in GB (float, 0.125 to 8)
stored_gb              - total data stored, derived from message volume
```

### 4.2 AI API Cost

The AI cost is the sum of input and output token costs:

```
cost_ai = (monthly_messages * tokens_in  / 1,000,000) * price_input
        + (monthly_messages * tokens_out / 1,000,000) * price_output
```

Where `monthly_messages = daily_messages * 30`.

For free-tier models (GPT-4.1o, Raptor mini):

```
cost_ai = 0
```

### 4.3 Compute Cost

**Serverless platforms (Firebase Blaze, AWS Lambda, GCP Cloud Run):**

```
invocations = monthly_messages * 2          -- request + response round-trip
gb_seconds  = invocations * (avg_exec_ms / 1000) * memory_gb

cost_invocations = max(0, invocations - free_inv_limit) / 1,000,000 * inv_price_per_1M
cost_gb_seconds  = max(0, gb_seconds  - free_gb_sec_limit) * gb_sec_price

cost_compute = cost_invocations + cost_gb_seconds
```

Example thresholds:
- Firebase Blaze / GCP Cloud Run: `free_inv_limit = 2,000,000`, `free_gb_sec_limit = 400,000`
- AWS Lambda: `free_inv_limit = 1,000,000`, `free_gb_sec_limit = 400,000`

**Fixed VPS (AWS EC2, Azure, Digital Ocean, PS Cloud, Qaztelecom):**

```
cost_compute = fixed_monthly_usd   -- flat rate, independent of traffic
```

### 4.4 Storage Cost

Storage volume is estimated from message and user data:

```
stored_bytes = (monthly_messages * 2,000) + (monthly_active_users * 1,000)
stored_gb    = stored_bytes / 1,073,741,824

billable_storage_gb = max(0, stored_gb - free_tier_gb)
cost_storage        = billable_storage_gb * price_per_gb
```

### 4.5 Bandwidth / Egress Cost

Outbound traffic is estimated from message payload and static asset delivery:

```
msg_egress_gb   = (monthly_messages * 500 bytes) / 1,073,741,824
asset_egress_gb = monthly_active_users * 2 MB / 1,024
total_egress_gb = msg_egress_gb + asset_egress_gb

billable_egress_gb = max(0, total_egress_gb - free_egress_gb)
cost_bandwidth     = billable_egress_gb * price_per_gb
```

AWS CloudFront uses tiered pricing beyond the free tier:

```
if billable_egress_gb > 1,024:
    cost_bandwidth = 1,024 * 0.085 + (billable_egress_gb - 1,024) * 0.070
else:
    cost_bandwidth = billable_egress_gb * 0.085
```

### 4.6 Total Monthly Cost

```
TOTAL_USD       = cost_ai + cost_compute + cost_storage + cost_bandwidth
cost_per_msg    = TOTAL_USD / monthly_messages
KZT_equivalent  = TOTAL_USD * 450
```

---

## 5. Input Parameters

| Parameter             | Type    | Default   | Min | Max        |
|-----------------------|---------|-----------|-----|------------|
| daily_messages        | integer | 1,000     | 1   | 10,000,000 |
| monthly_active_users  | integer | 500       | 1   | 1,000,000  |
| tokens_in             | integer | 500       | 50  | 128,000    |
| tokens_out            | integer | 300       | 10  | 16,000     |
| avg_exec_ms           | integer | 800       | 100 | 30,000     |
| memory_gb             | float   | 0.25      | 0.125 | 8        |
| provider              | enum    | firebase  | -   | -          |
| ai_model              | enum    | gemini-3-flash | - | -         |

---

## 6. Edge Cases and Error Handling

| Scenario                             | System Response                                          |
|--------------------------------------|----------------------------------------------------------|
| daily_messages = 0                   | Error: "Must be > 0"                                     |
| All infra within free tier           | Show $0.00 with "Free tier" badge                        |
| tokens_in > model context limit      | Warning displayed, calculation proceeds                  |
| Free AI model selected               | cost_ai = $0.00, note shown to user                      |
| KZ provider selected                 | Show KZT price prominently alongside USD                 |
| User not authenticated               | Prompt login; parameters not persisted                   |

---

## 7. UI/UX Requirements

- Dark and light theme toggle, professional CFO aesthetic
- Left panel: input sliders and dropdowns
- Right panel: real-time cost cards per provider
- Bottom section: comparison bar chart across all providers
- Color coding: green below $50, yellow $50-$500, red above $500
- Dual display: USD primary, KZT secondary
- Export to CSV or PDF
- User registration and login with session persistence
- Fully responsive layout (mobile-first)
