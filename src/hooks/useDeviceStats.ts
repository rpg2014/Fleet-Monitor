import { useQuery } from '@tanstack/react-query';
import type { QueryContext, LoadAverage, NetworkStatsResult } from '../types/api';

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export function useDeviceStats(deviceUrl: URL, enabled = true) {
  const baseUrl = deviceUrl.toString();

  const uptime = useQuery({
    queryKey: ['uptime', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/uptime`),
    enabled,
    refetchInterval: 30000, // 30 seconds
    retry: 2,
  });

  const hostname = useQuery({
    queryKey: ['hostname', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/hostname`),
    enabled,
    retry: 2,
  });

  const cpuTemp = useQuery({
    queryKey: ['cpu_temp', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/cpu_temp`),
    enabled,
    refetchInterval: 5000, // 5 seconds
    retry: 2,
  });

  const loadAverage = useQuery<LoadAverage>({
    queryKey: ['load_average', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/load_average`),
    enabled,
    refetchInterval: 5000, // 5 seconds
    retry: 2,
  });

  const networks = useQuery({
    queryKey: ['networks', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/networks`),
    enabled,
    retry: 2,
  });

  const netStats = useQuery<NetworkStatsResult>({
    queryKey: ['net_stats', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/net_stats`),
    enabled,
    refetchInterval: 5000, // 5 seconds
    retry: 2,
  });

  const isLoading = uptime.isLoading || hostname.isLoading;
  const isError = uptime.isError || hostname.isError;

  return {
    uptime: uptime.data,
    hostname: hostname.data,
    cpuTemp: cpuTemp.data,
    loadAverage: loadAverage.data,
    networks: networks.data,
    netStats: netStats.data,
    isLoading,
    isError,
    error: uptime.error || hostname.error,
  };
}
