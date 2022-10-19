import React, {memo, ReactElement, useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Document, Page, pdfjs} from "react-pdf";
import {configSelector, DashLayout} from "@features/base";
import {
    ConsultationIPToolbar,
    consultationSelector,
    SetExam,
    SetMutation,
    SetMutationDoc,
    SetPatient,
} from "@features/toolbar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";
import {Dialog, DialogProps} from "@features/dialog";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogActions, Drawer, Grid, Stack, useTheme,} from "@mui/material";
import {ConsultationDetailCard, PatientHistoryNoDataCard, PendingDocumentCard, setTimer,} from "@features/card";
import {CustomStepper} from "@features/customStepper";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {DrawerBottom} from "@features/drawerBottom";
import {ConsultationFilter} from "@features/leftActionBar";
import {agendaSelector, openDrawer, setStepperIndex,} from "@features/calendar";
import {uniqueId} from "lodash";
import {DocumentsTab, EventType, FeesTab, HistoryTab, Instruction, TabPanel, TimeSchedule,} from "@features/tabPanel";
import CloseIcon from "@mui/icons-material/Close";
import ImageViewer from "react-simple-image-viewer";
import {Widget} from "@features/widget";
import {SubHeader} from "@features/subHeader";
import {SubFooter} from "@features/subFooter";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const WidgetForm: any = memo(
    ({src, ...props}: any) => {
        const {modal, setSM, models} = props;
        return <Widget modal={modal} setModal={setSM} models={models}></Widget>;
    },
    // NEVER UPDATE
    () => true
);
WidgetForm.displayName = "widget-form";

function ConsultationInProgress() {
    const theme = useTheme();
    const [filterdrawer, setFilterDrawer] = useState(false);
    const [value, setValue] = useState<string>("consultation_form");
    const [file, setFile] = useState("/static/files/sample.pdf");
    const [acts, setActs] = useState<any>("");
    const [total, setTotal] = useState<number>(0);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [open, setopen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [models, setModels] = useState<ModalModel[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openActDialog, setOpenActDialog] = useState<boolean>(false);
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [appointement, setAppointement] = useState<any>();
    const [patient, setPatient] = useState<any>();
    const [mpUuid, setMpUuid] = useState("");
    const [dialog, setDialog] = useState<string>("");
    const [selectedAct, setSelectedAct] = useState<any[]>([]);
    const [selectedUuid, setSelectedUuid] = useState<string[]>([]);
    const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
    const [isViewerOpen, setIsViewerOpen] = useState<string>("");
    const [sheet, setSheet] = useState<any>(null);
    const [actions, setActions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [stateAct, setstateAct] = useState({
        uuid: "",
        isTopAct: true,
        fees: 0,
        act: {
            uuid: "",
            name: "",
            description: "",
            weight: 0,
        },
    });
    const [selectedModel, setSelectedModel] = useState<any>(null);

    const {patientId} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {exam} = useAppSelector(consultationSelector);

    const {config: agenda} = useAppSelector(agendaSelector);
    const {drawer} = useAppSelector(
        (state: { dialog: DialogProps }) => state.dialog
    );
    const {openAddDrawer, currentStepper} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const [end, setEnd] = useState(false);
    const [onSave, setOnsave] = useState(false);

    const EventStepper = [
        {
            title: "steppers.tabs.tab-1",
            children: EventType,
            disabled: true,
        },
        {
            title: "steppers.tabs.tab-2",
            children: TimeSchedule,
            disabled: true,
        },
        {
            title: "steppers.tabs.tab-4",
            children: Instruction,
            disabled: true,
        },
    ];

    const router = useRouter();
    const {data: session} = useSession();
    const {trigger} = useRequestMutation(null, "/endConsultation");

    const uuind = router.query["uuid-consultation"];
    const medical_entity = (session?.data as UserDataResponse)
        ?.medical_entity as MedicalEntityModel;

    const {data: httpMPResponse} = useRequest(
        medical_entity
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null
    );
    const {data: httpModelResponse} = useRequest(
        medical_entity
            ? {
                method: "GET",
                url: "/api/medical-entity/" + medical_entity.uuid + "/modals/",
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null,
        SWRNoValidateConfig
    );
    const {data: httpAppResponse, mutate} = useRequest(
        mpUuid && agenda
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null
    );
    const {data: httpSheetResponse} = useRequest(
        mpUuid && agenda
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/professionals/${mpUuid}/consultation-sheet/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null
    );
    const {data: httpDocumentResponse, mutate: mutateDoc} = useRequest(
        mpUuid && agenda
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/documents/${router.locale}`,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null,
        SWRNoValidateConfig
    );

    useEffect(() => {
        if (httpDocumentResponse)
            setDocuments((httpDocumentResponse as HttpResponse).data);
    }, [httpDocumentResponse]);
    useEffect(() => {
        if (httpModelResponse) setModels((httpModelResponse as HttpResponse).data);
    }, [httpModelResponse]);
    useEffect(() => {
        setAppointement((httpAppResponse as HttpResponse)?.data);
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }, [httpAppResponse]);

    useEffect(() => {
        if (httpSheetResponse) {
            setSheet((httpSheetResponse as HttpResponse)?.data);
        }
    }, [httpSheetResponse]);

    useEffect(() => {
        if (sheet) {
            setSelectedModel(sheet.modal);
            localStorage.setItem("Modeldata", JSON.stringify(sheet.modal.data));
            const app_data = sheet.exam.appointment_data;
            dispatch(
                SetExam({
                    motif: app_data?.consultation_reason
                        ? app_data?.consultation_reason.uuid
                        : "",
                    notes: app_data?.notes ? app_data.notes.value : "",
                    diagnosis: app_data?.diagnostics ? app_data.diagnostics.value : "",
                    treatment: app_data?.treatments ? app_data.treatments.value : "",
                })
            );
        }
    }, [dispatch, sheet]);

    useEffect(() => {
        if (appointement) {
            setPatient(appointement.patient);
            dispatch(SetPatient(appointement.patient));
            dispatch(SetMutation(mutate));
            dispatch(SetMutationDoc(mutateDoc));
            if (appointement.acts) {
                let sAct: any[] = [];
                appointement.acts.map(
                    (act: { act_uuid: string; price: any; qte: any }) => {
                        const actDetect = acts.find(
                            (a: { uuid: string }) => a.uuid === act.act_uuid
                        ) as any;

                        if (actDetect) {
                            actDetect.fees = act.price;
                            actDetect.qte = act.qte;
                            sAct.push(actDetect);
                        }
                    }
                );
                setSelectedAct(sAct);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointement, dispatch, mutate]);

    useEffect(() => {
        if (httpMPResponse) {
            const mpRes = (httpMPResponse as HttpResponse)?.data[0];
            setMpUuid(mpRes.medical_professional.uuid);
            setActs(mpRes.acts);
        }
    }, [httpMPResponse]);

    useEffect(() => {
        let fees = 0;
        let uuids: string[] = [];
        selectedAct.map((act) => {
            uuids.push(act.uuid);
            act.qte ? (fees += act.fees * act.qte) : (fees += act.fees);
        });
        setTotal(fees);
        setSelectedUuid(uuids);
    }, [selectedAct, appointement]);

    useEffect(() => {
        if (patientId) {
            setopen(true);
        }
    }, [patientId]);

    useEffect(() => {
        const acts: { act_uuid: any; name: string; qte: any; price: any }[] = [];
        if (end) {
            selectedAct.map(
                (act: { uuid: any; act: { name: string }; qte: any; fees: any }) => {
                    acts.push({
                        act_uuid: act.uuid,
                        name: act.act.name,
                        qte: act.qte,
                        price: act.fees,
                    });
                }
            );
            const form = new FormData();
            form.append("acts", JSON.stringify(acts));
            form.append("modal_uuid", selectedModel.default_modal.uuid);
            form.append("modal_data", localStorage.getItem("Modeldata") as string);
            form.append("notes", exam.notes);
            form.append("diagnostic", exam.diagnosis);
            form.append("treatment", exam.treatment);
            form.append("consultation_reason", exam.motif);
            form.append("status", "5");

            trigger({
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${uuind}/data/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }).then((r: any) => {
                console.log("end consultation", r);
                console.log(r);
                dispatch(setTimer({isActive: false}));
                localStorage.removeItem("Modeldata");
                console.log(localStorage.getItem("Modeldata"));
                mutate();
                if (appointement?.status == 5) {
                    router.push("/dashboard/agenda")
                } else {
                    handleClick()
                }

            });
        }
        setEnd(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end]);

    const editAct = (row: any, from: any) => {
        if (from === "change") {
            const index = selectedAct.findIndex((act) => act.uuid === row.uuid);
            selectedAct[index] = row;
            setSelectedAct([...selectedAct]);
        } else if (from === "changeQte") {
            const index = selectedAct.findIndex((act) => act.uuid === row.uuid);
            selectedAct[index] = row;
            setSelectedAct([...selectedAct]);
        } else if (from === "checked") {
        } else {
            if (from) {
                const index = selectedAct.findIndex((act) => act.uuid === row.uuid);
                setSelectedAct([
                    ...selectedAct.slice(0, index),
                    ...selectedAct.slice(index + 1, selectedAct.length),
                ]);
            } else {
                row.qte = 1;
                setSelectedAct([...selectedAct, row]);
            }
        }
    };

    const onDocumentLoadSuccess = ({numPages}: any) => {
        setNumPages(numPages);
    };
    const openDialogue = (id: number) => {
        switch (id) {
            case 1:
                setDialog("balance_sheet_request");
                break;
            case 2:
                setDialog("draw_up_an_order");
                break;
        }
    };
    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    };
    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        } else {
            mutate();
        }
    };
    const handleCloseDialogAct = () => {
        setOpenActDialog(false);
    };
    const handleSaveDialog = () => {
        setOpenDialog(false);
        setActs([
            ...acts,
            {
                ...stateAct,
                uuid: uniqueId(),
            },
        ]);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
    };
    const closeImageViewer = () => {
        setIsViewerOpen("");
    };
    const handleClick = () => {
        setInfo("secretary_consultation_alert");
        setOpenDialog(true);
        setActions(true);
    };
    const DialogAction = () => {
        return (
            <DialogActions>
                <Button
                    variant="text-black"
                    onClick={handleCloseDialog}
                    startIcon={<CloseIcon/>}>
                    {t("cancel")}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        router.push("/dashboard/agenda").then(() => {
                            setInfo("end_consultation");
                            setActions(false);
                        })

                    }}
                    startIcon={<IconUrl path="ic-check"/>}>
                    {t("end_consultation")}
                </Button>
            </DialogActions>
        );
    };
    const {t, ready} = useTranslation("consultation");
    if (!ready) return <>consulation translations...</>;

    return (
        <>
            <SubHeader>
                {appointement && <ConsultationIPToolbar
                    appuuid={uuind}
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
                    selected={(v: string) => setValue(v)}
                />}
            </SubHeader>

            <Box className="container" style={{padding: 0}}>
                {loading && <Stack spacing={2} padding={2}>
                    {Array.from({length: 3}).map((_, idx) => (
                        <React.Fragment key={idx}>
                            <PatientHistoryNoDataCard/>
                        </React.Fragment>
                    ))}
                </Stack>}
                <TabPanel padding={1} value={value} index={"patient_history"}>
                    <HistoryTab
                        patient={patient}
                        appointement={appointement}
                        t={t}
                        appuuid={uuind}
                        setIsViewerOpen={setIsViewerOpen}
                        direction={direction}
                        setInfo={setInfo}
                        acts={acts}
                        mutateDoc={mutateDoc}
                        setState={setState}
                        dispatch={dispatch}
                        setOpenDialog={setOpenDialog}></HistoryTab>
                </TabPanel>
                <TabPanel padding={1} value={value} index={"mediktor_report"}>
                    <Box
                        sx={{
                            ".react-pdf__Page__canvas": {
                                mx: "auto",
                            },
                        }}>
                        <Document
                            loading={<></>}
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                            ))}
                        </Document>
                    </Box>
                </TabPanel>
                <TabPanel padding={1} value={value} index={"consultation_form"}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                            {!loading && models && selectedModel && (
                                <WidgetForm
                                    modal={selectedModel}
                                    models={models}
                                    setSM={setSelectedModel}></WidgetForm>
                            )}
                        </Grid>
                        <Grid item xs={12} md={7} style={{paddingLeft: 10}}>
                            {sheet && <ConsultationDetailCard exam={sheet.exam}/>}
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel padding={1} value={value} index={"documents"}>
                    <DocumentsTab
                        documents={documents}
                        setIsViewerOpen={setIsViewerOpen}
                        setInfo={setInfo}
                        setState={setState}
                        patient={patient}
                        mutateDoc={mutateDoc}
                        setOpenDialog={setOpenDialog}
                        t={t}></DocumentsTab>
                </TabPanel>
                <TabPanel padding={1} value={value} index={"medical_procedures"}>
                    <FeesTab
                        acts={acts}
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

                <Stack
                    direction={{md: "row", xs: "column"}}
                    position="fixed"
                    sx={{right: 10, bottom: 10, zIndex: 999}}
                    spacing={2}>
                    {pendingDocuments?.map((item: any) => (
                        <React.Fragment key={item.id}>
                            <PendingDocumentCard
                                data={item}
                                t={t}
                                onClick={() => {
                                    openDialogue(item.id);
                                }}
                                closeDocument={(v: number) =>
                                    setPendingDocuments(
                                        pendingDocuments.filter((card: any) => card.id !== v)
                                    )
                                }
                            />
                        </React.Fragment>
                    ))}
                </Stack>
                <Box pt={8}>
                    {appointement && value !== 'medical_procedures' && <SubFooter>
                        <Stack width={1} alignItems="flex-end">
                            <Button
                                onClick={() => {

                                    const btn = document.getElementsByClassName("sub-btn")[1];
                                    const examBtn = document.getElementsByClassName("sub-exam")[0];

                                    (btn as HTMLElement)?.click();
                                    (examBtn as HTMLElement)?.click();

                                    setOnsave(true)
                                    setEnd(true)
                                }}
                                color={"error"}
                                variant="contained"
                                sx={{".react-svg": {mr: 1}}}>
                                <Icon path="ic-check"/>
                                {appointement?.status == 5 && !onSave
                                    ? t("edit_of_consultation")
                                    : t("end_of_consultation")}
                            </Button>
                        </Stack>
                    </SubFooter>}
                </Box>
                <Drawer
                    anchor={"right"}
                    open={openAddDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "add", open: false}));
                    }}>
                    <Box height={"100%"}>
                        <CustomStepper
                            {...{currentStepper, t}}
                            OnTabsChange={handleStepperChange}
                            OnSubmitStepper={submitStepper}
                            stepperData={EventStepper}
                            scroll
                            minWidth={726}
                        />
                    </Box>
                </Drawer>
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
                    onClick={() => setFilterDrawer(!drawer)}
                    sx={{
                        position: "fixed",
                        bottom: 50,
                        transform: "translateX(-50%)",
                        left: "50%",
                        zIndex: 999,
                        display: {xs: "flex", md: "none"},
                    }}
                    variant="filter">
                    Filtrer (0)
                </Button>
                <DrawerBottom
                    handleClose={() => setFilterDrawer(false)}
                    open={filterdrawer}
                    title={null}>
                    <ConsultationFilter/>
                </DrawerBottom>
                <Stack
                    direction={{md: "row", xs: "column"}}
                    position="fixed"
                    sx={{right: 10, bottom: 70, zIndex: 999}}
                    spacing={2}>
                    {pendingDocuments?.map((item: any) => (
                        <React.Fragment key={item.id}>
                            <PendingDocumentCard
                                data={item}
                                t={t}
                                onClick={() => {
                                    openDialogue(item.id);
                                }}
                                closeDocument={(v: number) =>
                                    setPendingDocuments(
                                        pendingDocuments.filter((card: any) => card.id !== v)
                                    )
                                }
                            />
                        </React.Fragment>
                    ))}
                </Stack>

                <Drawer
                    anchor={"right"}
                    open={openAddDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "add", open: false}));
                    }}>
                    <Box height={"100%"}>
                        <CustomStepper
                            {...{currentStepper, t}}
                            OnTabsChange={handleStepperChange}
                            OnSubmitStepper={submitStepper}
                            stepperData={EventStepper}
                            scroll
                            minWidth={726}
                        />
                    </Box>
                </Drawer>
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
                    onClick={() => setFilterDrawer(!drawer)}
                    sx={{
                        position: "fixed",
                        bottom: 50,
                        transform: "translateX(-50%)",
                        left: "50%",
                        zIndex: 999,
                        display: {xs: "flex", md: "none"},
                    }}
                    variant="filter">
                    Filtrer (0)
                </Button>
                <DrawerBottom
                    handleClose={() => setFilterDrawer(false)}
                    open={filterdrawer}
                    title={null}>
                    <ConsultationFilter/>
                </DrawerBottom>

                <Dialog
                    action={"add_act"}
                    open={openActDialog}
                    data={{stateAct, setstateAct, setDialog, t}}
                    size={"sm"}
                    direction={"ltr"}
                    title={t("consultationIP.add_a_new_act")}
                    dialogClose={handleCloseDialogAct}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialogAct} startIcon={<CloseIcon/>}>
                                {t("cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveDialog}
                                startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                                {t("save")}
                            </Button>
                        </DialogActions>
                    }
                />
            </Box>

            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{state, setState, setDialog, setOpenDialog, t}}
                    size={"lg"}
                    color={
                        info === "secretary_consultation_alert" && theme.palette.error.main
                    }
                    direction={"ltr"}
                    {...(info === "document_detail" && {
                        sx: {p: 0},
                    })}
                    title={t(info === "document_detail" ? "doc_detail_title" : info)}
                    {...((info === "document_detail" || info === "end_consultation") && {
                        onClose: handleCloseDialog,
                    })}
                    dialogClose={handleCloseDialog}
                    {...(actions && {
                        actionDialog: <DialogAction/>,
                    })}
                />
            )}

            {isViewerOpen.length > 0 && (
                <ImageViewer
                    src={[isViewerOpen, isViewerOpen]}
                    currentIndex={0}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(6, 150, 214,0.5)",
                    }}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                />
            )}
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, [
                "consultation",
                "menu",
                "common",
                "agenda",
            ])),
        },
    };
};
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default ConsultationInProgress;
ConsultationInProgress.auth = true;
ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
