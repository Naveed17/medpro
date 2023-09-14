import {useQuery} from "@tanstack/react-query";
import {GetRequest} from "@lib/axios/config";
import {instanceAxios} from "@lib/axios/index";
import {useSession} from "next-auth/react";

export const ReactQueryNoValidateConfig = {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
}

function useRequestQuery<Data = unknown, Error = unknown>(request: GetRequest, {...config}: any = {}) {
    const {data: session} = useSession();
    const {jti} = session?.user as any;

    const {isLoading, error, data: response, refetch} = useQuery(
        [request?.url],
        () => instanceAxios.request<Data>({
            ...request,
            ...(!request?.url?.includes("/api/public") && {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Fcm-session": jti
                }
            })
        }!), {
            enabled: !!request,
            ...config
        }
    );

    return {
        isLoading,
        error,
        data: response && response.data,
        mutate: refetch
    }
}

export default useRequestQuery
