import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {Redirect} from "@features/redirect";

function Dashborad() {

    return (
        <Redirect to='/dashboard/agenda'/>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

Dashborad.auth = true

Dashborad.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Dashborad
