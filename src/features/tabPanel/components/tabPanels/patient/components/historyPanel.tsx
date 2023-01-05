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

const subMotifCard = [
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
];

function HistoryPanel({...props}) {
    const {previousAppointmentsData: previousAppointments, patient} = props;

    const {selectedApp} = useAppSelector(consultationSelector);
    const {direction} = useAppSelector(configSelector);
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);
    const [dialog, setDialog] = useState<string>("");
    const [state, setState] = useState<any>();
    const [info, setInfo] = useState<null | string>("");
    const [collapse, setCollapse] = useState<any>('');
    const devise = process.env.NEXT_PUBLIC_DEVISE;

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
                doctor: card.name,
                patient: card.patient,
                days: card.days,
                createdAt: card.createdAt,
                name: 'certif',
                type: 'write_certif'
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
                uuidDoc: uuidDoc,
                patient: patient.firstName + ' ' + patient.lastName
            })
            setOpenDialog(true);
        }
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
                                    <MotifCard data={app} {...{t}}/>
                                    <List dense>
                                        {subMotifCard.map((col: any, indx: number) => (
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
                                                                            {app.documents.map((card: any) => (
                                                                                <Grid
                                                                                    item
                                                                                    xs={3}
                                                                                    key={`doc-item-${card.uuid}`}>
                                                                                    <DocumentCard
                                                                                        {...{t}}
                                                                                        data={card}
                                                                                        style={{width: 30}}
                                                                                        onClick={() => {
                                                                                            showDoc(card)
                                                                                        }}
                                                                                    />
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
                                                                    (reqSheet: any, idx: number) => (
                                                                        <Box key={`req-sheet-item-${idx}`}>
                                                                            {reqSheet.hasAnalysis.map(
                                                                                (rs: any, idxh: number) => (
                                                                                    <Stack key={`req-sheet-p-${idxh}`}
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

                                                                                        <Typography
                                                                                            fontSize={12}>{rs.result}</Typography>
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
                                                                                                            }} {...{t}}/>
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
                                                                <Grid container spacing={2}>
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
                                                                            : "--"}</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                {
                                                                    app?.appointment.acts.length > 0 &&
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
                                                                        {app?.appointment.acts.map(
                                                                            (act: any, idx: number) => (
                                                                                <Grid container key={`fees-${idx}`}
                                                                                      spacing={2}>
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
                                                                                    //printFees(app)
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
