import React, { useState } from 'react';
import {ResponsiveLine} from '@nivo/line'
import { useQuery } from 'react-query';
import { fetchCpuAverage, oneSecondUpdateOptions } from '../Queries/FetchSystemStats';

import './Graphs.css'
interface IGraphsProps {
    device: string
}

const GraphList =  ['cpu_temp', 'cpu_average', 'net_stats'];

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
    
    
    return <ul className='graph-filter list-group list-group-flush h-100 text-dark w-10'>
        {GraphList.map((name) => {
            return (<li className={`list-group-item  bg-secondary rounded graph-list-item p-1 m-2${props.selectedGraph === name ? ' bg-info': ''}`} onClick={()=> props.setSelectedGraph(name)}>{name}</li>)
        })}
    </ul>
}


interface CPUAverageResponse {
    user: number
        nice: number
        system: number
        interrupt: number
        idle: number
}


type GraphDataList = Array<{
    x: number | string | Date
    y: number | string | Date
}>
interface GraphData {
    id: string | number;
    data: GraphDataList
}
type DataList = Array<GraphData>

const Graph = (props: {url: string, selectedGraph: string}) => {
    
    const [NumUnitOfTime, setNumUnitOfTime ]=useState(0)
    const [listOfPoints, setlistOfPoints ] = useState<GraphDataList>([])
    const handleCPUAverageResponse = (responseJson: CPUAverageResponse) => {
        setNumUnitOfTime(NumUnitOfTime+1); 
        
        setlistOfPoints(listOfPoints.concat([{x: NumUnitOfTime, y: 100-responseJson.idle}]))
    }
    const [dataList, setDataList] = useState<DataList>([]);

    let graphType 
    switch (props.selectedGraph) {
        case "cpu_average":
            graphType = fetchCpuAverage;
            break;
        default :
            graphType=fetchCpuAverage;
            break;
    
    }

    const query = useQuery<CPUAverageResponse>(['cpu_average',props], graphType, oneSecondUpdateOptions)
    
    React.useEffect(()=> {
        if( query.data && !query.isPreviousData){
            setNumUnitOfTime(NumUnitOfTime+1); 
        
            setlistOfPoints(listOfPoints.concat([{x: NumUnitOfTime, y: (100 - (query.data.idle * 100))}]))
        }
    }, [query.data])
    
    //create new data list with newest list of points
    React.useEffect(()=> {
        let listToUse = listOfPoints;
        if(listOfPoints.length > 60) {
            listToUse = listOfPoints.slice(1, listOfPoints.length);
        }
        const dataObject: GraphData = {
            id: props.selectedGraph,
            data: listToUse
        }
        setDataList([dataObject])
    }, [props.selectedGraph, listOfPoints])

    return (
        <div className='graph-container h-100 w-75 text-white'>
            
            <ResponsiveLine data={dataList}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        enablePoints={false}
                        enableGridX={false}
                        curve="basis"
                        theme={{
                            background: '#eeeeee'
                        }}
                        colors={{ scheme: 'red_blue' }}
                        xScale={{ type: 'linear' }}
                        yScale={{ type: 'linear', min: 0, max: 100, stacked: true, reverse: false }}
            />
            <h3 className='p-2'>{props.selectedGraph}</h3>
        </div>
    )
}