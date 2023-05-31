// react
import React, {ReactElement, useEffect, useState} from "react";
// next
import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
// material components
import {
    Box,
    Button,
    Drawer,
    Typography,
    useTheme,
    Stack,
    TextField,
    useMediaQuery,
    Zoom,
    Fab
} from "@mui/material";
// redux
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    onOpenPatientDrawer,
    Otable,
    tableActionSelector,
} from "@features/table";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
// ________________________________
import {PatientMobileCard, setTimer} from "@features/card";
import {SubHeader} from "@features/subHeader";
import {PatientToolbar} from "@features/toolbar";
import {CustomStepper} from "@features/customStepper";
import {useRequest, useRequestMutation} from "@lib/axios";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {
    AddPatientStep1,
    AddPatientStep2,
    AddPatientStep3, appointmentSelector,
    onResetPatient, resetSubmitAppointment,
    setAppointmentPatient,
} from "@features/tabPanel";
import {
    AppointmentDetail,
    Dialog,
    dialogMoveSelector,
    PatientDetail,
} from "@features/dialog";
import {leftActionBarSelector} from "@features/leftActionBar";
import {prepareSearchKeys, useIsMountedRef, useMedicalEntitySuffix} from "@lib/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {LoadingScreen} from "@features/loadingScreen";
import {EventDef} from "@fullcalendar/core/internal";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import moment from "moment-timezone";
import {useSnackbar} from "notistack";
import {IconButton} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {Accordion} from "@features/accordion/components";
import {DrawerBottom} from "@features/drawerBottom";
import {
    PlaceFilter,
    PatientFilter,
    FilterRootStyled,
    RightActionData,
    ActionBarState,
    setFilter,
} from "@features/leftActionBar";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import {sendRequest, useInsurances} from "@lib/hooks/rest";
import useSWRMutation from "swr/mutation";

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
    const {data: session, status} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isMounted = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {insurances} = useInsurances();
    // selectors
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {tableState} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {openViewDrawer, config: agendaConfig} = useAppSelector(agendaSelector);
    const {submitted} = useAppSelector(appointmentSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {date: moveDialogDate, time: moveDialogTime} = useAppSelector(dialogMoveSelector);
    const {mutate: mutateOnGoing, medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    // state hook for details drawer
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [appointmentMoveData, setAppointmentMoveData] = useState<EventDef>();
    const [patientDrawer, setPatientDrawer] = useState<boolean>(false);
    const [isAddAppointment, setAddAppointment] = useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(
        null
    );
    const [localFilter, setLocalFilter] = useState("");
    const [moveDialogInfo, setMoveDialogInfo] = useState<boolean>(false);
    const [moveDialog, setMoveDialog] = useState<boolean>(false);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [loading] = useState<boolean>(status === "loading");
    const {collapse} = RightActionData.filter;
    const [open, setopen] = useState(false);
    const [dataPatient, setDataPatient] = useState([
        {
            heading: {
                id: collapse[0].heading.title,
                icon: collapse[0].heading.icon,
                title: collapse[0].heading.title.toLowerCase(),
            },
            expanded: true,
            children: (
                <FilterRootStyled>
                    <PatientFilter
                        OnSearch={(data: { query: ActionBarState }) => {
                            router
                                .replace("/dashboard/patient?page=1", "/dashboard/patient", {
                                    shallow: true,
                                })
                                .then(() => {
                                    dispatch(setFilter({patient: data.query}));
                                });
                        }}
                        item={{
                            heading: {
                                icon: "ic-patient",
                                title: "patient",
                            },
                            gender: {
                                heading: "gender",
                                genders: ["male", "female"],
                            },
                            textField: {
                                labels: [
                                    {label: "name", placeholder: "search"},
                                    {label: "birthdate", placeholder: "--/--/----"},
                                ],
                            },
                        }}
                        keyPrefix={"filter."}
                        t={t}
                    />
                </FilterRootStyled>
            ),
        },
        {
            heading: {
                id: collapse[1].heading.title,
                icon: collapse[1].heading.icon,
                title: collapse[1].heading.title.toLowerCase(),
            },
            expanded: true,
            children: (
                <FilterRootStyled>
                    <PlaceFilter
                        OnSearch={(data: { query: ActionBarState }) => {
                            router
                                .replace("/dashboard/patient?page=1", "/dashboard/patient", {
                                    shallow: true,
                                })
                                .then(() => {
                                    dispatch(setFilter({patient: data.query}));
                                });
                            dispatch(setFilter({patient: data.query}));
                        }}
                        item={collapse[1]}
                        t={t}
                        keyPrefix={"filter."}
                    />
                </FilterRootStyled>
            ),
        },
    ]);

    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);

    const {data: httpPatientsResponse, mutate} = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${router.locale}?page=${router.query.page || 1}&limit=10&withPagination=true${localFilter}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {trigger: updateAppointmentTrigger} = useRequestMutation(null, "/patient/update/appointment");

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
    };

    const handleMoveAppointment = (event: EventDef) => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append(
            "start_date",
            event.extendedProps.newDate.format("DD-MM-YYYY")
        );
        params.append(
            "start_time",
            event.extendedProps.newDate
                .clone()
                .subtract(event.extendedProps.from ? 0 : 1, "hours")
                .format("HH:mm")
        );
        const eventId = event.publicId ? event.publicId : (event as any).id;
        params.append("duration", event.extendedProps.duration);
        updateAppointmentTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: params,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then((result) => {
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(
                    t(
                        `dialogs.move-dialog.${
                            !event.extendedProps.onDurationChanged
                                ? "alert-msg"
                                : "alert-msg-duration"
                        }`
                    ),
                    {variant: "success"}
                );
            }
            setMoveDialog(false);
            setLoadingRequest(false);
            mutate();
        });
    };

    const onConsultationView = (event: EventDef) => {
        const slugConsultation = `/dashboard/consultation/${
            event?.publicId ? event?.publicId : (event as any)?.id
        }`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale});
    };

    const onConsultationStart = (event: EventDef) => {
        const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
            updateAppointmentStatus({
                method: "PATCH",
                data: {
                    status: "4",
                    start_date: moment().format("DD-MM-YYYY"),
                    start_time: moment().format("HH:mm")
                },
                url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
            } as any).then(() => {
                dispatch(openDrawer({type: "view", open: false}));
                dispatch(setTimer({
                        isActive: true,
                        isPaused: false,
                        event,
                        startTime: moment().utc().format("HH:mm")
                    }
                ));
                // refresh on going api
                mutateOnGoing && mutateOnGoing();
            });
        })
    };

    const onUpdateMoveAppointmentData = () => {
        const timeSplit = moveDialogTime.split(":");
        const date = moment(
            moveDialogDate?.clone().toDate().setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1]))
        );
        const defEvent = {
            ...appointmentMoveData,
            extendedProps: {
                newDate: date,
                from: "modal",
                duration: appointmentMoveData?.extendedProps.dur,
                onDurationChanged: false,
                oldDate: moment(appointmentMoveData?.extendedProps.time),
            },
        } as EventDef;
        setAppointmentMoveData(defEvent);
        setMoveDialogInfo(false);
        setMoveDialog(true);
    };

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
                if (submitted) {
                    dispatch(resetSubmitAppointment());
                }
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
            case "CLOSE":
                dispatch(onResetPatient());
                setPatientDrawer(false);
                break;
        }
    }

    const handleClickOpen = () => {
        setopen(true);
    }

    const onFilterPatient = (value: string) => {
        dispatch(setFilter({patient: {name: value}}));
    }

    if (!ready) return (<LoadingScreen error button={"loading-error-404-reset"} text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    },
                }}>
                <PatientToolbar
                    onAddPatient={() => {
                        dispatch(onResetPatient());
                        setSelectedPatient(null);
                        setPatientDrawer(true);
                    }}
                />
                {isMobile && (
                    <Stack direction="row" spacing={2} width={1} mt={2.5}>
                        <TextField
                            onChange={(e) => onFilterPatient(e.target.value)}
                            fullWidth
                            placeholder={t("filter.search")}
                        />
                        <IconButton disableRipple onClick={handleClickOpen}>
                            <IconUrl path="ic-setting-grey"/>
                        </IconButton>
                    </Stack>
                )}
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
                            totalPages={
                                (httpPatientsResponse as HttpResponse)?.data?.totalPages
                            }
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
                    [theme.breakpoints.down("sm")]: {
                        "& .MuiDialogContent-root": {
                            padding: 1,
                        },
                    },
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
                            }}>
                            {t(`dialogs.move-dialog.garde-date`)}
                        </Button>
                        <Button
                            onClick={() => {
                                onUpdateMoveAppointmentData();
                            }}
                            variant="contained"
                            color={"primary"}
                            startIcon={
                                <Icon
                                    height={"18"}
                                    width={"18"}
                                    color={"white"}
                                    path="iconfinder"></Icon>
                            }>
                            {t(`dialogs.move-dialog.confirm`)}
                        </Button>
                    </>
                }
            />

            <Dialog
                color={theme.palette.warning.main}
                contrastText={theme.palette.warning.contrastText}
                dialogClose={() => {
                    appointmentMoveData?.extendedProps.revert &&
                    appointmentMoveData?.extendedProps.revert();
                    setMoveDialog(false);
                }}
                dir={direction}
                action={() => {
                    return (
                        appointmentMoveData && (
                            <Box sx={{minHeight: 150}}>
                                <Typography sx={{textAlign: "center"}} variant="subtitle1">
                                    {t(
                                        `dialogs.move-dialog.${
                                            !appointmentMoveData?.extendedProps.onDurationChanged
                                                ? "sub-title"
                                                : "sub-title-duration"
                                        }`
                                    )}
                                </Typography>
                                <Typography sx={{textAlign: "center"}} margin={2}>
                                    {!appointmentMoveData?.extendedProps.onDurationChanged ? (
                                        <>
                                            {appointmentMoveData?.extendedProps.oldDate
                                                .clone()
                                                .subtract(
                                                    appointmentMoveData?.extendedProps.from ? 0 : 1,
                                                    "hours"
                                                )
                                                .format("DD-MM-YYYY HH:mm")}{" "}
                                            {" => "}
                                            {appointmentMoveData?.extendedProps.newDate
                                                .clone()
                                                .subtract(
                                                    appointmentMoveData?.extendedProps.from ? 0 : 1,
                                                    "hours"
                                                )
                                                .format("DD-MM-YYYY HH:mm")}
                                        </>
                                    ) : (
                                        <>
                                            {humanizeDuration(
                                                appointmentMoveData?.extendedProps.oldDuration * 60000
                                            )}{" "}
                                            {" => "}
                                            {humanizeDuration(
                                                appointmentMoveData?.extendedProps.duration * 60000
                                            )}
                                        </>
                                    )}
                                </Typography>
                                <Typography sx={{textAlign: "center"}} margin={2}>
                                    {t("dialogs.move-dialog.description")}
                                </Typography>
                            </Box>
                        )
                    );
                }}
                open={moveDialog}
                title={t(`dialogs.move-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => {
                                appointmentMoveData?.extendedProps.revert &&
                                appointmentMoveData?.extendedProps.revert();
                                setMoveDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
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
                            startIcon={<Icon path="iconfinder"></Icon>}>
                            {t("dialogs.move-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            />
            {isMobile && (
                <Zoom
                    in={!loading}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${!loading ? transitionDuration.exit : 0}ms`,
                    }}
                    unmountOnExit>
                    <Fab color="primary" aria-label="add"
                         onClick={() => {
                             dispatch(onResetPatient());
                             setSelectedPatient(null);
                             setPatientDrawer(true);
                         }}
                         sx={{
                             position: "fixed",
                             bottom: 16,
                             right: 16
                         }}>
                        <SpeedDialIcon/>
                    </Fab>
                </Zoom>
            )}
            <Drawer
                anchor={"right"}
                open={openViewDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(openDrawer({type: "view", open: false}));
                }}>
                <AppointmentDetail OnDataUpdated={() => mutate()}/>
            </Drawer>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                    if (submitted) {
                        dispatch(resetSubmitAppointment());
                    }
                }}>
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId, mutate}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                        if (submitted) {
                            dispatch(resetSubmitAppointment());
                        }
                    }}
                    onConsultation={onConsultationView}
                    onConsultationStart={onConsultationStart}
                    onAddAppointment={() => console.log("onAddAppointment")}
                />
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
            <DrawerBottom
                handleClose={() => setopen(false)}
                open={open}
                title={t("filter.title")}>
                <Accordion
                    translate={{t, ready}}
                    data={dataPatient}
                    setData={setDataPatient}
                />
                <MobileContainer>
                    <Stack alignItems="flex-end">
                        <Button>{t("filter.apply")}</Button>
                    </Stack>
                </MobileContainer>
            </DrawerBottom>
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
