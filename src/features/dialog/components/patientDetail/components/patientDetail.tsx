import {Box, Button, Divider, Paper, Tab, Tabs} from "@mui/material";
import {PatientDetailsToolbar} from "@features/toolbar";
import {onOpenPatientDrawer} from "@features/table";
import {NoDataCard, PatientDetailsCard} from "@features/card";
import {
    DocumentsPanel,
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
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, {SyntheticEvent, useState} from "react";
import PatientDetailStyled from "./overrides/patientDetailStyled";
import {LoadingScreen} from "@features/loadingScreen";
import {configSelector} from "@features/base";

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

    // state hook for tabs
    const [index, setIndex] = useState<number>(currentStepper);
    const [isAdd, setIsAdd] = useState<boolean>(isAddAppointment);
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
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {direction} = useAppSelector(configSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    // mutate for patient details
    const {data: httpPatientDetailsResponse, mutate} = useRequest(patientId ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null);

    const {data: httpPatientHistoryResponse, mutate: mutatePatientHistory} = useRequest(patientId ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/appointments/history/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null);

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
            mutate();
        }
    };

    const patient = (httpPatientDetailsResponse as HttpResponse)?.data as PatientModel;
    const nextAppointments = patient ? patient.nextAppointments : [];
    const previousAppointments = (httpPatientHistoryResponse as HttpResponse)?.data;
    const documents = patient ? patient.documents : [];

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
                        {...{patient, onConsultation}}
                    />
                    <Box className={"container"} sx={{width: {md: 726, xs: "100%"}}}>
                        <Tabs
                            value={index}
                            onChange={handleStepperIndexChange}
                            variant="scrollable"
                            aria-label="basic tabs example"
                            className="tabs-bg-white">
                            <Tab
                                disableRipple
                                label={t("tabs.personal-info")}
                                {...a11yProps(0)}
                            />
                            <Tab
                                disableRipple
                                label={t("tabs.history")}
                                {...a11yProps(1)}
                            />
                            <Tab
                                disableRipple
                                label={t("tabs.appointment")}
                                {...a11yProps(1)}
                            />
                            <Tab
                                disableRipple
                                label={t("tabs.documents")}
                                {...a11yProps(2)}
                            />
                        </Tabs>
                        <Divider/>
                        <TabPanel padding={1} value={index} index={0}>
                            <PersonalInfoPanel loading={!patient} {...{patient, mutate, mutatePatientList}} />
                        </TabPanel>
                        <TabPanel padding={1} value={index} index={1}>
                            {previousAppointments && previousAppointments.length > 0 ? (
                                <HistoryPanel {...{t, previousAppointments, patient}} />
                            ) : (
                                <NoDataCard
                                    t={t}
                                    ns={"patient"}
                                    data={AddConsultationCardData}
                                />
                            )}
                        </TabPanel>
                        <TabPanel padding={1} value={index} index={2}>
                            {nextAppointments.length > 0 ? (
                                <GroupTable from="patient" loading={!patient} data={patient}/>
                            ) : (
                                <NoDataCard
                                    t={t}
                                    ns={"patient"}
                                    data={AddAppointmentCardData}
                                />
                            )}
                        </TabPanel>
                        <TabPanel padding={2} value={index} index={3}>
                            <DocumentsPanel {...{documents, patient}} />
                        </TabPanel>

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
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            startIcon={<Icon path="ic-agenda-+"/>}
                            sx={{
                                mr: 1,
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
                </PatientDetailStyled>
            ) : (
                <CustomStepper
                    {...{stepperData, t}}
                    OnSubmitStepper={submitStepper}
                    OnAction={(action: string) => {
                        if (action === "close") {
                            if (patientId) {
                                setIsAdd(false);
                            } else {
                                dispatch(onOpenPatientDrawer({patientId: ""}));
                                onCloseDialog(false);
                            }
                            mutatePatientList && mutatePatientList();
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
