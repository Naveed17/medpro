import React, {useEffect, useState} from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import {Label} from '@features/label';
import {IconButton, Stack, Typography, Box, Drawer} from '@mui/material';
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {timerSelector} from "@features/card";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {onOpenPatientDrawer} from "@features/table";
import {PatientDetail} from "@features/dialog";
import {configSelector} from "@features/base";
import PendingIcon from "@themes/overrides/icons/pendingIcon";

function CipCard() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {startTime: initTimer, isActive, isPaused, event} = useAppSelector(timerSelector);
    const {direction} = useAppSelector(configSelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>

    const [time, setTime] = useState<number>(moment().diff(moment(initTimer, "HH:mm"), "seconds"));
    const [patientDetailDrawer, setPatientDetailDrawer] = useState(false);

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

    const openPatientDetail = () => {
        event?.extendedProps.patient?.uuid && setPatientDetailDrawer(true);
    }

    return (
        <>
            <CipCardStyled
                onClick={!roles.includes('ROLE_SECRETARY') ? handleConsultation : openPatientDetail}>
                <Stack spacing={{xs: 1, md: 2}} direction='row' alignItems="center" px={{xs: 0.7, md: 1.7}}>
                    <IconButton size="small">
                        <PendingIcon/>
                    </IconButton>
                    <Typography className={"timer-text"} color="common.white" display={{xs: 'none', md: "block"}}>
                        {event?.extendedProps.patient.firstName} {event?.extendedProps.patient.lastName}
                    </Typography>
                    {process.env.NODE_ENV === 'development' && <Box className={'timer-card'}>
                        <Typography color="common.white" variant='caption'>
                            {moment().hour(0).minute(0).second(moment().diff(moment(initTimer, "HH:mm"), "seconds") as unknown as number).format('HH : mm : ss')}
                        </Typography>
                    </Box>}
                    <Label color='warning' variant='filled' className='label'>
                        En consultation
                    </Label>
                </Stack>
            </CipCardStyled>
            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}>
                <PatientDetail
                    {...{patientId: event?.extendedProps.patient?.uuid}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onConsultation={(event: string) => console.log(event)}
                    onAddAppointment={() => console.log("onAddAppointment")}
                />
            </Drawer>
        </>
    )
}

export default CipCard
