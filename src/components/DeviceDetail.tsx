import { useState } from 'react';
import { ArrowLeft, Monitor, Network, BarChart3 } from 'lucide-react';
import { useDeviceDetails } from '../hooks/useDeviceDetails';
import { Container, PageHeader, Button, Card, CardHeader, CardTitle, CardContent, Badge, LoadingSpinner } from './ui';
import { formatLoadAverage, formatBytes } from '../lib/utils';
import { Graphs } from './Graphs';
import { Networks } from './Networks';
import type { Device, NetworkStats } from '../types/api';

interface DeviceDetailProps {
  device: Device;
  onBack: () => void;
}

type TabType = 'overview' | 'graphs' | 'network';

export function DeviceDetail({ device, onBack }: DeviceDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const details = useDeviceDetails(device.url);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Monitor },
    { id: 'graphs' as const, label: 'Graphs', icon: BarChart3 },
    { id: 'network' as const, label: 'Network', icon: Network },
  ];

  if (details.isLoading) {
    return <LoadingSpinner message="Loading device details..." />;
  }

  return (
    <Container>
      <PageHeader
        title={details.hostname || device.url.hostname}
        subtitle={device.url.hostname}
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        }
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-700 mb-6 overflow-x-auto scrollbar-thin">
        <nav className="flex space-x-8 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab details={details} />}
      {activeTab === 'graphs' && <GraphsTab device={device} />}
      {activeTab === 'network' && <NetworkTab details={details} />}
    </Container>
  );
}

function OverviewTab({ details }: { details: ReturnType<typeof useDeviceDetails> }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Hostname:</span>
              <span className="text-white font-medium">{details.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime:</span>
              <span className="text-white">{details.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CPU Temperature:</span>
              <Badge variant={
                details.cpuTemp > 70 ? 'error' : 
                details.cpuTemp > 60 ? 'warning' : 'success'
              }>
                {details.cpuTemp}°C
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Load Average:</span>
              <span className="text-white font-mono text-sm">
                {formatLoadAverage(details.loadAverage)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Network Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {details.netStats?.List ? (
            <div className="space-y-4">
              {details.netStats.List.map((netStat: NetworkStats) => (
                <div key={netStat.network_name} className="p-4 bg-gray-800 rounded-lg">
                  <div className="font-medium text-white mb-2">{netStat.network_name}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">TX:</span>
                      <span className="ml-2 text-white">{formatBytes(netStat.tx_bytes)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">RX:</span>
                      <span className="ml-2 text-white">{formatBytes(netStat.rx_bytes)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">TX Packets:</span>
                      <span className="ml-2 text-white">{netStat.tx_packets.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">RX Packets:</span>
                      <span className="ml-2 text-white">{netStat.rx_packets.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No network statistics available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GraphsTab({ device }: { device: Device }) {
  return (
    <div>
      <Graphs device={device.url} />
    </div>
  );
}

function NetworkTab({ details }: { details: ReturnType<typeof useDeviceDetails> }) {
  return (
    <div>
      <Networks networkData={details.networks} />
    </div>
  );
}
