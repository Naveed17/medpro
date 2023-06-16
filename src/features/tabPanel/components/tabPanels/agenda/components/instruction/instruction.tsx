import React, {useState} from "react";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useTranslation} from "next-i18next";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {MobileTimePicker} from "@mui/x-date-pickers/MobileTimePicker";
import SortIcon from "@themes/overrides/icons/sortIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    appointmentSelector,
    resetAppointment,
    setAppointmentInstruction,
    setAppointmentSubmit
} from "@features/tabPanel";
import {useRequestMutation} from "@lib/axios";
import moment from "moment-timezone";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {agendaSelector, openDrawer, setStepperIndex} from "@features/calendar";
import {SuccessCard, timerSelector} from "@features/card";
import {LoadingScreen} from "@features/loadingScreen";
import {useMedicalEntitySuffix} from "@lib/hooks";

function Instruction({...props}) {
    const {onNext, onBack, OnAction, modal} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {
        motif,
        duration,
        patient,
        type,
        instruction,
        submitted,
        recurringDates
    } = useAppSelector(appointmentSelector);
    const {config: agendaConfig, currentStepper} = useAppSelector(agendaSelector);
    const {isActive} = useAppSelector(timerSelector);

    const [loading, setLoading] = useState<boolean>(false);
    const [description, setDescription] = useState(instruction.description);
    const [smsLang, setLang] = useState(instruction.smsLang);
    const [rappelType] = useState(instruction.rappelType);
    const [smsRappel, setSmsRappel] = useState(instruction.smsRappel);
    const [rappel, setRappel] = useState(instruction.rappel);
    const [timeRappel, setTimeRappel] = useState<Date>(instruction.timeRappel);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;

    const {trigger} = useRequestMutation(null, "/calendar/addPatient");

    const handleLangChange = (event: SelectChangeEvent) => {
        setLang(event.target.value as string);
    };

    const handleRappelChange = (event: SelectChangeEvent) => {
        setRappel(event.target.value as string);
    };

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    const onNextStep = () => {
        setLoading(true);
        dispatch(setAppointmentInstruction({
            rappel,
            rappelType,
            timeRappel,
            description,
            smsLang,
            smsRappel
        }));

        const form = new FormData();
        form.append('dates', JSON.stringify(recurringDates.map(recurringDate => ({
            "start_date": recurringDate.date,
            "start_time": recurringDate.time
        }))));
        motif && form.append('consultation_reasons', motif.toString());
        form.append('title', `${patient?.firstName} ${patient?.lastName}`);
        form.append('patient_uuid', patient?.uuid as string);
        form.append('type', type);
        form.append('duration', duration as string);
        form.append('global_instructions', description);
        {
            smsRappel &&
            form.append('reminder', JSON.stringify([{
                "type": rappelType,
                "time": moment.utc(timeRappel).format('HH:mm'),
                "number_of_day": rappel,
                "reminder_language": smsLang,
                "reminder_message": smsLang
            }]))
        }

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then((value: any) => {
            if (value?.data.status === 'success') {
                dispatch(setAppointmentSubmit({uuids: value?.data.data}));
                dispatch(setStepperIndex(0));
                onNext(currentStepper + 1);
            }
        });
    }

    const isTodayAppointment = () => {
        let hasAppointmentToday = false
        submitted?.recurringDates.map(recurring => {
            hasAppointmentToday = recurring.date === moment().format("DD-MM-YYYY");
            if (hasAppointmentToday) {
                return false
            }
        });
        return hasAppointmentToday;
    }

    const close = () => {
        dispatch(resetAppointment());
        dispatch(setStepperIndex(0));
        dispatch(openDrawer({type: "add", open: false}));
        if (OnAction) {
            OnAction("close")
        }
    }

    const handleActionClick = (action: string) => {
        let defEvent = null;
        switch (action) {
            case "onDetailPatient" :
                defEvent = {
                    extendedProps: {
                        patient: submitted?.patient
                    }
                };
                break;
            case "onWaitingRoom" :
                defEvent = {
                    publicId: submitted?.uuids[0]
                };
                break;
            case "onConsultationStart" :
                defEvent = {
                    publicId: submitted?.uuids[0],
                    extendedProps: {
                        patient: submitted?.patient
                    }
                };
                break;
        }
        OnAction(action, defEvent);
    }

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <div>
            <Box className="inner-section">
                {submitted ?
                    <>
                        <SuccessCard
                            onClickTextButton={handleActionClick}
                            data={{
                                title: t("added"),
                                description: t("added-description"),
                                buttons: [
                                    {
                                        variant: "text-primary",
                                        action: "onDetailPatient",
                                        title: t("show-patient"),
                                        sx: {
                                            display: modal && modal === "patient" ? "none" : "inline-flex",
                                        }
                                    },
                                    {
                                        icon: "ic-salle",
                                        action: "onWaitingRoom",
                                        variant: "contained",
                                        sx: {
                                            display: !isTodayAppointment() ? "none" : "inline-flex",
                                            "& svg": {
                                                "& path": {fill: !isTodayAppointment() ? "white" : theme.palette.text.primary}
                                            },
                                        },
                                        title: t("waiting"),
                                        color: "warning",
                                        disabled: !isTodayAppointment()
                                    },
                                    ...(!roles.includes('ROLE_SECRETARY') && !isActive ? [{
                                        icon: "play",
                                        action: "onConsultationStart",
                                        variant: "contained",
                                        sx: {
                                            display: modal && modal === "consultation" ? "none" : "inline-flex",
                                            "& svg": {
                                                "& path": {fill: theme.palette.text.primary}
                                            },
                                        },
                                        title: t("start_the_consultation"),
                                        color: "warning"
                                    }] : [])
                                ]
                            }}
                        />
                    </>
                    :
                    <>
                        <Typography variant="h6" color="text.primary">
                            {t("stepper-3.title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight={500}
                            mt={2}
                            mb={1}
                            sx={{textTransform: "uppercase"}}
                        >
                            {t("stepper-3.sub-title")}
                        </Typography>
                        <TextField
                            id="le-patient"
                            placeholder={t("stepper-3.instruction-placeholder")}
                            multiline
                            onChange={(event) => setDescription(event.target.value)}
                            value={description}
                            rows={4}
                            fullWidth
                        />
                        <Typography
                            variant="h6"
                            color="text.primary"
                            fontWeight={500}
                            mt={4}
                            mb={1}
                            sx={{textTransform: "uppercase"}}
                        >
                            {t("stepper-3.reminder")}
                        </Typography>
                        <Grid container spacing={2} mb={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography variant="body1" color="text.primary" mb={1}>
                                    {t("stepper-3.sms-reminder")}
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select id="demo-simple-select" value={smsLang} onChange={handleLangChange}>
                                        <MenuItem value="fr">Francais</MenuItem>
                                        <MenuItem value="ar">Arabic</MenuItem>
                                        <MenuItem value="en">Anglais</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={6} sm={12} xs={12}>
                                <Typography variant="body1" color="text.primary" mb={1}>
                                    {t("stepper-3.sms-type")}
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select id="demo-simple-select" value={rappelType}
                                            onChange={handleRappelTypeChange}>
                                        <MenuItem value="2">Sms</MenuItem>
                                        <MenuItem value="1">E-mail</MenuItem>
                                        <MenuItem value="3">Notification</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>*/}
                        </Grid>


                        <Stack
                            mt={1}
                            sx={{
                                flexDirection: {md: "row", xs: "column"},
                                alignItems: {md: "center", xs: "left"},
                            }}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={smsRappel}
                                            onChange={event => setSmsRappel(event.target.checked)}/>}
                                    label={t("stepper-3.schedule")}
                                />
                            </FormGroup>
                            {smsRappel && <Stack alignItems="center" flexDirection="row">
                                <FormControl size="small" sx={{minWidth: 130}}>
                                    <Select
                                        id="demo-simple-select"
                                        value={rappel}
                                        onChange={handleRappelChange}
                                    >
                                        <MenuItem value={"0"}>{t("stepper-3.day")} 0</MenuItem>
                                        <MenuItem value={"1"}>{t("stepper-3.day")} -1</MenuItem>
                                        <MenuItem value={"2"}>{t("stepper-3.day")} -2</MenuItem>
                                        <MenuItem value={"3"}>{t("stepper-3.day")} -3</MenuItem>
                                    </Select>
                                </FormControl>
                                <Typography variant="body1" color="text.primary" px={1.2} mt={0}>
                                    {t("stepper-3.to")}
                                </Typography>
                                <Box
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            pr: "6px!important",
                                        },
                                    }}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileTimePicker
                                            ampm={false}
                                            value={timeRappel}
                                            onChange={(newValue) => {
                                                setTimeRappel(newValue as Date);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SortIcon/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Stack>}
                        </Stack>
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
                {!submitted ?
                    <>
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
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            onClick={onNextStep}
                        >
                            {t("next")}
                        </Button>
                    </> :
                    <Button
                        size="medium"
                        variant={"contained"}
                        color="primary"
                        onClick={close}
                    >
                        {t("finish")}
                    </Button>
                }
            </Paper>
        </div>
    );
}

export default Instruction;
