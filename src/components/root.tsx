import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { DiscoveryWrapper } from "./DiscoveryWrapper.tsx"
import { useState } from "react"
import { DashboardPage } from "./Dashboards.tsx"
import { DevicePage } from "./DevicePage.tsx"
import { ErrorBoundary } from "./ErrorBoundary.tsx"

const queryClient = new QueryClient()

export const Index = () => {
    const [selectedPI, setSelectedPi] = useState<URL | null>(null);
    
    return(
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <DiscoveryWrapper>
                    {(urls: URL[]) => 
                        selectedPI ? 
                            <ErrorBoundary>
                                <DevicePage ip={selectedPI} goBack={() => setSelectedPi(null)} />
                            </ErrorBoundary> : 
                            <ErrorBoundary>
                                <DashboardPage urls={urls} setSelectedPi={setSelectedPi}/>
                            </ErrorBoundary>
                    }
                </DiscoveryWrapper>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}