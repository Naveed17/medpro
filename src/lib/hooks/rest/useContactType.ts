import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useContactType() {
    const router = useRouter();

    const {data: httpContactsResponse} = useRequestQuery({
        method: "GET",
        url: `/api/public/contact-type/${router.locale}`
    }, ReactQueryNoValidateConfig);


    return {contacts: (Array.isArray(httpContactsResponse) ? httpContactsResponse : ((httpContactsResponse as HttpResponse)?.data ?? [])) as ContactModel[]}
}

export default useContactType;
