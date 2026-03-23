# Task SDD — Unify Data Into Separate JSON Files
**Parent SDD:** Global SDD v2.0  
**Task ID:** TASK-06  
**Last Updated:** 2026-03-23

---

## 1. Goal

1. Consolidate all item data — currently split between `projects.json` and inline arrays in `journey.json` — into four dedicated JSON files with a **unified schema**: `projects.json`, `certificates.json`, `experience.json`, `competitions.json`.
2. Strip `journey.json` down to period metadata only (time, heading, content, tags). Remove all embedded `projects`, `certificates`, and `internships` arrays.
3. Have the Timeline component **auto-group** items under each period by matching `item.time === period.time`, then render them in typed sections (Projects, Certificates, Experience, Competitions) — identical to the current visual output.
4. Update all consuming pages (`Welcome.tsx`, `RecentWork.tsx`) to read from the new file structure.

---

## 2. Scope

### Files to create
| File | Content |
|---|---|
| `src/data/certificates.json` | All certificate entries |
| `src/data/experience.json` | All internship / full-time work entries |
| `src/data/competitions.json` | Empty array (placeholder for future) |

### Files to modify (data)
| File | Change |
|---|---|
| `src/data/projects.json` | Flatten to array, apply unified schema, remove `meta` wrapper |
| `src/data/journey.json` | Remove embedded `projects`, `certificates`, `internships` arrays from entries; keep `meta` and period metadata |

### Files to modify (code)
| File | Change |
|---|---|
| `src/components/ui/timeline.tsx` | Accept four item arrays as props; auto-group by `time`; render typed sections |
| `src/pages/Exploration.tsx` | Import all four data files; pass to `Timeline` |
| `src/pages/Welcome.tsx` | Import from new files for highlight project, certificates, experience |
| `src/pages/RecentWork.tsx` | Adapt to new `projects.json` shape (flat array, no `.items`) |

### Files NOT to touch
- `src/App.tsx`
- `src/components/ui/bento-grid.tsx`
- `src/components/ui/card-hover-effect.tsx`
- `src/data/skills.json`
- `src/index.css`

---

## 3. Unified Item Schema

All four JSON files (`projects.json`, `certificates.json`, `experience.json`, `competitions.json`) share the same base schema:

```ts
type DataItem = {
  title: string;            // REQUIRED — display name
  description?: string;     // default: ""
  link?: string;            // default: ""
  tags?: string[];          // default: []
  highlight?: boolean;      // default: false — surfaces item in Welcome highlight cell
  time?: string;            // default: "" — must match a journey.json period `time` value exactly for auto-grouping
  recent?: boolean;         // default: false — marks item for display on Recent Work page
  status?: string;          // default: "" — e.g. "ongoing", "done"
}
```

**Only `title` is required.** All other fields default to empty string, empty array, or `false`.

### Additional field notes

| Field | Purpose |
|---|---|
| `title` | Primary display name (e.g. "KODAMA", "AWS Certified Cloud Practitioner", "Cloud Security Intern") |
| `description` | Short summary rendered in detail cards |
| `link` | External URL — if non-empty, title becomes a clickable link (`target="_blank"`) |
| `tags` | Technology / topic tags rendered as pills |
| `highlight` | If `true`, used by `Welcome.tsx` to populate the Highlight Project cell |
| `time` | **Join key** — must exactly match a `journey.json` entry's `time` field (e.g. `"2024"`, `"First half of year 2025"`) |
| `recent` | If `true`, item appears on the Recent Work page |
| `status` | Rendered as a badge — `"ongoing"` = blue, `"done"` = green, any other string = neutral |

---

## 4. Data File Specs

### 4.1 `src/data/projects.json` (rewrite)

**Before:** Object with `meta` and `items` array.  
**After:** Flat array of `DataItem`.

```json
[
  {
    "title": "KODAMA",
    "description": "An egocentric scene understanding engine designed for uncontrolled environments.",
    "link": "https://github.com/Gabriel9208/KODAMA",
    "tags": ["PyTorch", "Python", "YOLO", "OpenCV"],
    "highlight": true,
    "time": "2026",
    "recent": true,
    "status": "ongoing"
  },
  {
    "title": "Binary Semantic Segmentation",
    "description": "Utilize U-Net and ResNet34_UNet as backbone and training on Oxford-IIIT Pet Dataset, in order to classify the pet in the image.",
    "link": "https://github.com/Gabriel9208/Binary-Semantic-Segmentation",
    "tags": ["PyTorch", "Python", "U-Net", "ResNet"],
    "time": "2026",
    "recent": true,
    "status": "ongoing"
  },
  {
    "title": "Gabriel9208.github.io",
    "description": "This very website! Narrowing down the vague idea of a portfolio through vibe coding to a concrete spec driven development process.",
    "link": "#",
    "tags": ["Spec Driven Development", "Vibe Coding"],
    "recent": true
  },
  {
    "title": "CG-Robot",
    "description": "A C++ OpenGL application for rendering 3D scenes with support for animation, visual effects, and a graphical user interface.",
    "link": "",
    "tags": ["C++", "OpenGL"],
    "time": "First half of year 2025",
    "status": "done"
  },
  {
    "title": "Texture-Mapping",
    "description": "A C++ application for viewing 3D meshes and performing texture mapping and painting.",
    "link": "",
    "tags": ["C++", "OpenGL", "ImGui"],
    "time": "First half of year 2025",
    "status": "done"
  },
  {
    "title": "AI Guardian",
    "description": "A chat-based application for creating and managing AWS WAF configurations.",
    "link": "",
    "tags": ["AWS", "WAF"],
    "time": "2024",
    "status": "done"
  }
]
```

---

### 4.2 `src/data/certificates.json` (new)

```json
[
  {
    "title": "AWS Certified Cloud Practitioner",
    "link": "https://www.credly.com/badges/16e72be6-ff31-48a1-9630-11b53a7f91f7/linked_in_profile",
    "time": "2024",
    "description": "June 27, 2024"
  },
  {
    "title": "Certified in Cybersecurity (CC)",
    "link": "https://www.credly.com/badges/4dfb3010-34d1-4629-bba8-fad54779d572/linked_in_profile",
    "time": "2022 - Early 2024",
    "description": "January 31, 2024"
  }
]
```

**Note:** The `description` field is repurposed here to hold the date string (e.g. "June 27, 2024"), which is rendered beside the certificate name — matching the current visual. If a dedicated `date` display is needed later, a new field can be added.

---

### 4.3 `src/data/experience.json` (new)

```json
[
  {
    "title": "Cloud Security Intern",
    "description": "eCloudValley",
    "time": "2024",
    "tags": ["AWS", "Cloud Security"],
    "status": "done"
  }
]
```

**Note:** For experience items, `title` = role, `description` = company name. The `time` field stores the period key for timeline grouping. A display date (e.g. "Jul 2024 - Oct 2024") can be stored in an additional way — see Section 4.5.

---

### 4.4 `src/data/competitions.json` (new)

```json
[]
```

Empty placeholder. Items can be added later with the same unified schema.

---

### 4.5 Experience display date

Experience cards currently show a formatted date range (e.g. "Jul 2024 - Oct 2024") which is distinct from the `time` join key (e.g. "2024"). To preserve this, add an optional `displayDate` field to the experience schema:

```ts
// Extension for experience items only
type ExperienceItem = DataItem & {
  displayDate?: string;  // e.g. "Jul 2024 - Oct 2024" — rendered in the detail card
}
```

Updated `experience.json`:
```json
[
  {
    "title": "Cloud Security Intern",
    "description": "eCloudValley",
    "time": "2024",
    "tags": ["AWS", "Cloud Security"],
    "status": "done",
    "displayDate": "Jul 2024 - Oct 2024"
  }
]
```

The Timeline component renders `displayDate` (if present) in the same position the old `date` field occupied.

---

### 4.6 `src/data/journey.json` (rewrite)

**Before:** Each entry contains embedded `projects`, `certificates`, `internships` arrays.  
**After:** Entries contain only period metadata. Items are resolved at render time.

```ts
type JourneyData = {
  meta: {
    title: string;
    subtitle: string;
  };
  entries: {
    time: string;      // join key — matches DataItem.time
    heading: string;
    content: string;
    tags: string[];
  }[];
}
```

```json
{
  "meta": {
    "title": "Interests Explorations",
    "subtitle": "Like many CS students, I spent time figuring out what I actually wanted to build. I moved through cybersecurity, blockchain, and graphics programming — not always with a clear direction, but always paying attention to what resonated and what didn't.\n\nOver time, a pattern emerged: the problems that kept pulling me back were visual, three-dimensional, and mathematically grounded. That realization led me to where I am now — building foundations in machine learning and computer vision, with a growing focus on 3D vision."
  },
  "entries": [
    {
      "time": "2026",
      "heading": "Deep Learning & Computer Vision (ML & CV)",
      "content": "Focusing on deep learning architectures and computer vision. Using PyTorch to implement and experiment with neural networks while working to close the gap between mathematical theory and practical application.",
      "tags": ["Deep Learning", "Computer Vision", "Multiview Geometry", "PyTorch"]
    },
    {
      "time": "First half of year 2025",
      "heading": "Computer Graphics",
      "content": "Explored the 3D graphics pipeline and real-time rendering through OpenGL and GLSL shader programming. Worked with GPU memory management, spatial transformations, and lighting models to build a more concrete low-level programming foundation.",
      "tags": ["3D Graphics", "OpenGL", "Shader Programming", "C++", "Design Patterns"]
    },
    {
      "time": "2024",
      "heading": "Cyber Security & Cloud",
      "content": "Explored cloud computing with a focus on security practices and infrastructure deployment on AWS.",
      "tags": ["AWS", "Terraform", "Docker", "Vue.js"]
    },
    {
      "time": "2022 - Early 2024",
      "heading": "Cyber Security",
      "content": "Focused on web security fundamentals and participated in CTF competitions to sharpen practical problem-solving skills.",
      "tags": ["Web Security", "Linux Command Line Operation", "Pico CTF", "Snyc CTF"]
    },
    {
      "time": "2021",
      "heading": "The Beginning: Logic & OOP Foundations",
      "content": "Started my software engineering journey with C++, learning the fundamentals of logic and object-oriented programming.",
      "tags": ["C++", "OOP"]
    }
  ]
}
```

**Breaking change:** The `entries[].projects`, `entries[].certificates`, and `entries[].internships` fields no longer exist. All consumers must switch to auto-grouping.

---

## 5. Behavior Spec

### 5.1 Timeline auto-grouping (`timeline.tsx`)

The Timeline component receives four item arrays as props and groups them by period:

```ts
interface TimelineProps {
  data: {
    time: string;
    heading: string;
    content: string;
    tags: string[];
  }[];
  projects: DataItem[];
  certificates: DataItem[];
  experience: DataItem[];
  competitions: DataItem[];
}
```

For each period, the component filters items:

```ts
const periodProjects = projects.filter((p) => p.time === period.time);
const periodCerts = certificates.filter((c) => c.time === period.time);
const periodExperience = experience.filter((e) => e.time === period.time);
const periodCompetitions = competitions.filter((c) => c.time === period.time);
```

Each non-empty group renders as a section in the expand panel, in this order:
1. **Experience** (blue dot) — title = role, description = company, `displayDate` in top-right
2. **Projects** (green dot) — title, description, status badge, tags
3. **Competitions** (purple dot) — title, description, status badge, tags
4. **Certificates** (orange dot) — title as link (if `link` present), description as date

The visual rendering of each section is **identical** to the current output. The only change is where the data comes from (props instead of embedded arrays).

---

### 5.2 `Exploration.tsx` — pass data to Timeline

```tsx
import journeyData from "../data/journey.json";
import projectsData from "../data/projects.json";
import certificatesData from "../data/certificates.json";
import experienceData from "../data/experience.json";
import competitionsData from "../data/competitions.json";

// ...

<Timeline
  data={journeyData.entries}
  projects={projectsData}
  certificates={certificatesData}
  experience={experienceData}
  competitions={competitionsData}
/>
```

---

### 5.3 `Welcome.tsx` — read from new files

Replace all data reads to use the new flat arrays:

```ts
import projectsData from "../data/projects.json";
import certificatesData from "../data/certificates.json";
import experienceData from "../data/experience.json";
import journeyData from "../data/journey.json";

// Highlight project
const displayProject = projectsData.find((p) => p.highlight) ?? projectsData[0];

// Certificates
const allCerts = certificatesData;

// Experience
const allExperience = experienceData;

// Recent Work preview
const recentProjects = projectsData.filter((p) => p.recent);

// Explorations preview (unchanged — still reads journey.json entries)
const explorationEntries = journeyData.entries;
```

**Changes from current code:**
- `projectsData.items` → `projectsData` (flat array, no `.items`)
- `journeyData.entries.flatMap(e => e.certificates ?? [])` → `certificatesData`
- `journeyData.entries.flatMap(e => e.internships ?? [])` → `experienceData`

---

### 5.4 `RecentWork.tsx` — adapt to flat array

```ts
import projectsData from "../data/projects.json";

// Show only items marked as recent, or fall back to all
const recentItems = projectsData.filter((p) => p.recent);
const displayItems = recentItems.length > 0 ? recentItems : projectsData;

// ...
<HoverEffect items={displayItems} />
```

**Note:** `HoverEffect` expects `{ title, description, link, tech? }[]`. The unified schema uses `tags` instead of `tech`. Either:
- (a) Update `HoverEffect` to accept `tags` instead of `tech`, OR
- (b) Map at the call site: `displayItems.map(p => ({ ...p, tech: p.tags }))`

**Recommendation:** Option (a) — rename `tech` to `tags` in `HoverEffect` props for consistency.

---

### 5.5 Competition section color

| Section | Dot color | Badge colors |
|---|---|---|
| Experience | blue (`#3B82F6`) | — |
| Projects | green (`#22C55E`) | ongoing: blue `#0A84FF`, done: green `#30D158` |
| Competitions | purple (`#A855F7`) | ongoing: blue `#0A84FF`, done: green `#30D158` |
| Certificates | orange (`#F97316`) | — |

---

## 6. Migration Checklist

To populate the new files, extract data from the current `journey.json` and `projects.json`:

| Current location | Destination |
|---|---|
| `journey.json` → `entries[].projects[]` | `projects.json` — set `time` to parent entry's `time` |
| `journey.json` → `entries[].certificates[]` | `certificates.json` — set `time` to parent entry's `time`; move `date` to `description` |
| `journey.json` → `entries[].internships[]` | `experience.json` — set `time` to parent entry's `time`; `role` → `title`, `company` → `description`, `date` → `displayDate` |
| `projects.json` → `meta.items[]` | `projects.json` flat array — `tech` → `tags`, add `time`/`recent`/`status` fields |

Items that exist in both `projects.json` and `journey.json` (e.g. KODAMA) should be **deduplicated** — the `projects.json` version is authoritative. The `journey.json` version is removed (it's now auto-grouped via `time`).

---

## 7. Acceptance Criteria

- [ ] `src/data/projects.json` is a flat array with unified schema (no `meta` wrapper)
- [ ] `src/data/certificates.json` exists with all certificate entries
- [ ] `src/data/experience.json` exists with all experience entries and `displayDate` field
- [ ] `src/data/competitions.json` exists (empty array)
- [ ] `src/data/journey.json` entries contain no `projects`, `certificates`, or `internships` arrays
- [ ] Adding a new project only requires editing `projects.json` — no other file changes needed (assuming `time` matches an existing period)
- [ ] Timeline auto-groups items under each period by matching `time` field
- [ ] Timeline renders sections in order: Experience, Projects, Competitions, Certificates
- [ ] Sections with zero items for a period are not rendered
- [ ] Competition section uses purple dot color (`#A855F7`)
- [ ] Experience cards show `displayDate` in the same position as the old `date` field
- [ ] Welcome page highlight project reads from `projects.json` where `highlight === true`
- [ ] Welcome page certificates and experience read from their respective JSON files
- [ ] Recent Work page shows projects where `recent === true`
- [ ] `HoverEffect` accepts `tags` (renamed from `tech`)
- [ ] All existing visual output is unchanged
- [ ] TypeScript compiles with no errors (`tsc -b`)

---

## 8. Out of Scope

- Do **not** change the bento grid layout or cell positions on the Welcome page
- Do **not** change the Timeline visual design (tilt, glow, expand animation)
- Do **not** change the navbar
- Do **not** add new pages or routes
- Do **not** implement filtering/sorting UI for Recent Work
- Do **not** modify `src/index.css` or `src/components/ui/bento-grid.tsx`