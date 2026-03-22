import { Routes, Route, BrowserRouter } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Exploration from "./pages/Exploration";
import RecentWork from "./pages/RecentWork";

// Simple navigation bar
function Navigation() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-4 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <a href="/" className="font-bold text-xl tracking-tight">Gabriel.</a>
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="/exploration" className="hover:text-foreground transition-colors">Trip</a>
          <a href="/recent-work" className="hover:text-foreground transition-colors">Work</a>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/exploration" element={<Exploration />} />
            <Route path="/recent-work" element={<RecentWork />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
