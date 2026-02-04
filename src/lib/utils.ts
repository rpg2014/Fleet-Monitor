import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUptime(uptime: string): string {
  return uptime;
}

export function formatLoadAverage(load?: { one: string; five: string; fifteen: string }): string {
  if (!load) return 'N/A';
  const formatNumber = (val: string) => parseFloat(val).toFixed(2);
  return `${formatNumber(load.one)} | ${formatNumber(load.five)} | ${formatNumber(load.fifteen)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function getDeviceStatus(isLoading: boolean, isError: boolean): 'online' | 'offline' | 'loading' {
  if (isLoading) return 'loading';
  if (isError) return 'offline';
  return 'online';
}
