// react
import { useEffect, useState, ReactElement, SyntheticEvent } from "react";

// next
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// material components
import { Box, Tabs, Tab, Drawer, Divider, Button, Paper } from "@mui/material";

// redux
import { useAppSelector, useAppDispatch } from "@app/redux/hooks";
import { tableActionSelector } from "@features/table";
import { configSelector } from "@features/base";
import { onOpenDetails } from "@features/table";

// ________________________________
import { PatientdetailsCard } from "@features/card";
import {
  PersonalInfoPanel,
  TabPanel,
  DocumentsPanel,
} from "@features/tabPanel";
import { PatientMobileCard } from "@features/patientMobileCard";
import { Otable } from "@features/table";
import { SubHeader } from "@features/subHeader";
import { PatientToolbar, PatientDetailsToolbar } from "@features/toolbar";
import { DashLayout } from "@features/base";
import moment from "moment-timezone";
import Icon from "@themes/urlIcon";
import { GroupTable } from "@features/groupTable";
import { SpeedDial } from "@features/speedDial";

// icons
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// interface
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}

// data for patient details RDV
const data: PatientDetailsRDV[] = [
  {
    title: "pending-appo",
    pending: true,
    data: [
      {
        title: "John Doe",
        start: new Date(2020, 4, 1, 10, 30),
        end: new Date(2020, 4, 1, 11, 30),
        allDay: false,
        time: new Date(),
        status: "pending",
        borderColor: "#FBD400",
        motif: "video-consultation",
        meeting: true,
      },
      {
        title: "John Doe",
        start: new Date(2020, 4, 1, 10, 30),
        end: new Date(2020, 4, 1, 11, 30),
        allDay: false,
        time: new Date(),
        status: "pending",
        borderColor: "#FBD400",
        motif: "video-consultation",

        meeting: true,
      },
      {
        title: "John Doe",
        start: new Date(2020, 4, 1, 10, 30),
        end: new Date(2020, 4, 1, 11, 30),
        allDay: false,
        time: new Date(),
        status: "pending",
        borderColor: "#FBD400",
        motif: "video-consultation",

        meeting: true,
      },
    ],
  },
  {
    title: "old-appo",
    pending: false,
    data: [
      {
        title: "2021",
        data: [
          {
            title: "John Doe",
            start: new Date(2020, 4, 1, 10, 30),
            end: new Date(2020, 4, 1, 11, 30),
            allDay: false,
            time: moment().add(1, "days"),
            status: "pending",
            borderColor: "#FBD400",
            motif: "video-consultation",

            meeting: true,
          },
          {
            title: "John Doe",
            start: new Date(2020, 4, 1, 10, 30),
            end: new Date(2020, 4, 1, 11, 30),
            allDay: false,
            time: moment().add(1, "days"),
            status: "pending",
            borderColor: "#FBD400",
            motif: "video-consultation",

            meeting: true,
          },
        ],
      },
      {
        title: "2020",
        data: [
          {
            title: "John Doe",
            start: new Date(2020, 4, 1, 10, 30),
            end: new Date(2020, 4, 1, 11, 30),
            allDay: false,
            time: moment().add(1, "days"),
            status: "pending",
            borderColor: "#FBD400",
            motif: "video-consultation",
            meeting: true,
          },
          {
            title: "John Doe",
            start: new Date(2020, 4, 1, 10, 30),
            end: new Date(2020, 4, 1, 11, 30),
            allDay: false,
            time: moment().add(1, "days"),
            status: "pending",
            borderColor: "#FBD400",
            motif: "video-consultation",
            meeting: true,
          },
        ],
      },
    ],
  },
];

// Patient data for table body
const PatiendData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/static/icons/Med-logo_.svg",
    time: moment("09:00", "hh:mm").format("hh:mm"),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: moment().format("DD-MM-YYYY"),
    lastAppointment: moment().format("DD-MM-YYYY"),
    addAppointment: true,
    dateOfBirth: moment(),
    status: "pending",
    action: "left",
  },
  {
    id: 2,
    name: "Med",
    avatar: "/static/icons/Med-logo_.svg",
    time: moment("09:00", "hh:mm").format("hh:mm"),
    telephone: "+1-555-555-5555",
    idCode: "123456789",
    city: "New York",
    nextAppointment: moment().format("DD-MM-YYYY"),
    lastAppointment: moment().format("DD-MM-YYYY"),
    addAppointment: false,
    dateOfBirth: moment(),
    status: "success",
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
  const dispatch = useAppDispatch();
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
    if (Boolean(patientId !== "")) {
      setopen(true);
    }
  }, [patientId]);

  const { t, ready } = useTranslation("patient", { keyPrefix: "config" });

  if (!ready) return <>loading translations...</>;

  const actions: {
    icon: ReactElement;
    name: string;
  }[] = [
    { icon: <SpeedDialIcon />, name: t("tabs.add-appo") },
    { icon: <CloudUploadIcon />, name: t("tabs.import") },
  ];

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
            minWidth={1300}
            pagination
          />
        </Box>
        <PatientMobileCard ready={ready} PatiendData={PatiendData} />
        <Drawer
          anchor={"right"}
          open={open}
          dir={direction}
          onClose={() => {
            dispatch(onOpenDetails({ patientId: "" }));
            setopen(false);
          }}
        >
          <PatientDetailsToolbar
            onClose={() => {
              dispatch(onOpenDetails({ patientId: "" }));
              setopen(false);
            }}
          />
          <PatientdetailsCard />
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
              value={value}
              onChange={handleChange}
              variant="scrollable"
              aria-label="basic tabs example"
              sx={{
                px: 2,
                position: "sticky",
                top: 54,
                borderTop: (theme) => ({
                  md: "none",
                  xs: `1px solid ${theme.palette.divider}`,
                }),
                zIndex: 112,
                bgcolor: "background.paper",
                button: {
                  "&.Mui-selected": {
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              }}
            >
              <Tab label={t("tabs.personal-info")} {...a11yProps(0)} />
              <Tab label={t("tabs.appointment")} {...a11yProps(1)} />
              <Tab label={t("tabs.documents")} {...a11yProps(2)} />
            </Tabs>
            <Divider />
            <TabPanel padding={1} value={value} index={0}>
              <PersonalInfoPanel />
            </TabPanel>
            <TabPanel padding={1} value={value} index={1}>
              <GroupTable from="patient" data={data} />
            </TabPanel>
            <TabPanel padding={2} value={value} index={2}>
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
                sx={{ mr: 1, width: { md: "auto", sm: "100%", xs: "100%" } }}
              >
                {t("tabs.import")}
              </Button>
              <Button
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
              actions={actions}
            />
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      "patient",
      "menu",
      "common",
    ])),
  },
});

export default Patient;

Patient.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
