import React from "react";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      <div className="max-w-3xl w-full">
        {/* Decorative top line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-12" />

        {/* Label */}
        <p className="text-xs font-mono tracking-[0.3em] text-primary/70 uppercase mb-4 text-center">
          Our Mission
        </p>

        {/* Glowing heading */}
        <h1 className="text-5xl sm:text-6xl font-mono font-black text-white text-center mb-12 leading-tight"
          style={{ textShadow: "0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(168,85,247,0.15)" }}
        >
          FRAGMENT
        </h1>

        {/* Mission card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative rounded-2xl p-[1px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.4) 0%, rgba(6,182,212,0.15) 50%, rgba(168,85,247,0.1) 100%)"
          }}
        >
          <div className="bg-[#16161F] rounded-2xl px-8 py-10 sm:px-12 sm:py-14 relative">
            {/* Corner accents */}
            <span className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary/50 rounded-tl" />
            <span className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-primary/50 rounded-tr" />
            <span className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-primary/50 rounded-bl" />
            <span className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-primary/50 rounded-br" />

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-sans text-center">
              Fragment was built for developers and power users who demand performance,
              stability, and creative freedom in Roblox scripting. We saw a
              landscape cluttered with malware-ridden, unstable executors and
              decided to build something different: a surgical, professional-grade
              tool with zero compromises. We are the bridge between raw exploit
              capability and polished software engineering.
            </p>
          </div>
        </motion.div>

        {/* Decorative bottom line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mt-12" />
      </div>
    </motion.div>
  );
};
