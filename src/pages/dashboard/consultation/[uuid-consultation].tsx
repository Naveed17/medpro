import React, {ReactElement, useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {
    Box,
    Button,
    Collapse,
    DialogActions,
    Drawer,
    Fab,
    Grid,
    IconButton, ListItemIcon, ListItemText, MenuItem, MenuList,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {ConsultationDetailCard, PendingDocumentCard, resetTimer, timerSelector} from "@features/card";
import {agendaSelector, openDrawer, setStepperIndex} from "@features/calendar";
import {useTranslation} from "next-i18next";
import {useInvalidateQueries, useMedicalEntitySuffix, useMutateOnGoing} from "@lib/hooks";
import {useRouter} from "next/router";
import {tabs} from "@features/toolbar/components/appToolbar/config";
import {alpha, Theme} from "@mui/material/styles";
import {AppToolbar} from "@features/toolbar/components/appToolbar";
import {MyCardStyled, MyHeaderCardStyled, SubHeader} from "@features/subHeader";
import HistoryAppointementContainer from "@features/card/components/historyAppointementContainer";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {WidgetForm} from "@features/widget";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import {DocumentsTab, EventType, FeesTab, HistoryTab, Instruction, TabPanel, TimeSchedule} from "@features/tabPanel";
import AppointHistoryContainerStyled
    from "@features/appointHistoryContainer/components/overrides/appointHistoryContainerStyle";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import {SubFooter} from "@features/subFooter";
import {consultationSelector, SetPatient} from "@features/toolbar";
import {Dialog, DialogProps, PatientDetail} from "@features/dialog";
import moment from "moment/moment";
import CloseIcon from "@mui/icons-material/Close";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {useSession} from "next-auth/react";
import {DrawerBottom} from "@features/drawerBottom";
import {cashBoxSelector, ConsultationFilter} from "@features/leftActionBar";
import {CustomStepper} from "@features/customStepper";
import ImageViewer from "react-simple-image-viewer";
import {onOpenPatientDrawer, tableActionSelector} from "@features/table";
import {MobileContainer} from "@themes/mobileContainer";
import ChatDiscussionDialog from "@features/dialog/components/chatDiscussion/chatDiscussion";
import {DefaultCountry, TransactionStatus, TransactionType} from "@lib/constants";
import {Session} from "next-auth";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useWidgetModels} from "@lib/hooks/rest";
import {batch} from "react-redux";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {ModelDot} from "@features/modelDot";

//%%%%%% %%%%%%%
const grid = 8;
const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 0,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "",

    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "",
    padding: grid,
    width: "50%"
});

//%%%%%% %%%%%%%

function ConsultationInProgress() {
    const theme = useTheme();
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {models} = useWidgetModels({filter: ""})
    const {trigger: mutateOnGoing} = useMutateOnGoing();

    const {t} = useTranslation("consultation");
    //***** SELECTORS ****//
    const {
        medicalEntityHasUser,
        medicalProfessionalData
    } = useAppSelector(dashLayoutSelector);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {config: agenda, openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const {isActive, event} = useAppSelector(timerSelector);
    const {selectedDialog} = useAppSelector(consultationSelector);
    const {direction} = useAppSelector(configSelector);
    const {tableState} = useAppSelector(tableActionSelector);
    const {drawer} = useAppSelector((state: { dialog: DialogProps }) => state.dialog);

    const {data: user} = session as Session;
    const medical_professional_uuid = medicalProfessionalData && medicalProfessionalData[0].medical_professional.uuid;
    const app_uuid = router.query["uuid-consultation"];

    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("appointment/edit");
    const {trigger: triggerTransactionCreate} = useRequestQueryMutation("transaction/create");
    const {trigger: triggerNotificationPush} = useRequestQueryMutation("notification/push");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/status/update");
    const {trigger: triggerUsers} = useRequestQueryMutation("users/get");
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {trigger: triggerDocumentChat} = useRequestQueryMutation("/chat/document");

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const {inProgress} = router.query;

    const EventStepper = [
        {
            title: "steppers.tabs.tab-1",
            children: EventType,
            disabled: true,
        },
        {
            title: "steppers.tabs.tab-2",
            children: TimeSchedule,
            disabled: true,
        },
        {
            title: "steppers.tabs.tab-4",
            children: Instruction,
            disabled: true,
        },
    ];
    const isAddAppointment = false;

    const [selectedTab, setSelectedTab] = useState<string>("consultation_form");
    const [changes, setChanges] = useState([
        {name: "patientInfo", icon: "ic-text", checked: false},
        {name: "fiche", icon: "ic-text", checked: false},
        {index: 0, name: "prescription", icon: "ic-traitement", checked: false},
        {
            index: 3,
            name: "requested-analysis",
            icon: "ic-analyse",
            checked: false,
        },
        {
            index: 2,
            name: "requested-medical-imaging",
            icon: "ic-soura",
            checked: false,
        },
        {index: 1, name: "medical-certificate", icon: "ic-text", checked: false},
    ]);
    const [isHistory, setIsHistory] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [closeExam, setCloseExam] = useState<boolean>(false);
    const [isClose, setIsClose] = useState<boolean>(false);
    const [mpActs, setMPActs] = useState<AppointmentActModel[]>([]);
    const [acts, setActs] = useState<AppointmentActModel[]>([]);
    const [previousData, setPreviousData] = useState(null);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [pendingDocuments, setPendingDocuments] = useState<DocumentPreviewModel[]>([]);
    const [patient, setPatient] = useState<PatientPreview>();
    const [total, setTotal] = useState(0);
    const [state, setState] = useState<any>();
    const [openHistoryDialog, setOpenHistoryDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<null | string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);
    const [meeting, setMeeting] = useState<number>(15);
    const [checkedNext, setCheckedNext] = useState(false);
    const [dialog, setDialog] = useState<string>("");
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [filterdrawer, setFilterDrawer] = useState(false);
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [isViewerOpen, setIsViewerOpen] = useState<string>("");
    const [transactions, setTransactions] = useState(null);
    const [restAmount, setRestAmount] = useState(0);

    const [sheet, setSheet] = useState<any>(null);
    const [sheetExam, setSheetExam] = useState<any>(null);
    const [hasDataHistory, setHasDataHistory] = useState<any>(null);
    const [tabsData, setTabsData] = useState<any[]>([]);
    const [sheetModal, setSheetModal] = useState<any>(null);

    const [cards, setCards] = useState([[
        {id: 'item-1', content: 'widget', expanded: false,config:false, icon: "ic-edit-file-pen"},
        {id: 'item-2', content: 'history', expanded: false, icon: "ic-historique"}
    ], [{id: 'item-3', content: 'exam', expanded: false, icon: "ic-edit-file-pen"}]]);

    const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue)
    }

    useLeavePageConfirm(() => {
        mutateSheetData()
        mutatePatient()
    });

    // ********** Requests ********** \\
    const {data: httpSheetResponse, mutate: mutateSheetData} = useRequestQuery(agenda && medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${app_uuid}/consultation-sheet/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    useEffect(() => {
        if (httpSheetResponse) {
            const data = (httpSheetResponse as HttpResponse)?.data
            setSheet(data)
            setSheetExam(data?.exam)
            setSheetModal(data?.modal)
            setHasDataHistory(data?.hasDataHistory)
            setTabsData([...data?.hasHistory ? [{
                label: "patient_history",
                value: "patient history"
            }] : [], ...tabs])
        }


    }, [httpSheetResponse])

    const {data: httpPatientPreview, mutate: mutatePatient} = useRequestQuery(sheet?.patient && medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${sheet?.patient}/preview/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpPreviousResponse} = useRequestQuery(sheet?.hasHistory && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/previous/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    // ********** Requests ********** \\
    const changeModel = (prop: ModalModel,ind:number,index:number) => {
        selectedModel.default_modal = prop;
        setSelectedModel(selectedModel);

        const form = new FormData();
        form.append("modal_data", JSON.stringify({...JSON.parse(localStorage.getItem(`Modeldata${app_uuid}`) as string)}));
        form.append("modal_uuid", selectedModel?.default_modal.uuid);
        triggerAppointmentEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        })

        localStorage.setItem(
            `Model-${app_uuid}`,
            JSON.stringify({
                data: {},
                default_modal: prop,
            })
        );

        let _cards = [...cards];
        _cards[ind][index].expanded = true;
        _cards[ind][index].config = false;
        setCards([..._cards])

    };

    const mutateDoc = () => {
        const docUrl = `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/documents/${router.locale}`;
        invalidateQueries([docUrl])
    }
    const showDoc = (card: any) => {
        let type = "";
        if (patient && !(patient.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
            type = patient && patient.gender === "F" ? "Mme " : patient.gender === "U" ? "" : "Mr "
        if (card.documentType === "medical-certificate") {
            setInfo("document_detail");

            setState({
                uuid: card.uuid,
                certifUuid: card.certificate[0].uuid,
                content: card.certificate[0].content,
                doctor: card.name,
                patient: `${type} ${
                    patient?.firstName
                } ${patient?.lastName}`,
                birthdate: patient?.birthdate,
                cin: patient?.idCard,
                days: card.days,
                description: card.description,
                title: card.title,
                createdAt: card.createdAt,
                detectedType: card.type,
                name: "certif",
                type: "write_certif",
                documentHeader: card.certificate[0].documentHeader,
                mutate: mutateDoc,
                mutateDetails: mutatePatient
            });
            setOpenDialog(true);
        } else {
            setInfo("document_detail");
            let info = card;
            let uuidDoc = "";
            switch (card.documentType) {
                case "prescription":
                    info = card.prescription[0].prescription_has_drugs;
                    uuidDoc = card.prescription[0].uuid;
                    break;
                case "requested-analysis":
                    info = card.requested_Analyses.length > 0 ? card.requested_Analyses[0]?.analyses : [];
                    uuidDoc = card.requested_Analyses[0].uuid;
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]["medical-imaging"];
                    uuidDoc = card.medical_imaging[0].uuid;
                    break;
            }
            setState({
                uuid: card.uuid,
                uri: card.uri,
                name: card.title,
                type: card.documentType,
                createdAt: card.createdAt,
                description: card.description,
                info: info,
                detectedType: card.type,
                uuidDoc: uuidDoc,
                patient: `${type} ${
                    patient?.firstName
                } ${patient?.lastName}`,
                mutate: mutateDoc,
                mutateDetails: mutatePatient
            });
            setOpenDialog(true);
        }
    }

    const seeHistory = () => {
        setOpenHistoryDialog(true);
    }

    const openDialogue = (item: any) => {
        switch (item.id) {
            case 1:
                setDialog("balance_sheet_request");
                break;
            case 2:
                setDialog("draw_up_an_order");
                break;
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
        setActions(false);
    }

    const closeHistory = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (event) {
            const slugConsultation = `/dashboard/consultation/${event.publicId}`;
            router.replace(slugConsultation, slugConsultation, {locale: router.locale});
        }
    }

    const clearData = () => {
        localStorage.removeItem(`Modeldata${app_uuid}`);
        localStorage.removeItem(`Model-${app_uuid}`);
        localStorage.removeItem(`consultation-data-${app_uuid}`);
        localStorage.removeItem(`instruction-data-${app_uuid}`);
        localStorage.removeItem(`consultation-fees`);
        localStorage.removeItem(`consultation-acts-${app_uuid}`);
    }

    const handleTableActions = (action: string, event: any) => {
        switch (action) {
            case "onDetailPatient":
                dispatch(
                    onOpenPatientDrawer({patientId: event.extendedProps.patient.uuid})
                );
                dispatch(openDrawer({type: "add", open: false}));
                setPatientDetailDrawer(true);
                break;
        }
    }

    const leave = () => {
        clearData();
        const form = new FormData();
        form.append("status", "11");
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/status/${router.locale}`
        }, {
            onSuccess: () => {
                setActions(false);
                batch(() => {
                    dispatch(resetTimer());
                    dispatch(openDrawer({type: "view", open: false}));
                });
                mutateOnGoing();
                router.push("/dashboard/agenda");
            }
        });
    }

    const DialogAction = () => {
        return (
            <DialogActions style={{justifyContent: "space-between", width: "100%"}}>
                <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    variant="text"
                    color={"black"}
                    onClick={leave}
                    startIcon={<LogoutRoundedIcon/>}>
                    <Typography sx={{display: {xs: "none", sm: "flex"}}}>
                        {t("withoutSave")}
                    </Typography>
                </LoadingButton>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        variant="text-black"
                        onClick={handleCloseDialog}
                        startIcon={<CloseIcon/>}>
                        <Typography sx={{display: {xs: "none", sm: "flex"}}}>
                            {t("cancel")}
                        </Typography>
                    </Button>
                    <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                        color="error"
                        onClick={() => {
                            saveConsultation();
                        }}
                        startIcon={<IconUrl path="ic-check"/>}>
                        <Typography sx={{display: {xs: "none", sm: "flex"}}}>
                            {t("end_consultation")}
                        </Typography>
                    </LoadingButton>
                </Stack>
            </DialogActions>
        );
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        } else {
            mutatePatient();
        }
    }

    const closeImageViewer = () => {
        setIsViewerOpen("");
    }

    const getTransactionAmountPayed = (): number => {
        let payed_amount = 0;
        (transactions as any)?.transaction_data.forEach((td: { amount: number }) => payed_amount += td.amount);
        return payed_amount;
    }

    const sendNotification = () => {
        triggerUsers({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/users`
        }, {
            onSuccess: (r: any) => {
                const secretary = (r?.data as HttpResponse).data;
                if (secretary.length > 0 && patient) {
                    const localInstr = localStorage.getItem(`instruction-data-${app_uuid}`);
                    const restAmount = getTransactionAmountPayed();
                    const form = new FormData();
                    form.append("action", "end_consultation");
                    form.append("root", "agenda");
                    form.append("content",
                        JSON.stringify({
                            fees: total,
                            restAmount: total - restAmount,
                            instruction: localInstr ? localInstr : "",
                            control: checkedNext,
                            edited: false,
                            payed: transactions ? restAmount === 0 : restAmount !== 0,
                            nextApp: meeting ? meeting : "0",
                            appUuid: app_uuid,
                            dayDate: sheet?.date,
                            patient: {
                                uuid: patient.uuid,
                                email: patient.email,
                                birthdate: patient.birthdate,
                                firstName: patient.firstName,
                                lastName: patient.lastName,
                                gender: patient.gender,
                            },
                        })
                    );
                    triggerNotificationPush({
                        method: "POST",
                        url: `${urlMedicalEntitySuffix}/professionals/notification/${router.locale}`,
                        data: form
                    });
                }
            }
        })
    }

    const checkTransactions = () => {
        if (!transactions && app_uuid) {
            const form = new FormData();
            form.append("type_transaction", TransactionType[2].value);
            form.append("status_transaction", TransactionStatus[1].value);
            form.append("cash_box", selectedBoxes[0]?.uuid);
            form.append("amount", total.toString());
            form.append("rest_amount", total.toString());
            form.append("appointment", app_uuid.toString());
            form.append("transaction_data", JSON.stringify([]));

            triggerTransactionCreate({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
                data: form
            })
        }
    }

    const saveConsultation = () => {
        const form = new FormData();
        form.append("status", "5");
        triggerAppointmentEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                setActions(false);
                batch(() => {
                    dispatch(resetTimer());
                    dispatch(openDrawer({type: "view", open: false}));
                });
                sendNotification();
                checkTransactions();
                clearData();
                mutateOnGoing();
                router.push("/dashboard/agenda");
            }
        });
    }

    const end = () => {
        setInfo("secretary_consultation_alert");
        setOpenDialog(true);
        setActions(true);
    }

    const handleSaveCertif = () => {

        const form = new FormData();

        form.append("content", state.content);
        form.append("title", state.title);

        triggerDocumentChat({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/appointments/${app_uuid}/certificates/${router.locale}`,
            data: form
        }, {
            onSuccess: (r: any) => {
                mutateDoc()
                const res = (r?.data as HttpResponse).data;
                setInfo("document_detail");
                setState({
                    certifUuid: res.uuid,
                    uuid: res.uuid,
                    content: state.content,
                    doctor: '',
                    patient: state.patient,
                    birthdate: state.birthdate,
                    cin: '',
                    createdAt: moment().format('DD/MM/YYYY'),
                    description: "",
                    title: state.title,
                    days: '',
                    name: "certif",
                    type: "write_certif",
                    documentHeader: state.documentHeader,

                });
                setOpenDialog(true);
            }
        });
    }

    const printGlasses = (info: any) => {
        setInfo("document_detail");
        setState({
            type: "glasses",
            name: "glasses",
            info,
            createdAt: moment().format("DD/MM/YYYY"),
            patient: ` ${patient?.firstName} ${patient?.lastName}`,
        });
        setOpenDialog(true);
    }

    //%%%%%% %%%%%%%
    const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result: any = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };
    const reorder = (list: any, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const onDragEnd = (result: any) => {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(cards[sInd], source.index, destination.index);
            const newState: any = [...cards];
            newState[sInd] = items;
            setCards(newState);
        } else {
            const result: any = move(cards[sInd], cards[dInd], source, destination);
            const newState = [...cards];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];
            setCards(newState.filter(group => group.length));
        }
    }
    //%%%%%% %%%%%%%

    useEffect(() => {
        if (httpPreviousResponse) {
            const data = (httpPreviousResponse as HttpResponse).data;
            if (data)
                setPreviousData(data);
        }
    }, [httpPreviousResponse]);

    useEffect(() => {
        if (sheet) {
            setSelectedModel(sheetModal);
            setLoading(false)
            let _acts: AppointmentActModel[] = []
            medicalProfessionalData && medicalProfessionalData[0].acts.map(act => {
                _acts.push({qte: 1, selected: false, ...act})
            })
            setActs(_acts);
            setMPActs(_acts);

            changes.map(change => {
                if (sheet && sheet[change.name])
                    change.checked = sheet[change.name] > 0
            })
            setChanges([...changes])
        }
    }, [medicalProfessionalData, sheet, sheetModal]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (event && event.publicId !== app_uuid && isActive) {
            setIsHistory(true)
        } else setIsHistory(false)
    }, [app_uuid, event, isActive])

    useEffect(() => {
        if (httpPatientPreview) {
            const data = (httpPatientPreview as HttpResponse).data;
            dispatch(SetPatient({uuid: sheet?.patient, birthdate: "", gender: "M", ...data}))
            setPatient(data)
        }
    }, [dispatch, httpPatientPreview, sheet?.patient])

    useEffect(() => {
        if (tableState.patientId)
            setPatientDetailDrawer(true);
    }, [tableState.patientId]);

    useEffect(() => {
        setLoading(true)
        mutateSheetData().then(() => {
            setLoading(false)
        })
    }, [selectedTab]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (inProgress) {
            const form = new FormData();
            form.append('status', '4');
            form.append('start_date', moment().format("DD-MM-YYYY"));
            form.append('start_time', moment().format("HH:mm"));
            updateAppointmentStatus({
                method: "PATCH",
                data: form,
                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/status/${router.locale}`
            }, {
                onSuccess: () => mutateOnGoing()
            });
        }
    }, [inProgress]);  // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            {isHistory && <AppointHistoryContainerStyled> <Toolbar>
                <Stack spacing={1.5} direction="row" alignItems="center" paddingTop={1} justifyContent={"space-between"}
                       width={"100%"}>
                    <Stack spacing={1.5} direction="row" alignItems="center">
                        <IconUrl path={'ic-speaker'}/>
                        <Typography>{t('consultationIP.updateHistory')} <b>{sheet?.date}</b>.</Typography>
                    </Stack>
                    <LoadingButton
                        disabled={false}
                        loading={false}
                        loadingPosition="start"
                        onClick={closeHistory}
                        className="btn-action"
                        color="warning"
                        size="small"
                        startIcon={<IconUrl path="ic-retour"/>}>
                        {t('consultationIP.back')}
                    </LoadingButton>
                </Stack>
            </Toolbar></AppointHistoryContainerStyled>}
            {tabsData.length > 0 && <SubHeader sx={isHistory && {
                backgroundColor: alpha(theme.palette.warning.main, 0.2),
                borderLeft: `2px solid${theme.palette.warning.main}`,
                borderRight: `2px solid${theme.palette.warning.main}`,
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
            }}>
                <AppToolbar
                    {...{
                        selectedTab,
                        setSelectedTab,
                        pendingDocuments,
                        setPendingDocuments,
                        tabsData,
                        selectedDialog,
                        agenda: agenda?.uuid,
                        app_uuid,
                        patient,
                        handleChangeTab,
                        isMobile,
                        loading,
                        changes,
                        anchorEl,
                        mutatePatient,
                        mutateSheetData,
                        setAnchorEl,
                        dialog, setDialog
                    }}
                    setPatientShow={() => setFilterDrawer(!drawer)}
                />
            </SubHeader>}


            {<HistoryAppointementContainer {...{isHistory, loading}}>
                <Box style={{backgroundColor: !isHistory ? theme.palette.info.main : ""}}
                     className="container container-scroll">
                    <TabPanel padding={1} value={selectedTab} index={"patient_history"}>
                        <HistoryTab
                            {...{
                                patient: {
                                    uuid: sheet?.patient,
                                    ...patient
                                },
                                dispatch,
                                t,
                                session,
                                acts,
                                direction,
                                mutate: mutatePatient,
                                setOpenDialog,
                                showDoc,
                                setState,
                                setInfo,
                                router,
                                setIsViewerOpen,
                                setSelectedTab,
                                appuuid: app_uuid,
                                trigger: triggerAppointmentEdit
                            }}
                        />
                    </TabPanel>
                    <TabPanel padding={1} value={selectedTab} index={"consultation_form"}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div style={{display: "flex", width: "100%"}}>
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        {cards.map((el, ind) => (
                                            <Droppable key={ind} droppableId={`${ind}`}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        style={getListStyle(snapshot.isDraggingOver)}
                                                        {...provided.droppableProps}
                                                    >
                                                        {el.map((item: any, index: number) => (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}>
                                                                {(provided: any, snapshot: any) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={getItemStyle(
                                                                            snapshot.isDragging,
                                                                            provided.draggableProps.style
                                                                        )}
                                                                    >
                                                                        <MyCardStyled>
                                                                            <Stack direction={"row"}
                                                                                   style={{backgroundColor: item.content === 'widget' && selectedModel ? alpha(selectedModel?.default_modal.color, 0.3) : ""}}
                                                                                   justifyContent={"space-between"}
                                                                                   onClick={() => {
                                                                                       let _cards = [...cards];
                                                                                       _cards[ind][index].expanded = !item.expanded
                                                                                       setCards([..._cards])
                                                                                       mutateSheetData();
                                                                                   }}
                                                                                   alignItems={"center"}>
                                                                                {item.content === 'widget' && selectedModel ?
                                                                                    <MyHeaderCardStyled>
                                                                                        <Stack direction={"row"} spacing={1}
                                                                                               alignItems={"center"}
                                                                                               border={"1px solid white"}
                                                                                               onClick={(e)=>{
                                                                                                   e.stopPropagation();
                                                                                                   let _cards = [...cards];
                                                                                                   _cards[ind][index].config = !item.config
                                                                                                   _cards[ind][index].expanded = false
                                                                                                   setCards([..._cards])
                                                                                               }}
                                                                                               style={{padding:"3px 8px",borderRadius:5}}>
                                                                                            <ModelDot
                                                                                                color={selectedModel?.default_modal?.color}
                                                                                                selected={false}/>
                                                                                            <Typography
                                                                                                className={'card-title'}>{selectedModel?.default_modal.label}</Typography>
                                                                                            <IconUrl className={"card-icon"} path="ic-flesh-bas-y"/>
                                                                                        </Stack>

                                                                                    </MyHeaderCardStyled> :
                                                                                    <MyHeaderCardStyled>
                                                                                        <Icon className={'card-header'}
                                                                                              path={item.icon}/>
                                                                                        <Typography
                                                                                            className={'card-title'}>{t(item.content)}</Typography>
                                                                                    </MyHeaderCardStyled>}
                                                                                <IconButton className={"btn-header"}>
                                                                                    {item.expanded ?
                                                                                        <KeyboardArrowUpRoundedIcon/> :
                                                                                        <KeyboardArrowDownRoundedIcon/>}
                                                                                </IconButton>
                                                                            </Stack>
                                                                            <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                                                                                {item.content === 'exam' &&
                                                                                    <ConsultationDetailCard
                                                                                        {...{
                                                                                            changes,
                                                                                            setChanges,
                                                                                            app_uuid,
                                                                                            exam: sheetExam,
                                                                                            hasDataHistory,
                                                                                            seeHistory,
                                                                                            closed: closeExam,
                                                                                            setCloseExam,
                                                                                            isClose,
                                                                                            agenda,
                                                                                            trigger: triggerAppointmentEdit
                                                                                        }}
                                                                                        handleClosePanel={(v: boolean) => setCloseExam(v)}

                                                                                    />}
                                                                                {item.content === 'history' && <div
                                                                                    style={{
                                                                                        padding: 10,
                                                                                        borderTop: "1px solid #DDD"
                                                                                    }}>
                                                                                    <HistoryTab
                                                                                        {...{
                                                                                            patient: {
                                                                                                uuid: sheet?.patient,
                                                                                                ...patient
                                                                                            },
                                                                                            dispatch,
                                                                                            t,
                                                                                            session,
                                                                                            acts,
                                                                                            direction,
                                                                                            mutate: mutatePatient,
                                                                                            setOpenDialog,
                                                                                            showDoc,
                                                                                            setState,
                                                                                            setInfo,
                                                                                            router,
                                                                                            setIsViewerOpen,
                                                                                            setSelectedTab,
                                                                                            appuuid: app_uuid,
                                                                                            trigger: triggerAppointmentEdit
                                                                                        }}
                                                                                    /></div>}
                                                                                {item.content === 'widget' && !loading && models && Array.isArray(models) && models.length > 0 && selectedModel && patient && (
                                                                                    <WidgetForm
                                                                                        {...{
                                                                                            models,
                                                                                            changes,
                                                                                            setChanges,
                                                                                            isClose,
                                                                                            acts,
                                                                                            setActs,
                                                                                            previousData,
                                                                                            selectedModel,
                                                                                            appuuid: app_uuid,
                                                                                            modal: selectedModel,
                                                                                            data: sheetModal?.data,
                                                                                            closed: closeExam,
                                                                                            setSM: setSelectedModel,
                                                                                            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
                                                                                            mutateSheetData,
                                                                                            printGlasses
                                                                                        }}
                                                                                        handleClosePanel={(v: boolean) => setIsClose(v)}></WidgetForm>
                                                                                )}
                                                                            </Collapse>

                                                                            <Collapse in={item.config} timeout="auto" unmountOnExit>
                                                                                <MenuList>
                                                                                    {(models as any[])?.map((item: any, idx: number) => (
                                                                                        <Box key={"widgt-x-" + idx}>
                                                                                            {item.isEnabled && (
                                                                                                <MenuItem
                                                                                                    key={`model-item-${idx}`}
                                                                                                    onClick={() => {changeModel(item,ind,index)}}>
                                                                                                    <ListItemIcon>
                                                                                                        <ModelDot
                                                                                                            color={item.color}
                                                                                                            selected={false}
                                                                                                            size={21}
                                                                                                            sizedot={13}
                                                                                                            padding={3}
                                                                                                        />
                                                                                                    </ListItemIcon>
                                                                                                    <ListItemText
                                                                                                        style={{
                                                                                                            textOverflow: "ellipsis",
                                                                                                            whiteSpace: "nowrap",
                                                                                                            overflow: "hidden",
                                                                                                        }}>
                                                                                                        {item.label}
                                                                                                    </ListItemText>
                                                                                                </MenuItem>
                                                                                            )}
                                                                                        </Box>
                                                                                    ))}
                                                                                </MenuList>
                                                                            </Collapse>
                                                                        </MyCardStyled>

                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        ))}
                                    </DragDropContext>
                                </div>
                            </Grid>
                            <Grid item xs={0}>
                            </Grid>
                        </Grid>


                        {/*
                        <Stack direction={{xs: 'column', md: 'row'}} justifyContent='space-between' spacing={2}>
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={'modal'}
                                    layoutId="modal-1"
                                    initial={false}
                                    animate={{
                                        width: isMobile ? "100%" : getWidgetSize()

                                    }}

                                >
                                    {loading && <CardContent
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            border: `1px solid ${theme.palette.grey['A300']}`,
                                            overflow: 'hidden',
                                            borderRadius: 2,
                                            height: {xs: "30vh", md: "40.3rem"},
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 0
                                        }}>
                                        <Skeleton variant="rounded" width={"100%"}
                                                  sx={{height: {xs: "30vh", md: "40.3rem"}}}/>
                                    </CardContent>}

                                    {!loading && !selectedModel && (<CardContent
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                border: `1px solid ${theme.palette.grey['A300']}`,
                                                overflow: 'hidden',
                                                borderRadius: 2,
                                                height: {xs: "30vh", md: "40.3rem"},
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>

                                            <Stack spacing={1} alignItems={"center"}>
                                                <TuneRoundedIcon/>
                                                <Typography fontSize={11}
                                                            textAlign={"center"}>{t('consultationIP.noActiveFile')}</Typography>
                                                <Typography fontSize={10} textAlign={"center"}
                                                            style={{opacity: 0.5}}>{t('consultationIP.configure')}</Typography>
                                                <Button size={"small"} onClick={() => {
                                                    router.replace("/dashboard/settings/patient-file-templates")
                                                }}></Button>
                                            </Stack>
                                        </CardContent>
                                    )}
                                </motion.div>
                                <motion.div initial={false}
                                            animate={{
                                                width: isMobile ? "100%" : getExamSize()
                                            }}>
                                    <ConsultationDetailCard
                                        {...{
                                            changes,
                                            setChanges,
                                            app_uuid,
                                            exam: sheetExam,
                                            hasDataHistory,
                                            seeHistory,
                                            closed: closeExam,
                                            setCloseExam,
                                            isClose,
                                            agenda,
                                            trigger: triggerAppointmentEdit
                                        }}
                                        handleClosePanel={(v: boolean) => setCloseExam(v)}

                                    />
                                </motion.div>
                            </AnimatePresence>
                        </Stack>
*/}
                    </TabPanel>
                    <TabPanel padding={1} value={selectedTab} index={"documents"}>
                        <DocumentsTab
                            {...{
                                medical_professional_uuid,
                                agenda,
                                urlMedicalEntitySuffix,
                                selectedDialog,
                                app_uuid,
                                showDoc,
                                router,
                                t
                            }}></DocumentsTab>
                    </TabPanel>
                    <TabPanel padding={1} value={selectedTab} index={"medical_procedures"}>
                        <FeesTab {...{
                            acts,
                            setActs,
                            mpActs,
                            status: sheet?.status,
                            urlMedicalEntitySuffix,
                            agenda: agenda?.uuid,
                            app_uuid,
                            total,
                            setTotal,
                            devise,
                            t
                        }}/>
                    </TabPanel>
                </Box>

                <DrawerBottom
                    handleClose={() => setFilterDrawer(false)}
                    open={filterdrawer}
                    title={null}>
                    <ConsultationFilter/>
                </DrawerBottom>

                <Stack
                    direction={{md: "row", xs: "column"}}
                    position="fixed"
                    sx={{right: 10, bottom: 70, zIndex: 999}}
                    spacing={2}>
                    {pendingDocuments?.map((item: any) => (
                        <React.Fragment key={item.id}>
                            <PendingDocumentCard
                                data={item}
                                t={t}
                                onClick={() => {
                                    openDialogue(item);
                                }}
                                closeDocument={(v: number) =>
                                    setPendingDocuments(
                                        pendingDocuments.filter((card: any) => card.id !== v)
                                    )
                                }
                            />
                        </React.Fragment>
                    ))}
                </Stack>

                <Drawer
                    anchor={"right"}
                    open={openAddDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "add", open: false}));
                    }}>
                    <Box height={"100%"}>
                        <CustomStepper
                            {...{currentStepper, t}}
                            modal={"consultation"}
                            OnTabsChange={handleStepperChange}
                            OnSubmitStepper={submitStepper}
                            OnCustomAction={handleTableActions}
                            stepperData={EventStepper}
                            scroll
                            minWidth={726}/>
                    </Box>
                </Drawer>

                <Drawer
                    anchor={"right"}
                    open={openChat}
                    dir={direction}
                    sx={{
                        "& .MuiPaper-root": {
                            width: {xs: "100%", sm: "40%"}
                        }
                    }}
                    onClose={() => {
                        setOpenChat(false)
                    }}>
                    <ChatDiscussionDialog data={{
                        session, app_uuid, setOpenChat, patient: {...patient, uuid: sheet?.patient},
                        setInfo, setOpenDialog, router, setState, mutateDoc
                    }}/>
                </Drawer>

            </HistoryAppointementContainer>}

            <Box pt={8}>
                <SubFooter>
                    <Stack
                        width={1}
                        spacing={{xs: 1, md: 0}}
                        padding={{xs: 1, md: 0}}
                        direction={{xs: "column", md: "row"}}
                        alignItems="flex-end"
                        justifyContent={
                            selectedTab === "medical_procedures" ? "space-between" : "flex-end"
                        }>
                        {selectedTab === "medical_procedures" && (
                            <Stack direction="row" alignItems={"center"}>
                                <Typography variant="subtitle1">
                                    <span>{t("total")} : </span>
                                </Typography>
                                <Typography fontWeight={600} variant="h6" ml={1} mr={1}>
                                    {isNaN(total) ? "-" : total} {devise}
                                </Typography>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}>
                                    <span>|</span>
                                    <Button
                                        variant="text-black"
                                        onClick={(event) => {

                                            let type = "";
                                            if (!(patient?.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                                                type = patient?.gender === "F" ? "Mme " : patient?.gender === "U" ? "" : "Mr "

                                            event.stopPropagation();
                                            setInfo("document_detail");
                                            setState({
                                                type: "fees",
                                                name: "Honoraire",
                                                info: acts.filter(act => act.selected),
                                                createdAt: moment().format("DD/MM/YYYY"),
                                                patient: `${type} ${patient?.firstName} ${patient?.lastName}`,
                                            });
                                            setOpenDialog(true);

                                        }}
                                        startIcon={<IconUrl path="ic-imprime"/>}>
                                        {t("consultationIP.print")}
                                    </Button>
                                </Stack>
                            </Stack>
                        )}

                        {sheet?.status !== 5 && <LoadingButton
                            disabled={loading}
                            loading={loading}
                            loadingPosition={"start"}
                            onClick={end}
                            color={"error"}
                            className="btn-action"
                            startIcon={<IconUrl path="ic-check"/>}
                            variant="contained"
                            sx={{".react-svg": {mr: 1}}}>
                            {t("end_of_consultation")}
                        </LoadingButton>}
                    </Stack>
                </SubFooter>
            </Box>

            <Dialog
                action={"patient_observation_history"}
                open={openHistoryDialog}
                data={{patient_uuid: sheet?.patient, t}}
                size={"sm"}
                direction={"ltr"}
                title={t("consultationIP.patient_observation_history")}
                dialogClose={() => setOpenHistoryDialog(false)}
                onClose={() => setOpenHistoryDialog(false)}
                icon={true}
            />

            {info && (
                <Dialog
                    {...{
                        direction,
                        sx: {
                            minHeight: 300,
                        },
                    }}
                    action={info}
                    open={openDialog}
                    data={{
                        state,
                        app_uuid,
                        agenda: agenda?.uuid,
                        patient: {
                            uuid: sheet?.patient,
                            ...patient
                        },
                        setState,
                        setDialog,
                        setOpenDialog,
                        t,
                        changes,
                        transactions, setTransactions,
                        total, setTotal,
                        restAmount, setRestAmount,
                        meeting,
                        setMeeting,
                        checkedNext,
                        setCheckedNext,
                    }}
                    size={"lg"}
                    color={
                        info === "secretary_consultation_alert" && theme.palette.error.main
                    }
                    {...(info === "secretary_consultation_alert" && {
                        sx: {px: {xs: 2, sm: 3}}
                    })}
                    {...(info === "document_detail" && {
                        sx: {p: 0},
                    })}
                    title={t(info === "document_detail" ? "doc_detail_title" : info)}
                    {...((info === "document_detail" || info === "end_consultation") && {
                        onClose: handleCloseDialog,
                    })}
                    {...(info !== "secretary_consultation_alert" && {dialogClose: handleCloseDialog})}
                    {...(actions && {
                        actionDialog: <DialogAction/>,
                    })}
                    {...(info === 'write_certif' && {
                        actionDialog: (
                            <Stack sx={{width: "100%"}} direction={"row"} justifyContent={"flex-end"}>
                                <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveCertif}
                                    disabled={info.includes("medical_prescription") && state.length === 0}
                                    startIcon={<SaveRoundedIcon/>}>
                                    {t("save")}
                                </Button>
                            </Stack>
                        )
                    })}
                />
            )}

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}>
                <PatientDetail
                    {...{isAddAppointment, mutate: mutatePatient}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}
                    patientId={tableState.patientId}
                />
            </Drawer>

            {isViewerOpen.length > 0 && (
                <ImageViewer
                    src={[isViewerOpen, isViewerOpen]}
                    currentIndex={0}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(6, 150, 214,0.5)",
                    }}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                />
            )}


            <MobileContainer>
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
                    variant="filter"
                    onClick={() => setFilterDrawer(true)}
                    sx={{
                        position: "fixed",
                        bottom: 100,
                        transform: "translateX(-50%)",
                        left: "50%",
                        zIndex: 999,

                    }}>
                    {t("filter.title")}{" "}(0)
                </Button>
            </MobileContainer>


            <Fab sx={{
                position: "fixed",
                bottom: 76,
                right: 30
            }}
                 onClick={() => {
                     setOpenChat(true)
                 }}
                 color={"primary"}
                 aria-label="edit">
                <SmartToyOutlinedIcon/>
            </Fab>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "consultation",
                "menu",
                "common",
                "agenda",
                "payment",
                "patient",
            ])),
        },
    };
};
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default ConsultationInProgress;

ConsultationInProgress.auth = true;

ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
