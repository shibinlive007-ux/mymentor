# My Mentor — UPSC 2027 Adaptive Study System

A production-quality web application built for UPSC Civil Services Examination (CSE) 2027 aspirants.
**My Mentor** is an adaptive personal study planner, syllabus coverage tracker, resilient focus timer, spaced revision manager, and grounded mentor.

> [!IMPORTANT]
> **Syllabus Seed Verification Notice**:
> The seed data located in `supabase/seed/` (`prelims_syllabus.json`, `mains_syllabus.json`, and `optionals_seed.json`) provides a structured baseline hierarchy for Prelims (GS I & CSAT), Mains (GS I–IV), and popular Optionals. **Verify this seed data against the latest official UPSC notification** when released for your target attempt year to account for any micro-topic wording updates.

---

## 🚀 9-Phase Implementation Status (Completed)

| Phase | Module | Status | Highlights |
|---|---|---|---|
| **Phase 1** | Foundations & Architecture | ✅ Done | Next.js 16 (App Router), Supabase PostgreSQL, RLS on every table, 4-tab calm layout shell. |
| **Phase 2** | Onboarding & Memory Engine | ✅ Done | 6-step calibration wizard, heuristic fact extractor (`upsc_mentor_memories`), custom target hours. |
| **Phase 3** | Official Syllabus Tracker | ✅ Done | Hierarchical coverage tree, 4-factor completion formula (1st read, notes, pyqs, 3 revisions), stage rollups. |
| **Phase 4** | Adaptive Daily Scheduler | ✅ Done | Deterministic rules engine, 20s morning check-in, 35% subject weekly cap, Minimum Viable Day fallback. |
| **Phase 5** | Resilient Study Timer | ✅ Done | Stopwatch & Pomodoro with timestamp diffing (survives tab closure), session logging, guilt-free encouragement. |
| **Phase 6** | Spaced Repetition Manager | ✅ Done | 1, 7, 21, 45-day review intervals, 3 human-in-the-loop recovery strategies, retention freshness gauge. |
| **Phase 7** | Analytics & Strategic Review | ✅ Done | Recharts volume chart, 35% weekly subject cap guardrails, 30-day consistency heatmap, stage progress cards. |
| **Phase 8** | Grounded UPSC 2027 Mentor | ✅ Done | Built-in $0-cost strategy engine (Mains 3-part blueprint, Ethics 5-step framework, Prelims PYQ pillars). |
| **Phase 9** | Commercialization & Polish | ✅ Done | Razorpay India checkout, rate limiting, DPDP Act 2023 data export/wipe, error boundaries, PWA audit. |

---

## 💡 Commercialization & Scaling to 1,000+ Aspirants ($0 Operating Cost)

To protect the creator from massive, unpredictable monthly OpenAI API bills ($50–$300+/month), the application is architected to operate at **$0 monthly operating cost** on free tiers:

1. **Deterministic Core AI**: Daily planning, spaced repetition, subject guardrails, and mentorship logic run client-side in TypeScript. Zero external LLM token fees are consumed.
2. **Supabase Database Free Tier**:
   - Free tier includes 500 MB database storage and 50,000 monthly active users.
   - All 15 tables feature strict Row-Level Security (RLS) policies and B-tree indexes for zero-overhead query execution.
   - Use Supavisor / PgBouncer connection pooling (`NEXT_PUBLIC_SUPABASE_URL`) for high-concurrency client sessions.
3. **Vercel Edge & Serverless Free Tier**:
   - In-memory sliding window rate limiter (`src/lib/rate-limit.ts`) prevents route abuse and spam.
   - Static route pre-rendering (`○ Static`) for maximum edge caching efficiency.
4. **India-First Razorpay Integration**:
   - Supports UPI (Google Pay, PhonePe, Paytm), RuPay, Debit/Credit Cards, and NetBanking.
   - Cryptographic HMAC SHA-256 webhook signature verification (`/api/webhooks/razorpay`).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript (strict), Tailwind CSS v4
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS) on **every** table
- **Auth**: Supabase Auth (Email OTP + OAuth)
- **Charts & UI**: Recharts, Lucide React
- **Payments**: Razorpay Subscriptions (India-first, UPI / cards) with Mock fallback for development
- **Privacy & Compliance**: India DPDP Act 2023 data portability export & right-to-erasure purge
- **PWA**: Installable Progressive Web App with offline service worker caching

---

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shibinlive007-ux/mymentor.git
cd mymentor
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `OPENAI_API_KEY` | Optional. If omitted, app seamlessly uses built-in deterministic planner |
| `RAZORPAY_KEY_ID` | Razorpay Key ID for payments (UPI/Cards) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret |
| `NEXT_PUBLIC_APP_URL` | Public application URL (`http://localhost:3000` or production domain) |

### 3. Run Migrations in Supabase
Execute the SQL files located in `supabase/migrations/` inside your Supabase SQL editor:
1. `20261006000001_initial_schema.sql` (Creates all 15 core tables)
2. `20261006000002_rls_policies.sql` (Applies RLS policies, indexes, and triggers)
3. `20261006000003_seed_syllabus.sql` (Populates official syllabus nodes)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Unit Testing & Verification

The project includes 59 automated unit tests across 12 test suites verifying all core mathematical and pedagogical logic:
```bash
npm test
```
- **Completion Formula**: Rollup mathematics across topics and subjects.
- **Planner Rules**: Minimum Viable Day triggers, 35% subject weekly cap guardrails.
- **Spaced Repetition**: 1, 7, 21, 45-day review intervals and recovery strategies.
- **Rate Limiting**: Sliding window throttling and response headers.
- **Subscriptions & Entitlements**: Trial days countdown, webhook HMAC validation, mock provider.
- **Mentor Engine**: Mains blueprint, Ethics case studies, Prelims PYQ pillars.

---

## 🚢 Production Build & Linting

```bash
npm run lint
npm run build
```
Generates 20 statically and dynamically optimized routes with Turbopack.
