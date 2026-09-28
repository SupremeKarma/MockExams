# Access Control Rules: Content Sharing & Export

Strict rules for which content can be shared, downloaded, printed, or exported. Proprietary content protection.

---

## Content Classification

| Content Type | Created | Rendered | Shareable | Downloadable | Printable | Export PDF | Export Word |
|---|---|---|---|---|---|---|---|
| **Syllabus** | `.md` file | Website | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Notes** | `.md` file | Website | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Solutions** | `.md` file | Website | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Exam Results** | Database | Website | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Rule 1: No Share Button on Proprietary Content

**What**: Syllabus, Notes, Solutions pages MUST NOT display share/download buttons

**Where to apply**:
- `/syllabus` page
- `/notes` page  
- `/solution` page
- `/past-papers` page

**Implementation**:
```css
/* Hide share actions on protected content */
.syllabus .share-actions,
.notes .share-actions,
.solution .share-actions,
.past-papers .share-actions {
  display: none !important;
}
```

**Check**: Verify these pages have NO:
- Share icon button
- Download button
- Print button
- "Copy link" option
- "Save as PDF" option

---

## Rule 2: Exam Results ONLY are Shareable

**What**: Only exam result pages can be shared, downloaded, printed

**Where to apply**:
- `/exams/results/[attemptId]` page
- `/examiner/[examId]/results/[attemptId]` page

**Allowed actions on exam results**:
```
✅ Share this result (with link)
✅ Download as PDF
✅ Download as Word (.docx)
✅ Print to paper
✅ Copy link to clipboard
✅ Email result link
```

**Implementation**:
```css
/* Only show these on exam results */
.exam-results .share-actions {
  display: flex;
}

/* Hide on all other pages */
.syllabus .share-actions,
.notes .share-actions,
.solution .share-actions {
  display: none !important;
}
```

---

## Rule 3: Markdown Files Are Read-Only

**What**: `.md` files in the system are CREATE-ONLY by admins, NEVER downloaded by users

**Where to apply**:
- All `.md` files in `/src/content/`
- All course syllabi `.md` files
- All notes `.md` files
- All solutions `.md` files

**Create flow** (Admin only):
```
Admin creates .md file
   ↓
System renders as HTML on website
   ↓
Users view in browser (NO download)
```

**Prevent**:
```
❌ Right-click → Save As
❌ Browser dev tools access
❌ Direct .md file URL access
❌ API endpoints that return raw .md
❌ Download button on content
```

---

## Rule 4: Content Rendering Rules

### Syllabus Rendering
```
Input:  .md file (unit/topic structure)
Output: HTML rendered on /syllabus page
Access: Read-only (no download)
Share:  Not allowed
Export: Not allowed
```

### Notes Rendering
```
Input:  .md file (lesson content)
Output: HTML rendered on /notes/[slug] page
Access: Read-only (no download)
Share:  Not allowed
Export: Not allowed
```

### Solutions Rendering
```
Input:  .md file (step-by-step answers)
Output: HTML rendered on /solution/[slug] page
Access: Read-only (no download)
Share:  Not allowed
Export:  Not allowed
```

### Exam Results Rendering
```
Input:  Database record (attempt data)
Output: HTML rendered on /exams/results/[id] page
Access: View + Share + Download + Print
Share:  Allowed (with auth token)
Export: PDF, Word (.docx), Print
```

---

## Rule 5: Print Behavior

### Syllabus/Notes/Solutions Printing
```css
@media print {
  /* Hide proprietary indicators */
  .proprietary-notice {
    display: block;
    color: red;
    font-weight: bold;
  }
  
  /* Add watermark */
  .content-watermark {
    position: fixed;
    opacity: 0.1;
  }
  
  /* Prevent printing to PDF */
  body {
    print-color-adjust: exact;
  }
}
```

**User tries to print**: Browser print dialog shows but:
- Watermark appears: "FOR INTERNAL USE ONLY"
- No direct PDF export
- User must select "Save as PDF" manually
- Track print attempts in logs

### Exam Results Printing
```
✅ User clicks "Print" button
✅ Print dialog opens
✅ User can save as PDF
✅ User can print to paper
✅ Result shows student name, score, date
```

---

## Rule 6: Share Button Logic

### Hide Share on Protected Pages
```tsx
// In component: ShareButton.tsx
if (contentType === 'syllabus' || 
    contentType === 'notes' || 
    contentType === 'solution' ||
    contentType === 'past-papers') {
  return null; // Don't render share button
}

// Only render for exam results
if (contentType === 'exam-results') {
  return <ShareButton /> // Show all options
}
```

### Exam Results Share Options
```
┌─────────────────────────────────┐
│ Share This Result                │
├─────────────────────────────────┤
│ 🔗 Copy Link                    │
│ 📧 Email to Parent              │
│ 📥 Download as PDF              │
│ 📥 Download as Word             │
│ 🖨️  Print                        │
│ 🚫 (No share to social media)   │
└─────────────────────────────────┘
```

---

## Rule 7: API Endpoints

### Protected (No Download)
```
❌ GET /api/syllabus/[id].md
   → Error: 403 Forbidden
   
❌ GET /api/notes/[slug].md
   → Error: 403 Forbidden
   
❌ GET /api/solutions/[slug].md
   → Error: 403 Forbidden
   
❌ GET /api/past-papers/[id].md
   → Error: 403 Forbidden
```

### Allowed (Results Only)
```
✅ GET /api/exams/results/[attemptId]
   → Returns JSON (can be exported)
   
✅ GET /api/exams/results/[attemptId]/pdf
   → Returns PDF binary
   
✅ GET /api/exams/results/[attemptId]/docx
   → Returns Word binary
   
✅ GET /api/exams/results/[attemptId]/share-link
   → Returns shareable token
```

---

## Rule 8: User Experience

### What Users See

**On Syllabus/Notes/Solutions:**
```
┌─────────────────────────────────┐
│ 📖 Operating Systems Syllabus    │
│ (Header with NO share options)   │
├─────────────────────────────────┤
│ [Content renders here]           │
│ (Three-pane layout)              │
│                                  │
│ Left: Navigation                 │
│ Center: Content                  │
│ Right: Table of Contents         │
│                                  │
│ Footer: NO download/share        │
└─────────────────────────────────┘
```

**On Exam Results:**
```
┌─────────────────────────────────┐
│ 📊 Exam Result                   │
│ [SHARE] [PDF] [WORD] [PRINT]     │ ← Visible buttons
├─────────────────────────────────┤
│ Student: John Doe                │
│ Score: 85/100                    │
│ Date: 2026-09-28                 │
│                                  │
│ [Detailed results]               │
│                                  │
│ [Download PDF] [Download Word]   │ ← Export buttons
└─────────────────────────────────┘
```

---

## Rule 9: Security Implementation

### Frontend Checks
```tsx
// pages/syllabus.tsx
export const canShare = (contentType: string) => {
  const protectedTypes = ['syllabus', 'notes', 'solution', 'past-papers'];
  return !protectedTypes.includes(contentType);
};

// pages/notes.tsx
if (canShare('notes') === false) {
  // Hide all share/download UI
  return <ContentWithoutShare />;
}
```

### Backend Checks
```ts
// api/share.ts
export async function POST(req: Request) {
  const { contentType, contentId } = req.body;
  
  // Whitelist only exam results
  if (contentType !== 'exam-results') {
    return Response.json(
      { error: 'Sharing not allowed for this content' },
      { status: 403 }
    );
  }
  
  // Allow only exam results
  return createShareLink(contentId);
}
```

### Database Rules
```sql
-- Prevent marking non-results as shareable
CREATE TRIGGER prevent_non_result_share
BEFORE INSERT ON shared_content
FOR EACH ROW
BEGIN
  IF NEW.content_type != 'exam_result' THEN
    RAISE EXCEPTION 'Only exam results can be shared';
  END IF;
END;
```

---

## Rule 10: Audit & Logging

### Log All Download Attempts
```
[2026-09-28 14:23:45] ATTEMPT_SHARE: user=123, content=syllabus/os-101, status=BLOCKED
[2026-09-28 14:24:12] ATTEMPT_DOWNLOAD: user=123, content=notes/deadlock, status=BLOCKED
[2026-09-28 14:25:03] SHARE_SUCCESS: user=123, content=exam-result/456, token=abc123
[2026-09-28 14:25:18] DOWNLOAD_PDF: user=123, content=exam-result/456, status=SUCCESS
```

### Alert on Suspicious Activity
```
⚠️ Alert: User 123 attempted to download protected content 5 times in 2 minutes
⚠️ Alert: API endpoint /api/notes/biology.md accessed directly
⚠️ Alert: Unauthorized share link created for syllabus content
```

---

## Enforcement Checklist

### Frontend
- [ ] Share button hidden on `/syllabus`
- [ ] Share button hidden on `/notes`
- [ ] Share button hidden on `/solution`
- [ ] Share button hidden on `/past-papers`
- [ ] Share button visible on `/exams/results/[id]`
- [ ] Export buttons (PDF/Word) only on exam results
- [ ] Print button only on exam results
- [ ] No download link in page headers for protected content

### Backend
- [ ] API rejects share requests for non-exam-results (403)
- [ ] API rejects PDF export for non-exam-results (403)
- [ ] API rejects Word export for non-exam-results (403)
- [ ] Direct `.md` file URLs return 403 or redirect
- [ ] Share tokens only work for exam results
- [ ] Logs track all unauthorized access attempts

### Database
- [ ] Triggers prevent marking non-results as shareable
- [ ] Shared_content table only contains exam results
- [ ] Export_logs only contain exam result entries

### Testing
- [ ] User cannot right-click → Save As on protected pages
- [ ] User cannot access `/api/notes/[slug].md` directly
- [ ] User can share exam results successfully
- [ ] User can export exam results as PDF/Word
- [ ] Share link for exam result works after 24 hours
- [ ] Share link for exam result expires after 7 days

---

## FAQ

**Q: Can teachers download solutions to share with students?**
A: No. Solutions are proprietary. Teachers must direct students to view on website.

**Q: Can students print exam results?**
A: Yes. Only exam results have print functionality.

**Q: Why block downloads of notes?**
A: Notes are proprietary content. Users access via website only, ensuring version control and protecting intellectual property.

**Q: Can I export exam results?**
A: Yes, to PDF or Word. This is the ONLY export allowed.

**Q: What if my browser has print-to-PDF?**
A: Watermark will appear on any printed output. Logs track attempts.

