# Week 1-4 Foundation Build Guide

**Status:** STARTING NOW  
**Duration:** 21 days (August 20 - September 10, 2026)  
**Deliverable:** Production-ready database schema + FSRS algorithm + BIT hierarchy migration

---

## 🎯 What We're Building

**Core Systems:**
1. ✅ 7-tier hierarchical taxonomy (Country → Topic)
2. ✅ FSRS v6 spaced repetition algorithm
3. ✅ Learning progress tracking
4. ✅ Redis caching layer
5. ✅ Multi-tenant RBAC
6. ✅ Compliance audit logging

**Expected Result:**
- Foundation for all 8 automation systems
- Zero-breaking-change expansion ready
- Production database with < 100ms queries
- Ready for Week 5 AI systems

---

## 📋 Daily Breakdown

### Days 1-2: Database Setup
**Tasks:**
- [ ] Create Supabase project (PostgreSQL 15+)
- [ ] Run schema.sql migration
- [ ] Create indexes for performance
- [ ] Setup backup & point-in-time recovery
- [ ] Verify connections from local & production

**Files:**
- `src/db/schema.sql` (created ✅)
- Environment variables for Supabase

**Verification:**
```bash
# Should return empty, schema created
SELECT COUNT(*) FROM academic_nodes;
```

### Days 3-5: BIT Data Migration
**Tasks:**
- [ ] Design BIT hierarchy structure:
  ```
  np (Country)
  └── pu (Purbanchal University)
      └── cite (CITE College)
          └── bit (Bachelor of IT)
              ├── sem1, sem2, ..., sem8
              │   ├── c_programming (subject)
              │   │   ├── pointers (topic)
              │   │   ├── arrays (topic)
              │   │   └── ...
              │   └── ... (other subjects)
              └── ... (other semesters)
  ```
- [ ] Create migration script for academic_nodes
- [ ] Migrate existing exams/questions to hierarchy
- [ ] Link all topics to old questions
- [ ] Verify backward compatibility

**Files to Create:**
- `src/db/migrations/001-bit-hierarchy.sql`

**Verification:**
```bash
# Should return paths like np.pu.cite.bit.sem1.c_programming.pointers
SELECT path FROM academic_nodes WHERE node_type = 'topic' LIMIT 5;
```

### Days 6-10: FSRS Algorithm Implementation
**Tasks:**
- [ ] Implement FSRS algorithm (file created ✅: `src/lib/spaced-repetition.ts`)
- [ ] Write unit tests (target: 100% coverage)
- [ ] Test different rating scenarios:
  - Rating 1 (forgot): resets interval
  - Rating 2 (struggled): short interval
  - Rating 3 (good): normal progression
  - Rating 4 (perfect): faster progression
- [ ] Verify ease factor calculations (range 1.3-2.5)
- [ ] Create seeding script for test flashcards

**Test Cases:**
```typescript
// Test data
const card = {
  id: "test1",
  easeFactor: 2.5,
  intervalDays: 10,
  repetitions: 5,
  nextReview: new Date(),
};

// Rating 4 (perfect) should increase both
const result = calculateNextReview(card, 4, 2000);
assert(result.intervalDays > 10);
assert(result.easeFactor > 2.5);
```

**Verification:**
```bash
npm test src/lib/spaced-repetition.test.ts
# All tests pass, coverage > 95%
```

### Days 11-15: Redis Cache Setup
**Tasks:**
- [ ] Setup Redis Cloud (or local Redis for dev)
- [ ] Implement caching layer:
  - Leaderboard (top 100 students)
  - Daily streaks
  - Badge achievements
  - User session tokens
- [ ] Create cache invalidation logic
- [ ] Setup cache expiration (e.g., 24-hour TTL for leaderboard)

**Files to Create:**
- `src/lib/cache.ts` (Redis client wrapper)
- Environment: `REDIS_URL`

### Days 16-20: Integration Testing & QA
**Tasks:**
- [ ] Hierarchy path queries (< 50ms at p95):
  ```sql
  -- Get all topics under C Programming
  SELECT * FROM academic_nodes 
  WHERE path LIKE 'np.pu.cite.bit.sem1.c_programming.%'
  
  -- Get all subjects in Sem 5
  SELECT * FROM academic_nodes
  WHERE path LIKE 'np.pu.cite.bit.sem5.%' 
    AND node_type = 'subject'
  ```

- [ ] Load test (1000 concurrent users):
  - Flashcard queries
  - Progress tracking updates
  - Leaderboard fetches

- [ ] Multi-tenant isolation (student can't see other org's data)

- [ ] Backup & disaster recovery test
  - Full backup > 100MB
  - Point-in-time restore
  - Verify zero data loss

**Performance Targets:**
| Query | Target | Status |
|-------|--------|--------|
| Get today's reviews | < 100ms | TBD |
| Update flashcard | < 50ms | TBD |
| Hierarchy path query | < 50ms | TBD |
| Leaderboard fetch | < 200ms (Redis) | TBD |
| Load test 1K users | < 500ms avg | TBD |

### Day 21: Documentation & Commit
**Tasks:**
- [ ] Document schema design decisions
- [ ] Create migration guides (dev to staging to prod)
- [ ] Write API documentation for hierarchy queries
- [ ] Create troubleshooting guide
- [ ] Commit all code to git
- [ ] Deploy to staging environment
- [ ] Final smoke tests

**Git Commit:**
```
Week 1-4: Foundation - Hierarchical taxonomy + FSRS algorithm

- Add academic_nodes table (7-tier hierarchy)
- Add flashcards table with FSRS fields
- Add learning_progress, engagement, and RBAC tables
- Implement FSRS v6 spaced repetition algorithm
- Migrate BIT Purbanchal hierarchy to database
- Add Redis caching layer for leaderboard/streaks
- Setup multi-tenant RBAC and audit logging
- Full test coverage (> 95%)
- Performance targets met (queries < 100ms)

Enables:
- Zero-breaking-change expansion to 1000+ institutions
- Spaced repetition scheduling (20-30% more efficient than SM-2)
- Multi-tenant data isolation
- Compliance audit trail

Co-Authored-By: Claude Code <claude@anthropic.com>
```

---

## 🛠️ Tools & Setup

### Development Environment
```bash
# Required
- Node.js 18+
- PostgreSQL 15+ (or Supabase)
- Redis (local or cloud)
- TypeScript 5+

# Install dependencies
npm install @supabase/supabase-js redis

# Environment setup
cp .env.example .env.local
# Fill in:
# SUPABASE_URL=...
# SUPABASE_KEY=...
# REDIS_URL=redis://localhost:6379
```

### Database Setup
```bash
# Connect to Supabase
psql "postgresql://[user]:[password]@[host]:[port]/[database]"

# Run migrations
psql -f src/db/schema.sql

# Verify schema
\dt  # List all tables
\di  # List all indexes
```

### Testing
```bash
# Run FSRS tests
npm test src/lib/spaced-repetition.test.ts

# Load test (use k6 or Artillery)
npm install -D k6
k6 run tests/load-test.js

# Multi-tenant isolation test
npm test tests/isolation.test.ts
```

---

## ✅ Week 4 Success Criteria

**Database:**
- ✅ 7-tier hierarchy fully functional
- ✅ All BIT data (8 semesters, 48+ subjects, 100+ topics) in database
- ✅ Path-based queries working correctly
- ✅ Indexes created and verified

**FSRS Algorithm:**
- ✅ All 4 rating paths tested (1=forgot, 2=struggled, 3=good, 4=perfect)
- ✅ Ease factor calculations accurate (range 1.3-2.5)
- ✅ Interval progression verified
- ✅ Unit test coverage > 95%

**Performance:**
- ✅ Query response time < 100ms (p95)
- ✅ 1000 concurrent users stable
- ✅ Redis cache operational
- ✅ Database backups working

**Operations:**
- ✅ Disaster recovery tested
- ✅ Multi-tenant isolation verified
- ✅ Audit logging functional
- ✅ Documentation complete

---

## 📈 Metrics to Track

### Database Health
- Query latency (p50, p95, p99)
- Connection pool usage
- Storage growth (expect ~500MB-1GB with BIT data)
- Backup completion time

### Algorithm Accuracy
- Ease factor convergence (should stabilize at 2.0-2.3)
- Review distribution (even spacing, not clumped)
- Retention rate (target: 98% with daily reviews)

### System Load
- CPU usage during load tests
- Memory consumption
- Connection count
- Cache hit rate

---

## 🚀 Next Steps After Week 4

**Week 5-8:** AI Core Systems
- Claude API tutoring (Socratic method)
- Adaptive difficulty engine
- Essay & code grading
- Question generation

**Week 9-12:** Analytics & Intervention
- Weak area detection
- Auto-intervention system
- ML recommendation engine
- Real-time engagement tracking

---

## 📞 Support & Debugging

### Common Issues

**Issue:** Hierarchy path queries slow  
**Solution:** Verify index on `path` column exists and is being used  
```sql
EXPLAIN ANALYZE SELECT * FROM academic_nodes WHERE path LIKE 'np.pu.cite.bit.sem1%';
```

**Issue:** FSRS ease factors drifting  
**Solution:** Check that minimum (1.3) and maximum (2.5) bounds are applied

**Issue:** Redis connection timeouts  
**Solution:** Check `REDIS_URL` and verify Redis is running

---

## 📝 Files Created

1. ✅ `src/db/schema.sql` - Complete PostgreSQL schema
2. ✅ `src/lib/spaced-repetition.ts` - FSRS algorithm
3. ✅ `revolution.md` - Complete vision document
4. ✅ `WEEK_1_4_BUILD.md` - This file

---

## 🎓 Learning Resources

- FSRS Algorithm: [Free Spaced Repetition Scheduler](https://github.com/open-spaced-repetition/fsrs.js)
- Hierarchy Queries: [PostgreSQL Hierarchical Data](https://www.postgresql.org/docs/current/ltree.html)
- Multi-tenancy: [Supabase Multi-tenancy](https://supabase.com/docs/guides/realtime/concepts#row-level-security)

---

**Ready to build. Starting now.** 🚀

Questions? Check the documentation or reach out before making changes.
