import React from "react";
import { motion } from "framer-motion";

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
          Fragment was built for developers and power users who demand performance,
          stability, and creative freedom in Roblox scripting. We saw a
          landscape cluttered with malware-ridden, unstable executors and
          decided to build something different: a surgical, professional-grade
          tool with zero compromises. We are the bridge between raw exploit
          capability and polished software engineering.
        </p>
      </div>
    </motion.div>
  );
};
