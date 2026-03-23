# Task SDD — Recent Work Page Layout Refinement
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-07  
**Depends on:** TASK-06 (unified data schema)  
**Last Updated:** 2026-03-23

---

## 1. Goal

1. Center the page heading and subtitle on the Recent Work page.
2. Reduce card width so cards feel proportional — closer to the reference layout where cards are compact, evenly spaced, and don't stretch edge-to-edge.
3. Rename the page heading to "Currently Working On" and update the navbar label accordingly.

---

## 2. Scope

### Files to modify
| File | Change |
|---|---|
| `src/pages/RecentWork.tsx` | Center heading, constrain card grid width, update heading text |
| `src/components/ui/card-hover-effect.tsx` | Adjust card sizing and spacing |
| `src/App.tsx` — `Navigation` | Rename "Recent Works" → "Currently Working On" in nav link |

### Files NOT to touch
- All JSON files
- `src/pages/Welcome.tsx`
- `src/pages/Exploration.tsx`
- `src/components/ui/bento-grid.tsx`
- `src/components/ui/timeline.tsx`
- `src/index.css`

---

## 3. Change Spec

### 3.1 Page Heading — Center Align (`RecentWork.tsx`)

**Before:**
```tsx
<div style={{ maxWidth: 1200, margin: '0 auto 48px' }} className="px-4">
  <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
    Recently Working On
  </h1>
  <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600 }}>
    A collection of projects and assignments.
  </p>
</div>
```

**After:**
```tsx
<div style={{ maxWidth: 1200, margin: '0 auto 48px', textAlign: 'center' }}>
  <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
    Currently Working On
  </h1>
  <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
    A collection of projects and assignments.
  </p>
</div>
```

Changes:
- Add `textAlign: 'center'` to the heading wrapper
- Add `margin: '0 auto'` to the subtitle `<p>` so it centers within the wrapper
- Heading text: "Currently Working On"

---

### 3.2 Card Grid — Constrain Width (`RecentWork.tsx`)

Wrap the `HoverEffect` component in a centered container with a narrower max-width:

**Before:**
```tsx
<div className="w-full">
  <HoverEffect items={displayItems} />
</div>
```

**After:**
```tsx
<div style={{ maxWidth: 1100 }} className="mx-auto">
  <HoverEffect items={displayItems} />
</div>
```

This prevents cards from stretching to full viewport width on large screens.

---

### 3.3 Card Sizing (`card-hover-effect.tsx`)

Reduce internal padding and constrain card height to create a more compact, uniform feel:

| Property | Before | After |
|---|---|---|
| Grid gap | `py-10` (implicit padding) | `gap-6 py-10` |
| Card outer padding | `p-2` | `p-2` — unchanged |
| Card inner padding | `p-6` → inner `p-4` | `p-5` → inner `p-4` — unchanged |
| Card min-height | none | `min-h-[220px]` |
| Card `display` | block | `flex flex-col` — so tags anchor to bottom |

Update the card to use flex column layout so content pushes tags to the bottom:

```tsx
<div
  className={cn(
    "rounded-2xl h-full w-full p-5 overflow-hidden group-hover:border-[#333] relative z-20 transition-colors flex flex-col",
    className
  )}
  style={{ background: '#111', border: '1px solid #1e1e1e' }}
>
  <div className="relative z-50 flex flex-col flex-grow">
    <div className="flex-grow">
      <CardTitle>{item.title}</CardTitle>
      <CardDescription>{item.description}</CardDescription>
    </div>
    <div className="flex flex-wrap gap-2 mt-6">
      {item.tags?.map((t) => (
        <span key={t} ...>{t}</span>
      ))}
    </div>
  </div>
</div>
```

This ensures all cards in a row have tags aligned at the same vertical position regardless of description length.

---

### 3.4 Navbar Label (`App.tsx`)

**Before:**
```tsx
<Link to="/recent-work" className={linkClass("/recent-work")}>Recent Works</Link>
```

**After:**
```tsx
<Link to="/recent-work" className={linkClass("/recent-work")}>Currently Working On</Link>
```

---

## 4. Acceptance Criteria

- [ ] Page heading "Currently Working On" is horizontally centered
- [ ] Subtitle text is horizontally centered beneath the heading
- [ ] Card grid does not stretch to full viewport width — max `1100px`, centered
- [ ] Cards use flex column layout with tags anchored at the bottom
- [ ] All cards in a row have consistent visual height
- [ ] Navbar link reads "Currently Working On" instead of "Recent Works"
- [ ] Navigating to `/recent-work` highlights "Currently Working On" in the navbar
- [ ] Card hover effect still works (animated background on hover)
- [ ] TypeScript compiles with no errors (`tsc -b`)

---

## 5. Out of Scope

- Do **not** change the card visual design (colors, borders, tag style)
- Do **not** add filtering, sorting, or category tabs
- Do **not** change the Welcome page or Exploration page
- Do **not** modify JSON data files
- Do **not** add new animations or transitions