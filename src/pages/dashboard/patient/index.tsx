// react
import {useEffect, useState, ReactElement, SyntheticEvent} from "react";

// next
import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

// material components
import {
    Box,
    Tabs,
    Tab,
    Drawer,
    Divider,
    Button,
    Paper,
    Zoom,
} from "@mui/material";

// redux
import {useAppSelector, useAppDispatch} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";
import {configSelector} from "@features/base";
import {onOpenDetails} from "@features/table";

// ________________________________
import {PatientdetailsCard, NoDataCard} from "@features/card";
import {PatientMobileCard} from "@features/patientMobileCard";
import {Otable} from "@features/table";
import {SubHeader} from "@features/subHeader";
import {PatientToolbar, PatientDetailsToolbar} from "@features/toolbar";
import {DashLayout} from "@features/base";
import moment from "moment-timezone";
import Icon from "@themes/urlIcon";
import {GroupTable} from "@features/groupTable";
import {SpeedDial} from "@features/speedDial";
import {CustomStepper} from "@features/customStepper";

// icons
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    AddRDVStep1,
    AddRDVStep2,
    AddRDVStep3,
    PersonalInfoPanel,
    TabPanel,
    DocumentsPanel,
} from "@features/tabPanel";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

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
    // {
    //   title: "pending-appo",
    //   pending: true,
    //   data: [
    //     {
    //       title: "John Doe",
    //       start: new Date(2020, 4, 1, 10, 30),
    //       end: new Date(2020, 4, 1, 11, 30),
    //       allDay: false,
    //       time: new Date(),
    //       status: "pending",
    //       borderColor: "#FBD400",
    //       motif: "video-consultation",
    //       meeting: true,
    //     },
    //     {
    //       title: "John Doe",
    //       start: new Date(2020, 4, 1, 10, 30),
    //       end: new Date(2020, 4, 1, 11, 30),
    //       allDay: false,
    //       time: new Date(),
    //       status: "pending",
    //       borderColor: "#FBD400",
    //       motif: "video-consultation",
    //       meeting: true,
    //     },
    //     {
    //       title: "John Doe",
    //       start: new Date(2020, 4, 1, 10, 30),
    //       end: new Date(2020, 4, 1, 11, 30),
    //       allDay: false,
    //       time: new Date(),
    //       status: "pending",
    //       borderColor: "#FBD400",
    //       motif: "video-consultation",
    //       meeting: true,
    //     },
    //   ],
    // },
    // {
    //   title: "old-appo",
    //   pending: false,
    //   data: [
    //     {
    //       title: "2021",
    //       data: [
    //         {
    //           title: "John Doe",
    //           start: new Date(2020, 4, 1, 10, 30),
    //           end: new Date(2020, 4, 1, 11, 30),
    //           allDay: false,
    //           time: moment().add(1, "days"),
    //           status: "pending",
    //           borderColor: "#FBD400",
    //           motif: "video-consultation",
    //           meeting: true,
    //         },
    //         {
    //           title: "John Doe",
    //           start: new Date(2020, 4, 1, 10, 30),
    //           end: new Date(2020, 4, 1, 11, 30),
    //           allDay: false,
    //           time: moment().add(1, "days"),
    //           status: "pending",
    //           borderColor: "#FBD400",
    //           motif: "video-consultation",
    //           meeting: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: "2020",
    //       data: [
    //         {
    //           title: "John Doe",
    //           start: new Date(2020, 4, 1, 10, 30),
    //           end: new Date(2020, 4, 1, 11, 30),
    //           allDay: false,
    //           time: moment().add(1, "days"),
    //           status: "pending",
    //           borderColor: "#FBD400",
    //           motif: "video-consultation",
    //           meeting: true,
    //         },
    //         {
    //           title: "John Doe",
    //           start: new Date(2020, 4, 1, 10, 30),
    //           end: new Date(2020, 4, 1, 11, 30),
    //           allDay: false,
    //           time: moment().add(1, "days"),
    //           status: "pending",
    //           borderColor: "#FBD400",
    //           motif: "video-consultation",
    //           meeting: true,
    //         },
    //       ],
    //     },
    //   ],
    // },
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

// Patient data for table body


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
        sortable: false,
        align: "center",
    },
    {
        id: "city",
        numeric: false,
        disablePadding: false,
        label: "city",
        sortable: false,
        align: "center",
    },
    {
        id: "nextAppointment",
        numeric: false,
        disablePadding: false,
        label: "nextAppointment",
        sortable: false,
        align: "center",
    },
    {
        id: "lastAppointment",
        numeric: false,
        disablePadding: false,
        label: "lastAppointment",
        sortable: false,
        align: "center",
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
    const {data: session, status} = useSession();
    const loading = status === 'loading';
    const router = useRouter();
    let medical_entity: MedicalEntityModel | null = null;
    const dispatch = useAppDispatch();


    const [open, setopen] = useState<boolean>(false);
    const [isAddAppointment, setAddAppointment] = useState<boolean>(false);
    // state hook for tabs
    const [value, setValue] = useState<number>(0);
    const [rows, setRows] = useState<PatientWithNextAndLatestAppointment[]>([]);
    // selectors
    const {patient} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);

    // handle tab change
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    // useEffect hook for handling the table action drawer
    useEffect(() => {
        if (patient) {
            setopen(true);
        }
    }, [patient]);
    const {
        trigger
    } = useRequestMutation(null, "/patients", {revalidate: true, populateCache: false});

    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});

    useEffect(() => {
        if (medical_entity !== null) {
            trigger({
                method: "GET",
                url: `/api/medical-entity/${medical_entity.uuid}/patients/${router.locale}?withPagination=false`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(r => {
                //console.log((r.data as HttpResponse).data);
                if (r) setRows((r.data as HttpResponse).data)
            });
        }
    }, [medical_entity, router.locale, session?.accessToken, trigger]);

    if (!ready || loading) return <>loading translations...</>;
    const {data: user} = session as Session;
    medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const actions: {
        icon: ReactElement;
        name: string;
    }[] = [
        {icon: <SpeedDialIcon/>, name: t("tabs.add-appo")},
        {icon: <CloudUploadIcon/>, name: t("tabs.import")},
    ];

    return (
        <>
            <SubHeader>
                <PatientToolbar/>
            </SubHeader>
            <Box className="container">
                <Box display={{xs: "none", md: "block"}}>
                    <Otable
                        headers={headCells}
                        rows={rows}
                        state={null}
                        from={"patient"}
                        t={t}
                        edit={null}
                        handleConfig={null}
                        handleChange={null}
                        //minWidth={1300}
                        pagination
                    />
                </Box>
                <PatientMobileCard ready={ready} PatiendData={rows}/>
                <Drawer
                    anchor={"right"}
                    open={open}
                    dir={direction}
                    onClose={() => {
                        dispatch(onOpenDetails({patientId: ""}));
                        setopen(false);
                    }}
                >
                    {!isAddAppointment && (
                        <Box height={!isAddAppointment ? "100%" : 0}>
                            {" "}
                            <PatientDetailsToolbar
                                onClose={() => {
                                    dispatch(onOpenDetails({patientId: ""}));
                                    setopen(false);
                                }}
                            />
                            <PatientdetailsCard/>
                            <Box
                                sx={{
                                    width: {md: 726, xs: "100%"},
                                    bgcolor: "background.default",
                                    "& div[role='tabpanel']": {
                                        height: {md: "calc(100vh - 312px)", xs: "auto"},
                                        overflowY: "auto",
                                    },
                                }}>
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
                                <Divider/>
                                <TabPanel padding={1} value={value} index={0}>
                                    <PersonalInfoPanel/>
                                </TabPanel>
                                <TabPanel padding={1} value={value} index={1}>
                                    {data.length > 0 ? (
                                        <GroupTable from="patient" data={data}/>
                                    ) : (
                                        <NoDataCard t={t} data={AddAppointmentCardData}/>
                                    )}
                                </TabPanel>
                                <TabPanel padding={2} value={value} index={2}>
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
                                        onClick={() => setAddAppointment(!isAddAppointment)}
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
                                    onClick={() => setAddAppointment(!isAddAppointment)}
                                    actions={actions}
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
                            {/*                            <CustomStepper
                                currentIndex={0}
                                stepperData={stepperData}
                                scroll
                                t={t}
                                minWidth={726}
                                onClickCancel={() => setAddAppointment(false)}
                            />*/}
                        </Box>
                    </Zoom>
                </Drawer>
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'patient']))
    }
})
export default Patient;

Patient.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
