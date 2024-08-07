import React from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import {Stack, Typography, Avatar, useTheme, useMediaQuery, Fab} from '@mui/material';
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {capitalizeFirst, getMilliseconds, shortEnglishHumanizer, useTimer} from "@lib/hooks";
import {setDialog, setDialogAction} from "@features/topNavBar";
import {setSelectedEvent} from "@features/calendar";
import {MobileContainer} from "@lib/constants";
import {minMaxWindowSelector} from "@features/buttons";
import IconUrl from "@themes/urlIcon";
import Can from "@features/casl/can";

function CipCard({...props}) {
    const {openPatientDialog} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {timer} = useTimer();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    const {event} = useAppSelector(timerSelector);
    const {isWindowMax} = useAppSelector(minMaxWindowSelector);

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
            onClick={!roles.includes('ROLE_SECRETARY') && !isWindowMax ? handleConsultation : openPatientDetail}>
            <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0, md: 0}}>
                <Typography
                    className={"timer-text"}
                    fontWeight={800}
                    fontSize={16}
                    color="common.white"
                    display={{xs: 'none', md: "block"}}>
                    {capitalizeFirst(`${event?.extendedProps.patient.lastName} ${event?.extendedProps.patient.firstName}`)}
                </Typography>


                <Stack direction={"row"} alignItems={"center"}
                       spacing={1}  {...(isMobile && {className: "cip-avatar-mobile"})}>
                    <Avatar
                        alt="button avatar"
                        sx={{
                            height: 28,
                            width: "auto",
                            py: 2,
                            px: .5,
                            borderRadius: 3,
                            minWidth: isMobile ? "fit-content" : 80,
                            color: theme.palette.warning.contrastText,
                            bgcolor: theme.palette.warning.main
                        }}>
                        <Typography
                            sx={{width: "auto", minWidth: 20}}
                            ml={0}
                            fontSize={14}
                            fontWeight={600}>
                            {shortEnglishHumanizer(getMilliseconds(parseInt(timer.split(" : ")[0]), parseInt(timer.split(" : ")[1]), parseInt(timer.split(" : ")[2])), {
                                largest: 1,
                                round: true
                            })}
                        </Typography>
                    </Avatar>

                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__start"}>
                        <Fab color="default"
                             aria-label="finish consultation"
                             onClick={event => {
                                 event.stopPropagation();
                                 dispatch(setSelectedEvent(null));
                                 dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
                                 dispatch(setDialogAction("pause"));
                             }}
                             size={"small"}
                             sx={{
                                 boxShadow: "none",
                                 minHeight: 20,
                                 height: 36,
                                 width: 36
                             }}>
                            <IconUrl path={"ic-pause"} color={"white"}/>
                        </Fab>
                    </Can>
                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__start"}>
                        <Fab color="error"
                             aria-label="finish consultation"
                             onClick={event => {
                                 event.stopPropagation();
                                 dispatch(setSelectedEvent(null));
                                 dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
                                 dispatch(setDialogAction("finish"));
                             }}
                             size={"small"}
                             sx={{
                                 boxShadow: "none",
                                 minHeight: 20,
                                 height: 36,
                                 width: 36
                             }}>
                            <IconUrl path={"ic-stop-record"} color={"white"}/>
                        </Fab>
                    </Can>
                </Stack>
            </Stack>
        </CipCardStyled>
    )
}

export default CipCard
