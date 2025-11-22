## 📌 **TrustBank.AI – Ethical AI Governance System for Banks**

*A fully functional web application demonstrating transparent, fair, and customer-controlled AI decision-making in banking.*



### 🎯 Overview

TrustBank.AI proves that AI-driven banking decisions—loan approvals and fraud detection—can be both powerful and ethical. Every decision is explainable, bias-checked, and **fully controlled by the customer** through consent settings.



### ✨ Key Features

#### 👤 Customer Portal

* Secure Login/Signup (demo accounts included)
* Transparent AI Decision Dashboard
* Instant Loan AI Evaluation
* Real-time Fraud Monitoring
* “Why?” Explanation Pop-ups for every decision
* **Voice-Enabled** natural language explanation
* Data Consent Control for each risk factor
* AI Profile Viewer + Correction Requests

#### 🛡️ Admin Dashboard

* Decision Log — Full AI audit history
* AI Override Tool with justification
* Fairness & Bias Monitoring Dashboard
* Ethical Compliance Metrics
* Immutable Governance Trail

#### 🤖 AI Engines

* Explainable Loan Approval Model
* Real-time Fraud Detection System
* Factor weighting visible for every score
* Consent-aware data usage enforcement



### 🛠 Tech Stack

| Layer         | Tech                                  |
| ------------- | ------------------------------------- |
| Frontend      | React 18 + TypeScript + Vite          |
| Styling       | TailwindCSS + Shadcn UI + Radix UI    |
| State         | React Hooks + LocalStorage            |
| Routing       | React Router v6                       |
| AI Logic      | Custom decision engines in TypeScript |
| Accessibility | Web Speech API                        |

No backend needed. Everything runs securely in the browser.



### 🚀 Quick Start

#### Prerequisites

* Node.js 16+
* npm or pnpm

#### Installation

```sh
git clone https://github.com/Asarafhack/TRUSTBANK.AI-Ethical-AI-Governance-System-for-Banking.git
cd trustbank-ai
npm install
npm run dev
```

Open → [http://localhost:5173](http://localhost:5173)

---

### 🧪 Demo Credentials

| Role     | Email                                           | Password |
| -------- | ----------------------------------------------- | -------- |
| Customer | [customer@demo.com](mailto:customer@demo.com)   | demo123  |
| Admin    | [admin@trustbank.ai](mailto:admin@trustbank.ai) | admin123 |

---

### 📱 Demo Flows

#### 🏦 Customer — Loan Transparency

1. Login as customer
2. Apply for a loan & see immediate AI approval/denial
3. Click **“Why?”** for factor breakdown
4. Toggle data permissions in **Consent Management**
5. Apply again → Compare fairness impact

#### 🔍 Customer — Fraud Monitoring

* View transaction history with alerts
* Explore fraud risk factors
* Try **voice explanations**

#### 🔐 Admin Oversight

* Audit decision history
* Override AI results with reason logging
* View fairness analytics
* Monitor bias trends



### 🧩 Folder Structure

```
src/
│── components/
│   ├── customer/
│   │   ├── DecisionCard.tsx
│   │   └── ExplanationModal.tsx
│   ├── ui/
│   └── ProtectedRoute.tsx
│
├── pages/
│   ├── customer/
│   ├── admin/
│   ├── Index.tsx
│   ├── Login.tsx
│   └── NotFound.tsx
│
├── lib/
│   ├── ai-engine.ts
│   ├── auth.ts
│   ├── storage.ts
│   └── utils.ts
│
├── types/
└── App.tsx
```



### 🔐 AI Ethics & Data Privacy

* All data stored **locally** (no cloud)
* Consent is **real-time enforced**
* Full decision traceability
* Zero personal data collected



### 🧠 Explainable AI — Score Factors

#### Loan Approval

* Credit score — 30%
* Debt-to-income — 25%
* Employment stability — 15%
* Existing liabilities — 15%
* Behavioral data (optional by consent) — 15%

#### Fraud Detection

* Amount anomaly — 30%
* Location change — 25% (consent required)
* Device change — 20% (consent required)
* Merchant risk — 15%
* Time pattern deviation — 10%



### 🏆 What This Demonstrates

✔ Transparency
✔ Explainability
✔ Customer rights & governance
✔ AI fairness auditing
✔ Voice accessibility
✔ Regulatory compliance readiness

Perfect for:

* Banking AI ethics evaluation
* Hackathon submission
* Regulatory design showcase

---

### 🔮 Future Enhancements

* Cloud backend & DB integration
* Real AI models + analytics engine
* Multi-language UX + voice
* Mobile app extension
* Real financial API integration



### 📄 License

For educational and hackathon demonstration purposes only.



### 🤝 Contact

For collaboration or inquiries, reach out via the hackathon / competition platform.

