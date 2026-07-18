import React from "react";
import { motion } from "framer-motion";

const TEAM = [
  {
    category: "DEVELOPER",
    members: [
      {
        name: "popfork1",
        color: "border-primary shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        avatar: "https://cdn.discordapp.com/avatars/1132477120665370674/00c878ea66e11aaceb7f94c93973c7f0.webp?size=1280",
      },
    ],
  },
  {
    category: "OLD UI CREATOR",
    members: [
      {
        name: "5Green",
        color: "border-secondary shadow-[0_0_15px_rgba(6,182,212,0.3)]",
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
      className="min-h-screen pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-mono font-bold text-white mb-4 text-shadow-neon-purple">
          CREDITS
        </h2>
        <p className="text-muted-foreground">The minds behind the machine.</p>
      </div>

      <div className="space-y-16">
        {TEAM.map((section) => (
          <div key={section.category}>
            <h3 className="text-xl font-mono font-bold text-white mb-8 border-l-4 border-primary pl-4 tracking-widest">
              {section.category}
            </h3>
            <div className="flex flex-wrap gap-6">
              {section.members.map((member, mIdx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: mIdx * 0.1 }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden transition-all duration-300 group-hover:scale-110 ${member.color}`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {member.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
