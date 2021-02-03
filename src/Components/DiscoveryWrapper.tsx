import React, { useState } from 'react';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { discoverDevicesOptions, discovery_devices } from '../Queries/DiscoverDevices';

interface IDiscoveryWrapper {
    children: any;
}

export const DiscoveryWrapper = (props: IDiscoveryWrapper) => {
    const query = useQuery<String[] | void>('discover', discovery_devices, discoverDevicesOptions)
    
    const [urls, setUrls] = useState<URL[]>([])

    React.useEffect(()=> {
        if(query.data) {
            console.log(query.data)
            
            let urls = (query.data as unknown as string[]).map(ip => new URL("http://" +ip +":4321"))
            setUrls(urls)
        }
    },[query.data])
    
  if(query.isLoading) {
    return(
        <ProgressBar animated now={100} label="Discovering devices" />
    )
  }
  else {
    
      return (
          <>
          {/* <DiscoveryDebug/>   */}
          <Button variant='primary'className='float-right'  onClick={()=> query.refetch()}>Click</Button>
          {props.children(urls)}
          </>
      )
  }
}

const DiscoveryDebug = () => {
    const query = useQuery('discover', discovery_devices, {
        ...discoverDevicesOptions,
        refetchOnMount: false,
    });
    const [showDebug, setShowDebug] = useState(false)
    if(showDebug){
    return (
        <p className='w-100  text-white border border-info m-0 rounded-bottom fixed-top'style={{textAlign: 'center'}}> 
            Status: {query.status}, Data: {JSON.stringify(query.data)} 
            <Button  variant='outline-secondary' size='sm' onClick={()=> setShowDebug(!showDebug)}>
                Click to hide
            </Button> 
        </p>
    )
    }
    else {
        return (
            <div className='h-auto float-right'>
            <Button variant='outline-secondary' className='fixed-top' onClick={()=> setShowDebug(!showDebug)}>
                Show Debug
            </Button>
            </div>
        )
    }
}


