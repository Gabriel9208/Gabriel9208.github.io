import { Routes, Route, HashRouter, Link, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Exploration from "./pages/Exploration";
import RecentWork from "./pages/RecentWork";

function Navigation() {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-foreground font-semibold"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-4 px-6" style={{ background: '#000', borderBottom: '1px solid #1e1e1e' }}>
      <div className="flex justify-center items-center gap-8">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/exploration" className={linkClass("/exploration")}>Explorations</Link>
        <Link to="/recent-work" className={linkClass("/recent-work")}>Currently Working On</Link>
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
