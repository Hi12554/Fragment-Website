import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DownloadCloud,
  FileArchive,
  Terminal as TermIcon,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { getConfig, AdminConfig, ApiStatus } from "../store/adminStore";

function StatusBadge({ status }: { status: ApiStatus }) {
  if (status === "up") return null;
  if (status === "down") {
    return (
      <div className="w-full mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-2 text-red-400 font-mono text-xs">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        Currently Offline
      </div>
    );
  }
  return (
    <div className="w-full mb-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-2 text-amber-400 font-mono text-xs">
      <ChevronDown className="w-4 h-4 flex-shrink-0" />
      Roblox Downgrade Required
    </div>
  );
}

export const Download: React.FC = () => {
  const [cfg, setCfg] = useState<AdminConfig>(getConfig);

  // Re-read on focus so admin changes reflect immediately
  useEffect(() => {
    const refresh = () => setCfg(getConfig());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mono font-bold text-white mb-4 text-shadow-neon-purple">
          DOWNLOAD
        </h2>
        <p className="text-muted-foreground">
          Fragment — choose your preferred API integration below.
        </p>
        <p className="text-xs font-mono text-gray-600 mt-1">{cfg.version}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Velocity API */}
        <div className="bg-card border border-primary/30 p-8 rounded-2xl relative overflow-hidden flex flex-col items-center text-center group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform box-shadow-neon-purple">
            <DownloadCloud className="w-8 h-8 text-primary" />
          </div>

          <h3 className="text-2xl font-mono font-bold text-white mb-1">
            Velocity API
          </h3>
          <p className="text-xs font-mono text-primary/70 mb-4 tracking-widest uppercase">
            Fragment × Velocity
          </p>

          <StatusBadge status={cfg.velocityStatus} />

          <p className="text-muted-foreground mb-6">
            High-performance injection engine. Full Lua 5.4 support with JIT
            and auto-updater included.
          </p>

          <div className="font-mono text-xs text-gray-500 mb-6 bg-black/50 px-3 py-2 rounded">
            <div>Version: {cfg.version} | Size: ~12.4 MB</div>
          </div>

          <a
            href={cfg.velocityLink || "#"}
            target={cfg.velocityLink && cfg.velocityLink !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-colors box-shadow-neon-purple mt-auto rounded-xl text-center block ${
              cfg.velocityStatus === "up"
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-primary/30 text-white/50 cursor-not-allowed pointer-events-none"
            }`}
            onClick={(e) => {
              if (!cfg.velocityLink || cfg.velocityLink === "#") e.preventDefault();
            }}
          >
            Download Velocity API
          </a>
        </div>

        {/* Xeno API */}
        <div className="bg-card border border-secondary/30 p-8 rounded-2xl relative overflow-hidden flex flex-col items-center text-center group">
          <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/10 transition-colors" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform box-shadow-neon-cyan">
            <FileArchive className="w-8 h-8 text-secondary" />
          </div>

          <h3 className="text-2xl font-mono font-bold text-white mb-1">
            Xeno API
          </h3>
          <p className="text-xs font-mono text-secondary/70 mb-4 tracking-widest uppercase">
            Fragment × Xeno
          </p>

          <StatusBadge status={cfg.xenoStatus} />

          <p className="text-muted-foreground mb-6">
            Lightweight portable build. Extract and run — no installation
            required. Zero footprint.
          </p>

          <div className="font-mono text-xs text-gray-500 mb-6 bg-black/50 px-3 py-2 rounded">
            <div>Version: {cfg.version} | Size: ~4.1 MB</div>
          </div>

          <a
            href={cfg.xenoLink || "#"}
            target={cfg.xenoLink && cfg.xenoLink !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-colors mt-auto rounded-xl text-center block border-2 ${
              cfg.xenoStatus === "up"
                ? "bg-transparent border-secondary text-secondary hover:bg-secondary/10"
                : "border-secondary/30 text-secondary/30 cursor-not-allowed pointer-events-none"
            }`}
            onClick={(e) => {
              if (!cfg.xenoLink || cfg.xenoLink === "#") e.preventDefault();
            }}
          >
            Download Xeno API
          </a>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-[#1a1400] border border-amber-500/50 rounded-2xl p-4 mb-12 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
        <div>
          <h4 className="text-amber-500 font-mono font-bold mb-1">
            ⚠ ANTIVIRUS FALSE POSITIVE
          </h4>
          <p className="text-amber-500/80 text-sm">
            Due to the nature of process injection, Fragment may be flagged by
            Windows Defender or other AV software. Disable real-time protection
            temporarily during installation. We do not modify persistent system
            files.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <TermIcon className="w-5 h-5 text-gray-400" />
          <h3 className="font-mono font-bold text-white">
            INSTALLATION_STEPS.md
          </h3>
        </div>
        <div className="p-6 font-mono text-sm space-y-4 text-gray-300">
          <div className="flex gap-4">
            <span className="text-primary">01</span>
            <p>Disable Windows Defender real-time protection temporarily.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-primary">02</span>
            <p>
              Extract the downloaded ZIP or run the installer as Administrator.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-primary">03</span>
            <p>
              Launch{" "}
              <span className="text-white bg-white/10 px-1 py-0.5 rounded">
                Fragment.exe
              </span>{" "}
              and enter your license key when prompted.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-primary">04</span>
            <p>
              Open Roblox (Web Client, not UWP). Wait for the injection
              confirmation toast in the bottom right.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-primary">05</span>
            <p>Paste your script and click execute. Happy hacking.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
