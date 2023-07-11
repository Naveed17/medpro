import {useCallback} from "react";
import {useSession} from "next-auth/react";
import {useRequestMutation} from "@lib/axios/index";
import {useSWRConfig} from "swr";

export const useRefreshMutation = () => {

    const {data: session} = useSession();
    const {mutate} = useSWRConfig()

    const {trigger} = useRequestMutation(null, "/model/refresh");

    const refresh = useCallback((url:string) => {

          trigger({
            method: "GET",
            url,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then((result) => {
            mutate(url, (result?.data as HttpResponse).data).then(()=>{
            })
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return {refresh};

};
