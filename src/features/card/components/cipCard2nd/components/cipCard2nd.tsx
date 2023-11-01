import React from 'react'
import CipCard2ndStyled from './overrides/cipCard2ndStyle'
import {Stack, Typography, Avatar, useTheme, Badge} from '@mui/material';
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {capitalizeFirst, getDiffDuration, getMilliseconds, useTimer} from "@lib/hooks";
import {setDialog} from "@features/topNavBar";
import {setSelectedEvent} from "@features/calendar";
import {batch} from "react-redux";
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
const humanizeDuration = require("humanize-duration");
import {humanizerConfig} from "@lib/constants";
import IconUrl from '@themes/urlIcon';
import { Label } from '@features/label';

const shortEnglishHumanizer = humanizeDuration.humanizer(humanizerConfig);

function CipCard2nd({...props}) {
    const {openPatientDialog} = props;
    const {data: session} = useSession();
    const router = useRouter();
     const {timer} = useTimer();
    const theme = useTheme();
    const dispatch = useAppDispatch();

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
        <Stack px={2}>
        <CipCard2ndStyled
            disableRipple
            variant={"contained"}
            onClick={!roles.includes('ROLE_SECRETARY') ? handleConsultation : openPatientDetail}
             startIcon={<Badge
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        badgeContent={
                                            <Avatar className='ic-avatar' alt="Small avatar" sx={{
                                                pt: .2,
                                                borderRadius: 20,
                                                border: `2px solid ${theme.palette.background.paper}`
                                            }}>
                                                <PlayCircleRoundedIcon/>
                                            </Avatar>
                                        }>
                                        <Avatar
                                        className='patient-avatar'
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 20,
                                                border: `2px solid ${theme.palette.background.paper}`
                                            }} variant={"circular"}
                                            src={`/static/icons/men-avatar.svg`}/>
                                    </Badge>}
            >
            <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0.7, md: 0}} width={1}>
                 <Stack alignItems='flex-start'>                      
                <Typography
                    
                    fontWeight={500}
                    fontSize={16}
                    color="common.white"
                    display={{xs: 'none', md: "block"}}>
                    {capitalizeFirst(`${event?.extendedProps.patient.firstName} ${event?.extendedProps.patient.lastName}`)}
                </Typography>
                <Label variant='filled' color='warning' sx={{px:1.5,fontWeight:600,minWidth:45}}>
{shortEnglishHumanizer(getMilliseconds(parseInt(timer.split(" : ")[0]), parseInt(timer.split(" : ")[1]), parseInt(timer.split(" : ")[2])), {largest: 1, round: true})}
                </Label>
                </Stack>     
                <Stack direction='row' alignItems='center' spacing={1} className='action-buttons'>
                    <Avatar
                    className='avatar-top'
                    alt="Small avatar"
                    variant={"square"}
                    src={'/static/icons/ic-stop.svg'}
                    onClick={event => {
                        event.stopPropagation();
                        batch(() => {
                            dispatch(setSelectedEvent(null));
                            dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
                        });
                    }}
                    sx={{
                        width: 30,
                        height: 30,

                        bgcolor: "white",
                        "& .MuiAvatar-img": {
                            width: 20,
                            height: 20
                        }
                    }}/>

                <Avatar
                className='avatar-top'
                    alt="button avatar"
                    onClick={event => {
                        event.stopPropagation();
                        batch(() => {
                            dispatch(setSelectedEvent(null));
                            dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
                        });
                    }}
                    sx={{
                        height: 30,
                        borderRadius: 1,
                        mr:"0 !important",
                        width: 100,
                        color: theme.palette.warning.contrastText,
                        bgcolor: theme.palette.warning.main
                    }}>
                    <Avatar
                        src={'/static/icons/ic-pause-mate.svg'}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 20
                        }}/>
                    
                </Avatar>
                </Stack>
               
            </Stack>
        </CipCard2ndStyled>
        </Stack>
    )
}

export default CipCard2nd
