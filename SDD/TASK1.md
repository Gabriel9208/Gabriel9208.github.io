# Task SDD — Move Hardcoded Data to JSON
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-01  
**Last Updated:** 2026-03-22

---

## 1. Goal

Move all hardcoded content out of component and page files into `src/data/` JSON files. After this task, no display content should live inside `.tsx` files.

---

## 2. Scope

### Files to modify
| File | Change |
|---|---|
| `src/pages/Welcome.tsx` | Remove hardcoded `skills` and `parallaxItems`; import from JSON |
| `src/pages/Exploration.tsx` | Read `title` and `subtitle` from `journey.json` meta field |
| `src/components/ui/timeline.tsx` | Accept `title` and `subtitle` as props; remove hardcoded strings |
| `src/components/ui/hero-parallax.tsx` | Accept `title` and `subtitle` as props; pass into `Header` sub-component |

### Files to create
| File | Content |
|---|---|
| `src/data/skills.json` | Skills array |

### Files to modify (data)
| File | Change |
|---|---|
| `src/data/journey.json` | Add top-level `meta` field with `title` and `subtitle` |
| `src/data/projects.json` | Add top-level `meta` field with `title` and `subtitle` for HeroParallax |

### Files NOT to touch
- `src/App.tsx`
- Any component not listed above

---

## 3. Inputs

- Existing `src/data/projects.json` — `parallaxItems` derived from first 6 entries; `meta` added for HeroParallax copy
- Existing `src/data/journey.json` — `meta` added for Timeline copy
- Existing hardcoded arrays in `Welcome.tsx` — use as initial content for `skills.json`

---

## 4. Behavior Spec

### 4.1 `src/data/skills.json` (new file)

```ts
type SkillsData = {
  name: string;
  icon: string;   // Lucide component name, e.g. "Code", "Github"
  color: string;  // Tailwind text color class, e.g. "text-blue-400"
}[]
```

Initial content:
```json
[
  { "name": "Python",   "icon": "Code",     "color": "text-blue-400"   },
  { "name": "C++",      "icon": "Database", "color": "text-pink-400"   },
  { "name": "Terraform","icon": "Code",     "color": "text-green-400"  },
  { "name": "PyTorch",  "icon": "Orbit",    "color": "text-orange-400" },
  { "name": "Git",      "icon": "Github",   "color": "text-slate-400"  },
  { "name": "Docker",   "icon": "Laptop",   "color": "text-teal-400"   },
  { "name": "AWS",      "icon": "Braces",   "color": "text-yellow-400" },
  { "name": "Vue",      "icon": "Server",   "color": "text-green-400"  }
]
```

**Icon resolution in `Welcome.tsx`** — JSON cannot store JSX, so resolve icon name to Lucide component at runtime:

```ts
import * as LucideIcons from "lucide-react";

function resolveIcon(name: string, className: string) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={`w-8 h-8 ${className}`} /> : null;
}
```

---

### 4.2 `src/data/journey.json` — add `meta` field

Update the file structure from a bare array to an object with a `meta` field and a `entries` array:

```ts
type JourneyData = {
  meta: {
    title: string;
    subtitle: string; // "\n\n" used as paragraph separator
  };
  entries: TimelineEntry[];
}
```

Updated file shape:
```json
{
  "meta": {
    "title": "The CS Trip",
    "subtitle": "Like many CS students, I spent years figuring out what I actually wanted to build. I moved through cybersecurity, blockchain, and graphics programming — not always with a clear destination, but always paying attention to what resonated and what didn't.\n\nEventually, a pattern emerged: the problems that kept pulling me back were visual, three-dimensional, and mathematically rich. That realization brought me to where I am now — building my foundations in machine learning and computer vision, working toward a deeper focus on 3D vision."
  },
  "entries": [
    // ... existing TimelineEntry objects
  ]
}
```

**Breaking change:** `Exploration.tsx` currently passes `journeyData` directly as an array to `<Timeline data={journeyData} />`. This must be updated to `journeyData.entries`.

---

### 4.3 `src/data/projects.json` — add `meta` field

Update the file structure from a bare array to an object:

```ts
type ProjectsData = {
  meta: {
    title: string;    // for HeroParallax Header
    subtitle: string; // for HeroParallax Header
  };
  items: ProjectCard[];
}
```

Updated file shape:
```json
{
  "meta": {
    "title": "A Trip Through CS & Rhythm",
    "subtitle": "From the fundamentals of programming to complex 3D Computer Vision architectures. Scroll down to discover fragments of my exploration."
  },
  "items": [
    // ... existing ProjectCard objects
  ]
}
```

**Breaking change:** `RecentWork.tsx` currently passes `projectsData` directly to `<HoverEffect items={projectsData} />`. This must be updated to `projectsData.items`.

---

### 4.4 `parallaxItems` — derived from `projects.json`

In `Welcome.tsx`, derive `parallaxItems` from `projectsData.items`:

```ts
const parallaxItems = projectsData.items.slice(0, 6).map((p) => ({
  title: p.title,
  link: p.link,
  thumbnail: "",
}));
```

If fewer than 6 items exist, use however many are present — do not pad or throw.

---

### 4.5 `Timeline` — accept `title` and `subtitle` as props

```ts
interface TimelineProps {
  data: TimelineEntry[];
  title: string;
  subtitle: string;
}
```

Remove hardcoded `<h2>` and `<p>` blocks. Render `subtitle` with paragraph splits on `\n\n`:

```tsx
{subtitle.split("\n\n").map((para, i) => (
  <p key={i} className="text-muted-foreground text-lg md:text-xl max-w-2xl">
    {para}
  </p>
))}
```

`Exploration.tsx` passes the values:
```tsx
<Timeline
  data={journeyData.entries}
  title={journeyData.meta.title}
  subtitle={journeyData.meta.subtitle}
/>
```

---

### 4.6 `HeroParallax` — accept `title` and `subtitle` as props

```ts
interface HeroParallaxProps {
  products: { title: string; link: string; thumbnail: string }[];
  title: string;
  subtitle: string;
}
```

Pass into `Header`:
```tsx
export const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
    <h1 className="text-2xl md:text-7xl font-bold dark:text-white">{title}</h1>
    <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">{subtitle}</p>
  </div>
);
```

`Welcome.tsx` passes the values:
```tsx
<HeroParallax
  products={parallaxItems}
  title={projectsData.meta.title}
  subtitle={projectsData.meta.subtitle}
/>
```

---

## 5. Acceptance Criteria

- [x] `src/data/skills.json` exists and contains all 8 skill entries
- [x] `src/data/journey.json` has a top-level `meta` object and an `entries` array
- [x] `src/data/projects.json` has a top-level `meta` object and an `items` array
- [x] `Welcome.tsx` contains no hardcoded `skills` array or `parallaxItems` array
- [x] `parallaxItems` in `Welcome.tsx` is derived from `projectsData.items.slice(0, 6)`
- [x] `Timeline` accepts `title` and `subtitle` as required props — no hardcoded copy inside
- [x] `HeroParallax` accepts `title` and `subtitle` as required props — no hardcoded copy inside
- [x] `RecentWork.tsx` uses `projectsData.items` (not bare `projectsData`)
- [x] `Exploration.tsx` uses `journeyData.entries` (not bare `journeyData`)
- [x] TypeScript compiles with no errors (`tsc -b`)
- [x] All existing functionality is visually unchanged

---

## 6. Out of Scope

- Do **not** fix the `<a href>` → `<Link to>` navigation bug (TASK-02)
- Do **not** implement real thumbnails for `HeroParallax`
- Do **not** add active route highlighting to `Navigation`
- Do **not** change `TimelineEntry` schema inside `journey.json`