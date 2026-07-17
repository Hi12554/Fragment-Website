import React from "react";
import { motion } from "framer-motion";
import {
  DownloadCloud,
  FileArchive,
  Terminal as TermIcon,
  AlertTriangle,
} from "lucide-react";

export const Download: React.FC = () => {
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
          <p className="text-xs font-mono text-primary/70 mb-4 tracking-widest uppercase">Fragment × Velocity</p>
          <p className="text-muted-foreground mb-6">
            High-performance injection engine. Full Lua 5.4 support with JIT and auto-updater included.
          </p>

          <div className="font-mono text-xs text-gray-500 mb-6 bg-black/50 px-3 py-2 rounded">
            <div>Version: v4.2.1 | Size: ~12.4 MB</div>
            <div className="mt-1 truncate w-48 text-left text-gray-600">
              SHA256: 8f4e9a...2b1c
            </div>
          </div>

          <button className="w-full py-4 bg-primary text-white font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors box-shadow-neon-purple mt-auto rounded-xl">
            Download Velocity API
          </button>
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
          <p className="text-xs font-mono text-secondary/70 mb-4 tracking-widest uppercase">Fragment × Xeno</p>
          <p className="text-muted-foreground mb-6">
            Lightweight portable build. Extract and run — no installation required. Zero footprint.
          </p>

          <div className="font-mono text-xs text-gray-500 mb-6 bg-black/50 px-3 py-2 rounded">
            <div>Version: v4.2.1 | Size: ~4.1 MB</div>
            <div className="mt-1 truncate w-48 text-left text-gray-600">
              SHA256: 3a1f7c...9d2e
            </div>
          </div>

          <button className="w-full py-4 bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10 font-mono font-bold uppercase tracking-widest transition-colors mt-auto rounded-xl">
            Download Xeno API
          </button>
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
