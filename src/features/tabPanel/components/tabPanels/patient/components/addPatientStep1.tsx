import React, {ChangeEvent, memo, useEffect, useRef, useState} from "react";
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
    Button,
    Stack,
    FormHelperText,
    IconButton,
    Avatar, useTheme, InputAdornment, Autocomplete, MenuItem, Checkbox, TextFieldProps,
} from "@mui/material";
import {
    addPatientSelector, CustomInput,
    InputStyled,
    onAddPatient,
} from "@features/tabPanel";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useTranslation} from "next-i18next";
import moment, {Moment} from "moment-timezone";
import {LoadingScreen} from "@features/loadingScreen";
import Icon from "@themes/urlIcon";
import {CountrySelect} from "@features/countrySelect";
import {isValidPhoneNumber} from "libphonenumber-js";
import IconUrl from "@themes/urlIcon";
import {CropImage} from "@features/image";
import {DefaultCountry, PatientContactRelation} from "@lib/constants";
import {dashLayoutSelector} from "@features/base";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {DatePicker} from "@mui/x-date-pickers";
import PhoneInput from "react-phone-number-input/input";
import {useRequestQueryMutation} from "@lib/axios";
import {getBirthday, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import AddIcon from "@mui/icons-material/Add";
import {ToggleButtonStyled} from "@features/toolbar";
import CalendarPickerIcon from "@themes/overrides/icons/calendarPickerIcon";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function CustomTextField(params: TextFieldProps & { values: any, error: boolean, helperText: string }) {
    const {values, error, helperText} = params;
    return (
        <TextField
            fullWidth
            {...params}
            {...((values.birthdate !== null || error) && {
                error: !moment(`${values.birthdate?.day}/${values.birthdate?.month}/${values.birthdate?.year}`, "DD/MM/YYYY").isValid() ?? false,
                ...(!moment(`${values.birthdate?.day}/${values.birthdate?.month}/${values.birthdate?.year}`, "DD/MM/YYYY").isValid() && {helperText})
            })}
        />
    );
}

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
    const phoneInputRef = useRef(null);
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const theme = useTheme();

    const {t: commonTranslation} = useTranslation("common");
    const {t, ready} = useTranslation(translationKey, {keyPrefix: translationPrefix});
    const {stepsData} = useAppSelector(addPatientSelector);
    const {last_fiche_id} = useAppSelector(dashLayoutSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [duplicatedFiche, setDuplicatedFiche] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [contactRelations] = useState(PatientContactRelation.map(relation => ({
        ...relation,
        label: commonTranslation(`social_insured.${relation.label}`)
    })));
    const [datePickerValue, setDatePickerValue] = React.useState<Moment | null>(null);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;

    const {trigger: triggerDetectFiche} = useRequestQueryMutation("/patient/detect/fiche_id");

    const RegisterSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(3, t("first-name-error"))
            .max(50, t("first-name-error"))
            .matches(/^[aA-zZء-ي\s]+$/, t("special-text-error"))
            .required(t("first-name-error")),
        last_name: Yup.string()
            .min(3, t("last-name-error"))
            .max(50, t("last-name-error"))
            .matches(/^[aA-zZء-ي\s]+$/, t("special-text-error"))
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
                        name: "is-phone",
                        message: t("telephone-error"),
                        test: (value) => {
                            return value ? isValidPhoneNumber(value) : false
                        }
                    })
                    .required(t("telephone-error")),
            })
        ),
        old: Yup.string(),
        birthdate: Yup.object().nullable().shape({
            day: Yup.string(),
            month: Yup.string(),
            year: Yup.string(),
        }),
        gender: Yup.string().required(t("gender-error")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            picture: selectedPatient
                ? {url: selectedPatient.photo, file: ""}
                : stepsData.step1.picture,
            fiche_id: last_fiche_id, // stepsData.step1.fiche_id,
            first_name: selectedPatient
                ? selectedPatient.firstName
                : stepsData.step1.first_name,
            last_name: selectedPatient
                ? selectedPatient.lastName
                : stepsData.step1.last_name,
            old: stepsData.step1.old,
            birthdate: selectedPatient?.birthdate ? {
                day: selectedPatient.birthdate.split("-")[0] as string,
                month: selectedPatient.birthdate.split("-")[1] as string,
                year: selectedPatient.birthdate.split("-")[2] as string,
            } : stepsData.step1.birthdate?.day && stepsData.step1.birthdate.day !== "" ? {
                day: stepsData.step1.birthdate.day,
                month: stepsData.step1.birthdate.month,
                year: stepsData.step1.birthdate.year
            } : null,
            phones: selectedPatient?.contact?.find((contact: ContactModel) => contact.type === "phone") ?
                [
                    {
                        phone: selectedPatient?.contact?.find((contact: ContactModel) => contact.type === "phone").value,
                        dial: doctor_country,
                        isWhatsapp: false,
                        relation: "himself",
                        firstName: "",
                        lastName: ""
                    }
                ]
                : stepsData.step1.phones
            ,
            gender: selectedPatient
                ? selectedPatient.gender === "M"
                    ? "1"
                    : "2"
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
        const phones = [
            ...values.phones,
            {
                phone: "",
                dial: doctor_country,
                isWhatsapp: false,
                relation: "himself",
                firstName: "",
                lastName: ""
            },
        ];
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
    }

    const checkFicheID = () => {
        medicalEntityHasUser && triggerDetectFiche({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/duplicated-field/${router.locale}?attribute=fiche_id&value=${values.fiche_id}`
        }, {
            onSuccess: (res: any) => {
                setDuplicatedFiche(res.data.data.length > 0);
            }
        });
    }

    const {
        handleSubmit,
        values,
        touched,
        errors,
        getFieldProps,
        setFieldValue,
    } = formik;

    if (!ready)
        return (
            <LoadingScreen
                color={"error"}
                button
                text={"loading-error"}
            />
        );

    return (
        <FormikProvider value={formik}>
            <Stack
                sx={{
                    height: freeSolo ? "auto" : "100%",
                    "& .MuiInputBase-input": {
                        textOverflow: "ellipsis"
                    }
                }}
                component={Form}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}>
                <Stack spacing={2} className="inner-section">
                    {!freeSolo && (
                        <>
                            <Typography
                                mt={1}
                                variant="h6"
                                color="text.primary"
                                sx={{mb: 2}}>
                                {t("personal-info")}
                            </Typography>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sx={{
                                        display: {xs: 'flex', md: 'block'},
                                        justifyContent: "center"

                                    }}>
                                        <label htmlFor="contained-button-file"
                                               style={{
                                                   position: "relative",
                                                   zIndex: 1,
                                                   cursor: "pointer",
                                                   display: 'inline-flex',
                                                   width: 118,
                                                   height: 118,
                                               }}>
                                            <InputStyled
                                                id="contained-button-file"
                                                onChange={(e) => handleDrop(e.target.files as FileList)}
                                                type="file"
                                            />
                                            <Avatar
                                                src={values.picture.url}
                                                sx={{width: 118, height: 118}}>
                                                <IconUrl path="ic-image"/>
                                            </Avatar>
                                            <IconButton
                                                color="primary"
                                                type="button"
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 6,
                                                    padding: .5,
                                                    right: 6,
                                                    zIndex: 1,
                                                    pointerEvents: "none",
                                                    bgcolor: "#fff !important",

                                                }}
                                                style={{
                                                    minWidth: 32,
                                                    minHeight: 32,
                                                }}>
                                                <IconUrl path="ic-camera-add" width={18} height={18}/>
                                            </IconButton>
                                        </label>
                                    </Grid>
                                    <Grid item md={9} xs={12}>
                                        <Stack direction={"column"} sx={{width: "100%"}}>
                                            <FormControl
                                                component="fieldset"
                                                error={Boolean(touched.gender && errors.gender)}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    gutterBottom>
                                                    {t("gender")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                                <RadioGroup
                                                    row
                                                    aria-label="gender"
                                                    {...getFieldProps("gender")}>
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
                                                {touched.gender && errors.gender && (
                                                    <FormHelperText color={"error"}>
                                                        {String(errors.gender)}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                            <Box mt={1}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                    component="span">
                                                    {t("fiche")}{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("fiche-placeholder")}
                                                    size="small"
                                                    fullWidth
                                                    {...getFieldProps("fiche_id")}
                                                    error={Boolean(duplicatedFiche)}
                                                    helperText={
                                                        Boolean(touched.fiche_id && errors.fiche_id)
                                                            ? String(errors.fiche_id)
                                                            : undefined
                                                    }
                                                    onBlur={checkFicheID}
                                                />
                                            </Box>
                                            {(duplicatedFiche && (
                                                <FormHelperText error sx={{px: 2, mx: 0}}>
                                                    {t('duplicatedFileID')}
                                                </FormHelperText>
                                            ))}
                                        </Stack>
                                    </Grid>
                                </Grid>

                            </Box>
                        </>
                    )}

                    <Box
                        sx={{
                            "& .MuiOutlinedInput-root button": {
                                padding: "5px",
                                minHeight: "auto",
                                height: "auto",
                                minWidth: "auto",
                            },
                        }}>
                        <Grid container spacing={{xs: 1, md: 2}}>
                            <Grid item md={6} xs={12} lg={6}>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                        component="span">
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
                                        error={Boolean(
                                            touched.first_name && errors.first_name
                                        )}
                                        helperText={
                                            Boolean(touched.first_name && errors.first_name)
                                                ? String(errors.first_name)
                                                : undefined
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} lg={6}>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                        component="span">
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
                                        error={Boolean(
                                            touched.last_name && errors.last_name
                                        )}
                                        helperText={
                                            Boolean(touched.last_name && errors.last_name)
                                                ? String(errors.last_name)
                                                : undefined
                                        }
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={6} md={8}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    component="span">
                                    {t("date-of-birth")}
                                </Typography>
                                <DatePicker
                                    value={values.birthdate ? moment(`${values.birthdate.day}/${values.birthdate.month}/${values.birthdate.year}`, "DD/MM/YYYY").toDate() : null}
                                    onChange={(date) => {
                                        const dateInput = moment(date);
                                        setFieldValue("birthdate", dateInput.isValid() ? {
                                            day: dateInput.format("DD"),
                                            month: dateInput.format("MM"),
                                            year: dateInput.format("YYYY"),
                                        } : null);
                                        if (dateInput.isValid()) {
                                            setError(false);
                                            const old = getBirthday(dateInput.format("DD-MM-YYYY")).years;
                                            setFieldValue("old", old > 120 ? "" : old);
                                        } else {
                                            setError(date !== null);
                                            setFieldValue("old", "");
                                        }
                                    }}
                                    slots={{
                                        openPickerIcon: CalendarPickerIcon,
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            ...((values.birthdate !== null || error) && {
                                                error: !moment(`${values.birthdate?.day}/${values.birthdate?.month}/${values.birthdate?.year}`, "DD/MM/YYYY").isValid() ?? false,
                                                ...(!moment(`${values.birthdate?.day}/${values.birthdate?.month}/${values.birthdate?.year}`, "DD/MM/YYYY").isValid() && {helperText: t('invalidDate')})
                                            })
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    component="span">
                                    {t("old")}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t("old-placeholder")}
                                    size="small"
                                    fullWidth
                                    {...getFieldProps("old")}
                                    onChange={event => {
                                        const old = parseInt(event.target.value);
                                        setFieldValue("old", old ? old : "");
                                        if (old) {
                                            setError(false);
                                            const dateInput = (values.birthdate ? moment(`${values.birthdate.day}/${values.birthdate.month}/${values.birthdate.year}`, "DD-MM-YYYY") : moment()).set("year", moment().get("year") - old);
                                            setFieldValue("birthdate", {
                                                day: dateInput.format("DD"),
                                                month: dateInput.format("MM"),
                                                year: dateInput.format("YYYY"),
                                            });
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Typography
                        mt={1}
                        variant="h6"
                        color="text.primary"
                        sx={{mb: 1}}>
                        {t("contact")}
                    </Typography>


                    <Stack sx={{m: 1}} spacing={2}>
                        {values.phones.map((phoneObject, index: number) => (
                            <fieldset key={index}>
                                <Box m={1.2}>
                                    <Grid container spacing={{xs: 1, md: 2}}>
                                        <Grid item xs={6} md={4}>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                    component="span">
                                                    {t("relation")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                                <Autocomplete
                                                    size={"small"}
                                                    value={getFieldProps(`phones[${index}].relation`) ?
                                                        contactRelations.find(relation => relation.key === values.phones[index].relation) : ""}
                                                    onChange={(event, relation: any) => {
                                                        relation && setFieldValue(`phones[${index}].relation`, relation.key);
                                                    }}
                                                    id={"relation"}
                                                    options={contactRelations}
                                                    getOptionLabel={(option: any) => option?.label ? option.label : ""}
                                                    isOptionEqualToValue={(option: any, value: any) => option.label === value?.label}
                                                    renderOption={(params, option, {selected}) => (
                                                        <MenuItem
                                                            {...params}
                                                            value={option.key}>
                                                            <Typography>{option.label}</Typography>
                                                        </MenuItem>)}
                                                    renderInput={(params) => {
                                                        return (<TextField {...params}
                                                                           placeholder={t("add-patient.relation-placeholder")}/>)
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} md={index === 0 ? 7 : 6}>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                    component="span">
                                                    {t("telephone")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                                {phoneObject && <PhoneInput
                                                    ref={phoneInputRef}
                                                    international
                                                    fullWidth
                                                    withCountryCallingCode
                                                    sx={{
                                                        "& .MuiOutlinedInput-root input": {
                                                            paddingLeft: ".5rem"
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment
                                                                position="start"
                                                                sx={{
                                                                    maxWidth: "3rem",
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        outline: "none",
                                                                        borderColor: "transparent"
                                                                    },
                                                                    "& fieldset": {
                                                                        border: "none!important",
                                                                        boxShadow: "none!important"
                                                                    },
                                                                }}>
                                                                <PhoneCountry
                                                                    showCountryFlagOnly={true}
                                                                    initCountry={getFieldProps(`phones[${index}].dial`).value}
                                                                    onSelect={(state: any) => {
                                                                        setFieldValue(`phones[${index}].phone`, "");
                                                                        setFieldValue(`phones[${index}].dial`, state);
                                                                    }}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    {...(values.phones[index].phone?.length > 0 &&
                                                        {
                                                            helperText: `${commonTranslation("phone_format")}: ${getFieldProps(`phones[${index}].phone`)?.value ?
                                                                getFieldProps(`phones[${index}].phone`).value : ""}`
                                                        })}
                                                    error={Boolean(errors.phones && (errors.phones as any)[index])}
                                                    country={phoneObject.dial?.code.toUpperCase() as any}
                                                    value={getFieldProps(`phones[${index}].phone`) ?
                                                        getFieldProps(`phones[${index}].phone`).value : ""}
                                                    onChange={value => setFieldValue(`phones[${index}].phone`, value)}
                                                    inputComponent={CustomInput as any}
                                                />}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={index === 0 ? 1 : 2}>
                                            <Stack
                                                direction={"row"}
                                                alignItems={"center"}
                                                spacing={1.2}
                                                sx={{
                                                    position: "relative",
                                                    top: "1.4rem"
                                                }}>
                                                <ToggleButtonStyled
                                                    id="toggle-button"
                                                    onClick={() => setFieldValue(`phones[${index}].isWhatsapp`, !values.phones[index].isWhatsapp)}
                                                    value="toggle"
                                                    className={"toggle-button"}
                                                    sx={{
                                                        minWidth: 34,
                                                        ...(values.phones[index].isWhatsapp && {border: "none"}),
                                                        background: values.phones[index].isWhatsapp ? theme.palette.primary.main : theme.palette.grey['A500']
                                                    }}>
                                                    <IconUrl width={19} height={19}
                                                             path={`ic-whatsapp${values.phones[index].isWhatsapp ? '-white' : ''}`}/>
                                                </ToggleButtonStyled>

                                                {index > 0 && <IconButton
                                                    onClick={() => handleRemovePhone(index)}
                                                    className="error-light"
                                                    sx={{
                                                        "& svg": {
                                                            width: 16,
                                                            height: 16,
                                                            "& path": {
                                                                fill: (theme) => theme.palette.text.primary,
                                                            },
                                                        },
                                                    }}>
                                                    <Icon path="ic-moin"/>
                                                </IconButton>}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    {values.phones[index].relation !== "himself" &&
                                        <Grid container spacing={{xs: 1, md: 2}} pt={2}>
                                            <Grid item md={6} xs={12} lg={6}>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        gutterBottom
                                                        component="span">
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
                                                        {...getFieldProps(`phones[${index}].firstName`)}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item md={6} xs={12} lg={6}>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        gutterBottom
                                                        component="span">
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
                                                        {...getFieldProps(`phones[${index}].lastName`)}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>}
                                </Box>
                            </fieldset>

                        ))}
                    </Stack>
                    <Button size={"small"} sx={{width: 100}} onClick={handleAddPhone} startIcon={<AddIcon/>}>
                        {t("add")}
                    </Button>
                </Stack>
                {!freeSolo && (
                    <Stack
                        spacing={3}
                        direction="row"
                        justifyContent="flex-end"
                        className="action">
                        <Button
                            onClick={() => onClose()}
                            variant="text-black"
                            color="primary">
                            {t("cancel")}
                        </Button>
                        <Button
                            disabled={error}
                            variant="contained"
                            type="submit"
                            color="primary">
                            {t("next")}
                        </Button>
                    </Stack>
                )}
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
