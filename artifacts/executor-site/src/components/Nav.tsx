import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const NAV_ITEMS = [
  "Home",
  "Download",
  "About",
  "Build",
  "Status",
  "Socials",
  "Credits",
];

export const Nav: React.FC<NavProps> = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D11]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-2"
            onClick={() => setActivePage("Home")}
          >
            <img
              src="/attached_assets/Fragment_1784312093756.jpg"
              alt="Fragment"
              className="w-8 h-8 rounded-lg object-cover box-shadow-neon-purple"
            />
            <span className="font-mono text-xl font-bold tracking-widest text-white text-shadow-neon-purple">
              FRAGMENT
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activePage === item;
                return (
                  <button
                    key={item}
                    onClick={() => setActivePage(item)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium font-mono uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary box-shadow-neon-purple"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#16161F] border-b border-white/5 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_ITEMS.map((item) => {
                const isActive = activePage === item;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      setActivePage(item);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-3 rounded-lg text-base font-mono uppercase tracking-wider ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-2 border-primary box-shadow-neon-purple"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
