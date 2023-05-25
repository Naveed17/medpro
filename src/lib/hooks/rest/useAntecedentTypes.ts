import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

function useAntecedentTypes() {
    const router = useRouter();
    const {data: session} = useSession();

    return useRequest({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);
}

export default useAntecedentTypes;
