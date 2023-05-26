import React, {useEffect, useRef, useState,} from "react";
import RootStyled from "./overrides/rootStyled";
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Link,
    List,
    ListItem,
    Stack,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import {AppointmentCard} from "@features/card";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";

import {Dialog, QrCodeDialog, setMoveDateTime} from "@features/dialog";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import {getBirthdayFormat} from "@lib/hooks";
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import {useProfilePhoto} from "@lib/hooks/rest";

function AppointmentDetail({...props}) {
    const {
        OnConsultation,
        OnConsultationView,
        OnEditDetail,
        OnConfirmAppointment,
        OnDataUpdated = null,
        patientId = null,
        OnPatientNoShow,
        OnWaiting,
        OnLeaveWaiting,
        SetMoveDialog,
        SetCancelDialog,
        SetDeleteDialog,
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const rootRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>;

    const {t, ready} = useTranslation("common");
    const {selectedEvent: appointment} = useAppSelector(agendaSelector);

    const {patientPhoto, mutatePatientPhoto} = useProfilePhoto({
        patientId: appointment?.extendedProps?.patient?.uuid,
        hasPhoto: appointment?.extendedProps?.patient?.hasPhoto
    });

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [canManageActions] = useState<boolean>(![
        "/dashboard/patient",
        "/dashboard/waiting-room",
        "/dashboard/consultation/[uuid-consultation]"].includes(router.pathname));
    const [loading, setLoading] = useState(false);

    const setAppointmentDate = (action: string) => {
        const newDate = moment(appointment?.extendedProps.time);
        dispatch(
            setMoveDateTime({
                date: newDate,
                time: newDate.format("HH:mm"),
                action,
                selected: false
            })
        );
        SetMoveDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (appointment && appointment.extendedProps.photo) {
            mutatePatientPhoto();
        }
    }, [appointment]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen error button={"loading-error-404-reset"} text={"loading-error"}/>);

    return (
        <RootStyled>
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <Typography variant="h6">{t("appointment_details")}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                            disableRipple
                            size="medium"
                            edge="end"
                            onClick={() =>
                                dispatch(openDrawer({type: "view", open: false}))
                            }>
                            <Icon path="ic-x"/>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                ref={rootRef}
                sx={{
                    height: "calc(100% - 64px)",
                    overflowY: "scroll",
                }}>
                <Box px={1} py={2}>
                    {appointment?.extendedProps.hasErrors?.map(
                        (error: string, index: number) => (
                            <Stack
                                key={`error${index}`}
                                spacing={2}
                                sx={{mb: 1}}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">
                                <Alert
                                    sx={{
                                        backgroundColor: (theme) => theme.palette.error.lighter
                                    }}
                                    variant={"outlined"}
                                    severity="error"
                                    icon={<ReportProblemRoundedIcon/>}>{t(error)}</Alert>
                            </Stack>
                        )
                    )}
                    <Card>
                        <CardContent>
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start">
                                <Stack spacing={2} direction="row" alignItems="flex-start">
                                    <Box position="relative">
                                        <Avatar
                                            src={
                                                patientPhoto
                                                    ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                                                    : appointment?.extendedProps?.patient?.gender === 1
                                                        ? "/static/icons/men-avatar.svg"
                                                        : "/static/icons/women-avatar.svg"
                                            }
                                            sx={{
                                                "& .injected-svg": {
                                                    margin: 0,
                                                },
                                                width: 51,
                                                height: 51,
                                                borderRadius: 1,
                                            }}
                                        />
                                        {/*                                       <IconButton
                                            color="primary"
                                            size="small"
                                            className="add-photo"
                                            component="label">
                                            <input
                                                hidden
                                                accept="image/*"
                                                type="file"
                                                onChange={handleFileUpload}
                                            />
                                            <IconUrl path="ic-camera"/>
                                        </IconButton>*/}
                                    </Box>
                                    <Stack>
                                        <Typography
                                            className={"user-name"}
                                            variant="subtitle1"
                                            color="primary"
                                            fontWeight={700}>
                                            {appointment?.title}
                                        </Typography>
                                        <List sx={{py: 1, pt: 0}}>
                                            {appointment?.extendedProps.patient?.birthdate && (
                                                <ListItem className={"appointment-text"}>
                                                    <Stack direction={"row"} alignItems={"center"}
                                                           justifyContent={"center"}>
                                                        <IconUrl width={"13"} height={"13"} path="ic-anniverssaire"/>
                                                        <Typography
                                                            sx={{ml: 1, fontSize: 12}}
                                                            variant="caption"
                                                            fontWeight={400}>
                                                            {appointment?.extendedProps.patient?.birthdate}
                                                            ({" "}{getBirthdayFormat(appointment?.extendedProps.patient, t, "times")}{" "})
                                                        </Typography>
                                                    </Stack>
                                                </ListItem>
                                            )}
                                            {appointment?.extendedProps.patient.email && (
                                                <ListItem
                                                    className={"appointment-text"}
                                                    sx={{
                                                        marginLeft: "-1.5px"
                                                    }}>
                                                    <Stack direction={"row"} alignItems={"center"}
                                                           justifyContent={"center"}>
                                                        <IconUrl width={"16"} height={"16"} path="ic-message-contour"/>
                                                        <Link
                                                            underline="none"
                                                            href={`mailto:${appointment?.extendedProps.patient.email}`}
                                                            sx={{ml: 1, fontSize: 12}}
                                                            variant="caption"
                                                            color="primary"
                                                            fontWeight={400}>
                                                            {appointment?.extendedProps.patient.email}
                                                        </Link>
                                                    </Stack>
                                                </ListItem>
                                            )}
                                            {appointment?.extendedProps.patient.contact.length >
                                                0 && (
                                                    <ListItem className={"appointment-text"}>
                                                        <IconUrl
                                                            path="ic-tel-green-filled"
                                                            className="ic-tell"
                                                        />
                                                        <Link
                                                            underline="none"
                                                            href={`tel:${appointment?.extendedProps.patient.contact[0].code}${appointment?.extendedProps.patient.contact[0].value}`}
                                                            sx={{ml: 1, fontSize: 12}}
                                                            variant="caption"
                                                            color="text.primary"
                                                            fontWeight={400}>
                                                            <Stack direction={"row"} alignItems={"center"}>
                                                                {appointment?.extendedProps.patient.contact[0].value}
                                                            </Stack>
                                                        </Link>
                                                    </ListItem>
                                                )}
                                        </List>
                                    </Stack>
                                </Stack>
                                {(canManageActions && OnEditDetail) &&
                                    <IconButton size="small" onClick={() => OnEditDetail(appointment)}>
                                        <IconUrl path="ic-duotone"/>
                                    </IconButton>}
                            </Stack>

                            {(!roles.includes("ROLE_SECRETARY") && canManageActions && (OnConsultationView || OnConsultation)) && (
                                <LoadingButton
                                    {...{loading}}
                                    loadingPosition="start"
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    startIcon={<PlayCircleIcon/>}
                                    onClick={() => {
                                        setLoading(true);
                                        ["FINISHED", "ON_GOING"].includes(
                                            appointment?.extendedProps.status.key
                                        )
                                            ? OnConsultationView(appointment)
                                            : OnConsultation(appointment);
                                    }}>
                                    {t(
                                        ["FINISHED", "ON_GOING"].includes(
                                            appointment?.extendedProps.status.key
                                        )
                                            ? "view_the_consultation"
                                            : "event.start"
                                    )}
                                </LoadingButton>
                            )}
                        </CardContent>
                    </Card>
                    <Typography
                        sx={{
                            mb: 1,
                            mt: appointment?.extendedProps.hasErrors?.length > 1 ? 0 : 2,
                        }}
                        variant="body1"
                        fontWeight={600}>
                        {t("time_slot")}
                    </Typography>
                    <AppointmentCard
                        {...{t, roles, patientId}}
                        onDataUpdated={OnDataUpdated}
                        {...((canManageActions && SetMoveDialog) && {
                            onMoveAppointment: () => setAppointmentDate(appointment?.extendedProps.status.key === "FINISHED" ? "reschedule" : "move")
                        })}
                        data={{
                            uuid: appointment?.publicId
                                ? appointment?.publicId
                                : (appointment as any)?.id,
                            date: moment(appointment?.extendedProps.time).format(
                                "DD-MM-YYYY"
                            ),
                            time: moment(appointment?.extendedProps.time).format("HH:mm"),
                            motif: appointment?.extendedProps.motif,
                            status: appointment?.extendedProps.status,
                            type: appointment?.extendedProps.type,
                        }}
                    />
                </Box>
                {(canManageActions && (OnConfirmAppointment || OnWaiting || OnLeaveWaiting || OnPatientNoShow || SetCancelDialog)) && (
                    <CardActions sx={{pb: 4}}>
                        <Stack spacing={1} width={1}>
                            {appointment?.extendedProps.patient.contact.length > 0 && <LoadingButton
                                href={`tel:${appointment?.extendedProps.patient.contact[0].code}${appointment?.extendedProps.patient.contact[0].value}`}
                                variant="contained"
                                startIcon={<IconUrl path="ic-tel" className="ic-tel"/>}
                                color="success">
                                {t("call_patient")}
                            </LoadingButton>}
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display:
                                        appointment?.extendedProps.status.key !== "PENDING"
                                            ? "none"
                                            : "flex",
                                }}
                                onClick={() => {
                                    OnConfirmAppointment(appointment);
                                }}
                                color={"success"}
                                fullWidth
                                variant="contained"
                                startIcon={<CheckCircleOutlineRoundedIcon/>}>
                                {t("event.confirm")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => OnWaiting(appointment)}
                                sx={{
                                    display:
                                        moment().format("DD-MM-YYYY") !==
                                        moment(appointment?.extendedProps.time).format(
                                            "DD-MM-YYYY"
                                        ) ||
                                        ["PENDING", "WAITING_ROOM", "ON_GOING", "FINISHED"].includes(
                                            appointment?.extendedProps.status.key
                                        )
                                            ? "none"
                                            : "flex",
                                }}
                                fullWidth
                                variant="contained"
                                startIcon={<Icon path="ic-salle"/>}>
                                {t("waiting")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => OnLeaveWaiting(appointment)}
                                sx={{
                                    display:
                                        moment().format("DD-MM-YYYY") !==
                                        moment(appointment?.extendedProps.time).format(
                                            "DD-MM-YYYY"
                                        ) ||
                                        appointment?.extendedProps.status.key !== "WAITING_ROOM"
                                            ? "none"
                                            : "flex",
                                }}
                                fullWidth
                                variant="contained"
                                startIcon={<Icon path="ic-salle"/>}>
                                {t("leave_waiting_room")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display:
                                        moment().isBefore(appointment?.extendedProps.time) ||
                                        appointment?.extendedProps.status.key === "FINISHED" ||
                                        appointment?.extendedProps.status.key === "ON_GOING"
                                            ? "none"
                                            : "flex",
                                }}
                                onClick={() => OnPatientNoShow(appointment)}
                                fullWidth
                                variant="contained"
                                startIcon={
                                    <IconUrl width={"16"} height={"16"} path="ic-user1"/>
                                }>
                                {t("event.missPatient")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display:
                                        appointment?.extendedProps.status.key !== "FINISHED"
                                            ? "none"
                                            : "flex",
                                }}
                                onClick={() => setAppointmentDate("reschedule")}
                                fullWidth
                                variant="contained"
                                startIcon={
                                    <IconUrl width={"16"} height={"16"} path="ic-agenda"/>
                                }>
                                {t("event.reschedule")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display:
                                        moment().isAfter(appointment?.extendedProps.time) ||
                                        appointment?.extendedProps.status.key === "FINISHED"
                                            ? "none"
                                            : "flex",
                                }}
                                onClick={() => setAppointmentDate("move")}
                                fullWidth
                                variant="contained"
                                startIcon={<IconUrl path="iconfinder"/>}>
                                {t("event.move")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => SetCancelDialog(true)}
                                fullWidth
                                variant="contained-white"
                                color="error"
                                sx={{
                                    display:
                                        appointment?.extendedProps.status.key === "CANCELED" ||
                                        appointment?.extendedProps.status.key === "FINISHED" ||
                                        appointment?.extendedProps.status.key === "ON_GOING"
                                            ? "none"
                                            : "flex",
                                    "& svg": {
                                        width: 16,
                                        height: 16,
                                    },
                                }}
                                startIcon={
                                    <IconUrl
                                        path="icdelete"
                                        color={
                                            appointment?.extendedProps.status.key === "CANCELED"
                                                ? "white"
                                                : theme.palette.error.main
                                        }
                                    />
                                }>
                                {t("event.cancel")}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => SetDeleteDialog(true)}
                                sx={{
                                    display:
                                        appointment?.extendedProps.status.key === "CANCELED" ||
                                        appointment?.extendedProps.status.key === "FINISHED" ||
                                        appointment?.extendedProps.status.key === "ON_GOING"
                                            ? "none"
                                            : "flex",
                                }}
                                fullWidth
                                variant="contained-white"
                                color="error"
                                startIcon={<HighlightOffRoundedIcon color={"error"}/>}>
                                {t("event.delete")}
                            </LoadingButton>
                        </Stack>
                    </CardActions>
                )}
            </Box>

            <Dialog
                action={() => <QrCodeDialog data={appointment}/>}
                open={openDialog}
                onClose={handleCloseDialog}
                direction={"ltr"}
                title={t("qr_title")}
                dialogClose={handleCloseDialog}
            />
        </RootStyled>
    );
}

export default AppointmentDetail;
