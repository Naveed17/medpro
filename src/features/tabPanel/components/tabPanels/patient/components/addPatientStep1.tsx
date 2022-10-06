import React, {ChangeEvent} from "react";
import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Box,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Grid,
    InputAdornment,
    Button,
    Select,
    Stack,
    FormHelperText,
} from "@mui/material";
import {addPatientSelector, onAddPatient} from "@features/tabPanel";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useTranslation} from "next-i18next";
import moment from "moment-timezone";
import dynamic from "next/dynamic";

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

function AddPatientStep1({...props}) {
    const {
        onNext,
        onClose,
        OnSubmit = null,
        selectedPatient,
        translationKey = "patient",
        translationPrefix = "config.add-patient",
    } = props;
    const {stepsData} = useAppSelector(addPatientSelector);
    const dispatch = useAppDispatch();

    const [selectedCountry, setSelectedCountry] = React.useState<any>({
        code: "TN",
        label: "Tunisia",
        phone: "+216"
    });
    const {t, ready} = useTranslation(translationKey, {
        keyPrefix: translationPrefix,
    });

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const RegisterSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(3, t("first-name-error"))
            .max(50, t("first-name-error"))
            .required(t("first-name-error")),
        last_name: Yup.string()
            .min(3, t("last-name-error"))
            .max(50, t("last-name-error"))
            .required(t("last-name-error")),
        phone: Yup.string()
            .min(8, t("telephone-error"))
            .matches(phoneRegExp, t("telephone-error"))
            .required(t("telephone-error")),
        birthdate: Yup.object().shape({
            day: Yup.string().required(t("date-error")),
            month: Yup.string().required(t("date-error")),
            year: Yup.string().required(t("date-error")),
        }),
        gender: Yup.string().required(t("gender-error"))
    });

    const formik = useFormik({
        initialValues: {
            patient_group: stepsData.step1.patient_group,
            first_name: selectedPatient
                ? selectedPatient.firstName
                : stepsData.step1.first_name,
            last_name: selectedPatient
                ? selectedPatient.lastName
                : stepsData.step1.last_name,
            birthdate: selectedPatient
                ? {
                    day: selectedPatient.birthdate.split("-")[0] as string,
                    month: selectedPatient.birthdate.split("-")[1] as string,
                    year: selectedPatient.birthdate.split("-")[2] as string,
                }
                : stepsData.step1.birthdate,
            phone: selectedPatient?.contact.find((contact: ContactModel) => contact.type === "phone") ?
                selectedPatient?.contact.find((contact: ContactModel) => contact.type === "phone").value : "",
            gender: selectedPatient
                ? selectedPatient.gender === "M" ? "1" : "2"
                : stepsData.step1.gender,
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
            handleChange(null, values);
            if (OnSubmit) {
                OnSubmit(values);
            }
        },
    });

    if (!ready) return <>loading translations...</>;
    const handleChange = (event: ChangeEvent | null, values: object) => {
        onNext(1);
        dispatch(onAddPatient({...stepsData, step1: values}));
    };
    const {values, handleSubmit, touched, errors, isSubmitting, getFieldProps} = formik;
    return (
        <FormikProvider value={formik}>
            <Stack
                sx={{height: "100%"}}
                component={Form}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Stack spacing={2} className="inner-section">
                    <Typography mt={1} variant="h6" color="text.primary" sx={{mb: 2}}>
                        {t("personal-info")}
                    </Typography>
                    <Box>
                        <FormControl component="fieldset" error={Boolean(touched.gender && errors.gender)}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("gender")} {" "}
                                <Typography component="span" color="error">
                                    *
                                </Typography>
                            </Typography>
                            <RadioGroup row aria-label="gender" {...getFieldProps("gender")}>
                                <FormControlLabel
                                    value={1}
                                    control={<Radio size="small"/>}
                                    label={t("mr")}
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio size="small"/>}
                                    label={t("mrs")}
                                />
                            </RadioGroup>
                            {(touched.gender && errors.gender) && <FormHelperText color={"error"}>{String(errors.gender)}</FormHelperText>}
                        </FormControl>
                    </Box>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            component="span"
                        >
                            {t("first-name")}{" "}
                            <Typography component="span" color="error">
                                *
                            </Typography>
                        </Typography>
                        <TextField
                            variant="outlined"
                            placeholder={t("first-name-placeholder")}
                            size="small"
                            fullWidth
                            {...getFieldProps("first_name")}
                            error={Boolean(touched.first_name && errors.first_name)}
                            helperText={
                                Boolean(touched.first_name && errors.first_name)
                                    ? String(errors.first_name)
                                    : undefined
                            }
                        />
                    </Box>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            component="span"
                        >
                            {t("last-name")}{" "}
                            <Typography component="span" color="error">
                                *
                            </Typography>
                        </Typography>
                        <TextField
                            variant="outlined"
                            placeholder={t("last-name-placeholder")}
                            size="small"
                            fullWidth
                            {...getFieldProps("last_name")}
                            error={Boolean(touched.last_name && errors.last_name)}
                            helperText={
                                Boolean(touched.last_name && errors.last_name)
                                    ? String(errors.last_name)
                                    : undefined
                            }
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            component="span"
                        >
                            {t("date-of-birth")}
                            <Typography component="span" color="error">
                                *
                            </Typography>
                        </Typography>
                        <Stack spacing={3} direction={{xs: "column", lg: "row"}}>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"day"}
                                    {...getFieldProps("birthdate.day")}
                                    value={values.birthdate.day}
                                    displayEmpty={true}
                                    sx={{color: "text.secondary"}}
                                    renderValue={(value: string) =>
                                        value?.length
                                            ? Array.isArray(value)
                                                ? value.join(", ")
                                                : value
                                            : t("day")
                                    }
                                    error={Boolean(touched.birthdate && errors.birthdate)}
                                    native
                                >
                                    {Array.from(
                                        Array(
                                            moment(
                                                `${values.birthdate.year}-${values.birthdate.month}`,
                                                "YYYY-MM"
                                            ).daysInMonth()
                                        ).keys()
                                    ).map((v, i) => (
                                        <option
                                            key={Math.random()}
                                            value={i > 9 ? `${i}` : `0${i + 1}`}
                                        >
                                            {i + 1}
                                        </option>
                                    ))}
                                </Select>
                                {touched.birthdate && errors.birthdate && (
                                    <FormHelperText error sx={{px: 2, mx: 0}}>
                                        {touched.birthdate.day && errors.birthdate.day}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"day"}
                                    {...getFieldProps("birthdate.month")}
                                    value={values.birthdate.month}
                                    displayEmpty={true}
                                    sx={{color: "text.secondary"}}
                                    renderValue={(value) =>
                                        value?.length
                                            ? Array.isArray(value)
                                                ? value.join(", ")
                                                : value
                                            : t("month")
                                    }
                                    error={Boolean(touched.birthdate && errors.birthdate)}
                                    native
                                >
                                    {moment.monthsShort().map((v, i) => (
                                        <option
                                            key={Math.random()}
                                            value={i > 9 ? `${i}` : `0${i + 1}`}
                                        >
                                            {v}
                                        </option>
                                    ))}
                                </Select>
                                {touched.birthdate && errors.birthdate && (
                                    <FormHelperText error sx={{px: 2, mx: 0}}>
                                        {touched.birthdate.month && errors.birthdate.month}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"day"}
                                    {...getFieldProps("birthdate.year")}
                                    value={values.birthdate.year}
                                    displayEmpty={true}
                                    sx={{color: "text.secondary"}}
                                    renderValue={(value) =>
                                        value?.length
                                            ? Array.isArray(value)
                                                ? value.join(", ")
                                                : value
                                            : t("year")
                                    }
                                    error={Boolean(touched.birthdate && errors.birthdate)}
                                    native
                                >
                                    {Array.from(Array(100).keys()).map((v, i) => (
                                        <option
                                            key={Math.random()}
                                            value={`${moment().year() - 100 + i + 1}`}
                                        >
                                            {moment().year() - 100 + i + 1}
                                        </option>
                                    ))}
                                </Select>
                                {touched.birthdate && errors.birthdate && (
                                    <FormHelperText error sx={{px: 2, mx: 0}}>
                                        {touched.birthdate.year && errors.birthdate.year}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Stack>
                    </Box>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            component="span"
                        >
                            {t("telephone")}{" "}
                            <Typography component="span" color="error">
                                *
                            </Typography>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item md={6} lg={4} xs={12}>
                                <CountrySelect
                                    initCountry={{
                                        code: "TN",
                                        label: "Tunisia",
                                        phone: "+216"
                                    }}
                                    onSelect={(state: any) => {
                                        setSelectedCountry(state);
                                    }}/>
                            </Grid>
                            <Grid item md={6} lg={8} xs={12}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    {...getFieldProps("phone")}
                                    error={Boolean(touched.phone && errors.phone)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {selectedCountry?.phone}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {touched.phone && errors.phone && (
                            <FormHelperText error sx={{px: 2, mx: 0}}>
                                {touched.phone as any && errors.phone as any}
                            </FormHelperText>
                        )}
                    </Box>
                </Stack>
                <Stack
                    spacing={3}
                    direction="row"
                    justifyContent="flex-end"
                    className="action"
                >
                    <Button
                        onClick={() => onClose()}
                        variant="text-black"
                        color="primary"
                    >
                        {t("cancel")}
                    </Button>
                    <Button variant="contained" type="submit" color="primary">
                        {t("next")}
                    </Button>
                </Stack>
            </Stack>
        </FormikProvider>
    );
}

export default AddPatientStep1;
