import React from "react";
import { Alert, Button, Card, Spinner } from "react-bootstrap";
import { useQueries } from "react-query";
import { fetchUptime, fetchHostname, fetchCpuTemp, fiveSecUpdateOptions, fetchLoadAverage } from "../Queries/FetchSystemStats";

interface IFlashCardProps {
    url: URL
    setSelectedPi: (url: URL | null) => void
}
export const FlashCard = (props: IFlashCardProps) => {
    const [uptimeQ, hostQ, cpuTempQ, loadQ] = useQueries([
        {queryKey: ['uptime', {url: props.url}], queryFn: fetchUptime},
        {queryKey: ['hostname', {url: props.url}], queryFn: fetchHostname},
        {queryKey: ['cpu_temp', {url: props.url}], queryFn: fetchCpuTemp, ...fiveSecUpdateOptions},
        {queryKey: ['load_average', {url: props.url}], queryFn: fetchLoadAverage, ...fiveSecUpdateOptions}
    ])
    let content = <></>;
    if(uptimeQ.isFetching)
    {
        content =(
        // return (
            <div className='mx-auto w-100 h-100 d-inline-flex  justify-content-center align-items-center'>
            <Spinner animation='grow'  variant='light' className='mx-auto '/>
            </div>
        )
    }

    else if(uptimeQ.isError){
        // return(
            content=(
        <Alert variant='danger'>
            {(uptimeQ.error as any).toString()}
        </Alert>
        )
    }
    else {
        
        content = (
            <Card.Body className='col p-0'>
                <Card.Header className='font-weight-light m-0 card-title text-light bg-success'>{`${hostQ.data as any}`}
                <Button size='sm' variant='outline-light' className='float-right' onClick={() => props.setSelectedPi(props.url)}>Graphs</Button>
                </Card.Header>
                <Card.Text className='row px-3 text-light'>
                    <div className='col-md-6'>
                        <strong>Address:</strong> <br/><a className='text-muted' href={`http://${props.url.hostname}`}>{`${props.url.hostname}`}</a>
                        <br />
                        <strong>Uptime </strong> <br/>{uptimeQ.data}
                    </div>
                    
                    <div className='col-md-6'>
                        <strong>Cpu Temp:</strong> <br/>{cpuTempQ.data} C
                        <br />
                        <strong>Load Average:</strong> <br/>{getLoadString(loadQ.data)}
                    </div>
                </Card.Text>
            </Card.Body>
        )
        }
    return (
        <Card className='align-self-stretch m-3 p-3 col-xl shadow rounded bg-dark  justify-content-center  lead'>
            {content}
        </Card>
    )
}

export const getLoadString = (data?: {one: string, five: string, fifteen: string}| any): string => {
    if(data)
    return `${data.one}\t|\t${data.five}\t|\t${data.fifteen}`
    else
    return "error";
}