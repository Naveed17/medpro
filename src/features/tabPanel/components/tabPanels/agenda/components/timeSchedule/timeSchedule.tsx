import React, {useCallback, useEffect, useRef, useState} from "react";
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
import {Autocomplete, IconButton, LinearProgress, Stack, TextField, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {AnimatePresence, motion} from "framer-motion";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, StaticTimePicker} from '@mui/x-date-pickers';
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';

function TimeSchedule({...props}) {
    const {onNext, onBack, select} = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const bottomRef = useRef(null);
    const moreDateRef = useRef(false);
    const changeDateRef = useRef(false);

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
    const [loadingReq, setLoadingReq] = useState(false);
    const [moreDate, setMoreDate] = useState(moreDateRef.current);
    const [changeTime, setChangeTime] = useState(changeDateRef.current);
    const [time, setTime] = useState("");
    const [limit, setLimit] = useState(16);
    const [timeAvailable, setTimeAvailable] = useState(false);
    const [customTime, setCustomTime] = useState<Date | null>(moment('2023-04-07').toDate());
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

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason, mutate: mutateReasonsData} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/consultation-reasons/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;

    const {data: httpSlotsResponse, trigger} = useRequestMutation(null, "/calendar/slots");

    const {trigger: triggerAddReason} = useRequestMutation(null, "/motif/add");

    const onTimeAvailable = useCallback((slots: TimeSlotModel[], time: string) => {
        return slots.find((item: TimeSlotModel) => item.start === time);
    }, []);

    const getSlots = useCallback((date: Date, duration: string, timeSlot: string) => {
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
                if (moment(selectedDate).isValid() && onTimeAvailable(slots, timeSlot) ||
                    !moment(selectedDate).isValid()) {
                    setTimeAvailable(true);
                } else {
                    if (recurringDates.find((item: RecurringDateModel) => item.time === timeSlot)) {
                        setRecurringDates([]);
                    }
                    setTimeAvailable(false);
                }
            }
            setLoading(false);
        });
    }, [trigger, medical_professional, medical_entity.uuid, agendaConfig?.uuid, agendaConfig?.locations, session?.accessToken]) // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeReason = (event: ConsultationReasonModel) => {
        const reason = event;
        const reasonUuid = event.uuid;
        setReason(reasonUuid);
        dispatch(setAppointmentMotif(reasonUuid));

        if (reason) {
            dispatch(setAppointmentDuration(reason.duration as any));
            setDuration(reason.duration as any);
        }

        if (date && medical_professional?.uuid) {
            setTime(moment(date).format('HH:mm'));
            getSlots(date, reason?.duration as any, moment(date).format('HH:mm'));
        }
    };

    const onChangeDuration = (event: SelectChangeEvent) => {
        dispatch(setAppointmentDuration(event.target.value as string));
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
                dispatch(setAppointmentRecurringDates([...updatedDates]));
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
        const dateTime = `${moment(date).format('DD-MM-YYYY')} ${time}`;
        dispatch(setAppointmentDate(moment(dateTime, 'DD-MM-YYYY HH:mm').toDate()));
        dispatch(setStepperIndex(2));
        onNext(2);
    }

    const onTimeSlotChange = (newTime: string) => {
        const newDate = moment(`${moment(date).format("DD-MM-YYYY")} ${newTime}`, "DD-MM-YYYY HH:mm").toDate();
        dispatch(setAppointmentDate(newDate));

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
        if (moreDate) {
            setTimeout(() => {
                (bottomRef.current as unknown as HTMLElement)?.scrollIntoView({behavior: 'smooth'});
            }, 300);
        }
    }

    const addNewReason = (name: string) => {
        setLoadingReq(true);
        const params = new FormData();
        params.append("color", "#0696D6");
        params.append("duration", "15");
        params.append("translations", JSON.stringify({
            fr: name
        }));

        triggerAddReason({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/consultation-reasons/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => mutateReasonsData().then((result: any) => {
            const {status} = result?.data;
            const reasonsUpdated = (result?.data as HttpResponse)?.data as ConsultationReasonModel[];
            if (status === "success") {
                onChangeReason(reasonsUpdated[0]);
            }
            setLoadingReq(false);
        }));
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
            setTime(moment(selectedDate).format('HH:mm'));
            if (duration !== "") {
                getSlots(date, duration as string, moment(selectedDate).format('HH:mm'));
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

    // @ts-ignore
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
                            <Autocomplete
                                id={"select-reason"}
                                disabled={!reasons}
                                autoHighlight
                                freeSolo
                                disableClearable
                                size="small"
                                value={reasons && reason.length > 0 ? reasons.find(motif => motif.uuid === reason) : ""}
                                onChange={(e, newValue: any) => {
                                    e.stopPropagation();
                                    if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        addNewReason(newValue.inputValue);
                                    } else {
                                        onChangeReason(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const {inputValue} = params;
                                    const filtered = options.filter(option => [option.name.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue.toLowerCase() === option.name.toLowerCase());
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            name: `${t('stepper-1.add_reason')} "${inputValue}"`,
                                        });
                                    }
                                    return filtered;
                                }}
                                sx={{color: "text.secondary"}}
                                options={reasons ? reasons : []}
                                loading={reasons?.length === 0}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.name;
                                }}
                                isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                renderOption={(props, option) => (
                                    <MenuItem
                                        {...props}
                                        value={option.uuid}
                                        key={option.uuid ? option.uuid : "-1"}>
                                        {option.name}
                                    </MenuItem>
                                )}
                                renderInput={params => <TextField color={"info"}
                                                                  {...params}
                                                                  InputProps={{
                                                                      ...params.InputProps,
                                                                      endAdornment: (
                                                                          <React.Fragment>
                                                                              {loadingReq ?
                                                                                  <CircularProgress color="inherit"
                                                                                                    size={20}/> : null}
                                                                              {params.InputProps.endAdornment}
                                                                          </React.Fragment>
                                                                      ),
                                                                  }}
                                                                  placeholder={t("stepper-1.reason-consultation-placeholder")}
                                                                  sx={{paddingLeft: 0}}
                                                                  variant="outlined" fullWidth/>}/>
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
                        <Grid container spacing={changeTime ? 3 : 6} sx={{height: "auto"}}>
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
                                {!changeTime &&
                                    <>
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
                                    </>
                                }

                                {changeTime ?
                                    <div>
                                        <Stack direction={"row"} sx={{
                                            position: "relative",
                                            float: "right",
                                            right: "0.5rem",
                                            marginBottom: "-3rem",
                                            marginTop: "1rem"
                                        }}>
                                            <IconButton
                                                onClick={() => {
                                                    changeDateRef.current = false;
                                                    setChangeTime(false);
                                                    onTimeSlotChange(moment(customTime).format("HH:mm"));
                                                }}
                                            >
                                                <DoneIcon/>
                                            </IconButton>

                                            <IconButton
                                                onClick={() => {
                                                    changeDateRef.current = false;
                                                    setChangeTime(false);
                                                }}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Stack>

                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <StaticTimePicker
                                                className={"time-picker-schedule"}
                                                ampmInClock={false}
                                                ampm={false}
                                                maxTime={new Date(0, 0, 0, 20, 0)}
                                                minTime={new Date(0, 0, 0, 8)}
                                                shouldDisableTime={(timeValue, clockType) => {
                                                    return clockType === "minutes" && (timeValue % 5 !== 0);
                                                }}
                                                displayStaticWrapperAs="mobile"
                                                value={customTime}
                                                onChange={(newValue) => {
                                                    setCustomTime(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>

                                    :
                                    <Button
                                        sx={{fontSize: 12, mt: 1}}
                                        onClick={() => {
                                            changeDateRef.current = true;
                                            setChangeTime(true);
                                        }}
                                        startIcon={
                                            <IconUrl
                                                width={"14"}
                                                height={"14"}
                                                color={theme.palette.primary.main}
                                                path="ic-edit"/>} variant="text">{t("stepper-1.change-time")}</Button>}
                            </Grid>
                        </Grid>
                    </>
                }

                {(timeAvailable || recurringDates.length > 0) &&
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
                                    onClick={() => {
                                        moreDateRef.current = true;
                                        setMoreDate(true);
                                    }}
                                    startIcon={
                                        <IconUrl
                                            width={"14"}
                                            height={"14"}
                                            color={theme.palette.primary.main}
                                            path="ic-plus"/>} variant="text">{t("stepper-1.add-more-date")}</Button>}
                            <div ref={bottomRef}/>
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
                    disabled={recurringDates.length === 0}
                    onClick={onNextStep}
                >
                    {t("next")}
                </Button>
            </Paper>}
        </div>
    );
}

export default TimeSchedule;
