import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {DocToolbar} from "@features/toolbar";
import {Box} from "@mui/material";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Document() {
    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    },
                }}>
                <DocToolbar/>
            </SubHeader>
            <Box className="container">
            </Box>
        </>
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
