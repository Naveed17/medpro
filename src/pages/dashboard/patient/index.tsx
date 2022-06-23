import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useState } from "react";
import { Box, Typography, Button, Drawer } from "@mui/material";
import { DashLayout } from "@features/base";
import { PatientTable, PatiendData } from "@features/patientTable";
import { PatientAddForm } from "@features/patientAddForm";
import { PatientMobileCard } from "@features/patientMobileCard";
import SubHeader from "@features/subHeader/components/subHeader";
import { configSelector } from "@features/base";
import { useAppSelector } from "@app/redux/hooks";
import { Otable } from "@features/table";

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}

function Patient() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { direction } = useAppSelector(configSelector);
  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;
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
        <PatientMobileCard t={t} ready={ready} PatiendData={PatiendData} />
        <Drawer
          anchor={"right"}
          open={openDrawer}
          dir={direction}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          <PatientAddForm />
        </Drawer>
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
