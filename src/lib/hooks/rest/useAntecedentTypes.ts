import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

function useAntecedentTypes() {
    const router = useRouter();
    const {data: session} = useSession();

    const [allAntecedents, setAllAntecedents] = useState<any[]>([]);

    const {data: httpAntecedentType} = useRequest({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);


    useEffect(() => {
        if (httpAntecedentType) {
            setAllAntecedents((httpAntecedentType as HttpResponse)?.data);
        }
    }, [httpAntecedentType])

    return {allAntecedents}
}

export default useAntecedentTypes;
