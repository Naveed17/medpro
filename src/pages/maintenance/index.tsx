import {LoadingScreen} from "@features/loadingScreen";
import React from "react";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Maintenance() {
    return <LoadingScreen error text={"maintenance-error"}/>
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common']))
    }
})
export default Maintenance;
