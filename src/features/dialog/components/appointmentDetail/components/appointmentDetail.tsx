import React, {useCallback, useEffect, useRef, useState,} from "react";
import RootStyled from "./overrides/rootStyled";
import {
    AppBar,
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    Chip,
    IconButton,
    Link,
    List,
    ListItem,
    Skeleton,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery,
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
import {agendaSelector, openDrawer, setSelectedEvent} from "@features/calendar";
import {Dialog, openDrawer as DialogOpenDrawer, QrCodeDialog, setMoveDateTime} from "@features/dialog";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import {getBirthdayFormat, useMedicalEntitySuffix} from "@lib/hooks";
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import {useProfilePhoto} from "@lib/hooks/rest";
import {Label} from "@features/label";
import {DefaultCountry, MobileContainer} from "@lib/constants";
import {setMessage, setOpenChat} from "@features/chat/actions";
import {startCase} from "lodash";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useRequestQueryMutation} from "@lib/axios";

function AppointmentDetail({...props}) {
    const {
        isBeta,
        OnConsultation,
        OnConsultationView,
        OnEditDetail,
        OnConfirmAppointment,
        OnUploadDocuments,
        OnDataUpdated = null,
        patientId = null,
        from = null,
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
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const {direction} = useAppSelector(configSelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {t, ready} = useTranslation(["common", "agenda"]);
    const {selectedEvent: appointment} = useAppSelector(agendaSelector);
    const {patientPhoto, mutatePatientPhoto} = useProfilePhoto({
        patientId: appointment?.extendedProps?.patient?.uuid,
        hasPhoto: appointment?.extendedProps?.patient?.hasPhoto
    });

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {trigger} = useRequestQueryMutation("/payment/cashbox");

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [canManageActions] = useState<boolean>(![
        "/dashboard/patient",
        "/dashboard/waiting-room",
        "/dashboard/consultation/[uuid-consultation]"].includes(router.pathname));
    const [loading, setLoading] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

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

    const handleOnDataUpdated = useCallback(() => {
        OnDataUpdated();
    }, [OnDataUpdated])

    useEffect(() => {
        if (appointment && appointment.extendedProps.photo) {
            mutatePatientPhoto();
        }
    }, [appointment]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

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
                            onClick={() => {
                                if (from === "HistoryTab") {
                                    dispatch(DialogOpenDrawer(false));
                                } else {
                                    dispatch(openDrawer({type: "view", open: false}));
                                }
                            }}>
                            <Icon path="ic-x"/>
                        </IconButton>
                    </Stack>
                </Toolbar>
                {appointment?.extendedProps.hasErrors?.length > 0 && <Toolbar sx={{marginTop: "-0.6rem"}}>
                    {appointment?.extendedProps.hasErrors?.map(
                        (error: string, index: number) => (
                            <Stack
                                key={`error${index}`}
                                spacing={2}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">
                                <Chip
                                    color="error"
                                    label={t(error)}
                                    icon={<ReportProblemRoundedIcon sx={{width: 20, height: 20}}/>}/>
                            </Stack>
                        )
                    )}
                </Toolbar>}
            </AppBar>

            <Box
                ref={rootRef}
                sx={{
                    height: "calc(100% - 64px)",
                    overflowY: "scroll",
                }}>
                <Box px={1} py={2}>

                    <Card>
                        <CardContent>
                            <Stack
                                spacing={2}
                                direction="row"
                                sx={{width: "100%"}}
                                justifyContent="space-between"
                                alignItems="flex-start">
                                <Stack sx={{width: "100%"}} spacing={2} direction="row"
                                       alignItems="flex-start" {...(!appointment?.extendedProps.patient.contact && {pb: .8})}>
                                    <Box position="relative">
                                        <Avatar
                                            src={
                                                patientPhoto
                                                    ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                                                    : appointment?.extendedProps?.patient?.gender === "M"
                                                        ? "/static/icons/men-avatar.svg"
                                                        : "/static/icons/women-avatar.svg"
                                            }
                                            sx={{
                                                "& .injected-svg": {margin: 0},
                                                width: 54,
                                                height: 54,
                                                borderRadius: 1,
                                            }}>
                                            <IconUrl path="ic-image"/>
                                        </Avatar>
                                    </Box>
                                    <Stack sx={{width: "100%"}}>
                                        <Typography
                                            onClick={() => OnEditDetail(appointment)}
                                            className={"user-name"}
                                            variant="subtitle1"
                                            color="primary"
                                            fontWeight={600}>
                                            {startCase(appointment?.title)}
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
                                                        <IconUrl width={20} height={20} path="ic-message-contour"/>
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

                                            <ListItem className={"appointment-text"}>
                                                {appointment?.extendedProps.patient.contact?.map((contact: ContactModel, index: number) =>
                                                    <Stack key={index} direction={"row"} mr={2} alignItems={"center"}>
                                                        <IconUrl
                                                            path={contact?.isWhatsapp ? "ic-whatsapp" : "ic-tel-green-filled"}
                                                            className="ic-tell"
                                                        />
                                                        <Link
                                                            underline="none"
                                                            href={`${contact?.isWhatsapp ? "https://wa.me/" : "tel:"}${contact.code}${contact.value}`}
                                                            sx={{ml: 1, fontSize: 12}}
                                                            variant="caption"
                                                            color="text.primary"
                                                            fontWeight={400}>
                                                            <Stack direction={"row"} alignItems={"center"}>
                                                                {contact.code} {contact.value}
                                                            </Stack>
                                                        </Link>
                                                    </Stack>
                                                )}
                                                {loading &&
                                                    <Skeleton sx={{ml: 1}} width={100} height={14} variant="rounded"/>}
                                            </ListItem>
                                        </List>
                                    </Stack>
                                </Stack>
                                <Stack spacing={1} pb={1}>
                                    {(canManageActions && OnEditDetail && !appointment?.extendedProps.patient?.isArchived) &&
                                        <Stack direction={"row"} alignItems={"center"} spacing={1.2}
                                               justifyContent={"flex-end"}>
                                            <IconButton className={"edit-button"} size="small"
                                                        onClick={() => {
                                                            dispatch(setOpenChat(true))
                                                            dispatch(setMessage(`&lt; <span class="tag" id="${appointment?.extendedProps.patient?.uuid}">${appointment?.extendedProps.patient?.firstName} ${appointment?.extendedProps.patient?.lastName} </span><span class="afterTag">> </span>`))
                                                        }}>
                                                <IconUrl path={"chat"} color={theme.palette.text.secondary} width={20}
                                                         height={20}/>
                                            </IconButton>
                                            <IconButton className={"btn-edit"} size="small"
                                                        onClick={() => OnEditDetail(appointment)}>
                                                <IconUrl width={16} height={16} color={theme.palette.text.secondary}
                                                         path="ic-edit-patient"/>
                                            </IconButton>
                                        </Stack>}
                                    {(isBeta && (appointment?.extendedProps?.restAmount > 0 || appointment?.extendedProps?.restAmount < 0)) &&
                                        <Label
                                            variant='filled'
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    width: 20,
                                                    height: 20,
                                                    pl: 0
                                                },
                                                color: theme.palette.error.main,
                                                background: theme.palette.error.lighter
                                            }}>
                                            <Typography onClick={() => setOpenPaymentDialog(true)}
                                                        sx={{
                                                            fontSize: 10,
                                                        }}>
                                                {t(appointment?.extendedProps.restAmount > 0 ? "credit" : "wallet", {ns: "common"})} {`${Math.abs(appointment?.extendedProps.restAmount)}`} {devise}</Typography>
                                        </Label>}
                                </Stack>
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
                                        ["FINISHED", "ON_GOING"].includes(appointment?.extendedProps.status.key)
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
                        {...{t, roles, patientId, handleOnDataUpdated}}
                        {...((canManageActions && SetMoveDialog) && {
                            onMoveAppointment: () => setAppointmentDate(appointment?.extendedProps.status.key === "FINISHED" ? "reschedule" : "move")
                        })}
                    />
                </Box>
                {(canManageActions && (OnConfirmAppointment || OnUploadDocuments || OnWaiting || OnLeaveWaiting || OnPatientNoShow || SetCancelDialog)) && (
                    <CardActions sx={{pb: 4}}>
                        <Stack spacing={1} width={1}>
                            {isMobile && appointment?.extendedProps.patient.contact?.length > 0 && <LoadingButton
                                href={`tel:${appointment?.extendedProps.patient.contact[0].code}${appointment?.extendedProps.patient.contact[0].value}`}
                                variant="contained"
                                startIcon={<IconUrl path="ic-tel" className="ic-tel"/>}
                                color="success">
                                {t("call_patient")}
                            </LoadingButton>}
                            {!appointment?.extendedProps.patient?.isArchived &&
                                <>
                                    <LoadingButton
                                        {...{loading}}
                                        onClick={() => {
                                            OnUploadDocuments(appointment);
                                        }}
                                        color={"secondary"}
                                        fullWidth
                                        variant="contained"
                                        startIcon={<IconUrl path={"fileadd"} width={18} height={18} color={"white"}/>}>
                                        {t("import_document")}
                                    </LoadingButton>
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
                                            <IconUrl width={18} height={18} path="ic-user1"/>
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
                                            <IconUrl width={18} height={18} path="ic-agenda"/>
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
                                </>}
                            <LoadingButton
                                {...{loading}}
                                onClick={() => SetCancelDialog(true)}
                                fullWidth
                                variant="contained-white"
                                color="error"
                                sx={{
                                    display:
                                        ["CANCELED", "PATIENT_CANCELED", "FINISHED", "ON_GOING"].includes(appointment?.extendedProps.status.key)
                                            ? "none"
                                            : "flex",
                                    "& svg": {
                                        width: 18,
                                        height: 18,
                                    },
                                }}
                                startIcon={
                                    <IconUrl
                                        path="ic-trash"
                                        color={
                                            ["CANCELED", "PATIENT_CANCELED"].includes(appointment?.extendedProps.status.key)
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

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 460
                    }
                }}
                open={openPaymentDialog}
                data={{
                    patient: appointment?.extendedProps.patient,
                    setOpenPaymentDialog,
                    mutatePatient: () => {
                        trigger({
                                method: "GET",
                                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${appointment?.extendedProps.patient?.uuid}/wallet/${router.locale}`
                            },
                            {
                                onSuccess: (res) => {
                                    let _appointment: any = {
                                        ...appointment,
                                        extendedProps: {
                                            ...appointment?.extendedProps,
                                            restAmount: res.data.data.rest_amount
                                        }
                                    }
                                    dispatch(setSelectedEvent(_appointment));
                                },
                            }
                        );
                    }
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title", {ns: "payment"})}
                dialogClose={() => {
                    setOpenPaymentDialog(false)
                }}
            />
        </RootStyled>
    );
}

export default AppointmentDetail;
