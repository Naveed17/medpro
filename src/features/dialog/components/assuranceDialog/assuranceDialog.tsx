import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {CheckList} from "@features/checkList";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useInsurances} from "@lib/hooks/rest";

function AssuranceDialog(info: any) {
    const {insurances} = useInsurances();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (insurances !== undefined) {
            setLoading(false);
        }
    }, [insurances]);

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    return (<>

        <CheckList items={insurances}
                   data={info}
                   action={'assurance'}
                   loading={loading}
                   search={t('dialogs.search_assurance')}></CheckList>
    </>)
}

export default AssuranceDialog
