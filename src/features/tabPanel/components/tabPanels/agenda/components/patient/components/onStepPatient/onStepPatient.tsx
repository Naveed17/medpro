import {FieldArray, Form, FormikProvider, useFormik} from "formik";
import {
    Autocomplete, Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    IconButtonProps,
    InputAdornment,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import moment from "moment-timezone";
import React, {memo, useEffect, useRef, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {addPatientSelector, appointmentSelector, CustomInput} from "@features/tabPanel";
import * as Yup from "yup";
import {useTranslation} from "next-i18next";
import Icon from "@themes/urlIcon";
import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {LoadingScreen} from "@features/loadingScreen";
import AddIcCallTwoToneIcon from "@mui/icons-material/AddIcCallTwoTone";
import {isValidPhoneNumber} from "libphonenumber-js";
import {countries as dialCountries} from "@features/countrySelect/countries";
import {DefaultCountry, SocialInsured} from "@lib/constants";
import {dashLayoutSelector} from "@features/base";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import PhoneInput from 'react-phone-number-input/input';

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

const GroupHeader = styled('div')(({theme}) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper
}));

const GroupItems = styled('ul')({
    padding: 0,
});

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";


const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    "& .MuiTypography-root": {
        fontSize: 12
    },
    "& .MuiSvgIcon-root": {
        width: 20,
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }
}));

function OnStepPatient({...props}) {
    const {
        onNext,
        onClose,
        handleAddPatient = null,
        OnSubmit = null,
        translationKey = "patient",
        translationPrefix = "add-patient",
    } = props;

    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const topRef = useRef(null);
    const phoneInputRef = useRef(null);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const {t, ready} = useTranslation(translationKey, {keyPrefix: translationPrefix});
    const {patient: selectedPatient} = useAppSelector(appointmentSelector);
    const {stepsData: patient} = useAppSelector(addPatientSelector);

    const RegisterPatientSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, t("first-name-error"))
            .max(50, t("first-name-error"))
            .required(t("first-name-error")),
        lastName: Yup.string()
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
                        test: (value) => {
                            return value ? isValidPhoneNumber(value) : false
                        }
                    })
                    .required(t("telephone-error"))
            })),
        gender: Yup.string().required(t("gender-error")),
        birthdate: Yup.object().shape({
            day: Yup.string(),
            month: Yup.string(),
            year: Yup.string()
        }),
        region: Yup.string().when(['address'], {
            is: (address: string) => address && address.length > 0,
            then: Yup.string().required(t("region-error"))
        }),
        country: Yup.string(),
        address: Yup.string(),
        insurance: Yup.array().of(
            Yup.object().shape({
                insurance_number: Yup.string()
                    .min(3, t("assurance-num-error"))
                    .max(50, t("assurance-num-error")),
                insurance_uuid: Yup.string()
                    .min(3, t("assurance-type-error"))
                    .max(50, t("assurance-type-error"))
                    .required(t("assurance-type-error")),
                insurance_social: Yup.object().shape({
                    firstName: Yup.string()
                        .min(3, t("first-name-error"))
                        .max(50, t("first-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("first-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.firstName
                        }),
                    lastName: Yup.string()
                        .min(3, t("last-name-error"))
                        .max(50, t("last-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("last-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.lastName
                        }),
                    birthday: Yup.string()
                        .nullable()
                        .min(3, t("birthday-error"))
                        .max(50, t("birthday-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("birthday-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.birthday
                        }),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string()
                            .test({
                                name: 'phone-value-test',
                                message: t("telephone-error"),
                                test: (value, ctx: any) => {
                                    const isValidPhone = value ? isValidPhoneNumber(value) : false;
                                    return (ctx.from[2].value.insurance_type === "0" || isValidPhone)
                                }
                            }),
                        type: Yup.string(),
                        contact_type: Yup.string(),
                        is_public: Yup.boolean(),
                        is_support: Yup.boolean()
                    })
                }),
                insurance_type: Yup.string(),
                expand: Yup.boolean()
            }))
    });
    const address = selectedPatient && selectedPatient.address ? selectedPatient.address : [];
    const {last_fiche_id} = useAppSelector(dashLayoutSelector);

    const formik = useFormik({
        initialValues: {
            fiche_id: selectedPatient
                ? selectedPatient.fiche_id ? selectedPatient.fiche_id : ""
                : last_fiche_id,//patient.step1.fiche_id,
            firstName: selectedPatient
                ? selectedPatient.firstName
                : patient.step1.first_name,
            lastName: selectedPatient
                ? selectedPatient.lastName
                : patient.step1.last_name,
            birthdate: selectedPatient?.birthdate
                && {
                    day: selectedPatient.birthdate.split("-")[0] as string,
                    month: selectedPatient.birthdate.split("-")[1] as string,
                    year: selectedPatient.birthdate.split("-")[2] as string,
                },
            phones: (selectedPatient?.contact?.filter((contact: ContactModel) => contact.type === "phone") &&
                selectedPatient?.contact?.filter((contact: ContactModel) => contact.type === "phone").length > 0) ?
                selectedPatient?.contact.filter((contact: ContactModel) => contact.type === "phone").map((contact: ContactModel) => ({
                    phone: `${contact.code}${contact.value}`,
                    dial: dialCountries.find(dial => dial.phone === contact.code)
                })) : [{
                    phone: "",
                    dial: doctor_country
                }],
            gender: selectedPatient
                ? selectedPatient.gender === "M" ? "1" : "2"
                : patient.step1.gender,
            nationality: selectedPatient && selectedPatient.nationality ? selectedPatient.nationality.uuid : '',
            country: address.length > 0 && address[0]?.city ? address[0]?.city?.country?.uuid : patient.step2.country,
            region: address.length > 0 && address[0]?.city ? address[0]?.city?.uuid : patient.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : patient.step2.zip_code,
            address: address.length > 0 && address[0]?.street ? address[0]?.street : patient.step2.address,
            email: selectedPatient ? selectedPatient.email : patient.step2.email,
            cin: selectedPatient ? selectedPatient?.idCard : patient.step2.cin,
            profession: selectedPatient ? selectedPatient?.profession : patient.step2.profession,
            family_doctor: selectedPatient && selectedPatient.familyDoctor ? selectedPatient.familyDoctor : patient.step2.family_doctor,
            insurance: selectedPatient ? selectedPatient.insurances.map((insurance: any) => insurance.insurance && ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid,
                insurance_social: {
                    firstName: insurance.insuredPerson ? insurance.insuredPerson.firstName : "",
                    lastName: insurance.insuredPerson ? insurance.insuredPerson.lastName : "",
                    birthday: insurance.insuredPerson ? insurance.insuredPerson.birthday : null,
                    phone: {
                        code: insurance.insuredPerson ? insurance.insuredPerson.contact.code : doctor_country?.phone,
                        value: insurance.insuredPerson ? `${insurance.insuredPerson.contact.code}${insurance.insuredPerson.contact.value}` : "",
                        type: "phone",
                        contact_type: contacts && contacts[0].uuid,
                        is_public: false,
                        is_support: false
                    }
                },
                insurance_type: insurance.type ? insurance.type.toString() : "0",
                expand: insurance.type ? insurance.type.toString() !== "0" : false
            })) : [] as {
                insurance_number: string;
                insurance_uuid: string;
                insurance_social?: InsuranceSocialModel;
                insurance_type: string;
                expand: boolean;
            }[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async (values, formikHelpers) => {
            if (OnSubmit) {
                OnSubmit({...values, contact: contacts[0], countryCode: selectedCountry});
            }
        },
    });
    const {values, handleSubmit, touched, errors, setFieldValue, getFieldProps} = formik;

    const [expanded, setExpanded] = React.useState(!!selectedPatient);
    const [selectedCountry] = React.useState<any>(doctor_country);
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);
    const [value, setValue] = useState("");

    const {data: httpContactResponse} = useRequest({
        method: "GET",
        url: "/api/public/contact-type/" + router.locale
    }, SWRNoValidateConfig);

    const {data: httpCountriesResponse} = useRequest({
        method: "GET",
        url: `/api/public/places/countries/${router.locale}/?nationality=true`
    }, SWRNoValidateConfig);

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {data: httpStatesResponse} = useRequest(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, SWRNoValidateConfig);

    const contacts = (httpContactResponse as HttpResponse)?.data as ContactModel[];
    const countries = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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

    const handleAddInsurance = (event: React.MouseEvent) => {
        event.stopPropagation();
        const insurance = [...values.insurance, {
            insurance_uuid: "",
            insurance_number: "",
            insurance_social: {
                firstName: "",
                lastName: "",
                birthday: null,
                phone: {
                    code: doctor_country?.phone,
                    value: "",
                    type: "phone",
                    contact_type: contacts[0].uuid,
                    is_public: false,
                    is_support: false
                }
            },
            insurance_type: "0",
            expand: false
        }];
        formik.setFieldValue("insurance", insurance);
    };

    const getCountryByCode = (code: string) => {
        return dialCountries.find(country => country.phone === code)
    }

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurance];
        insurance.splice(index, 1);
        formik.setFieldValue("insurance", insurance);
    };

    useEffect(() => {
        if (errors.hasOwnProperty("firstName") ||
            errors.hasOwnProperty("lastName") ||
            errors.hasOwnProperty("phones") ||
            errors.hasOwnProperty("gender")) {
            (topRef.current as unknown as HTMLElement)?.scrollIntoView({behavior: 'smooth'});
        }
    }, [errors, touched]);

    useEffect(() => {
        if (countries) {
            const defaultCountry = countries.find(country =>
                country.code.toLowerCase() === doctor_country?.code.toLowerCase())?.uuid;
            setCountriesData(countries.sort((country: CountryModel) =>
                dialCountries.find(dial => dial.code.toLowerCase() === country.code.toLowerCase() && dial.suggested) ? 1 : -1).reverse());

            !(selectedPatient && selectedPatient.nationality) && setFieldValue("nationality", defaultCountry);
            !(address.length > 0 && address[0]?.city) && setFieldValue("country", defaultCountry);
        }
    }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Stack
                sx={{
                    height: "100%",
                    "& .MuiTypography-root,& .MuiOutlinedInput-input": {
                        textOverflow: "ellipsis",
                        overflow: "hidden"
                    }
                }}
                component={Form}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Stack spacing={2} className="inner-section">
                    <div ref={topRef}/>
                    <Box>
                        <Typography mt={1} variant="h6" color="text.primary" sx={{mb: 1, overflow: "visible"}}>
                            {t("personal-info")}
                        </Typography>

                        <Box mb={2}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("fiche")}
                            </Typography>
                            <TextField
                                placeholder={t("fiche-placeholder")}
                                type="email"
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...getFieldProps("fiche_id")}
                            />
                        </Box>
                        <FormControl component="fieldset" error={Boolean(touched.gender && errors.gender)}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("gender")} {" "}
                                <Typography component="span" color="error">
                                    *
                                </Typography>
                            </Typography>
                            <RadioGroup row aria-label="gender"
                                        sx={{
                                            ml: ".2rem"
                                        }}
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
                            {(touched.gender && errors.gender) &&
                                <FormHelperText color={"error"}>{String(errors.gender)}</FormHelperText>}
                        </FormControl>
                    </Box>
                    <Box className={"inner-box"}>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
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
                            </Grid>
                            <Grid item md={6} xs={12}>
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
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className={"inner-box"}>
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
                                        <CountrySelect
                                            initCountry={getFieldProps(`phones[${index}].dial`).value}
                                            onSelect={(state: any) => {
                                                setFieldValue(`phones[${index}].phone`, "");
                                                setFieldValue(`phones[${index}].dial`, state)
                                            }}/>
                                    </Grid>
                                    <Grid item md={4} lg={7} xs={12}>
                                        {phoneObject && <PhoneInput
                                            ref={phoneInputRef}
                                            international
                                            fullWidth
                                            withCountryCallingCode
                                            {...(getFieldProps(`phones[${index}].phone`) &&
                                                {
                                                    helperText: `Format international: ${getFieldProps(`phones[${index}].phone`)?.value ?
                                                        getFieldProps(`phones[${index}].phone`).value : ""}`
                                                })}
                                            error={Boolean(errors.phones && (errors.phones as any)[index])}
                                            country={phoneObject.dial?.code.toUpperCase() as any}
                                            value={getFieldProps(`phones[${index}].phone`) ?
                                                getFieldProps(`phones[${index}].phone`).value : ""}
                                            onChange={value => setFieldValue(`phones[${index}].phone`, value)}
                                            inputComponent={CustomInput as any}
                                        />}
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
                    <Box>
                        <ExpandMore
                            disableFocusRipple
                            size={"small"}
                            expand={expanded}
                            color={"primary"}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon/>
                            <Typography>{expanded ? t("less-detail") : t("more-detail")}</Typography>
                        </ExpandMore>
                    </Box>

                    <Collapse
                        sx={{
                            "& .MuiBox-root": {
                                mb: 1.5
                            }
                        }}
                        in={expanded} timeout="auto" unmountOnExit>
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                                component="span"
                            >
                                {t("date-of-birth")}
                            </Typography>
                            <Stack spacing={3} direction={{xs: "column", lg: "row"}}>
                                <FormControl
                                    sx={{
                                        "& .MuiOutlinedInput-root button": {
                                            padding: "5px",
                                            minHeight: "auto",
                                            height: "auto",
                                            minWidth: "auto"
                                        }
                                    }}
                                    size="small" fullWidth>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={values.birthdate ? moment(`${values.birthdate.day}/${values.birthdate.month}/${values.birthdate.year}`, "DD/MM/YYYY").toDate() : null}
                                            inputFormat="dd/MM/yyyy"
                                            onChange={(date) => {
                                                if (moment(date).isValid()) {
                                                    setFieldValue("birthdate", {
                                                        day: moment(date).format("DD"),
                                                        month: moment(date).format("MM"),
                                                        year: moment(date).format("YYYY"),
                                                    });
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth/>}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Stack>
                        </Box>
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                {t("nationality")}
                            </Typography>
                            <FormControl fullWidth>
                                <Autocomplete
                                    id={"nationality"}
                                    disabled={!countriesData}
                                    autoHighlight
                                    disableClearable
                                    size="small"
                                    value={countriesData.find(country => country.uuid === getFieldProps("nationality").value) ?
                                        countriesData.find(country => country.uuid === getFieldProps("nationality").value) : ""}
                                    onChange={(e, v: any) => {
                                        setFieldValue("nationality", v.uuid);
                                    }}
                                    sx={{color: "text.secondary"}}
                                    options={countriesData}
                                    loading={countriesData.length === 0}
                                    getOptionLabel={(option: any) => option?.nationality ? option.nationality : ""}
                                    isOptionEqualToValue={(option: any, value) => option.nationality === value.nationality}
                                    renderOption={(props, option) => (
                                        <MenuItem
                                            {...props}
                                            key={`nationality-${option.uuid}`}
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
                                            <Typography sx={{ml: 1}}>{option.nationality}</Typography>
                                        </MenuItem>
                                    )}
                                    renderInput={params => {
                                        const country = countries?.find(country => country.uuid === getFieldProps("nationality").value);
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

                                        return <TextField color={"info"}
                                                          {...params}
                                                          sx={{paddingLeft: 0}}
                                                          placeholder={t("nationality")}
                                                          variant="outlined" fullWidth/>;
                                    }}/>
                            </FormControl>
                        </Box>
                        <fieldset style={{marginBottom: 10}}>
                            <legend style={{fontWeight: "bold"}}>{t("address-group")}</legend>
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
                                    value={getFieldProps("address") ? getFieldProps("address").value : ""}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {t("country")}
                                </Typography>
                                <FormControl fullWidth>
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
                                        sx={{color: "text.secondary"}}
                                        options={countriesData.filter(country => country.hasState)}
                                        loading={countriesData.length === 0}
                                        getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                        isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                        renderOption={(props, option) => (
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
                                                <Typography sx={{ml: 1}}>{option.name}</Typography>
                                            </MenuItem>
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

                                            return <TextField color={"info"}
                                                              {...params}
                                                              sx={{paddingLeft: 0}}
                                                              placeholder={t("country-placeholder")}
                                                              variant="outlined" fullWidth/>;
                                        }}/>
                                </FormControl>
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
                                        <FormControl error={Boolean(touched.region && errors.region)} fullWidth>
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
                                                sx={{color: "text.secondary"}}
                                                options={states ? states : []}
                                                loading={states?.length === 0}
                                                getOptionLabel={(option) => option?.name ? option.name : ""}
                                                isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                                renderOption={(props, option) => (
                                                    <MenuItem
                                                        {...props}
                                                        key={option.uuid}
                                                        value={option.uuid}>
                                                        <Typography sx={{ml: 1}}>{option.name}</Typography>
                                                    </MenuItem>
                                                )}
                                                renderInput={params => <TextField color={"info"}
                                                                                  {...params}
                                                                                  placeholder={t("region-placeholder")}
                                                                                  sx={{paddingLeft: 0}}
                                                                                  variant="outlined" fullWidth/>}/>
                                            {errors.region && (
                                                <FormHelperText error sx={{mx: 0}}>
                                                    {errors.region as string}
                                                </FormHelperText>
                                            )}
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
                                            value={getFieldProps("zip_code") ? getFieldProps("zip_code").value : ""}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </fieldset>
                        <Box>
                            <Typography sx={{mt: 1.5, mb: 1, textTransform: "capitalize"}}>
                                <IconButton
                                    onClick={handleAddInsurance}
                                    className="success-light"
                                    size={"small"}
                                    sx={{
                                        mr: 1.5,
                                        "& svg": {
                                            width: 16,
                                            height: 16
                                        },
                                    }}
                                >
                                    <Icon path="ic-plus"/>
                                </IconButton>
                                {t("assurance")}
                            </Typography>
                            <Box sx={{mb: 1.5}}>
                                <FieldArray
                                    name={"insurance"}
                                    render={() => (
                                        values.insurance.map((
                                            val: any,
                                            index: number) => (
                                            <Card key={index} sx={{marginBottom: 2}}>
                                                <CardHeader
                                                    sx={{
                                                        "& .MuiCardHeader-action": {
                                                            marginTop: 0
                                                        }
                                                    }}
                                                    action={
                                                        <IconButton
                                                            onClick={() => handleRemoveInsurance(index)}
                                                            className="error-light"
                                                            size={"small"}
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
                                                    }
                                                    avatar={
                                                        <Stack direction={"row"} alignItems={"center"}>
                                                            <Autocomplete
                                                                size={"small"}
                                                                value={getFieldProps(`insurance[${index}].insurance_type`) ?
                                                                    SocialInsured.find(insuranceType => insuranceType.value === getFieldProps(`insurance[${index}].insurance_type`).value) : ""}
                                                                onChange={(event, insurance: any) => {
                                                                    setFieldValue(`insurance[${index}].insurance_type`, insurance?.value)
                                                                    setFieldValue(`insurance[${index}].expand`, insurance?.key !== "socialInsured")
                                                                }}
                                                                id={"assure"}
                                                                options={SocialInsured}
                                                                groupBy={(option: any) => option.grouped}
                                                                sx={{minWidth: 500}}
                                                                getOptionLabel={(option: any) => option?.label ? option.label : ""}
                                                                isOptionEqualToValue={(option: any, value: any) => option.label === value?.label}
                                                                renderGroup={(params) => {
                                                                    return (
                                                                        <li key={params.key}>
                                                                            {(params.children as Array<any>)?.length > 1 &&
                                                                                <GroupHeader
                                                                                    sx={{marginLeft: 0.8}}>{params.group}</GroupHeader>}
                                                                            <GroupItems {...(
                                                                                (params.children as Array<any>)?.length > 1 &&
                                                                                {sx: {marginLeft: 2}})}>{params.children}</GroupItems>
                                                                        </li>)
                                                                }}
                                                                renderInput={(params) => {
                                                                    const insurance = SocialInsured.find(insurance => insurance.value === params.inputProps.value);
                                                                    return (<TextField {...params}
                                                                                       placeholder={t("patient-placeholder")}/>)
                                                                }}
                                                            />
                                                        </Stack>
                                                    }/>
                                                <CardContent sx={{padding: "0 16px 16px"}}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {t("assurance-social")}
                                                    </Typography>
                                                    <Grid
                                                        container
                                                        spacing={2}>
                                                        <Grid item xs={12} md={4}>
                                                            <FormControl fullWidth>
                                                                <Autocomplete
                                                                    size={"small"}
                                                                    value={insurances?.find(insurance => insurance.uuid === getFieldProps(`insurance[${index}].insurance_uuid`).value) ?
                                                                        insurances.find(insurance => insurance.uuid === getFieldProps(`insurance[${index}].insurance_uuid`).value) : ""}
                                                                    onChange={(event, insurance: any) => {
                                                                        setFieldValue(`insurance[${index}].insurance_uuid`, insurance?.uuid);
                                                                    }}
                                                                    id={"assurance"}
                                                                    options={insurances ? insurances : []}
                                                                    getOptionLabel={option => option?.name ? option.name : ""}
                                                                    isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                                                    renderOption={(params, option) => (
                                                                        <MenuItem
                                                                            {...params}
                                                                            key={option.uuid}
                                                                            value={option.uuid}>
                                                                            <Avatar
                                                                                sx={{
                                                                                    width: 20,
                                                                                    height: 20,
                                                                                    borderRadius: 0.4
                                                                                }}
                                                                                alt={"insurance"}
                                                                                src={option.logoUrl}
                                                                            />
                                                                            <Typography
                                                                                sx={{ml: 1}}>{option.name}</Typography>
                                                                        </MenuItem>)}
                                                                    renderInput={(params) => {
                                                                        const insurance = insurances?.find(insurance => insurance.uuid === getFieldProps(`insurance[${index}].insurance_uuid`).value);
                                                                        params.InputProps.startAdornment = insurance && (
                                                                            <InputAdornment position="start">
                                                                                {insurance?.logoUrl &&
                                                                                    <Avatar
                                                                                        sx={{
                                                                                            width: 20,
                                                                                            height: 20,
                                                                                            borderRadius: 0.4
                                                                                        }}
                                                                                        alt="insurance"
                                                                                        src={insurance?.logoUrl}
                                                                                    />}
                                                                            </InputAdornment>
                                                                        );

                                                                        return <TextField color={"info"}
                                                                                          {...params}
                                                                                          sx={{paddingLeft: 0}}
                                                                                          placeholder={t("assurance-placeholder")}
                                                                                          variant="outlined"
                                                                                          fullWidth/>;
                                                                    }}/>

                                                                {touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_uuid && (
                                                                    <FormHelperText error sx={{px: 2, mx: 0}}>
                                                                        {(errors.insurance as any)[index].insurance_uuid}
                                                                    </FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} md={8}>
                                                            <Stack direction="row" spacing={2}>
                                                                <MyTextInput
                                                                    variant="outlined"
                                                                    placeholder={t("assurance-phone-error")}
                                                                    error={Boolean(touched.insurance &&
                                                                        (touched.insurance as any)[index]?.insurance_number &&
                                                                        errors.insurance && (errors.insurance as any)[index]?.insurance_number)}
                                                                    helperText={touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_number}
                                                                    size="small"
                                                                    fullWidth
                                                                    {...getFieldProps(`insurance[${index}].insurance_number`)}
                                                                    value={getFieldProps(`insurance[${index}].insurance_number`) ? getFieldProps(`insurance[${index}].insurance_number`).value : ""}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                                <Collapse in={getFieldProps(`insurance[${index}].expand`).value}
                                                          timeout="auto"
                                                          unmountOnExit>
                                                    <CardContent sx={{paddingTop: 0}} className={"insurance-section"}>
                                                        <Box mb={1}>
                                                            <Typography variant="body2" color="text.secondary"
                                                                        gutterBottom>
                                                                {t("first-name")}
                                                            </Typography>
                                                            <TextField
                                                                placeholder={t("first-name-placeholder")}
                                                                variant="outlined"
                                                                error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social.firstName)}
                                                                helperText={
                                                                    Boolean(touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_social?.firstName)
                                                                        ? String((errors.insurance as any)[index].insurance_social.firstName)
                                                                        : undefined
                                                                }
                                                                size="small"
                                                                fullWidth
                                                                {...getFieldProps(`insurance[${index}].insurance_social.firstName`)}
                                                                value={getFieldProps(`insurance[${index}].insurance_social.firstName`) ? getFieldProps(`insurance[${index}].insurance_social.firstName`).value : ""}

                                                            />
                                                        </Box>
                                                        <Box mb={1}>
                                                            <Typography variant="body2" color="text.secondary"
                                                                        gutterBottom>
                                                                {t("last-name")}
                                                            </Typography>
                                                            <TextField
                                                                placeholder={t("last-name-placeholder")}
                                                                variant="outlined"
                                                                error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social?.lastName)}
                                                                helperText={
                                                                    Boolean(touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_social?.lastName)
                                                                        ? String((errors.insurance as any)[index].insurance_social.lastName)
                                                                        : undefined
                                                                }
                                                                size="small"
                                                                fullWidth
                                                                {...getFieldProps(`insurance[${index}].insurance_social.lastName`)}
                                                                value={getFieldProps(`insurance[${index}].insurance_social.lastName`) ? getFieldProps(`insurance[${index}].insurance_social.lastName`).value : ""}

                                                            />
                                                        </Box>
                                                        <Box
                                                            mb={1}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root button": {
                                                                    padding: "5px",
                                                                    minHeight: "auto",
                                                                    height: "auto",
                                                                    minWidth: "auto"
                                                                }
                                                            }}>

                                                            <Typography variant="body2" color="text.secondary"
                                                                        gutterBottom>
                                                                {t("birthday")}
                                                            </Typography>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <DatePicker
                                                                    value={values.insurance[index]?.insurance_social?.birthday ?
                                                                        moment(getFieldProps(`insurance[${index}].insurance_social.birthday`).value, "DD-MM-YYYY").toDate() : null}
                                                                    onChange={(date) => {
                                                                        if (moment(date).isValid()) {
                                                                            setFieldValue(`insurance[${index}].insurance_social.birthday`, moment(date).format('DD-MM-YYYY'));
                                                                        }
                                                                    }}
                                                                    inputFormat="dd/MM/yyyy"
                                                                    renderInput={(params) => <TextField {...params}
                                                                                                        fullWidth/>}
                                                                />
                                                            </LocalizationProvider>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary"
                                                                        gutterBottom>
                                                                {t("telephone")}
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={6} lg={4} xs={12}>
                                                                    <CountrySelect
                                                                        initCountry={getFieldProps(`insurance[${index}].insurance_social.phone.code`) ?
                                                                            getCountryByCode(getFieldProps(`insurance[${index}].insurance_social.phone.code`).value) :
                                                                            doctor_country}
                                                                        onSelect={(state: any) => {
                                                                            setFieldValue(`insurance[${index}].insurance_social.phone.value`, "")
                                                                            setFieldValue(`insurance[${index}].insurance_social.phone.code`, state.phone)
                                                                        }}/>
                                                                </Grid>
                                                                <Grid item md={6} lg={8} xs={12}>
                                                                    <PhoneInput
                                                                        ref={phoneInputRef}
                                                                        international
                                                                        fullWidth
                                                                        error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social.phone)}
                                                                        withCountryCallingCode
                                                                        {...(getFieldProps(`insurance[${index}].insurance_social.phone.value`) &&
                                                                            {
                                                                                helperText: `Format international: ${getFieldProps(`insurance[${index}].insurance_social.phone.value`)?.value ?
                                                                                    getFieldProps(`insurance[${index}].insurance_social.phone.value`).value : ""}`
                                                                            })}
                                                                        country={(getFieldProps(`insurance[${index}].insurance_social.phone.code`) ?
                                                                            getCountryByCode(getFieldProps(`insurance[${index}].insurance_social.phone.code`).value)?.code :
                                                                            doctor_country.code) as any}
                                                                        value={getFieldProps(`insurance[${index}].insurance_social.phone.value`) ?
                                                                            getFieldProps(`insurance[${index}].insurance_social.phone.value`).value : ""}
                                                                        onChange={value => setFieldValue(`insurance[${index}].insurance_social.phone.value`, value)}
                                                                        inputComponent={CustomInput as any}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </CardContent>
                                                </Collapse>
                                            </Card>
                                        )))}
                                />
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
                                value={getFieldProps("email") ? getFieldProps("email").value : ""}
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
                                value={getFieldProps("cin") ? getFieldProps("cin").value : ""}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("profession")}
                            </Typography>
                            <TextField
                                placeholder={t("profession-placeholder")}
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...getFieldProps("profession")}
                                value={getFieldProps("profession") ? getFieldProps("profession").value : ""}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("family_doctor")}
                            </Typography>
                            <TextField
                                placeholder={t("family_doctor-placeholder")}
                                type="text"
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...getFieldProps("family_doctor")}
                                value={getFieldProps("family_doctor") ? getFieldProps("family_doctor").value : ""}
                            />
                        </Box>
                    </Collapse>
                </Stack>

                <Stack
                    {...(handleAddPatient && {
                        sx: {
                            position: "sticky",
                            bottom: "-1.5rem",
                            backgroundColor: theme.palette.common.white,
                            paddingBottom: "1rem"
                        }
                    })}
                    spacing={3}
                    pt={1}
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
