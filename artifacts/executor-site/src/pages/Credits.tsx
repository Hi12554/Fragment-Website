import React from "react";
import { motion } from "framer-motion";

const TEAM = [
  {
    category: "DEVELOPER",
    accent: "primary",
    glow: "rgba(168,85,247,0.5)",
    border: "rgba(168,85,247,0.4)",
    members: [
      {
        name: "popfork1",
        avatar: "https://cdn.discordapp.com/avatars/1132477120665370674/00c878ea66e11aaceb7f94c93973c7f0.webp?size=1280",
      },
    ],
  },
  {
    category: "OLD UI CREATOR",
    accent: "secondary",
    glow: "rgba(6,182,212,0.5)",
    border: "rgba(6,182,212,0.4)",
    members: [
      {
        name: "5Green",
        avatar: "https://cdn.discordapp.com/avatars/566045062753026098/4149d1153d1c16df240d729bad8d98b9.webp?size=1280",
      },
    ],
  },
];

export const Credits: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="text-center mb-20">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-12" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-xs font-mono tracking-[0.3em] text-primary/70 uppercase mb-4"
        >
          The Team
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl font-mono font-black text-white mb-4"
          style={{ textShadow: "0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(168,85,247,0.15)" }}
        >
          CREDITS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 font-mono text-sm tracking-widest"
        >
          The minds behind the machine.
        </motion.p>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-12" />
      </div>

      {/* Team sections */}
      <div className="flex flex-col gap-20">
        {TEAM.map((section, sIdx) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + sIdx * 0.1, duration: 0.5 }}
          >
            {/* Category label */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: section.glow }}
              />
              <span className="text-xs font-mono tracking-[0.25em] uppercase"
                style={{ color: section.glow.replace("0.5", "0.9") }}
              >
                {section.category}
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Member cards */}
            <div className="flex flex-wrap gap-6">
              {section.members.map((member, mIdx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + sIdx * 0.1 + mIdx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div
                    className="relative rounded-2xl p-[1px] overflow-hidden transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${section.border} 0%, transparent 60%)`,
                    }}
                  >
                    <div className="bg-[#13131A] rounded-2xl px-8 py-8 flex flex-col items-center gap-5 relative overflow-hidden min-w-[180px]">
                      {/* Glow blob */}
                      <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ background: section.glow }}
                      />

                      {/* Avatar */}
                      <div
                        className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 transition-all duration-300 group-hover:ring-4"
                        style={{
                          ringColor: section.border,
                          boxShadow: `0 0 0 2px ${section.border}`,
                        }}
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        {/* Shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Name */}
                      <div className="text-center">
                        <p className="font-mono font-bold text-white text-base tracking-wide">
                          {member.name}
                        </p>
                        <p
                          className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1 opacity-60"
                          style={{ color: section.glow.replace("0.5", "1") }}
                        >
                          {section.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-24" />
    </motion.div>
  );
};
