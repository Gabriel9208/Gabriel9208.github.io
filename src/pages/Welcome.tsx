import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/ui/aurora-background";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { HeroParallax } from "../components/ui/hero-parallax";
import { Code, Box, Laptop, Orbit, Github, Server, Braces, Database } from "lucide-react";

const skills = [
  { name: "Python", icon: <Code className="w-8 h-8 text-blue-400" /> },
  { name: "3D Vision", icon: <Box className="w-8 h-8 text-indigo-400" /> },
  { name: "PyTorch", icon: <Orbit className="w-8 h-8 text-orange-400" /> },
  { name: "Web Dev", icon: <Laptop className="w-8 h-8 text-teal-400" /> },
  { name: "React", icon: <Braces className="w-8 h-8 text-cyan-400" /> },
  { name: "Backend", icon: <Server className="w-8 h-8 text-green-400" /> },
  { name: "Database", icon: <Database className="w-8 h-8 text-pink-400" /> },
  { name: "Version", icon: <Github className="w-8 h-8 text-slate-400" /> },
];

const parallaxItems = [
  { title: "Object Detection Models", link: "/recent-work", thumbnail: "" },
  { title: "Point Cloud Segmentation", link: "/exploration", thumbnail: "" },
  { title: "House Dance Rhythm UI", link: "/recent-work", thumbnail: "" },
  { title: "Autonomous Navigation", link: "/exploration", thumbnail: "" },
  { title: "Full-Stack Web Apps", link: "/recent-work", thumbnail: "" },
  { title: "Real-time Pose Estimation", link: "/exploration", thumbnail: "" },
];

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
            Journey of a <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Moving Visionary</span>
          </div>
          <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 py-4 max-w-3xl text-center">
            A CS explorer bridging the gap between rigorous 3D Computer Vision and the rhythmic flow of House Dance.
          </div>
          <div className="flex justify-center gap-6 pt-8">
            <Link to="/exploration" className="bg-white dark:bg-black rounded-full w-fit text-black dark:text-white px-8 py-4 font-bold border border-neutral-300 dark:border-neutral-800 hover:scale-105 transition-transform">
              Explore My Trip
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
        <HeroParallax products={parallaxItems} />
      </section>
    </div>
  );
}
