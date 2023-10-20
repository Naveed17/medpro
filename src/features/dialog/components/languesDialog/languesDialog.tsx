import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import {useRequestQuery} from "@lib/axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function LanguesDialog(info: any) {
    const [items, setItems] = useState<InsuranceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    const {data} = useRequestQuery({
        method: "GET",
        url: `/api/public/languages/${router.locale}`
    });

    useEffect(() => {
        if (data !== undefined) {
            setItems((data as any).data);
            setLoading(false);
        }
    }, [data]);

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <CheckList items={items}
                   data={info}
                   loading={loading}
                   action={'langues'}
                   search={t('dialogs.search_lang')}/>
    )
}

export default LanguesDialog
