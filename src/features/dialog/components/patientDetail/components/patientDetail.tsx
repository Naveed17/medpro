import {Backdrop, Box, Button, DialogActions, Divider, Drawer, Paper, Stack, Tab, Tabs} from "@mui/material";
import {consultationSelector, PatientDetailsToolbar, SetSelectedDialog} from "@features/toolbar";
import {onOpenPatientDrawer} from "@features/table";
import {PatientDetailsCard} from "@features/card";
import {
    addPatientSelector,
    DocumentsPanel,
    EventType,
    HistoryPanel,
    Instruction,
    NotesPanel,
    PersonalInfoPanel,
    resetAppointment,
    setAppointmentPatient,
    setOpenUploadDialog,
    TabPanel,
    TimeSchedule,
    TransactionPanel
} from "@features/tabPanel";
import {GroupTable} from "@features/groupTable";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {SpeedDial} from "@features/speedDial";
import {CustomStepper} from "@features/customStepper";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React, {SyntheticEvent, useContext, useEffect, useState} from "react";
import PatientDetailStyled from "./overrides/patientDetailStyled";
import {EventDef} from "@fullcalendar/core/internal";
import CloseIcon from "@mui/icons-material/Close";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {AppointmentDetail, Dialog, handleDrawerAction} from "@features/dialog";
import {LoadingButton} from "@mui/lab";
import {agendaSelector, openDrawer} from "@features/calendar";
import moment from "moment-timezone";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useSnackbar} from "notistack";
import {PatientFile} from "@features/files/components/patientFile";
import {getBirthdayFormat, useInvalidateQueries, useMedicalEntitySuffix, useMutateOnGoing} from "@lib/hooks";
import {useAntecedentTypes, useProfilePhoto, useSendNotification} from "@lib/hooks/rest";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";
import DialogTitle from "@mui/material/DialogTitle";
import {Theme} from "@mui/material/styles";
import {SwitchPrescriptionUI} from "@features/buttons";
import AddIcon from "@mui/icons-material/Add";
import {DefaultCountry} from "@lib/constants";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {LoadingScreen} from "@features/loadingScreen";
import {AbilityContext} from "@features/casl/can";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function PatientDetail({...props}) {
    const {
        patientId,
        isAddAppointment = false,
        currentStepper = 0,
        onCloseDialog,
        onConsultation = null,
        onConsultationStart = null,
        mutate: mutatePatientList,
        mutateAgenda
    } = props;

    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {allAntecedents} = useAntecedentTypes();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {trigger: mutateOnGoing} = useMutateOnGoing();
    const ability = useContext(AbilityContext);

    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {t: translate} = useTranslation("consultation");

    const {direction} = useAppSelector(configSelector);
    const {openUploadDialog} = useAppSelector(addPatientSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {
        config: agenda,
        sortedData: groupSortedData,
        openViewDrawer
    } = useAppSelector(agendaSelector);
    const {selectedDialog} = useAppSelector(consultationSelector);
    // state hook for tabs
    const [index, setIndex] = useState<number>(currentStepper);
    const [isAdd, setIsAdd] = useState<boolean>(isAddAppointment);
    const [openFabAdd, setOpenFabAdd] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [documentViewIndex, setDocumentViewIndex] = useState(0);
    const [documentConfig, setDocumentConfig] = useState({name: "", description: "", type: "analyse", files: []});
    const [stepperData, setStepperData] = useState([
        {
            title: "tabs.time-slot",
            children: EventType,
            disabled: false,
        },
        {
            title: "tabs.time-slot",
            children: TimeSchedule,
            disabled: false,
        },
        {
            title: "tabs.advice",
            children: Instruction,
            disabled: true,
        }
    ]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [antecedentsData, setAntecedentsData] = useState<any[] | null>(null);
    const [editable, setEditable] = useState({
        personalInfoCard: false,
        personalInsuranceCard: false,
        patientDetailContactCard: false
    });
    const [wallet, setWallet] = useState(0);
    const [rest, setRest] = useState(0);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;
    const {jti} = session?.user as any;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/status");
    const {trigger: triggerUploadDocuments} = useRequestQueryMutation("/patient/documents");
    const {trigger: triggerConsultationUpdate} = useRequestQueryMutation("consultation/data/update");
    const {trigger: triggerNotificationPush} = useSendNotification();

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {
        data: httpPatientDetailsResponse,
        mutate: mutatePatientDetails
    } = useRequestQuery(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/infos/${router.locale}`
    } : null);

    const patient = ((httpPatientDetailsResponse as HttpResponse)?.data as PatientModel) ?? null;

    const {data: httpPatientWallet, mutate: walletMutate} = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/wallet/${router.locale}`
    } : null);

    const {patientPhoto} = useProfilePhoto({patientId, hasPhoto: patient?.hasPhoto});

    const {
        data: httpAntecedentsResponse,
        mutate: mutateAntecedents
    } = useRequestQuery(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/antecedents/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const handleOpenFab = () => setOpenFabAdd(true);

    const handleCloseFab = () => setOpenFabAdd(false);

    const handleActionFab = (fabAction: any) => {
        setOpenFabAdd(false);
        switch (fabAction.action) {
            case "add-appointment" :
                dispatch(setAppointmentPatient(patient as any));
                setIsAdd(!isAdd)
                break;
            case "import-document":
                dispatch(setOpenUploadDialog(true));
                break;
        }
    }

    const closePatientDialog = () => {
        dispatch(openDrawer({type: "patient", open: false}));
        dispatch(onOpenPatientDrawer({patientId: "", patientAction: ""}));
        onCloseDialog(false);
    }
    // handle tab change
    const handleStepperIndexChange = (
        event: SyntheticEvent,
        newValue: number
    ) => {
        setIndex(newValue);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        dispatch(SetSelectedDialog(null));
    }

    const submitStepper = (index: number) => {
        const steps: any = stepperData.map((stepper) => ({...stepper}));
        if (stepperData.length !== index) {
            steps[index].disabled = false;
            setStepperData(steps);
        } else {
            setStepperData(steps.map((stepper: any) => ({...stepper, disabled: true})));
            mutatePatientDetails();
            mutatePatientList && mutatePatientList();
        }
    };

    const handleUploadDocuments = () => {
        const documentTabIndex = tabsContent.findIndex(tab => tab.title === "tabs.documents");
        setDocumentViewIndex(roles.includes('ROLE_SECRETARY') ? 0 : 1);
        index !== documentTabIndex && setIndex(documentTabIndex);
        setLoadingRequest(true);
        const params = new FormData();
        documentConfig.files.map((file: any) => {
            params.append(`document[${file.type}][]`, file.file, file.name);
        });
        medicalEntityHasUser && triggerUploadDocuments({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/documents/${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                const mutateUrl = `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/documents/${router.locale}`;
                invalidateQueries([mutateUrl]);
                triggerNotificationPush({
                    action: "push",
                    root: "all",
                    message: " ",
                    content: JSON.stringify({
                        mutate: mutateUrl,
                        fcm_session: jti
                    })
                });
                setLoadingRequest(false);
            }
        });
    }

    const handleSaveDialog = () => {
        const form = new FormData();
        switch (info) {
            case "medical_prescription":
            case "medical_prescription_cycle":
                form.append("globalNote", "");
                form.append("isOtherProfessional", "false");
                form.append("drugs", JSON.stringify(state));

                triggerConsultationUpdate({
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/appointments/${selectedDialog.appUuid}/prescriptions/${selectedDialog.uuid}/${router.locale}`,
                    data: form
                }, {
                    onSuccess: (result: any) => {
                        medicalEntityHasUser && invalidateQueries([
                            `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/appointments/history/${router.locale}`,
                            `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/documents/${router.locale}`]);
                        setOpenDialog(false);
                        setInfo("document_detail");
                        const res = result.data.data;
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
                            appUuid: selectedDialog.appUuid,
                            createdAt: moment().format('DD/MM/YYYY'),
                            description: "",
                            age: res[0].patient?.birthdate ? getBirthdayFormat({birthdate: res[0].patient.birthdate}, t) : "",
                            patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`
                        });
                        setOpenDialog(true);
                    }
                });
                break;
        }
    }

    const onOpenWaitingRoom = (event: EventDef) => {
        const todayEvents = groupSortedData.find(events => events.date === moment().format("DD-MM-YYYY"));
        const filteredEvents = todayEvents?.events.every((event: any) => !["ON_GOING", "WAITING_ROOM"].includes(event.status.key) ||
            (event.status.key === "FINISHED" && event.updatedAt.isBefore(moment(), 'year')));
        const params = new FormData();
        params.append("status", "3");
        params.append("is_first_appointment", filteredEvents?.toString() ?? "false");
        updateAppointmentStatus({
            method: "PATCH",
            data: params,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t(`alert.on-waiting-room`), {variant: "success"});
                // mutate ongoing api
                mutateOnGoing();
                // update pending notifications status
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/get/pending/${router.locale}`]);
                closePatientDialog();
            }
        });
    }

    const handleSwitchUI = () => {
        //close the current dialog
        setOpenDialog(false);
        setInfo(null);
        // switch UI and open dialog
        setInfo(getPrescriptionUI());
        setOpenDialog(true);
    }

    const tabsContent = [
        ...(ability.can('manage', 'patients', 'patients__patient__details__informations') ? [{
            title: "tabs.personal-info",
            children: <PersonalInfoPanel loading={!patient} {...{
                patient,
                mutatePatientDetails,
                mutatePatientList,
                antecedentsData,
                mutateAntecedents,
                mutateAgenda,
                editable,
                setEditable
            }} />
        }] : []),
        ...(ability.can('manage', 'patients', 'patients__patient__details__history') ? [{
            title: "tabs.history",
            children: <HistoryPanel {...{
                t,
                patient,
                closePatientDialog
            }} />
        }] : []),
        ...(ability.can('manage', 'patients', 'patients__patient__details__appointment') ? [{
            title: "tabs.appointment",
            children: <GroupTable from="patient" data={{patient, translate: t, closePatientDialog}}/>
        }] : []),
        ...(ability.can('manage', 'patients', 'patients__patient__details__documents') ? [{
            title: "tabs.documents",
            children: <DocumentsPanel {...{
                roles,
                documentViewIndex,
                patient, patientId,
                setOpenUploadDialog: (ev: boolean) => {
                    dispatch(setOpenUploadDialog(ev))
                },
                mutatePatientDetails,
                loadingRequest,
                setLoadingRequest
            }} />
        }] : []),
        ...(isBeta && ability.can('manage', 'patients', 'patients__patient__details__payment') ? [{
            title: "tabs.transactions",
            children: <TransactionPanel {...{
                patient, wallet, rest, walletMutate, devise, router
            }} />,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        }] : []),
        ...(ability.can('manage', 'patients', 'patients__patient__details__note') ? [{
            title: "tabs.notes",
            children: <NotesPanel loading={!patient}  {...{t, patient, mutatePatientDetails}} />,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        }] : []),
        ...(ability.can('manage', 'patients', 'patients__patient__details__resume') ? [{
            title: "tabs.recap",
            children: <PatientFile {...{patient, antecedentsData, t, allAntecedents}} />,
            permission: ["ROLE_PROFESSIONAL"]
        }] : [])
    ];

    useEffect(() => {
        if (selectedDialog && !router.asPath.includes('/dashboard/consultation/')) {
            switch (selectedDialog.action) {
                case "medical_prescription":
                case "medical_prescription_cycle":
                    setInfo(getPrescriptionUI());
                    setState(selectedDialog.state);
                    setOpenDialog(true);
                    break;
            }
        }
    }, [selectedDialog]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpAntecedentsResponse) {
            setAntecedentsData((httpAntecedentsResponse as HttpResponse)?.data as any[]);
        }
    }, [httpAntecedentsResponse])

    useEffect(() => {
        if (httpPatientWallet) {
            setWallet((httpPatientWallet as HttpResponse).data.wallet)
            setRest((httpPatientWallet as HttpResponse).data.rest_amount)
        }
    }, [httpPatientWallet])

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            {!isAdd ?
                <PatientDetailStyled height={!isAdd ? "100%" : 0}>
                    <Backdrop open={openFabAdd}/>
                    {" "}
                    <PatientDetailsToolbar onClose={closePatientDialog}/>

                    <PatientDetailsCard
                        loading={!patient}
                        {...{
                            isBeta,
                            patient,
                            onConsultation,
                            antecedentsData,
                            mutateAntecedents,
                            onConsultationStart,
                            patientPhoto,
                            mutatePatientList,
                            mutateAgenda,
                            walletMutate,
                            roles,
                            closePatientDialog,
                            setEditableSection: setEditable,
                            rest, devise
                        }}
                    />
                    <Box className={"container"} sx={{width: {md: 726, xs: "100%"}}}>
                        <Tabs
                            value={index}
                            onChange={handleStepperIndexChange}
                            variant="scrollable"
                            aria-label="basic tabs example"
                            className="tabs-bg-white">
                            {tabsContent.map((tabHeader, tabHeaderIndex) => (
                                <Tab
                                    key={`tabHeader-${tabHeaderIndex}`}
                                    disableRipple
                                    label={t(tabHeader.title)}
                                    {...a11yProps(tabHeaderIndex)}
                                />)
                            )}
                        </Tabs>
                        <Divider/>
                        {tabsContent.map((tabContent, tabContentIndex) => (
                            <TabPanel
                                key={`tabContent-${tabContentIndex}`}
                                padding={1}
                                value={index}
                                index={tabContentIndex}>
                                {tabContent.children}
                            </TabPanel>
                        ))}

                        <SpeedDial
                            sx={{
                                position: "fixed",
                                bottom: 16,
                                right: 16,
                                display: {md: "none", xs: "flex"},
                            }}
                            onClose={handleCloseFab}
                            onOpen={handleOpenFab}
                            open={openFabAdd}
                            handleItemClick={handleActionFab}
                            actions={[
                                {icon: <SpeedDialIcon/>, name: t("tabs.add-appo"), action: "add-appointment"},
                                {
                                    icon: <IconUrl path="fileadd" width={20} height={20}/>,
                                    name: t("tabs.import"),
                                    action: "import-document"
                                },
                            ]}
                        />
                    </Box>

                    <Paper
                        className={"action-buttons"}
                        sx={{
                            position: "sticky",
                            bottom: 0,
                            width: "100%",
                            borderRadius: 0,
                            borderWidth: "0px",
                            p: 2,
                            mt: 'auto',
                            textAlign: "right",
                            display: {md: "block", xs: "none"}
                        }}>


                        <LoadingButton onClick={() => dispatch(setOpenUploadDialog(true))}
                                       sx={{
                                           borderColor: 'divider',
                                           bgcolor: theme => theme.palette.grey['A500'],
                                       }}
                                       variant="outlined"
                                       color="info"
                                       loading={loadingRequest}

                                       startIcon={<IconUrl path="fileadd" width={20} height={20}/>}>
                            {t("upload_document")}
                        </LoadingButton>

                        <Button
                            size="medium"
                            variant="contained"
                            disabled={!patient}
                            color="primary"
                            startIcon={<Icon path="ic-agenda-+"/>}
                            sx={{
                                mr: 1,
                                ml: 1,
                                width: {md: "auto", sm: "100%", xs: "100%"},
                            }}
                            onClick={() => {
                                dispatch(resetAppointment());
                                dispatch(setAppointmentPatient(patient as any));
                                setIsAdd(!isAdd);
                            }}>
                            {t("tabs.add-appo")}
                        </Button>
                    </Paper>

                    <Dialog
                        {...{
                            direction,
                            sx: {
                                minHeight: 300
                            }
                        }}
                        action={info}
                        open={openDialog}
                        data={{
                            state,
                            setState,
                            setOpenDialog: setOpenDialog,
                            t: translate
                        }}
                        size={info && ["medical_prescription", "medical_prescription_cycle"].includes(info) ? "xl" : "lg"}
                        dialogClose={handleCloseDialog}
                        {...(info === "document_detail" && {
                            sx: {p: 0},
                        })}
                        title={t(info === "document_detail" ? "doc_detail_title" : "")}
                        {...((info === "document_detail" || info === "end_consultation") && {
                            onClose: handleCloseDialog,
                        })}
                        {...((info && ["medical_prescription", "medical_prescription_cycle"].includes(info)) && {
                            headerDialog: (<DialogTitle
                                    sx={{
                                        backgroundColor: (theme: Theme) => theme.palette.primary.main,
                                        position: "relative",
                                    }}
                                    id="scroll-dialog-title">
                                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                        {translate(`consultationIP.${info}`)}
                                        <SwitchPrescriptionUI {...{
                                            t: translate,
                                            keyPrefix: "consultationIP",
                                            handleSwitchUI
                                        }} />
                                    </Stack>
                                </DialogTitle>
                            ),
                            actionDialog: <DialogActions sx={{width: "100%"}}>
                                <Stack sx={{width: "100%"}}
                                       direction={"row"}
                                       justifyContent={info === "medical_prescription_cycle" ? "space-between" : "flex-end"}>
                                    {info === "medical_prescription_cycle" &&
                                        <Button startIcon={<AddIcon/>} onClick={() => {
                                            dispatch(handleDrawerAction("addDrug"));
                                        }}>
                                            {translate("consultationIP.add_drug")}
                                        </Button>}
                                    <Stack direction={"row"} spacing={1.2}>
                                        <Button
                                            onClick={handleCloseDialog}
                                            startIcon={<CloseIcon/>}>
                                            {translate("cancel")}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveDialog}
                                            disabled={info === "medical_prescription_cycle" && state.length === 0}
                                            startIcon={<SaveRoundedIcon/>}>
                                            {translate("consultationIP.save")}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </DialogActions>,
                        })}
                    />

                    <Dialog
                        action={"add_a_document"}
                        open={openUploadDialog}
                        data={{
                            t,
                            state: documentConfig,
                            setState: setDocumentConfig,
                            handleUpdateFiles: (files: any[]) => {
                                if (files.length > 0) {
                                    setLoadingFiles(false);
                                }
                            }
                        }}
                        size={"md"}
                        direction={"ltr"}
                        sx={{minHeight: 400}}
                        title={t("doc_detail_title")}
                        dialogClose={() => {
                            dispatch(setOpenUploadDialog(false));
                        }}
                        onClose={() => {
                            dispatch(setOpenUploadDialog(false));
                        }}
                        actionDialog={
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        dispatch(setOpenUploadDialog(false));
                                    }}
                                    startIcon={<CloseIcon/>}>
                                    {t("add-patient.cancel")}
                                </Button>
                                <Button
                                    disabled={loadingFiles}
                                    variant="contained"
                                    onClick={() => {
                                        dispatch(setOpenUploadDialog(false));
                                        handleUploadDocuments();
                                    }}
                                    startIcon={<SaveRoundedIcon/>}>
                                    {t("add-patient.register")}
                                </Button>
                            </DialogActions>
                        }
                    />
                </PatientDetailStyled>
                : (
                    <CustomStepper
                        {...{stepperData, t}}
                        modal={"patient"}
                        OnSubmitStepper={submitStepper}
                        OnAction={(action: string, event: EventDef) => {
                            switch (action) {
                                case "close":
                                    if (patientId) {
                                        setIsAdd(false);
                                    } else {
                                        closePatientDialog();
                                    }
                                    mutatePatientList && mutatePatientList();
                                    break;
                                case "onConsultationStart":
                                    onConsultationStart && onConsultationStart(event);
                                    break;
                                case "onConsultation":
                                    onConsultation && onConsultation(event);
                                    break;
                                case "onWaitingRoom":
                                    onOpenWaitingRoom(event);
                                    break;
                            }
                        }}
                        onBackButton={(index: number) => {
                            return index === 0 && setIsAdd(false)
                        }}
                        scroll
                        minWidth={726}
                        onClickCancel={() => setIsAdd(false)}
                    />
                )}

            <Drawer
                anchor={"right"}
                open={openViewDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(openDrawer({type: "view", open: false}));
                }}>
                <AppointmentDetail {...{patientId}}/>
            </Drawer>

        </>
    );
}

export default PatientDetail;
