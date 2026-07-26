import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadCloud, FileArchive, Terminal as TermIcon,
  AlertTriangle, ChevronDown, ShieldCheck,
  ExternalLink, Clock, RefreshCw, X, ZoomIn,
} from "lucide-react";
import { loadPublicConfig, AdminConfig, ApiConfig, ApiStatus } from "../store/adminStore";

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
