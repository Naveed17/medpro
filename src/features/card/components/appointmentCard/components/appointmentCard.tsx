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
                               data?.status.key === "CONFIRMED"
                                   ? "success"
                                   : data?.status.key === "CANCELED"
                                       ? "error"
                                       : "primary"
                           }>
                        {data.status.value}
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
                                    {t('consultation_reson')}

                                </Typography>
                                <Stack spacing={2} direction='row' alignItems="center">
                                    <FiberManualRecordIcon
                                        className={'motif-circle'}
                                        fontSize="small"
                                        sx={{
                                            border: .1,
                                            borderColor: 'divider',
                                            borderRadius: '50%',
                                            p: 0.05,
                                            color: data.motif.color
                                        }}
                                    />

                                    <Typography fontWeight={400}>
                                        {data.motif.name}
                                    </Typography>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Typography fontWeight={400}>
                                    {t('appintment_date')}

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
