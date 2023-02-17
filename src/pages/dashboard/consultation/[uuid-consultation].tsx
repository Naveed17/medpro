import React, {memo, ReactElement, useEffect, useRef, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {pdfjs} from "react-pdf";
import {configSelector, DashLayout} from "@features/base";
import {
    ConsultationIPToolbar,
    consultationSelector,
    SetMutation,
    SetMutationDoc,
    SetAppointement,
    SetPatient,
} from "@features/toolbar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {onOpenPatientDrawer, tableActionSelector} from "@features/table";
import {Dialog, DialogProps, PatientDetail} from "@features/dialog";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {
    SWRNoValidateConfig,
    TriggerWithoutValidation,
} from "@app/swr/swrProvider";
import {useTranslation} from "next-i18next";
import {
    Box,
    Button,
    DialogActions,
    Drawer,
    Grid,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import {
    ConsultationDetailCard,
    PatientHistoryNoDataCard,
    PendingDocumentCard,
    setTimer,
} from "@features/card";
import {CustomStepper} from "@features/customStepper";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {DrawerBottom} from "@features/drawerBottom";
import {ConsultationFilter} from "@features/leftActionBar";
import {
    agendaSelector,
    openDrawer,
    setStepperIndex,
} from "@features/calendar";
import {uniqueId} from "lodash";
import {
    DocumentsTab,
    EventType,
    FeesTab,
    HistoryTab,
    Instruction,
    TabPanel,
    TimeSchedule,
} from "@features/tabPanel";
import CloseIcon from "@mui/icons-material/Close";
import ImageViewer from "react-simple-image-viewer";
import {Widget} from "@features/widget";
import {SubHeader} from "@features/subHeader";
import {SubFooter} from "@features/subFooter";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {LoadingScreen} from "@features/loadingScreen";
import {appLockSelector} from "@features/appLock";
import moment from "moment";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";
import {useLeavePageConfirm} from "@app/hooks/useLeavePageConfirm";
import {LoadingButton} from "@mui/lab";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const WidgetForm: any = memo(
    ({src, ...props}: any) => {
        const {modal, data, setSM, models, appuuid, changes, setChanges} = props;
        return (
            <Widget
                {...{modal, data, models, appuuid, changes, setChanges}}
                setModal={setSM}></Widget>
        );
    },
    // NEVER UPDATE
    () => true
);
WidgetForm.displayName = "widget-form";

function ConsultationInProgress() {
    const theme = useTheme();
    const router = useRouter();
    const {data: session} = useSession();
    useLeavePageConfirm(() => {
        setLoading(true);
        mutateSheetData().then(() => setLoading(true));
        if (!leaveDialog.current) {
            /*if (!window.confirm(`message: ${uuind}`)) {
                      throw "Route Canceled";
                  } else {
                      // localStorage.removeItem(`consultation-data-${uuind}`);
                  }*/
        }
    });

    const leaveDialog = useRef(false);
    const [filterdrawer, setFilterDrawer] = useState(false);
    const [value, setValue] = useState<string>("consultation_form");
    const [acts, setActs] = useState<any>("");
    const [total, setTotal] = useState<number>(0);
    const [documents, setDocuments] = useState([]);
    const [models, setModels] = useState<ModalModel[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openActDialog, setOpenActDialog] = useState<boolean>(false);
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [appointement, setAppointement] = useState<any>();
    const [patientDetailDrawer, setPatientDetailDrawer] =
        useState<boolean>(false);
    const [patient, setPatient] = useState<any>();
    const [mpUuid, setMpUuid] = useState("");
    const [dialog, setDialog] = useState<string>("");
    const [selectedAct, setSelectedAct] = useState<any[]>(
        localStorage.getItem("consultation-acts")
            ? JSON.parse(localStorage.getItem("consultation-acts") as string)
            : []
    );
    const [selectedUuid, setSelectedUuid] = useState<string[]>([]);
    const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
    const [isViewerOpen, setIsViewerOpen] = useState<string>("");
    const [actions, setActions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);
    const [isAddAppointment, setAddAppointment] = useState<boolean>(false);
    const [secretary, setSecretary] = useState("");
    const [stateAct, setstateAct] = useState({
        uuid: "",
        isTopAct: true,
        fees: 0,
        act: {
            uuid: "",
            name: "",
            description: "",
            weight: 0,
        },
    });
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [consultationFees, setConsultationFees] = useState(0);
    const [free, setFree] = useState(false);
    const {direction} = useAppSelector(configSelector);
    const {exam} = useAppSelector(consultationSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {tableState} = useAppSelector(tableActionSelector);
    const [meeting, setMeeting] = useState<number>(15);
    const [checkedNext, setCheckedNext] = useState(false);

    const {drawer} = useAppSelector(
        (state: { dialog: DialogProps }) => state.dialog
    );
    const {openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const [end, setEnd] = useState(false);
    const {selectedDialog} = useAppSelector(consultationSelector);
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
    const {lock} = useAppSelector(appLockSelector);

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

    const {trigger} = useRequestMutation(null, "/endConsultation");

    const uuind = router.query["uuid-consultation"];
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse)
        ?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const {trigger: updateStatusTrigger} = useRequestMutation(
        null,
        "/agenda/update/appointment/status",
        TriggerWithoutValidation
    );

    const updateAppointmentStatus = (
        appointmentUUid: string,
        status: string,
        params?: any
    ) => {
        const form = new FormData();
        form.append("status", status);
        if (params) {
            Object.entries(params).map((param: any) => {
                form.append(param[0], param[1]);
            });
        }
        return updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`},
        });
    };

    const {data: httpMPResponse} = useRequest(
        medical_entity
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null
    );

    const {data: httpModelResponse} = useRequest(
        medical_entity
            ? {
                method: "GET",
                url: "/api/medical-entity/" + medical_entity.uuid + "/modals",
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null,
        SWRNoValidateConfig
    );

    const {data: httpUsersResponse} = useRequest(
        medical_entity
            ? {
                method: "GET",
                url: "/api/medical-entity/" + medical_entity.uuid + "/users",
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null,
        SWRNoValidateConfig
    );

    const {data: httpAppResponse, mutate} = useRequest(
        mpUuid && agenda
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null
    );

    const {data: httpSheetResponse, mutate: mutateSheetData} = useRequest(
        mpUuid && agenda
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/consultation-sheet/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null
    );

    const {data: httpDocumentResponse, mutate: mutateDoc} = useRequest(
        mpUuid && agenda
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/documents/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null,
        SWRNoValidateConfig
    );

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [httpDocumentResponse]);

    useEffect(() => {
        if (httpUsersResponse) {
            if ((httpUsersResponse as HttpResponse).data.length > 0)
                setSecretary((httpUsersResponse as HttpResponse).data[0]?.uuid);
        }
    }, [httpUsersResponse]);

    useEffect(() => {
        if (httpModelResponse) {
            setModels((httpModelResponse as HttpResponse).data);
        }
    }, [httpModelResponse]);

    useEffect(() => {
        setAppointement((httpAppResponse as HttpResponse)?.data);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, [httpAppResponse]);

    useEffect(() => {
        setInfo(null);
        setOpenDialog(true);
    }, [selectedDialog, setInfo, setOpenDialog]);

    useEffect(() => {
        if (appointement) {
            setPatient(appointement.patient);
            setFree(appointement.type.code === 3);
            if (appointement.type.code !== 3) setTotal(consultationFees);
            if (appointement.consultation_fees) {
                setConsultationFees(Number(appointement.consultation_fees));
            }

            dispatch(SetPatient(appointement.patient));
            dispatch(SetAppointement(appointement));
            dispatch(SetMutation(mutate));
            dispatch(SetMutationDoc(mutateDoc));

            if (appointement.acts) {
                let sAct: any[] = [];
                appointement.acts.map(
                    (act: { act_uuid: string; price: any; qte: any }) => {
                        const actDetect = acts.find(
                            (a: { uuid: string }) => a.uuid === act.act_uuid
                        ) as any;

                        if (actDetect) {
                            actDetect.fees = act.price;
                            actDetect.qte = act.qte;
                            sAct.push(actDetect);
                        }
                    }
                );
                setSelectedAct(sAct);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointement, dispatch, mutate]);

    useEffect(() => {
        if (httpMPResponse) {
            const mpRes = (httpMPResponse as HttpResponse)?.data[0];
            setConsultationFees(Number(mpRes.consultation_fees));
            setMpUuid(mpRes.medical_professional.uuid);
            const acts = [...mpRes.acts];
            const localActes = localStorage.getItem("consultation-acts")
                ? JSON.parse(localStorage.getItem("consultation-acts") as string)
                : [];
            if (localActes) {
                setSelectedAct([...localActes]);
            }
            const updatedActs = acts.map((act) => {
                const localAct = localActes.find(
                    (selAct: any) => selAct.uuid === act.uuid
                );
                return localAct ? localAct : act;
            });
            setActs(updatedActs);
        }
    }, [httpMPResponse]);

    useEffect(() => {
        let fees = free ? 0 : Number(consultationFees);
        let uuids: string[] = [];
        selectedAct.map((act) => {
            uuids.push(act.uuid);
            act.qte
                ? (fees += parseInt(act.fees) * parseInt(act.qte))
                : (fees += parseInt(act.fees));
        });
        setTotal(fees);
        setSelectedUuid(uuids);
    }, [selectedAct, appointement, consultationFees, free]);

    useEffect(() => {
        if (tableState.patientId) {
            //setopen(true);
            setPatientDetailDrawer(true);
        }
    }, [tableState.patientId]);

    useEffect(() => {
        const acts: { act_uuid: any; name: string; qte: any; price: any }[] = [];
        if (end) {
            setLoadingReq(true);
            if ([5, 4].includes(appointement?.status)) {
                selectedAct.map(
                    (act: { uuid: any; act: { name: string }; qte: any; fees: any }) => {
                        acts.push({
                            act_uuid: act.uuid,
                            name: act.act.name,
                            qte: act.qte,
                            price: act.fees,
                        });
                    }
                );
                const form = new FormData();
                form.append("acts", JSON.stringify(acts));
                form.append("modal_uuid", selectedModel.default_modal.uuid);
                form.append(
                    "modal_data",
                    localStorage.getItem("Modeldata" + uuind) as string
                );
                form.append("notes", exam.notes);
                form.append("diagnostic", exam.diagnosis);
                form.append("treatment", exam.treatment ? exam.treatment : "");
                form.append("consultation_reason", exam.motif);
                form.append("fees", total.toString());
                form.append("consultation_fees", consultationFees.toString());
                form.append("status", "5");

                trigger({
                    method: "PUT",
                    url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/data/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then(() => {
                    console.log("end consultation");
                    appointement?.status !== 5 && dispatch(setTimer({isActive: false}));
                    mutate().then(() => {
                        leaveDialog.current = true;
                        router.push("/dashboard/agenda").then(() => {
                            clearData();
                            setActions(false);
                            setEnd(false);
                            setLoadingReq(false);
                        });
                        sendNotification();
                    });
                });
            } else {
                router.push("/dashboard/agenda").then(() => {
                    setActions(false);
                    setEnd(false);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end]);

    const sheet = (httpSheetResponse as HttpResponse)?.data;
    const sheetExam = sheet?.exam;
    const sheetModal = sheet?.modal;

    useEffect(() => {
        if (sheet) {
            const storageWidget = localStorage.getItem(`Modeldata${uuind}`);
            (!storageWidget && sheetModal) && localStorage.setItem(`Modeldata${uuind}`, JSON.stringify(sheetModal?.data));
            const ModelWidget = localStorage.getItem(`Model-${uuind}`);
            setSelectedModel(ModelWidget ? JSON.parse(ModelWidget) : sheetModal);
        }
    }, [dispatch, sheet, uuind]); // eslint-disable-line react-hooks/exhaustive-deps

    const sendNotification = () => {
        if (secretary.length > 0) {
            const localInstr = localStorage.getItem(`instruction-data-${uuind}`);
            const form = new FormData();
            form.append("action", "end_consultation");
            form.append(
                "content",
                JSON.stringify({
                    fees: total,
                    instruction: localInstr ? localInstr : "",
                    control: checkedNext,
                    nextApp: meeting ? meeting : "0",
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
                url: `/api/medical-entity/${medical_entity.uuid}/professionals/${secretary}/notification/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
        }
    };

    const editAct = (row: any, from: any) => {
        if (from === "change") {
            const index = selectedAct.findIndex((act) => act.uuid === row.uuid);
            selectedAct[index] = row;
            setSelectedAct([...selectedAct]);
            localStorage.setItem(
                "consultation-acts",
                JSON.stringify([...selectedAct])
            );
        } else if (from === "changeQte") {
            const index = selectedAct.findIndex((act) => act.uuid === row.uuid);
            selectedAct[index] = row;
            setSelectedAct([...selectedAct]);
            localStorage.setItem(
                "consultation-acts",
                JSON.stringify([...selectedAct])
            );
        } else if (from === "checked") {
        } else {
            if (from) {
                const index = selectedAct.findIndex((act) => act.uuid === row.uuid);
                setSelectedAct([
                    ...selectedAct.slice(0, index),
                    ...selectedAct.slice(index + 1, selectedAct.length),
                ]);
                localStorage.setItem(
                    "consultation-acts",
                    JSON.stringify([
                        ...selectedAct.slice(0, index),
                        ...selectedAct.slice(index + 1, selectedAct.length),
                    ])
                );
            } else {
                row.qte = 1;
                setSelectedAct([...selectedAct, row]);
                localStorage.setItem(
                    "consultation-acts",
                    JSON.stringify([...selectedAct, row])
                );
            }
        }
    };
    /*    const onDocumentLoadSuccess = ({numPages}: any) => {
              setNumPages(numPages);
          };*/
    const openDialogue = (id: number) => {
        switch (id) {
            case 1:
                setDialog("balance_sheet_request");
                break;
            case 2:
                setDialog("draw_up_an_order");
                break;
        }
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

    const handleCloseDialogAct = () => {
        setOpenActDialog(false);
    };

    const handleSaveDialog = () => {
        setOpenDialog(false);
        setActs([
            ...acts,
            {
                ...stateAct,
                uuid: uniqueId(),
            },
        ]);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
        setActions(false);
    };

    const clearData = () => {
        localStorage.removeItem(`Modeldata${uuind}`);
        localStorage.removeItem(`Model-${uuind}`);
        localStorage.removeItem(`consultation-data-${uuind}`);
        localStorage.removeItem(`instruction-data-${uuind}`);
        localStorage.removeItem(`consultation-fees`);
        localStorage.removeItem(`consultation-acts`);
    }

    const leave = () => {
        clearData();
        updateAppointmentStatus(uuind as string, "11").then(() => {
            router.push("/dashboard/agenda").then(() => {
                dispatch(setTimer({isActive: false}));
                setActions(false);
            });
        });
    };

    const closeImageViewer = () => {
        setIsViewerOpen("");
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

    const DialogAction = () => {
        return (
            <DialogActions style={{justifyContent: "space-between", width: "100%"}}>
                <Button
                    variant="text-black"
                    onClick={leave}
                    startIcon={<LogoutRoundedIcon/>}>
                    <Typography sx={{display: {xs: "none", md: "flex"}}}>
                        {t("withoutSave")}
                    </Typography>
                </Button>
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
                        loading={loadingReq}
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

    const showDoc = (card: any) => {
        if (card.documentType === "medical-certificate") {
            setInfo("document_detail");
            setState({
                uuid: card.uuid,
                content: card.certificate[0].content,
                doctor: card.name,
                patient: `${appointement.patient.gender === "F" ? "Mme " : "Mr "} ${
                    appointement.patient.firstName
                } ${appointement.patient.lastName}`,
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
          info = card.requested_Analyses.length > 0 ? card.requested_Analyses[0]?.analyses: [];
          break;
        case "requested-medical-imaging":
          info = card.medical_imaging[0]["medical-imaging"];
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
        detectedType:card.type,
        uuidDoc: uuidDoc,
        patient: `${patient.gender === "F" ? "Mme " : "Mr "} ${
          patient.firstName
        } ${patient.lastName}`,
        mutate: mutateDoc,
        mutateDetails: mutate
      });
      setOpenDialog(true);
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
    const {t, ready} = useTranslation("consultation");

    if (!ready)
        return (
            <LoadingScreen
                error
                button={"loading-error-404-reset"}
                text={"loading-error"}
            />
        );

    return (
        <>
            <SubHeader>
                {appointement && (
                    <ConsultationIPToolbar
                        appuuid={uuind}
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
                        appointement={appointement}
                        patient={patient}
                        selectedAct={selectedAct}
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

            <Box className="container container-scroll">
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
                    <HistoryTab
                        {...{
                            patient,
                            dispatch,
                            appointement,
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
                            setIsViewerOpen,
                        }}
                        appuuid={uuind}
                        locale={router.locale}
                    />
                </TabPanel>
                {/*
                <TabPanel padding={1} value={value} index={"mediktor_report"}>
                    <Box
                        sx={{
                            ".react-pdf__Page__canvas": {
                                mx: "auto",
                            },
                        }}>
                        <Document
                            loading={<></>}
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                            ))}
                        </Document>
                    </Box>
                </TabPanel>
*/}
                <TabPanel padding={1} value={value} index={"consultation_form"}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={5}>
                            {!loading && models && selectedModel && (
                                <WidgetForm
                                    {...{models, changes, setChanges}}
                                    modal={selectedModel}
                                    data={sheetModal.data}
                                    appuuid={uuind}
                                    setSM={setSelectedModel}></WidgetForm>
                            )}
                        </Grid>
                        <Grid item xs={12} md={7} style={{paddingLeft: 10}}>
                            <ConsultationDetailCard
                                {...{
                                    changes,
                                    setChanges,
                                    uuind,
                                    agenda: agenda?.uuid,
                                    exam: sheetExam,
                                    mutateDoc,
                                    medical_entity,
                                    session,
                                    router,
                                }}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel padding={1} value={value} index={"documents"}>
                    <DocumentsTab
                        documents={documents}
                        setIsViewerOpen={setIsViewerOpen}
                        setInfo={setInfo}
                        setState={setState}
                        showDoc={showDoc}
                        selectedDialog={selectedDialog}
                        patient={patient}
                        mutateDoc={mutateDoc}
                        router={router}
                        session={session}
                        trigger={trigger}
                        setOpenDialog={setOpenDialog}
                        t={t}></DocumentsTab>
                </TabPanel>
                <TabPanel padding={1} value={value} index={"medical_procedures"}>
                    {!loading && (
                        <FeesTab
                            {...{
                                acts,
                                selectedUuid,
                                selectedAct,
                                consultationFees,
                                setConsultationFees,
                                free,
                                setFree,
                                editAct,
                                setTotal,
                                t,
                            }}></FeesTab>
                    )}
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
                                    openDialogue(item.id);
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
                    {!lock && (
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
                                            {total} {devise}
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            display={{xs: "none", md: "block"}}
                                            spacing={2}>
                                            <span>|</span>
                                            <Button
                                                variant="text-black"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setInfo("document_detail");
                                                    setState({
                                                        type: "fees",
                                                        name: "note_fees",
                                                        info: selectedAct,
                                                        createdAt: moment().format("DD/MM/YYYY"),
                                                        consultationFees: free ? 0 : consultationFees,
                                                        patient: `${
                                                            patient.gender === "F" ? "Mme " : "Mr "
                                                        } ${patient.firstName} ${patient.lastName}`,
                                                    });
                                                    setOpenDialog(true);
                                                }}
                                                startIcon={<IconUrl path="ic-imprime"/>}>
                                                {t("consultationIP.print")}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                )}
                                <Button
                                    onClick={
                                        appointement?.status === 5
                                            ? saveConsultation
                                            : endConsultation
                                    }
                                    color={"error"}
                                    variant="contained"
                                    sx={{".react-svg": {mr: 1}}}>
                                    <Icon path="ic-check"/>
                                    {appointement?.status == 5
                                        ? t("edit_of_consultation")
                                        : t("end_of_consultation")}
                                </Button>
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
                                    openDialogue(item.id);
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
                            minWidth={726}
                        />
                    </Box>
                </Drawer>

                <DrawerBottom
                    handleClose={() => setFilterDrawer(false)}
                    open={filterdrawer}
                    title={null}>
                    <ConsultationFilter/>
                </DrawerBottom>

                <Dialog
                    action={"add_act"}
                    open={openActDialog}
                    data={{stateAct, setstateAct, setDialog, t}}
                    size={"sm"}
                    direction={"ltr"}
                    title={t("consultationIP.add_a_new_act")}
                    dialogClose={handleCloseDialogAct}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialogAct} startIcon={<CloseIcon/>}>
                                {t("cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveDialog}
                                startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                                {t("save")}
                            </Button>
                        </DialogActions>
                    }
                />
            </Box>

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
                        uuind,
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
                    dialogClose={handleCloseDialog}
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

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, [
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
