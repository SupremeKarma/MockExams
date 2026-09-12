-- Authorization enforced by the database.
--
-- Phase 2a got this from Firestore rules: a declarative, testable statement of
-- "students see published only", sitting underneath every code path. Moving to
-- Postgres loses that for free, and the obvious replacement — checking status
-- in application code — fails open. One forgotten WHERE clause in one query
-- serves an unreviewed draft, and nothing anywhere reports an error.
--
-- So the Reader connects as a role that CANNOT express the mistake:
--
--   examai_writer   owns nothing, full DML on base tables. Publishing, imports.
--   examai_reader   SELECT on three views. No base table access at all.
--
-- A bug in the Reader's SQL cannot leak a draft, because the draft is not
-- reachable from that connection. Row-level security on the base tables is the
-- second layer, for the case where someone later grants the reader a table by
-- mistake.

-- ---------------------------------------------------------------------------
-- Views — the only student-facing surface
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW examai.published_syllabus AS
SELECT uuid, path, kind, code, title, order_index, hours, marks_weight,
       syllabus_version, nlevel(path) AS depth
FROM examai.syllabus_nodes
WHERE status = 'active';

COMMENT ON VIEW examai.published_syllabus IS
    'Spine nodes a student may see. Excludes draft (unconfirmed OCR imports) and retired revisions.';

CREATE OR REPLACE VIEW examai.published_documents AS
SELECT d.uuid,
       d.short_id,
       d.type,
       d.node_uuid,
       d.title,
       v.uuid          AS version_uuid,
       v.version,
       v.frontmatter,
       v.trust_level,
       v.published_at
FROM examai.documents d
JOIN examai.document_versions v ON v.uuid = d.current_version_uuid
JOIN examai.syllabus_nodes n    ON n.uuid = d.node_uuid
-- Both must hold. A published note on a draft syllabus node would put a page
-- in front of students for a unit nobody has confirmed against the scan.
WHERE v.status = 'published'
  AND n.status = 'active';

CREATE OR REPLACE VIEW examai.published_sections AS
SELECT s.uuid,
       s.document_version_uuid,
       d.uuid AS document_uuid,
       d.short_id,
       s.anchor,
       s.level,
       s.parent_section_uuid,
       s.heading,
       s.heading_path,
       s.body_md,
       s.order_index
FROM examai.sections s
JOIN examai.documents d         ON d.current_version_uuid = s.document_version_uuid
JOIN examai.document_versions v ON v.uuid = s.document_version_uuid
JOIN examai.syllabus_nodes n    ON n.uuid = d.node_uuid
WHERE v.status = 'published'
  AND n.status = 'active';

-- Aliases are needed to resolve an old deep link, and they leak nothing beyond
-- the fact that a heading was renamed.
CREATE OR REPLACE VIEW examai.published_anchor_aliases AS
SELECT a.document_uuid, d.short_id, a.old_anchor, a.new_anchor
FROM examai.anchor_aliases a
JOIN examai.documents d ON d.uuid = a.document_uuid
WHERE d.current_version_uuid IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
--
-- NOLOGIN group roles; deployments grant them to a login user. Passwords are
-- never set here — a password in a migration file is a password in git.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'examai_writer') THEN
        CREATE ROLE examai_writer NOLOGIN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'examai_reader') THEN
        CREATE ROLE examai_reader NOLOGIN;
    END IF;
END
$$;

-- Start from nothing. PUBLIC holds CREATE+USAGE on a new schema by default,
-- which would let any role in the database make tables here.
REVOKE ALL ON SCHEMA examai FROM PUBLIC;

GRANT USAGE ON SCHEMA examai TO examai_writer, examai_reader;
GRANT CREATE ON SCHEMA examai TO examai_writer;

-- Writer: everything on the base tables.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA examai TO examai_writer;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA examai TO examai_writer;
ALTER DEFAULT PRIVILEGES IN SCHEMA examai
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO examai_writer;

-- Reader: revoke everything, then grant back exactly four views.
--
-- The revoke matters. `GRANT ... ON ALL TABLES` above includes views, and
-- ALTER DEFAULT PRIVILEGES will keep granting on anything created later — so
-- without this, a table added in a future migration would quietly become
-- readable by the reader role.
REVOKE ALL ON ALL TABLES IN SCHEMA examai FROM examai_reader;

GRANT SELECT ON examai.published_syllabus       TO examai_reader;
GRANT SELECT ON examai.published_documents      TO examai_reader;
GRANT SELECT ON examai.published_sections       TO examai_reader;
GRANT SELECT ON examai.published_anchor_aliases TO examai_reader;

-- No default privileges for the reader: a new table must be granted
-- deliberately, never inherited.
ALTER DEFAULT PRIVILEGES IN SCHEMA examai REVOKE ALL ON TABLES FROM examai_reader;

-- ---------------------------------------------------------------------------
-- Row-level security — the second layer
-- ---------------------------------------------------------------------------
--
-- The grants above are the real control. RLS is here for the day someone runs
-- `GRANT SELECT ON ALL TABLES ... TO examai_reader` to debug something and
-- forgets to undo it.
--
-- FORCE is the important word: without it RLS does not apply to the table's
-- OWNER, and the owner is exactly who runs the publish pipeline. A policy that
-- silently skips the one role doing the writing gives false confidence.
--
-- The views are SECURITY INVOKER (the default), so they run with the reader's
-- rights and these policies apply through them.

ALTER TABLE examai.syllabus_nodes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE examai.syllabus_nodes    FORCE  ROW LEVEL SECURITY;
ALTER TABLE examai.documents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE examai.documents         FORCE  ROW LEVEL SECURITY;
ALTER TABLE examai.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examai.document_versions FORCE  ROW LEVEL SECURITY;
ALTER TABLE examai.sections          ENABLE ROW LEVEL SECURITY;
ALTER TABLE examai.sections          FORCE  ROW LEVEL SECURITY;
ALTER TABLE examai.anchor_aliases    ENABLE ROW LEVEL SECURITY;
ALTER TABLE examai.anchor_aliases    FORCE  ROW LEVEL SECURITY;

-- Writer sees and changes everything.
DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['syllabus_nodes','documents','document_versions','sections','anchor_aliases']
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS writer_all ON examai.%I', t);
        EXECUTE format(
            'CREATE POLICY writer_all ON examai.%I FOR ALL TO examai_writer USING (true) WITH CHECK (true)', t);
    END LOOP;
END
$$;

-- Reader: published rows only, even if it somehow reaches a base table.
DROP POLICY IF EXISTS reader_active ON examai.syllabus_nodes;
CREATE POLICY reader_active ON examai.syllabus_nodes
    FOR SELECT TO examai_reader USING (status = 'active');

DROP POLICY IF EXISTS reader_published ON examai.document_versions;
CREATE POLICY reader_published ON examai.document_versions
    FOR SELECT TO examai_reader USING (status = 'published');

DROP POLICY IF EXISTS reader_published ON examai.documents;
CREATE POLICY reader_published ON examai.documents
    FOR SELECT TO examai_reader USING (current_version_uuid IS NOT NULL);

DROP POLICY IF EXISTS reader_published ON examai.sections;
CREATE POLICY reader_published ON examai.sections
    FOR SELECT TO examai_reader USING (
        EXISTS (
            SELECT 1 FROM examai.document_versions v
            WHERE v.uuid = sections.document_version_uuid AND v.status = 'published'
        )
    );

DROP POLICY IF EXISTS reader_all ON examai.anchor_aliases;
CREATE POLICY reader_all ON examai.anchor_aliases
    FOR SELECT TO examai_reader USING (true);
