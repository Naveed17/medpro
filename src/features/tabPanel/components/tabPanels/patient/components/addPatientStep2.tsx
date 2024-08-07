import React, { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    ListItem,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import { addPatientSelector, CustomInput, onSubmitPatient } from "@features/tabPanel";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useSession } from "next-auth/react";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { Session } from "next-auth";
import { styled, useTheme } from "@mui/material/styles";
import { DatePicker } from "@features/datepicker";
import { CountrySelect } from "@features/countrySelect";
import { DefaultCountry, PatientContactRelation, SocialInsured } from "@lib/constants";
import { countries as dialCountries } from "@features/countrySelect/countries";
import moment from "moment-timezone";
import { isValidPhoneNumber } from "libphonenumber-js";
import { dashLayoutSelector } from "@features/base";
import PhoneInput from "react-phone-number-input/input";
import { useMedicalEntitySuffix, prepareInsurancesData, useMutateOnGoing } from "@lib/hooks";
import { useContactType, useCountries, useInsurances } from "@lib/hooks/rest";
import { useTranslation } from "next-i18next";
import { setDuplicated } from "@features/duplicateDetected";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { AsyncAutoComplete } from "@features/autoComplete";
import { MyTextInput } from "@features/input";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/Add";
import AddInsurance from "@features/patientInsurance/components/addInsurance";
import { agendaSelector } from "@features/calendar";
import { CustomIconButton } from "@features/buttons";
import { Label } from "@features/label";

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper
}));

const GroupItems = styled('ul')({
    padding: 0,
});


function AddPatientStep2({ ...props }) {
    const { onNext, selectedPatient, t } = props;
    const router = useRouter();
    const theme = useTheme()
    const dispatch = useAppDispatch();
    const { data: session, status } = useSession();
    const phoneInputRef = useRef(null);
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { insurances } = useInsurances();
    const { contacts } = useContactType();
    const { countries } = useCountries("nationality=true", contacts.length > 0);

    const { trigger: mutateOnGoing } = useMutateOnGoing();

    const { t: commonTranslation } = useTranslation("common");
    const { stepsData } = useAppSelector(addPatientSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

    const [collapse, setCollapse] = useState<String[]>(["patient-info"])
    const [loading, setLoading] = useState<boolean>(status === "loading");
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);
    const [addNew, setAddNew] = useState(false);
    const { currentStepper } = useAppSelector(agendaSelector)
    const [patientInsurances, setPatientInsurances] = useState<any>([]);
    const [loadingReq, setLoadingReq] = useState(false);

    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email"),
        insurance: Yup.array().of(
            Yup.object().shape({
                insurance_number: Yup.string()
                    .min(3, t("add-patient.assurance-num-error"))
                    .max(50, t("add-patient.assurance-num-error")),
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
                    birthday: Yup.string().nullable(),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string().test({
                            name: 'phone-value-test',
                            message: t("add-patient.telephone-error"),
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

    const address = selectedPatient ? selectedPatient.address : [];

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const locations = medical_entity?.location ?? null;

    const formik = useFormik({
        initialValues: {
            country: address.length > 0 && address[0]?.city ? address[0]?.city?.country?.uuid : stepsData.step2.country,
            nationality: selectedPatient ? selectedPatient.nationality.uuid : "",
            region: address.length > 0 && address[0]?.city ? address[0]?.city?.uuid : stepsData.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : stepsData.step2.zip_code,
            address: address.length > 0 ? address[0]?.street : stepsData.step2.address,
            email: selectedPatient ? selectedPatient.email : stepsData.step2.email,
            cin: selectedPatient ? selectedPatient?.cin : stepsData.step2.cin,
            addressed_by: selectedPatient ? selectedPatient?.addressed_by : stepsData.step2.addressed_by,
            civil_status: selectedPatient ? selectedPatient?.civil_status : stepsData.step2.civil_status,
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
                        value: insurance.insuredPerson.contact.value.length > 0 ? insurance.insuredPerson.contact.value : "",
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
        onSubmit: async (values) => handleChange(null, values)
    });

    const { values, handleSubmit, getFieldProps, setFieldValue, setValues, touched, errors } = formik;

    const { trigger: triggerAddPatient } = useRequestQueryMutation("/patient/add");
    const { trigger: triggerAddressedBy } = useRequestQueryMutation("/patient/addressed-by/add");

    const { data: httpStatesResponse } = useRequestQuery(contacts.length > 0 && values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const { data: httpProfessionalLocationResponse } = useRequestQuery((httpStatesResponse && locations && (address?.length > 0 && !address[0].city || address.length === 0)) ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/locations/${(locations[0] as string)}/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const states = (httpStatesResponse as HttpResponse)?.data as any[];
    const professionalState = (httpProfessionalLocationResponse as HttpResponse)?.data?.address?.state;

    const handleChange = (event: ChangeEvent | null, { ...values }) => {
        setLoading(true);
        const { fiche_id, picture, first_name, last_name, birthdate, phones, gender } = stepsData.step1;
        const form = new FormData();
        picture.url.length > 0 && form.append('photo', picture.file);
        form.append('fiche_id', fiche_id);
        form.append('first_name', first_name);
        form.append('last_name', last_name);
        form.append('nationality', values.nationality);
        form.append('phone', JSON.stringify(phones.map(phoneData => ({
            code: phoneData.dial?.phone,
            value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
            type: "phone",
            contact_type: contacts[0].uuid,
            is_whatsapp: phoneData.isWhatsapp,
            contact_relation: PatientContactRelation.find(relation => relation.key === phoneData.relation)?.value,
            contact_social: {
                first_name: phoneData.firstName,
                last_name: phoneData.lastName
            },
            is_public: false,
            is_support: false
        }))));
        form.append('gender', gender);
        if (birthdate && birthdate.day.length > 0) {
            form.append('birthdate', `${birthdate.day}-${birthdate.month}-${birthdate.year}`);
        }
        form.append('address', JSON.stringify({
            [router.locale as string]: values.address
        }));
        form.append('insurance', JSON.stringify(prepareInsurancesData({
            insurances: patientInsurances,
            contact: contacts[0].uuid
        })));
        form.append('email', values.email);
        form.append('family_doctor', values.family_doctor);
        form.append('region', values.region);
        form.append('zip_code', values.zip_code);
        form.append('id_card', values.cin);
        form.append('profession', values.profession);
        form.append('note', values.note ?? "");
        values.addressed_by?.uuid && form.append('addressed_by', values.addressed_by.uuid);
        values.civil_status?.uuid && form.append('civil_status', values.civil_status.uuid);

        medicalEntityHasUser && triggerAddPatient({
            method: selectedPatient ? "PUT" : "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${selectedPatient ? selectedPatient.uuid + '/' : ''}${router.locale}`,
            data: form
        }, {
            onSuccess: (res: any) => {
                const { data } = res;
                const { status, data: result } = data;
                setLoading(false);
                if (status === "success") {
                    dispatch(onSubmitPatient(result.data));
                    dispatch(setDuplicated({
                        duplications: result.duplicated,
                        duplicationSrc: result.data,
                        duplicationInit: result.data
                    }));
                    mutateOnGoing();
                    onNext(2);
                }
            }
        });
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

    const handleUpdatePatient = ({ ...props }) => {
        const {
            values,
            selectedBox,
            apcis,
            contacts,
            selectedConv,
            setSelected,
            setSelectedConv,
            resetForm
        } = props

        setPatientInsurances([...patientInsurances, {
            ...values.insurance, box: selectedBox ? selectedBox.uuid : "",
            apcis, contact: contacts?.length > 0 && contacts[0].uuid, medical_entity_has_insurance: selectedConv ? selectedConv.uuid : ""
        }])
        setAddNew(false);
        setSelected(null);
        setSelectedConv(null)
        resetForm();
    }

    useEffect(() => {
        if (countries?.length > 0) {
            const defaultCountry = countries.find(country => country.code.toLowerCase() === doctor_country?.code.toLowerCase())?.uuid as string;
            setCountriesData(countries.sort((country: CountryModel) =>
                dialCountries.find(dial => dial.code.toLowerCase() === country.code.toLowerCase() && dial.suggested) ? 1 : -1).reverse());
            setValues({
                ...values,
                "nationality": !selectedPatient?.nationality ? defaultCountry : "",
                "country": !(address.length > 0 && address[0]?.city) ? defaultCountry : ""
            } as any);
        }
    }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (professionalState) {
            setFieldValue("region", professionalState.uuid);
        }
    }, [professionalState]); // eslint-disable-line react-hooks/exhaustive-deps
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
                onSubmit={handleSubmit}>
                <div className="inner-section">
                    <Stack mb={2} sx={{ cursor: 'pointer' }} onClick={() => {
                        const newCollapse = [...collapse];
                        if (collapse.includes("patient-info")) {
                            const index = collapse.indexOf("patient-info");
                            newCollapse.splice(index, 1);
                            setCollapse(newCollapse);
                        } else {
                            newCollapse.push("patient-info");
                            setCollapse(newCollapse);

                        }
                    }} direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography mt={1} variant="subtitle1" fontSize={18} fontWeight={600}>
                            {t("add-patient.additional-information")}
                        </Typography>
                        <Box sx={{
                            '.react-svg': {
                                transform: collapse.includes("patient-info") ? "scale(1)" : 'scale(-1)'
                            }
                        }}>
                            <Icon path="ic-up-arrow" />
                        </Box>
                    </Stack>
                    <Collapse in={collapse.includes("patient-info")}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography color="grey.500" gutterBottom>
                                    {t("add-patient.address")}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    multiline
                                    rows={1}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Icon path="ic-outline-location" width={20} height={20} color={theme.palette.grey[400]} />
                                            </InputAdornment>
                                        )
                                    }}
                                    placeholder={t("add-patient.address-placeholder")}
                                    size="small"
                                    fullWidth
                                    {...getFieldProps("address")}
                                />
                            </Box>
                            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} width={1}>
                                <Box flex={.75}>
                                    <Typography

                                        color="grey.500"
                                        gutterBottom>
                                        {t("add-patient.country")}
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
                                            sx={{ color: "text.secondary" }}
                                            options={countriesData.filter(country => country.hasState)}
                                            loading={countriesData.length === 0}
                                            getOptionLabel={(option: any) => option?.name ?? ""}
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

                                                return <TextField color={"info"}
                                                    {...params}
                                                    sx={{ paddingLeft: 0 }}
                                                    placeholder={t("add-patient.country-placeholder")}
                                                    variant="outlined" fullWidth />;
                                            }} />
                                    </FormControl>
                                </Box>
                                <Box flex={1}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography
                                                color="grey.500"
                                                gutterBottom>
                                                {t("add-patient.region")}
                                            </Typography>
                                            <FormControl fullWidth>
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
                                                    loading={states?.length === 0}
                                                    getOptionLabel={(option) => option?.name ?? ""}
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
                                                    renderInput={params => <TextField color={"info"}
                                                        {...params}
                                                        placeholder={t("add-patient.region-placeholder")}
                                                        sx={{ paddingLeft: 0 }}
                                                        variant="outlined" fullWidth />} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography

                                                color="grey.500"
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
                            </Stack>
                            <Box>
                                <Typography color="grey.500" gutterBottom>
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
                                    InputProps={
                                        {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Icon path="ic-outline-sms" width={20} height={20} color={theme.palette.grey[500]} />
                                                </InputAdornment>
                                            ),
                                        }
                                    }
                                />
                            </Box>


                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box>
                                            <Typography
                                                color="grey.500"
                                                gutterBottom>
                                                {t("add-patient.nationality")}
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
                                                    sx={{ color: "text.secondary" }}
                                                    options={countriesData}
                                                    loading={countriesData.length === 0}
                                                    getOptionLabel={(option: any) => option?.name ?? ""}
                                                    isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                                    renderOption={(props, option) => (
                                                        <Stack key={`nationality-${option.uuid}`}>
                                                            <MenuItem
                                                                {...props}

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
                                                            sx={{ paddingLeft: 0 }}
                                                            placeholder={t("add-patient.nationality-placeholder")}
                                                            variant="outlined" fullWidth />;
                                                    }} />
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box>
                                            <Typography color="grey.500" gutterBottom>
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box>
                                            <Typography color="grey.500" gutterBottom>
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box>
                                            <Typography color="grey.500" gutterBottom>
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
                                    </Grid>
                                    <Grid item sm={6} xs={12}>
                                        <Typography color="grey.500" gutterBottom>
                                            {t("add-patient.addressed-by")}
                                        </Typography>
                                        <AsyncAutoComplete
                                            freeSolo
                                            loading={loadingReq}
                                            value={values.addressed_by}
                                            url={`${urlMedicalEntitySuffix}/addressedBy/${router.locale}`}
                                            onChangeData={(event: any) => {
                                                if (event?.inputValue || typeof event === "string") {
                                                    // Create a new value from the user input
                                                    setLoadingReq(true);
                                                    const params = new FormData();
                                                    params.append("name", event?.inputValue ?? event);
                                                    triggerAddressedBy({
                                                        method: "POST",
                                                        url: `${urlMedicalEntitySuffix}/addressedBy/${router.locale}`,
                                                        data: params
                                                    }, {
                                                        onSuccess: (result) => {
                                                            const data = (result?.data as HttpResponse)?.data;
                                                            setFieldValue("addressed_by", {
                                                                uuid: data?.uuid,
                                                                name: event?.inputValue ?? event
                                                            });
                                                        },
                                                        onSettled: () => setLoadingReq(false)
                                                    })
                                                } else {
                                                    setFieldValue("addressed_by", event);
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
                                                const { inputValue } = params;
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
                                                        name: `${t("add-patient.add")} "${inputValue}"`,
                                                        isVerified: false,
                                                    });
                                                }
                                                return filtered;
                                            }}
                                            renderOption={(props: any, option: any) => (
                                                <ListItem {...props}>
                                                    <ListItemText primary={`${option?.name}`} />
                                                </ListItem>
                                            )}
                                            isOptionEqualToValue={(option: any, value: any) => option?.uuid === value?.uuid}
                                            placeholder={t("add-patient.addressed-by-placeholder")}
                                        />
                                    </Grid>
                                    <Grid item sm={6} xs={12}>
                                        <Box>
                                            <Typography color="grey.500" gutterBottom>
                                                {t("add-patient.civil-status")}
                                            </Typography>
                                            <AsyncAutoComplete
                                                loading={loadingReq}
                                                value={values.civil_status}
                                                url={`api/public/civil-status/${router.locale}`}
                                                onChangeData={(event: any) => {
                                                    setFieldValue("civil_status", event);
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
                                                        <ListItemText primary={`${option?.name}`} />
                                                    </ListItem>
                                                )}
                                                isOptionEqualToValue={(option: any, value: any) => option?.uuid === value?.uuid}
                                                placeholder={t("add-patient.civil-status-placeholder")}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                        </Stack>
                    </Collapse>

                    <Stack spacing={2} mt={2}>
                        {addNew || patientInsurances.length > 0 && <Typography variant="subtitle2" fontWeight={600}>{t("insurance")}</Typography>}
                        {
                            patientInsurances.map((pi: any) => (
                                <Stack spacing={2} className={"insurance-card"} key={pi.uuid}>
                                    <Stack direction='row' alignItems='center' justifyContent="space-between">
                                        <Stack direction='row' alignItems="center" spacing={1}>
                                            <Typography variant="subtitle2" fontWeight={600}>{insurances.find(ins => ins.uuid === pi.insurance_uuid)?.name}</Typography>

                                        </Stack>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <IconButton size="small">
                                                <Icon width={16} height={16} color={theme.palette.text.secondary} path="ic-delete" />
                                            </IconButton>
                                            <CustomIconButton icon="ic-edit-pen" size="small" />


                                        </Stack>
                                    </Stack>
                                    <CardHeader
                                        avatar={
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img width={25} height={25} src={insurances.find(ins => ins.uuid === pi.insurance_uuid)?.logoUrl.url} alt={"insurance logo"} />
                                        }
                                        title={
                                            <Typography variant="subtitle1">
                                                {pi.insurance_number}
                                            </Typography>
                                        }
                                        subheader={
                                            <Typography variant="subtitle2" color={'text.secondary    '}></Typography>
                                        }
                                    />
                                </Stack>
                            ))
                        }
                        <Collapse in={addNew}>
                            <Box className={"insurance-box"}>
                                {addNew && <AddInsurance {...{ handleUpdatePatient }} />}
                            </Box>
                        </Collapse>
                        <Button
                            onClick={() => setAddNew(prev => !prev)}
                            size="small"
                            sx={{ alignSelf: 'flex-start' }}
                            startIcon={
                                <Icon color={theme.palette.primary.main} width={16} height={16} path={!addNew ? "ic-outline-add-square" : "ic-outline-minus-square"} />
                            }
                        >

                            {("add-patient.add_insurance")}
                        </Button>
                    </Stack>

                    {/*<Collapse in={collapse.includes("insurance-info")}>
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
                                {
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
                                                        size={"small"}
                                                        onClick={() => handleRemoveInsurance(index)}
                                                        className="error-light"
                                                        sx={{
                                                            mr: 1.5,
                                                            mt: .3,
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
                                                                socialInsurances.find(insuranceType => insuranceType.value === getFieldProps(`insurance[${index}].insurance_type`).value) : ""}
                                                            onChange={(event, insurance: any) => {
                                                                setFieldValue(`insurance[${index}].insurance_type`, insurance?.value)
                                                                setFieldValue(`insurance[${index}].expand`, insurance?.key !== "socialInsured")
                                                            }}
                                                            id={"assure"}
                                                            options={socialInsurances}
                                                            groupBy={(option: any) => option.grouped}
                                                            sx={{minWidth: 460}}
                                                            getOptionLabel={(option: any) => option?.label ?? ""}
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
                                                                return (<TextField {...params}
                                                                                   placeholder={t("add-patient.patient-placeholder")}/>)
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
                                                                isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                                                renderOption={(params, option) => (
                                                                    <Stack key={`assurance-${option.uuid}`}>
                                                                        <MenuItem
                                                                            {...params}

                                                                            value={option.uuid}>
                                                                            <Avatar
                                                                                sx={{
                                                                                    width: 20,
                                                                                    height: 20,
                                                                                    borderRadius: 0.4
                                                                                }}
                                                                                alt={"insurance"}
                                                                                src={option.logoUrl.url}
                                                                            />
                                                                            <Typography
                                                                                sx={{ml: 1}}>{option.name}</Typography>
                                                                        </MenuItem>
                                                                    </Stack>
                                                                )}
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
                                                                                    src={insurance?.logoUrl.url}
                                                                                />}
                                                                        </InputAdornment>
                                                                    );

                                                                    return <TextField color={"info"}
                                                                                      {...params}
                                                                                      sx={{paddingLeft: 0}}
                                                                                      placeholder={t("add-patient.assurance-placeholder")}
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
                                            <Collapse in={getFieldProps(`insurance[${index}].expand`).value}
                                                      timeout="auto"
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
                                                            <Typography variant="body2" color="text.secondary"
                                                                        gutterBottom>
                                                                {t("add-patient.birthdate")}
                                                            </Typography>
                                                            <DatePicker
                                                                value={moment(getFieldProps(`insurance[${index}].insurance_social.birthday`).value, "DD-MM-YYYY").toDate()}
                                                                onChange={(date: Date) => {
                                                                    if (moment(date).isValid()) {
                                                                        setFieldValue(`insurance[${index}].insurance_social.birthday`, moment(date).format('DD-MM-YYYY'));
                                                                    }
                                                                }}
                                                                format="dd/MM/yyyy"
                                                            />
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
                                                                        setFieldValue(`insurance[${index}].insurance_social.phone.value`, "");
                                                                        setFieldValue(`insurance[${index}].insurance_social.phone.code`, state.phone);
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
                                    ))
                                }
                            </Box>
                        </Box>
                    </Collapse>*/}

                </div>
                <Stack
                    spacing={3}
                    direction="row"
                    justifyContent={{ xs: "flex-between", sm: 'flex-end' }}
                    className="action">
                    <Stack direction='row' spacing={1} alignItems='center' display={{ xs: 'flex', sm: 'none' }}>
                        {props?.stepperData.map((tab: any, idx: number) =>
                            <Box className={currentStepper > idx ? "submitted" : currentStepper < idx ? "pending" : "Mui-selected"} key={idx}>
                                <Stack className="tab-icon" alignItems="center" justifyContent='center' width={36} height={36} borderRadius={'50%'} border={2} borderColor='transparent' bgcolor={theme.palette.grey[50]}>
                                    <Box className="dot" width={12} height={12} borderRadius={"50%"} bgcolor={theme.palette.grey[500]} />
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center'>
                        <Button
                            variant="text-black"
                            color="primary"
                            onClick={() => onNext(0)}>
                            {t("add-patient.return")}
                        </Button>
                        <LoadingButton
                            disabled={Object.keys(errors).length > 0}
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained">
                            {t("add-patient.register")}
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Stack>
        </FormikProvider>
    );
}

export default AddPatientStep2;
