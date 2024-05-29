import {useState} from "react";
import {QueryClient} from "@tanstack/query-core";
import {HydrationBoundary, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

function ReactQueryProvider({children, ...pageProps}: LayoutProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={pageProps.dehydratedState}>
                {children}
            </HydrationBoundary>
            <ReactQueryDevtools/>
        </QueryClientProvider>
    )
}

export default ReactQueryProvider
