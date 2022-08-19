import React from 'react'
import { Paper, AppBar, Toolbar, Box, Button, IconButton, Stack, InputAdornment, CardActions, Typography, Card, CardContent, Avatar, Link, TextField, List, ListItem } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { AppointmentCard } from '@features/card';
import AppointmentDetailsStyled from './overrides/appointmentDetailsStyle';
import Icon from '@themes/urlIcon';

export default function AppointmentDetails({ ...props }) {
    const { data, onConsultation, onEditDetails, onChangeIntro, onEditintro, onWaiting, onMoveAppointment, onCancelAppointment, onClose, ...rest } = props;
    const getYear = data && data.dob !== undefined ? new Date(data.dob).getFullYear() : '';
    const [offsetTop, setOffsetTop] = React.useState(0);
    const rootRef = React.useRef<any>(null);
    const [value, setValue] = React.useState(data?.intro);
    React.useEffect(() => {
        if (rootRef.current) {
            setOffsetTop(rootRef.current.offsetTop)
        }

    }, [])
    return (
        <AppointmentDetailsStyled>
            <AppBar position="static" color='inherit' >
                <Toolbar>
                    <IconButton
                        onClick={onClose}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box ref={rootRef} sx={{
                maxHeight: `calc(100vh - ${offsetTop + 2}px)`,
                overflowY: 'auto',
            }}>
                <Box px={1} py={2}>
                    <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                        <Typography variant="h6">
                            Détail RDV
                        </Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
                        Créneau horaire
                    </Typography>
                    <AppointmentCard data={
                        {
                            date: '12/12/2020',
                            time: '12:00',
                            reason: 'Motif x',
                            status: 'En attente',
                            code: "RDV-121220-12",
                        }
                    }
                        onClick={(e: React.MouseEvent) => { console.log(e) }}
                    />
                    <Stack direction="row" spacing={2} alignItems='center' mt={2}>
                        <Button variant='contained' fullWidth>
                            Qr-Code
                        </Button>
                        <Button variant='contained' fullWidth>
                            Envoyer lien
                        </Button>
                    </Stack>
                    <Typography sx={{ mt: 2, mb: 1 }} variant="body1" fontWeight={600}>
                        Patient
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
                                        {data?.dob}   ({new Date().getFullYear() - getYear} ans)
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
                        Insctruction
                    </Typography>
                    <Card>
                        <CardContent>
                            <TextField
                                id="outlined-multiline-static"
                                placeholder="Insctruction"
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
                            Ajouter patient à la salle d'attente
                        </Button>
                        <Button onClick={onMoveAppointment} fullWidth variant='contained' startIcon={<Icon path='ic-iconfinder' />}>
                            Déplacer RDV
                        </Button>
                        <Button onClick={onCancelAppointment} fullWidth variant='contained-white' color="error" sx={{ '& svg': { width: 14, height: 14 } }} startIcon={<Icon path='icdelete' />}>
                            Déplacer RDV
                        </Button>
                    </Stack>
                </CardActions>
            </Box>
        </AppointmentDetailsStyled>
    )
}
