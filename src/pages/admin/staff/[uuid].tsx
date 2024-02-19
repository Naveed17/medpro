import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState, memo, useRef } from "react";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    Box,
    TextField,
    Grid,
    Button,
    IconButton,
} from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { useRouter } from "next/router";
import { DashLayout } from "@features/base";

import { LoadingScreen } from "@features/loadingScreen";


function ModifyUser() {
    const router = useRouter();

    const { t, ready } = useTranslation("settings");

    const error = false
    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/settings/users'),
                text: 'loading-error-404-reset'
            } : {})}
        />;
    }



    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t("users.path_update")}</p>
                </RootStyled>
            </SubHeader>

            <Box className="container">

            </Box>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({ locale }) => {

    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "common",
                "menu",
                "patient",
                "settings",
            ])),
        },
    }
};

export default ModifyUser;

ModifyUser.auth = true;

ModifyUser.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
