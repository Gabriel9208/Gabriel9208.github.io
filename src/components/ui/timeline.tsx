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
        <div className="h-10 absolute left-3 md:left-3 w-10 border border-border rounded-full bg-background flex items-center justify-center transition-colors group-hover:border-foreground/50">
          <div className="h-4 w-4 rounded-full bg-foreground border border-neutral-300 p-2 transition-transform group-hover:scale-125" />
        </div>
        <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {item.title}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {item.title}
        </h3>
        <h4 className="text-2xl md:text-4xl font-bold text-foreground mb-6 transition-colors duration-300 group-hover:text-blue-400">
          {item.heading}
        </h4>
        <div className="mb-8 text-neutral-400 text-lg md:text-xl font-light leading-relaxed">
          {item.content}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-muted/50 border border-border rounded-full text-sm text-foreground font-semibold tracking-wide"
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
                <div className="pt-6 pb-2 border-t border-border/50 flex flex-col gap-8 mt-4">
                  {/* Internships Section */}
                  {item.internships && item.internships.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Internships
                      </h5>
                      <div className="flex flex-col gap-4">
                        {item.internships.map((intern, i) => (
                          <div
                            key={i}
                            className="bg-card border border-border rounded-xl p-5 hover:border-foreground/30 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <strong className="text-foreground text-lg">{intern.role}</strong>
                              {intern.date && (
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                                  {intern.date}
                                </span>
                              )}
                            </div>
                            <div className="text-base text-muted-foreground">
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
                      <h5 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Projects
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.projects.map((proj, i) => (
                          <div
                            key={i}
                            className="bg-muted/30 border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                              {proj.link ? (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="text-foreground hover:text-blue-400 text-base font-bold transition-colors">
                                  {proj.name}
                                </a>
                              ) : (
                                <strong className="text-foreground block text-base">
                                  {proj.name}
                                </strong>
                              )}
                              {proj.status && (
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${proj.status.toLowerCase() === 'ongoing' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                  {proj.status}
                                </span>
                              )}
                            </div>
                            {proj.desc && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
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
                      <h5 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span> Certificates
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {item.certificates.map((cert, i) => (
                          <div key={i} className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg">
                            {cert.link ? (
                              <a href={cert.link} target="_blank" rel="noreferrer" className="text-foreground text-sm font-medium hover:text-blue-400 transition-colors">
                                {cert.name}
                              </a>
                            ) : (
                              <span className="text-foreground text-sm font-medium">{cert.name}</span>
                            )}
                            {cert.date && <span className="text-xs text-muted-foreground border-l border-border pl-2">{cert.date}</span>}
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

export const Timeline = ({ data, title, subtitle }: { data: TimelineEntry[], title: string, subtitle: string }) => {
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
    <div className="w-full bg-background font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-3xl md:text-6xl mb-4 text-foreground max-w-4xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle.split("\n\n").map((para, i) => (
          <p key={i} className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-4">
            {para}
          </p>
        ))}
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} />
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
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
