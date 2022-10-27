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
    ListItem,
    ListItemIcon,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useAppSelector} from "@app/redux/hooks";
import {AppointmentDetail, DialogProps, openDrawer as DialogOpenDrawer,} from "@features/dialog";
import {consultationSelector, SetSelectedApp} from "@features/toolbar";
import {useRequestMutation} from "@app/axios";

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
        acts,
        appuuid,
        dispatch,
        setOpenDialog,
        medical_entity,
        session,
        mutate,
        locale
    } = props;

    const {trigger} = useRequestMutation(null, "/editRA");


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

    useEffect(() => {
        setApps([...appointement.latestAppointments]);
        dispatch(SetSelectedApp(appuuid))
    }, [appointement, appuuid, dispatch]);

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
                        t={t}
                        key={app.appointment.uuid}
                        keyID={app.appointment.uuid}
                        selectedApp={selectedApp}
                        dispatch={dispatch}
                        data={app}
                        appuuid={appuuid}>
                        <Collapse
                            in={app.appointment.uuid === selectedApp}>
                            <Stack spacing={2}>
                                <MotifCard data={app} t={t}/>
                                <List dense>
                                    {subMotifCard.map((col: any, indx: number) => (
                                        <React.Fragment key={`list-item-${indx}`}>
                                            <>
                                                <ListItem
                                                    onClick={() =>
                                                        setCollapse(collapse === col.id ? "" : col.id)
                                                    }
                                                    sx={{
                                                        cursor: "pointer",
                                                        borderTop: 1,
                                                        borderColor: "divider",
                                                        px: 0,
                                                        "& .MuiListItemIcon-root": {
                                                            minWidth: 20,
                                                            svg: {
                                                                width: 14,
                                                                height: 14,
                                                            },
                                                        },
                                                    }}>
                                                    <ListItemIcon>
                                                        <IconUrl path={col.icon}/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        {t(col.title)}
                                                    </Typography>
                                                    <IconButton size="small" sx={{ml: "auto"}}>
                                                        <IconUrl path="ic-expand-more"/>
                                                    </IconButton>
                                                </ListItem>

                                                <ListItem sx={{p: 0}}>
                                                    <Collapse in={collapse === col.id} sx={{width: 1}}>
                                                        {col.type === "treatment" &&
                                                            app.appointment.treatments.map(
                                                                (treatment: any, idx: number) => (
                                                                    <Box
                                                                        key={`list-treatement-${idx}`}
                                                                        sx={{
                                                                            bgcolor: (theme) =>
                                                                                theme.palette.grey["A100"],
                                                                            mb: 1,
                                                                            padding: 2,
                                                                            borderRadius: 0.7,
                                                                        }}>
                                                                        <p
                                                                            style={{
                                                                                margin: 0,
                                                                                fontSize: 13,
                                                                            }}>
                                                                            {treatment.name}
                                                                        </p>
                                                                        <p
                                                                            style={{
                                                                                margin: 0,
                                                                                color: "gray",
                                                                                fontSize: 12,
                                                                                marginLeft: 15,
                                                                            }}>
                                                                            • {treatment.dosage}
                                                                        </p>
                                                                        <p
                                                                            style={{
                                                                                margin: 0,
                                                                                color: "gray",
                                                                                fontSize: 12,
                                                                                marginLeft: 15,
                                                                            }}>
                                                                            • {treatment.duration}{" "}
                                                                            {t(treatment.durationType)}
                                                                        </p>
                                                                    </Box>
                                                                )
                                                            )}
                                                        {col.type === "treatment" &&
                                                            app.appointment.treatments.length == 0 && (
                                                                <Box
                                                                    key={`req-sheet-item-${indx}`}
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.grey["A100"],
                                                                        mb: 1,
                                                                        padding: 2,
                                                                        borderRadius: 0.7,
                                                                    }}>
                                                                    <Typography
                                                                        fontSize={12}
                                                                        margin={0}
                                                                        textAlign={"center"}
                                                                        color={"#66696c"}>
                                                                        {t('consultationIP.noTreatment')}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                        {col.type === "req-sheet" &&
                                                            app?.appointment.requestedAnalyses.map(
                                                                (reqSheet: any, idx: number) => (
                                                                    <Box
                                                                        key={`req-sheet-item-${idx}`}
                                                                        sx={{
                                                                            bgcolor: (theme) =>
                                                                                theme.palette.grey["A100"],
                                                                            mb: 1,
                                                                            padding: 2,
                                                                            borderRadius: 0.7,
                                                                        }}>
                                                                        {reqSheet.hasAnalysis.map(
                                                                            (rs: any, idxh: number) => (
                                                                                <Stack key={`req-sheet-p-${idxh}`}
                                                                                       mb={1}
                                                                                       direction={{
                                                                                           md: "row",
                                                                                           xs: "column"
                                                                                       }}
                                                                                       alignItems={"center"}
                                                                                       justifyContent={"space-between"}
                                                                                       spacing={2}>
                                                                                    <Typography>
                                                                                        • {rs.analysis.name}
                                                                                    </Typography>
                                                                                    <TextField
                                                                                        placeholder={"--"}
                                                                                        size="small"
                                                                                        type={"number"}
                                                                                        inputProps={{
                                                                                            min: 0,
                                                                                            style: {
                                                                                                textAlign: 'center',
                                                                                                width: 50,
                                                                                                borderRadius: 15
                                                                                            }
                                                                                        }}
                                                                                        onChange={(ev) => {
                                                                                            rs.result = ev.target.value
                                                                                            let capps = [...apps]
                                                                                            capps[iid].appointment.requestedAnalyses[idx].hasAnalysis[idxh] = rs
                                                                                            setApps(capps)
                                                                                        }}
                                                                                        value={rs.result}/>
                                                                                </Stack>
                                                                            )
                                                                        )}

                                                                        {reqSheet.hasAnalysis.length > 0 && (
                                                                            <Box mt={2} width={"fit-content"}
                                                                                 ml={"auto"}>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    color={"info"}
                                                                                    onClick={() => {
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
                                                                                    }}
                                                                                    startIcon={<IconUrl
                                                                                        path="ic-edit-file-pen"/>}>
                                                                                    {t("consultationIP.save")}
                                                                                </Button>
                                                                            </Box>
                                                                        )}
                                                                    </Box>
                                                                )
                                                            )}
                                                        {col.type === "req-medical-imaging" &&
                                                            app?.appointment.requestedImaging &&
                                                            Object.keys(app?.appointment.requestedImaging)
                                                                .length > 0 && (
                                                                <Box
                                                                    key={`req-sheet-item-${indx}`}
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.grey["A100"],
                                                                        mb: 1,
                                                                        padding: 2,
                                                                        borderRadius: 0.7,
                                                                    }}>
                                                                    {app?.appointment.requestedImaging["medical-imaging"].map((rs: any, idx: number) => (
                                                                        <Box key={`req-sheet-p-${idx}`}>
                                                                            <ListItem>
                                                                                <Typography
                                                                                    variant="body2" fontWeight={"bold"}>
                                                                                    • {rs["medical-imaging"].name}
                                                                                </Typography>
                                                                            </ListItem>

                                                                            {rs.uri && <Grid
                                                                                container
                                                                                spacing={2}
                                                                                sx={{
                                                                                    bgcolor: (theme) =>
                                                                                        theme.palette.grey["A100"],
                                                                                    mb: 1,
                                                                                    padding: 2,
                                                                                    borderRadius: 0.7,
                                                                                }}>
                                                                                {app.documents.filter((doc: { uri: any; }) => rs.uri.includes(doc.uri)).map((card: any) => (
                                                                                    <Grid
                                                                                        item
                                                                                        xs={3}
                                                                                        key={`doc-item-${card.uuid}`}>
                                                                                        <DocumentCard
                                                                                            data={card}
                                                                                            style={{width: 30}}
                                                                                            onClick={() => {
                                                                                                if (card.documentType === "photo") {
                                                                                                    setIsViewerOpen(card.uri);
                                                                                                } else if (
                                                                                                    card.documentType ===
                                                                                                    "medical-certificate"
                                                                                                ) {
                                                                                                    setInfo("document_detail");
                                                                                                    setState({
                                                                                                        content:
                                                                                                        card.certificate[0].content,
                                                                                                        doctor: card.name,
                                                                                                        patient: card.patient,
                                                                                                        days: card.days,
                                                                                                        name: "certif",
                                                                                                        type: "write_certif",
                                                                                                    });
                                                                                                    setOpenDialog(true);
                                                                                                } else {
                                                                                                    setInfo("document_detail");
                                                                                                    let info = card;
                                                                                                    switch (card.documentType) {
                                                                                                        case "prescription":
                                                                                                            info =
                                                                                                                card.prescription[0]
                                                                                                                    .prescription_has_drugs;
                                                                                                            break;
                                                                                                        case "requested-analysis":
                                                                                                            info =
                                                                                                                card.requested_Analyses[0]
                                                                                                                    .analyses;
                                                                                                            break;
                                                                                                    }
                                                                                                    setState({
                                                                                                        uuid: card.uuid,
                                                                                                        uri: card.uri,
                                                                                                        name: card.title,
                                                                                                        type: card.documentType,
                                                                                                        info: info,
                                                                                                        patient:
                                                                                                            patient.firstName +
                                                                                                            " " +
                                                                                                            patient.lastName,
                                                                                                        mutate: mutateDoc,
                                                                                                    });
                                                                                                    setOpenDialog(true);
                                                                                                }
                                                                                            }}
                                                                                            t={t}
                                                                                        />
                                                                                    </Grid>
                                                                                ))}
                                                                            </Grid>}
                                                                        </Box>

                                                                    ))}
                                                                </Box>
                                                            )}
                                                        {col.type === "req-medical-imaging" &&
                                                            app?.appointment.requestedImaging &&
                                                            app?.appointment.requestedImaging.length === 0 && (
                                                                <Box
                                                                    key={`req-sheet-item-${indx}`}
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.grey["A100"],
                                                                        mb: 1,
                                                                        padding: 2,
                                                                        borderRadius: 0.7,
                                                                    }}>
                                                                    <Typography
                                                                        fontSize={12}
                                                                        margin={0}
                                                                        textAlign={"center"}
                                                                        color={"#66696c"}>
                                                                        {t('consultationIP.noImage')}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        {col.type === "req-sheet" &&
                                                            app.appointment.requestedAnalyses.length == 0 && (
                                                                <Box
                                                                    key={`req-sheet-item-${indx}`}
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.grey["A100"],
                                                                        mb: 1,
                                                                        padding: 2,
                                                                        borderRadius: 0.7,
                                                                    }}>
                                                                    <Typography
                                                                        fontSize={12}
                                                                        margin={0}
                                                                        textAlign={"center"}
                                                                        color={"#66696c"}>
                                                                        {t('consultationIP.noRequest')}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                        {col.type === "document" && app.documents.length > 0 && (
                                                            <Box style={{padding: 20, paddingTop: 25}}>
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.grey["A100"],
                                                                        mb: 1,
                                                                        padding: 2,
                                                                        borderRadius: 0.7,
                                                                    }}>
                                                                    {app.documents.map((card: any) => (
                                                                        <Grid
                                                                            item
                                                                            xs={3}
                                                                            key={`doc-item-${card.uuid}`}>
                                                                            <DocumentCard
                                                                                data={card}
                                                                                style={{width: 30}}
                                                                                onClick={() => {
                                                                                    if (card.documentType === "photo") {
                                                                                        setIsViewerOpen(card.uri);
                                                                                    } else if (
                                                                                        card.documentType ===
                                                                                        "medical-certificate"
                                                                                    ) {
                                                                                        setInfo("document_detail");
                                                                                        setState({
                                                                                            content:
                                                                                            card.certificate[0].content,
                                                                                            doctor: card.name,
                                                                                            patient: card.patient,
                                                                                            days: card.days,
                                                                                            name: "certif",
                                                                                            type: "write_certif",
                                                                                        });
                                                                                        setOpenDialog(true);
                                                                                    } else {
                                                                                        setInfo("document_detail");
                                                                                        let info = card;
                                                                                        switch (card.documentType) {
                                                                                            case "prescription":
                                                                                                info =
                                                                                                    card.prescription[0]
                                                                                                        .prescription_has_drugs;
                                                                                                break;
                                                                                            case "requested-analysis":
                                                                                                info =
                                                                                                    card.requested_Analyses[0]
                                                                                                        .analyses;
                                                                                                break;
                                                                                        }
                                                                                        setState({
                                                                                            uuid: card.uuid,
                                                                                            uri: card.uri,
                                                                                            name: card.title,
                                                                                            type: card.documentType,
                                                                                            info: info,
                                                                                            patient:
                                                                                                patient.firstName +
                                                                                                " " +
                                                                                                patient.lastName,
                                                                                            mutate: mutateDoc,
                                                                                        });
                                                                                        setOpenDialog(true);
                                                                                    }
                                                                                }}
                                                                                t={t}
                                                                            />
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        )}

                                                        {col.type === "document" &&
                                                            (app.documents === null ||
                                                                app.documents.length === 0) && (
                                                                <Box
                                                                    key={`req-sheet-item-${indx}`}
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.grey["A100"],
                                                                        mb: 1,
                                                                        padding: 2,
                                                                        borderRadius: 0.7,
                                                                    }}>
                                                                    <Typography
                                                                        fontSize={12}
                                                                        margin={0}
                                                                        textAlign={"center"}
                                                                        color={"#66696c"}>
                                                                        {t('consultationIP.noDoc')}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                        {col.type === "act-fees" && (
                                                            <Box
                                                                key={`req-sheet-item-${indx}`}
                                                                sx={{
                                                                    bgcolor: (theme) => theme.palette.grey["A100"],
                                                                    mb: 1,
                                                                    padding: 2,
                                                                    borderRadius: 0.7,
                                                                }}>
                                                                {app?.appointment.acts.length > 0 &&
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={3}>
                                                                            <Typography fontWeight={"bold"}
                                                                                        fontSize={13}>
                                                                                Name
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <Typography textAlign={"center"}
                                                                                        fontWeight={"bold"}
                                                                                        fontSize={13}>
                                                                                Qte
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <Typography textAlign={"center"}
                                                                                        fontWeight={"bold"}
                                                                                        fontSize={13}>
                                                                                Price
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <Typography textAlign={"right"}
                                                                                        fontWeight={"bold"}
                                                                                        fontSize={13}>
                                                                                Total
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>}
                                                                {app?.appointment.acts.map(
                                                                    (act: any, idx: number) => (
                                                                        <Grid container key={`req-sheet-p-${idx}`}
                                                                              spacing={2}>
                                                                            <Grid item xs={3}>
                                                                                <Typography
                                                                                    fontSize={13}>
                                                                                    {act.name}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={3}>
                                                                                <Typography textAlign={"center"}

                                                                                            fontSize={13}>
                                                                                    {act.qte}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={3}>
                                                                                <Typography textAlign={"center"}

                                                                                            fontSize={13}>
                                                                                    {act.price} TND
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={3}>
                                                                                <Typography textAlign={"right"}

                                                                                            fontSize={13}>
                                                                                    {act.price * act.qte} TND
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )
                                                                )}
                                                                {app?.appointment.acts.length > 0 && (
                                                                    <Stack mt={2} direction={"row"}
                                                                           alignItems={"center"}
                                                                           justifyContent={"flex-end"}>
                                                                        <Typography textAlign={"right"}
                                                                                    mr={2}
                                                                                    fontWeight={"bold"}
                                                                                    fontSize={18}>
                                                                            Total : -- TND |
                                                                        </Typography>
                                                                        <Button
                                                                            variant="contained"
                                                                            color={"info"}
                                                                            onClick={() => {
                                                                                const selectedActs: {
                                                                                    act: any;
                                                                                    fees: any;
                                                                                }[] = [];
                                                                                app?.appointment.acts.map(
                                                                                    (act: {
                                                                                        act_uuid: string;
                                                                                        price: any;
                                                                                    }) => {
                                                                                        let ac = acts.find(
                                                                                            (a: { uuid: string }) =>
                                                                                                a.uuid === act.act_uuid
                                                                                        );
                                                                                        ac.fees = act.price;
                                                                                        selectedActs.push(ac);
                                                                                    }
                                                                                );
                                                                                setInfo("document_detail");
                                                                                setState({
                                                                                    type: "fees",
                                                                                    name: "note_fees",
                                                                                    info: selectedActs,
                                                                                    patient:
                                                                                        patient.firstName +
                                                                                        " " +
                                                                                        patient.lastName,
                                                                                });
                                                                                setOpenDialog(true);
                                                                            }}
                                                                            startIcon={<IconUrl path="ic-imprime"/>}>
                                                                            {t("consultationIP.print")}
                                                                        </Button>
                                                                    </Stack>
                                                                )}

                                                                {app?.appointment.acts.length === 0 && (
                                                                    <Typography
                                                                        fontSize={12}
                                                                        margin={0}
                                                                        textAlign={"center"}>
                                                                        {t('consultationIP.noFees')}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Collapse>
                                                </ListItem>
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
