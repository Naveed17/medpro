import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
// material
import {
    AppBar,
    Box,
    Button,
    CardContent,
    Checkbox,
    FormControl,
    Grid,
    IconButton,
    LinearProgress,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
//components
import {DocumentCard, NoDataCard} from "@features/card";
import {Dialog} from "@features/dialog";
import ImageViewer from "react-simple-image-viewer";

import PanelCardStyled from "./overrides/panelCardStyled";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {a11yProps, useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {TabPanel} from "@features/tabPanel";
import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {useRouter} from "next/router";
import useDocumentsPatient from "@lib/hooks/rest/useDocumentsPatient";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {dashLayoutSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment/moment";
import Add from "@mui/icons-material/Add";
import DocumentCardStyled from "@features/card/components/documentCard/components/overrides/documentCardStyle";

import {LoadingScreen} from "@features/loadingScreen";
import Autocomplete from "@mui/material/Autocomplete";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";

const typeofDocs = [
    "requested-medical-imaging", "medical-imaging",
    "analyse", "requested-analysis", "photo",
    "prescription", "Rapport", "medical-certificate", "audio", "video"];

const AddAppointmentCardWithoutButtonsData = {
    mainIcon: "",
    title: "config.no-data.documents.title",
    description: "config.no-data.documents.description"
};

const AddAppointmentCardData = {
    mainIcon: "",
    title: "config.no-data.documents.title",
    description: "config.no-data.documents.description",
    buttons: [{
        text: "config.no-data.documents.button-text",
        icon: <IconUrl width={20} height={20} path={'fileadd'}/>,
        variant: "primary",
        color: "white"
    }]
};

const AddQuoteCardData = {
    mainIcon: "",
    title: "config.no-data.documents.quote-add",
    description: "config.no-data.documents.quote-description",
    buttons: [{
        text: "config.no-data.documents.add_quote",
        icon: <IconUrl width={20} height={20} path={'fileadd'}/>,
        variant: "primary",
        color: "white"
    }]
};

function DocFilter({...props}) {
    const {titleSearch, setTitleSearch, theme, handleSelectAll, selectedAll, queryState, setQueryState, t} = props
    return (
        <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
                <Typography fontSize={12} mb={1} color={"#6F7482"}>{t('search-title')}</Typography>
                <TextField
                    value={titleSearch}
                    onChange={(ev) => {
                        setTitleSearch(ev.target.value)
                    }} style={{
                    background: theme.palette.grey["A500"],
                    border: `1px solid ${theme.palette.grey["200"]}`,
                    width: "100%",
                    borderRadius: 6
                }} placeholder={t('search')}></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
                <Typography fontSize={12} mb={1} color={"#6F7482"}>{t('type-title')}</Typography>
                <MuiAutocompleteSelectAll.Provider
                    value={{
                        onSelectAll: (selectedAll) => void handleSelectAll({types: selectedAll ? [] : typeofDocs}),
                        selectedAll,
                        indeterminate: !!queryState.types.length && !selectedAll,
                    }}
                >
                    <Autocomplete
                        size={"small"}
                        multiple
                        autoHighlight
                        filterSelectedOptions
                        limitTags={3}
                        noOptionsText={t("noType")}
                        ListboxComponent={MuiAutocompleteSelectAll.ListBox}
                        value={queryState.types ? queryState.types : []}
                        style={{width: "100%"}}
                        onChange={(event, value) => setQueryState({types: value})}
                        options={typeofDocs ? typeofDocs : []}
                        getOptionLabel={option => option ? t(option) : ""}
                        isOptionEqualToValue={(option: any, value) => option === value}
                        renderOption={(params, option, {selected}) => (
                            <MenuItem {...params}>
                                <Checkbox checked={selected}/>
                                <Typography sx={{ml: 1}}>{t(option)}</Typography>
                            </MenuItem>)}
                        renderInput={(params) => (
                            <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
                                <TextField style={{
                                    background: theme.palette.grey["A500"],
                                    border: `1px solid ${theme.palette.grey["200"]}`,
                                    width: "100%",
                                    borderRadius: 6
                                }}
                                           {...params}
                                           sx={{paddingLeft: 0}}
                                           placeholder={t("type-placeholder")}
                                           variant="outlined"
                                />
                            </FormControl>)}
                    />
                </MuiAutocompleteSelectAll.Provider>
            </Grid>
        </Grid>
    )
}

function DocumentsPanel({...props}) {
    const {
        documentViewIndex, patient,
        roles, setOpenUploadDialog,
        mutatePatientDetails,
        loadingRequest, setLoadingRequest
    } = props;
    const router = useRouter();
    const theme = useTheme();
    const {patientDocuments, mutatePatientDocuments} = useDocumentsPatient({patientId: patient?.uuid});
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medical_professional} = useMedicalProfessionalSuffix();

    // translation
    const {t, ready} = useTranslation(["consultation", "patient"]);
    const {selectedDialog} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser, secretaryAccess} = useAppSelector(dashLayoutSelector);

    // filter checked array
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [document, setDocument] = useState<any>();
    const [isViewerOpen, setIsViewerOpen] = useState<string>('');
    const [currentTab, setCurrentTab] = React.useState(documentViewIndex);
    const [openQuoteDialog, setOpenQuoteDialog] = useState<boolean>(false);
    const [acts, setActs] = useState<AppointmentActModel[]>([]);
    const [note, setNotes] = useState(t('noteQuote'));
    const [titleSearch, setTitleSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [queryState, setQueryState] = useState<any>({
        types: []
    });

    const selectedAll = queryState.types.length === typeofDocs?.length;

    const {trigger: triggerQuoteUpdate} = useRequestQueryMutation("/patient/quote");

    const {data: httpAppDocPatientResponse} = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/appointments/documents/${router.locale}`
    } : null);

    const {data: httpQuotesResponse, mutate: mutateQuotes} = useRequestQuery(patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient.uuid}/quotes/${router.locale}`
    } : null);

    const {data: httpProfessionalsActs} = useRequestQuery(medical_professional ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`
    } : null);

    const documents = (httpAppDocPatientResponse as HttpResponse)?.data.reduce((docs: any[], doc: any) => [...(docs ?? []), ...doc?.documents], []) ?? [];
    const quotes = (httpQuotesResponse as HttpResponse)?.data ?? [];

    const handleSelectAll = (types: any): void => {
        setQueryState(types);
    }

    const tabsContent = [
        {
            title: "Documents du rendez-vous",
            children:
                <>
                    <DocFilter {...{
                        titleSearch,
                        setTitleSearch,
                        theme,
                        handleSelectAll,
                        selectedAll,
                        queryState,
                        setQueryState,
                        t
                    }}/>
                    <Box display='grid' mt={2} className={'document-container'}
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
                            documents.sort((a: any, b: any) => {
                                return moment(b.createdAt, 'DD-MM-YYYY HH:mm').diff(moment(a.createdAt, 'DD-MM-YYYY HH:mm'))
                            }).filter((doc: {
                                title: string
                            }) => doc.title.toLowerCase().includes(titleSearch.toLowerCase())).filter((doc: MedicalDocuments) =>
                                queryState.types.length === 0 ? true : queryState.types.some((st: string) => st === doc.documentType)).map((card: any, idx: number) =>
                                <React.Fragment key={`doc-item-${idx}`}>
                                    <DocumentCard
                                        onClick={() => {
                                            showDoc(card)
                                        }}
                                        {...{t, data: card, date: true, time: true, title: true, width: "13rem"}}/>
                                </React.Fragment>
                            )
                            :
                            <NoDataCard t={t} ns={"patient"}
                                        onHandleClick={() => setOpenUploadDialog(true)}
                                        data={AddAppointmentCardWithoutButtonsData}/>
                        }
                    </Box>
                </>,
            permission: ["ROLE_PROFESSIONAL", ...(secretaryAccess ? ["ROLE_SECRETARY"] : [])]
        },
        {
            title: "Documents du patient",
            children:
                <>
                    <DocFilter {...{
                        titleSearch,
                        setTitleSearch,
                        theme,
                        handleSelectAll,
                        selectedAll,
                        queryState,
                        setQueryState,
                        t
                    }}/>
                    <Grid container mt={2} spacing={1}>
                        {patientDocuments?.length > 0 ?
                            patientDocuments?.filter((doc) => doc.title.includes(titleSearch)).filter((doc: MedicalDocuments) =>
                                queryState.types.length === 0 ? true : queryState.types.some((st: string) => st === doc.documentType)).map((card: any, idx: number) =>
                                <Grid key={`doc-item-${idx}`} item md={6} xs={12}
                                      alignItems={"center"}
                                      sx={{
                                          "& .sub-title": {
                                              paddingRight: "1rem"
                                          }
                                      }}>
                                    <React.Fragment>
                                        <DocumentCard
                                            onClick={() => {
                                                showDoc(card)
                                            }}
                                            {...{t, data: card, date: true, time: true, title: true, width: "13rem"}}/>
                                    </React.Fragment>
                                </Grid>
                            )
                            :
                            <NoDataCard t={t} ns={"patient"}
                                        onHandleClick={() => setOpenUploadDialog(true)}
                                        data={AddAppointmentCardData}/>
                        }
                    </Grid>
                </>,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        }
    ].filter(tab => tab.permission.includes(roles[0]));

    // handle change for checkboxes
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
                title: card.title,
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
                cin: patient?.idCard ? patient?.idCard : "",
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
            form.append("notes", note);
            form.append("quote_items", JSON.stringify(rows));

            triggerQuoteUpdate({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/quotes/${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    mutateQuotes().then(() => {
                        setOpenQuoteDialog(false)
                        showQuote("", acts.filter(act => act.selected), note);
                        let _acts = [...acts]
                        _acts.map(act => {
                            act.selected = false
                        })
                        setActs([..._acts])
                        setNotes(t('noteQuote'))
                    })
                }
            });
        }
    }

    const showQuote = (uuid: string, rows: AppointmentActModel[], note: string) => {
        let type = "";
        if (!(patient?.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
            type = patient?.gender === "F" ? "Mme " : patient?.gender === "U" ? "" : "Mr "

        setDocument({
            type: "quote",
            name: "Quote",
            info: rows,
            uuid: uuid,
            note,
            mutate: mutateQuotes,
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
            setActs(_acts);

            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }
    }, [httpProfessionalsActs]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            {loading && <LinearProgress/>}
            {!loading && <PanelCardStyled
                sx={{
                    "& .MuiCardContent-root": {
                        background: "white"
                    },
                    marginBottom: "1rem"
                }}>
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

                    <Grid container spacing={1.2}>
                        {quotes.map((card: any, idx: number) =>
                            <Grid item xs={12} md={6} key={`doc-item-${idx}`}>
                                <DocumentCardStyled style={{width: "100%"}}>
                                    <Stack direction={"row"} spacing={2} onClick={() => {
                                        let _acts: any[] = [];
                                        acts.map(act => {
                                            const _el = card.quotes_items.find((qi: {
                                                act_item: { uuid: string; };
                                            }) => qi.act_item && qi.act_item.uuid === act.act.uuid)
                                            if (_el)
                                                _acts = [..._acts, {
                                                    ...act,
                                                    qte: _el.qty_item,
                                                    fees: _el.price_item
                                                }];
                                            showQuote(card.uuid, _acts, card.notes)
                                        })
                                    }}
                                           alignItems={"center"}
                                           padding={2}>
                                        <IconUrl width={25} height={25} path={"ic-quote"}/>
                                        <Stack>
                                            <Typography
                                                fontSize={13}>{t("config.tabs.quotes", {ns: 'patient'})}</Typography>
                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                <Icon path="ic-agenda" height={11} width={11}
                                                      color={theme.palette.text.primary}/>
                                                <Typography variant="body2">
                                                    {moment(card.date_quote, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY')}
                                                </Typography>

                                                <Icon path="ic-time" height={11} width={11}
                                                      color={theme.palette.text.primary}/>
                                                <Typography variant="body2">
                                                    {moment(card.date_quote, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </DocumentCardStyled>
                            </Grid>
                        )}
                    </Grid>

                    {quotes.length == 0 && <NoDataCard t={t} ns={"patient"}
                                                       onHandleClick={() => setOpenQuoteDialog(true)}
                                                       data={AddQuoteCardData}/>}
                </CardContent>
            </PanelCardStyled>}
            {(documents.length > 0 || patientDocuments?.length > 0) && !loading ? (
                <>
                    <PanelCardStyled
                        sx={{
                            "& .MuiCardContent-root": {
                                background: "white"
                            },
                            "& .injected-svg": {
                                maxWidth: 30,
                                maxHeight: 30
                            }
                        }}>
                        <CardContent>
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
            ) : !loading &&
                <PanelCardStyled
                    sx={{
                        "& .MuiCardContent-root": {
                            background: "white"
                        },
                        marginBottom: "1rem"
                    }}>
                    <CardContent>
                        <NoDataCard t={t} ns={"patient"}
                                    onHandleClick={() => setOpenUploadDialog(true)}
                                    data={AddAppointmentCardData}/>
                    </CardContent>
                </PanelCardStyled>
            }

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
                    note, setNotes,
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
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}
                           width={"100%"}>
                        <Button
                            variant={"text-black"}
                            onClick={() => {
                                setOpenQuoteDialog(false)
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => saveQuote()}
                            disabled={acts.filter(act => act.selected).length === 0}
                            startIcon={<IconUrl path="iconfinder_save"/>}>
                            {t("consultationIP.save", {ns: 'consultation'})}
                        </Button>
                    </Stack>
                }
            />
        </>
    );
}

export default DocumentsPanel;
