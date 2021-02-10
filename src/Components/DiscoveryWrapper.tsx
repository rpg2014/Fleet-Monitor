import { url } from 'inspector';
import React, { useState } from 'react';
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, ProgressBar, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { discoverDevicesOptions, discovery_devices } from '../Queries/DiscoverDevices';
import { fetchHostname } from '../Queries/FetchSystemStats';
import { IPInput } from './IPInput';

interface IDiscoveryWrapper {
    children: any;
}

export const DiscoveryWrapper = (props: IDiscoveryWrapper) => {
    // this is for the discovery queryies
//     const query = useQuery<String[] | void>('discover', discovery_devices, discoverDevicesOptions)
    
    const [urls, setUrls] = useState<URL[] | null>(null)
    React.useEffect(() => {
        if(storageAvailable('localStorage')) {
            let urlJSON = localStorage.getItem("saved_devices");
            let urls: string[] = JSON.parse(urlJSON ? urlJSON : "[]")
            if(urls){
                setUrls(urls.map((url) => new URL(url)));
            }else{
                setUrls([])
            }
        }
    },[])

    

//     React.useEffect(()=> {
//         if(query.data) {
//             console.log(query.data)
            
//             let urls = (query.data as unknown as string[]).map(ip => new URL("http://" +ip +":4321"))
//             setUrls(urls)
//         }
//     },[query.data])
    
//   if(query.isLoading) {
//     return(
//         <ProgressBar animated now={100} label="Discovering devices" />
//     )
//   }
//   else {
    
    const [setUpPageToggle, setSetUpPageToggle] = useState<boolean>(false);
    const saveState = () => {
        localStorage.setItem('saved_devices', JSON.stringify(urls))
    }
    React.useEffect(() => {
        saveState();
    },[urls])


    if(!urls) {
        return (
            <Spinner animation='border' variant='light' />
        )
    }
    
    const addUrl = (url: URL) => {
        setUrls(urls.concat([url]));
    }
    const deleteURL = (urlToDelete: URL) => {
        setUrls(urls.filter(url => url.toString() !== urlToDelete.toString()));
    }
    if(setUpPageToggle){
        return(<div className='container'>
            <h1 className='text-center text-white py-5'>Devices</h1>
            {urls.map((url) => {
                
                return(<IPInput key={url.toString()} deleteURL={deleteURL} addURL={addUrl} url={url} />)
                
            })}
            <hr className='bg-secondary w-75 rounded' ></hr >
            <IPInput  key="newURL" addURL={addUrl} deleteURL={deleteURL} ></IPInput>
            <div className=' row pt-5 flex justify-content-center'>
            <Button variant='outline-success' onClick={() => setSetUpPageToggle(!setUpPageToggle)} className='mx-auto align-self-center' size='lg'  >Done</Button>
            </div>
        </div>
        )
    }
    
      return (
          <div className='w-100 container col'>
          {/* <DiscoveryDebug/>   */}
          <div className='row justify-content-end'>
          <Button size='sm' variant='light'className=' col-md-1 p-2 text-center align-self-end  mx-5 mb-3 mt-5'   onClick={()=> setSetUpPageToggle(!setUpPageToggle)}><strong>Edit Devices</strong></Button>
          </div>
          {props.children(urls)}
          </div>
      )
//   }
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



function storageAvailable(type: any) {
    var storage;
    try {
        storage = window[type] as unknown as Storage;
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}