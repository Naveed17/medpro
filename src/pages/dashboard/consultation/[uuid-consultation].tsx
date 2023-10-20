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
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
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
import {useMedicalEntitySuffix, useMutateOnGoing} from "@lib/hooks";
import {useRouter} from "next/router";
import {tabs} from "@features/toolbar/components/appToolbar/config";
import {alpha, Theme} from "@mui/material/styles";
import {AppToolbar} from "@features/toolbar/components/appToolbar";
import {MyCardStyled, MyHeaderCardStyled, SubHeader} from "@features/subHeader";
import HistoryAppointementContainer from "@features/card/components/historyAppointementContainer";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {WidgetForm} from "@features/widget";
import {
    appointmentSelector,
    DocumentsTab,
    EventType,
    FeesTab,
    HistoryTab,
    Instruction,
    resetAppointment,
    TabPanel,
    TimeSchedule
} from "@features/tabPanel";
import AppointHistoryContainerStyled
    from "@features/appointHistoryContainer/components/overrides/appointHistoryContainerStyle";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import {SubFooter} from "@features/subFooter";
import {consultationSelector, SetPatient, SetSelectedDialog} from "@features/toolbar";
import {Dialog, DialogProps, handleDrawerAction, PatientDetail} from "@features/dialog";
import moment from "moment/moment";
import CloseIcon from "@mui/icons-material/Close";
import {useSession} from "next-auth/react";
import {DrawerBottom} from "@features/drawerBottom";
import {cashBoxSelector, ConsultationFilter} from "@features/leftActionBar";
import {CustomStepper} from "@features/customStepper";
import ImageViewer from "react-simple-image-viewer";
import {onOpenPatientDrawer, tableActionSelector} from "@features/table";
import ChatDiscussionDialog from "@features/dialog/components/chatDiscussion/chatDiscussion";
import {DefaultCountry, TransactionStatus, TransactionType} from "@lib/constants";
import {Session} from "next-auth";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useWidgetModels} from "@lib/hooks/rest";
import {batch} from "react-redux";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddIcon from '@mui/icons-material/Add';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {DragDropContext, Draggable as DraggableDnd, Droppable} from "react-beautiful-dnd";
import Draggable from "react-draggable";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {ModelDot} from "@features/modelDot";
import {DocumentPreview} from "@features/tabPanel/components/consultationTabs/documentPreview";
import DialogTitle from "@mui/material/DialogTitle";
import {SwitchPrescriptionUI} from "@features/buttons";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";

//%%%%%% %%%%%%%

const grid = 5;
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
    const {
        type,
        motif,
        duration,
        recurringDates
    } = useAppSelector(appointmentSelector);

    const {data: user} = session as Session;
    const medical_professional_uuid = medicalProfessionalData && medicalProfessionalData.medical_professional.uuid;
    const app_uuid = router.query["uuid-consultation"];
    const general_information = (user as UserDataResponse).general_information;

    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("appointment/edit");
    const {trigger: triggerTransactionCreate} = useRequestQueryMutation("transaction/create");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/status/update");
    const {trigger: triggerDocumentChat} = useRequestQueryMutation("/chat/document");
    const {trigger: triggerDrugsUpdate} = useRequestQueryMutation("/drugs/update");

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
    const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
    const [patient, setPatient] = useState<PatientPreview>();
    const [total, setTotal] = useState(-1);
    const [state, setState] = useState<any>();
    const [openHistoryDialog, setOpenHistoryDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<null | string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openSecDialog, setOpenSecDialog] = useState<boolean>(false);
    const [meeting, setMeeting] = useState<number>(15);
    const [checkedNext, setCheckedNext] = useState(false);
    const [dialog, setDialog] = useState<string>("");
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [filterdrawer, setFilterDrawer] = useState(false);
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [isViewerOpen, setIsViewerOpen] = useState<string>("");
    const [transactions, setTransactions] = useState(null);
    const [restAmount, setRestAmount] = useState(0);
    const [addFinishAppointment, setAddFinishAppointment] = useState<boolean>(false);
    const [showDocument, setShowDocument] = useState(false);
    const [nbDoc, setNbDoc] = useState(0);
    const [cards, setCards] = useState([[
        {id: 'item-1', content: 'widget', expanded: false, config: false, icon: "ic-edit-file-pen"},
        {id: 'item-2', content: 'history', expanded: false, icon: "ic-historique"}
    ], [{id: 'item-3', content: 'exam', expanded: true, icon: "ic-edit-file-pen"}]]);

    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [checkUp, setCheckUp] = useState<AnalysisModel[]>([]);
    const [imagery, setImagery] = useState<AnalysisModel[]>([]);

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

    const sheet = (httpSheetResponse as HttpResponse)?.data
    const sheetExam = sheet?.exam;
    const sheetModal = sheet?.modal;
    const hasDataHistory = sheet?.hasDataHistory
    const tabsData = [...sheet?.hasHistory ? [{
        label: "patient_history",
        value: "patient history"
    }] : [], ...tabs]

    const {data: httpPatientPreview, mutate: mutatePatient} = useRequestQuery(sheet?.patient && medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${sheet?.patient}/preview/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpPreviousResponse} = useRequestQuery(sheet?.hasHistory && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/previous/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {
        data: httpDocumentResponse,
        mutate: mutateDoc
    } = useRequestQuery(medical_professional_uuid && agenda && nbDoc > 0 ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/documents/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const documents = httpDocumentResponse ? (httpDocumentResponse as HttpResponse).data : []

    // ********** Requests ********** \\
    const changeModel = (prop: ModalModel, ind: number, index: number) => {
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
                tel: patient?.contact && patient?.contact.length > 0 ? patient?.contact[0] : "",
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
                cin: patient?.idCard ? patient?.idCard : "",
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
                    startIcon={<IconUrl path="ic-temps"/>}>
                    <Typography sx={{display: {xs: "none", md: "flex"}}}>
                        {t("later_on")}
                    </Typography>
                </LoadingButton>
                <Stack direction={"row"} spacing={2} sx={{
                    ".MuiButton-startIcon": {
                        mr: {xs: 0, md: 1}
                    }
                }}>
                    <Button
                        variant="text-black"
                        onClick={() => setOpenSecDialog(false)}
                        startIcon={<CloseIcon/>}>
                        <Typography sx={{display: {xs: "none", md: "flex"}}}>
                            {t("cancel")}
                        </Typography>
                    </Button>
                    <Button
                        disabled={checkedNext}
                        onClick={() => setAddFinishAppointment(!addFinishAppointment)}
                        startIcon={addFinishAppointment ? <KeyboardBackspaceIcon/> : <AddIcon/>}>
                        <Typography sx={{display: {xs: "none", md: "flex"}}}>
                            {t(addFinishAppointment ? "back" : "add_&_finish_appointment")}
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
                        <Typography sx={{display: {xs: "none", md: "flex"}}}>
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
        setLoading(true);
        const localInstr = localStorage.getItem(`instruction-data-${app_uuid}`);
        const restAmount = getTransactionAmountPayed();
        const form = new FormData();
        form.append("status", "5");
        form.append("action", "end_consultation");
        form.append("root", "agenda");
        form.append("content", JSON.stringify({
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
                uuid: patient?.uuid,
                email: patient?.email,
                birthdate: patient?.birthdate,
                firstName: patient?.firstName,
                lastName: patient?.lastName,
                gender: patient?.gender,
            },
        }));
        if (recurringDates.length > 0) {
            form.append('dates', JSON.stringify(recurringDates.map(recurringDate => ({
                "start_date": recurringDate.date,
                "start_time": recurringDate.time
            }))));
            motif && form.append('consultation_reasons', motif.toString());
            form.append('duration', duration as string);
            form.append('type', type);
        }
        triggerAppointmentEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                batch(() => {
                    dispatch(resetTimer());
                    dispatch(resetAppointment());
                    dispatch(openDrawer({type: "view", open: false}));
                });
                checkTransactions();
                clearData();
                mutateOnGoing();
                router.push("/dashboard/agenda");
            },
            onSettled: () => setLoading(false)
        });
    }

    const end = () => {
        setOpenSecDialog(true);
    }

    const handleSaveCertif = () => {

        const form = new FormData();

        form.append("content", state.content);
        form.append("title", state.title);
        form.append("header", state.documentHeader);

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

    const handleSwitchUI = () => {
        //close the current dialog
        setOpenDialog(false);
        setInfo(null);
        // switch UI and open dialog
        setInfo(getPrescriptionUI());
        setAnchorEl(null);
        setOpenDialog(true);
    }

    const handleSaveDialog = () => {
        const form = new FormData();
        let method = "";
        let url = ""
        switch (info) {
            case "medical_prescription":
            case "medical_prescription_cycle":
                form.append("globalNote", "");
                form.append("isOtherProfessional", "false");
                form.append("drugs", JSON.stringify(state));
                method = "POST"
                url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/prescriptions/${router.locale}`;
                if (selectedDialog && selectedDialog.action.includes("medical_prescription")) {
                    method = "PUT"
                    url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/prescriptions/${selectedDialog.uuid}/${router.locale}`;
                }

                triggerDrugsUpdate({
                    method: method,
                    url: url,
                    data: form
                }, {
                    onSuccess: (r: any) => {
                        mutateDoc();
                        mutatePatient();
                        setInfo("document_detail");
                        const res = r.data.data;
                        let type = "";
                        if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                            type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "

                        setState({
                            uri: res[1],
                            name: "prescription",
                            type: "prescription",
                            info: res[0].prescription_has_drugs,
                            uuid: res[0].uuid,
                            uuidDoc: res[0].uuid,
                            createdAt: moment().format('DD/MM/YYYY'),
                            description: "",
                            patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`
                        });
                        setOpenDialog(true);
                        setPrescription([]);

                        let pdoc = [...pendingDocuments];
                        pdoc = pdoc.filter((obj) => obj.id !== 2);
                        setPendingDocuments(pdoc);
                    }
                });
                break;
            case "balance_sheet_request":
                form.append("analyses", JSON.stringify(state));
                method = "POST"
                url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/requested-analysis/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "balance_sheet_request") {
                    method = "PUT"
                    url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/requested-analysis/${selectedDialog.uuid}/edit/${router.locale}`;
                }

                triggerDrugsUpdate({
                    method: method,
                    url: url,
                    data: form
                }, {
                    onSuccess: (r: any) => {
                        mutateDoc();
                        mutatePatient();
                        //mutatePatientAnalyses();
                        setCheckUp([]);
                        setInfo("document_detail");
                        const res = r.data.data;
                        let type = "";
                        if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                            type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "

                        setState({
                            uuid: res[0].uuid,
                            uri: res[1],
                            name: "requested-analysis",
                            type: "requested-analysis",
                            createdAt: moment().format('DD/MM/YYYY'),
                            description: "",
                            info: res[0].analyses,
                            patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`
                        });
                        setOpenDialog(true);

                        let pdoc = [...pendingDocuments];
                        pdoc = pdoc.filter((obj) => obj.id !== 1);
                        setPendingDocuments(pdoc);
                    }
                });
                break;
            case "medical_imagery":
                form.append("medical-imaging", JSON.stringify(state));

                method = "POST"
                url = `${urlMedicalEntitySuffix}/appointment/${app_uuid}/medical-imaging/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "medical_imagery") {
                    method = "PUT"
                    url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/medical-imaging/${selectedDialog.uuid}/edit/${router.locale}`;
                }

                triggerDrugsUpdate({
                    method,
                    url,
                    data: form
                }, {
                    onSuccess: (r: any) => {
                        mutateDoc();
                        mutatePatient();
                        setImagery([]);
                        setInfo("document_detail");
                        const res = r.data.data;
                        let type = "";
                        if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                            type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "
                        setState({
                            uuid: res[0].uuid,
                            uri: res[1],
                            name: "requested-medical-imaging",
                            type: "requested-medical-imaging",
                            info: res[0]["medical-imaging"],
                            createdAt: moment().format('DD/MM/YYYY'),
                            description: "",
                            patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`,
                            mutate: mutateDoc
                        });
                        setOpenDialog(true);

                        let pdoc = [...pendingDocuments];
                        pdoc = pdoc.filter((obj) => obj.id !== 1);
                        setPendingDocuments(pdoc);
                    }
                });
                break;
            case "add_a_document":
                //form.append("title", state.name);
                //form.append("description", state.description);
                state.files.map((file: { file: string | Blob; name: string | undefined; type: string | Blob; }) => {
                    form.append(`files[${file.type}][]`, file?.file as any, file?.name?.slice(0, 20));
                });

                triggerDrugsUpdate({
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/documents/${router.locale}`,
                    data: form
                }, {
                    onSuccess: () => mutateDoc()
                });
                setOpenDialog(true);
                break;
            case "write_certif":
                form.append("content", state.content);
                form.append("title", state.title);
                form.append("header", state.documentHeader);

                method = "POST"
                url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/certificates/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "write_certif") {
                    method = "PUT"
                    url = `${urlMedicalEntitySuffix}/appointments/${app_uuid}/certificates/${selectedDialog.state.certifUuid}/${router.locale}`;
                }

                triggerDrugsUpdate({
                    method: method,
                    url: url,
                    data: form
                }, {
                    onSuccess: () => {
                        mutateDoc();
                        setInfo("document_detail");
                        setState({
                            content: state.content,
                            doctor: state.name,
                            patient: state.patient,
                            birthdate: patient?.birthdate,
                            cin: patient?.idCard,
                            createdAt: moment().format('DD/MM/YYYY'),
                            description: "",
                            title: state.title,
                            days: state.days,
                            name: "certif",
                            type: "write_certif",
                            documentHeader: state.documentHeader
                        });
                        setOpenDialog(true);
                    }
                });
                break;
        }

        setSelectedTab("documents");
        mutateSheetData()
        setOpenDialog(false);
        setInfo(null);
        dispatch(SetSelectedDialog(null))
    };

    const handleCloseDialog = () => {
        let pdoc = [...pendingDocuments];
        switch (info) {
            case "medical_prescription":
            case "medical_prescription_cycle":
                if (state.length > 0) {
                    setPrescription(state)
                    if (pdoc.findIndex((pdc) => pdc.id === 2) === -1)
                        pdoc.push({
                            id: 2,
                            name: "requestedPrescription",
                            status: "in_progress",
                            icon: "ic-traitement",
                            state
                        });
                } else {
                    pdoc = pdoc.filter((obj) => obj.id !== 2);
                }
                break;
            case "balance_sheet_request":
                setCheckUp(state);
                if (state.length > 0) {
                    if (pdoc.findIndex((pdc) => pdc.id === 1) === -1)
                        pdoc.push({
                            id: 1,
                            name: "requestedAnalyses",
                            status: "in_progress",
                            icon: "ic-analyse",
                            state
                        });
                } else {
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                }
                break;
            case "medical_imagery":
                setImagery(state);
                break;
        }
        setOpenDialog(false);
        setInfo(null);
        setPendingDocuments(pdoc);
        dispatch(SetSelectedDialog(null))
    };

    const showPreview = (action: string) => {
        switch (action) {
            case "prescription":
                setInfo(getPrescriptionUI());
                setState(prescription);
                break;
            case "requested-analysis":
                setInfo("balance_sheet_request");
                setState(checkUp);
                break;
            case "requested-medical-imaging":
                setInfo("medical_imagery");
                setState(imagery);
                break;
            case "medical-certificate":
                setInfo("write_certif");
                setState({
                    name: `${general_information.firstName} ${general_information.lastName}`,
                    days: '....',
                    content: '',
                    title: 'Rapport médical',
                    patient: `${patient?.firstName} ${patient?.lastName}`,
                    brithdate: `${patient?.birthdate}`,
                    cin: patient?.idCard ? `${patient?.idCard}` : ""
                });
                break;
        }
        setOpenDialog(true);
    }

    const addInfo = (name: string) => {
        setSelectedTab("consultation_form")
        setOpenSecDialog(false);
        let _cards = [...cards];
        let ind = 0;
        let index = 0
        cards.forEach((card, i) => card.forEach((c, j) => {
            if (c.content === name) {
                ind = i
                index = j
            }
        }))
        _cards[ind][index].expanded = true
        setCards([..._cards])
    }

    const showCheckedDoc = (name: string) => {
        showDoc(documents.filter((doc: MedicalDocuments) => doc.documentType === name)[0]);
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
            setCards(newState);
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
            medicalProfessionalData && medicalProfessionalData.acts.map(act => {
                _acts.push({qte: 1, selected: false, ...act})
            })
            setActs(_acts);
            setMPActs(_acts);

            let nb = 0;
            changes.map(change => {
                if (sheet && sheet[change.name]) {
                    change.checked = sheet[change.name] > 0;
                    nb += sheet[change.name]
                }
            })
            setNbDoc(nb);
            setChanges([...changes])

            if (hasDataHistory === false) {
                setCards([[
                    {id: 'item-1', content: 'widget', expanded: false, config: false, icon: "ic-edit-file-pen"}
                ], [{id: 'item-3', content: 'exam', expanded: true, icon: "ic-edit-file-pen"}]])
            }

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
                        {!isMobile &&
                            <Typography>{t('consultationIP.updateHistory')} <b>{sheet?.date}</b>.</Typography>}
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
                        setInfo,
                        setState,
                        setOpenDialog,
                        tabsData,
                        selectedDialog,
                        agenda,
                        app_uuid,
                        patient,
                        handleChangeTab,
                        isMobile,
                        changes,
                        anchorEl,
                        loading,
                        setAnchorEl,
                        dialog, setDialog,
                        setFilterDrawer,
                        nbDoc,
                        prescription, checkUp, imagery,
                        showDocument, setShowDocument
                    }}
                    setPatientShow={() => setFilterDrawer(!drawer)}
                />
            </SubHeader>}


            {<HistoryAppointementContainer {...{isHistory, loading}}>
                <Box style={{backgroundColor: !isHistory ? theme.palette.info.main : ""}}
                     id={"container-tab"}
                     className="container-scroll">
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
                        <Grid container spacing={0}>
                            <Grid item xs={showDocument ? 10 : 12}>
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
                                                            <DraggableDnd
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                //isDragDisabled={item.content === 'exam'}
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
                                                                                       document.activeElement && (document.activeElement as HTMLElement).blur();
                                                                                       let _cards = [...cards];
                                                                                       _cards[ind][index].expanded = !item.expanded
                                                                                       _cards[ind][index].config = false
                                                                                       setCards([..._cards])
                                                                                       mutateSheetData()
                                                                                   }}
                                                                                   alignItems={"center"}>
                                                                                {item.content === 'widget' && selectedModel ?
                                                                                    <MyHeaderCardStyled>
                                                                                        <Stack direction={"row"}
                                                                                               spacing={1}
                                                                                               alignItems={"center"}
                                                                                               border={"1px solid white"}
                                                                                               onClick={(e) => {
                                                                                                   e.stopPropagation();
                                                                                                   let _cards = [...cards];
                                                                                                   _cards[ind][index].config = !item.config
                                                                                                   _cards[ind][index].expanded = false
                                                                                                   setCards([..._cards])
                                                                                               }}
                                                                                               style={{
                                                                                                   padding: "3px 8px",
                                                                                                   borderRadius: 5
                                                                                               }}>
                                                                                            <ModelDot
                                                                                                color={selectedModel?.default_modal?.color}
                                                                                                selected={false}/>
                                                                                            <Typography
                                                                                                className={'card-title'}>{selectedModel?.default_modal.label}</Typography>
                                                                                            <IconUrl
                                                                                                className={"card-icon"}
                                                                                                path="ic-flesh-bas-y"/>
                                                                                        </Stack>

                                                                                    </MyHeaderCardStyled> :
                                                                                    <MyHeaderCardStyled>
                                                                                        <Icon className={'card-header'}
                                                                                              path={item.icon}/>
                                                                                        <Typography
                                                                                            className={'card-title'}>{item.content !== "widget" ? t(item.content) : ""}</Typography>
                                                                                    </MyHeaderCardStyled>}
                                                                                <IconButton className={"btn-header"}>
                                                                                    {item.expanded ?
                                                                                        <KeyboardArrowUpRoundedIcon/> :
                                                                                        <KeyboardArrowDownRoundedIcon/>}
                                                                                </IconButton>
                                                                            </Stack>
                                                                            <Collapse in={item.expanded} timeout="auto"
                                                                                      unmountOnExit>
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
                                                                                            mutateSheetData,
                                                                                            trigger: triggerAppointmentEdit
                                                                                        }}
                                                                                        handleClosePanel={(v: boolean) => setCloseExam(v)}

                                                                                    />}
                                                                                {item.content === 'history' && <div
                                                                                    id={"histo"}
                                                                                    style={{
                                                                                        padding: 10,
                                                                                        borderTop: "1px solid #DDD",
                                                                                        borderBottomRightRadius: 3,
                                                                                        borderBottomLeftRadius: 3,
                                                                                        maxHeight: "96.4vh",
                                                                                        overflowY: "auto",
                                                                                        backgroundColor: theme.palette.grey["A10"]
                                                                                    }}>
                                                                                    <HistoryTab
                                                                                        {...{
                                                                                            patient: {
                                                                                                uuid: sheet?.patient,
                                                                                                ...patient
                                                                                            },
                                                                                            dispatch,
                                                                                            mini: true,
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

                                                                            <Collapse in={item.config} timeout="auto"
                                                                                      unmountOnExit>
                                                                                <MenuList>
                                                                                    {(models as any[])?.map((item: any, idx: number) => (
                                                                                        <Box key={"widgt-x-" + idx}>
                                                                                            {item.isEnabled && (
                                                                                                <MenuItem
                                                                                                    key={`model-item-${idx}`}
                                                                                                    onClick={() => {
                                                                                                        changeModel(item, ind, index)
                                                                                                    }}>
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
                                                            </DraggableDnd>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        ))}
                                    </DragDropContext>
                                </div>
                            </Grid>
                            <Grid item xs={showDocument ? 2 : 0}>
                                {showDocument && <DocumentPreview {...{
                                    allDocs: changes.filter(ch => ch.index !== undefined && !ch.checked),
                                    documents,
                                    showDocument,
                                    showDoc,
                                    theme,
                                    showPreview,
                                    t,
                                }}/>
                                }
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel padding={1} value={selectedTab} index={"documents"}>
                        <DocumentsTab
                            {...{
                                documents,
                                mutateDoc,
                                mutateSheetData,
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
                                    {isNaN(total) || total < 0 ? "-" : total} {devise}
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
                            onClick={() => {
                                end();
                                setAddFinishAppointment(false);
                                setCheckedNext(false);
                            }}
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

            <Dialog
                {...{
                    direction,
                    sx: {
                        minHeight: 300,
                    },
                }}
                action={"secretary_consultation_alert"}
                title={t(`secretary_consultation_alert`)}
                onClose={() => setOpenSecDialog(false)}
                open={openSecDialog}
                data={{

                    app_uuid,
                    agenda: agenda?.uuid,
                    patient: {
                        uuid: sheet?.patient,
                        ...patient
                    },
                    t,
                    transactions, setTransactions,
                    total, setTotal,
                    setRestAmount,
                    addInfo,
                    changes,
                    meeting,
                    setMeeting,
                    checkedNext,
                    setCheckedNext,
                    addFinishAppointment,
                    showCheckedDoc,
                    showPreview
                }}
                size={addFinishAppointment ? "md" : "lg"}
                color={theme.palette.error.main}
                actionDialog={<DialogAction/>}
            />


            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{appuuid: app_uuid, patient, state, setState, t, setOpenDialog}}
                    size={["add_vaccin"].includes(info) ? "sm" : "xl"}
                    direction={"ltr"}
                    sx={{height: info === "insurance_document_print" ? 600 : 480}}
                    {...(info === "document_detail" && {
                        sx: {height: 480, p: 0},
                    })}
                    {...(info === "write_certif" && {enableFullScreen: true})}
                    title={t(`consultationIP.${info === "document_detail" ? "doc_detail_title" : info}`)}
                    {...(info === "document_detail" && {
                        onClose: handleCloseDialog,
                    })}
                    dialogClose={handleCloseDialog}
                    {...(["medical_prescription", "medical_prescription_cycle"].includes(info) && {
                        headerDialog: (<DialogTitle
                                sx={{
                                    backgroundColor: (theme: Theme) => theme.palette.primary.main,
                                    position: "relative",
                                }}
                                id="scroll-dialog-title">
                                <Stack direction={{xs: 'column', sm: 'row'}} justifyContent={"space-between"}
                                       alignItems={{xs: 'flex-start', sm: 'center'}}>
                                    {t(`consultationIP.${info}`)}
                                    <SwitchPrescriptionUI {...{t, keyPrefix: "consultationIP", handleSwitchUI}} />
                                </Stack>
                            </DialogTitle>
                        ),
                        sx: {
                            p: 1.5,
                            overflowX: 'hidden'
                        }

                    })}
                    {...(info === 'write_certif' && {
                        actionDialog: (
                            <Stack sx={{width: "100%"}} direction={"row"} justifyContent={"flex-end"}>
                                <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                    {t("consultationIP.cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveCertif}
                                    disabled={info.includes("medical_prescription") && state.length === 0}
                                    startIcon={<SaveRoundedIcon/>}>
                                    {t("consultationIP.save")}
                                </Button>
                            </Stack>
                        )
                    })}
                    actionDialog={
                        info ? (
                            <Stack sx={{width: "100%"}}
                                   direction={"row"}
                                   {...(info === "medical_prescription_cycle" && {
                                       direction: {xs: 'column', sm: 'row'},

                                   })}
                                   justifyContent={info === "medical_prescription_cycle" ? "space-between" : "flex-end"}>
                                {info === "medical_prescription_cycle" &&
                                    <Button sx={{alignSelf: 'flex-start'}} startIcon={<AddIcon/>} onClick={() => {
                                        dispatch(handleDrawerAction("addDrug"));
                                    }}>
                                        {t("consultationIP.add_drug")}
                                    </Button>}
                                <Stack direction={"row"} justifyContent={{xs: 'space-between', sm: 'flex-start'}}
                                       spacing={1.2}
                                       {...(info === "medical_prescription_cycle" && {
                                           mt: {xs: 1, md: 0}
                                       })}>
                                    <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                        {t("consultationIP.cancel")}
                                    </Button>
                                    {info !== "insurance_document_print" && <Button
                                        variant="contained"
                                        onClick={handleSaveDialog}
                                        disabled={info.includes("medical_prescription") && state.length === 0}
                                        startIcon={<SaveRoundedIcon/>}>
                                        {t("consultationIP.save")}
                                    </Button>}
                                </Stack>
                            </Stack>
                        ) : null
                    }
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

            <Draggable>
                <Fab sx={{
                    position: "fixed",
                    bottom: 76,
                    right: 30
                }}
                     size={"small"}
                     onClick={() => {
                         setOpenChat(true)
                     }}
                     color={"primary"}
                     aria-label="edit">
                    <IconUrl path={'ic-chatbot'}/>
                </Fab>
            </Draggable>
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
