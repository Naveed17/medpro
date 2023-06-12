import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useContactType() {
    const router = useRouter();
     const {data} = useRequest({
        method: "GET",
        url: "/api/public/contact-type/" + router.locale
    }, SWRNoValidateConfig);
    const contacts = (data as HttpResponse)?.data as ContactModel[];
    return contacts
}

export default useContactType;
