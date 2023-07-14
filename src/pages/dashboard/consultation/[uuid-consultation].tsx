import React, {ReactElement, useEffect, useRef, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {pdfjs} from "react-pdf";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {
    Box,
    Button,
    CardContent,
    DialogActions,
    Drawer,
    Grid,
    LinearProgress,
    Stack,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useSession} from "next-auth/react";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {sendRequest, useWidgetModels} from "@lib/hooks/rest";
import {agendaSelector, openDrawer, setStepperIndex} from "@features/calendar";
import {LoadingScreen} from "@features/loadingScreen";
import {
    ConsultationIPToolbar,
    consultationSelector,
    SetAnalyses,
    SetAppointement,
    SetMI,
    SetMutation,
    SetMutationDoc,
    SetPatient,
    SetPatientAntecedents
} from "@features/toolbar";
import AppointHistoryContainerStyled
    from "@features/appointHistoryContainer/components/overrides/appointHistoryContainerStyle";
import IconUrl from "@themes/urlIcon";
import {SubHeader} from "@features/subHeader";
import {LoadingButton} from "@mui/lab";
import {
    ConsultationDetailCard,
    PatientHistoryNoDataCard,
    PendingDocumentCard,
    resetTimer,
    timerSelector
} from "@features/card";
import {alpha} from "@mui/material/styles";
import {Dialog, DialogProps, PatientDetail} from "@features/dialog";
import HistoryAppointementContainer from "@features/card/components/historyAppointementContainer";
import {DocumentsTab, EventType, FeesTab, HistoryTab, Instruction, TabPanel, TimeSchedule} from "@features/tabPanel";
import {WidgetForm} from "@features/widget";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import moment from "moment/moment";
import {SubFooter} from "@features/subFooter";
import {DrawerBottom} from "@features/drawerBottom";
import {ConsultationFilter} from "@features/leftActionBar";
import {CustomStepper} from "@features/customStepper";
import {onOpenPatientDrawer, tableActionSelector} from "@features/table";
import ImageViewer from "react-simple-image-viewer";
import {appLockSelector} from "@features/appLock";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseIcon from "@mui/icons-material/Close";
import useSWRMutation from "swr/mutation";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function ConsultationInProgress() {

    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {t, ready} = useTranslation("consultation");
    const {config: agenda, openAddDrawer, currentStepper} = useAppSelector(agendaSelector);

    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {models, modelsMutate} = useWidgetModels({filter: ""})

    useLeavePageConfirm(() => {
        setLoading(true);
        mutateSheetData().then(() => setLoading(true));
        modelsMutate();
    });
    const leaveDialog = useRef(false);

    //***** SELECTORS ****//
    const {
        mutate: mutateOnGoing,
        medicalEntityHasUser,
        medicalProfessionalData
    } = useAppSelector(dashLayoutSelector);
    const {isActive, event} = useAppSelector(timerSelector);
    const {selectedDialog, exam} = useAppSelector(consultationSelector);
    const {direction} = useAppSelector(configSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {tableState} = useAppSelector(tableActionSelector);
    const {drawer} = useAppSelector((state: { dialog: DialogProps }) => state.dialog);

    //***** VARS ****//
    const {data: user} = session as Session;
    const medical_professional_uuid = medicalProfessionalData && medicalProfessionalData[0].medical_professional.uuid;
    const app_uuid = router.query["uuid-consultation"];
    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
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

    //***** TRIGGERS ****//
    const {trigger} = useRequestMutation(null, "consultation/end");
    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);

    //***** STATES ****//
    const [secretary, setSecretary] = useState("");
    const [previousData, setPreviousData] = useState(null);
    const [end, setEnd] = useState(false);
    const [actions, setActions] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<AppointmentDataModel>();
    const [patient, setPatient] = useState<PatientModel>();
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [documents, setDocuments] = useState([]);
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
    const [loading, setLoading] = useState<boolean>(true);
    const [requestLoad, setRequestLoad] = useState<boolean>(false);
    const [isHistory, setIsHistory] = useState(false);
    const [value, setValue] = useState<string>("consultation_form");
    const [dialog, setDialog] = useState<string>("");
    const [info, setInfo] = useState<null | string>("");
    const [pendingDocuments, setPendingDocuments] = useState<DocumentPreviewModel[]>([]);
    const [filterdrawer, setFilterDrawer] = useState(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [state, setState] = useState<any>();
    const [isViewerOpen, setIsViewerOpen] = useState<string>("");
    const [keys, setKeys] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [modelData, setModelData] = useState<any>(null);
    const [acts, setActs] = useState<AppointmentActModel[]>([]);
    const [isClose, setIsClose] = useState<boolean>(false);
    const [closeExam, setCloseExam] = useState<boolean>(false);
    const [notes, setNotes] = useState<any[]>([]);
    const [diagnostics, setDiagnostics] = useState<any[]>([]);
    const [openHistoryDialog, setOpenHistoryDialog] = useState<boolean>(false);
    const [stateHistory, setStateHistory] = useState<any[]>([]);
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [meeting, setMeeting] = useState<number>(15);
    const [checkedNext, setCheckedNext] = useState(false);
    const [total, setTotal] = useState<number>(0);

    //***** REQUEST ****//
    const {data: httpUsersResponse} = useRequest(medical_entity ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/users`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpPreviousResponse} = useRequest(medical_entity && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/previous/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpAppResponse, mutate} = useRequest(medical_professional_uuid && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/professionals/${medical_professional_uuid}/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const {data: httpSheetResponse, mutate: mutateSheetData} = useRequest(agenda && medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${app_uuid}/consultation-sheet/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`,},
    } : null);

    //***** PATIENT DATA ****//
    const {data: httpPatientAntecedents} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/antecedents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpPatientAnalyses} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/analysis/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpPatientMI} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/requested-imaging/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpDocumentResponse, mutate: mutateDoc} = useRequest(medical_professional_uuid && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/documents/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const sheet = (httpSheetResponse as HttpResponse)?.data;
    const sheetExam = sheet?.exam;
    const sheetModal = sheet?.modal;

    //***** USEEFFECTS ****//
    useEffect(() => {
        if (sheet) {
            const storageWidget = localStorage.getItem(`Modeldata${app_uuid}`);
            (!storageWidget && sheetModal) && localStorage.setItem(`Modeldata${app_uuid}`, JSON.stringify(sheetModal?.data));
            const ModelWidget = localStorage.getItem(`Model-${app_uuid}`);
            setSelectedModel(ModelWidget ? JSON.parse(ModelWidget) : sheetModal);
        }
    }, [dispatch, sheet, app_uuid]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpUsersResponse && (httpUsersResponse as HttpResponse).data.length > 0) {
            setSecretary((httpUsersResponse as HttpResponse).data[0]?.uuid);
        }
    }, [httpUsersResponse]);

    useEffect(() => {
        if (httpPreviousResponse) {
            const data = (httpPreviousResponse as HttpResponse).data;
            if (data)
                setPreviousData(data);
        }
    }, [httpPreviousResponse]);

    useEffect(() => {
        if (httpAppResponse) {
            setAppointment((httpAppResponse as HttpResponse)?.data);
            setLoading(false);
        }
    }, [httpAppResponse]);

    useEffect(() => {
        if (httpDocumentResponse) {
            const data = (httpDocumentResponse as HttpResponse).data;
            setDocuments(data);
            changes.map((change) => {
                const item = data.filter(
                    (doc: { documentType: string }) => doc.documentType === change.name
                );
                change.checked = item.length > 0;
                setChanges([...changes]);
            });
        }
    }, [httpDocumentResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (event && event.publicId !== app_uuid && isActive) {
            setIsHistory(true)
        } else setIsHistory(false)
    }, [event, isActive, appointment]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpPatientAnalyses) {
            dispatch(SetAnalyses((httpPatientAnalyses as HttpResponse).data));
        }
    }, [dispatch, httpPatientAnalyses])

    useEffect(() => {
        if (httpPatientMI) {
            dispatch(SetMI((httpPatientMI as HttpResponse).data));
        }
    }, [dispatch, httpPatientMI])

    useEffect(() => {
        if (httpPatientAntecedents) {
            dispatch(SetPatientAntecedents((httpPatientAntecedents as HttpResponse).data));
        }
    }, [dispatch, httpPatientAntecedents])

    useEffect(() => {
        medicalEntityHasUser && patient && trigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/consultation-sheet/history/${router.locale}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then((r: any) => {
            const res = r?.data.data;
            let dates: string[] = [];
            let keys: string[] = [];

            Object.keys(res).forEach(key => {
                keys.push(key);
                Object.keys(res[key].data).forEach(date => {
                    if (dates.indexOf(date) === -1) dates.push(date);
                })
            })
            setModelData(res);
            setDates(dates);
            setKeys(keys)
        });
    }, [patient]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (appointment && medical_professional_uuid) {

            //Patient Data
            setPatient(appointment.patient);
            dispatch(SetPatient(appointment.patient));
            dispatch(SetAppointement(appointment));
            dispatch(SetMutation(mutate));
            dispatch(SetMutationDoc(mutateDoc));

            // Exam history
            let noteHistories: any[] = []
            let diagnosticHistories: any[] = []
            appointment.latestAppointments.map((app: any) => {
                const note = app.appointment.appointmentData.find((appdata: any) => appdata.name === "notes")
                const diagnostics = app.appointment.appointmentData.find((appdata: any) => appdata.name === "diagnostics")
                if (note && note.value !== '') {
                    noteHistories.push({data: app.appointment.dayDate, value: note.value})
                }
                if (diagnostics && diagnostics.value !== '') {
                    diagnosticHistories.push({data: app.appointment.dayDate, value: diagnostics.value})
                }
            })
            setNotes(noteHistories);
            setDiagnostics(diagnosticHistories);

            //Acts
            let _acts: AppointmentActModel[] = [];
            _acts = [{
                act: {name: appointment.type.name},
                fees: appointment.type.price,
                isTopAct: false,
                qte: 1,
                selected: !appointment.type.isFree,
                uuid: "consultation_type"
            }]

            medicalProfessionalData[0].acts.forEach(act => _acts.push({...act, selected: false, qte: 1}));

            appointment.acts && appointment.acts.forEach(act => {
                const act_index = _acts.findIndex(_act => _act.uuid === act.act_uuid)
                if (act_index > -1) {
                    _acts[act_index] = {
                        ..._acts[act_index],
                        selected: true,
                        qte: act.qte ? act.qte : 1,
                        fees: act.price
                    }
                } else {
                    _acts.push({
                        act: {name: act.name},
                        fees: act.price,
                        isTopAct: false,
                        qte: act.qte ? act.qte : 1,
                        selected: true,
                        uuid: act.act_uuid
                    })
                }
            })
            const local_acts = localStorage.getItem(`consultation-acts-${app_uuid}`)
                ? JSON.parse(localStorage.getItem(`consultation-acts-${app_uuid}`) as string)
                : [];

            setActs(local_acts.length > 0 ? local_acts : _acts);

            setLoading(false)
        }
    }, [appointment]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        mutate();
    }, [medicalProfessionalData])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const _acts: { act_uuid: string; name: string; qte: number; price: number; }[] = [];
        if (end) {
            setRequestLoad(true);
            acts.filter(act => act.selected && act.uuid !== "consultation_type").forEach(act => {
                _acts.push({
                    act_uuid: act.uuid,
                    name: act.act.name,
                    qte: act.qte,
                    price: act.fees,
                });
            })
            const app_type = acts.find(act => act.uuid === 'consultation_type')
            let isFree = true;
            let consultationFees = 0;

            if (app_type) {
                isFree = !app_type?.selected;
                consultationFees = app_type?.fees
            }

            const form = new FormData();
            form.append("acts", JSON.stringify(_acts));
            form.append("modal_uuid", selectedModel?.default_modal.uuid);
            form.append(
                "modal_data",
                localStorage.getItem("Modeldata" + app_uuid) as string
            );
            form.append("notes", exam.notes);
            form.append("diagnostic", exam.diagnosis);
            form.append("disease", exam.disease.toString());
            form.append("treatment", exam.treatment ? exam.treatment : "");
            form.append("consultation_reason", exam.motif.toString());
            form.append("fees", total.toString());
            if (!isFree)
                form.append("consultation_fees", consultationFees.toString());
            form.append("status", "5");

            trigger({
                method: "PUT",
                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }).then(() => {
                if (appointment?.status !== 5) {
                    dispatch(resetTimer());
                    // refresh on going api
                    mutateOnGoing && mutateOnGoing();
                }
                mutate().then(() => {
                    leaveDialog.current = true;
                    if (!isHistory)
                        router.push("/dashboard/agenda").then(() => {
                            clearData();
                            setActions(false);
                            setEnd(false);
                            setRequestLoad(false);
                        });
                    else {
                        clearData();
                        setActions(false);
                        setEnd(false);
                        setRequestLoad(false);
                    }
                    appointment?.status !== 5 && sendNotification();
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end]);
    useEffect(() => {
        if (tableState.patientId)
            setPatientDetailDrawer(true);
    }, [tableState.patientId]);

    useEffect(() => {
        let _total = 0
        acts.filter(act => act.selected).forEach(act => _total += act.fees * act.qte)
        setTotal(_total);
    }, [acts])

    //***** FUNCTIONS ****//
    const closeHistory = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        saveConsultation();
        if (event) {
            const slugConsultation = `/dashboard/consultation/${event.publicId}`;
            router.replace(slugConsultation, slugConsultation, {locale: router.locale});
        }
    }
    const showDoc = (card: any) => {
        let type = "";
        if (appointment && !(appointment.patient.birthdate && moment().diff(moment(appointment.patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
            type = appointment && appointment.patient.gender === "F" ? "Mme " : appointment.patient.gender === "U" ? "" : "Mr "
        if (card.documentType === "medical-certificate") {
            setInfo("document_detail");
            setState({
                uuid: card.uuid,
                certifUuid: card.certificate[0].uuid,
                content: card.certificate[0].content,
                doctor: card.name,
                patient: `${type} ${
                    appointment?.patient.firstName
                } ${appointment?.patient.lastName}`,
                days: card.days,
                description: card.description,
                title: card.title,
                createdAt: card.createdAt,
                detectedType: card.type,
                name: "certif",
                type: "write_certif",
                mutate: mutateDoc,
                mutateDetails: mutate
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
                mutateDetails: mutate
            });
            setOpenDialog(true);
        }
    };
    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);
    const getWidgetSize = () => {
        return isClose ? 1 : closeExam ? 11 : 5
    }
    const getExamSize = () => {
        return isClose ? 11 : closeExam ? 1 : 7;
    }
    const seeHistory = () => {
        setOpenHistoryDialog(true);
        setStateHistory(notes)
    }
    const seeHistoryDiagnostic = () => {
        setOpenHistoryDialog(true);
        setStateHistory(diagnostics)
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
    };
    const saveConsultation = () => {
        const btn = document.getElementsByClassName("sub-btn")[1];
        const examBtn = document.getElementsByClassName("sub-exam")[0];
        (btn as HTMLElement)?.click();
        (examBtn as HTMLElement)?.click();
        setEnd(true);
    };
    const endConsultation = () => {
        setInfo("secretary_consultation_alert");
        setOpenDialog(true);
        setActions(true);
    };
    const closeImageViewer = () => {
        setIsViewerOpen("");
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
        setActions(false);
    };
    const clearData = () => {
        localStorage.removeItem(`Modeldata${app_uuid}`);
        localStorage.removeItem(`Model-${app_uuid}`);
        localStorage.removeItem(`consultation-data-${app_uuid}`);
        localStorage.removeItem(`instruction-data-${app_uuid}`);
        localStorage.removeItem(`consultation-fees`);
        localStorage.removeItem(`consultation-acts-${app_uuid}`);
    }
    const handleCloseDialogHistory = () => {
        setOpenHistoryDialog(false);
    };
    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    };
    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        } else {
            mutate();
        }
    };
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
    };
    const leave = () => {
        clearData();
        updateAppointmentStatus({
            method: "PATCH",
            data: {
                status: "11"
            },
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/status/${router.locale}`
        } as any).then(() => {
            router.push("/dashboard/agenda").then(() => {
                dispatch(resetTimer());
                setActions(false);
                // refresh on going api
                mutateOnGoing && mutateOnGoing();
            });
        });
    };
    const DialogAction = () => {
        return (
            <DialogActions style={{justifyContent: "space-between", width: "100%"}}>
                <LoadingButton
                    loading={requestLoad || loading}
                    loadingPosition="start"
                    variant="text"
                    color={"black"}
                    onClick={leave}
                    startIcon={<LogoutRoundedIcon/>}>
                    <Typography sx={{display: {xs: "none", md: "flex"}}}>
                        {t("withoutSave")}
                    </Typography>
                </LoadingButton>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        variant="text-black"
                        onClick={handleCloseDialog}
                        startIcon={<CloseIcon/>}>
                        <Typography sx={{display: {xs: "none", md: "flex"}}}>
                            {t("cancel")}
                        </Typography>
                    </Button>
                    <LoadingButton
                        loading={requestLoad || loading}
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
    };
    const sendNotification = () => {
        if (secretary.length > 0 && patient) {
            const localInstr = localStorage.getItem(`instruction-data-${app_uuid}`);
            const form = new FormData();
            form.append("action", "end_consultation");
            form.append(
                "content",
                JSON.stringify({
                    fees: total,
                    instruction: localInstr ? localInstr : "",
                    control: checkedNext,
                    edited: false,
                    nextApp: meeting ? meeting : "0",
                    appUuid: app_uuid,
                    dayDate: appointment?.day_date,
                    patient: {
                        uuid: patient.uuid,
                        email: patient.email,
                        birthdate: patient.birthdate,
                        firstName: patient.firstName,
                        lastName: patient.lastName,
                        gender: patient.gender,
                        account: patient.account,
                        address: patient.address,
                        contact: patient.contact,
                        hasAccount: patient.hasAccount,
                        idCard: patient.idCard,
                    },
                })
            );
            trigger({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/professionals/${secretary}/notification/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
        }
    };
    const editAct = (row: any, from: any) => {
        const act_index = acts.findIndex(act => act.uuid === row.uuid)
        if (from === 'check')
            acts[act_index].selected = !acts[act_index].selected

        if (from === 'change')
            acts[act_index] = row

        setActs([...acts])
        localStorage.setItem(`consultation-acts-${app_uuid}`, JSON.stringify([...acts]));
    }

    return (
        <>
            {loading && <LinearProgress color={"warning"}/>}
            {isHistory && <AppointHistoryContainerStyled> <Toolbar>
                <Stack spacing={1.5} direction="row" alignItems="center" paddingTop={1} justifyContent={"space-between"}
                       width={"100%"}>
                    <Stack spacing={1.5} direction="row" alignItems="center">
                        <IconUrl path={'ic-speaker'}/>
                        <Typography>{t('consultationIP.updateHistory')} {appointment?.day_date}.</Typography>
                    </Stack>
                    <LoadingButton
                        disabled={requestLoad}
                        loading={requestLoad}
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
            <SubHeader sx={isHistory && {
                backgroundColor: alpha(theme.palette.warning.main, 0.2),
                borderLeft: `2px solid${theme.palette.warning.main}`,
                borderRight: `2px solid${theme.palette.warning.main}`,
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
            }}>
                {appointment && (
                    <ConsultationIPToolbar
                        appuuid={app_uuid}
                        mutate={mutate}
                        mutateDoc={mutateDoc}
                        pendingDocuments={pendingDocuments}
                        setPendingDocuments={setPendingDocuments}
                        dialog={dialog}
                        info={info}
                        setInfo={setInfo}
                        changes={changes}
                        setChanges={setChanges}
                        setPatientShow={() => setFilterDrawer(!drawer)}
                        appointment={appointment}
                        patient={patient}
                        selectedModel={selectedModel}
                        selectedDialog={selectedDialog}
                        documents={documents}
                        agenda={agenda?.uuid}
                        setDialog={setDialog}
                        endingDocuments={setPendingDocuments}
                        selectedTab={value}
                        setSelectedTab={setValue}
                    />
                )}
            </SubHeader>
            {<HistoryAppointementContainer {...{isHistory, loading, closeHistory, appointment, t, requestLoad}}>
                <Box style={{backgroundColor: !isHistory ? theme.palette.info.main : ""}}
                     className="container container-scroll">
                    {loading && (
                        <Stack spacing={2} padding={2}>
                            {Array.from({length: 3}).map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <PatientHistoryNoDataCard/>
                                </React.Fragment>
                            ))}
                        </Stack>
                    )}
                    <TabPanel padding={1} value={value} index={"patient_history"}>
                        {appointment && patient && <HistoryTab
                            {...{
                                patient,
                                dispatch,
                                appointment,
                                t,
                                session,
                                acts,
                                direction,
                                mutateDoc,
                                mutate,
                                medical_entity,
                                setOpenDialog,
                                showDoc,
                                setState,
                                setInfo,
                                router,
                                dates, keys, modelData,
                                setIsViewerOpen,
                                locale: router.locale,
                                setSelectedTab: setValue,
                                appuuid: app_uuid
                            }}
                        />}
                    </TabPanel>
                    <TabPanel padding={1} value={value} index={"consultation_form"}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={getWidgetSize()}>
                                {!loading && models && Array.isArray(models) && models.length > 0 && selectedModel && acts.length > 0 && (
                                    <WidgetForm
                                        {...{
                                            models,
                                            changes,
                                            setChanges,
                                            isClose,
                                            acts,
                                            setActs,
                                            previousData
                                        }}
                                        modal={selectedModel}
                                        data={sheetModal?.data}
                                        appuuid={app_uuid}
                                        closed={closeExam}
                                        setSM={setSelectedModel}
                                        handleClosePanel={(v: boolean) => setIsClose(v)}></WidgetForm>
                                )}
                                {!loading && !selectedModel && (<CardContent
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            border: '1px solid #E0E0E0',
                                            overflow: 'hidden',
                                            borderRadius: 2,
                                            height: {xs: "30vh", md: "48.9rem"},
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
                            </Grid>
                            <Grid item xs={12}
                                  md={getExamSize()}
                                  style={{paddingLeft: isClose ? 0 : 10}}>
                                <ConsultationDetailCard
                                    {...{
                                        changes,
                                        setChanges,
                                        uuind: app_uuid,
                                        agenda: agenda?.uuid,
                                        exam: sheetExam,
                                        appointment,
                                        mutateDoc,
                                        medical_entity,
                                        session,
                                        notes,
                                        diagnostics,
                                        seeHistory,
                                        seeHistoryDiagnostic,
                                        router,
                                        closed: closeExam,
                                        setCloseExam,
                                        isClose
                                    }}
                                    handleClosePanel={(v: boolean) => setCloseExam(v)}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel padding={1} value={value} index={"documents"}>
                        <DocumentsTab
                            {...{
                                documents,
                                setIsViewerOpen,
                                setInfo,
                                setState,
                                showDoc,
                                selectedDialog,
                                patient,
                                mutateDoc,
                                router,
                                session,
                                trigger,
                                setOpenDialog,
                                t
                            }}></DocumentsTab>
                    </TabPanel>
                    <TabPanel padding={1} value={value} index={"medical_procedures"}>
                        <FeesTab {...{
                            acts,
                            editAct,
                            setTotal,
                            router,
                            devise,
                            t
                        }}/>
                    </TabPanel>

                    <Stack
                        direction={{md: "row", xs: "column"}}
                        position="fixed"
                        sx={{right: 10, bottom: 10, zIndex: 999}}
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
                    <Box pt={8}>
                        {!lock && !isHistory && (
                            <SubFooter>
                                <Stack
                                    width={1}
                                    spacing={{xs: 1, md: 0}}
                                    padding={{xs: 1, md: 0}}
                                    direction={{xs: "column", md: "row"}}
                                    alignItems="flex-end"
                                    justifyContent={
                                        value === "medical_procedures" ? "space-between" : "flex-end"
                                    }>
                                    {value === "medical_procedures" && (
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
                                    <LoadingButton
                                        disabled={loading}
                                        loading={requestLoad || loading}
                                        loadingPosition={"start"}
                                        onClick={
                                            appointment?.status === 5
                                                ? saveConsultation
                                                : endConsultation
                                        }
                                        color={appointment?.status === 5 ? "warning" : "error"}
                                        className="btn-action"
                                        startIcon={appointment?.status === 5 ? <IconUrl path="ic-edit"/> :
                                            <IconUrl path="ic-check"/>}
                                        variant="contained"
                                        sx={{".react-svg": {mr: 1}}}>
                                        {appointment?.status == 5
                                            ? t("edit_of_consultation")
                                            : t("end_of_consultation")}
                                    </LoadingButton>
                                </Stack>
                            </SubFooter>
                        )}
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

                    <DrawerBottom
                        handleClose={() => setFilterDrawer(false)}
                        open={filterdrawer}
                        title={null}>
                        <ConsultationFilter/>
                    </DrawerBottom>

                    <Dialog
                        action={"patient_observation_history"}
                        open={openHistoryDialog}
                        data={{stateHistory, setStateHistory, setDialog, t}}
                        size={"sm"}
                        direction={"ltr"}
                        title={t("consultationIP.patient_observation_history")}
                        dialogClose={handleCloseDialogHistory}
                        onClose={handleCloseDialogHistory}
                        icon={true}
                    />
                </Box>
            </HistoryAppointementContainer>}
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
                        setState,
                        setDialog,
                        setOpenDialog,
                        t,
                        changes,
                        total,
                        meeting,
                        setMeeting,
                        checkedNext,
                        setCheckedNext,
                    }}
                    size={"lg"}
                    color={
                        info === "secretary_consultation_alert" && theme.palette.error.main
                    }
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
                    {...{isAddAppointment, mutate}}
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
