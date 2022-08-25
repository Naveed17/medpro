import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import {useRequest} from "@app/axios";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
function LanguesDialog(info:any) {

    const { data: session, status } = useSession();
    const [items, setItems] = useState<InsuranceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }
    const { data, error } = useRequest({
        method: "GET",
        url: "/api/public/languages/"+router.locale,
        headers
    });

    useEffect(() => {
        if (data !== undefined){
            setItems((data as any).data);
            setLoading(false);
        }
    },[data]);

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (
        <CheckList items={items}
                   data={info}
                   loading={loading}
                   action={'langues'}
                   search={t('dialogs.search_lang')}/>
    )
}
export default LanguesDialog
