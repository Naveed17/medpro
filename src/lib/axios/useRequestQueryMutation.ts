import {useSession} from "next-auth/react";
import {useMutation} from "@tanstack/react-query";
import {instanceAxios} from "@lib/axios/index";
import {AxiosRequestConfig} from "axios";

function useRequestQueryMutation(key?: string) {
    const {data: session, update} = useSession();
    const {jti} = session?.user as any;

    const {isPending, error, data: response, mutate: trigger} = useMutation({
        mutationFn: async (requestConfig: AxiosRequestConfig) => {
            try {
                return await instanceAxios.request<any>({
                    ...requestConfig,
                    ...(!requestConfig?.url?.includes("/api/public") && {
                        headers: {
                            Authorization: `Bearer ${session?.accessToken}`,
                            "Fcm-session": jti
                        }
                    })
                }!);
            } catch (error) {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    const refresh = await update({refreshAccessToken: true});
                    originalRequest._retry = true;
                    originalRequest.headers.Authorization = `Bearer ${refresh?.accessToken}`;
                    return instanceAxios(originalRequest);
                }
                return await Promise.reject(error);
            }
        }
    })

    return {
        trigger,
        isLoading: isPending,
        error,
        data: response && response.data
    }
}

export default useRequestQueryMutation
