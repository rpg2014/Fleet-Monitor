import { url } from 'inspector';
import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useQueries } from 'react-query';
import { fetchCpuTemp, fetchHostname, fetchLoadAverage, fetchUptime, fiveSecUpdateOptions } from '../Queries/FetchUptime';


export interface IDashboardsProps {
    urls: URL[]
  }
export const Dashboards =(props: IDashboardsProps) => {
    
    return (
    <div className="container-fluid  h-100 text-white ">
      <h2 className='mx-auto center text-center p-3 pb-5'>
      Dashboard
      </h2>
      <div className=' container d-flex flex-row flex-wrap justify-content-around  align-items-center '>
        
      {props.urls.map((url, index)=> 
        
        
          <Dashboard url={url} />
        
        
    )}
      </div>
    </div>)
}


interface IDashboardProps {
    url: URL
}
const Dashboard = (props: IDashboardProps) => {
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
        console.log(uptimeQ)
        // return(
            content=(
        <Alert variant='danger'>
            {(uptimeQ.error as any).toString()}
        </Alert>
        )
    }
    else {
        
        content = (
            <p className='lead'>
            <h3>{`${hostQ.data as any}`}</h3> 
            Address: Put ip here
            <br/>
            Uptime {uptimeQ.data}
            <br/>
            Cpu Temp: {cpuTempQ.data} C
            <br/>
            Load Average: {getLoadString(loadQ.data)}
            </p>
        )
        }
    return (
        <div className='align-self-stretch m-4 p-3 w-25 shadow rounded bg-secondary  justify-content-center align-items-center lead'>
            {content}
        </div>
    )
}

const getLoadString = (data?: {one: string, five: string, fifteen: string}| any): string => {
    if(data)
    return `${data.one}\t${data.five}\t${data.fifteen}`
    else
    return "error";
}