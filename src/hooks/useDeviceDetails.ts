import { useQuery } from '@tanstack/react-query';
import type { NetworkResult, NetworkStatsResult, LoadAverage } from '../types/api';

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export function useDeviceDetails(deviceUrl: URL, enabled = true) {
  const baseUrl = deviceUrl.toString();

  const uptime = useQuery({
    queryKey: ['uptime', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/uptime`),
    enabled,
    refetchInterval: 30000,
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
    refetchInterval: 5000,
    retry: 2,
  });

  const loadAverage = useQuery<LoadAverage>({
    queryKey: ['load_average', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/load_average`),
    enabled,
    refetchInterval: 5000,
    retry: 2,
  });

  const networks = useQuery<NetworkResult>({
    queryKey: ['networks', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/networks`),
    enabled,
    retry: 2,
  });

  const netStats = useQuery<NetworkStatsResult>({
    queryKey: ['net_stats', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/net_stats`),
    enabled,
    refetchInterval: 5000,
    retry: 2,
  });

  const cpuAverage = useQuery({
    queryKey: ['cpu_average', { url: deviceUrl }],
    queryFn: () => fetchJson(`${baseUrl}system/cpu_average`),
    enabled,
    refetchInterval: 1000,
    retry: 2,
  });

  return {
    uptime: uptime.data,
    hostname: hostname.data,
    cpuTemp: cpuTemp.data,
    loadAverage: loadAverage.data,
    networks: networks.data,
    netStats: netStats.data,
    cpuAverage: cpuAverage.data,
    isLoading: uptime.isLoading || hostname.isLoading,
    isError: uptime.isError || hostname.isError,
    queries: {
      uptime,
      hostname,
      cpuTemp,
      loadAverage,
      networks,
      netStats,
      cpuAverage,
    },
  };
}
