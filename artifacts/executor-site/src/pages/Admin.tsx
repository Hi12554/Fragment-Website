import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { getConfig, saveConfig, AdminConfig, ApiStatus } from "../store/adminStore";

const ADMIN_PASSWORD = "fragment2024";

const inputCls =
  "w-full bg-[#0D0D11] border border-white/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-white font-mono text-sm transition-all";

const labelCls = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2";

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

export const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwErr, setPwErr] = useState(false);
  const [config, setConfig] = useState<AdminConfig>(getConfig);
  const [saved, setSaved] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  };

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = <K extends keyof AdminConfig>(key: K, value: AdminConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

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
              onChange={(e) => { setPw(e.target.value); setPwErr(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              className={inputCls + (pwErr ? " border-red-500" : "")}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {pwErr && (
            <p className="text-red-400 text-xs font-mono mb-4">Incorrect password.</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-primary text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors"
          >
            Access Panel
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D11] pt-10 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Fragment" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <h1 className="font-mono font-bold text-white text-xl tracking-widest">FRAGMENT ADMIN</h1>
              <p className="text-xs text-gray-500 font-mono">Internal Configuration Panel</p>
            </div>
          </div>
          <button
            onClick={() => setConfig(getConfig())}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/30 font-mono text-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload
          </button>
        </div>

        <div className="space-y-6">
          {/* Version */}
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
          </Section>

          {/* Velocity API */}
          <Section title="Velocity API" accent="purple">
            <div>
              <label className={labelCls}>Status</label>
              <StatusSelect value={config.velocityStatus} onChange={(v) => set("velocityStatus", v)} />
            </div>
            <div>
              <label className={labelCls}>Download Link</label>
              <input
                value={config.velocityLink}
                onChange={(e) => set("velocityLink", e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Build File URL (for Build page)</label>
              <input
                value={config.velocityBuildFile}
                onChange={(e) => set("velocityBuildFile", e.target.value)}
                placeholder="https://... or leave empty"
                className={inputCls}
              />
            </div>
          </Section>

          {/* Xeno API */}
          <Section title="Xeno API" accent="cyan">
            <div>
              <label className={labelCls}>Status</label>
              <StatusSelect value={config.xenoStatus} onChange={(v) => set("xenoStatus", v)} />
            </div>
            <div>
              <label className={labelCls}>Download Link</label>
              <input
                value={config.xenoLink}
                onChange={(e) => set("xenoLink", e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Build File URL (for Build page)</label>
              <input
                value={config.xenoBuildFile}
                onChange={(e) => set("xenoBuildFile", e.target.value)}
                placeholder="https://... or leave empty"
                className={inputCls}
              />
            </div>
          </Section>
        </div>

        {/* Save */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <Save className="w-5 h-5" /> Save Changes
          </button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-400 font-mono text-sm"
            >
              ✓ Saved successfully
            </motion.span>
          )}
        </div>
        <p className="mt-4 text-xs text-gray-600 font-mono">
          Changes are stored in browser localStorage and reflected site-wide immediately.
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
        accent === "cyan" ? "text-cyan-400" : accent === "purple" ? "text-primary" : "text-white"
      }`}
    >
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);
