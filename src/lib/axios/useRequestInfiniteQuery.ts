import {useInfiniteQuery} from "@tanstack/react-query";
import {GetRequest} from "@lib/axios/config";
import {instanceAxios} from "@lib/axios/index";
import {useSession} from "next-auth/react";
import {useMediaQuery} from "@mui/material";
import {MobileContainer as MobileWidth} from "@lib/constants";

export const ReactQueryNoValidateConfig = {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
}

function useRequestInfiniteQuery<Data = unknown, Error = unknown>(request: GetRequest, {
    variables,
    ...config
}: any = {}) {
    const {data: session, update} = useSession();
    const isMobile = useMediaQuery(`(max-width:${MobileWidth}px)`);
    const {jti} = session?.user as any;
    const queryKey: string[] = [...(request?.url ? [request.url] : []), ...(variables?.query ? [variables.query] : [])];

    const {
        isFetching,
        error,
        data: response,
        refetch,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage
    } = useInfiniteQuery(
        queryKey,
        ({signal, pageParam = (isMobile ? 0 : 1)}) =>
            ((request?.url?.length ?? 0) > 0 && queryKey.length > 0) ? instanceAxios.request<Data>({
                ...request,
                params: {page: isMobile ? pageParam + 1 : pageParam},
                ...(variables?.query && {url: `${request?.url}${variables.query}`}),
                ...(!request?.url?.includes("/api/public") && {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        "Fcm-session": jti
                    }
                }),
                signal,
            }).catch(async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    const refresh = await update();
                    originalRequest._retry = true;
                    originalRequest.headers.Authorization = `Bearer ${refresh?.accessToken}`;
                    return instanceAxios(originalRequest);
                }
                return Promise.reject(error);
            }) : null,
        {
            enabled: (request?.url?.length ?? 0) > 0 && queryKey.length > 0,
            retry: 2,
            getNextPageParam: (lastPage: any, pages: any) => {
                if (Math.ceil(lastPage?.data?.data?.total / 10) > pages.length)
                    return pages.length;
                return undefined;
            },
            ...config
        }
    );

    return {
        isLoading: isFetching,
        error,
        data: response,
        mutate: refetch,
        isFetchingNextPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage
    }
}

export default useRequestInfiniteQuery
