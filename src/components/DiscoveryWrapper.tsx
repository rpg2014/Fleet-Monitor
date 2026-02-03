import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IPInput } from './IPInput.tsx';

interface IDiscoveryWrapper {
    children: (urls: URL[]) => React.ReactNode;
}

export const DiscoveryWrapper = (props: IDiscoveryWrapper) => {
    const [urls, setUrls] = useState<URL[] | null>(null)
    const [setUpPageToggle, setSetUpPageToggle] = useState<boolean>(false);

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
    
    const saveState = () => {
        if (urls) {
            localStorage.setItem('saved_devices', JSON.stringify(urls.map(url => url.toString())))
        }
    }
    
    React.useEffect(() => {
        saveState();
    },[urls])

    if(!urls) {
        return <Spinner animation='border' variant='light' />
    }
    
    const addUrl = (url: URL) => {
        setUrls(urls.concat([url]));
    }
    
    const deleteURL = (urlToDelete: URL) => {
        setUrls(urls.filter(url => url.toString() !== urlToDelete.toString()));
    }
    
    if(setUpPageToggle){
        return(
            <div className='container'>
                <h1 className='text-center text-white py-5'>Devices</h1>
                {urls.map((url) => (
                    <IPInput key={url.toString()} deleteURL={deleteURL} addURL={addUrl} url={url} />
                ))}
                <hr className='bg-secondary w-75 rounded' />
                <IPInput key="newURL" addURL={addUrl} deleteURL={deleteURL} />
                <div className='row pt-5 flex justify-content-center'>
                    <Button 
                        variant='outline-success' 
                        onClick={() => setSetUpPageToggle(false)} 
                        className='mx-auto align-self-center' 
                        size='lg'
                    >
                        Done
                    </Button>
                </div>
            </div>
        )
    }
    
    return (
        <div className='w-100 container col'>
            <div className='row justify-content-end'>
                <Button 
                    size='sm' 
                    variant='light'
                    className='col-md-1 p-2 text-center align-self-end mx-5 mb-3 mt-5'   
                    onClick={() => setSetUpPageToggle(true)}
                >
                    <strong>Edit Devices</strong>
                </Button>
            </div>
            {props.children(urls)}
        </div>
    )
}

function storageAvailable(type: string): boolean {
    try {
        const storage = window[type as keyof Window] as Storage;
        const x = '__storage_test__';
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