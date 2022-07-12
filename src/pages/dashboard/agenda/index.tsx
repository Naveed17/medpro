import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import {DashLayout} from "@features/base";
import { SubHeader } from "@features/subHeader";
import { CalendarToolbar } from "@features/toolbar";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {Calendar} from "@features/calendar";

function Agenda() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return (
        <>
            <SubHeader>
                <CalendarToolbar date={date} />
            </SubHeader>
            <Box>
                <DesktopContainer>
                    <Calendar />
                </DesktopContainer>
                <MobileContainer>
                    <div>mobile</div>
                </MobileContainer>
            </Box>
        </>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
    }
})
export default Agenda

Agenda.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
