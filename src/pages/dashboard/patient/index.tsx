import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";
import { Box } from "@mui/material";
import { DashLayout } from "@features/base";
import { PatientMobileCard } from "@features/patientMobileCard";
import { useAppSelector } from "@app/redux/hooks";
import { Otable } from "@features/table";
import { SubHeader } from "@features/subHeader";
import { PatientToolbar } from "@features/toolbar";
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
    dateOfBirth: new Date("07-02-1998"),
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
    dateOfBirth: new Date("07-02-1998"),
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
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
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
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
    label: "name",
    sortable: true,
    align: "left",
  },
  {
    id: "telephone",
    numeric: true,
    disablePadding: false,
    label: "telephone",
    sortable: true,
    align: "left",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "city",
    sortable: true,
    align: "left",
  },
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "id",
    sortable: true,
    align: "left",
  },
  {
    id: "nextAppointment",
    numeric: false,
    disablePadding: false,
    label: "nextAppointment",
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
    label: "action",
    sortable: false,
    align: "right",
  },
];

function Patient() {
  const { stepsData } = useAppSelector(addPatientSelector);

  const { t, ready } = useTranslation("patient", { keyPrefix: "table" });
  if (!ready) return <>loading translations...</>;
  return (
    <>
      <SubHeader>
        <PatientToolbar />
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
