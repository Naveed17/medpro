import React, {ReactElement, useRef, useState} from "react";
import RootStyled from './overrides/rootStyled';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Stack,
    InputAdornment,
    CardActions,
    Typography,
    Card,
    CardContent,
    Avatar,
    Link,
    TextField,
    List,
    ListItem, useTheme
} from '@mui/material'

import {AppointmentCard} from "@features/card";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";

import {
    Dialog,
    QrCodeDialog,
    setMoveDateTime,
} from "@features/dialog";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import CircularProgress from "@mui/material/CircularProgress";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import SaveAsIcon from "@mui/icons-material/SaveAs";

function AppointmentDetail({...props}) {
    const {
        OnConsultation,
        OnConsultationView,
        OnEditDetail,
        OnConfirmAppointment,
        OnDataUpdated = null,
        OnPatientNoShow,
        OnWaiting,
        OnLeaveWaiting,
        SetMoveDialog,
        SetCancelDialog,
        SetDeleteDialog
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const rootRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (session?.data as UserDataResponse).general_information.roles as Array<string>

    const {t, ready} = useTranslation("common")
    const {config: agendaConfig, selectedEvent: data} = useAppSelector(agendaSelector);

    const {
        trigger: updateInstructionTrigger
    } = useRequestMutation(null, "/agenda/update/instruction",
        TriggerWithoutValidation);

    const {data: httpPatientPhotoResponse} = useRequest(data?.extendedProps?.patient?.hasPhoto ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${data.extendedProps.patient?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [instruction, setInstruction] = useState(data?.extendedProps?.instruction ? data?.extendedProps?.instruction : "");
    const [openTooltip, setOpenTooltip] = useState(false);
    const [edited, setEdited] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateInstruction = () => {
        setLoading(true);
        const form = new FormData();
        form.append('attribute', "instruction");
        form.append('value', instruction);
        updateInstructionTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/appointments/${data?.publicId ? data?.publicId : (data as any)?.id}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setLoading(false);
            setEdited(false);
            if (OnDataUpdated) {
                OnDataUpdated();
            }
        });
    }

    const onClickTooltipItem = (item: {
        title: string;
        icon: ReactElement;
        action: string;
    }) => {
        switch (item.action) {
            case "onOpenPatientDrawer":
                console.log("onOpenPatientDrawer");
                break;
        }
    };

    const handleQr = () => {
        handleClickDialog()
    };

    const handleClickDialog = () => {
        setOpenDialog(true);

    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <RootStyled>
            <AppBar position="static" color='inherit'>
                <Toolbar>
                    <IconButton
                        size="small"
                        onClick={() => dispatch(openDrawer({type: "view", open: false}))}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box ref={rootRef} sx={{
                height: 'calc(100% - 64px)',
                overflowY: 'scroll',
            }}>
                <Box px={1} py={2}>
                    <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                        <Typography variant="h6">
                            {t('appointment_details')}
                        </Typography>
                        {(!roles.includes('ROLE_SECRETARY') && router.pathname !== "/dashboard/patient") &&
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                color="warning"
                                startIcon={<PlayCircleIcon/>}
                                onClick={() => {
                                    setLoading(true);
                                    ["FINISHED", "ON_GOING"].includes(data?.extendedProps.status.key) ? OnConsultationView(data) : OnConsultation(data);
                                }}
                            >
                                {t(["FINISHED", "ON_GOING"].includes(data?.extendedProps.status.key) ? 'view_the_consultation' : 'event.start')}
                            </LoadingButton>}
                    </Stack>
                    {data?.extendedProps.hasErrors?.map((error: string, index: number) => (
                        <Stack key={`error${index}`}
                               sx={{mt: 2}} spacing={2}
                               direction="row" justifyContent='space-between'
                               alignItems='center'>
                            <Typography variant="body2" component="span" className="alert">
                                <Icon path="danger"/>
                                <span>{t(error)}</span>
                            </Typography>
                        </Stack>
                    ))}
                    <Typography sx={{mb: 1, mt: data?.extendedProps.hasErrors?.length > 1 ? 0 : 2}} variant="body1"
                                fontWeight={600}>
                        {t('time_slot')}
                    </Typography>
                    <AppointmentCard
                        {...{t, roles}}
                        onDataUpdated={OnDataUpdated}
                        data={
                            {
                                uuid: data?.publicId ? data?.publicId : (data as any)?.id,
                                date: moment(data?.extendedProps.time).format("DD-MM-YYYY"),
                                time: moment(data?.extendedProps.time).format("HH:mm"),
                                motif: data?.extendedProps.motif,
                                status: data?.extendedProps.status,
                                type: data?.extendedProps.type
                            }
                        }
                    />

                    {process.env.NODE_ENV === 'development' &&
                        <Stack direction="row" spacing={2} alignItems='center' mt={2}>
                            <Button onClick={handleQr} variant='contained' fullWidth>
                                Qr-Code
                            </Button>
                            <Button variant='contained' fullWidth>
                                {t('send_link')}
                            </Button>
                        </Stack>}
                    <Typography sx={{mt: 2, mb: 1}} variant="body1" fontWeight={600}>
                        {t('patient')}
                    </Typography>
                    <Card>
                        <CardContent>
                            <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                                <Stack spacing={2} direction="row" alignItems='center'>
                                    <Avatar
                                        src={patientPhoto ? patientPhoto : (data?.extendedProps?.patient?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                                        sx={{
                                            "& .injected-svg": {
                                                margin: 0
                                            },
                                            width: 24,
                                            height: 24,
                                            borderRadius: 1
                                        }}>
                                        <IconUrl width={"24"} height={"24"} path="men-avatar"/>
                                    </Avatar>
                                    <Typography variant="body1" color="primary" fontWeight={700}>
                                        {data?.title}
                                    </Typography>
                                </Stack>
                                <IconButton size="small"
                                            onClick={OnEditDetail}
                                >
                                    <IconUrl path='ic-duotone'/>
                                </IconButton>
                            </Stack>
                            <List sx={{py: 0, pl: 2}}>
                                <ListItem>
                                    <IconUrl path='ic-anniverssaire'/>
                                    <Typography sx={{ml: 1, fontSize: 11}} variant="caption" color="text.secondary"
                                                fontWeight={400}>
                                        {data?.extendedProps.patient?.birthdate}
                                        ({moment().diff(moment(data?.extendedProps.patient?.birthdate, "DD-MM-YYYY"), "years")} {t("times.years")})
                                    </Typography>
                                </ListItem>
                                {data?.extendedProps.patient?.email && <ListItem>
                                    <IconUrl path='ic-message-contour'/>
                                    <Link underline="none" href={`mailto:${data?.extendedProps.patient?.email}`}
                                          sx={{ml: 1, fontSize: 11}}
                                          variant="caption" color="primary" fontWeight={400}>
                                        {data?.extendedProps.patient?.email}
                                    </Link>
                                </ListItem>}
                                {data?.extendedProps.patient?.phone && <ListItem>
                                    <IconUrl path='ic-tel'/>
                                    {data?.extendedProps.patient?.phone.ccode &&
                                        <Box component='img'
                                             src={`https://flagcdn.com/${data?.extendedProps.patient?.phone.ccode}.svg`}
                                             srcSet={`https://flagcdn.com/${data?.extendedProps.patient?.phone.ccode}.svg 2x`}
                                             sx={{width: 13, ml: 1}}/>}
                                    <Link underline="none" href={`tel:${data?.extendedProps.patient?.phone}`}
                                          sx={{ml: 1, fontSize: 11}}
                                          variant="caption" color="text.secondary" fontWeight={400}>
                                        {data.extendedProps.patient?.phone}
                                    </Link>
                                </ListItem>}
                            </List>
                        </CardContent>
                    </Card>
                    <Typography sx={{mt: 2, mb: 1}} variant="body1" fontWeight={600}>
                        {t('insctruction')}
                    </Typography>
                    <Card>
                        <CardContent>
                            <TextField
                                id="outlined-multiline-static"
                                placeholder={t('insctruction')}
                                multiline
                                rows={4}
                                disabled={!edited}
                                value={instruction}
                                fullWidth
                                onChange={(e) => setInstruction(e.target.value)}
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        onClick={() => edited ? updateInstruction() : setEdited(true)}
                                        position="end">
                                        {edited ? (loading ?
                                                    <IconButton size="small"><CircularProgress size={20}/> </IconButton> :
                                                    <>
                                                        <Button
                                                            sx={{
                                                                marginRight: 1
                                                            }}
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                setEdited(false);
                                                            }}
                                                            color={"error"}
                                                            variant="outlined"
                                                            size="small">
                                                            {(t('event.cancel')).split(" ")[0]}
                                                        </Button>
                                                        <Button
                                                            disabled={edited && instruction.length === 0}
                                                            variant="outlined"
                                                            startIcon={<SaveAsIcon color={"inherit"}/>}
                                                            size="small">
                                                            {t('event.save')}
                                                        </Button>
                                                    </>
                                            ) :
                                            <IconButton size="small"><IconUrl path='ic-duotone'/> </IconButton>}
                                    </InputAdornment>
                                }}
                            />
                        </CardContent>
                    </Card>
                </Box>
                {router.pathname !== "/dashboard/patient" &&
                    <CardActions sx={{pb: 4}}>
                        <Stack spacing={1} width={1}>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display: data?.extendedProps.status.key !== "PENDING" ? "none" : "flex"
                                }}
                                onClick={() => {
                                    OnConfirmAppointment(data);
                                }}
                                color={"success"}
                                fullWidth variant='contained'
                                startIcon={<CheckCircleOutlineRoundedIcon/>}>
                                {t('event.confirm')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => OnWaiting(data)}
                                sx={{
                                    display: (moment().format("DD-MM-YYYY") !== moment(data?.extendedProps.time).format("DD-MM-YYYY") ||
                                        ["PENDING", "WAITING_ROOM", "ON_GOING"].includes(data?.extendedProps.status.key)) ? "none" : "flex"
                                }}
                                fullWidth
                                variant='contained'
                                startIcon={<Icon path='ic-salle'/>}>
                                {t('waiting')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => OnLeaveWaiting(data)}
                                sx={{
                                    display: (moment().format("DD-MM-YYYY") !== moment(data?.extendedProps.time).format("DD-MM-YYYY") ||
                                        data?.extendedProps.status.key !== "WAITING_ROOM") ? "none" : "flex"
                                }}
                                fullWidth
                                variant='contained'
                                startIcon={<Icon path='ic-salle'/>}>
                                {t('leave_waiting_room')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display: (moment().isBefore(data?.extendedProps.time) ||
                                        data?.extendedProps.status.key === "FINISHED" ||
                                        data?.extendedProps.status.key === "ON_GOING") ? "none" : "flex"
                                }}
                                onClick={() => OnPatientNoShow(data)}
                                fullWidth variant='contained'
                                startIcon={<IconUrl width={"16"} height={"16"} path='ic-user1'/>}>
                                {t('event.missPatient')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display: moment().isBefore(data?.extendedProps.time) ? "none" : "flex"
                                }}
                                onClick={() => {
                                    dispatch(setMoveDateTime({
                                        date: new Date(data?.extendedProps.time),
                                        time: moment(new Date(data?.extendedProps.time)).format("HH:mm"),
                                        action: "reschedule",
                                        selected: false
                                    }));
                                    SetMoveDialog(true)
                                }}
                                fullWidth variant='contained'
                                startIcon={<IconUrl width={"16"} height={"16"} path='ic-agenda'/>}>
                                {t('event.reschedule')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                sx={{
                                    display: moment().isAfter(data?.extendedProps.time) ? "none" : "flex"
                                }}
                                onClick={() => {
                                    dispatch(setMoveDateTime({
                                        date: new Date(data?.extendedProps.time),
                                        time: moment(new Date(data?.extendedProps.time)).format("HH:mm"),
                                        action: "move",
                                        selected: false
                                    }));
                                    SetMoveDialog(true)
                                }}
                                fullWidth variant='contained'
                                startIcon={<IconUrl path='iconfinder'/>}>
                                {t('event.move')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => SetCancelDialog(true)}
                                fullWidth
                                variant='contained-white'
                                color="error"
                                sx={{
                                    display: (data?.extendedProps.status.key === "CANCELED" ||
                                        data?.extendedProps.status.key === "FINISHED" ||
                                        data?.extendedProps.status.key === "ON_GOING") ? "none" : "flex",
                                    '& svg': {
                                        width: 16,
                                        height: 16
                                    }
                                }}
                                startIcon={<IconUrl path='icdelete'
                                                    color={data?.extendedProps.status.key === "CANCELED" ?
                                                        'white' : theme.palette.error.main}/>}>
                                {t('event.cancel')}
                            </LoadingButton>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => SetDeleteDialog(true)}
                                sx={{
                                    display: (data?.extendedProps.status.key === "CANCELED" ||
                                        data?.extendedProps.status.key === "FINISHED" ||
                                        data?.extendedProps.status.key === "ON_GOING") ? "none" : "flex"
                                }}
                                fullWidth
                                variant='contained-white'
                                color="error"
                                startIcon={<HighlightOffRoundedIcon color={"error"}/>}>
                                {t('event.delete')}
                            </LoadingButton>
                        </Stack>
                    </CardActions>}
            </Box>

            <Dialog action={() => <QrCodeDialog data={data}/>}
                    open={openDialog}
                    onClose={handleCloseDialog}
                    direction={'ltr'}
                    title={t("qr_title")}
                    dialogClose={handleCloseDialog}/>
        </RootStyled>
    )
}

export default AppointmentDetail;
