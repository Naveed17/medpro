import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useBanks() {
    const router = useRouter();

    const {data: httpBanksResponse} = useRequest({
        method: "GET",
        url: `/api/public/banks/${router.locale}`,
    }, SWRNoValidateConfig);

    return {banks: (Array.isArray(httpBanksResponse) ? httpBanksResponse : ((httpBanksResponse as HttpResponse)?.data ?? [])) as BankModel[]}
}

export default useBanks;
