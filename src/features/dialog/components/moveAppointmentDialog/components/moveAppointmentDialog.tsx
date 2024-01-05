import {Typography, useMediaQuery} from "@mui/material";
import {WeekDayPicker} from "@features/weekDayPicker";
import Grid from "@mui/material/Grid";
import {TimeSlot} from "@features/timeSlot";
import React, {useCallback, useEffect, useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {Moment} from "moment-timezone";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useIsMountedRef, useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {dialogMoveSelector, setLimit, setMoveDateTime} from "@features/dialog";
import {useTranslation} from "next-i18next";
import BoxStyled from "./overrides/boxStyled";
import {Theme} from "@mui/material/styles";
import {dashLayoutSelector} from "@features/base";

function MoveAppointmentDialog() {
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medical_professional} = useMedicalProfessionalSuffix();

    const {t} = useTranslation(['agenda', 'common']);
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {date: moveDialogDate, time: moveDialogTime, limit: initLimit, action} = useAppSelector(dialogMoveSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerSlots} = useRequestQueryMutation("/agenda/slots");

    const getSlots = useCallback(() => {
        setLoading(true);
        (medicalEntityHasUser && agendaConfig) && triggerSlots({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agendaConfig?.uuid}/locations/${agendaConfig?.locations[0]}/professionals/${medical_professional?.uuid}?day=${moveDialogDate?.format('DD-MM-YYYY')}`
        }, {
            onSuccess: (result) => {
                const weekTimeSlots = (result?.data as HttpResponse)?.data as WeekTimeSlotsModel[];
                const slots = weekTimeSlots.find(slot => slot.date === moveDialogDate?.format("DD-MM-YYYY"))?.slots;
                if (slots) {
                    setTimeSlots(slots);
                }
                setLoading(false)
            }
        });
    }, [agendaConfig, medical_entity.uuid, medical_professional?.uuid, moveDialogDate, session?.accessToken, triggerSlots]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isMounted.current && medical_professional?.uuid) {
            getSlots();
        }
    }, [getSlots, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDateChange = (type: string, newDate?: Moment, newTime?: string) => {
        dispatch(setMoveDateTime(type === 'date' ?
            {date: newDate, selected: true} : {time: newTime, selected: true}));
    }

    return (
        <BoxStyled>
            {/*<AppointmentPatientCard style={{width: "60%", margin: "1rem auto"}} data={data?.extendedProps}/>*/}
            <Typography mt={2} mb={2}
                        sx={{
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: "16px",
                            lineHeight: "24px"
                        }}
                        variant="subtitle1">
                {t(`dialogs.${action}-dialog.week-day-slot`, {ns: 'common'})}</Typography>
            <WeekDayPicker
                onChange={(v: any) => handleDateChange("date", v)}
                action={action}
                date={moveDialogDate}/>

            <Grid item md={6} xs={12}>
                <Typography variant="body1"
                            className={"header-section"}
                            {...(!isMobile && {ml: 14})}
                            color="text.primary" my={2}>
                    {t(`dialogs.${action}-dialog.time-message`, {ns: 'common'})}
                </Typography>
                <TimeSlot
                    {...{t, loading}}
                    prefixTranslation={"steppers."}
                    data={timeSlots}
                    limit={initLimit}
                    sx={{width: "60%", margin: "auto"}}
                    onChange={(time: string) => handleDateChange("time", undefined, time)}
                    OnShowMore={() => dispatch(setLimit(initLimit * 2))}
                    value={moveDialogTime}
                    seeMore={initLimit < timeSlots.length}
                    seeMoreText={t(`dialogs.${action}-dialog.see-more`, {ns: 'common'})}
                />
            </Grid>
        </BoxStyled>
    )
}

export default MoveAppointmentDialog;
