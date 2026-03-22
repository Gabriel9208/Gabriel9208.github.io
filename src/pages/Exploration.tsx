import { Link } from "react-router-dom";
import journeyData from "../data/journey.json";
import { Timeline } from "../components/ui/timeline";

export default function Exploration() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="w-full max-w-7xl mx-auto pt-24 px-6 md:px-10 flex items-center space-x-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-lg">
          &larr; Back to Welcome
        </Link>
      </header>

      <div className="w-full">
        <Timeline data={journeyData} />
      </div>
    </div>
  );
}
