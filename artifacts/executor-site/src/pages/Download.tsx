import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadCloud,
  Terminal as TermIcon,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Clock,
  RefreshCw,
  X,
  ZoomIn,
} from "lucide-react";
import {
  loadPublicConfig,
  AdminConfig,
  ApiConfig,
  ApiStatus,
} from "../store/adminStore";

// ── sUNC Configuration ────────────────────────────────────────────────────────
//
// Velocity's sUNC result:
// https://r.sunc.su/DvzMlXNpYP
//
// Put your sUNC widget access key here.
//
// The key is required by the sUNC Widget API.
const VELOCITY_SUNC_SCRAP_ID = "DvzMlXNpYP";
const VELOCITY_SUNC_ACCESS_KEY = "YOUR_SUNC_ACCESS_KEY";

// ── sUNC Widget ────────────────────────────────────────────────────────────────

const SuncWidget: React.FC<{
  scrapId: string;
  accessKey: string;
}> = ({ scrapId, accessKey }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const initialiseWidget = () => {
    const iframe = iframeRef.current;

    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        type: "sunc-widget:loadScrap",
        payload: {
          scrapId,
          key: accessKey,
        },
      },
      "https://sunc.rubis.app"
    );

    iframe.contentWindow.postMessage(
      {
        type: "sunc-widget:setTheme",
        payload: {
          dark: "#0A0A0E",
          light: "#111118",
          lighter: "#15151D",
          sunc: "#B7A0F6",
          suncLighter: "#D1B9FF",
          grey: "#888888",
          lightText: "#E5E5E5",
          success: "#22C55E",
          failure: "#EF4444",
          useDarkLogo: false,
        },
      },
      "https://sunc.rubis.app"
    );
  };

  return (
    <div className="bg-[#0D0D11] border border-white/5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
          Velocity sUNC Results
        </p>

        <p className="text-[11px] font-mono text-gray-500 mt-1">
          Live interactive sUNC benchmark
        </p>
      </div>

      <iframe
        ref={iframeRef}
        id="velocity-sunc-widget"
        src="https://sunc.rubis.app/widget/"
        title="Velocity sUNC Results"
        onLoad={initialiseWidget}
        allowFullScreen
        className="w-full border-0"
        style={{
          height: "610px",
          display: "block",
        }}
      />
    </div>
  );
};

// ── Lightbox ─────────────────────────────────────────────────────────────────

const Lightbox: React.FC<{
  src: string;
  alt: string;
  onClose: () => void;
}> = ({ src, alt, onClose }) => (
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
          <X className="w-4 h-4" />
          Close
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

const DowngradeItem: React.FC<{
  label: string;
  supportedVersion: string;
  downgradeLink: string;
}> = ({ label, supportedVersion, downgradeLink }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-amber-400 font-mono text-xs"
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {label} API: Roblox Downgrade Required
        </span>

        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-0.5 border-t border-amber-500/20">
              <p className="text-amber-300/80 text-xs font-mono leading-relaxed">
                Downgrade Roblox{" "}
                {supportedVersion ? (
                  <>
                    to{" "}
                    <span className="text-amber-200 font-bold">
                      {supportedVersion}
                    </span>{" "}
                  </>
                ) : (
                  ""
                )}
                to support Fragment {label}.
              </p>

              {downgradeLink && downgradeLink !== "#" && (
                <a
                  href={downgradeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2.5 text-amber-300 hover:text-amber-200 font-mono text-xs font-bold underline underline-offset-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Get the downgrade for {label}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function StatusBadge({
  items,
}: {
  items: {
    label: string;
    status: ApiStatus;
    supportedVersion: string;
    downgradeLink: string;
  }[];
}) {
  const down = items.filter((i) => i.status !== "up");

  if (down.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4 space-y-2">
      {down.map((i) => (
        <DowngradeItem
          key={i.label}
          label={i.label}
          supportedVersion={i.supportedVersion}
          downgradeLink={i.downgradeLink}
        />
      ))}
    </div>
  );
}

function statusDot(status: ApiStatus) {
  return status === "up" ? (
    <span className="inline-block w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] mr-1.5 flex-shrink-0" />
  ) : (
    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5 flex-shrink-0" />
  );
}

function statusLabel(status: ApiStatus) {
  return status === "up" ? "Operational" : "Downgrade Required";
}

// ── Per-API stat section ──────────────────────────────────────────────────────

const ApiStatSection: React.FC<{
  label: string;
  accentClass: string;
  cfg: ApiConfig;
}> = ({ label, accentClass, cfg }) => {
  if (!cfg.uncPercent && !cfg.suncPercent && !cfg.supportedVersion) {
    return null;
  }

  return (
    <div className="bg-[#0D0D11] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p
          className={`text-xs font-mono font-bold uppercase tracking-widest ${accentClass}`}
        >
          {label}
        </p>

        <div
          className={`flex items-center text-xs font-mono ${
            cfg.status === "up" ? "text-green-400" : "text-amber-400"
          }`}
        >
          {statusDot(cfg.status)}
          {statusLabel(cfg.status)}
        </div>
      </div>

      {(cfg.uncPercent || cfg.suncPercent) && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {cfg.uncPercent && (
            <div className="bg-black/20 rounded-lg px-3 py-2.5 text-center border border-white/5">
              <div
                className={`font-mono font-bold text-lg ${accentClass}`}
              >
                {cfg.uncPercent}%
              </div>

              <div className="text-xs text-gray-500 font-mono mt-0.5">
                UNC
              </div>
            </div>
          )}

          {cfg.suncPercent && (
            <div className="bg-black/20 rounded-lg px-3 py-2.5 text-center border border-white/5">
              <div
                className={`font-mono font-bold text-lg ${accentClass}`}
              >
                {cfg.suncPercent}%
              </div>

              <div className="text-xs text-gray-500 font-mono mt-0.5">
                sUNC
              </div>
            </div>
          )}
        </div>
      )}

      {cfg.supportedVersion && (
        <div className="bg-black/20 rounded-lg px-4 py-2.5 border border-white/5 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-mono whitespace-nowrap">
            Supported Roblox
          </div>

          <div className="font-mono font-bold text-sm text-white text-right break-all">
            {cfg.supportedVersion}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Single executor card ──────────────────────────────────────────────────────

const ExecutorCard: React.FC<{
  name: string;
  subtitle: string;
  icon: React.ElementType;
  accentClass: string;
  glowClass: string;
  cfg: ApiConfig;
  velocityCfg: ApiConfig;
  xenoCfg: ApiConfig;
}> = ({
  name,
  subtitle,
  icon: Icon,
  accentClass,
  glowClass,
  cfg,
  velocityCfg,
  xenoCfg,
}) => {
  const [showReleases, setShowReleases] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

      <div
        className={`bg-card border ${accentClass.replace(
          "text-",
          "border-"
        )}/30 rounded-2xl relative overflow-hidden flex flex-col`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${accentClass.replace(
            "text-",
            "via-"
          )} to-transparent opacity-60`}
        />

        <div className="p-7 flex flex-col flex-1">
          {/* Header */}

          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accentClass.replace(
                  "text-",
                  "bg-"
                )}/15 ${glowClass}`}
              >
                <Icon className={`w-7 h-7 ${accentClass}`} />
              </div>

              <div>
                <h3 className="text-xl font-mono font-bold text-white">
                  {name}
                </h3>

                <p
                  className={`text-xs font-mono tracking-widest uppercase ${accentClass}/70`}
                >
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="text-right">
              {latestRelease?.version && (
                <div className="text-xs text-gray-600 font-mono mt-0.5">
                  {latestRelease.version}
                </div>
              )}
            </div>
          </div>

          <StatusBadge
            items={[
              {
                label: "Velocity",
                status: velocityCfg.status,
                supportedVersion: velocityCfg.supportedVersion,
                downgradeLink: velocityCfg.downgradeLink,
              },
              {
                label: "Xeno",
                status: xenoCfg.status,
                supportedVersion: xenoCfg.supportedVersion,
                downgradeLink: xenoCfg.downgradeLink,
              },
            ]}
          />

          {/* Preview image */}

          {cfg.previewImage && (
            <div
              className="rounded-xl overflow-hidden border border-white/10 mb-5 max-h-44 relative group cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={cfg.previewImage}
                alt={`${name} preview`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) =>
                  (e.currentTarget.parentElement!.style.display = "none")
                }
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>
          )}

          {/* Description */}

          {cfg.description && (
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              {cfg.description}
            </p>
          )}

          {/* API stats */}

          {(velocityCfg.uncPercent ||
            velocityCfg.suncPercent ||
            velocityCfg.supportedVersion ||
            xenoCfg.uncPercent ||
            xenoCfg.suncPercent ||
            xenoCfg.supportedVersion) && (
            <div className="space-y-3 mb-5">
              <ApiStatSection
                label="Velocity API"
                accentClass="text-primary"
                cfg={velocityCfg}
              />

              {/* Velocity sUNC Widget */}

              {VELOCITY_SUNC_ACCESS_KEY !== "YOUR_SUNC_ACCESS_KEY" && (
                <SuncWidget
                  scrapId={VELOCITY_SUNC_SCRAP_ID}
                  accessKey={VELOCITY_SUNC_ACCESS_KEY}
                />
              )}

              <ApiStatSection
                label="Xeno API"
                accentClass="text-cyan-400"
                cfg={xenoCfg}
              />
            </div>
          )}

          {/* VirusTotal */}

          {(cfg.virusTotalUrl || cfg.virusTotalDetections) && (
            <div className="flex items-center gap-3 mb-5 bg-[#0D0D11] border border-white/5 rounded-xl px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-mono">
                  VirusTotal Scan
                </p>

                {cfg.virusTotalDetections && (
                  <p className="text-xs font-mono text-green-400 font-bold">
                    {cfg.virusTotalDetections} detections
                  </p>
                )}
              </div>

              {cfg.virusTotalUrl && (
                <a
                  href={cfg.virusTotalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Download button */}

          <a
            href={
              cfg.downloadUrl && cfg.downloadUrl !== "#"
                ? cfg.downloadUrl
                : undefined
            }
            target={
              cfg.downloadUrl && cfg.downloadUrl !== "#"
                ? "_blank"
                : undefined
            }
            rel="noopener noreferrer"
            className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-all rounded-xl text-center block mt-auto ${glowClass} ${accentClass.replace(
              "text-",
              "bg-"
            )} text-white hover:opacity-90`}
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

                {showReleases ? "Hide" : "Show"} release history (
                {cfg.releases.length})

                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showReleases ? "rotate-180" : ""
                  }`}
                />
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
                        <div
                          key={release.id}
                          className="border border-white/10 rounded-xl p-4 bg-[#0D0D11]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`font-mono font-bold text-sm ${accentClass}`}
                            >
                              {release.version}
                            </span>

                            <span className="text-xs text-gray-500 font-mono">
                              {release.date}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {release.changelog}
                          </p>
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

// ── Download page ─────────────────────────────────────────────────────────────

export const Download: React.FC = () => {
  const [cfg, setCfg] = useState<AdminConfig | null>(null);

  useEffect(() => {
    loadPublicConfig().then(setCfg);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mono font-bold text-white mb-4 text-shadow-neon-purple">
          DOWNLOAD
        </h2>

        <p className="text-muted-foreground">
          Fragment — powered by Velocity &amp; Xeno.
        </p>
      </div>

      {!cfg ? (
        <div className="flex items-center justify-center py-24 text-gray-500 font-mono text-sm gap-3">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading…
        </div>
      ) : (
        <>
          <div className="max-w-md mx-auto mb-12">
            <ExecutorCard
              name="Fragment"
              subtitle="Velocity × Xeno"
              icon={DownloadCloud}
              accentClass="text-primary"
              glowClass="shadow-[0_0_20px_rgba(168,85,247,0.25)]"
              cfg={cfg.velocityApi}
              velocityCfg={cfg.velocityApi}
              xenoCfg={cfg.xenoApi}
            />
          </div>

          {/* Antivirus warning */}

          <div className="bg-[#1a1400] border border-amber-500/50 rounded-2xl p-4 mb-12 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />

            <div>
              <h4 className="text-amber-500 font-mono font-bold mb-1">
                ⚠ ANTIVIRUS FALSE POSITIVE
              </h4>

              <p className="text-amber-500/80 text-sm">
                Due to the nature of process injection, Fragment may be flagged
                by Windows Defender or other AV software. Disable real-time
                protection temporarily during installation, or add Fragment to
                your exclusions. We do not modify persistent system files.
              </p>
            </div>
          </div>

          {/* Installation steps */}

          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <TermIcon className="w-5 h-5 text-gray-400" />

              <h3 className="font-mono font-bold text-white">
                INSTALLATION_STEPS.md
              </h3>
            </div>

            <div className="p-6 font-mono text-sm space-y-4 text-gray-300">
              {[
                "Disable Windows Defender real-time protection temporarily, or add Fragment to your exclusions.",
                "Extract the downloaded ZIP or run the installer as Administrator.",
                <>
                  Launch{" "}
                  <span className="text-white bg-white/10 px-1 py-0.5 rounded">
                    Fragment.exe
                  </span>
                  .
                </>,
                "Open Roblox.",
                "Paste your script and click execute.",
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-primary flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

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
