# 🇮🇳 CivicFlow India

### Election Education Platform

A **production-grade, secure, and accessible civic education web platform** that helps users understand Indian elections through:

* 🗳 Interactive simulations
* 📊 Historical data exploration
* 🤖 Structured AI-powered civic Q&A
* 🌍 Multilingual translation
* 🎙 Voice-enabled learning

> ⚠ This is an educational platform and is **not** an official government source.

---

## 🔗 Links

* 💻 **Repository:** https://github.com/Swarnava123-C/civic-compass

---

# 🎯 Project Objective

CivicFlow makes Indian electoral systems:

* Understandable
* Transparent
* Interactive
* Accessible for students and first-time voters

The platform combines simulation logic, structured AI assistance, accessibility standards, and secure backend design.

---

# 🖼 Platform Preview

## 1️⃣ Interactive Election Dashboard

* National & state KPIs
* Turnout visualization
* Vote share distribution
* Fully keyboard navigable



```md

```
<img width="1885" height="852" alt="image" src="https://github.com/user-attachments/assets/1b23c4f8-4c20-448b-989e-29553d3d308e" />

<img width="1877" height="848" alt="image" src="https://github.com/user-attachments/assets/befa6b43-5a96-4e53-95e1-f3e1380e67ba" />

---

## 2️⃣ Mock Election Simulator (Core Feature)

* First-Past-The-Post seat allocation
* Swing adjustment modeling
* Coalition logic
* Cube-rule-based seat conversion
* Deterministic, test-covered simulation engine



```md
<img width="1872" height="833" alt="image" src="https://github.com/user-attachments/assets/37e4db4d-a767-4b3f-9b5b-114bba03e2eb" />

```

---

## 3️⃣ AI Civic Assistant

* Structured response mode
* Streaming responses
* Neutrality enforcement
* Prompt-injection protection
* Server-side API isolation



```md
<img width="1860" height="844" alt="image" src="https://github.com/user-attachments/assets/8043ef62-1321-4607-925c-87f5bdf14983" />

```

---

## 4️⃣ Interactive India Electoral Map

* State-wise interaction
* Keyboard-accessible tile grid
* Turnout-based visualization
* Dynamic state selection

📸 Add screenshot here:

```md
<img width="1870" height="840" alt="image" src="https://github.com/user-attachments/assets/83c8f788-1bc5-4321-9949-2468a9376ad5" />

```

---

## 5️⃣ Accessibility & Voice System

* 12 Indian languages
* Speech-to-Text (STT)
* Text-to-Speech (TTS)
* Reduced motion support
* WCAG-aware UI structure

---

# 🏗 Architecture

## Frontend Structure

```
src/
├── components/        # Timeline, ChatBox, Quiz, Map, Dashboard
├── pages/             # Route-level pages
├── data/              # Civic content (timeline, FAQ, election data)
├── types/             # Strict TypeScript types
├── utils/             # Validation, simulator, analytics, logger
├── hooks/             # Custom hooks (useTranslation)
├── voice/             # STT, TTS, subtitles
├── test/              # Unit + integration tests
│   └── integration/   # Keyboard nav, AI flow, accessibility audits
└── integrations/      # Backend client
```

## Backend (Supabase Edge Functions)

```
supabase/
└── functions/
    ├── civic-chat/    # AI proxy with non-partisan guardrails
    └── translate/     # Multilingual translation proxy
```

---

# 🧠 Core Features

| Feature                 | Description                                |
| ----------------------- | ------------------------------------------ |
| Election Dashboard      | State-wise turnout & vote share            |
| Historical Trends       | Multi-election comparison                  |
| Mock Election Simulator | FPTP logic with swing & coalition modeling |
| AI Civic Assistant      | Structured, neutral civic Q&A              |
| Civic Quiz              | Knowledge evaluation                       |
| Learning Path           | Progressive civic modules                  |
| Voice System            | 12 languages, STT + TTS                    |
| Accessibility           | Reduced motion, keyboard nav, ARIA support |

---

# 🔐 Security Design

* Centralized input validation (`validation.ts`)
* XSS sanitization & control character stripping
* Rate limiting for AI endpoints
* Server-side AI proxy (no direct client-to-model)
* Message schema validation
* Neutrality enforcement (client + server)
* No exposed API secrets

---

# 🧪 Testing Strategy

| Layer         | Tools           | Scope                                  |
| ------------- | --------------- | -------------------------------------- |
| Unit          | Vitest          | Simulator logic, validation, analytics |
| Integration   | Testing Library | Chat flow, keyboard navigation         |
| Accessibility | axe-core        | Automated WCAG audits                  |
| Security      | Custom tests    | Prompt injection & partisan blocking   |

### Quality Guarantees

✔ Zero TypeScript errors
✔ ESLint clean
✔ CI enforced

---

# ⚙ TypeScript Strict Mode

```ts
strict: true
noUnusedLocals: true
noUnusedParameters: true
noImplicitOverride: true
noFallthroughCasesInSwitch: true
```

All builds fail on type violations.

---

# 🔄 CI Pipeline

GitHub Actions workflow:

* Install dependencies
* ESLint check
* Type-check (`tsc --noEmit`)
* Run tests with coverage
* Fail on any lint, type, or test errors

---

# 📊 Services Architecture

```
CLIENT (React SPA)
   │
   ├── Google Analytics 4 (consent gated)
   ├── Translation Hook
   ├── Voice System
   │
   ▼
Edge Functions (Server-side)
   ├── /civic-chat  (AI proxy)
   └── /translate   (AI translation)
```

---

# 📈 Services & Justification

| Service            | Purpose                   | Security                    | Cost Control    |
| ------------------ | ------------------------- | --------------------------- | --------------- |
| Google Analytics 4 | Simulator & feature usage | anonymize_ip, consent gated | Free tier       |
| AI Translation     | 12-language civic content | Server-only calls           | Cached          |
| AI Chat            | Structured civic Q&A      | Guardrails + validation     | Token optimized |

Translation uses Lovable AI Gateway (Gemini models).
No direct client exposure to AI APIs.

---

# 🚀 Getting Started

```bash
npm install
npm run dev
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

---

# 🌍 Deployment

Built with:

* Vite
* React + TypeScript
* Tailwind CSS
* Supabase Edge Functions

Optimized production bundle with tree-shaking and code-splitting.

---

# 📜 License

Educational use only.
Not affiliated with the Election Commission of India.
Verify official information at: [https://eci.gov.in](https://eci.gov.in)

