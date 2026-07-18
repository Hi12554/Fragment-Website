import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadCloud, FileArchive, Terminal as TermIcon,
  AlertTriangle, ChevronDown, ShieldCheck,
  ExternalLink, Clock, RefreshCw, X, ZoomIn,
} from "lucide-react";
import { loadConfig, AdminConfig, ApiConfig, ApiStatus } from "../store/adminStore";

// ── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono text-xs"
        >
          <X className="w-4 h-4" /> Close
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-2xl border border-white/10 shadow-2xl"
        />
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ── Status helpers ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApiStatus }) {
  if (status === "up") return null;
  return (
    <div className="w-full mb-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-2 text-amber-400 font-mono text-xs">
      <ChevronDown className="w-4 h-4 flex-shrink-0" />
      Roblox Downgrade Required
    </div>
  );
}

function statusDot(status: ApiStatus) {
  return status === "up"
    ? <span className="inline-block w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] mr-1.5 flex-shrink-0" />
    : <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5 flex-shrink-0" />;
}

function statusLabel(status: ApiStatus) {
  return status === "up" ? "Operational" : "Downgrade Required";
}

// ── Single executor card ─────────────────────────────────────────────────────
const ExecutorCard: React.FC<{
  name: string;
  subtitle: string;
  icon: React.ElementType;
  accentClass: string;
  glowClass: string;
  cfg: ApiConfig;
}> = ({ name, subtitle, icon: Icon, accentClass, glowClass, cfg }) => {
  const [showReleases, setShowReleases] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Latest release = first entry (they're added newest-first in the admin)
  const latestRelease = cfg.releases?.[0] ?? null;

  return (
    <>
      {lightboxOpen && cfg.previewImage && (
        <Lightbox
          src={cfg.previewImage}
          alt={`${name} preview`}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className={`bg-card border ${accentClass.replace("text-", "border-")}/30 rounded-2xl relative overflow-hidden flex flex-col`}>
        <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${accentClass.replace("text-", "via-")} to-transparent opacity-60`} />

        <div className="p-7 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accentClass.replace("text-", "bg-")}/15 ${glowClass}`}>
                <Icon className={`w-7 h-7 ${accentClass}`} />
              </div>
              <div>
                <h3 className="text-xl font-mono font-bold text-white">{name}</h3>
                <p className={`text-xs font-mono tracking-widest uppercase ${accentClass}/70`}>{subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end text-xs font-mono ${cfg.status === "up" ? "text-green-400" : "text-amber-400"}`}>
                {statusDot(cfg.status)}{statusLabel(cfg.status)}
              </div>
              {latestRelease?.version && (
                <div className="text-xs text-gray-600 font-mono mt-0.5">{latestRelease.version}</div>
              )}
            </div>
          </div>

          <StatusBadge status={cfg.status} />

          {/* Preview image — click to expand */}
          {cfg.previewImage && (
            <div
              className="rounded-xl overflow-hidden border border-white/10 mb-5 max-h-44 relative group cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={cfg.previewImage}
                alt={`${name} preview`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => (e.currentTarget.parentElement!.style.display = "none")}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>
          )}

          {/* Description */}
          {cfg.description && (
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">{cfg.description}</p>
          )}

          {/* Stats row */}
          {(cfg.uncPercent || cfg.suncPercent || cfg.supportedVersion) && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {cfg.uncPercent && (
                <div className="bg-[#0D0D11] rounded-xl px-3 py-2.5 text-center border border-white/5">
                  <div className={`font-mono font-bold text-lg ${accentClass}`}>{cfg.uncPercent}%</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">UNC</div>
                </div>
              )}
              {cfg.suncPercent && (
                <div className="bg-[#0D0D11] rounded-xl px-3 py-2.5 text-center border border-white/5">
                  <div className={`font-mono font-bold text-lg ${accentClass}`}>{cfg.suncPercent}%</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">sUNC</div>
                </div>
              )}
              {cfg.supportedVersion && (
                <div className={`bg-[#0D0D11] rounded-xl px-3 py-2.5 text-center border border-white/5 ${!cfg.uncPercent && !cfg.suncPercent ? "col-span-3" : ""}`}>
                  <div className="font-mono font-bold text-sm text-white truncate">{cfg.supportedVersion}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">Roblox ver.</div>
                </div>
              )}
            </div>
          )}

          {/* VT scan */}
          {(cfg.virusTotalUrl || cfg.virusTotalDetections) && (
            <div className="flex items-center gap-3 mb-5 bg-[#0D0D11] border border-white/5 rounded-xl px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-mono">VirusTotal Scan</p>
                {cfg.virusTotalDetections && (
                  <p className="text-xs font-mono text-green-400 font-bold">{cfg.virusTotalDetections} detections</p>
                )}
              </div>
              {cfg.virusTotalUrl && (
                <a href={cfg.virusTotalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Download button — always enabled */}
          <a
            href={cfg.downloadUrl && cfg.downloadUrl !== "#" ? cfg.downloadUrl : undefined}
            target={cfg.downloadUrl && cfg.downloadUrl !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-all rounded-xl text-center block mt-auto ${glowClass} ${accentClass.replace("text-", "bg-")} text-white hover:opacity-90`}
          >
            <DownloadCloud className="inline w-4 h-4 mr-2 -mt-0.5" />
            Download {name}
          </a>

          {/* Release history */}
          {cfg.releases && cfg.releases.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReleases(!showReleases)}
                className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors w-full justify-center"
              >
                <Clock className="w-3.5 h-3.5" />
                {showReleases ? "Hide" : "Show"} release history ({cfg.releases.length})
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showReleases ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showReleases && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="space-y-2">
                      {cfg.releases.map((release) => (
                        <div key={release.id} className="border border-white/10 rounded-xl p-4 bg-[#0D0D11]">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-mono font-bold text-sm ${accentClass}`}>{release.version}</span>
                            <span className="text-xs text-gray-500 font-mono">{release.date}</span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{release.changelog}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ── Download page ────────────────────────────────────────────────────────────
export const Download: React.FC = () => {
  const [cfg, setCfg] = useState<AdminConfig | null>(null);

  useEffect(() => {
    loadConfig().then(setCfg);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mono font-bold text-white mb-4 text-shadow-neon-purple">DOWNLOAD</h2>
        <p className="text-muted-foreground">Fragment — choose your preferred API integration below.</p>
      </div>

      {!cfg ? (
        <div className="flex items-center justify-center py-24 text-gray-500 font-mono text-sm gap-3">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <ExecutorCard
              name="Velocity API"
              subtitle="Fragment × Velocity"
              icon={DownloadCloud}
              accentClass="text-primary"
              glowClass="shadow-[0_0_20px_rgba(168,85,247,0.25)]"
              cfg={cfg.velocityApi}
            />
            <ExecutorCard
              name="Xeno API"
              subtitle="Fragment × Xeno"
              icon={FileArchive}
              accentClass="text-cyan-400"
              glowClass="shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              cfg={cfg.xenoApi}
            />
          </div>

          {/* Antivirus warning */}
          <div className="bg-[#1a1400] border border-amber-500/50 rounded-2xl p-4 mb-12 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-500 font-mono font-bold mb-1">⚠ ANTIVIRUS FALSE POSITIVE</h4>
              <p className="text-amber-500/80 text-sm">
                Due to the nature of process injection, Fragment may be flagged by Windows Defender or other AV software.
                Disable real-time protection temporarily during installation. We do not modify persistent system files.
              </p>
            </div>
          </div>

          {/* Installation steps */}
          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <TermIcon className="w-5 h-5 text-gray-400" />
              <h3 className="font-mono font-bold text-white">INSTALLATION_STEPS.md</h3>
            </div>
            <div className="p-6 font-mono text-sm space-y-4 text-gray-300">
              {[
                "Disable Windows Defender real-time protection temporarily.",
                "Extract the downloaded ZIP or run the installer as Administrator.",
                <>Launch <span className="text-white bg-white/10 px-1 py-0.5 rounded">Fragment.exe</span>.</>,
                "Open Roblox (Web Client, not UWP). Wait for the injection confirmation toast in the bottom right.",
                "Paste your script and click execute. Happy hacking.",
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-primary flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
