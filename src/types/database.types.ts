export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ExamMode = 'prelims' | 'mains' | 'combined';
export type StageType = 'prelims' | 'mains' | 'csat' | 'optional';
export type NodeType = 'paper' | 'subject' | 'topic' | 'subtopic';
export type TaskType = 'new_study' | 'revision' | 'pyq' | 'current_affairs' | 'answer_writing' | 'break';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'carried_over';
export type ProposalType = 'daily_plan' | 'recovery_plan' | 'weekly_rebalance' | 'revision_adjustment';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'modified';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          target_year: number;
          attempt_number: number;
          exam_mode: ExamMode;
          optional_subject: string | null;
          daily_target_hours_min: number;
          daily_target_hours_max: number;
          prelims_date: string;
          mains_date: string;
          streak_count: number;
          last_active_date: string | null;
          is_onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          target_year?: number;
          attempt_number?: number;
          exam_mode?: ExamMode;
          optional_subject?: string | null;
          daily_target_hours_min?: number;
          daily_target_hours_max?: number;
          prelims_date?: string;
          mains_date?: string;
          streak_count?: number;
          last_active_date?: string | null;
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      onboarding_answers: {
        Row: {
          id: string;
          user_id: string;
          step_key: string;
          answers: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          step_key: string;
          answers: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['onboarding_answers']['Insert']>;
      };
      mentor_memory: {
        Row: {
          id: string;
          user_id: string;
          category: 'strength' | 'weakness' | 'constraint' | 'habit' | 'preference' | 'goal';
          fact_key: string;
          fact_value: string;
          confidence: number;
          source: 'onboarding' | 'checkin' | 'chat' | 'study_session';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: 'strength' | 'weakness' | 'constraint' | 'habit' | 'preference' | 'goal';
          fact_key: string;
          fact_value: string;
          confidence?: number;
          source: 'onboarding' | 'checkin' | 'chat' | 'study_session';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['mentor_memory']['Insert']>;
      };
      syllabus_nodes: {
        Row: {
          id: string;
          parent_id: string | null;
          stage: StageType;
          paper: string;
          subject: string;
          topic: string;
          subtopic: string | null;
          node_type: NodeType;
          weight: number;
          estimated_study_hours: number;
          order_index: number;
          optional_code: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          parent_id?: string | null;
          stage: StageType;
          paper: string;
          subject: string;
          topic: string;
          subtopic?: string | null;
          node_type: NodeType;
          weight?: number;
          estimated_study_hours?: number;
          order_index?: number;
          optional_code?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['syllabus_nodes']['Insert']>;
      };
      user_syllabus_progress: {
        Row: {
          id: string;
          user_id: string;
          syllabus_node_id: string;
          ncert_read: boolean;
          standard_book_read: boolean;
          standard_book_name: string | null;
          coaching_attended: boolean;
          extra_sources: string | null;
          current_affairs_linked: boolean;
          notes_made: boolean;
          pyq_solved_count: number;
          mcq_practice_done: boolean;
          revision_count: number;
          last_revised_at: string | null;
          confidence_score: number;
          completion_percentage: number;
          is_bookmarked: boolean;
          notes_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          syllabus_node_id: string;
          ncert_read?: boolean;
          standard_book_read?: boolean;
          standard_book_name?: string | null;
          coaching_attended?: boolean;
          extra_sources?: string | null;
          current_affairs_linked?: boolean;
          notes_made?: boolean;
          pyq_solved_count?: number;
          mcq_practice_done?: boolean;
          revision_count?: number;
          last_revised_at?: string | null;
          confidence_score?: number;
          completion_percentage?: number;
          is_bookmarked?: boolean;
          notes_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_syllabus_progress']['Insert']>;
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          checkin_date: string;
          energy_mood: number;
          available_hours: number;
          disruption_chips: string[];
          disruption_notes: string | null;
          planned_assignments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          checkin_date: string;
          energy_mood: number;
          available_hours: number;
          disruption_chips?: string[];
          disruption_notes?: string | null;
          planned_assignments?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['daily_checkins']['Insert']>;
      };
      daily_plans: {
        Row: {
          id: string;
          user_id: string;
          plan_date: string;
          status: 'draft' | 'active' | 'completed' | 'superseded';
          is_minimum_viable_day: boolean;
          total_planned_minutes: number;
          total_completed_minutes: number;
          ai_generation_reason: string | null;
          user_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_date: string;
          status?: 'draft' | 'active' | 'completed' | 'superseded';
          is_minimum_viable_day?: boolean;
          total_planned_minutes?: number;
          total_completed_minutes?: number;
          ai_generation_reason?: string | null;
          user_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['daily_plans']['Insert']>;
      };
      plan_tasks: {
        Row: {
          id: string;
          plan_id: string;
          user_id: string;
          syllabus_node_id: string | null;
          subject_name: string;
          title: string;
          task_type: TaskType;
          scheduled_start_time: string | null;
          duration_minutes: number;
          reason: string;
          order_index: number;
          status: TaskStatus;
          completed_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          user_id: string;
          syllabus_node_id?: string | null;
          subject_name: string;
          title: string;
          task_type: TaskType;
          scheduled_start_time?: string | null;
          duration_minutes: number;
          reason: string;
          order_index?: number;
          status?: TaskStatus;
          completed_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['plan_tasks']['Insert']>;
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          syllabus_node_id: string | null;
          subject_name: string;
          mode: 'pomodoro' | 'stopwatch';
          started_at: string;
          ended_at: string | null;
          duration_seconds: number;
          is_active: boolean;
          pause_logs: Json;
          reflection_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          syllabus_node_id?: string | null;
          subject_name: string;
          mode?: 'pomodoro' | 'stopwatch';
          started_at: string;
          ended_at?: string | null;
          duration_seconds?: number;
          is_active?: boolean;
          pause_logs?: Json;
          reflection_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['study_sessions']['Insert']>;
      };
      revision_schedule: {
        Row: {
          id: string;
          user_id: string;
          syllabus_node_id: string;
          stage_number: number;
          scheduled_date: string;
          status: 'pending' | 'completed' | 'rescheduled' | 'skipped';
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          syllabus_node_id: string;
          stage_number: number;
          scheduled_date: string;
          status?: 'pending' | 'completed' | 'rescheduled' | 'skipped';
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['revision_schedule']['Insert']>;
      };
      weekly_reviews: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          week_end_date: string;
          planned_hours: number;
          actual_hours: number;
          syllabus_delta_percentage: number;
          neglected_subjects: string[];
          ai_what_went_well: string | null;
          ai_what_to_fix: string | null;
          ai_next_week_focus: string | null;
          user_reflection: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          week_end_date: string;
          planned_hours?: number;
          actual_hours?: number;
          syllabus_delta_percentage?: number;
          neglected_subjects?: string[];
          ai_what_went_well?: string | null;
          ai_what_to_fix?: string | null;
          ai_next_week_focus?: string | null;
          user_reflection?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['weekly_reviews']['Insert']>;
      };
      ai_proposals: {
        Row: {
          id: string;
          user_id: string;
          proposal_type: ProposalType;
          title: string;
          description: string;
          proposed_changes: Json;
          reason: string;
          status: ProposalStatus;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          proposal_type: ProposalType;
          title: string;
          description: string;
          proposed_changes: Json;
          reason: string;
          status?: ProposalStatus;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ai_proposals']['Insert']>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          tool_calls: Json | null;
          tool_results: Json | null;
          proposal_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          tool_calls?: Json | null;
          tool_results?: Json | null;
          proposal_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_tier: 'trial' | 'monthly' | 'annual';
          status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
          provider: string;
          razorpay_customer_id: string | null;
          razorpay_subscription_id: string | null;
          trial_ends_at: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_tier?: 'trial' | 'monthly' | 'annual';
          status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
          provider?: string;
          razorpay_customer_id?: string | null;
          razorpay_subscription_id?: string | null;
          trial_ends_at?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      ai_usage_logs: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          model: string;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          model: string;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ai_usage_logs']['Insert']>;
      };
    };
  };
}
