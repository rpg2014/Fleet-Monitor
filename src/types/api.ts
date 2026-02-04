// Device and Network Types
export interface Device {
  url: URL;
  hostname?: string;
  status: 'online' | 'offline' | 'loading';
}

export interface NetworkAddress {
  addr: Record<string, string>;
}

export interface NetworkDetails {
  name: string;
  addrs: NetworkAddress[];
}

export interface NetworkResult {
  networks: NetworkDetails[];
}

export interface NetworkStats {
  network_name: string;
  rx_bytes: number;
  tx_bytes: number;
  rx_packets: number;
  tx_packets: number;
  rx_errors: number;
  tx_errors: number;
}

export interface NetworkStatsResult {
  One?: NetworkStats;
  List?: NetworkStats[];
}

// System Stats Types
export interface LoadAverage {
  one: string;
  five: string;
  fifteen: string;
}

export interface SystemStats {
  uptime: string;
  hostname: string;
  cpu_temp: number;
  load_average: LoadAverage;
  networks: NetworkResult;
  net_stats: NetworkStatsResult;
}

// API Query Types
export interface QueryContext {
  queryKey: [string, { url: URL }];
}

// Utility Types
export type DeviceStatus = 'online' | 'offline' | 'loading' | 'error';
