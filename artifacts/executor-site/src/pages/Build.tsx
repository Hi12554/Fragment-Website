import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DownloadCloud, FileArchive, FolderOpen } from "lucide-react";
import { loadConfig, AdminConfig } from "../store/adminStore";

export const Build: React.FC = () => {
  const [cfg, setCfg] = useState<AdminConfig | null>(null);

  useEffect(() => {
    loadConfig().then(setCfg);
  }, []);

  const files = cfg
    ? [
        {
          name: "Velocity Build",
          subtitle: "Fragment × Velocity",
          icon: DownloadCloud,
          accentClass: "text-primary",
          borderClass: "border-primary/30",
          glowClass: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
          url: cfg.buildFiles.velocityBuildFile,
        },
        {
          name: "Xeno Build",
          subtitle: "Fragment × Xeno",
          icon: FileArchive,
          accentClass: "text-cyan-400",
          borderClass: "border-cyan-400/30",
          glowClass: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
          url: cfg.buildFiles.xenoBuildFile,
        },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mono font-bold text-white mb-4 text-shadow-neon-purple">
          BUILD FILES
        </h2>
        <p className="text-muted-foreground">
          Download the latest Fragment build for your preferred API.
        </p>
      </div>

      {!cfg ? (
        <div className="flex items-center justify-center py-24 text-gray-500 font-mono text-sm gap-3">
          <FolderOpen className="w-4 h-4 animate-pulse" /> Loading files…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {files.map((file) => {
            const Icon = file.icon;
            const available = !!file.url && file.url !== "#" && file.url !== "";
            return (
              <div
                key={file.name}
                className={`bg-card border ${file.borderClass} rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden group`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${file.accentClass.replace("text-", "via-")} to-transparent opacity-60`} />

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${file.accentClass.replace("text-", "bg-")}/10 border ${file.borderClass} group-hover:scale-110 transition-transform ${file.glowClass}`}>
                  <Icon className={`w-8 h-8 ${file.accentClass}`} />
                </div>

                <h3 className="text-xl font-mono font-bold text-white mb-1">{file.name}</h3>
                <p className={`text-xs font-mono tracking-widest uppercase mb-6 ${file.accentClass}/70`}>
                  {file.subtitle}
                </p>

                {available ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 font-mono font-bold uppercase tracking-widest rounded-xl text-center block transition-all mt-auto ${file.accentClass.replace("text-", "bg-")} text-white hover:opacity-90 ${file.glowClass}`}
                  >
                    <DownloadCloud className="inline w-4 h-4 mr-2 -mt-0.5" />
                    Download
                  </a>
                ) : (
                  <div className="w-full py-4 font-mono font-bold uppercase tracking-widest rounded-xl text-center mt-auto bg-white/5 text-gray-600 border border-white/10 select-none">
                    Not Available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
