import React, {useEffect, useState} from "react";
import {Box, Button, Grid, List, ListItemIcon, Stack, TextField, Typography, useTheme} from "@mui/material";
import {useRouter} from "next/router";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {getBirthdayFormat, useMedicalEntitySuffix} from "@lib/hooks";
import {Session} from "next-auth";
import {MotifCard} from "@features/card";
import {DefaultCountry, iconDocument, SubMotifCard} from "@lib/constants";
import {BoxFees, ListItemDetailsStyled, ListItemStyled} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import Image from "next/image";
import moment from "moment";

function AppointmentHistoryContent({...props}) {
    const {
        showDoc,
        mutate,
        appID,
        historyUUID,
        setInfo,
        setState,
        setOpenDialog,
        session,
        patient,
        mini,
        t
    } = props;
    const router = useRouter();
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: user} = session as Session;
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const [collapse, setCollapse] = useState<any>("");
    const [app, setApp] = useState<any>();
    const [selected, setSelected] = useState<string>('')

    const {trigger: triggerRaEdit} = useRequestQueryMutation("/RA/edit");
    const {data: httpPatientHistory} = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/appointments/${historyUUID}/data/${router.locale}`
    } : null);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

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
            age: patient?.birthdate ? getBirthdayFormat({birthdate: patient.birthdate}, t) : "",
            patient: `${type} ${patient.firstName} ${patient.lastName}`,
        });
        setOpenDialog(true);
    }

    const reqSheetChange = (rs: any, ev: any, appID: number, sheetID: number, sheetAnalysisID: number) => {

        const data = {...rs}
        data.result = ev.target.value
        let capp = {...app}
        capp.appointment = {...capp.appointment}
        capp.appointment.requestedAnalyses = [...capp.appointment.requestedAnalyses]
        capp.appointment.requestedAnalyses[sheetID] = {...capp.appointment.requestedAnalyses[sheetID]}
        capp.appointment.requestedAnalyses[sheetID].hasAnalysis = [...capp.appointment.requestedAnalyses[sheetID].hasAnalysis]
        capp.appointment.requestedAnalyses[sheetID].hasAnalysis[sheetAnalysisID] = data

        setApp(capp)
    }

    const editReqSheet = (iid: number, idx: number) => {
        const selectedRA = app.appointment.requestedAnalyses[idx];
        const form = new FormData();
        form.append("analysesResult", JSON.stringify(selectedRA.hasAnalysis));
        triggerRaEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/appointments/${app.appointment.uuid}/requested-analysis/${selectedRA.uuid}/${router.locale}`,
            data: form,
        }, {
            onSuccess: () => {
                if (medicalEntityHasUser) {
                    mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/antecedents/${router.locale}`)
                    mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/analysis/${router.locale}`)
                }
            }
        });
    }

    useEffect(() => {
        if (httpPatientHistory)
            setApp((httpPatientHistory as HttpResponse)?.data)
    }, [httpPatientHistory])

    return (
        <Stack spacing={2} padding={2}>
            <MotifCard data={app} mini={mini} t={t}/>
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
                            </ListItemStyled>

                            <ListItemDetailsStyled sx={{p: 0}}>
                                {col.type === "treatment" && app?.appointment.treatments.length > 0 && <>
                                    {
                                        <>
                                            {
                                                app.appointment.treatments.filter((t: {
                                                    isOtherProfessional: any;
                                                }) => t.isOtherProfessional).length > 0 &&
                                                <Typography fontSize={12}
                                                            fontWeight={"bold"}>{t('consultationIP.treatement_in_progress')}</Typography>
                                            }
                                            {app.appointment.treatments.filter((t: {
                                                isOtherProfessional: boolean;
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
                                        </>
                                    } </>}

                                {col.type === "document" && app?.documents.length > 0 && <>
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
                                    </Box>
                                </>}

                                {col.type === "req-sheet" && app?.appointment.requestedAnalyses.length > 0 && <>
                                    {app?.appointment.requestedAnalyses.map(
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
                                                                {rs?.name}
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
                                                            editReqSheet(appID, reqSheetID)
                                                        }}
                                                        startIcon={<IconUrl
                                                            path="ic-edit-file-pen"/>}>
                                                        {t("consultationIP.save")}
                                                    </Button>
                                                </Box>
                                            </Box>))}
                                </>}

                                {col.type === "req-medical-imaging" && app?.appointment.requestedImaging && Object.keys(app?.appointment.requestedImaging)
                                    .length > 0 && <>
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

                                            <Stack style={{marginLeft: -24, marginRight: -24}} mt={2} pt={1}
                                                   direction={"row"}
                                                   alignItems={"center"}
                                                   justifyContent={"flex-end"}>
                                                <Typography textAlign={"right"} mr={2}
                                                            fontWeight={"bold"}
                                                            fontSize={18}>
                                                    Total : {app?.appointment.fees} {devise} |
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
                        </>
                    </React.Fragment>
                ))}
            </List>
        </Stack>
    )
}

export default AppointmentHistoryContent;
