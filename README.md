# My Mentor — UPSC 2027 Adaptive Study System

A production-quality web app built for UPSC Civil Services Examination (CSE) 2027 aspirants.
**My Mentor** is an adaptive personal study planner, syllabus coverage tracker, study timer, revision manager, and grounded mentor.

> [!IMPORTANT]
> **Syllabus Seed Verification Notice**:
> The seed data located in `supabase/seed/` (`prelims_syllabus.json`, `mains_syllabus.json`, and `optionals_seed.json`) provides a structured baseline hierarchy for Prelims (GS I & CSAT), Mains (GS I–IV), and popular Optionals. **You must verify this seed data against the latest official UPSC notification** when released for your target attempt year to account for any micro-topic wording updates or syllabus revisions.

---

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS) on **every** table
- **Auth**: Supabase Auth (Email OTP + OAuth)
- **AI**: OpenAI API (`gpt-4o-mini` for routine check-ins, `gpt-4o` for deep planning) - server-side only
- **Charts & UI**: Recharts, Lucide React
- **Payments**: Razorpay Subscriptions (India-first, UPI / cards)

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```

### 3. Run Migrations in Supabase
Run the SQL files in `supabase/migrations/` inside your Supabase SQL editor:
1. `20261006000001_initial_schema.sql` (Creates all 15 core tables)
2. `20261006000002_rls_policies.sql` (Applies RLS policies, indexes, and triggers)
3. `20261006000003_seed_syllabus.sql` (Populates official syllabus nodes)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Unit Testing
Run the unit test suite covering completion formula rollups, spaced repetition intervals, planner rules, and mentor memory extractor:
```bash
npm test
```

## Production Build & Linting
```bash
npm run lint
npm run build
```
