import {AppointmentPatientCard} from "@features/card";
import {Typography} from "@mui/material";
import {WeekDayPicker} from "@features/weekDayPicker";
import Grid from "@mui/material/Grid";
import {TimeSlot} from "@features/timeSlot";
import React, {useCallback, useEffect, useState} from "react";
import {useRequestMutation} from "@app/axios";
import moment from "moment-timezone";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useIsMountedRef} from "@app/hooks";
import {dialogMoveSelector, setLimit, setMoveDateTime} from "@features/dialog";
import {useTranslation} from "next-i18next";
import BoxStyled from "./overrides/boxStyled";

function MoveAppointmentDialog() {
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();

    const {t} = useTranslation(['agenda', 'common']);

    const {config: agendaConfig, selectedEvent: data} = useAppSelector(agendaSelector);
    const {date: moveDialogDate, time: moveDialogTime, limit: initLimit, action} = useAppSelector(dialogMoveSelector);

    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {
        trigger
    } = useRequestMutation(null, "/calendar/slots");

    const getSlots = useCallback(() => {
        setLoading(true);
        trigger(agendaConfig ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/locations/${agendaConfig?.locations[0].uuid}/professionals/${medical_professional.uuid}?day=${moment(moveDialogDate).format('DD-MM-YYYY')}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null).then((result) => {
            const weekTimeSlots = (result?.data as HttpResponse)?.data as WeekTimeSlotsModel[];
            const slots = weekTimeSlots.find(slot =>
                slot.date === moment(moveDialogDate).format("DD-MM-YYYY"))?.slots;
            if (slots) {
                setTimeSlots(slots);
            }
            setLoading(false)
        });
    }, [agendaConfig, medical_entity.uuid, medical_professional.uuid, moveDialogDate, session?.accessToken, trigger]);

    useEffect(() => {
        if (isMounted.current) {
            getSlots();
        }
    }, [getSlots, isMounted]);

    const handleDateChange = (type: string, newDate?: Date, newTime?: string) => {
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
                {t(`dialogs.${action}-dialog.week-day-slot`)}</Typography>
            <WeekDayPicker
                onChange={(v: any) => handleDateChange("date", v)}
                action={action}
                date={moveDialogDate}/>

            <Grid item md={6} xs={12}>
                <Typography variant="body1"
                            className={"header-section"}
                            ml={14}
                            color="text.primary" my={2}>
                    {t(`dialogs.${action}-dialog.time-message`)}
                </Typography>
                <TimeSlot
                    loading={loading}
                    data={timeSlots}
                    limit={initLimit}
                    sx={{width: "60%", margin: "auto"}}
                    onChange={(time: string) => handleDateChange("time", undefined, time)}
                    OnShowMore={() => dispatch(setLimit(initLimit * 2))}
                    value={moveDialogTime}
                    seeMore={initLimit < timeSlots.length}
                    seeMoreText={t(`dialogs.${action}-dialog.see-more`)}
                />
            </Grid>
        </BoxStyled>
    )
}

export default MoveAppointmentDialog;
