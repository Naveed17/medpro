import React from 'react'
import { Card, CardContent, Stack, IconButton, Box, List, ListItem, Typography } from '@mui/material'
import AppointmentCardStyled from './overrides/appointmentCardStyle';
import { Label } from '@features/label'
import Icon from "@themes/urlIcon";


export default function AppointmentCard({ ...prop }) {
    const { data, ...rest } = prop
    return (
        <AppointmentCardStyled>
            <CardContent>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Label variant='filled' color="warning">
                        {data?.status}
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
                                    Motif de consultation
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
                                    Date of appointment
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
