import React, { ReactElement, useEffect, useRef, useState } from "react";
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

import { Popover } from "@features/popover";
import { AppointmentCard } from "@features/card";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { agendaSelector, openDrawer } from "@features/calendar";

import {
    Dialog,
    QrCodeDialog,
    setMoveDateTime
} from "@features/dialog";
import { useTranslation } from "next-i18next";

const menuList = [
    {
        title: "start_the_consultation",
        icon: <PlayCircleIcon />,
        action: "onOpenEditPatient",
    },
    {
        title: "add_patient_to_waiting_room",
        icon: <Icon color={"white"} path='ic-salle' />,
        action: "onOpenDetails",
    },
    {
        title: "see_patient_form",
        icon: <InsertDriveFileOutlinedIcon />,
        action: "onCancel",
    },

    {
        title: "send_a_message",
        icon: <SmsOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "import_document",
        icon: <SaveAltOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "move_appointment",
        icon: <Icon color={"white"} path="iconfinder" />,
        action: "onCancel",
    },
    {
        title: "cancel_appointment",
        icon: <DeleteOutlineOutlinedIcon />,
        action: "onCancel",
    }
];

function AppointmentDetail({ ...props }) {
    const {
        onConsultation,
        onEditDetail,
        onChangeIntro,
        onEditintro,
        onWaiting,
        setMoveDialog,
        setCancelDialog,
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { t, ready } = useTranslation("common")
    const { selectedEvent: data } = useAppSelector(agendaSelector);

    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [value, setValue] = useState(data?.extendedProps.insctruction);
    const [openTooltip, setOpenTooltip] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

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
                                sx={{ display: "block", ml: "auto" }}
                                size="small"
                            >
                                <Icon path="more-vert" />
                            </IconButton>
                        }
                    />
                    <IconButton
                        size="small"
                        onClick={() => dispatch(openDrawer({ type: "view", open: false }))}
                    >
                        <CloseIcon />
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
                            startIcon={<PlayCircleIcon />}
                            onClick={onConsultation}
                        >
                            {t('event.start')}
                        </Button>
                    </Stack>
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
                        {t('time_slot')}
                    </Typography>
                    <AppointmentCard
                        t={t}
                        data={
                            {
                                date: moment(data?.extendedProps.time).format("DD-MM-YYYY"),
                                time: moment(data?.extendedProps.time).format("HH:mm"),
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
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
                        {t('patient')}
                    </Typography>
                    <Card>
                        <CardContent>
                            <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                                <Stack spacing={2} direction="row" alignItems='center'>
                                    <Avatar sx={{ width: 24, height: 24 }} />
                                    <Typography variant="body1" color="primary" fontWeight={700}>
                                        {data?.title}
                                    </Typography>
                                </Stack>
                                <IconButton size="small"
                                    onClick={onEditDetail}
                                >
                                    <IconUrl path='Ic-duotone' />
                                </IconButton>
                            </Stack>
                            <List sx={{ py: 0, pl: 2 }}>
                                <ListItem>
                                    <IconUrl path='ic-anniverssaire' />
                                    <Typography sx={{ ml: 1, fontSize: 11 }} variant="caption" color="text.secondary"
                                        fontWeight={400}>
                                        {data?.extendedProps.patient.birthdate} ({moment().diff(moment(data?.extendedProps.patient.birthdate, "DD-MM-YYYY"), "years")} {t("times.years")})
                                    </Typography>
                                </ListItem>
                                {data?.extendedProps.patient.email && <ListItem>
                                    <IconUrl path='ic-message-contour' />
                                    <Link underline="none" href={`mailto:${data?.extendedProps.patient.email}`}
                                        sx={{ ml: 1, fontSize: 11 }}
                                        variant="caption" color="primary" fontWeight={400}>
                                        {data?.extendedProps.patient.email}
                                    </Link>
                                </ListItem>}
                                {data?.extendedProps.patient.phone && <ListItem>
                                    <IconUrl path='ic-tel' />
                                    <Box component='img'
                                        src={`https://flagcdn.com/w20/${data?.extendedProps.patient.phone.ccode}.png`}
                                        srcSet={`https://flagcdn.com/w40/${data?.extendedProps.patient.phone.ccode}.png 2x`}
                                        sx={{ width: 13, ml: 1 }} />
                                    <Link underline="none" href={`tel:${data?.extendedProps.patient.phone}`}
                                        sx={{ ml: 1, fontSize: 11 }}
                                        variant="caption" color="text.secondary" fontWeight={400}>
                                        {data.extendedProps.patient.phone}
                                    </Link>
                                </ListItem>}
                            </List>
                        </CardContent>
                    </Card>
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
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
                                            <IconUrl path='Ic-duotone' />
                                        </IconButton>
                                    </InputAdornment>,
                                    readOnly: true,
                                }}
                            />
                        </CardContent>
                    </Card>
                </Box>
                <CardActions sx={{ pb: 4 }}>
                    <Stack spacing={1} width={1}>
                        <Button onClick={onWaiting} fullWidth variant='contained' startIcon={<Icon path='ic-salle' />}>
                            {t('waiting')}
                        </Button>
                        <Button
                            disabled={moment().isAfter(data?.extendedProps.time)}
                            onClick={() => {
                                dispatch(setMoveDateTime({
                                    date: data?.extendedProps.time,
                                    time: moment(data?.extendedProps.time).format("HH:mm"),
                                    selected: false
                                }));
                                setMoveDialog(true)
                            }}
                            fullWidth variant='contained'
                            startIcon={<IconUrl path='iconfinder' />}>
                            {t('event.move')}
                        </Button>
                        <Button onClick={() => setCancelDialog(true)}
                            disabled={data?.extendedProps.status.key === "CANCELED"}
                            fullWidth
                            variant='contained-white'
                            color="error"
                            sx={{ '& svg': { width: 14, height: 14 } }}
                            startIcon={<IconUrl path='icdelete'
                                color={data?.extendedProps.status.key === "CANCELED" ?
                                    'white' : theme.palette.error.main} />}>
                            {t('event.delete')}
                        </Button>
                    </Stack>
                </CardActions>
            </Box>

            <Dialog action={() => <QrCodeDialog data={data} />}
                open={openDialog}
                onClose={handleCloseDialog}
                direction={'ltr'}
                title={t("qr_title")}
                dialogClose={handleCloseDialog} />
        </RootStyled>
    )
}

export default AppointmentDetail;
