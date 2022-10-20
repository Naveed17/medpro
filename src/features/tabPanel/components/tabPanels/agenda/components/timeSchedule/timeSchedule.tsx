import React, {useCallback, useEffect, useState} from "react";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useTranslation} from "next-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, DayOfWeek, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import moment from "moment-timezone";
import {
    appointmentSelector, setAppointmentDate,
    setAppointmentDuration, setAppointmentMotif, setAppointmentRecurringDates
} from "@features/tabPanel";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import {TimeSlot} from "@features/timeSlot";
import {StaticDatePicker} from "@features/staticDatePicker";
import {PatientCardMobile} from "@features/card";
import {IconButton, LinearProgress, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {AnimatePresence, motion} from "framer-motion";

function TimeSchedule({...props}) {
    const {onNext, onBack, select} = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();

    const {config: agendaConfig, currentStepper} = useAppSelector(agendaSelector);
    const {
        motif,
        date: selectedDate,
        duration: initDuration, recurringDates: initRecurringDates
    } = useAppSelector(appointmentSelector);

    const [reason, setReason] = useState(motif);
    const [duration, setDuration] = useState(initDuration);
    const [durations, setDurations] = useState([15, 20, 25, 30, 35, 40, 45, 60, 75, 90, 105, 120]);
    const [location, setLocation] = useState("");
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);
    const [recurringDates, setRecurringDates] = useState<RecurringDateModel[]>(initRecurringDates);
    const [date, setDate] = useState<Date | null>(selectedDate);
    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [moreDate, setMoreDate] = useState(false);
    const [time, setTime] = useState("");
    const [limit, setLimit] = useState(16);
    const [timeAvailable, setTimeAvailable] = useState(false);

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;

    const {data: httpSlotsResponse, trigger} = useRequestMutation(null, "/calendar/slots");

    const onTimeAvailable = useCallback((slots: TimeSlotModel[], time: string) => {
        return slots.find((item: TimeSlotModel) => item.start === time);
    }, []);

    const getSlots = useCallback((date: Date, duration: string, time: string) => {
        setLoading(true);
        trigger(medical_professional ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/locations/${agendaConfig?.locations[0].uuid}/professionals/${medical_professional.uuid}?day=${moment(date).format('DD-MM-YYYY')}&duration=${duration}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null, TriggerWithoutValidation).then((result) => {
            const weekTimeSlots = (result?.data as HttpResponse)?.data as WeekTimeSlotsModel[];
            const slots = weekTimeSlots.find(slot => slot.date === moment(date).format("DD-MM-YYYY"))?.slots;
            if (slots) {
                setTimeSlots(slots);
                if (onTimeAvailable(slots, time)) {
                    setTimeAvailable(true);
                } else {
                    setRecurringDates([]);
                    setTimeAvailable(false);
                }
            }
            setLoading(false);
        });
    }, [trigger, medical_professional, medical_entity.uuid, agendaConfig?.uuid, agendaConfig?.locations, session?.accessToken]) // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeReason = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
        const reason = reasons?.find(reason => event.target.value === reason.uuid);
        if (reason) {
            setDuration(reason.duration as any);
        }

        if (date && medical_professional?.uuid) {
            setTime(moment(date).format('HH:mm'));
            getSlots(date, reason?.duration as any, moment(date).format('HH:mm'));
        }
    };

    const onChangeDuration = (event: SelectChangeEvent) => {
        setDuration(event.target.value as string);
    };

    const onChangeDatepicker = async (date: Date) => {
        setDate(date);
    };

    const onChangeLocation = (event: SelectChangeEvent) => {
        setLocation(event.target.value as string);
    };

    const onMenuActions = (recurringDate: RecurringDateModel, action: string, index: number) => {
        switch (action) {
            case "onRemove" :
                const updatedDates = [...recurringDates];
                updatedDates.splice(index, 1);
                setRecurringDates([...updatedDates]);
                break;
        }
    }

    const getTimeFromMinutes = (minutes: number) => {
        // do not include the first validation check if you want, for example,
        if (minutes >= 24 * 60 || minutes < 0) {
            throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
        }
        let h = minutes / 60 | 0,
            m = minutes % 60 | 0;
        return (h !== 0 ? `${h} ${t("stepper-1.duration.hours")}, ` : "") +
            (m !== 0 ? `${m} ${t("stepper-1.duration.minutes")}` : "");
    }

    const onNextStep = () => {
        dispatch(setAppointmentMotif(reason));
        dispatch(setAppointmentDuration(duration));
        const dateTime = `${moment(date).format('DD-MM-YYYY')} ${time}`;
        dispatch(setAppointmentDate(moment(dateTime, 'DD-MM-YYYY HH:mm').toDate()));
        dispatch(setStepperIndex(2));
        onNext(2);
    }

    const onTimeSlotChange = (newTime: string) => {
        const updatedRecurringDates = [{
            id: `${moment(date).format("DD-MM-YYYY")}--${newTime}`,
            time: newTime,
            date: moment(date).format("DD-MM-YYYY"),
            status: "success"
        }, ...recurringDates].reduce(
            (unique: RecurringDateModel[], item) =>
                (unique.find(recurringDate => recurringDate.id === item.id) ? unique : [...unique, item]),
            [],
        );
        setRecurringDates(updatedRecurringDates);
        dispatch(setAppointmentRecurringDates(updatedRecurringDates));
        setTime(newTime);
        setTimeAvailable(true);
    }

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];
    const slots = (httpSlotsResponse as HttpResponse)?.data as TimeSlotModel[];
    const locations = agendaConfig?.locations;
    const openingHours = locations?.find(local => local.uuid === location)?.openingHours[0].openingHours;

    useEffect(() => {
        const disabledDay: number[] = []
        openingHours && Object.entries(openingHours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [openingHours]);

    useEffect(() => {
        if (date && medical_professional?.uuid) {
            setTime(moment(date).format('HH:mm'));
            if (duration !== "") {
                getSlots(date, duration as string, moment(date).format('HH:mm'));
            }
        }
    }, [date, duration, getSlots]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (locations && locations.length === 1) {
            setLocation(locations[0].uuid)
        }
    }, [locations]);

    if (errorHttpConsultReason) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);

    return (
        <div>
            <LinearProgress sx={{
                visibility: !medical_professional ? "visible" : "hidden"
            }} color="warning"/>
            <Box className="inner-section">
                <Typography variant="h6" color="text.primary">
                    {t("stepper-1.title")}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                            {t("stepper-1.duration.title")}
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                labelId="select-duration"
                                id="select-duration"
                                onChange={onChangeDuration}
                                value={duration as string}
                                displayEmpty
                                renderValue={selected => {
                                    if (selected.length === 0) {
                                        return <em>{t("stepper-1.duration.placeholder")}</em>;
                                    }

                                    return <>{getTimeFromMinutes(parseInt(selected))}</>;
                                }}
                            >
                                {durations?.map((duration) => (
                                    <MenuItem value={duration} key={duration}>
                                        {getTimeFromMinutes(duration)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                            {t("stepper-1.reason-consultation")}
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                labelId="select-reason"
                                id="select-reason"
                                value={reason}
                                displayEmpty
                                onChange={onChangeReason}
                                renderValue={selected => {
                                    if (selected.length === 0) {
                                        return <em>{t("stepper-1.reason-consultation-placeholder")}</em>;
                                    }

                                    const motif = reasons?.find(reason => reason.uuid === selected);
                                    return (
                                        <Box sx={{display: "inline-flex"}}>
                                            <Typography>{motif?.name}</Typography>
                                        </Box>

                                    )
                                }}
                            >
                                {reasons?.map((consultationReason) => (
                                    <MenuItem value={consultationReason.uuid} key={consultationReason.uuid}>
                                        {consultationReason.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {(locations && locations.length > 1) && <>
                    <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                        {t("stepper-1.locations")}
                    </Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            labelId="select-location"
                            id="select-location"
                            disabled={reason === ''}
                            value={location}
                            onChange={onChangeLocation}
                            sx={{
                                "& .MuiSelect-select svg": {
                                    display: "none",
                                },
                            }}
                        >
                            {locations?.map((location) => (
                                <MenuItem value={location.uuid} key={location.uuid}>
                                    {location.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>}
                {(recurringDates.length === 0 || moreDate) &&
                    <>
                        <Typography mt={3} variant="body1" {...(!location && {mt: 5})} color="text.primary" mb={1}>
                            {t("stepper-1.date-message")}
                        </Typography>
                        <Grid container spacing={2} sx={{height: "auto"}}>
                            <Grid item md={6} xs={12}>
                                <StaticDatePicker
                                    views={['day']}
                                    onDateDisabled={(date: Date) => disabledDay.includes(moment(date).weekday())}
                                    onChange={(newDate: Date) => onChangeDatepicker(newDate)}
                                    value={(location) ? date : null}
                                    loading={!location || !medical_professional}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" align={"center"} color="text.primary" my={2}>
                                    {t("stepper-1.time-message")}
                                </Typography>
                                <TimeSlot
                                    sx={{width: 248, margin: "auto"}}
                                    loading={!date || loading}
                                    data={timeSlots}
                                    limit={limit}
                                    onChange={onTimeSlotChange}
                                    OnShowMore={() => setLimit(limit * 2)}
                                    value={time}
                                    seeMore={limit < timeSlots.length}
                                    seeMoreText={t("stepper-1.see-more")}
                                />
                            </Grid>
                        </Grid>
                    </>
                }

                {(timeAvailable && recurringDates.length > 0) &&
                    <AnimatePresence exitBeforeEnter>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{ease: "easeIn", duration: .2}}
                        >
                            <Typography variant="body1" color="text.primary" mb={1}
                                        {...(recurringDates.length > 0 && {mt: 2})}>
                                {t("stepper-1.selected-appointment")}
                            </Typography>
                            {recurringDates.map((recurringDate, index) => (
                                <PatientCardMobile
                                    onAction={(action: string) => onMenuActions(recurringDate, action, index)}
                                    button={
                                        <IconButton
                                            onClick={() => {
                                                onMenuActions(recurringDate, "onRemove", index)
                                            }}
                                            sx={{
                                                p: 0, "& svg": {
                                                    p: "2px"
                                                }
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon color={"error"}/>
                                        </IconButton>
                                    }
                                    key={Math.random()} item={recurringDate} size="small"/>
                            ))}
                            {!moreDate &&
                                <Button
                                    sx={{fontSize: 12}}
                                    onClick={() => setMoreDate(true)}
                                    startIcon={
                                        <IconUrl
                                            width={"14"}
                                            height={"14"}
                                            color={theme.palette.primary.main}
                                            path="ic-plus"/>} variant="text">{t("stepper-1.add-more-date")}</Button>}
                        </motion.div>
                    </AnimatePresence>

                }
            </Box>

            {!select && <Paper
                sx={{
                    borderRadius: 0,
                    borderWidth: "0px",
                    textAlign: "right",
                }}
                className="action"
            >
                <Button
                    size="medium"
                    variant="text-primary"
                    color="primary"
                    sx={{
                        mr: 1,
                    }}
                    onClick={() => onBack(currentStepper)}
                >
                    {t("back")}
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={!timeSlots.find(timeSlot => timeSlot.start === time) || recurringDates.length === 0}
                    onClick={onNextStep}
                >
                    {t("next")}
                </Button>
            </Paper>}
        </div>
    );
}

export default TimeSchedule;
