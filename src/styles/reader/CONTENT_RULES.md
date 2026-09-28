# Content Rules Guide: Syllabus, Notes, Solutions

A comprehensive guide to CSS styling rules for consistent design across syllabus, notes, and solutions pages. This prevents common styling mistakes and ensures brand consistency.

---

## Quick Reference

| Content Type | Left Sidebar | Middle Page | Right Sidebar |
|---|---|---|---|
| **Syllabus** | Units of Subject | Complete Syllabus Content | Past Papers |
| **Notes** | Complete Syllabus | Complete Note Content | Past Repeated Questions (by year) |
| **Solutions** | Question/Chapter Navigator | Step-by-Step Workings & Answers | Answer Summary |

---

## Overview: The Three-Pane Layout

All three content types (syllabus, notes, solutions) use the same responsive layout:

```
┌─────────────────────────────────────────────────┐
│               Header (Sticky)                   │
├──────────┬──────────────────────┬───────────────┤
│  Left    │                      │    Right      │
│  Rail    │   Middle Pane        │    Table of   │
│          │   (Main Content)     │    Contents   │
│  (Nav)   │                      │    (TOC)      │
│          │                      │               │
└──────────┴──────────────────────┴───────────────┘
```

**Responsive Behavior:**
- **Mobile (<768px)**: Single column, toolbar at bottom, sidebars hidden
- **Tablet (768px)**: Middle pane + right sidebar (TOC)
- **Desktop (1280px+)**: All three panes visible (Rail + Middle + TOC)

---

## Color System

All three content types inherit from the **design tokens** (tokens.css):

### Light Themes
- **Paper (default)**: `--ink: #1A2230` (dark blue-gray)
- **Warm**: `--ink: #2B241B` (brown)

### Dark Themes
- **Blackboard**: `--ink: #E7E5DD` (chalk white)
- **Night**: `--ink: #C9C4B8` (dimmed)

### Never Override Individual Colors

❌ **Wrong:**
```css
.syllabus h2 { color: #FF0000; }
```

✅ **Right:**
```css
.syllabus .prose h2 {
  color: var(--ink);
  font-weight: 700;
}
```

### Color Hierarchy

| Element | Color Token | Usage |
|---------|------------|-------|
| Body text | `--ink` | Primary content, headings |
| Secondary text | `--ink-2` | Breadcrumbs, meta, list markers |
| Tertiary text | `--ink-3` | Hints, timestamps, disabled |
| Links | `--accent` | Interactive, current page |
| Highlights | `--highlight` | Idea/example blocks |
| Warnings | `--warn-*` | Common mistakes |
| Success | `--ok` | Verified content |
| Pen (tips) | `--pen` | Teacher tips |

---

## Typography Rules

### Font Families
- **Reading text**: `--font-book` (Literata) for long-form content
- **UI text**: `--font-clear` (Atkinson Hyperlegible) for navigation
- **Code**: `--font-mono` (Atkinson Hyperlegible Mono)

### Heading Scale (Modular Scale 1.2, "Minor Third")

```
h1: clamp(1.7em, 1.3em + 1.6vw, 2.074em) [Fluid]
h2: var(--step-2) = 1.44em
h3: var(--step-1) = 1.2em
h4: 1em (base)
h5: var(--step--1) = 0.833em
```

### Text Size Rules

| Context | Size | Color | Weight |
|---------|------|-------|--------|
| Body paragraph | `var(--text-base)` | `--ink` | 400 |
| List items | `var(--text-base)` | `--ink` | 400 |
| List markers | `var(--text-base)` | `--ink-3` | 600 |
| Breadcrumbs | `0.9rem` | `--ink-3` | 400 |
| Course meta | `0.85rem` | `--ink-3` | 400 |
| Code inline | `0.86em` | `--ink` | 400 |
| Code block | `0.84em` | `--ink` | 400 |

### Never Do This

❌ **Wrong:**
```css
.syllabus h2 { font-size: 24px; }
```

✅ **Right:**
```css
.syllabus .prose h2 {
  font-size: var(--step-2);
  font-weight: 700;
}
```

---

## Left Sidebar Rules

### **Left Rail** (Navigation Pane)

| Property | Value | Rule |
|----------|-------|------|
| **Width** | `--rail-w` = 17.5rem | Don't hardcode width |
| **Background** | `--bg-rail` | Always use token |
| **Border** | 1px solid `--rule` | Right border only |
| **Font** | `--font-clear` | Use Hyperlegible (cleaner for nav) |
| **Max height** | `100vh - --header-h` | Sticky, scrollable |

### Left Rail Text Colors

```
Course Title:  --ink       (600 weight)
Course Meta:   --ink-3     (0.85rem)
Tree Summary:  --ink       (600 weight)
Tree Links:    --ink-2     (600 weight)
Current Page:  --ink       (700 weight, --accent-soft bg)
Unit Code:     --ink-3     (tabular-nums)
```

### Tree Navigation
- Each level uses **30px left indentation** (`1.45rem`)
- Current page gets `--accent-soft` background + `--ink` text
- Chevron expands/collapses with `transform`

### Common Mistake: Mixing Colors

❌ **Wrong:**
```css
.tree a { color: #4F4957; }
.tree a[aria-current="page"] { color: #2446B8; }
```

✅ **Right:**
```css
.tree a { color: var(--ink-2); }
.tree a[aria-current="page"] { 
  color: var(--ink); 
  background: var(--accent-soft); 
}
```

---

## Middle Pane Rules

### Main Content Area (`.sheet`)

| Property | Value |
|----------|-------|
| **Max width** | `--measure` = 66ch (characters) |
| **Font family** | `--reading-font` (serif by default) |
| **Font size** | `var(--text-base)` = fluid 17-19px |
| **Line height** | `var(--reading-leading)` = 1.7 |
| **Padding** | `var(--gutter)` = clamp(1.125rem, 4vw, 3rem) |
| **Background** | `--bg` |

### Heading Hierarchy

**h1** (Page Title)
```css
font-size: clamp(1.7em, 1.3em + 1.6vw, 2.074em)
font-weight: 700
color: var(--ink)
margin: 0.2em 0 0.45em
```

**h2** (Section)
```css
font-size: var(--step-2)    /* 1.44em */
font-weight: 700
color: var(--ink)
margin: 2.2em 0 0.6em       /* Space before for breathing room */
```

**h3** (Subsection)
```css
font-size: var(--step-1)    /* 1.2em */
font-weight: 600
color: var(--ink-2)         /* Slightly lighter */
margin: 1.8em 0 0.5em
```

### Paragraph & List Spacing

```css
p, ul, ol {
  margin: 0 0 var(--para-space)  /* 1em default */
  color: var(--ink)
}

li {
  color: var(--ink)
  margin-block: 0.35em
}

li::marker {
  color: var(--ink-3)
  font-weight: 600
}
```

### Content Blocks (`.block` elements)

```
.block--idea       Yellow highlight, curved border (brainstorm/concept)
.block--example    Grid background (worked example)
.block--working    Bordered box with numbered steps (solution steps)
.block--answer     Double border box (final answer)
.block--tip        Left red line (teacher tip)
.block--warning    Tan background + left line (common mistakes)
.block--formula    Bordered top/bottom (math/formula)
```

### Code Styling

**Inline code** (`.prose code`)
```css
font-family: var(--font-mono)
font-size: 0.86em
background: var(--bg-rail)
color: var(--ink)
padding: 0.1em 0.35em
border-radius: var(--radius-s)
```

**Code blocks** (`.prose pre`)
```css
font-family: var(--font-mono)
font-size: 0.84em
background: var(--bg-rail)
border: 1px solid var(--rule)
color: var(--ink)
overflow-x: auto
```

### Links

```css
color: var(--accent)
text-decoration: underline
text-decoration-thickness: 0.08em
text-underline-offset: 0.2em
```

---

## Right Sidebar Rules

### Table of Contents (`.toc`)

| Property | Value |
|----------|-------|
| **Width** | `--toc-w` = 15rem |
| **Background** | `--bg` (same as middle) |
| **Border** | 1px solid `--rule` (left border) |
| **Font size** | 0.9rem |
| **Max height** | `100vh - --header-h` |
| **Position** | Sticky, scrollable |

### TOC Heading

```css
font-size: 0.95rem
font-weight: 700
color: var(--ink)
margin: 0 0 0.75rem
```

### TOC Links

```css
color: var(--ink-3)
font-size: 0.9rem
text-decoration: none
padding: 0.3rem 0.75rem
border-inline-start: 2px solid transparent
```

**Current location:**
```css
color: var(--accent)
border-inline-start-color: var(--accent)
font-weight: 600
```

### Nested TOC Items

- **Level 2** (`lvl-3`): Standard padding
- **Level 3**: `1.5rem` padding + `0.95em` font size

---

## Type-Specific Rules

### Syllabus Pages

**Layout:** Three-column with units navigation, complete syllabus content, and past papers

**Left sidebar:** Units of the subject
- Clickable unit navigation
- Shows all units for the subject
- Expandable sections/topics within each unit
- Click to navigate to specific unit section

**Middle:** Complete syllabus content
- Full curriculum for the subject
- Learning outcomes and objectives
- Topic lists for each unit
- Time allocations and difficulty
- All curriculum details in one scrollable view

**Right sidebar:** Past papers
- Links to past papers for this subject
- Quick access to related exam materials
- Past paper search/filter (if available)
- Organized by year or difficulty

**Color focus:**
- Use `--ink-3` for meta information (unit codes, time)
- Use `--accent-soft` for current unit highlight in sidebar
- Past papers links = `--accent` color

---

### Notes Pages

**Layout:** Three-column with complete syllabus, note content, and past repeated questions

**Left sidebar:** Complete syllabus
- Full curriculum structure
- All units and topics for the subject
- Click to view/switch between different notes topics
- Shows current note's position in syllabus

**Middle:** Complete note content
- Full note content for the selected topic/chapter
- Main reading material
- Code examples and diagrams
- Study blocks (ideas, examples, tips)
- Scrollable, single-note view

**Right sidebar:** Past repeated questions
- Past exam questions from this chapter/topic
- Organized by year (which years it appeared)
- Shows question frequency/recurrence
- Links to solutions or past papers
- Helps identify important concepts (frequently tested topics)

**Block usage:**
```
--idea:    Conceptual highlight
--example: Worked example with grid
--tip:     Teacher tip with red pen
--warning: Common mistakes
```

**Color focus:**
- Current chapter in left syllabus = `--accent-soft` highlight
- Past question years = `--ink-3` (meta info)
- Frequently tested indicator = `--accent` or `--warn-*`

---

### Solutions Pages

**Left sidebar:** Question/solution navigator
- Chapter/problem list
- Question numbers
- Difficulty indicators

**Middle:** Step-by-step solutions
- Working (numbered steps)
- Final answer box (bordered)
- Teacher tips for approach

**Right:** Answer summary
- Quick reference
- Jump to specific questions
- Review progress

**Block usage (strict order):**
```
1. .block--working    (numbered steps)
2. .block--answer     (final answer, double border)
3. .block--tip        (approach tip, red line)
4. .block--warning    (if applicable, common mistakes)
```

---

## Common Mistakes to Avoid

### ❌ Color Mistakes

```css
/* WRONG: Hardcoded colors */
.notes h2 { color: #3F4957; }
.solution .prose a { color: #2446B8; }

/* RIGHT: Use tokens */
.notes .prose h2 { color: var(--ink); }
.solution .prose a { color: var(--accent); }
```

### ❌ Font Size Mistakes

```css
/* WRONG: Arbitrary sizes */
.syllabus p { font-size: 16px; }
.notes h2 { font-size: 22px; }

/* RIGHT: Use modular scale */
.syllabus .prose p { font-size: var(--text-base); }
.notes .prose h2 { font-size: var(--step-2); }
```

### ❌ Sidebar Width Mistakes

```css
/* WRONG: Hardcoded widths */
.rail { width: 280px; }
.toc { width: 240px; }

/* RIGHT: Use tokens */
.rail { width: var(--rail-w); }
.toc { width: var(--toc-w); }
```

### ❌ Block Usage Mistakes

**Solutions page** — Wrong block order:
```
❌ .block--answer (before steps!)
❌ .block--tip
❌ .block--working (wrong order!)
```

**Correct order:**
```
✅ .block--working (1. Show steps)
✅ .block--answer  (2. Final answer)
✅ .block--tip     (3. Alternative approach)
✅ .block--warning (4. If needed)
```

### ❌ Theme Mistakes

```css
/* WRONG: No theme awareness */
.notes h2 { color: #1A2230; }  /* Only looks good on "paper" theme */

## Three-Column Layout Rules

### Syllabus Page Three-Column Layout:
1. **Left Sidebar (`.rail`)**: Units of Subject
   - Clickable unit navigation
   - Expandable sections/topics
   - Course metadata (code, semester, credits, teaching hours)
   
2. **Middle (`.sheet` / `.prose`)**: Complete Syllabus Content
   - Full curriculum for the subject
   - Learning outcomes, objectives, topics
   - Laboratory guidelines & practical work
   - Reference textbooks & materials
   
3. **Right Sidebar (`.toc`)**: Past Papers
   - Links to past papers for this subject
   - Organized by year
   - Question count and marks weightage

### Notes Page Three-Column Layout:
1. **Left Sidebar (`.rail`)**: Complete Syllabus
   - Full curriculum structure
   - Unit accordions with topic lists
   - Click to switch between topics
   
2. **Middle (`.sheet` / `.prose`)**: Complete Note Content
   - Full note for selected topic/chapter
   - Single note view, fully scrollable
   - Theoretical foundations, key examination points, implementation, worked examples
   
3. **Right Sidebar (`.toc`)**: Past Repeated Questions
   - Past exam questions from this chapter/topic
   - Organized by year (shows which years)
   - Shows frequency/recurrence (e.g., Repeated 3x in 5 years, High Recurrence)
   - Helps identify frequently tested concepts
   - Direct links to verified solutions

---


## Implementation Checklist

When adding content to syllabus, notes, or solutions:

### Typography
- [ ] Use `--text-base` for body paragraphs
- [ ] Use `var(--step-2)` for h2, `var(--step-1)` for h3
- [ ] Verify line-height uses `--reading-leading`
- [ ] Confirm font family is `--reading-font` for prose

### Colors
- [ ] Body text = `--ink`
- [ ] Secondary text = `--ink-2` or `--ink-3`
- [ ] Links = `--accent`
- [ ] All colors use CSS variables, never hardcoded

### Spacing
- [ ] Padding uses `--gutter` or `--space-*` tokens
- [ ] Margins follow modular scale (1.2x)
- [ ] Max-width for prose = `--measure` (66ch default)

### Sidebars
- [ ] Left rail background = `--bg-rail`
- [ ] Left rail border = `1px solid --rule`
- [ ] Right TOC border = `1px solid --rule` (left side)
- [ ] Current navigation highlight = `--accent-soft` bg + `--ink` text

### Content Blocks
- [ ] Only use defined block types: idea, example, working, answer, tip, warning, formula
- [ ] Never style custom block types
- [ ] Use correct block in correct order

---

## Related Files

- **tokens.css** — CSS variables and themes (don't edit unless adding new tokens)
- **reader.css** — Base layout and component styles (foundation)
- **content-rules.css** — These specific rules for syllabus/notes/solutions
- **integration.css** — Framework-specific overrides

---

## Questions?

If a styling issue isn't covered:
1. Check if it's in **tokens.css** (color/spacing already defined?)
2. Check **reader.css** (base component styles)
3. Add to **content-rules.css** with a comment explaining the rule
4. Update this guide with the new pattern

