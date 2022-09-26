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
    ListItem, Button,
    DialogActions,
    FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import {Dialog, openDrawer as DialogOpenDrawer} from "@features/dialog";
import {CustomStepper} from "@features/customStepper";
import {TimeSchedule, Patient, Instruction} from "@features/tabPanel";

//components
import {DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {SubFooter} from '@features/subFooter';
import {
    CipMedicProCard,
    DocumentCard,
    PendingDocumentCard,
    HistoryCard,
} from "@features/card";
import {Label} from "@features/label";
import {Otable} from '@features/table';
import {CIPPatientHistoryCard, CIPPatientHistoryCardData, ConsultationDetailCard, MotifCard} from "@features/card";
import {ModalConsultation} from '@features/modalConsultation';
import {ConsultationIPToolbar} from '@features/toolbar';
import {motion, AnimatePresence} from 'framer-motion';
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {AppointmentDetail, DialogProps} from '@features/dialog';
import {useRouter} from "next/router";
import {SetMutation, SetPatient} from "@features/toolbar/components/consultationIPToolbar/actions";
import {DrawerBottom} from "@features/drawerBottom";
import {ConsultationFilter} from "@features/leftActionBar";
import IconUrl from "@themes/urlIcon";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import CloseIcon from "@mui/icons-material/Close";
import {uniqueId} from 'lodash'
import {SetExam} from "@features/toolbar/components/consultationIPToolbar/actions";

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
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },

];

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
const filterData = [
    "all",
    "report",
    "analysis",
    "prescription_drugs",
    "medical_imaging",
    "photo",
    "video",
    "audio"
];

function ConsultationInProgress() {
    const {patientId} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const [filterdrawer, setFilterDrawer] = useState(false);
    const {drawer} = useAppSelector((state: { dialog: DialogProps; }) => state.dialog);
    const {openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>(0);
    const [collapse, setCollapse] = useState<any>('');
    const [file, setFile] = useState('/static/files/sample.pdf');
    const [acts, setActs] = useState<any>('');
    const [total, setTotal] = useState<number>(0);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [open, setopen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openActDialog, setOpenActDialog] = useState<boolean>(false);
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>('');
    const [agenda, setAgenda] = useState<string>('');
    const [appointement, setAppointement] = useState<any>();
    const [patient, setPatient] = useState<any>();
    const [mpUuid, setMpUuid] = useState("");
    const [dialog, setDialog] = useState<string>('')
    const [selectedAct, setSelectedAct] = useState<any[]>([])
    const [selectedUuid, setSelectedUuid] = useState<string[]>([])
    const [pendingDocuments, setPendingDocuments] = useState<any[]>([])
    const router = useRouter();
    const uuind = router.query['uuid-consultation'];
    const [stateAct, setstateAct] = useState({
        "uuid": "",
        "isTopAct": true,
        fees: 0,
        "act": {
            "uuid": "",
            "name": "",
            "description": "",
            "weight": 0
        }
    });
    const [filter, setfilter] = useState<any>({});
    const [selectedModel, setSelectedModel] = useState<any>(null);

    const {data: session, status} = useSession();
    const loading = status === 'loading';
    let medical_entity: any;

    medical_entity = (session?.data as UserDataResponse)?.medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest(medical_entity ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        if (httpAgendasResponse)
            setAgenda((httpAgendasResponse as HttpResponse)?.data.find((agenda: AgendaConfigurationModel) => agenda.isDefault).uuid)
    }, [httpAgendasResponse])

    const {data: httpMPResponse, error: errorHttpMP} = useRequest(medical_entity ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }

    const {data: httpAppResponse, error: errorHttpApp, mutate} = useRequest(mpUuid ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda}/appointments/${uuind}/professionals/${mpUuid}/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpDocumentResponse, error: errorHttpDoc, mutate: mutateDoc} = useRequest(mpUuid ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda}/appointments/${uuind}/documents/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        if (httpDocumentResponse)
            setDocuments((httpDocumentResponse as HttpResponse).data)
    }, [httpDocumentResponse])

    useEffect(() => {
        setAppointement((httpAppResponse as HttpResponse)?.data)
    }, [httpAppResponse])

    useEffect(() => {
        console.log(appointement)
        if (appointement) {
            setPatient(appointement.patient);
            setSelectedModel(appointement?.consultation_sheet.modal)
            dispatch(SetPatient(appointement.patient))
            dispatch(SetMutation(mutate))
            const app_data = appointement.consultation_sheet.exam.appointment_data;
            dispatch(SetExam({
                motif: '',
                notes: app_data?.notes ? app_data.notes.value : '',
                diagnosis: app_data?.diagnostic ? app_data.diagnostic.value : '',
                treatment: app_data?.treatment ? app_data.treatment.value : '',
            }))

            if (appointement.acts) {
                let sAct: any[] = []
                appointement.acts.map((act: { act_uuid: string, price: number }) => {
                    sAct.push(acts.find((a: { uuid: string }) => a.uuid === act.act_uuid))
                })
                setSelectedAct(sAct)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointement, dispatch, mutate])

    useEffect(() => {
        setMpUuid((httpMPResponse as HttpResponse)?.data[0].medical_professional.uuid);
        setActs((httpMPResponse as HttpResponse)?.data[0].acts)
    }, [httpMPResponse])

    const openDialogue = (id: number) => {

        switch (id) {
            case 1:
                setDialog('balance_sheet_request')
                break;
            case 2:
                setDialog('draw_up_an_order')
                break;

        }
    }

    const onDocumentLoadSuccess = ({numPages}: any) => {
        setNumPages(numPages);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilter({
            ...filter,
            [event.target.name]: event.target.checked,
        });

    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        }
    }

    const handleCloseDialogAct = () => {
        setOpenActDialog(false);
    }

    const handleSaveDialog = () => {
        setOpenDialog(false);
        setActs([
            ...acts,
            {
                ...stateAct,
                uuid: uniqueId()
            },

        ])
    }

    useEffect(() => {
        console.log('useEffect', selectedAct)

        let fees = 0;
        let uuids: string[] = [];
        selectedAct.map(act => {
            uuids.push(act.uuid)
            fees += act.fees
        })
        setTotal(fees)
        setSelectedUuid(uuids)

    }, [selectedAct, appointement])

    const editAct = (row: any, from: any) => {
        if (from === 'change') {
            const index = selectedAct.findIndex(act => act.uuid === row.uuid)
            selectedAct[index] = row
            setSelectedAct([...selectedAct])

        } else if (from === 'checked') {

        } else {
            if (from) {
                const index = selectedAct.findIndex(act => act.uuid === row.uuid)
                setSelectedAct([...selectedAct.slice(0, index), ...selectedAct.slice(index + 1, selectedAct.length)]);
            } else
                setSelectedAct([...selectedAct, row]);
        }

    }

    useEffect(() => {
        if (patientId) {
            setopen(true);
        }
    }, [patientId]);


    const {t, ready} = useTranslation("consultation");
    if (!ready || loading) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <ConsultationIPToolbar appuuid={uuind}
                                       mutate={mutate}
                                       mutateDoc={mutateDoc}
                                       pendingDocuments={pendingDocuments}
                                       setPendingDocuments={setPendingDocuments}
                                       dialog={dialog}
                                       selectedAct={selectedAct}
                                       selectedModel={selectedModel}
                                       documents={documents}
                                       agenda={agenda}
                                       setDialog={setDialog}
                                       endingDocuments={setPendingDocuments}
                                       selected={(v: number) => setValue(v)}/>
            </SubHeader>
            <Box className="container">
                <AnimatePresence exitBeforeEnter>
                    {
                        value === 0 &&
                        <TabPanel index={0}>
                            <Stack spacing={2} mb={2} alignItems="flex-start">
                                {patient?.nextAppointments.length > 0 &&
                                    <Label variant="filled" color="warning">{t("next_meeting")}</Label>}
                                {
                                    patient?.nextAppointments.map((data: any, index: number) => (
                                        <React.Fragment key={`patient-${index}`}>
                                            <HistoryCard row={data} patient={patient} t={t}/>
                                        </React.Fragment>
                                    ))
                                }
                            </Stack>
                            <Stack spacing={1} mb={1}>
                                <Typography variant="body2">
                                    {t("document_type")}
                                </Typography>
                                <FormGroup row>
                                    {
                                        filterData.map((item: any, idx: number) =>
                                            <FormControlLabel
                                                key={idx}
                                                control={
                                                    <Checkbox checked={filter[item]} onChange={handleChange}
                                                              name={filter[item]}/>
                                                }
                                                label={t(item)}
                                            />
                                        )
                                    }

                                </FormGroup>
                            </Stack>

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

                            <Drawer
                                anchor={"right"}
                                open={drawer}
                                dir={direction}
                                onClose={() => {
                                    dispatch(DialogOpenDrawer(false))
                                }}
                            >
                                <AppointmentDetail/>
                            </Drawer>
                        </TabPanel>
                    }
                    {
                        value === 1 &&
                        <TabPanel index={1}>
                            <Box sx={{
                                '.react-pdf__Page__canvas': {
                                    mx: 'auto'
                                }
                            }}>
                                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                                    ))}
                                </Document>
                            </Box>
                        </TabPanel>
                    }
                    {
                        value === 2 &&
                        <TabPanel index={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <ModalConsultation
                                        modal={selectedModel}
                                        setSM={setSelectedModel}/>
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
                                    select={selectedUuid}
                                    from={"CIP-medical-procedures"}
                                    t={t}
                                    edit={editAct}
                                    handleConfig={null}
                                    handleChange={setTotal}/>
                            </Box>
                            <Stack spacing={2} display={{xs: "block", md: 'none'}}>
                                {
                                    acts?.map((data: any, index: number) => (
                                        <React.Fragment key={`cip-card-${index}`}>
                                            <CipMedicProCard row={data} t={t}/>
                                        </React.Fragment>
                                    ))
                                }

                            </Stack>

                            <Button
                                onClick={() => setOpenActDialog(true)}
                                size='small' sx={{
                                '& .react-svg svg': {
                                    width: theme => theme.spacing(1.5),
                                    path: {fill: theme => theme.palette.primary.main}
                                }
                            }} startIcon={<IconUrl path="ic-plus"/>}>{t("consultationIP.add_a_new_act")}</Button>
                            <Box pt={8}/>
                            <SubFooter>
                                <Stack spacing={2} direction="row" alignItems="center" width={1}
                                       justifyContent="flex-end">
                                    <Typography variant="subtitle1">
                                        <span>{t('total')} : </span>
                                    </Typography>
                                    <Typography fontWeight={600} variant="h6">
                                        {selectedAct.length > 0 ? total : '--'} TND
                                    </Typography>
                                    <Stack direction='row' alignItems="center" spacing={2}>
                                        <span>|</span>
                                        <Button
                                            variant='text-black'
                                            onClick={() => {
                                                console.log(selectedAct)
                                            }
                                            }
                                            startIcon={
                                                <IconUrl path='ic-imprime'/>
                                            }>

                                            {t("consultationIP.print")}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </SubFooter>
                        </TabPanel>
                    }
                    {
                        value === 4 &&
                        <TabPanel index={4}>
                            <Box display='grid' sx={{
                                gridGap: 16,
                                gridTemplateColumns: {
                                    xs: "repeat(2,minmax(0,1fr))",
                                    md: "repeat(4,minmax(0,1fr))",
                                    lg: "repeat(5,minmax(0,1fr))",
                                }
                            }}>
                                {
                                    documents.map((card: any, idx) =>
                                        <React.Fragment key={idx}>
                                            <DocumentCard data={card} onClick={() => {
                                                setInfo('document_detail')
                                                setState({
                                                    uuid: card.uuid,
                                                    uri: card.uri,
                                                    name: card.title,
                                                    type: card.documentType,
                                                    info: card.documentType === "prescription" ? card.prescription[0].prescription_has_drugs : card,
                                                    patient: patient.firstName + ' ' + patient.lastName
                                                })
                                                setOpenDialog(true);
                                            }} t={t}/>
                                        </React.Fragment>
                                    )
                                }


                            </Box>

                        </TabPanel>
                    }
                </AnimatePresence>
                <Stack direction={{md: 'row', xs: 'column'}} position="fixed" sx={{right: 10, bottom: 10, zIndex: 999}}
                       spacing={2}>
                    {
                        pendingDocuments?.map((item: any) =>
                            <React.Fragment key={item.id}>
                                <PendingDocumentCard data={item}
                                                     t={t}
                                                     onClick={() => {
                                                         openDialogue(item.id)
                                                     }}
                                                     closeDocument={(v: number) =>
                                                         setPendingDocuments(pendingDocuments.filter(((card: any) => card.id !== v)))
                                                     }/>
                            </React.Fragment>
                        )
                    }

                </Stack>
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
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
                    onClick={() => setFilterDrawer(!drawer)}
                    sx={{
                        position: 'fixed',
                        bottom: 50,
                        transform: 'translateX(-50%)',
                        left: '50%',
                        zIndex: 999,
                        display: {xs: 'flex', md: 'none'}
                    }}
                    variant="filter"
                >
                    Filtrer (0)
                </Button>
                <DrawerBottom
                    handleClose={() => setFilterDrawer(false)}
                    open={filterdrawer}
                    title={null}
                >
                    <ConsultationFilter/>
                </DrawerBottom>

                <Dialog action={'add_act'}
                        open={openActDialog}
                        data={{stateAct, setstateAct, setDialog, t}}
                        size={"sm"}
                        direction={'ltr'}
                        title={t('consultationIP.add_a_new_act')}
                        dialogClose={handleCloseDialogAct}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={handleCloseDialogAct}
                                        startIcon={<CloseIcon/>}>
                                    {t('cancel')}
                                </Button>
                                <Button variant="contained"
                                        onClick={handleSaveDialog}

                                        startIcon={<IconUrl
                                            path='ic-dowlaodfile'/>}>
                                    {t('save')}
                                </Button>
                            </DialogActions>
                        }/>
            </Box>
            {
                info &&
                <Dialog action={info}
                        open={openDialog}
                        data={{state, setState, setDialog}}
                        size={"lg"}
                        direction={'ltr'}
                        {...(info === "document_detail" && {
                            sx: {p: 0}
                        })}
                        title={t(info === "document_detail" ? "doc_detail_title" : info)}
                        {
                            ...(info === "document_detail" && {
                                onClose: handleCloseDialog
                            })
                        }
                        dialogClose={handleCloseDialog}
                />
            }
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    return ({
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, [
                "consultation",
                "menu",
                "common",
                "agenda"
            ]))
        }
    })
};
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}
export default ConsultationInProgress;

ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
