import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {Redirect} from "@features/redirect";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useSession} from "next-auth/react";

function Dashboard() {
    const {data: session} = useSession();

    const features = session?.data?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    return (<Redirect to={features?.length > 0 ? `/dashboard/${features[0].root}` : `/dashboard/agenda`}/>);
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
