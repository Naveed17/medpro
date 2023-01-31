import React, {useState} from "react";
import RootStyled from "./overrides/rootStyle";
import {
    Typography,
    Skeleton,
    CardContent,
    Grid,
    Stack,
    Box,
    InputBase, AppBar, Toolbar, Button, IconButton, MenuItem, Select, useTheme, Avatar,
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
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import {isValidPhoneNumber} from "libphonenumber-js";
import Icon from "@themes/urlIcon";
import {DefaultCountry, PhoneRegExp} from "@app/constants";
import {agendaSelector, setSelectedEvent} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

function PatientContactDetailCard({...props}) {
    const {
        patient, mutatePatientDetails, mutatePatientList = null, mutateAgenda = null, loading,
        editable: defaultEditStatus, setEditable, currentSection, setCurrentSection
    } = props;

    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();

    const {selectedEvent: appointment} = useAppSelector(agendaSelector);
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config.add-patient",
    });

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
                        test: (value, ctx: any) => isValidPhoneNumber(`${ctx.from[0].value.code}${value}`),
                    })
                    .matches(PhoneRegExp, t("telephone-error"))
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
                        value: contact.value
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
            value: phone.value,
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

        triggerPatientUpdate({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient?.uuid}/${router.locale}`,
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
                                    </Box>
                                </Toolbar>
                            </AppBar>
                            <Grid container spacing={1.2}>
                                {values.phones.map((phone: any, index: number) => (
                                        <Grid key={`${index}`} item md={6} sm={6} xs={6}
                                              className={"phone-handler"}>
                                            <Stack direction="row"
                                                   alignItems="center">
                                                <Grid item md={10} sm={12} xs={12} sx={{
                                                    "& .Input-select": {
                                                        marginLeft: "-0.8rem"
                                                    }
                                                }}>
                                                    {loading ? (
                                                        <Skeleton variant="text"/>
                                                    ) : (
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            sx={{height: 30}}
                                                            alignItems="center">
                                                            <Typography
                                                                mr={2.5}
                                                                className="label"
                                                                variant="body2"
                                                                color="text.secondary">
                                                                {`${t("phone")}  ${values.phones.length > 1 ? ("N° " + (index + 1)) : ""}`}
                                                            </Typography>
                                                            <Stack
                                                                pl={1.5}
                                                                {...(editable && {className: "grid-border"})}
                                                                direction={"row"} alignItems={"center"}>
                                                                <CountrySelect
                                                                    sx={{
                                                                        "& .MuiInputAdornment-root": {
                                                                            width: 20
                                                                        },
                                                                        "& .MuiAvatar-root": {
                                                                            ml: 0
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
                                                                        code: getCountryByCode(values.phones[index].code) ? getCountryByCode(values.phones[index].code)?.code : doctor_country?.code,
                                                                        name: getCountryByCode(values.phones[index].code) ? getCountryByCode(values.phones[index].code)?.name : doctor_country?.name,
                                                                        phone: getCountryByCode(values.phones[index].code) ? getCountryByCode(values.phones[index].code)?.phone : doctor_country?.phone
                                                                    }}
                                                                    onSelect={(state: any) => {
                                                                        setFieldValue(`phones[${index}].code`, state.phone);
                                                                    }}/>
                                                                <InputBase
                                                                    fullWidth
                                                                    className={"Input-select"}
                                                                    placeholder={t("telephone")}
                                                                    error={Boolean(touched.phones && errors.phones)}
                                                                    readOnly={!editable}
                                                                    {...getFieldProps(`phones[${index}].value`)}
                                                                />
                                                            </Stack>
                                                        </Stack>
                                                    )}
                                                </Grid>
                                                <Grid item md={1} sm={6} xs={6}>
                                                    <Stack direction="row"
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
                                )}
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row"
                                           sx={{height: 28, width: "103%"}}
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={2.8} sm={6} xs={6}>
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
                                                    border: `1px solid ${theme.palette.grey['A100']}`,
                                                    borderRadius: .6,
                                                    height: 31,
                                                    "& .MuiSelect-select": {
                                                        pl: 1.6
                                                    }
                                                } : {
                                                    "& .MuiSelect-select": {
                                                        pl: 0
                                                    }
                                                }),
                                                "& .MuiInputBase-root": {
                                                    paddingLeft: 0,
                                                    width: "100%",
                                                    height: "100%"
                                                }
                                            }}
                                            item md={8.5} sm={6} xs={6}>
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
                                                        pl: 0,
                                                        ml: 0,
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
                                                            <Stack direction={"row"} alignItems={"center"}>
                                                                {country?.code && <Avatar
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 16,
                                                                        borderRadius: 0.4,
                                                                        ml: 0,
                                                                        mr: ".5rem"
                                                                    }}
                                                                    alt="flag"
                                                                    src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}
                                                                />}
                                                                <Typography ml={1}>{country?.name}</Typography>
                                                            </Stack>)
                                                    }}
                                                >
                                                    {countries_api?.filter(country => country.hasState).map((country) => (
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
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={6}>
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
                                                ...(editable && {
                                                    border: `1px solid ${theme.palette.grey['A100']}`,
                                                    borderRadius: .6,
                                                    height: 31,
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
                                            item md={8} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <Select
                                                    labelId="region-select-label"
                                                    id={"region"}
                                                    disabled={!values.country && !states}
                                                    size="small"
                                                    {...getFieldProps("region")}
                                                    onChange={event => {
                                                        const stateUuid = event.target.value;
                                                        setFieldValue("region", stateUuid);
                                                        const state = states?.find(state => state.uuid === stateUuid);
                                                        state.zipCode && setFieldValue("zip_code", state.zipCode);
                                                    }}
                                                    displayEmpty
                                                    sx={{
                                                        pl: 0,
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
                                <Grid item md={6} sm={6} xs={6}>
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
                                        <Grid
                                            {...(editable && {className: "grid-border"})}
                                            item md={9.4} sm={6} xs={6}>
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
                                <Grid item md={6} sm={6} xs={6}
                                      sx={{
                                          "& .MuiInputBase-readOnly": {
                                              ml: "0.3rem"
                                          }
                                      }}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={3} sm={6} xs={6}>
                                            <Typography
                                                className="label"
                                                variant="body2"
                                                color="text.secondary">
                                                {t("address")}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            {...(editable && {className: "grid-border"})}
                                            item md={8} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <InputBase
                                                    readOnly={!editable}
                                                    sx={{width: "100%"}}
                                                    placeholder={t("address-placeholder")}
                                                    inputProps={{
                                                        rows: 6,
                                                        style: {
                                                            background: "white",
                                                            fontSize: 14
                                                        },
                                                    }}
                                                    {...getFieldProps("address")}
                                                />
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row" spacing={1}
                                           sx={{height: 28, width: "103%"}}
                                           alignItems="center">
                                        <Grid item md={2.8} sm={6} xs={6}>
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
                                                "& .MuiInputBase-root": {
                                                    paddingLeft: 0,
                                                    width: "100%",
                                                    height: "100%"
                                                },
                                                "& .MuiSelect-select": {
                                                    pl: 0
                                                },
                                                ...(editable && {
                                                    border: `1px solid ${theme.palette.grey['A100']}`,
                                                    borderRadius: .6,
                                                    height: 31,
                                                    pl: 1.6
                                                })
                                            }}
                                            item md={8.5} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton width={100}/>
                                            ) : (
                                                <Select
                                                    labelId="nationality-select-label"
                                                    readOnly={!editable}
                                                    id={"nationality"}
                                                    disabled={!countries_api}
                                                    size="small"
                                                    {...getFieldProps("nationality")}
                                                    displayEmpty
                                                    sx={{
                                                        pl: 0,
                                                        ml: 0,
                                                        "& .MuiSvgIcon-root": {
                                                            display: !editable ? "none" : "inline-block"
                                                        },
                                                        color: "text.secondary"
                                                    }}
                                                    renderValue={selected => {
                                                        if (selected?.length === 0) {
                                                            return <em>{t("nationality-placeholder")}</em>;
                                                        }

                                                        const country = countries_api?.find(country => country.uuid === selected);
                                                        return (
                                                            <Stack direction={"row"} alignItems={"center"}>
                                                                {country?.code && <Avatar
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 16,
                                                                        borderRadius: 0.4,
                                                                        ml: 0,
                                                                        mr: ".5rem"
                                                                    }}
                                                                    alt="flag"
                                                                    src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}
                                                                />}
                                                                <Typography ml={1}>{country?.nationality}</Typography>
                                                            </Stack>)
                                                    }}>
                                                    {countries_api?.map((country) => (
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
