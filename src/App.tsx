import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Dashboard } from './components/Dashboard';
import { DeviceDetail } from './components/DeviceDetail';
import { DeviceManagement } from './components/DeviceManagement';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { Device } from './types/api';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

type AppView = 'dashboard' | 'device-detail' | 'device-management';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setCurrentView('device-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedDevice(null);
    setCurrentView('dashboard');
  };

  const handleEditDevices = () => {
    setCurrentView('device-management');
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900">
          {currentView === 'dashboard' && (
            <Dashboard
              onDeviceSelect={handleDeviceSelect}
              onEditDevices={handleEditDevices}
            />
          )}
          
          {currentView === 'device-detail' && selectedDevice && (
            <DeviceDetail
              device={selectedDevice}
              onBack={handleBackToDashboard}
            />
          )}
          
          {currentView === 'device-management' && (
            <DeviceManagement onBack={handleBackToDashboard} />
          )}
        </div>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
