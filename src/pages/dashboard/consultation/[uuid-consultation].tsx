import React, {useState, useEffect} from 'react';
import {GetStaticProps, GetStaticPaths} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Document, Page, pdfjs} from "react-pdf";
// redux
import {useAppSelector, useAppDispatch} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import {tableActionSelector} from "@features/table";
import {agendaSelector, openDrawer, setStepperIndex} from "@features/calendar";

import {ReactElement} from "react";
import {
    Box,
    Drawer,
    Stack,
    Grid,
    Typography,
    ListItem,
} from "@mui/material";
import {openDrawer as DialogOpenDrawer} from "@features/dialog";
import {CustomStepper} from "@features/customStepper";
import {TimeSchedule, Patient, Instruction} from "@features/tabPanel";

//components
import {DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {SubFooter} from '@features/subFooter';
import {CipNextAppointCard, CipMedicProCard} from "@features/card";
import {Otable} from '@features/table';
import {CIPPatientHistoryCard, CIPPatientHistoryCardData, ConsultationDetailCard, MotifCard} from "@features/card";
import {ModalConsultation} from '@features/modalConsultation';
import {ConsultationIPToolbar} from '@features/toolbar';
import {motion, AnimatePresence} from 'framer-motion';
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {AppointmentDetail, DialogProps} from '@features/dialog';
import {useRouter} from "next/router";
import {consultationSelector} from "@features/toolbar/components/consultationIPToolbar/selectors";
import {SetPatient} from "@features/toolbar/components/consultationIPToolbar/actions";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const variants = {
    initial: {opacity: 0,},
    animate: {
        opacity: 1,
        transition: {
            delay: 0.1,
        }
    }
};

function TabPanel(props: TabPanelProps) {
    const {children, index, ...other} = props;

    return (
        <motion.div
            key={index}
            variants={variants}
            initial="initial"
            animate={"animate"}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </motion.div>
    );
}

// Patient data for table body
const PatiendData = [
    {
        id: 1,
        acts: "consultation",
        defaultAmount: 100,
        amount: 100,
    },
    {
        id: 2,
        acts: "consultation-1",
        defaultAmount: 200,
        amount: 200,
    },
    {
        id: 3,
        acts: "consultation-2",
        defaultAmount: 200,
        amount: 0,
    }
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
        id: "acts",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "defaultAmount",
        numeric: true,
        disablePadding: false,
        label: "default_amount",
        sortable: true,
        align: "left",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },

];
const PatiendData2 = [
    {
        id: 1,
        status: 'confirmed',
        reson: 'check',
        time: '10:00',
        length: '30/02/2022',
    },
    {
        id: 2,
        status: 'confirmed',
        reson: 'check',
        time: '11:00',
        length: '31/02/2022',
    },
];
const headCells2: readonly HeadCell[] = [
    {
        id: "time",
        numeric: false,
        disablePadding: true,
        label: "time",
        sortable: true,
        align: "left",
    },
    {
        id: "reason",
        numeric: true,
        disablePadding: false,
        label: "reason",
        sortable: true,
        align: "left",
    },
    {
        id: "length",
        numeric: true,
        disablePadding: false,
        label: "duration",
        sortable: true,
        align: "left",
    },
    {
        id: "status",
        numeric: true,
        disablePadding: false,
        label: "status",
        sortable: true,
        align: "left",
    },
    {
        id: "patient",
        numeric: true,
        disablePadding: false,
        label: "patient",
        sortable: true,
        align: "left",
    },
    {
        id: "agenda",
        numeric: true,
        disablePadding: false,
        label: "agenda",
        sortable: true,
        align: "left",
    },
    {
        id: "action",
        numeric: true,
        disablePadding: false,
        label: "action",
        sortable: false,
        align: "left",
    },

];
const event = {
    "title": "Osinski Tressa",
    "groupId": "",
    "publicId": "9b188379-88b8-4463-a633-78357cf35ce4",
    "url": "",
    "recurringDef": null,
    "defId": "58",
    "sourceId": "24",
    "allDay": false,
    "hasEnd": true,
    "ui": {
        "display": null,
        "constraints": [],
        "overlap": null,
        "allows": [],
        "backgroundColor": "",
        "borderColor": "#1BC47D",
        "textColor": "",
        "classNames": []
    },
    "extendedProps": {
        "time": "2022-08-26T03:15:00.000Z",
        "patient": {
            "uuid": "0f0724b4-f0ce-3e60-b42b-f168191e3754",
            "email": "tomas.mertz@example.com",
            "birthdate": "11-08-2020",
            "firstName": "Tressa",
            "lastName": "Osinski",
            "gender": "O"
        },
        "motif": {
            "uuid": "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
            "name": "mutate",
            "duration": 15,
            "color": "#1BC47D"
        },
        "description": "",
        "meeting": false,
        "status": "Confirmed"
    }
}
const EventStepper = [
    {
        title: "steppers.tabs.tab-2",
        children: TimeSchedule,
        disabled: true
    }, {
        title: "steppers.tabs.tab-3",
        children: Patient,
        disabled: true
    }, {
        title: "steppers.tabs.tab-4",
        children: Instruction,
        disabled: true
    }
];

function ConsultationInProgress() {
    const {patientId} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {drawer} = useAppSelector((state: { dialog: DialogProps; }) => state.dialog);
    const {openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>(0);
    const [collapse, setCollapse] = useState<any>('');
    const [file, setFile] = useState('/static/files/sample.pdf');
    const [acts, setActs] = useState<any>('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const [open, setopen] = useState(false);
    const [appointement, setAppointement] = useState<any>();
    const [mpUuid, setMpUuid] = useState("");

    const router = useRouter();

    const {examan, fiche, patient: patientInfo} = useAppSelector(consultationSelector);

    useEffect(() => {
        if (examan) console.log(examan);
    }, [examan]);
    useEffect(() => {
        if (fiche) console.log(fiche);
    }, [fiche]);

    const {data: session, status} = useSession();
    const loading = status === 'loading';
    let medical_entity: MedicalEntityModel | null = null;

    const {trigger} = useRequestMutation(null, "/consultation/", {revalidate: true, populateCache: false});

    useEffect(() => {
        if (medical_entity) {
            trigger({
                method: "GET",
                url: "/api/medical-entity/" + medical_entity?.uuid + "/professionals/" + router.locale,
                headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
            }, {revalidate: true, populateCache: true}).then(res => {
                setMpUuid((res?.data as HttpResponse).data[0].medical_professional.uuid);
                setActs((res?.data as HttpResponse).data[0].acts)
            })

        }
    }, [dispatch, medical_entity, router.locale, session?.accessToken, trigger])

    useEffect(() => {
        if (mpUuid)
            trigger({
                method: "GET",
                url: "/api/medical-entity/" + medical_entity?.uuid + "/agendas/" + "15d49355-95e3-3dbd-a03d-30c85b50de6f" + "/appointments/" + "7dc59951-b54b-41ee-b190-0f8b0508cd3d/professionals/" + mpUuid +'/'+ router.locale,
                headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
            }, {revalidate: true, populateCache: true}).then(res => {
                setAppointement((res?.data as HttpResponse).data)
                dispatch(SetPatient((res?.data as HttpResponse).data.appointment.patient))
            })
    }, [dispatch, medical_entity, mpUuid, router.locale, session?.accessToken, trigger])

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    };
    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        }
    }


    useEffect(() => {
        if (patientId) {
            setopen(true);
        }
    }, [patientId]);
    const {t, ready} = useTranslation("consultation");
    if (!ready || loading) return <>loading translations...</>;
    const {data: user} = session as Session;
    medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    return (
        <>
            <SubHeader>
                <ConsultationIPToolbar selected={(v: number) => setValue(v)}/>
            </SubHeader>
            <Box className="container">
                <AnimatePresence exitBeforeEnter>

                    {value === 0 &&
                        <TabPanel index={0}>
                            <Stack spacing={2}>
                                {
                                    CIPPatientHistoryCardData.map((data, index: number) => (

                                        <CIPPatientHistoryCard data={data} key={`card-${index}`}>
                                            {
                                                data.title === "reason_for_consultation" &&

                                                <Stack spacing={2}>
                                                    <MotifCard data={data}/>
                                                    {/*<List dense>
                                                        {
                                                            data.collapse?.map((col, idx: number) => (
                                                                <React.Fragment key={`list-item-${idx}`}>
                                                                    <ListItem
                                                                        onClick={() => setCollapse(collapse === col.id ? "" : col.id)}
                                                                        sx={{
                                                                            cursor: "pointer",
                                                                            borderTop: 1,
                                                                            borderColor: 'divider',
                                                                            px: 0,
                                                                            '& .MuiListItemIcon-root': {
                                                                                minWidth: 20,
                                                                                svg: {
                                                                                    width: 14,
                                                                                    height: 14,
                                                                                }
                                                                            }
                                                                        }}>

                                                                        <ListItemIcon>
                                                                            <Icon path={col.icon}/>
                                                                        </ListItemIcon>
                                                                        <Typography variant='body2' fontWeight={700}>
                                                                            {t(col.title)}
                                                                        </Typography>
                                                                        <IconButton size="small" sx={{ml: 'auto'}}>
                                                                            <Icon path="ic-expand-more"/>
                                                                        </IconButton>
                                                                    </ListItem>
                                                                    <ListItem
                                                                        sx={{p: 0}}
                                                                    >
                                                                        <Collapse in={collapse === col.id}
                                                                                  sx={{width: 1}}>
                                                                            {
                                                                                col.type === "treatment" &&
                                                                                col.drugs?.map((item, i) => (
                                                                                    <React.Fragment
                                                                                        key={`durg-list-${i}`}>
                                                                                        <DrugListCard data={item} t={t}
                                                                                                      list/>
                                                                                    </React.Fragment>
                                                                                ))
                                                                            }
                                                                            {
                                                                                col.type === "document" &&
                                                                                <List sx={{py: 0}}>
                                                                                    {
                                                                                        col.documents?.map((item, i) => (
                                                                                            <ListItem
                                                                                                key={`doc-list${i}`}
                                                                                                sx={{
                                                                                                    bgcolor: theme => theme.palette.grey['A100'],
                                                                                                    mb: 1,
                                                                                                    borderRadius: 0.7
                                                                                                }}>
                                                                                                <Typography
                                                                                                    variant='body2'
                                                                                                    display='flex'
                                                                                                    alignItems="center">
                                                                                                    <CircleIcon sx={{
                                                                                                        fontSize: 5,
                                                                                                        mr: 1
                                                                                                    }}/> {item}
                                                                                                </Typography>
                                                                                                <IconButton size="small"
                                                                                                            sx={{ml: 'auto'}}>
                                                                                                    <Icon
                                                                                                        path="ic-document"/>
                                                                                                </IconButton>
                                                                                            </ListItem>
                                                                                        ))
                                                                                    }
                                                                                </List>
                                                                            }
                                                                        </Collapse>
                                                                    </ListItem>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </List>*/}
                                                </Stack>


                                            }
                                            {
                                                data.title === "balance_results" &&
                                                data.list?.map((item, i) => (
                                                    <ListItem key={`balance-list${i}`}
                                                              sx={{
                                                                  bgcolor: theme => theme.palette.grey['A100'],
                                                                  mb: 1,
                                                                  borderRadius: 0.7
                                                              }}>
                                                        <Typography variant='body2'>
                                                            {item}
                                                        </Typography>
                                                    </ListItem>
                                                ))
                                            }
                                            {
                                                data.title === "vaccine" &&
                                                data.list?.map((item, i) => (
                                                    <ListItem key={`vaccine-list${i}`}>
                                                        <Typography variant='body2'>
                                                            {item}
                                                        </Typography>
                                                    </ListItem>
                                                ))
                                            }
                                        </CIPPatientHistoryCard>

                                    ))}
                            </Stack>
                        </TabPanel>
                    }
                    {value === 1 &&
                        <TabPanel index={1}>
                            <Box sx={{
                                '.react-pdf__Page__canvas': {
                                    mx: 'auto'
                                }
                            }}>
                                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                                    ))}

                                </Document>
                            </Box>
                        </TabPanel>
                    }
                    {value === 2 &&
                        <TabPanel index={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <ModalConsultation modal={appointement?.consultation_sheet.modal}/>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <ConsultationDetailCard exam={appointement?.consultation_sheet.exam}/>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    }
                    {
                        value === 3 &&
                        <TabPanel index={3}>
                            <Box display={{xs: 'none', md: 'block'}}>
                                <Otable
                                    headers={headCells}
                                    rows={acts}
                                    state={null}
                                    from={"CIP-medical-procedures"}
                                    t={t}
                                    edit={null}
                                    handleConfig={null}
                                    handleChange={null}

                                />
                            </Box>
                            <Stack spacing={2} display={{xs: "block", md: 'none'}}>
                                {
                                    PatiendData.map((data, index: number) => (
                                        <React.Fragment key={`cip-card-${index}`}>
                                            <CipMedicProCard row={data} t={t}/>
                                        </React.Fragment>
                                    ))
                                }

                            </Stack>
                            {/*
                            <Button size='small' sx={{
                                '& .react-svg svg': {
                                    width: theme => theme.spacing(1.5),
                                    path: {fill: theme => theme.palette.primary.main}
                                }
                            }} startIcon={<Icon path="ic-plus"/>}>Ajouter un nouveau acte</Button>
*/}
                            <SubFooter>
                                <Stack spacing={2} direction="row" alignItems="center" width={1}
                                       justifyContent="flex-end">
                                    <Typography variant="subtitle1">
                                        <span>{t('total')} : </span>
                                    </Typography>
                                    <Typography fontWeight={600} variant="h6">
                                        -- TND
                                    </Typography>
                                </Stack>

                            </SubFooter>
                        </TabPanel>
                    }
                    {
                        value === 4 &&
                        <TabPanel index={4}>
                            <Box display={{xs: "none", md: 'block'}}>
                                <Otable
                                    headers={headCells2}
                                    rows={PatiendData2}
                                    from={"CIP-next-appointment"}
                                    t={t}
                                    edit={null}
                                    handleConfig={null}
                                    handleChange={null}

                                />
                            </Box>
                            <Stack spacing={2} display={{xs: "block", md: 'none'}}>
                                {
                                    PatiendData2.map((data, index: number) => (
                                        <React.Fragment key={`patient-${index}`}>
                                            <CipNextAppointCard row={data} t={t}/>
                                        </React.Fragment>
                                    ))
                                }

                            </Stack>
                            <Drawer
                                anchor={"right"}
                                open={drawer}
                                dir={direction}
                                onClose={() => {
                                    dispatch(DialogOpenDrawer(false))
                                }}
                            >
                                <AppointmentDetail
                                    data={event}

                                />
                            </Drawer>
                        </TabPanel>
                    }

                </AnimatePresence>
                <Drawer
                    anchor={"right"}
                    open={openAddDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "add", open: false}));

                    }}
                >
                    <Box height={"100%"}>
                        <CustomStepper
                            currentIndex={currentStepper}
                            OnTabsChange={handleStepperChange}
                            OnSubmitStepper={submitStepper}
                            stepperData={EventStepper}
                            scroll
                            t={t}
                            minWidth={726}
                        />
                    </Box>
                </Drawer>
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "consultation",
            "menu",
            "common",
        ])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
export default ConsultationInProgress;

ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
