import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Fragment release: July 27, 2026 12:00 PM CST (UTC-6) = 18:00:00 UTC
const RELEASE_UTC = new Date("2026-07-27T18:00:00Z");

function getTimeLeft() {
  const now = new Date();
  const diff = RELEASE_UTC.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function getLocalReleaseTime() {
  return RELEASE_UTC.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

interface UnitProps {
  value: number;
  label: string;
}

const Unit: React.FC<UnitProps> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-card border border-white/10 rounded-xl overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
      <span className="relative font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
  </div>
);

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
          <span className="font-mono text-sm font-bold text-primary tracking-widest uppercase">
            Fragment Released
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Fragment Release
        </span>
      </div>

      <div className="flex items-end gap-3 sm:gap-4">
        <Unit value={timeLeft.days} label="Days" />
        <span className="font-mono text-2xl text-muted-foreground mb-5 leading-none">:</span>
        <Unit value={timeLeft.hours} label="Hours" />
        <span className="font-mono text-2xl text-muted-foreground mb-5 leading-none">:</span>
        <Unit value={timeLeft.minutes} label="Minutes" />
        <span className="font-mono text-2xl text-muted-foreground mb-5 leading-none">:</span>
        <Unit value={timeLeft.seconds} label="Seconds" />
      </div>

      <p className="text-xs text-muted-foreground font-mono">
        {getLocalReleaseTime()}
      </p>
    </motion.div>
  );
};
