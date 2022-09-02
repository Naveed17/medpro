import React, {useEffect, useState} from "react";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useTranslation} from "next-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Grid from "@mui/material/Grid";
import {RadioTextImage} from "@features/radioTextImage";
import {StaticDatePicker} from "@features/staticDatePicker";
import {TimeSlot} from "@features/timeSlot";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import moment from "moment-timezone";
import {appointmentSelector, setAppointmentDate, setAppointmentMotif} from "@features/tabPanel";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";

const getDayOfWeek = (day: string) => {
    const days: { [key: string]: number } = {
        FRI: 5,
        MON: 1,
        SAT: 6,
        SUN: 7,
        THU: 3,
        TUE: 2,
        WED: 4
    }
    return days[day];
}

function TimeSchedule({...props}) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {onNext, onBack} = props;
    const {data: session, status} = useSession();
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {motif, date: selectedDate} = useAppSelector(appointmentSelector);

    const [reason, setReason] = useState(motif);
    const [location, setLocation] = useState("");
    const [professional, setProfessional] = useState("");
    const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([]);
    const [date, setDate] = useState<Date | null>(selectedDate);

    const [time, setTime] = useState("");
    const [limit, setLimit] = useState(16);

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpProfessionalResponse, error: errorHttpProfessional} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {
        data: httpTimeSlotsResponse,
        trigger
    } = useRequestMutation(null, "/calendar/slots");

    const getSlots = (date: Date) => {
        trigger(location ? {
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}
            /locations/${location}/professionals/${professional}?day=${moment(date).format('DD-MM-YYYY')}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null);
    }

    // handleChange for select
    const onChangeReason = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
        if (date) {
            getSlots(date);
            setTime(moment(date).format('hh:mm'));
        }
    };

    const onChangeDatepicker = async (date: Date) => {
        setDate(date);
        getSlots(date);
    };

    const onChangeLocation = (event: SelectChangeEvent) => {
        setLocation(event.target.value as string);
    };

    const onNextStep = () => {
        dispatch(setAppointmentMotif(reason));
        const dateTime = `${moment(date).format('DD-MM-YYYY')} ${time}`;
        dispatch(setAppointmentDate(moment(dateTime, 'DD-MM-YYYY HH:mm').toDate()));
        dispatch(setStepperIndex(2));
        onNext(2);
    }

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];
    const locations = agendaConfig?.locations;
    const professionals = (httpProfessionalResponse as HttpResponse)?.data as MedicalProfessionalModel[];
    const openingHours = locations?.find(local => local.uuid === location)?.openingHours[0].openingHours;
    const weekTimeSlots = (httpTimeSlotsResponse as HttpResponse)?.data as WeekTimeSlotsModel[];

    let disabledDay: number[] = [];
    openingHours && Object.entries(openingHours).filter((openingHours: any) => {
        if (!(openingHours[1].length > 0)) {
            disabledDay.push(getDayOfWeek(openingHours[0]));
        }
    })

    useEffect(() => {
        if (weekTimeSlots) {
            const slots = weekTimeSlots.find(slot =>
                slot.date === moment(date).format("DD-MM-YYYY"))?.slots;
            if (slots) {
                setTimeSlots(slots);
            }
        }
    }, [date, weekTimeSlots]);

    useEffect(() => {
        if (locations && locations.length === 1) {
            setLocation(locations[0].uuid)
        }
    }, [locations]);

    useEffect(() => {
        if (professionals && professionals.length === 1) {
            setProfessional(professionals[0].uuid)
        }
    }, [professionals]);


    if (errorHttpConsultReason) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);

    return (
        <div>
            <Box className="inner-section">
                <Typography variant="h6" color="text.primary">
                    {t("stepper-1.title")}
                </Typography>
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
                        sx={{
                            "& .MuiSelect-select svg": {
                                position: "absolute",
                                border: .1,
                                borderColor: 'divider',
                                borderRadius: '50%',
                                p: 0.05
                            },
                            "& .MuiTypography-root": {
                                ml: 3.5
                            }
                        }}
                        renderValue={selected => {
                            if (selected.length === 0) {
                                return <em>{t("stepper-1.reason-consultation-placeholder")}</em>;
                            }

                            const motif = reasons.find(reason => reason.uuid === selected);
                            return (
                                <Box sx={{display: "inline-flex"}}>
                                    <FiberManualRecordIcon
                                        fontSize="small"
                                        sx={{
                                            color: motif?.color
                                        }}
                                    />
                                    <Typography>{motif?.name}</Typography>
                                </Box>

                            )
                        }}
                    >
                        {reasons?.map((consultationReason) => (
                            <MenuItem value={consultationReason.uuid} key={consultationReason.uuid}>
                                <FiberManualRecordIcon
                                    fontSize="small"
                                    sx={{
                                        border: .1,
                                        borderColor: 'divider',
                                        borderRadius: '50%',
                                        p: 0.05,
                                        mr: 1,
                                        color: consultationReason.color
                                    }}
                                />
                                {consultationReason.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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

                {(professionals && professionals.length > 1) && (
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
                )}

                {location && <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={500}
                    mt={5}
                    mb={0.5}
                    sx={{textTransform: "uppercase", fontWeight: 500}}
                >
                    {t("stepper-1.time-slot")}
                </Typography>}
                <Typography variant="body1" {...(!location && {mt: 5})} color="text.primary" mb={1}>
                    {t("stepper-1.date-message")}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <StaticDatePicker
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
                            loading={!date}
                            data={timeSlots}
                            limit={limit}
                            onChange={(newTime: string) => setTime(newTime)}
                            OnShowMore={() => setLimit(limit * 2)}
                            value={time}
                            seeMore
                            seeMoreText={t("stepper-1.see-more")}
                        />
                    </Grid>
                </Grid>

                {/*
                <Typography variant="body1" color="text.primary" mt={2} mb={1}>
                    Selected meetings
                </Typography>
                {[
                    {
                        status: "warning",
                        date: "Fri April 10",
                        time: "14:20",
                    },
                    {
                        status: "warning",
                        date: "Fri April 10",
                        time: "14:20",
                    },
                ].map((item) => (
                    <PatientCardMobile key={Math.random()} item={item} size="small"/>
                ))}*/}
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
                    disabled={!time}
                    onClick={onNextStep}
                >
                    {t("next")}
                </Button>
            </Paper>
        </div>
    );
}

export default TimeSchedule;
