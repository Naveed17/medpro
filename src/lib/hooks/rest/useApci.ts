import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useApci(insurance: string) {
    const router = useRouter();

    const {data: httpApciResponse} = useRequestQuery(insurance ? {
        method: "GET",
        url: `/api/private/apcis/${insurance}/${router.locale}`
    } : null , ReactQueryNoValidateConfig);

    return {
        apcis: httpApciResponse? httpApciResponse.data : []
    }
}

export default useApci;
