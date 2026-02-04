import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';
import { Graph } from './Graph';

interface GraphsProps {
  device: URL;
}

const GraphList = ['cpu_temp', 'cpu_average'];

export function Graphs({ device }: GraphsProps) {
  const [selectedGraph, setSelectedGraph] = useState('cpu_average');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Graphs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <GraphFilter 
            selectedGraph={selectedGraph} 
            setSelectedGraph={setSelectedGraph} 
          />
          <div className="min-h-[400px]">
            <Graph url={device.toString()} selectedGraph={selectedGraph} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GraphFilterProps {
  selectedGraph: string;
  setSelectedGraph: (graph: string) => void;
}

function GraphFilter({ selectedGraph, setSelectedGraph }: GraphFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {GraphList.map((name) => (
        <Button
          key={name}
          variant={selectedGraph === name ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedGraph(name)}
        >
          {name.replace('_', ' ').toUpperCase()}
        </Button>
      ))}
    </div>
  );
}




