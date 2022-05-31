import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useRouter} from "next/router";
import {Box, FormControlLabel, FormGroup} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import SubHeader from "@features/subHeader/components/subHeader";
import CalendarToolbar from "@features/calendarToolbar/components/calendarToolbar";
import DashLayout from "@features/base/dashLayout";

function Dashborad(){
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return(
        <>
            <SubHeader>
                <CalendarToolbar date={date} />
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                 sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

                <div>Hello from {router.pathname.slice(1)}</div>
            </Box>
        </>
        )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
    }
})
export default Dashborad

Dashborad.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
