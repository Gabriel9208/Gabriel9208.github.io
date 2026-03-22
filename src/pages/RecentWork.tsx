import projectsData from "../data/projects.json";
import { HoverEffect } from "../components/ui/card-hover-effect";

export default function RecentWork() {
  return (
    <div style={{ background: '#000', paddingTop: 96, paddingBottom: 64 }} className="px-4 md:px-8">
      <div style={{ maxWidth: 1200, margin: '0 auto 48px' }} className="px-4">
        <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
          Recent Works
        </h1>
        <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600 }}>
          A collection of projects and assignments.
        </p>
      </div>

      <div className="w-full">
        <HoverEffect items={projectsData.items} />
      </div>
    </div>
  );
}
