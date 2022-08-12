import React, {useState} from "react";
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
import {PatientCardMobile} from "@features/card/components/patientCardMobile";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";

// time slot data
const timeData = [
    {time: "8:30", disabled: false},
    {time: "8:45", disabled: false},
    {time: "9:00", disabled: false},
    {time: "9:15", disabled: false},
    {time: "9:30", disabled: false},
    {time: "9:45", disabled: false},
    {time: "10:00", disabled: false},
    {time: "10:15", disabled: false},
];

function TimeSchedule() {
    const {data: session, status} = useSession();
    const {config} = useAppSelector(agendaSelector);
    console.log(config);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [reason, setReason] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [date, setDate] = React.useState<Date | null>(null);
    const [time, setTime] = React.useState("");
    const [radio, setRadio] = React.useState("");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {data: httpProfessionalResponse, error: errorHttpProfessional} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${config?.uuid}/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    // handleChange for select
    const onChangeReason = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
    };

    const onChangeLocation = (event: SelectChangeEvent) => {
        setLocation(event.target.value as string);
    };

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    if (errorHttpConsultReason) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];
    const locations = config?.locations;

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
                        onChange={onChangeReason}
                        sx={{
                            "& .MuiSelect-select svg": {
                                display: "none",
                            },
                        }}
                    >
                        {reasons?.map((consultationReason) => (
                            <MenuItem value={consultationReason.uuid} key={consultationReason.uuid}>
                                <FiberManualRecordIcon
                                    fontSize="small"
                                    sx={{mr: 1, color: consultationReason.color}}
                                />
                                {consultationReason.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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

                {location && (
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
                                        onChange={(v: string) => setRadio(v)}
                                        value={radio}
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
                            onChange={(newDate: Date) => setDate(newDate)}
                            value={date}
                            loading={!radio}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography variant="body1" color="text.primary" my={2}>
                            {t("stepper-1.time-message")}
                        </Typography>
                        <TimeSlot
                            loading={!date}
                            data={timeData}
                            limit={16}
                            onChange={(newTime: string) => setTime(newTime)}
                            value={time}
                            seeMore
                            seeMoreText={t("stepper-1.see-more")}
                        />
                    </Grid>
                </Grid>

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
                ))}
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
                    onClick={() => dispatch(setStepperIndex(0))}
                >
                    {t("back")}
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={!time}
                    onClick={() => dispatch(setStepperIndex(2))}
                >
                    {t("next")}
                </Button>
            </Paper>
        </div>
    );
}

export default TimeSchedule;
