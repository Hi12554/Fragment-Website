import React from "react";
import { motion } from "framer-motion";
import { Crosshair, Cpu, EyeOff, Code } from "lucide-react";

export const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-16">
        <h2 className="text-3xl font-mono font-bold text-white mb-6 border-b border-white/10 pb-4 inline-block">
          OUR MISSION
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed font-sans">
          Zenon was built for developers and power users who demand performance,
          stability, and creative freedom in Roblox scripting. We saw a
          landscape cluttered with malware-ridden, unstable executors and
          decided to build something different: a surgical, professional-grade
          tool with zero compromises. We are the bridge between raw exploit
          capability and polished software engineering.
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-mono font-bold text-white mb-8">
          STABILITY MILESTONES
        </h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {[
            {
              year: "2022",
              title: "Initial Release",
              desc: "Zenon v1 launches as a private prototype for select developers.",
            },
            {
              year: "2023",
              title: "Hyperion Bypass v1",
              desc: "50,000 active users. First consistent bypass for the new Byfron anti-cheat.",
            },
            {
              year: "2024",
              title: "Zenon API Launch",
              desc: "1M executions daily. Opened the API to allow custom UI wrappers.",
            },
            {
              year: "2025",
              title: "v4.0 Core Rewrite",
              desc: "Complete rebuild of the Lua VM integration. Sub-50ms injection speeds achieved.",
            },
            {
              year: "2026",
              title: "AI-Assisted Engine",
              desc: "v4.2.1 introduces heuristics-based dynamic offset scanning.",
            },
          ].map((item, i) => (
            <div
              key={item.year}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.2)] z-10">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-mono font-bold text-white">
                    {item.title}
                  </h3>
                  <span className="font-mono text-sm text-primary">
                    {item.year}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-mono font-bold text-white mb-8">
          WHY IT'S SAFE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-6 border border-white/5 hover:border-primary/30 transition-colors rounded-2xl group">
            <EyeOff className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-white mb-2">
              Memory Obfuscation
            </h3>
            <p className="text-sm text-muted-foreground">
              We don't leave plain text strings in memory. All payload chunks
              are encrypted and only decrypted exactly when the execution thread
              needs them.
            </p>
          </div>
          <div className="bg-card p-6 border border-white/5 hover:border-success/30 transition-colors rounded-2xl group">
            <Crosshair className="w-8 h-8 text-success mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-white mb-2">
              Kernel-Level Hooks
            </h3>
            <p className="text-sm text-muted-foreground">
              By intercepting API calls at the driver level, we prevent the
              client from ever seeing our threads or allocated memory pages.
            </p>
          </div>
          <div className="bg-card p-6 border border-white/5 hover:border-secondary/30 transition-colors rounded-2xl group">
            <Cpu className="w-8 h-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-white mb-2">
              Stateless Execution
            </h3>
            <p className="text-sm text-muted-foreground">
              Zenon operates entirely in volatile memory. No persistent files
              are dropped into the game directory, leaving zero trace after
              reboot.
            </p>
          </div>
          <div className="bg-card p-6 border border-white/5 hover:border-accent/30 transition-colors rounded-2xl group">
            <Code className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-white mb-2">
              Dynamic Offsets
            </h3>
            <p className="text-sm text-muted-foreground">
              Our scanner automatically finds updated execution addresses when
              Roblox updates, preventing crashes and detection flags.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
