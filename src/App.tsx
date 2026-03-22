import { Routes, Route, HashRouter, Link, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Exploration from "./pages/Exploration";
import RecentWork from "./pages/RecentWork";

// Simple navigation bar
function Navigation() {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-foreground font-semibold"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-4 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl tracking-tight">
          Gabriel's Page
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/exploration" className={linkClass("/exploration")}>Explorations</Link>
          <Link to="/recent-work" className={linkClass("/recent-work")}>Recent Works</Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
