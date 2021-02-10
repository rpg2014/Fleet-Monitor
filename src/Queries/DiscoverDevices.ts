// import find from 'local-devices'
import { UseQueryOptions } from 'react-query'
import { getIPRange } from 'get-ip-range';
// import arp from 'arptable-js'

export const  discovery_devices = (): Promise<String[] |void> => {
    // console.log("discovering")
    // arp.get((table)=>console.log(JSON.stringify(table)))

    // let range = getIPRange('192.168.0.0/24')
    // let ar= range.map(discovery_request);
    // let result: String[] =  
    //TODO figure out to to ping all network devices/ might have to do it not with react query
    // return Promise.all<String>(ar)
        // .then((strArray) => {console.log("here");console.log(strArray); return strArray})
        // .then(strArray => strArray.filter(s => s !== ""))
        // .then((strArray) => {console.log(strArray); return strArray})
        // .catch((e)=> {})

    return Promise.resolve(["192.168.0.14", "192.168.0.131", "192.168.0.133"])//find('192.168.0.0/24')   
}

const discovery_request =(ip: string):Promise<String> =>  {
    return fetch("http://"+ip+":4321/system/hostname",{}).then(response => response.json())
}

export const discoverDevicesOptions: UseQueryOptions<any,any,any> = {
    staleTime: 30000, // 30 secs
    refetchInterval: false,//30000, //30 secs
    retry: false,
    enabled: false // will want to set up a button system eventually
}

async function fetchWithTimeout(resource:any, options:any) {
    const { timeout = 2000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
  }