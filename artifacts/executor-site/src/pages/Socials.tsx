import React from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaYoutube } from "react-icons/fa";

const SOCIALS = [
  {
    name: "Discord",
    desc: "Join the Community",
    href: "https://discord.gg/VvSK3zUHZP",
    icon: FaDiscord,
    stats: "Join the server",
    color: "#5865F2",
    bg: "from-[#5865F2]/20 to-transparent",
    glow: "hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]",
  },
  {
    name: "YouTube",
    desc: "Watch Tutorials",
    href: "https://www.youtube.com/@FragmentExecutor",
    icon: FaYoutube,
    stats: "Subscribe",
    color: "#FF0000",
    bg: "from-[#FF0000]/20 to-transparent",
    glow: "hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]",
  },
];

export const Socials: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-mono font-bold text-white mb-4">
          COMMUNITY
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Connect with the Fragment community. Get support, share scripts, and
          stay updated on the latest news.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {SOCIALS.map((social, idx) => (
          <motion.a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            key={social.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative overflow-hidden bg-card border border-white/5 rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 ${social.glow}`}
            style={{ "--hover-color": social.color } as React.CSSProperties}
          >
            {/* Background gradient on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${social.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <social.icon
                  className="w-12 h-12 mb-6 text-gray-400 group-hover:text-[var(--hover-color)] transition-colors duration-300"
                />
                <h3 className="text-2xl font-mono font-bold text-white mb-1">
                  {social.name}
                </h3>
                <p className="text-muted-foreground mb-4">{social.desc}</p>
                <div className="inline-flex px-3 py-1 bg-background rounded-full border border-white/5 text-xs font-mono text-gray-300">
                  {social.stats}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--hover-color)] group-hover:bg-[var(--hover-color)]/10 transition-all">
                <svg
                  className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};
