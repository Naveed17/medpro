import React, {useRef, useState} from "react";
import RootStyled from "./overrides/rootStyle";
import {
    Typography,
    Skeleton,
    CardContent,
    Grid,
    Stack,
    Box,
    InputBase,
    AppBar,
    Toolbar,
    Button,
    IconButton,
    MenuItem,
    useTheme,
    Avatar,
    useMediaQuery,
    InputAdornment,
    TextField, Autocomplete, Divider,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useFormik, Form, FormikProvider, FieldArray} from "formik";
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
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import {isValidPhoneNumber} from "libphonenumber-js";
import Icon from "@themes/urlIcon";
import {DefaultCountry} from "@app/constants";
import {agendaSelector, setSelectedEvent} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {CustomInput} from "@features/tabPanel";
import PhoneInput from "react-phone-number-input/input";
import {dashLayoutSelector} from "@features/base";
import {useUrlSuffix} from "@app/hooks";

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

function PatientContactDetailCard({...props}) {
    const {
        patient, mutatePatientDetails, mutatePatientList = null, mutateAgenda = null, loading,
        editable: defaultEditStatus, setEditable, currentSection, setCurrentSection
    } = props;

    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const phoneInputRef = useRef(null);
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const urlMedicalEntitySuffix = useUrlSuffix();

    const {selectedEvent: appointment} = useAppSelector(agendaSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);


    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const [loadingRequest, setLoadingRequest] = useState(false);

    const RegisterPatientSchema = Yup.object().shape({
        country: Yup.string()
            .min(3, t("country-error")),
        region: Yup.string()
            .min(3, t("region-error")),
        zip_code: Yup.string(),
        address: Yup.string(),
        nationality: Yup.string(),
        phones: Yup.array().of(
            Yup.object().shape({
                code: Yup.string(),
                value: Yup.string()
                    .test({
                        name: 'is-phone',
                        message: t("telephone-error"),
                        test: (value) => {
                            return value ? isValidPhoneNumber(value) : false
                        }
                    })
                    .required(t("telephone-error"))
            })),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            country: !loading && patient?.address.length > 0 && patient?.address[0]?.city ? patient?.address[0]?.city?.country?.uuid : "",
            region: !loading && patient?.address.length > 0 && patient?.address[0]?.city ? patient?.address[0]?.city?.uuid : "",
            zip_code: !loading && patient?.address.length > 0 ? (patient?.address[0]?.postalCode ? patient?.address[0]?.postalCode : "") : "",
            address:
                !loading && patient?.address[0] ? (patient?.address[0].street ? patient?.address[0].street : "") : "",
            nationality: !loading && patient?.nationality ? patient.nationality.uuid : "",
            phones:
                !loading && patient.contact.length > 0
                    ? patient.contact.map((contact: any) => ({
                        code: contact.code,
                        value: `${contact.code}${contact.value}`
                    }))
                    : [{
                        code: doctor_country?.phone,
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
        url: `/api/public/places/countries/${router.locale}/?nationality=true`
    }, SWRNoValidateConfig);

    const {data: httpStatesResponse} = useRequest(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, SWRNoValidateConfig);

    const handleAddPhone = () => {
        const phone = [...values.phones, {code: doctor_country?.phone, value: ""}];
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
        params.append('country', values.country);
        params.append('region', values.region);
        params.append('zip_code', values.zip_code);
        params.append('nationality', values.nationality);
        params.append('phone', JSON.stringify(values.phones.map((phone: any) => ({
            code: phone.code,
            value: phone.value.replace(phone.code, ""),
            type: "phone",
            "contact_type": patient.contact[0].uuid,
            "is_public": false,
            "is_support": false
        }))));
        params.append('address', JSON.stringify({
            fr: values.address
        }));
        patient.fiche_id && params.append('fiche_id', patient.fiche_id);
        patient.email && params.append('email', patient.email);
        patient.familyDoctor && params.append('family_doctor', patient.familyDoctor);
        patient.profession && params.append('profession', patient.profession);
        patient.birthdate && params.append('birthdate', patient.birthdate);
        patient.note && params.append('note', patient.note);
        patient.idCard && params.append('id_card', patient.idCard);

        medicalEntityHasUser && triggerPatientUpdate({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        }).then(() => {
            setLoadingRequest(false);
            mutatePatientDetails && mutatePatientDetails();
            mutatePatientList && mutatePatientList();
            mutateAgenda && mutateAgenda();
            if (appointment) {
                const event = {
                    ...appointment,
                    extendedProps: {
                        ...appointment.extendedProps,
                        patient: {
                            ...appointment.extendedProps.patient,
                            contact: [
                                {
                                    ...appointment.extendedProps.patient.contact[0],
                                    code: values.phones[0].code,
                                    value: values.phones[0].value
                                }]
                        }
                    }
                } as any;
                dispatch(setSelectedEvent(event));
            }
            enqueueSnackbar(t(`alert.patient-edit`), {variant: "success"});
        });
    }

    const countries_api = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const states = (httpStatesResponse as HttpResponse)?.data as any[];
    const editable = currentSection === "PatientContactDetailCard" && defaultEditStatus;
    const disableActions = defaultEditStatus && currentSection !== "PatientContactDetailCard";

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
                                        <Button
                                            disabled={disableActions}
                                            onClick={() => {
                                                setCurrentSection("PatientContactDetailCard");
                                                setEditable(true)
                                            }}
                                            startIcon={<IconUrl
                                                {...(disableActions && {color: "white"})}
                                                path={"setting/edit"}/>}
                                            color="primary" size="small">
                                            {t("edit")}
                                        </Button>
                                    }
                                </Toolbar>
                            </AppBar>

                            <Grid container spacing={1.2}>
                                <Divider textAlign="left" sx={{width: "100%"}}>
                                    <Typography
                                        mt={-1}
                                        className="label"
                                        variant="body2"
                                        color="text.secondary">
                                        {t("address-group")}
                                    </Typography>
                                </Divider>

                                <Grid item md={12} sm={12} xs={12}
                                      onClick={() => {
                                          if (!editable) {
                                              setCurrentSection("PatientContactDetailCard");
                                              setEditable(true)
                                          }
                                      }
                                      }
                                      sx={{
                                          "& .MuiInputBase-readOnly": {
                                              ml: "0.3rem"
                                          }
                                      }}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={1.46} sm={3} xs={3}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary">
                                                {t("address")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            {...(editable && {className: "grid-border"})}
                                            {...(editable && {style: {height: 120, paddingTop: 10}})}
                                            item md={10.54} sm={9} xs={9}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <InputBase
                                                    readOnly={!editable}
                                                    sx={{width: "100%"}}
                                                    multiline={editable}
                                                    rows={editable ? 5 : 1}
                                                    placeholder={t("address-placeholder")}
                                                    inputProps={{
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
                                <Grid item md={6} sm={6} xs={12}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={3}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary">
                                                {t("country")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            sx={{
                                                ...(editable ? {
                                                    "& .MuiSelect-select": {
                                                        pl: 1.6
                                                    }
                                                } : {
                                                    "& .MuiSelect-select": {
                                                        pl: 0
                                                    },
                                                    "& .MuiAutocomplete-endAdornment": {
                                                        display: "none"
                                                    }
                                                }),
                                                "& .MuiInputBase-root": {
                                                    paddingLeft: 0,
                                                    width: "100%",
                                                    height: "100%"
                                                }
                                            }}
                                            item md={9} sm={6} xs={9}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <Autocomplete
                                                    id={"country"}
                                                    disabled={!countries_api}
                                                    autoHighlight
                                                    disableClearable
                                                    size="small"
                                                    value={countries_api?.find(country => country.uuid === getFieldProps("country").value) ?
                                                        countries_api.find(country => country.uuid === getFieldProps("country").value) : ""}
                                                    onChange={(e, v: any) => {
                                                        setFieldValue("country", v.uuid);
                                                    }}
                                                    {...(editable && {
                                                        sx: {
                                                            color: "text.secondary",
                                                            borderRadius: .6,
                                                            border: `1px solid ${theme.palette.grey['A100']}`
                                                        }
                                                    })}
                                                    options={countries_api ? countries_api?.filter(country => country.hasState) : []}
                                                    loading={!countries_api}
                                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
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
                                                        const country = countries_api?.find(country => country.uuid === getFieldProps("country").value);
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
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={3}>
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
                                                ...(editable ? {
                                                    border: `1px solid ${theme.palette.grey['A100']}`,
                                                    borderRadius: .6,
                                                } : {
                                                    "& .MuiAutocomplete-endAdornment": {
                                                        display: "none"
                                                    }
                                                }),
                                                "& .MuiInputBase-root": {
                                                    paddingLeft: 0,
                                                    width: "100%",
                                                    height: "100%"
                                                },
                                                "& .MuiSelect-select": {
                                                    pl: 1.6
                                                }
                                            }}
                                            item md={9} sm={6} xs={9}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (

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
                                                    loading={!states}
                                                    getOptionLabel={(option) => option?.name ? option.name : ""}
                                                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
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
                                                                                      variant="outlined"
                                                                                      fullWidth/>}/>
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <Stack direction="row"
                                           sx={{
                                               "& .MuiInputBase-readOnly": {
                                                   ml: "0.3rem"
                                               },
                                               "& .MuiInputBase-root": {
                                                   width: "100%"
                                               }
                                           }}
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={3}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary">
                                                {t("zip_code")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            {...(editable && {className: "grid-border"})}
                                            item md={9} sm={6} xs={9}>
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
                                <Grid item md={6} sm={6} xs={12}>
                                    <Stack direction="row" spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={3}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary"
                                                width="50%">
                                                {t("nationality")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            sx={{
                                                ...(!editable && {
                                                    "& .MuiAutocomplete-endAdornment": {
                                                        display: "none"
                                                    }
                                                }),
                                                "& .MuiInputBase-root": {
                                                    paddingLeft: 0,
                                                    width: "100%",
                                                    height: "100%"
                                                },
                                                "& .MuiSelect-select": {
                                                    pl: 0
                                                }
                                            }}
                                            item md={9} sm={6} xs={9}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <Autocomplete
                                                    id={"nationality"}
                                                    disabled={!countries_api}
                                                    autoHighlight
                                                    disableClearable
                                                    size="small"
                                                    value={countries_api?.find(country => country.uuid === getFieldProps("nationality").value) ?
                                                        countries_api.find(country => country.uuid === getFieldProps("nationality").value) : ""}
                                                    onChange={(e, v: any) => {
                                                        setFieldValue("nationality", v.uuid);
                                                    }}
                                                    {...(editable && {
                                                        sx: {
                                                            color: "text.secondary",
                                                            borderRadius: .6,
                                                            border: `1px solid ${theme.palette.grey['A100']}`
                                                        }
                                                    })}
                                                    options={countries_api ? countries_api : []}
                                                    loading={!countries_api}
                                                    getOptionLabel={(option: any) => option?.nationality ? option.nationality : ""}
                                                    isOptionEqualToValue={(option: any, value) => option?.nationality === value?.nationality}
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
                                                            <Typography
                                                                sx={{ml: 1}}>{option.nationality}</Typography>
                                                        </MenuItem>
                                                    )}
                                                    renderInput={params => {
                                                        const country = countries_api?.find(country => country.uuid === getFieldProps("nationality").value);
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
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                {values.phones.length > 0 && <Divider textAlign="left" sx={{width: "100%"}}>
                                    <Typography
                                        mt={2}
                                        className="label"
                                        variant="body2"
                                        color="text.secondary">
                                        {t("telephone")}
                                    </Typography>
                                </Divider>}
                                <FieldArray
                                    name={"phones"}
                                    render={() => (values.phones.map((phone: any, index: number) => (
                                            <Grid key={index} item md={12} sm={12} xs={12}>
                                                <Stack direction="row" alignItems="self-start">
                                                    <Grid item md={11} sm={11} xs={11} sx={{
                                                        ...(editable && {mb: "2rem"}),
                                                        "& .Input-select": {
                                                            marginLeft: "-0.8rem"
                                                        }
                                                    }}>
                                                        {loading ? (
                                                            <Skeleton variant="text"/>
                                                        ) : (
                                                            <Stack direction={"row"} alignItems={"center"}
                                                                   alignContent={"center"} spacing={.8}>
                                                                <Typography
                                                                    mr={isMobile ? 1.6 : 2.4}
                                                                    className="label"
                                                                    variant="body2"
                                                                    color="text.secondary">
                                                                    {`${t("phone")}  ${values.phones.length > 1 ? ("N° " + (index + 1)) : ""}`}
                                                                </Typography>
                                                                <Stack direction={"row"} alignItems={"flex-start"}
                                                                       spacing={1.2}
                                                                       sx={{width: "100%"}}
                                                                       {...(editable && {
                                                                           sx: {
                                                                               border: `1px solid ${theme.palette.grey['A100']}`,
                                                                               borderRadius: .4,
                                                                               height: 38,
                                                                               width: "100%"
                                                                           }
                                                                       })}>
                                                                    <Grid item md={3.5} sm={5} xs={5}>
                                                                        <CountrySelect
                                                                            sx={{
                                                                                ...(isMobile && {
                                                                                    "& .MuiInputAdornment-root": {
                                                                                        width: 20
                                                                                    }
                                                                                }),
                                                                                ...(!editable && {
                                                                                    "& .MuiAutocomplete-endAdornment": {
                                                                                        display: "none"
                                                                                    }
                                                                                })
                                                                            }}
                                                                            readOnly={!editable}
                                                                            {...(isMobile && {small: true})}
                                                                            initCountry={{
                                                                                code: getCountryByCode(values.phones[index]?.code) ? getCountryByCode(values.phones[index].code)?.code : doctor_country?.code,
                                                                                name: getCountryByCode(values.phones[index]?.code) ? getCountryByCode(values.phones[index].code)?.name : doctor_country?.name,
                                                                                phone: getCountryByCode(values.phones[index]?.code) ? getCountryByCode(values.phones[index].code)?.phone : doctor_country?.phone
                                                                            }}
                                                                            onSelect={(state: any) => {
                                                                                setFieldValue(`phones[${index}].value`, "");
                                                                                setFieldValue(`phones[${index}].code`, state.phone);
                                                                            }}/>
                                                                    </Grid>
                                                                    <Grid item md={8.5} sm={7} xs={7}>
                                                                        {phone?.code && <PhoneInput
                                                                            ref={phoneInputRef}
                                                                            international
                                                                            disabled={!editable}
                                                                            fullWidth
                                                                            error={Boolean(errors.phones && (errors.phones as any)[index])}
                                                                            withCountryCallingCode
                                                                            {...((editable && getFieldProps(`phones[${index}].value`)) &&
                                                                                {
                                                                                    helperText: `Format international: ${getFieldProps(`phones[${index}].value`)?.value ?
                                                                                        getFieldProps(`phones[${index}].value`).value : ""}`
                                                                                })}
                                                                            country={getCountryByCode(phone.code)?.code as any}
                                                                            value={phone?.value ? phone.value : ""}
                                                                            onChange={value => setFieldValue(`phones[${index}].value`, value)}
                                                                            inputComponent={CustomInput as any}
                                                                        />}
                                                                    </Grid>
                                                                </Stack>
                                                            </Stack>
                                                        )}
                                                    </Grid>
                                                    <Grid item md={1} sm={1} xs={1}>
                                                        <Stack direction="row"
                                                               mt={.8}
                                                               ml={1}
                                                               alignItems="center">
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
                                                        </Stack>
                                                    </Grid>
                                                </Stack>
                                            </Grid>
                                        )
                                    ))}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </RootStyled>
            </Form>
        </FormikProvider>
    );
}

export default PatientContactDetailCard;
