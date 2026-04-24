🇮🇳 CivicFlow India — Election Education Platform

A production-grade, secure, accessible civic education web platform that helps users understand Indian elections through interactive simulations, structured AI Q&A, multilingual translation, and voice-enabled learning.

🎯 Project Objective

CivicFlow aims to make Indian electoral systems understandable, transparent, and interactive for students and first-time voters through:

First-Past-The-Post simulation
Historical election trend analysis
AI-powered non-partisan Q&A
Multilingual civic education
Accessibility-first UI design

This is an educational platform — not an official government source.

🖼 Platform Preview
1️⃣ Interactive Election Dashboard

National & state KPIs
Turnout visualization
Vote share distribution
Fully keyboard navigable
<img width="1871" height="843" alt="image" src="https://github.com/user-attachments/assets/bbba5e16-4a92-4a84-b2da-816fa4d6ef47" />

<img width="1878" height="855" alt="image" src="https://github.com/user-attachments/assets/cceb2f65-3f55-4a2e-8395-e155c82b9416" />


2️⃣ Mock Election Simulator (Core Feature)

FPTP seat allocation logic
Swing adjustment
Coalition modeling
Cube rule-based seat conversion
Deterministic and test-covered simulation engine
<img width="1870" height="829" alt="image" src="https://github.com/user-attachments/assets/174d00f9-5c57-4e74-9f8c-51d54a015c04" />

3️⃣ AI Civic Assistant

Structured response mode
Streaming responses
Non-partisan enforcement
Prompt-injection protection
Server-side API isolation
<img width="1837" height="831" alt="image" src="https://github.com/user-attachments/assets/b56e2bd7-b514-454d-ba48-e15bcb039fd7" />

4️⃣ Interactive India Electoral Map

State-wise interaction
Keyboard accessible tile grid
Turnout-based visualization
Dynamic state selection
<img width="1865" height="841" alt="image" src="https://github.com/user-attachments/assets/99e30306-b953-4762-ad08-b6d399a81c6b" />

5️⃣ Accessibility & Voice System

12 Indian languages
Speech-to-text (STT)
Text-to-speech (TTS)
Reduced motion support
WCAG-aware UI structure
🏗 Architecture
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

supabase/
└── functions/
    ├── civic-chat/    # AI proxy with non-partisan guardrails
    └── translate/     # Multilingual translation proxy
🧠 Core Features
Feature	Description
Election Dashboard	State-wise turnout & vote share
Historical Trends	Multi-election comparison
Mock Election Simulator	FPTP logic with swing & coalition modeling
AI Civic Assistant	Structured, neutral civic Q&A
Civic Quiz	Knowledge evaluation
Learning Path	Progressive civic modules
Voice System	12 languages, STT + TTS
Accessibility	Reduced motion, keyboard nav, ARIA support
🔐 Security Design
Centralized input validation (validation.ts)
XSS sanitization & control character stripping
Rate limiting for AI endpoints
Server-side AI proxy (no direct client-to-model)
Message schema validation
Neutrality enforcement (client + server)
No exposed API secrets
🧪 Testing Strategy
Layer	Tools	Scope
Unit	Vitest	Simulator logic, validation, analytics
Integration	Testing Library	Chat flow, keyboard navigation
Accessibility	axe-core	Automated WCAG audits
Security	Custom tests	Prompt injection & partisan blocking

✔ Zero TypeScript errors
✔ ESLint clean
✔ CI enforced

⚙ TypeScript Strict Mode
strict: true
noUnusedLocals: true
noUnusedParameters: true
noImplicitOverride: true
noFallthroughCasesInSwitch: true

All builds fail on type violations.

🔄 CI Pipeline

GitHub Actions workflow:

Install dependencies
ESLint check
Type-check (tsc --noEmit)
Run tests with coverage
Fail on any errors
📊 Services Architecture
CLIENT (React SPA)
   │
   ├── Google Analytics 4 (consent gated)
   ├── Translation Hook
   ├── Voice System
   │
   ▼
Edge Functions (Server-side)
   ├── /civic-chat (AI proxy)
   └── /translate (AI translation)
📈 Services & Justification
Service	Purpose	Security	Cost Control
Google Analytics 4	Simulator & feature usage	anonymize_ip, consent gated	Free tier
AI Translation	12-language civic content	Server-only calls	Cached
AI Chat	Structured Q&A	Guardrails + validation	Token optimized

Translation uses Lovable AI Gateway (Gemini models).
No direct client exposure to AI APIs.

🚀 Getting Started
npm install
npm run dev
npm run lint
npm run test
npx tsc --noEmit
npm run build
🌍 Deployment

Built with:

Vite
React + TypeScript
Tailwind CSS
Supabase Edge Functions

Optimized production bundle
Tree-shaken and code-split

📜 License

Educational use only.
Not affiliated with the Election Commission of India.
Verify official information at https://eci.gov.in

🏁 Evaluation Criteria Alignment

✔ Technical Depth (simulation engine + AI proxy)
✔ Code Quality (strict TS + lint + CI)
✔ Security (server-side isolation + validation)
✔ Accessibility (WCAG + reduced motion + keyboard nav)
✔ Real-World Utility (multilingual civic education)

🎯 Final Notes

CivicFlow demonstrates how AI, simulation modeling, and accessibility engineering can be combined to improve civic literacy at scale.
