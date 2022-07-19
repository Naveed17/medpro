import {SWRConfig} from 'swr';

function SwrProvider({children, fallback}: LayoutProps) {
    return (
        <SWRConfig value={{
            provider: () => new Map(),
            fallback,
            onError: (error, key) => {
                if (error.status !== 403 && error.status !== 404) {
                    console.log(error);
                }
            }
        }}>
            {children}
        </SWRConfig>
    )
}

export default SwrProvider;
