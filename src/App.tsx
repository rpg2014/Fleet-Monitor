import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import {  useQuery, useMutation,  useQueryClient,QueryClient,QueryClientProvider,} from 'react-query'
import { discovery_devices } from './Queries/DiscoverDevices';
import { ReactQueryDevtools } from 'react-query/devtools'
import { DiscoveryWrapper } from './Components/DiscoveryWrapper';
import { DashboardPage } from './Components/Dashboards';
import { DevicePage } from './Components/DevicePage';

const queryClient = new QueryClient()

function App() {
  const [selectedPI, setSelectedPi] = useState<URL| null>();//"http://192.168.0.14:4321")

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <DiscoveryWrapper>
        {(urls: URL[])=>
        { 
          return  selectedPI ? <DevicePage ip={(selectedPI as unknown as string)} goBack={() => setSelectedPi(null)} /> : <DashboardPage urls={urls} setSelectedPi={setSelectedPi}/>
        
        }
        }
      </DiscoveryWrapper>
    </QueryClientProvider>
  );
}



const Content = () => {

  
  
  return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}
export default App;
