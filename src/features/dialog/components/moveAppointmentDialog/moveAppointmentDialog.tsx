import {AppointmentPatientCard} from "@features/card";
import {Box, Typography} from "@mui/material";
import {WeekDayPicker} from "@features/weekDayPicker";
import Grid from "@mui/material/Grid";
import {TimeSlot} from "@features/timeSlot";
import React, {useCallback, useEffect, useState} from "react";
import {useRequestMutation} from "@app/axios";
import moment from "moment";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useIsMountedRef} from "@app/hooks";

function MoveAppointmentDialog({...props}) {
    const {t, data} = props;
    const {data: session} = useSession();
    const isMounted = useIsMountedRef();

    const [date, setDate] = useState<Date>(data?.extendedProps.time);
    const [time, setTime] = useState(moment(data?.extendedProps.time).format("hh:mm"));
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);
    const [limit, setLimit] = useState(10);

    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {
        data: httpTimeSlotsResponse,
        trigger
    } = useRequestMutation(null, "/calendar/slots");

    const getSlots = useCallback((date: Date) => {
        trigger(agendaConfig ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}
            /locations/${agendaConfig?.locations[0].uuid}/professionals/
            ${medical_professional.uuid}?day=${moment(date).format('DD-MM-YYYY')}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null);
    }, [agendaConfig, medical_entity.uuid, medical_professional.uuid, session?.accessToken, trigger]);


    const weekTimeSlots = (httpTimeSlotsResponse as HttpResponse)?.data as WeekTimeSlotsModel[];

    useEffect(() => {
        if (isMounted.current) {
            getSlots(date);
        }
    }, [date, getSlots, isMounted]);

    useEffect(() => {
        if (weekTimeSlots) {
            const slots = weekTimeSlots.find(slot =>
                slot.date === moment(date).format("DD-MM-YYYY"))?.slots;
            if (slots) {
                setTimeSlots(slots);
            }
        }
    }, [date, weekTimeSlots]);

    return (
        <Box sx={{minHeight: 150}}>
            <AppointmentPatientCard data={data?.extendedProps}/>
            <Typography mt={4} mb={2}
                        sx={{
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: "16px",
                            lineHeight: "24px"
                        }}
                        variant="subtitle1">
                {t("dialogs.move-dialog.week-day-slot")}</Typography>
            <WeekDayPicker
                onChange={(v: any) => setDate(v)}
                date={data?.extendedProps.time}/>

            <Grid item md={6} xs={12}>
                <Typography variant="body1"
                            ml={14}
                            color="text.primary" my={2}>
                    {t("dialogs.move-dialog.time-message")}
                </Typography>
                <TimeSlot
                    loading={!date}
                    data={timeSlots}
                    limit={limit}
                    sx={{width: "60%", margin: "auto"}}
                    onChange={(newTime: string) => setTime(newTime)}
                    OnShowMore={() => setLimit(limit * 2)}
                    value={time}
                    seeMore
                    seeMoreText={t("dialogs.move-dialog.see-more")}
                />
            </Grid>
        </Box>
    )
}

export default MoveAppointmentDialog;
