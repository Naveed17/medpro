import {Box, Button, Divider, Paper, Tab, Tabs, Zoom} from "@mui/material";
import {PatientDetailsToolbar} from "@features/toolbar";
import {onOpenDetails} from "@features/table";
import {NoDataCard, PatientdetailsCard} from "@features/card";
import {AddRDVStep1, AddRDVStep2, AddRDVStep3, DocumentsPanel, PersonalInfoPanel, TabPanel} from "@features/tabPanel";
import {GroupTable} from "@features/groupTable";
import Icon from "@themes/urlIcon";
import {SpeedDial} from "@features/speedDial";
import {CustomStepper} from "@features/customStepper";
import {useAppDispatch} from "@app/redux/hooks";
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const stepperData = [
    {
        title: "tabs.time-slot",
        children: AddRDVStep1,
    },
    {
        title: "tabs.advice",
        children: AddRDVStep2,
    },
    {
        title: "tabs.end",
        children: AddRDVStep3,
    },
];

// add patient details RDV for not data
const AddAppointmentCardData = {
    mainIcon: "ic-agenda-+",
    title: "no-data.group-table.title",
    description: "no-data.group-table.description",
    buttonText: "no-data.group-table.button-text",
    buttonIcon: "ic-agenda-+",
    buttonVariant: "warning",
};

function PatientDetail({...props}) {
    const {
        patientId, isAddAppointment = false, currentStepper = 0,
        onCloseDialog, onChangeStepper, onAddAppointment
    } = props;
    console.log(props);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {data: session} = useSession();

    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    // mutate for patient details
    const {data: httpPatientDetailsResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/patients/${patientId}/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    return (
        <>
            {!isAddAppointment && (
                <Box height={!isAddAppointment ? "100%" : 0}>
                    {" "}
                    <PatientDetailsToolbar
                        onClose={() => {
                            dispatch(onOpenDetails({patientId: ""}));
                            onCloseDialog(false);
                        }}
                    />
                    <PatientdetailsCard
                        loading={httpPatientDetailsResponse}
                        patient={(httpPatientDetailsResponse as HttpResponse)?.data}
                    />
                    <Box
                        sx={{
                            width: {md: 726, xs: "100%"},
                            bgcolor: "background.default",
                            "& div[role='tabpanel']": {
                                height: {md: "calc(100vh - 312px)", xs: "auto"},
                                overflowY: "auto",
                            },
                        }}
                    >
                        <Tabs
                            value={currentStepper}
                            onChange={onChangeStepper}
                            variant="scrollable"
                            aria-label="basic tabs example"
                            className="tabs-bg-white"
                        >
                            <Tab label={t("tabs.personal-info")} {...a11yProps(0)} />
                            <Tab label={t("tabs.appointment")} {...a11yProps(1)} />
                            <Tab label={t("tabs.documents")} {...a11yProps(2)} />
                        </Tabs>
                        <Divider/>
                        <TabPanel padding={1} value={currentStepper} index={0}>
                            <PersonalInfoPanel
                                loading={httpPatientDetailsResponse}
                                patient={(httpPatientDetailsResponse as HttpResponse)?.data}
                            />
                        </TabPanel>
                        <TabPanel padding={1} value={currentStepper} index={1}>
                            {[].length > 0 ? (
                                !httpPatientDetailsResponse && (
                                    <GroupTable
                                        from="patient"
                                        data={
                                            (httpPatientDetailsResponse as HttpResponse)?.data
                                        }
                                    />
                                )
                            ) : (
                                <NoDataCard t={t} data={AddAppointmentCardData}/>
                            )}
                        </TabPanel>
                        <TabPanel padding={2} value={currentStepper} index={2}>
                            <DocumentsPanel/>
                        </TabPanel>
                        <Paper
                            sx={{
                                borderRadius: 0,
                                borderWidth: "0px",
                                p: 2,
                                textAlign: "right",
                                display: {md: "block", xs: "none"},
                            }}
                        >
                            <Button
                                size="medium"
                                variant="text-primary"
                                color="primary"
                                startIcon={<Icon path="ic-dowlaodfile"/>}
                                sx={{
                                    mr: 1,
                                    width: {md: "auto", sm: "100%", xs: "100%"},
                                }}
                            >
                                {t("tabs.import")}
                            </Button>
                            <Button
                                onClick={() => onAddAppointment(!isAddAppointment)}
                                size="medium"
                                variant="contained"
                                color="primary"
                                startIcon={<Icon path="ic-agenda-+"/>}
                                sx={{width: {md: "auto", sm: "100%", xs: "100%"}}}
                            >
                                {t("tabs.add-appo")}
                            </Button>
                        </Paper>
                        <SpeedDial
                            sx={{
                                position: "fixed",
                                bottom: 16,
                                right: 16,
                                display: {md: "none", xs: "flex"},
                            }}
                            onClick={() => onAddAppointment(!isAddAppointment)}
                            actions={[
                                {icon: <SpeedDialIcon/>, name: t("tabs.add-appo")},
                                {icon: <CloudUploadIcon/>, name: t("tabs.import")},
                            ]}
                        />
                    </Box>
                </Box>
            )}
            <Zoom in={isAddAppointment}>
                <Box
                    height={isAddAppointment ? "100%" : 0}
                    sx={{
                        "& .MuiTabs-root": {
                            position: "sticky",
                            top: 0,
                            bgcolor: (theme) => theme.palette.background.paper,
                            zIndex: 11,
                        },
                    }}
                >
                    <CustomStepper
                        currentIndex={0}
                        stepperData={stepperData}
                        scroll
                        t={t}
                        minWidth={726}
                        onClickCancel={() => onAddAppointment(false)}
                    />
                </Box>
            </Zoom>
        </>
    )
}

export default PatientDetail;
