import {Middleware, SWRHook} from 'swr';

export const swrMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {

    return useSWRNext(key, fetcher, config)
}
