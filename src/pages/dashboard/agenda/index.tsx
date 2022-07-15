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
import {Session} from "next-auth";
import {Suspense} from 'react';

const Calendar = dynamic(() => import("@features/calendar/components/Calendar"), {
    ssr: false
});

function Agenda() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const {t, ready} = useTranslation('common');

    const loading = status === 'loading';
    const [date, setDate] = useState(new Date());

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, {suspense: true});

    const agenda = (httpAgendasResponse as HttpResponse).data.find((item: AgendaConfigurationModel) => item.isDefault);

    console.log('agenda', agenda);

    const {data: httpAppointmentResponse, error: errorHttpAppointment} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${router.locale}?start_date=2022-01-03&end_date=2022-01-09&format=week&consultationReason=consultationReasonId&type=0..3&status=0..7`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (errorHttpAgendas || errorHttpAppointment) return <div>failed to load</div>
    if (!ready || !httpAgendasResponse || !httpAppointmentResponse) return (<LoadingScreen/>);

    console.log(httpAgendasResponse, httpAppointmentResponse);

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

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
    }
})

export default Agenda

Agenda.auth = true

Agenda.getLayout = function getLayout(page: ReactElement) {
    return (
        <Suspense fallback={<LoadingScreen/>}>
            <DashLayout>
                {page}
            </DashLayout>
        </Suspense>
    )
}
