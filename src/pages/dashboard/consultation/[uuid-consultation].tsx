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
    IconButton, List, Collapse, ListItemIcon
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
    NoDataCard
} from "@features/card";
import {Label} from "@features/label";
import {Otable} from '@features/table';
import {CIPPatientHistoryCard, ConsultationDetailCard, MotifCard} from "@features/card";
import {ModalConsultation} from '@features/modalConsultation';
import {motion, AnimatePresence} from 'framer-motion';
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {AppointmentDetail, DialogProps} from '@features/dialog';
import {useRouter} from "next/router";
import {SetMutation, SetPatient, SetExam, ConsultationIPToolbar} from "@features/toolbar";
import {DrawerBottom} from "@features/drawerBottom";
import {ConsultationFilter} from "@features/leftActionBar";
import IconUrl from "@themes/urlIcon";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import CloseIcon from "@mui/icons-material/Close";
import {uniqueId} from 'lodash'
import ImageViewer from 'react-simple-image-viewer';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

/*const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
};*/

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
/*const filterData = [
    "all",
    "report",
    "analysis",
    "prescription_drugs",
    "medical_imaging",
    "photo",
    "video",
    "audio"
];*/
const noCardData = {
    mainIcon: "ic-doc",
    title: "no-data.event.title",
    description: "no-data.event.description",
    buttonText: "no-data.event.button-text",
    buttonIcon: "ic-doc",
    buttonVariant: "warning",
};

function ConsultationInProgress() {
    const {patientId} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [filterdrawer, setFilterDrawer] = useState(false);
    const {drawer} = useAppSelector((state: { dialog: DialogProps; }) => state.dialog);
    const {openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<string>('consultation_form');
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
    const [appointement, setAppointement] = useState<any>();
    const [patient, setPatient] = useState<any>();
    const [mpUuid, setMpUuid] = useState("");
    const [dialog, setDialog] = useState<string>('')
    const [selectedAct, setSelectedAct] = useState<any[]>([])
    const [selectedUuid, setSelectedUuid] = useState<string[]>([])
    const [pendingDocuments, setPendingDocuments] = useState<any[]>([])
    const [isViewerOpen, setIsViewerOpen] = useState<string>('');
    const [size, setSize] = useState<number>(3);

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
    /*
        const [filter, setfilter] = useState<any>({});
    */
    const [selectedModel, setSelectedModel] = useState<any>(null);

    const {data: session} = useSession();
    let medical_entity: any;

    medical_entity = (session?.data as UserDataResponse)?.medical_entity as MedicalEntityModel;

    const {data: httpMPResponse} = useRequest(medical_entity ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }

    const {data: httpAppResponse, mutate} = useRequest(mpUuid && agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpDocumentResponse, mutate: mutateDoc} = useRequest(mpUuid && agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/documents/${router.locale}`,
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
        if (appointement) {
            console.log(appointement)
            setPatient(appointement.patient);
            setSelectedModel(appointement?.consultation_sheet.modal)
            dispatch(SetPatient(appointement.patient))
            dispatch(SetMutation(mutate))
            const app_data = appointement.consultation_sheet.exam.appointment_data;
            dispatch(SetExam({
                motif: app_data?.consultation_reason ? app_data?.consultation_reason.uuid : '',
                notes: app_data?.notes ? app_data.notes.value : '',
                diagnosis: app_data?.diagnostics ? app_data.diagnostics.value : '',
                treatment: app_data?.treatments ? app_data.treatments.value : '',
            }))

            if (appointement.acts) {
                let sAct: any[] = []
                appointement.acts.map((act: { act_uuid: string, price: number }) => {
                    const actDetect = acts.find((a: { uuid: string }) => a.uuid === act.act_uuid)
                    if (actDetect)
                        sAct.push(actDetect)
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

    /*    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setfilter({
                ...filter,
                [event.target.name]: event.target.checked,
            });
        }*/

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const submitStepper = (index: number) => {
        if (EventStepper.length !== index)
            EventStepper[index].disabled = false;
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

    const closeImageViewer = () => {
        setIsViewerOpen('');
    };

    const {t, ready} = useTranslation("consultation");
    if (!ready) return <>consulation translations...</>;

    return (
        <>
            <SubHeader>
                <ConsultationIPToolbar appuuid={uuind}
                                       mutate={mutate}
                                       mutateDoc={mutateDoc}
                                       pendingDocuments={pendingDocuments}
                                       setPendingDocuments={setPendingDocuments}
                                       dialog={dialog}
                                       appointement={appointement}
                                       selectedAct={selectedAct}
                                       selectedModel={selectedModel}
                                       documents={documents}
                                       agenda={agenda?.uuid}
                                       setDialog={setDialog}
                                       endingDocuments={setPendingDocuments}
                                       selected={(v: string) => setValue(v)}/>
            </SubHeader>
            <Box className="container">
                <AnimatePresence exitBeforeEnter>
                    {
                        value === 'patient_history' &&
                        <TabPanel index={0}>
                            <Stack spacing={2} mb={2} alignItems="flex-start">
                                {patient?.nextAppointments.length > 0 &&
                                    <Label variant="filled" color="warning">{t("next_meeting")}</Label>}
                                {
                                    patient?.nextAppointments.slice(0, size).map((data: any, index: number) => (
                                        <React.Fragment key={`patient-${index}`}>
                                            <HistoryCard row={data} patient={patient} t={t}/>
                                        </React.Fragment>
                                    ))
                                }
                            </Stack>
                            {size < patient?.nextAppointments.length &&
                                <Button style={{marginBottom: 10, marginTop: -10, fontSize: 12}} onClick={() => {
                                    setSize(patient?.nextAppointments.length)
                                }}>{t('showAll')}</Button>}

                            <Stack spacing={2}>
                                {
                                    <CIPPatientHistoryCard data={appointement?.latestAppointment}>
                                        <Stack spacing={2}>
                                            {appointement &&
                                                <MotifCard data={appointement?.latestAppointment}/>
                                            }
                                            <List dense>
                                                {
                                                    [
                                                        {
                                                            id: 1,
                                                            title: 'treatment_medication',
                                                            icon: 'ic-traitement',
                                                            type: 'treatment',
                                                            drugs: [
                                                                {
                                                                    id: 1,
                                                                    name: "Doliprane 1000",
                                                                    dosage: "dosage_unit",
                                                                    duration: 10,
                                                                },
                                                                {
                                                                    id: 2,
                                                                    name: "Doliprane 1000",
                                                                    dosage: "dosage_unit",
                                                                    duration: 10,
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            id: 2,
                                                            title: 'documents',
                                                            icon: 'ic-document',
                                                            type: 'document',
                                                            documents: [
                                                                'document_1',
                                                                'document_2',
                                                            ]
                                                        },
                                                        {
                                                            id: 3,
                                                            title: 'bal_sheet_req',
                                                            icon: 'ic-document',
                                                            type: 'req-sheet',

                                                        }
                                                    ].map((col, idx) => (
                                                        <React.Fragment key={`list-item-${idx}`}>
                                                            <>
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
                                                                        <IconUrl path={col.icon}/>
                                                                    </ListItemIcon>
                                                                    <Typography variant='body2' fontWeight={700}>
                                                                        {t(col.title)}
                                                                    </Typography>
                                                                    <IconButton size="small" sx={{ml: 'auto'}}>
                                                                        <IconUrl path="ic-expand-more"/>
                                                                    </IconButton>
                                                                </ListItem>

                                                                <ListItem sx={{p: 0}}>
                                                                    <Collapse in={collapse === col.id} sx={{width: 1}}>
                                                                        {col.type === "treatment" && appointement?.latestAppointment && appointement?.latestAppointment.treatments.map((treatment: any, idx: number) => (
                                                                            <Box key={`list-treatement-${idx}`} sx={{
                                                                                bgcolor: theme => theme.palette.grey['A100'],
                                                                                mb: 1,
                                                                                padding: 2,
                                                                                borderRadius: 0.7
                                                                            }}>
                                                                                <p style={{
                                                                                    margin: 0,
                                                                                    fontSize: 13
                                                                                }}>{treatment.name}</p>
                                                                                <p style={{
                                                                                    margin: 0,
                                                                                    color: 'gray',
                                                                                    fontSize: 12,
                                                                                    marginLeft: 15
                                                                                }}>• {treatment.dosage}</p>
                                                                                <p style={{
                                                                                    margin: 0,
                                                                                    color: 'gray',
                                                                                    fontSize: 12,
                                                                                    marginLeft: 15
                                                                                }}>• {treatment.duration} {t(treatment.durationType)}</p>
                                                                            </Box>
                                                                        ))}
                                                                        {col.type === "treatment" && (appointement?.latestAppointment == null || appointement?.latestAppointment.treatments.length == 0) &&
                                                                            <p style={{
                                                                                fontSize: 12,
                                                                                color: "gray",
                                                                                textAlign: "center"
                                                                            }}>Aucun traitement</p>}

                                                                        {col.type === "req-sheet" && appointement?.latestAppointment.requestedAnalyses && appointement?.latestAppointment.requestedAnalyses.map((reqSheet: any, idx: number) => (
                                                                            <Box key={`req-sheet-item-${idx}`} sx={{
                                                                                bgcolor: theme => theme.palette.grey['A100'],
                                                                                mb: 1,
                                                                                padding: 2,
                                                                                borderRadius: 0.7
                                                                            }}>
                                                                                {reqSheet.hasAnalysis.map((rs: any, idx: number) => (
                                                                                    <p key={`req-sheet-p-${idx}`}
                                                                                       style={{
                                                                                           margin: 0,
                                                                                           fontSize: 12
                                                                                       }}>{rs.analysis.name}</p>
                                                                                ))}
                                                                            </Box>
                                                                        ))}
                                                                        {col.type === "req-sheet" && (appointement?.latestAppointment == null || appointement?.latestAppointment.requestedAnalyses.length == 0) &&
                                                                            <p style={{
                                                                                fontSize: 12,
                                                                                color: "gray",
                                                                                textAlign: "center"
                                                                            }}>Aucune demande</p>}

                                                                        {
                                                                            col.type === "document" && appointement?.latestDocument.length > 0 &&
                                                                            <Box style={{padding: 20, paddingTop: 25}}>
                                                                                <Grid container spacing={2} sx={{
                                                                                    bgcolor: theme => theme.palette.grey['A100'],
                                                                                    mb: 1,
                                                                                    padding: 2,
                                                                                    borderRadius: 0.7
                                                                                }}>
                                                                                    {
                                                                                        appointement?.latestDocument.map((card: any) =>
                                                                                            <Grid item xs={3}
                                                                                                  key={`doc-item-${card.uuid}`}>
                                                                                                <DocumentCard
                                                                                                    data={card}
                                                                                                    style={{width: 30}}
                                                                                                    onClick={() => {
                                                                                                        if (card.documentType === 'photo') {
                                                                                                            setIsViewerOpen(card.uri)
                                                                                                        } else {
                                                                                                            setInfo('document_detail')
                                                                                                            let info = card
                                                                                                            switch (card.documentType) {
                                                                                                                case "prescription":
                                                                                                                    info = card.prescription[0].prescription_has_drugs;
                                                                                                                    break;
                                                                                                                case "requested-analysis":
                                                                                                                    info = card.requested_Analyses[0].analyses;
                                                                                                                    break;
                                                                                                            }
                                                                                                            setState({
                                                                                                                uuid: card.uuid,
                                                                                                                uri: card.uri,
                                                                                                                name: card.title,
                                                                                                                type: card.documentType,
                                                                                                                info: info,
                                                                                                                patient: patient.firstName + ' ' + patient.lastName,
                                                                                                                mutate: mutateDoc
                                                                                                            })
                                                                                                            setOpenDialog(true);
                                                                                                        }
                                                                                                    }} t={t}/>
                                                                                            </Grid>
                                                                                        )
                                                                                    }
                                                                                </Grid>
                                                                            </Box>
                                                                        }


                                                                        {col.type === "document" && (appointement?.latestDocument === null || appointement?.latestDocument.length === 0) &&
                                                                            <p style={{
                                                                                fontSize: 12,
                                                                                color: "gray",
                                                                                textAlign: "center"
                                                                            }}>Aucun document</p>}
                                                                    </Collapse>
                                                                </ListItem>
                                                            </>


                                                        </React.Fragment>
                                                    ))
                                                }
                                            </List>

                                        </Stack>
                                    </CIPPatientHistoryCard>

                                }
                            </Stack>

                            {/*<Stack spacing={1} mb={1} marginTop={3}>
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
                            </Stack>*/}

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
                        value === 'mediktor_report' &&
                        <TabPanel index={1}>
                            <Box sx={{
                                '.react-pdf__Page__canvas': {
                                    mx: 'auto'
                                }
                            }}>
                                <Document
                                    loading={<>loading...</>}
                                    file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                                    ))}
                                </Document>
                            </Box>
                        </TabPanel>
                    }
                    {
                        value === "consultation_form" &&
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
                        value === 'medical_procedures' &&
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
                                            disabled={selectedAct.length == 0}
                                            onClick={() => {
                                                setInfo('document_detail')
                                                setState({
                                                    type: 'fees',
                                                    name: 'note_fees',
                                                    info: selectedAct,
                                                    patient: patient.firstName + ' ' + patient.lastName
                                                })
                                                setOpenDialog(true);
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
                        value === 'documents' &&
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
                                        <React.Fragment key={`doc-item-${idx}`}>
                                            <DocumentCard data={card} onClick={() => {
                                                if (card.documentType === 'photo') {
                                                    console.log(card)
                                                    setIsViewerOpen(card.uri)
                                                } else {
                                                    setInfo('document_detail')
                                                    let info = card
                                                    switch (card.documentType) {
                                                        case "prescription":
                                                            info = card.prescription[0].prescription_has_drugs;
                                                            break;
                                                        case "requested-analysis":
                                                            info = card.requested_Analyses[0].analyses;
                                                            break;
                                                    }
                                                    setState({
                                                        uuid: card.uuid,
                                                        uri: card.uri,
                                                        name: card.title,
                                                        type: card.documentType,
                                                        info: info,
                                                        patient: patient.firstName + ' ' + patient.lastName,
                                                        mutate: mutateDoc
                                                    })
                                                    setOpenDialog(true);
                                                }
                                            }} t={t}/>
                                        </React.Fragment>
                                    )
                                }


                            </Box>
                            {documents.length === 0 && (
                                <NoDataCard t={t} ns={"consultation"} data={noCardData}/>
                            )}
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
                            minWidth={726}/>
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
                        data={{state, setState, setDialog, setOpenDialog}}
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

            {isViewerOpen.length > 0 && (
                <ImageViewer
                    src={[isViewerOpen, isViewerOpen]}
                    currentIndex={0}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(6, 150, 214,0.5)"
                    }}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                />
            )}
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
        fallback: 'blocking' //indicates the type of fallback
    }
}
export default ConsultationInProgress;
ConsultationInProgress.auth = true;
ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
