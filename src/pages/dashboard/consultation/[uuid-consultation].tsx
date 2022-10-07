import React, {memo, ReactElement, useEffect, useState} from 'react';
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Document, Page, pdfjs} from "react-pdf";
import {configSelector, DashLayout} from "@features/base";
import {ConsultationIPToolbar, SetExam, SetMutation, SetPatient} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";
import {Dialog, DialogProps} from "@features/dialog";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogActions, Drawer, Grid, Stack} from "@mui/material";
import {ConsultationDetailCard, PendingDocumentCard} from "@features/card";
import {CustomStepper} from "@features/customStepper";
import IconUrl from "@themes/urlIcon";
import {DrawerBottom} from "@features/drawerBottom";
import {ConsultationFilter} from "@features/leftActionBar";
import {agendaSelector, openDrawer, setStepperIndex} from "@features/calendar";
import {uniqueId} from 'lodash'
import {DocumentsTab, FeesTab, HistoryTab, Instruction, Patient, TabPanel, TimeSchedule} from "@features/tabPanel";
import CloseIcon from "@mui/icons-material/Close";
import ImageViewer from 'react-simple-image-viewer';
import {Widget} from "@features/widget";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const WidgetForm: any = memo(({src, ...props}: any) => {
        const {modal, setSM, models} = props;
        return (
            <Widget modal={modal} setModal={setSM} models={models}></Widget>
        )
    },
    // NEVER UPDATE
    () => true)
WidgetForm.displayName = "widget-form";

function ConsultationInProgress() {
    const [filterdrawer, setFilterDrawer] = useState(false);
    const [value, setValue] = useState<string>('consultation_form');
    const [file, setFile] = useState('/static/files/sample.pdf');
    const [acts, setActs] = useState<any>('');
    const [total, setTotal] = useState<number>(0);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [open, setopen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [models, setModels] = useState<ModalModel[]>([]);
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
    const [sheet, setSheet] = useState<any>(null);
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
    const [selectedModel, setSelectedModel] = useState<any>(null);

    const {patientId} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {drawer} = useAppSelector((state: { dialog: DialogProps; }) => state.dialog);
    const {openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();

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

    const router = useRouter();
    const {data: session} = useSession();

    const uuind = router.query['uuid-consultation'];
    const medical_entity = (session?.data as UserDataResponse)?.medical_entity as MedicalEntityModel;

    const {data: httpMPResponse} = useRequest(medical_entity ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);
    const {data: httpModelResponse} = useRequest(medical_entity ? {
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/modals/",
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);
    const {data: httpAppResponse, mutate} = useRequest(mpUuid && agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null);
    const {data: httpSheetResponse} = useRequest(mpUuid && agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/consultation-sheet/${router.locale}`,
        headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
    } : null);
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
        if (httpModelResponse)
            setModels((httpModelResponse as HttpResponse).data)
    }, [httpModelResponse])
    useEffect(() => {
        setAppointement((httpAppResponse as HttpResponse)?.data)
    }, [httpAppResponse])

    useEffect(() => {
        if (httpSheetResponse) {
            setSheet((httpSheetResponse as HttpResponse)?.data)
        }
    }, [httpSheetResponse])
    useEffect(() => {
        if (sheet) {
            setSelectedModel(sheet.modal)
            localStorage.setItem('Modeldata', JSON.stringify(sheet.modal.data));
            const app_data = sheet.exam.appointment_data;
            dispatch(SetExam({
                motif: app_data?.consultation_reason ? app_data?.consultation_reason.uuid : '',
                notes: app_data?.notes ? app_data.notes.value : '',
                diagnosis: app_data?.diagnostics ? app_data.diagnostics.value : '',
                treatment: app_data?.treatments ? app_data.treatments.value : '',
            }))
        }
    }, [dispatch, sheet])

    useEffect(() => {
        if (appointement) {
            console.log(appointement)
            setPatient(appointement.patient);
            dispatch(SetPatient(appointement.patient))
            dispatch(SetMutation(mutate))

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
    useEffect(() => {
        if (patientId) {
            setopen(true);
        }
    }, [patientId]);

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

    const onDocumentLoadSuccess = ({numPages}: any) => {
        setNumPages(numPages);
    }
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
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }
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

                <TabPanel value={value} index={'patient_history'}>
                    <HistoryTab patient={patient}
                                appointement={appointement}
                                t={t}
                                appuuid={uuind}
                                setIsViewerOpen={setIsViewerOpen}
                                direction={direction}
                                setInfo={setInfo}
                                mutateDoc={mutateDoc}
                                setState={setState}
                                dispatch={dispatch}
                                setOpenDialog={setOpenDialog}></HistoryTab>
                </TabPanel>
                <TabPanel value={value} index={'mediktor_report'}>
                    <Box sx={{
                        '.react-pdf__Page__canvas': {
                            mx: 'auto'
                        }
                    }}>
                        <Document loading={<></>} file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                            ))}
                        </Document>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={'consultation_form'}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                            {models && <WidgetForm modal={selectedModel}
                                                   models={models}
                                                   setSM={setSelectedModel}></WidgetForm>}
                        </Grid>
                        <Grid item xs={12} md={7}>

                            {sheet && <ConsultationDetailCard exam={sheet.exam}/>}
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={'medical_procedures'}>
                    <FeesTab acts={acts}
                             selectedUuid={selectedUuid}
                             setInfo={setInfo}
                             setState={setState}
                             patient={patient}
                             editAct={editAct}
                             selectedAct={selectedAct}
                             setTotal={selectedAct}
                             setOpenActDialog={setOpenActDialog}
                             setOpenDialog={setOpenDialog}
                             total={total}
                             t={t}></FeesTab>
                </TabPanel>
                <TabPanel value={value} index={'documents'}>
                    <DocumentsTab documents={documents}
                                  setIsViewerOpen={setIsViewerOpen}
                                  setInfo={setInfo}
                                  setState={setState}
                                  patient={patient}
                                  mutateDoc={mutateDoc}
                                  setOpenDialog={setOpenDialog}
                                  t={t}></DocumentsTab>
                </TabPanel>

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
