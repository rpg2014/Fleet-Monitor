import React, { useState } from 'react';
import { useQueries, UseQueryResult } from 'react-query';
import { fetchUptime, fetchHostname, fetchCpuTemp, fiveSecUpdateOptions, fetchLoadAverage, fetchCpuAverage, oneSecondUpdateOptions, fetchNetworks, fetchNetStats } from '../Queries/FetchSystemStats';
import { getLoadString } from './Dashboards';
import prettyBytes from 'pretty-bytes'
import { Alert } from 'react-bootstrap';


interface IDevicePageProps {
    ip: string;
  }
type NetworkResult = {
    networks: NetworkDetails[],
}

// #[derive(Debug, Clone, PartialEq, Serialize)]
// pub enum IpAddr {
//     Empty,
//     Unsupported,
//     V4(Ipv4Addr),
//     V6(Ipv6Addr),
// }
type  NetworkAddrsDetails={
    addr: any,
}

type  NetworkDetails = {
    name: string,
    addrs: NetworkAddrsDetails[],
}

interface NetworkStats {
     rx_bytes: number,
     tx_bytes: number,
     rx_packets: number,
     tx_packets: number,
     rx_errors: number,
     tx_errors: number,
}
interface NetworkStatsResults {
    One?: NetworkStats,
    List?: NetworkStats[],
}

  export const DevicePage = (props: IDevicePageProps ) => {
      
      const [url, setUrl] = useState(new URL(props.ip));
     const [uptimeQ , hostQ, networksQ,  cpuTempQ, loadQ, netStatsQ] = useQueries([
      {queryKey: ['uptime', {url: url}], queryFn: fetchUptime},
      {queryKey: ['hostname', {url: url}], queryFn: fetchHostname},
      {queryKey: ['networks', {url: url}], queryFn: fetchNetworks},
      {queryKey: ['cpu_temp', {url: url}], queryFn: fetchCpuTemp, ...fiveSecUpdateOptions},
      {queryKey: ['load_average', {url: url}], queryFn: fetchLoadAverage, ...fiveSecUpdateOptions},
    //   {queryKey: ['cpu_average', {url: url}], queryFn: fetchCpuAverage, ...oneSecondUpdateOptions}
        {queryKey: ['net_stats', {url: url}], queryFn: fetchNetStats, ...fiveSecUpdateOptions},
  ])
  
  
    const uptime = uptimeQ as UseQueryResult<String>;
    const host = hostQ as UseQueryResult<String>;
    const networks = networksQ as UseQueryResult<{}>;
    const load = loadQ as UseQueryResult<String>;
    const netStats = netStatsQ as UseQueryResult<NetworkStatsResults>;
    let list = netStats.data?.List;

    //TODO, need to decide on layout below.  Do i want cards? or like tabs?  I think tabs would be smaller. i should prob work on the graph for now.
    return (
      <div className="container-fluid text-white m-0 p-0 h-100  ">
        <h1 className=' text-center'>Hostname: {host.data}</h1>
        <div className=' container-fluid d-flex flex-column flex-wrap justify-content-around text-left align-items-center '>
            <CpuGraph />
            <div className=' container col bg-secondary rounded  align-items-left '>
                <div className='row  justify-content-start'>
                <p className=' col-xsm m-2 font-weight-light text-light bg-dark rounded p-2'>
                    Uptime: <span>{uptime.data}</span>
                </p>
                <p className='col-xsm m-2 font-weight-light text-light bg-dark rounded p-2'>
                    Load: <span>{getLoadString(load.data)}</span>
                </p> 
                {list?.map((eth0)=> {
                    return (
                        eth0?
                <p className='col-xsm m-2 font-weight-light text-light bg-dark rounded p-2'>
                    eth0: <span>{`tx ${prettyBytes(eth0.tx_bytes)} / rx ${prettyBytes(eth0.rx_bytes)}`}</span>
                </p> : null
                    )
                })
                
                }
                </div>   
                <div>
                    <p>
                        Networks: {JSON.stringify(networksQ.data)}
                    </p>
                </div>
            </div>
        </div>
        
      </div>
    )
  }

const CpuGraph = () => {
    return <div className=' align-self-stretch m-4 p-3 shadow rounded bg-secondary justify-content-center align-items-center lead'>
        Graph
    </div>
}