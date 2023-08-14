import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useAntecedentTypes() {
    const router = useRouter();

    const {data: httpAntecedentType} = useRequest({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`
    }, SWRNoValidateConfig);


    return {allAntecedents: (httpAntecedentType as HttpResponse)?.data ?? [] as AntecedentsTypeModel[]}
}

export default useAntecedentTypes;
