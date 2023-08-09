import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {Box, useMediaQuery} from "@mui/material";
import {DashLayout} from "@features/base";
import {Settings as SettingsFilter} from '@features/leftActionBar';
import {Redirect} from "@features/redirect";
import {MobileContainer} from "@lib/constants";

function Settings() {
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    if (!isMobile) {
        return <Redirect to='/dashboard/settings/profil'/>
    }

    return (
        <Box>
            <SettingsFilter/>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['settings']))
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
