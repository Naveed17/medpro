import { CardContent, Stack, IconButton, Box, List, ListItem, Typography } from '@mui/material'
import AppointmentCardStyled from './overrides/appointmentCardStyle';
import { Label } from '@features/label'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next';

export default function AppointmentCard({ ...prop }) {
    const { t, ready } = useTranslation("common");
    const { data, ...rest } = prop
    if (!ready) return <>loading translations...</>;
    return (
        <AppointmentCardStyled>
            <CardContent>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Label variant='filled' color="warning">
                        {t(data?.status)}
                    </Label>
                    <IconButton size="small" {...rest}>
                        <Icon path='Ic-duotone' />
                    </IconButton>
                </Stack>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Box>
                        <List>
                            <ListItem>
                                <Typography fontWeight={400}>
                                    {t('consultation_reson')}
                                </Typography>
                                <Stack spacing={2} direction='row' alignItems="center">
                                    <Label className="lable" variant='filled' color={data.status === 'En attente' ? 'success' : "primary"} >
                                        {''}
                                    </Label>
                                    <Typography fontWeight={400}>
                                        {data?.reason}
                                    </Typography>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Typography fontWeight={400}>
                                    {t('appintment_date')}
                                </Typography>
                                <Stack spacing={4} direction="row" alignItems='center'>
                                    <Stack spacing={0.5} direction="row" alignItems='center'>
                                        <Icon className='callander' path="ic-agenda-jour" />
                                        <Typography className="time-slot">
                                            {data?.date}
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={0.5} direction="row" alignItems='center'>
                                        <Icon className='time' path="setting/ic-time" />
                                        <Typography className="date">
                                            {data?.time}
                                        </Typography>
                                    </Stack>

                                </Stack>
                            </ListItem>
                        </List>
                    </Box>
                </Stack>
            </CardContent>
        </AppointmentCardStyled>
    )
}
