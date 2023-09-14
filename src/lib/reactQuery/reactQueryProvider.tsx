import {useState} from "react";
import {QueryClient} from "@tanstack/query-core";
import {Hydrate, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

function ReactQueryProvider({children, ...pageProps}: LayoutProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                {children}
            </Hydrate>
            <ReactQueryDevtools/>
        </QueryClientProvider>
    )
}

export default ReactQueryProvider
