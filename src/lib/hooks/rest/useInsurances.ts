import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useInsurances() {
    const router = useRouter();

    const {data: httpInsuranceResponse} = useRequestQuery({
        method: "GET",
        url: `/api/public/insurances/${router.locale}`,
    }, ReactQueryNoValidateConfig);

    return {insurances: (Array.isArray(httpInsuranceResponse) ? httpInsuranceResponse : ((httpInsuranceResponse as HttpResponse)?.data ?? [])) as InsuranceModel[]}
}

export default useInsurances;
