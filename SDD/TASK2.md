# Task SDD — Fix Navigation & Add Active Route Highlighting
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-02  
**Last Updated:** 2026-03-22

---

## 1. Goal

1. Replace all `<a href>` tags in `Navigation` with `<Link to>` from `react-router-dom` to prevent full-page reloads under `HashRouter`.
2. Rename nav link labels: "Trip" → "Explorations", "Work" → "Recent Works".
3. Add a "Home" link in the navbar that navigates to `/`.
4. Add active route highlighting to visually indicate the current page.

---

## 2. Scope

### Files to modify
| File | Change |
|---|---|
| `src/App.tsx` — `Navigation` component | All changes are contained here |

### Files NOT to touch
- All page files (`Welcome.tsx`, `Exploration.tsx`, `RecentWork.tsx`)
- All components under `src/components/`
- All JSON files

---

## 3. Inputs

- `useLocation` hook from `react-router-dom` — provides current path
- `Link` component from `react-router-dom` — replaces `<a href>`
- Nav links after this task: Home (`/`), Explorations (`/exploration`), Recent Works (`/recent-work`)

---

## 4. Behavior Spec

### 4.1 Replace `<a href>` with `<Link to>`

Every `<a href>` in `Navigation` must become `<Link to>`. This fixes the full-page reload bug.

```tsx
// ❌ Before
<a href="/">Gabriel's Page</a>
<a href="/exploration">Trip</a>
<a href="/recent-work">Work</a>

// ✅ After
<Link to="/">Gabriel's Page</Link>
<Link to="/">Home</Link>
<Link to="/exploration">Explorations</Link>
<Link to="/recent-work">Recent Works</Link>
```

---

### 4.2 Rename Nav Links

| Before | After |
|---|---|
| Trip | Explorations |
| Work | Recent Works |

---

### 4.3 Add "Home" Link

Add a "Home" link in the right-side link group, before "Explorations":

```tsx
<div className="flex gap-6 text-sm font-medium">
  <Link to="/">Home</Link>
  <Link to="/exploration">Explorations</Link>
  <Link to="/recent-work">Recent Works</Link>
</div>
```

The site title ("Gabriel's Page") on the left remains as-is and also navigates to `/`. Having both is intentional — the title is branding, "Home" is navigation.

---

### 4.4 Active Route Highlighting

Use `useLocation` to get the current path and apply different styles based on whether the link matches:

```tsx
function Navigation() {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-foreground font-semibold"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-4 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl tracking-tight">
          Gabriel's Page
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/exploration" className={linkClass("/exploration")}>Explorations</Link>
          <Link to="/recent-work" className={linkClass("/recent-work")}>Recent Works</Link>
        </div>
      </div>
    </nav>
  );
}
```

**Active style:** `text-foreground font-semibold`  
**Inactive style:** `text-muted-foreground hover:text-foreground transition-colors`

The site title on the left always uses its default `font-bold text-xl tracking-tight` style — no active state applied.

---

## 5. Acceptance Criteria

- [x] Clicking any nav link does not trigger a full-page reload
- [x] Nav links are labelled: "Home", "Explorations", "Recent Works"
- [x] Clicking "Home" navigates to `/`
- [x] The active page's nav link shows `text-foreground font-semibold`
- [x] Inactive nav links show `text-muted-foreground`
- [x] Navigating to `/` highlights "Home" only
- [x] Navigating to `/exploration` highlights "Explorations" only
- [x] Navigating to `/recent-work` highlights "Recent Works" only
- [x] TypeScript compiles with no errors (`tsc -b`)

---

## 6. Out of Scope

- Do **not** add a mobile hamburger menu
- Do **not** change the navbar's visual design beyond the active link style
- Do **not** add scroll-based transparency or shadow to the navbar
- Do **not** modify any page component or data file