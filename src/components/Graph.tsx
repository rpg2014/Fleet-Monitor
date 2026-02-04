import { ResponsiveLine } from "@nivo/line"
import React, { useEffect } from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"


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

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

const stringToGraphYAxisMap: Record<string, (s: any)=> number> = {
    "cpu_average": (data: CPUAverageResponse) =>   {
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
            graphType = () => fetchJson(`${props.url}system/cpu_average`);
            break;
        case "cpu_temp": 
            graphType = () => fetchJson(`${props.url}system/cpu_temp`);
            break;
        default :
            graphType = () => fetchJson(`${props.url}system/cpu_average`);
            break;
    }

    const query = useQuery<CPUAverageResponse | number>({
        queryKey: [props.selectedGraph, props.url],
        queryFn: graphType,
        refetchInterval: 1000,
        retry: 2,
    })
    
    useEffect(() => {
        console.log("changed graph type")
        setDataList([])
        setNumUnitOfTime(0)
        setlistOfPoints([])
    },[props.selectedGraph])
    React.useEffect(()=> {
        if( query.data && !query.isFetching){
            setNumUnitOfTime(NumUnitOfTime+1); 
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