import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useSession} from "next-auth/react";

function Inbox() {
    const {data: session} = useSession();

    return (
        <iframe
            src={`https://www.med.tn/inbox2.php?token=${session?.accessToken}`}
            loading="lazy"
            allowFullScreen
            width={window.innerWidth}
            height={window.innerHeight}></iframe>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "common",
            "menu"
        ])),
    },
});

Inbox.auth = true;

Inbox.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};

export default Inbox;
