import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import {useRequest} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));


function ModeRegDialog(info:any) {
    const [items, setItems] = useState<InsuranceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    const { data } = useRequest({
        method: "GET",
        url: `/api/public/payment-means/${router.locale}`
    });

    useEffect(() => {
        if (data !== undefined){
            setItems((data as any).data);
            setLoading(false);
        }
    },[data])

    const { t, ready } = useTranslation("settings");
    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    return (
        <CheckList items={items}
                   data={info}
                   loading={loading}
                   action={'mode'}
                   search={''} />
    )
}
export default ModeRegDialog
