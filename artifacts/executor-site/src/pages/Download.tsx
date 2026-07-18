import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadCloud, FileArchive, Terminal as TermIcon,
  AlertTriangle, AlertCircle, ChevronDown, ShieldCheck,
  ExternalLink, Clock, RefreshCw,
} from "lucide-react";
import { loadConfig, AdminConfig, ApiConfig, ApiStatus } from "../store/adminStore";

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

function statusDot(status: ApiStatus) {
  if (status === "up") return <span className="inline-block w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] mr-1.5" />;
  if (status === "down") return <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1.5" />;
  return <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />;
}

function statusLabel(status: ApiStatus) {
  if (status === "up") return "Operational";
  if (status === "down") return "Down";
  return "Downgrade Required";
}

// ── Single executor card ─────────────────────────────────────────────────────
const ExecutorCard: React.FC<{
  name: string;
  subtitle: string;
  icon: React.ElementType;
  accentClass: string;
  glowClass: string;
  cfg: ApiConfig;
  version: string;
}> = ({ name, subtitle, icon: Icon, accentClass, glowClass, cfg, version }) => {
  const [showReleases, setShowReleases] = useState(false);

  return (
    <div className={`bg-card border rounded-2xl relative overflow-hidden flex flex-col ${accentClass.replace("text-", "border-").split(" ")[0]}/30`}>
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
            <div className={`flex items-center text-xs font-mono ${cfg.status === "up" ? "text-green-400" : cfg.status === "down" ? "text-red-400" : "text-amber-400"}`}>
              {statusDot(cfg.status)}{statusLabel(cfg.status)}
            </div>
            <div className="text-xs text-gray-600 font-mono mt-0.5">{version}</div>
          </div>
        </div>

        <StatusBadge status={cfg.status} />

        {/* Preview image */}
        {cfg.previewImage && (
          <div className="rounded-xl overflow-hidden border border-white/10 mb-5 max-h-44">
            <img src={cfg.previewImage} alt={`${name} preview`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.parentElement!.style.display = "none")} />
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
              <div className="bg-[#0D0D11] rounded-xl px-3 py-2.5 text-center border border-white/5 col-span-3 sm:col-span-1">
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

        {/* Download button */}
        <a
          href={cfg.downloadUrl || "#"}
          target={cfg.downloadUrl && cfg.downloadUrl !== "#" ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={(e) => { if (!cfg.downloadUrl || cfg.downloadUrl === "#") e.preventDefault(); }}
          className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-all rounded-xl text-center block mt-auto ${glowClass} ${
            cfg.status === "up"
              ? `${accentClass.replace("text-", "bg-")} text-white hover:opacity-90`
              : `${accentClass.replace("text-", "bg-")}/20 text-white/40 cursor-not-allowed pointer-events-none`
          }`}
        >
          <DownloadCloud className="inline w-4 h-4 mr-2 -mt-0.5" />
          Download {name}
        </a>

        {/* Release history toggle */}
        {cfg.releases && cfg.releases.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowReleases(!showReleases)}
              className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors w-full justify-center"
            >
              <Clock className="w-3.5 h-3.5" />
              {showReleases ? "Hide" : "Show"} release history ({cfg.releases.length})
              {showReleases ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
  );
};

// ── Download page ────────────────────────────────────────────────────────────
export const Download: React.FC = () => {
  const [cfg, setCfg] = useState<AdminConfig | null>(null);

  useEffect(() => {
    loadConfig().then(setCfg);
  }, []);

  const config = cfg;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mono font-bold text-white mb-4 text-shadow-neon-purple">DOWNLOAD</h2>
        <p className="text-muted-foreground">Fragment — choose your preferred API integration below.</p>
        {config && <p className="text-xs font-mono text-gray-600 mt-1">{config.version}</p>}
      </div>

      {!config ? (
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
              cfg={config.velocityApi}
              version={config.version}
            />
            <ExecutorCard
              name="Xeno API"
              subtitle="Fragment × Xeno"
              icon={FileArchive}
              accentClass="text-cyan-400"
              glowClass="shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              cfg={config.xenoApi}
              version={config.version}
            />
          </div>

          {/* Warning */}
          <div className="bg-[#1a1400] border border-amber-500/50 rounded-2xl p-4 mb-12 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-500 font-mono font-bold mb-1">⚠ ANTIVIRUS FALSE POSITIVE</h4>
              <p className="text-amber-500/80 text-sm">
                Due to the nature of process injection, Fragment may be flagged by Windows Defender or other AV software. Disable real-time protection temporarily during installation. We do not modify persistent system files.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <TermIcon className="w-5 h-5 text-gray-400" />
              <h3 className="font-mono font-bold text-white">INSTALLATION_STEPS.md</h3>
            </div>
            <div className="p-6 font-mono text-sm space-y-4 text-gray-300">
              {[
                "Disable Windows Defender real-time protection temporarily.",
                "Extract the downloaded ZIP or run the installer as Administrator.",
                <>Launch <span className="text-white bg-white/10 px-1 py-0.5 rounded">Fragment.exe</span> and enter your license key when prompted.</>,
                "Open Roblox (Web Client, not UWP). Wait for the injection confirmation toast in the bottom right.",
                "Paste your script and click execute. Happy hacking.",
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
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

