import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {CheckList} from "@features/checkList";
import {LoadingScreen} from "@features/loadingScreen";
import {useInsurances} from "@lib/hooks/rest";

function AssuranceDialog(info: any) {
    const {data: httpInsuranceResponse} = useInsurances();

    const [items, setItems] = useState<InsuranceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (httpInsuranceResponse !== undefined) {
            setItems((httpInsuranceResponse as any).data);
            setLoading(false);
        }
    }, [httpInsuranceResponse]);

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
