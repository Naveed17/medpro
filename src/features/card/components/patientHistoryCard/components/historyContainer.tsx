import React, {useState} from "react";
import {
    Box,
    Button,
    Collapse,
    Grid,
    IconButton,
    List,
    ListItemIcon,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment/moment";
import {MotifCard, PatientHistoryCard, PatientHistoryStaticCard} from "@features/card";
import Image from "next/image";
import {useRequestMutation} from "@lib/axios";
import {DefaultCountry, SubMotifCard} from "@lib/constants";
import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector, SetSelectedApp} from "@features/toolbar";
import {useRouter} from "next/router";
import {BoxFees, ListItemDetailsStyled, ListItemStyled} from "@features/tabPanel";
import {useMedicalEntitySuffix} from "@lib/hooks";

function HistoryContainer({...props}) {
    const {
        app,
        apps,
        setApps,
        appID,
        appuuid,
        dispatch,
        closePatientDialog = null,
        t,
        setInfo,
        setState,
        setOpenDialog,
        showDoc,
        mutate,
        patient,
        setSelectedTab,
        session,
        medical_entity,
    } = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const [collapse, setCollapse] = useState<any>("");
    const [selected, setSelected] = useState<string>('')

    const {trigger} = useRequestMutation(null, "/editRA");

    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const {selectedApp} = useAppSelector(consultationSelector);

    const printFees = (app: any) => {

        let type = "";
        if (!(patient.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
            type = patient.gender === "F" ? "Mme " : patient.gender === "U" ? "" : "Mr "

        const selectedActs: {
            uuid: string,
            act: { name: string }
            qte: string
            fees: string;
        }[] = [];
        app?.appointment.acts.map((act: { act_uuid: any; name: any; price: any; qte: any; }) => {
            selectedActs.push({
                uuid: act.act_uuid,
                act: {name: act.name},
                fees: act.price,
                qte: act.qte
            })
        });
        setInfo("document_detail");
        setState({
            type: "fees",
            name: "note_fees",
            info: selectedActs,
            consultationFees: app.appointment.consultation_fees,
            createdAt: moment(app.appointment.dayDate, "DD-MM-YYYY").format('DD/MM/YYYY'),
            patient: `${type} ${patient.firstName} ${patient.lastName}`,
        });
        setOpenDialog(true);
    }

    const editReqSheet = (apps: {
        [x: string]: { appointment: { requestedAnalyses: { [x: string]: any; }; }; };
    }, iid: number, idx: number) => {
        const selectedRA = apps[iid].appointment.requestedAnalyses[idx];
        const form = new FormData();
        form.append("analysesResult", JSON.stringify(selectedRA.hasAnalysis));
        trigger(
            {
                method: "PUT",
                url: `${urlMedicalEntitySuffix}/appointments/${app.appointment.uuid}/requested-analysis/${selectedRA.uuid}/${router.locale}`,
                data: form,
                headers: {
                    ContentType: "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
            {
                revalidate: true,
                populateCache: true
            }
        ).then(() => {
            mutate();
        });
    }

    const reqSheetChange = (rs: any, ev: any, appID: number, sheetID: number, sheetAnalysisID: number) => {
        const data = {...rs}
        data.result = ev.target.value
        let capps = [...apps]

        capps[appID] = {...apps[appID]}
        capps[appID].appointment = {...capps[appID].appointment}
        capps[appID].appointment.requestedAnalyses = [...capps[appID].appointment.requestedAnalyses]
        capps[appID].appointment.requestedAnalyses[sheetID] = {...capps[appID].appointment.requestedAnalyses[sheetID]}
        capps[appID].appointment.requestedAnalyses[sheetID].hasAnalysis = [...capps[appID].appointment.requestedAnalyses[sheetID].hasAnalysis]
        capps[appID].appointment.requestedAnalyses[sheetID].hasAnalysis[sheetAnalysisID] = data

        setApps(capps)
    }

    return (
        <PatientHistoryStaticCard
            handleOpen={() => {
                app.appointment.uuid === selectedApp
                    ? dispatch(SetSelectedApp(""))
                    : dispatch(SetSelectedApp(app.appointment.uuid));
            }}
            open={app.appointment.uuid === selectedApp}
            key={`${app.appointment.uuid}timeline`}>
            <PatientHistoryCard
                {...{selectedApp, t, appuuid, dispatch, closePatientDialog, setSelectedTab}}
                key={app.appointment.uuid}
                keyID={app.appointment.uuid}
                data={app}>
                <Collapse
                    in={app.appointment.uuid === selectedApp}>
                    <Stack spacing={2}>
                        <MotifCard data={app} t={t}/>
                        <List dense>
                            {SubMotifCard.map((col: any, indx: number) => (
                                <React.Fragment key={`list-item-${indx}`}>
                                    <>
                                        <ListItemStyled
                                            onClick={() => setCollapse(collapse === col.id ? "" : col.id)}>
                                            <ListItemIcon>
                                                <IconUrl path={col.icon}/>
                                            </ListItemIcon>
                                            <Typography variant="body2" fontWeight={700}>
                                                {t(col.title)}
                                            </Typography>
                                            <IconButton size="small" sx={{ml: "auto"}}>
                                                <IconUrl path="ic-expand-more"/>
                                            </IconButton>
                                        </ListItemStyled>

                                        <Collapse in={app.appointment.uuid === selectedApp} sx={{width: 1}}>
                                            <ListItemDetailsStyled sx={{p: 0}}>
                                                {col.type === "treatment" && <>
                                                    {
                                                        app.appointment.treatments.length > 0 ? <>
                                                            {app.appointment.treatments.filter((t: {
                                                                isOtherProfessional: any;
                                                            }) => t.isOtherProfessional).map((treatment: any, idx: number) => (
                                                                    <Box
                                                                        key={`list-treatement-${idx}`}
                                                                        className={'boxHisto'}>
                                                                        <Typography
                                                                            fontSize={12}>{treatment.name}</Typography>
                                                                        <Stack direction={"row"}>
                                                                            {treatment.dosage && <Typography
                                                                                className={"treamtementDetail"}>• {treatment.dosage}</Typography>}
                                                                            {treatment.duration > 0 && <Typography
                                                                                className={"treamtementDetail"}
                                                                                ml={1}>• {treatment.duration}{" "}{t(treatment.durationType)}</Typography>}
                                                                        </Stack>
                                                                    </Box>
                                                                )
                                                            )}

                                                            {
                                                                app.appointment.treatments.filter((t: {
                                                                    isOtherProfessional: any;
                                                                }) => !t.isOtherProfessional).length > 0 &&
                                                                <Typography fontSize={12}
                                                                            fontWeight={"bold"}>{t('prescription')}</Typography>
                                                            }
                                                            {app.appointment.treatments.filter((t: {
                                                                isOtherProfessional: any;
                                                            }) => !t.isOtherProfessional).map((treatment: any, idx: number) => (
                                                                    <Box
                                                                        key={`list-treatement-${idx}`}
                                                                        className={'boxHisto'}>
                                                                        <Typography
                                                                            fontSize={12}>{treatment.name}</Typography>
                                                                        <Stack direction={"row"}>
                                                                            {
                                                                                treatment.dosage && <Typography
                                                                                    className={"treamtementDetail"}>• {treatment.dosage}</Typography>}
                                                                            {
                                                                                treatment.duration > 0 &&
                                                                                <Typography
                                                                                    className={"treamtementDetail"}
                                                                                    ml={1}>• {treatment.duration}{" "}{t(treatment.durationType)}</Typography>
                                                                            }
                                                                        </Stack>
                                                                    </Box>
                                                                )
                                                            )}
                                                        </> : <Box className={'boxHisto'}>
                                                            <Typography
                                                                className={"empty"}>{t('consultationIP.noTreatment')}</Typography>
                                                        </Box>
                                                    } </>}

                                                {col.type === "document" && <>
                                                    {app.documents.length > 0 ?
                                                        <Box style={{padding: 20, paddingTop: 25}}>
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                className={"docGrid"}>
                                                                {app.documents.map((data: any) => (
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                        key={`doc-item-${data.uuid}`}>
                                                                        <Stack direction={"row"}
                                                                               style={{background: "white"}}
                                                                               borderRadius={1} padding={1}
                                                                               spacing={1} onClick={() => {
                                                                            showDoc(data)
                                                                        }} alignItems="center">
                                                                            {data.documentType !== 'photo' &&
                                                                                <IconUrl height={25} width={25}
                                                                                         path={
                                                                                             data.documentType === "prescription" && "ic-traitement" ||
                                                                                             data.documentType == "requested-analysis" && "ic-analyse" ||
                                                                                             data.documentType == "analyse" && "ic-analyse" ||
                                                                                             data.documentType == "medical-imaging" && "ic-soura" ||
                                                                                             data.documentType == "requested-medical-imaging" && "ic-soura" ||
                                                                                             data.documentType === "audio" && "ic-son" ||
                                                                                             data.documentType === "Rapport" && "ic-text" ||
                                                                                             data.documentType === "medical-certificate" && "ic-text" ||
                                                                                             data.documentType === "video" && "ic-video-outline" ||
                                                                                             data.documentType !== "prescription" && "ic-pdf" || ""
                                                                                         }/>}
                                                                            {data.documentType === 'photo' &&
                                                                                <Image width={25}
                                                                                       height={25}
                                                                                       src={data.uri.thumbnails.length === 0 ? data.uri.url : data.uri.thumbnails['thumbnail_32']}
                                                                                       style={{borderRadius: 5}}
                                                                                       alt={'photo history'}/>}
                                                                            <Typography variant='subtitle2'
                                                                                        textAlign={"center"}
                                                                                        whiteSpace={"nowrap"}
                                                                                        display={"block"}
                                                                                        maxWidth={"60%"}
                                                                                        style={{cursor: "pointer"}}
                                                                                        overflow={"hidden !important"}
                                                                                        textOverflow={'ellipsis'}
                                                                                        fontSize={9}>
                                                                                {t(data.title)}
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        </Box> : <Box className={'boxHisto'}>
                                                            <Typography
                                                                className={"empty"}>{t('consultationIP.noDoc')}</Typography>
                                                        </Box>}
                                                </>}

                                                {col.type === "req-sheet" && <>
                                                    {app?.appointment.requestedAnalyses.length > 0 ? app?.appointment.requestedAnalyses.map(
                                                        (reqSheet: any, reqSheetID: number) => (
                                                            <Box key={`req-sheet-item-${reqSheetID}`}>
                                                                {reqSheet.hasAnalysis.map(
                                                                    (rs: any, reqSheetHasAnalysisID: number) => (
                                                                        <Stack
                                                                            key={`req-sheet-p-${reqSheetHasAnalysisID}`}
                                                                            direction={{
                                                                                md: "row",
                                                                                xs: "column"
                                                                            }} className={"boxHisto"}
                                                                            alignItems={"center"}
                                                                            justifyContent={"space-between"}
                                                                            spacing={2}>
                                                                            <Typography fontSize={12}>
                                                                                {rs.analysis.name}
                                                                            </Typography>

                                                                            <TextField
                                                                                placeholder={"--"}
                                                                                size="small"
                                                                                inputProps={{className: "input"}}
                                                                                onChange={(ev) => {
                                                                                    reqSheetChange(rs, ev, appID, reqSheetID, reqSheetHasAnalysisID)
                                                                                }}
                                                                                autoFocus={selected === rs.uuid + 'result'}
                                                                                onFocus={() => {
                                                                                    setSelected(rs.uuid + 'result')
                                                                                }}
                                                                                onBlur={() => {
                                                                                    setSelected('')
                                                                                }}
                                                                                value={rs.result || ""}/>
                                                                        </Stack>
                                                                    )
                                                                )}

                                                                <Box mt={1} mb={2} width={"fit-content"}
                                                                     ml={"auto"}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color={"info"}
                                                                        onClick={() => {
                                                                            editReqSheet(apps, appID, reqSheetID)
                                                                        }}
                                                                        startIcon={<IconUrl
                                                                            path="ic-edit-file-pen"/>}>
                                                                        {t("consultationIP.save")}
                                                                    </Button>
                                                                </Box>
                                                            </Box>)) : <Box className={'boxHisto'}>
                                                        <Typography
                                                            className={"empty"}>{t('consultationIP.noRequest')}</Typography>
                                                    </Box>}


                                                </>}

                                                {col.type === "req-medical-imaging" && <>
                                                    {
                                                        app?.appointment.requestedImaging && Object.keys(app?.appointment.requestedImaging)
                                                            .length > 0 ? <>
                                                            {
                                                                app?.appointment.requestedImaging["medical-imaging"].map((rs: any, idx: number) => (
                                                                    <Box key={`req-sheet-imgx-${idx}`}
                                                                         className={"boxHisto"}>
                                                                        <Typography
                                                                            fontSize={12}>{rs["medical-imaging"]?.name}</Typography>
                                                                        {rs.uri &&
                                                                            <Grid container mb={0.1} mt={0}
                                                                                  spacing={1}>
                                                                                {
                                                                                    app.documents.filter((doc: {
                                                                                        uri: any;
                                                                                    }) => rs.uri.includes(doc.uri)).map((card: any) => (
                                                                                        <Grid item xs={3}
                                                                                              key={`doc-item-${card.uuid}`}>
                                                                                            <Stack direction={"row"}
                                                                                                   style={{background: "white"}}
                                                                                                   borderRadius={1}
                                                                                                   padding={1}
                                                                                                   spacing={1}
                                                                                                   onClick={() => {
                                                                                                       showDoc(card)
                                                                                                   }}
                                                                                                   alignItems="center">
                                                                                                {card.documentType !== 'photo' &&
                                                                                                    <IconUrl height={25}
                                                                                                             width={25}
                                                                                                             path={
                                                                                                                 card.documentType === "prescription" && "ic-traitement" ||
                                                                                                                 card.documentType == "requested-analysis" && "ic-analyse" ||
                                                                                                                 card.documentType == "analyse" && "ic-analyse" ||
                                                                                                                 card.documentType == "medical-imaging" && "ic-soura" ||
                                                                                                                 card.documentType == "requested-medical-imaging" && "ic-soura" ||
                                                                                                                 card.documentType === "audio" && "ic-son" ||
                                                                                                                 card.documentType === "Rapport" && "ic-text" ||
                                                                                                                 card.documentType === "medical-certificate" && "ic-text" ||
                                                                                                                 card.documentType === "video" && "ic-video-outline" ||
                                                                                                                 card.documentType !== "prescription" && "ic-pdf" || ""
                                                                                                             }/>}
                                                                                                {card.documentType === 'photo' &&
                                                                                                    <Image width={25}
                                                                                                           height={25}
                                                                                                           src={card.uri}
                                                                                                           style={{borderRadius: 5}}
                                                                                                           alt={'photo history'}/>}
                                                                                                <Typography
                                                                                                    variant='subtitle2'
                                                                                                    textAlign={"center"}
                                                                                                    whiteSpace={"nowrap"}
                                                                                                    display={"block"}
                                                                                                    maxWidth={"60%"}
                                                                                                    style={{cursor: "pointer"}}
                                                                                                    overflow={"hidden !important"}
                                                                                                    textOverflow={'ellipsis'}
                                                                                                    fontSize={9}>
                                                                                                    {t(card.title)}
                                                                                                </Typography>
                                                                                            </Stack>
                                                                                        </Grid>
                                                                                    ))
                                                                                }
                                                                            </Grid>}
                                                                    </Box>))
                                                            }
                                                        </> : <Box className={'boxHisto'}>
                                                            <Typography
                                                                className={"empty"}>{t('consultationIP.noImage')}</Typography>
                                                        </Box>
                                                    }
                                                </>}

                                                {col.type === "act-fees" && <BoxFees>
                                                    {

                                                        <BoxFees>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={3}>
                                                                    <Typography
                                                                        className={"header"}>{t('consultationIP.name')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography textAlign={"center"}
                                                                                className={"header"}>{t('consultationIP.qte')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography textAlign={"center"}
                                                                                className={"header"}>{t('consultationIP.price')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography textAlign={"right"}
                                                                                className={"header"}>{t('consultationIP.total')}</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container spacing={2} pb={1} pt={1}
                                                                  style={{borderBottom: '1px dashed gray'}}>
                                                                <Grid item xs={3}>
                                                                    <Typography className={"feesContent"}
                                                                    >{t('consultationIP.consultation')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}></Grid>
                                                                <Grid item xs={3}></Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography textAlign={"right"}
                                                                                className={"feesContent"}>{app?.appointment.consultation_fees
                                                                        ? app?.appointment.consultation_fees
                                                                        : "--"} {devise}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            {app?.appointment.acts.map(
                                                                (act: any, idx: number) => (
                                                                    <Grid container pb={1} pt={1}
                                                                          style={{borderBottom: '1px dashed gray'}}
                                                                          key={`fees-${idx}`}
                                                                          spacing={2} alignItems="center">
                                                                        <Grid item xs={3}>
                                                                            <Typography
                                                                                className={"feesContent"}>{act.name}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <Typography
                                                                                textAlign={"center"}
                                                                                className={"feesContent"}>{act.qte}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <Typography
                                                                                textAlign={"center"}
                                                                                className={"feesContent"}>{act.price} {devise}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <Typography
                                                                                textAlign={"right"}
                                                                                className={"feesContent"}>{act.price * act.qte} {devise}</Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                )
                                                            )}

                                                            <Stack mt={2} pt={1} direction={"row"}
                                                                   alignItems={"center"}
                                                                   justifyContent={"flex-end"}>
                                                                <Typography textAlign={"right"} mr={2}
                                                                            fontWeight={"bold"}
                                                                            fontSize={18}>
                                                                    Total : {app.appointment.fees} {devise} |
                                                                </Typography>
                                                                <Button
                                                                    variant="contained"
                                                                    color={"info"}
                                                                    onClick={() => {
                                                                        printFees(app)
                                                                    }}
                                                                    startIcon={<IconUrl
                                                                        path="ic-imprime"/>}>
                                                                    {t("consultationIP.print")}
                                                                </Button>
                                                            </Stack>
                                                        </BoxFees>
                                                    }
                                                </BoxFees>}
                                            </ListItemDetailsStyled>
                                        </Collapse>
                                    </>
                                </React.Fragment>
                            ))}
                        </List>
                    </Stack>
                </Collapse>
            </PatientHistoryCard>
        </PatientHistoryStaticCard>
    );
}

export default HistoryContainer;
