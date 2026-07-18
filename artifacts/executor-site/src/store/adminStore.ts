export type ApiStatus = 'up' | 'down' | 'roblox_downgrade';

export interface Release {
  id: string;
  version: string;
  date: string;
  changelog: string;
}

export interface ApiConfig {
  status: ApiStatus;
  uncPercent: string;
  suncPercent: string;
  description: string;
  supportedVersion: string;
  downloadUrl: string;
  virusTotalUrl: string;
  virusTotalDetections: string;
  previewImage: string;
  releases: Release[];
}

export interface AdminConfig {
  version: string;
  maintenance: boolean;
  velocityApi: ApiConfig;
  xenoApi: ApiConfig;
  buildFiles: {
    velocityBuildFile: string;
    xenoBuildFile: string;
  };
}

const DEFAULT_API: ApiConfig = {
  status: 'up',
  uncPercent: '',
  suncPercent: '',
  description: '',
  supportedVersion: '',
  downloadUrl: '#',
  virusTotalUrl: '',
  virusTotalDetections: '',
  previewImage: '',
  releases: [],
};

export const DEFAULTS: AdminConfig = {
  version: 'v4.2.1',
  maintenance: false,
  velocityApi: { ...DEFAULT_API },
  xenoApi: { ...DEFAULT_API },
  buildFiles: {
    velocityBuildFile: '',
    xenoBuildFile: '',
  },
};

// Legacy localStorage key — kept for local cache
const LS_KEY = 'fragment_admin_config';

// Base path for the API server
const API_BASE = '/api';

// In-memory session token (never persisted to localStorage)
let _sessionToken: string | null = null;

function authHeaders(): HeadersInit {
  return _sessionToken ? { authorization: `Bearer ${_sessionToken}` } : {};
}

function mergeConfig(parsed: Partial<AdminConfig>): AdminConfig {
  return {
    ...DEFAULTS,
    ...parsed,
    velocityApi: { ...DEFAULT_API, ...(parsed.velocityApi ?? {}) },
    xenoApi: { ...DEFAULT_API, ...(parsed.xenoApi ?? {}) },
    buildFiles: { ...DEFAULTS.buildFiles, ...(parsed.buildFiles ?? {}) },
  };
}

/**
 * Authenticate against the server. Returns an error string on failure, null on success.
 * The issued token is stored in memory — never written to localStorage.
 */
export async function loginAdmin(password: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json() as { token?: string; error?: string };
    if (!res.ok || !data.token) {
      return data.error ?? 'Login failed.';
    }
    _sessionToken = data.token;
    return null;
  } catch {
    return 'Could not reach the server.';
  }
}

/** Load config from the database via the API. Falls back to localStorage cache, then defaults. */
export async function loadConfig(): Promise<AdminConfig> {
  try {
    const res = await fetch(`${API_BASE}/admin/config`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json() as { found: boolean; config: Partial<AdminConfig> | null };
      if (data.found && data.config) {
        const merged = mergeConfig(data.config);
        // Update local cache
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // API unavailable — fall through to cache
  }

  // Fallback: return cached config
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return mergeConfig(JSON.parse(raw));
  } catch { /* ignore */ }

  return structuredClone(DEFAULTS);
}

/** Persist config to the database via the API. Also updates the local cache. */
export async function saveConfig(config: AdminConfig): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/config`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Server error ${res.status}`);
  }

  // Update local cache on success
  localStorage.setItem(LS_KEY, JSON.stringify(config));
}

/** Synchronous fallback — reads from local cache only. */
export function getConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    return mergeConfig(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function getStatusLabel(status: ApiStatus): string {
  switch (status) {
    case 'up': return 'Operational';
    case 'down': return 'Down';
    case 'roblox_downgrade': return 'Roblox Downgrade Required';
  }
}
