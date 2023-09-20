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
import {ConditionalWrapper, useMedicalEntitySuffix, filterReasonOptions} from "@lib/hooks";
import {useSWRConfig} from "swr";
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
    const {data, patientId = null, onDataUpdated = null, onMoveAppointment = null, t, roles} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {mutate} = useSWRConfig();

    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {appointmentTypes, medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {locale} = useAppSelector(configSelector);

    const [editConsultation, setConsultation] = useState(false);
    const onEditConsultation = () => setConsultation(!editConsultation);

    const {data: httpConsultReasonResponse, mutate: mutateConsultReason} = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        variables: {query: "?sort=true"}
    });

    const {trigger: triggerAddReason} = useRequestQueryMutation("/agenda/motif/add");
    const {trigger: updateAppointmentTrigger} = useRequestQueryMutation("/agenda/update/appointment/detail");

    const [reason, setReason] = useState(data.motif);
    const [instruction, setInstruction] = useState(data.instruction);
    const [reminder, setReminder] = useState({
        init: true,
        smsLang: data.reminder?.length > 0 ? data.reminder[0].reminderLanguage : "fr",
        rappel: data.reminder?.length > 0 ? data.reminder[0].numberOfDay : "1",
        rappelType: data.reminder?.length > 0 ? data.reminder[0].type : "2",
        smsRappel: data.reminder?.length > 0,
        timeRappel: (data.reminder?.length > 0 ? moment(`${data.reminder[0].date} ${data.reminder[0].time}`, 'DD-MM-YYYY HH:mm') : moment()).toDate()
    });

    const [selectedReason, setSelectedReason] = useState(data?.motif ?? null);
    const [typeEvent, setTypeEvent] = useState(data.type?.uuid);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];

    const updateDetails = useCallback((input: { attribute: string; value: any }) => {
        const form = new FormData();
        form.append("attribute", input.attribute);
        form.append("value", input.value as string);
        updateAppointmentTrigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${data?.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                if (onDataUpdated) {
                    onDataUpdated();
                } else {
                    medicalEntityHasUser && mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/${router.locale}`);
                }
            }
        });
    }, [agendaConfig?.uuid, data?.uuid, medicalEntityHasUser, mutate, onDataUpdated, patientId, router.locale, updateAppointmentTrigger, urlMedicalEntitySuffix]);

    const handleReasonChange = (reasons: ConsultationReasonModel[]) => {
        updateDetails({attribute: "consultation_reason", value: reasons.map(reason => reason.uuid)});
        setReason(reasons);
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
                const {status} = result?.data;
                const reasonsUpdated = (result?.data as HttpResponse)?.data as ConsultationReasonModel[];
                if (status === "success") {
                    handleReasonChange([...reason, reasonsUpdated[0]]);
                }
                setLoadingRequest(false);
            })
        });
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInstruction(event.target.value);
        updateDetails({attribute: "global_instructions", value: event.target.value});
    }

    const debouncedOnChange = debounce(handleOnChange, 1000);

    useEffect(() => {
        if (!reminder.init) {
            updateDetails({
                attribute: "reminder",
                value: JSON.stringify(reminder.smsRappel ? [{
                    "type": reminder.rappelType,
                    "time": moment.utc(reminder.timeRappel).format('HH:mm'),
                    "number_of_day": reminder.rappel,
                    "reminder_language": reminder.smsLang,
                    "reminder_message": reminder.smsLang
                }] : [])
            });
            setReminder({
                ...reminder,
                init: true
            })
        }
    }, [reminder, updateDetails])

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
                                ml: ["WAITING_ROOM", "NOSHOW"].includes(data?.status?.key)
                                    ? 0.5
                                    : 0,
                            }}>
                            {t(`appointment-status.${data?.status?.key}`)}
                        </Typography>
                    </Label>
                    <IconButton

                        size="small"
                        onClick={onEditConsultation}
                        className="btn-toggle">
                        <IconUrl path={editConsultation ? "ic-check" : "ic-duotone"}/>
                    </IconButton>
                </Stack>
                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Box sx={{width: "100%"}}>
                        <List>
                            <ListItem sx={{ml: .8}}>
                                <Stack {...(onMoveAppointment && {onClick: onMoveAppointment})}
                                       sx={{cursor: "pointer"}}
                                       direction="row" spacing={2} alignItems="center">
                                    <Typography fontWeight={400}>
                                        {t("appintment_date")} :
                                    </Typography>
                                    <ConditionalWrapper
                                        condition={onMoveAppointment}
                                        wrapper={(children: any) => <Button sx={{p: .5}}>{children}</Button>}
                                    >
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
                                (data.type &&
                                    data?.type.icon !== "ic-control" &&
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
                                                        if (selected.length === 0) {
                                                            return <em>{t("stepper-1.type-placeholder")}</em>;
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
                                {reasons && <ListItem>
                                    <Typography fontWeight={400}>
                                        {t("consultation_reson")}
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <Autocomplete
                                            id={"motif"}
                                            disabled={!reasons}
                                            multiple
                                            freeSolo
                                            fullWidth
                                            autoHighlight
                                            disableClearable
                                            size="small"
                                            value={reason ? reason : []}
                                            onChange={(e, newValue: any) => {
                                                e.stopPropagation();
                                                const addReason = newValue.find((val: any) => Object.keys(val).includes("inputValue"))
                                                if (addReason) {
                                                    // Create a new value from the user input
                                                    addNewReason(addReason.inputValue);
                                                } else {
                                                    handleReasonChange(newValue);
                                                }
                                            }}
                                            filterOptions={(options, params) => filterReasonOptions(options, params, t)}
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
                                                                                          {loadingRequest ?
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
                                    </FormControl>
                                </ListItem>}
                                <ListItem>
                                    <Typography fontWeight={400}>
                                        {t("insctruction")}
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <textarea rows={6}
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
                                                        })}
                                                    >
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
