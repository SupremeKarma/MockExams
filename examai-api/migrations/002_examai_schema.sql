-- Move the spine into its own schema, and give it UUID identity.
--
-- Two changes, both structural, both cheap to make now and expensive later.
--
-- 1. SCHEMA `examai`.
--    These tables share a database with Supreme AI, whose Drizzle config
--    manages the schema it knows about. An unscoped `pnpm db:push` there sees
--    tables it has no definition for as drift and offers to DROP them — and
--    `push` applies without writing a reviewable migration file. Living in a
--    separate schema, plus `schemaFilter: ['public']` stated explicitly in that
--    repo's drizzle.config.ts, makes that impossible rather than unlikely.
--
-- 2. UUID as the only foreign key.
--    Paths are human-readable and therefore change: a unit gets renumbered, a
--    course code is revised. Anything that referenced `bit.s4.bit253co.u6`
--    would then point at the wrong topic — silently, because the new row is
--    perfectly valid. The uuid never changes, so links survive renumbering.
--    `path` stays UNIQUE and keeps doing tree queries, which is the one job
--    text paths are better at.
--
-- The uuid is preserved across re-imports because the upsert keys on `path`.
-- That property is what makes links durable, and there is a test for it.

CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()

CREATE SCHEMA IF NOT EXISTS examai;

-- The Phase 0 table was created in `public` before the schema decision. It is
-- re-derivable from the official PDFs in seconds (scripts/import_syllabus.py)
-- and nothing references it yet, so it is dropped rather than migrated in
-- place. Doing this after content links to it would be data loss; doing it now
-- is housekeeping.
DROP TABLE IF EXISTS public.syllabus_nodes CASCADE;
DROP FUNCTION IF EXISTS public.syllabus_nodes_touch() CASCADE;
DROP FUNCTION IF EXISTS public.syllabus_nodes_require_parent() CASCADE;

CREATE TABLE IF NOT EXISTS examai.syllabus_nodes (
    -- The only thing anything else may point at.
    uuid         UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Natural key and tree index. Unique, human-readable, used in CLI output
    -- and admin URLs — but never as a foreign key.
    path         LTREE NOT NULL UNIQUE,

    kind         TEXT  NOT NULL CHECK (kind IN ('program','semester','course','unit','topic','subtopic')),
    code         TEXT,
    title        TEXT  NOT NULL,
    order_index  INT   NOT NULL DEFAULT 0,
    hours        NUMERIC(5,1),
    marks_weight NUMERIC(6,2),
    official_ref TEXT,

    -- Which published syllabus revision this node belongs to, e.g.
    -- 'new_course_2019'. Set on program and course nodes; inherited by
    -- everything beneath them.
    --
    -- Backlog students sit an older syllabus. When two revisions of one course
    -- must coexist they get DISTINCT PATHS (the old curriculum uses different
    -- codes — BIT371CO where the new one is BIT353CO), so `path` stays unique
    -- and a subtree query never mixes revisions. This column says which
    -- revision a subtree is, so a student on the old course can be shown it.
    syllabus_version TEXT,

    -- draft: imported but not yet confirmed against the source document.
    -- Nothing student-facing reads a draft node — see the published_syllabus
    -- view. OCR'd imports land here (the scanned semester PDFs cannot be
    -- trusted the way an extractable text layer can) and a human promotes them
    -- to active after checking against the scan.
    status       TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('draft','active','retired')),

    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS syllabus_nodes_path_gist ON examai.syllabus_nodes USING GIST (path);
CREATE INDEX IF NOT EXISTS syllabus_nodes_kind_idx  ON examai.syllabus_nodes (kind);
CREATE INDEX IF NOT EXISTS syllabus_nodes_code_idx  ON examai.syllabus_nodes (code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS syllabus_nodes_status_idx ON examai.syllabus_nodes (status);

COMMENT ON TABLE examai.syllabus_nodes IS
    'The spine: program -> semester -> course -> unit -> topic. `uuid` is the only foreign key; `path` is for tree queries.';

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION examai.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS syllabus_nodes_touch_trg ON examai.syllabus_nodes;
CREATE TRIGGER syllabus_nodes_touch_trg
    BEFORE UPDATE ON examai.syllabus_nodes
    FOR EACH ROW EXECUTE FUNCTION examai.touch_updated_at();

-- ---------------------------------------------------------------------------
-- A node's parent must exist
-- ---------------------------------------------------------------------------
--
-- ltree stores the whole path as one value, so nothing in the type system stops
-- an orphan: `...u99.t1` with no `...u99` row inserts happily, and the topic is
-- then present in the table but unreachable in every rendered tree.

CREATE OR REPLACE FUNCTION examai.syllabus_nodes_require_parent() RETURNS TRIGGER AS $$
DECLARE
    parent_path LTREE;
BEGIN
    IF nlevel(NEW.path) = 1 THEN
        RETURN NEW;
    END IF;

    parent_path := subpath(NEW.path, 0, nlevel(NEW.path) - 1);

    IF NOT EXISTS (SELECT 1 FROM examai.syllabus_nodes WHERE path = parent_path) THEN
        RAISE EXCEPTION
            'syllabus_nodes: % has no parent at %. Insert ancestors first, or the node is unreachable in the tree.',
            NEW.path, parent_path;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS syllabus_nodes_require_parent_trg ON examai.syllabus_nodes;
CREATE TRIGGER syllabus_nodes_require_parent_trg
    BEFORE INSERT OR UPDATE OF path ON examai.syllabus_nodes
    FOR EACH ROW EXECUTE FUNCTION examai.syllabus_nodes_require_parent();

-- ---------------------------------------------------------------------------
-- question_topics
-- ---------------------------------------------------------------------------
--
-- Deliberately accepts ANY node kind. The instinct is to constrain this to
-- topics, and it would be wrong: Database Management System's syllabus lists
-- its contents as prose, so that course has 9 units and 0 topic nodes. A
-- topic-only constraint would make every DBMS question untaggable.
--
-- The rule is "link to the deepest OFFICIAL node" — the topic where the
-- syllabus defines topics, the unit where it does not. A unit is a perfectly
-- good link target; a topic invented to satisfy a constraint is not.
--
-- `question_ref` is TEXT because questions currently live in Firestore
-- (Phase 2a). It becomes a UUID foreign key when questions move to Postgres;
-- the node side is already UUID, which is the half that matters for the spine.

CREATE TABLE IF NOT EXISTS examai.question_topics (
    question_ref TEXT NOT NULL,
    node_uuid    UUID NOT NULL REFERENCES examai.syllabus_nodes(uuid) ON DELETE CASCADE,
    role         TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary','secondary')),
    weight       NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
    tagged_by    TEXT NOT NULL DEFAULT 'model' CHECK (tagged_by IN ('model','human')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (question_ref, node_uuid)
);

CREATE INDEX IF NOT EXISTS question_topics_node_idx ON examai.question_topics (node_uuid);

COMMENT ON TABLE examai.question_topics IS
    'Question -> syllabus node. Accepts any node kind: link to the deepest official node (unit where a course lists topics as prose).';
