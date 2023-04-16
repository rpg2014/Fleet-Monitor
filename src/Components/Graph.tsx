import { ResponsiveLine } from "@nivo/line"
import React, { useEffect } from "react"
import { useState } from "react"
import { useQueries, useQuery } from "react-query"
import { fetchCpuAverage, fetchCpuTemp, oneSecondUpdateOptions } from "../Queries/FetchSystemStats"
import './Graphs.css'


type GraphDataList = Array<{
    x: number 
    y: number 
}>
interface GraphData {
    id: string | number;
    data: GraphDataList
}
type DataList = Array<GraphData>

interface CPUAverageResponse {
    user: number
        nice: number
        system: number
        interrupt: number
        idle: number
}

const stringToGraphYAxisMap: Record<string, (s: any)=> number> = {
    "cpu_average": (data: CPUAverageResponse) =>   {
        // console.log(`data.idle: ${data.idle}`)
        return 100-(data.idle*100)
    },
    'cpu_temp': (data: number) => data
}

export const Graph = (props: {url: string, selectedGraph: string}) => {
    
    const [NumUnitOfTime, setNumUnitOfTime ]=useState(0)
    const [listOfPoints, setlistOfPoints ] = useState<GraphDataList>([])
    const [dataList, setDataList] = useState<DataList>([]);

    let graphType 
    switch (props.selectedGraph) {
        case "cpu_average":
            graphType = async (queryKey: any) => {
                let data = await fetchCpuAverage(queryKey);
                return data
                // the below breaks b/c of the return datatype is differnt than what the below code expects
                // it hits the func below twice.  But we'll use the below approach when combining the data
                // return stringToGraphYAxisMap['cpu_average'](data);
            };;
            break;
        case "cpu_temp": 
            graphType = async (queryKey: any) => {
                let data = await fetchCpuTemp(queryKey);
                return stringToGraphYAxisMap['cpu_temp'](data);
            };
            break;
        default :
            graphType=fetchCpuAverage;
            break;
    
    }

    // const queries = useQueries({
    //     queries: [
    //         {queryKey: [props.selectedGraph, props], queryFn: }
    //     ]
    // })

    const query = useQuery<CPUAverageResponse | number>([props.selectedGraph,props], graphType, oneSecondUpdateOptions)
    
    useEffect(() => {
        console.log("changed graph type")
        setDataList([])
        setNumUnitOfTime(0)
        setlistOfPoints([])
    },[props.selectedGraph])
    React.useEffect(()=> {
        if( query.data && !query.isPreviousData){
            setNumUnitOfTime(NumUnitOfTime+1); 
            // console.log(stringToGraphYAxisMap[props.selectedGraph](query.data))
            //@ts-ignore
            setlistOfPoints(listOfPoints.concat([{x: NumUnitOfTime, y: stringToGraphYAxisMap[props.selectedGraph](query.data)}]))
            
        }
    }, [query.data])
    
    //create new data list with newest list of points
    React.useEffect(()=> {
        let listToUse = listOfPoints;
        if(listOfPoints.length > 60) {
            listToUse = listOfPoints.slice(listOfPoints.length-60, listOfPoints.length);
        }
        const dataObject: GraphData = {
            id: props.selectedGraph,
            data: listToUse
        }
        setDataList([dataObject])
    }, [props.selectedGraph, listOfPoints])

    return (
        <>
        <div className='graph-container'>
            
            <ResponsiveLine
                        data={dataList}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        enablePoints={false}
                        enableGridX={false}
                        curve="basis"
                        theme={{
                            background: '#eeeeee'
                        }}
                        colors={{ scheme: 'red_blue' }}
                        xScale={{ type: 'linear' , min: (dataList[0]?.data[0]?.x ), max: dataList[0]?.data[0]?.x + 60}}
                        yScale={{ type: 'linear', min: 0, max: 100, stacked: true, reverse: false }}
            />
        <h3 className='p-2'>{props.selectedGraph}</h3>   
        </div>
        
        </>
    )
}