import { Github, Linkedin, Mail } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BentoGrid, BentoCell } from "../components/ui/bento-grid";
import skillsData from "../data/skills.json";
import projectsData from "../data/projects.json";
import journeyData from "../data/journey.json";

function resolveIcon(name: string, className: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={`w-4 h-4 ${className}`} /> : null;
}

export default function Welcome() {
  const fromProjects = projectsData.items.find((p: any) => p.highlight === true);
  const fromJourney = journeyData.entries
    .flatMap((e: any) => e.projects ?? [])
    .find((p: any) => p.highlight === true);
  const raw = fromProjects ?? fromJourney ?? projectsData.items[0];

  const displayProject = {
    title: (raw as any).title ?? (raw as any).name,
    description: (raw as any).description ?? (raw as any).desc ?? "",
    link: raw.link ?? "",
    tech: (raw as any).tech ?? [],
    status: raw.status,
  };

  const allCerts = journeyData.entries.flatMap((e: any) => e.certificates ?? []);
  const allExperience = journeyData.entries.flatMap((e: any) => e.internships ?? []);

  const Label = ({ text }: { text: string }) => (
    <p style={{ fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
      {text}
    </p>
  );

  const Tag = ({ text }: { text: string }) => (
    <span style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#777', margin: 2, display: 'inline-block' }}>
      {text}
    </span>
  );

  const Divider = () => <div style={{ width: '100%', height: 1, background: '#1e1e1e', margin: '12px 0' }} />;

  return (
    <div style={{ background: '#000', paddingTop: 96, paddingBottom: 64 }} className="px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <BentoGrid>

          {/* Hero */}
          <BentoCell className="md:col-[1/2] md:row-[1/3]">
            <h1 style={{ fontSize: 72, fontWeight: 700, color: '#fff', letterSpacing: -1.5 }}>Gabriel</h1>
            <p style={{ fontSize: 26, color: '#777' }}>CS Student · ML & CV</p>
            <Divider />
            <p style={{ fontSize: 17, color: '#777', lineHeight: 1.6 }}>
              Building foundations in machine learning and computer vision.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'GitHub', icon: Github, href: 'https://github.com/Gabriel9208' },
                { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/%E8%A1%8D%E5%B7%96-%E8%91%89-162a762a3/' },
                { label: 'yen08149203@gmail.com', icon: Mail, text: 'yen08149203@gmail.com' },
              ].map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 14, padding: '6px 16px', borderRadius: 20, border: '1px solid #2a2a2a', color: '#777', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#777'; e.currentTarget.style.borderColor = '#2a2a2a'; }}>
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          </BentoCell>

          {/* About */}
          <BentoCell className="md:col-[2/4] md:row-[1/2]">
            <Label text="background" />
            <p style={{ fontSize: 16, color: '#777', lineHeight: 1.6 }}>
              Explored security, cloud, and graphics. Ended up where I belong — machine learning and computer vision.
            </p>
          </BentoCell>

          {/* Skills */}
          <BentoCell className="md:col-[2/4] md:row-[2/3]">
            <Label text="skills" />
            <div className="flex flex-wrap gap-2 mt-2">
              {skillsData.map((s) => (
                <span key={s.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    color: '#aaa',
                  }}>
                  {resolveIcon(s.icon, s.color)}
                  {s.name}
                </span>
              ))}
            </div>
          </BentoCell>

          {/* Highlight */}
          <BentoCell className="md:col-[1/2] md:row-[3/4]" external={displayProject.link || undefined}>
            <Label text="highlight project" />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{displayProject.title}</h3>
              {displayProject.status && (
                <span style={{
                  fontSize: 11, textTransform: 'uppercase', fontWeight: 700, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
                  color: displayProject.status?.toLowerCase() === 'ongoing' ? '#0A84FF' : '#34C759',
                  border: `1px solid ${displayProject.status?.toLowerCase() === 'ongoing' ? '#1a3a5c' : '#1a4a2a'}`,
                  background: displayProject.status?.toLowerCase() === 'ongoing' ? 'rgba(10,132,255,0.1)' : 'rgba(52,199,89,0.1)'
                }}>
                  {displayProject.status}
                </span>
              )}
            </div>
            <p style={{ fontSize: 16, color: '#777', marginBottom: 16 }}>{displayProject.description}</p>
            <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {displayProject.tech.map((t: string) => <Tag key={t} text={t} />)}
            </div>
          </BentoCell>

          {/* Certificates */}
          <BentoCell className="md:col-[2/3] md:row-[3/4]">
            <Label text="certificates" />
            {allCerts.length === 0 ? (
              <p style={{ fontSize: 16, color: '#444' }}>— none yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allCerts.slice(0, 3).map((cert: any, i: number) => (
                  <div key={i} style={{ fontSize: 16 }}>
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }} className="truncate block hover:text-blue-400 transition-colors">
                        {cert.name}
                      </a>
                    ) : (
                      <span style={{ color: '#fff' }} className="truncate block">{cert.name}</span>
                    )}
                  </div>
                ))}
                {allCerts.length > 3 && <p style={{ fontSize: 16, color: '#444', marginTop: 4 }}>+{allCerts.length - 3} more</p>}
              </div>
            )}
          </BentoCell>

          {/* Experience */}
          <BentoCell className="md:col-[3/4] md:row-[3/4]">
            <Label text="experience" />
            {allExperience.length === 0 ? (
              <p style={{ fontSize: 16, color: '#444' }}>— none yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {allExperience.slice(0, 2).map((exp: any, i: number) => (
                  <div key={i}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }} className="truncate">{exp.role}</p>
                    <p style={{ fontSize: 14, color: '#777', marginTop: 4 }} className="truncate">{exp.company}{exp.date ? ` · ${exp.date}` : ""}</p>
                  </div>
                ))}
                {allExperience.length > 2 && <p style={{ fontSize: 16, color: '#444', marginTop: 4 }}>+{allExperience.length - 2} more</p>}
              </div>
            )}
          </BentoCell>

          {/* Explorations Preview */}
          <BentoCell className="md:col-[1/2] md:row-[4/5]" href="/exploration">
            <Label text="explorations &rarr;" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {journeyData.entries.slice(0, 3).map((entry: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#0A84FF' : '#2a2a2a' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>{entry.title}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#ccc', paddingLeft: 16 }} className="truncate">{entry.heading}</p>
                </div>
              ))}
            </div>
          </BentoCell>

          {/* Recent Work Preview */}
          <BentoCell className="md:col-[2/4] md:row-[4/5]" href="/recent-work">
            <Label text="recent work &rarr;" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
              {projectsData.items.slice(0, 2).map((proj: any, i: number) => (
                <div key={i} className={`flex flex-col ${i === 0 ? "sm:border-r" : ""}`} style={{ borderColor: '#1e1e1e', paddingRight: i === 0 ? 24 : 0 }}>
                  <h4 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{proj.title}</h4>
                  <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {proj.tech?.slice(0, 2).map((t: string) => <Tag key={t} text={t} />)}
                  </div>
                </div>
              ))}
            </div>
            {projectsData.items.length > 2 && (
              <p style={{ fontSize: 16, color: '#444', marginTop: 16, paddingTop: 16, borderTop: '1px solid #1e1e1e' }}>
                +{projectsData.items.length - 2} more &rarr;
              </p>
            )}
          </BentoCell>

        </BentoGrid>
      </div>
    </div>
  );
}
