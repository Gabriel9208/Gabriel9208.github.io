import { Link } from "react-router-dom";
import projectsData from "../data/projects.json";
import { HoverEffect } from "../components/ui/card-hover-effect";

export default function RecentWork() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 bg-background flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <header className="space-y-4 mb-16 px-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-lg">
            &larr; Back to Welcome
          </Link>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">Recent Work</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            A showcase of my latest projects, experiments, and technical deep dives across Web Dev, Computer Vision, and beyond.
          </p>
        </header>

        <div className="w-full">
          <HoverEffect items={projectsData} />
        </div>
      </div>
    </div>
  );
}
