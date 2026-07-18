import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Lock, Eye, EyeOff, RefreshCw, Database } from "lucide-react";
import {
  loginAdmin,
  loadConfig,
  saveConfig,
  AdminConfig,
  ApiConfig,
  ApiStatus,
  DEFAULTS,
} from "../store/adminStore";

const inputCls =
  "w-full bg-[#0D0D11] border border-white/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-white font-mono text-sm transition-all";

const labelCls =
  "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2";

const StatusSelect: React.FC<{
  value: ApiStatus;
  onChange: (v: ApiStatus) => void;
}> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as ApiStatus)}
    className={inputCls + " appearance-none cursor-pointer"}
  >
    <option value="up">✅ Operational (Up)</option>
    <option value="down">🔴 Down</option>
    <option value="roblox_downgrade">⚠️ Roblox Downgrade Required</option>
  </select>
);

const ApiSection: React.FC<{
  title: string;
  accent?: "purple" | "cyan";
  value: ApiConfig;
  onChange: (v: ApiConfig) => void;
}> = ({ title, accent, value, onChange }) => {
  const setField = <K extends keyof ApiConfig>(key: K, v: ApiConfig[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <Section title={title} accent={accent}>
      <div>
        <label className={labelCls}>Status</label>
        <StatusSelect value={value.status} onChange={(v) => setField("status", v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>UNC %</label>
          <input
            value={value.uncPercent}
            onChange={(e) => setField("uncPercent", e.target.value)}
            placeholder="e.g. 98"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>sUNC %</label>
          <input
            value={value.suncPercent}
            onChange={(e) => setField("suncPercent", e.target.value)}
            placeholder="e.g. 95"
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Supported Roblox Version</label>
        <input
          value={value.supportedVersion}
          onChange={(e) => setField("supportedVersion", e.target.value)}
          placeholder="e.g. 2.640.xxx"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={value.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Short description shown on Download page"
          rows={3}
          className={inputCls + " resize-none"}
        />
      </div>
      <div>
        <label className={labelCls}>Download URL</label>
        <input
          value={value.downloadUrl}
          onChange={(e) => setField("downloadUrl", e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>VirusTotal URL</label>
          <input
            value={value.virusTotalUrl}
            onChange={(e) => setField("virusTotalUrl", e.target.value)}
            placeholder="https://virustotal.com/..."
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>VT Detections</label>
          <input
            value={value.virusTotalDetections}
            onChange={(e) => setField("virusTotalDetections", e.target.value)}
            placeholder="e.g. 0/72"
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Preview Image URL</label>
        <input
          value={value.previewImage}
          onChange={(e) => setField("previewImage", e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </div>
    </Section>
  );
};

export const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [config, setConfig] = useState<AdminConfig>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  // Load from DB once authed
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    loadConfig()
      .then(setConfig)
      .finally(() => setLoading(false));
  }, [authed]);

  const handleLogin = async () => {
    setLoggingIn(true);
    setLoginErr("");
    const err = await loginAdmin(pw);
    setLoggingIn(false);
    if (err) {
      setLoginErr(err);
    } else {
      setAuthed(true);
      setPw(""); // clear password from memory immediately
    }
  };

  const handleReload = () => {
    setLoading(true);
    loadConfig()
      .then(setConfig)
      .finally(() => setLoading(false));
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

  const set = <K extends keyof AdminConfig>(key: K, value: AdminConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

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
              onChange={(e) => {
                setPw(e.target.value);
                setLoginErr("");
              }}
              onKeyDown={(e) => e.key === "Enter" && !loggingIn && handleLogin()}
              placeholder="Enter admin password"
              className={inputCls + (loginErr ? " border-red-500" : "")}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {loginErr && (
            <p className="text-red-400 text-xs font-mono mb-4">{loginErr}</p>
          )}
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
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-white text-xl tracking-widest">
                FRAGMENT ADMIN
              </h1>
              <p className="text-xs text-gray-500 font-mono">
                Neon Database · Internal Configuration
              </p>
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

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500 font-mono text-sm">
            <RefreshCw className="w-4 h-4 animate-spin mr-3" />
            Loading from database…
          </div>
        ) : (
          <div className="space-y-6">
            <Section title="Global Settings">
              <div>
                <label className={labelCls}>Version Number</label>
                <input
                  value={config.version}
                  onChange={(e) => set("version", e.target.value)}
                  placeholder="e.g. v4.2.1"
                  className={inputCls}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="maintenance"
                  type="checkbox"
                  checked={config.maintenance}
                  onChange={(e) => set("maintenance", e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <label
                  htmlFor="maintenance"
                  className="text-sm font-mono text-gray-300 cursor-pointer"
                >
                  Maintenance Mode
                </label>
              </div>
            </Section>

            <ApiSection
              title="Velocity API"
              accent="purple"
              value={config.velocityApi}
              onChange={(v) => set("velocityApi", v)}
            />

            <ApiSection
              title="Xeno API"
              accent="cyan"
              value={config.xenoApi}
              onChange={(v) => set("xenoApi", v)}
            />

            <Section title="Build Files">
              <div>
                <label className={labelCls}>Velocity Build File URL</label>
                <input
                  value={config.buildFiles.velocityBuildFile}
                  onChange={(e) =>
                    set("buildFiles", {
                      ...config.buildFiles,
                      velocityBuildFile: e.target.value,
                    })
                  }
                  placeholder="https://... or leave empty"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Xeno Build File URL</label>
                <input
                  value={config.buildFiles.xenoBuildFile}
                  onChange={(e) =>
                    set("buildFiles", {
                      ...config.buildFiles,
                      xenoBuildFile: e.target.value,
                    })
                  }
                  placeholder="https://... or leave empty"
                  className={inputCls}
                />
              </div>
            </Section>
          </div>
        )}

        {!loading && (
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {saveState === "saving" ? "Saving…" : "Save to Database"}
            </button>

            {saveState === "ok" && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-400 font-mono text-sm"
              >
                ✓ Saved to database
              </motion.span>
            )}
            {saveState === "error" && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 font-mono text-sm"
              >
                ✗ {saveError || "Save failed"}
              </motion.span>
            )}
          </div>
        )}
        <p className="mt-4 text-xs text-gray-600 font-mono">
          Changes are saved to your Neon database and reflected site-wide.
        </p>
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  accent?: "purple" | "cyan";
  children: React.ReactNode;
}> = ({ title, accent, children }) => (
  <div className="bg-[#16161F] border border-white/5 rounded-2xl p-6">
    <h2
      className={`font-mono font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-white/5 ${
        accent === "cyan"
          ? "text-cyan-400"
          : accent === "purple"
          ? "text-primary"
          : "text-white"
      }`}
    >
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);
