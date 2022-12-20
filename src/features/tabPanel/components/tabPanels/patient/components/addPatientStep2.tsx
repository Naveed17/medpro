import React, {ChangeEvent, memo, SyntheticEvent, useState} from "react";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Box,
    FormControl,
    TextField,
    Grid,
    Button,
    Select,
    MenuItem,
    Stack,
    IconButton,
    Card,
    CardContent,
    Collapse,
    IconButtonProps,
    CardHeader,
    Autocomplete,
    InputAdornment,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import {addPatientSelector, onSubmitPatient} from "@features/tabPanel";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import Image from "next/image";
import {styled} from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker} from "@features/datepicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {CountrySelect} from "@features/countrySelect";

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
    const [selectedCountry, setSelectedCountry] = React.useState<any>({
        code: "TN",
        label: "Tunisia",
        phone: "+216"
    });

    const {stepsData} = useAppSelector(addPatientSelector);
    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email")
    });

    const address = selectedPatient ? selectedPatient.address : [];
    const formik = useFormik({
        initialValues: {
            country: address.length > 0 && address[0]?.city ? address[0]?.city?.country?.uuid : stepsData.step2.country,
            region: address.length > 0 && address[0]?.city ? address[0]?.city?.uuid : stepsData.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : stepsData.step2.zip_code,
            address: address.length > 0 ? address[0]?.street : stepsData.step2.address,
            email: selectedPatient ? selectedPatient.email : stepsData.step2.email,
            cin: selectedPatient ? selectedPatient?.cin : stepsData.step2.cin,
            family_doctor: selectedPatient && selectedPatient.familyDoctor ? selectedPatient.familyDoctor : stepsData.step2.family_doctor,
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
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
            handleChange(null, values);
        },
    });

    const {values, handleSubmit, getFieldProps, setFieldValue, touched, errors} = formik;

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

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

    const {trigger: triggerAddPatient} = useRequestMutation(null, "add-patient");

    const contacts = (httpContactResponse as HttpResponse)?.data as ContactModel[];
    const countries = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    const handleChange = (event: ChangeEvent | null, {...values}) => {
        const {first_name, last_name, birthdate, phones, gender} = stepsData.step1;
        const {day, month, year} = birthdate;
        const form = new FormData();
        form.append('first_name', first_name)
        form.append('last_name', last_name);
        form.append('phone', JSON.stringify(phones.map(phoneData => ({
            code: phoneData.dial.phone,
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
        form.append('insurance', JSON.stringify(values.insurance));
        form.append('email', values.email);
        form.append('family_doctor', values.family_doctor);
        form.append('region', values.region);
        form.append('zip_code', values.zip_code);
        form.append('id_card', values.cin);
        setLoading(true);
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
                    dispatch(onSubmitPatient(data.data));
                    onNext(2);
                }
            }
        );
    };

    const handleAddInsurance = () => {
        const insurance = [...values.insurance, {
            insurance_uuid: "",
            insurance_number: "",
            insurance_type: "",
            expanded: false
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
                sx={{height: "100%"}}
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
                                            <Stack direction={"row"}>
                                                <Image width={20} height={14}
                                                       alt={"flag"}
                                                       src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}/>
                                                <Typography ml={1}>{country?.name}</Typography>
                                            </Stack>)
                                    }}>
                                    {countries?.map((country) => (
                                        <MenuItem
                                            key={country.uuid}
                                            value={country.uuid}>
                                            <Image width={20} height={14}
                                                   alt={"flag"}
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
                                        gutterBottom>
                                        {t("add-patient.region")}
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="demo-simple-select-label"
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
                                                            displayEmpty
                                                            renderValue={(selected) => {
                                                                if (selected?.length === 0) {
                                                                    return <em>{t("add-patient.assurance-placeholder")}</em>;
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
                                                            placeholder={t("add-patient.assurance-phone-error")}
                                                            size="small"
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
                                                        fullWidth
                                                        {...getFieldProps(`insurance[${index}].insurance_social.lastName`)}
                                                    />
                                                </Box>
                                                <Box mb={1}>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            {t("add-patient.birthdate")}
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
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {t("add-patient.telephone")}
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
