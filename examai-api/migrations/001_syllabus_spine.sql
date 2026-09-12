-- SUPERSEDED by 002_examai_schema.sql. Intentionally empty.
--
-- This created `public.syllabus_nodes` with a TEXT path as the primary key.
-- Two decisions replaced it within the same day, before anything referenced the
-- table:
--
--   * the ExamAI tables moved into their own `examai` schema, so that Supreme
--     AI's Drizzle (same database) cannot see them as drift and drop them;
--   * the primary key became a UUID, so links survive a unit being renumbered.
--
-- The file is kept rather than deleted so the migration sequence has no hole,
-- and emptied rather than edited so that a database which already ran the
-- original does not get the old table recreated on the next run. 002 drops it.

SELECT 1;
