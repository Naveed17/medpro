import React, {ChangeEvent, memo, useEffect, useState} from "react";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {
    Autocomplete, Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import {addPatientSelector, onSubmitPatient} from "@features/tabPanel";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import {styled} from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker} from "@features/datepicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {CountrySelect} from "@features/countrySelect";
import {DefaultCountry, SocialInsured} from "@app/constants";
import {countries as dialCountries} from "@features/countrySelect/countries";
import moment from "moment-timezone";
import {isValidPhoneNumber} from "libphonenumber-js";
import {dashLayoutSelector} from "@features/base";

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

const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props}/>
    );
})
MyTextInput.displayName = "TextField";

function AddPatientStep2({...props}) {
    const {onNext, selectedPatient, t} = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data: session, status} = useSession();

    const [loading, setLoading] = useState<boolean>(status === "loading");

    const {stepsData} = useAppSelector(addPatientSelector);
    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email"),
        insurance: Yup.array().of(
            Yup.object().shape({
                insurance_number: Yup.string()
                    .min(3, t("add-patient.assurance-num-error"))
                    .max(50, t("add-patient.assurance-num-error"))
                    .required(t("add-patient.assurance-num-error")),
                insurance_uuid: Yup.string()
                    .min(3, t("add-patient.assurance-type-error"))
                    .max(50, t("add-patient.assurance-type-error"))
                    .required(t("add-patient.assurance-type-error")),
                insurance_social: Yup.object().shape({
                    firstName: Yup.string()
                        .min(3, t("add-patient.first-name-error"))
                        .max(50, t("add-patient.first-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("add-patient.first-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.firstName
                        }),
                    lastName: Yup.string()
                        .min(3, t("add-patient.last-name-error"))
                        .max(50, t("add-patient.last-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("add-patient.last-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.lastName
                        }),
                    birthday: Yup.string()
                        .nullable()
                        .min(3, t("add-patient.birthday-error"))
                        .max(50, t("add-patient.birthday-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("add-patient.birthday-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.birthday
                        }),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string().test({
                            name: 'phone-value-test',
                            message: t("add-patient.telephone-error"),
                            test: (value, ctx: any) => ctx.from[2].value.insurance_type === "0" ||
                                isValidPhoneNumber(`${ctx.from[0].value.code}${value}`)
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

    const address = selectedPatient ? selectedPatient.address : [];

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const formik = useFormik({
        initialValues: {
            country: address.length > 0 && address[0]?.city ? address[0]?.city?.country?.uuid : stepsData.step2.country,
            nationality: selectedPatient ? selectedPatient.nationality.uuid : "",
            region: address.length > 0 && address[0]?.city ? address[0]?.city?.uuid : stepsData.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : stepsData.step2.zip_code,
            address: address.length > 0 ? address[0]?.street : stepsData.step2.address,
            email: selectedPatient ? selectedPatient.email : stepsData.step2.email,
            cin: selectedPatient ? selectedPatient?.cin : stepsData.step2.cin,
            profession: selectedPatient ? selectedPatient?.cin : stepsData.step2.profession,
            family_doctor: selectedPatient && selectedPatient.familyDoctor ? selectedPatient.familyDoctor : stepsData.step2.family_doctor,
            insurance: selectedPatient ? selectedPatient.insurances.map((insurance: any) => insurance.insurance && ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid,
                insurance_social: {
                    firstName: insurance.insuredPerson.firstName,
                    lastName: insurance.insuredPerson.lastName,
                    birthday: insurance.insuredPerson.birthday,
                    phone: {
                        code: insurance.insuredPerson.contact.code,
                        value: insurance.insuredPerson.contact.value,
                        type: "phone",
                        contact_type: contacts[0].uuid,
                        is_public: false,
                        is_support: false
                    }
                },
                insurance_type: insurance.type ? insurance.type.toString() : "",
                expand: insurance.type ? insurance.type.toString() !== "0" : false
            })) : [] as {
                insurance_number: string;
                insurance_uuid: string;
                insurance_social?: InsuranceSocialModel;
                insurance_type: string;
                expand: boolean;
            }[]
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
            handleChange(null, values);
        },
    });

    const {values, handleSubmit, getFieldProps, setFieldValue, touched, errors} = formik;

    const {data: httpStatesResponse} = useRequest(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, SWRNoValidateConfig);

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

    const {trigger: triggerAddPatient} = useRequestMutation(null, "add-patient");

    const contacts = (httpContactResponse as HttpResponse)?.data as ContactModel[];
    const countries = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const {mutate: mutateOnGoing} = useAppSelector(dashLayoutSelector);
    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    useEffect(() => {
        if (countries) {
            const defaultCountry = countries.find(country =>
                country.code.toLowerCase() === doctor_country?.code.toLowerCase())?.uuid as string;
            setFieldValue("nationality", defaultCountry);
            setFieldValue("country", defaultCountry);
        }
    }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (event: ChangeEvent | null, {...values}) => {
        setLoading(true);

        const {fiche_id, picture, first_name, last_name, birthdate, phones, gender} = stepsData.step1;
        const {day, month, year} = birthdate;
        const form = new FormData();
        picture.url.length > 0 && form.append('photo', picture.file);
        form.append('fiche_id', fiche_id);
        form.append('first_name', first_name);
        form.append('last_name', last_name);
        form.append('nationality', values.nationality);
        form.append('phone', JSON.stringify(phones.map(phoneData => ({
            code: phoneData.dial?.phone,
            value: phoneData.phone,
            type: "phone",
            contact_type: contacts[0].uuid,
            is_public: false,
            is_support: false
        }))));
        form.append('gender', gender);
        if (day && month && year) {
            form.append('birthdate', `${day}-${month}-${year}`);
        }
        form.append('address', JSON.stringify({
            fr: values.address
        }));
        values.insurance.map((insurance: InsurancesModel) => {
            if (insurance.insurance_type === "0") {
                delete insurance['insurance_social'];
            }
        });
        form.append('insurance', JSON.stringify(values.insurance));
        form.append('email', values.email);
        form.append('family_doctor', values.family_doctor);
        form.append('region', values.region);
        form.append('zip_code', values.zip_code);
        form.append('id_card', values.cin);
        form.append('profession', values.profession);
        form.append('note', values.note ? values.note : "");

        triggerAddPatient({
            method: selectedPatient ? "PUT" : "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/patients/${selectedPatient ? selectedPatient.uuid + '/' : ''}${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
            data: form
        }, TriggerWithoutValidation).then(
            (res: any) => {
                const {data} = res;
                const {status} = data;
                setLoading(false);
                if (status === "success") {
                    mutateOnGoing && mutateOnGoing();
                    dispatch(onSubmitPatient(data.data));
                    onNext(2);
                }
            }
        );
    };

    const getCountryByCode = (code: string) => {
        return dialCountries.find(country => country.phone === code)
    }

    const handleAddInsurance = () => {
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

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurance];
        insurance.splice(index, 1);
        formik.setFieldValue("insurance", insurance);
    };

    return (
        <FormikProvider value={formik}>
            <Stack
                sx={{
                    height: "100%",
                    "& .insurance-label": {
                        width: 160,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }
                }}
                component={Form}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <div className="inner-section">
                    <Stack spacing={2}>
                        <Typography mt={1} variant="h6" color="text.primary">
                            {t("add-patient.additional-information")}
                        </Typography>
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                {t("add-patient.nationality")}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"nationality"}
                                    disabled={!countries}
                                    size="small"
                                    {...getFieldProps("nationality")}
                                    displayEmpty
                                    sx={{color: "text.secondary"}}
                                    renderValue={selected => {
                                        if (selected?.length === 0) {
                                            return <em>{t("add-patient.nationality-placeholder")}</em>;
                                        }

                                        const country = countries?.find(country => country.uuid === selected);
                                        return (
                                            <Stack direction={"row"} alignItems={"center"}>
                                                {country?.code && <Avatar
                                                    sx={{
                                                        width: 26,
                                                        height: 18,
                                                        borderRadius: 0.4,
                                                        ml: 0,
                                                        mr: ".5rem"
                                                    }}
                                                    alt="flag"
                                                    src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}
                                                />}
                                                <Typography>{country?.nationality}</Typography>
                                            </Stack>)
                                    }}>
                                    {countries?.map((country) => (
                                        <MenuItem
                                            key={country.uuid}
                                            value={country.uuid}>
                                            {country?.code && <Avatar
                                                sx={{
                                                    width: 26,
                                                    height: 18,
                                                    borderRadius: 0.4
                                                }}
                                                alt={"flags"}
                                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                            />}
                                            <Typography sx={{ml: 1}}>{country.nationality}</Typography>
                                        </MenuItem>)
                                    )}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("add-patient.address")}
                            </Typography>
                            <TextField
                                variant="outlined"
                                multiline
                                rows={3}
                                placeholder={t("add-patient.address-placeholder")}
                                size="small"
                                fullWidth
                                {...getFieldProps("address")}
                            />
                        </Box>
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                {t("add-patient.country")}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"country"}
                                    disabled={!countries}
                                    size="small"
                                    {...getFieldProps("country")}
                                    displayEmpty
                                    sx={{color: "text.secondary"}}
                                    renderValue={selected => {
                                        if (selected?.length === 0) {
                                            return <em>{t("add-patient.country-placeholder")}</em>;
                                        }
                                        const country = countries?.find(country => country.uuid === selected);
                                        return (
                                            <Stack direction={"row"} alignItems={"center"}>
                                                {country?.code && <Avatar
                                                    sx={{
                                                        width: 26,
                                                        height: 18,
                                                        borderRadius: 0.4,
                                                        ml: 0,
                                                        mr: ".5rem"
                                                    }}
                                                    alt="flag"
                                                    src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}
                                                />}
                                                <Typography>{country?.name}</Typography>
                                            </Stack>)
                                    }}>
                                    {countries?.filter(country => country.hasState).map((country) => (
                                        <MenuItem
                                            key={country.uuid}
                                            value={country.uuid}>
                                            {country?.code && <Avatar
                                                sx={{
                                                    width: 26,
                                                    height: 18,
                                                    borderRadius: 0.4
                                                }}
                                                alt={"flags"}
                                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                            />}
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
                                        gutterBottom>
                                        {t("add-patient.region")}
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="region-select-label"
                                            id={"region"}
                                            disabled={!values.country && !states}
                                            size="small"
                                            {...getFieldProps("region")}
                                            displayEmpty={true}
                                            sx={{color: "text.secondary"}}
                                            renderValue={selected => {
                                                if (selected?.length === 0) {
                                                    return <em>{t("add-patient.region-placeholder")}</em>;
                                                }
                                                const state = states?.find(state => state.uuid === selected);
                                                return <Typography>{state?.name}</Typography>
                                            }}>
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
                                        {t("add-patient.zip")}
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
                            <Typography sx={{mb: 1.5, textTransform: "capitalize"}}>
                                <IconButton
                                    onClick={handleAddInsurance}
                                    className="success-light"
                                    size={"small"}
                                    sx={{
                                        mr: 1.5,
                                        "& svg": {
                                            width: 16,
                                            height: 16
                                        }
                                    }}
                                >
                                    <Icon path="ic-plus"/>
                                </IconButton>
                                {t("add-patient.assurance")}
                            </Typography>
                            <Box>
                                {values.insurance.map((
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
                                                        onChange={(event, insurance) => {
                                                            setFieldValue(`insurance[${index}].insurance_type`, insurance?.value)
                                                            setFieldValue(`insurance[${index}].expand`, insurance?.key !== "socialInsured")
                                                        }}
                                                        id={"assure"}
                                                        options={SocialInsured}
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
                                                        renderInput={(params) => {
                                                            const insurance = SocialInsured.find(insurance => insurance.value === params.inputProps.value);
                                                            return (<TextField {...params}
                                                                               inputProps={{
                                                                                   ...params.inputProps,
                                                                                   value: insurance?.label
                                                                               }}
                                                                               placeholder={"Le malade"}/>)
                                                        }}
                                                    />
                                                </Stack>
                                            }/>
                                        <CardContent sx={{padding: "0 16px 16px"}}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {t("add-patient.assurance-social")}
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
                                                            error={Boolean(touched.insurance &&
                                                                (touched.insurance as any)[index]?.insurance_uuid &&
                                                                errors.insurance && (errors.insurance as any)[index]?.insurance_uuid)}
                                                            displayEmpty
                                                            renderValue={(selected) => {
                                                                if (selected?.length === 0) {
                                                                    return <em>{t("add-patient.assurance-placeholder")}</em>;
                                                                }
                                                                const insurance = insurances?.find(insurance => insurance.uuid === selected);
                                                                return (
                                                                    <Stack direction={"row"}>
                                                                        {insurance && <Avatar
                                                                            sx={{
                                                                                width: 20,
                                                                                height: 20,
                                                                                borderRadius: 0.4
                                                                            }}
                                                                            alt={"insurance"}
                                                                            src={insurance.logoUrl}
                                                                        />}
                                                                        <Typography className={"insurance-label"}
                                                                            ml={1}>{insurance?.name}</Typography>
                                                                    </Stack>)
                                                            }}
                                                        >
                                                            {insurances?.map(insurance => (
                                                                <MenuItem
                                                                    key={insurance.uuid}
                                                                    value={insurance.uuid}>
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 20,
                                                                            height: 20,
                                                                            borderRadius: 0.4
                                                                        }}
                                                                        alt={"insurance"}
                                                                        src={insurance.logoUrl}
                                                                    />
                                                                    <Typography
                                                                        sx={{ml: 1}}>{insurance.name}</Typography>
                                                                </MenuItem>)
                                                            )}
                                                        </Select>
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
                                                            placeholder={t("add-patient.assurance-phone-error")}
                                                            size="small"
                                                            error={Boolean(touched.insurance &&
                                                                (touched.insurance as any)[index]?.insurance_number &&
                                                                errors.insurance && (errors.insurance as any)[index]?.insurance_number)}
                                                            helperText={touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_number}
                                                            fullWidth
                                                            {...getFieldProps(`insurance[${index}].insurance_number`)}
                                                        />

                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        <Collapse in={getFieldProps(`insurance[${index}].expand`).value} timeout="auto"
                                                  unmountOnExit>
                                            <CardContent sx={{paddingTop: 0}} className={"insurance-section"}>
                                                <Box mb={1}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {t("add-patient.first-name")}
                                                    </Typography>
                                                    <TextField
                                                        placeholder={t("add-patient.first-name-placeholder")}
                                                        error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social.firstName)}
                                                        helperText={
                                                            Boolean(touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_social?.firstName)
                                                                ? String((errors.insurance as any)[index].insurance_social.firstName)
                                                                : undefined
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        {...getFieldProps(`insurance[${index}].insurance_social.firstName`)}
                                                    />
                                                </Box>
                                                <Box mb={1}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {t("add-patient.last-name")}
                                                    </Typography>
                                                    <TextField
                                                        placeholder={t("add-patient.last-name-placeholder")}
                                                        variant="outlined"
                                                        size="small"
                                                        error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social?.lastName)}
                                                        helperText={
                                                            Boolean(touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_social?.lastName)
                                                                ? String((errors.insurance as any)[index].insurance_social.lastName)
                                                                : undefined
                                                        }
                                                        fullWidth
                                                        {...getFieldProps(`insurance[${index}].insurance_social.lastName`)}
                                                    />
                                                </Box>
                                                <Box mb={1} sx={{
                                                    "& .MuiOutlinedInput-root button": {
                                                        padding: "5px",
                                                        minHeight: "auto",
                                                        height: "auto",
                                                        minWidth: "auto"
                                                    }
                                                }}>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            {t("add-patient.birthdate")}
                                                        </Typography>
                                                        <DatePicker
                                                            value={moment(getFieldProps(`insurance[${index}].insurance_social.birthday`).value, "DD-MM-YYYY")}
                                                            onChange={(date: Date) => {
                                                                setFieldValue(`insurance[${index}].insurance_social.birthday`, moment(date).format('DD-MM-YYYY'));
                                                            }}
                                                            inputFormat="dd/MM/yyyy"
                                                        />
                                                    </LocalizationProvider>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {t("add-patient.telephone")}
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={6} lg={4} xs={12}>
                                                            <CountrySelect
                                                                initCountry={getFieldProps(`insurance[${index}].insurance_social.phone.code`) ?
                                                                    getCountryByCode(getFieldProps(`insurance[${index}].insurance_social.phone.code`).value) : DefaultCountry}
                                                                onSelect={(state: any) => {
                                                                    setFieldValue(`insurance[${index}].insurance_social.phone.code`, state.phone)
                                                                }}/>
                                                        </Grid>
                                                        <Grid item md={6} lg={8} xs={12}>
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                {...getFieldProps(`insurance[${index}].insurance_social.phone.value`)}
                                                                error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social?.phone?.value)}
                                                                helperText={
                                                                    Boolean(touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_social?.phone)
                                                                        ? String((errors.insurance as any)[index].insurance_social.phone.value)
                                                                        : undefined
                                                                }
                                                                fullWidth
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            {getFieldProps(`insurance[${index}].insurance_social.phone.code`)?.value}
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
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("add-patient.email")}
                            </Typography>
                            <TextField
                                placeholder={t("add-patient.email-placeholder")}
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
                                {t("add-patient.cin")}
                            </Typography>
                            <TextField
                                placeholder={t("add-patient.cin-placeholder")}
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...getFieldProps("cin")}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("add-patient.profession")}
                            </Typography>
                            <TextField
                                placeholder={t("add-patient.profession-placeholder")}
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...getFieldProps("profession")}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {t("add-patient.family_doctor")}
                            </Typography>
                            <TextField
                                placeholder={t("add-patient.family_doctor-placeholder")}
                                type="text"
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...getFieldProps("family_doctor")}
                            />
                        </Box>
                    </Stack>
                </div>
                <Stack
                    spacing={3}
                    direction="row"
                    justifyContent="flex-end"
                    className="action"
                >
                    <Button
                        variant="text-black"
                        color="primary"
                        onClick={() => onNext(0)}
                    >
                        {t("add-patient.return")}
                    </Button>

                    <LoadingButton
                        disabled={Object.keys(errors).length > 0}
                        type="submit"
                        color="primary"
                        loading={loading}
                        variant="contained"
                    >
                        {t("add-patient.register")}
                    </LoadingButton>
                </Stack>
            </Stack>
        </FormikProvider>
    );
}

export default AddPatientStep2;
