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

function MoveAppointmentDialog({...props}) {
    const {OnDateChange} = props;
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();

    const {t, ready} = useTranslation(['agenda', 'common']);

    const {config: agendaConfig, selectedEvent: data} = useAppSelector(agendaSelector);
    const {date: moveDialogDate, time: moveDialogTime, limit: initLimit} = useAppSelector(dialogMoveSelector);
    const [loading, setLoading] = useState(true);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {
        data: httpTimeSlotsResponse,
        trigger
    } = useRequestMutation(null, "/calendar/slots");

    const getSlots = useCallback(() => {
        trigger(agendaConfig ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}
            /locations/${agendaConfig?.locations[0].uuid}/professionals/
            ${medical_professional.uuid}?day=${moment(moveDialogDate).format('DD-MM-YYYY')}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null).then(() => setLoading(false));
    }, [agendaConfig, medical_entity.uuid, medical_professional.uuid, moveDialogDate, session?.accessToken, trigger]);

    const weekTimeSlots = (httpTimeSlotsResponse as HttpResponse)?.data as WeekTimeSlotsModel[];

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
                onChange={(v: any) => handleDateChange("date", v)}
                date={moveDialogDate}/>

            <Grid item md={6} xs={12}>
                <Typography variant="body1"
                            className={"header-section"}
                            ml={14}
                            color="text.primary" my={2}>
                    {t("dialogs.move-dialog.time-message")}
                </Typography>
                <TimeSlot
                    loading={loading}
                    data={weekTimeSlots?.find(slot =>
                        slot.date === moment(moveDialogDate).format("DD-MM-YYYY"))?.slots}
                    limit={initLimit}
                    sx={{width: "60%", margin: "auto"}}
                    onChange={(time: string) => handleDateChange("time", undefined, time)}
                    OnShowMore={() => dispatch(setLimit(initLimit * 2))}
                    value={moveDialogTime}
                    seeMore
                    seeMoreText={t("dialogs.move-dialog.see-more")}
                />
            </Grid>
        </BoxStyled>
    )
}

export default MoveAppointmentDialog;
