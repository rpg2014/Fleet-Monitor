import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { DiscoveryWrapper } from "./DiscoveryWrapper.tsx"
import { useState } from "react"
import { DashboardPage } from "./Dashboards.tsx"
import { DevicePage } from "./DevicePage.tsx"


const queryClient = new QueryClient()


export const Index = () => {
    const [selectedPI, setSelectedPi] = useState<URL| null>();//"http://192.168.0.14:4321")
    return(
        <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <DiscoveryWrapper>
        {(urls: URL[])=>
        { 
          return  selectedPI ? <DevicePage ip={(selectedPI as unknown as string)} goBack={() => setSelectedPi(null)} /> : <DashboardPage urls={urls} setSelectedPi={setSelectedPi}/>
        
        }
        }
      </DiscoveryWrapper>
    </QueryClientProvider>
    )
}