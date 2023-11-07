import {FilterContainerStyles, setOcrData} from "@features/leftActionBar";
import {
    Autocomplete,
    Box,
    Divider, Drawer,
    FormControl, FormControlLabel,
    InputLabel, Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {AutoCompleteButton} from "@features/buttons";
import MenuItem from "@mui/material/MenuItem";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {configSelector, dashLayoutSelector} from "@features/base";
import {splitLastOccurrence, useMedicalEntitySuffix} from "@lib/hooks";
import {
    addPatientSelector,
    AddPatientStep1,
    AddPatientStep2,
    AddPatientStep3,
    appointmentSelector, onAddPatient,
    onResetPatient, setAppointmentPatient
} from "@features/tabPanel";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {onOpenPatientDrawer} from "@features/table";
import {CustomStepper} from "@features/customStepper";
import {batch} from "react-redux";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Document() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("docs");
    const {t: translate, ready: readyTranslate} = useTranslation("agenda", {keyPrefix: "steppers"});
    const {t: tPatient, ready: readyPatient} = useTranslation("patient", {keyPrefix: "config"});
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {patient} = useAppSelector(appointmentSelector);
    const {direction} = useAppSelector(configSelector);
    const {stepsData} = useAppSelector(addPatientSelector);

    const [patientDrawer, setPatientDrawer] = useState<boolean>(false);
    const [query, setQuery] = useState("");

    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        appointment: Yup.object().nullable(),
        type: Yup.object().nullable(),
        target: Yup.string(),
        patient: Yup.object().shape({
            name: Yup.string(),
        }).nullable(),
        date: Yup.date()
    });

    const stepperData = [
        {
            title: "tabs.personal-info",
            children: AddPatientStep1,
            disabled: false,
        },
        {
            title: "tabs.additional-information",
            children: AddPatientStep2,
            disabled: true,
        },
        {
            title: "tabs.fin",
            children: AddPatientStep3,
            disabled: true,
        },
    ];

    const formik = useFormik({
        enableReinitialize: false,
        initialValues: {
            name: "",
            appointment: null,
            type: null,
            target: "dir",
            patient: null,
            date: new Date()
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('ok', values);
        },
    });

    const {setFieldValue, values, setValues} = formik;

    const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(null);

    const documentUuid = router.query.document ?? null;

    const {
        data: httpOcrDocumentResponse
    } = useRequestQuery(medicalEntityHasUser && documentUuid ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/ocr/documents/${documentUuid}/${router.locale}`
    } : null, {refetchOnWindowFocus: false});

    const {data: httpPatientResponse} = useRequestQuery(medicalEntityHasUser && query.length > 0 ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...((medicalEntityHasUser && query.length > 0) && {variables: {query: `?${query.length > 0 ? `name=${query}&` : ""}withPagination=false`}})
    });

    const {data: httpPatientHistoryResponse} = useRequestQuery(medicalEntityHasUser && selectedPatient && values.target === 'appointment' ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${selectedPatient.uuid}/appointments/list/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpTypeResponse} = useRequestQuery({
        method: "GET",
        url: `/api/private/document/types/${router.locale}`
    }, {
        ...ReactQueryNoValidateConfig,
        variables: {query: "?is_active=1"}
    });

    const handleSearchChange = (search: string) => {
        setQuery(search);
    }

    const handleOnClick = () => {
        const [before, after] = splitLastOccurrence(query, " ");
        batch(() => {
            dispatch(onResetPatient());
            dispatch(onAddPatient({
                ...stepsData,
                step1: {
                    ...stepsData.step1,
                    first_name: before ?? "",
                    last_name: after ?? ""
                }
            }));
        });
        setPatientDrawer(true);
    }

    useEffect(() => {
        setSelectedPatient(patient as any);
        dispatch(setOcrData({patient}))
    }, [patient, dispatch]);

    useEffect(() => {
        if (stepsData.submit) {
            dispatch(setAppointmentPatient(stepsData.submit as any))
        }
    }, [stepsData.submit, dispatch]);

    const types = ((httpTypeResponse as HttpResponse)?.data ?? []) as any[];
    const patients = (httpPatientResponse as HttpResponse)?.data as PatientModel[] ?? [];
    const patientHistories = ((httpPatientHistoryResponse as HttpResponse)?.data ?? []) as any;
    const histories = patientHistories.hasOwnProperty('nextAppointments') || patientHistories.hasOwnProperty('previousAppointments') ? [...patientHistories.nextAppointments, ...patientHistories.previousAppointments] : []

    useEffect(() => {
        if (httpOcrDocumentResponse) {
            const documentData = ((httpOcrDocumentResponse as HttpResponse)?.data ?? null) as OcrDocument;
            if (documentData) {
                setQuery(documentData?.patientData?.name ?? "");
                const data = {
                    name: documentData.title,
                    appointment: documentData.appointment,
                    type: documentData.documentType,
                    target: "dir",
                    patient: documentData.patientData,
                    date: new Date(),
                    data: documentData.medicalData
                }
                setValues(data);
                dispatch(setOcrData(data));
                setQuery(documentData.patientData?.name ?? documentData.patientData?.patient_name ?? "")
            }
        }
    }, [httpOcrDocumentResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready || !readyTranslate || !readyPatient) return (
        <LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <FormikProvider value={formik}>
                <FilterContainerStyles>
                    <Typography
                        fontSize={18}
                        fontWeight={600}
                        color="text.primary"
                        sx={{py: 1.5, pl: "10px", mt: "0.55rem"}}
                        gutterBottom>
                        {t(`filter.title`)}
                    </Typography>
                    <Divider/>
                    <Box m={2.5}>
                        <Typography mb={1} color={"text.primary"} fontSize={14} fontWeight={400}>{t('patient-Suggested')}</Typography>
                        <AutoCompleteButton
                            size={"small"}
                            defaultValue={query}
                            onSearchChange={handleSearchChange}
                            OnClickAction={handleOnClick}
                            OnOpenSelect={() => console.log("OnOpenSelect")}
                            translation={translate}
                            loading={false}
                            data={patients}/>

                        <InputLabel shrink sx={{mt: 2}}>
                            {t(`filter.name`)}
                        </InputLabel>
                        <FormControl
                            component="form"
                            fullWidth
                            onSubmit={e => e.preventDefault()}>
                            <TextField
                                fullWidth
                                value={values?.name}
                                onChange={event => {
                                    setFieldValue("name", event.target.value);
                                    dispatch(setOcrData({name: event.target.value}))
                                }}
                                placeholder={t(`filter.name-placeholder`)}
                            />
                        </FormControl>

                        <InputLabel shrink sx={{mt: 2}}>
                            {t(`filter.type`)}
                        </InputLabel>
                        <FormControl
                            component="form"
                            fullWidth
                            onSubmit={e => e.preventDefault()}>
                            <Autocomplete
                                id={"select-doc-type"}
                                autoHighlight
                                disableClearable
                                size="small"
                                value={types.find(ty => ty.slug === values?.type) ?? null}
                                onChange={(e, newValue: any) => {
                                    e.stopPropagation();
                                    setFieldValue("type", newValue.slug);
                                    dispatch(setOcrData({type: newValue}));
                                }}
                                sx={{color: "text.secondary"}}
                                options={types}
                                getOptionLabel={option => option?.name ? option.name : ""}
                                isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                renderOption={(props, option) => (
                                    <Stack key={option.uuid}>
                                        <MenuItem
                                            {...props}
                                            value={option.uuid}>
                                            {option.name}
                                        </MenuItem>
                                    </Stack>
                                )}
                                renderInput={params =>
                                    <TextField
                                        color={"info"}
                                        {...params}
                                        placeholder={t("filter.type-placeholder")}
                                        sx={{paddingLeft: 0}}
                                        variant="outlined" fullWidth/>}/>
                        </FormControl>

                        <InputLabel shrink sx={{mt: 2}}>
                            {t(`filter.assign`)}
                        </InputLabel>
                        <RadioGroup
                            row
                            aria-label="gender"
                            onChange={(e) => {
                                setFieldValue("target", e.target.value);
                                dispatch(setOcrData({target: e.target.value}));
                            }}
                            value={values?.target}
                            name="row-radio-buttons-group"
                            sx={{
                                ml: .5,
                                "& .MuiRadio-root": {
                                    width: 36, height: 36
                                }
                            }}>
                            <FormControlLabel
                                value={'dir'}
                                control={<Radio/>}
                                label={<Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                    {t(`filter.assign-patient`)}
                                </Stack>}
                            />
                            <FormControlLabel
                                value={'appointment'}
                                control={<Radio/>}
                                label={<Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                    {t(`filter.assign-appointment`)}
                                </Stack>}
                            />
                        </RadioGroup>

                        {values?.target === 'appointment' && <FormControl
                            component="form"
                            fullWidth
                            onSubmit={e => e.preventDefault()}>
                            <Autocomplete
                                id={"select-doc-appointment"}
                                autoHighlight
                                disableClearable
                                size="small"
                                value={values?.appointment}
                                onChange={(e, newValue: any[]) => {
                                    e.stopPropagation();
                                    setFieldValue("appointment", newValue);
                                    dispatch(setOcrData({appointment: newValue}));
                                }}
                                sx={{color: "text.secondary"}}
                                options={histories}
                                getOptionLabel={option => option?.dayDate ? `${option.dayDate} ${option.startTime}` : ""}
                                isOptionEqualToValue={(option: any, value) => option.dayDate === value.dayDate}
                                renderOption={(props, option) => (
                                    <Stack key={option.uuid}>
                                        <MenuItem
                                            {...props}
                                            value={option.uuid}>
                                            {`${option.dayDate} ${option.startTime}`}
                                        </MenuItem>
                                    </Stack>
                                )}
                                renderInput={params =>
                                    <TextField
                                        color={"info"}
                                        {...params}
                                        placeholder={t("filter.selected-appointment")}
                                        sx={{paddingLeft: 0}}
                                        variant="outlined" fullWidth/>}/>
                        </FormControl>}

                        <InputLabel shrink sx={{mt: 2}}>
                            {t(`filter.date`)}
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={values?.date}
                                inputFormat="dd/MM/yyyy"
                                onChange={date => {
                                    dispatch(setOcrData({date}));
                                }}
                                renderInput={(params) =>
                                    <FormControl
                                        sx={{
                                            "& .MuiOutlinedInput-root button": {
                                                padding: "5px",
                                                minHeight: "auto",
                                                height: "auto",
                                                minWidth: "auto",
                                            }
                                        }} component="form" fullWidth onSubmit={e => e.preventDefault()}>
                                        <TextField {...params} fullWidth/>
                                    </FormControl>}
                            />
                        </LocalizationProvider>
                    </Box>
                </FilterContainerStyles>
            </FormikProvider>

            <Drawer
                anchor={"right"}
                open={patientDrawer}
                dir={direction}
                onClose={() => {
                    setPatientDrawer(false);
                    dispatch(
                        onOpenPatientDrawer({
                            patientId: "",
                            patientAction: "",
                        })
                    );
                }}
                sx={{
                    "& .MuiTabs-root": {
                        position: "sticky",
                        top: 0,
                        bgcolor: (theme) => theme.palette.background.paper,
                        zIndex: 11,
                    },
                }}>
                <CustomStepper
                    {...{stepperData}}
                    selectedPatient={null}
                    translationKey="patient"
                    prefixKey="add-patient"
                    scroll
                    t={tPatient}
                    minWidth={648}
                    onClose={() => {
                        dispatch(onResetPatient());
                        setPatientDrawer(false);
                    }}
                />
            </Drawer>
        </>

    )
}

export default Document;
