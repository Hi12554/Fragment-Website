export type ApiStatus = 'up' | 'down' | 'roblox_downgrade';

export interface AdminConfig {
  version: string;
  velocityLink: string;
  xenoLink: string;
  velocityStatus: ApiStatus;
  xenoStatus: ApiStatus;
  velocityBuildFile: string;
  xenoBuildFile: string;
}

const DEFAULTS: AdminConfig = {
  version: 'v4.2.1',
  velocityLink: '#',
  xenoLink: '#',
  velocityStatus: 'up',
  xenoStatus: 'up',
  velocityBuildFile: '',
  xenoBuildFile: '',
};

const KEY = 'fragment_admin_config';

export function getConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
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
