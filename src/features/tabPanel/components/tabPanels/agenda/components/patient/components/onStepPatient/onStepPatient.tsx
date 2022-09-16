import {Form, FormikProvider, useFormik} from "formik";
import {
    Box, Button,
    FormControl,
    FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import moment from "moment-timezone";
import {CountrySelect} from "@features/countrySelect";
import React, {useState} from "react";
import {useAppSelector} from "@app/redux/hooks";
import {addPatientSelector} from "@features/tabPanel";
import * as Yup from "yup";
import {useTranslation} from "next-i18next";
import {
    PhoneRegExp
} from "./config";
import Icon from "@themes/urlIcon";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";

function OnStepPatient({...props}) {
    const {
        onNext,
        onClose,
        OnSubmit = null,
        selectedPatient = null,
        translationKey = "patient",
        translationPrefix = "add-patient",
    } = props;
    const router = useRouter();

    const {stepsData: patient} = useAppSelector(addPatientSelector);
    const {data: httpContactResponse, error: errorHttpContact} = useRequest({
        method: "GET",
        url: "/api/public/contact-type/" + router.locale
    }, SWRNoValidateConfig);

    const {t, ready} = useTranslation(translationKey, {
        keyPrefix: translationPrefix,
    });

    const RegisterPatientSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, t("first-name-error"))
            .max(50, t("first-name-error"))
            .required(t("first-name-error")),
        lastName: Yup.string()
            .min(3, t("last-name-error"))
            .max(50, t("last-name-error"))
            .required(t("last-name-error")),
        phone: Yup.string()
            .min(8, t("telephone-error"))
            .matches(PhoneRegExp, t("telephone-error"))
            .required(t("telephone-error")),
        birthdate: Yup.object().shape({
            day: Yup.string().required(t("date-error")),
            month: Yup.string().required(t("date-error")),
            year: Yup.string().required(t("date-error")),
        }),
//        email: Yup.string().email("Invalid email").required("Email Required")
    });

    const formik = useFormik({
        initialValues: {
            patientGroup: patient?.step1.patient_group,
            firstName: Boolean(selectedPatient)
                ? selectedPatient.firstNames
                : patient.step1.first_name,
            lastName: Boolean(selectedPatient)
                ? selectedPatient.lastName
                : patient.step1.last_name,
            birthdate: Boolean(selectedPatient)
                ? {
                    day: selectedPatient.birthdate.split("-")[0] as string,
                    month: selectedPatient.birthdate.split("-")[1] as string,
                    year: selectedPatient.birthdate.split("-")[2] as string,
                }
                : patient.step1.birthdate,
            phone: patient.step1.phone,
            gender: Boolean(selectedPatient)
                ? selectedPatient.gender
                : patient.step1.gender,
            region: "",
            zip_code: "",
            address: "",
            email: "",
            cin: "",
            from: "",
            insurance: [] as {
                name: string;
                id: string | number;
            }[],
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async (values) => {
            if (OnSubmit) {
                OnSubmit({...values, contact: contacts[0], countryCode: selectedCountry});
            }
        },
    });

    const [selectedCountry, setSelectedCountry] = React.useState<any>(null);
    const {values, handleSubmit, touched, errors, isSubmitting, getFieldProps} = formik;
    const contacts = (httpContactResponse as HttpResponse)?.data as ContactModel[];

    const handleAddInsurance = () => {
        const insurance = [...values.insurance, {name: "", number: ""}];
        formik.setFieldValue("insurance", insurance);
    };

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurance];
        insurance.splice(index, 1);
        formik.setFieldValue("insurance", insurance);
    };

    if (!ready) return (<>loading translations...</>);

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
                        <FormControl component="fieldset">
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
                            {...getFieldProps("firstName")}
                            error={Boolean(touched.firstName && errors.firstName)}
                            helperText={
                                Boolean(touched.firstName && errors.firstName)
                                    ? String(errors.firstName)
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
                            {...getFieldProps("lastName")}
                            error={Boolean(touched.lastName && errors.lastName)}
                            helperText={
                                Boolean(touched.lastName && errors.lastName)
                                    ? String(errors.lastName)
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
                                <CountrySelect selected={(v: any) => setSelectedCountry(v)}/>
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
                                {touched.phone && errors.phone}
                            </FormHelperText>
                        )}
                    </Box>

                    <Box>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {t("region")}
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id={"region"}
                                        size="small"
                                        {...getFieldProps("region")}
                                        value={values.region}
                                        displayEmpty={true}
                                        sx={{color: "text.secondary"}}
                                        renderValue={(value) =>
                                            value?.length
                                                ? Array.isArray(value)
                                                    ? value.join(", ")
                                                    : value
                                                : t("region-placeholder")
                                        }
                                    >
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {t("zip")}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder="10004"
                                    size="small"
                                    fullWidth
                                    {...getFieldProps("zip_code")}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t("address")}
                        </Typography>
                        <TextField
                            variant="outlined"
                            multiline
                            rows={3}
                            placeholder={t("address-placeholder")}
                            size="small"
                            fullWidth
                            {...getFieldProps("address")}
                        />
                    </Box>
                    <Box>
                        <Typography sx={{mb: 1.5, textTransform: "capitalize"}}>
                            <IconButton
                                onClick={handleAddInsurance}
                                className="success-light"
                                sx={{
                                    mr: 1.5,
                                    "& svg": {
                                        width: 20,
                                        height: 20,
                                    },
                                }}
                            >
                                <Icon path="ic-plus"/>
                            </IconButton>
                            {t("assurance")}
                        </Typography>
                        <Box>
                            {values.insurance.map((val, index: number) => (
                                <Grid
                                    key={Math.random()}
                                    container
                                    spacing={2}
                                    sx={{mt: index > 0 ? 1 : 0}}
                                >
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <Select
                                                id={"assurance"}
                                                size="small"
                                                {...getFieldProps(`insurance[${index}].name`)}
                                                value={values.insurance[index]?.name}
                                                displayEmpty={true}
                                                sx={{color: "text.secondary"}}
                                                renderValue={(value) =>
                                                    value?.length
                                                        ? Array.isArray(value)
                                                            ? value.join(", ")
                                                            : value
                                                        : t("assurance")
                                                }
                                            >
                                                <MenuItem value="1">1</MenuItem>
                                                <MenuItem value="2">2</MenuItem>
                                                <MenuItem value="3">3</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("assurance-phone-error")}
                                                size="small"
                                                fullWidth
                                                {...getFieldProps(`insurance[${index}].number`)}
                                            />
                                            <IconButton
                                                onClick={() => handleRemoveInsurance(index)}
                                                className="error-light"
                                                sx={{
                                                    mr: 1.5,
                                                    "& svg": {
                                                        width: 20,
                                                        height: 20,
                                                        "& path": {
                                                            fill: (theme) => theme.palette.text.primary,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Icon path="ic-moin"/>
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t("email")}
                        </Typography>
                        <TextField
                            placeholder={t("email-placeholder")}
                            type="email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...getFieldProps("email")}
                            error={Boolean(touched.email && errors.email)}
                            helperText={
                                Boolean(touched.email && errors.email)
                                    ? String(errors.email)
                                    : undefined
                            }
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t("cin")}
                        </Typography>
                        <TextField
                            placeholder={t("cin-placeholder")}
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...getFieldProps("cin")}
                        />
                    </Box>
                    {/*<Box>*/}
                    {/*    <Typography variant="body2" color="text.secondary" gutterBottom>*/}
                    {/*        {t("from")}*/}
                    {/*    </Typography>*/}
                    {/*    <TextField*/}
                    {/*        placeholder={t("from-placeholder")}*/}
                    {/*        type="text"*/}
                    {/*        variant="outlined"*/}
                    {/*        size="small"*/}
                    {/*        fullWidth*/}
                    {/*        {...getFieldProps("from")}*/}
                    {/*    />*/}
                    {/*</Box>*/}
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
    )
}

export default OnStepPatient;
