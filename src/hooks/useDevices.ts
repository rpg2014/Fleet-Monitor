import { useState, useEffect } from 'react';
import type { Device } from '../types/api';

const STORAGE_KEY = 'saved_devices';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDevices = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const urls: string[] = saved ? JSON.parse(saved) : [];
        const deviceList = urls.map(url => ({
          url: new URL(url),
          status: 'loading' as const,
        }));
        setDevices(deviceList);
      } catch (error) {
        console.error('Failed to load devices:', error);
        setDevices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);

  const saveDevices = (deviceList: Device[]) => {
    try {
      const urls = deviceList.map(device => device.url.toString());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    } catch (error) {
      console.error('Failed to save devices:', error);
    }
  };

  const addDevice = (url: URL) => {
    const newDevice: Device = { url, status: 'loading' };
    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
  };

  const removeDevice = (urlToRemove: URL) => {
    const updatedDevices = devices.filter(
      device => device.url.toString() !== urlToRemove.toString()
    );
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
  };

  const updateDeviceStatus = (url: URL, status: Device['status'], hostname?: string) => {
    setDevices(prev => prev.map(device => 
      device.url.toString() === url.toString() 
        ? { ...device, status, hostname }
        : device
    ));
  };

  return {
    devices,
    isLoading,
    addDevice,
    removeDevice,
    updateDeviceStatus,
  };
}
