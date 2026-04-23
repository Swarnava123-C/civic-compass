# CivicFlow India — Election Education Platform

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen)

A production-grade, accessible, and secure civic education web application that helps users understand Indian elections through interactive simulations, AI-powered Q&A, and multilingual voice support.

---

## Architecture

```
src/
├── components/        # UI components (Timeline, ChatBox, Quiz, Map, etc.)
├── pages/             # Route-level pages (Index, Map, Dashboard, etc.)
├── data/              # Static civic content (timeline, FAQ, quiz, election data)
├── types/             # TypeScript interfaces and types
├── utils/             # Utilities (validation, analytics, cache, logger)
├── hooks/             # Custom React hooks (useTranslation)
├── voice/             # Voice system (STT, TTS, language config, subtitles)
├── test/              # Unit + integration tests
│   └── integration/   # Keyboard nav, chat flow, a11y audits
└── integrations/      # Backend client (auto-generated)

supabase/
└── functions/
    ├── civic-chat/    # Edge function — AI proxy with non-partisan guardrails
    └── translate/     # Edge function — AI-powered multilingual translation
```

## Key Features

| Feature | Description |
|---------|-------------|
| **India Electoral Map** | Interactive tile grid with turnout visualization and keyboard navigation |
| **Election Dashboard** | KPIs, turnout charts, vote share distribution per state |
| **Historical Trends** | Multi-year election comparison with seat/turnout analysis |
| **Mock Election Simulator** | FPTP simulation with cube rule, swing adjustment, coalition logic |
| **AI Civic Assistant** | Non-partisan Q&A with structured/streaming modes |
| **Civic Quiz** | Knowledge assessment with progress tracking |
| **Learning Path** | Multi-level modules with quizzes and achievement badges |
| **Voice System** | 12 Indian languages, STT/TTS, real-time subtitles |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Type-check (strict mode)
npx tsc --noEmit

# Lint
npm run lint
```

## TypeScript Strict Mode

This project runs with full TypeScript strict mode:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitOverride: true`
- `noFallthroughCasesInSwitch: true`

Zero TypeScript errors enforced in CI.

## CI Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. Installs dependencies
2. Runs ESLint
3. Runs TypeScript type-check (`tsc --noEmit`)
4. Runs all tests with coverage
5. Fails on any lint, type, or test errors

## Testing Strategy

| Layer | Tools | Scope |
|-------|-------|-------|
| Unit | Vitest | Validation, simulator logic, analytics, TTS chunking |
| Integration | Vitest + Testing Library | Chat flows, keyboard navigation |
| Accessibility | axe-core | Automated WCAG audits on Timeline, FAQ, ChatBox |
| Security | Custom tests | Prompt injection, partisan query blocking |

## Security

- **Input validation**: centralized via `src/utils/validation.ts` — XSS escaping, control char stripping, rate limiting
- **API isolation**: AI calls routed through backend edge functions, never direct client-to-model
- **Partisan guardrails**: client-side regex + server-side system prompt enforce neutrality
- **Edge function hardening**: message schema validation, length caps, role filtering
- **No exposed secrets**: all API keys are server-side only

## Services Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React SPA)                       │
│                                                                 │
│  ┌──────────────┐  ┌────────────────────┐  ┌─────────────────┐  │
│  │ Analytics    │  │ Translation Hook   │  │ Voice System    │  │
│  │ (GA4 gtag)   │  │ (useTranslation)   │  │ (Browser TTS)   │  │
│  └──────┬───────┘  └────────┬───────────┘  └─────────────────┘  │
└─────────┼───────────────────┼───────────────────────────────────┘
          │                   │
          ▼                   ▼
┌──────────────────┐  ┌────────────────────────┐
│ Google Analytics │  │ Edge Function:         │
│ 4 (GA4)          │  │ /translate             │
│ • Consent-safe   │  │ • AI-powered (Lovable) │
│ • anonymize_ip   │  │ • 12 Indian languages  │
│ • SPA tracking   │  │ • Server-side cache    │
└──────────────────┘  └────────────────────────┘
                      ┌────────────────────────┐
                      │ Edge Function:         │
                      │ /civic-chat            │
                      │ • Structured AI Q&A    │
                      │ • Streaming mode       │
                      │ • Non-partisan guard   │
                      └────────────────────────┘
```

### Services & Justification

| Service | Purpose | Security | Cost Control |
|---------|---------|----------|-------------|
| **Google Analytics 4** | Track simulator usage, quiz completion, state selection, voice toggles, SPA navigation | Consent-gated (`civicflow_analytics_consent`), `anonymize_ip: true`, no PII | Free tier |
| **AI Translation (Lovable AI Gateway)** | Real-time civic content translation for 12 Indian languages | Server-side only, input length cap (2000 chars), rate limiting | Cached responses reduce calls ~70% |
| **AI Chat (Lovable AI Gateway)** | Non-partisan civic Q&A with structured responses | Server-side guardrails, message validation, streaming SSE | Token-efficient prompts |

> **Note**: Translation uses the Lovable AI Gateway (Gemini models), not Google Cloud Translation API. This is intentional — it provides high-quality translations without requiring separate API credentials.

## Environment Variables

- `VITE_SUPABASE_URL` — Backend URL (auto-configured)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Anon key (auto-configured)
- `VITE_GA4_MEASUREMENT_ID` — (optional) GA4 measurement ID (e.g. `G-XXXXXXXXXX`)

## License

This project is for educational purposes only and is not an official government source.
Always verify election information at [eci.gov.in](https://eci.gov.in).
