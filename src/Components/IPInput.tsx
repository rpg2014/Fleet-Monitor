import React, { useState } from 'react';
import { Alert, Badge, Button, Dropdown, DropdownButton, Form, FormControl, InputGroup, ProgressBar, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { fetchHostname } from '../Queries/FetchSystemStats';
import { BiError } from 'react-icons/bi';


interface IIPInputProps {
    url?: URL,
    addURL: (url: URL) => void,
    deleteURL: (url: URL) =>void,
}

export const IPInput = (props: IIPInputProps) => {

    const [url, setURL] = useState(props.url);
    
    const [newURL, setNewUrl] = useState("http://192.168.0.xxx")
    const [isValid, setIsValid] = useState<boolean | undefined>(true);
    // const [isEditMode, setIsEditMode] = useState()

   const handleSubmit = (newURL:string) => {
       if(checkIfValidURL(newURL))
       {
        props.addURL(new URL(newURL+":4321"))
        setNewUrl("http://192.168.0.xxx")
       }
       else{
           setIsValid(false)
       }
    }
    const onChange = (event: any) => {
        setNewUrl(event.target.value)
        if(!checkIfValidURL(event.target.value)) {
            setIsValid(false)
        }else {
            setIsValid(true)
        }
    }

    return(
        <div className='row flex flex-row justify-content-center text-white'>
            <div className='col-md align-self-center justify-content-center text-center'>
                <InfoPanel url={url} />
            </div>
            <InputGroup className="m-3 col-md">

                {url ?
                <>
                    <FormControl readOnly value={`${url.protocol}//${url.hostname}`}/> 
                     <DropdownButton
                        as={InputGroup.Append} variant="outline-light  " title="Edit" id="input-group-dropdown-2">
                        {/* <Dropdown.Item onClick={(e)=> console.log)}>Edit</Dropdown.Item> */}
                        <Dropdown.Item className=' ' onClick={()=> props.deleteURL(url)}><span
                                className='rounded  text-danger'>Delete</span></Dropdown.Item>

                        {/*
                        <Dropdown.Divider /> */}
                        {/* <Dropdown.Item href="#">Delete</Dropdown.Item> */}
                        </DropdownButton>
                </>
                :
                <>
                    <FormControl value={newURL} onChange={onChange} isValid={isValid ? undefined : false} />



                    <InputGroup.Append>
                        <Button variant={isValid?"outline-success":"outline-danger"} onClick={(e)=>
                            handleSubmit(newURL)}>Save</Button>

                    </InputGroup.Append>
                </>
                }
                {!isValid ?
                <Badge variant='danger'>
                    <div className='small text-break'> Please enter a valid url. Currently only local devices are
                        supported (eg. "http://192.168.0.xxx"). Don't include a port number. </div>
                </Badge> :
                null}
            </InputGroup>
        </div>
    )
}

const checkIfValidURL = (urlString: string): boolean => {
    try {
        let url = new URL(urlString);
        // console.log("logic below")
        // console.log(url.protocol === 'http:' && !url.port && url.hostname.startsWith("192.168.0."))
        return (url.protocol === 'http:' && !url.port && url.hostname.startsWith("192.168.0."));
    }catch(e){
        console.log(e)
        return false
    }
}




const InfoPanel = ({url}:{url?: URL})=> {
    const query = useQuery({queryKey: ['hostname', {url: url}], queryFn: fetchHostname, retry: false})

    if(!url){
        return <>Enter A URL:</>
    }

    if(query.isLoading) {
        return (
            <>
              {`${url.protocol}//${url.hostname}`} <Badge className='' pill variant="warning">Attempting to connect <Spinner size='sm' animation='border'/></Badge>
            </>
        )
    }

    if(query.isError) {
        return (
            <>
            {`${url.protocol}//${url.hostname}`} <Badge className='align-items-center' pill variant='danger'><BiError className='align-items-center'/>Failed to connect to device</Badge>
            </>
        )
    }
    return (
    <>
        <div className='row justify-content-center'>{query.data}
            <div className='mx-3'>
                <Badge className='' pill variant="success">Connected</Badge>
            </div>
        </div> 
    </>
    )
}