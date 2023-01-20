import {Box, Button, DialogActions, Divider, Paper, Tab, Tabs} from "@mui/material";
import {PatientDetailsToolbar} from "@features/toolbar";
import {onOpenPatientDrawer} from "@features/table";
import {NoDataCard, PatientDetailsCard} from "@features/card";
import {
    DocumentsPanel,
    NotesPanel,
    EventType,
    Instruction,
    PersonalInfoPanel,
    setAppointmentPatient,
    TabPanel,
    TimeSchedule,
    resetAppointment, HistoryPanel
} from "@features/tabPanel";
import {GroupTable} from "@features/groupTable";
import Icon from "@themes/urlIcon";
import {SpeedDial} from "@features/speedDial";
import {CustomStepper} from "@features/customStepper";
import {useAppDispatch} from "@app/redux/hooks";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, {SyntheticEvent, useState} from "react";
import PatientDetailStyled from "./overrides/patientDetailStyled";
import {LoadingScreen} from "@features/loadingScreen";
import {EventDef} from "@fullcalendar/react";
import CloseIcon from "@mui/icons-material/Close";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {Dialog} from "@features/dialog";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {LoadingButton} from "@mui/lab";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

// add patient details RDV for not data
const AddAppointmentCardData = {
    mainIcon: "ic-agenda-+",
    title: "no-data.appointment.title",
    description: "no-data.appointment.description"
};
// add consultation details RDV for not data
const AddConsultationCardData = {
    mainIcon: "consultation/ic-text",
    title: "no-data.consultation.title",
    description: "no-data.consultation.description"
};

function PatientDetail({...props}) {
    const {
        patientId,
        isAddAppointment = false,
        currentStepper = 0,
        onCloseDialog,
        onChangeStepper,
        onAddAppointment,
        onConsultation = null,
        mutate: mutatePatientList,
    } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {data: session} = useSession();
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});

    // state hook for tabs
    const [index, setIndex] = useState<number>(currentStepper);
    const [isAdd, setIsAdd] = useState<boolean>(isAddAppointment);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [documentViewIndex, setDocumentViewIndex] = useState(0);
    const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
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


    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (session?.data as UserDataResponse)?.general_information.roles as Array<string>;

    const {trigger: triggerUploadDocuments} = useRequestMutation(null, "/patient/documents");
    // mutate for patient details
    const {data: httpPatientDetailsResponse, mutate: mutatePatientDetails} = useRequest(patientId ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null);

    const {data: httpPatientHistoryResponse} = useRequest(patientId ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/appointments/history/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null);

    const {data: httpPatientDocumentsResponse, mutate: mutatePatientDocuments} = useRequest(patientId ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/documents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);

    const patient = (httpPatientDetailsResponse as HttpResponse)?.data as PatientModel;

    const {data: httpPatientPhotoResponse} = useRequest(patient?.hasPhoto ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const nextAppointments = patient ? patient.nextAppointments : [];
    const previousAppointments = patient ? patient.previousAppointments : [];
    const previousAppointmentsData = (httpPatientHistoryResponse as HttpResponse)?.data;
    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;
    const documents = patient ? patient.documents : [];
    const patientDocuments = (httpPatientDocumentsResponse as HttpResponse)?.data;

    const tabsContent = [
        {
            title: "tabs.personal-info",
            children: <PersonalInfoPanel loading={!patient} {...{
                patient,
                mutatePatientDetails,
                mutatePatientList
            }} />,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        },
        {
            title: "tabs.history",
            children: <>
                {previousAppointmentsData && previousAppointmentsData.length > 0 ? (
                    <HistoryPanel {...{t, previousAppointmentsData, patient}} />
                ) : (
                    <NoDataCard
                        t={t}
                        ns={"patient"}
                        data={AddConsultationCardData}
                    />
                )}
            </>,
            permission: ["ROLE_PROFESSIONAL"]
        },
        {
            title: "tabs.appointment",
            children: <>
                {nextAppointments?.length > 0 || previousAppointments?.length > 0 ? (
                    <GroupTable from="patient" loading={!patient} data={patient}/>
                ) : (
                    <NoDataCard
                        t={t}
                        ns={"patient"}
                        data={AddAppointmentCardData}
                    />
                )}
            </>,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        },
        {
            title: "tabs.documents",
            children: <DocumentsPanel {...{
                documents,
                roles,
                documentViewIndex,
                patient, patientId, setOpenUploadDialog,
                mutatePatientDetails,
                mutatePatientDocuments,
                patientDocuments, loadingRequest, setLoadingRequest
            }} />,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        },
        {
            title: "tabs.notes",
            children: <NotesPanel loading={!patient}  {...{t, patient, mutatePatientDetails}} />,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        }
    ].filter(tab => tab.permission.includes(roles[0]));

    // handle tab change
    const handleStepperIndexChange = (
        event: SyntheticEvent,
        newValue: number
    ) => {
        setIndex(newValue);
    };

    const submitStepper = (index: number) => {
        const steps: any = stepperData.map((stepper, index) => ({...stepper}));
        if (stepperData.length !== index) {
            steps[index].disabled = false;
            setStepperData(steps);
        } else {
            setStepperData(steps.map((stepper: any) => ({...stepper, disabled: true})));
            mutatePatientDetails();
        }
    };

    const handleUploadDocuments = () => {
        const documentTabIndex = tabsContent.findIndex(tab => tab.title === "tabs.documents");
        setDocumentViewIndex(roles.includes('ROLE_SECRETARY') ? 0 : 1);
        index !== documentTabIndex && setIndex(documentTabIndex);
        setLoadingRequest(true);
        const params = new FormData();
        params.append("document_type", documentConfig.type);
        documentConfig.files.map((file: File) => {
            params.append("document[]", file, file.name);
        });
        triggerUploadDocuments({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/patients/${patientId}/documents/${router.locale}`,
            data: params,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then(() => {
            mutatePatientDocuments();
            setLoadingRequest(false);
        });
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            {!isAdd ? (
                <PatientDetailStyled height={!isAdd ? "100%" : 0}>
                    {" "}
                    <PatientDetailsToolbar
                        onClose={() => {
                            dispatch(onOpenPatientDrawer({patientId: ""}));
                            onCloseDialog(false);
                        }}
                    />
                    <PatientDetailsCard
                        loading={!patient}
                        {...{patient, onConsultation, patientPhoto, mutatePatientList}}
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
                                padding={1} value={index} index={tabContentIndex}>
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
                            onClick={() => {
                                dispatch(setAppointmentPatient(patient as any));
                                setIsAdd(!isAdd)
                            }}
                            actions={[
                                {icon: <SpeedDialIcon/>, name: t("tabs.add-appo")},
                                {icon: <CloudUploadIcon/>, name: t("tabs.import")},
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
                            display: {md: "block", xs: "none"},
                        }}
                    >
                        <LoadingButton
                            loading={loadingRequest}
                            loadingPosition="start"
                            onClick={() => setOpenUploadDialog(true)}
                            size="medium"
                            style={{color: "black"}}
                            startIcon={<Icon path="ic-doc"/>}>{t('upload_document')}</LoadingButton>

                        <Button
                            size="medium"
                            variant="contained"
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
                            }}
                        >
                            {t("tabs.add-appo")}
                        </Button>
                    </Paper>

                    <Dialog
                        action={"add_a_document"}
                        open={openUploadDialog}
                        data={{
                            t,
                            state: documentConfig,
                            setState: setDocumentConfig
                        }}
                        size={"md"}
                        direction={"ltr"}
                        sx={{minHeight: 400}}
                        title={t("doc_detail_title")}
                        dialogClose={() => {
                            setOpenUploadDialog(false);
                        }}
                        onClose={() => {
                            setOpenUploadDialog(false);
                        }}
                        actionDialog={
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        setOpenUploadDialog(false);
                                    }}
                                    startIcon={<CloseIcon/>}>
                                    {t("add-patient.cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setOpenUploadDialog(false);
                                        handleUploadDocuments();
                                    }}
                                    startIcon={<SaveRoundedIcon/>}>
                                    {t("add-patient.register")}
                                </Button>
                            </DialogActions>
                        }
                    />
                </PatientDetailStyled>
            ) : (
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
                                    dispatch(onOpenPatientDrawer({patientId: ""}));
                                    onCloseDialog(false);
                                }
                                mutatePatientList && mutatePatientList();
                                break;
                            case "onConsultationStart":
                                onConsultation && onConsultation(event);
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
        </>
    );
}

export default PatientDetail;
