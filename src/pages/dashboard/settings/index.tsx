import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {Box, useMediaQuery} from "@mui/material";
import {Theme} from "@mui/material/styles";
import {DashLayout} from "@features/base";
import {Settings as SettingsFilter} from '@features/leftActionBar';
import {Redirect} from "@features/redirect";
import {LoadingScreen} from "@features/loadingScreen";

function Settings() {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const {t, ready} = useTranslation('settings');
    if (!isMobile) {
        return <Redirect to='/dashboard/settings/profil'/>
    }
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <Box className="container">
            <SettingsFilter/>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'settings']))
    }
})
export default Settings

Settings.auth = true

Settings.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
