import {SWRConfig} from 'swr';

export const SWRNoValidateConfig = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false
}

export const TriggerWithoutValidation = {
    revalidate: false,
    populateCache: false
}

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
