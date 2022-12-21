import {FieldArray, Form, FormikProvider, useFormik} from "formik";
import {
    Autocomplete,
    Box, Button, Card, CardContent, CardHeader, Collapse,
    FormControl,
    FormControlLabel, FormHelperText, Grid, IconButton, IconButtonProps, InputAdornment, MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography, useTheme
} from "@mui/material";
import moment from "moment-timezone";
import React, {memo, useEffect, useRef, useState} from "react";
import {useAppSelector} from "@app/redux/hooks";
import {addPatientSelector, appointmentSelector} from "@features/tabPanel";
import * as Yup from "yup";
import {useTranslation} from "next-i18next";
import Icon from "@themes/urlIcon";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import dynamic from "next/dynamic";
import Image from "next/image";
import {styled} from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {LoadingScreen} from "@features/loadingScreen";
import AddIcCallTwoToneIcon from "@mui/icons-material/AddIcCallTwoTone";
import {LocalizationProvider} from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker} from "@features/datepicker";
import {isValidPhoneNumber} from "libphonenumber-js";
import {countries as dialCountries} from "@features/countrySelect/countries";

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
    const router = useRouter();
    const theme = useTheme();
    const topRef = useRef(null);
    const {t, ready} = useTranslation(translationKey, {
        keyPrefix: translationPrefix,
    });

    const [socialInsured, setSocialInsured] = useState([
        {grouped: "L'assuré social", key: "socialInsured", label: "L'assuré social"},
        {grouped: "L'ascendant", key: "father", label: "Le Pére"},
        {grouped: "L'ascendant", key: "mother", label: "La Mére"},
        {grouped: "L'enfant", key: "child", label: "1er Enfant"},
        {grouped: "L'enfant", key: "child", label: "2ème Enfant"},
        {grouped: "L'enfant", key: "child", label: "3ème Enfant"},
        {grouped: "L'enfant", key: "child", label: "Autre"},
        {grouped: "Le conjoint", key: "partner", label: "Le conjoint"},
    ]);

    const {patient: selectedPatient} = useAppSelector(appointmentSelector);
    const {stepsData: patient} = useAppSelector(addPatientSelector);

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
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
                        test: (value, ctx: any) => isValidPhoneNumber(`${ctx.from[0].value.dial.phone}${value}`),
                    })
                    .matches(phoneRegExp, t("telephone-error"))
                    .required(t("telephone-error"))
            })),
        gender: Yup.string().required(t("gender-error"))
    });
    const address = selectedPatient ? selectedPatient.address : [];
    const formik = useFormik({
        initialValues: {
            patientGroup: patient?.step1.patient_group,
            firstName: selectedPatient
                ? selectedPatient.firstName
                : patient.step1.first_name,
            lastName: selectedPatient
                ? selectedPatient.lastName
                : patient.step1.last_name,
            birthdate: selectedPatient?.birthdate
                ? {
                    day: selectedPatient.birthdate.split("-")[0] as string,
                    month: selectedPatient.birthdate.split("-")[1] as string,
                    year: selectedPatient.birthdate.split("-")[2] as string,
                }
                : patient.step1.birthdate,
            phones: (selectedPatient?.contact?.filter((contact: ContactModel) => contact.type === "phone") &&
            selectedPatient?.contact?.filter((contact: ContactModel) => contact.type === "phone").length > 0) ?
                selectedPatient?.contact.filter((contact: ContactModel) => contact.type === "phone").map((contact: ContactModel) => ({
                    phone: contact.value,
                    dial: dialCountries.find(dial => dial.phone === contact.code)
                })) : patient.step1.phones,
            gender: selectedPatient
                ? selectedPatient.gender === "M" ? "1" : "2"
                : patient.step1.gender,
            country: address.length > 0 && address[0]?.city ? address[0]?.city?.country?.uuid : patient.step2.country,
            region: address.length > 0 && address[0]?.city ? address[0]?.city?.uuid : patient.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : patient.step2.zip_code,
            address: address.length > 0 ? address[0]?.street : patient.step2.address,
            email: selectedPatient ? selectedPatient.email : patient.step2.email,
            cin: selectedPatient ? selectedPatient?.cin : patient.step2.cin,
            family_doctor: selectedPatient ? selectedPatient.familyDoctor : patient.step2.family_doctor,
            insurance: selectedPatient ? selectedPatient.insurances.map((insurance: any) => insurance.insurance && ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid,
                insurance_type: "",
                expanded: false
            })) : [] as {
                insurance_number: string;
                insurance_uuid: string;
                insurance_type: string;
                expanded: boolean;
            }[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async (values) => {
            if (OnSubmit) {
                OnSubmit({...values, contact: contacts[0], countryCode: selectedCountry});
            }
        },
    });
    const {values, handleSubmit, touched, errors, setFieldValue, getFieldProps} = formik;

    const {data: httpContactResponse} = useRequest({
        method: "GET",
        url: "/api/public/contact-type/" + router.locale
    }, SWRNoValidateConfig);

    const {data: httpCountriesResponse} = useRequest({
        method: "GET",
        url: "/api/public/places/countries/" + router.locale
    }, SWRNoValidateConfig);

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {data: httpStatesResponse} = useRequest(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, SWRNoValidateConfig);

    const [expanded, setExpanded] = React.useState(!!selectedPatient);
    const [selectedCountry, setSelectedCountry] = React.useState<any>({
        code: "TN",
        label: "Tunisia",
        phone: "+216"
    });
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
            dial: {
                code: "TN",
                label: "Tunisia",
                phone: "+216"
            }
        }];
        formik.setFieldValue("phones", phones);
    };

    const handleRemovePhone = (index: number) => {
        const phones = [...values.phones];
        phones.splice(index, 1);
        setFieldValue("phones", phones);
    };

    const handleAddInsurance = () => {
        const insurance = [...values.insurance, {insurance_uuid: "", insurance_number: ""}];
        formik.setFieldValue("insurance", insurance);
    };

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
                            <Typography>{t("more-detail")}</Typography>
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
                                <FormControl size="small" fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id={"day"}
                                        {...getFieldProps("birthdate.day")}
                                        displayEmpty
                                        sx={{color: "text.secondary"}}
                                        renderValue={(value: string) => {
                                            if (value?.length === 0) {
                                                return <em>{t("day")}</em>;
                                            }

                                            return <Typography>{value}</Typography>
                                        }}
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                    >
                                        {Array.from(
                                            Array(
                                                moment(
                                                    `1970-01`,
                                                    "YYYY-MM"
                                                ).daysInMonth()
                                            ).keys()
                                        ).map((v, i) => (
                                            <MenuItem
                                                key={i + 1}
                                                value={i + 1 > 9 ? `${i + 1}` : `0${i + 1}`}
                                            >
                                                <Typography>{i + 1}</Typography>
                                            </MenuItem>
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
                                        displayEmpty
                                        sx={{color: "text.secondary"}}
                                        renderValue={(value) => {
                                            if (value?.length === 0) {
                                                return <em>{t("month")}</em>;
                                            }
                                            return <Typography>{moment.monthsShort()[parseInt(value) - 1]}</Typography>
                                        }}
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                    >
                                        {moment.monthsShort().map((v, i) => (
                                            <MenuItem
                                                key={i + 1}
                                                value={i + 1 > 9 ? `${i + 1}` : `0${i + 1}`}
                                            >
                                                <Typography>{v}</Typography>
                                            </MenuItem>
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
                                        displayEmpty
                                        sx={{color: "text.secondary"}}
                                        renderValue={(value) => {
                                            if (value?.length === 0) {
                                                return <em>{t("year")}</em>;
                                            }

                                            return <Typography>{value}</Typography>
                                        }}
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                    >
                                        {Array.from(Array(80).keys()).map((v, i) => (
                                            <MenuItem
                                                key={i}
                                                value={`${moment().year() - 80 + i + 1}`}
                                            >
                                                <Typography>{moment().year() - 80 + i + 1}</Typography>
                                            </MenuItem>
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
                            >
                                {t("country")}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"country"}
                                    size="small"
                                    {...getFieldProps("country")}
                                    displayEmpty
                                    sx={{color: "text.secondary"}}
                                    renderValue={selected => {
                                        if (selected?.length === 0) {
                                            return <em>{t("country-placeholder")}</em>;
                                        }

                                        const country = countries?.find(country => country.uuid === selected);
                                        return <Typography>{country?.name}</Typography>
                                    }}
                                >
                                    {countries?.map((country) => (
                                        <MenuItem
                                            key={country.uuid}
                                            value={country.uuid}>
                                            <Image
                                                width={20}
                                                alt={"flags"}
                                                height={14}
                                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}/>
                                            <Typography sx={{ml: 1}}>{country.name}</Typography>
                                        </MenuItem>)
                                    )}
                                </Select>
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
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id={"region"}
                                            disabled={!values.country}
                                            size="small"
                                            {...getFieldProps("region")}
                                            displayEmpty={true}
                                            sx={{color: "text.secondary"}}
                                            renderValue={selected => {
                                                if (selected?.length === 0) {
                                                    return <em>{t("region-placeholder")}</em>;
                                                }

                                                const state = states?.find(state => state.uuid === selected);
                                                return <Typography>{state?.name}</Typography>
                                            }}
                                        >
                                            {states?.map((state) => (
                                                <MenuItem
                                                    key={state.uuid}
                                                    value={state.uuid}>
                                                    {state.name}
                                                </MenuItem>)
                                            )}
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
                            <Typography sx={{mt: 1.5, mb: 1, textTransform: "capitalize"}}>
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
                            <Box sx={{mb: 1.5}}>
                                <FieldArray
                                    name={"insurance"}
                                    render={arrayHelpers => (
                                        values.insurance.map((
                                            val: { insurance_number: string; insurance_uuid: string; },
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
                                                                {...getFieldProps(`insurance[${index}].insurance_type`)}
                                                                onChange={(event, newValue) => {
                                                                    setFieldValue(`insurance[${index}].insurance_type`, newValue)
                                                                    setFieldValue(`insurance[${index}].expand`, newValue?.key !== "socialInsured")
                                                                }}
                                                                id={"assure"}
                                                                options={socialInsured}
                                                                groupBy={(option) => option.grouped}
                                                                sx={{minWidth: 500}}
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
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label={"Le malade"}/>}
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
                                                                <Select
                                                                    id={"assurance"}
                                                                    size="small"
                                                                    {...getFieldProps(`insurance[${index}].insurance_uuid`)}
                                                                    displayEmpty
                                                                    renderValue={(selected) => {
                                                                        if (selected?.length === 0) {
                                                                            return <em>{t("assurance-placeholder")}</em>;
                                                                        }
                                                                        const insurance = insurances?.find(insurance => insurance.uuid === selected);
                                                                        return <Typography>{insurance?.name}</Typography>
                                                                    }}
                                                                >
                                                                    {insurances?.map(insurance => (
                                                                        <MenuItem
                                                                            key={insurance.uuid}
                                                                            value={insurance.uuid}>
                                                                            <Box key={insurance.uuid}
                                                                                 component="img" width={30} height={30}
                                                                                 src={insurance.logoUrl}/>
                                                                            <Typography
                                                                                sx={{ml: 1}}>{insurance.name}</Typography>
                                                                        </MenuItem>)
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} md={8}>
                                                            <Stack direction="row" spacing={2}>
                                                                <MyTextInput
                                                                    variant="outlined"
                                                                    placeholder={t("assurance-phone-error")}
                                                                    size="small"
                                                                    fullWidth
                                                                    {...getFieldProps(`insurance[${index}].insurance_number`)}
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
                                                                size="small"
                                                                fullWidth
                                                                {...getFieldProps(`insurance[${index}].insurance_social.firstName`)}
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
                                                                size="small"
                                                                fullWidth
                                                                {...getFieldProps(`insurance[${index}].insurance_social.lastName`)}
                                                            />
                                                        </Box>
                                                        <Box mb={1}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Typography variant="body2" color="text.secondary"
                                                                            gutterBottom>
                                                                    {t("birthdate")}
                                                                </Typography>
                                                                <DatePicker
                                                                    onChange={(date: Date) => {
                                                                        console.log(date);
                                                                    }}
                                                                    inputFormat="dd/MM/yyyy"
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
