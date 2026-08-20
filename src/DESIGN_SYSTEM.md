# MockExams Design System
**Professional Education Platform UI Framework**

---

## 🎨 Visual Identity

### Color Palette

#### Primary Colors
- **Blue-600** (`#2563eb`) - Primary action, navigation, focus states
- **Blue-700** (`#1d4ed8`) - Hover state, darker emphasis
- **Blue-50** (`#eff6ff`) - Background for selected/highlighted sections

#### Supporting Colors
- **Green-600** (`#16a34a`) - Success, positive actions, achievements
- **Red-600** (`#dc2626`) - Alerts, warnings, errors
- **Amber-600** (`#d97706`) - Warnings, pending states
- **Purple-600** (`#9333ea`) - Secondary accent, gamification

#### Neutral Colors
- **Gray-900** (`#111827`) - Primary text
- **Gray-700** (`#374151`) - Secondary text
- **Gray-600** (`#4b5563`) - Tertiary text (muted)
- **Gray-200** (`#e5e7eb`) - Borders, dividers
- **Gray-100** (`#f3f4f6`) - Hover states, backgrounds
- **Gray-50** (`#f9fafb`) - Subtle backgrounds
- **White** (`#ffffff`) - Main background

---

## 📐 Typography

### Font Family
- **Primary:** Geist Sans (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI")
- **Monospace:** Geist Mono (for code blocks, exam questions)

### Type Scale
| Size | Usage | Weight |
|------|-------|--------|
| 12px | Labels, badges, helper text | 500-600 |
| 14px | Body text (default) | 400 |
| 16px | Subheadings | 500 |
| 18px | Section titles | 600 |
| 20px | Large titles | 700 |
| 24px | Page titles | 700 |

### Line Height
- Body text: 1.6
- Headings: 1.2
- Labels: 1.4

---

## 🧱 Component Patterns

### Cards
```tsx
<div className="card">
  {/* Content */}
</div>
```
- White background
- 1px border (gray-200)
- 8px rounded corners
- Shadow on hover
- Transition: all 200ms ease

### Buttons
```tsx
// Primary
<button className="btn btn-primary">Action</button>

// Secondary
<button className="btn btn-secondary">Action</button>
```

**Sizes:**
- Small: 8px vertical, 12px horizontal
- Medium: 10px vertical, 16px horizontal (default)
- Large: 12px vertical, 20px horizontal

### Form Inputs
```tsx
<input className="input" placeholder="..." />
```
- 1px border (gray-200)
- Focus: blue border + blue highlight
- Rounded: 8px
- Padding: 8px 12px
- Font: 14px

### Badges
```tsx
<span className="badge badge-blue">Status</span>
```
- Colors: blue, green, red, amber, purple
- Size: 12px font with 4px vertical, 12px horizontal padding
- Rounded: 20px (full rounding)

### Progress Bars
```tsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{width: '75%'}}></div>
</div>
```
- Height: 8px
- Rounded: 20px
- Background: gray-100
- Fill: blue-600

---

## 📱 Layout Patterns

### Navbar
- Fixed top, white background
- Height: 64px (16 Tailwind units)
- Border-bottom: 1px gray-200
- Shadow: subtle (shadow-sm)
- Navigation items: left-aligned
- Actions (Login/Profile): right-aligned

### Dashboard Grid
- **Desktop:** 4 columns (400px each + gutters)
- **Tablet:** 2 columns
- **Mobile:** 1 column full width
- Gap: 16px (1rem)

### Card Layout
- **Desktop:** 3 columns max
- **Tablet:** 2 columns
- **Mobile:** 1 column
- Consistent spacing: 24px

---

## 🎯 Interactive States

### Hover
- Card: shadow-md, subtle y-transform (-2px)
- Button: background color change
- Link: text color to primary blue
- Opacity: smooth transition 200ms

### Focus
- Outline: 3px blue at 10% opacity
- Border: highlight color
- Keyboard accessible (`:focus-visible`)

### Active
- Button: darker shade
- Scale: 95% (active press)
- Instant feedback

### Disabled
- Opacity: 50%
- Cursor: not-allowed
- No hover effects

---

## 📊 Spacing Scale

```
4px   - Small gaps (icon spacing)
8px   - Component padding (buttons, inputs)
12px  - Medium spacing
16px  - Default spacing (margins, gaps)
24px  - Large spacing (section gaps)
32px  - Extra large spacing (major sections)
```

---

## ✅ Accessibility

### Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Blue-600 on white: 6.7:1 ✓
- Gray-600 on white: 5.3:1 ✓

### Focus States
- Visible focus rings on all interactive elements
- Minimum 3px width for focus indicator
- High contrast (blue on white)

### Keyboard Navigation
- Tab order follows visual flow
- Escape closes modals/dropdowns
- Enter triggers primary actions

### Screen Readers
- Semantic HTML (buttons, links, forms)
- ARIA labels where needed
- Icon + text combinations

---

## 🎨 Education-Specific Patterns

### Exam Card
- Title (bold, gray-900)
- Metadata (duration, questions count)
- CTA button (start exam)
- Status badge (completed, in-progress, locked)

### Topic Progress
- Topic title
- Progress bar (visual mastery)
- Percentage text
- Last reviewed date (muted text)

### Leaderboard Row
- Rank (bold)
- Student name
- Score/points (right-aligned)
- Badge if top 3
- Highlight current user row (light blue background)

### Question Card
- Question number/type badge
- Question text (readable font size)
- Options for MCQ (radio buttons)
- Text area for essay (monospace)
- Answer feedback (green/red, styled clearly)

---

## 📐 Breakpoints

```
Mobile:    < 640px   (sm)
Tablet:    640px+    (md: 768px)
Desktop:   1024px+   (lg)
Wide:      1280px+   (xl)
```

---

## 🚀 Component Library

### Ready Components
- ✅ Navbar
- ✅ StudentDashboard
- ✅ Cards (generic)
- ✅ Buttons (primary, secondary)
- ✅ Badges (status)
- ✅ Progress bars
- ✅ Forms

### Coming Soon
- Exam taker (question renderer)
- Leaderboard
- Report cards
- Analytics dashboard

---

## 💻 Developer Guidelines

### Naming Convention
- Classes: `class-name` (kebab-case)
- Components: `ComponentName` (PascalCase)
- Utilities: `text-primary`, `shadow-lg`, etc.

### Color Usage
```tsx
// Primary action
className="bg-blue-600 text-white hover:bg-blue-700"

// Secondary
className="bg-gray-100 text-gray-900 hover:bg-gray-200"

// Subtle
className="text-gray-600 hover:text-gray-900"
```

### Responsive Classes
```tsx
// Mobile first
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="hidden md:block"
```

---

## 📚 Inspiration

**Platforms Analyzed:**
- Vedantu (clean navigation, blue primary)
- Unacademy (progress tracking, minimal design)
- Coursera (professional, card-based)
- Khan Academy (focus on content, white bg)

**Key Principles:**
- Content-first (minimal distractions)
- Progressive disclosure (show info on demand)
- Clear hierarchy (size, color, weight)
- Consistent spacing (visual rhythm)
- Accessibility by default

---

## 🔄 Maintenance

- Review quarterly for updates
- Document breaking changes
- Test new components across browsers
- Gather student feedback on usability
- A/B test major changes

**Last Updated:** August 20, 2026  
**Maintained By:** MockExams Design Team
