import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import React from "react";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function Initialization() {
    const {update} = useSession();
    const router = useRouter();

    return <LoadingScreen
        color={"primary"}
        text={"initialisation-error"}
        button
        OnClick={() => {
            update({refresh: true}).then((data) => {
                if (!data?.hasOwnProperty("error")) {
                    router.reload();
                }
            })
        }}/>
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common']))
    }
})
export default Initialization;
