-- Phase 1 — documents, immutable versions, derived sections.
--
-- The shape follows the blueprint's rule 2 ("write components, not documents")
-- and rule 3 ("one structure, three uses"): a document is an ordered set of
-- sections derived from its markdown headings, and that same heading tree
-- drives the Reader outline, deep links, and later the RAG chunks. Derived
-- once at publish, never hand-maintained.

CREATE SCHEMA IF NOT EXISTS examai;

-- ---------------------------------------------------------------------------
-- documents — stable identity, independent of content
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS examai.documents (
    uuid         UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Short, URL-safe, stable. The URL is /learn/{course}/{slug}-{short_id};
    -- the slug is cosmetic and a wrong one redirects, so this is what actually
    -- resolves a page. Keeping it separate from the uuid keeps URLs short
    -- without making them guessable-by-increment.
    short_id     TEXT NOT NULL UNIQUE CHECK (short_id ~ '^[a-z0-9]{6,12}$'),

    type         TEXT NOT NULL DEFAULT 'topic_note'
                      CHECK (type IN ('topic_note','guide','paper_solution','cheat_sheet')),

    -- The syllabus node this document explains. UUID, never path: a renumbered
    -- unit must not silently re-point the note that explains it.
    node_uuid    UUID REFERENCES examai.syllabus_nodes(uuid) ON DELETE RESTRICT,

    title        TEXT NOT NULL,

    -- The version students see. NULL until something is published, which is
    -- what makes "draft edits never change the live page" structural rather
    -- than a convention: the Reader reads through this pointer only.
    current_version_uuid UUID,

    created_by   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_node_idx ON examai.documents (node_uuid);
CREATE INDEX IF NOT EXISTS documents_type_idx ON examai.documents (type);

DROP TRIGGER IF EXISTS documents_touch_trg ON examai.documents;
CREATE TRIGGER documents_touch_trg
    BEFORE UPDATE ON examai.documents
    FOR EACH ROW EXECUTE FUNCTION examai.touch_updated_at();

-- ---------------------------------------------------------------------------
-- document_versions — immutable
-- ---------------------------------------------------------------------------
--
-- Nothing updates a published version's body. An edit creates a new row and the
-- document's pointer moves. That is what lets a reviewer see exactly what a
-- student was shown last week, and it is why the publish step can be one
-- atomic pointer switch instead of a multi-row rewrite a reader could observe
-- halfway through.

CREATE TABLE IF NOT EXISTS examai.document_versions (
    uuid          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_uuid UUID NOT NULL REFERENCES examai.documents(uuid) ON DELETE CASCADE,
    version       INT  NOT NULL,

    body_md       TEXT NOT NULL,
    frontmatter   JSONB NOT NULL DEFAULT '{}'::jsonb,

    status        TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft','in_review','published','archived')),

    -- The blueprint's trust ladder. A student always sees which rung a page is
    -- on; nothing unverified is presented as verified.
    trust_level   TEXT NOT NULL DEFAULT 'ai_draft'
                       CHECK (trust_level IN ('ai_draft','code_verified','teacher_verified')),

    author_id     TEXT,
    reviewer_id   TEXT,
    prompt_version TEXT,
    model_used    TEXT,

    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at  TIMESTAMPTZ,

    UNIQUE (document_uuid, version)
);

CREATE INDEX IF NOT EXISTS document_versions_doc_idx    ON examai.document_versions (document_uuid);
CREATE INDEX IF NOT EXISTS document_versions_status_idx ON examai.document_versions (status);

-- Deferred so publish can insert the version and point at it in one transaction.
ALTER TABLE examai.documents
    DROP CONSTRAINT IF EXISTS documents_current_version_fk;
ALTER TABLE examai.documents
    ADD CONSTRAINT documents_current_version_fk
    FOREIGN KEY (current_version_uuid) REFERENCES examai.document_versions(uuid)
    DEFERRABLE INITIALLY DEFERRED;

-- A document must never point at a version of a DIFFERENT document, and must
-- never point at an unpublished one. Both are the kind of mistake that shows a
-- student a draft while every status column still reads "published".
CREATE OR REPLACE FUNCTION examai.documents_current_version_valid() RETURNS TRIGGER AS $$
DECLARE
    owner UUID;
    state TEXT;
BEGIN
    IF NEW.current_version_uuid IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT document_uuid, status INTO owner, state
    FROM examai.document_versions WHERE uuid = NEW.current_version_uuid;

    IF owner IS NULL THEN
        RAISE EXCEPTION 'documents: current_version_uuid % does not exist', NEW.current_version_uuid;
    END IF;
    IF owner <> NEW.uuid THEN
        RAISE EXCEPTION 'documents: current_version_uuid % belongs to document %, not %',
            NEW.current_version_uuid, owner, NEW.uuid;
    END IF;
    IF state <> 'published' THEN
        RAISE EXCEPTION 'documents: cannot point at version % because its status is %',
            NEW.current_version_uuid, state;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS documents_current_version_trg ON examai.documents;
CREATE CONSTRAINT TRIGGER documents_current_version_trg
    AFTER INSERT OR UPDATE OF current_version_uuid ON examai.documents
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION examai.documents_current_version_valid();

-- ---------------------------------------------------------------------------
-- sections — derived, never authored
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS examai.sections (
    uuid                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_version_uuid UUID NOT NULL
        REFERENCES examai.document_versions(uuid) ON DELETE CASCADE,

    anchor               TEXT NOT NULL,
    level                INT  NOT NULL CHECK (level BETWEEN 1 AND 3),
    parent_section_uuid  UUID REFERENCES examai.sections(uuid) ON DELETE CASCADE,

    -- "Deadlock detection › Multiple instances › Example". Carried so a search
    -- hit can show where it sits without walking parents, and so a RAG chunk
    -- knows its own context (Phase 3).
    heading_path         TEXT NOT NULL,
    heading              TEXT NOT NULL,
    body_md              TEXT NOT NULL DEFAULT '',
    order_index          INT  NOT NULL,

    -- Generated, so it can never fall out of step with body_md. Phase 3 adds
    -- the keyword leg of hybrid search on top of it; the column exists now
    -- because adding it later means rewriting every row.
    tsv                  TSVECTOR GENERATED ALWAYS AS (
                             to_tsvector('english', heading || ' ' || body_md)
                         ) STORED,

    -- Phase 3. Nullable and unused until then; declared here so the shape of a
    -- section does not change under content that already exists.
    embedding            REAL[],

    UNIQUE (document_version_uuid, anchor)
);

CREATE INDEX IF NOT EXISTS sections_version_idx ON examai.sections (document_version_uuid, order_index);
CREATE INDEX IF NOT EXISTS sections_tsv_idx     ON examai.sections USING GIN (tsv);
CREATE INDEX IF NOT EXISTS sections_parent_idx  ON examai.sections (parent_section_uuid);

-- ---------------------------------------------------------------------------
-- anchor_aliases — deep links survive heading edits
-- ---------------------------------------------------------------------------
--
-- A shared link to #deadlock-detection must keep working after the heading is
-- reworded. Without this the link does not error — it silently lands at the top
-- of the page, which looks like the reader's mistake rather than ours.
--
-- The publish pipeline refuses to publish if a previously published anchor
-- disappears with no alias covering it.

CREATE TABLE IF NOT EXISTS examai.anchor_aliases (
    document_uuid UUID NOT NULL REFERENCES examai.documents(uuid) ON DELETE CASCADE,
    old_anchor    TEXT NOT NULL,
    new_anchor    TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (document_uuid, old_anchor)
);

-- ---------------------------------------------------------------------------
-- document_topics — a document may cover more than one node
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS examai.document_topics (
    document_uuid UUID NOT NULL REFERENCES examai.documents(uuid) ON DELETE CASCADE,
    node_uuid     UUID NOT NULL REFERENCES examai.syllabus_nodes(uuid) ON DELETE CASCADE,
    role          TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary','secondary')),
    PRIMARY KEY (document_uuid, node_uuid)
);

CREATE INDEX IF NOT EXISTS document_topics_node_idx ON examai.document_topics (node_uuid);
