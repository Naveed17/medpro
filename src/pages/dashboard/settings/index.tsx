import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import { Settings as SettingsFilter } from '@features/leftActionBar'
function Redirect({ to }: { to: string }) {
    const router = useRouter();
    useEffect(() => {
        router.push(to);
    }, [router, to]);
    return null;
}
function Settings() {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const { t, ready } = useTranslation('settings');
    if (!isMobile) {
        return <Redirect to='/dashboard/settings/profil' />
    }
    if (!ready) return (<>loading translations...</>);

    return (
        <Box className="container">
            <SettingsFilter />
        </Box>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
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
