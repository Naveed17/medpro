import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import {useSession} from "next-auth/react";

function Questions() {
    const {data: session} = useSession();

    return (
        <iframe
            src={`https://www.med.tn/question2.php?token=${session?.accessToken}`}
            loading="lazy"
            allowFullScreen
            width={window.innerWidth}
            height={window.innerHeight}></iframe>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'questions']))
    }
})
export default Questions

Questions.auth = true;

Questions.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
