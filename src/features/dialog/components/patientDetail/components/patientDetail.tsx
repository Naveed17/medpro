import { Box, Button, Divider, Paper, Tab, Tabs, Zoom } from "@mui/material";
import { PatientDetailsToolbar } from "@features/toolbar";
import { onOpenPatientDrawer } from "@features/table";
import { NoDataCard, PatientdetailsCard } from "@features/card";
import {
  DocumentsPanel,
  Instruction,
  PersonalInfoPanel,
  TabPanel,
  TimeSchedule,
} from "@features/tabPanel";
import { GroupTable } from "@features/groupTable";
import Icon from "@themes/urlIcon";
import { SpeedDial } from "@features/speedDial";
import { CustomStepper } from "@features/customStepper";
import { useAppDispatch } from "@app/redux/hooks";
import { useRequest } from "@app/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SyntheticEvent, useState } from "react";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// add patient details RDV for not data
const AddAppointmentCardData = {
  mainIcon: "ic-agenda-+",
  title: "no-data.group-table.title",
  description: "no-data.group-table.description",
  buttonText: "no-data.group-table.button-text",
  buttonIcon: "ic-agenda-+",
  buttonVariant: "warning",
};

function PatientDetail({ ...props }) {
  const {
    patientId,
    ConsultationId,
    isAddAppointment = false,
    currentStepper = 0,
    onCloseDialog,
    onChangeStepper,
    onAddAppointment,
  } = props;

  const stepperData = [
    {
      title: "tabs.time-slot",
      children: TimeSchedule,
      disabled: false,
    },
    {
      title: "tabs.advice",
      children: Instruction,
      disabled: true,
    },
  ];

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  // state hook for tabs
  const [index, setIndex] = useState<number>(currentStepper);
  const [isAdd, setIsAdd] = useState<boolean>(isAddAppointment);

  const { t, ready } = useTranslation("patient", { keyPrefix: "config" });

  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  // mutate for patient details
  const { data: httpPatientDetailsResponse, mutate } = useRequest({
    method: "GET",
    url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/${router.locale}`,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // handle tab change
  const handleStepperIndexChange = (
    event: SyntheticEvent,
    newValue: number
  ) => {
    setIndex(newValue);
  };

  const patient = (httpPatientDetailsResponse as HttpResponse)
    ?.data as PatientModel;

  if (!ready) return <>loading translations...</>;

  return (
    <>
      {!isAdd ? (
        <Box height={!isAdd ? "100%" : 0}>
          {" "}
          <PatientDetailsToolbar
            onClose={() => {
              dispatch(onOpenPatientDrawer({ patientId: "" }));
              onCloseDialog(false);
            }}
          />
          <PatientdetailsCard
            loading={!patient}
            patient={patient}
            consultation={ConsultationId}
          />
          <Box
            sx={{
              width: { md: 726, xs: "100%" },
              bgcolor: "background.default",
              "& div[role='tabpanel']": {
                height: { md: "calc(100vh - 312px)", xs: "auto" },
                overflowY: "auto",
              },
            }}
          >
            <Tabs
              value={index}
              onChange={handleStepperIndexChange}
              variant="scrollable"
              aria-label="basic tabs example"
              className="tabs-bg-white"
            >
              <Tab
                disableRipple
                label={t("tabs.personal-info")}
                {...a11yProps(0)}
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
            <Divider />
            <TabPanel padding={1} value={index} index={0}>
              <PersonalInfoPanel
                loading={!patient}
                patient={patient}
                mutate={mutate}
              />
            </TabPanel>
            <TabPanel padding={1} value={index} index={1}>
              <GroupTable
                from="patient"
                loading={!patient}
                data={(httpPatientDetailsResponse as HttpResponse)?.data}
              />
              {/* ) : ( */}
              {/* <NoDataCard t={t} data={AddAppointmentCardData} /> */}
              {/* )} */}
            </TabPanel>
            <TabPanel padding={2} value={index} index={2}>
              <DocumentsPanel />
            </TabPanel>
            <Paper
              sx={{
                borderRadius: 0,
                borderWidth: "0px",
                p: 2,
                textAlign: "right",
                display: { md: "block", xs: "none" },
              }}
            >
              <Button
                size="medium"
                variant="text-primary"
                color="primary"
                startIcon={<Icon path="ic-dowlaodfile" />}
                sx={{
                  mr: 1,
                  width: { md: "auto", sm: "100%", xs: "100%" },
                }}
              >
                {t("tabs.import")}
              </Button>
              <Button
                onClick={() => setIsAdd(!isAdd)}
                size="medium"
                variant="contained"
                color="primary"
                startIcon={<Icon path="ic-agenda-+" />}
                sx={{ width: { md: "auto", sm: "100%", xs: "100%" } }}
              >
                {t("tabs.add-appo")}
              </Button>
            </Paper>
            <SpeedDial
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                display: { md: "none", xs: "flex" },
              }}
              onClick={() => setIsAdd(!isAdd)}
              actions={[
                { icon: <SpeedDialIcon />, name: t("tabs.add-appo") },
                { icon: <CloudUploadIcon />, name: t("tabs.import") },
              ]}
            />
          </Box>
        </Box>
      ) : (
        <CustomStepper
          stepperData={stepperData}
          onBackButton={(index: number) => index === 0 && setIsAdd(false)}
          scroll
          t={t}
          minWidth={726}
          onClickCancel={() => setIsAdd(false)}
        />
      )}
    </>
  );
}

export default PatientDetail;
