import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

function useContactType() {
    const router = useRouter();
    const [contacts, setContacts] = useState<ContactModel[]>([]);

    const {data: httpContactsResponse} = useRequest({
        method: "GET",
        url: `/api/public/contact-type/${router.locale}`
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (httpContactsResponse) {
            setContacts((httpContactsResponse as HttpResponse)?.data);
        }
    }, [httpContactsResponse]);

    return contacts
}

export default useContactType;
