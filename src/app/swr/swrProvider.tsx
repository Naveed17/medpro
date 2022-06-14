import { SWRConfig } from 'swr';

function SwrProvider({ children, fallback, ...pageProps }: LayoutProps) {
    return (
        <SWRConfig  value={{
                        fallback,
                        onError: (error, key) => {
                            if (error.status !== 403 && error.status !== 404) {
                                console.log(error);
                            }
                        }}}>
            {children}
        </SWRConfig>
    )
}

export default SwrProvider;
