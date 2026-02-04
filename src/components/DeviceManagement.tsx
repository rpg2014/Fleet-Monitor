import { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useDeviceStats } from '../hooks/useDeviceStats';
import { Container, PageHeader, Button, Card, CardContent, LoadingSpinner, StatusDot } from './ui';
import { getDeviceStatus } from '../lib/utils';
import type { Device } from '../types/api';

interface DeviceManagementProps {
  onBack: () => void;
}

export function DeviceManagement({ onBack }: DeviceManagementProps) {
  const { devices, isLoading, addDevice, removeDevice } = useDevices();
  const [newDeviceUrl, setNewDeviceUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddDevice = () => {
    setError('');
    
    if (!newDeviceUrl.trim()) {
      setError('Please enter a device URL');
      return;
    }

    try {
      // Ensure URL has protocol
      const urlString = newDeviceUrl.startsWith('http') 
        ? newDeviceUrl 
        : `http://${newDeviceUrl}`;
      
      // Ensure URL ends with /
      const finalUrl = urlString.endsWith('/') ? urlString : `${urlString}/`;
      
      const url = new URL(finalUrl);
      addDevice(url);
      setNewDeviceUrl('');
    } catch (err) {
      setError('Invalid URL format');
    }
  };

  const handleRemoveDevice = (deviceUrl: URL) => {
    removeDevice(deviceUrl);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading devices..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Manage Devices"
        subtitle="Add or remove devices from your fleet"
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Add Device Form */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-white mb-4">Add New Device</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter device URL (e.g., 192.168.1.100)"
                  value={newDeviceUrl}
                  onChange={(e) => setNewDeviceUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDevice()}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </div>
              <Button onClick={handleAddDevice}>
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device List */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-white mb-4">
              Current Devices ({devices.length})
            </h3>
            
            {devices.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No devices configured. Add your first device above.
              </p>
            ) : (
              <div className="space-y-3">
                {devices.map((device) => (
                  <DeviceListItem
                    key={device.url.toString()}
                    device={device}
                    onRemove={() => handleRemoveDevice(device.url)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

interface DeviceListItemProps {
  device: Device;
  onRemove: () => void;
}

function DeviceListItem({ device, onRemove }: DeviceListItemProps) {
  const stats = useDeviceStats(device.url);
  const status = getDeviceStatus(stats.isLoading, stats.isError);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="text-white font-medium">
            {stats.hostname || device.url.hostname}
          </div>
          <StatusDot size={'md'} status={status} />
        </div>
        <div className="text-sm text-gray-400 font-mono">
          {device.url.toString()}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
