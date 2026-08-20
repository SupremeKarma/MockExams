-- MockExams: AI-Powered Learning Ecosystem Database Schema
-- Week 1-4 Foundation: Hierarchical taxonomy + FSRS spaced repetition
-- Created: August 20, 2026

-- ================================================================
-- TIER 1: HIERARCHICAL ACADEMIC NODES (7-tier taxonomy)
-- ================================================================

CREATE TYPE node_type AS ENUM (
  'country',
  'system_or_board',
  'institution',
  'program',
  'academic_period',
  'subject',
  'topic'
);

CREATE TABLE academic_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES academic_nodes(id) ON DELETE CASCADE,

  -- Hierarchical path: e.g., "np.pu.cite.bit.sem5.dbms.btree"
  path TEXT NOT NULL UNIQUE,

  -- Polymorphic type
  node_type node_type NOT NULL,

  -- Identifiers
  code VARCHAR(50),
  title TEXT NOT NULL,
  short_title VARCHAR(100),

  -- Flexible metadata
  metadata JSONB DEFAULT '{}',

  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes for performance
  UNIQUE(parent_id, code),
  INDEX idx_path (path),
  INDEX idx_parent (parent_id),
  INDEX idx_type (node_type)
);

-- ================================================================
-- TIER 2: SPACED REPETITION (FSRS Algorithm)
-- ================================================================

CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  node_id UUID NOT NULL REFERENCES academic_nodes(id) ON DELETE CASCADE,

  -- Card content
  front_prompt TEXT NOT NULL,
  back_solution TEXT NOT NULL,
  code_snippet TEXT,
  key_points JSONB DEFAULT '[]',

  -- FSRS algorithm parameters
  ease_factor DECIMAL(4,2) DEFAULT 2.5,  -- Range: 1.3-2.5
  interval_days INT DEFAULT 1,            -- Days until next review
  repetitions INT DEFAULT 0,              -- Total reviews completed

  -- Next review scheduling
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed TIMESTAMP WITH TIME ZONE,

  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_student_node (student_id, node_id),
  INDEX idx_next_review (student_id, next_review)
);

-- ================================================================
-- TIER 3: LEARNING PROGRESS TRACKING
-- ================================================================

CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES academic_nodes(id) ON DELETE CASCADE,
  curriculum_id UUID REFERENCES academic_nodes(id),

  -- Mastery tracking
  mastery_percentage DECIMAL(5,2) DEFAULT 0,  -- 0-100

  -- Performance metrics
  correct_count INT DEFAULT 0,
  incorrect_count INT DEFAULT 0,
  total_attempts INT DEFAULT 0,

  -- Scheduling
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review_scheduled TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(student_id, topic_id),
  INDEX idx_student_mastery (student_id, mastery_percentage),
  INDEX idx_curriculum (curriculum_id)
);

-- ================================================================
-- TIER 4: EXAM SUBMISSIONS & ATTEMPTS
-- ================================================================

CREATE TABLE student_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  exam_id UUID NOT NULL,
  node_id UUID REFERENCES academic_nodes(id),  -- Which curriculum?

  -- Scoring
  score DECIMAL(6,2),
  total_marks DECIMAL(6,2),
  percentage DECIMAL(5,2),

  -- Timing
  time_spent_seconds INT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Status
  status VARCHAR(50) DEFAULT 'submitted',  -- submitted, graded, reviewed

  -- Analytics
  correct_answers INT DEFAULT 0,
  incorrect_answers INT DEFAULT 0,
  unanswered INT DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_student_exam (student_id, exam_id),
  INDEX idx_node (node_id),
  INDEX idx_completed (completed_at)
);

-- ================================================================
-- TIER 5: REAL-TIME ENGAGEMENT TRACKING
-- ================================================================

CREATE TABLE engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,  -- exam_started, flashcard_reviewed, notes_read, etc

  -- Gamification
  current_streak INT DEFAULT 0,
  total_points INT DEFAULT 0,
  badges JSONB DEFAULT '[]',

  -- Activity
  activity_data JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_student_engagement (student_id, created_at),
  INDEX idx_event_type (event_type)
);

-- ================================================================
-- TIER 6: MULTI-TENANT RBAC
-- ================================================================

CREATE TYPE role_name AS ENUM (
  'super_admin',
  'university_admin',
  'college_admin',
  'examiner',
  'faculty',
  'student'
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name role_name NOT NULL UNIQUE,
  permissions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_node_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  node_id UUID NOT NULL REFERENCES academic_nodes(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id),

  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, node_id, role_id),
  INDEX idx_user_roles (user_id, role_id),
  INDEX idx_node_roles (node_id, role_id)
);

-- ================================================================
-- TIER 7: COMPLIANCE AUDIT LOGGING (GDPR, FERPA, DPDP)
-- ================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  user_id UUID,

  -- Action tracking
  action VARCHAR(255) NOT NULL,  -- view, export, delete, modify, grade, etc
  resource_type VARCHAR(50),     -- student_data, exam, result, note, etc
  resource_id UUID,

  -- Context
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_user_action (user_id, action),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_timestamp (created_at)
);

-- ================================================================
-- SUPPORTING TABLES
-- ================================================================

-- Questions linked to topics
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES academic_nodes(id) ON DELETE CASCADE,
  exam_id UUID,

  question_text TEXT NOT NULL,
  question_type VARCHAR(50),  -- mcq_single, mcq_multiple, essay, code, numerical

  options JSONB,
  correct_option_ids JSONB,
  explanation TEXT,

  difficulty VARCHAR(20) DEFAULT 'medium',  -- easy, medium, hard, olympiad
  historical_frequency INT DEFAULT 1,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_node_questions (node_id),
  INDEX idx_difficulty (difficulty)
);

-- Student notes linked to topics
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  node_id UUID REFERENCES academic_nodes(id) ON DELETE CASCADE,

  title VARCHAR(255),
  content TEXT,
  content_type VARCHAR(50),  -- markdown, html, pdf_url

  is_public BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_student_notes (student_id),
  INDEX idx_node_notes (node_id)
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- Critical hierarchical queries
CREATE INDEX idx_academic_path_hierarchy ON academic_nodes (path);
CREATE INDEX idx_academic_parent_hierarchy ON academic_nodes (parent_id);

-- Spaced repetition scheduling
CREATE INDEX idx_flashcards_next_review ON flashcards (student_id, next_review);
CREATE INDEX idx_flashcards_topic ON flashcards (node_id);

-- Learning progress queries
CREATE INDEX idx_progress_mastery ON learning_progress (student_id, mastery_percentage DESC);
CREATE INDEX idx_progress_topic ON learning_progress (topic_id);

-- Exam attempt analytics
CREATE INDEX idx_attempts_student_time ON student_attempts (student_id, completed_at DESC);
CREATE INDEX idx_attempts_exam ON student_attempts (exam_id);

-- Audit trail
CREATE INDEX idx_audit_timestamp ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_user ON audit_logs (user_id, created_at DESC);

-- ================================================================
-- INITIAL DATA: Default Roles
-- ================================================================

INSERT INTO roles (name, permissions) VALUES
  ('super_admin', '{"can_create_exams": true, "can_view_all_nodes": true, "can_manage_users": true, "can_access_analytics": true}'::jsonb),
  ('university_admin', '{"can_create_exams": true, "can_view_university": true, "can_manage_college_admins": true}'::jsonb),
  ('college_admin', '{"can_view_college": true, "can_view_student_progress": true}'::jsonb),
  ('examiner', '{"can_create_questions": true, "can_grade_essays": true, "can_view_class": true}'::jsonb),
  ('faculty', '{"can_view_class": true, "can_post_notes": true}'::jsonb),
  ('student', '{"can_take_exams": true, "can_view_progress": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ================================================================
-- MIGRATION NOTES
-- ================================================================

/*
This schema enables:

1. Zero-Breaking-Change Expansion
   - Add new countries, universities, colleges by inserting into academic_nodes
   - Path-based queries work for any hierarchy depth
   - No schema changes needed to support new institution types

2. Spaced Repetition (FSRS)
   - Automatic scheduling via next_review field
   - Ease factor tracking for algorithm convergence
   - Daily queue built on (student_id, next_review) index

3. Multi-Tenant Access Control
   - user_node_roles table enables per-hierarchy access
   - Student in Sem 5 can't see Sem 7 content
   - College admin sees only their institution

4. Compliance & Audit
   - Every data access logged with timestamp, user, action
   - Supports GDPR data export, FERPA access, DPDP tracking

Migration Step:
- Run this schema on Supabase PostgreSQL
- Ensure BIT hierarchy data load next
- Verify path indexes < 100ms for queries
*/
