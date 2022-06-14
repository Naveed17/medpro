import { SWRConfig } from 'swr';

function SwrProvider({ children, fallback, ...pageProps }: LayoutProps) {
    return (
        <SWRConfig  value={{fallback}}>
            {children}
        </SWRConfig>
    )
}

export default SwrProvider;
