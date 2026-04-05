# SDD: Cross-Domain Page (v2)

## 0. Background & Goal

The personal website (Gabriel9208.github.io) currently has three pages: Home, Explorations, and Currently Working On.
This task adds a fourth page — **Cross-Domain** — to showcase interdisciplinary collaboration projects that fall outside pure CS work.

Design principles: visually consistent with existing pages (pure black background, minimal dark theme); data-driven so future projects require only a JSON edit, no TSX changes.

**New in v2:** parallax background image per project, lightbox viewer for engineering diagrams.

---

## 1. Files to Change

| File                             | Action                            |
| -------------------------------- | --------------------------------- |
| `src/data/crossdomain.json`      | **Create**                        |
| `src/pages/CrossDomain.tsx`      | **Create**                        |
| `src/components/ui/Lightbox.tsx` | **Create**                        |
| `src/App.tsx`                    | **Modify** (add route + nav link) |

---

## 2. Data File `src/data/crossdomain.json`

Type definitions (for TypeScript):

```ts
type TeamMember = {
  name: string;
  dept: string;
  role: string;
};

type CrossDomainProject = {
  title: string;
  subtitle: string;
  period: string;
  status: string;
  description: string;
  myRole: string;
  contributions: string[];
  team: TeamMember[];
  tags: string[];
  link?: string; // empty string = no link
  backgroundImage?: string; // path relative to /public, e.g. "/images/muu-bg.jpg"
  diagrams?: {
    // engineering diagram images for lightbox
    src: string; // path relative to /public
    caption?: string; // optional label shown in lightbox
  }[];
};
```

Initial content (Muu) — **image paths are placeholders; replace with actual filenames once assets are placed in `/public/images/`**:

```json
[
  {
    "title": "Muu",
    "subtitle": "Interactive LED Installation",
    "period": "Spring 2025",
    "status": "Exhibited",
    "description": "A large-scale interactive installation — 5m long, 1m+ tall — built around the concept of an emotional creature. Muu offers a space for people to sit with emotions they can't share elsewhere, paired with a Line chatbot for anonymous expression and mood check-ins.",
    "myRole": "Responsible for all software and electrical work: Line bot development, LED lighting automation software, and full hardware system design.",
    "contributions": [
      "Line Bot — mood quiz flow, anonymous message relay",
      "LED auto-control software — pattern generation synced to sensor input",
      "Hardware system design — wiring schema, power distribution, controller config"
    ],
    "team": [
      {
        "name": "Gabriel (葉衍巖)",
        "dept": "Computer Science",
        "role": "Software & Hardware"
      },
      {
        "name": "小魚 (賴偲予)",
        "dept": "Commercial Design",
        "role": "Visual Design"
      },
      {
        "name": "蔡皓恩",
        "dept": "Commercial Design",
        "role": "Visual Design"
      },
      {
        "name": "鄭又銓",
        "dept": "Industrial Design",
        "role": "Structure & Assembly"
      },
      {
        "name": "尤拉 (黃郁鈞)",
        "dept": "Industrial Design",
        "role": "Structure & Soldering"
      },
      {
        "name": "橘子 (陳芷瑀)",
        "dept": "Industrial Design",
        "role": "Structure & Soldering"
      }
    ],
    "tags": [
      "Arduino",
      "WS2812",
      "Line Bot",
      "Hardware Integration",
      "Interactive Art"
    ],
    "link": "",
    "backgroundImage": "/images/muu-bg.jpg",
    "diagrams": [
      { "src": "/images/muu-diagram-1.jpg", "caption": "Wiring Overview" },
      {
        "src": "/images/muu-diagram-2.jpg",
        "caption": "LED Controller Config"
      },
      { "src": "/images/muu-diagram-3.jpg", "caption": "Power Distribution" }
    ]
  }
]
```

---

## 3. Component: `src/components/ui/Lightbox.tsx`

A self-contained lightbox with no external dependencies.

### Props

```ts
interface LightboxProps {
  images: { src: string; caption?: string }[];
  initialIndex: number;
  onClose: () => void;
}
```

### Behaviour

- Rendered via React portal (`document.body`) so it sits above everything.
- Full-screen overlay: `position: fixed, inset: 0, zIndex: 1000`.
- Background: `rgba(0,0,0,0.92)`. Clicking the backdrop calls `onClose`.
- Displays one image at a time, centered, `max-height: 85vh, max-width: 90vw, object-fit: contain`.
- **Previous / Next arrows** (`‹` / `›`) if `images.length > 1`. Arrows are positioned absolutely left/right center. Do not propagate click to backdrop.
- **Caption** shown below the image: `fontSize: 14, color: #777, marginTop: 12, textAlign: center`.
- **Image counter** shown top-right of the image: `"2 / 5"` style, `fontSize: 13, color: #555, fontFamily: monospace`.
- **Close button** (`✕`) top-right corner of the overlay: `fontSize: 20, color: #555, padding: 16`. Clicking calls `onClose`.
- `Escape` key also calls `onClose`.
- `←` / `→` keyboard arrows navigate prev/next.
- Prevent body scroll while open (`overflow: hidden` on `document.body`), restore on unmount.

---

## 4. Page Component `src/pages/CrossDomain.tsx`

### 4-1. Overall Structure

```
<div>                              ← page root; background: #000, paddingTop: 96
  {projects.map(ProjectSection)}   ← one full section per project
  {lightboxOpen && <Lightbox />}   ← single shared lightbox instance
</div>
```

State at page level:

```ts
const [lightboxProject, setLightboxProject] = useState<number | null>(null);
const [lightboxIndex, setLightboxIndex] = useState(0);
```

### 4-2. ProjectSection

Each project renders as a `<section>` that contains:

1. **Parallax hero block**
2. **Content card**

---

#### ① Parallax Hero Block

```
<div className="parallax-hero">
  <div className="parallax-bg" />     ← the moving background layer
  <div className="parallax-overlay" /> ← dark gradient overlay
  <div className="parallax-content">  ← title + subtitle, stays fixed relative to hero
    <h1> {title} </h1>
    <p>  {subtitle} </p>
  </div>
</div>
```

**Layout & sizing:**

- `.parallax-hero`: `position: relative, height: 420px, overflow: hidden`

**Background layer `.parallax-bg`:**

- `position: absolute, inset: 0`
- `backgroundImage: url(project.backgroundImage)`
- `backgroundSize: cover, backgroundPosition: center`
- `willChange: transform`
- Parallax is implemented with a `useEffect` that attaches a `scroll` listener on `window`. On each scroll event, compute:
  ```ts
  const scrolled = window.scrollY;
  const heroTop = heroRef.current.getBoundingClientRect().top + scrolled;
  const offset = (scrolled - heroTop) * 0.35; // 0.35 = parallax speed factor
  el.style.transform = `translateY(${offset}px)`;
  ```
- The background div is scaled slightly to avoid edge gaps: `transform: scale(1.15)` as default, then parallax offset is added on top via JS.
- If `backgroundImage` is absent or empty, fall back to a solid `background: #111` — no JS parallax needed.

**Overlay `.parallax-overlay`:**

- `position: absolute, inset: 0`
- `background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 100%)`

**Content `.parallax-content`:**

- `position: absolute, bottom: 40px, left: 48px`
- h1: `fontSize: 48, fontWeight: 700, color: #fff, letterSpacing: -1`
- p: `fontSize: 20, color: rgba(255,255,255,0.55), marginTop: 6`

---

#### ② Content Card

Sits directly below the parallax hero, no gap between them (the card visually "emerges" from under the hero).

Card container:

```css
background: #111;
border: 1px solid #1e1e1e;
border-radius: 0 0 24px 24px; /* only bottom corners rounded */
padding: 40px;
max-width: 900px;
margin: 0 auto 64px;
```

Card sections, top to bottom — **identical to v1 spec except for the addition of the Diagrams section**:

**① Top meta row** — period (monospace) + status badge, right-aligned. No title/subtitle here — they are already in the parallax hero.

**② Divider**

**③ Description** — `fontSize: 16, color: #777, lineHeight: 1.7`

**④ My Role section** — label + role text + contributions list (unchanged from v1)

**⑤ Diagrams section** ← NEW

Label: same uppercase label style as other sections, text: `"Engineering Diagrams"`.

Renders a horizontal thumbnail strip:

```css
display: flex;
flex-wrap: wrap;
gap: 12px;
margin-top: 8px;
```

Each thumbnail:

```css
width: 140px;
height: 96px;
object-fit: cover;
border-radius: 10px;
border: 1px solid #2a2a2a;
cursor: pointer;
transition:
  opacity 0.2s,
  border-color 0.2s;
```

Hover state: `opacity: 0.8, border-color: #555`

Clicking a thumbnail calls:

```ts
setLightboxProject(projectIndex);
setLightboxIndex(thumbnailIndex);
```

If `diagrams` is absent or empty, skip this section entirely (no label, no strip).

**⑥ Team section** — unchanged from v1 (grid of member cells, Gabriel cell highlighted blue)

**⑦ Tags row** — unchanged from v1 (tag pills + optional external link button)

---

### 4-3. PageHeader

Rendered once, above all project sections:

```
<h1> Cross-Domain </h1>
<p> Projects where I stepped outside CS — collaborating across design,
    art, and engineering to build things I couldn't have made alone. </p>
```

Inline styles — match `Exploration.tsx` header exactly:

- wrapper: `maxWidth: 900, margin: '0 auto 48px', padding: '0 24px'`
- h1: `fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5`
- p: `fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600`

---

## 5. App.tsx Changes

### 5-1. Add import

```tsx
import CrossDomain from "./pages/CrossDomain";
```

### 5-2. Navigation — add link

Insert after the "Currently Working On" `<Link>`:

```tsx
<Link to="/cross-domain" className={linkClass("/cross-domain")}>
  Cross-Domain
</Link>
```

### 5-3. Routes — add route

```tsx
<Route path="/cross-domain" element={<CrossDomain />} />
```

---

## 6. Asset Placement

Images must be placed in `/public/images/` so Vite serves them at the correct paths at build time. Filenames in `crossdomain.json` must match exactly (case-sensitive).

Example:

```
/public/images/muu-bg.jpg          ← parallax background
/public/images/muu-diagram-1.jpg   ← engineering diagram thumbnails
/public/images/muu-diagram-2.jpg
/public/images/muu-diagram-3.jpg
```

---

## 7. Acceptance Criteria

- [ ] "Cross-Domain" appears in the nav; active state matches other nav links
- [ ] `/cross-domain` route renders without breaking other routes
- [ ] Parallax background scrolls at ~0.35× page scroll speed within the hero block
- [ ] If `backgroundImage` is missing, hero falls back to `#111` with no JS errors
- [ ] Engineering diagram thumbnails render in a horizontal strip
- [ ] Clicking a thumbnail opens the Lightbox at the correct index
- [ ] Lightbox: clicking backdrop closes it; `✕` button closes it; `Escape` key closes it
- [ ] Lightbox: `←` / `→` keys and on-screen arrows navigate between images
- [ ] Lightbox: body scroll is locked while open, restored on close
- [ ] If `diagrams` is absent or empty, the Diagrams section is hidden entirely
- [ ] Adding a second project to `crossdomain.json` renders a second section — no TSX changes required
- [ ] Colors, fonts, and borders are visually consistent with the rest of the site

---

## 8. Out of Scope

- Mobile RWD fine-tuning (not handled in existing pages either)
- Image lazy loading / blur-up placeholder
- Adding a Cross-Domain entry card to the Home page BentoGrid (follow-up task)
