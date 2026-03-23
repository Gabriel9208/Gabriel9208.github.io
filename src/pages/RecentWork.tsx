import projectsData from "../data/projects.json";
import { HoverEffect } from "../components/ui/card-hover-effect";

export default function RecentWork() {
  const recentItems = projectsData.filter((p) => p.recent);
  const displayItems = recentItems.length > 0 ? recentItems : projectsData;

  return (
    <div style={{ background: '#000', paddingTop: 96, paddingBottom: 64 }} className="px-4 md:px-8 min-h-screen">
      <div style={{ maxWidth: 1200, margin: '0 auto 48px', textAlign: 'center' }} className="px-4">
        <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
          Currently Working On
        </h1>
        <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
          A collection of projects and assignments.
        </p>
      </div>

      <div style={{ maxWidth: 1100 }} className="mx-auto">
        <HoverEffect items={displayItems} />
      </div>
    </div>
  );
}
