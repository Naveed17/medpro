import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Document() {
    return (
        <></>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "menu",
                "common",
                "docs"
            ])),
        },
    };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
}

export default Document;

Document.auth = true;

Document.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}
