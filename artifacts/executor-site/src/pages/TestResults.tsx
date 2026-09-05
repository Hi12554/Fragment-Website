import React from "react";
import { motion } from "framer-motion";
import { FlaskConical, ExternalLink, Terminal } from "lucide-react";

interface TestLine {
  label: string;
  value: string;
  url?: string;
  status: "pass" | "warn" | "fail";
}

interface ApiResult {
  name: string;
  apiVersion: string;
  robloxVersion: string;
  lines: TestLine[];
  links?: { label: string; url: string }[];
}

function statusColor(status: TestLine["status"]) {
  switch (status) {
    case "pass":
      return "text-success";
    case "warn":
      return "text-amber-400";
    case "fail":
      return "text-destructive";
  }
}

const IN_EXECUTOR: ApiResult[] = [
  {
    name: "Fragment Velocity API",
    apiVersion: "v1.3.7",
    robloxVersion: "version-e7d81637d42c4b23",
    lines: [
      { label: "UNC TEST 1", value: "99% (81/82)", status: "pass" },
      { label: "UNC TEST 2", value: "99% (81/82)", status: "pass" },
      { label: "SUNC TEST 1", value: "96% (83/86)", url: "https://r.sunc.su/DvzMlXNpYP", status: "pass" },
      { label: "SUNC TEST 2", value: "96% (83/86)", url: "https://r.sunc.su/DvzMlXNpYP", status: "pass" },
      { label: "MYRAD TEST 1", value: "100% (140/140)", status: "pass" },
      { label: "MYRAD TEST 2", value: "100% (140/140)", status: "pass" },
      { label: "VULNERABILITY TEST 1", value: "100% (159/159)", status: "warn" },
      { label: "VULNERABILITY TEST 2", value: "100% (159/159)", status: "warn" },
    ],
    links: [
      { label: "Velocity SUNC Test 1", url: "https://r.sunc.su/KgsOCHYCbO" },
      { label: "Velocity SUNC Test 2", url: "https://r.sunc.su/nmHJpaXoER" },
    ],
  },
  {
    name: "Fragment Xeno API",
    apiVersion: "v1.3.60",
    robloxVersion: "version-d584fb6c717a43d9",
    lines: [
      { label: "UNC TEST 1", value: "79% (65/82)", status: "warn" },
      { label: "UNC TEST 2", value: "79% (65/82)", status: "warn" },
      { label: "SUNC TEST 1", value: "FAILED", status: "fail" },
      { label: "SUNC TEST 2", value: "FAILED", status: "fail" },
      { label: "MYRAD TEST 1", value: "37% (52/140)", status: "fail" },
      { label: "MYRAD TEST 2", value: "37% (52/140)", status: "fail" },
      { label: "VULNERABILITY TEST 1", value: "94% (150/159)", status: "pass" },
      { label: "VULNERABILITY TEST 2", value: "94% (150/159)", status: "pass" },
    ],
  },
];

const TerminalCard: React.FC<{ api: ApiResult; index: number }> = ({ api, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-card border border-white/5 rounded-2xl overflow-hidden"
  >
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      <h3 className="font-mono font-bold text-lg text-white">{api.name}</h3>
      <Terminal className="w-4 h-4 text-gray-600" />
    </div>

    {/* Terminal body */}
    <div className="bg-[#0A0A0E] px-6 py-5 font-mono text-sm overflow-x-auto">
      <p className="text-gray-500">
        API Version Tested: <span className="text-gray-300">{api.apiVersion}</span>
      </p>
      <p className="text-gray-500 mb-3">
        Roblox Version Tested: <span className="text-gray-300">{api.robloxVersion}</span>
      </p>

      <div className="space-y-1">
        {api.lines.map((line) => (
          <div key={line.label} className="flex flex-wrap items-baseline gap-x-2">
            <span className={statusColor(line.status)}>+</span>
            <span className="text-gray-300">{line.label}:</span>
            <span className={statusColor(line.status)}>{line.value}</span>

            {line.url && (
              <a
                href={line.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline break-all text-xs"
              >
                {line.url}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Links */}
    {api.links && api.links.length > 0 && (
      <div className="px-6 py-4 border-t border-white/5 flex flex-wrap gap-3">
        {api.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            {link.label}
          </a>
        ))}
      </div>
    )}
  </motion.div>
);

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 mb-6">
    <FlaskConical className="w-5 h-5 text-primary" />
    <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">{label}</h2>
  </div>
);

export const TestResults: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-12">
        <p className="text-xs font-mono tracking-[0.3em] text-primary/70 uppercase mb-3">
          Compatibility Benchmarks
        </p>

        <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white mb-3">
          TEST RESULTS
        </h1>

        <p className="text-muted-foreground text-sm font-mono">
          UNC, SUNC, MYRAD, and vulnerability benchmark results for every API Fragment integrates with.
        </p>
      </div>

      <section>
        <SectionHeader label="API's In Executor" />

        <div className="space-y-6">
          {IN_EXECUTOR.map((api, i) => (
            <TerminalCard key={api.name} api={api} index={i} />
          ))}
        </div>
      </section>

      <div className="mt-12 bg-[#0A0A0E] border border-white/5 p-6 rounded-2xl text-center">
        <p className="font-mono text-sm text-gray-400">
          Results are updated as new API versions and Roblox builds release.
        </p>
      </div>
    </motion.div>
  );
};
