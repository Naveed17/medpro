import React, {useEffect, useState} from "react";
import {DocumentCard, HistoryCard, MotifCard, PatientHistoryCard,} from "@features/card";
import {Label} from "@features/label";
import {
    Box,
    Button,
    Collapse,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItemIcon,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useAppSelector} from "@app/redux/hooks";
import {AppointmentDetail, DialogProps, openDrawer as DialogOpenDrawer,} from "@features/dialog";
import {consultationSelector, SetSelectedApp} from "@features/toolbar";
import {useRequestMutation} from "@app/axios";
import IconUrl from "@themes/urlIcon";
import ListItemStyled from "./overrides/listItemStyled"
import ListItemDetailsStyled from "./overrides/listItemDetailsStyled"
import BoxFees from "./overrides/boxFeesStyled"

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
        appuuid,
        dispatch,
        setOpenDialog,
        medical_entity,
        showDoc,
        session,
        mutate,
        locale
    } = props;

    const {trigger} = useRequestMutation(null, "/editRA");

    const devise = process.env.NEXT_PUBLIC_DEVISE;

    const subMotifCard = [
        {
            id: 1,
            title: "treatment_medication",
            icon: "ic-traitement",
            type: "treatment",
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
                },
            ],
        },
        {
            id: 2,
            title: "documents",
            icon: "ic-document",
            type: "document",
            documents: ["document_1", "document_2"],
        },
        {
            id: 3,
            title: "bal_sheet_req",
            icon: "ic-document",
            type: "req-sheet",
        },
        {
            id: 4,
            title: "medical_sheet_req",
            icon: "ic-soura",
            type: "req-medical-imaging",
        },
        {
            id: 5,
            title: "actfees",
            icon: "ic-text",
            type: "act-fees",
        },
    ];

    const {drawer} = useAppSelector((state: { dialog: DialogProps }) => state.dialog);

    const {selectedApp} = useAppSelector(consultationSelector);

    const [collapse, setCollapse] = useState<any>("");
    const [size, setSize] = useState<number>(3);
    const [apps, setApps] = useState<any>([]);
    const [selected, setSelected] = useState<string>('')

    useEffect(() => {
        setApps([...appointement.latestAppointments]);
        if (appointement.latestAppointments.length > 0) {
            dispatch(SetSelectedApp(appointement.latestAppointments[0].appointment.uuid))
        }
    }, [appointement, appuuid, dispatch]);

    const printFees = (app: { appointment: { acts: any[], consultation_fees: string } }) => {
        const selectedActs: {
            uuid: string,
            act: { name: string }
            qte: string
            fees: string;
        }[] = [];
        app?.appointment.acts.map((act) => {
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
            patient: `${patient.firstName}   ${patient.lastName}`,
        });
        setOpenDialog(true);

    }

    const editReqSheet = (apps: { [x: string]: { appointment: { requestedAnalyses: { [x: string]: any; }; }; }; }, iid: number, idx: number) => {
        const selectedRA = apps[iid].appointment.requestedAnalyses[idx];
        const form = new FormData();
        form.append("analysesResult", JSON.stringify(selectedRA.hasAnalysis));
        trigger(
            {
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/requested-analysis/${selectedRA.uuid}/${locale}`,
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

    const reqSheetChange = (rs: { result: any; }, ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, iid: number, idx: number, idxh: number) => {
        const data = {...rs}
        data.result = ev.target.value
        let capps = [...apps]
        console.log(rs, ev, capps, iid, idx, idxh);
        capps[iid].appointment.requestedAnalyses[idx].hasAnalysis[idxh] = rs
        setApps(capps)
    }

    return (
        <>
            {patient?.nextAppointments.length > 0 && (
                <Stack spacing={2} mb={2} alignItems="flex-start">
                    <Label variant="filled" color="warning">
                        {t("next_meeting")}
                    </Label>
                    {patient?.nextAppointments
                        .slice(0, size)
                        .map((data: any, index: number) => (
                            <React.Fragment key={`patient-${index}`}>
                                <HistoryCard row={data} patient={patient} t={t}/>
                            </React.Fragment>
                        ))}
                </Stack>
            )}
            {size < patient?.nextAppointments.length && (
                <Button
                    style={{marginBottom: 10, marginTop: -10, fontSize: 12}}
                    onClick={() => {
                        setSize(patient?.nextAppointments.length);
                    }}>
                    {t("showAll")}
                </Button>
            )}

            <Stack spacing={2}>
                {apps.map((app: any, iid: number) => (
                    <PatientHistoryCard
                        {...{selectedApp, t, appuuid, dispatch}}
                        key={app.appointment.uuid}
                        keyID={app.appointment.uuid}
                        data={app}>
                        <Collapse
                            in={app.appointment.uuid === selectedApp}>
                            <Stack spacing={2}>
                                <MotifCard data={app} t={t}/>
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
                                                                                <Typography className={"treamtementDetail"}
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
                                                                                    data={card}
                                                                                    style={{width: 30}}
                                                                                    onClick={() => {
                                                                                        showDoc(card)
                                                                                    }}
                                                                                    t={t}
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

                                                                                    <TextField
                                                                                        placeholder={"--"}
                                                                                        size="small"
                                                                                        inputProps={{className: "input"}}
                                                                                        onChange={(ev) => {
                                                                                            reqSheetChange(rs, ev, iid, idx, idxh)
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
                                                                                    editReqSheet(apps, iid, idx)
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
                ))}
            </Stack>
            <Drawer
                anchor={"right"}
                open={drawer}
                dir={direction}
                onClose={() => {
                    dispatch(DialogOpenDrawer(false));
                }}>
                <AppointmentDetail/>
            </Drawer>
        </>
    );
}

export default HistoryTab;
