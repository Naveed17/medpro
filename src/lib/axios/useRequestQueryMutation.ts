import {useSession} from "next-auth/react";
import {useMutation} from "@tanstack/react-query";
import {instanceAxios} from "@lib/axios/index";

function useRequestQueryMutation<Data = unknown, Error = unknown>(key?: string) {
    const {data: session, update} = useSession();
    const {jti} = session?.user as any;

    const {isLoading, error, data: response, mutate: trigger} = useMutation((requestConfig: any) => {
        return instanceAxios.request<any>({
            ...requestConfig,
            ...(!requestConfig?.url?.includes("/api/public") && {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Fcm-session": jti
                }
            })
        }!).catch(async (error) => {
            const originalRequest = error.config;
            if (error.response?.data?.code === 4000 && !originalRequest._retry) {
                const refresh = await update();
                originalRequest._retry = true;
                originalRequest.headers.Authorization = `Bearer ${refresh?.accessToken}`;
                return instanceAxios(originalRequest);
            }
            return Promise.reject(error);
        })
    })

    return {
        trigger,
        isLoading,
        error,
        data: response && response.data
    }
}

export default useRequestQueryMutation
