export type ApiStatus = 'up' | 'down';

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
  maintenance: false,
  velocityApi: { ...DEFAULT_API },
  xenoApi: { ...DEFAULT_API },
  buildFiles: {
    velocityBuildFile: '',
    xenoBuildFile: '',
  },
};

const LS_KEY = 'fragment_admin_config';
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';

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

export async function loginAdmin(password: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json() as { token?: string; error?: string };
    if (!res.ok || !data.token) return data.error ?? 'Login failed.';
    _sessionToken = data.token;
    return null;
  } catch {
    return 'Could not reach the server.';
  }
}

export async function loadConfig(): Promise<AdminConfig> {
  try {
    const res = await fetch(`${API_BASE}/admin/config`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json() as { found: boolean; config: Partial<AdminConfig> | null };
      if (data.found && data.config) {
        const merged = mergeConfig(data.config);
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch { /* fall through */ }

  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return mergeConfig(JSON.parse(raw));
  } catch { /* ignore */ }

  return structuredClone(DEFAULTS);
}

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

  localStorage.setItem(LS_KEY, JSON.stringify(config));
}

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
  return status === 'up' ? 'Operational' : 'Roblox Downgrade Required';
}
