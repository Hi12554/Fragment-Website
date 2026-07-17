import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Shield, Key } from "lucide-react";

const generateHistory = (failIndex: number = -1) => {
  return Array.from({ length: 30 }).map((_, i) => ({
    status: i === failIndex ? "down" : "up",
  }));
};

const SERVICES = [
  {
    name: "Exploit Injection Core",
    icon: Shield,
    uptime: "99.99%",
    latency: "12ms avg",
    history: generateHistory(-1),
  },
  {
    name: "Zenon API Endpoint",
    icon: Server,
    uptime: "99.97%",
    latency: "45ms avg",
    history: generateHistory(12), // one yellow block
  },
  {
    name: "Key Authentication Server",
    icon: Key,
    uptime: "99.87%",
    latency: "110ms avg",
    history: generateHistory(25), // one yellow block near the end
  },
];

export const Status: React.FC = () => {
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastChecked(new Date());
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

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

        <div className="bg-success/10 border border-success/30 px-6 py-3 rounded-full flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-success box-shadow-neon-green animate-pulse" />
          <span className="font-mono font-bold text-success text-shadow-neon-green tracking-wider">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {SERVICES.map((service, idx) => (
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
                  <p className="text-sm text-muted-foreground">
                    {service.latency}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold text-white">
                  {service.uptime}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">
                  Uptime 90 Days
                </div>
              </div>
            </div>

            {/* Uptime blocks */}
            <div className="flex justify-between gap-1 w-full h-8">
              {service.history.map((block, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-md ${
                    block.status === "up"
                      ? "bg-success/80 hover:bg-success transition-colors cursor-pointer"
                      : "bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer"
                  }`}
                  title={
                    block.status === "up" ? "Operational" : "Partial Outage"
                  }
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono text-gray-500">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-[#0A0A0E] border border-white/5 p-6 rounded-2xl text-center">
        <p className="font-mono text-sm text-gray-400">
          Experiencing issues not listed here? Join our Discord server and check
          the <span className="text-primary">#announcements</span> channel.
        </p>
      </div>
    </motion.div>
  );
};
