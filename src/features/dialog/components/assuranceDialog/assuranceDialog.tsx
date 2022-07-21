import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {CheckList} from "@features/checkList";
import useRequest from "@app/axios/useRequest";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function AssuranceDialog(info: any) {

    const { data: session, status } = useSession();
    const [items, setItems] = useState<InsuranceModel[]>([]);

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
            setItems((data as any).data)
        }
    },[data])

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (<>
        <CheckList items={items}
                   data={info}
                   action={'assurance'}
                   search={t('dialogs.search_assurance')}></CheckList>
    </>)
}
export default AssuranceDialog
