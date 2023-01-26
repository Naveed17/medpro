import React, {ChangeEvent, memo, useState} from "react";
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
    FormHelperText, MenuItem, IconButton, Avatar,
} from "@mui/material";
import {addPatientSelector, InputStyled, onAddPatient} from "@features/tabPanel";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useTranslation} from "next-i18next";
import moment from "moment-timezone";
import {LoadingScreen} from "@features/loadingScreen";
import Icon from "@themes/urlIcon";
import AddIcCallTwoToneIcon from '@mui/icons-material/AddIcCallTwoTone';
import {CountrySelect} from "@features/countrySelect";
import {isValidPhoneNumber} from 'libphonenumber-js';
import IconUrl from "@themes/urlIcon";
import {CropImage} from "@features/cropImage";
import {DefaultCountry, PhoneRegExp} from "@app/constants";
import {dashLayoutSelector} from "@features/base";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {DatePicker} from "@features/datepicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";

export const PhoneCountry: any = memo(({...props}) => {
    return (
        <CountrySelect {...props}/>
    );
})
PhoneCountry.displayName = "Phone country";

function AddPatientStep1({...props}) {
    const {
        freeSolo = false,
        onNext,
        onClose,
        OnSubmit = null,
        selectedPatient,
        translationKey = "patient",
        translationPrefix = "config.add-patient",
    } = props;

    const {data: session} = useSession();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const {stepsData} = useAppSelector(addPatientSelector);
    const {t, ready} = useTranslation(translationKey, {
        keyPrefix: translationPrefix,
    });

    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const {last_fiche_id} = useAppSelector(dashLayoutSelector);

    const RegisterSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(3, t("first-name-error"))
            .max(50, t("first-name-error"))
            .required(t("first-name-error")),
        last_name: Yup.string()
            .min(3, t("last-name-error"))
            .max(50, t("last-name-error"))
            .required(t("last-name-error")),
        phones: Yup.array().of(
            Yup.object().shape({
                dial: Yup.object().shape({
                    code: Yup.string(),
                    label: Yup.string(),
                    phone: Yup.string(),
                }),
                phone: Yup.string()
                    .test({
                        name: 'is-phone',
                        message: t("telephone-error"),
                        test: (value, ctx: any) => isValidPhoneNumber(`${ctx.from[0].value.dial.phone}${value}`),
                    })
                    .matches(PhoneRegExp, t("telephone-error"))
                    .required(t("telephone-error"))
            })),
        birthdate: Yup.object().shape({
            day: Yup.string(),
            month: Yup.string(),
            year: Yup.string()
        }),
        gender: Yup.string().required(t("gender-error"))
    });

    const formik = useFormik({
        initialValues: {
            picture: selectedPatient
                ? {url: selectedPatient.photo, file: ""}
                : stepsData.step1.picture,
            fiche_id: last_fiche_id,// stepsData.step1.fiche_id,
            first_name: selectedPatient
                ? selectedPatient.firstName
                : stepsData.step1.first_name,
            last_name: selectedPatient
                ? selectedPatient.lastName
                : stepsData.step1.last_name,
            birthdate: selectedPatient?.birthdate
                && {
                    day: selectedPatient.birthdate.split("-")[0] as string,
                    month: selectedPatient.birthdate.split("-")[1] as string,
                    year: selectedPatient.birthdate.split("-")[2] as string,
                },
            phones: selectedPatient?.contact?.find((contact: ContactModel) => contact.type === "phone") ?
                [{
                    phone: selectedPatient?.contact?.find((contact: ContactModel) => contact.type === "phone").value,
                    dial: doctor_country
                }] : [{
                    phone: "",
                    dial: doctor_country
                }],
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

    const handleAddPhone = () => {
        const phones = [...values.phones, {
            phone: "",
            dial: doctor_country
        }];
        formik.setFieldValue("phones", phones);
    };

    const handleRemovePhone = (index: number) => {
        const phones = [...values.phones];
        phones.splice(index, 1);
        setFieldValue("phones", phones);
    };

    const handleChange = (event: ChangeEvent | null, values: object) => {
        onNext(1);
        dispatch(onAddPatient({...stepsData, step1: values}));
    };

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("picture.url", URL.createObjectURL(file));
        setFieldValue("picture.file", file);
        setOpenUploadPicture(true);
    };

    const {handleSubmit, values, touched, errors, getFieldProps, setFieldValue} = formik;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Stack
                sx={{height: freeSolo ? "auto" : "100%"}}
                component={Form}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Stack spacing={2} className="inner-section">
                    {!freeSolo && <>
                        <Typography mt={1} variant="h6" color="text.primary" sx={{mb: 2}}>
                            {t("personal-info")}
                        </Typography>
                        <Box>
                            <Stack
                                spacing={2}
                                direction={{xs: "column", lg: "row"}}
                                alignItems={{xs: "center", lg: "stretch"}}
                                sx={{
                                    "& > label": {
                                        position: "relative",
                                        zIndex: 1,
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <label htmlFor="contained-button-file">
                                    <InputStyled
                                        id="contained-button-file"
                                        onChange={(e) => handleDrop(e.target.files as FileList)}
                                        type="file"
                                    />
                                    <Avatar
                                        src={values.picture.url}
                                        sx={{width: 164, height: 164}}
                                    >
                                        <IconUrl path="ic-user-profile"/>
                                    </Avatar>
                                    <IconButton
                                        color="primary"
                                        type="button"
                                        sx={{
                                            position: "absolute",
                                            bottom: 10,
                                            right: 10,
                                            zIndex: 1,
                                            pointerEvents: "none",
                                            bgcolor: "#fff !important",
                                        }}
                                    >
                                        <IconUrl path="ic-return-photo"/>
                                    </IconButton>
                                </label>
                                <Stack direction={"column"} sx={{width: "100%"}}>
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
                                        {(touched.gender && errors.gender) &&
                                            <FormHelperText color={"error"}>{String(errors.gender)}</FormHelperText>}
                                    </FormControl>
                                    <Grid container spacing={1}>
                                        <Grid item md={6} sm={6} lg={6}>
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
                                        </Grid>
                                        <Grid item md={6} sm={6} lg={6}>
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
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Stack>
                            <Box mt={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    component="span"
                                >
                                    {t("fiche")}{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t("fiche-placeholder")}
                                    size="small"
                                    fullWidth
                                    {...getFieldProps("fiche_id")}
                                    error={Boolean(touched.fiche_id && errors.fiche_id)}
                                    helperText={
                                        Boolean(touched.fiche_id && errors.fiche_id)
                                            ? String(errors.fiche_id)
                                            : undefined
                                    }
                                />
                            </Box>
                        </Box>
                    </>}

                    <Box
                        sx={{
                            "& .MuiOutlinedInput-root button": {
                                padding: "5px",
                                minHeight: "auto",
                                height: "auto",
                                minWidth: "auto"
                            }
                        }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            component="span"
                        >
                            {t("date-of-birth")}
                        </Typography>
                        <DatePicker
                            value={values.birthdate ? moment(`${values.birthdate.day}/${values.birthdate.month}/${values.birthdate.year}`, "DD/MM/YYYY").toDate() : null}
                            inputFormat="dd/MM/yyyy"
                            onChange={(date: Date) => {
                                setFieldValue("birthdate", {
                                    day: moment(date).format("DD"),
                                    month: moment(date).format("MM"),
                                    year: moment(date).format("YYYY"),
                                })
                            }}
                        />
                    </Box>
                    <Box>
                        {values.phones.map((phoneObject, index: number) =>
                            <Box key={index} mb={2}>
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
                                        <PhoneCountry
                                            initCountry={getFieldProps(`phones[${index}].dial`).value}
                                            onSelect={(state: any) => setFieldValue(`phones[${index}].dial`, state)}/>
                                    </Grid>
                                    <Grid item md={4} lg={7} xs={12}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            {...getFieldProps(`phones[${index}].phone`)}
                                            error={Boolean(touched.phones && touched.phones[index] && errors.phones && errors.phones[index])}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        {getFieldProps(`phones[${index}].dial`)?.value.phone}
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} lg={1} xs={12}>
                                        {index === 0 ? <IconButton
                                                onClick={handleAddPhone}
                                                color={"success"}
                                                className="success-light"
                                                sx={{
                                                    mr: 1.5,
                                                    "& svg": {
                                                        width: 20,
                                                        height: 20,
                                                    },
                                                }}
                                            >
                                                <AddIcCallTwoToneIcon/>
                                            </IconButton>
                                            :
                                            <IconButton
                                                onClick={() => handleRemovePhone(index)}
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
                                            </IconButton>}
                                    </Grid>
                                </Grid>
                                {touched.phones && touched.phones[index] && errors.phones && errors.phones[index] && (
                                    <FormHelperText error sx={{px: 2, mx: 0}}>
                                        {touched.phones[index].phone as any && (errors.phones[index] as any).phone}
                                    </FormHelperText>
                                )}
                            </Box>
                        )}
                    </Box>
                </Stack>
                {!freeSolo && <Stack
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
                </Stack>}
            </Stack>
            <CropImage
                {...{setFieldValue}}
                filedName={"picture.url"}
                open={openUploadPicture}
                img={values.picture.url}
                setOpen={setOpenUploadPicture}
            />
        </FormikProvider>
    );
}

export default AddPatientStep1;
