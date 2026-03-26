import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type DataItem = {
  title: string;
  description?: string;
  link?: string;
  tags?: string[];
  highlight?: boolean;
  time?: string;
  recent?: boolean;
  status?: string;
};

export type ExperienceItem = DataItem & {
  displayDate?: string;
};

interface TimelineEntry {
  time: string;
  heading: string;
  content: string;
  tags: string[];
}

interface TimelineProps {
  data: TimelineEntry[];
  projects: DataItem[];
  certificates: DataItem[];
  experience: ExperienceItem[];
  competitions: DataItem[];
}

const TimelineItem = ({
  item,
  periodProjects,
  periodCerts,
  periodExperience,
  periodCompetitions,
}: {
  item: TimelineEntry;
  periodProjects: DataItem[];
  periodCerts: DataItem[];
  periodExperience: ExperienceItem[];
  periodCompetitions: DataItem[];
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const hasExpandableContent =
    periodExperience.length > 0 ||
    periodProjects.length > 0 ||
    periodCompetitions.length > 0 ||
    periodCerts.length > 0;

  return (
    <div
      className="flex justify-start pt-10 md:pt-40 md:gap-10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center transition-colors"
             style={{ background: '#111', border: isHovered ? '1px solid #444' : '1px solid #2a2a2a' }}>
          <div className="h-4 w-4 rounded-full p-2 transition-transform group-hover:scale-125"
               style={{ background: isHovered ? '#0A84FF' : '#555', border: '1px solid #333' }} />
        </div>
        <h3 className="hidden md:block pl-20 font-bold transition-colors duration-300"
            style={{ fontSize: 48, color: isHovered ? '#fff' : '#555' }}>
          {item.time}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <h3 className="md:hidden block mb-4 text-left font-bold transition-colors duration-300"
            style={{ fontSize: 48, color: isHovered ? '#fff' : '#555' }}>
          {item.time}
        </h3>
        <h4 className="font-bold mb-6 transition-colors duration-300"
            style={{ fontSize: 32, color: isHovered ? '#0A84FF' : '#fff' }}>
          {item.heading}
        </h4>
        <div className="mb-8 font-light leading-relaxed"
             style={{ fontSize: 17, color: '#777', whiteSpace: 'pre-line' }}>
          {item.content}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#aaa', fontSize: 14 }}
              className="px-4 py-2 rounded-full font-semibold tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {isHovered && hasExpandableContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "anticipate" }}
              className="overflow-hidden"
            >
              <div className="pt-6 pb-2 flex flex-col gap-8 mt-4" style={{ borderTop: '1px solid #1e1e1e' }}>
                
                {/* 1. Experience Section */}
                {periodExperience.length > 0 && (
                  <div>
                    <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }}></span> Experience
                    </h5>
                    <div className="flex flex-col gap-4">
                      {periodExperience.map((intern, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-5 transition-colors"
                          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <strong style={{ color: '#fff', fontSize: 18 }}>{intern.title}</strong>
                            {intern.displayDate && (
                              <span className="font-mono px-2 py-1 rounded" style={{ fontSize: 12, background: '#222', color: '#888' }}>
                                {intern.displayDate}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 16, color: '#777' }}>
                            {intern.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Projects Section */}
                {periodProjects.length > 0 && (
                  <div>
                    <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }}></span> Projects
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {periodProjects.map((proj, i) => {
                        const isLink = Boolean(proj.link);
                        const Tag = isLink ? "a" : "div";
                        const props = isLink ? { href: proj.link, target: "_blank", rel: "noreferrer" } : {};
                        return (
                        <Tag
                          {...props}
                          key={i}
                          className={`block rounded-xl p-4 transition-colors relative ${isLink ? "hover:border-gray-500 cursor-pointer group/proj" : ""}`}
                          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                        >
                          <div className="flex flex-wrap items-start gap-2 mb-2 pr-20">
                            <strong className={`block font-bold transition-colors ${isLink ? "group-hover/proj:text-blue-400" : ""}`} style={{ color: '#fff', fontSize: 16 }}>
                              {proj.title}
                            </strong>
                          </div>
                          {proj.status && (
                             <div className="absolute top-4 right-4">
                                <span className="uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                                      style={{
                                        fontSize: 10,
                                        background: proj.status.toLowerCase() === 'ongoing' ? 'rgba(10,132,255,0.15)' : 'rgba(48,209,88,0.15)',
                                        color: proj.status.toLowerCase() === 'ongoing' ? '#0A84FF' : '#30D158'
                                      }}>
                                  {proj.status}
                                </span>
                             </div>
                          )}
                          {proj.description && (
                            <p className="leading-relaxed mb-4" style={{ fontSize: 14, color: '#777' }}>
                              {proj.description}
                            </p>
                          )}
                          {proj.tags && proj.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-auto">
                              {proj.tags.map(t => (
                                <span key={t} className="px-2 py-1 rounded font-medium" style={{ background: '#222', color: '#999', fontSize: 11 }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </Tag>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Competitions Section */}
                {periodCompetitions.length > 0 && (
                  <div>
                    <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#A855F7' }}></span> Competitions
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {periodCompetitions.map((comp, i) => {
                        const isLink = Boolean(comp.link);
                        const Tag = isLink ? "a" : "div";
                        const props = isLink ? { href: comp.link, target: "_blank", rel: "noreferrer" } : {};
                        return (
                        <Tag
                          {...props}
                          key={i}
                          className={`block rounded-xl p-4 transition-colors relative ${isLink ? "hover:border-gray-500 cursor-pointer group/comp" : ""}`}
                          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                        >
                          <div className="flex flex-wrap items-start gap-2 mb-2 pr-20">
                            <strong className={`block font-bold transition-colors ${isLink ? "group-hover/comp:text-blue-400" : ""}`} style={{ color: '#fff', fontSize: 16 }}>
                              {comp.title}
                            </strong>
                          </div>
                          {comp.status && (
                             <div className="absolute top-4 right-4">
                                <span className="uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                                      style={{
                                        fontSize: 10,
                                        background: comp.status.toLowerCase() === 'ongoing' ? 'rgba(10,132,255,0.15)' : 'rgba(48,209,88,0.15)',
                                        color: comp.status.toLowerCase() === 'ongoing' ? '#0A84FF' : '#30D158'
                                      }}>
                                  {comp.status}
                                </span>
                             </div>
                          )}
                          {comp.description && (
                            <p className="leading-relaxed mb-4" style={{ fontSize: 14, color: '#777' }}>
                              {comp.description}
                            </p>
                          )}
                          {comp.tags && comp.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-auto">
                              {comp.tags.map(t => (
                                <span key={t} className="px-2 py-1 rounded font-medium" style={{ background: '#222', color: '#999', fontSize: 11 }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </Tag>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Certificates Section */}
                {periodCerts.length > 0 && (
                  <div>
                    <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#F97316' }}></span> Certificates
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {periodCerts.map((cert, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                          {cert.link ? (
                            <a href={cert.link} target="_blank" rel="noreferrer" className="font-medium transition-colors hover:text-blue-400" style={{ color: '#fff', fontSize: 14 }}>
                              {cert.title}
                            </a>
                          ) : (
                            <span className="font-medium" style={{ color: '#fff', fontSize: 14 }}>{cert.title}</span>
                          )}
                          {cert.description && <span className="pl-2" style={{ fontSize: 12, color: '#777', borderLeft: '1px solid #2a2a2a' }}>{cert.description}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const Timeline = ({ data, projects, certificates, experience, competitions }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setHeight(rect.height);
        }
      });
      resizeObserver.observe(ref.current);
      return () => resizeObserver.disconnect();
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans md:px-10" ref={containerRef} style={{ background: '#000' }}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => {
           const periodProjects = projects.filter((p) => p.time === item.time);
           const periodCerts = certificates.filter((c) => c.time === item.time);
           const periodExperience = experience.filter((e) => e.time === item.time);
           const periodCompetitions = competitions.filter((c) => c.time === item.time);

           return (
             <TimelineItem 
                key={index} 
                item={item} 
                periodProjects={periodProjects}
                periodCerts={periodCerts}
                periodExperience={periodExperience}
                periodCompetitions={periodCompetitions}
             />
           )
        })}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-[#1e1e1e] to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-500 via-indigo-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
