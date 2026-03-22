# Software Design Document (SDD)
## Gabriel9208.github.io — Personal Portfolio Website
**Version:** 2.0  
**Last Updated:** 2026-03-22  
**Purpose:** Spec-driven development reference for AI coding agents  
**Derived from:** Actual codebase snapshot

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture & Tech Stack](#2-system-architecture--tech-stack)
3. [Page Structure & Routing](#3-page-structure--routing)
4. [Component Design](#4-component-design)
5. [Data Schema (JSON)](#5-data-schema-json)
6. [Error Handling](#6-error-handling)
7. [Known Issues & TODOs](#7-known-issues--todos)

---

## 1. Project Overview

A static personal portfolio website deployed via GitHub Pages. Content is fully data-driven through JSON files — adding or updating content must never require modifying component logic.

### Design Philosophy
- Dark theme, minimal and clean
- Motion-forward (Framer Motion) — purposeful, not decorative
- Every text claim must be honest — avoid overclaiming skills or experience
- Blockchain / Web3 content is intentionally excluded
- House Dance is intentionally excluded from the hero section

### Hard Constraints
- **Static only** — no backend, no SSR, no runtime API calls
- All data sourced from local `src/data/*.json` files via static import (never `fetch()`)
- Use `HashRouter` (not `BrowserRouter`) to prevent 404s on GitHub Pages

---

## 2. System Architecture & Tech Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | React + TypeScript | 19 / ~5.9 | StrictMode enabled |
| Build Tool | Vite | 8 | `base: './'` for GitHub Pages |
| Styling | Tailwind CSS | v4 | Dark theme default; CSS variables for theming |
| Animation | Framer Motion | 12 | Page transitions, scroll effects, expand/collapse |
| UI Components | Aceternity UI | — | AuroraBackground, InfiniteMovingCards, HeroParallax, HoverEffect, Timeline |
| Routing | React Router DOM | v7 | `HashRouter` required |
| Utility | clsx + tailwind-merge | — | Merged via `cn()` in `src/lib/utils.ts` |
| Deployment | GitHub Actions | — | Workflow in `.github/workflows/` |

### Directory Structure
```
src/
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/
│   └── ui/
│       ├── aurora-background.tsx
│       ├── card-hover-effect.tsx
│       ├── hero-parallax.tsx
│       ├── infinite-moving-cards.tsx
│       └── timeline.tsx
├── data/
│   ├── journey.json          # Exploration page — timeline entries
│   └── projects.json         # Recent Work page — project cards
├── lib/
│   └── utils.ts              # cn() helper
├── pages/
│   ├── Welcome.tsx
│   ├── Exploration.tsx
│   └── RecentWork.tsx
├── App.tsx                   # Router + Navigation
├── index.css
└── main.tsx                  # Entry point
```

---

## 3. Page Structure & Routing

### Router Setup (`App.tsx`)
```tsx
<HashRouter>
  <Routes>
    <Route path="/"            element={<Welcome />} />
    <Route path="/exploration" element={<Exploration />} />
    <Route path="/recent-work" element={<RecentWork />} />
  </Routes>
</HashRouter>
```

### Navigation Bar (`Navigation` in `App.tsx`)
- Fixed top, `bg-background/80 backdrop-blur-md`
- Left: site title ("Gabriel's Page") linking to `#/`
- Right: "Trip" → `/exploration`, "Work" → `/recent-work`
- Active route should be visually highlighted (**TODO — not yet implemented**)
- Currently uses `<a href>` — **must be refactored to `<Link to>`** for hash routing correctness

---

### 3.1 Welcome Page (`/`)

**Sections (top to bottom):**

| # | Component | Description |
|---|---|---|
| 1 | `AuroraBackground` + hero copy | Full-viewport animated background with name, title, and CTA buttons |
| 2 | `InfiniteMovingCards` | Two-row horizontally scrolling skills strip |
| 3 | `HeroParallax` | 3D parallax card grid teasing project/exploration content |

**Hero Copy:**
```
Hi, I'm Gabriel
CS Student, focusing on Machine Learning & Computer Vision recently
```

**CTA Buttons:**
- Primary: "My Trip in Computer Science" → `/exploration`
- Secondary: "Recent Work →" → `/recent-work`

**Skills array** (currently hardcoded in `Welcome.tsx` — **TODO: move to `src/data/skills.json`**):
```ts
[Python, C++, Terraform, PyTorch, Git, Docker, AWS, Vue]
```

**HeroParallax items** (currently hardcoded in `Welcome.tsx` — **TODO: derive from `projects.json` or move to JSON**):
- 6 items with `title`, `link`, `thumbnail` (thumbnails currently empty strings)

---

### 3.2 Exploration Page (`/exploration`)

- Back link to `/`
- Renders `<Timeline data={journeyData} />` with data from `src/data/journey.json`
- Page-level heading and intro paragraph are hardcoded inside `timeline.tsx` (**TODO: make configurable**)

**Hardcoded intro copy (inside `Timeline` component):**
```
The CS Trip

Like many CS students, I spent years figuring out what I actually wanted to build.
I moved through cybersecurity, blockchain, and graphics programming — not always with
a clear destination, but always paying attention to what resonated and what didn't.

Eventually, a pattern emerged: the problems that kept pulling me back were visual,
three-dimensional, and mathematically rich. That realization brought me to where I am
now — building my foundations in machine learning and computer vision, working toward
a deeper focus on 3D vision.
```

---

### 3.3 Recent Work Page (`/recent-work`)

- Back link to `/`
- Page heading: "Recent Work"
- Subheading: "A showcase of my latest projects, experiments, and technical deep dives across Web Dev, Computer Vision, and beyond."
- Renders `<HoverEffect items={projectsData} />` with data from `src/data/projects.json`

---

## 4. Component Design

### 4.1 `AuroraBackground` (`aurora-background.tsx`)

**Props:**
```ts
interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean; // default: true
}
```

**Behavior:**
- Full-viewport (`h-[100vh]`) animated aurora gradient background
- Dark mode: `dark:bg-zinc-900`; Light mode: `bg-zinc-50`
- Radial mask focuses the aurora to the top-right corner when `showRadialGradient` is true
- Children are centered in the viewport

---

### 4.2 `InfiniteMovingCards` (`infinite-moving-cards.tsx`)

**Props:**
```ts
interface Props {
  items: { icon: React.ReactNode; name: string }[];
  direction?: "left" | "right";       // default: "left"
  speed?: "fast" | "normal" | "slow"; // default: "fast"
  pauseOnHover?: boolean;             // default: true
  className?: string;
}
```

**Behavior:**
- On mount, clones all list items and appends duplicates for a seamless CSS infinite scroll loop
- Sets `--animation-direction` and `--animation-duration` CSS variables on the container
- Speed mapping: `fast` = 20s, `normal` = 40s, `slow` = 80s
- Pauses on hover when `pauseOnHover` is true
- Edge fade via `mask-image: linear-gradient(to_right, transparent, white 20%, white 80%, transparent)`

**Usage in `Welcome.tsx`:**
```tsx
<InfiniteMovingCards items={skills} direction="right" speed="slow" />
<InfiniteMovingCards items={skills.slice().reverse()} direction="left" speed="normal" className="mt-8" />
```

---

### 4.3 `HeroParallax` (`hero-parallax.tsx`)

**Props:**
```ts
interface Props {
  products: {
    title: string;
    link: string;
    thumbnail: string; // empty string currently — placeholder rendered instead
  }[];
}
```

**Behavior:**
- `useScroll` + `useSpring` + `useTransform` drive all motion values based on scroll progress
- Row 1 (items 0–2): scrolls right (`translateX`)
- Row 2 (items 3–5): scrolls left (`translateXReverse`)
- Entire grid: animates in with `rotateX`, `rotateZ`, `translateY`, `opacity` on scroll
- Each card is `h-96 w-[30rem]`, renders a placeholder div with `✦` icon until real thumbnails are provided
- Hover: card lifts via `whileHover: { y: -20 }`
- Contains a hardcoded `Header` sub-component — **TODO: accept `title` and `subtitle` as props**

---

### 4.4 `Timeline` + `TimelineItem` (`timeline.tsx`)

**`Timeline` Props:**
```ts
interface Props {
  data: TimelineEntry[];
}
```

**`TimelineEntry` type:**
```ts
interface TimelineEntry {
  title: string;       // year label, e.g. "2026"
  heading: string;     // section title, e.g. "Deep Learning & CV"
  content: React.ReactNode;
  tags?: string[];
  projects?: {
    name: string;
    link?: string;
    desc?: string;
    status?: string;   // "ongoing" | "finished" | other
  }[];
  certificates?: {
    name: string;
    date?: string;
    link?: string;
  }[];
  internships?: {
    company: string;
    role: string;
    date?: string;
  }[];
}
```

**`Timeline` Behavior:**
- Measures total content height via `useEffect` + `getBoundingClientRect`
- Animated vertical line grows downward on scroll: `useScroll` + `useTransform` on `scrollYProgress`
- Scroll offset: `["start 10%", "end 50%"]`

**`TimelineItem` Behavior:**
- Default state: sticky year label (left), heading, content paragraph, tag pills
- Year dot scales on hover (`group-hover:scale-125`)
- Heading turns blue on hover (`group-hover:text-blue-400`)
- Hover triggers `AnimatePresence` expand panel: `height: 0 → auto`, `opacity: 0 → 1`, 0.3s `anticipate`
- Detail sections rendered only when array is non-empty:
  - **Internships** — blue dot header, card with role + company + date
  - **Projects** — green dot header, 2-col grid, status badge (`ongoing` = blue, `finished` = green)
  - **Certificates** — orange dot header, pill badges with optional link and date

---

### 4.5 `HoverEffect` (`card-hover-effect.tsx`)

**Props:**
```ts
interface Props {
  items: {
    title: string;
    description: string;
    link: string;
    tech?: string[];
  }[];
  className?: string;
}
```

**Behavior:**
- 3-col responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Tracks `hoveredIndex` via `useState`
- Hovered card gets a `motion.span` background (`bg-accent`) with `layoutId="hoverBackground"` for smooth cross-card animation
- Each card: title, description, tech tag pills
- Entire card is a clickable `<a>` linking to `item.link`

---

## 5. Data Schema (JSON)

### 5.1 `src/data/journey.json`
Consumed by `Exploration.tsx` → `Timeline`.

```ts
type JourneyData = TimelineEntry[]

type TimelineEntry = {
  title: string;
  heading: string;
  content: string;
  tags?: string[];
  projects?: {
    name: string;
    desc?: string;
    status?: "ongoing" | "finished" | string;
    link?: string;
  }[];
  certificates?: {
    name: string;
    date?: string;
    link?: string;
  }[];
  internships?: {
    company: string;
    role: string;
    date?: string;
  }[];
}
```

**Example:**
```json
[
  {
    "title": "2026",
    "heading": "Deep Learning & Computer Vision (ML & CV)",
    "content": "Specializing in Deep Learning architectures and 3D Vision. Utilizing PyTorch to implement and optimize neural networks, focusing on 3D reconstruction and generative models.",
    "tags": ["Deep Learning", "Computer Vision", "PyTorch", "3D Reconstruction"],
    "projects": [
      {
        "name": "Scene Reconstruction",
        "desc": "Implemented a volume rendering pipeline to understand NeRF from scratch.",
        "status": "ongoing",
        "link": "https://github.com/Gabriel9208/example"
      }
    ],
    "certificates": [],
    "internships": []
  }
]
```

---

### 5.2 `src/data/projects.json`
Consumed by `RecentWork.tsx` → `HoverEffect`.

```ts
type ProjectsData = {
  title: string;
  description: string;
  link: string;
  tech?: string[];
}[]
```

**Example:**
```json
[
  {
    "title": "Portfolio Website",
    "description": "This site — built with React, Vite, Tailwind CSS, and Framer Motion.",
    "link": "https://github.com/Gabriel9208/Gabriel9208.github.io",
    "tech": ["React", "TypeScript", "Tailwind CSS", "Framer Motion"]
  }
]
```

---

## 6. Error Handling

### 6.1 Static Import Only
All JSON is imported at build time. A malformed file causes a build failure — this is intentional.

```ts
// ✅ Correct
import journeyData from "../data/journey.json";

// ❌ Never do this
const res = await fetch('/data/journey.json');
```

### 6.2 Optional Fields
All detail arrays in `TimelineEntry` are optional. Always guard before rendering:

```tsx
// ✅ Correct
{item.projects && item.projects.length > 0 && <ProjectsSection projects={item.projects} />}

// ❌ Wrong
{item.projects.map(...)}
```

### 6.3 External Links
If `link` is present → `<a href={link} target="_blank" rel="noopener noreferrer">`. If absent → non-interactive `<span>` or `<strong>`.

### 6.4 Empty Thumbnails in HeroParallax
Thumbnails are currently empty strings. Component renders a `✦` placeholder. When real thumbnails are added, handle load failures with a fallback placeholder — never render a broken `<img>`.

### 6.5 Hash Routing
`HashRouter` is required for GitHub Pages. All `<a href="/path">` in `Navigation` must become `<Link to="/path">` to avoid full-page reloads.

---

## 7. Known Issues & TODOs

| # | Location | Issue | Priority |
|---|---|---|---|
| 1 | `App.tsx` — `Navigation` | Uses `<a href>` instead of `<Link to>` — causes full reload on nav | High |
| 2 | `Welcome.tsx` | `skills` array is hardcoded — should move to `src/data/skills.json` | Medium |
| 3 | `Welcome.tsx` | `parallaxItems` hardcoded, thumbnails are empty strings | Medium |
| 4 | `timeline.tsx` — `Timeline` | Page heading and intro copy hardcoded in component — should accept props | Low |
| 5 | `hero-parallax.tsx` — `Header` | Title and subtitle hardcoded — should accept props | Low |
| 6 | `App.tsx` — `Navigation` | No active route highlighting | Low |
| 7 | `App.tsx` | No 404 / fallback route defined | Low |
