import { useState, useEffect, useRef } from "react";
import crossDomainData from "../data/crossdomain.json";
import { Lightbox } from "../components/ui/Lightbox";

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
  link?: string;
  backgroundImage?: string;
  diagrams?: {
    src: string;
    caption?: string;
  }[];
};

const sectionLabelStyle = {
  fontSize: 13,
  color: "#555",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: 8,
};

function ProjectSection({
  project,
  onThumbnailClick,
}: {
  project: CrossDomainProject;
  onThumbnailClick: (index: number) => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project.backgroundImage) return;

    const handleScroll = () => {
      if (!heroRef.current || !bgRef.current) return;
      const scrolled = window.scrollY;
      const heroTop = heroRef.current.getBoundingClientRect().top + scrolled;
      const offset = (scrolled - heroTop) * 0.35;
      bgRef.current.style.transform = `scale(1.15) translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [project.backgroundImage]);

  return (
    <section>
      {/* ① Parallax Hero Block */}
      <div
        ref={heroRef}
        style={{
          position: "relative",
          height: 420,
          overflow: "hidden",
          background: project.backgroundImage ? "transparent" : "#111",
        }}
      >
        {project.backgroundImage && (
          <div
            ref={bgRef}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${project.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.15)",
              willChange: "transform",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 48,
          }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", letterSpacing: -1, display: "none" }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 20, color: "rgba(255,255,255,0.55)", display: "none" }}>
            {project.subtitle}
          </p>
        </div>
      </div>

      {/* ② Content Card */}
      <div
        style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "0 0 24px 24px",
          padding: 40,
          maxWidth: 900,
          margin: "0 auto 64px",
          position: "relative", // Ensure card rendering contexts stack nicely
        }}
      >
        {/* Top meta row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{project.title}</h2>
            <p style={{ fontSize: 18, color: "#555", marginTop: 4 }}>{project.subtitle}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <span style={{ fontSize: 13, color: "#555", fontFamily: "monospace" }}>
              {project.period}
            </span>
            <span
              style={{
                background: "rgba(48,209,88,0.1)",
                color: "#30D158",
                border: "1px solid rgba(48,209,88,0.2)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1e1e1e", margin: "24px 0" }} />

        {/* Description */}
        <p style={{ fontSize: 16, color: "#777", lineHeight: 1.7 }}>{project.description}</p>

        {/* My Role section */}
        <div style={{ marginTop: 24 }}>
          <div style={sectionLabelStyle}>My Role</div>
          <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.6 }}>{project.myRole}</p>
          <div style={{ marginTop: 8 }}>
            {project.contributions.map((contribution, idx) => (
              <div key={idx} style={{ fontSize: 15, color: "#666", lineHeight: 2 }}>
                — {contribution}
              </div>
            ))}
          </div>
        </div>

        {/* Diagrams section (NEW) */}
        {project.diagrams && project.diagrams.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={sectionLabelStyle}>Engineering Diagrams</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              {project.diagrams.map((diag, idx) => (
                <img
                  key={idx}
                  src={diag.src}
                  alt={diag.caption || "Diagram thumbnail"}
                  onClick={() => onThumbnailClick(idx)}
                  style={{
                    width: 140,
                    height: 96,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #2a2a2a",
                    cursor: "pointer",
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                    e.currentTarget.style.borderColor = "#555";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.borderColor = "#2a2a2a";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Team section */}
        <div style={{ marginTop: 24 }}>
          <div style={sectionLabelStyle}>Team</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {project.team.map((member, idx) => {
              const isGabriel = member.name.includes("Gabriel");
              return (
                <div
                  key={idx}
                  style={{
                    background: isGabriel ? "rgba(10, 132, 255, 0.06)" : "#1a1a1a",
                    border: `1px solid ${isGabriel ? "#1a3a5c" : "#2a2a2a"}`,
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{member.dept}</div>
                  <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>{member.role}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 24,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tags.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#aaa",
                  fontSize: 13,
                  padding: "4px 12px",
                  borderRadius: 8,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* If link non-empty */}
          {project.link && project.link.trim() !== "" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#aaa",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#aaa";
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CrossDomain() {
  const projects: CrossDomainProject[] = crossDomainData;
  const [lightboxProject, setLightboxProject] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const activeProject = lightboxProject !== null ? projects[lightboxProject] : null;

  return (
    <div
      style={{
        background: "#000",
        paddingTop: 96,
        paddingBottom: 64,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto 48px", padding: "0 24px" }}>
        <h1 style={{ fontSize: 56, fontWeight: 700, color: "#fff", letterSpacing: -1.5 }}>
          Cross-Domain
        </h1>
        <p style={{ fontSize: 17, color: "#777", lineHeight: 1.7, maxWidth: 600, marginTop: 12 }}>
          Projects collaborating across design, art,
          and engineering to build things I couldn't have made alone.
        </p>
      </div>

      <div>
        {projects.map((project, idx) => (
          <ProjectSection
            key={idx}
            project={project}
            onThumbnailClick={(thumbIdx) => {
              setLightboxProject(idx);
              setLightboxIndex(thumbIdx);
            }}
          />
        ))}
      </div>

      {activeProject && activeProject.diagrams && (
        <Lightbox
          images={activeProject.diagrams}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxProject(null)}
        />
      )}
    </div>
  );
}
