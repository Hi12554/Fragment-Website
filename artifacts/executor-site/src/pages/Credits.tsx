import React from "react";
import { motion } from "framer-motion";

const TEAM = [
  {
    category: "CORE DEV TEAM",
    members: [
      {
        name: "0xNova",
        role: "Lead Developer",
        desc: "Architect of the injection engine and Hyperion bypass core.",
        color:
          "border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
      },
      {
        name: "crypt0byte",
        role: "Systems Engineer",
        desc: "Memory management, kernel hooks, and anti-detection layers.",
        color:
          "border-secondary text-secondary bg-secondary/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
      },
      {
        name: "velvet.exe",
        role: "UI/UX Lead",
        desc: "Designed the Fragment interface and brand system from scratch.",
        color:
          "border-pink-500 text-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.3)]",
      },
    ],
  },
  {
    category: "FRAGMENT API CONTRIBUTORS",
    members: [
      {
        name: "phantom_api",
        role: "API Core",
        desc: "Built the Fragment scripting API and Lua 5.4 runtime bridge.",
        color: "border-success text-success bg-success/10",
      },
      {
        name: "nullref",
        role: "SDK Developer",
        desc: "Authored the public Fragment SDK and developer documentation.",
        color: "border-success text-success bg-success/10",
      },
    ],
  },
  {
    category: "UI DESIGNERS",
    members: [
      {
        name: "aura.design",
        role: "Motion & Animation",
        desc: "All keyframe animations, transitions, and micro-interactions.",
        color: "border-yellow-500 text-yellow-500 bg-yellow-500/10",
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

      <div className="space-y-20">
        {TEAM.map((section, sIdx) => (
          <div key={section.category}>
            <h3 className="text-xl font-mono font-bold text-white mb-8 border-l-4 border-white pl-4 tracking-widest">
              {section.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.members.map((member, mIdx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: mIdx * 0.1 }}
                  className="bg-card border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-lg ${member.color} transition-all duration-300 group-hover:scale-110`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-white">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
