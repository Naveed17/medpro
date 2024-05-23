import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { DashLayout } from "@features/base";
import { Settings as SettingsFilter } from '@features/leftActionBar';
import { Redirect } from "@features/redirect";
import { MobileContainer } from "@lib/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Settings() {
    const { data: session } = useSession();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const slugFeature = router.pathname.split('/')[2];
    const features = session?.data?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;
    const permissions = features?.find((feature: FeatureModel) => slugFeature?.includes(feature.slug))?.permissions ?? [];
    const featurePermissionSlug = permissions?.reduce((permissions: string[], permission: string) => [...(permissions ?? []), ...(permission.includes('__show') ? [permission] : [])], []) ?? false;

    if (!isMobile) {
        return <Redirect
            to={`/dashboard/settings/${featurePermissionSlug?.length > 0 ? featurePermissionSlug[0].split("__")[1] : 'general'}`} />
    }

    return (
        <Box>
            <SettingsFilter />
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
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
