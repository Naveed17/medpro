import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import useRequest from "@app/axios/axiosServiceApi";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

function ModeRegDialog(info:any) {

    const { data: session, status } = useSession();
    const [items, setItems] = useState<InsuranceModel[]>([]);

    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }
    const router = useRouter();

    const { data, error } = useRequest({
        method: "GET",
        url: "/api/public/payment-means/"+router.locale,
        headers
    });

    useEffect(() => {
        if (data !== undefined){
            setItems((data as any).data)
        }
    },[data])

    const { t, ready } = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (
        <CheckList items={items}
                   data={info}
                   action={'mode'}
                   search={''} />
    )
}
export default ModeRegDialog
