import {FieldArray, Form, FormikProvider, useFormik} from "formik";
import {
    Box, Button, Collapse,
    FormControl,
    FormControlLabel, FormHelperText, Grid, IconButton, IconButtonProps, InputAdornment, MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import moment from "moment-timezone";
import React, {memo} from "react";
import {useAppSelector} from "@app/redux/hooks";
import {addPatientSelector, appointmentSelector} from "@features/tabPanel";
import * as Yup from "yup";
import {useTranslation} from "next-i18next";
import {
    PhoneRegExp
} from "./config";
import Icon from "@themes/urlIcon";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import dynamic from "next/dynamic";
import Image from "next/image";
import {styled} from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

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
        OnSubmit = null,
        translationKey = "patient",
        translationPrefix = "add-patient",
    } = props;
    const router = useRouter();
    const {t, ready} = useTranslation(translationKey, {
        keyPrefix: translationPrefix,
    });

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
        phone: Yup.string()
            .min(8, t("telephone-error"))
            .matches(PhoneRegExp, t("telephone-error"))
            .required(t("telephone-error")),
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
            phone: selectedPatient ?
                selectedPatient?.contact.find((contact: ContactModel) => contact.type === "phone")?.value
                : patient.step1.phone,
            gender: selectedPatient
                ? selectedPatient.gender === "M" ? "1" : "2"
                : patient.step1.gender,
            country: address.length > 0 ? address[0]?.city?.country?.uuid : patient.step2.country,
            region: address.length > 0 ? address[0]?.city?.uuid : patient.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : patient.step2.zip_code,
            address: address.length > 0 ? address[0]?.street : patient.step2.address,
            email: selectedPatient ? selectedPatient.email : patient.step2.email,
            cin: selectedPatient ? selectedPatient?.cin : patient.step2.cin,
            family_doctor: selectedPatient ? selectedPatient.familyDoctor : patient.step2.family_doctor,
            insurance: selectedPatient ? selectedPatient.insurances.map((insurance: any) => ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance.uuid
            })) : [] as {
                insurance_number: string;
                insurance_uuid: string;
            }[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async (values) => {
            if (OnSubmit) {
                OnSubmit({...values, contact: contacts[0], countryCode: selectedCountry});
            }
        },
    });
    const {values, handleSubmit, touched, errors, isSubmitting, getFieldProps} = formik;

    const {data: httpContactResponse, error: errorHttpContact} = useRequest({
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

    const handleAddInsurance = () => {
        const insurance = [...values.insurance, {insurance_uuid: "", insurance_number: ""}];
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
                                    onSelect={(state: StateModel) => {
                                        setSelectedCountry(state);
                                        const country = countries?.find(country => country.code === state.code);
                                        if (country) {
                                            formik.setFieldValue("country", country.uuid);
                                        }
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
                                {touched.phone && errors.phone}
                            </FormHelperText>
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
                                                key={i}
                                                value={i > 9 ? `${i}` : `0${i + 1}`}
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

                                            return <Typography>{value}</Typography>
                                        }}
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                    >
                                        {moment.monthsShort().map((v, i) => (
                                            <MenuItem
                                                key={i}
                                                value={i > 9 ? `${i}` : `0${i + 1}`}
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
                                        {Array.from(Array(100).keys()).map((v, i) => (
                                            <MenuItem
                                                key={i}
                                                value={`${moment().year() - 100 + i + 1}`}
                                            >
                                                <Typography>{moment().year() - 100 + i + 1}</Typography>
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
                                        if (selected.length === 0) {
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
                                                if (selected.length === 0) {
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
                            <Typography sx={{mt: 1.5, textTransform: "capitalize"}}>
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
                                        values.insurance.map((val, index: number) => (
                                            <Grid
                                                key={index}
                                                container
                                                spacing={2}
                                                sx={{mt: index > 0 ? 0.5 : 0}}
                                            >
                                                <Grid item xs={12} md={4}>
                                                    <FormControl fullWidth>
                                                        <Select
                                                            id={"assurance"}
                                                            size="small"
                                                            {...getFieldProps(`insurance[${index}].insurance_uuid`)}
                                                            displayEmpty
                                                            sx={{color: "text.secondary"}}
                                                            renderValue={(selected) => {
                                                                if (selected.length === 0) {
                                                                    return <em>{t("assurance-placeholder")}</em>;
                                                                }

                                                                const insurance = insurances?.find(insurance => insurance.uuid === selected);
                                                                return <Typography>{insurance?.name}</Typography>
                                                            }}
                                                        >
                                                            {insurances.map(insurance => (
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
                                                    <Stack direction="row" spacing={2} key={`stack-${index}`}>
                                                        <MyTextInput
                                                            variant="outlined"
                                                            placeholder={t("assurance-phone-error")}
                                                            size="small"
                                                            fullWidth
                                                            {...getFieldProps(`insurance[${index}].insurance_number`)}
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
