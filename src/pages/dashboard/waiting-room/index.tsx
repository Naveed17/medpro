import {GetStaticProps} from "next";
import React, {ReactElement, useContext, useEffect, useRef, useState} from "react";
//components
import {NoDataCard, resetTimer, timerSelector, WaitingRoomMobileCard} from "@features/card";
// next-i18next
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Drawer, useTheme,
    LinearProgress, Menu,
    MenuItem,
    Paper, Radio,
    Stack,
    Typography,
    useMediaQuery, Grid, FormControlLabel, Checkbox, ListItemIcon, ListItemText, IconButton, Zoom, Fab,
    CardContent,
    ButtonGroup,
    Breadcrumbs,
    Link
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
    getBirthdayFormat, isAppleDevise,
    prepareContextMenu,
    prepareSearchKeys,
    useMedicalEntitySuffix,
    useMutateOnGoing
} from "@lib/hooks";
import {
    Dialog,
    handleDrawerAction,
    PatientDetail,
    preConsultationSelector,
    QuickAddAppointment
} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {
    DefaultCountry,
    deleteAppointmentOptionsData,
    WaitingHeadCells,
    WaitingTodayCells
} from "@lib/constants";
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
import {Board, boardSelector, setIsUnpaid, setOrderSort, setSortTime} from "@features/board";
import {CustomIconButton, CustomSwitch} from "@features/buttons";
import {DropResult} from "@hello-pangea/dnd";
import {
    appointmentSelector, resetAppointment, setAppointmentPatient,
    setAppointmentSubmit,
    TabPanel
} from "@features/tabPanel";
import {leftActionBarSelector, resetFilter} from "@features/leftActionBar";
import {LoadingScreen} from "@features/loadingScreen";
import {setDialog} from "@features/topNavBar";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import {Label} from "@features/label";
import {partition, startCase} from "lodash";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import TripOriginRoundedIcon from '@mui/icons-material/TripOriginRounded';
import Can, {AbilityContext} from "@features/casl/can";
import _ from "lodash";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";
import AddIcon from "@mui/icons-material/Add";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CircleIcon from '@mui/icons-material/Circle';
import {Epg, Layout} from "planby";
import {EventItem, PlanByTimeline, timeLineSelector, useTimeLine} from "@features/timeline";

function WaitingRoom() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: mutateOnGoing} = useMutateOnGoing();
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const ability = useContext(AbilityContext);

    const {t, ready, i18n} = useTranslation(["waitingRoom", "common"]);
    const {config: agenda, currentDate} = useAppSelector(agendaSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);
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
    const {filter: boardFilterData} = useAppSelector(boardSelector);
    const {showStats, showTimeline} = useAppSelector(timeLineSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

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
    const [sortedData, setSortedData] = useState<any[]>([]);
    const [withoutDateTime, setWithoutDateTime] = useState<boolean>(false);
    const [quickAddAppointment, setQuickAddAppointment] = useState<boolean>(false);
    const [quickAddAppointmentTab, setQuickAddAppointmentTab] = useState(1);
    const [quickAddPatient, setQuickAddPatient] = useState<boolean>(false);
    const [openUploadDialog, setOpenUploadDialog] = useState({dialog: false, loading: false});
    const [documentConfig, setDocumentConfig] = useState({name: "", description: "", type: "analyse", files: []});
    const [tabIndex, setTabIndex] = useState<number>(isMobile ? 1 : 0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOptions] = useState<any[]>([
        //{index: 0, key: "startTime", value: "start-time"},
        {index: 1, key: "arrivalTime", value: "arrival-time"},
        {index: 2, key: "estimatedStartTime", value: "smart-list"}
    ]);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [deleteAppointmentOptions, setDeleteAppointmentOptions] = useState<any[]>(deleteAppointmentOptionsData);
    const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
    const [documentsPreview, setDocumentsPreview] = React.useState<any[]>([]);
    const [openDocPreviewDialog, setOpenDocPreviewDialog] = useState<boolean>(false);
    const [documentPreview, setDocumentPreview] = useState<any>();
    const [openAddPrescriptionDialog, setOpenAddPrescriptionDialog] = useState<boolean>(false);
    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [drugs, setDrugs] = useState<any>([]);
    const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);

    // Update timeLine Data
    const {isLoading, getEpgProps, getLayoutProps, onScrollToNow} = useTimeLine({data: sortedData});

    const openMenu = Boolean(anchorElMenu);
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const {trigger: updateTrigger} = useRequestQueryMutation("/agenda/appointment/update");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/update/appointment/status");
    const {trigger: handlePreConsultationData} = useRequestQueryMutation("/pre-consultation/update");
    const {trigger: addAppointmentTrigger} = useRequestQueryMutation("/agenda/appointment/add");
    const {trigger: triggerUploadDocuments} = useRequestQueryMutation("/agenda/appointment/documents");
    const {trigger: triggerPreviewDocument} = useRequestQueryMutation("/agenda/appointment/document/preview");
    const {trigger: triggerDrugsManage} = useRequestQueryMutation("/drugs/manage");

    const {
        data: httpWaitingRoomsResponse,
        isLoading: isWaitingRoomsLoading,
        mutate: mutateWaitingRoom
    } = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/appointments/${router.locale}`
    } : null, {
        refetchOnWindowFocus: false,
        ...(agenda && {
            variables: {
                query: `?mode=tooltip&start_date=${moment(currentDate.date).format("DD-MM-YYYY")}&end_date=${moment(currentDate.date).format("DD-MM-YYYY")}&format=week${filter ? prepareSearchKeys(filter as any) : ""}`
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
                query: {
                    inProgress: true,
                    agendaUuid: agenda?.uuid
                }
            }, slugConsultation, {locale: router.locale});
        } else {
            const defEvent = {
                publicId: row?.uuid,
                extendedProps: {
                    ...row
                }
            } as EventDef;
            dispatch(setSelectedEvent(defEvent));
            dispatch(openDrawer({type: "view", open: false}));
            dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
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

    const handleAppointmentStatus = (uuid: string, status: string, order?: string) => {
        const form = new FormData();
        form.append('status', status);
        order && form.append('order', order);
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${uuid}/status/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateWaitingRoom();
                mutateOnGoing();

                if (status === "11") {
                    dispatch(resetTimer());
                    dispatch(resetAppointment());
                }
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
                setDeleteDialog(true);
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

    const handleFinishConsultation = (event: any) => {
        const form = new FormData();
        form.append("status", "5");
        form.append("action", "end_consultation");
        updateAppointmentStatus({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateWaitingRoom();
                mutateOnGoing();
                if (event.status !== 8) {
                    dispatch(resetTimer());
                    dispatch(resetAppointment());
                }
            }
        });
    }

    const handleDeleteAppointment = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append("type", deleteAppointmentOptions.reduce((options, option) => [...(options ?? []), ...(option.selected ? [option.key] : [])], []).join(","));

        updateAppointmentStatus({
            method: "DELETE",
            data: params,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row?.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateOnGoing();
                mutateWaitingRoom();
                setDeleteDialog(false);
            },
            onSettled: () => setLoadingRequest(false)
        });
    }

    const handleSortData = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUnpaidFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setIsUnpaid(event.target.checked));
    };

    const handleSortSelect = (item: any) => {
        dispatch(setSortTime(item.value));

        /*        const params = new FormData();
                params.append('waitingRoomDisplay', item.index.toString());
                medicalEntityHasUser && updateAgendaConfig({
                    method: "PATCH",
                    url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agenda?.uuid}/waiting-room-display/${router.locale}`,
                    data: params
                })*/

        setAnchorEl(null);
    };

    const handleOrderSelect = (value: string) => {
        dispatch(setOrderSort(value));
        setAnchorEl(null);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDragEvent = (result: DropResult, item: BoardModel) => {
        switch (result.destination?.droppableId) {
            case "ongoing":
                startConsultation(item.content);
                break;
            case "finished":
                handleFinishConsultation(item.content);
                break;
            default:
                handleAppointmentStatus(
                    item.content.uuid,
                    columns.current.find(column => result.destination?.droppableId === column.name)?.id,
                    (result.destination?.droppableId === result.source?.droppableId && result.destination?.droppableId === "waiting-room") ? result.destination.index.toString() : undefined);
                break;
        }
    }

    const showDoc = (doc: any) => {
        if (doc.documentType === 'medical-certificate') {
            setDocumentPreview({
                uuid: doc.uuid,
                certifUuid: doc.certificate[0].uuid,
                content: doc.certificate[0].content,
                doctor: doc.name,
                patient: `${doc.certificate[0]?.patient?.firstName} ${doc.certificate[0]?.patient?.lastName}`,
                days: doc.days,
                description: doc.description,
                createdAt: doc.createdAt,
                name: 'certif',
                detectedType: doc.type,
                title: doc.title,
                type: 'write_certif',
            })
            setOpenDocPreviewDialog(true);
        } else {
            let info = doc
            let uuidDoc = "";
            let patient;
            switch (doc.documentType) {
                case "prescription":
                    info = doc.prescription[0].prescription_has_drugs;
                    patient = doc.prescription[0]?.patient;
                    uuidDoc = doc.prescription[0].uuid
                    break;
                case "requested-analysis":
                    info = doc.requested_Analyses[0]['requested_analyses_has_analyses'];
                    patient = doc.requested_Analyses[0]?.patient;
                    uuidDoc = doc.requested_Analyses[0].uuid;
                    break;
                case "requested-medical-imaging":
                    info = doc.medical_imaging[0]['requested_medical_imaging_has_medical_imaging'];
                    patient = doc.medical_imaging[0]?.patient;
                    uuidDoc = doc.medical_imaging[0].uuid;
                    break;
            }
            setDocumentPreview({
                uuid: doc.uuid,
                uri: doc.uri,
                name: doc.title,
                type: doc.documentType,
                info: info,
                uuidDoc: uuidDoc,
                appUuid: doc.appUuid,
                description: doc.description,
                createdAt: doc.createdAt,
                detectedType: doc.type,
                patient: `${patient?.firstName} ${patient?.lastName}`,
                cin: patient?.idCard ? patient?.idCard : ""
            })
            setOpenDocPreviewDialog(true);
        }
    }

    const handleShowPreviewDoc = (uuid: string, appointment: string) => {
        triggerPreviewDocument({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointment}/document/${uuid}/${router.locale}`,
        }, {
            onSuccess: (result) => {
                showDoc((result?.data as HttpResponse)?.data[0])
            }
        });
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
            case "OPEN_CONSULTATION":
                const slugConsultation = `/dashboard/consultation/${data.row?.uuid}`;
                router.push(slugConsultation, slugConsultation, {locale: router.locale});
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
            case "RESET_ONGOING_CONSULTATION":
                handleAppointmentStatus(data.row.uuid as string, '11');
                break;
            case "NEXT_CONSULTATION":
                nextConsultation(data.row);
                break;
            case "ON_PAY":
                handleTransactionData();
                break;
            case "ON_PREVIEW_DOCUMENT":
                handleShowPreviewDoc(data.row.doc.uuid, data.row.uuid);
                break;
            case "ON_ADD_DOCUMENT":
                setOpenAddPrescriptionDialog(true);
                break;
            case "DOCUMENT_MENU":
                setDocumentsPreview([
                    ...(data.row.prescriptions?.length > 0 ? [{
                        key: "requestedPrescription",
                        value: "prescriptions",
                        icon: "docs/ic-prescription"
                    }] : []),
                    ...(data.row.certificate?.length > 0 ? [{
                        key: "medical-certificate",
                        value: "certificate",
                        icon: "docs/ic-ordonnance"
                    }] : []),
                    ...(data.row.requestedAnalyses?.length > 0 ? [{
                        key: "balance_sheet",
                        value: "requestedAnalyses",
                        icon: "docs/ic-analyse"
                    }] : []),
                    ...(data.row.requestedMedicalImaging?.length > 0 ? [{
                        key: "medical_imaging_pending",
                        value: "requestedMedicalImaging",
                        icon: "docs/ic-soura"
                    }] : [])
                ])
                setAnchorElMenu(data.event.currentTarget)
                break;
            default:
                setPopoverActions(CalendarContextMenu.filter(dataFilter => !["onReschedule", "onMove"].includes(dataFilter.action) && !prepareContextMenu(dataFilter.action, {
                    ...data.row,
                    status: AppointmentStatus[data.row?.status]
                } as EventModal)));
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

    const handleSavePrescription = (print: boolean = true) => {
        setLoadingRequest(true);
        const form = new FormData();
        let method;
        let url;
        form.append("globalNote", "");
        form.append("isOtherProfessional", "false");
        form.append("drugs", JSON.stringify(drugs));
        method = "POST"
        url = `${urlMedicalEntitySuffix}/appointments/${row?.uuid}/prescriptions/${router.locale}`;
        /* if (selectedDialog && selectedDialog.action.includes("medical_prescription")) {
             method = "PUT"
             url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/prescriptions/${selectedDialog.uuid}/${router.locale}`;
         }*/

        triggerDrugsManage({
            method: method,
            url: url,
            data: form
        }, {
            onSuccess: (r: any) => {
                mutateWaitingRoom();
                if (print) {
                    const res = r.data.data;
                    let type = "";
                    if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                        type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "

                    setDocumentPreview({
                        uri: res[1],
                        name: "prescription",
                        type: "prescription",
                        info: res[0].prescription_has_drugs,
                        uuid: res[0].uuid,
                        uuidDoc: res[0].uuid,
                        createdAt: moment().format('DD/MM/YYYY'),
                        description: "",
                        patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`,
                        age: patient?.birthdate ? getBirthdayFormat({birthdate: patient.birthdate}, t) : "",
                        print: true
                    });
                    setOpenDocPreviewDialog(true);
                }
                setPrescription([]);
                setDrugs([]);

                let pdoc = [...pendingDocuments];
                pdoc = pdoc.filter((obj) => obj.id !== 2);
                setPendingDocuments(pdoc);
            },
            onSettled: () => {
                setLoadingRequest(false);
                setOpenAddPrescriptionDialog(false);
            }
        });
    }

    const closeDocPreviewDialog = () => {
        setOpenDocPreviewDialog(false);
        dispatch(setAppointmentPatient(null));
    }

    const columns = useRef<any[]>([
        {
            id: '1',
            name: 'today-rdv',
            url: '#',
            icon: <IconUrl width={16} height={16} color={theme.palette.primary.main} path="ic-filled-calendar-date"/>,
            action: <CustomIconButton
                sx={{mr: 1, maxWidth: 32, maxHeight: 32}}
                onClick={() => {
                    setWithoutDateTime(false);
                    setQuickAddAppointment(true);
                    setTimeout(() => setQuickAddAppointmentTab(1));
                }}

                color={"primary"}
                size={"small"}>
                <AgendaAddViewIcon fontSize="small"/>
            </CustomIconButton>
        },
        {
            id: '3',
            name: 'waiting-room',
            url: '#',
            icon: <IconUrl width={16} height={16} color={theme.palette.primary.main} path="ic-filled-sofa"/>,
            ...(ability.can('manage', 'waiting-room', 'waiting-room__waiting-room__appointment-create') && {
                action: <CustomIconButton
                    sx={{p: .6, maxWidth: 32, maxHeight: 32}}
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
            })
        },
        {
            id: '4,8',
            name: 'ongoing',
            url: '#',
            icon: <IconUrl width={16} height={16} color={theme.palette.primary.main} path="ic-filled-timer-start"/>
        },
        {
            id: '5',
            name: 'finished',
            url: '#',
            icon: <IconUrl width={16} height={16} color={theme.palette.primary.main} path="ic-filled-tick-square"/>
        }]);

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
                avatar={columns.current[1].icon}
                {...(columns.current[1].action && {action: columns.current[1].action})}
                title={
                    <Stack direction='row' alignItems='center' spacing={3}>
                        <Typography
                            color={"text.primary"} fontWeight={700}
                            fontSize={14}>
                            {t(`tabs.${columns.current[1].name}`)}
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
            const sortKey = menuOptions.find(option => option.value === boardFilterData.sort)?.key;
            let sortData = (httpWaitingRoomsResponse as HttpResponse).data;
            if (sortKey !== "estimatedStartTime") {
                const timeFormat = `DD-MM-YYYY HH:mm${sortKey === "arrivalTime" ? ":ss" : ""}`;
                sortData = sortData?.sort((a: any, b: any) => {
                    const d1 = boardFilterData.order === "asscending" ? a : b;
                    const d2 = boardFilterData.order === "asscending" ? b : a;
                    return moment(`${d1.dayDate} ${d1[sortKey]}`, timeFormat).valueOf() - moment(`${d2.dayDate} ${d2[sortKey]}`, timeFormat).valueOf()
                });
            }
            setSortedData(sortData.filter((item: any) => item.startTime !== "00:00"));
            let groupedData = sortData.group((diag: any) => diag.status);
            const onGoingAppointment = partition(groupedData[3], (event: any) => event.estimatedStartTime === null);
            groupedData[3] = [...onGoingAppointment[1], ...onGoingAppointment[0]];
            if (sortKey === "arrivalTime") {
                groupedData[3].reverse();
            } else if (sortKey === "startTime") {
                groupedData[3].reverse().sort((a: any) => a.startTime === "00:00" ? 1 : -1);
            }
            if (boardFilterData.unpaid && groupedData[5]) {
                groupedData[5] = groupedData[5].filter((data: any) => data.restAmount > 0);
            }
            setWaitingRoomsGroup(groupedData);
        }
    }, [httpWaitingRoomsResponse, is_next, boardFilterData]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (agenda) {
            let sort;
            switch (agenda?.waitingRoomDisplay) {
                case 1:
                    sort = "arrival-time";
                    break;
                case 2:
                    sort = "smart-list";
                    break;
                default:
                    sort = "start-time";
                    break;
            }
            dispatch(setSortTime(sort));
        }
    }, [agenda, dispatch]);

    useEffect(() => {
        dispatch(toggleSideBar(true));
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["waitingRoom", "common"]);

        onScrollToNow();
        // listener timeline handler
        const container = document.querySelector(".planby > div > div") as HTMLElement;
        !isAppleDevise('macOS') && container?.addEventListener("wheel", function (e) {
            console.log("wheel", e);
            if (e.deltaY > 0) {
                container.scrollLeft += 300;
            } else {
                container.scrollLeft -= 300;
            }
            e.preventDefault();
        });
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useLeavePageConfirm(() => {
        dispatch(resetFilter());
    });

    if (!ready) return (<LoadingScreen button text={"loading"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    "& .MuiToolbar-root": {
                        display: "block"
                    }
                }}>
                {showTimeline && <Epg isLoading={isLoading} {...getEpgProps()}>
                    <Layout
                        {...getLayoutProps()}
                        renderTimeline={(props) => <PlanByTimeline {...props} />}
                        renderProgram={({program, ...rest}) => (
                            <EventItem key={program.data.uuid} program={program} {...rest} />
                        )}
                    />
                </Epg>}
                {/*         <Stack alignItems={"center"} width={"100%"}>
                    <Fab
                        color="info"
                        onClick={event => {
                            event.stopPropagation();
                            dispatch(setShowDetails(!showTimeLineDetails));
                        }}
                        size={"small"}
                        sx={{
                            boxShadow: "none",
                            minHeight: 20,
                            height: 36,
                            width: 36
                        }}>
                        <IconUrl path={showTimeLineDetails ? "ic-outline-arrow-up" : "ic-arrow-down"}/>
                    </Fab>
                </Stack>*/}


                <RoomToolbar {...{
                    t,
                    tabIndex,
                    setTabIndex,
                    onScrollToNow,
                    setPatientDetailDrawer,
                    nextConsultation,
                    columns: columns.current,
                    currentDate,
                    is_next,
                    isActive
                }} />
            </SubHeader>
            <Box>
                <LinearProgress
                    sx={{
                        visibility: !httpWaitingRoomsResponse || loading || isWaitingRoomsLoading ? "visible" : "hidden"
                    }} color="warning"/>

                <Box className="container">
                    <DesktopContainer>
                        <TabPanel padding={.1} value={tabIndex} index={0}>
                            <Stack spacing={1} {...(!showStats && {mt: -2})}>
                                {showStats && <Stack direction='row' spacing={2}>
                                    <Card sx={{border: 'none', boxShadow: 'none', flex: 1,}}>
                                        <CardHeader
                                            sx={{pb: 0}}
                                            avatar={
                                                <CustomIconButton sx={{bgcolor: theme.palette.primary.lighter}}>
                                                    <IconUrl width={20} height={20} path="ic-outline-agenda-tick"/>
                                                </CustomIconButton>
                                            }
                                            title={
                                                <Stack spacing={.3}>
                                                    <Typography
                                                        fontWeight={600}>{startCase(t("appointments"))}</Typography>
                                                    <Typography fontWeight={600}
                                                                fontSize={18}>{sortedData?.length}</Typography>
                                                </Stack>
                                            }
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <ButtonGroup sx={{button: {borderRadius: 4, flex: 1}, width: 1}}
                                                             variant="contained" className="rdv-type-group"
                                                             size="small">
                                                    <Button className="btn-absent">
                                                        <Typography component='span' className="ellipsis">
                                                            {`0 ${t('filter.absent')}`}
                                                        </Typography>
                                                    </Button>
                                                    <Button className="btn-confirm">
                                                        <Typography component='span' className="ellipsis">
                                                            {`${waitingRoomsGroup[1] ? waitingRoomsGroup[1].length : "0"} ${t('filter.confirm')}`}
                                                        </Typography>
                                                    </Button>
                                                    <Button className="btn-waiting ellipsis" style={{flex: 2}}>
                                                        <Typography component='span'
                                                                    className="ellipsis">{`${waitingRoomsGroup[3] ? waitingRoomsGroup[3].length : "0"} ${t('filter.pending')}`}</Typography>
                                                    </Button>
                                                    <Button className="btn-complete ellipsis" style={{flex: 2}}>
                                                        <Typography component='span'
                                                                    className="ellipsis">{`${waitingRoomsGroup[5] ? waitingRoomsGroup[5].length : "0"} ${t('filter.done')}`}</Typography>
                                                    </Button>
                                                </ButtonGroup>
                                                <Breadcrumbs aria-label="breadcrumb" separator={null}>
                                                    {["absent", "confirm", "pending", "done"].map((item, idx) =>
                                                        <Link
                                                            key={idx}
                                                            underline="none"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: theme.palette.grey[400]
                                                            }}
                                                            color="inherit">
                                                            <CircleIcon sx={{mr: 0.5, width: 8, height: 8}}
                                                                        htmlColor={theme.palette[
                                                                            item === "absent" ? "error"
                                                                                : item === "confirm" ? "success"
                                                                                    : item === "pending" ? "warning"
                                                                                        : "primary"

                                                                            ].light}/>
                                                            {t(`filter.${item}`)}
                                                        </Link>
                                                    )}

                                                </Breadcrumbs>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{
                                        border: 'none', boxShadow: 'none', flex: 1,
                                    }}>
                                        <CardContent
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: 1,
                                                p: 1.5,
                                                "&.MuiCardContent-root:last-child": {
                                                    p: 1.5
                                                }
                                            }}
                                        >
                                            <CardHeader
                                                sx={{
                                                    p: 1,
                                                    border: `1px dashed ${theme.palette.divider}`,
                                                    borderRadius: 1
                                                }}
                                                avatar={
                                                    <CustomIconButton sx={{bgcolor: theme.palette.success.lighter}}>
                                                        <IconUrl width={20} height={20} path="ic-filled-strongbox-2"
                                                                 color={theme.palette.success.main}/>
                                                    </CustomIconButton>

                                                }
                                                title={
                                                    <Stack>
                                                        <Typography fontWeight={600}
                                                                    color="primary.darker">{t("total_received")}</Typography>
                                                        <Typography fontWeight={600} fontSize={18}>--
                                                            <Typography variant="caption" ml={.5}>
                                                                {devise}
                                                            </Typography>
                                                        </Typography>
                                                    </Stack>

                                                }
                                            />
                                            <CardHeader
                                                sx={{
                                                    p: 1,
                                                    border: `1px dashed ${theme.palette.divider}`,
                                                    borderRadius: 1
                                                }}
                                                avatar={
                                                    <CustomIconButton sx={{bgcolor: theme.palette.success.lighter}}>
                                                        <IconUrl width={20} height={20} path="ic-filled-hand-money"
                                                                 color={theme.palette.success.main}/>
                                                    </CustomIconButton>

                                                }
                                                title={
                                                    <Stack>
                                                        <Typography fontWeight={600}
                                                                    color="primary.darker">{t("billed_consultation")}</Typography>
                                                        <Typography fontWeight={600} fontSize={18}>--
                                                            <Typography variant="caption" ml={.5}>
                                                                TND
                                                            </Typography>
                                                        </Typography>
                                                    </Stack>

                                                }
                                            />
                                            <CardHeader
                                                sx={{
                                                    p: 1,
                                                    border: `1px dashed ${theme.palette.divider}`,
                                                    borderRadius: 1
                                                }}
                                                avatar={
                                                    <CustomIconButton sx={{bgcolor: theme.palette.success.lighter}}>
                                                        <IconUrl width={20} height={20} path="ic-filled-money-tick"
                                                                 color={theme.palette.success.main}/>
                                                    </CustomIconButton>

                                                }
                                                title={
                                                    <Stack>
                                                        <Typography fontWeight={600}
                                                                    color="primary.darker">{t("paid")}</Typography>
                                                        <Typography fontWeight={600} fontSize={18}>--
                                                            <Typography variant="caption" ml={.5}>
                                                                TND
                                                            </Typography>
                                                        </Typography>
                                                    </Stack>

                                                }
                                            />
                                            <CardHeader
                                                sx={{
                                                    p: 1,
                                                    border: `1px dashed ${theme.palette.divider}`,
                                                    borderRadius: 1
                                                }}
                                                avatar={
                                                    <CustomIconButton sx={{bgcolor: theme.palette.error.lighter}}>
                                                        <IconUrl width={20} height={20} path="ic-filled-money-remove"
                                                                 color={theme.palette.error.main}/>
                                                    </CustomIconButton>
                                                }
                                                title={
                                                    <Stack>
                                                        <Typography fontWeight={600}
                                                                    color="primary.darker">{t("unpaid")}</Typography>
                                                        <Typography fontWeight={600} fontSize={18}>--
                                                            <Typography variant="caption" ml={.5}>
                                                                TND
                                                            </Typography>
                                                        </Typography>
                                                    </Stack>

                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                    <Card sx={{
                                        border: 'none', boxShadow: 'none', flex: .35,
                                    }}>
                                        <CardContent>
                                            <Stack alignItems='center' spacing={2}>
                                                <CustomIconButton sx={{bgcolor: theme.palette.primary.lighter}}>
                                                    <IconUrl width={20} height={20} path="ic-filled-logout"
                                                             color={theme.palette.primary.main}/>
                                                </CustomIconButton>
                                                <Typography fontWeight={600} textAlign='center'
                                                            color="primary.darker">{t("estimated_end_time")}</Typography>
                                                <Typography variant="h5" lineHeight={1}>--.--</Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>}
                                <Board
                                    {...{columns: columns.current, handleDragEvent, handleSortData, handleUnpaidFilter}}
                                    isUnpaidFilter={boardFilterData.unpaid}
                                    handleEvent={handleTableActions}
                                    data={waitingRoomsGroup}/>
                            </Stack>
                        </TabPanel>
                    </DesktopContainer>
                    <TabPanel padding={.1} value={tabIndex} index={1}>
                        {!!waitingRoomsGroup[1]?.length ? <>
                                <DesktopContainer>
                                    <Otable
                                        sx={{mt: 2}}
                                        {...{
                                            openMenu,
                                            doctor_country,
                                            roles,
                                            tabIndex,
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
                                                avatar={columns.current[0].icon}
                                                {...(columns.current[0].action && {action: columns.current[0].action})}
                                                title={
                                                    <Typography
                                                        color={"text.primary"} fontWeight={700}
                                                        fontSize={14}>
                                                        {t(`tabs.${columns.current[0].name}`)}
                                                        <Label variant="filled" color="info"
                                                               sx={{ml: 1, height: 'auto', p: .6, minWidth: 20}}>
                                                            {waitingRoomsGroup[1].length}
                                                        </Label>
                                                    </Typography>}
                                            />
                                        }
                                        headers={WaitingTodayCells}
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
                                    setWithoutDateTime(false);
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
                                    setWithoutDateTime(false);
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
                                        toolbar={<Stack direction='row' mb={1} alignItems='center' borderBottom={1}
                                                        borderColor="divider" py={1}>
                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                <IconUrl path="ic-dubble-check-round"/>
                                                <Typography fontWeight={600}>
                                                    {t("tabs.finished")}
                                                </Typography>
                                                <Label color="info" variant="filled">
                                                    {[...(waitingRoomsGroup[5] ? waitingRoomsGroup[5] : [])].length}
                                                </Label>
                                            </Stack>
                                            <Stack ml="auto" direction={"row"} alignItems={"center"}

                                                   sx={{height: 28}}>
                                                <CustomSwitch
                                                    className="custom-switch"
                                                    name="active"
                                                    onChange={handleUnpaidFilter}
                                                    checked={boardFilterData.unpaid}


                                                />
                                                <Typography variant={"body2"}
                                                            fontSize={12}>{t("tabs.payed")}</Typography>
                                            </Stack>
                                        </Stack>}
                                        headers={_.tail(WaitingHeadCells)}
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
                        {popoverActions.map((context: any, index) => (
                            <Can key={index}
                                 I={"manage"}
                                 a={context.feature as any} {...(context.permission !== "*" && {field: context.permission})}>
                                <MenuItem
                                    key={index}
                                    className="popover-item"
                                    onClick={() => OnMenuActions(context.action)}>
                                    {context.icon}
                                    <Typography fontSize={15} sx={{color: "#fff"}}>
                                        {t(context.title)}
                                    </Typography>
                                </MenuItem>
                            </Can>
                        ))}
                    </ActionMenu>

                    {(isMobile && [1, 2].includes(tabIndex)) && (
                        <Zoom
                            in={!loading}
                            timeout={transitionDuration}
                            style={{
                                transitionDelay: `${!loading ? transitionDuration.exit : 0}ms`,
                            }}
                            unmountOnExit>
                            <Fab color="primary" aria-label="add"
                                 onClick={() => {
                                     setWithoutDateTime(false);
                                     setQuickAddAppointment(true);
                                     setTimeout(() => setQuickAddAppointmentTab(tabIndex === 1 ? 1 : 3));
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
                    <Menu
                        id="sort-menu"
                        {...{anchorEl}}
                        open={anchorEl !== null}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        sx={{
                            "& .MuiPaper-root": {
                                borderRadius: 2,
                                minWidth: 180
                            }
                        }}
                        onClose={handleCloseMenu}>
                        <Typography fontWeight={600} px={2} my={.5}>{t("sort.sort-by")} </Typography>

                        {menuOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                onClick={() => handleSortSelect(option)}>
                                <Box
                                    component={Radio}
                                    checkedIcon={<TripOriginRoundedIcon/>}
                                    checked={option.value === boardFilterData.sort}
                                    sx={{
                                        width: 17, height: 17, mr: '5px', ml: '-2px',
                                        '& .MuiSvgIcon-root': {
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                    style={{
                                        visibility: option.value === boardFilterData.sort ? 'visible' : 'hidden',
                                    }}
                                />
                                {t(`sort.${option.value}`)}
                            </MenuItem>
                        ))}
                        {/*<Stack mt={1} px={1} direction={"row"} alignItems={"center"} spacing={1}
                               justifyContent={"center"}>
                            <ToggleButton
                                size={"small"}
                                sx={{border: "none"}}
                                color={"primary"}
                                selected={orderSort === "asscending"}
                                value="check"
                                onChange={() => handleOrderSelect("asscending")}>
                                <IconUrl {...(orderSort !== "asscending" && {color: theme.palette.text.primary})}
                                         width={16} height={16}
                                         path={"ic-linear-sort-descending"}/>
                                {orderSort === "asscending" && <Typography ml={1}>{t("sort.ascending")}</Typography>}
                            </ToggleButton>

                            <ToggleButton
                                size={"small"}
                                sx={{border: "none"}}
                                color={"primary"}
                                selected={orderSort === "descending"}
                                value="check"
                                onChange={() => handleOrderSelect("descending")}>
                                <IconUrl  {...(orderSort !== "descending" && {color: theme.palette.text.primary})}
                                          width={16} height={16}
                                          path={"ic-linear-sort-asscending"}/>
                                {orderSort === "descending" && <Typography ml={1}>{t("sort.decreasing")}</Typography>}
                            </ToggleButton>
                        </Stack>*/}
                    </Menu>
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
                    dispatch(resetAppointment());
                    setQuickAddAppointment(false);
                    setQuickAddPatient(false);
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
                        onClick={() => {
                            dispatch(resetAppointment());
                            setQuickAddAppointment(false)
                        }}
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
                        disabled={type === "" || !patient || (!withoutDateTime && recurringDates?.length === 0)}>
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
                    <Stack direction={"row"}
                           justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant={"text-black"}
                            onClick={() => setOpenPreConsultationDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <Button
                            disabled={loadingRequest}
                            variant="contained"
                            onClick={() => submitPreConsultationData()}
                            startIcon={<IconUrl path="iconfinder_save"/>}>
                            {t("save", {ns: "common"})}
                        </Button>
                    </Stack>
                }
            />

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteDialog(false)}
                sx={{direction: direction}}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.delete-dialog.sub-title`, {ns: "common"})} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`dialogs.delete-dialog.description`, {ns: "common"})}</Typography>

                            <Grid container spacing={1}>
                                {deleteAppointmentOptions.filter(option => !(row?.status !== 5 && option.key === "delete-transaction")).map((option: any, index: number) =>
                                    <Grid key={option.key} item
                                          md={12 / deleteAppointmentOptions.filter(option => !(row?.status !== 5 && option.key === "delete-transaction")).length}
                                          xs={12}>
                                        <Card
                                            sx={{
                                                padding: 1,
                                                ml: 2,
                                                borderRadius: 1.4,
                                                "& .MuiTypography-root": {
                                                    fontSize: 14, fontWeight: "bold"
                                                },
                                                "& .MuiFormControlLabel-root": {
                                                    ml: 1,
                                                    width: "100%"
                                                }
                                            }}>
                                            <FormControlLabel
                                                label={t(`dialogs.delete-dialog.${option.key}`, {ns: "common"})}
                                                checked={option.selected}
                                                control={
                                                    <Checkbox
                                                        onChange={(event) => {
                                                            setDeleteAppointmentOptions([
                                                                ...deleteAppointmentOptions.slice(0, index),
                                                                {
                                                                    ...deleteAppointmentOptions[index],
                                                                    selected: event.target.checked
                                                                },
                                                                ...deleteAppointmentOptions.slice(index + 1)
                                                            ])
                                                        }}
                                                    />
                                                }
                                            />
                                        </Card>
                                    </Grid>)}
                            </Grid>
                        </Box>)
                }}
                open={deleteDialog}
                title={t(`dialogs.delete-dialog.title`, {ns: "common"})}
                actionDialog={
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant="text-black"
                            onClick={() => setDeleteDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {t(`dialogs.delete-dialog.cancel`, {ns: "common"})}
                        </Button>
                        <LoadingButton
                            loading={loadingRequest}
                            loadingPosition="start"
                            variant="contained"
                            disabled={deleteAppointmentOptions.filter(option => option.selected).length === 0}
                            color={"error"}
                            onClick={() => handleDeleteAppointment()}
                            startIcon={<IconUrl height={"18"} width={"18"} color={"white"}
                                                path="ic-trash"></IconUrl>}>
                            {t(`dialogs.delete-dialog.confirm`, {ns: "common"})}
                        </LoadingButton>
                    </Stack>
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
                    <Stack direction={"row"} justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant={"text-black"}
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
                            startIcon={<IconUrl path="iconfinder_save"/>}>
                            {t("save", {ns: "common"})}
                        </LoadingButton>
                    </Stack>
                }
            />

            <Dialog
                {...{direction}}
                action={getPrescriptionUI()}
                open={openAddPrescriptionDialog}
                data={{
                    appuuid: row?.uuid,
                    patient: row?.patient,
                    state: drugs,
                    setState: setDrugs,
                    t,
                    setPendingDocuments,
                    pendingDocuments,
                    setOpenDialog: setOpenAddPrescriptionDialog,
                    setPrescription
                }}
                size={"xl"}
                sx={{
                    p: 1.5
                }}
                title={t("requestedPrescription", {ns: "common"})}
                onClose={() => setOpenAddPrescriptionDialog(false)}
                dialogClose={() => setOpenAddPrescriptionDialog(false)}
                actionDialog={
                    <Stack
                        sx={{width: "100%"}}
                        direction={{xs: 'column', sm: 'row'}}
                        justifyContent={"space-between"}>

                        <Button sx={{alignSelf: 'flex-start'}} startIcon={<AddIcon/>} onClick={() => {
                            dispatch(handleDrawerAction("addDrug"));
                        }}>
                            {t("add_drug", {ns: "common"})}
                        </Button>
                        <Stack direction={"row"} justifyContent={{xs: 'space-between', sm: 'flex-start'}}
                               spacing={1.2}
                               mt={{xs: 1, md: 0}}>
                            <Button
                                color={"black"}
                                variant={"text"}
                                onClick={() => setOpenAddPrescriptionDialog(false)}
                                startIcon={<CloseIcon/>}>
                                {t("cancel", {ns: "common"})}
                            </Button>

                            <LoadingButton
                                loading={loadingRequest}
                                loadingPosition={"start"}
                                color={"info"}
                                variant="outlined"
                                onClick={() => handleSavePrescription(false)}
                                disabled={drugs?.length === 0}
                                startIcon={
                                    <IconUrl
                                        {...(drugs?.length === 0 && {color: "white"})}
                                        path={"iconfinder_save"}/>}>
                                {t("save", {ns: "common"})}
                            </LoadingButton>
                            <LoadingButton
                                loading={loadingRequest}
                                loadingPosition={"start"}
                                variant="contained"
                                sx={{width: {xs: 1, sm: 'auto'}}}
                                onClick={() => handleSavePrescription()}
                                disabled={drugs?.length === 0}
                                startIcon={<IconUrl width={20} height={20} path={"menu/ic-print"}/>}>
                                {t("save_print", {ns: "common"})}
                            </LoadingButton>
                        </Stack>
                    </Stack>}

            />

            <Dialog
                action={"document_detail"}
                open={openDocPreviewDialog}
                data={{
                    state: documentPreview,
                    setState: setDocumentPreview,
                    setOpenDialog: setOpenDocPreviewDialog,
                    patient,
                    documentViewIndex: 1,
                    source: "waiting-room",
                    setLoadingRequest
                }}
                size={"lg"}
                direction={'ltr'}
                sx={{p: 0}}
                title={t("config.doc_detail_title", {ns: "patient"})}
                onClose={closeDocPreviewDialog}
                dialogClose={closeDocPreviewDialog}
            />

            <Menu
                id="basic-menu"
                anchorEl={anchorElMenu}
                open={openMenu}
                onClose={() => setAnchorElMenu(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    sx: {
                        "& .MuiMenuItem-root": {
                            minWidth: 255,
                            py: 1.2,
                            "&:not(:last-child)": {
                                borderBottom: `1px solid ${theme.palette.divider}`,
                            },
                            "&.Mui-disabled": {
                                border: 'none',
                                mb: 1,
                                opacity: 1
                            }
                        }
                    }
                }}>
                <MenuItem disabled>
                    <Typography variant="body2" color='text.primary' fontWeight={600}>
                        {t("table.documents")}
                    </Typography>
                </MenuItem>
                {documentsPreview.map((document, idx) => (
                    <MenuItem onClick={event => {
                        event.stopPropagation();
                        if (row) {
                            const docs = row[document.value as keyof typeof row] as any[];
                            handleShowPreviewDoc(docs[0]?.uuid, row.uuid);
                        }
                        setAnchorElMenu(null)
                    }} key={idx}>
                        <ListItemIcon>
                            <IconUrl path={document.icon} width={20} height={20}
                                     color={theme.palette.text.primary}/>
                        </ListItemIcon>
                        <ListItemText sx={{mr: 2}} primary={t(document.key, {ns: "common"})}/>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <IconButton
                                disableRipple
                                size="small">
                                <IconUrl path="ic-voir-new"/>
                            </IconButton>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
            {/*<Snackbar
                open={true}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert
                    severity="expire"
                    icon={<Label variant="filled" color="expire">Alert</Label>}
                    sx={{ width: '100%', maxWidth: 512, bgcolor: 'expire.lighter', border: 'none' }}
                >
                    <AlertTitle>Consultation Time Alert</AlertTitle>
                    <Typography color="text.secondary">
                        Your consultation time is about to end. Would you like to extend the consultation duration?
                    </Typography>
                    <Stack mt={2} direction='row' justifyContent='flex-end' spacing={1}>
                        <Button size="small" variant="white" >Close</Button>
                        <Button sx={{ px: 2 }} startIcon={
                            <IconUrl path="ic-filled-alarm-add" width={16} height={16} color="white" />
                        } size="small" variant="contained" color="expire">+5 minutes</Button>
                    </Stack>
                </Alert>
            </Snackbar>*/}
        </>
    )
        ;
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "menu",
            "common",
            "waitingRoom"
        ])),
    },
});

export default WaitingRoom;

WaitingRoom.auth = true

WaitingRoom.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
