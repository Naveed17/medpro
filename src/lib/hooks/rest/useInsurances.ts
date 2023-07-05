import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

function useInsurances() {
    const router = useRouter();

    const [insurances, setInsurances] = useState<InsuranceModel[]>([]);

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale,
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (httpInsuranceResponse) {
            setInsurances((httpInsuranceResponse as HttpResponse)?.data);
        }
    }, [httpInsuranceResponse]);

    return {insurances}
}

export default useInsurances;
