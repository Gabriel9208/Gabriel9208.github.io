import journeyData from "../data/journey.json";
import projectsData from "../data/projects.json";
import certificatesData from "../data/certificates.json";
import experienceData from "../data/experience.json";
import competitionsData from "../data/competitions.json";
import { Timeline } from "../components/ui/timeline";

export default function Exploration() {
  return (
    <div style={{ background: '#000', paddingTop: 96, paddingBottom: 64 }} className="px-4 md:px-8">
      <div style={{ maxWidth: 900, margin: '0 auto 48px' }}>
        <h1 style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginBottom: 12 }}>
          Explorations
        </h1>
        <p style={{ fontSize: 17, color: '#777', lineHeight: 1.7, maxWidth: 600 }}>
          {journeyData.meta.subtitle.split('\n\n')[0]}
        </p>
      </div>

      <div className="w-full">
        <Timeline
          data={journeyData.entries}
          projects={projectsData}
          certificates={certificatesData}
          experience={experienceData}
          competitions={competitionsData}
        />
      </div>
    </div>
  );
}
