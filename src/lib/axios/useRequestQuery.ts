import {useQuery} from "@tanstack/react-query";
import {GetRequest} from "@lib/axios/config";
import {instanceAxios} from "@lib/axios/index";
import {useSession} from "next-auth/react";
import {AxiosResponse} from "axios";

export const ReactQueryNoValidateConfig = {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
}

function useRequestQuery<Data = unknown, Error = unknown>(request: GetRequest, {variables, ...config}: any = {}) {
    const {data: session, update} = useSession();
    const {jti} = session?.user as any;
    const queryKey: string[] = [...(request?.url ? [request.url] : []), ...(variables?.query ? [variables.query] : [])];

    const {isFetching, error, data: response, refetch} = useQuery({
        queryKey,
        queryFn: ({signal}) => ((request?.url?.length ?? 0) > 0 && queryKey.length > 0) ? instanceAxios.request<Data>({
            ...request,
            ...(variables?.query && {url: `${request?.url}${variables.query}`}),
            ...(!request?.url?.includes("/api/public") && {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Fcm-session": jti
                }
            }),
            signal
        }).catch(async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                const refresh = await update({refreshAccessToken: true});
                originalRequest._retry = true;
                originalRequest.headers.Authorization = `Bearer ${refresh?.accessToken}`;
                return instanceAxios(originalRequest);
            }
            return Promise.reject(error);
        }) : null,
        enabled: (request?.url?.length ?? 0) > 0 && queryKey.length > 0,
        retry: 2,
        ...config
    });

    return {
        isLoading: isFetching,
        error,
        data: response && (response as AxiosResponse).data,
        mutate: refetch
    }
}

export default useRequestQuery
