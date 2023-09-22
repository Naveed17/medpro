import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useAntecedentTypes() {
    const router = useRouter();

    const {data: httpAntecedentType} = useRequestQuery({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`
    }, ReactQueryNoValidateConfig);


    return {allAntecedents: (httpAntecedentType as HttpResponse)?.data ?? [] as AntecedentsTypeModel[]}
}

export default useAntecedentTypes;
