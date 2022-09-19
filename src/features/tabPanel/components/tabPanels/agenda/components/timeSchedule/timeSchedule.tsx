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
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {TimeSlot} from "@features/timeSlot";
import {StaticDatePicker} from "@features/staticDatePicker";
import {PatientCardMobile} from "@features/card";
import {IconButton} from "@mui/material";

function TimeSchedule({...props}) {
    const {onNext, onBack} = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
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
    const [time, setTime] = useState("");
    const [limit, setLimit] = useState(16);

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {trigger} = useRequestMutation(null, "/calendar/slots");

    const getSlots = useCallback((date: Date, duration: string) => {
        setLoading(true);
        trigger(medical_professional ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/locations/${agendaConfig?.locations[0].uuid}/professionals/${medical_professional.uuid}?day=${moment(date).format('DD-MM-YYYY')}&duration=${duration}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null, {revalidate: false, populateCache: false}).then((result) => {
            const weekTimeSlots = (result?.data as HttpResponse)?.data as WeekTimeSlotsModel[];
            const slots = weekTimeSlots.find(slot =>
                slot.date === moment(date).format("DD-MM-YYYY"))?.slots;
            if (slots) {
                setTimeSlots(slots);
            }
            setLoading(false)
        });
    }, [trigger, medical_professional, medical_entity.uuid, agendaConfig?.uuid, agendaConfig?.locations, session?.accessToken])

    const onChangeReason = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
        const reason = reasons?.find(reason => event.target.value === reason.uuid);
        if (reason) {
            setDuration(reason.duration as any);
        }

        if (date) {
            setTime(moment(date).format('HH:mm'));
            getSlots(date, reason?.duration as any);
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
        const updatedRecurringDates = [...recurringDates, {
            id: `${moment(date).format("DD-MM-YYYY")}--${newTime}`,
            time: newTime,
            date: moment(date).format("DD-MM-YYYY"),
            status: "success"
        }].reduce(
            (unique: RecurringDateModel[], item) =>
                (unique.find(recurringDate => recurringDate.id === item.id) ? unique : [...unique, item]),
            [],
        );
        setRecurringDates(updatedRecurringDates);
        dispatch(setAppointmentRecurringDates(updatedRecurringDates));
        setTime(newTime);
    }

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];
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
        if (date) {
            setTime(moment(date).format('HH:mm'));
            if (duration !== "") {
                getSlots(date, duration as string);
            }
        }
    }, [date, duration, getSlots]);

    useEffect(() => {
        if (locations && locations.length === 1) {
            setLocation(locations[0].uuid)
        }
    }, [locations]);

    if (errorHttpConsultReason) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);


    return (
        <div>
            <Box className="inner-section">
                <Typography variant="h6" color="text.primary">
                    {t("stepper-1.title")}
                </Typography>

                <Grid container spacing={2}>
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
                                            {/*<FiberManualRecordIcon
                                        fontSize="small"
                                        sx={{
                                            color: motif?.color
                                        }}
                                    />*/}
                                            <Typography>{motif?.name}</Typography>
                                        </Box>

                                    )
                                }}
                            >
                                {reasons?.map((consultationReason) => (
                                    <MenuItem value={consultationReason.uuid} key={consultationReason.uuid}>
                                        {/*<FiberManualRecordIcon
                                    fontSize="small"
                                    sx={{
                                        border: .1,
                                        borderColor: 'divider',
                                        borderRadius: '50%',
                                        p: 0.05,
                                        mr: 1,
                                        color: consultationReason.color
                                    }}
                                />*/}
                                        {consultationReason.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                            {t("stepper-1.duration.title")}
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                disabled={!reason}
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

                {/*                {medical_professional && (
                    <Box>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight={500}
                            mt={5}
                            sx={{textTransform: "uppercase", fontWeight: 500}}
                        >
                            {t("stepper-1.practitioner")}
                        </Typography>
                        <Typography variant="body1" color="text.primary" my={1}>
                            {t("stepper-1.affect-des")}
                        </Typography>
                        <Grid container spacing={2}>
                            {Array.from({length: 2}).map((_, index) => (
                                <Grid key={index} item xs={12} lg={6}>
                                    <RadioTextImage
                                        name={`agenda-${index}`}
                                        image="/static/img/men.png"
                                        type="Dermatologue"
                                        onChange={(v: string) => setProfessional(v)}
                                        value={professional}
                                        fullWidth
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}*/}

                {/*{location && <Typography*/}
                {/*    variant="body1"*/}
                {/*    color="text.primary"*/}
                {/*    fontWeight={500}*/}
                {/*    mt={5}*/}
                {/*    mb={0.5}*/}
                {/*    sx={{textTransform: "uppercase", fontWeight: 500}}*/}
                {/*>*/}
                {/*    {t("stepper-1.time-slot")}*/}
                {/*</Typography>}*/}
                <Typography mt={3} variant="body1" {...(!location && {mt: 5})} color="text.primary" mb={1}>
                    {t("stepper-1.date-message")}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <StaticDatePicker
                            views={['day']}
                            onDateDisabled={(date: Date) => disabledDay.includes(moment(date).weekday())}
                            onChange={(newDate: Date) => onChangeDatepicker(newDate)}
                            value={(location || reason) ? date : null}
                            loading={!location || !reason}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1" align={"center"} color="text.primary" my={2}>
                            {t("stepper-1.time-message")}
                        </Typography>
                        <TimeSlot
                            sx={{width: 248, margin: "auto"}}
                            loading={!date || !reason || loading}
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

                {(reason && recurringDates.length > 0) &&
                    <>
                        <Typography variant="body1" color="text.primary" mb={1}>
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
                    </>
                }
            </Box>
            <Paper
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
                    onClick={onBack}
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
            </Paper>
        </div>
    );
}

export default TimeSchedule;
