import { GetStaticProps, GetStaticPaths } from "next";
import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { getServerTranslations } from "@lib/i18n/getServerTranslations";
import { Box } from "@mui/material";

function PatientDetails() {
    const router = useRouter();
    const error = false
    const { t, ready } = useTranslation("settings");
    if (!ready || error) {
        return <LoadingScreen button {...(error ? {
            OnClick: () => router.push('/dashboard/patients'),
            text: 'loading-error-404-reset'
        } : {})} />;
    }

    return (
        <Box className="container">

        </Box>

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
            ...(await getServerTranslations(locale as string, [
                "common",
                "menu",
                "patient",
                "settings",
            ])),
        },
    }
};

export default PatientDetails;

PatientDetails.auth = true;

PatientDetails.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
