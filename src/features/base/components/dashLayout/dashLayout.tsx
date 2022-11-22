import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {motion} from "framer-motion";
import {signIn, useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useEffect} from "react";
import {setAgendas, setConfig, setPendingAppointments} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import {dashLayoutState, setOngoing} from "@features/base";
import {AppLock} from "@features/appLock";

const SideBarMenu = dynamic(() => import("@features/sideBarMenu/components/sideBarMenu"));

const variants = {
    hidden: {opacity: 0},
    enter: {opacity: 1},
    exit: {opacity: 0},
};

function DashLayout({children}: LayoutProps) {
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, mutate: mutateAgenda} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, SWRNoValidateConfig);

    const agendas = (httpAgendasResponse as HttpResponse)?.data as AgendaConfigurationModel[];
    const agenda = agendas?.find((item: AgendaConfigurationModel) => item.isDefault) as AgendaConfigurationModel;

    const {data: httpPendingAppointmentResponse, mutate: mutatePendingAppointment} = useRequest(agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda.uuid}/appointments/get/pending/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpOngoingResponse, mutate} = useRequest(agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda.uuid}/ongoing/appointments/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    } : null, SWRNoValidateConfig);

    const calendarStatus = (httpOngoingResponse as HttpResponse)?.data as dashLayoutState;
    const pendingAppointments = (httpPendingAppointmentResponse as HttpResponse)?.data as AppointmentModel[];

    useEffect(() => {
        if (agenda) {
            dispatch(setConfig({...agenda, mutate: [mutateAgenda, mutatePendingAppointment]}));
            dispatch(setAgendas(agendas));
        }
    }, [agenda, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (pendingAppointments) {
            dispatch(setPendingAppointments(pendingAppointments));
        }
    }, [pendingAppointments, dispatch]);

    useEffect(() => {
        if (calendarStatus) {
            dispatch(setOngoing({
                mutate,
                waiting_room: calendarStatus.waiting_room,
                ...(calendarStatus.ongoing && {ongoing: calendarStatus.ongoing})
            }))
        }
    }, [calendarStatus, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //console.log(navigator.brave);
        if (session?.error === "RefreshAccessTokenError") {
            signIn('keycloak', {
                callbackUrl: `${router.locale}/dashboard/agenda`,
            }); // Force sign in to hopefully resolve error
        }
    }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <SideBarMenu>
            <AppLock/>
            <motion.main
                key={router.route}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{type: "linear"}}
            >
                {children}
            </motion.main>
        </SideBarMenu>
    );
}

export default DashLayout;
