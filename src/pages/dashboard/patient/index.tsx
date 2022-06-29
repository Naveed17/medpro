import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useState, useEffect } from "react";
import { Box, Typography, Button, Drawer } from "@mui/material";
import { DashLayout } from "@features/base";
import { CustomStepper } from "@features/customStepper";
import { PatientMobileCard } from "@features/patientMobileCard";
import SubHeader from "@features/subHeader/components/subHeader";
import { configSelector } from "@features/base";
import { useAppSelector } from "@app/redux/hooks";
import { Otable } from "@features/table";
import {
  AddPatientStep1,
  AddPatientStep2,
  AddPatientStep3,
} from "@features/customStepper";
import { DuplicateDetected } from "@features/duplicateDetected";
import IconUrl from "@themes/urlIcon";
import { Dialog } from "@features/dialog";
import { addPatientSelector } from "@features/customStepper";
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}

const PatiendData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/static/icons/Med-logo_.svg",
    time: "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment:
      "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    lastAppointment:
      "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    addAppointment: true,
    status: "pending",
    action: "left",
  },
  {
    id: 2,
    name: "Med",
    avatar: "/static/icons/Med-logo_.svg",
    time: "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment:
      "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    lastAppointment:
      "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    addAppointment: false,
    status: "success",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment:
      "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    lastAppointment:
      "Wed Jun 15 2022 16:57:18 GMT+0100 (Central European Standard Time)",
    addAppointment: false,
    status: "pending",
    action: "left",
  },
];

const stepperData = [
  {
    title: "personal-info",
    children: AddPatientStep1,
  },
  {
    title: "additional-information",
    children: AddPatientStep2,
  },
  {
    title: "fin",
    children: AddPatientStep3,
  },
];
// head data

const headCells: readonly HeadCell[] = [
  {
    id: "select-all",
    numeric: false,
    disablePadding: true,
    label: "checkbox",
    sortable: false,
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Patient's name",
    sortable: true,
    align: "left",
  },
  {
    id: "telephone",
    numeric: true,
    disablePadding: false,
    label: "Telephone",
    sortable: true,
    align: "left",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "City",
    sortable: true,
    align: "left",
  },
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "ID",
    sortable: true,
    align: "left",
  },
  {
    id: "nextAppointment",
    numeric: false,
    disablePadding: false,
    label: "Next Appointment",
    sortable: false,
    align: "left",
  },
  {
    id: "lastAppointment",
    numeric: false,
    disablePadding: false,
    label: "Last appointment",
    sortable: false,
    align: "left",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
    sortable: false,
    align: "right",
  },
];

function Patient() {
  const { stepsData } = useAppSelector(addPatientSelector);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const isAlreadyExist =
    stepsData.step1.name !== "" && stepsData.step2.email !== "";
  const { direction } = useAppSelector(configSelector);
  const [open, setOpen] = useState(isAlreadyExist);

  useEffect(() => {
    setOpen(isAlreadyExist);
  }, [isAlreadyExist]);
  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;
  return (
    <>
      <SubHeader>
        <Typography variant="subtitle2" color="text.primary">
          {t("sub-header.title")}
        </Typography>
        <Button
          onClick={() => setOpenDrawer(true)}
          variant="contained"
          color="success"
          sx={{ ml: "auto" }}
        >
          {t("sub-header.add-patient")}
        </Button>
      </SubHeader>
      <Box className="container">
        <Box display={{ xs: "none", md: "block" }}>
          <Otable
            headers={headCells}
            rows={PatiendData}
            state={null}
            from={"patient"}
            t={t}
            edit={null}
            handleConfig={null}
            handleChange={null}
          />
        </Box>
        <PatientMobileCard t={t} ready={ready} PatiendData={PatiendData} />
        <Drawer
          anchor={"right"}
          open={openDrawer}
          dir={direction}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          <CustomStepper t={t} stepperData={stepperData} />
        </Drawer>
        <Dialog
          action={DuplicateDetected}
          open={open}
          data={{ ...stepsData.step1, ...stepsData.step2 }}
          direction={direction}
          title={t("add-patient.dialog.title")}
          t={t}
          dialogSave={() => alert("save")}
          actionDialog={
            <>
              <Box
                className="modal-actions"
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button>{t("add-patient.dialog.later")}</Button>
                <Box className="btn-right">
                  <Button
                    variant="text-black"
                    className="btn-cancel"
                    sx={{ ml: "auto", "& .react-svg": { marginTop: "-3px" } }}
                    startIcon={<IconUrl path="close" />}
                  >
                    {" "}
                    <span className="sm-none">
                      {" "}
                      {t("add-patient.dialog.no-duplicates")}
                    </span>
                  </Button>
                  <Button
                    sx={{
                      ml: 1,
                      "& .react-svg svg": { width: "15px", height: "15px" },
                    }}
                    startIcon={<IconUrl path="check" />}
                  >
                    <span className="sm-none">
                      {" "}
                      {t("add-patient.register")}
                    </span>
                  </Button>
                </Box>
              </Box>
            </>
          }
          dialogClose={() => setOpen(false)}
        />
      </Box>
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["patient", "menu"])),
  },
});
export default Patient;

Patient.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
