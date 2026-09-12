-- "Asked in" — expose question_topics to the Reader role, safely.
--
-- question_topics carries no publish state of its own: Postgres has never
-- heard of a paper's status, which lives in Firestore (Phase 2a — see
-- docs/decisions/0001). This view is NOT the gate that keeps an unpublished
-- paper's questions off a student's screen; it only ever says "some question
-- is tagged to this node", never the question's text, number, or which paper
-- it is from beyond the opaque `question_ref` string. The real gate is at the
-- call site that resolves `question_ref` against Firestore, which must check
-- `paper.status == 'published'` before showing anything this view returns.
--
-- Restricting to active syllabus nodes is the same defense in depth as
-- `published_syllabus`: a link into a draft or retired subtree is not
-- reachable through this view even if the call site's own check were wrong.

CREATE OR REPLACE VIEW examai.published_question_topics AS
SELECT qt.question_ref, qt.node_uuid, qt.role, qt.weight
FROM examai.question_topics qt
JOIN examai.syllabus_nodes n ON n.uuid = qt.node_uuid
WHERE n.status = 'active';

COMMENT ON VIEW examai.published_question_topics IS
    'Question -> spine links for nodes a student may see. Reveals that a question exists, never its content — the caller must still confirm the paper is published in Firestore.';

GRANT SELECT ON examai.published_question_topics TO examai_reader;

-- Same defense-in-depth as migration 004's other tables: the grant above is
-- the real control, this is for the day someone runs
-- `GRANT SELECT ON ALL TABLES ... TO examai_reader` to debug something and
-- forgets to undo it.

ALTER TABLE examai.question_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE examai.question_topics FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS writer_all ON examai.question_topics;
CREATE POLICY writer_all ON examai.question_topics
    FOR ALL TO examai_writer USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS reader_active ON examai.question_topics;
CREATE POLICY reader_active ON examai.question_topics
    FOR SELECT TO examai_reader USING (
        EXISTS (
            SELECT 1 FROM examai.syllabus_nodes n
            WHERE n.uuid = question_topics.node_uuid AND n.status = 'active'
        )
    );
