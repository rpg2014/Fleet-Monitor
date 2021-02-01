import React from 'react';
import logo from './logo.svg';
import './App.css';

import {  useQuery, useMutation,  useQueryClient,QueryClient,QueryClientProvider,} from 'react-query'
import { discovery_devices } from './Queries/DiscoverDevices';
import { ReactQueryDevtools } from 'react-query/devtools'
import { DiscoveryWrapper } from './Components/DiscoveryWrapper';
import { Dashboards } from './Components/Dashboards';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <DiscoveryWrapper>
        {(urls: URL[])=>
        { 
          console.log("dashboards")
        return <Dashboards urls={urls}/>       
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
