-- ============================================================================
-- Migration: 20261006000003_seed_syllabus.sql
-- Description: Core UPSC 2027 Syllabus Seed Data (Prelims & Mains)
-- ============================================================================

-- Prelims Subjects
INSERT INTO public.syllabus_nodes (id, parent_id, stage, paper, subject, topic, node_type, weight, estimated_study_hours, order_index)
VALUES
    ('prelims.gs1.history', NULL, 'prelims', 'GS Paper I', 'History of India & Indian National Movement', 'Overview', 'subject', 1.0, 90, 1),
    ('prelims.gs1.polity', NULL, 'prelims', 'GS Paper I', 'Indian Polity & Governance', 'Overview', 'subject', 1.2, 85, 2),
    ('prelims.gs1.geography', NULL, 'prelims', 'GS Paper I', 'Indian & World Geography', 'Overview', 'subject', 1.0, 75, 3),
    ('prelims.gs1.economy', NULL, 'prelims', 'GS Paper I', 'Economic & Social Development', 'Overview', 'subject', 1.1, 70, 4),
    ('prelims.gs1.environment', NULL, 'prelims', 'GS Paper I', 'Environment, Ecology & Climate Change', 'Overview', 'subject', 1.2, 65, 5),
    ('prelims.csat.reasoning', NULL, 'csat', 'CSAT (Paper II)', 'CSAT: Aptitude & Comprehension', 'Overview', 'subject', 0.9, 45, 6)
ON CONFLICT (id) DO NOTHING;

-- Mains Subjects
INSERT INTO public.syllabus_nodes (id, parent_id, stage, paper, subject, topic, node_type, weight, estimated_study_hours, order_index)
VALUES
    ('mains.gs1', NULL, 'mains', 'Mains GS I', 'Indian Heritage, Society & World Geography', 'Overview', 'subject', 1.0, 110, 10),
    ('mains.gs2', NULL, 'mains', 'Mains GS II', 'Governance, Constitution, Polity & IR', 'Overview', 'subject', 1.2, 125, 11),
    ('mains.gs3', NULL, 'mains', 'Mains GS III', 'Economy, S&T, Biodiversity & Internal Security', 'Overview', 'subject', 1.1, 120, 12),
    ('mains.gs4', NULL, 'mains', 'Mains GS IV', 'Ethics, Integrity & Aptitude', 'Overview', 'subject', 1.3, 95, 13)
ON CONFLICT (id) DO NOTHING;

-- Optional Subjects (Top Optionals)
INSERT INTO public.syllabus_nodes (id, parent_id, stage, paper, subject, topic, node_type, weight, estimated_study_hours, order_index, optional_code)
VALUES
    ('optional.psir', NULL, 'optional', 'Optional Paper 1 & 2', 'Political Science & IR (PSIR)', 'Overview', 'subject', 1.2, 150, 20, 'PSIR'),
    ('optional.geography', NULL, 'optional', 'Optional Paper 1 & 2', 'Geography Optional', 'Overview', 'subject', 1.2, 150, 21, 'GEOGRAPHY'),
    ('optional.sociology', NULL, 'optional', 'Optional Paper 1 & 2', 'Sociology Optional', 'Overview', 'subject', 1.2, 140, 22, 'SOCIOLOGY')
ON CONFLICT (id) DO NOTHING;
