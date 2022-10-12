import React, {useState} from "react";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useTranslation} from "next-i18next";
import {
    Box, Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography, useTheme
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {MobileTimePicker} from "@mui/x-date-pickers/MobileTimePicker";
import SortIcon from "@themes/overrides/icons/sortIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {
    appointmentSelector,
    resetAppointment,
    setAppointmentInstruction,
    setAppointmentSubmit
} from "@features/tabPanel";
import {useRequestMutation} from "@app/axios";
import moment from "moment-timezone";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {agendaSelector, openDrawer, setStepperIndex} from "@features/calendar";
import {SuccessCard} from "@features/card";

function Instruction({...props}) {
    const {onNext, onBack, OnAction} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();

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

    const [loading, setLoading] = useState<boolean>(false);
    const [description, setDescription] = useState(instruction.description);
    const [smsLang, setLang] = useState(instruction.smsLang);
    const [smsRappel, setSmsRappel] = useState(instruction.smsRappel);
    const [rappel, setRappel] = useState(instruction.rappel);
    const [timeRappel, setTimeRappel] = useState<Date>(instruction.timeRappel);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

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
        motif && form.append('consultation_reason_uuid', motif);
        form.append('title', `${patient?.lastName} ${patient?.firstName}`);
        form.append('patient_uuid', patient?.uuid as string);
        form.append('type', type);
        form.append('duration', duration as string);
        form.append('global_instructions', description);
        form.append('reminder', JSON.stringify([{
            "type": "1: email, 2: sms, 3: push",
            "time": moment(timeRappel).format('HH:mm'),
            "number_of_day": rappel,
            "reminder_language": smsLang,
            "reminder_message": smsLang
        }]));

        trigger({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/appointments/${router.locale}`,
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
        }
        OnAction(action, defEvent);
    }

    if (!ready) return <>loading translations...</>;

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
                                        title: t("show-patient")
                                    }, {
                                        icon: "ic-salle",
                                        action: "onWaitingRoom",
                                        variant: "contained",
                                        sx: {
                                            "& svg": {
                                                "& path": {fill: !isTodayAppointment() ? "white" : theme.palette.text.primary}
                                            },
                                        },
                                        title: t("waiting"),
                                        color: "warning",
                                        disabled: !isTodayAppointment()
                                    }
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
                            variant="body1"
                            color="text.primary"
                            fontWeight={500}
                            mt={4}
                            mb={1}
                            sx={{textTransform: "uppercase"}}
                        >
                            {t("stepper-3.reminder")}
                        </Typography>
                        <Stack flexDirection="row" alignItems="center" my={2}>
                            <Typography variant="body1" color="text.primary" minWidth={150}>
                                {t("stepper-3.sms-reminder")}
                            </Typography>
                            <FormControl fullWidth size="small">
                                <Select id="demo-simple-select" value={smsLang} onChange={handleLangChange}>
                                    <MenuItem value="fr">Francais</MenuItem>
                                    <MenuItem value="ar">Arabic</MenuItem>
                                    <MenuItem value="en">Anglais</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack
                            mt={1}
                            sx={{
                                flexDirection: {md: "row", xs: "column"},
                                alignItems: {md: "center", xs: "left"},
                            }}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked={smsRappel}/>}
                                    label={t("stepper-3.schedule")}
                                />
                            </FormGroup>
                            <Stack alignItems="center" flexDirection="row">
                                <FormControl size="small" sx={{minWidth: 130}}>
                                    <Select
                                        id="demo-simple-select"
                                        value={rappel}
                                        onChange={handleRappelChange}
                                    >
                                        <MenuItem value={"0"}>{t("stepper-3.day")} 0</MenuItem>
                                        <MenuItem value={"1"}>{t("stepper-3.day")} 1</MenuItem>
                                        <MenuItem value={"2"}>{t("stepper-3.day")} 2</MenuItem>
                                        <MenuItem value={"3"}>{t("stepper-3.day")} 3</MenuItem>
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
                            </Stack>
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
                            onClick={onBack}
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