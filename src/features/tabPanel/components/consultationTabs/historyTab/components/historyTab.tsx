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
import {useRequest, useRequestMutation} from "@app/axios";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import ListItemStyled from "./overrides/listItemStyled"
import ListItemDetailsStyled from "./overrides/listItemDetailsStyled"
import BoxFees from "./overrides/boxFeesStyled"
import Image from "next/image";
import Zoom from 'react-medium-image-zoom'
import moment from "moment/moment";
import {DefaultCountry} from "@app/constants";

function HistoryTab({...props}) {

    const {
        patient,
        appointement,
        t,
        direction,
        setInfo,
        setState,
        appuuid,
        dispatch,
        setOpenDialog,
        medical_entity,
        showDoc,
        session,
        mutate,
        locale,
        router
    } = props;

    const {trigger} = useRequestMutation(null, "/editRA");

    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

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
    const [photos, setPhotos] = useState<any[]>([]);
    const [selected, setSelected] = useState<string>('')

    const {data: httpPatientDocumentsResponse} = useRequest(patient ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient.uuid}/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);

    useEffect(() => {
        setApps(appointement ? [...appointement.latestAppointments] : []);
        if (appointement?.latestAppointments.length > 0) {
            dispatch(SetSelectedApp(appointement.latestAppointments[0].appointment.uuid))
        }
    }, [appointement, appuuid, dispatch]);

    useEffect(() => {
        if (httpPatientDocumentsResponse) {
            setPhotos((httpPatientDocumentsResponse as HttpResponse).data.documents
                .filter((doc: { documentType: string; }) => doc.documentType === "photo"))
        }
    }, [httpPatientDocumentsResponse]);

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
            patient: `${patient.gender === "F" ? "Mme " : patient.gender ==="U" ?"": "Mr "} ${patient.firstName} ${patient.lastName}`,
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

            {
                photos.length > 0 &&
                <>
                    <Label variant="filled" color="warning">
                        {t("consultationIP.suivi_image")}
                    </Label>
                    <Box style={{overflowX: "auto", marginBottom: 10}}>
                        <Stack direction={"row"} spacing={1} mt={2} mb={2} alignItems={"center"}>
                            {photos.map((photo, index) => (
                                <Box key={`photo${index}`} width={150} height={140} borderRadius={2}
                                     style={{background: "white"}}>
                                    <Zoom>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photo.uri}
                                             alt={'img'}
                                             style={{borderRadius: "10px 10px 0 0", width: 150, height: 110}}
                                        />
                                    </Zoom>

                                    <Stack spacing={0.5} width={"fit-content"} margin={"auto"} direction="row"
                                           alignItems='center'>
                                        <Icon path="ic-agenda-jour"/>
                                        <Typography fontWeight={600} fontSize={13}>
                                            {moment(photo.createdAt, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY')}
                                        </Typography>
                                    </Stack>

                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </>

            }
            <Stack spacing={2}>
                {apps.map((app: any, appID: number) => (
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

                                                <Collapse in={app.appointment.uuid === selectedApp} sx={{width: 1}}>
                                                    <ListItemDetailsStyled sx={{p: 0}}>
                                                        {col.type === "treatment" && <>
                                                            {
                                                                app.appointment.treatments.length > 0 ? <>
                                                                    {app.appointment.treatments.filter((t: { isOtherProfessional: any; }) => t.isOtherProfessional).map((treatment: any, idx: number) => (
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
                                                                        app.appointment.treatments.filter((t: { isOtherProfessional: any; }) => !t.isOtherProfessional).length > 0 &&
                                                                        <Typography fontSize={12}
                                                                                    fontWeight={"bold"}>{t('prescription')}</Typography>
                                                                    }
                                                                    {app.appointment.treatments.filter((t: { isOtherProfessional: any; }) => !t.isOtherProfessional).map((treatment: any, idx: number) => (
                                                                            <Box
                                                                                key={`list-treatement-${idx}`}
                                                                                className={'boxHisto'}>
                                                                                <Typography fontSize={12}>{treatment.name}</Typography>
                                                                                <Stack direction={"row"}>
                                                                                    {
                                                                                        treatment.dosage && <Typography className={"treamtementDetail"}>• {treatment.dosage}</Typography>}
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
                                                                                               src={data.uri}
                                                                                               style={{borderRadius: 5}}
                                                                                               alt={'photo history'}/>}
                                                                                    <Typography variant='subtitle2'
                                                                                                textAlign={"center"}
                                                                                                whiteSpace={"nowrap"}
                                                                                                display={"block"}
                                                                                                maxWidth={"60%"}
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
