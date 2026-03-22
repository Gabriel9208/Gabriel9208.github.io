# Build a POC of Gabriel9203.github.io 

## Project Overview
A personal website for showcasing my projects and skills. Using github pages for deployment. 
From vibe coding to spec driven 

## Tech Stack
- React
- Vite
- Tailwind CSS
- TypeScript
- Aceternity UI

## Project Structure
```bash
MyPage/
├── .github/workflows/   <-- Deployment (GitHub Actions)
├── public/              <-- Static assets (3D models, images, etc.)
├── src/
│   ├── components/      <-- Components (Aceternity UI)
│   ├── data/            <-- Data (JSON files)
│   ├── lib/             <-- Utility functions (e.g., cn function)
│   ├── App.tsx          <-- Main entry
│   └── main.tsx
├── tailwind.config.js   <-- Tailwind configuration
├── package.json         <-- Dependencies (Vite, React, Framer Motion)
└── tsconfig.json        <-- TypeScript configuration
```

---

# Phase 1: Quickly Build a POC

## Goal
I want to build a portfolio. But I don't know the specific names of UI components yet. Please suggest a 5-step incremental development plan using React and Aceternity UI that highlights my skills in 3D Computer Vision and my identity as a House Dancer. What should step 1 be?

## My background
I am a cs student who jeeps exploring my intrest in each cs field. I want to show my trip in these fields. 

## My requirements
I want to keep the project scalable, which means if I can add content easily through editing json file. And also you need to remember this must be a static website.

## Pages structure
* A welcome page: For the top section, showcase who am I (a big welcome section on the top) and exhibit my skills (a bar of icon keep runing horizontally) in the middle. For the bottom, use a Parallax Hero Images to reveal a small portion of the exploration pages and recent work page content.
* A exploration page: Demonstrate my trip in the field of Computer Science. Use a timeline to represent each stage and using effect like Container Scroll Animation or Apple Cards Carousel or something else.
* A recent work page: Showcase what projects/assignments I am currently working on. 

# Phase 2: Refine the POC

## Refine the exploration page
* I want the effect that the timeline expands more detail when my cursor hover on it. The details including project, certificate and intern experience. All of these must be optional, which means some may not have one. 
* Add a status attribute to project, like ongoing and finished... 
* Add a link atteribute to Certificate, which link to the website that present it
