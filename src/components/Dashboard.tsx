import { JSXElementConstructor, Key, ReactElement, ReactNode, useState } from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useDeviceStats } from '../hooks/useDeviceStats';
import { Container, PageHeader, Grid, Button, Card, CardHeader, CardTitle, CardContent, StatusIndicator, Badge, LoadingSpinner } from './ui';
import { formatLoadAverage, formatBytes, getDeviceStatus } from '../lib/utils';
import type { Device } from '../types/api';

interface DashboardProps {
  onDeviceSelect: (device: Device) => void;
  onEditDevices: () => void;
}

export function Dashboard({ onDeviceSelect, onEditDevices }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { devices, isLoading } = useDevices();

  const filteredDevices = devices.filter((device: Device) =>
    device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.url.hostname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading devices..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Fleet Monitor"
        subtitle={`Monitoring ${devices.length} devices`}
        actions={
          <div className="flex gap-2">
            <div className="hidden sm:flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={onEditDevices}>
              Edit Devices
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div> */}
        
      </div>

      {filteredDevices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No devices found</p>
          <Button onClick={onEditDevices}>Add Device</Button>
        </div>
      ) : (
        <Grid cols={viewMode === 'grid' ? 3 : 1}>
          {filteredDevices.map((device: Device) => (
            <DeviceCard
              key={device.url.toString()}
              device={device}
              onClick={() => onDeviceSelect(device)}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
}

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

function DeviceCard({ device, onClick }: DeviceCardProps) {
  const stats = useDeviceStats(device.url);
  const status = getDeviceStatus(stats.isLoading, stats.isError);

  return (
    <Card className="cursor-pointer hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-[1.02] animate-fadeIn" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="truncate text-base sm:text-lg">
            {stats.hostname || device.url.hostname}
          </CardTitle>
          <StatusIndicator status={status} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Address:</span>
            <span className="text-gray-300 font-mono text-xs sm:text-sm truncate ml-2">
              {device.url.hostname}
            </span>
          </div>

          {stats.uptime && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Uptime:</span>
              <span className="text-gray-300 text-xs sm:text-sm truncate ml-2">
                {stats.uptime}
              </span>
            </div>
          )}

          {stats.cpuTemp && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-400">CPU Temp:</span>
              <Badge variant={stats.cpuTemp > 70 ? 'error' : stats.cpuTemp > 60 ? 'warning' : 'success'}>
                {stats.cpuTemp}°C
              </Badge>
            </div>
          )}

          {stats.loadAverage && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Load:</span>
              <span className="text-gray-300 font-mono text-xs">
                {formatLoadAverage(stats.loadAverage)}
              </span>
            </div>
          )}

          {stats.netStats?.List && (
            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Network Traffic</div>
              {stats.netStats.List
                .sort((a: { rx_bytes: any; tx_bytes: any; }, b: { rx_bytes: any; tx_bytes: any; }) => (b.rx_bytes + b.tx_bytes) - (a.rx_bytes + a.tx_bytes))
                .slice(0, 2)
                .map((netStat: { network_name: boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Key | null | undefined; tx_bytes: any; rx_bytes: any; }) => (
                  <div key={netStat.network_name} className="flex justify-between text-xs text-gray-400">
                    <span className="truncate mr-2">{netStat.network_name}:</span>
                    <span className="font-mono">
                      ↑{formatBytes(netStat.tx_bytes)} ↓{formatBytes(netStat.rx_bytes)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
