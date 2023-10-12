import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {Redirect} from "@features/redirect";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Dashboard() {
    return (
        <Redirect to='/dashboard/agenda'/>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
    }
})

Dashboard.auth = true

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Dashboard
