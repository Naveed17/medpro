import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {getServerTranslations} from "@lib/i18n/getServerTranslations";

function InscDetail() {

    return (
        <>
            hello
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await getServerTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default InscDetail;

InscDetail.auth = true;

InscDetail.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
