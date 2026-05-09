# Phase 1 — Critical Bugs (Fix These First)

> These 4 issues prevent the app from running correctly for any user.
> Do not move to other phases until all 4 are resolved.

---

## Bug 1 — Duplicate route folders crash Next.js router

**Priority:** 🔴 Blocker
**Files:** `src/app/exams/[id/]/` and `src/app/api/exams/[id/]/submit/`

**Problem:**
Two sets of route folders exist with a typo — `[id/]` instead of `[id]`.
Next.js cannot resolve either route. The exam taking page and submit API both fail with a 404.

**Fix:**
```bash
# Delete the broken folders entirely
rm -rf "src/app/exams/[id/]"
rm -rf "src/app/api/exams/[id/]"
```

The correct folders `src/app/exams/[id]/take/page.tsx` and
`src/app/api/exams/[id]/submit/route.ts` already exist and are correct.
Keep those. Delete only the typo copies.

**Verify:**
```bash
ls src/app/exams/
# Should show: [id]  page.tsx  results
ls src/app/api/exams/
# Should show: [id]
```

---

## Bug 2 — Admin dashboard crashes on load (missing imports)

**Priority:** 🔴 Blocker
**File:** `src/app/admin/page.tsx`

**Problem:**
The `fetchData` function calls `getDocs`, `query`, `orderBy`, and `limit`
but these are not imported from `firebase/firestore`. The page throws a
ReferenceError on mount, crashing for every admin user.

**Fix:**
Open `src/app/admin/page.tsx` and update the import line:

```ts
// BEFORE (missing the query helpers)
import { collection, getCountFromServer } from "firebase/firestore";

// AFTER
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
```

**Verify:**
Log in as admin → navigate to `/admin` → page should load with stats cards
and a recent users table without any console errors.

---

## Bug 3 — package.json name is wrong

**Priority:** 🟡 Minor but fix before deployment
**File:** `package.json`

**Problem:**
The `name` field is still `"platform"` from the original scaffold.
This causes issues with npm scripts and looks wrong in Vercel.

**Fix:**
```json
{
  "name": "mockexams",
  ...
}
```

---

## Bug 4 — Notes page is 100% hardcoded mock data

**Priority:** 🔴 Blocker for real users
**File:** `src/app/notes/page.tsx`

**Problem:**
All resources shown in the Notes library are fake static arrays defined
directly in the component. There is no Firestore connection whatsoever.
Students see fake book titles by non-existent authors that cannot be opened.

**Fix (minimum viable):**
Replace the hardcoded `RESOURCES` array with a Firestore fetch:

```tsx
// Add imports
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

// Replace useState initial value
const [resources, setResources] = useState<any[]>([]);
const [loadingResources, setLoadingResources] = useState(true);

// Add useEffect to fetch
useEffect(() => {
  async function fetchResources() {
    try {
      const snap = await getDocs(
        query(collection(db, "resources"), orderBy("title"))
      );
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoadingResources(false);
    }
  }
  fetchResources();
}, []);

// Replace RESOURCES with resources in the filter
const filteredResources = resources.filter(res => { ... });
```

Then add seed data — see Phase 8 for the seeding script addition.
