import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
// material
import {
    AppBar,
    Box,
    Button,
    CardContent,
    Checkbox,
    DialogActions,
    FormControlLabel,
    IconButton,
    LinearProgress,
    Stack,
    Tab,
    Tabs,
    Toolbar,
    Typography
} from "@mui/material";
//components
import {DocumentCard, NoDataCard} from "@features/card";
import {uniqueId} from "lodash";
import {Dialog} from "@features/dialog";
import ImageViewer from "react-simple-image-viewer";
import dynamic from "next/dynamic";
import PanelCardStyled from "./overrides/panelCardStyled";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {a11yProps, useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {TabPanel} from "@features/tabPanel";
import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {useRouter} from "next/router";
import useDocumentsPatient from "@lib/hooks/rest/useDocumentsPatient";
import {useRequest, useRequestMutation} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {dashLayoutSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import moment from "moment/moment";
import Add from "@mui/icons-material/Add";
import DocumentCardStyled from "@features/card/components/documentCard/components/overrides/documentCardStyle";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {useSession} from "next-auth/react";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

const typeofDocs = [
    "requested-medical-imaging", "medical-imaging",
    "analyse", "requested-analysis",
    "prescription", "rapport", "medical-certificate", "audio", "video"];

const AddAppointmentCardWithoutButtonsData = {
    mainIcon: "ic-doc",
    title: "config.no-data.documents.title",
    description: "config.no-data.documents.description"
};

const AddAppointmentCardData = {
    mainIcon: "ic-doc",
    title: "config.no-data.documents.title",
    description: "config.no-data.documents.description",
    buttons: [{
        text: "config.no-data.documents.button-text",
        icon: <Icon path={"ic-doc"} width={"18"} height={"18"}/>,
        variant: "primary",
        color: "white"
    }]
};

function DocumentsPanel({...props}) {
    const {
        documentViewIndex, patient,
        roles, setOpenUploadDialog,
        mutatePatientDetails,
        loadingRequest, setLoadingRequest
    } = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {patientDocuments, mutatePatientDocuments} = useDocumentsPatient({patientId: patient?.uuid});
    // translation
    const {t, ready} = useTranslation(["consultation", "patient"]);
    const {selectedDialog} = useAppSelector(consultationSelector);

    const {trigger: triggerQuote} = useRequestMutation(null, "/patient/quote");

    // filter checked array
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [document, setDocument] = useState<any>();
    const [isViewerOpen, setIsViewerOpen] = useState<string>('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = React.useState(documentViewIndex);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [openQuoteDialog, setOpenQuoteDialog] = useState<boolean>(false);
    const [acts, setActs] = useState<AppointmentActModel[]>([]);

    const tabsContent = [
        {
            title: "Documents du rendez-vous",
            children: <Box display='grid' className={'document-container'}
                           {...(documents.length > 0 && {
                               sx: {
                                   gridGap: 16,
                                   gridTemplateColumns: {
                                       xs: "repeat(1,minmax(0,1fr))",
                                       md: "repeat(2,minmax(0,1fr))",
                                       lg: "repeat(2,minmax(0,1fr))",
                                   },
                               }
                           })}>
                {documents.length > 0 ?
                    documents.filter((doc: MedicalDocuments) =>
                        doc.documentType !== 'photo' && selectedTypes.length === 0 ? true : selectedTypes.some(st => st === doc.documentType))
                        .map((card: any, idx: number) =>
                            <React.Fragment key={`doc-item-${idx}`}>
                                <DocumentCard
                                    onClick={() => {
                                        showDoc(card)
                                    }}
                                    {...{t, data: card, date: true, time: true, title: true}}/>
                            </React.Fragment>
                        )
                    :
                    <NoDataCard t={t} ns={"patient"}
                                onHandleClick={() => setOpenUploadDialog(true)}
                                data={AddAppointmentCardWithoutButtonsData}/>
                }
            </Box>,
            permission: ["ROLE_PROFESSIONAL"]
        },
        {
            title: "Documents du patient",
            children:
                <>

                    <Box style={{overflowX: "auto", marginBottom: 10}}>
                        <Stack direction={"row"} spacing={1} m={1} alignItems={"center"}>
                            {patientDocuments?.filter((doc: MedicalDocuments) => doc.documentType === 'photo').map((card: any, idx: number) =>
                                <React.Fragment key={`doc-item-${idx}`}>
                                    <DocumentCard onClick={() => {
                                        console.log(card);
                                        showDoc(card)
                                    }} {...{t, data: card, date: false, time: true, title: true, resize: true}}/>
                                </React.Fragment>
                            )}
                        </Stack>
                    </Box>

                    <Box display='grid' className={'document-container'}
                         {...(patientDocuments?.length > 0 && {
                             sx: {
                                 gridGap: 16,
                                 gridTemplateColumns: {
                                     xs: "repeat(1,minmax(0,1fr))",
                                     md: "repeat(1,minmax(0,1fr))",
                                     lg: "repeat(2,minmax(0,1fr))",
                                 },
                             }
                         })}>
                        {patientDocuments?.length > 0 ?
                            patientDocuments?.filter((doc: MedicalDocuments) =>
                                doc.documentType !== 'photo' && selectedTypes.length === 0 ? true : selectedTypes.some(st => st === doc.documentType)).map((card: any, idx: number) =>
                                <React.Fragment key={`doc-item-${idx}`}>
                                    <DocumentCard
                                        onClick={() => {
                                            console.log(card);
                                            showDoc(card)
                                        }}
                                        {...{t, data: card, date: true, time: true, title: true}}/>
                                </React.Fragment>
                            )
                            :
                            <NoDataCard t={t} ns={"patient"}
                                        onHandleClick={() => setOpenUploadDialog(true)}
                                        data={AddAppointmentCardData}/>
                        }
                    </Box></>,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        }
    ].filter(tab => tab.permission.includes(roles[0]));

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {medical_professional} = useMedicalProfessionalSuffix();

    const {data: httpAppDocPatientResponse} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/appointments/documents/${router.locale}`
    } : null, SWRNoValidateConfig);

    const {data: httpQuotesResponse, mutate: mutateQuotes} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient.uuid}/quotes/${router.locale}`
    });
    const {data: httpProfessionalsActs} = useRequest(medical_professional ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null, SWRNoValidateConfig);

    // handle change for checkboxes
    const handleToggle = (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTypes([...selectedTypes, value])
        } else {
            selectedTypes.splice(selectedTypes.indexOf(value), 1);
            setSelectedTypes([...selectedTypes])
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    const showDoc = (card: any) => {
        if (card.documentType === 'medical-certificate') {
            setOpenDialog(true);
            setDocument({
                uuid: card.uuid,
                certifUuid: card.certificate[0].uuid,
                content: card.certificate[0].content,
                doctor: card.name,
                patient: `${patient.firstName} ${patient.lastName}`,
                days: card.days,
                description: card.description,
                createdAt: card.createdAt,
                name: 'certif',
                detectedType: card.type,
                type: 'write_certif',
                mutate: mutatePatientDocuments,
                mutateDetails: mutatePatientDetails
            })
            setOpenDialog(true);
        } else {
            setOpenDialog(true);
            let info = card
            let uuidDoc = "";
            switch (card.documentType) {
                case "prescription":
                    info = card.prescription[0].prescription_has_drugs;
                    uuidDoc = card.prescription[0].uuid
                    break;
                case "requested-analysis":
                    info = card.requested_Analyses[0].analyses;
                    uuidDoc = card.requested_Analyses[0].uuid;
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]['medical-imaging'];
                    uuidDoc = card.medical_imaging[0].uuid;
                    break;
            }
            setDocument({
                uuid: card.uuid,
                uri: card.uri,
                name: card.title,
                type: card.documentType,
                info: info,
                uuidDoc: uuidDoc,
                appUuid: card.appUuid,
                description: card.description,
                createdAt: card.createdAt,
                detectedType: card.type,
                patient: patient.firstName + ' ' + patient.lastName,
                mutate: mutatePatientDocuments,
                mutateDetails: mutatePatientDetails
            })
            setOpenDialog(true);
        }
    }
    const saveQuote = () => {
        if (medicalEntityHasUser) {
            let rows: {
                act_item: string;
                name_item: string;
                qty_item: string;
                price_item: string;
                discount_item: string;
                unit_item: string;
            }[] = [];
            acts.filter(act => act.selected).map(act => {
                console.log(act);
                rows.push({
                    "act_item": (act.act.uuid as string),
                    "name_item": act.act.name,
                    "qty_item": act.qte.toString(),
                    "price_item": act.fees.toString(),
                    "discount_item": "",
                    "unit_item": ""
                })
            })
            const form = new FormData();
            form.append("patient", patient.uuid);
            form.append("num_quote", "");
            form.append("notes", "");
            form.append("quote_items", JSON.stringify(rows));

            triggerQuote({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/quotes/${router.locale}`,
                data: form
            }).then(() => {
                mutateQuotes().then(() => {
                    setOpenQuoteDialog(false)
                    showQuote(acts.filter(act => act.selected));
                })
            });
        }
    }
    const showQuote = (rows: AppointmentActModel[]) => {
        let type = "";
        if (!(patient?.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
            type = patient?.gender === "F" ? "Mme " : patient?.gender === "U" ? "" : "Mr "

        setDocument({
            type: "quote",
            name: "Quote",
            info: rows,
            createdAt: moment().format("DD/MM/YYYY"),
            patient: `${type} ${patient?.firstName} ${patient?.lastName}`,
        });
        setOpenDialog(true);
    }

    useEffect(() => {
        if (selectedDialog && !router.asPath.includes('/dashboard/consultation/')) {
            switch (selectedDialog.action) {
                case "medical_prescription":
                case "medical_prescription_cycle":
                    //close document dialog
                    setOpenDialog(false);
                    break;
            }
        }
    }, [selectedDialog]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let pdoc: any[] = []
        if (httpAppDocPatientResponse) {
            const apps = (httpAppDocPatientResponse as HttpResponse)?.data;
            apps.map((app: { documents: any; }) => pdoc = [...pdoc, ...app.documents])
            setDocuments(pdoc);
        }
    }, [httpAppDocPatientResponse]);

    useEffect(() => {
        if (httpQuotesResponse) {
            setQuotes((httpQuotesResponse as HttpResponse)?.data)
        }
    }, [httpQuotesResponse]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpProfessionalsActs) {
            let _acts: AppointmentActModel[] = [];
            (httpProfessionalsActs as HttpResponse)?.data.forEach((act: any) => {
                const act_index = _acts.findIndex(_act => _act.uuid === act.uuid)
                if (act_index > -1) {
                    _acts[act_index] = {
                        ..._acts[act_index],
                        selected: false,
                        qte: act.qte ? act.qte : 1,
                        fees: act.fees
                    }
                } else {
                    _acts.push({
                        act: {uuid: act.act.uuid, name: act.act.name},
                        fees: act.fees,
                        isTopAct: false,
                        qte: act.qte ? act.qte : 1,
                        selected: false,
                        uuid: act.uuid
                    })
                }
            })
            console.log()
            setActs(_acts);
        }
    }, [httpProfessionalsActs]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <PanelCardStyled
                sx={{
                    "& .MuiCardContent-root": {
                        background: "white"
                    },
                    "& .injected-svg": {
                        //maxWidth: 30,
                        //maxHeight: 30
                    },
                    marginBottom: "1rem"
                }}
            >
                <CardContent>
                    <AppBar position="static" color={"transparent"} className={"app-bar-header"}>
                        <Toolbar variant="dense">
                            <Stack direction={"row"}
                                   alignItems={"center"}
                                   style={{width: "100%"}}
                                   justifyContent={"space-between"}>
                                <Typography
                                    variant="body1"
                                    sx={{fontWeight: "bold"}}
                                    gutterBottom>
                                    {t("config.tabs.quotes", {ns: 'patient'})}
                                </Typography>
                                <IconButton onClick={() => {
                                    setOpenQuoteDialog(true)
                                }}><Add/></IconButton>
                            </Stack>
                        </Toolbar>
                    </AppBar>

                    <Box style={{overflowX: "auto", marginBottom: 10}}>
                        <Stack direction={"row"} spacing={1} m={1} alignItems={"center"}>
                            {
                                quotes.map((card: any, idx: number) =>
                                    <React.Fragment key={`doc-item-${idx}`}>
                                        <DocumentCardStyled>
                                            <Stack direction={"row"} spacing={1} onClick={() => {
                                                console.log(card.quotes_items)
                                                console.log(acts);
                                                let _acts: any[] = [];
                                                acts.map(act => _acts = [..._acts, {
                                                    ...act,
                                                    selected: card.quotes_items.findIndex((qi: {
                                                        act_item: { uuid: string; };
                                                    }) => qi.act_item.uuid === act.act.uuid) !== -1
                                                }])
                                                showQuote(_acts.filter(act => act.selected))
                                            }} alignItems={"center"}
                                                   padding={2}>
                                                <IconUrl width={20} path={"ic-text"}/>
                                                <Stack>
                                                    <Typography>{t("config.tabs.quotes", {ns: 'patient'})}</Typography>
                                                    <Stack direction={"row"} spacing={1}>
                                                        <EventRoundedIcon
                                                            style={{fontSize: 15, color: "grey"}}/>
                                                        <Typography whiteSpace={"nowrap"} fontSize={12}
                                                                    sx={{color: "grey", cursor: "pointer"}}>
                                                            {moment(card.date_quote, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')}
                                                        </Typography>

                                                        <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                                                        <Typography whiteSpace={"nowrap"} fontSize={12}
                                                                    sx={{
                                                                        marginTop: 0,
                                                                        color: "grey",
                                                                        cursor: "pointer"
                                                                    }}>
                                                            {moment(card.date_quote, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </DocumentCardStyled>
                                    </React.Fragment>
                                )
                            }
                        </Stack>
                    </Box>
                </CardContent>
            </PanelCardStyled>
            {documents.length > 0 || patientDocuments?.length > 0 ? (
                <>
                    {documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').length > 0 && !roles.includes("ROLE_SECRETARY") &&
                        <PanelCardStyled
                            sx={{
                                "& .MuiCardContent-root": {
                                    background: "white"
                                },
                                "& .injected-svg": {
                                    //maxWidth: 30,
                                    //maxHeight: 30
                                },
                                marginBottom: "1rem"
                            }}
                        >
                            <CardContent>
                                <AppBar position="static" color={"transparent"} className={"app-bar-header"}>
                                    <Toolbar variant="dense">
                                        <Box sx={{flexGrow: 1}}>
                                            <Typography
                                                variant="body1"
                                                sx={{fontWeight: "bold"}}
                                                gutterBottom>
                                                {t("config.table.photo", {ns: 'patient'})}
                                            </Typography>
                                        </Box>
                                    </Toolbar>
                                </AppBar>

                                <Box style={{overflowX: "auto", marginBottom: 10}}>
                                    <Stack direction={"row"} spacing={1} m={1} alignItems={"center"}>
                                        {
                                            documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').map((card: any, idx: number) =>
                                                <React.Fragment key={`doc-item-${idx}`}>
                                                    <DocumentCard onClick={() => {
                                                        console.log(card);
                                                        showDoc(card)
                                                    }} {...{
                                                        t,
                                                        data: card,
                                                        date: false,
                                                        time: true,
                                                        title: true,
                                                        resize: true
                                                    }}/>
                                                </React.Fragment>
                                            )
                                        }
                                    </Stack>
                                </Box>
                            </CardContent>
                        </PanelCardStyled>
                    }
                    <PanelCardStyled
                        className={"container"}
                        sx={{
                            "& .MuiCardContent-root": {
                                background: "white"
                            },
                            "& .injected-svg": {
                                maxWidth: 30,
                                maxHeight: 30
                            }
                        }}
                    >
                        <CardContent>
                            <AppBar position="static" color={"transparent"} className={"app-bar-header"}>
                                <Toolbar variant="dense">
                                    <Box sx={{flexGrow: 1}}>
                                        <Typography
                                            variant="body1"
                                            sx={{fontWeight: "bold"}}
                                            gutterBottom>
                                            {t("config.table.title", {ns: 'patient'})}
                                        </Typography>
                                    </Box>
                                </Toolbar>
                            </AppBar>
                            <>
                                <FormControlLabel
                                    key={uniqueId()}
                                    control={
                                        <Checkbox
                                            checked={selectedTypes.length === 0}
                                            onChange={() => {
                                                setSelectedTypes([])
                                            }}
                                        />
                                    }
                                    label={t(`config.table.all`, {ns: 'patient'})}
                                />
                                {typeofDocs.map((type) => (
                                    <FormControlLabel
                                        key={uniqueId()}
                                        control={
                                            <Checkbox
                                                checked={type === 'all' ? selectedTypes.length === 0 : selectedTypes.some(t => type === t)}
                                                onChange={handleToggle(type)}
                                            />
                                        }
                                        label={t(`config.table.${type}`, {ns: 'patient'})}
                                    />
                                ))}
                            </>

                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={currentTab} onChange={handleTabsChange} aria-label="documents tabs">
                                    {tabsContent.map((tabHeader, tabHeaderIndex) =>
                                        <Tab key={`tabHeaderIndex-${tabHeaderIndex}`}
                                             label={tabHeader.title} {...a11yProps(tabHeaderIndex)} />)}
                                </Tabs>
                                <LinearProgress sx={{
                                    mt: .2,
                                    display: loadingRequest ? "block" : "none"
                                }} color="warning"/>
                            </Box>
                            {tabsContent.map((tabContent, tabContentIndex) =>
                                <TabPanel key={`tabContentIndex-${tabContentIndex}`} value={currentTab}
                                          index={tabContentIndex}>
                                    {tabContent.children}
                                </TabPanel>)}
                        </CardContent>
                    </PanelCardStyled>
                </>
            ) : (
                <NoDataCard t={t} ns={"patient"}
                            onHandleClick={() => setOpenUploadDialog(true)}
                            data={AddAppointmentCardData}/>
            )}

            <Dialog action={"document_detail"}
                    open={openDialog}
                    data={{
                        state: document, setState: setDocument,
                        setOpenDialog, patient,
                        mutatePatientDocuments,
                        documentViewIndex: currentTab,
                        source: "patient",
                        setLoadingRequest
                    }}
                    size={"lg"}
                    direction={'ltr'}
                    sx={{p: 0}}
                    title={t("config.doc_detail_title", {ns: "patient"})}
                    onClose={handleCloseDialog}
                    dialogClose={handleCloseDialog}
            />

            {isViewerOpen.length > 0 && (
                <ImageViewer
                    src={[isViewerOpen, isViewerOpen]}
                    currentIndex={0}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(6, 150, 214,0.5)"
                    }}
                    closeOnClickOutside={true}
                    onClose={() => setIsViewerOpen('')}
                />
            )}

            <Dialog
                action={"quote-request-dialog"}
                data={{
                    acts, setActs
                }}
                open={openQuoteDialog}
                size={"md"}
                direction={"ltr"}
                sx={{minHeight: 400}}
                title={t("config.tabs.quotes", {ns: 'patient'})}
                dialogClose={() => {
                    setOpenQuoteDialog(false)
                }}
                onClose={() => {
                    setOpenQuoteDialog(false)
                }}
                actionDialog={
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenQuoteDialog(false)
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                saveQuote()
                            }}
                            disabled={acts.filter(act => act.selected).length === 0}
                            startIcon={<SaveRoundedIcon/>}>
                            {t("save",{ns:'patient'})}
                        </Button>
                    </DialogActions>
                }
            />
        </>
    );
}

export default DocumentsPanel;
