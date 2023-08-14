import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useInsurances() {
    const router = useRouter();

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: `/api/public/insurances/${router.locale}`,
    }, SWRNoValidateConfig);

    return {insurances: (Array.isArray(httpInsuranceResponse) ? httpInsuranceResponse : ((httpInsuranceResponse as HttpResponse)?.data ?? [])) as InsurancesModel[]}
}

export default useInsurances;
