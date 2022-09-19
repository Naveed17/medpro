import React, {useState} from 'react'
import {CardContent, Stack, Box, List, ListItem, Typography, FormControl} from '@mui/material'
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";

function AppointmentCard({...props}) {
    const {data, onDataUpdated, t, ...rest} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpAppointmentTypesResponse, error: errorHttpAppointmentTypes} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {
        trigger: updateAppointmentTrigger
    } = useRequestMutation(null, "/agenda/update/appointment/detail",
        TriggerWithoutValidation);

    const [reason, setReason] = useState(data.motif?.uuid);
    const [typeEvent, setTypeEvent] = useState(data.type?.uuid);
    const [edited, setEdited] = useState(false);
    const [loading, setLoading] = useState(false);

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];
    const types = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];

    const updateDetails = (input: { reason?: string, type?: string }) => {
        setEdited(false);
        setLoading(true);
        const form = new FormData();
        form.append('attribute', input.reason ? "consultation_reason" : "type");
        form.append('value', (input.reason ? input.reason : input.type) as string);
        updateAppointmentTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/appointments/${data?.uuid}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setLoading(false);
            onDataUpdated();
        });
    }

    return (
        <RootStyled>
            <CardContent>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Label variant='filled'
                           color={
                               data?.status.key === "CONFIRMED"
                                   ? "success"
                                   : data?.status.key === "CANCELED"
                                       ? "error"
                                       : "primary"
                           }>
                        {data.status.value}
                    </Label>
                </Stack>
                <Stack spacing={2} direction="row" justifyContent='space-between' alignItems='center'>
                    <Box sx={{width: "100%"}}>
                        <List>
                            {data.type && <ListItem>
                                <Typography fontWeight={400}>
                                    {t('consultation_type')}
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        labelId="select-type"
                                        id="select-type"
                                        value={typeEvent}
                                        displayEmpty
                                        onChange={event => {
                                            updateDetails({type: event.target.value as string});
                                            setTypeEvent(event.target.value as string)
                                        }}
                                        sx={{
                                            "& .MuiSelect-select svg": {
                                                position: "absolute",
                                                border: .1,
                                                borderColor: 'divider',
                                                borderRadius: '50%',
                                                p: 0.05
                                            },
                                            "& .MuiTypography-root": {
                                                ml: 4
                                            }
                                        }}
                                        renderValue={selected => {
                                            if (selected.length === 0) {
                                                return <em>{t("stepper-1.type-placeholder")}</em>;
                                            }

                                            const type = types?.find(type => type.uuid === selected);
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

                                            )
                                        }}>
                                        {types?.map((type) => (
                                            <MenuItem value={type.uuid} key={type.uuid}>
                                                <FiberManualRecordIcon
                                                    fontSize="small"
                                                    sx={{
                                                        border: .1,
                                                        borderColor: 'divider',
                                                        borderRadius: '50%',
                                                        p: 0.05,
                                                        mr: 1,
                                                        color: type.color
                                                    }}
                                                />
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </ListItem>}
                            {reasons && <ListItem>
                                <Typography fontWeight={400}>
                                    {t('consultation_reson')}
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        labelId="select-reason"
                                        id="select-reason"
                                        value={reason !== undefined ? reason : ""}
                                        displayEmpty
                                        onChange={event => {
                                            updateDetails({reason: event.target.value as string});
                                            setReason(event.target.value as string)
                                        }}
                                        renderValue={selected => {
                                            if (selected.length === 0) {
                                                return <em>{t("reason-consultation-placeholder")}</em>;
                                            }
                                            const motif = reasons?.find(reason => reason.uuid === selected);
                                            return (
                                                <Box sx={{display: "inline-flex"}}>
                                                    <Typography>{motif?.name}</Typography>
                                                </Box>

                                            )
                                        }}>
                                        {reasons?.map((consultationReason) => (
                                            <MenuItem value={consultationReason.uuid} key={consultationReason.uuid}>
                                                {consultationReason.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </ListItem>}
                            <ListItem>
                                <Typography fontWeight={400}>
                                    {t('appintment_date')}
                                </Typography>
                                <Stack spacing={4} direction="row" alignItems='center'>
                                    <Stack spacing={0.5} direction="row" alignItems='center'>
                                        <IconUrl className='callander' path="ic-agenda-jour"/>
                                        <Typography className="time-slot">
                                            {data?.date}
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={0.5} direction="row" alignItems='center'>
                                        <IconUrl className='time' path="setting/ic-time"/>
                                        <Typography className="date">
                                            {data?.time}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        </List>
                    </Box>
                </Stack>
            </CardContent>
        </RootStyled>)
}

export default AppointmentCard;
