import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {motion} from "framer-motion";
import {signIn, useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import React, {useEffect, useState} from "react";
import {setAgendas, setConfig, setPendingAppointments} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import {dashLayoutState, setOngoing} from "@features/base";
import {AppLock} from "@features/appLock";
import {useTheme} from "@mui/material";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import {NoDataCard} from "@features/card";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import {setProgress} from "@features/progressUI";

const SideBarMenu = dynamic(() => import("@features/sideBarMenu/components/sideBarMenu"));

const variants = {
    hidden: {opacity: 0},
    enter: {opacity: 1},
    exit: {opacity: 0},
};

export const ImportCardData = {
    mainIcon: <Icon path={"ic-upload"} width={"100"} height={"100"}/>,
    title: "import_data.sub_title",
    description: "import_data.description",
    buttons: [{
        text: "import_data.button",
        icon: <Icon path={"ic-upload"} width={"18"} height={"18"}/>,
        variant: "expire",
        color: "white"
    }]
};

function DashLayout({children}: LayoutProps) {
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {closeSnackbar} = useSnackbar();

    const {t} = useTranslation('common');

    const [importDataDialog, setImportDataDialog] = useState<boolean>(false);

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
            if (calendarStatus.import_data?.length === 0) {
                localStorage.removeItem("import-data");
                localStorage.removeItem("import-data-progress");
                closeSnackbar();
            } else {
                const progress = localStorage.getItem("import-data-progress")
                dispatch(setProgress(progress ? parseFloat(progress) : 10));
            }

            dispatch(setOngoing({
                mutate,
                waiting_room: calendarStatus.waiting_room,
                import_data: calendarStatus.import_data,
                next: calendarStatus.next ? calendarStatus.next : null,
                last_fiche_id: justNumbers(calendarStatus.last_fiche_id ? calendarStatus.last_fiche_id : '0'),
                ...(calendarStatus.ongoing && {ongoing: calendarStatus.ongoing})
            }));

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

    const justNumbers = (str: string) => {
        const res = str.match(/\d+$/)
        if (str && res) {
            let numStr = res[0];
            let num = parseInt(numStr);
            num++;
            str = str.replace(numStr, num.toString());
        }
        return str;
    }

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
            <Dialog
                {...{
                    sx: {
                        minHeight: 340
                    }
                }}
                color={theme.palette.expire.main}
                contrastText={theme.palette.expire.contrastText}
                dialogClose={() => {
                    setImportDataDialog(false);
                }}
                action={() => {
                    return (<NoDataCard
                        {...{t}}
                        ns={'common'}
                        onHandleClick={() => {
                            router.push('/dashboard/settings/data').then(() => {
                                setImportDataDialog(false);
                            });
                        }}
                        data={ImportCardData}/>)
                }}
                open={importDataDialog}
                title={t(`import_data.title`)}
            />
        </SideBarMenu>
    );
}

export default DashLayout;
