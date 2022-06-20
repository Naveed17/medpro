import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import DashLayout from "@features/base/dashLayout";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/calendarToolbar";
import {useTranslation} from "next-i18next";
import {Box} from "@mui/material";

function Agenda() {

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (<>
        <SubHeader>
            <RootStyled>
                <p style={{margin: 0}}>{t('agenda.path')}</p>
            </RootStyled>
        </SubHeader>

        <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>

        </Box>

    </>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})

export default Agenda
Agenda.auth = true;

Agenda.getLayout = function getLayout(page: ReactElement) {
     return (
         <DashLayout>
             {page}
         </DashLayout>
     )
}