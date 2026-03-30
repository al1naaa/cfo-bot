# CFO Bot — Pricing Strategy & Cloud Architecture Business Document
**Version:** 1.0 | **Course:** Information Systems — TSIS 3, Phase 4 | **Date:** 2025-06-01

---

## 1. Executive Summary

Using unit economics from the CFO Bot calculator, this document recommends an optimal cloud architecture for a Chat Bot application at three scale tiers: Startup (< 10K msg/day), Growth (10K–500K), and Enterprise (500K+).

The core finding: **AI API cost dominates total infrastructure cost at 60–90%** of monthly spend. Choosing the right model is more impactful than choosing the right cloud provider.

---

## 2. Unit Economics Analysis (from CFO Bot outputs)

### Scenario A — Startup (1,000 messages/day, 200 users)

| Component | Firebase + Gemini Flash | AWS + GPT-4o | DO + Claude Haiku |
|---|---|---|---|
| AI API | $0.05 | $1.13 | $0.05 |
| Compute | $0.00 | $7.59 | $4.00 |
| Storage | $0.00 | $0.00 | $0.00 |
| Bandwidth | $0.00 | $0.00 | $0.00 |
| **Total/mo** | **$0.05** | **$8.72** | **$4.05** |
| Per message | $0.0000017 | $0.00029 | $0.000135 |
| **KZT/mo** | **≈22 ₸** | **≈3,924 ₸** | **≈1,823 ₸** |

**Recommendation for Startup:** Firebase Spark + Gemini 3 Flash — effectively free until 125K invocations.

---

### Scenario B — Growth (50,000 messages/day, 5,000 users)

| Component | Firebase Blaze + Gemini Flash | GCP + Gemini Pro | PS Cloud KZ + Raptor |
|---|---|---|---|
| AI API | $2.25 | $93.75 | $0.00 |
| Compute | $0.00 | $6.11 | $7.80 |
| Storage | $0.00 | $0.20 | $0.00 |
| Bandwidth | $0.00 | $0.96 | $0.00 |
| **Total/mo** | **$2.25** | **$101.02** | **$7.80** |
| Per message | $0.0000015 | $0.0000673 | $0.0000052 |
| **KZT/mo** | **≈1,013 ₸** | **≈45,459 ₸** | **≈3,510 ₸** |

**Recommendation for Growth:** Firebase Blaze + Gemini Flash for global reach; PS Cloud + Raptor mini for KZ-local startups needing zero AI cost.

---

### Scenario C — Enterprise (500,000 messages/day, 50,000 users)

| Component | AWS Lambda + GPT-5 mini | GCP Cloud Run + Gemini Pro | Azure B2s + GPT-4o |
|---|---|---|---|
| AI API | $96.00 | $937.50 | $3,750 |
| Compute | $53.40 | $0.00 | $15.18 |
| Storage | $2.07 | $1.84 | $1.62 |
| Bandwidth | $34.00 | $34.00 | $35.48 |
| **Total/mo** | **$185.47** | **$973.34** | **$3,802.28** |
| Per message | $0.000000124 | $0.0000006 | $0.00000253 |
| **KZT/mo** | **≈83,462 ₸** | **≈438,003 ₸** | **≈1,711,026 ₸** |

**Recommendation for Enterprise:** AWS Lambda + GPT-5 mini — best cost/performance ratio at scale.

---

## 3. Architecture Recommendation by Use Case

### 3.1 Kazakhstan-First Startup
- **Provider:** PS Cloud or Qaztelecom
- **AI Model:** Raptor mini (free preview) → migrate to Gemini Flash
- **Cost:** ~$4–8/mo fixed
- **Benefit:** Low latency for KZ users, KZT billing, local data residency

### 3.2 Global SaaS Chatbot
- **Provider:** Firebase Hosting + GCP Cloud Run
- **AI Model:** Gemini 3 Flash (0.33x cost multiplier)
- **Cost:** Near-zero until 2M requests/month
- **Benefit:** Integrated Google ecosystem, global CDN, pay-as-you-go

### 3.3 High-Quality Premium Chatbot
- **Provider:** AWS Lambda
- **AI Model:** Claude Haiku 4.5 (quality/cost sweet spot)
- **Cost:** ~$15–50/mo at 10K msg/day
- **Benefit:** Best response quality per dollar spent

---

## 4. Key Insights

1. **Free tiers are real:** At < 1K messages/day, total infrastructure cost = ~$0 using Firebase + free AI models.
2. **AI model is the biggest lever:** Switching from GPT-4o to Gemini Flash reduces AI cost by ~97%.
3. **Serverless beats VPS at low-medium scale:** Below 1M requests/month, serverless platforms cost less than any fixed VPS.
4. **KZ providers are price-competitive:** PS Cloud at $7.80/mo matches Azure B1s at $7.59/mo while offering local data residency and KZT billing.
5. **Raptor mini is a strategic advantage for KZ companies:** Zero AI inference cost during preview makes it ideal for local products.

---

## 5. Conclusion

The CFO Bot demonstrates that a modern chat bot application can be operated for **under $10/month at startup scale** using the right combination of free tiers and efficient AI models. As scale grows, the critical decision point is AI model selection — not cloud provider. The recommended path is: **Raptor mini / Gemini Flash → Gemini Pro → GPT-5 mini** as scale and quality requirements increase.

---

*Generated with CFO Bot v1.0 — Cloud Economics Calculator*
