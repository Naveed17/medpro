import {Form, FormikProvider, useFormik} from "formik";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Collapse,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    IconButtonProps,
    InputAdornment,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {addPatientSelector, appointmentSelector, CustomInput, InputStyled} from "@features/tabPanel";
import * as Yup from "yup";
import {useTranslation} from "next-i18next";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {styled} from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {isValidPhoneNumber} from "libphonenumber-js";
import {countries as dialCountries} from "@features/countrySelect/countries";
import {DefaultCountry, Gender, PatientContactRelation, SocialInsured} from "@lib/constants";
import {dashLayoutSelector} from "@features/base";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import PhoneInput from 'react-phone-number-input/input';
import {useContactType, useCountries, useInsurances} from "@lib/hooks/rest";
import {LoadingButton} from "@mui/lab";
import {CountrySelect} from "@features/countrySelect";
import {arrayUniqueByKey, useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {LoadingScreen} from "@features/loadingScreen";
import {ToggleButtonStyled} from "@features/toolbar";
import AddIcon from "@mui/icons-material/Add";
import {AsyncAutoComplete} from "@features/autoComplete";

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
    const {insurances} = useInsurances();
    const {contacts} = useContactType();
    const {countries} = useCountries("nationality=true");
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation(translationKey, {keyPrefix: translationPrefix});
    const {t: commonTranslation} = useTranslation("common");

    const {patient: selectedPatient} = useAppSelector(appointmentSelector);
    const {stepsData: patient} = useAppSelector(addPatientSelector);
    const {last_fiche_id} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const locations = medical_entity?.location ?? null;

    const RegisterPatientSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, t("first-name-error"))
            .max(50, t("first-name-error"))
            .matches(/^[^-\s][aA-zZء-ي\s]+$/, t("special-text-error"))
            .required(t("first-name-error")),
        lastName: Yup.string()
            .min(3, t("last-name-error"))
            .max(50, t("last-name-error"))
            .matches(/^[^-\s][aA-zZء-ي\s]+$/, t("special-text-error"))
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
        birthdate: Yup.object().nullable().shape({
            day: Yup.string(),
            month: Yup.string(),
            year: Yup.string()
        }),
        country: Yup.string(),
        address: Yup.string(),
        region: Yup.string().when('address', {
            is: (val: string) => val && val.length > 0,
            then: (schema) => schema.required(t("region-error"))
        }),
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
                    old: Yup.string(),
                    birthday: Yup.string().nullable(),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string()
                            .test({
                                name: 'phone-value-test',
                                message: t("telephone-error"),
                                test: (value, ctx: any) => {
                                    const isValidPhone = value ? (value.length > 0 ? isValidPhoneNumber(value) : true) : true;
                                    return (ctx.from[2].value.insurance_type === "0" || isValidPhone);
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
    console.log("selectedPatient", selectedPatient)
    const formik = useFormik({
        initialValues: {
            avatar: '',
            ref_by: "",
            fiche_id: selectedPatient
                ? selectedPatient.fiche_id ? selectedPatient.fiche_id : ""
                : last_fiche_id,//patient.step1.fiche_id,
            firstName: selectedPatient
                ? selectedPatient.firstName
                : patient.step1.first_name,
            lastName: selectedPatient
                ? selectedPatient.lastName
                : patient.step1.last_name,
            old: patient.step1.old,
            birthdate: selectedPatient?.birthdate
                ? {
                    day: selectedPatient.birthdate.split("-")[0] as string,
                    month: selectedPatient.birthdate.split("-")[1] as string,
                    year: selectedPatient.birthdate.split("-")[2] as string,
                } : null,
            phones: (selectedPatient?.contact?.filter((contact: ContactModel) => contact.type === "phone") &&
                selectedPatient?.contact?.filter((contact: ContactModel) => contact.type === "phone").length > 0) ?
                selectedPatient?.contact.filter((contact: ContactModel) => contact.type === "phone").map((contact: ContactModel) => ({
                    phone: `${contact.code}${contact.value}`,
                    dial: dialCountries.find(dial => dial.phone === contact.code),
                    isWhatsapp: !!contact?.isWhatsapp,
                    relation: PatientContactRelation.find(relation => relation.value === contact.contactRelation)?.key ?? "himself",
                    firstName: contact.contactSocial?.firstName ?? "",
                    lastName: contact.contactSocial?.lastName ?? ""
                })) : [{
                    phone: "",
                    dial: doctor_country,
                    isWhatsapp: false,
                    relation: "himself",
                    firstName: "",
                    lastName: ""
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
            addressedBy: selectedPatient && selectedPatient.addressedBy?.length > 0 ? selectedPatient.addressedBy[0] : "",
            civilStatus: selectedPatient && selectedPatient.civilStatus && selectedPatient.civilStatus !== "null" ? selectedPatient.civilStatus : "",
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
                        code: insurance.insuredPerson && insurance.insuredPerson.contact ? insurance.insuredPerson.contact.code : doctor_country?.phone,
                        value: insurance.insuredPerson && insurance.insuredPerson.contact?.value?.length > 0 ? `${insurance.insuredPerson.contact.code}${insurance.insuredPerson.contact.value}` : "",
                        type: "phone",
                        contact_type: contacts.length > 0 && contacts[0].uuid,
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
        onSubmit: async (values) => {
            if (OnSubmit) {
                setLoading(true);
                OnSubmit({...values, contact: contacts[0], countryCode: selectedCountry});
            }
        },
    });
    const {values, handleSubmit, touched, errors, setFieldValue, getFieldProps, setValues} = formik;

    const [expanded, setExpanded] = React.useState(!!selectedPatient);
    const [contactRelations] = useState(PatientContactRelation.map(relation => ({
        ...relation,
        label: commonTranslation(`social_insured.${relation.label}`)
    })));
    const [selectedCountry] = React.useState<any>(doctor_country);
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);
    const [socialInsurances] = useState(SocialInsured?.map((Insured: any) => ({
        ...Insured,
        grouped: commonTranslation(`social_insured.${Insured.grouped}`),
        label: commonTranslation(`social_insured.${Insured.label}`)
    })));
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [loadingRequestAddressedBy, setLoadingRequestAddressedBy] = useState(false);

    const {data: httpStatesResponse} = useRequestQuery(expanded && values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpProfessionalLocationResponse} = useRequestQuery((expanded && locations && (address?.length > 0 && !address[0].city || address.length === 0)) ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/locations/${(locations[0] as string)}/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {trigger: triggerAddressedBy} = useRequestQueryMutation("/patient/addressed-by/add");

    const states = (httpStatesResponse as HttpResponse)?.data as any[] ?? [];
    const professionalState = (httpProfessionalLocationResponse as HttpResponse)?.data?.address?.state ?? null;

    const handleExpandClick = () => {
        setExpanded(!expanded);
        handleDefaultAddress();
    }

    const handleAddPhone = () => {
        const phones = [...values.phones, {
            phone: "",
            dial: doctor_country,
            isWhatsapp: false,
            relation: "himself",
            firstName: "",
            lastName: ""
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
    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("avatar", URL.createObjectURL(file));
    }
    const getCountryByCode = (code: string) => {
        return dialCountries.find(country => country.phone === code)
    }

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurance];
        insurance.splice(index, 1);
        formik.setFieldValue("insurance", insurance);
    }

    const handleDefaultAddress = () => {
        if (countries && !expanded) {
            const defaultCountry = countries.find(country =>
                country.code.toLowerCase() === doctor_country?.code.toLowerCase())?.uuid as string;
            const uniqueCountries = arrayUniqueByKey("nationality", countries);
            setCountriesData(uniqueCountries.sort((country: CountryModel) =>
                dialCountries.find(dial => dial.code.toLowerCase() === country.code.toLowerCase() && dial.suggested) ? 1 : -1).reverse());
            setValues({
                ...values,
                "nationality": !selectedPatient?.nationality ? defaultCountry : "",
                "country": !(address.length > 0 && address[0]?.city) ? defaultCountry : ""
            } as any);
        }
    }

    useEffect(() => {
        if (errors.hasOwnProperty("firstName") ||
            errors.hasOwnProperty("lastName") ||
            errors.hasOwnProperty("phones") ||
            errors.hasOwnProperty("gender")) {
            (topRef.current as unknown as HTMLElement)?.scrollIntoView({behavior: 'smooth'});
        }
    }, [errors, touched]);

    useEffect(() => {
        if (professionalState) {
            setFieldValue("region", professionalState.uuid);
        }
    }, [professionalState]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);
    console.log("values", values)
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
                onSubmit={handleSubmit}>
                <Typography mt={1} variant="h6" color="text.primary" sx={{mb: 1, overflow: "visible"}}>
                    {t("title")}
                </Typography>
                <Stack spacing={2} className="inner-section"
                       sx={{border: `1px dashed ${theme.palette.divider}`, borderRadius: 1}} p={2}>
                    <div ref={topRef}/>
                    <Box>
                        <Stack direction="row" alignItems="flex-end" spacing={2}>
                            <Avatar
                                sx={{width: 70, height: 70, cursor: 'pointer'}}
                                component='label'
                                htmlFor="contained-button-file"
                                src={values.avatar}
                            >
                                <InputStyled
                                    onChange={(e) => handleDrop(e.target.files as FileList)}
                                    id="contained-button-file"
                                    type="file"
                                />
                                <IconUrl path="ic-linear-camera-add" width={28} height={28}/>
                            </Avatar>
                            <Stack>
                                <Typography fontWeight={500} variant="body2" color="text.secondary" gutterBottom>
                                    {t("fiche")}
                                </Typography>
                                <TextField
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            background: theme.palette.grey[50],
                                        }
                                    }}
                                    placeholder={t("fiche-placeholder")}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    {...getFieldProps("fiche_id")}
                                />
                            </Stack>
                            <Stack>
                                <Typography fontWeight={500} variant="body2" color="text.secondary" gutterBottom>
                                    {t("referred_by")}
                                </Typography>
                                <FormControl variant="outlined" fullWidth sx={{
                                    "& .MuiOutlinedInput-root": {
                                        background: theme.palette.common.white,
                                    }
                                }}>
                                    <Select
                                        fullWidth
                                        id="sms-input"
                                        displayEmpty
                                        size='small'
                                        value={values.ref_by}
                                        onChange={(res) => {
                                            setFieldValue("ref_by", res.target.value);
                                        }}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    <Typography
                                                        color={'text.secondary'}>{t("select_referred_by")}</Typography>
                                                )

                                            }
                                            return (
                                                <Typography color={'text.secondary'}>{selected}</Typography>
                                            )


                                        }}>
                                        {[1, 2, 3].map((time) => (
                                            <MenuItem
                                                key={time}
                                                value={time}>
                                                {time}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                        {/* <FormControl component="fieldset" error={Boolean(touched.gender && errors.gender)}>
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
                        </FormControl> */}
                    </Box>
                    <Box className={"inner-box"}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12}>
                                <Stack>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t("gender")} {" "}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <Select
                                        fullWidth
                                        id="sms-input"
                                        displayEmpty
                                        size='small'
                                        value={values.gender}
                                        onChange={(res) => {
                                            setFieldValue("gender", res.target.value);
                                        }}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    <Typography color={'text.secondary'}>{t("gender")}</Typography>
                                                )

                                            }
                                            return (
                                                <Typography
                                                    color={'text.secondary'}>{t(Gender.find(item => item.value === selected)?.title)}</Typography>
                                            )
                                        }}>
                                        {Gender.map((gender) => (
                                            <MenuItem
                                                key={gender.value}
                                                value={gender.value}>
                                                {t(gender.title)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {(touched.gender && errors.gender) &&
                                        <FormHelperText color={"error"}>{String(errors.gender)}</FormHelperText>}
                                </Stack>
                            </Grid>
                            <Grid item md={9} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
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
                                        />
                                        {Boolean(touched.firstName && errors.firstName) &&
                                            <FormHelperText error sx={{maxWidth: "280px"}}>
                                                {String(errors.firstName)}
                                            </FormHelperText>}
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom>
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
                                        />
                                        {Boolean(touched.lastName && errors.lastName) &&
                                            <FormHelperText error sx={{maxWidth: "280px"}}>
                                                {String(errors.lastName)}
                                            </FormHelperText>}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* <Box
                        className={"inner-box"}
                        sx={{
                            "& .MuiOutlinedInput-root button": {
                                padding: "5px",
                                minHeight: "auto",
                                height: "auto",
                                minWidth: "auto",
                            },
                        }}>
                        <Grid container spacing={2}>
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
                                    format="dd/MM/yyyy"
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
                                        openPickerIcon: CalendarPickerIcon
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            ...((values.birthdate !== null || error) && {
                                                error: !moment(`${values.birthdate?.day}/${values.birthdate?.month}/${values.birthdate?.year}`, "DD/MM/YYYY").isValid() ?? false,
                                                ...(!moment(`${values.birthdate?.day}/${values.birthdate?.month}/${values.birthdate?.year}`, "DD/MM/YYYY").isValid() && { helperText: t('invalidDate') })
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
                    </Box> */}

                    <Stack spacing={2}>
                        {values.phones.map((phoneObject, index: number) => (
                            <Stack key={index}>
                                <Box>
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
                                                    renderOption={(params, option) => (
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
                                                                <CountrySelect
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
                                        <Grid container spacing={{xs: 1, md: 2}} pt={1}>
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
                            </Stack>

                        ))}
                    </Stack>
                    <Button size={"small"} sx={{width: 160}} onClick={handleAddPhone} startIcon={<AddIcon/>}>
                        {t("add-contact")}
                    </Button>

                    <Box>
                        <ExpandMore
                            disableFocusRipple
                            size={"small"}
                            expand={expanded}
                            color={"primary"}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more">
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
                                gutterBottom>
                                {t("nationality")}
                            </Typography>
                            <FormControl fullWidth>
                                <Autocomplete
                                    id={"nationality"}
                                    disabled={!countriesData}
                                    autoHighlight
                                    disableClearable
                                    size="small"
                                    value={(countriesData.find(country => country.uuid === values.nationality) ?? null) as any}
                                    onChange={(e, v: any) => setFieldValue("nationality", v.uuid)}
                                    sx={{color: "text.secondary"}}
                                    options={countriesData}
                                    loading={countriesData.length === 0}
                                    getOptionLabel={(option: any) => option?.name ?? ""}
                                    isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                    renderOption={(props, option) => (
                                        <MenuItem {...props}>
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
                        <fieldset style={{marginBottom: 10, padding: 8}}>
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
                                    gutterBottom>
                                    {t("country")}
                                </Typography>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        id={"country"}
                                        disabled={!countriesData}
                                        autoHighlight
                                        disableClearable
                                        size="small"
                                        value={(countriesData.find(country => country.uuid === values.country) ?? null) as any}
                                        onChange={(e, v: any) => {
                                            setFieldValue("country", v.uuid);
                                        }}
                                        sx={{color: "text.secondary"}}
                                        options={countriesData.filter(country => country.hasState)}
                                        loading={countriesData.length === 0}
                                        getOptionLabel={(option: any) => option?.name ?? ""}
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
                                                value={states?.find(country => country.uuid === values.region) ?? null}
                                                onChange={(e, state: any) => {
                                                    setFieldValue("region", state.uuid);
                                                    setFieldValue("zip_code", state.zipCode);
                                                }}
                                                sx={{color: "text.secondary"}}
                                                options={states}
                                                loading={states?.length === 0}
                                                getOptionLabel={(option) => option?.name ?? ""}
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

                        {/*Integrate new concept*/}
                        {/*<Box>
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
                                    <Icon path="ic-plus" />
                                </IconButton>
                                {t("assurance")}
                            </Typography>
                            <Box sx={{ mb: 1.5 }}>
                                <FieldArray
                                    name={"insurance"}
                                    render={() => (
                                        values.insurance.map((
                                            val: any,
                                            index: number) => (
                                            <Card key={index} sx={{ marginBottom: 2 }}>
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
                                                            <Icon path="ic-moin" />
                                                        </IconButton>
                                                    }
                                                    avatar={
                                                        <Stack direction={"row"} alignItems={"center"}>
                                                            <Autocomplete
                                                                size={"small"}
                                                                value={getFieldProps(`insurance[${index}].insurance_type`) ?
                                                                    socialInsurances.find(insuranceType => insuranceType.value === getFieldProps(`insurance[${index}].insurance_type`).value) : ""}
                                                                onChange={(event, insurance: any) => {
                                                                    setFieldValue(`insurance[${index}].insurance_type`, insurance?.value)
                                                                    setFieldValue(`insurance[${index}].expand`, insurance?.key !== "socialInsured")
                                                                }}
                                                                id={"assure"}
                                                                options={socialInsurances}
                                                                groupBy={(option: any) => option.grouped}
                                                                sx={{ minWidth: 500 }}
                                                                getOptionLabel={(option: any) => option?.label ?? ""}
                                                                isOptionEqualToValue={(option: any, value: any) => option.label === value?.label}
                                                                renderGroup={(params) => {
                                                                    return (
                                                                        <li key={params.key}>
                                                                            {(params.children as Array<any>)?.length > 1 &&
                                                                                <GroupHeader
                                                                                    sx={{ marginLeft: 0.8 }}>{params.group}</GroupHeader>}
                                                                            <GroupItems {...(
                                                                                (params.children as Array<any>)?.length > 1 &&
                                                                                { sx: { marginLeft: 2 } })}>{params.children}</GroupItems>
                                                                        </li>)
                                                                }}
                                                                renderInput={(params) => {
                                                                    return (<TextField {...params}
                                                                        placeholder={t("patient-placeholder")} />)
                                                                }}
                                                            />
                                                        </Stack>
                                                    } />
                                                <CardContent sx={{ padding: "0 16px 16px" }}>
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
                                                                    getOptionLabel={option => option?.name ?? ""}
                                                                    isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                                                    renderOption={(params, insuranceItem) => (
                                                                        <MenuItem
                                                                            {...params}
                                                                            key={insuranceItem.uuid}
                                                                            value={insuranceItem.uuid}>
                                                                            {insuranceItem?.logoUrl &&
                                                                                <ImageHandler
                                                                                    alt={insuranceItem?.name}
                                                                                    src={insuranceItem?.logoUrl.url}
                                                                                />}
                                                                            <Typography
                                                                                sx={{ ml: 1 }}>{insuranceItem.name}</Typography>
                                                                        </MenuItem>)}
                                                                    renderInput={(params) => {
                                                                        const insurance = insurances?.find(insurance => insurance.uuid === getFieldProps(`insurance[${index}].insurance_uuid`).value);
                                                                        params.InputProps.startAdornment = insurance && (
                                                                            <InputAdornment position="start">
                                                                                {insurance?.logoUrl &&
                                                                                    <ImageHandler
                                                                                        alt={insurance?.name}
                                                                                        src={insurance?.logoUrl.url}
                                                                                    />}
                                                                            </InputAdornment>
                                                                        );

                                                                        return <TextField color={"info"}
                                                                            {...params}
                                                                            sx={{ paddingLeft: 0 }}
                                                                            placeholder={t("assurance-placeholder")}
                                                                            variant="outlined"
                                                                            fullWidth />;
                                                                    }} />

                                                                {touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_uuid && (
                                                                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
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
                                                    <CardContent sx={{ paddingTop: 0 }} className={"insurance-section"}>
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

                                                            <DatePicker
                                                                value={values.insurance[index]?.insurance_social?.birthday ?
                                                                    moment(getFieldProps(`insurance[${index}].insurance_social.birthday`).value, "DD-MM-YYYY").toDate() : null}
                                                                onChange={(date) => {
                                                                    if (moment(date).isValid()) {
                                                                        setFieldValue(`insurance[${index}].insurance_social.birthday`, moment(date).format('DD-MM-YYYY'));
                                                                    }
                                                                }}
                                                                format="dd/MM/yyyy"
                                                            />
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
                                                                        }} />
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
                                                                            helperText: `${commonTranslation("phone_format")}: ${getFieldProps(`insurance[${index}].insurance_social.phone.value`)?.value ?
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
                        </Box>*/}
                        <Box className={"inner-box"}>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
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
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t("cin")}
                                    </Typography>
                                    <TextField
                                        placeholder={t("cin-placeholder")}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        {...getFieldProps("cin")}
                                        value={getFieldProps("cin").value ?? ""}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box className={"inner-box"}>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
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
                                </Grid>
                                <Grid item md={6} xs={12}>
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
                                </Grid>
                            </Grid>
                        </Box>
                        <Box className={"inner-box"}>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t("addressed-by")}
                                    </Typography>
                                    <AsyncAutoComplete
                                        freeSolo
                                        loading={loadingRequestAddressedBy}
                                        value={values.addressedBy}
                                        url={`${urlMedicalEntitySuffix}/addressedBy/${router.locale}`}
                                        onChangeData={(event: any) => {
                                            if (event?.inputValue || typeof event === "string") {
                                                // Create a new value from the user input
                                                setLoadingRequestAddressedBy(true);
                                                const params = new FormData();
                                                params.append("name", event?.inputValue ?? event);
                                                triggerAddressedBy({
                                                    method: "POST",
                                                    url: `${urlMedicalEntitySuffix}/addressedBy/${router.locale}`,
                                                    data: params
                                                }, {
                                                    onSuccess: (result) => {
                                                        const data = (result?.data as HttpResponse)?.data;
                                                        console.log("data", data);
                                                        setFieldValue("addressedBy", {
                                                            uuid: data?.uuid,
                                                            name: event?.inputValue ?? event
                                                        });
                                                    },
                                                    onSettled: () => setLoadingRequestAddressedBy(false)
                                                })
                                            } else {
                                                setFieldValue("addressedBy", event);
                                            }
                                        }}
                                        getOptionLabel={(option: any) => {
                                            // Value selected with enter, right from the input
                                            if (typeof option === "string") {
                                                return option;
                                            }
                                            // Add "xxx" option created dynamically
                                            if (option.inputValue) {
                                                return option.inputValue;
                                            }
                                            // Regular option
                                            return option.name;
                                        }}
                                        filterOptions={(options: any, params: any) => {
                                            const {inputValue} = params;
                                            const filtered = options.filter((option: any) =>
                                                option.name
                                                    .toLowerCase()
                                                    .includes(inputValue.toLowerCase())
                                            );
                                            // Suggest the creation of a new value
                                            const isExisting = options.some(
                                                (option: any) =>
                                                    inputValue.toLowerCase() ===
                                                    option.name.toLowerCase()
                                            );
                                            if (inputValue !== "" && !isExisting) {
                                                filtered.push({
                                                    inputValue,
                                                    name: `${t("add")} "${inputValue}"`,
                                                    isVerified: false,
                                                });
                                            }
                                            return filtered;
                                        }}
                                        renderOption={(props: any, option: any) => (
                                            <ListItem {...props}>
                                                <ListItemText primary={`${option?.name}`}/>
                                            </ListItem>
                                        )}
                                        isOptionEqualToValue={(option: any, value: any) => option?.uuid === value?.uuid}
                                        placeholder={t("addressed-by-placeholder")}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t("civil-status")}
                                    </Typography>
                                    <AsyncAutoComplete
                                        value={values.civilStatus}
                                        url={`api/public/civil-status/${router.locale}`}
                                        onChangeData={(event: any) => {
                                            setFieldValue("civilStatus", event);
                                        }}
                                        getOptionLabel={(option: any) => {
                                            // Value selected with enter, right from the input
                                            if (typeof option === "string") {
                                                return option;
                                            }
                                            // Add "xxx" option created dynamically
                                            if (option.inputValue) {
                                                return option.inputValue;
                                            }
                                            // Regular option
                                            return option.name;
                                        }}
                                        renderOption={(props: any, option: any) => (
                                            <ListItem {...props}>
                                                <ListItemText primary={`${option?.name}`}/>
                                            </ListItem>
                                        )}
                                        isOptionEqualToValue={(option: any, value: any) => option?.uuid === value?.uuid}
                                        placeholder={t("civil-status-placeholder")}
                                    />
                                </Grid>
                            </Grid>
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
                    className="action">
                    <Button
                        onClick={() => onClose()}
                        variant="text-black"
                        color="primary"
                    >
                        {t("cancel")}
                    </Button>
                    <LoadingButton
                        {...{loading}}
                        disabled={error}
                        variant="contained" type="submit" color="primary">
                        {t("next")}
                    </LoadingButton>
                </Stack>
            </Stack>
        </FormikProvider>
    )
}

export default OnStepPatient;
