import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";

function Configs() {
    const {data: session} = useSession();

    return (
        <iframe
            src={`https://www.med.tn/update2.php?token=${session?.accessToken}`}
            loading="lazy"
            allowFullScreen
            width={window.innerWidth}
            height={window.innerHeight}></iframe>
    )
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});
export default Configs;

Configs.auth = true;

Configs.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
