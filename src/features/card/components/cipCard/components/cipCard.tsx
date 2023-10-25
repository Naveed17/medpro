import React from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import {Label} from '@features/label';
import {IconButton, Stack, Typography, Box, AvatarGroup, Avatar} from '@mui/material';
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {capitalizeFirst, useTimer} from "@lib/hooks";
import {FlipDate} from "@features/FlipDate";
import IconUrl from "@themes/urlIcon";

function CipCard({...props}) {
    const {openPatientDialog} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {timer} = useTimer();

    const {event} = useAppSelector(timerSelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>;

    const handleConsultation = () => {
        const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
        if (router.asPath !== slugConsultation) {
            router.replace(slugConsultation, slugConsultation, {locale: router.locale});
        }
    }

    const openPatientDetail = () => {
        event?.extendedProps.patient?.uuid && openPatientDialog(event?.extendedProps.patient?.uuid);
    }

    return (
        <CipCardStyled
            onClick={!roles.includes('ROLE_SECRETARY') ? handleConsultation : openPatientDetail}>
            <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0.7, md: 1.7}}>
                <IconButton sx={{mr: 1}} size="small">
                    <IconUrl path={"Property 1=pause-hover"}/>
                </IconButton>
                <Typography className={"timer-text"} color="common.white" display={{xs: 'none', md: "block"}}>
                    {capitalizeFirst(`${event?.extendedProps.patient.firstName} ${event?.extendedProps.patient.lastName}`)}
                </Typography>

                <FlipDate value={timer.split(" : ").map(time => parseInt(time))}/>
                {(event?.extendedProps.type?.name || typeof event?.extendedProps.type === "string") &&
                    <Label color='warning' variant='filled' className='label'>
                        {event?.extendedProps.type?.name ??
                            (typeof event?.extendedProps.type === "string" ?
                                (event?.extendedProps.type === "Consultation" ? "En Consultation" : event?.extendedProps.type) : "")}
                    </Label>}
            </Stack>
        </CipCardStyled>
    )
}

export default CipCard
