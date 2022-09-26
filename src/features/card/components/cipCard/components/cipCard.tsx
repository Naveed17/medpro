import React, {useEffect, useMemo, useState} from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import {Label} from '@features/label';
import {IconButton, Stack, Typography, Box} from '@mui/material';
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {setTimer, timerSelector} from "@features/card";
import moment from "moment-timezone";
import {useRouter} from "next/router";

function CipCard() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {time: initTimer, isActive, isPaused, event} = useAppSelector(timerSelector);
    const [time, setTime] = useState<number>(initTimer);
    const timer = useMemo(() => {
        return [time, setTime];
    }, [time, setTime]);

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

    const handleStart = () => {
        dispatch(setTimer({isActive: true, isPaused: false}));
    };

    const handlePauseResume = () => {
        dispatch(setTimer({isPaused: !isPaused}));
    };

    const handleReset = () => {
        dispatch(setTimer({isActive: false, time: 0}));
    };

    const handleConsultation = () => {
        const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
        if (router.pathname !== "/dashboard/consultation/[uuid-consultation]") {
            router.replace(slugConsultation, slugConsultation, {locale: router.locale});
        }
    }

    return (
        <CipCardStyled onClick={handleConsultation}>
            <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0.7, md: 1.7}}>
                <IconButton size="small">
                    {isActive && !isPaused ? <PauseCircleFilledRoundedIcon/> : <PlayCircleRoundedIcon/>}
                </IconButton>
                <Typography className={"timer-text"} color="common.white" display={{xs: 'none', md: "block"}}>
                    {event?.extendedProps.patient.firstName} {event?.extendedProps.patient.lastName}
                </Typography>
                <Box className={'timer-card'}>
                    <Typography color="common.white" variant='caption'>
                        {moment().hour(0).minute(0).second(timer as unknown as number).format('HH : mm : ss')}
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
