import React, {useCallback, useEffect, useRef, useState} from "react";
import {SelectChangeEvent} from "@mui/material/Select";
import {useTranslation} from "next-i18next";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, CalendarPickers, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import moment from "moment-timezone";
import {
    EventType,
    appointmentSelector, setAppointmentDate,
    setAppointmentDuration, setAppointmentMotif, setAppointmentRecurringDates
} from "@features/tabPanel";
import {TimeSlot} from "@features/timeSlot";
import {PatientCardMobile} from "@features/card";
import {
    Autocomplete,
    DialogActions, Divider,
    IconButton,
    LinearProgress,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {AnimatePresence, motion} from "framer-motion";
import {PickersActionBarProps, TimePicker} from '@mui/x-date-pickers';
import CloseIcon from "@mui/icons-material/Close";
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CircularProgress from '@mui/material/CircularProgress';
import {dashLayoutSelector} from "@features/base";
import {ConditionalWrapper, useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import useHorsWorkDays from "@lib/hooks/useHorsWorkDays";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import RootStyled from "./overrides/rootStyle";

function ActionList(props: PickersActionBarProps & {
    customTime: Date | null,
    t: any,
    changeDateRef: any,
    setChangeTime: any,
    onTimeSlotChange: any
}) {
    const {customTime, t, setChangeTime, changeDateRef, onTimeSlotChange, className} = props;

    return (
        // Propagate the className such that CSS selectors can be applied
        <DialogActions className={className}>
            <Button
                size={"small"}
                disabled={!customTime}
                onClick={() => {
                    changeDateRef.current = false;
                    setChangeTime(false);
                    onTimeSlotChange(moment(customTime).format("HH:mm"));
                }}
                startIcon={<ScheduleRoundedIcon/>}>
                {t("stepper-1.confirm-time")}
            </Button>
            <Button
                size={"small"}
                color={"black"}
                onClick={() => {
                    changeDateRef.current = false;
                    setChangeTime(false);
                }}
                startIcon={<CloseIcon/>}>
                {t("stepper-1.cancel-time")}
            </Button>
        </DialogActions>
    );
}

function TimeSchedule({...props}) {
    const {onNext, onBack, select, withoutDateTime = false} = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const bottomRef = useRef(null);
    const moreDateRef = useRef(false);
    const changeDateRef = useRef(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medical_professional} = useMedicalProfessionalSuffix();
    const {current: disabledDay} = useHorsWorkDays();

    const {t, ready} = useTranslation("agenda", {keyPrefix: "steppers"});
    const {config: agendaConfig, currentStepper} = useAppSelector(agendaSelector);
    const {
        motif,
        date: selectedDate,
        duration: initDuration, recurringDates: initRecurringDates, type
    } = useAppSelector(appointmentSelector);

    const {medicalEntityHasUser, appointmentTypes} = useAppSelector(dashLayoutSelector);
    const selectedAppointmentType = appointmentTypes?.find((item) => item.uuid === type)

    const [selectedReasons, setSelectedReasons] = useState<string[]>(motif);
    const [duration, setDuration] = useState(initDuration);
    const [durations] = useState([15, 20, 25, 30, 35, 40, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240]);
    const [location, setLocation] = useState("");
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);
    const [recurringDates, setRecurringDates] = useState<RecurringDateModel[]>(initRecurringDates);
    const [date, setDate] = useState<Date | null>(selectedDate);
    const [loading, setLoading] = useState(false);
    const [loadingReq, setLoadingReq] = useState(false);
    const [moreDate, setMoreDate] = useState(moreDateRef.current);
    const [changeTime, setChangeTime] = useState(changeDateRef.current);
    const [timeSlotActive, setTimeSlotActive] = useState<boolean>(true)
    const [time, setTime] = useState("");
    const [limit, setLimit] = useState(50);
    const [timeAvailable, setTimeAvailable] = useState(false);
    const [customTime, setCustomTime] = useState<Date | null>(null);
    const [openTime, setOpenTime] = useState(initRecurringDates.length === 0);
    const [selectTime, setSelectTime] = useState("time-slot")
    const {
        data: httpConsultReasonResponse,
        mutate: mutateReasonsData
    } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/consultation-reasons/${router.locale}?sort=true`
    } : null, ReactQueryNoValidateConfig);

    const {trigger: triggerSlots} = useRequestQueryMutation("/agenda/slots");
    const {trigger: triggerAddReason} = useRequestQueryMutation("/agenda/motif/add");

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[] ?? [];

    const onTimeAvailable = useCallback((slots: TimeSlotModel[], time: string) => {
        return slots.find((item: TimeSlotModel) => item.start === time);
    }, []);

    const handleClickTime = () => {
        setOpenTime(!openTime);
    }

    const handleChangeTime = (event: React.SyntheticEvent, newValue: string) => {
        setSelectTime(newValue);
    };

    const getSlots = useCallback((date: Date, duration: string, timeSlot: string) => {
        setLoading(true);
        medicalEntityHasUser && triggerSlots({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agendaConfig?.uuid}/slots?day=${moment(date).format('DD-MM-YYYY')}&duration=${duration}`
        }, {
            onSuccess: (result) => {
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
            }
        });
    }, [triggerSlots, medical_professional, agendaConfig?.uuid, session?.accessToken]) // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeReason = (reasons: ConsultationReasonModel[]) => {
        const reasonsUuid = reasons.map(reason => reason.uuid);
        setSelectedReasons(reasonsUuid);
        dispatch(setAppointmentMotif(reasonsUuid));

        if (reasons.length > 0) {
            dispatch(setAppointmentDuration(reasons[0].duration as any));
            setDuration(reasons[0].duration as any);
        }

        if (date && medical_professional?.uuid && reasons.length > 0) {
            setTime(moment(date).format('HH:mm'));
            getSlots(date, reasons[0]?.duration as any, moment(date).format('HH:mm'));
        }
    };

    const onChangeDuration = (event: SelectChangeEvent) => {
        dispatch(setAppointmentDuration(event.target.value as string));
        setDuration(event.target.value as string);
    };

    const onChangeDatepicker = async (date: Date) => {
        setDate(date);
    };

    const onMenuActions = (recurringDate: RecurringDateModel, action: string, index: number) => {
        switch (action) {
            case "onRemove":
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
        return (h !== 0 ? `${h} ${t("stepper-1.duration.hours")}` : "") +
            (m !== 0 ? `${h !== 0 ? ',' : ""} ${m} ${t("stepper-1.duration.minutes")}` : "");
    }

    const onNextStep = () => {
        const dateTime = `${moment(date).format('DD-MM-YYYY')} ${time}`;
        dispatch(setAppointmentDate(moment(dateTime, 'DD-MM-YYYY HH:mm').toDate()));
        dispatch(setStepperIndex(2));
        onNext(2);
    }

    const onTimeSlotChange = (newTime: string) => {
        const newDateFormat = date?.toLocaleDateString('en-GB');
        const newDate = moment(`${newDateFormat} ${newTime}`, "DD/MM/YYYY HH:mm").toDate();

        dispatch(setAppointmentDate(newDate));
        const updatedRecurringDates = [{
            id: `${newDateFormat}--${newTime}`,
            time: newTime,
            date: newDateFormat,
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
        params.append("isEnabled", "true");
        params.append("translations", JSON.stringify({
            [router.locale as string]: name
        }));

        medicalEntityHasUser && triggerAddReason({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/consultation-reasons/${router.locale}`,
            data: params
        }, {
            onSuccess: () => mutateReasonsData().then((result: any) => {
                const reasonsUpdated = (result?.data as HttpResponse)?.data?.data as ConsultationReasonModel[];
                onChangeReason([...reasons.filter(reason => selectedReasons.includes(reason.uuid)), reasonsUpdated[0]]);
                setLoadingReq(false);
            })
        });
    }

    useEffect(() => {
        if (date && medical_professional?.uuid) {
            setTime(moment(selectedDate).format('HH:mm'));
            if (duration !== "") {
                getSlots(date, duration as string, moment(selectedDate).format('HH:mm'));
            }
        }
    }, [date, duration, getSlots]); // eslint-disable-line react-hooks/exhaustive-deps
    console.log('withoutDateTime', withoutDateTime, select, timeSlotActive)
    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <RootStyled>
            <LinearProgress sx={{
                visibility: !medical_professional ? "visible" : "hidden"
            }} color="warning"/>

            <ConditionalWrapper
                condition={select}
                wrapper={(children: any) =>
                    <Stack>
                        {children}
                    </Stack>
                }>
                <Stack className="inner-section">
                    {!select && <Typography variant="h6" color="text.primary">
                        {t("stepper-1.title")}
                    </Typography>}

                    {((recurringDates.length === 0 || moreDate) && !withoutDateTime) &&
                        <Grid container spacing={1} sx={{height: "auto"}}>
                            {!withoutDateTime && <Grid item md={6} xs={12}>
                                <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                                    {t("stepper-1.visit-type")}
                                </Typography>
                                <EventType select defaultType={0}/>
                            </Grid>}
                            <Grid item md={!withoutDateTime ? 6 : 12} xs={12}>
                                <Typography variant="body1" color="text.primary" mt={withoutDateTime ? 1 : 3}
                                            mb={1}>
                                    {t("stepper-1.reason-consultation")}
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Autocomplete
                                        id={"select-reason"}
                                        disabled={!reasons}
                                        multiple
                                        autoHighlight
                                        freeSolo
                                        disableClearable
                                        size="small"
                                        value={reasons && selectedReasons.length > 0 ? reasons.filter(motif => selectedReasons.includes(motif.uuid)) : []}
                                        onChange={(e, newValue: any) => {
                                            e.stopPropagation();
                                            const addReason = newValue.find((val: any) => Object.keys(val).includes("inputValue"))
                                            if (addReason) {
                                                // Create a new value from the user input
                                                addNewReason(addReason.inputValue);
                                            } else {
                                                onChangeReason(newValue);
                                            }
                                        }}
                                        filterOptions={(options, params) => {
                                            const {inputValue} = params;
                                            const filtered = options.filter(option => [option.name?.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue.toLowerCase() === option.name?.toLowerCase());
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push({
                                                    inputValue,
                                                    name: `${t('stepper-1.add_reason')} "${inputValue}"`,
                                                });
                                            }
                                            return filtered;
                                        }}
                                        sx={{color: "text.secondary"}}
                                        options={reasons ? reasons.filter(item => item.isEnabled) : []}
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
                                            <Stack key={option.uuid ? option.uuid : "-1"}>
                                                {!option.uuid && <Divider/>}
                                                <MenuItem
                                                    {...props}
                                                    {...(!option.uuid && {sx: {fontWeight: "bold"}})}
                                                    value={option.uuid}>
                                                    {!option.uuid && <AddOutlinedIcon/>}
                                                    {option.name}
                                                </MenuItem>
                                            </Stack>
                                        )}
                                        renderInput={params => <TextField color={"info"}
                                                                          {...params}
                                                                          InputProps={{
                                                                              ...params.InputProps,
                                                                              endAdornment: (
                                                                                  <React.Fragment>
                                                                                      {loadingReq ?
                                                                                          <CircularProgress
                                                                                              color="inherit"
                                                                                              size={20}/> : null}
                                                                                      {params.InputProps.endAdornment}
                                                                                  </React.Fragment>
                                                                              ),
                                                                          }}
                                                                          placeholder={t("stepper-1.reason-consultation-placeholder")}
                                                                          sx={{
                                                                              paddingLeft: 0,
                                                                              ".MuiInputBase-root": {minHeight: 42}
                                                                          }}
                                                                          variant="outlined" fullWidth/>}/>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <Typography color="grey.500" mt={1} variant="body1" mb={1}>
                                    {t("stepper-1.date")}
                                </Typography>
                                <CalendarPickers
                                    className="rdv-date-picker"
                                    renderDay
                                    defaultValue={(location) ? date : null}
                                    onDateChange={(newDate: Date) => onChangeDatepicker(newDate)}
                                    shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday() + 1)}
                                />
                            </Grid>
                            <Grid
                                item
                                md={6} xs={12}>
                                <Stack direction={"row"} alignItems={"center"}
                                       justifyContent={"space-between"} mt="-1px">
                                    <Typography variant="body1" align={"center"} color="grey.500">
                                        {t("stepper-1.time")}
                                    </Typography>

                                    {/* <IconButton
                                            sx={{ mt: -.5 }}
                                            size="small"
                                            disabled={!date}
                                            color="primary"
                                            onClick={() => {
                                                changeDateRef.current = true;
                                                setChangeTime(true);
                                            }}>
                                            <IconUrl color={theme.palette.primary.main} path="ic-edit-patient" />
                                        </IconButton> */}
                                    <Switch className="custom-switch"
                                            checked={timeSlotActive}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setTimeSlotActive(event.target.checked);
                                            }}
                                    />
                                </Stack>
                                <Stack border={1} borderColor='divider' borderRadius={1} pb={.4} maxHeight={300}
                                       height={1}>
                                    <Tabs
                                        value={selectTime}
                                        onChange={handleChangeTime}
                                        sx={{
                                            borderBottom: 1, borderColor: 'divider',
                                            mb: 1.4
                                        }}>
                                        <Tab value="time-slot" label={t("stepper-1.time-slot")}/>
                                        <Tab value="time-picker" label={t("stepper-1.time-picker")}/>
                                    </Tabs>
                                    <AnimatePresence>
                                        {selectTime === "time-slot" &&
                                            <motion.div
                                                key={'slot'}
                                                style={{padding: '.5rem', overflow: 'scroll'}}
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                transition={{ease: "easeIn", duration: .2}}>
                                                {timeSlotActive ?
                                                    <TimeSlot
                                                        {...{t}}
                                                        sx={{width: 236, margin: "auto"}}
                                                        loading={!date || loading}
                                                        data={timeSlots}
                                                        limit={limit}
                                                        onChange={onTimeSlotChange}
                                                        OnShowMore={() => setLimit(limit * 2)}
                                                        value={time}
                                                        seeMore={limit < timeSlots.length}
                                                        seeMoreText={t("stepper-1.see-more")}
                                                    /> :
                                                    <Stack p={2} spacing={1.5} alignItems="center">
                                                        <IconUrl path="ic-filled-alarm-off"
                                                                 color={theme.palette.grey[500]} width={56}
                                                                 height={56}/>
                                                        <Typography variant="body1" fontWeight={600}
                                                                    color="grey.900">{t("stepper-1.time-slot-off")}</Typography>
                                                        <Typography textAlign='center'
                                                                    color="grey.400">{t("stepper-1.time-slot-off-desc")}</Typography>
                                                        <Button variant="contained"
                                                                size="small"
                                                                onClick={() => {
                                                                    setTimeSlotActive(true);
                                                                }}
                                                        >{t("stepper-1.turn-on")}</Button>
                                                    </Stack>
                                                }
                                            </motion.div>

                                        }
                                        {selectTime === "time-picker" &&
                                            <motion.div
                                                key={'picker'}
                                                style={{padding: 8, textAlign: "center"}}
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                transition={{ease: "easeIn", duration: .2}}>
                                                <TimePicker
                                                    {...(!isMobile && {orientation: "landscape"})}
                                                    className={"time-picker-schedule"}
                                                    ampmInClock={false}
                                                    ampm={false}
                                                    maxTime={new Date(0, 0, 0, 20, 0)}
                                                    minTime={new Date(0, 0, 0, 8)}
                                                    shouldDisableTime={(timeValue, clockType) => clockType === "minutes" && (timeValue.getMinutes() % 5 !== 0)}
                                                    value={customTime}
                                                    onChange={(newValue) => setCustomTime(newValue)}
                                                    slotProps={{
                                                        actionBar: {
                                                            customTime,
                                                            t,
                                                            setChangeTime,
                                                            changeDateRef,
                                                            onTimeSlotChange
                                                        } as any
                                                    }}
                                                    slots={{
                                                        actionBar: ActionList as any
                                                    }}
                                                />
                                            </motion.div>
                                        }

                                    </AnimatePresence>
                                </Stack>
                            </Grid>
                        </Grid>
                    }
                    <AnimatePresence>
                        {((timeAvailable || recurringDates.length > 0) && !withoutDateTime) &&
                            <motion.div
                                key="date-time"
                                {...(recurringDates.length > 0 && {
                                    style: {marginTop: 16}
                                })}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{ease: "easeIn", duration: .2}}>
                                {recurringDates.map((recurringDate, index) => (
                                    <PatientCardMobile
                                        t={t}
                                        onDeleteItem={() => {
                                            onMenuActions(recurringDate, "onRemove", index)
                                        }}
                                        onAction={(action: string) => onMenuActions(recurringDate, action, index)}
                                        button={
                                            <IconButton
                                                size="small">
                                                <IconUrl color={theme.palette.text.secondary} width={16} height={16}
                                                         path="ic-trash"/>
                                            </IconButton>
                                        }
                                        key={index.toString()} item={{...recurringDate, type: selectedAppointmentType}}
                                        size="small"/>
                                ))}
                                {recurringDates.length > 0 &&
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            moreDateRef.current = true;
                                            setMoreDate(true);
                                        }}
                                        startIcon={
                                            <IconUrl
                                                width={"14"}
                                                height={"14"}
                                                color={theme.palette.primary.main}
                                                path="ic-outline-add-square"/>}
                                        variant="text">{t("stepper-1.add-more-date")}</Button>}
                                <div ref={bottomRef}/>
                            </motion.div>

                        }
                    </AnimatePresence>
                </Stack>
            </ConditionalWrapper>


            {!select && <Paper
                sx={{
                    borderRadius: 0,
                    borderWidth: "0px",
                    textAlign: "right",
                }}
                className="action">
                <Button
                    size="medium"
                    variant="text-primary"
                    color="primary"
                    sx={{
                        mr: 1,
                    }}
                    onClick={() => onBack(currentStepper)}>
                    {t("back")}
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={recurringDates.length === 0}
                    onClick={onNextStep}>
                    {t("next")}
                </Button>
            </Paper>}
        </RootStyled>
    );
}

export default TimeSchedule;
