import { useState, useEffect } from "react";
import { Nav } from "./components/Nav";
import { Home } from "./pages/Home";
import { Download } from "./pages/Download";
import { About } from "./pages/About";
import { Build } from "./pages/Build";
import { Status } from "./pages/Status";
import { Socials } from "./pages/Socials";
import { Credits } from "./pages/Credits";
import { Admin } from "./pages/Admin";
import { Maintenance } from "./pages/Maintenance";
import { AnimatePresence, motion } from "framer-motion";

const isAdminRoute = window.location.pathname.endsWith("/admin");

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceBypassed, setMaintenanceBypassed] = useState(
    sessionStorage.getItem("fragment_maintenance_bypass") === "1"
  );

  // Check maintenance flag from server on load (no auth needed)
  useEffect(() => {
    fetch(`${(import.meta.env.VITE_API_BASE as string | undefined) ?? '/api'}/public/config`)
      .then((r) => r.json())
      .then((data: { maintenance?: boolean }) => {
        if (data.maintenance) setMaintenance(true);
      })
      .catch(() => {/* ignore, default to not-maintenance */});
  }, []);

  if (isAdminRoute) {
    return <Admin />;
  }

  // Show maintenance page if enabled and not bypassed
  if (maintenance && !maintenanceBypassed) {
    return (
      <Maintenance
        onUnlock={() => setMaintenanceBypassed(true)}
      />
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "Home":     return <Home setActivePage={setActivePage} />;
      case "Download": return <Download />;
      case "About":    return <About />;
      case "Build":    return <Build />;
      case "Status":   return <Status />;
      case "Socials":  return <Socials />;
      case "Credits":  return <Credits />;
      default:         return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Nav activePage={activePage} setActivePage={setActivePage} />

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-[-1]" />
    </div>
  );
}

export default App;
