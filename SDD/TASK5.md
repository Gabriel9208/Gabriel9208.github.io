# Task SDD — Font Scale, 3D Fix & Page Style Unification
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-05  
**Last Updated:** 2026-03-22

---

## 1. Goal

1. Scale up all text sizes to accessibility-friendly levels. Grid expands proportionally; page is allowed to scroll vertically.
2. Fix the broken 3D tilt effect on bento cells.
3. Unify `Exploration` and `Recent Work` pages to match the Home page visual language (black background, same typography, same nav).

---

## 2. Scope

### Files to modify
| File | Change |
|---|---|
| `src/pages/Welcome.tsx` | Font sizes, grid padding, 3D fix |
| `src/components/ui/bento-grid.tsx` | 3D tilt logic fix |
| `src/pages/Exploration.tsx` | Full style unification |
| `src/pages/RecentWork.tsx` | Full style unification |
| `src/components/ui/timeline.tsx` | Typography + color tokens |
| `src/components/ui/card-hover-effect.tsx` | Typography + color tokens |

### Files NOT to touch
- All JSON files
- `src/App.tsx`
- `src/components/ui/bento-grid.tsx` structure (only fix the tilt bug)

---

## 3. Change Spec

### 3.1 Font Size Scale (applied globally across all pages)

The new scale targets comfortable reading at arm's length — no element should require squinting.

| Element | TASK-04 size | TASK-05 size |
|---|---|---|
| Hero name | `64px` | `72px` |
| Hero subtitle | `22px` | `26px` |
| Hero bio | `15px` | `17px` |
| Section headings (h1 on Exploration / RecentWork) | varies | `56px` |
| Cell / card title | `18px` | `20px` |
| Cell / card body | `14px` | `16px` |
| Label (uppercase) | `11px` | `13px` |
| Tag pills | `13px` | `14px` |
| Contact pills | `13px` | `14px` |
| Timeline year label | varies | `48px` |
| Timeline heading | varies | `32px` |
| Timeline body | varies | `17px` |
| Timeline tags | varies | `14px` |
| Nav links | `text-sm` | `text-base` (16px) |

**Grid padding:** increase cell padding from `28px` to `36px` to breathe with larger text.

**Page scroll:** remove any `overflow: hidden` or `h-screen` constraints on the Welcome page wrapper. The grid is allowed to be taller than the viewport — users scroll down naturally.

---

### 3.2 Fix 3D Tilt Effect (`src/components/ui/bento-grid.tsx`)

The tilt likely broke because `BentoCell` wraps content in a `<Link>` or `<a>` which intercepts mouse events, or because the `ref` is attached to an inner div while the outer element captures the events.

**Root cause pattern to check:**
```tsx
// ❌ Common bug: ref on inner div, event listeners on outer — rect mismatch
const inner = (
  <div ref={ref} onMouseMove={...} onMouseLeave={...}>  // ref here
    ...
  </div>
);
return <Link to={href}>{inner}</Link>;  // but Link wraps it — events fire on Link, not inner div
```

**Fix:** attach both the `ref` AND the event handlers to the same element. When `href` or `external` is present, move `onMouseMove` / `onMouseLeave` to the `<Link>` or `<a>` wrapper, and keep `ref` on it too:

```tsx
export function BentoCell({ className = "", children, href, external }: BentoCellProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    el.style.zIndex = '10';
    el.style.position = 'relative';
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.zIndex = '';
  };

  const sharedProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      background: '#111',
      padding: 36,
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'transform 0.15s ease',
      transformStyle: 'preserve-3d' as const,
      display: 'block',
    },
    className: `bento-cell ${className}`,
  };

  const content = (
    <>
      <div className="bento-cell-glow" />
      {children}
    </>
  );

  if (href) return <Link ref={ref as any} to={href} {...sharedProps}>{content}</Link>;
  if (external) return <a ref={ref as any} href={external} target="_blank" rel="noopener noreferrer" {...sharedProps}>{content}</a>;
  return <div ref={ref as any} {...sharedProps}>{content}</div>;
}
```

**Also verify** that `transform-style: preserve-3d` and `perspective` are not being cancelled by a parent element with `overflow: hidden`. The `BentoGrid` wrapper uses `overflow: hidden` for the border-radius — this flattens child 3D transforms in some browsers.

Fix: move `border-radius` to the grid wrapper's `outline` or use a pseudo-element instead of `overflow: hidden`, OR apply `border-radius` per-cell at the four corners only:

```tsx
// Apply corner radius only to the 4 corner cells via className
// top-left cell:    borderRadius: '24px 0 0 0'
// top-right cell:   borderRadius: '0 24px 0 0'
// bottom-left cell: borderRadius: '0 0 0 24px'
// bottom-right cell:borderRadius: '0 0 24px 0'
```

Remove `overflow: hidden` from the `BentoGrid` wrapper entirely. The grid border can be simulated with a `box-shadow: 0 0 0 1px #1e1e1e` on the wrapper instead.

---

### 3.3 Exploration Page Unification (`src/pages/Exploration.tsx`)

**Background & wrapper:**
```tsx
<div style={{ minHeight: '100vh', background: '#000', paddingTop: 96, paddingBottom: 64 }}
  className="px-4 md:px-8">
```

**Remove:** the existing `<header>` with the back link — navigation is handled by the navbar.

**Page heading block** (above the timeline):
```tsx
<div style={{ maxWidth: 900, margin: '0 auto 48px' }}>
  <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
    Explorations
  </h1>
  <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600 }}>
    {journeyData.meta.subtitle split by \n\n — first paragraph only}
  </p>
</div>
```

**Timeline component** — pass updated typography via props (see 3.5).

---

### 3.4 Recent Work Page Unification (`src/pages/RecentWork.tsx`)

**Background & wrapper:**
```tsx
<div style={{ minHeight: '100vh', background: '#000', paddingTop: 96, paddingBottom: 64 }}
  className="px-4 md:px-8">
```

**Remove:** the existing `<header>` with the back link.

**Page heading block:**
```tsx
<div style={{ maxWidth: 1200, margin: '0 auto 48px' }} className="px-4">
  <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
    Recent Work
  </h1>
  <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600 }}>
    A collection of projects, experiments, and technical deep dives.
  </p>
</div>
```

**`HoverEffect` card updates** — see 3.6.

---

### 3.5 Timeline Component Typography (`src/components/ui/timeline.tsx`)

Update color and size tokens to match the unified dark theme:

| Token | Before | After |
|---|---|---|
| Year label color | `text-muted-foreground` | `color: #555` (inactive), `color: #fff` (active/hovered) |
| Year label size | `text-5xl` | `fontSize: 48px` |
| Heading color | `text-foreground` | `color: #fff` |
| Heading size | `text-4xl` | `fontSize: 32px` |
| Heading hover color | `text-blue-400` | `color: #0A84FF` |
| Body text color | `text-neutral-400` | `color: #777` |
| Body text size | `text-xl` | `fontSize: 17px` |
| Tag background | `bg-muted/50` | `background: #1a1a1a` |
| Tag border | `border-border` | `border: 1px solid #2a2a2a` |
| Tag text | `text-foreground` | `color: #aaa` |
| Tag size | `text-sm` | `fontSize: 14px` |
| Timeline dot | existing | keep, ensure `background: #0A84FF` on active |
| Timeline line gradient | `from-blue-500 via-indigo-500` | keep |
| Detail panel background | `bg-card` / `bg-muted/30` | `background: #1a1a1a` |
| Detail panel border | `border-border` | `border: 1px solid #2a2a2a` |
| Section label (Projects/Certs/Internships) | `text-foreground` | `color: #fff` |
| Project status badge `ongoing` | existing | `background: rgba(10,132,255,0.15), color: #0A84FF` |
| Project status badge `finished` | existing | `background: rgba(48,209,88,0.15), color: #30D158` |

Replace all Tailwind color classes that reference CSS variables (`text-foreground`, `bg-background`, `border-border`, etc.) with the hardcoded dark theme values above, since the page no longer relies on the Tailwind theme.

---

### 3.6 Card Hover Effect Typography (`src/components/ui/card-hover-effect.tsx`)

| Token | Before | After |
|---|---|---|
| Card background | `bg-card` | `background: #111` |
| Card border | `border-border` | `border: 1px solid #1e1e1e` |
| Card hover border | `group-hover:border-foreground/50` | `border: 1px solid #333` on hover |
| Hover highlight | `bg-accent dark:bg-accent/80` | `background: #1a1a1a` |
| Card title color | `text-foreground` | `color: #fff` |
| Card title size | `text-2xl` | `fontSize: 20px` |
| Card description color | `text-muted-foreground` | `color: #777` |
| Card description size | `text-sm md:text-base` | `fontSize: 16px` |
| Tech tag background | `bg-border/50` | `background: #1a1a1a` |
| Tech tag border | `border-border/80` | `border: 1px solid #2a2a2a` |
| Tech tag text | `text-foreground` | `color: #aaa` |
| Tech tag size | `text-xs` | `fontSize: 13px` |

---

## 4. Acceptance Criteria

### Font & layout
- [x] Hero name renders at `72px`
- [x] All cell body text renders at minimum `16px`
- [x] Cell padding is `36px`
- [x] Welcome page scrolls vertically — no content is cut off
- [x] Nav links render at `16px`

### 3D tilt
- [x] Hovering any bento cell produces a visible tilt (rotateX / rotateY)
- [x] Radial glow follows cursor inside each cell
- [x] Tilt resets smoothly on mouse leave
- [x] Tilt works on both clickable cells (`<Link>`, `<a>`) and non-clickable cells (`<div>`)

### Page unification
- [x] `Exploration` page has `#000` background
- [x] `RecentWork` page has `#000` background
- [x] Both pages have `56px` bold white page headings
- [x] Both pages remove the back-link header
- [x] Timeline colors match the dark theme spec in 3.5
- [x] Project cards in RecentWork match the dark theme spec in 3.6
- [x] All pages use the same font family (`-apple-system, 'SF Pro Display', sans-serif`)

### Regression
- [x] Active route highlighting in navbar still works
- [x] Timeline expand-on-hover still works in Exploration
- [x] Project card hover effect still works in RecentWork
- [x] TypeScript compiles with no errors (`tsc -b`)

---

## 5. Out of Scope

- Do **not** change the bento grid layout or cell positions
- Do **not** add new sections to Exploration or RecentWork
- Do **not** change JSON schemas
- Do **not** add page transition animations