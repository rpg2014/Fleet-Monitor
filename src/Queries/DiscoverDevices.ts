// import find from 'local-devices'
import { UseQueryOptions } from 'react-query'

export const  discovery_devices = (): Promise<() => string[]> => {
    console.log("discovering")
    return Promise.resolve(() => ["192.168.0.14", ])//"192.168.0.131", "192.168.0.133"])//find('192.168.0.0/24')   
}


export const discoverDevicesOptions: UseQueryOptions<any,any,any> = {
    staleTime: 30000, // 30 secs
    refetchInterval: 30000, //30 secs
}