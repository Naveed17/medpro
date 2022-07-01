// react
import { useEffect, useState, ReactElement, SyntheticEvent } from "react";

// next
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// material components
import { Box, Tabs, Tab, Drawer } from "@mui/material";

// redux
import { useAppSelector } from "@app/redux/hooks";
import { tableActionSelector } from "@features/table";
import { configSelector } from "@features/base";

// ________________________________
import { PatientdetailsCard } from "@features/card";
import { PatientMobileCard } from "@features/patientMobileCard";
import { Otable } from "@features/table";
import { SubHeader } from "@features/subHeader";
import { PatientToolbar, PatientDetailsToolbar } from "@features/toolbar";
import { DashLayout } from "@features/base";

// interface
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}

// Patient data for table body
const PatiendData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: true,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 2,
    name: "Med",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "success",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
  {
    id: 3,
    name: "Muhammad",
    avatar: "/static/icons/Med-logo_.svg",
    time: new Date(),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: new Date(),
    lastAppointment: new Date(),
    addAppointment: false,
    dateOfBirth: new Date("07-02-1998"),
    status: "pending",
    action: "left",
  },
];

// table head data
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
    label: "lastAppointment",
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
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function Patient() {
  // selectors
  const { patientId } = useAppSelector(tableActionSelector);
  const { direction } = useAppSelector(configSelector);

  // state hook for details drawer
  const [open, setopen] = useState<boolean>(false);

  // state hook for tabs
  const [value, setValue] = useState<number>(0);

  // handle tab change
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // useEffect hook for handling the table action drawer
  useEffect(() => {
    if (Boolean(patientId)) {
      setopen(true);
    }
  }, [patientId]);

  const { t, ready } = useTranslation("patient", { keyPrefix: "config" });

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
        <PatientMobileCard ready={ready} PatiendData={PatiendData} />
        <Drawer
          anchor={"right"}
          open={open}
          dir={direction}
          onClose={() => {
            setopen(false);
          }}
        >
          <PatientDetailsToolbar />
          <PatientdetailsCard />
          <Box
            sx={{
              bgcolor: "background.paper",
              borderBottom: "1px solid #EFF2F5",
              px: 2,
              button: {
                "&.Mui-selected": {
                  color: (theme) => theme.palette.primary.main,
                },
              },
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              aria-label="basic tabs example"
            >
              <Tab label="Informations personnelle " {...a11yProps(0)} />
              <Tab label="RDV" {...a11yProps(1)} />
              <Tab label="Documents" {...a11yProps(2)} />
            </Tabs>
          </Box>
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
