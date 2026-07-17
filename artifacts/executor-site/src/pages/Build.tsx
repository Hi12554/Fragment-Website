import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal as TermIcon, Download, Check } from "lucide-react";

const LOG_MESSAGES = [
  { time: 1000, text: "Initializing Zenon build environment..." },
  { time: 2000, text: "Fetching Zenon API v3.1..." },
  { time: 5000, text: "Injecting dependencies..." },
  { time: 8000, text: "Compiling [NAME]_executor.exe..." },
  { time: 12000, text: "Linking Zenon API wrapper..." },
  { time: 15000, text: "Applying anti-detection patches..." },
  { time: 18000, text: "Obfuscating binary..." },
  { time: 22000, text: "Running integrity checks..." },
  { time: 25000, text: "✓ BUILD SUCCESSFUL" },
];

export const Build: React.FC = () => {
  const [name, setName] = useState("MyExecutor");
  const [theme, setTheme] = useState("purple");
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ time: string; text: string }[]>([]);
  const [buildComplete, setBuildComplete] = useState(false);

  const startBuild = () => {
    if (isBuilding || buildComplete) return;
    setIsBuilding(true);
    setLogs([]);
    setProgress(0);
    setBuildComplete(false);

    // Speed up simulation for UI purposes (25s -> ~4s)
    const SPEED_FACTOR = 0.15;

    LOG_MESSAGES.forEach((log) => {
      setTimeout(() => {
        const now = new Date();
        const timeStr = `[${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}]`;

        setLogs((prev) => [
          ...prev,
          {
            time: timeStr,
            text: log.text.replace("[NAME]", name || "Custom"),
          },
        ]);

        // Calculate progress roughly
        const currentProgress = Math.min(
          100,
          Math.floor((log.time / 25000) * 100),
        );
        setProgress(currentProgress);

        if (log.text.includes("SUCCESSFUL")) {
          setProgress(100);
          setIsBuilding(false);
          setBuildComplete(true);
        }
      }, log.time * SPEED_FACTOR);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Cpu className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-mono font-bold text-white tracking-widest">
              BUILD_CONFIG
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-mono text-sm text-gray-400 mb-2">
                Custom Executor Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isBuilding || buildComplete}
                className="w-full bg-[#0D0D11] border border-secondary/50 focus:border-secondary focus:box-shadow-neon-cyan outline-none rounded-xl px-4 py-3 text-white font-mono transition-all disabled:opacity-50"
                placeholder="MyExecutor"
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-gray-400 mb-2">
                UI Theme Color
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isBuilding || buildComplete}
                className="w-full bg-[#0D0D11] border border-white/20 focus:border-primary outline-none rounded-xl px-4 py-3 text-white font-mono appearance-none disabled:opacity-50"
              >
                <option value="purple">Neon Purple (Default)</option>
                <option value="cyan">Cyber Cyan</option>
                <option value="red">Blood Red</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-not-allowed opacity-80">
                <div className="w-5 h-5 rounded-sm border-2 border-primary bg-primary/20 flex items-center justify-center relative">
                  <Check className="w-4 h-4 text-primary absolute" />
                </div>
                <span className="font-mono text-sm text-white">
                  Inject Zenon API Wrapper (.dll)
                </span>
                <span className="text-xs text-gray-500 font-sans ml-auto">
                  (Required)
                </span>
              </label>
            </div>

            <button
              onClick={startBuild}
              disabled={isBuilding || buildComplete || !name}
              className="w-full mt-4 py-4 bg-primary text-white font-mono font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all box-shadow-neon-purple flex items-center justify-center gap-2 rounded-xl"
            >
              <Cpu className="w-5 h-5" />
              {isBuilding
                ? "COMPILING..."
                : buildComplete
                  ? "BUILD FINISHED"
                  : "COMPILE & GENERATE BUILD"}
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="bg-[#0A0A0E] border border-white/10 rounded-2xl overflow-hidden flex flex-col relative h-[500px]">
          {/* Progress bar overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
            <div
              className="h-full bg-success box-shadow-neon-green transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-[#16161F] px-4 py-3 border-b border-white/10 flex items-center gap-3 z-20">
            <TermIcon className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-xs text-gray-500">
              zenon_compiler_v4.exe
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto font-mono text-sm scanlines text-success/90 z-10 relative">
            <div className="space-y-2">
              <div className="text-gray-500">Zenon Build Tools (v4.2.1)</div>
              <div className="text-gray-500 mb-4">
                Copyright (c) 2024 Zenon Team. All rights reserved.
              </div>

              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <span className="text-gray-500 opacity-70 shrink-0">
                      {log.time}
                    </span>
                    <span
                      className={
                        log.text.includes("SUCCESSFUL")
                          ? "text-success font-bold text-shadow-neon-green"
                          : "text-success/90"
                      }
                    >
                      {log.text}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isBuilding && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-4 bg-success mt-2"
                />
              )}
            </div>
          </div>

          {/* Success Download Overlay */}
          <AnimatePresence>
            {buildComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 right-6 bg-[#16161F]/90 backdrop-blur border border-success box-shadow-neon-green p-4 rounded-xl z-30 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-success">
                    SUCCESS
                  </div>
                  <div className="text-sm text-gray-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                    {name || "Custom"}_executor.exe
                  </div>
                </div>
                <button
                  onClick={() => {
                    setName("MyExecutor");
                    setBuildComplete(false);
                    setLogs([]);
                    setProgress(0);
                  }}
                  className="px-4 py-2 bg-success/20 text-success border border-success hover:bg-success hover:text-black font-mono font-bold text-sm transition-colors flex items-center gap-2 rounded-lg"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
