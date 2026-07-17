import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, FileCode } from "lucide-react";
import { getConfig, AdminConfig, ApiStatus, getStatusLabel } from "../store/adminStore";

const generateHistory = (status: ApiStatus) => {
  return Array.from({ length: 30 }).map((_, i) => ({
    status: status === "up" ? "up" : i > 25 ? "down" : "up",
  }));
};

function statusColor(s: ApiStatus) {
  if (s === "up") return "text-success border-success/30 bg-success/10";
  if (s === "down") return "text-red-400 border-red-500/30 bg-red-500/10";
  return "text-amber-400 border-amber-500/30 bg-amber-500/10";
}

function dotColor(s: ApiStatus) {
  if (s === "up") return "bg-success box-shadow-neon-green";
  if (s === "down") return "bg-red-500";
  return "bg-amber-500";
}

function blockColor(s: ApiStatus) {
  if (s === "up") return "bg-success/80 hover:bg-success";
  if (s === "down") return "bg-red-500/80 hover:bg-red-500";
  return "bg-amber-500/80 hover:bg-amber-500";
}

function overallBadge(vel: ApiStatus, xen: ApiStatus) {
  if (vel === "up" && xen === "up")
    return { label: "ALL SYSTEMS OPERATIONAL", cls: "bg-success/10 border-success/30 text-success", dot: "bg-success box-shadow-neon-green" };
  if (vel === "down" || xen === "down")
    return { label: "SERVICE DISRUPTION", cls: "bg-red-500/10 border-red-500/30 text-red-400", dot: "bg-red-500" };
  return { label: "PARTIAL DISRUPTION", cls: "bg-amber-500/10 border-amber-500/30 text-amber-400", dot: "bg-amber-500" };
}

export const Status: React.FC = () => {
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [cfg, setCfg] = useState<AdminConfig>(getConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastChecked(new Date());
      setCfg(getConfig());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const refresh = () => setCfg(getConfig());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const services = [
    {
      name: "Velocity API",
      subtitle: "Fragment × Velocity",
      icon: Zap,
      status: cfg.velocityStatus,
      history: generateHistory(cfg.velocityStatus),
    },
    {
      name: "Xeno API",
      subtitle: "Fragment × Xeno",
      icon: FileCode,
      status: cfg.xenoStatus,
      history: generateHistory(cfg.xenoStatus),
    },
  ];

  const badge = overallBadge(cfg.velocityStatus, cfg.xenoStatus);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-mono font-bold text-white mb-2">
            SYSTEM STATUS
          </h2>
          <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-success" />
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        </div>

        <div className={`border px-6 py-3 rounded-full flex items-center gap-3 ${badge.cls}`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${badge.dot}`} />
          <span className="font-mono font-bold tracking-wider text-sm">
            {badge.label}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {services.map((service, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={service.name}
            className="bg-card border border-white/5 rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-background rounded-xl border border-white/5">
                  <service.icon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-lg text-white">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">{service.subtitle}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono font-bold ${statusColor(service.status)}`}>
                <div className={`w-2 h-2 rounded-full ${dotColor(service.status)}`} />
                {getStatusLabel(service.status)}
              </div>
            </div>

            {/* History blocks */}
            <div className="flex justify-between gap-1 w-full h-8">
              {service.history.map((block, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-md transition-colors cursor-pointer ${
                    block.status === "up"
                      ? blockColor(service.status)
                      : "bg-red-500/80 hover:bg-red-500"
                  }`}
                  title={block.status === "up" ? getStatusLabel(service.status) : "Outage"}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono text-gray-500">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-[#0A0A0E] border border-white/5 p-6 rounded-2xl text-center">
        <p className="font-mono text-sm text-gray-400">
          Experiencing issues? Join our{" "}
          <a
            href="https://discord.gg/VvSK3zUHZP"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Discord server
          </a>{" "}
          and check the <span className="text-primary">#announcements</span> channel.
        </p>
      </div>
    </motion.div>
  );
};
