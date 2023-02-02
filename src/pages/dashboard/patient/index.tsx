// react
import React, {ReactElement, useEffect, useState} from "react";
// next
import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
// material components
import {Box, Button, Drawer, Typography, useTheme} from "@mui/material";
// redux
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {onOpenPatientDrawer, Otable, tableActionSelector} from "@features/table";
import {configSelector, DashLayout} from "@features/base";
// ________________________________
import {PatientMobileCard} from "@features/card";
import {SubHeader} from "@features/subHeader";
import {PatientToolbar} from "@features/toolbar";
import {CustomStepper} from "@features/customStepper";
import {useRequest, useRequestMutation} from "@app/axios";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {
    AddPatientStep1,
    AddPatientStep2,
    AddPatientStep3,
    onResetPatient,
    setAppointmentPatient,
} from "@features/tabPanel";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {AppointmentDetail, Dialog, dialogMoveSelector, PatientDetail} from "@features/dialog";
import {leftActionBarSelector} from "@features/leftActionBar";
import {prepareSearchKeys, useIsMountedRef} from "@app/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";
import {toggleSideBar} from "@features/sideBarMenu";
import {appLockSelector} from "@features/appLock";
import {LoadingScreen} from "@features/loadingScreen";
import {EventDef} from "@fullcalendar/react";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import moment from "moment-timezone";
import {useSnackbar} from "notistack";

const humanizeDuration = require("humanize-duration");

const stepperData = [
    {
        title: "tabs.personal-info",
        children: AddPatientStep1,
        disabled: false,
    },
    {
        title: "tabs.additional-information",
        children: AddPatientStep2,
        disabled: true,
    },
    {
        title: "tabs.fin",
        children: AddPatientStep3,
        disabled: true,
    },
];

// interface
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        sortable: true,
        align: "left",
    },
    {
        id: "insurance",
        numeric: false,
        disablePadding: true,
        label: "insurance",
        sortable: true,
        align: "left",
    },
    {
        id: "telephone",
        numeric: true,
        disablePadding: false,
        label: "telephone",
        sortable: true,
        align: "left",
    },
    {
        id: "nextAppointment",
        numeric: false,
        disablePadding: false,
        label: "nextAppointment",
        sortable: false,
        align: "left",
    },
    {
        id: "lastAppointment",
        numeric: false,
        disablePadding: false,
        label: "lastAppointment",
        sortable: false,
        align: "left",
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "action",
        sortable: false,
        align: "right",
    },
];

function Patient() {
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const isMounted = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();
    // selectors
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {tableState} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {openViewDrawer, config: agendaConfig} = useAppSelector(agendaSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime,
    } = useAppSelector(dialogMoveSelector);
    // state hook for details drawer
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [appointmentMoveData, setAppointmentMoveData] = useState<EventDef>();
    const [patientDrawer, setPatientDrawer] = useState<boolean>(false);
    const [isAddAppointment, setAddAppointment] = useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(null);
    const [localFilter, setLocalFilter] = useState("");
    const [moveDialogInfo, setMoveDialogInfo] = useState<boolean>(false);
    const [moveDialog, setMoveDialog] = useState<boolean>(false);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientsResponse, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/patients/${router.locale}?page=${router.query.page || 1}&limit=10&withPagination=true${localFilter}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {trigger: updateAppointmentTrigger} = useRequestMutation(null, "/patient/update/appointment");

    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];

    useEffect(() => {
        if (filter?.type || filter?.patient) {
            const query = prepareSearchKeys(filter as any);
            setLocalFilter(query);
        }
    }, [filter]);

    useEffect(() => {
        if (isMounted.current && !lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    const submitStepper = (index: number) => {
        if (index === 2) {
            mutate();
        }
    }

    const handleMoveAppointment = (event: EventDef) => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        params.append('start_time',
            event.extendedProps.newDate.clone().subtract(event.extendedProps.from ? 0 : 1, 'hours').format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;
        params.append('duration', event.extendedProps.duration);
        updateAppointmentTrigger({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: params,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }).then((result) => {
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(t(`dialogs.move-dialog.${!event.extendedProps.onDurationChanged ?
                    "alert-msg" : "alert-msg-duration"}`), {variant: "success"});
            }
            setMoveDialog(false);
            setLoadingRequest(false);
            mutate();
        });
    }

    const onConsultationView = (event: EventDef) => {
        const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale});
    }

    const onUpdateMoveAppointmentData = () => {
        const timeSplit = moveDialogTime.split(':');
        const date = moment(moveDialogDate?.setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1])));
        const defEvent = {
            ...appointmentMoveData,
            extendedProps: {
                newDate: date,
                from: 'modal',
                duration: appointmentMoveData?.extendedProps.dur,
                onDurationChanged: false,
                oldDate: moment(appointmentMoveData?.extendedProps.time)
            }
        } as EventDef;
        setAppointmentMoveData(defEvent);
        setMoveDialogInfo(false);
        setMoveDialog(true);
    }

    const handleTableActions = (action: string, event: PatientModel) => {
        switch (action) {
            case "PATIENT_DETAILS":
                setAddAppointment(false);
                setPatientDetailDrawer(true);
                break;
            case "EDIT_PATIENT":
                setSelectedPatient(event);
                setPatientDrawer(true);
                break;
            case "ADD_APPOINTMENT":
                if (patientDrawer) {
                    dispatch(onResetPatient());
                    setPatientDrawer(false);
                }
                dispatch(setAppointmentPatient(event as any));
                setAddAppointment(true);
                setSelectedPatient(event);
                setPatientDetailDrawer(true);
                break;
            case "APPOINTMENT_MOVE":
                setMoveDialogInfo(true);
                setAppointmentMoveData(event as any);
                break;
        }
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <PatientToolbar
                    onAddPatient={() => {
                        dispatch(onResetPatient());
                        setSelectedPatient(null);
                        setPatientDrawer(true);
                    }}
                />
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <Box display={{xs: "none", md: "block"}}>
                        <Otable
                            {...{t, insurances}}
                            headers={headCells}
                            handleEvent={handleTableActions}
                            rows={(httpPatientsResponse as HttpResponse)?.data?.list}
                            total={(httpPatientsResponse as HttpResponse)?.data?.total}
                            totalPages={(httpPatientsResponse as HttpResponse)?.data?.totalPages}
                            from={"patient"}
                            pagination
                            loading={!Boolean(httpPatientsResponse)}
                        />
                    </Box>
                </DesktopContainer>
                <MobileContainer>
                    <PatientMobileCard
                        ready={ready}
                        handleEvent={handleTableActions}
                        PatientData={(httpPatientsResponse as HttpResponse)?.data?.list}
                    />
                </MobileContainer>
            </Box>

            <Dialog
                size={"sm"}
                sx={{
                    [theme.breakpoints.down('sm')]: {
                        "& .MuiDialogContent-root": {
                            padding: 1
                        }
                    }
                }}
                color={theme.palette.primary.main}
                contrastText={theme.palette.primary.contrastText}
                dialogClose={() => {
                    setMoveDialogInfo(false);
                }}
                action={"move_appointment"}
                dir={direction}
                open={moveDialogInfo}
                title={t(`dialogs.move-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            startIcon={<CloseIcon/>}
                            onClick={() => {
                                setMoveDialogInfo(false);
                            }}
                        >
                            {t(`dialogs.move-dialog.garde-date`)}
                        </Button>
                        <Button
                            onClick={() => {
                                onUpdateMoveAppointmentData();
                            }}
                            variant="contained"
                            color={"primary"}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="iconfinder"></Icon>}
                        >
                            {t(`dialogs.move-dialog.confirm`)}
                        </Button>
                    </>
                }
            />

            <Dialog
                color={theme.palette.warning.main}
                contrastText={theme.palette.warning.contrastText}
                dialogClose={() => {
                    appointmentMoveData?.extendedProps.revert && appointmentMoveData?.extendedProps.revert();
                    setMoveDialog(false);
                }}
                dir={direction}
                action={() => {
                    return (appointmentMoveData &&
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.move-dialog.${!appointmentMoveData?.extendedProps.onDurationChanged ? "sub-title" : "sub-title-duration"}`)}</Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>
                                {!appointmentMoveData?.extendedProps.onDurationChanged ? <>
                                    {appointmentMoveData?.extendedProps.oldDate.clone().subtract(appointmentMoveData?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")} {" => "}
                                    {appointmentMoveData?.extendedProps.newDate.clone().subtract(appointmentMoveData?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")}
                                </> : <>
                                    {humanizeDuration(appointmentMoveData?.extendedProps.oldDuration * 60000)} {" => "}
                                    {humanizeDuration(appointmentMoveData?.extendedProps.duration * 60000)}
                                </>
                                }

                            </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t("dialogs.move-dialog.description")}</Typography>
                        </Box>)
                }}
                open={moveDialog}
                title={t(`dialogs.move-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => {
                                appointmentMoveData?.extendedProps.revert && appointmentMoveData?.extendedProps.revert();
                                setMoveDialog(false)
                            }}
                            startIcon={<CloseIcon/>}
                        >
                            {t("dialogs.move-dialog.garde-date")}
                        </Button>
                        <LoadingButton
                            loading={loadingRequest}
                            loadingPosition="start"
                            onClick={() => {
                                handleMoveAppointment(appointmentMoveData as EventDef);
                            }}
                            variant="contained"
                            color={"warning"}
                            startIcon={<Icon path="iconfinder"></Icon>}
                        >
                            {t("dialogs.move-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            />

            <Drawer
                anchor={"right"}
                open={openViewDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(openDrawer({type: "view", open: false}));
                }}
            >
                <AppointmentDetail
                    OnDataUpdated={() => mutate()}
                />
            </Drawer>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}
            >
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId, mutate}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onConsultation={onConsultationView}
                    onAddAppointment={() => console.log("onAddAppointment")}/>
            </Drawer>

            <Drawer
                anchor={"right"}
                open={patientDrawer}
                dir={direction}
                onClose={() => {
                    setPatientDrawer(false);
                    dispatch(
                        onOpenPatientDrawer({
                            patientId: "",
                            patientAction: "",
                        })
                    );
                }}
                sx={{
                    "& .MuiTabs-root": {
                        position: "sticky",
                        top: 0,
                        bgcolor: (theme) => theme.palette.background.paper,
                        zIndex: 11,
                    },
                }}>
                <CustomStepper
                    translationKey="patient"
                    prefixKey="add-patient"
                    OnSubmitStepper={submitStepper}
                    OnCustomAction={handleTableActions}
                    scroll
                    {...{stepperData, t, selectedPatient}}
                    minWidth={648}
                    onClose={() => {
                        dispatch(onResetPatient());
                        setPatientDrawer(false);
                    }}
                />
            </Drawer>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "patient",
            "agenda",
            "consultation",
            "menu",
            "common",
        ])),
    },
});

export default Patient;

Patient.auth = true;

Patient.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
