import { FormikProvider, Form, useFormik } from "formik";
import * as Yup from "yup";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Theme,
    Typography,
    useTheme
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React, { memo, useEffect, useRef, useState } from "react";
import LabelStyled from "./overrides/labelStyled";
import { CropImage } from "@features/image";
import { InputStyled, CustomInput } from "@features/tabPanel";
import { useTranslation } from "next-i18next";
import { useRequestQuery } from "@lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LoadingScreen } from "@features/loadingScreen";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import DatePickerIcon from "@themes/overrides/icons/datePickerIcon";
import { Session } from "next-auth";
import { DefaultCountry } from "@lib/constants";
import PhoneInput from "react-phone-number-input/input";
import { CustomIconButton } from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import { CountrySelect } from "@features/countrySelect";
import { useCountries } from "@lib/hooks/rest";
import { countries as dialCountries } from "@features/countrySelect/countries";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { isValidPhoneNumber } from "libphonenumber-js";
import CircularProgress from '@mui/material/CircularProgress';
const PhoneCountry: any = memo(({ ...props }) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

interface MyFormProps {
    file?: string;
    person: {
        profession: string;
        firstName: string;
        name: string;
    };
    id_no: any;
    birthdate: any;
    phones: any;
    country: string;
    region: string;
    zip_code: string;
    email: string

}

function Info({ ...props }) {
    const { onSubmit, handleNext } = props;
    const { status, data: session } = useSession();
    const { countries } = useCountries("nationality=true");
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);
    const phoneInputRef = useRef(null);
    const theme = useTheme()
    const loading = status === "loading";
    const router = useRouter();
    const { t, ready } = useTranslation("editProfile", {
        keyPrefix: "steppers.stepper-0",
    });
    const { t: common } = useTranslation('common')
    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const validationSchema = Yup.object().shape({
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
                    }),
            })
        ),
        person: Yup.object().shape({
            name: Yup.string()
                .min(3, t("min-name-error"))
                .max(50, t("max-name-error")).required(
                    t("name-req-error")
                ),

            firstName: Yup.string()
                .min(3, t("min-first-name-error"))
                .max(50, t("max-first-name-error")).required(t("first-name-req-error")),
        }),
        id_no: Yup.string().required(t("id-no-error")),
        email: Yup.string()
            .email(t("email-error")).required(t("email-req-error")),
    });
    const formik = useFormik<MyFormProps>({
        initialValues: {
            file: "",
            person: {
                profession: "doc",
                firstName: "",
                name: "",
            },
            id_no: "",
            birthdate: null,
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            country: "",
            region: "",
            zip_code: "",
            email: ""

        },
        onSubmit: async (values) => {
            handleNext()
        },
        validationSchema,
    });
    const { values, handleSubmit, getFieldProps, setFieldValue, errors, touched } = formik;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log("something prop has changed.", onSubmit);
        // handleSubmit();
    }, [onSubmit]);
    useEffect(() => {
        if (countries?.length > 0) {
            setCountriesData(countries.sort((country: CountryModel) =>
                dialCountries.find(dial => dial.code.toLowerCase() === country.code.toLowerCase() && dial.suggested) ? 1 : -1).reverse());
        }
    }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

    const { data: httpStatesResponse } = useRequestQuery(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const states = (httpStatesResponse as HttpResponse)?.data as any[] || [];
    console.log(countriesData)
    if (!ready || loading)
        return <LoadingScreen button text={"loading-error"} />;


    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("file", URL.createObjectURL(file));
        setOpen(true);
    };
    return (
        <>
            <FormikProvider value={formik}>
                <Stack
                    spacing={2}
                    sx={{ mb: 3 }}
                    component={Form}
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}>
                    <Stack
                        spacing={2}
                        direction={{ xs: "column", lg: "row" }}

                        sx={{
                            "& > label": {
                                position: "relative",
                                zIndex: 1,
                                cursor: "pointer",
                                alignSelf: 'flex-start'
                            },
                        }}>
                        <label htmlFor="contained-button-file">
                            <InputStyled
                                id="contained-button-file"
                                onChange={(e) => handleDrop(e.target.files as FileList)}
                                type="file"
                            />
                            <Avatar src={values.file} sx={{ width: 104, height: 104 }}>
                                <IconUrl path="ic-image" />
                            </Avatar>
                            <IconButton
                                color="primary"
                                type="button"
                                size="small"
                                sx={{
                                    position: "absolute",
                                    bottom: 6,
                                    right: 6,
                                    zIndex: 1,
                                    pointerEvents: "none",
                                    bgcolor: "#fff !important",
                                }}>
                                <IconUrl path="ic-camera-add" />
                            </IconButton>
                        </label>
                        <Stack
                            spacing={2}
                            sx={{
                                width: "100%",
                                "& .MuiBox-root": {
                                    width: "100%",
                                },
                            }}
                            alignSelf="flex-end">

                            <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
                                <Box>
                                    <LabelStyled>{t("pseudo")}</LabelStyled>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id={"profession"}
                                            size="small"
                                            defaultValue={"doc"}
                                            {...getFieldProps("person.profession")}
                                            value={values.person.profession}
                                            placeholder={"choisissez votre titre"}
                                            displayEmpty>
                                            <MenuItem value="doc">Docteur</MenuItem>
                                            <MenuItem value="prof">Professeur</MenuItem>
                                            <MenuItem value="aucun">Aucun Titre</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <LabelStyled>{t("lastname")}{" "}
                                        <Typography variant="caption" color="error">*</Typography>
                                    </LabelStyled>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("lastname_placeholder")}
                                        size="small"
                                        fullWidth
                                        {...getFieldProps("person.name")}
                                        error={Boolean(touched?.person?.name && errors?.person?.name)}
                                        helperText={touched?.person?.name && errors?.person?.name}
                                    />
                                </Box>

                                <Box>
                                    <LabelStyled>{t("firstname")}{" "}
                                        <Typography variant="caption" color="error">*</Typography>
                                    </LabelStyled>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("firstname_placeholder")}
                                        size="small"
                                        fullWidth
                                        {...getFieldProps("person.firstName")}
                                        error={Boolean(touched?.person?.firstName && errors?.person?.firstName)}
                                        helperText={touched?.person?.firstName && errors?.person?.firstName}
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} alignItems='flex-start' spacing={2}>
                        <Stack spacing={.3} width={1}>
                            <Typography>
                                {t("id_no")} {" "}
                                <Typography variant="caption" color="error">*</Typography>
                            </Typography>
                            <TextField
                                variant="outlined"
                                placeholder={t("id_no_placeholder")}
                                size="small"
                                {...getFieldProps("id_no")}
                                fullWidth
                                error={Boolean(touched?.id_no && errors?.id_no)}
                                helperText={(touched?.id_no && errors?.id_no || "" as any)}
                            />
                        </Stack>
                        <Stack spacing={.3} width={1}>
                            <Typography>
                                {t("birthdate")} {" "}
                                <Typography variant="caption" color="error">*</Typography>
                            </Typography>
                            <LocalizationProvider
                                dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    components={{
                                        OpenPickerIcon: DatePickerIcon
                                    }}
                                    renderInput={(props) =>
                                        <TextField

                                            fullWidth size={"small"} {...props} />}
                                    inputFormat={"dd-MM-yyyy"}
                                    value={values.birthdate}

                                    onChange={(newValue) => {
                                        setFieldValue("birthdate", newValue)
                                    }}

                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                    <Stack spacing={1.4}>
                        <Stack>
                            <Typography gutterBottom>
                                {t("phone")}
                                <Typography color='error' variant='caption'>*</Typography>
                            </Typography>
                            <Stack spacing={1.4}>
                                {values.phones.map((phoneObject: any, index: number) => (
                                    <Stack direction={{ xs: 'column', sm: 'row' }} key={index}
                                        spacing={1.25}
                                        width={1}>
                                        <Box minWidth={{ xs: '100%', sm: 150 }}>
                                            <PhoneCountry
                                                initCountry={getFieldProps(`phones[${index}].dial`).value}
                                                onSelect={(state: any) => {
                                                    setFieldValue(`phones[${index}].phone`, "");
                                                    setFieldValue(`phones[${index}].dial`, state);
                                                }}

                                            />
                                        </Box>
                                        <Stack direction={'row'} spacing={1.25} alignItems='flex-start'
                                            width={1}>
                                            {phoneObject && <PhoneInput
                                                ref={phoneInputRef}
                                                international
                                                fullWidth
                                                withCountryCallingCode
                                                error={Boolean(errors.phones && (errors.phones as any)[index])}
                                                country={phoneObject.dial?.code.toUpperCase() as any}
                                                value={getFieldProps(`phones[${index}].phone`) ?
                                                    getFieldProps(`phones[${index}].phone`).value : ""}
                                                onChange={value => setFieldValue(`phones[${index}].phone`, value)}
                                                inputComponent={CustomInput as any}
                                            />}
                                            {index === 0 ? (
                                                <CustomIconButton
                                                    variant="filled"
                                                    sx={{
                                                        p: .8,
                                                        bgcolor: (theme: Theme) => theme.palette.success.light
                                                    }}
                                                    color='success'
                                                    onClick={() => {
                                                        setFieldValue(`phones`, [
                                                            ...values.phones,
                                                            {
                                                                phone: "", dial: doctor_country
                                                            }])
                                                    }}>
                                                    {<AgendaAddViewIcon />}
                                                </CustomIconButton>
                                            ) : (
                                                <IconButton
                                                    sx={{
                                                        "& .react-svg": {
                                                            " & svg": {
                                                                height: 24,
                                                                width: 24
                                                            },
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        const phones = [...values.phones];
                                                        phones.splice(index, 1)
                                                        setFieldValue(`phones`, phones)
                                                    }}
                                                    size="small">
                                                    <IconUrl path="setting/icdelete" />
                                                </IconButton>
                                            )
                                            }
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack spacing={.3}>
                            <Typography>
                                {t("email")} {" "}
                                <Typography variant="caption" color="error">*</Typography>
                            </Typography>
                            <TextField
                                type="email"
                                variant="outlined"
                                placeholder={t("email_placeholder")}
                                size="small"
                                {...getFieldProps("email")}
                                fullWidth
                                error={Boolean(touched?.email && errors?.email)}
                                helperText={touched?.email && errors?.email}

                            />
                        </Stack>
                        <Stack spacing={.3}>
                            <Typography>
                                {t("address")}

                            </Typography>
                            <TextField

                                variant="outlined"
                                placeholder={t("address_placeholder")}
                                size="small"
                                {...getFieldProps("address")}
                                fullWidth
                            />
                        </Stack>
                        <Stack>
                            <Grid container spacing={1.2}>
                                <Grid item md={4} xs={12}>
                                    <Typography gutterBottom>
                                        {t("country")}
                                    </Typography>
                                    <Autocomplete
                                        id={"country"}
                                        disabled={!countriesData}
                                        autoHighlight
                                        disableClearable
                                        size="small"
                                        value={countriesData.find(country => country.uuid === getFieldProps("country").value) ?
                                            countriesData.find(country => country.uuid === getFieldProps("country").value) : ""}
                                        onChange={(e, v: any) => {
                                            setFieldValue("country", v.uuid);
                                        }}
                                        sx={{ color: "text.secondary" }}
                                        options={countriesData.filter(country => country.hasState)}
                                        loading={countriesData.length === 0}
                                        getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                        isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                        renderOption={(props, option) => (
                                            <Stack key={`country-${option.uuid}`}>
                                                <MenuItem
                                                    {...props}
                                                    key={`country-${option.uuid}`}
                                                    value={option.uuid}>
                                                    {option?.code && <Avatar
                                                        sx={{
                                                            width: 26,
                                                            height: 18,
                                                            borderRadius: 0.4
                                                        }}
                                                        alt={"flags"}
                                                        src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
                                                    />}
                                                    <Typography sx={{ ml: 1 }}>{option.name}</Typography>
                                                </MenuItem>
                                            </Stack>
                                        )}
                                        renderInput={params => {
                                            const country = countries?.find(country => country.uuid === getFieldProps("country").value);
                                            params.InputProps.startAdornment = country && (
                                                <InputAdornment position="start">
                                                    {country?.code && <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 16,
                                                            borderRadius: 0.4,
                                                            ml: ".5rem",
                                                            mr: -.8
                                                        }}
                                                        alt={country.name}
                                                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                                    />}
                                                </InputAdornment>
                                            );

                                            return <FormControl component="form" fullWidth
                                                onSubmit={e => e.preventDefault()}>
                                                <TextField color={"info"}
                                                    {...params}
                                                    sx={{ paddingLeft: 0 }}
                                                    placeholder={t("country-placeholder")}
                                                    variant="outlined" fullWidth />
                                            </FormControl>;
                                        }} />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Typography gutterBottom>
                                        {t("region")}
                                    </Typography>
                                    <Autocomplete
                                        id={"region"}
                                        disabled={!states}
                                        autoHighlight
                                        disableClearable
                                        size="small"
                                        value={states?.find(country => country.uuid === getFieldProps("region").value) ?
                                            states.find(country => country.uuid === getFieldProps("region").value) : ""}
                                        onChange={(e, state: any) => {
                                            setFieldValue("region", state.uuid);
                                            setFieldValue("zip_code", state.zipCode);
                                        }}
                                        sx={{ color: "text.secondary" }}
                                        options={states ? states : []}
                                        loading={values.region && states?.length === 0}
                                        getOptionLabel={(option) => option?.name ? option.name : ""}
                                        isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                        renderOption={(props, option) => (
                                            <Stack key={`region-${option.uuid}`}>
                                                <MenuItem
                                                    {...props}
                                                    key={option.uuid}
                                                    value={option.uuid}>
                                                    <Typography sx={{ ml: 1 }}>{option.name}</Typography>
                                                </MenuItem>
                                            </Stack>
                                        )}
                                        renderInput={params =>
                                            <FormControl component="form" fullWidth
                                                onSubmit={e => e.preventDefault()}>
                                                <TextField color={"info"}
                                                    {...params}
                                                    placeholder={t("region-placeholder")}
                                                    sx={{ paddingLeft: 0 }}
                                                    variant="outlined" fullWidth
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {values.region && states?.length === 0 ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}

                                                />
                                            </FormControl>} />

                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Typography gutterBottom>
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
                        </Stack>
                    </Stack>
                    <CropImage
                        open={open}
                        img={values.file}
                        setOpen={setOpen}
                        setFieldValue={setFieldValue}
                    />
                    <Stack
                        spacing={3}
                        direction="row"
                        justifyContent="flex-end"
                        mt={"auto"}>
                        <Button variant="contained" type="submit" color="primary">
                            {t("save_continue")}
                        </Button>
                    </Stack>
                </Stack>
            </FormikProvider>
        </>
    );
}

export default Info;