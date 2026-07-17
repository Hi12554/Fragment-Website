import React from "react";
import { motion } from "framer-motion";
import { Terminal, ShieldAlert, Cpu, ArrowRight } from "lucide-react";

export const Home: React.FC<{ setActivePage: (p: string) => void }> = ({
  setActivePage,
}) => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 mb-4"
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-success box-shadow-neon-green"
          />
          <span className="text-success text-sm font-mono tracking-widest font-bold">
            STATUS: UNDETECTED
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-7xl md:text-9xl font-mono font-bold text-white text-shadow-neon-purple tracking-tighter"
        >
          ZENON
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mx-auto"
        >
          Next-generation Roblox script execution.{" "}
          <br className="hidden md:block" />
          <span className="text-white">Undetected. Unstoppable.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <button
            onClick={() => setActivePage("Download")}
            className="group relative px-8 py-4 bg-primary text-white font-mono font-bold uppercase tracking-widest overflow-hidden transition-all hover:scale-105 box-shadow-neon-purple w-full sm:w-auto rounded-xl"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-2">
              Get Started{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={() => setActivePage("Build")}
            className="px-8 py-4 bg-card text-white font-mono font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 transition-all w-full sm:w-auto rounded-xl"
          >
            Developer API
          </button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
      >
        {/* Feature 1 */}
        <div className="bg-card border border-white/5 p-8 rounded-2xl hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:box-shadow-neon-purple transition-all">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-mono font-bold text-white mb-3">
            Hyper Performance
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Sub-50ms injection. Custom Lua 5.4 VM with JIT compilation for
            maximum execution speed without crashing.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-card border border-white/5 p-8 rounded-2xl hover:border-success/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl group-hover:bg-success/20 transition-colors" />
          <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:box-shadow-neon-cyan transition-all">
            <ShieldAlert className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-xl font-mono font-bold text-white mb-3">
            Hyperion Safe
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Advanced memory obfuscation bypasses Roblox's Byfron/Hyperion
            anti-cheat. Zero detected bans in 2024.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-card border border-white/5 p-8 rounded-2xl hover:border-secondary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:box-shadow-neon-cyan transition-all">
            <Terminal className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-xl font-mono font-bold text-white mb-3">
            Full Customization
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Build your own executor skin with the Zenon API. Unlimited UI
            themes, custom bootstrapper, and white-labeling.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
