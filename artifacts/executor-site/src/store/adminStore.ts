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

const DEFAULTS: AdminConfig = {
  version: 'v4.2.1',
  maintenance: false,
  velocityApi: { ...DEFAULT_API },
  xenoApi: { ...DEFAULT_API },
  buildFiles: {
    velocityBuildFile: '',
    xenoBuildFile: '',
  },
};

const KEY = 'fragment_admin_config';

export function getConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
      velocityApi: { ...DEFAULT_API, ...parsed.velocityApi },
      xenoApi: { ...DEFAULT_API, ...parsed.xenoApi },
      buildFiles: { ...DEFAULTS.buildFiles, ...parsed.buildFiles },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function saveConfig(config: AdminConfig): void {
  localStorage.setItem(KEY, JSON.stringify(config));
}

export function getStatusLabel(status: ApiStatus): string {
  switch (status) {
    case 'up': return 'Operational';
    case 'down': return 'Down';
    case 'roblox_downgrade': return 'Roblox Downgrade Required';
  }
}

export const ADMIN_PASSWORD = 'dairyqueen12';
