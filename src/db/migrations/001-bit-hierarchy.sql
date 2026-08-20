-- MockExams BIT Hierarchy Migration
-- Inserts complete Purbanchal University BIT structure
-- Created: August 20, 2026

-- ================================================================
-- TIER 1: COUNTRY
-- ================================================================
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
VALUES
  (NULL, 'np', 'country', 'NP', 'Nepal', '{"country_code": "NP", "language": "en"}', true)
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- TIER 2: SYSTEM/BOARD
-- ================================================================
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu', 'system_or_board', 'PU', 'Purbanchal University',
  '{"type": "university", "region": "eastern_nepal", "established": 2005}', true
FROM academic_nodes WHERE code = 'NP'
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- TIER 3: INSTITUTION
-- ================================================================
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite', 'institution', 'CITE', 'Cyber Institute of Technology & Entrepreneurship',
  '{"type": "college", "location": "Itahari", "affiliation": "PU"}', true
FROM academic_nodes WHERE code = 'PU'
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- TIER 4: PROGRAM
-- ================================================================
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit', 'program', 'BIT', 'Bachelor of Information Technology',
  '{"total_semesters": 8, "credits_required": 130, "duration_years": 4, "affiliation": "PU"}', true
FROM academic_nodes WHERE code = 'CITE'
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- TIER 5: ACADEMIC PERIODS (Semesters 1-8)
-- ================================================================
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem1', 'academic_period', 'SEM1', 'Semester 1',
  '{"semester": 1, "credits": 15, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2', 'academic_period', 'SEM2', 'Semester 2',
  '{"semester": 2, "credits": 15, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem3', 'academic_period', 'SEM3', 'Semester 3',
  '{"semester": 3, "credits": 16, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem4', 'academic_period', 'SEM4', 'Semester 4',
  '{"semester": 4, "credits": 16, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5', 'academic_period', 'SEM5', 'Semester 5',
  '{"semester": 5, "credits": 15, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem6', 'academic_period', 'SEM6', 'Semester 6',
  '{"semester": 6, "credits": 15, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem7', 'academic_period', 'SEM7', 'Semester 7',
  '{"semester": 7, "credits": 15, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem8', 'academic_period', 'SEM8', 'Semester 8',
  '{"semester": 8, "credits": 15, "duration_weeks": 16}', true
FROM academic_nodes WHERE code = 'BIT'
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- TIER 6: SUBJECTS (Core subjects for all semesters)
-- ================================================================

-- Semester 1 Subjects
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem1.cprog', 'subject', 'BIT101', 'Programming in C',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM1'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.discrete', 'subject', 'BIT102', 'Discrete Mathematics',
  '{"credits": 3, "type": "theory"}', true
FROM academic_nodes WHERE code = 'SEM1'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.digital', 'subject', 'BIT103', 'Digital Logic',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM1'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.english', 'subject', 'BIT104', 'English I',
  '{"credits": 2, "type": "theory"}', true
FROM academic_nodes WHERE code = 'SEM1'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.calculus', 'subject', 'BIT105', 'Calculus I',
  '{"credits": 3, "type": "theory"}', true
FROM academic_nodes WHERE code = 'SEM1'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.physics', 'subject', 'BIT106', 'Physics',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM1'
ON CONFLICT (path) DO NOTHING;

-- Semester 2 Subjects
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem2.dsa', 'subject', 'BIT201', 'Data Structures & Algorithms',
  '{"credits": 4, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM2'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.oop', 'subject', 'BIT202', 'Object-Oriented Programming',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM2'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.web', 'subject', 'BIT203', 'Web Technologies',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM2'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.os', 'subject', 'BIT204', 'Operating Systems',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM2'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.linear', 'subject', 'BIT205', 'Linear Algebra',
  '{"credits": 3, "type": "theory"}', true
FROM academic_nodes WHERE code = 'SEM2'
ON CONFLICT (path) DO NOTHING;

-- Semester 5 Subjects (Database focus)
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem5.dbms', 'subject', 'BIT501', 'Database Management Systems',
  '{"credits": 4, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM5'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.networks', 'subject', 'BIT502', 'Computer Networks',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM5'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.ai', 'subject', 'BIT503', 'Artificial Intelligence',
  '{"credits": 3, "type": "theory_practical"}', true
FROM academic_nodes WHERE code = 'SEM5'
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- TIER 7: TOPICS (Sample topics for key subjects)
-- ================================================================

-- C Programming Topics
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem1.cprog.basics', 'topic', 'C101', 'C Fundamentals',
  '{"importance": "Very High", "exam_frequency": 8}', true
FROM academic_nodes WHERE code = 'BIT101'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.cprog.pointers', 'topic', 'C102', 'Pointers & Memory Management',
  '{"importance": "Very High", "exam_frequency": 7}', true
FROM academic_nodes WHERE code = 'BIT101'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.cprog.arrays', 'topic', 'C103', 'Arrays & Strings',
  '{"importance": "High", "exam_frequency": 6}', true
FROM academic_nodes WHERE code = 'BIT101'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.cprog.functions', 'topic', 'C104', 'Functions & Recursion',
  '{"importance": "High", "exam_frequency": 5}', true
FROM academic_nodes WHERE code = 'BIT101'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem1.cprog.structs', 'topic', 'C105', 'Structures & File Handling',
  '{"importance": "High", "exam_frequency": 4}', true
FROM academic_nodes WHERE code = 'BIT101'
ON CONFLICT (path) DO NOTHING;

-- Data Structures Topics
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem2.dsa.linked_lists', 'topic', 'DSA101', 'Linked Lists',
  '{"importance": "Very High", "exam_frequency": 8}', true
FROM academic_nodes WHERE code = 'BIT201'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.dsa.stacks_queues', 'topic', 'DSA102', 'Stacks & Queues',
  '{"importance": "Very High", "exam_frequency": 7}', true
FROM academic_nodes WHERE code = 'BIT201'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.dsa.trees', 'topic', 'DSA103', 'Trees & BST',
  '{"importance": "Very High", "exam_frequency": 8}', true
FROM academic_nodes WHERE code = 'BIT201'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem2.dsa.graphs', 'topic', 'DSA104', 'Graphs & Graph Algorithms',
  '{"importance": "High", "exam_frequency": 6}', true
FROM academic_nodes WHERE code = 'BIT201'
ON CONFLICT (path) DO NOTHING;

-- Database Topics
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem5.dbms.relational', 'topic', 'DBMS101', 'Relational Model & SQL',
  '{"importance": "Very High", "exam_frequency": 9}', true
FROM academic_nodes WHERE code = 'BIT501'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.dbms.indexing', 'topic', 'DBMS102', 'Indexing & B-Trees',
  '{"importance": "High", "exam_frequency": 6}', true
FROM academic_nodes WHERE code = 'BIT501'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.dbms.normalization', 'topic', 'DBMS103', 'Normalization',
  '{"importance": "High", "exam_frequency": 7}', true
FROM academic_nodes WHERE code = 'BIT501'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.dbms.transactions', 'topic', 'DBMS104', 'Transactions & Concurrency',
  '{"importance": "High", "exam_frequency": 5}', true
FROM academic_nodes WHERE code = 'BIT501'
ON CONFLICT (path) DO NOTHING;

-- AI Topics
INSERT INTO academic_nodes (parent_id, path, node_type, code, title, metadata, is_published)
SELECT
  id, 'np.pu.cite.bit.sem5.ai.search', 'topic', 'AI101', 'Search Algorithms (BFS, DFS, A*)',
  '{"importance": "Very High", "exam_frequency": 7}', true
FROM academic_nodes WHERE code = 'BIT503'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.ai.knowledge', 'topic', 'AI102', 'Knowledge Representation',
  '{"importance": "High", "exam_frequency": 4}', true
FROM academic_nodes WHERE code = 'BIT503'
UNION ALL
SELECT
  id, 'np.pu.cite.bit.sem5.ai.ml', 'topic', 'AI103', 'Machine Learning Basics',
  '{"importance": "High", "exam_frequency": 5}', true
FROM academic_nodes WHERE code = 'BIT503'
ON CONFLICT (path) DO NOTHING;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Verify hierarchy structure
SELECT 'Country:' as level, COUNT(*) as count FROM academic_nodes WHERE node_type = 'country'
UNION ALL
SELECT 'System/Board', COUNT(*) FROM academic_nodes WHERE node_type = 'system_or_board'
UNION ALL
SELECT 'Institution', COUNT(*) FROM academic_nodes WHERE node_type = 'institution'
UNION ALL
SELECT 'Program', COUNT(*) FROM academic_nodes WHERE node_type = 'program'
UNION ALL
SELECT 'Academic Period', COUNT(*) FROM academic_nodes WHERE node_type = 'academic_period'
UNION ALL
SELECT 'Subject', COUNT(*) FROM academic_nodes WHERE node_type = 'subject'
UNION ALL
SELECT 'Topic', COUNT(*) FROM academic_nodes WHERE node_type = 'topic';

-- Show sample paths
SELECT path, title, node_type FROM academic_nodes
WHERE node_type IN ('program', 'subject', 'topic')
ORDER BY path
LIMIT 20;
