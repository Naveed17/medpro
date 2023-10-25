import React from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import {Stack, Typography, Avatar, Badge, useTheme} from '@mui/material';
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {capitalizeFirst, useTimer} from "@lib/hooks";
import IconUrl from "@themes/urlIcon";

function CipCard({...props}) {
    const {openPatientDialog} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {timer} = useTimer();
    const theme = useTheme();

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
            disableRipple
            variant={"contained"}
            startIcon={
                <Badge
                    overlap="circular"
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    badgeContent={
                        <Avatar
                            alt="avatar"
                            sx={{
                                pt: .2,
                                width: 16,
                                height: 16,
                                borderRadius: 20,
                                border: `2px solid ${theme.palette.background.paper}`
                            }}>
                            <IconUrl width={14} height={16} path={"play-1"}/>
                        </Avatar>
                    }>
                    <Avatar className={"round-avatar"}
                            sx={{width: 30, height: 30}}
                            variant={"circular"}
                            src={`/static/icons/men-avatar.svg`}/>
                </Badge>
            }
            onClick={!roles.includes('ROLE_SECRETARY') ? handleConsultation : openPatientDetail}>
            <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0.7, md: 0}}>
                <Typography
                    className={"timer-text"}
                    fontWeight={500}
                    fontSize={16}
                    color="common.white"
                    display={{xs: 'none', md: "block"}}>
                    {capitalizeFirst(`${event?.extendedProps.patient.firstName} ${event?.extendedProps.patient.lastName}`)}
                </Typography>

                <Avatar
                    alt="Small avatar"
                    variant={"square"}
                    sx={{
                        width: 30,
                        height: 30,
                        mr: 3,
                        bgcolor: "white"
                    }}>
                    <IconUrl width={20} height={20} path={"ic-stop"}/>
                </Avatar>

                <Avatar
                    alt="Small avatar"
                    sx={{
                        height: 30,
                        pl: .5,
                        borderRadius: 1,
                        width: 120,
                        color: theme.palette.warning.contrastText,
                        bgcolor: theme.palette.warning.main
                    }}>
                    <IconUrl width={20} height={20} path={"ic-pause-mate"}/>
                    <Typography sx={{width: 80}} ml={1} fontSize={14} fontWeight={600}>{timer}</Typography>
                </Avatar>
            </Stack>
        </CipCardStyled>
    )
}

export default CipCard
