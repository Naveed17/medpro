import React, { ReactElement } from 'react'
import { AppBar, Toolbar, Box, Button, IconButton, DialogActions, Stack, InputAdornment, CardActions, Typography, Card, CardContent, Avatar, Link, TextField, List, ListItem } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Popover } from "@features/popover";
import { AppointmentCard } from '@features/card';
import { Dialog } from '@features/dialog';
import AppointmentDetailsStyled from './overrides/appointmentDetailsStyle';
import Icon from '@themes/urlIcon';
import { useTranslation } from 'next-i18next';
const menuList = [
    {
        title: "Ajouter patient à la salle d'attente",
        icon: <Icon color={"white"} path='ic-salle' />,
        action: "onOpenDetails",
    },
    {
        title: "Commencer la consultation",
        icon: <PlayCircleIcon />,
        action: "onOpenEditPatient",
    },
    {
        title: "Voir fiche Patient",
        icon: <InsertDriveFileOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "Envoyer un msg",
        icon: <SmsOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "Import document",
        icon: <SaveAltOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "Historique des RDV",
        icon: <EventNoteOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "Annuler RDV à venir",
        icon: <CloseOutlinedIcon />,
        action: "onCancel",
    },
    {
        title: "Déplacer RDV",
        icon: <Icon color={"white"} path="iconfinder" />,
        action: "onCancel",
    },
    {
        title: "Annuler RDV",
        icon: <DeleteOutlineOutlinedIcon />,
        action: "onCancel",
    }
];
export default function AppointmentDetails({ ...props }) {
    const { t, ready } = useTranslation("common")
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [openTooltip, setOpenTooltip] = React.useState<boolean>(false);
    const { data, onConsultation, onEditDetails, onChangeIntro, onEditintro, onWaiting, onMoveAppointment, onCancelAppointment, onClose, ...rest } = props;
    const getYear = data && data.dob !== undefined ? new Date(data.dob).getFullYear() as number : 0;
    const [value, setValue] = React.useState(data?.intro);
    const handleQr = () => {
        handleClickDialog()
    };
    const handleClickDialog = () => {
        setOpenDialog(true);

    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
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
    if (!ready) return <>loading translations...</>;
    return (
        <AppointmentDetailsStyled>
            <AppBar position="static" color='inherit' >
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
                        onClick={onClose}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{
                height: 'calc(100% - 64px)',
                overflowY: 'scroll',
            }}>
                <Box px={1} py={2}>
                    <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                        <Typography variant="h6">
                            {t('appointment_details')}
                        </Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
                        {t('time_slot')}
                    </Typography>
                    <AppointmentCard data={
                        {
                            date: '12/12/2020',
                            time: '12:00',
                            reason: 'Motif x',
                            status: 'on_hold',
                            code: "RDV-121220-12",
                        }
                    }
                        onClick={(e: React.MouseEvent) => { console.log(e) }}
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
                                        {data?.name}
                                    </Typography>
                                </Stack>
                                <IconButton size="small"
                                    onClick={onEditDetails}
                                >
                                    <Icon path='Ic-duotone' />
                                </IconButton>
                            </Stack>
                            <List sx={{ py: 0, pl: 2 }}>
                                <ListItem>
                                    <Icon path='ic-anniverssaire' />
                                    <Typography sx={{ ml: 1, fontSize: 11 }} variant="caption" color="text.secondary" fontWeight={400}>
                                        {data?.dob}   ({new Date().getFullYear() - getYear} {t('times.years')} )
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Icon path='ic-message-contour' />
                                    <Link underline="none" href={`mailto:${data?.email}`} sx={{ ml: 1, fontSize: 11 }} variant="caption" color="primary" fontWeight={400}>
                                        {data?.email}
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Icon path='ic-tel' />
                                    <Box component='img'
                                        src={`https://flagcdn.com/w20/${data?.ccode}.png`}
                                        srcSet={`https://flagcdn.com/w40/${data?.ccode}.png 2x`}
                                        sx={{ width: 13, ml: 1 }} />
                                    <Link underline="none" href={`tel:${data?.phone}`} sx={{ ml: 1, fontSize: 11 }} variant="caption" color="text.secondary" fontWeight={400}>
                                        {data?.phone}
                                    </Link>
                                </ListItem>
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
                                            <Icon path='Ic-duotone' />
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
                        <Button onClick={onMoveAppointment} fullWidth variant='contained' startIcon={<Icon path='ic-iconfinder' />}>
                            {t('move_appointment')}
                        </Button>
                        <Button onClick={onCancelAppointment} fullWidth variant='contained-white' color="error" sx={{ '& svg': { width: 14, height: 14 } }} startIcon={<Icon path='icdelete' />}>
                            {t('cancel_appointment')}
                        </Button>
                    </Stack>
                </CardActions>
            </Box>

            <Dialog action={'qr-dialog'}
                open={openDialog}
                data={null}
                max
                actions={false}
                onClose={handleCloseDialog}
                direction={'ltr'}
                title={t("qr_title")}
                dialogClose={handleCloseDialog} />
        </AppointmentDetailsStyled>
    )
}
