import React, {ReactElement, useEffect, useRef, useState} from "react";
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

import {Popover} from "@features/popover";
import {AppointmentCard} from "@features/card";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import moment from "moment";
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, openDrawer, setSelectedEvent} from "@features/calendar";
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {
    Dialog,
    dialogMoveSelector,
    MoveAppointmentDialog,
    QrCodeDialog,
    setMoveDateTime
} from "@features/dialog";
import {useTranslation} from "next-i18next";
import {LoadingButton} from "@mui/lab";

const menuList = [
    {
        title: "start_the_consultation",
        icon: <PlayCircleIcon/>,
        action: "onOpenEditPatient",
    },
    {
        title: "add_patient_to_waiting_room",
        icon: <Icon color={"white"} path='ic-salle'/>,
        action: "onOpenDetails",
    },
    {
        title: "see_patient_form",
        icon: <InsertDriveFileOutlinedIcon/>,
        action: "onCancel",
    },

    {
        title: "send_a_message",
        icon: <SmsOutlinedIcon/>,
        action: "onCancel",
    },
    {
        title: "import_document",
        icon: <SaveAltOutlinedIcon/>,
        action: "onCancel",
    },
    {
        title: "move_appointment",
        icon: <Icon color={"white"} path="iconfinder"/>,
        action: "onCancel",
    },
    {
        title: "cancel_appointment",
        icon: <DeleteOutlineOutlinedIcon/>,
        action: "onCancel",
    }
];

function AppointmentDetail({...props}) {
    const {
        onConsultation,
        onEditDetails,
        onChangeIntro,
        onEditintro,
        onWaiting,
        onMoveAppointment,
        onCancelAppointment
    } = props;

    const dispatch = useAppDispatch();
    const {t, ready} = useTranslation("common")
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const {config: agendaConfig, selectedEvent: data} = useAppSelector(agendaSelector);
    const {date: moveDialogDate, time: moveDialogTime, selected: moveDateChanged} = useAppSelector(dialogMoveSelector);

    const [alert, setAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [moveAlert, setMoveAlert] = useState<boolean>(false);
    const [value, setValue] = useState(data?.extendedProps.insctruction);
    const [openTooltip, setOpenTooltip] = useState(false);

    const [offsetTop, setOffsetTop] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {
        trigger: updateStatusTrigger
    } = useRequestMutation(null, "/agenda/update/appointment/status",
        {revalidate: false, populateCache: false});

    const cancelAppointment = (appointmentUUid: string) => {
        setLoading(true);
        const form = new FormData();
        form.append('status', '6');
        updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}
            /appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setLoading(false);
            const eventUpdated: any = {
                ...data, extendedProps:
                    {...data?.extendedProps, status: {key: "CANCELED", value: "Annulé"}}
            };
            dispatch(setSelectedEvent(eventUpdated));
            setAlert(false);
            onCancelAppointment(appointmentUUid);
        })
    }

    const onClickTooltipItem = (item: {
        title: string;
        icon: ReactElement;
        action: string;
    }) => {
        switch (item.action) {
            case "onOpenDetails":
                console.log("onOpenDetails");
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

    const handleMoveDataChange = (type: string, moveDialogDate: Date, moveDialogTime: string) => {
        dispatch(setMoveDateTime(type === 'date' ?
            {date: moveDialogDate, selected: true} : {time: moveDialogTime, selected: true}));
    };

    const submitMoveAppointment = () => {
        console.log(moveDialogDate, moveDialogTime);
    }

    useEffect(() => {
        if (rootRef.current) {
            setOffsetTop(rootRef.current.offsetTop)
        }
    }, []);

    if (!ready) return <>loading translations...</>;

    return (
        <RootStyled>
            <AppBar position="static" color='inherit'>
                <Toolbar>
                    <Popover
                        open={openTooltip}
                        handleClose={() => setOpenTooltip(false)}
                        menuList={menuList}
                        onClickItem={onClickTooltipItem}
                        button={
                            <IconButton
                                onClick={() => {
                                    setOpenTooltip(true);
                                }}
                                sx={{display: "block", ml: "auto"}}
                                size="small"
                            >
                                <Icon path="more-vert"/>
                            </IconButton>
                        }
                    />
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
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<PlayCircleIcon/>}
                            onClick={onConsultation}
                        >
                            {t('event.start')}
                        </Button>
                    </Stack>
                    <Typography sx={{mt: 2, mb: 1}} variant="body1" fontWeight={600}>
                        {t('time_slot')}
                    </Typography>
                    <AppointmentCard
                        t={t}
                        data={
                            {
                                date: moment(data?.extendedProps.time).format("DD-MM-YYYY"),
                                time: moment(data?.extendedProps.time).format("hh:mm"),
                                motif: data?.extendedProps.motif,
                                status: data?.extendedProps.status
                            }
                        }
                    />

                    <Stack direction="row" spacing={2} alignItems='center' mt={2}>
                        <Button onClick={handleQr} variant='contained' fullWidth>
                            Qr-Code
                        </Button>
                        <Button variant='contained' fullWidth>
                            {t('send_link')}
                        </Button>
                    </Stack>
                    <Typography sx={{mt: 2, mb: 1}} variant="body1" fontWeight={600}>
                        {t('patient')}
                    </Typography>
                    <Card>
                        <CardContent>
                            <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                                <Stack spacing={2} direction="row" alignItems='center'>
                                    <Avatar sx={{width: 24, height: 24}}/>
                                    <Typography variant="body1" color="primary" fontWeight={700}>
                                        {data?.title}
                                    </Typography>
                                </Stack>
                                <IconButton size="small"
                                            onClick={onEditDetails}
                                >
                                    <IconUrl path='Ic-duotone'/>
                                </IconButton>
                            </Stack>
                            <List sx={{py: 0, pl: 2}}>
                                <ListItem>
                                    <IconUrl path='ic-anniverssaire'/>
                                    <Typography sx={{ml: 1, fontSize: 11}} variant="caption" color="text.secondary"
                                                fontWeight={400}>
                                        {data?.extendedProps.patient.birthdate} ({moment().diff(moment(data?.extendedProps.patient.birthdate, "DD-MM-YYYY"), "years")} {t("times.years")})
                                    </Typography>
                                </ListItem>
                                {data?.extendedProps.patient.email && <ListItem>
                                    <IconUrl path='ic-message-contour'/>
                                    <Link underline="none" href={`mailto:${data?.extendedProps.patient.email}`}
                                          sx={{ml: 1, fontSize: 11}}
                                          variant="caption" color="primary" fontWeight={400}>
                                        {data?.extendedProps.patient.email}
                                    </Link>
                                </ListItem>}
                                {data?.extendedProps.patient.phone && <ListItem>
                                    <IconUrl path='ic-tel'/>
                                    <Box component='img'
                                         src={`https://flagcdn.com/w20/${data?.extendedProps.patient.phone.ccode}.png`}
                                         srcSet={`https://flagcdn.com/w40/${data?.extendedProps.patient.phone.ccode}.png 2x`}
                                         sx={{width: 13, ml: 1}}/>
                                    <Link underline="none" href={`tel:${data?.extendedProps.patient.phone}`}
                                          sx={{ml: 1, fontSize: 11}}
                                          variant="caption" color="text.secondary" fontWeight={400}>
                                        {data.extendedProps.patient.phone}
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
                                value={value}
                                fullWidth
                                onChange={(e) => onChangeIntro(() => setValue(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton size="small"
                                                    onClick={onEditintro}
                                        >
                                            <IconUrl path='Ic-duotone'/>
                                        </IconButton>
                                    </InputAdornment>,
                                    readOnly: true,
                                }}
                            />
                        </CardContent>
                    </Card>
                </Box>
                <CardActions sx={{pb: 4}}>
                    <Stack spacing={1} width={1}>
                        <Button onClick={onWaiting} fullWidth variant='contained' startIcon={<Icon path='ic-salle'/>}>
                            {t('waiting')}
                        </Button>
                        <Button onClick={() => {
                                    dispatch(setMoveDateTime({
                                        date: data?.extendedProps.time,
                                        time: moment(data?.extendedProps.time).format("hh:mm"),
                                        selected: false
                                    }));
                                    setMoveAlert(true)
                                }}
                                fullWidth variant='contained'
                                startIcon={<IconUrl path='iconfinder'/>}>
                            {t('event.move')}
                        </Button>
                        <Button onClick={() => setAlert(true)}
                                fullWidth
                                variant='contained-white'
                                color="error"
                                sx={{'& svg': {width: 14, height: 14}}} startIcon={<IconUrl path='icdelete'/>}>
                            {t('event.delete')}
                        </Button>
                    </Stack>
                </CardActions>
            </Box>
            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setAlert(false)}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t("dialogs.cancel-dialog.sub-title")}</Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t("dialogs.cancel-dialog.description")}</Typography>
                        </Box>)
                }}
                open={alert}
                title={t("dialogs.cancel-dialog.title")}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setAlert(false)}
                            startIcon={<CloseIcon/>}
                        >
                            {t("dialogs.cancel-dialog.cancel")}
                        </Button>
                        <LoadingButton
                            {...(loading && loading)}
                            variant="contained"
                            color={"error"}
                            onClick={() => cancelAppointment(data?.publicId as string)}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                        >
                            {t("dialogs.cancel-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            ></Dialog>

            <Dialog
                size={"sm"}
                color={theme.palette.primary.main}
                contrastText={theme.palette.primary.contrastText}
                dialogClose={() => setMoveAlert(false)}
                action={() =>
                    <MoveAppointmentDialog
                        OnDateChange={handleMoveDataChange}
                        t={t}
                        data={{...data}}
                    />}
                open={moveAlert}
                title={t("dialogs.move-dialog.title")}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setMoveAlert(false)}
                            startIcon={<CloseIcon/>}
                        >
                            {t("dialogs.move-dialog.garde-date")}
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!moveDateChanged}
                            onClick={() => submitMoveAppointment()}
                            color={"primary"}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="iconfinder"></Icon>}
                        >
                            {t("dialogs.move-dialog.confirm")}
                        </Button>
                    </>
                }
            ></Dialog>
            <Dialog action={() => <QrCodeDialog data={data}/>}
                    open={openDialog}
                    data={null}
                    actions={false}
                    onClose={handleCloseDialog}
                    direction={'ltr'}
                    title={t("qr_title")}
                    dialogClose={handleCloseDialog}/>
        </RootStyled>
    )
}

export default AppointmentDetail;
