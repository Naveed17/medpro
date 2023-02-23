import {
    Box,
    Button,
    Collapse,
    DialogActions,
    Grid,
    IconButton,
    List,
    ListItemIcon,
    Stack,
    Typography,
    useTheme
} from '@mui/material'
import {DocumentCard, MotifCard, PatientHistoryCard} from '@features/card'
import React, {useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import IconUrl from '@themes/urlIcon'
import {BoxFees, ListItemDetailsStyled, ListItemStyled} from "@features/tabPanel";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {Dialog} from "@features/dialog";
import {configSelector} from "@features/base";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry, SubMotifCard} from "@app/constants";
import Image from "next/image";
import moment from "moment/moment";

function HistoryPanel({...props}) {
    const {previousAppointmentsData: previousAppointments, patient, mutate} = props;

    const {selectedApp} = useAppSelector(consultationSelector);
    const {direction} = useAppSelector(configSelector);
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);
    const [dialog, setDialog] = useState<string>("");
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [collapse, setCollapse] = useState<any>('');


    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const {t} = useTranslation("consultation");


    const DialogAction = () => {
        return (
            <DialogActions style={{justifyContent: 'space-between', width: '100%'}}>
                <Button
                    variant="text-black"
                    startIcon={<LogoutRoundedIcon/>}>
                    {t("withoutSave")}
                </Button>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        variant="text-black"
                        startIcon={<CloseIcon/>}>
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<IconUrl path="ic-check"/>}>
                        {t("end_consultation")}
                    </Button>
                </Stack>
            </DialogActions>
        );
    };

    const showDoc = (card: any) => {
        if (card.documentType === 'medical-certificate') {
            setInfo('document_detail');
            setState({
                uuid: card.uuid,
                content: card.certificate[0].content,
                certifUuid : card.certificate[0].uuid,
                doctor: card.name,
                patient: card.patient,
                description: card.description,
                days: card.days,
                createdAt: card.createdAt,
                name: 'certif',
                detectedType: card.type,
                type: 'write_certif',
                mutate: mutate()
            })
            setOpenDialog(true);
        } else {
            setInfo('document_detail')
            let info = card
            let uuidDoc = "";
            switch (card.documentType) {
                case "prescription":
                    info = card.prescription[0].prescription_has_drugs;
                    uuidDoc = card.prescription[0].uuid
                    break;
                case "requested-analysis":
                    info = card.requested_Analyses[0].analyses;
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]['medical-imaging'];
                    break;
            }
            setState({
                uuid: card.uuid,
                uri: card.uri,
                name: card.title,
                type: card.documentType,
                info: info,
                createdAt: card.createdAt,
                description: card.description,
                uuidDoc: uuidDoc,
                detectedType: card.type,
                patient: patient.firstName + ' ' + patient.lastName,
                mutate: mutate()
            })
            setOpenDialog(true);
        }
    }

    const printFees = (app: any) => {
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
            patient: `${patient.gender === "F" ? "Mme " : patient.gender === "U" ? "" : "Mr "} ${patient.firstName} ${patient.lastName}`,
        });
        setOpenDialog(true);
    }
    return (
        <PanelStyled>
            <Box className="files-panel">
                <Typography fontWeight={600} p={1}>
                    {t("history")}
                </Typography>
                <Stack spacing={2}>
                    {previousAppointments && previousAppointments.map((app: any) => (
                        <PatientHistoryCard
                            {...{selectedApp, t, dispatch}}
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

                                                    <Collapse in={collapse === col.id} sx={{width: 1}}>
                                                        <ListItemDetailsStyled sx={{p: 0}}>
                                                            {col.type === "treatment" && <>
                                                                {
                                                                    app.appointment.treatments.length > 0 ? app.appointment.treatments.map((treatment: any, idx: number) => (
                                                                            <Box
                                                                                key={`list-treatement-${idx}`}
                                                                                className={'boxHisto'}>
                                                                                <Typography
                                                                                    fontSize={12}>{treatment.name}</Typography>
                                                                                <Stack direction={"row"}>
                                                                                    <Typography
                                                                                        className={"treamtementDetail"}>• {treatment.dosage}</Typography>
                                                                                    <Typography
                                                                                        className={"treamtementDetail"}
                                                                                        ml={1}>• {treatment.duration}{" "}{t(treatment.durationType)}</Typography>
                                                                                </Stack>
                                                                            </Box>
                                                                        )
                                                                    ) : <Box className={'boxHisto'}>
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
                                                                                    md={4}
                                                                                    key={`doc-item-${data.uuid}`}>
                                                                                    <Stack direction={"row"}
                                                                                           style={{background: "white"}}
                                                                                           borderRadius={1} padding={1}
                                                                                           spacing={1} onClick={() => {
                                                                                        showDoc(data)
                                                                                    }} alignItems="center">
                                                                                        {data.documentType !== 'photo' &&
                                                                                            <IconUrl height={25}
                                                                                                     width={25}
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
                                                                                                   src={data.uri}
                                                                                                   style={{borderRadius: 5}}
                                                                                                   alt={'photo history'}/>}
                                                                                        <Typography variant='subtitle2'
                                                                                                    textAlign={"center"}
                                                                                                    whiteSpace={"nowrap"}
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

                                                                                        <Typography>{rs.result}</Typography>
                                                                                    </Stack>
                                                                                )
                                                                            )}
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
                                                                                        fontSize={12}>{rs["medical-imaging"].name}</Typography>
                                                                                    {rs.uri &&
                                                                                        <Grid container mb={1} mt={0.1}
                                                                                              spacing={2}>
                                                                                            {
                                                                                                app.documents.filter((doc: { uri: any; }) => rs.uri.includes(doc.uri)).map((card: any) => (
                                                                                                    <Grid item xs={3}
                                                                                                          key={`doc-item-${card.uuid}`}>
                                                                                                        <DocumentCard
                                                                                                            data={card}
                                                                                                            style={{width: 30}}
                                                                                                            onClick={() => {
                                                                                                                showDoc(card)
                                                                                                            }} t={t}/>
                                                                                                    </Grid>
                                                                                                ))}
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
                                                                {app?.appointment.acts.length > 0 ?
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

                                                                        <Stack mt={2} direction={"row"}
                                                                               alignItems={"center"}
                                                                               justifyContent={"flex-end"}>
                                                                            <Typography textAlign={"right"} mr={2}
                                                                                        fontWeight={"bold"}
                                                                                        fontSize={18}>
                                                                                Total
                                                                                : {app.appointment.fees} {devise} |
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
                                                                    </BoxFees> :
                                                                    <Box className={'boxHisto'}>
                                                                        <Typography
                                                                            className={"empty"}>{t('consultationIP.noFees')}</Typography>
                                                                    </Box>
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
                    ))}
                </Stack>
            </Box>

            {info && (
                <Dialog
                    {...{
                        direction,
                        sx: {
                            minHeight: 300
                        }
                    }}
                    action={info}
                    open={openDialog}
                    data={{
                        state,
                        setState,
                        setDialog,
                        setOpenDialog,
                        t
                    }}
                    size={"lg"}
                    color={
                        info === "secretary_consultation_alert" && theme.palette.error.main
                    }
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
        </PanelStyled>
    )
}

export default HistoryPanel
