import React, {useCallback, useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    CardContent, Checkbox, Divider,
    FormControl, FormControlLabel, FormGroup, Grid,
    IconButton, InputAdornment,
    Link,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import RootStyled from "./overrides/rootStyled";
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import CircularProgress from "@mui/material/CircularProgress";
import {configSelector, dashLayoutSelector} from "@features/base";
import {ConditionalWrapper, useMedicalEntitySuffix, filterReasonOptions, useInvalidateQueries} from "@lib/hooks";
import {debounce} from "lodash";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {MobileTimePicker} from "@mui/x-date-pickers/MobileTimePicker";
import SortIcon from "@themes/overrides/icons/sortIcon";
import moment from "moment-timezone";
import {LocaleFnsProvider} from "@lib/localization";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function AppointmentCard({...props}) {
    const {patientId = null, handleOnDataUpdated = null, onMoveAppointment = null, t, roles} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {appointmentTypes, medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {locale} = useAppSelector(configSelector);
    const {selectedEvent: appointment} = useAppSelector(agendaSelector);

    const [editConsultation, setConsultation] = useState(false);
    const [data, setData] = useState({
        uuid: appointment?.publicId
            ? appointment?.publicId
            : (appointment as any)?.id,
        date: moment(appointment?.extendedProps.time).format(
            "DD-MM-YYYY"
        ),
        time: moment(appointment?.extendedProps.time).format("HH:mm"),
        motif: appointment?.extendedProps.motif,
        status: appointment?.extendedProps.status,
        ...(appointment?.extendedProps?.type && {type: appointment?.extendedProps.type}),
        instruction: appointment?.extendedProps.instruction,
        reminder: appointment?.extendedProps.reminder
    });
    const [instruction, setInstruction] = useState("");
    const [reminder, setReminder] = useState({
        init: true,
        smsLang: "fr",
        rappel: "1",
        rappelType: "2",
        smsRappel: false,
        timeRappel: moment().toDate()
    });
    const [selectedReason, setSelectedReason] = useState<ConsultationReasonModel[]>([]);
    const [typeEvent, setTypeEvent] = useState("");
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

    const onEditConsultation = () => setConsultation(!editConsultation);

    const {
        data: httpConsultReasonResponse,
        isLoading: isConsultReasonLoading,
        mutate: mutateConsultReason
    } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medicalEntityHasUser && {variables: {query: '?sort=true'}})
    });

    const {trigger: triggerAddReason} = useRequestQueryMutation("/agenda/motif/add");
    const {trigger: updateAppointmentTrigger} = useRequestQueryMutation("/agenda/update/appointment/detail");

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data?.filter((item: ConsultationReasonModel) => item.isEnabled) ?? [];

    const updateDetails = useCallback((input: {
        attribute: string;
        value: any
    }) => {
        const form = new FormData();
        form.append("attribute", input.attribute);
        form.append("value", input.value as string);
        updateAppointmentTrigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${data?.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                if (handleOnDataUpdated) {
                    handleOnDataUpdated();
                } else {
                    medicalEntityHasUser && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/${router.locale}`]);
                }
            }
        });
    }, [agendaConfig?.uuid, data?.uuid, medicalEntityHasUser, invalidateQueries, handleOnDataUpdated, patientId, router.locale, updateAppointmentTrigger, urlMedicalEntitySuffix]);

    const handleReasonChange = (reasons: ConsultationReasonModel[]) => {
        updateDetails({attribute: "consultation_reason", value: reasons.map(reason => reason.uuid)});
        setSelectedReason(reasons);
    }

    const addNewReason = (name: string) => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append("color", "#0696D6");
        params.append("duration", "15");
        params.append("isEnabled", "true");
        params.append("translations", JSON.stringify({
            [router.locale as string]: name
        }));

        medicalEntityHasUser && triggerAddReason({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`,
            data: params
        }, {
            onSuccess: () => mutateConsultReason().then((result: any) => {
                const {status, data: reasonsUpdated} = result?.data?.data;
                if (status === "success") {
                    handleReasonChange([...selectedReason, reasonsUpdated[0]]);
                }
            }),
            onSettled: () => setLoadingRequest(false)
        });
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInstruction(event.target.value);
        updateDetails({attribute: "global_instructions", value: event.target.value});
    }

    const debouncedOnChange = debounce(handleOnChange, 1000);

    useEffect(() => {
        if (!reminder?.init) {
            updateDetails({
                attribute: "reminder",
                value: JSON.stringify(reminder?.smsRappel ? [{
                    "type": reminder?.rappelType,
                    "time": moment.utc(reminder?.timeRappel).format('HH:mm'),
                    "number_of_day": reminder?.rappel,
                    "reminder_language": reminder?.smsLang,
                    "reminder_message": reminder?.smsLang
                }] : [])
            });
            setReminder({
                ...reminder,
                init: true
            })
        }
    }, [reminder, updateDetails])

    useEffect(() => {
        const updatedData = {
            uuid: appointment?.publicId
                ? appointment?.publicId
                : (appointment as any)?.id,
            date: moment(appointment?.extendedProps.time).format(
                "DD-MM-YYYY"
            ),
            time: moment(appointment?.extendedProps.time).format("HH:mm"),
            motif: appointment?.extendedProps.motif,
            status: appointment?.extendedProps.status,
            ...(appointment?.extendedProps?.type && {type: appointment?.extendedProps.type}),
            instruction: appointment?.extendedProps.instruction ?? "",
            reminder: appointment?.extendedProps.reminder
        }
        updatedData.type?.uuid && setTypeEvent(updatedData.type.uuid);
        setTimeout(() => setSelectedReason(updatedData.motif));
        setTimeout(() => setInstruction(updatedData.instruction));
        setTimeout(() => setReminder({
            init: true,
            smsLang: updatedData.reminder?.length > 0 ? updatedData.reminder[0].reminderLanguage : "fr",
            rappel: updatedData.reminder?.length > 0 ? updatedData.reminder[0].numberOfDay : "1",
            rappelType: updatedData.reminder?.length > 0 ? updatedData.reminder[0].type : "2",
            smsRappel: updatedData.reminder?.length > 0,
            timeRappel: (updatedData.reminder?.length > 0 ? moment(`${updatedData.reminder[0].date} ${updatedData.reminder[0].time}`, 'DD-MM-YYYY HH:mm') : moment()).toDate()
        }));
        setTimeout(() => setData(updatedData));
    }, [appointment])

    return (
        <RootStyled>
            <CardContent>
                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Label
                        variant="filled"
                        sx={{
                            "& .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                                pl: 0,
                            },
                        }}
                        color={data?.status?.classColor}>
                        {data?.status?.icon}
                        <Typography
                            sx={{
                                fontSize: 10,
                                ml: ["WAITING_ROOM", "NOSHOW", "PAUSED"].includes(data?.status?.key)
                                    ? 0.5
                                    : 0,
                            }}>
                            {t(`appointment-status.${data?.status?.key}`)}
                        </Typography>
                    </Label>
                    {((!roles.includes("ROLE_SECRETARY") || (roles.includes("ROLE_SECRETARY") && !["FINISHED", "ON_GOING"].includes(data?.status?.key))) && !appointment?.extendedProps.patient?.isArchived) &&
                        <IconButton
                            size="small"
                            onClick={onEditConsultation}
                            className="btn-toggle">
                            <IconUrl path={editConsultation ? "ic-check" : "ic-duotone"}/>
                        </IconButton>}
                </Stack>
                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Box sx={{width: "100%"}}>
                        <List>
                            <ListItem sx={{ml: .8}}>
                                <Stack
                                    sx={{cursor: "pointer"}}
                                    direction="row" spacing={2} alignItems="center">
                                    <Typography fontWeight={400}>
                                        {t("appintment_date")} :
                                    </Typography>
                                    <ConditionalWrapper
                                        condition={onMoveAppointment && !appointment?.extendedProps.patient?.isArchived && (!roles.includes("ROLE_SECRETARY") || (roles.includes("ROLE_SECRETARY") && data?.status?.key !== "ON_GOING"))}
                                        wrapper={(children: any) => <Button
                                            onClick={onMoveAppointment}
                                            sx={{p: .5}}>{children}</Button>}>
                                        <Stack spacing={2} direction="row" alignItems="center">
                                            <Stack spacing={0.5} direction="row" alignItems="center">
                                                <IconUrl className="callander" path="ic-agenda-jour"/>
                                                <Typography className="time-slot">
                                                    {data?.date}
                                                </Typography>
                                            </Stack>
                                            <Stack spacing={0.5} direction="row" alignItems="center">
                                                <IconUrl className="time" path="setting/ic-time"/>
                                                <Typography className="date">{data?.time}</Typography>
                                            </Stack>
                                        </Stack>
                                    </ConditionalWrapper>
                                </Stack>
                            </ListItem>
                            {((data.type && !roles.includes("ROLE_SECRETARY")) ||
                                ((data.type && data?.type.icon !== "ic-control" ||
                                        data.status && data?.status.key !== "FINISHED") &&
                                    roles.includes("ROLE_SECRETARY"))) && (
                                <ListItem>
                                    {editConsultation ? (
                                        <>
                                            <Typography fontWeight={400}>
                                                {t("consultation_type")}
                                            </Typography>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    labelId="select-type"
                                                    id="select-type"
                                                    value={typeEvent}
                                                    displayEmpty
                                                    onChange={(event) => {
                                                        updateDetails({
                                                            attribute: "type",
                                                            value: event.target.value as string,
                                                        });
                                                        setTypeEvent(event.target.value as string);
                                                    }}
                                                    sx={{
                                                        "& .MuiSelect-select svg": {
                                                            position: "absolute",
                                                            border: 0.1,
                                                            borderColor: "divider",
                                                            borderRadius: "50%",
                                                            p: 0.05,
                                                        },
                                                        "& .MuiTypography-root": {
                                                            ml: 4,
                                                        },
                                                    }}
                                                    renderValue={(selected) => {
                                                        if (selected === null || selected.length === 0) {
                                                            return <em>{t("steppers.stepper-0.type-placeholder", {ns: "agenda"})}</em>;
                                                        }

                                                        const type = appointmentTypes?.find(
                                                            (type) => type.uuid === selected
                                                        );
                                                        return (
                                                            <Box sx={{display: "inline-flex"}}>
                                                                <FiberManualRecordIcon
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: type?.color,
                                                                    }}
                                                                />
                                                                <Typography>{type?.name}</Typography>
                                                            </Box>
                                                        );
                                                    }}>
                                                    {appointmentTypes?.map((type) => (
                                                        <MenuItem value={type.uuid} key={type.uuid}>
                                                            <FiberManualRecordIcon
                                                                fontSize="small"
                                                                sx={{
                                                                    border: 0.1,
                                                                    borderColor: "divider",
                                                                    borderRadius: "50%",
                                                                    p: 0.05,
                                                                    mr: 1,
                                                                    color: type.color,
                                                                }}
                                                            />
                                                            {type.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </>
                                    ) : (
                                        <Stack direction="row" spacing={2}>
                                            <Box sx={{display: "inline-flex"}}>
                                                <FiberManualRecordIcon
                                                    fontSize="small"
                                                    sx={{
                                                        border: 0.1,
                                                        borderColor: "divider",
                                                        borderRadius: "50%",
                                                        p: 0.05,
                                                        mr: 1,
                                                        color: data?.type?.color,
                                                    }}
                                                />
                                                <Typography>{data?.type?.name}</Typography>
                                            </Box>
                                            {selectedReason ? (
                                                <Typography>{selectedReason.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</Typography>
                                            ) : (
                                                <Link
                                                    onClick={() => setConsultation(true)}
                                                    sx={{cursor: "pointer"}}
                                                    underline="none">
                                                    {t("add_reason")}
                                                </Link>
                                            )}
                                        </Stack>
                                    )}
                                </ListItem>
                            )}
                            {editConsultation && <>
                                <ListItem>
                                    <Typography fontWeight={400}>
                                        {t("consultation_reson")}
                                    </Typography>
                                    <Autocomplete
                                        id={"motif"}
                                        multiple
                                        freeSolo
                                        fullWidth
                                        size="small"
                                        value={selectedReason}
                                        onChange={(e, newValue: any) => {
                                            e.stopPropagation();
                                            const addReason = newValue.find((val: any) => Object.keys(val).includes("inputValue"))
                                            console.log("addReason", addReason, newValue)
                                            if (addReason) {
                                                // Create a new value from the user input
                                                addNewReason(addReason.inputValue);
                                            } else if (typeof newValue[newValue.length - 1] === 'string') {
                                                // Create a new value from the user input
                                                addNewReason(newValue[newValue.length - 1]);
                                            } else {
                                                handleReasonChange(newValue);
                                            }
                                        }}
                                        filterOptions={(options, params) => filterReasonOptions(options, params, t)}
                                        sx={{color: "text.secondary"}}
                                        options={reasons}
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
                                        renderInput={params =>
                                            <TextField color={"info"}
                                                       {...params}
                                                       InputProps={{
                                                           ...params.InputProps,
                                                           endAdornment: (
                                                               <React.Fragment>
                                                                   {(loadingRequest || isConsultReasonLoading) ?
                                                                       <CircularProgress
                                                                           color="inherit"
                                                                           size={20}/> : null}
                                                                   {params.InputProps.endAdornment}
                                                               </React.Fragment>
                                                           ),
                                                       }}
                                                       placeholder={t("reason-consultation-placeholder")}
                                                       sx={{paddingLeft: 0}}
                                                       variant="outlined" fullWidth/>}/>
                                </ListItem>
                                <ListItem>
                                    <Typography fontWeight={400}>
                                        {t("insctruction")}
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <textarea
                                            rows={6}
                                            onChange={debouncedOnChange}
                                            defaultValue={instruction}/>
                                    </FormControl>
                                </ListItem>

                                <ListItem>
                                    <Grid container spacing={2} mb={1}>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Typography variant="body1" color="text.primary" mb={1}>
                                                {t("steppers.stepper-3.sms-reminder", {ns: "agenda"})}
                                            </Typography>
                                            <FormControl fullWidth size="small">
                                                <Select id="demo-simple-select"
                                                        value={reminder.smsLang}
                                                        onChange={event => {
                                                            setReminder({
                                                                ...reminder,
                                                                init: false,
                                                                smsLang: event.target.value as string
                                                            })
                                                        }}>
                                                    <MenuItem value="fr">{t("sms-languages.fr")}</MenuItem>
                                                    <MenuItem value="ar">{t("sms-languages.ar")}</MenuItem>
                                                    <MenuItem value="en">{t("sms-languages.en")}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Stack
                                        mt={1}
                                        direction={"column"}
                                        alignItems={"left"}
                                        sx={{width: "100%"}}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={reminder.smsRappel}
                                                        onChange={event => setReminder({
                                                            ...reminder,
                                                            init: false,
                                                            smsRappel: event.target.checked
                                                        })}/>}
                                                label={t("steppers.stepper-3.schedule", {ns: "agenda"})}
                                            />
                                        </FormGroup>
                                        {reminder.smsRappel &&
                                            <Stack alignItems="center" justifyContent={"space-between"} direction="row">
                                                <FormControl size="small" sx={{minWidth: 200}}>
                                                    <Select
                                                        id="demo-simple-select"
                                                        value={reminder.rappel}
                                                        onChange={event => setReminder({
                                                            ...reminder,
                                                            init: false,
                                                            rappel: event.target.value
                                                        })}>
                                                        <MenuItem
                                                            value={"0"}>{t("steppers.stepper-3.day", {ns: "agenda"})} 0</MenuItem>
                                                        <MenuItem
                                                            value={"1"}>{t("steppers.stepper-3.day", {ns: "agenda"})} -1</MenuItem>
                                                        <MenuItem
                                                            value={"2"}>{t("steppers.stepper-3.day", {ns: "agenda"})} -2</MenuItem>
                                                        <MenuItem
                                                            value={"3"}>{t("steppers.stepper-3.day", {ns: "agenda"})} -3</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <Typography variant="body1" color="text.primary" px={1.2} mt={0}>
                                                    {t("steppers.stepper-3.to", {ns: "agenda"})}
                                                </Typography>
                                                <LocalizationProvider
                                                    adapterLocale={LocaleFnsProvider(locale)}
                                                    dateAdapter={AdapterDateFns}>
                                                    <MobileTimePicker
                                                        ampm={false}
                                                        value={reminder.timeRappel}
                                                        onChange={(newValue) => {
                                                            setReminder({
                                                                ...reminder,
                                                                init: false,
                                                                timeRappel: newValue as Date
                                                            })
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
                                            </Stack>}
                                    </Stack>
                                </ListItem>
                            </>}
                        </List>
                    </Box>
                </Stack>
            </CardContent>
        </RootStyled>
    );
}

export default AppointmentCard;
