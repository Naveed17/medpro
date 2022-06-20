import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {useRouter} from "next/router";
import {Box} from "@mui/material";
import DashLayout from "@features/base/components/dashLayout/dashLayout";

function Settings(){
    const router = useRouter();

    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return(
        <Box bgcolor="#F0FAFF"
             sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

            <div>Hello from {router.pathname.slice(1)}</div>
        </Box>
        )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
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