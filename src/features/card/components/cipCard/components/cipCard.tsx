import React, {useEffect, useState} from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import {Label} from '@features/label';
import {IconButton, Stack, Typography, Box} from '@mui/material';
import {useAppSelector} from "@app/redux/hooks";
import {timerSelector} from "@features/card";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

function CipCard() {
    const {data: session} = useSession();
    const router = useRouter();

    const {startTime: initTimer, isActive, isPaused, event} = useAppSelector(timerSelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>

    const [time, setTime] = useState<number>(moment().diff(moment(initTimer, "HH:mm"), "seconds"));

    useEffect(() => {
        let interval: any = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime(time + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused, time]);

    const handleConsultation = () => {
        const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
        if (router.asPath !== slugConsultation) {
            router.replace(slugConsultation, slugConsultation, {locale: router.locale});
        }
    }

    return (
        <CipCardStyled {...(!roles.includes('ROLE_SECRETARY') && {onClick: handleConsultation})}>
            <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0.7, md: 1.7}}>
                <IconButton size="small">
                    <PlayCircleRoundedIcon/>
                </IconButton>
                <Typography className={"timer-text"} color="common.white" display={{xs: 'none', md: "block"}}>
                    {event?.extendedProps.patient.firstName} {event?.extendedProps.patient.lastName}
                </Typography>
                <Box className={'timer-card'}>
                    <Typography color="common.white" variant='caption'>
                        {moment().hour(0).minute(0).second(moment().diff(moment(initTimer, "HH:mm"), "seconds") as unknown as number).format('HH : mm : ss')}
                    </Typography>
                </Box>
                <Label color='warning' variant='filled' className='label'>
                    En consultation
                </Label>
            </Stack>
        </CipCardStyled>
    )
}

export default CipCard
