import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useInsurances(enable: boolean = true) {
    const router = useRouter();

    const {data: httpInsuranceResponse, isLoading} = useRequestQuery(enable ? {
        method: "GET",
        url: `/api/public/insurances/${router.locale}`,
    } : null, ReactQueryNoValidateConfig);

    return {
        insurances: (Array.isArray(httpInsuranceResponse) ? httpInsuranceResponse : ((httpInsuranceResponse as HttpResponse)?.data ?? [])) as InsuranceModel[],
        isLoading
    }
}

export default useInsurances;
