import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {CheckList} from "@features/checkList";
import {useRequest} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";

function AssuranceDialog(info: any) {

    const { data: session, status } = useSession();
    const [items, setItems] = useState<InsuranceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }
    const router = useRouter();

    const { data, error } = useRequest({
        method: "GET",
        url: "/api/public/insurances/"+router.locale,
        headers
    });

    useEffect(() => {
        if (data !== undefined){
            setItems((data as any).data);
            setLoading(false);
        }
    },[data]);

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (<>

        <CheckList items={items}
                   data={info}
                   action={'assurance'}
                   loading={loading}
                   search={t('dialogs.search_assurance')}></CheckList>
    </>)
}
export default AssuranceDialog
