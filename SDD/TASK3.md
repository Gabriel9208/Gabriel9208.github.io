# Task SDD — Redesign Welcome Page as Bento Grid (Apple Style)
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-03  
**Last Updated:** 2026-03-22

---

## 1. Goal

Replace the entire Welcome page with a full-bleed Apple-style bento grid. All existing sections (AuroraBackground hero, InfiniteMovingCards strip, HeroParallax) are removed. Each cell has a 3D tilt effect on hover with a radial light highlight following the cursor.

---

## 2. Scope

### Files to modify
| File | Change |
|---|---|
| `src/pages/Welcome.tsx` | Full rewrite |
| `src/data/projects.json` | Add optional `highlight: true` field |
| `src/data/journey.json` | Add optional `highlight: true` field to `Project` entries |

### Files to create
| File | Content |
|---|---|
| `src/components/ui/bento-grid.tsx` | `BentoGrid`, `BentoCell`, and 3D tilt hook |

### Files to stop importing (do NOT delete)
- `src/components/ui/aurora-background.tsx`
- `src/components/ui/hero-parallax.tsx`

### Files reused as-is
- `src/components/ui/infinite-moving-cards.tsx`
- `src/data/skills.json`
- `src/data/journey.json`
- `src/data/projects.json`

---

## 3. Visual Design Spec

### Color palette
| Token | Value | Usage |
|---|---|---|
| Page background | `#000000` | `<body>` / page wrapper |
| Cell background | `#111111` | All cells |
| Grid gap fill | `#000000` | 2px gap between cells |
| Grid border | `#1e1e1e` | Outer wrapper border |
| Divider | `#1e1e1e` | Horizontal rules inside cells |
| Label | `#555555` | Small uppercase labels |
| Primary text | `#ffffff` | Headings, titles |
| Secondary text | `#777777` | Body copy, subtitles |
| Muted text | `#444444` | Placeholder, "+N more" |
| Tag background | `#1a1a1a` | Skill/tech tags |
| Tag border | `#2a2a2a` | Skill/tech tags |
| Accent blue | `#0A84FF` | Active dot, ongoing badge |

### Typography (Apple SF Pro style)
```css
font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
```

| Element | Size | Weight | Color |
|---|---|---|---|
| Hero name | `text-5xl` / 48px | 700 | `#fff` |
| Hero subtitle | `text-lg` / 18px | 400 | `#777` |
| Cell heading | `text-base` / 16px | 600 | `#fff` |
| Cell body | `text-sm` / 13–14px | 400 | `#777` |
| Label | `text-xs` / 11px | 400 | `#555`, uppercase, `tracking-widest` |

### Grid structure
- **Outer wrapper**: `border-radius: 24px`, `overflow: hidden`, `border: 1px solid #1e1e1e`
- **Gap**: `2px`, filled with page background (`#000`)
- **Full bleed**: wrapper spans full viewport width minus minimal padding (`px-4` max)
- **Max width**: `max-w-7xl` (widest Tailwind preset) centered with `mx-auto`

---

## 4. Grid Layout

### Desktop (≥ 768px) — 3-column, 4-row

```
Row 1:  [ hero (rows 1–2)  ] [ about (cols 2–3)          ]
Row 2:  [ hero (rows 1–2)  ] [ skills (cols 2–3)          ]
Row 3:  [ highlight        ] [ certificates ] [ experience ]
Row 4:  [ explorations     ] [ recent work (cols 2–3)     ]
```

```css
grid-template-columns: 2fr 1fr 1fr;
gap: 2px;
background: #000;
```

| Cell | `grid-column` | `grid-row` |
|---|---|---|
| Hero | 1 / 2 | 1 / 3 |
| About | 2 / 4 | 1 / 2 |
| Skills | 2 / 4 | 2 / 3 |
| Highlight project | 1 / 2 | 3 / 4 |
| Certificates | 2 / 3 | 3 / 4 |
| Experience | 3 / 4 | 3 / 4 |
| Explorations preview | 1 / 2 | 4 / 5 |
| Recent Work preview | 2 / 4 | 4 / 5 |

### Mobile (< 768px) — single column stacking order
1. Hero
2. About
3. Skills
4. Highlight project
5. Explorations preview
6. Recent Work preview
7. Certificates
8. Experience

---

## 5. `BentoGrid` and `BentoCell` Component

**File:** `src/components/ui/bento-grid.tsx`

### `BentoGrid`
```tsx
export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid #1e1e1e' }}>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr]"
        style={{ gap: 2, background: '#000' }}>
        {children}
      </div>
    </div>
  );
}
```

### `BentoCell`

Each cell:
1. Tracks `mousemove` to compute tilt angles and light position
2. Applies `rotateX` / `rotateY` via inline style
3. Shows a radial gradient highlight following the cursor via a CSS custom property

```tsx
import { useRef } from "react";
import { Link } from "react-router-dom";

interface BentoCellProps {
  className?: string;
  children: React.ReactNode;
  href?: string;      // internal route
  external?: string;  // external URL
}

export function BentoCell({ className = "", children, href, external }: BentoCellProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    el.style.zIndex = '10';
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.zIndex = '';
  };

  const baseStyle: React.CSSProperties = {
    background: '#111',
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.15s ease',
    transformStyle: 'preserve-3d',
  };

  // Radial highlight overlay — defined in global CSS (see below)
  const inner = (
    <div ref={ref} style={baseStyle} className={`bento-cell ${className}`}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="bento-cell-glow" />
      {children}
    </div>
  );

  if (href) return <Link to={href} className="block">{inner}</Link>;
  if (external) return <a href={external} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>;
  return inner;
}
```

### Required global CSS (add to `src/index.css`)
```css
.bento-cell-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.05) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 0;
}
.bento-cell:hover .bento-cell-glow {
  opacity: 1;
}
.bento-cell > *:not(.bento-cell-glow) {
  position: relative;
  z-index: 1;
}
```

---

## 6. Data Schema Changes

### 6.1 `src/data/projects.json`
```ts
type ProjectCard = {
  title: string;
  description: string;
  link: string;
  tech?: string[];
  highlight?: boolean; // new
}
```

### 6.2 `src/data/journey.json`
```ts
type Project = {
  name: string;
  desc?: string;
  status?: string;
  link?: string;
  highlight?: boolean; // new
}
```

### 6.3 Highlight resolution logic
```ts
const fromProjects = projectsData.items.find((p) => p.highlight === true);
const fromJourney = journeyData.entries
  .flatMap((e) => e.projects ?? [])
  .find((p) => p.highlight === true);
const raw = fromProjects ?? fromJourney ?? projectsData.items[0];

const displayProject = {
  title: (raw as any).title ?? (raw as any).name,
  description: (raw as any).description ?? (raw as any).desc ?? "",
  link: raw.link ?? "",
  tech: (raw as any).tech ?? [],
  status: raw.status,
};
```

---

## 7. Cell Content Spec

### Shared patterns

**Label:**
```tsx
<p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
  {label}
</p>
```

**Tag pill:**
```tsx
<span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#777', margin: 2 }}>
  {text}
</span>
```

**Divider:**
```tsx
<div style={{ width: '100%', height: 1, background: '#1e1e1e', margin: '10px 0' }} />
```

---

### 7.1 Hero Cell
**Grid:** `md:[grid-column:1/2] md:[grid-row:1/3]` — not clickable

1. Name — `fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: -1`
2. Subtitle — `fontSize: 18, color: '#777'`  
   Copy: `CS Senior · ML & CV`
3. Divider
4. Bio — `fontSize: 13, color: '#777', lineHeight: 1.6`  
   Copy: `"Building foundations in machine learning and computer vision, working toward a deeper focus on 3D vision."`
5. Contact pills:

```tsx
{[
  { label: 'GitHub', icon: Github, href: 'https://github.com/Gabriel9208' },
  { label: 'LinkedIn', icon: Linkedin, href: 'YOUR_LINKEDIN_URL' },
  { label: 'Email', icon: Mail, href: 'mailto:YOUR_EMAIL' },
].map(({ label, icon: Icon, href }) => (
  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
    style={{ fontSize: 11, padding: '5px 14px', borderRadius: 20, border: '1px solid #2a2a2a', color: '#777', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
    <Icon size={12} />
    {label}
  </a>
))}
```

---

### 7.2 About Cell
**Grid:** `md:[grid-column:2/4] md:[grid-row:1/2]` — not clickable

Copy: `"Moved through cybersecurity, blockchain, and graphics programming — landed on problems that are visual, three-dimensional, and mathematically rich."`

---

### 7.3 Skills Cell
**Grid:** `md:[grid-column:2/4] md:[grid-row:2/3]` — not clickable

`InfiniteMovingCards`, `direction="right"`, `speed="slow"`, data from `skills.json`. Icons via `resolveIcon(s.icon, s.color)`.

---

### 7.4 Highlight Project Cell
**Grid:** `md:[grid-column:1/2] md:[grid-row:3/4]`  
**Clickable via `external` if `displayProject.link` is non-empty.**

- Title `fontSize: 16, fontWeight: 600, color: '#fff'`
- Description `fontSize: 13, color: '#777'`
- Tech tags
- Status badge: `ongoing` = `color: #0A84FF, borderColor: #1a3a5c`; `finished` = green equivalent

---

### 7.5 Certificates Cell
**Grid:** `md:[grid-column:2/3] md:[grid-row:3/4]` — not clickable as whole

```ts
const allCerts = journeyData.entries.flatMap((e) => e.certificates ?? []);
```

- Max 3; if `cert.link` render as `<a>`, otherwise `<span>`
- If more: muted `+N more`
- If empty: muted `— none yet`

---

### 7.6 Experience Cell
**Grid:** `md:[grid-column:3/4] md:[grid-row:3/4]` — not clickable

```ts
const allExperience = journeyData.entries.flatMap((e) => e.internships ?? []);
```

- Max 2; role (bold) + company + date (muted)
- If more: muted `+N more`
- If empty: muted `— none yet`

---

### 7.7 Explorations Preview Cell
**Grid:** `md:[grid-column:1/2] md:[grid-row:4/5]`  
**Entire cell links to `/exploration`.**

`journeyData.entries.slice(0, 3)` — dot + title + heading per row.  
Index 0 dot: `#0A84FF`. Index 1–2 dot: `#2a2a2a`.

---

### 7.8 Recent Work Preview Cell
**Grid:** `md:[grid-column:2/4] md:[grid-row:4/5]`  
**Entire cell links to `/recent-work`.**

`projectsData.items.slice(0, 2)` — 2 projects side by side on desktop, separated by a `1px #1e1e1e` vertical divider.

---

## 8. Page Wrapper

```tsx
export default function Welcome() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', paddingTop: 96, paddingBottom: 64 }}
      className="px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <BentoGrid>
          {/* 8 cells */}
        </BentoGrid>
      </div>
    </div>
  );
}
```

`pt-24` (96px) clears the fixed navbar.

---

## 9. Acceptance Criteria

- [x] Page background is `#000`, cells are `#111`, gap is `2px`
- [x] Outer grid wrapper has `border-radius: 24px` and `overflow: hidden` — all four corners are rounded
- [x] Hovering any cell tilts it with `rotateX` / `rotateY` max ±6deg
- [x] Radial glow follows cursor inside each cell on hover
- [x] Hero name renders at `48px` bold
- [x] 8 cells render in correct grid positions on desktop
- [x] Single-column stacking on mobile in correct order
- [x] `InfiniteMovingCards` renders inside Skills cell
- [x] Contact pills in Hero cell open in new tab
- [x] Explorations and Recent Work cells navigate without full-page reload
- [x] `aurora-background.tsx` and `hero-parallax.tsx` not imported but still exist
- [x] TypeScript compiles with no errors (`tsc -b`)

---

## 10. Out of Scope

- Do **not** delete any existing component files
- Do **not** modify `Exploration.tsx` or `RecentWork.tsx`
- Do **not** add animations beyond tilt, glow, and `InfiniteMovingCards`
- Do **not** add a mobile hamburger menu
- Do **not** add a separate Contact cell