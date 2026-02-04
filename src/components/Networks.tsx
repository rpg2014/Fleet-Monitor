import { Card, CardHeader, CardTitle, CardContent, LoadingSpinner } from './ui';
import type { NetworkResult, NetworkDetails, NetworkAddress } from '../types/api';

interface NetworksProps {
  networkData?: NetworkResult;
}

export function Networks({ networkData }: NetworksProps) {
  if (!networkData) {
    return <LoadingSpinner message="Loading networks..." />;
  }
  
  if (!networkData.networks) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-400">No networks found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white text-center mb-6">
        Network Interfaces
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {networkData.networks.map((network: NetworkDetails) => (
          <NetworkCard key={network.name} network={network} />
        ))}
      </div>
    </div>
  );
}

interface NetworkCardProps {
  network: NetworkDetails;
}

function NetworkCard({ network }: NetworkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{network.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {network.addrs.map((addressDetails: NetworkAddress, index) => (
            <div key={index} className="text-sm">
              {Object.entries(addressDetails.addr).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-400">IP{key}:</span>
                  <span className="text-gray-300 font-mono">{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}