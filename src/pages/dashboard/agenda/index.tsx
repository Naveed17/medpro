import {GetServerSideProps, GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useRouter} from "next/router";
import {Box} from "@mui/material";
import {DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/toolbar";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";

import dynamic from "next/dynamic";
import {useSession} from "next-auth/react";
import {LoadingScreen} from "@features/loadingScreen";
import useRequest from "@app/axios/axiosServiceApi";
import {getToken} from "next-auth/jwt";

const Calendar = dynamic(() => import("@features/calendar/components/Calendar"), {
    ssr: false
});

function Agenda({...props}) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const {t, ready} = useTranslation('common');

    const loading = status === 'loading';
    const [date, setDate] = useState(new Date());

    const medical_entity = (props?.data as UserDataResponse)?.medical_entity;

    const {data: httpResponse, error} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (error) return <div>failed to load</div>
    if (!ready || !httpResponse || loading) return (<LoadingScreen/>);

    console.log(httpResponse);

    return (
        <>
            <SubHeader>
                <CalendarToolbar date={date}/>
            </SubHeader>
            <Box>
                <DesktopContainer>
                    <Calendar/>
                </DesktopContainer>
                <MobileContainer>
                    <div>mobile</div>
                </MobileContainer>
            </Box>
        </>
    )
}

// Export the `session` prop to use sessions with Server Side Rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
    const request = context.req;
    const jwt = await getToken({
        req: request
    });

    return {
        props: {
            fallback: false,
            data: jwt?.data,
            ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
        }
    }
}
export default Agenda

Agenda.auth = true

Agenda.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
