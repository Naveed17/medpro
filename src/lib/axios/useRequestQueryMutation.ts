import {useSession} from "next-auth/react";
import {useMutation} from "@tanstack/react-query";
import {instanceAxios} from "@lib/axios/index";

function useRequestQueryMutation<Data = unknown, Error = unknown>(key?: string) {
    const {data: session} = useSession();
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
        }!)
    })

    return {
        trigger,
        isLoading,
        error,
        data: response && response.data
    }
}

export default useRequestQueryMutation
