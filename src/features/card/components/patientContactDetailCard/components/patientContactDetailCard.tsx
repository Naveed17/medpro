import React, {useState} from "react";
import RootStyled from "./overrides/rootStyle";
import {
    Typography,
    Skeleton,
    CardContent,
    Grid,
    Stack,
    Box,
    InputBase, AppBar, Toolbar, Button, IconButton, MenuItem, Select,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useFormik, Form, FormikProvider} from "formik";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import CloseIcon from '@mui/icons-material/Close';

import IconUrl from "@themes/urlIcon";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {Session} from "next-auth";
import dynamic from "next/dynamic";
import {countries} from "@features/countrySelect/countries";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import Image from "next/image";
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import {isValidPhoneNumber} from "libphonenumber-js";
import Icon from "@themes/urlIcon";

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

function PatientContactDetailCard({...props}) {
    const {patient, mutate: mutatePatientData, mutatePatientList = null, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config.add-patient",
    });

    const [editable, setEditable] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const RegisterPatientSchema = Yup.object().shape({
        country: Yup.string()
            .min(3, t("country-error")),
        region: Yup.string()
            .min(3, t("region-error")),
        zip_code: Yup.string(),
        address: Yup.string(),
        phones: Yup.array().of(
            Yup.object().shape({
                code: Yup.string(),
                value: Yup.string()
                    .test({
                        name: 'is-phone',
                        message: t("telephone-error"),
                        test: (value, ctx: any) => isValidPhoneNumber(`${ctx.from[0].value.code}${value}`),
                    })
                    .matches(phoneRegExp, t("telephone-error"))
                    .required(t("telephone-error"))
            })),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            country: !loading && patient?.address.length > 0 && patient?.address[0]?.city ? patient?.address[0]?.city?.country?.uuid : "",
            region: !loading && patient?.address.length > 0 && patient?.address[0]?.city ? patient?.address[0]?.city?.uuid : "",
            zip_code: !loading && patient?.address.length > 0 ? patient?.address[0]?.postalCode : "",
            address:
                !loading && patient?.address[0] ? patient?.address[0].street : "",
            phones:
                !loading && patient.contact.length > 0
                    ? patient.contact.map((contact: any) => ({
                        code: contact.code,
                        value: contact.value
                    }))
                    : [{
                        code: "+216",
                        value: ""
                    }]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {values, touched, errors, getFieldProps, setFieldValue} = formik;

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const {data: httpCountriesResponse} = useRequest({
        method: "GET",
        url: "/api/public/places/countries/" + router.locale
    }, SWRNoValidateConfig);

    const {data: httpStatesResponse} = useRequest(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, SWRNoValidateConfig);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const handleAddPhone = () => {
        const phone = [...values.phones, {code: "+216", value: ""}];
        setFieldValue("phones", phone);
    }

    const handleRemovePhone = (index: number) => {
        const phones = [...values.phones];
        phones.splice(index, 1);
        formik.setFieldValue("phones", phones);
    };

    const getCountryByCode = (code: string) => {
        return countries.find(country => country.phone === code)
    }

    const handleUpdatePatient = () => {
        setEditable(false);
        setLoadingRequest(true);
        const params = new FormData();
        params.append('first_name', patient.firstName.trim());
        params.append('last_name', patient.lastName.trim());
        params.append('gender', patient.gender === 'M' ? '1' : '2');
        params.append('insurance', JSON.stringify(patient.insurances.map(
            (insurance: {
                insurance: InsuranceModel,
                insuranceNumber: string,
                uuid: string
            }) => ({insurance_uuid: insurance.insurance?.uuid, insurance_number: insurance.insuranceNumber}))));
        params.append('country', values.country);
        params.append('region', values.region);
        params.append('zip_code', values.zip_code);
        params.append('phone', JSON.stringify(values.phones.map((phone: any) => ({
            code: phone.code,
            value: phone.value,
            type: "phone",
            "contact_type": patient.contact[0].uuid,
            "is_public": false,
            "is_support": false
        }))));
        params.append('address', JSON.stringify({
            fr: values.address
        }));

        triggerPatientUpdate({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient?.uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        }).then(() => {
            setLoadingRequest(false);
            mutatePatientData();
            if (mutatePatientList) {
                mutatePatientList();
            }
            enqueueSnackbar(t(`alert.patient-edit`), {variant: "success"});
        });
    }

    const countries_api = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <RootStyled>
                    <CardContent>
                        <Grid container>
                            <AppBar position="static" color={"transparent"} className={"app-bar-header"}>
                                <Toolbar variant="dense">
                                    <Box sx={{flexGrow: 1}}>
                                        <Typography
                                            variant="body1"
                                            sx={{fontWeight: "bold"}}
                                            gutterBottom>
                                            {loading ? (
                                                <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                            ) : (
                                                t("contact")
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                        {editable ?
                                            <Stack direction={"row"} spacing={2} mt={1} justifyContent='flex-end'>
                                                <Button onClick={() => setEditable(false)}
                                                        color={"error"}
                                                        className='btn-cancel'
                                                        sx={{margin: 'auto'}}
                                                        size='small'
                                                        startIcon={<CloseIcon/>}>
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    onClick={() => handleUpdatePatient()}
                                                    loading={loadingRequest}
                                                    disabled={Object.keys(errors).length > 0}
                                                    className='btn-add'
                                                    sx={{margin: 'auto'}}
                                                    size='small'
                                                    startIcon={<SaveAsIcon/>}>
                                                    {t('register')}
                                                </LoadingButton>
                                            </Stack>
                                            :
                                            <Button onClick={() => setEditable(true)}
                                                    startIcon={<IconUrl path={"setting/edit"}/>}
                                                    color="primary" size="small">
                                                {t("edit")}
                                            </Button>
                                        }
                                    </Box>
                                </Toolbar>
                            </AppBar>
                            <Grid container spacing={1.2}>
                                {values.phones.map((phone: any, index: number) => (
                                        <Grid key={`${index}`} item md={5} sm={6} xs={6}
                                              className={"phone-handler"}>
                                            <Stack direction="row"
                                                   spacing={1}
                                                   alignItems="center">
                                                <Grid item md={3.5} sm={6} xs={6}>
                                                    <Typography className="label"
                                                                noWrap
                                                                variant="body2" color="text.secondary" width="50%">
                                                        {t("telephone")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={6} sm={6} xs={6} sx={{
                                                    "& .Input-select": {
                                                        marginLeft: "-0.6rem"
                                                    }
                                                }}>
                                                    {loading ? (
                                                        <Skeleton variant="text"/>
                                                    ) : (
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center">
                                                            <CountrySelect
                                                                sx={{
                                                                    "& .MuiInputAdornment-root": {
                                                                        width: 20
                                                                    },
                                                                    ...(!editable && {
                                                                        "& .MuiAutocomplete-endAdornment": {
                                                                            display: "none"
                                                                        }
                                                                    })
                                                                }}
                                                                disablePortal
                                                                small
                                                                readOnly={!editable}
                                                                initCountry={{
                                                                    code: getCountryByCode(values.phones[index].code) ? getCountryByCode(values.phones[index].code)?.code : "TN",
                                                                    label: getCountryByCode(values.phones[index].code) ? getCountryByCode(values.phones[index].code)?.label : "Tunisia",
                                                                    phone: getCountryByCode(values.phones[index].code) ? getCountryByCode(values.phones[index].code)?.phone : "+216"
                                                                }}
                                                                onSelect={(state: any) => {
                                                                    console.log(state);
                                                                    setFieldValue(`phones[${index}].code`, state.phone);
                                                                }}/>
                                                            <InputBase
                                                                className={"Input-select"}
                                                                error={Boolean(touched.phones && errors.phones)}
                                                                readOnly={!editable}
                                                                {...getFieldProps(`phones[${index}].value`)}
                                                            />
                                                        </Stack>
                                                    )}
                                                </Grid>
                                                <Grid item md={1} sm={6} xs={6}>
                                                    {(editable && index === 0) ? <>
                                                        <IconButton
                                                            onClick={handleAddPhone}
                                                            className="success-light"
                                                            sx={{
                                                                mr: 1.5,
                                                                p: "3px 5px",
                                                                "& svg": {
                                                                    width: 14,
                                                                    height: 14
                                                                },
                                                            }}
                                                        >
                                                            <Icon path="ic-plus"/>
                                                        </IconButton>
                                                    </> : (editable && <IconButton
                                                        onClick={() => handleRemovePhone(index)}
                                                        className="error-light"
                                                        sx={{
                                                            mr: 1.5,
                                                            p: "3px 5px",
                                                            "& svg": {
                                                                width: 14,
                                                                height: 14,
                                                                "& path": {
                                                                    fill: (theme) => theme.palette.text.primary,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Icon path="ic-moin"/>
                                                    </IconButton>)}
                                                </Grid>
                                            </Stack>
                                        </Grid>
                                    )
                                )}
                                <Grid item md={7} sm={6} xs={6}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={2.5} sm={6} xs={6}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary">
                                                {t("country")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    width: "100%"
                                                }
                                            }}
                                            item md={8} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    readOnly={!editable}
                                                    id={"country"}
                                                    disabled={!countries_api}
                                                    size="small"
                                                    {...getFieldProps("country")}
                                                    displayEmpty
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            display: !editable ? "none" : "inline-block"
                                                        },
                                                        color: "text.secondary"
                                                    }}
                                                    renderValue={selected => {
                                                        if (selected?.length === 0) {
                                                            return <em>{t("country-placeholder-error")}</em>;
                                                        }

                                                        const country = countries_api?.find(country => country.uuid === selected);
                                                        return (
                                                            <Stack direction={"row"}>
                                                                <Image width={20} height={14}
                                                                       alt={"flag"}
                                                                       src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}/>
                                                                <Typography ml={1}>{country?.name}</Typography>
                                                            </Stack>)
                                                    }}
                                                >
                                                    {countries_api?.map((country) => (
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
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={5} sm={6} xs={6}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={2.5} sm={6} xs={6}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary"
                                                width="50%">
                                                {t("region")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    width: "100%"
                                                }
                                            }}
                                            item md={8} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id={"region"}
                                                    disabled={!values.country && !states}
                                                    size="small"
                                                    {...getFieldProps("region")}
                                                    displayEmpty={true}
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            display: !editable ? "none" : "inline-block"
                                                        },
                                                        color: "text.secondary"
                                                    }}
                                                    renderValue={selected => {
                                                        if (selected?.length === 0) {
                                                            return <em>{t("region-placeholder-error")}</em>;
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
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={7} sm={6} xs={6}>
                                    <Stack direction="row"
                                           sx={{
                                               "& .MuiInputBase-root": {
                                                   width: "100%"
                                               }
                                           }}
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={6}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary"
                                                width="50%">
                                                {t("zip_code")}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <InputBase
                                                    readOnly={!editable}
                                                    sx={{width: "50%"}}
                                                    placeholder={t("zip_code-placeholder")}
                                                    inputProps={{
                                                        style: {
                                                            background: "white",
                                                            fontSize: 14,
                                                        },
                                                    }}
                                                    {...getFieldProps("zip_code")}
                                                />
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={12} sm={6} xs={6}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={1.4} sm={6} xs={6}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary"
                                                width="50%">
                                                {t("address")}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={10} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <InputBase
                                                    inputComponent={"textarea"}
                                                    readOnly={!editable}
                                                    sx={{width: "100%"}}
                                                    placeholder={t("address-placeholder")}
                                                    inputProps={{
                                                        rows: 2,
                                                        style: {
                                                            background: "white",
                                                            fontSize: 14,
                                                        },
                                                    }}
                                                    {...getFieldProps("address")}
                                                />
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </RootStyled>
            </Form>
        </FormikProvider>
    );
}

export default PatientContactDetailCard;
