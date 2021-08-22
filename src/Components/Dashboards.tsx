import React, { useEffect, useState } from 'react';
import { DevicePage } from './DevicePage';
import { FlashCard } from './Flashcard';
import { Graphs } from './Graphs';




export interface IDashboardsProps {
    urls: URL[]
    setSelectedPi: (url: URL | null) => void
  }
export const DashboardPage =(props: IDashboardsProps) => {
    const [graphsViewDevice, setGraphsViewDevice] = useState<URL | null>(null)
  
 
    return (
        <div className="container-fluid  h-100 text-white justify-content-around ">
      <h2 className='mx-auto center text-center p-3 pb-5'>
        Dashboard
      </h2>
      <div className=' container-fluid  row flex-wrap justify-content-between mx-auto align-items-center '>
        
      {props.urls.map((url, index)=> 
        
        
          <FlashCard url={url} setSelectedPi={props.setSelectedPi} />
        
        
    )}
      </div>
    </div>)
        
}

const Dashboards = (props: IDashboardsProps) =>{
    
    
}


