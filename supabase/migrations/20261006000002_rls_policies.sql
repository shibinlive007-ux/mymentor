-- ============================================================================
-- Migration: 20261006000002_rls_policies.sql
-- Description: Row Level Security (RLS) policies, indexes, and automated triggers
-- ============================================================================

-- 1. Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- 2. Syllabus nodes: global read-only for authenticated and anon users (read catalog)
CREATE POLICY "Syllabus nodes are readable by everyone"
    ON public.syllabus_nodes FOR SELECT
    USING (true);

-- 3. Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 4. User-isolated tables (all CRUD operations constrained to auth.uid() = user_id)
DO $$
DECLARE
    tbl text;
    user_isolated_tables text[] := ARRAY[
        'onboarding_answers',
        'mentor_memory',
        'user_syllabus_progress',
        'daily_checkins',
        'daily_plans',
        'plan_tasks',
        'study_sessions',
        'revision_schedule',
        'weekly_reviews',
        'ai_proposals',
        'chat_messages'
    ];
BEGIN
    FOREACH tbl IN ARRAY user_isolated_tables LOOP
        EXECUTE format('
            CREATE POLICY "Users manage own %1$s"
            ON public.%1$s FOR ALL
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        ', tbl);
    END LOOP;
END $$;

-- 5. Subscriptions policies: users can read; server webhook / service_role updates
CREATE POLICY "Users can read own subscription"
    ON public.subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 6. AI Usage Logs: users can read their own logs
CREATE POLICY "Users can read own AI usage logs"
    ON public.ai_usage_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. Automated profile creation on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, target_year)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        2027
    );

    -- Provision default 7-day trial subscription
    INSERT INTO public.subscriptions (user_id, plan_tier, status, trial_ends_at)
    VALUES (
        new.id,
        'trial',
        'trialing',
        NOW() + INTERVAL '7 days'
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Indexes for lightning-fast queries at 1,000+ user scale
CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_parent ON public.syllabus_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_stage ON public.syllabus_nodes(stage);
CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_optional ON public.syllabus_nodes(optional_code);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_syllabus_progress(user_id, syllabus_node_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON public.user_syllabus_progress(user_id, completion_percentage);

CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON public.daily_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_plan_tasks_plan ON public.plan_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_tasks_status ON public.plan_tasks(user_id, status);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_active ON public.study_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started ON public.study_sessions(user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_revision_schedule_user_date ON public.revision_schedule(user_id, scheduled_date, status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_day ON public.ai_usage_logs(user_id, created_at);
