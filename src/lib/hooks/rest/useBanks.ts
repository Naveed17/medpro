import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useBanks() {
    const router = useRouter();

    const {data: httpBanksResponse} = useRequestQuery({
        method: "GET",
        url: `/api/public/banks/${router.locale}`,
    }, ReactQueryNoValidateConfig);

    return {banks: (Array.isArray(httpBanksResponse) ? httpBanksResponse : ((httpBanksResponse as HttpResponse)?.data ?? [])) as BankModel[]}
}

export default useBanks;
