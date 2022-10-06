import React, {ChangeEvent, memo, useState} from "react";
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
} from "@mui/material";
import Icon from "@themes/urlIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import {addPatientSelector} from "@features/tabPanel";
import {useAppSelector} from "@app/redux/hooks";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";

const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props}/>
    );
})
MyTextInput.displayName = "TextField";

function AddPatientStep2({...props}) {
    const {onNext, selectedPatient, t} = props;
    const router = useRouter();
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState<boolean>(status === "loading");
    const {stepsData} = useAppSelector(addPatientSelector);
    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email")
    });

    const address = selectedPatient ? selectedPatient.address : [];
    const formik = useFormik({
        initialValues: {
            country: address.length > 0 ? address[0]?.city?.country?.uuid : stepsData.step2.country,
            region: address.length > 0 ? address[0]?.city?.uuid : stepsData.step2.region,
            zip_code: address.length > 0 ? address[0]?.postalCode : stepsData.step2.zip_code,
            address: address.length > 0 ? address[0]?.street : stepsData.step2.address,
            email: selectedPatient ? selectedPatient.email : stepsData.step2.email,
            cin: selectedPatient ? selectedPatient?.cin : stepsData.step2.cin,
            family_doctor: selectedPatient ? selectedPatient.familyDoctor : stepsData.step2.family_doctor,
            insurance: selectedPatient ? selectedPatient.insurances.map((insurance: any) => ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance.uuid
            })) : [] as {
                insurance_number: string;
                insurance_uuid: string;
            }[]
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
            handleChange(null, values);
        },
    });


    const {values, handleSubmit, getFieldProps, touched, errors} = formik;

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

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

    const {trigger: triggerAddPatient} = useRequestMutation(null, "add-patient");

    const contacts = (httpContactResponse as HttpResponse)?.data as ContactModel[];
    const countries = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    const handleChange = (event: ChangeEvent | null, {...values}) => {
        const {first_name, last_name, birthdate, phone, gender} = stepsData.step1;
        const {day, month, year} = birthdate;

        const form = new FormData();
        form.append('first_name', first_name)
        form.append('last_name', last_name);
        form.append('phone', JSON.stringify({
            code: values.country.phone,
            value: phone,
            type: "phone",
            "contact_type": contacts[0].uuid,
            "is_public": false,
            "is_support": false
        }));
        form.append('gender', gender);
        form.append('birthdate', `${day}-${month}-${year}`);
        form.append('address', JSON.stringify({
            fr: values.address
        }));
        form.append('insurance', JSON.stringify(values.insurance));
        form.append('email', values.email);
        form.append('family_doctor', values.family_doctor);
        form.append('region', values.region);
        form.append('zip_code', values.zip_code);
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
                    onNext(2);
                }
            });
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
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
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
                                                return <Typography>{country?.name}</Typography>
                                            }}
                                        >
                                            {countries?.map((country) => (
                                                <MenuItem
                                                    key={country.uuid}
                                                    value={country.uuid}>
                                                    <Box component="img"
                                                         src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}/>
                                                    <Typography sx={{ml: 1}}>{country.name}</Typography>
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
                            </Grid>
                        </Box>
                        <Box>
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
                                    <Grid
                                        key={index}
                                        container
                                        spacing={2}
                                        sx={{mt: index > 0 ? 1 : 0}}
                                    >
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <Select
                                                    id={"assurance"}
                                                    size="small"
                                                    {...getFieldProps(`insurance[${index}].insurance_uuid`)}
                                                    displayEmpty={true}
                                                    sx={{color: "text.secondary"}}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
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
