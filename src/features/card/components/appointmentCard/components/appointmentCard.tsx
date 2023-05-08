import React, {useState} from "react";
import {
    CardContent,
    Stack,
    Box,
    List,
    ListItem,
    Typography,
    FormControl,
    IconButton,
    Link, Button, TextField, Autocomplete,
} from "@mui/material";
import RootStyled from "./overrides/rootStyled";
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";
import CircularProgress from "@mui/material/CircularProgress";
import {dashLayoutSelector} from "@features/base";

function AppointmentCard({...props}) {
    const {data, onDataUpdated = null, onMoveAppointment = null, t, roles} = props;
    const router = useRouter();
    const {data: session} = useSession();

    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {appointmentTypes, medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [editConsultation, setConsultation] = useState(false);
    const onEditConsultation = () => setConsultation(!editConsultation);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpConsultReasonResponse, mutate: mutateConsultReason} = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}?sort=true`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {trigger: triggerAddReason} = useRequestMutation(null, "/agenda/motif/add");
    const {trigger: updateAppointmentTrigger} = useRequestMutation(null, "/agenda/update/appointment/detail");

    const [reason, setReason] = useState(data.motif);
    const [selectedReason, setSelectedReason] = useState(data?.motif ?? null);
    const [typeEvent, setTypeEvent] = useState(data.type?.uuid);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];

    const updateDetails = (input: { reason?: string[]; type?: string }) => {
        const form = new FormData();
        form.append("attribute", input.reason ? "consultation_reason" : "type");
        form.append("value", (input.reason ? input.reason : input.type) as string);
        updateAppointmentTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/appointments/${data?.uuid}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`},
        }).then(() => {
            onDataUpdated();
        });
    };

    const handleReasonChange = (reasons: ConsultationReasonModel[]) => {
        updateDetails({reason: reasons.map(reason => reason.uuid)});
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
            fr: name
        }));

        medicalEntityHasUser && triggerAddReason({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => mutateConsultReason().then((result: any) => {
            const {status} = result?.data;
            const reasonsUpdated = (result?.data as HttpResponse)?.data as ConsultationReasonModel[];
            if (status === "success") {
                handleReasonChange([...reason, reasonsUpdated[0]]);
            }
            setLoadingRequest(false);
        }));
    }

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
                            {data?.status?.value}
                        </Typography>
                    </Label>
                    {!roles.includes("ROLE_SECRETARY") && <IconButton

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
                                <Stack {...(onMoveAppointment && {onClick: onMoveAppointment})}
                                       sx={{cursor: "pointer"}}
                                       direction="row" spacing={2} alignItems="center">
                                    <Typography fontWeight={400}>
                                        {t("appintment_date")} :
                                    </Typography>
                                    <Button sx={{p: .5}}>
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
                                    </Button>
                                </Stack>
                            </ListItem>
                            {((data.type && !roles.includes("ROLE_SECRETARY")) ||
                                (data.type &&
                                    data?.type.name !== "Contrôl" &&
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
                                                            type: event.target.value as string,
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
                            {reasons && editConsultation && (
                                <ListItem>
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
                                            filterOptions={(options, params) => {
                                                const {inputValue} = params;
                                                const filtered = options.filter(option => [option.name.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                                                // Suggest the creation of a new value
                                                const isExisting = options.some((option) => inputValue.toLowerCase() === option.name.toLowerCase());
                                                if (inputValue !== '' && !isExisting) {
                                                    filtered.push({
                                                        inputValue,
                                                        name: `${t('add_reason')} "${inputValue}"`,
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
                                                <MenuItem
                                                    {...props}
                                                    key={option.uuid ? option.uuid : "-1"}
                                                    value={option.uuid}>
                                                    {option.name}
                                                </MenuItem>
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
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Stack>
            </CardContent>
        </RootStyled>
    );
}

export default AppointmentCard;
