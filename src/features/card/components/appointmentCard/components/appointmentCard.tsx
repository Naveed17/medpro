import React from 'react'
import {CardContent, Stack, IconButton, Box, List, ListItem, Typography} from '@mui/material'
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function AppointmentCard({...props}) {
    const {data, t, ...rest} = props
    return (
        <RootStyled>
            <CardContent>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Label variant='filled'
                           color={
                               data?.status === "Confirmé"
                                   ? "success"
                                   : data?.status === "canceled"
                                       ? "error"
                                       : "primary"
                           }>
                        {data.status}
                    </Label>
                    <IconButton size="small" {...rest}>
                        <IconUrl path='Ic-duotone'/>
                    </IconButton>
                </Stack>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Box>
                        <List>
                            <ListItem>
                                <Typography fontWeight={400}>
                                    {t('event.motif')}
                                </Typography>
                                <Stack spacing={2} direction='row' alignItems="center">
                                    <FiberManualRecordIcon
                                        fontSize="small"
                                        sx={{color: data.motif.color}}
                                    />
                                    <Typography fontWeight={400}>
                                        {data.motif.name}
                                    </Typography>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Typography fontWeight={400}>
                                    {t('event.date')}
                                </Typography>
                                <Stack spacing={4} direction="row" alignItems='center'>
                                    <Stack spacing={0.5} direction="row" alignItems='center'>
                                        <IconUrl className='callander' path="ic-agenda-jour"/>
                                        <Typography className="time-slot">
                                            {data?.date}
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={0.5} direction="row" alignItems='center'>
                                        <IconUrl className='time' path="setting/ic-time"/>
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
        </RootStyled>)
}

export default AppointmentCard;
