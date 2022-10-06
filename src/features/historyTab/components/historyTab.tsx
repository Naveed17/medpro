import React, {useState} from "react";
import {CIPPatientHistoryCard, DocumentCard, HistoryCard, MotifCard} from "@features/card";
import {Label} from "@features/label";
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Stack,
    Typography
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CIPPatientHistoryCardStyled
    from "@features/card/components/cIPPatientHistoryCard/components/overrides/cIPPatientHistoryCardStyle";
import {useAppSelector} from "@app/redux/hooks";
import Icon from "@themes/icon";
import {capitalize} from 'lodash'
import {AppointmentDetail, DialogProps, openDrawer as DialogOpenDrawer} from "@features/dialog";

function HistoryTab({...props}) {

    const {
        patient,
        appointement,
        t,
        setIsViewerOpen,
        direction,
        setInfo,
        mutateDoc,
        setState,
        dispatch,
        setOpenDialog
    } = props

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

    const {drawer} = useAppSelector((state: { dialog: DialogProps; }) => state.dialog);
    const [collapse, setCollapse] = useState<any>('');
    const [size, setSize] = useState<number>(3);

    return (
        <>
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

            {appointement && appointement.status === 5 && <Stack spacing={2}>
                <CIPPatientHistoryCardStyled sx={{border: '2px solid #fed400', marginBottom: 2}}>
                    <Stack className="card-header" p={2} direction="row" alignItems="center"
                           borderBottom={1}
                           borderColor="divider">
                        <Typography display='flex' alignItems="center" component="div"
                                    fontWeight={600}>
                            <Icon path={'ic-doc'}/>
                            {capitalize(t('reason_for_consultation'))} {appointement.consultationReason ? <>: {appointement.consultationReason.name}</> : <>:
                            --</>}
                        </Typography>
                        <Typography variant='body2' color="text.secondary" ml="auto">
                            {appointement.dayDate}
                        </Typography>
                    </Stack>
                    <CardContent>
                        <Grid container spacing={2}>
                            {appointement.consultation_sheet.modal.data && JSON.stringify(appointement?.consultation_sheet.modal.data) !== '{"submit":true}' &&
                                <Grid item xs={12} md={6}>
                                    <Card className="motif-card">
                                        <CardContent>

                                            <Typography variant="body2" fontWeight={700}
                                                        marginBottom={1}>
                                                {t('tracking_data')}
                                            </Typography>

                                            {
                                                Object.keys(appointement.consultation_sheet.modal.data).map((appdata, idx) => (
                                                    appdata !== 'models' && <Box key={'tex' + idx}>
                                                        <List>
                                                            <ListItem>
                                                                • <Typography variant="body2"
                                                                              fontWeight={700}
                                                                              textTransform={"capitalize"}>
                                                                {appdata}
                                                            </Typography> : {appointement.consultation_sheet.modal.data[appdata] ? appointement.consultation_sheet.modal.data[appdata] : '--'}
                                                            </ListItem>
                                                        </List>
                                                    </Box>
                                                ))
                                            }
                                        </CardContent>
                                    </Card>
                                </Grid>}

                            <Grid item xs={12} md={6}>
                                <Card className="motif-card">
                                    <CardContent>
                                        {
                                            Object.keys(appointement.consultation_sheet.exam.appointment_data).map((appdata, idx) => (
                                                appdata !== 'models' && <Box key={'tex' + idx}>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        {t(appdata)}
                                                    </Typography>
                                                    {
                                                        appdata !== 'consultation_reason' &&
                                                        <List>
                                                            <ListItem>
                                                                • {appointement.consultation_sheet.exam.appointment_data[appdata].value}
                                                            </ListItem>
                                                        </List>
                                                    }
                                                    {
                                                        appdata === 'consultation_reason' &&
                                                        <List>
                                                            <ListItem>
                                                                • {appointement.consultation_sheet.exam.appointment_data[appdata].name}
                                                            </ListItem>
                                                        </List>
                                                    }
                                                </Box>
                                            ))
                                        }
                                    </CardContent>
                                </Card>
                            </Grid>

                        </Grid>

                    </CardContent>
                </CIPPatientHistoryCardStyled>
            </Stack>}

            <Stack spacing={2}>
                {appointement && appointement.latestAppointments.map((app: any) => (
                    <CIPPatientHistoryCard key={app.appointment.uuid} data={app}>
                        <Stack spacing={2}>
                            <MotifCard data={app}/>
                            <List dense>
                                {
                                    subMotifCard.map((col: any, idx: number) => (
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

                                                        {col.type === "req-sheet" && appointement?.latestAppointment && appointement?.latestAppointment.requestedAnalyses && appointement?.latestAppointment.requestedAnalyses.map((reqSheet: any, idx: number) => (
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
                                                            col.type === "document" && app.documents.length > 0 &&
                                                            <Box style={{padding: 20, paddingTop: 25}}>
                                                                <Grid container spacing={2} sx={{
                                                                    bgcolor: theme => theme.palette.grey['A100'],
                                                                    mb: 1,
                                                                    padding: 2,
                                                                    borderRadius: 0.7
                                                                }}>
                                                                    {
                                                                        app.documents.map((card: any) =>
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


                                                        {
                                                            col.type === "document" && (app.documents === null || app.documents.length === 0) &&
                                                            <p style={{
                                                                fontSize: 12,
                                                                color: "gray",
                                                                textAlign: "center"
                                                            }}>Aucun document</p>
                                                        }
                                                    </Collapse>
                                                </ListItem>
                                            </>


                                        </React.Fragment>
                                    ))
                                }
                            </List>

                        </Stack>
                    </CIPPatientHistoryCard>
                ))
                }
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
        </>
    );
}

export default HistoryTab;
