import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/ui/aurora-background";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { HeroParallax } from "../components/ui/hero-parallax";
import * as LucideIcons from "lucide-react";
import skillsData from "../data/skills.json";
import projectsData from "../data/projects.json";

function resolveIcon(name: string, className: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={`w-8 h-8 ${className}`} /> : null;
}

const skills = skillsData.map((s) => ({
  name: s.name,
  icon: resolveIcon(s.icon, s.color)
}));

const parallaxItems = projectsData.items.slice(0, 6).map((p) => ({
  title: p.title,
  link: p.link,
  thumbnail: "",
}));

export default function Welcome() {
  return (
    <div className="bg-background">
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 pt-20"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center tracking-tight">
            <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Hi, I'm Gabriel </span>
          </div>
          <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 py-4 max-w-3xl text-center">
            CS Student, focusing on Machine Learning & Computer Vision recently
          </div>
          <div className="flex justify-center gap-6 pt-8">
            <Link to="/exploration" className="bg-white dark:bg-black rounded-full w-fit text-black dark:text-white px-8 py-4 font-bold border border-neutral-300 dark:border-neutral-800 hover:scale-105 transition-transform">
              My Trip in Computer Science
            </Link>
            <Link to="/recent-work" className="bg-transparent dark:text-white text-black px-8 py-4 font-bold hover:opacity-75 transition-opacity">
              Recent Work &rarr;
            </Link>
          </div>
        </motion.div>
      </AuroraBackground>

      <section className="py-24 flex flex-col items-center overflow-hidden bg-background">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight">Tools of the Trade</h2>
        <InfiniteMovingCards items={skills} direction="right" speed="slow" />
        <InfiniteMovingCards items={skills.slice().reverse()} direction="left" speed="normal" className="mt-8" />
      </section>

      <section className="bg-card w-full">
        <HeroParallax 
          products={parallaxItems} 
          title={projectsData.meta.title} 
          subtitle={projectsData.meta.subtitle} 
        />
      </section>
    </div>
  );
}
