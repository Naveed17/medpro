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
    Typography, useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment/moment";
import {MotifCard, PatientHistoryCard, PatientHistoryStaticCard} from "@features/card";
import Image from "next/image";
import {useRequestQueryMutation} from "@lib/axios";
import {DefaultCountry, iconDocument, SubMotifCard} from "@lib/constants";
import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector, SetSelectedApp} from "@features/toolbar";
import {useRouter} from "next/router";
import {BoxFees, ListItemDetailsStyled, ListItemStyled} from "@features/tabPanel";
import {getBirthdayFormat, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {useTranslation} from "next-i18next";
import {agendaSelector} from "@features/calendar";

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
        patient,
        setSelectedTab,
        medical_entity
    } = props;
    const router = useRouter();
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t: commonTranslation} = useTranslation("common");
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [collapse, setCollapse] = useState<any>("");
    const [selected, setSelected] = useState<string>('')
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const {trigger: triggerRaEdit} = useRequestQueryMutation("/RA/edit");
    const {trigger: deleteAppointmentData} = useRequestQueryMutation("/agenda/delete/appointment/data");

    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const {selectedApp} = useAppSelector(consultationSelector);
    const {direction} = useAppSelector(configSelector);

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
            //consultationFees: app.appointment.consultation_fees,
            createdAt: moment(app.appointment.dayDate, "DD-MM-YYYY").format('DD/MM/YYYY'),
            patient: `${type} ${patient.firstName} ${patient.lastName}`,
            age: patient?.birthdate ? getBirthdayFormat({birthdate: patient.birthdate}, t) : ""
        });
        setOpenDialog(true);
    }

    const handleDeleteAppointment = () => {
        setLoadingReq(true);
        const params = new FormData();
        params.append("type", "delete-appointment-data");

        deleteAppointmentData({
            method: "DELETE",
            data: params,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app.appointment.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                if (medicalEntityHasUser) {
                    invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/appointments/history/${router.locale}`])
                }
                setDeleteDialog(false);
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    const editReqSheet = (apps: {
        [x: string]: { appointment: { requestedAnalyses: { [x: string]: any; }; }; };
    }, iid: number, idx: number) => {
        const selectedRA = apps[iid].appointment.requestedAnalyses[idx];
        const form = new FormData();
        form.append("analysesResult", JSON.stringify(selectedRA.hasAnalysis));
        triggerRaEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/appointments/${app.appointment.uuid}/requested-analysis/${selectedRA.uuid}/${router.locale}`,
            data: form,
        }, {
            onSuccess: () => {
                if (medicalEntityHasUser) {
                    invalidateQueries([
                        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/antecedents/${router.locale}`,
                        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/analysis/${router.locale}`]);
                }
            }
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

        setApps && setApps(capps)
        medicalEntityHasUser && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/appointments/history-list/${router.locale}`]);
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
                {...{
                    selectedApp,
                    t,
                    appuuid,
                    dispatch,
                    closePatientDialog,
                    setSelectedTab,
                    handleDeleteApp: () => setDeleteDialog(true)
                }}
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
                                                            {
                                                                app.appointment.treatments.filter((t: {
                                                                    isOtherProfessional: any;
                                                                }) => t.isOtherProfessional).length > 0 &&
                                                                <Typography fontSize={12}
                                                                            fontWeight={"bold"}>{t('treatement_in_progress')}</Typography>
                                                            }
                                                            {app.appointment.treatments.filter((t: {
                                                                isOtherProfessional: any;
                                                            }) => t.isOtherProfessional).map((treatment: any, idx: number) => (
                                                                    <Box
                                                                        key={`list-treatement-${idx}`}
                                                                        className={'boxHisto'}>
                                                                        <Typography
                                                                            fontSize={12}>{treatment.name}</Typography>
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
                                                                                         path={iconDocument(data.documentType)}/>}
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
                                                                app?.appointment.requestedImaging["medical-imaging"]?.map((rs: any, idx: number) => (
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
                                                                                                             path={iconDocument(card.documentType)}/>}
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

                                                            {/*<Grid container spacing={2} pb={1} pt={1}
                                                                  style={{borderBottom: '1px dashed gray'}}>
                                                                <Grid item xs={3}>
                                                                    <Typography className={"feesContent"}
                                                                    >{t('consultationIP.consultation')}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}></Grid>
                                                                <Grid item xs={3}></Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography textAlign={"right"}
                                                                                className={"feesContent"}>{app?.appointment.consultation_fees && app?.appointment.consultation_fees !== "null"
                                                                        ? app?.appointment.consultation_fees
                                                                        : "--"} {devise}</Typography>
                                                                </Grid>
                                                            </Grid>*/}
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
                                                                    startIcon={<IconUrl color={theme.palette.text.primary}
                                                                                        width={16}
                                                                                        height={16}
                                                                                        path="menu/ic-print"/>}>
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

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteDialog(false)}
                sx={{
                    direction
                }}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{commonTranslation(`dialogs.delete-dialog.sub-title-data`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{commonTranslation(`dialogs.delete-dialog.description-data`)}</Typography>
                        </Box>)
                }}
                open={deleteDialog}
                title={commonTranslation(`dialogs.delete-dialog.title-data`)}
                actionDialog={
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant="text-black"
                            onClick={() => setDeleteDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {commonTranslation(`dialogs.delete-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            loading={loadingReq}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={() => handleDeleteAppointment()}
                            startIcon={<IconUrl height={"18"} width={"18"} color={"white"}
                                                path="ic-trash"></IconUrl>}>
                            {commonTranslation(`dialogs.delete-dialog.confirm`)}
                        </LoadingButton>
                    </Stack>
                }
            />

        </PatientHistoryStaticCard>
    );
}

export default HistoryContainer;
