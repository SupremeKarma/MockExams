# Implementation Hiding Rules: .md Files Are Internal Only

**Core Rule:** Users never know content is stored as `.md` files. They only see rendered website content.

---

## Rule 1: No .md File Exposure

### What Users Should NOT See:
```
❌ /content/syllabus/os-101.md
❌ /api/notes/biology.md
❌ /files/solutions/algebra.md
❌ Direct links to markdown files
❌ "Source" or "Download markdown" buttons
❌ File extensions in URLs
❌ "View raw" options
❌ Markdown syntax in the browser
```

### What Users SHOULD See:
```
✅ /syllabus/os-101 (rendered HTML page)
✅ /notes/biology (rendered HTML page)
✅ /solutions/algebra (rendered HTML page)
✅ Website-like interface (no file indication)
✅ Only render buttons (PDF, Word export)
✅ No file type indicators
```

---

## Rule 2: URL Structure Hides .md Files

### Protected URLs (Block These):
```
❌ *.md files
❌ /content/
❌ /markdown/
❌ /raw/
❌ /source/
❌ Download markdown endpoints
```

**Nginx/Server Config:**
```nginx
# Block direct access to .md files
location ~ \.md$ {
  return 403;
}

# Block /content/ directory
location /content/ {
  return 403;
}

# Block /markdown/ directory
location /markdown/ {
  return 403;
}

# Block /raw/ endpoints
location /raw/ {
  return 403;
}
```

### Allowed URLs (Show These):
```
✅ /syllabus/{slug}
✅ /notes/{slug}
✅ /solutions/{slug}
✅ /past-papers/{slug}
✅ /api/share/{token}
✅ /api/share/{token}/export
```

---

## Rule 3: API Never Exposes .md Files

### Blocked API Endpoints:
```
❌ GET /api/content/*.md
❌ GET /api/syllabus/*.md
❌ GET /api/notes/*.md
❌ GET /api/solutions/*.md
❌ GET /api/files/[id].md
❌ GET /api/download/[id].md
❌ Any endpoint returning raw markdown
❌ Any endpoint with .md extension
```

**Implementation:**
```typescript
// Reject any .md file requests
app.get('**/*.md', (req, res) => {
  res.status(403).json({ 
    error: 'Access Denied',
    message: 'This resource is not available'
  });
});

// Reject /api/* requests with .md
app.get('/api/**/*.md', (req, res) => {
  res.status(403).json({ 
    error: 'Not Found',
    message: 'Resource not found'
  });
});
```

### API Returns Only Rendered Content:
```
✅ GET /api/syllabus/{id} 
   → Returns: { content: "<h1>...</h1>", title: "...", ... }

✅ GET /api/notes/{id}
   → Returns: { content: "<article>...</article>", ... }

✅ GET /api/solutions/{id}
   → Returns: { content: "<div>...</div>", ... }
```

---

## Rule 4: Server Headers Hide Implementation

**Response Headers (Hide .md):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Cache-Control: public, max-age=3600
Content-Type: text/html; charset=utf-8

❌ NOT:
X-Content-Source: /content/syllabus.md
X-Powered-By: Markdown
X-Original-File: biology-notes.md
```

---

## Rule 5: No Client-Side Markdown Exposure

### JavaScript Rules:
```javascript
// ❌ WRONG: Exposes .md files
fetch('/content/notes.md')
  .then(r => r.text())
  .then(md => showMarkdown(md));

// ✅ RIGHT: Fetches rendered HTML
fetch('/api/notes/123')
  .then(r => r.json())
  .then(data => showHTML(data.content));

// ❌ WRONG: Shows file name
<a href="/download/notes.md">Download</a>

// ✅ RIGHT: Shows format but not file
<a href="/api/notes/123/export?format=pdf">Download PDF</a>
```

### HTML Never Shows Markdown:
```html
❌ Wrong:
<pre>{raw_markdown_content}</pre>

✅ Right:
<div class="prose">{rendered_html_content}</div>
```

---

## Rule 6: Search & Indexing Hides .md

### robots.txt:
```
User-agent: *
Disallow: /content/
Disallow: /markdown/
Disallow: /api/
Disallow: /*.md
Disallow: /raw/
Disallow: /source/
```

### Meta Tags:
```html
<!-- On all pages hiding .md structure -->
<meta name="robots" content="index, follow">
<!-- But don't expose source -->
<meta name="google" content="nositelinkssearch box">
```

---

## Rule 7: Error Messages Don't Mention .md

### ❌ WRONG Errors:
```
Error loading /syllabus/os-101.md
File not found: biology-notes.md
Markdown parsing error in solutions.md
```

### ✅ RIGHT Errors:
```
Error loading content
Unable to retrieve this page
Content not available
Please try again later
```

---

## Rule 8: Network Traffic Hides .md Files

### Browser DevTools Should Show:
```
✅ /syllabus/os-101 (HTML page)
✅ /api/syllabus/os-101 (JSON response)
✅ /share/abc123def (rendered page)
```

### Browser DevTools Should NOT Show:
```
❌ *.md file requests
❌ /content/ requests
❌ /markdown/ requests
❌ Raw markdown responses
```

---

## Rule 9: Database Records Hide .md

### Database Fields:
```sql
-- ✅ Store like this (no .md reference)
content_pages:
  id: uuid
  slug: 'os-101'
  title: 'Operating Systems'
  rendered_html: '<h1>...</h1>'
  created_at: timestamp
  updated_at: timestamp

-- ❌ DON'T store like this
content_pages:
  markdown_file: 'syllabus/os-101.md'
  source_path: '/content/syllabus.md'
  file_extension: '.md'
```

---

## Rule 10: Documentation & Comments Hide .md

### Code Comments:
```typescript
// ✅ RIGHT
// Render syllabus content for display
function renderSyllabus(contentId: string) {
  const html = getRenderedContent(contentId);
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

// ❌ WRONG - Exposes .md
// Load syllabus.md and convert to HTML
function renderSyllabus(slug: string) {
  const md = loadMarkdownFile(`/content/${slug}.md`);
  return convertMarkdownToHtml(md);
}
```

### User-Facing Documentation:
```
✅ "View syllabus content"
✅ "Read notes page"
✅ "Download exam result as PDF"

❌ "Download markdown file"
❌ "View raw .md source"
❌ "Markdown content"
```

---

## Rule 11: Admin Interface Hides .md

### Admin Should See:
```
✅ Content title: "Operating Systems"
✅ Slug: "os-101"
✅ Published: Yes/No
✅ Created: 2026-09-28
✅ Preview button → shows rendered HTML
```

### Admin Should NOT See:
```
❌ File path: /content/syllabus/os-101.md
❌ File size: 45KB
❌ Raw markdown
❌ "Edit markdown" option
❌ File extension indicator
```

---

## Rule 12: Compliance & Obfuscation

### What to Obfuscate:
```javascript
// ❌ BAD: Reveals structure
const contentPath = '/content/syllabus.md';
const apiUrl = `/api/markdown/${id}`;

// ✅ GOOD: Hides structure
const contentPath = generateContentRoute(id);
const apiUrl = `/api/content/${id}`;
```

### Build Process Must:
```bash
# ✅ Do this
- Copy .md files to internal folder (not public)
- Render to HTML during build
- Publish only HTML to CDN
- Strip source maps in production

# ❌ Don't do this
- Publish .md files to public folder
- Include source maps showing original files
- Expose /content or /markdown directories
- Include build artifacts
```

---

## Rule 13: Content Updates Hide .md Changes

### Users See:
```
Page updated: 2 hours ago
Version: 2
```

### Users DON'T See:
```
❌ git commit message
❌ .md file changed at timestamp
❌ Markdown diff
❌ Original file path
❌ "markdown.md" changed by user@company
```

---

## Implementation Checklist

### Frontend
- [ ] No .md file references in code
- [ ] URLs use slugs, not file paths
- [ ] No markdown syntax displayed
- [ ] No "View source" option
- [ ] No download markdown button
- [ ] Console doesn't show .md requests

### Backend/API
- [ ] Block *.md file requests with 403
- [ ] Block /content/, /markdown/, /raw/ with 403
- [ ] API returns rendered HTML, not markdown
- [ ] Error messages don't mention .md
- [ ] Response headers don't reveal structure
- [ ] No X-Source-File or similar headers

### Server/Nginx
- [ ] .md files not in web root
- [ ] Direct .md access blocked (403)
- [ ] /content/ directory blocked
- [ ] /api/*.md endpoints blocked
- [ ] robots.txt blocks .md files

### Database
- [ ] No markdown_file field
- [ ] No source_path field
- [ ] Store rendered_html only
- [ ] slug field for URLs only

### Documentation
- [ ] User docs never mention .md
- [ ] Code comments hide implementation
- [ ] Admin docs explain "content" not "markdown"
- [ ] API docs show rendered endpoints only

### Security
- [ ] .md files stored outside web root
- [ ] File permissions restrict access (600)
- [ ] Build process doesn't expose paths
- [ ] Source maps excluded in production
- [ ] git history not publicly accessible

---

## What Users Know

✅ **Users Know:**
- Content exists on website
- Can view, download (as PDF/Word), print
- Content is organized by category
- Content expires or updates
- Can share exam results

❌ **Users Don't Know:**
- Content is stored as .md files
- File paths or locations
- File formats
- Source control system
- Build process

---

## Example: Syllabus Page

### What Users See:
```
URL: https://examai.local/syllabus/os-101
Title: Operating Systems
Navigation: Unit 1 → Unit 2 → Unit 3
Content: [Rendered HTML]
Actions: Share (exam results only), Print, Download PDF
```

### What's Hidden Behind the Scenes:
```
Source file: /content/syllabus/os-101.md
Generated: During build process
Rendered to: Database table (rendered_html column)
API: /api/syllabus/os-101 returns {content: HTML}
Cache: CDN caches rendered HTML
Update: Admin uploads new .md, system re-renders
```

**Users see ONLY the rendered website, never the .md files.**

