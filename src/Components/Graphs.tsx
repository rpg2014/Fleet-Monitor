import React, { useState } from 'react';
import {ResponsiveLine} from '@nivo/line'
import { useQuery } from 'react-query';
import { fetchCpuAverage, oneSecondUpdateOptions } from '../Queries/FetchSystemStats';
import loadable from '@loadable/component';

import './Graphs.css'
import { Spinner } from 'react-bootstrap';
import { Graph } from './Graph';
import Networks from './Networks';
interface IGraphsProps {
    device: string
}

const GraphList =  ['cpu_temp', 'cpu_average'/*, 'net_stats'*/];

export const Graphs = (props: IGraphsProps) => {
    const [selectedGraph, setSelectedGraph] = useState('cpu_average');
    return (
        <div className='shadow text-center text-white  container rounded border-danger bg-dark m-3 w-100'>
            <h1 className='pt-3 pb-1'>Graphs</h1>
            <hr className='bg-secondary w-75'/>
            <div className='row  graph-wrapper' >
                <GraphFilter selectedGraph={selectedGraph} setSelectedGraph={(selectedGraph: string) => setSelectedGraph(selectedGraph)} />
                <Graph url={props.device} selectedGraph={selectedGraph} />
            </div>
        </div>
    )
}

export const GraphFilter = (props: {selectedGraph: string, setSelectedGraph: (selectedGraph: string)=> void}) => {
    
    
    return <ul className='graph-filter list-group list-group-flush  text-dark w-10'>
        {GraphList.map((name) => {
            return (<li className={`list-group-item  bg-secondary rounded graph-list-item p-1 m-2${props.selectedGraph === name ? ' bg-info': ''}`} key={name} onClick={()=> props.setSelectedGraph(name)}>{name}</li>)
        })}
    </ul>
}


// const LoadableGraph = loadable(() => import("./Graph"), {
//     fallback: <Spinner animation='border'/>
//   });




