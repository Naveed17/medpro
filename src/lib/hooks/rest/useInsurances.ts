import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useInsurances() {
    const router = useRouter();

    return useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale,
    }, SWRNoValidateConfig);
}

export default useInsurances;
