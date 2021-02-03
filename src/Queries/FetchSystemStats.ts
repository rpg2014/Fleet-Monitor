import { UseQueryOptions } from "react-query"



export const fetchUptime = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/uptime").then(response => response.json())
}

export const fetchHostname = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/hostname").then(response => response.json())
}

export const fiveSecUpdateOptions: UseQueryOptions<any,any,any> = {
    // staleTime:1000, // 5 secs
    refetchInterval: 5000, //5 secs
    retry: false
}
export const fetchCpuTemp = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/cpu_temp").then(response => response.json())
}

export const fetchLoadAverage = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/load_average").then(response => response.json())
}

export const fetchCpuAverage = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/cpu_average").then(response => response.json())
}

export const oneSecondUpdateOptions: UseQueryOptions<any,any,any> = {
    refetchInterval: 1000, //5 secs
    retry: false
}

export const fetchNetworks = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/networks").then(response => response.json())
}

export const fetchNetStats = ({queryKey}:any) => {
    const [_key, {url}] = queryKey
    // Fetch mem, uptime, disk_info, networks
    return fetch(url.toString() +"system/net_stats").then(response => response.json())
}