-- ============================================================================
-- Migration: 20261006000001_initial_schema.sql
-- Description: Core tables for UPSC 2027 AI Mentor
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    target_year INTEGER NOT NULL DEFAULT 2027,
    attempt_number INTEGER DEFAULT 1,
    exam_mode TEXT NOT NULL DEFAULT 'combined' CHECK (exam_mode IN ('prelims', 'mains', 'combined')),
    optional_subject TEXT,
    daily_target_hours_min NUMERIC(3,1) DEFAULT 6.0,
    daily_target_hours_max NUMERIC(3,1) DEFAULT 8.0,
    prelims_date DATE DEFAULT '2027-05-23',
    mains_date DATE DEFAULT '2027-09-17',
    streak_count INTEGER DEFAULT 0,
    last_active_date DATE,
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ONBOARDING ANSWERS
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    step_key TEXT NOT NULL,
    answers JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, step_key)
);

-- 3. MENTOR MEMORY
CREATE TABLE IF NOT EXISTS public.mentor_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('strength', 'weakness', 'constraint', 'habit', 'preference', 'goal')),
    fact_key TEXT NOT NULL,
    fact_value TEXT NOT NULL,
    confidence NUMERIC(3,2) DEFAULT 1.0,
    source TEXT NOT NULL CHECK (source IN ('onboarding', 'checkin', 'chat', 'study_session')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SYLLABUS NODES
CREATE TABLE IF NOT EXISTS public.syllabus_nodes (
    id TEXT PRIMARY KEY, -- e.g. 'mains.gs1.history.modern_india.1857_revolt'
    parent_id TEXT REFERENCES public.syllabus_nodes(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('prelims', 'mains', 'csat', 'optional')),
    paper TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    subtopic TEXT,
    node_type TEXT NOT NULL CHECK (node_type IN ('paper', 'subject', 'topic', 'subtopic')),
    weight NUMERIC(3,2) DEFAULT 1.0,
    estimated_study_hours NUMERIC(4,1) DEFAULT 4.0,
    order_index INTEGER DEFAULT 0,
    optional_code TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER SYLLABUS PROGRESS
CREATE TABLE IF NOT EXISTS public.user_syllabus_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    syllabus_node_id TEXT NOT NULL REFERENCES public.syllabus_nodes(id) ON DELETE CASCADE,
    ncert_read BOOLEAN DEFAULT FALSE,
    standard_book_read BOOLEAN DEFAULT FALSE,
    standard_book_name TEXT,
    coaching_attended BOOLEAN DEFAULT FALSE,
    extra_sources TEXT,
    current_affairs_linked BOOLEAN DEFAULT FALSE,
    notes_made BOOLEAN DEFAULT FALSE,
    pyq_solved_count INTEGER DEFAULT 0,
    mcq_practice_done BOOLEAN DEFAULT FALSE,
    revision_count INTEGER DEFAULT 0,
    last_revised_at TIMESTAMPTZ,
    confidence_score INTEGER DEFAULT 1 CHECK (confidence_score BETWEEN 1 AND 5),
    completion_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (completion_percentage BETWEEN 0 AND 100),
    is_bookmarked BOOLEAN DEFAULT FALSE,
    notes_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, syllabus_node_id)
);

-- 6. DAILY CHECKINS
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    energy_mood INTEGER NOT NULL CHECK (energy_mood BETWEEN 1 AND 5),
    available_hours NUMERIC(3,1) NOT NULL,
    disruption_chips TEXT[] DEFAULT '{}',
    disruption_notes TEXT,
    planned_assignments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, checkin_date)
);

-- 7. DAILY PLANS
CREATE TABLE IF NOT EXISTS public.daily_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'superseded')),
    is_minimum_viable_day BOOLEAN DEFAULT FALSE,
    total_planned_minutes INTEGER DEFAULT 0,
    total_completed_minutes INTEGER DEFAULT 0,
    ai_generation_reason TEXT,
    user_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PLAN TASKS
CREATE TABLE IF NOT EXISTS public.plan_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.daily_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    syllabus_node_id TEXT REFERENCES public.syllabus_nodes(id) ON DELETE SET NULL,
    subject_name TEXT NOT NULL,
    title TEXT NOT NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('new_study', 'revision', 'pyq', 'current_affairs', 'answer_writing', 'break')),
    scheduled_start_time TIME,
    duration_minutes INTEGER NOT NULL,
    reason TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'carried_over')),
    completed_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STUDY SESSIONS
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.plan_tasks(id) ON DELETE SET NULL,
    syllabus_node_id TEXT REFERENCES public.syllabus_nodes(id) ON DELETE SET NULL,
    subject_name TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'pomodoro' CHECK (mode IN ('pomodoro', 'stopwatch')),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    pause_logs JSONB DEFAULT '[]'::jsonb,
    reflection_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVISION SCHEDULE
CREATE TABLE IF NOT EXISTS public.revision_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    syllabus_node_id TEXT NOT NULL REFERENCES public.syllabus_nodes(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 4),
    scheduled_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rescheduled', 'skipped')),
    completed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WEEKLY REVIEWS
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    planned_hours NUMERIC(4,1) DEFAULT 0,
    actual_hours NUMERIC(4,1) DEFAULT 0,
    syllabus_delta_percentage NUMERIC(5,2) DEFAULT 0,
    neglected_subjects TEXT[] DEFAULT '{}',
    ai_what_went_well TEXT,
    ai_what_to_fix TEXT,
    ai_next_week_focus TEXT,
    user_reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI PROPOSALS
CREATE TABLE IF NOT EXISTS public.ai_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposal_type TEXT NOT NULL CHECK (proposal_type IN ('daily_plan', 'recovery_plan', 'weekly_rebalance', 'revision_adjustment')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposed_changes JSONB NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'modified')),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    tool_results JSONB,
    proposal_id UUID REFERENCES public.ai_proposals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL DEFAULT 'trial' CHECK (plan_tier IN ('trial', 'monthly', 'annual')),
    status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')),
    provider TEXT DEFAULT 'razorpay',
    razorpay_customer_id TEXT,
    razorpay_subscription_id TEXT,
    trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 15. AI USAGE LOGS
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
