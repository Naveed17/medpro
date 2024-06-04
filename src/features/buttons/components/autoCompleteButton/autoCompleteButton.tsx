import RootStyled from './overrides/RootStyled'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, ClickAwayListener, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField, Typography, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { useCallback, useEffect, useState } from "react";
import { PatientAppointmentCard } from "@features/card";
import { AutoComplete } from "@features/autoComplete";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { appointmentSelector, setAppointmentPatient } from "@features/tabPanel";
import { useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";
import { dashLayoutSelector } from "@features/base";
import { useMedicalEntitySuffix } from "@lib/hooks";
import React from 'react';
import IconUrl from '@themes/urlIcon';
import { FormikProvider, useFormik, Form } from 'formik'
function AutoCompleteButton({ ...props }) {
    const {
        translation,
        data,
        defaultValue = "",
        loading,
        OnClickAction,
        onSearchChange,
        OnOpenSelect = null,
        size = 'medium'
    } = props;
    const formik = useFormik({
        initialValues: {
            lang: "",
            day: "",
            time: "",
            instr: ""
        },
        onSubmit: () => { },
    });
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { patient: initData } = useAppSelector(appointmentSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

    const { trigger: PatientDetailsTrigger } = useRequestQueryMutation("patient/data");

    const [focus, setFocus] = useState(true);
    const [patient, setPatient] = useState<PatientWithNextAndLatestAppointment | null>(initData);

    const handleOnClickAction = useCallback((event: any) => {
        OnClickAction(event);
    }, [OnClickAction]);

    const onSubmitPatient = (data: PatientWithNextAndLatestAppointment) => {
        dispatch(setAppointmentPatient(data));
    }
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const onEditPatient = () => {
        medicalEntityHasUser && PatientDetailsTrigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/${router.locale}`
        }, {
            onSuccess: (result: any) => {
                const { status } = result?.data;
                const patient = (result?.data as HttpResponse)?.data;
                if (status === "success") {
                    dispatch(setAppointmentPatient(patient as any));
                    handleOnClickAction(true);
                }

            }
        });
    }

    useEffect(() => {
        setPatient(initData)
    }, [initData]);

    const handleClick = () => {
        setFocus(!focus);
        if (OnOpenSelect) {
            OnOpenSelect();
        }
    }

    const { values, setFieldValue } = formik;
    return (
        <RootStyled>
            {!patient ? (
                <>
                    <Box sx={{ mb: 4 }} className="autocomplete-container">
                        <AutoComplete
                            {...{ data, defaultValue, loading, onSearchChange, size }}
                            onAddPatient={handleOnClickAction}
                            t={translation}
                            onSelectData={onSubmitPatient}
                        />
                    </Box>
                </>
            ) :
                <Stack spacing={2}>
                    <PatientAppointmentCard
                        key={patient.uuid}
                        item={patient}
                        listing
                        {...(size === 'medium' && { onEdit: onEditPatient })}
                        onReset={onSubmitPatient} />
                    <Accordion className={`sms-remind-acc`} expanded={expanded === 'sms-panel'} onChange={handleChange('sms-panel')}>
                        <AccordionSummary
                            expandIcon={!!expanded ? <IconUrl path="ic-outline-arrow-square-up" width={20} height={20} color={theme.palette.primary.main} /> : null}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Checkbox checked={!!expanded} /> {translation("sms-rem-text")}
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormikProvider value={formik}>
                                <Form>
                                    <Stack spacing={2}>
                                        <FormControl variant="outlined" fullWidth>
                                            <Typography mb={.5} color="grey.500">{translation("lang-label")}</Typography>
                                            <Select
                                                fullWidth
                                                id="sms-input"
                                                displayEmpty
                                                size='small'
                                                value={values.lang}
                                                onChange={(res) => {
                                                    setFieldValue("lang", res.target.value);
                                                }}
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <Typography color={'text.secondary'}>{translation("lang-label")}</Typography>
                                                    };
                                                    return <Typography>{selected}</Typography>

                                                }}

                                            >
                                                {[1, 2, 3].map((lang) => (
                                                    <MenuItem
                                                        key={lang}
                                                        value={lang}
                                                    >
                                                        {lang}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Stack direction='row' alignItems='center' spacing={2}>
                                            <FormControl variant="outlined" fullWidth>
                                                <Select
                                                    fullWidth
                                                    id="sms-input"
                                                    displayEmpty
                                                    size='small'
                                                    value={values.day}
                                                    onChange={(res) => {
                                                        setFieldValue("day", res.target.value);
                                                    }}
                                                    renderValue={(selected) => {
                                                        if (!selected) {
                                                            return <Stack direction='row' alignItems='center' spacing={1}>
                                                                <IconUrl path="ic-agenda-jour" color={theme.palette.grey[400]} width={20} height={20} />
                                                                <Typography color={'text.secondary'}>{translation("day")}</Typography>
                                                            </Stack>
                                                        };
                                                        return <Stack direction='row' alignItems='center' spacing={1}>
                                                            <IconUrl path="ic-agenda-jour" color={theme.palette.grey[400]} width={20} height={20} />
                                                            <Typography color={'text.secondary'}>{selected}</Typography>
                                                        </Stack>

                                                    }}

                                                >
                                                    {[1, 2, 3].map((day) => (
                                                        <MenuItem
                                                            key={day}
                                                            value={day}
                                                        >
                                                            {day}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" fullWidth>
                                                <Select
                                                    fullWidth
                                                    id="sms-input"
                                                    displayEmpty
                                                    size='small'
                                                    value={values.time}
                                                    onChange={(res) => {
                                                        setFieldValue("time", res.target.value);
                                                    }}
                                                    renderValue={(selected) => {
                                                        if (!selected) {
                                                            return <Stack direction='row' alignItems='center' spacing={1}>
                                                                <IconUrl path="ic-time" color={theme.palette.grey[400]} width={20} height={20} />
                                                                <Typography color={'text.secondary'}>{translation("time")}</Typography>
                                                            </Stack>
                                                        };
                                                        return <Stack direction='row' alignItems='center' spacing={1}>
                                                            <IconUrl path="ic-time" color={theme.palette.grey[400]} width={20} height={20} />
                                                            <Typography color={'text.secondary'}>{selected}</Typography>
                                                        </Stack>

                                                    }}

                                                >
                                                    {[1, 2, 3].map((time) => (
                                                        <MenuItem
                                                            key={time}
                                                            value={time}
                                                        >
                                                            {time}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                fullWidth
                                                id="instr"
                                                placeholder={translation("instr")}
                                                multiline
                                                rows={6}
                                                {...formik.getFieldProps("instr")}

                                            />
                                        </FormControl>
                                    </Stack>
                                </Form>
                            </FormikProvider>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            }
        </RootStyled>
    )
}

export default AutoCompleteButton;
