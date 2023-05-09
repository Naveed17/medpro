import {Typography, useMediaQuery} from "@mui/material";
import {WeekDayPicker} from "@features/weekDayPicker";
import Grid from "@mui/material/Grid";
import {TimeSlot} from "@features/timeSlot";
import React, {useCallback, useEffect, useState} from "react";
import {useRequest, useRequestMutation} from "@app/axios";
import moment, {Moment} from "moment-timezone";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useIsMountedRef, useUrlSuffix} from "@app/hooks";
import {dialogMoveSelector, setLimit, setMoveDateTime} from "@features/dialog";
import {useTranslation} from "next-i18next";
import BoxStyled from "./overrides/boxStyled";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";

function MoveAppointmentDialog() {
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const urlMedicalEntitySuffix = useUrlSuffix();

    const {t} = useTranslation(['agenda', 'common']);

    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {date: moveDialogDate, time: moveDialogTime, limit: initLimit, action} = useAppSelector(dialogMoveSelector);

    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;

    const {trigger} = useRequestMutation(null, "/calendar/slots");

    const getSlots = useCallback(() => {
        setLoading(true);
        trigger(agendaConfig ? {
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/locations/${agendaConfig?.locations[0].uuid}/professionals/${medical_professional.uuid}?day=${moveDialogDate?.format('DD-MM-YYYY')}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null).then((result) => {
            const weekTimeSlots = (result?.data as HttpResponse)?.data as WeekTimeSlotsModel[];
            const slots = weekTimeSlots.find(slot => slot.date === moveDialogDate?.format("DD-MM-YYYY"))?.slots;
            if (slots) {
                setTimeSlots(slots);
            }
            setLoading(false)
        });
    }, [agendaConfig, medical_entity.uuid, medical_professional?.uuid, moveDialogDate, session?.accessToken, trigger]); // eslint-disable-line react-hooks/exhaustive-deps

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
                    loading={loading}
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
