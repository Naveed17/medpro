import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useContactType() {
    const router = useRouter();

    const {data: httpContactsResponse} = useRequest({
        method: "GET",
        url: `/api/public/contact-type/${router.locale}`
    }, SWRNoValidateConfig);


    return {contacts: Array.isArray(httpContactsResponse) ? httpContactsResponse : ((httpContactsResponse as HttpResponse)?.data ?? [])}
}

export default useContactType;
