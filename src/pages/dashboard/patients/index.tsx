// react
import React, {ReactElement, useEffect, useLayoutEffect, useState} from "react";
// next
import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
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
    Fab,
    Checkbox,
    FormControlLabel, MenuItem, LinearProgress
} from "@mui/material";
// redux
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    onOpenPatientDrawer,
    Otable,
    tableActionSelector,
    setSelectedRows
} from "@features/table";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
// ________________________________
import {NoDataCard, PatientMobileCard} from "@features/card";
import {SubHeader} from "@features/subHeader";
import {PatientToolbar} from "@features/toolbar";
import {CustomStepper} from "@features/customStepper";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
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
import {leftActionBarSelector, resetFilter} from "@features/leftActionBar";
import {prepareSearchKeys, useIsMountedRef, useMedicalEntitySuffix} from "@lib/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";
import {ActionMenu, toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {LoadingScreen} from "@features/loadingScreen";
import {EventDef} from "@fullcalendar/core/internal";
import CloseIcon from "@mui/icons-material/Close";
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
import {selectCheckboxActionSelector, onSelectCheckbox} from 'src/features/selectCheckboxCard'
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import {useInsurances} from "@lib/hooks/rest";
import {setDuplicated} from "@features/duplicateDetected";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import {MobileContainer as MobileWidth} from "@lib/constants";
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Icon from "@themes/urlIcon";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {dehydrate, QueryClient} from "@tanstack/query-core";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

const humanizeDuration = require("humanize-duration");

// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "name",
        sortable: false,
        align: "left",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
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
        id: "insurance",
        numeric: false,
        disablePadding: true,
        label: "insurance",
        sortable: true,
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
        id: "nextAppointment",
        numeric: false,
        disablePadding: false,
        label: "nextAppointment",
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

function Patients() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const isMobile = useMediaQuery(`(max-width:${MobileWidth}px)`);
    const isMounted = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {insurances} = useInsurances();
    // selectors
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {tableState: {patientId, rowsSelected}} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {openViewDrawer, config: agendaConfig} = useAppSelector(agendaSelector);
    const {submitted} = useAppSelector(appointmentSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {date: moveDialogDate, time: moveDialogTime} = useAppSelector(dialogMoveSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles;

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
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [popoverActions] = useState([
        {
            title: "view_patient_data",
            icon: <IconUrl color={"white"} path="/ic-voir"/>,
            action: "onPatientView",
        },
        {
            title: "check_duplication_data",
            icon: <PeopleOutlineIcon/>,
            action: "onCheckPatientDuplication",
        },
        ...(!roles.includes("ROLE_SECRETARY") ? [{
            title: "delete_patient_data",
            icon: <DeleteOutlineRoundedIcon/>,
            action: "onDeletePatient",
        }] : [])
    ]);
    const [stepperData] = useState([
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
    ]);
    const [loading] = useState<boolean>(false);
    const [rows, setRows] = useState<PatientModel[]>([]);
    const {collapse} = RightActionData.filter;
    const [open, setOpen] = useState(false);
    const {selectedCheckbox} = useAppSelector(selectCheckboxActionSelector);
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
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const {trigger: updateAppointmentTrigger} = useRequestQueryMutation("/patient/appointment/update");
    const {trigger: triggerDeletePatient} = useRequestQueryMutation("/patient/delete");
    const {trigger: triggerCheckDuplication} = useRequestQueryMutation("/patient/duplication/check");

    let page = parseInt((new URL(location.href)).searchParams.get("page") || "1");

    const {
        data: httpPatientsResponse,
        mutate: mutatePatients,
        isLoading
    } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medicalEntityHasUser && {variables: {query: `?page=${page}&limit=10&withPagination=true${router.query.params ?? localFilter}`}})
    });

    const checkDuplications = (patient: PatientModel, setLoadingRequest: any): PatientModel[] => {
        setLoadingRequest(true);
        medicalEntityHasUser && triggerCheckDuplication({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/duplications/${router.locale}`
        }, {
            onSuccess: (results) => {
                setLoadingRequest(false);
                const duplications = ((results?.data as HttpResponse)?.data ?? []) as PatientModel[];
                if (duplications?.length > 0) {
                    dispatch(setDuplicated({
                        duplications,
                        duplicationSrc: patient,
                        duplicationInit: patient,
                        openDialog: true,
                        mutate: mutatePatients
                    }));
                } else {
                    enqueueSnackbar(t(`add-patient.dialog.no-duplicates-check`), {variant: "info"});
                }
                return duplications;
            }
        });

        return [];
    }

    const submitStepper = (index: number) => {
        if (index === 2) {
            mutatePatients();
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
            data: params
        }, {
            onSuccess: (result) => {
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
                mutatePatients();
            }
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
        router.push({pathname: slugConsultation, query: {inProgress: true}}, slugConsultation, {locale: router.locale});
    }

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

    const handleTableActions = (action: string, event: PatientModel, mouseEvent?: any, setLoadingRequest?: any) => {
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
            case "OPEN-POPOVER":
                setSelectedPatient(event);
                mouseEvent.preventDefault();
                setContextMenu(
                    contextMenu === null
                        ? {
                            mouseX: mouseEvent.clientX + 2,
                            mouseY: mouseEvent.clientY - 6,
                        } : null,
                );
                break;
            case "DELETE":
                setSelectedPatient(event);
                setDeleteDialog(true);
                break;
            case "EDIT":
                dispatch(
                    onOpenPatientDrawer({
                        patientId: event?.uuid,
                        patientAction: "PATIENT_DETAILS",
                    })
                );
                setAddAppointment(false);
                setPatientDetailDrawer(true);
                break;
            case "DUPLICATION_CHECK":
                checkDuplications(event, setLoadingRequest);
                break;
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleCloseMenu = () => {
        setContextMenu(null);
    }

    const onFilterPatient = (value: string) => {
        dispatch(setFilter({patient: {name: value}}));
    }

    const handleDeletePatient = () => {
        setLoadingRequest(true);
        medicalEntityHasUser && triggerDeletePatient({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${selectedPatient?.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                setLoadingRequest(false);
                setTimeout(() => setDeleteDialog(false));
                mutatePatients();
                enqueueSnackbar(t(`alert.delete-patient`), {variant: "success"});
            }
        });
    }

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.uuid);
            dispatch(onSelectCheckbox(newSelecteds));
            dispatch(setSelectedRows(rows));
            return;
        }
        dispatch(onSelectCheckbox([]));
        dispatch(setSelectedRows([]));

    };

    const OnMenuActions = (action: string) => {
        handleCloseMenu();
        switch (action) {
            case "onPatientView":
                dispatch(
                    onOpenPatientDrawer({
                        patientId: selectedPatient?.uuid,
                        patientAction: "PATIENT_DETAILS",
                    })
                );
                setAddAppointment(false);
                setPatientDetailDrawer(true);
                break;
            case "onCheckPatientDuplication":
                checkDuplications(selectedPatient as PatientModel, setLoadingRequest);
                break;
            case "onDeletePatient":
                setDeleteDialog(true);
                break;
        }
    }

    useLeavePageConfirm((path: string) => {
        if (!path.includes("/dashboard/patient")) {
            dispatch(resetFilter());
        }
    });

    useLayoutEffect(() => {
        window.scrollTo(scrollX, scrollY);
    });

    useEffect(() => {
        if (httpPatientsResponse) {
            const patientsResponse = (httpPatientsResponse as HttpResponse)?.data?.list ?? [];
            if (isMobile && localFilter?.length > 0) {
                setRows(patientsResponse)
            } else {
                setRows((prev) => [...prev, ...patientsResponse]);
            }
        }
    }, [httpPatientsResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (filter?.type || filter?.patient || filter?.acts || filter?.reasons || filter?.disease) {
            const query = prepareSearchKeys(filter as any);
            setLocalFilter(query);
        } else if (localFilter.length > 0) {
            setLocalFilter("")
        }
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isMounted.current && !lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //remove query params on load from url
        isMobile && router.replace(router.pathname, undefined, {shallow: true});
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const patientData = (httpPatientsResponse as HttpResponse)?.data ?? []

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

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
                    {...{mutatePatient: mutatePatients}}
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
            <LinearProgress sx={{
                visibility: loadingRequest || isLoading ? "visible" : "hidden"
            }} color="warning"/>
            <Box className="container">
                <DesktopContainer>
                    <Otable
                        {...{t, insurances, mutatePatient: mutatePatients}}
                        headers={headCells}
                        handleEvent={handleTableActions}
                        rows={patientData?.list ?? []}
                        total={patientData?.total ?? 0}
                        totalPages={patientData?.totalPages ?? 1}
                        from={"patient"}
                        pagination
                        loading={!Boolean(httpPatientsResponse)}
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Stack direction={"row"} mb={1} justifyContent={"space-between"}>
                        {rows.length > 0 &&
                            <FormControlLabel
                                sx={{ml: 0}}
                                control={
                                    <Checkbox onChange={handleSelectAll}
                                              indeterminate={selectedCheckbox.length > 0 && selectedCheckbox.length < rows.length}
                                              checked={selectedCheckbox?.length === rows?.length}/>}
                                label={t("select-all")}

                            />
                        }
                        {rowsSelected.length > 1 && <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                const duplications = [...rowsSelected];
                                const firstElement = duplications.shift();
                                dispatch(setDuplicated({
                                    duplications,
                                    duplicationSrc: firstElement,
                                    duplicationInit: firstElement,
                                    openDialog: true,
                                    mutate: mutatePatients
                                }));
                            }}
                            variant="contained"
                            color="primary"
                            sx={{p: "4px 16px"}}
                            startIcon={<ArchiveRoundedIcon/>}>
                            {t("merge-patient")}
                        </Button>}
                    </Stack>
                    <PatientMobileCard
                        ready={ready}
                        handleEvent={handleTableActions}
                        PatientData={rows}
                        {...{insurances}}

                    />
                    {rows.length === 10 &&
                        <Stack alignItems='center'>
                            <LoadingButton
                                loading={isLoading}
                                loadingPosition={"start"}
                                startIcon={<RefreshIcon/>}
                                onClick={() => {
                                    router.push({
                                        query: {page: ++page}
                                    })
                                }}
                            >
                                {t("load-more")}
                            </LoadingButton>
                        </Stack>
                    }
                </MobileContainer>

                {patientData?.list?.length === 0 && <NoDataCard
                    t={t}
                    ns={"patient"}
                    data={{
                        mainIcon: "ic-patient",
                        title: "no-data.patient.title",
                        description: "no-data.patient.description",
                    }}/>}
            </Box>

            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {popoverActions.map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                {t(`popover-action.${v.title}`)}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>

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
                                <IconUrl
                                    height={"18"}
                                    width={"18"}
                                    color={"white"}
                                    path="iconfinder"></IconUrl>
                            }>
                            {t(`dialogs.move-dialog.confirm`)}
                        </Button>
                    </>
                }
                PaperProps={{
                    sx: {
                        width: {xs: 'calc(100% - 24px)', sm: 'calc(100% - 64px)'},
                        margin: {xs: 0, sm: 4},
                    }
                }}
            />

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                {...(!loadingRequest && {dialogClose: () => setDeleteDialog(false)})}
                sx={{direction: direction}}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.delete-dialog.sub-title`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`dialogs.delete-dialog.description`)}</Typography>
                        </Box>)
                }}
                open={deleteDialog}
                title={t(`dialogs.delete-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setDeleteDialog(false)}
                            startIcon={<CloseIcon/>}
                        >
                            {t(`dialogs.delete-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            loading={loadingRequest}
                            loadingPosition="start"
                            variant="contained"
                            onClick={handleDeletePatient}
                            color={"error"}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                        >
                            {t(`dialogs.delete-dialog.confirm`)}
                        </LoadingButton>
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
                            startIcon={<IconUrl path="iconfinder"></IconUrl>}>
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
                <AppointmentDetail OnDataUpdated={() => mutatePatients()}/>
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
                    {...{isAddAppointment, patientId, mutate: mutatePatients}}
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
                handleClose={() => setOpen(false)}
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

export const getStaticProps: GetStaticProps = async ({locale}) => {
    const queryClient = new QueryClient();
    const baseURL: string = process.env.NEXT_PUBLIC_API_URL || "";

    const countries = `api/public/places/countries/${locale}?nationality=true`;
    const insurances = `api/public/insurances/${locale}`;
    const contactTypes = `api/public/contact-type/${locale}`;

    await queryClient.prefetchQuery([`/${countries}`], () => fetch(`${baseURL}${countries}`, {method: "GET"}).then(response => response.json()));
    await queryClient.prefetchQuery([`/${insurances}`], () => fetch(`${baseURL}${insurances}`, {method: "GET"}).then(response => response.json()));
    await queryClient.prefetchQuery([`/${contactTypes}`], () => fetch(`${baseURL}${contactTypes}`, {method: "GET"}).then(response => response.json()));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "patient",
                "agenda",
                "consultation",
                "menu",
                "common",
                'payment'
            ])),
        },
    }
}

export default Patients;

Patients.auth = true;

Patients.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};