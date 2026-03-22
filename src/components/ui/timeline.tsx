import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  heading: string;
  content: React.ReactNode;
  tags?: string[];
  projects?: { name: string; link?: string; desc?: string; status?: string }[];
  certificates?: { name: string; date?: string; link?: string }[];
  internships?: { company: string; role: string; date?: string }[];
}

const TimelineItem = ({ item }: { item: TimelineEntry }) => {
  const [isHovered, setIsHovered] = useState(false);

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
          {item.title}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <h3 className="md:hidden block mb-4 text-left font-bold transition-colors duration-300"
            style={{ fontSize: 48, color: isHovered ? '#fff' : '#555' }}>
          {item.title}
        </h3>
        <h4 className="font-bold mb-6 transition-colors duration-300"
            style={{ fontSize: 32, color: isHovered ? '#0A84FF' : '#fff' }}>
          {item.heading}
        </h4>
        <div className="mb-8 font-light leading-relaxed"
             style={{ fontSize: 17, color: '#777' }}>
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
          {isHovered &&
            (item.projects || item.certificates || item.internships) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "anticipate" }}
                className="overflow-hidden"
              >
                <div className="pt-6 pb-2 flex flex-col gap-8 mt-4" style={{ borderTop: '1px solid #1e1e1e' }}>
                  {/* Internships Section */}
                  {item.internships && item.internships.length > 0 && (
                    <div>
                      <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Internships
                      </h5>
                      <div className="flex flex-col gap-4">
                        {item.internships.map((intern, i) => (
                          <div
                            key={i}
                            className="rounded-xl p-5 transition-colors"
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <strong style={{ color: '#fff', fontSize: 18 }}>{intern.role}</strong>
                              {intern.date && (
                                <span className="font-mono px-2 py-1 rounded" style={{ fontSize: 12, background: '#222', color: '#888' }}>
                                  {intern.date}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 16, color: '#777' }}>
                              {intern.company}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {item.projects && item.projects.length > 0 && (
                    <div>
                      <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Projects
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.projects.map((proj, i) => (
                          <div
                            key={i}
                            className="rounded-xl p-4 transition-colors"
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                          >
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                              {proj.link ? (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="font-bold transition-colors hover:text-blue-400" style={{ color: '#fff', fontSize: 16 }}>
                                  {proj.name}
                                </a>
                              ) : (
                                <strong className="block font-bold" style={{ color: '#fff', fontSize: 16 }}>
                                  {proj.name}
                                </strong>
                              )}
                              {proj.status && (
                                <span className="uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                                      style={{
                                        fontSize: 10,
                                        background: proj.status.toLowerCase() === 'ongoing' ? 'rgba(10,132,255,0.15)' : 'rgba(48,209,88,0.15)',
                                        color: proj.status.toLowerCase() === 'ongoing' ? '#0A84FF' : '#30D158'
                                      }}>
                                  {proj.status}
                                </span>
                              )}
                            </div>
                            {proj.desc && (
                              <p className="leading-relaxed" style={{ fontSize: 14, color: '#777' }}>
                                {proj.desc}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates Section */}
                  {item.certificates && item.certificates.length > 0 && (
                    <div>
                      <h5 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#fff', fontSize: 14 }}>
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span> Certificates
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {item.certificates.map((cert, i) => (
                          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                            {cert.link ? (
                              <a href={cert.link} target="_blank" rel="noreferrer" className="font-medium transition-colors hover:text-blue-400" style={{ color: '#fff', fontSize: 14 }}>
                                {cert.name}
                              </a>
                            ) : (
                              <span className="font-medium" style={{ color: '#fff', fontSize: 14 }}>{cert.name}</span>
                            )}
                            {cert.date && <span className="pl-2" style={{ fontSize: 12, color: '#777', borderLeft: '1px solid #2a2a2a' }}>{cert.date}</span>}
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

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
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
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} />
        ))}
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
