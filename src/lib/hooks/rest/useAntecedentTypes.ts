import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

function useAntecedentTypes() {
    const router = useRouter();
    const {data: session} = useSession();

    const {data: httpAntecedentType} = useRequest({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`
    }, SWRNoValidateConfig);


    return {allAntecedents: (httpAntecedentType as HttpResponse)?.data ?? []}
}

export default useAntecedentTypes;
