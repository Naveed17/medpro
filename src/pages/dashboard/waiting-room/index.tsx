import {GetStaticProps} from "next";
import React, {ReactElement, useEffect, useState} from "react";
//components
import {NoDataCard, timerSelector, WaitingRoomMobileCard} from "@features/card";
// next-i18next
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {
    Box,
    Button,
    Card,
    CardHeader,
    DialogActions,
    Drawer,
    LinearProgress,
    MenuItem,
    Paper,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {RoomToolbar} from "@features/toolbar";
import {onOpenPatientDrawer, Otable, tableActionSelector} from "@features/table";
import {Session} from "next-auth";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import moment from "moment-timezone";
import {ActionMenu, toggleSideBar} from "@features/menu";
import {
    prepareContextMenu,
    prepareSearchKeys,
    useIsMountedRef,
    useMedicalEntitySuffix,
    useMutateOnGoing
} from "@lib/hooks";
import {appLockSelector} from "@features/appLock";
import {Dialog, PatientDetail, preConsultationSelector, QuickAddAppointment} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {DefaultCountry, WaitingHeadCells} from "@lib/constants";
import {EventDef} from "@fullcalendar/core/internal";
import {LoadingButton} from "@mui/lab";
import {
    agendaSelector,
    AppointmentStatus,
    CalendarContextMenu,
    openDrawer,
    setSelectedEvent,
    setStepperIndex
} from "@features/calendar";
import {Board} from "@features/board";
import CalendarIcon from "@themes/overrides/icons/calendarIcon";
import {CustomIconButton} from "@features/buttons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {DropResult} from "react-beautiful-dnd";
import {
    appointmentSelector,
    setAppointmentSubmit,
    TabPanel
} from "@features/tabPanel";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {leftActionBarSelector, resetFilter} from "@features/leftActionBar";
import {LoadingScreen} from "@features/loadingScreen";
import {batch} from "react-redux";
import {setDialog} from "@features/topNavBar";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import {Label} from "@features/label";
import {partition} from "lodash";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";

function WaitingRoom() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: mutateOnGoing} = useMutateOnGoing();
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const {t, ready} = useTranslation(["waitingRoom", "common"], {keyPrefix: "config"});

    const {config: agenda} = useAppSelector(agendaSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {direction} = useAppSelector(configSelector);
    const {tableState} = useAppSelector(tableActionSelector);
    const {isActive} = useAppSelector(timerSelector);
    const {model} = useAppSelector(preConsultationSelector);
    const {
        motif,
        recurringDates,
        duration,
        patient,
        type
    } = useAppSelector(appointmentSelector);
    const {next: is_next} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [isAddAppointment] = useState<boolean>(false);
    const [loading] = useState<boolean>(status === 'loading');
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [row, setRow] = useState<WaitingRoomModel | null>(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [popoverActions, setPopoverActions] = useState<any[]>([]);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
    const [waitingRoomsGroup, setWaitingRoomsGroup] = useState<any[]>([]);
    const [withoutDateTime, setWithoutDateTime] = useState<boolean>(false);
    const [quickAddAppointment, setQuickAddAppointment] = useState<boolean>(false);
    const [quickAddAppointmentTab, setQuickAddAppointmentTab] = useState(1);
    const [quickAddPatient, setQuickAddPatient] = useState<boolean>(false);
    const [openUploadDialog, setOpenUploadDialog] = useState({dialog: false, loading: false});
    const [documentConfig, setDocumentConfig] = useState({name: "", description: "", type: "analyse", files: []});
    const [tabIndex, setTabIndex] = useState<number>(isMobile ? 1 : 0);
    const {trigger: updateTrigger} = useRequestQueryMutation("/agenda/appointment/update");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/update/appointment/status");
    const {trigger: handlePreConsultationData} = useRequestQueryMutation("/pre-consultation/update");
    const {trigger: addAppointmentTrigger} = useRequestQueryMutation("/agenda/appointment/add");
    const {trigger: triggerUploadDocuments} = useRequestQueryMutation("/agenda/appointment/documents");

    const {
        data: httpWaitingRoomsResponse,
        mutate: mutateWaitingRoom
    } = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/appointments/${router.locale}`
    } : null, {
        refetchOnWindowFocus: false,
        ...(agenda && {
            variables: {
                query: `?mode=tooltip&start_date=${moment().format("DD-MM-YYYY")}&end_date=${moment().format("DD-MM-YYYY")}&format=week${filter ? prepareSearchKeys(filter as any) : ""}`
            }
        })
    });

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                } : null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    }

    const resetDialog = () => {
        setOpenPaymentDialog(false);
    }

    const nextConsultation = (row: any) => {
        const form = new FormData();
        form.append('attribute', 'is_next');
        form.append('value', `${!Boolean(row.is_next)}`);
        updateTrigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateOnGoing().then(() => mutateWaitingRoom());
                setLoadingRequest(false);
            }
        });
    }

    const handleUploadDocuments = () => {
        setOpenUploadDialog({...openUploadDialog, loading: true});
        const params = new FormData();
        documentConfig.files.map((file: any) => {
            params.append(`files[${file.type}][]`, file.file, file.name);
        });
        triggerUploadDocuments({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row?.uuid}/documents/${router.locale}`,
            data: params
        }, {
            onSuccess: () => setOpenUploadDialog({loading: false, dialog: false})
        });
    }

    const startConsultation = (row: any) => {
        if (!isActive) {
            const slugConsultation = `/dashboard/consultation/${row?.uuid}`;
            router.push({
                pathname: slugConsultation,
                query: {inProgress: true}
            }, slugConsultation, {locale: router.locale});
        } else {
            const defEvent = {
                publicId: row?.uuid,
                extendedProps: {
                    ...row
                }
            } as EventDef;
            batch(() => {
                dispatch(setSelectedEvent(defEvent));
                dispatch(openDrawer({type: "view", open: false}));
                dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
            });
        }
    }

    const handleAddAppointment = () => {
        setLoadingRequest(true);

        const params = new FormData();
        params.append('dates', JSON.stringify(withoutDateTime ?
            [{
                "start_date": moment().format("DD-MM-YYYY"),
                "start_time": "00:00"
            }]
            :
            recurringDates.map(recurringDate => ({
                    "start_date": recurringDate.date,
                    "start_time": recurringDate.time
                })
            )));
        motif && params.append('consultation_reasons', motif.toString());
        params.append('title', `${patient?.firstName} ${patient?.lastName}`);
        params.append('patient_uuid', patient?.uuid as string);
        params.append('type', type);
        params.append('duration', duration as string);
        params.append('status', quickAddAppointmentTab.toString());

        addAppointmentTrigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}`,
            data: params
        }, {
            onSuccess: (value) => {
                mutateWaitingRoom();
                dispatch(setAppointmentSubmit({uuids: value?.data.data}));
                dispatch(setStepperIndex(0));
                setTimeout(() => setQuickAddAppointment(false));
            },
            onSettled: () => {
                setLoadingRequest(false);
            }
        });
    }

    const handleAppointmentStatus = (uuid: string, status: string) => {
        const form = new FormData();
        form.append('status', status);
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${uuid}/status/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateOnGoing();
                mutateWaitingRoom();
            }
        });
    }

    const handleTransactionData = () => {
        setOpenPaymentDialog(true)
    }

    const OnMenuActions = (action: string) => {
        switch (action) {
            case "onConsultationDetail":
                startConsultation(row);
                break;
            case "onConsultationView":
                const slugConsultation = `/dashboard/consultation/${row?.uuid}`;
                router.push(slugConsultation, slugConsultation, {locale: router.locale});
                break;
            case "onPreConsultation":
                setOpenPreConsultationDialog(true);
                break;
            case "onNextConsultation":
                nextConsultation(row);
                break;
            case "onWaitingRoom":
                handleAppointmentStatus(row?.uuid as string, '3');
                break;
            case "onLeaveWaitingRoom":
                handleAppointmentStatus(row?.uuid as string, '1');
                break;
            case "onCancel":
                handleAppointmentStatus(row?.uuid as string, '6');
                break;
            case "onDelete":
                handleAppointmentStatus(row?.uuid as string, '9');
                break;
            case "onPatientNoShow":
                handleAppointmentStatus(row?.uuid as string, '10');
                break;
            case "onAddConsultationDocuments":
                setOpenUploadDialog({...openUploadDialog, dialog: true});
                break;
            case "onPatientDetail":
                dispatch(onOpenPatientDrawer({patientId: row?.patient.uuid}));
                setPatientDetailDrawer(true);
                break;
            case "onPay":
                handleTransactionData();
                break;
        }
        handleClose();
    }

    const handleDragEvent = (result: DropResult, item: BoardModel) => {
        handleAppointmentStatus(
            item.content.uuid,
            columns.find(column => result.destination?.droppableId === column.name)?.id);
    }

    const handleTableActions = (data: any) => {
        setRow(data.row);
        switch (data.action) {
            case "PATIENT_DETAILS":
                dispatch(onOpenPatientDrawer({patientId: data.row.patient.uuid}));
                setPatientDetailDrawer(true);
                break;
            case "START_CONSULTATION":
                startConsultation(data.row);
                break;
            case "CANCEL_APPOINTMENT":
                handleAppointmentStatus(data.row?.uuid as string, '6');
                break;
            case "CONFIRM_APPOINTMENT":
                handleAppointmentStatus(data.row?.uuid as string, '1');
                break;
            case "ENTER_WAITING_ROOM":
                handleAppointmentStatus(data.row.uuid as string, '3');
                break;
            case "LEAVE_WAITING_ROOM":
                handleAppointmentStatus(data.row.uuid as string, '1');
                break;
            case "NEXT_CONSULTATION":
                nextConsultation(data.row);
                break;
            case "ON_PAY":
                handleTransactionData();
                break;
            default:
                setPopoverActions(CalendarContextMenu.filter(dataFilter => !["onReschedule", "onMove"].includes(dataFilter.action) && !prepareContextMenu(dataFilter.action, {
                    ...data.row,
                    status: AppointmentStatus[data.row?.status]
                } as EventModal, roles)));
                handleContextMenu(data.event);
                break;
        }
    }

    const submitPreConsultationData = () => {
        const form = new FormData();
        form.append('modal_uuid', model);
        form.append('modal_data', localStorage.getItem(`Modeldata${row?.uuid}`) as string);
        handlePreConsultationData({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row?.uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                localStorage.removeItem(`Modeldata${row?.uuid}`);
                setOpenPreConsultationDialog(false);
            }
        });
    }

    const columns: any[] = [
        {
            id: '1',
            name: 'today-rdv',
            url: '#',
            icon: <CalendarIcon/>,
            action: <CustomIconButton
                sx={{mr: 1}}
                onClick={() => {
                    setWithoutDateTime(false);
                    setQuickAddAppointment(true);
                    setTimeout(() => setQuickAddAppointmentTab(1));
                }}
                variant="filled"
                color={"primary"}
                size={"small"}>
                <AgendaAddViewIcon/>
            </CustomIconButton>
        },
        {
            id: '3',
            name: 'waiting-room',
            url: '#',
            icon: <IconUrl width={24} height={24} path="ic_waiting_room"/>,
            action: <CustomIconButton
                onClick={() => {
                    setWithoutDateTime(true);
                    setQuickAddAppointment(true);
                    setTimeout(() => setQuickAddAppointmentTab(3));
                }}
                variant="filled"
                color={"primary"}
                size={"small"}>
                <AgendaAddViewIcon/>
            </CustomIconButton>
        },
        {
            id: '4,8',
            name: 'ongoing',
            url: '#',
            icon: <IconUrl width={20} height={20} path="ic-attendre"/>
        },
        {
            id: '5',
            name: 'finished',
            url: '#',
            icon: <CheckCircleIcon
                color={"primary"}
                sx={{
                    ml: 'auto',
                    width: 20
                }}/>
        }];
    const Toolbar = () => (
        <Card sx={{minWidth: 235, border: 'none', mb: 2, overflow: 'visible'}}>
            <CardHeader
                component={Stack}
                borderBottom={1}
                borderColor="divider"
                direction="row"
                sx={{
                    m: 0,
                    pt: 0,
                    px: 0,
                    pb: 1,

                    borderBottom: 1,
                    borderColor: "divider",
                    ".MuiCardHeader-action": {
                        m: 0,
                    }
                }}
                avatar={columns[1].icon}
                {...(columns[1].action && {action: columns[1].action})}
                title={
                    <Stack direction='row' alignItems='center' spacing={3}>
                        <Typography
                            color={"text.primary"} fontWeight={700}
                            fontSize={14}>
                            {t(`tabs.${columns[1].name}`)}
                            <Label variant="filled" color="info"
                                   sx={{ml: 1, height: 'auto', p: .6, minWidth: 20, fontWeight: 400}}>
                                {waitingRoomsGroup[3]?.length ?? ""}
                            </Label>
                        </Typography>
                    </Stack>
                }
            />
        </Card>
    )

    useEffect(() => {
        if (httpWaitingRoomsResponse) {
            let groupedData = (httpWaitingRoomsResponse as HttpResponse).data?.sort((a: any, b: any) =>
                moment(a.startTime === "00:00" ? b.createdAt : `${a.dayDate} ${a.startTime}`, "DD-MM-YYYY HH:mm").valueOf() - moment(b.startTime === "00:00" ? a.createdAt : `${b.dayDate} ${b.startTime}`, "DD-MM-YYYY HH:mm").valueOf()
            ).group((diag: any) => diag.status);
            const onGoingAppointment = partition(groupedData[3], (event: any) => event.startTime === "00:00");
            groupedData[3] = [...onGoingAppointment[1], ...onGoingAppointment[0].reverse()]
            setWaitingRoomsGroup(groupedData);
        }
    }, [httpWaitingRoomsResponse, is_next]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isMounted.current && !lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!openPaymentDialog) {
            setTimeout(() => {
                mutateWaitingRoom();
            }, 300);
        }
    }, [openPaymentDialog]); // eslint-disable-line react-hooks/exhaustive-deps

    useLeavePageConfirm(() => {
        dispatch(resetFilter());
    });

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    "& .MuiToolbar-root": {
                        display: "block"
                    }
                }}>
                <RoomToolbar {...{
                    t,
                    tabIndex,
                    setTabIndex,
                    setPatientDetailDrawer,
                    nextConsultation,
                    columns,
                    is_next,
                    isActive
                }}/>
            </SubHeader>
            <Box>
                <LinearProgress sx={{
                    visibility: !httpWaitingRoomsResponse || loading ? "visible" : "hidden"
                }} color="warning"/>

                <Box className="container">
                    <DesktopContainer>
                        <TabPanel padding={.1} value={tabIndex} index={0}>
                            <Board
                                {...{columns, handleDragEvent}}
                                handleEvent={handleTableActions}
                                data={waitingRoomsGroup}/>
                        </TabPanel>
                    </DesktopContainer>
                    <TabPanel padding={.1} value={tabIndex} index={1}>
                        {!!waitingRoomsGroup[1]?.length ? <>

                                <DesktopContainer>
                                    <Otable
                                        sx={{mt: 2}}
                                        {...{
                                            doctor_country,
                                            roles,
                                            loading: loadingRequest,
                                            setLoading: setLoadingRequest
                                        }}
                                        toolbar={

                                            <CardHeader
                                                sx={{
                                                    pt: 0,
                                                    px: 0,
                                                    pb: 1,
                                                    m: 0,
                                                    borderBottom: 1,
                                                    borderColor: "divider",
                                                    ".MuiCardHeader-action": {
                                                        m: 0,
                                                    }
                                                }}
                                                avatar={columns[0].icon}
                                                {...(columns[0].action && {action: columns[0].action})}
                                                title={
                                                    <Typography
                                                        color={"text.primary"} fontWeight={700}
                                                        fontSize={14}>
                                                        {t(`tabs.${columns[0].name}`)}
                                                        <Label variant="filled" color="info"
                                                               sx={{ml: 1, height: 'auto', p: .6, minWidth: 20}}>
                                                            {waitingRoomsGroup[1].length}
                                                        </Label>
                                                    </Typography>}
                                            />
                                        }
                                        headers={WaitingHeadCells}
                                        rows={waitingRoomsGroup[1]}
                                        from={"waitingRoom"}
                                        t={t}
                                        pagination
                                        handleEvent={handleTableActions}
                                    />
                                </DesktopContainer>
                                <MobileContainer>
                                    <Stack spacing={1}>
                                        {waitingRoomsGroup[1].map((item: any, i: number) => (
                                            <React.Fragment key={item.uuid}>
                                                <WaitingRoomMobileCard
                                                    quote={item}
                                                    index={i}
                                                    handleEvent={handleTableActions}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </Stack>
                                </MobileContainer>
                            </>
                            :
                            <NoDataCard
                                {...{t}}
                                sx={{mt: 8}}
                                onHandleClick={() => {
                                    setQuickAddAppointment(true);
                                    setTimeout(() => setQuickAddAppointmentTab(1));
                                }}
                                ns={"waitingRoom"}
                                data={{
                                    mainIcon: "ic_waiting_room",
                                    title: "empty",
                                    description: "desc",
                                    buttons: [{
                                        text: "table.no-data.event.title",
                                        icon: <Icon path={"ic-agenda-+"} width={"18"} height={"18"}/>,
                                        variant: "warning",
                                        color: "white"
                                    }]
                                }}/>
                        }
                    </TabPanel>
                    <TabPanel padding={.1} value={tabIndex} index={2}>
                        {!!waitingRoomsGroup[3]?.length ? <>
                                <DesktopContainer>
                                    <Otable

                                        {...{
                                            doctor_country,
                                            roles,
                                            loading: loadingRequest,
                                            setLoading: setLoadingRequest
                                        }}
                                        toolbar={<Toolbar/>}
                                        headers={WaitingHeadCells}
                                        rows={waitingRoomsGroup[3]}
                                        from={"waitingRoom"}
                                        t={t}
                                        pagination
                                        handleEvent={handleTableActions}
                                    />
                                </DesktopContainer>
                                <MobileContainer>
                                    <Stack spacing={1}>
                                        {waitingRoomsGroup[3].map((item: any, i: number) => (
                                            <React.Fragment key={item.uuid}>
                                                <WaitingRoomMobileCard
                                                    quote={item}
                                                    index={i}
                                                    handleEvent={handleTableActions}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </Stack>
                                </MobileContainer>
                            </>
                            :
                            <NoDataCard
                                {...{t}}
                                sx={{mt: 8}}
                                onHandleClick={() => {
                                    setQuickAddAppointment(true);
                                    setTimeout(() => setQuickAddAppointmentTab(3));
                                }}
                                ns={"waitingRoom"}
                                data={{
                                    mainIcon: "ic_waiting_room",
                                    title: "empty",
                                    description: "desc",
                                    buttons: [{
                                        text: "table.no-data.event.title",
                                        icon: <Icon path={"ic-agenda-+"} width={"18"} height={"18"}/>,
                                        variant: "warning",
                                        color: "white"
                                    }]
                                }}/>
                        }
                    </TabPanel>
                    <TabPanel padding={.1} value={tabIndex} index={3}>
                        {(!!waitingRoomsGroup[4]?.length || !!waitingRoomsGroup[8]?.length) ?
                            <>
                                <DesktopContainer>

                                    <Otable
                                        sx={{mt: 1, pr: 2}}
                                        {...{
                                            doctor_country,
                                            roles,
                                            loading: loadingRequest,
                                            setLoading: setLoadingRequest
                                        }}
                                        headers={WaitingHeadCells}
                                        rows={[
                                            ...(waitingRoomsGroup[4] ? waitingRoomsGroup[4] : []),
                                            ...(waitingRoomsGroup[8] ? waitingRoomsGroup[8] : [])
                                        ]}
                                        from={"waitingRoom"}
                                        t={t}
                                        pagination
                                        handleEvent={handleTableActions}
                                    />
                                </DesktopContainer>
                                <MobileContainer>
                                    <Stack spacing={1}>
                                        {
                                            [
                                                ...(waitingRoomsGroup[4] ? waitingRoomsGroup[4] : []),
                                                ...(waitingRoomsGroup[8] ? waitingRoomsGroup[8] : [])
                                            ].map((item: any, i: number) => (
                                                <React.Fragment key={item.uuid}>
                                                    <WaitingRoomMobileCard
                                                        quote={item}
                                                        index={i}
                                                        handleEvent={handleTableActions}
                                                    />
                                                </React.Fragment>
                                            ))
                                        }

                                    </Stack>
                                </MobileContainer>
                            </>
                            :
                            <NoDataCard
                                {...{t}}
                                sx={{mt: 8}}
                                ns={"waitingRoom"}
                                data={{
                                    mainIcon: "ic_waiting_room",
                                    title: "empty",
                                    description: "desc"
                                }}/>
                        }
                    </TabPanel>
                    <TabPanel padding={.1} value={tabIndex} index={4}>
                        {waitingRoomsGroup ?
                            <>
                                <DesktopContainer>
                                    <Otable
                                        sx={{mt: 1, pr: 2}}
                                        {...{
                                            doctor_country,
                                            roles,
                                            loading: loadingRequest,
                                            setLoading: setLoadingRequest
                                        }}
                                        headers={WaitingHeadCells}
                                        rows={[...(waitingRoomsGroup[5] ? waitingRoomsGroup[5] : [])]}
                                        from={"waitingRoom"}
                                        t={t}
                                        pagination
                                        handleEvent={handleTableActions}
                                    />
                                </DesktopContainer>
                                <MobileContainer>
                                    <Stack spacing={1}>
                                        {[...(waitingRoomsGroup[5] ? waitingRoomsGroup[5] : [])].map((item: any, i: number) => (
                                            <React.Fragment key={item.uuid}>
                                                <WaitingRoomMobileCard
                                                    quote={item}
                                                    index={i}
                                                    handleEvent={handleTableActions}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </Stack>
                                </MobileContainer>
                            </>
                            :
                            <NoDataCard
                                {...{t}}
                                sx={{mt: 8}}
                                ns={"waitingRoom"}
                                data={{
                                    mainIcon: "ic_waiting_room",
                                    title: "empty",
                                    description: "desc"
                                }}/>
                        }
                    </TabPanel>

                    <ActionMenu {...{contextMenu, handleClose}}>
                        {popoverActions.map((v: any, index) => (
                            <MenuItem
                                key={index}
                                className="popover-item"
                                onClick={() => OnMenuActions(v.action)}>
                                {v.icon}
                                <Typography fontSize={15} sx={{color: "#fff"}}>
                                    {t(v.title)}
                                </Typography>
                            </MenuItem>
                        ))}
                    </ActionMenu>
                </Box>


            </Box>

            <Drawer
                anchor={"right"}
                sx={{
                    width: 300
                }}
                open={quickAddAppointment}
                dir={direction}
                onClose={() => {
                    setQuickAddAppointment(false);
                }}>
                <QuickAddAppointment
                    {...{t, withoutDateTime}}
                    handleAddPatient={(action: boolean) => setQuickAddPatient(action)}/>
                <Paper
                    sx={{
                        display: quickAddPatient ? "none" : "inline-block",
                        borderRadius: 0,
                        borderWidth: 0,
                        textAlign: "right",
                        p: "1rem"
                    }}
                    className="action">
                    <Button
                        sx={{
                            mr: 1
                        }}
                        variant="text-primary"
                        onClick={() => setQuickAddAppointment(false)}
                        startIcon={<CloseIcon/>}>
                        {t("cancel", {ns: "common"})}
                    </Button>
                    <LoadingButton
                        loading={loadingRequest}
                        variant="contained"
                        color={"primary"}
                        onClick={event => {
                            event.stopPropagation();
                            handleAddAppointment();
                        }}
                        disabled={type === "" || !patient}>
                        {t("save", {ns: "common"})}
                    </LoadingButton>
                </Paper>
            </Drawer>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}>
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onConsultationStart={(event: EventDef) => startConsultation(event)}
                    onAddAppointment={() => console.log("onAddAppointment")}/>
            </Drawer>

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 460
                    }
                }}
                open={openPaymentDialog}
                data={{
                    patient: row?.patient,
                    setOpenPaymentDialog
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title")}
                dialogClose={resetDialog}
            />

            <Dialog
                action={"pre_consultation_data"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380
                    }
                }}
                open={openPreConsultationDialog}
                data={{
                    patient: row?.patient,
                    uuid: row?.uuid
                }}
                size={"md"}
                title={t("pre_consultation_dialog_title")}
                {...(!loadingRequest && {dialogClose: () => setOpenPreConsultationDialog(false)})}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => setOpenPreConsultationDialog(false)} startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <Button
                            disabled={loadingRequest}
                            variant="contained"
                            onClick={() => submitPreConsultationData()}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("save", {ns: "common"})}
                        </Button>
                    </DialogActions>
                }
            />

            <Dialog
                {...{direction}}
                action={"add_a_document"}
                open={openUploadDialog.dialog}
                data={{
                    t,
                    state: documentConfig,
                    setState: setDocumentConfig
                }}
                size={"md"}
                sx={{minHeight: 400}}
                title={t("doc_detail_title")}
                {...(!openUploadDialog.loading && {
                    dialogClose: () => setOpenUploadDialog({
                        ...openUploadDialog,
                        dialog: false
                    })
                })}
                actionDialog={
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenUploadDialog({...openUploadDialog, dialog: false});
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <LoadingButton
                            loading={openUploadDialog.loading}
                            loadingPosition={"start"}
                            variant="contained"
                            onClick={event => {
                                event.stopPropagation();
                                handleUploadDocuments();
                            }}
                            startIcon={<SaveRoundedIcon/>}>
                            {t("save", {ns: "common"})}
                        </LoadingButton>
                    </DialogActions>
                }
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "menu",
            "common",
            "patient",
            "agenda",
            "consultation",
            "payment",
            "waitingRoom",
        ])),
    },
});

export default WaitingRoom;

WaitingRoom.auth = true

WaitingRoom.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
