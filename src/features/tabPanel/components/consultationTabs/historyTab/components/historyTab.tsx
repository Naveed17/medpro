import React, {useState} from "react";
import {Label} from "@features/label";
import {Box, Button, Collapse, Drawer, Stack, Typography, useTheme} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {AppointmentDetail, Dialog, dialogSelector, openDrawer as DialogOpenDrawer,} from "@features/dialog";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import HistoryStyled
    from "@features/tabPanel/components/consultationTabs/historyTab/components/overrides/historyStyled";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {HistoryCard, PatientHistoryStaticCard} from "@features/card";
import {AppointmentHistoryPreview} from "@features/card/components/appointmentHistoryPreview";
import {consultationSelector, SetSelectedApp} from "@features/toolbar";
import {AppointmentHistoryContent} from "@features/card/components/appointmentHistoryContent";
import Icon from "@themes/icon";
import moment from "moment/moment";
import {WidgetCharts} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import {agendaSelector} from "@features/calendar";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {useTranslation} from "next-i18next";
import {Pediatrician18Charts} from "@features/tabPanel/components/consultationTabs/pediatrician18Chart";
import {PediatricianCharts} from "@features/tabPanel/components/consultationTabs/pediatricianChart";

function HistoryTab({...props}) {

    const {
        patient,
        dispatch,
        t,
        session,
        direction,
        setOpenDialog,
        showDoc,
        setState,
        setInfo,
        router,
        mini,
        modelData,
        appuuid,
        date
    } = props;

    let dates: string[] = [];
    let keys: string[] = [];
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t: commonTranslation} = useTranslation("common");
    const {drawer} = useAppSelector(dialogSelector);
    const {selectedApp} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const {data: httpPatientHistory, mutate: mutatePatientHistory} = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/appointments/history-list/${router.locale}`
    } : null);

    const {trigger: deleteAppointmentData} = useRequestQueryMutation("/agenda/delete/appointment/data");

    const histories = (httpPatientHistory as HttpResponse)?.data
    const sheet = histories ? histories['consultation-sheet'] : null
    const latest_appointment = histories ? histories['latest_appointment'] : []
    const nextAppointment = histories ? histories['nextAppointment'] : []
    const photos = histories ? histories['photo'] : []

    const [selectedKey, setSelectedKey] = useState('')
    const [deleteDialogUuid, setDeleteDialogUuid] = useState<any>(null);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const handleDeleteAppointment = () => {
        setLoadingReq(true);
        const params = new FormData();
        params.append("type", "delete-appointment-data");

        deleteAppointmentData({
            method: "DELETE",
            data: params,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${deleteDialogUuid}/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                mutatePatientHistory();
                setDeleteDialogUuid(null);
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    sheet && Object.keys(sheet).forEach(key => {
        keys.push(key);
        Object.keys(sheet[key].data).forEach(date => {
            if (dates.indexOf(date) === -1) dates.push(date);
        })
    })

    return (
        <>
            {/****** Next appointment ******/}
            {nextAppointment && nextAppointment.length > 0 && (
                <Stack spacing={2} mb={2} alignItems="flex-start">
                    <Label variant="filled" color="warning">
                        {t("next_meeting")}
                    </Label>
                    {nextAppointment.map((data: any, index: number) => (
                        <React.Fragment key={`patient-${index}`}>
                            <HistoryCard row={{
                                status: 0,
                                dayDate: data.date,
                                startTime: data.time,
                                uuid: data.uuid,
                                consultationReasons: data.consultationReason
                            }} patient={patient} t={t}/>
                        </React.Fragment>
                    ))}
                </Stack>
            )}
            {/****** Next appointment ******/}

            {
                photos.length > 0 &&
                <Box>
                    <Label variant="filled" color="warning">
                        {t("consultationIP.suivi_image")}
                    </Label>
                    <Box style={{overflowX: "auto", marginBottom: 10}}>
                        <Stack direction={"row"} spacing={1} mt={2} mb={2} alignItems={"center"}>
                            {photos.map((photo: any, index: number) => (
                                <Box key={`photo${index}`} width={150} height={140} borderRadius={2}
                                     style={{background: "white"}}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.uri.thumbnails.length === 0 ? photo.uri.url : photo.uri.thumbnails['thumbnail_128']}
                                        alt={'img'}
                                        onClick={() => {
                                            showDoc(photo)
                                        }}
                                        style={{borderRadius: "10px 10px 0 0", width: 150, height: 110}}
                                    />


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
                </Box>
            }


            {/****** Sheet History ******/}
            {sheet && keys.length > 0 && <Stack spacing={2} mb={2} alignItems="flex-start">
                <Label variant="filled" color="warning">
                    {t("consultationIP.suivi_chiffre")}
                </Label>
            </Stack>}
            <div style={{overflowY: "hidden", marginBottom: 10}}>
                {keys.length > 0 &&
                    <HistoryStyled>
                        <thead>
                        <tr>
                            <td className={'col'}></td>
                            {dates.map((date: string) => (<td key={date} className={'col'}><Typography
                                className={"header"}>{date}</Typography></td>))}
                        </tr>
                        </thead>
                        {keys.map((key: string) => (
                            <tbody key={key}>
                            <tr>
                                <td style={{minWidth: 120}}><Typography
                                    className={"keys col"}
                                    style={{
                                        width: "100%",
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        gap: 5,
                                        paddingBottom: 8
                                    }}>
                                    <div onClick={() => setSelectedKey(selectedKey === key ? "" : key)}>
                                        <IconUrl path={"status-up"}/>
                                    </div>
                                    {sheet[key]['label']}
                                </Typography>
                                </td>
                                {dates.map((date: string) => (<td key={date}><Typography
                                    className={"data col"}>{sheet[key]['data'][date] ? sheet[key]['data'][date] + sheet[key]['description'] : '-'}</Typography>
                                </td>))}
                            </tr>
                            <tr>
                                <Collapse in={selectedKey === key}>
                                    {selectedKey === key && <WidgetCharts {...{sheet, selectedKey}}/>}
                                </Collapse>
                            </tr>

                            </tbody>
                        ))}
                    </HistoryStyled>}
            </div>

            {/****** Pediatrican charts ******/}

            {
                patient?.birthdate && moment().diff(moment(patient?.birthdate, 'DD-MM-YYYY'), "years") < 4 &&
                <PediatricianCharts {...{sheet, birthdate: patient?.birthdate, modelData, date, t}}/>
            }

            {
                patient?.birthdate && moment().diff(moment(patient?.birthdate, 'DD-MM-YYYY'), "years") > 5 && moment().diff(moment(patient?.birthdate, 'DD-MM-YYYY'), "years") <= 18 && sheet && (Object.keys(sheet).includes("poids") || Object.keys(sheet).includes("taille")) &&
                <Pediatrician18Charts {...{
                    sheet,
                    birthdate: patient?.birthdate,
                    gender: patient?.gender,
                    modelData,
                    date,
                    t
                }}/>
            }

            {/****** Latest appointment ******/}
            {latest_appointment && latest_appointment.length > 0 &&
                <Stack id={'records'} spacing={2} mb={2} alignItems="flex-start">
                    <Label variant="filled" color="warning">
                        {t("history")}
                    </Label>
                </Stack>}
            <Stack spacing={1.2}>
                {latest_appointment && latest_appointment.map((app: any, appID: number) => (
                    <React.Fragment key={`app-el-${appID}`}>
                        <PatientHistoryStaticCard
                            handleOpen={() => {
                                app.uuid === selectedApp
                                    ? dispatch(SetSelectedApp(""))
                                    : dispatch(SetSelectedApp(app.uuid));
                            }}
                            open={app.uuid === selectedApp}
                            key={`${app.uuid}timeline`}>
                            <AppointmentHistoryPreview
                                {...{app, appuuid, dispatch, t, mini}}
                                handleDeleteApp={() => setDeleteDialogUuid(appuuid)}>
                                {selectedApp === app.uuid && <Collapse
                                    in={app.uuid === selectedApp}>
                                    <AppointmentHistoryContent {...{
                                        mutate: mutatePatientHistory,
                                        showDoc,
                                        appID,
                                        appuuid,
                                        setInfo,
                                        setState,
                                        setOpenDialog,
                                        session,
                                        patient,
                                        mini,
                                        historyUUID: app.uuid,
                                        t
                                    }}/>
                                </Collapse>}
                            </AppointmentHistoryPreview>
                        </PatientHistoryStaticCard>

                    </React.Fragment>
                ))}
            </Stack>
            {/****** Latest appointment ******/}

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteDialogUuid(null)}
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
                open={!!deleteDialogUuid}
                title={commonTranslation(`dialogs.delete-dialog.title-data`)}
                actionDialog={
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant="text-black"
                            onClick={() => setDeleteDialogUuid(null)}
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

            <Drawer
                anchor={"right"}
                open={drawer}
                dir={direction}
                onClose={() => {
                    dispatch(DialogOpenDrawer(false));
                }}>
                <AppointmentDetail from="HistoryTab"/>
            </Drawer>
        </>
    );
}

export default HistoryTab;
