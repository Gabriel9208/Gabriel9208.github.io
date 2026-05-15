import { Github, Linkedin, Mail } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BentoGrid, BentoCell } from "../components/ui/bento-grid";
import skillsData from "../data/skills.json";
import projectsData from "../data/projects.json";
import journeyData from "../data/journey.json";
import certificatesData from "../data/certificates.json";
import experienceData from "../data/experience.json";

function resolveIcon(name: string, className: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={`w-4 h-4 ${className}`} /> : null;
}

export default function Welcome() {
  {/*const displayProject = projectsData.find((p: any) => p.highlight) ?? projectsData[0];*/}
  const allCerts = certificatesData;
  const allExperience = experienceData;
  {/*const recentProjects = projectsData.filter((p: any) => p.recent);*/)

  const Label = ({ text }: { text: string }) => (
    <p style={{ fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
      {text}
    </p>
  );

  {/*const Tag = ({ text }: { text: string }) => (
    <span style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#777', margin: 2, display: 'inline-block' }}>
      {text}
    </span>
  ); */}

  const Divider = () => <div style={{ width: '100%', height: 1, background: '#1e1e1e', margin: '12px 0' }} />;

  return (
    <div style={{ background: '#000', paddingTop: 96, paddingBottom: 64 }} className="px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <BentoGrid>

          {/* Hero */}
          <BentoCell className="md:col-[1/2] md:row-[1/3]">
            <h1 style={{ fontSize: 72, fontWeight: 700, color: '#fff', letterSpacing: -1.5 }}>Yen-Yen Yeh</h1>
            <p style={{ fontSize: 26, color: '#777' }}>NTUST CS Student</p>
            <Divider />
            <p style={{ fontSize: 17, color: '#777', lineHeight: 1.6 }}>
              3D Generation, Computer Vision, Generative Models
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'GitHub', icon: Github, href: 'https://github.com/Gabriel9208' },
                { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/%E8%A1%8D%E5%B7%96-%E8%91%89-162a762a3/' },
                { label: 'gabriel.yenyenyeh@gmail.com', icon: Mail, text: 'gabriel.yenyenyeh@gmail.com' },
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
              CS undergrad interested in controllable 3D generation. Came the long way around — through cybersecurity, cloud, and graphics.
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
                        {cert.title}
                      </a>
                    ) : (
                      <span style={{ color: '#fff' }} className="truncate block">{cert.title}</span>
                    )}
                  </div>
                ))}
                {allCerts.length > 3 && <p style={{ fontSize: 16, color: '#444', marginTop: 4 }}>+{allCerts.length - 3} more</p>}
              </div>
            )}
          </BentoCell>

          {/* Experience */}
          <BentoCell className="md:col-[3/4] md:row-[3/4]">
            <Label text="internship experience" />
            {allExperience.length === 0 ? (
              <p style={{ fontSize: 16, color: '#444' }}>— none yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {allExperience.slice(0, 2).map((exp: any, i: number) => (
                  <div key={i}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }} className="truncate">{exp.title}</p>
                    <p style={{ fontSize: 14, color: '#777', marginTop: 4 }} className="truncate">{exp.description}{exp.displayDate ? ` · ${exp.displayDate}` : ""}</p>
                  </div>
                ))}
                {allExperience.length > 2 && <p style={{ fontSize: 16, color: '#444', marginTop: 4 }}>+{allExperience.length - 2} more</p>}
              </div>
            )}
          </BentoCell>

          {/* Explorations Preview */}
          <BentoCell className="md:col-[1/2] md:row-[3/4]" href="/exploration">
            <Label text="explorations &rarr;" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {journeyData.entries.slice(0, 3).map((entry: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#0A84FF' : '#2a2a2a' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>{entry.time}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#ccc', paddingLeft: 16 }} className="truncate">{entry.heading}</p>
                </div>
              ))}
            </div>
          </BentoCell>
        </BentoGrid>
      </div>
    </div>
  );
}
