import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Lock, Eye, EyeOff, RefreshCw, Database,
  Zap, FileCode, Wrench, FolderOpen, Plus, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  loginAdmin, loadConfig, saveConfig,
  AdminConfig, ApiConfig, ApiStatus, Release, DEFAULTS,
} from "../store/adminStore";

// ── Shared styles ────────────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0D0D11] border border-white/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-white font-mono text-sm transition-all";
const labelCls = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2";

// ── Helpers ──────────────────────────────────────────────────────────────────
const StatusSelect: React.FC<{ value: ApiStatus; onChange: (v: ApiStatus) => void }> = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value as ApiStatus)} className={inputCls + " appearance-none cursor-pointer"}>
    <option value="up">✅ Operational (Up)</option>
    <option value="down">🔴 Down</option>
    <option value="roblox_downgrade">⚠️ Roblox Downgrade Required</option>
  </select>
);

// ── Release editor ───────────────────────────────────────────────────────────
const ReleaseEditor: React.FC<{
  releases: Release[];
  onChange: (r: Release[]) => void;
}> = ({ releases, onChange }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const idRef = useRef(0);

  const addRelease = () => {
    const id = `r${Date.now()}_${idRef.current++}`;
    const newRelease: Release = { id, version: "", date: "", changelog: "" };
    onChange([newRelease, ...releases]);
    setExpanded(id);
  };

  const update = (id: string, field: keyof Release, val: string) =>
    onChange(releases.map((r) => (r.id === id ? { ...r, [field]: val } : r)));

  const remove = (id: string) => onChange(releases.filter((r) => r.id !== id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelCls + " mb-0"}>Release History</label>
        <button
          onClick={addRelease}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg font-mono text-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Release
        </button>
      </div>

      {releases.length === 0 && (
        <p className="text-xs text-gray-600 font-mono py-3 text-center border border-dashed border-white/10 rounded-xl">
          No releases yet. Click "Add Release" to add one.
        </p>
      )}

      <div className="space-y-2">
        {releases.map((r) => (
          <div key={r.id} className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D0D11] hover:bg-white/5 transition-colors text-left"
            >
              <span className="font-mono text-sm text-white">
                {r.version || <span className="text-gray-500 italic">Untitled</span>}
                {r.date && <span className="text-gray-500 ml-3 text-xs">{r.date}</span>}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); remove(r.id); }}
                  className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === r.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === r.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3 border-t border-white/10 bg-[#16161F]">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Version</label>
                        <input value={r.version} onChange={(e) => update(r.id, "version", e.target.value)} placeholder="e.g. v4.3.0" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Release Date</label>
                        <input value={r.date} onChange={(e) => update(r.id, "date", e.target.value)} placeholder="e.g. Jan 18, 2026" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Changelog</label>
                      <textarea value={r.changelog} onChange={(e) => update(r.id, "changelog", e.target.value)} placeholder="What changed in this release..." rows={4} className={inputCls + " resize-none"} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── API Config tab content ───────────────────────────────────────────────────
const ApiConfigPanel: React.FC<{
  value: ApiConfig;
  onChange: (v: ApiConfig) => void;
}> = ({ value, onChange }) => {
  const set = <K extends keyof ApiConfig>(key: K, v: ApiConfig[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Status</label>
        <StatusSelect value={value.status} onChange={(v) => set("status", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>UNC %</label>
          <input value={value.uncPercent} onChange={(e) => set("uncPercent", e.target.value)} placeholder="e.g. 98" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>sUNC %</label>
          <input value={value.suncPercent} onChange={(e) => set("suncPercent", e.target.value)} placeholder="e.g. 95" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea value={value.description} onChange={(e) => set("description", e.target.value)} placeholder="Shown on the Download page" rows={3} className={inputCls + " resize-none"} />
      </div>

      <div>
        <label className={labelCls}>Supported Roblox Version</label>
        <input value={value.supportedVersion} onChange={(e) => set("supportedVersion", e.target.value)} placeholder="e.g. 2.640.xxx" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Download URL</label>
        <input value={value.downloadUrl} onChange={(e) => set("downloadUrl", e.target.value)} placeholder="https://..." className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>VirusTotal Scan URL</label>
          <input value={value.virusTotalUrl} onChange={(e) => set("virusTotalUrl", e.target.value)} placeholder="https://virustotal.com/..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>VT Detections</label>
          <input value={value.virusTotalDetections} onChange={(e) => set("virusTotalDetections", e.target.value)} placeholder="e.g. 0/72" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Preview Image URL</label>
        <input value={value.previewImage} onChange={(e) => set("previewImage", e.target.value)} placeholder="https://... (shown as a preview on the Download page)" className={inputCls} />
        {value.previewImage && (
          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-48">
            <img src={value.previewImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        )}
      </div>

      <div className="border-t border-white/5 pt-5">
        <ReleaseEditor releases={value.releases} onChange={(r) => set("releases", r)} />
      </div>
    </div>
  );
};

// ── Tab definition ───────────────────────────────────────────────────────────
type TabId = "velocity" | "xeno" | "build" | "maintenance";

const TABS: { id: TabId; label: string; icon: React.ElementType; accent?: string }[] = [
  { id: "velocity", label: "Velocity API", icon: Zap, accent: "text-primary" },
  { id: "xeno",     label: "Xeno API",     icon: FileCode, accent: "text-cyan-400" },
  { id: "build",    label: "Build Files",  icon: FolderOpen },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
];

// ── Main Admin component ─────────────────────────────────────────────────────
export const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<TabId>("velocity");
  const [config, setConfig] = useState<AdminConfig>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    loadConfig().then(setConfig).finally(() => setLoading(false));
  }, [authed]);

  const handleLogin = async () => {
    setLoggingIn(true);
    setLoginErr("");
    const err = await loginAdmin(pw);
    setLoggingIn(false);
    if (err) { setLoginErr(err); } else { setAuthed(true); setPw(""); }
  };

  const handleReload = () => {
    setLoading(true);
    loadConfig().then(setConfig).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    setSaveState("saving");
    setSaveError("");
    try {
      await saveConfig(config);
      setSaveState("ok");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 4000);
    }
  };

  const set = <K extends keyof AdminConfig>(key: K, val: AdminConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: val }));

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0D0D11] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-[#16161F] border border-primary/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-white text-lg">ADMIN PANEL</h1>
              <p className="text-xs text-gray-500 font-mono">Fragment Internal</p>
            </div>
          </div>
          <label className={labelCls}>Password</label>
          <div className="relative mb-4">
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setLoginErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && !loggingIn && handleLogin()}
              placeholder="Enter admin password"
              className={inputCls + (loginErr ? " border-red-500" : "")}
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {loginErr && <p className="text-red-400 text-xs font-mono mb-4">{loginErr}</p>}
          <button
            onClick={handleLogin}
            disabled={loggingIn || !pw}
            className="w-full py-3 bg-primary text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loggingIn ? "Verifying…" : "Access Panel"}
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Admin panel ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D11] pt-10 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-white text-xl tracking-widest">FRAGMENT ADMIN</h1>
              <p className="text-xs text-gray-500 font-mono">Neon Database · Internal Configuration</p>
            </div>
          </div>
          <button
            onClick={handleReload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/30 font-mono text-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Reload"}
          </button>
        </div>

        {/* Global version */}
        <div className="bg-[#16161F] border border-white/5 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <label className={labelCls}>Global Version Number</label>
            <input
              value={config.version}
              onChange={(e) => set("version", e.target.value)}
              placeholder="e.g. v4.2.1"
              className={inputCls}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0D0D11] border border-white/10 rounded-2xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap flex-1 justify-center transition-all ${
                  active
                    ? "bg-[#16161F] text-white border border-white/10 shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active && tab.accent ? tab.accent : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab panels */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500 font-mono text-sm">
            <RefreshCw className="w-4 h-4 animate-spin mr-3" /> Loading from database…
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="bg-[#16161F] border border-white/5 rounded-2xl p-6"
            >
              {activeTab === "velocity" && (
                <ApiConfigPanel value={config.velocityApi} onChange={(v) => set("velocityApi", v)} />
              )}

              {activeTab === "xeno" && (
                <ApiConfigPanel value={config.xenoApi} onChange={(v) => set("xenoApi", v)} />
              )}

              {activeTab === "build" && (
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Velocity Build File URL</label>
                    <input
                      value={config.buildFiles.velocityBuildFile}
                      onChange={(e) => set("buildFiles", { ...config.buildFiles, velocityBuildFile: e.target.value })}
                      placeholder="https://... or leave empty"
                      className={inputCls}
                    />
                    <p className="text-xs text-gray-600 font-mono mt-1.5">Used on the Build page as the Velocity download link.</p>
                  </div>
                  <div>
                    <label className={labelCls}>Xeno Build File URL</label>
                    <input
                      value={config.buildFiles.xenoBuildFile}
                      onChange={(e) => set("buildFiles", { ...config.buildFiles, xenoBuildFile: e.target.value })}
                      placeholder="https://... or leave empty"
                      className={inputCls}
                    />
                    <p className="text-xs text-gray-600 font-mono mt-1.5">Used on the Build page as the Xeno download link.</p>
                  </div>
                </div>
              )}

              {activeTab === "maintenance" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-5 p-5 border border-amber-500/20 bg-amber-500/5 rounded-xl">
                    <Wrench className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono font-bold text-amber-400 text-sm mb-1">Maintenance Mode</p>
                      <p className="text-xs text-gray-400 font-mono leading-relaxed">
                        When enabled, all visitors will see a maintenance page instead of the site.
                        Admins can still log in from the maintenance page to access the site.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => set("maintenance", !config.maintenance)}
                    className={`flex items-center justify-between p-5 border rounded-xl cursor-pointer transition-all ${
                      config.maintenance
                        ? "border-amber-500/40 bg-amber-500/10"
                        : "border-white/10 bg-[#0D0D11] hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p className="font-mono font-bold text-white mb-0.5">
                        {config.maintenance ? "🔴 Maintenance is ON" : "🟢 Maintenance is OFF"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {config.maintenance
                          ? "Visitors see the maintenance page. Click to disable."
                          : "Site is accessible to all visitors. Click to enable."}
                      </p>
                    </div>
                    {/* Toggle pill */}
                    <div className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${config.maintenance ? "bg-amber-500" : "bg-white/20"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.maintenance ? "left-7" : "left-1"}`} />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 font-mono">
                    Remember to click "Save to Database" below for the change to take effect site-wide.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Save bar */}
        {!loading && (
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {saveState === "saving" ? "Saving…" : "Save to Database"}
            </button>
            {saveState === "ok" && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-green-400 font-mono text-sm">
                ✓ Saved to database
              </motion.span>
            )}
            {saveState === "error" && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 font-mono text-sm">
                ✗ {saveError || "Save failed"}
              </motion.span>
            )}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-600 font-mono">Changes are saved to your Neon database and reflected site-wide.</p>
      </div>
    </div>
  );
};
