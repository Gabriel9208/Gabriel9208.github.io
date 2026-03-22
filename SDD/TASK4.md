# Task SDD — Navigation & Skills Refinements
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-04  
**Last Updated:** 2026-03-22

---

## 1. Goal

1. Replace `InfiniteMovingCards` in the Skills cell with static tag pills.
2. Increase font sizes across the bento grid.
3. Make the navigation bar background match the page background (`#000`).
4. Center the navigation links horizontally.
5. Remove "Gabriel's Page" title from the navbar.
6. Remove the stray box in the top-left corner of the page.

---

## 2. Scope

### Files to modify
| File | Change |
|---|---|
| `src/App.tsx` — `Navigation` | Background, layout, remove title |
| `src/pages/Welcome.tsx` | Skills cell, font sizes, remove stray box |

### Files NOT to touch
- All JSON files
- All components under `src/components/`
- `src/pages/Exploration.tsx`
- `src/pages/RecentWork.tsx`

---

## 3. Change Spec

### 3.1 Navigation Bar (`src/App.tsx`)

**Current:**
```tsx
<nav className="fixed top-0 inset-x-0 z-50 py-4 px-6 border-b border-border bg-background/80 backdrop-blur-md">
  <div className="max-w-5xl mx-auto flex justify-between items-center">
    <Link to="/" className="font-bold text-xl tracking-tight">Gabriel's Page</Link>
    <div className="flex gap-6 text-sm font-medium">
      <Link to="/">Home</Link>
      <Link to="/exploration">Explorations</Link>
      <Link to="/recent-work">Recent Works</Link>
    </div>
  </div>
</nav>
```

**After:**
```tsx
<nav className="fixed top-0 inset-x-0 z-50 py-4 px-6" style={{ background: '#000', borderBottom: '1px solid #1e1e1e' }}>
  <div className="flex justify-center items-center gap-8">
    <Link to="/" className={linkClass("/")}>Home</Link>
    <Link to="/exploration" className={linkClass("/exploration")}>Explorations</Link>
    <Link to="/recent-work" className={linkClass("/recent-work")}>Recent Works</Link>
  </div>
</nav>
```

Changes:
- Background: `bg-background/80 backdrop-blur-md` → `background: '#000'`, `border-bottom: 1px solid #1e1e1e`
- Layout: `justify-between` → `justify-center`, remove the left title entirely
- Remove `<Link to="/">Gabriel's Page</Link>` — no replacement
- Nav links centered with `gap-8`
- Active/inactive link styles unchanged from TASK-02

---

### 3.2 Remove Stray Box (`src/pages/Welcome.tsx`)

The top-left box visible in the screenshot is likely an empty `<div>` or a leftover element. Locate and delete it.

Search for any of:
- An empty `<div>` or `<BentoCell>` with no children at the start of `Welcome.tsx`
- A `<div className="...border...">` with no content
- Any element rendering before `<BentoGrid>`

Delete the element entirely. Do not replace it with anything.

---

### 3.3 Skills Cell — Replace `InfiniteMovingCards` with Static Pills

**Current:**
```tsx
<InfiniteMovingCards items={skills} direction="right" speed="slow" />
```

**After:**
```tsx
<div className="flex flex-wrap gap-2 mt-2">
  {skillsData.map((s) => (
    <span key={s.name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        padding: '5px 12px',
        borderRadius: 8,
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        color: '#aaa',
      }}>
      {resolveIcon(s.icon, s.color)}
      {s.name}
    </span>
  ))}
</div>
```

Remove the `InfiniteMovingCards` import from `Welcome.tsx` after this change.  
Do NOT delete `src/components/ui/infinite-moving-cards.tsx`.

---

### 3.4 Font Size Increases

Apply the following size increases across all bento cells in `Welcome.tsx`:

| Element | Before | After |
|---|---|---|
| Hero name | `48px` | `64px` |
| Hero subtitle (`CS Senior · ML & CV`) | `18px` | `22px` |
| Hero bio | `13px` | `15px` |
| Cell headings (project title, cert name, etc.) | `14–16px` | `18px` |
| Cell body copy | `12–13px` | `14px` |
| Label (uppercase) | `11px` | `11px` — unchanged |
| Tag pills | `11px` | `13px` |
| Contact pills | `11px` | `13px` |
| Timeline preview entries | `12px` | `14px` |

---

## 4. Acceptance Criteria

- [ ] Navbar background is `#000`, matching the page body
- [ ] Navbar bottom border is `1px solid #1e1e1e`
- [ ] Navigation links are horizontally centered — no title on the left
- [ ] "Gabriel's Page" text does not appear anywhere on the page
- [ ] Stray box in the top-left is gone
- [ ] Skills cell renders static pills, no scrolling animation
- [ ] `InfiniteMovingCards` is not imported in `Welcome.tsx`
- [ ] `infinite-moving-cards.tsx` still exists in the codebase
- [ ] Hero name renders at `64px`
- [ ] Cell headings render at `18px`
- [ ] TypeScript compiles with no errors (`tsc -b`)

---

## 5. Out of Scope

- Do **not** change the active/inactive link styles in the navbar
- Do **not** modify `Exploration.tsx` or `RecentWork.tsx`
- Do **not** change the bento grid layout or cell positions
- Do **not** remove the 3D tilt or glow effects