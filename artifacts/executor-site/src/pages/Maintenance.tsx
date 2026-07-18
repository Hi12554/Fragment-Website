import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Lock, Eye, EyeOff, X } from 'lucide-react';
import { ADMIN_PASSWORD } from '../store/adminStore';

interface MaintenanceProps {
  onUnlock: () => void;
}

export const Maintenance: React.FC<MaintenanceProps> = ({ onUnlock }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('fragment_maintenance_bypass', '1');
      onUnlock();
    } else {
      setErr(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl relative z-10"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <Wrench className="w-9 h-9 text-primary" />
        </div>

        <img src="/logo.jpg" alt="Fragment" className="w-16 h-16 rounded-xl object-cover mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)]" />

        <h1 className="text-4xl font-mono font-bold text-white mb-3 tracking-widest">
          UNDER MAINTENANCE
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Fragment is currently undergoing scheduled maintenance.
        </p>
        <p className="text-gray-500 text-sm font-mono mb-10">
          We'll be back shortly. Check our Discord for updates.
        </p>

        <a
          href="https://discord.gg/VvSK3zUHZP"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] rounded-xl font-mono text-sm hover:bg-[#5865F2]/30 transition-colors mb-8"
        >
          Join Discord
        </a>

        <div>
          <button
            onClick={() => setShowLogin(true)}
            className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1.5 mx-auto"
          >
            <Lock className="w-3 h-3" /> Admin Login
          </button>
        </div>
      </motion.div>

      {/* Login modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#16161F] border border-primary/30 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-mono font-bold text-white">ADMIN LOGIN</h2>
                </div>
                <button onClick={() => { setShowLogin(false); setErr(false); setPw(''); }} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative mb-3">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setErr(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Admin password"
                  className="w-full bg-[#0D0D11] border border-white/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-white font-mono text-sm"
                  autoFocus
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {err && <p className="text-red-400 text-xs font-mono mb-3">Incorrect password.</p>}
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-primary text-white font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors"
              >
                Unlock Site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
