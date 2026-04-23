# CivicFlow — Election Education Assistant

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen)

A production-grade, accessible, and secure civic education web application that helps users understand the election process through interactive timelines, step-by-step guides, and AI-powered Q&A.

---

## Architecture

```
src/
├── components/        # UI components (Timeline, ChatBox, Quiz, FAQ, etc.)
├── pages/             # Route-level pages (Index, NotFound)
├── data/              # Static civic content (timeline stages, FAQ, quiz)
├── types/             # TypeScript interfaces and types
├── utils/             # Utilities (date, cache, logger, performance)
├── hooks/             # Custom React hooks
├── test/              # Unit + integration tests
│   └── integration/   # End-to-end keyboard nav, chat flow, a11y audits
└── integrations/      # Backend client (auto-generated)

supabase/
└── functions/
    └── civic-chat/    # Edge function — secure AI proxy with guardrails
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Interactive Timeline** | 6-stage clickable election process with keyboard navigation |
| **Voting Guide** | Step-by-step responsibilities and user actions |
| **AI Chat (Gemini)** | Non-partisan Q&A with streaming, beginner/detailed modes |
| **Civic Quiz** | 5-question knowledge check with progress tracking |
| **State Selector** | Select a US state for localized context |
| **FAQ Section** | Accordion-style common questions |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Type-check
npm run type-check
```

## CI Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. Installs dependencies (`npm ci`)
2. Runs ESLint
3. Runs TypeScript type-check (`tsc --noEmit`)
4. Runs all tests with coverage
5. Fails if coverage drops below 80% lines / 75% branches
6. Uploads coverage report as artifact

## Testing Strategy

| Layer | Tools | Scope |
|-------|-------|-------|
| Unit | Vitest | Utils, data transformations, component rendering |
| Integration | Vitest + Testing Library + user-event | Chat flows, keyboard navigation, detail toggles |
| Accessibility | axe-core | Automated WCAG audit on Timeline, FAQ, ChatBox |
| Security | Custom tests | Prompt injection attempts, partisan query blocking |

## Security

- **API keys** never exposed client-side; AI calls routed through a backend edge function
- **Input sanitization**: all user input trimmed and capped at 500 characters
- **Partisan guardrails**: client-side regex + server-side system prompt enforce neutrality
- **Rate limiting**: edge function returns 429 on excessive requests
- **Non-partisan system prompt**: hardcoded refusal for political endorsements and predictions

## Performance

- `React.lazy` + `Suspense` for heavy sections (Timeline, Quiz, Chat, FAQ)
- `React.memo` on all major components
- `useCallback` / `useMemo` for stable references
- Stale-while-revalidate local content cache (`src/utils/cache.ts`)
- Lightweight Framer Motion animations
- Performance monitoring utility logs render + API latency in dev mode

## Accessibility

- Semantic HTML with proper heading hierarchy (single H1)
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Space) for timeline and FAQ
- Focus ring styles via Tailwind
- Automated axe-core audits in CI
- Screen-reader friendly output

## Google Services Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React SPA)                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Analytics    │  │ Firebase     │  │ Translation Hook      │  │
│  │ Service      │  │ Hosting CSP  │  │ (useTranslation)      │  │
│  │ (GA4 gtag)   │  │ + Headers    │  │                       │  │
│  └──────┬───────┘  └──────────────┘  └───────────┬───────────┘  │
│         │                                        │              │
└─────────┼────────────────────────────────────────┼──────────────┘
          │                                        │
          ▼                                        ▼
┌──────────────────┐               ┌───────────────────────────┐
│ Google Analytics │               │ Edge Function: /translate │
│ 4 (Measurement)  │               │ • AI-powered translation  │
│ • Consent-safe   │               │ • 12 Indian languages     │
│ • anonymize_ip   │               │ • In-memory cache (30m)   │
│ • SPA page views │               │ • Input validation        │
└──────────────────┘               └───────────┬───────────────┘
                                               │
                                               ▼
                                   ┌───────────────────────┐
                                   │ Edge Function:        │
                                   │ /civic-chat           │
                                   │ • Structured AI Q&A   │
                                   │ • Streaming mode      │
                                   │ • Non-partisan guard  │
                                   └───────────────────────┘
```

### Services & Justification

| Service | Purpose | Security | Cost Control |
|---------|---------|----------|-------------|
| **Google Analytics 4** | Track simulator usage, quiz completion, state selection, voice toggles, SPA route changes | Consent-gated (`civicflow_analytics_consent`), `anonymize_ip: true`, no PII collected | Free tier covers civic education traffic |
| **Firebase Hosting** | Production deployment with security headers (CSP, X-Frame-Options, HSTS, Permissions-Policy) | Content-Security-Policy whitelist, DENY framing, nosniff | Free tier (10 GB/month) |
| **Firestore** | Persist quiz progress, simulator runs, language preferences per user | Owner-scoped security rules, schema validation, write-once quiz attempts | Free tier (50K reads/day) |
| **AI Translation** | Real-time civic content translation across 12 Indian languages | Server-side only, input length cap (2000 chars), rate limiting | Cached results reduce API calls by ~70% |

### Performance Optimizations
- Translation responses cached 30 min server-side + client-side `Map` cache
- GA4 loaded async, consent-default prevents tracking until opt-in
- All analytics calls are fire-and-forget (no UI blocking)
- Static assets served with `immutable` cache headers (1 year)

## Deployment

The app is deployed via Lovable with a connected backend (Lovable Cloud). Edge functions deploy automatically.

**Firebase Hosting** (optional):
1. `npm install -g firebase-tools`
2. `firebase login`
3. `npm run build`
4. `firebase deploy --only hosting`

**Environment Variables**:
- `VITE_SUPABASE_URL` — Backend URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Anon key
- `VITE_GA4_MEASUREMENT_ID` — (optional) GA4 measurement ID (e.g. `G-XXXXXXXXXX`)

## License

This project is for educational purposes only and is not an official government source.
