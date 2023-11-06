import {FilterContainerStyles, ocrDocumentSelector, setOcrData} from "@features/leftActionBar";
import {
    Autocomplete,
    Box,
    Divider,
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
import {dashLayoutSelector} from "@features/base";
import {prepareSearchKeys, useMedicalEntitySuffix} from "@lib/hooks";
import {appointmentSelector} from "@features/tabPanel";
import {FormikProvider, useFormik} from "formik";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Document() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation(["docs"]);
    const {t: translate, ready: readyTranslate} = useTranslation("agenda", {keyPrefix: "steppers"});
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {patient: initData} = useAppSelector(appointmentSelector);

    const [query, setQuery] = useState("");

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
        onSubmit: async (values) => {
            console.log('ok', values);
        },
    });

    const {setFieldValue, values, setValues, errors, touched} = formik;

    const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(null);

    const documentUuid = router.query.document ?? null;

    const {
        data: httpOcrDocumentResponse,
        isLoading: isOcrDocumentLoading
    } = useRequestQuery(medicalEntityHasUser && documentUuid ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/ocr/documents/${documentUuid}/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpPatientResponse} = useRequestQuery(medicalEntityHasUser && values.patient?.name ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...((medicalEntityHasUser && values.patient?.name && query) && {variables: {query: `?${query.length > 0 ? `filter=${query}&` : ""}withPagination=false`}})
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

    }

    useEffect(() => {
        setSelectedPatient(initData as any);
    }, [initData]);

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
                    target: documentData.title,
                    patient: documentData.patientData,
                    date: new Date(),
                    data: documentData.medicalData
                }
                setValues(data);
                dispatch(setOcrData(data));
            }
        }
    }, [httpOcrDocumentResponse]); // eslint-disable-line react-hooks/exhaustive-deps
    console.log("values", documentUuid, values)
    if (!ready || !readyTranslate) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <FilterContainerStyles>
                <Typography
                    fontSize={18}
                    fontWeight={600}
                    color="text.primary"
                    sx={{py: 1.48, pl: "10px", mb: "0.21em"}}
                    gutterBottom>
                    {t(`filter.title`)}
                </Typography>
                <Divider/>
                <Box m={2.5}>
                    <Typography mb={1} color={"text.primary"} fontSize={14} fontWeight={400}>Patient
                        Suggérés</Typography>

                    <AutoCompleteButton
                        size={"small"}
                        onSearchChange={handleSearchChange}
                        OnClickAction={handleOnClick}
                        OnOpenSelect={() => console.log("OnOpenSelect")}
                        translation={translate}
                        loading={false}
                        data={patients}/>

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Nom du document`)}
                    </InputLabel>
                    <FormControl
                        component="form"
                        fullWidth
                        onSubmit={e => e.preventDefault()}>
                        <TextField
                            fullWidth
                            value={values?.name}
                            onChange={event => dispatch(setOcrData({name: event.target.value}))}
                            placeholder={t(`Tapez le nom du document`)}
                        />
                    </FormControl>

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Type de document`)}
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
                            onChange={(e, newValue: any[]) => {
                                e.stopPropagation();
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
                                    placeholder={t("Séléctionnez le type")}
                                    sx={{paddingLeft: 0}}
                                    variant="outlined" fullWidth/>}/>
                    </FormControl>

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Destination`)}
                    </InputLabel>
                    <RadioGroup
                        row
                        aria-label="gender"
                        onChange={(e) => {
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
                                {t(`Dossier patient`)}
                            </Stack>}
                        />
                        <FormControlLabel
                            value={'appointment'}
                            control={<Radio/>}
                            label={<Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                {t(`Consultation`)}
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
                                console.log("newValue", newValue);
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
                                    placeholder={t("Séléctionnez la consultation")}
                                    sx={{paddingLeft: 0}}
                                    variant="outlined" fullWidth/>}/>
                    </FormControl>}

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Date du document`)}
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
    )
}

export default Document;
