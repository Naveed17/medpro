import React, { useEffect, useRef, useState } from "react";
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
    MenuItem,
    useTheme,
    Avatar,
    useMediaQuery,
    InputAdornment,
    TextField, Autocomplete, Divider, IconButton, Button,
    CardHeader,
    Collapse,
    FormControl,
    Select,
    Link,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useFormik, Form, FormikProvider, FieldArray } from "formik";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import IconUrl from "@themes/urlIcon";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { countries as countriesData } from "@features/countrySelect/countries";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { isValidPhoneNumber } from "libphonenumber-js";
import { DefaultCountry, PatientContactRelation } from "@lib/constants";
import { agendaSelector, setSelectedEvent } from "@features/calendar";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { CustomInput } from "@features/tabPanel";
import PhoneInput from "react-phone-number-input/input";
import { dashLayoutSelector } from "@features/base";
import { checkObjectChange, flattenObject, useInvalidateQueries, useMedicalEntitySuffix } from "@lib/hooks";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { LoadingScreen } from "@features/loadingScreen";
import { ToggleButtonStyled } from "@features/toolbar";
import Icon from "@themes/urlIcon";
import AddIcon from "@mui/icons-material/Add";
import { CustomIconButton } from "@features/buttons";
import { useCountries } from "@lib/hooks/rest";

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

function PatientContactDetailCard({ ...props }) {
    const {
        patient, contactData, mutatePatientList = null, mutateAgenda = null,
        loading, contacts, countries_api, editable: defaultEditStatus, setEditable
    } = props;

    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const router = useRouter();
    const phoneInputRef = useRef(null);
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { trigger: invalidateQueries } = useInvalidateQueries();
    const [openPanel, setOpenPanel] = useState<string[]>(["contact", "info"])
    const { selectedEvent: appointment } = useAppSelector(agendaSelector);
    const { t, ready } = useTranslation(["patient", "common"]);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const { countries } = useCountries("nationality=true", contacts.length > 0);
    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const [loadingRequest, setLoadingRequest] = useState(false);
    const handleTogglePanels = (props: string) => {
        const panel = openPanel.includes(props)
            ? openPanel.filter(panel => panel !== props)
            : [...openPanel, props];
        setOpenPanel(panel);

    }
    const RegisterPatientSchema = Yup.object().shape({
        country: Yup.string()
            .min(3, t("config.add-patient.country-error")),
        region: Yup.string()
            .min(3, t("config.add-patient.region-error")),
        zip_code: Yup.string(),
        address: Yup.string(),
        phones: Yup.array().of(
            Yup.object().shape({
                code: Yup.string(),
                value: Yup.string()
                    .test({
                        name: 'is-phone',
                        message: t("config.add-patient.telephone-error"),
                        test: (value) => {
                            return value ? isValidPhoneNumber(value) : false
                        }
                    })
                    .required(t("config.add-patient.telephone-error"))
            })),
    });

    const { trigger: triggerPatientUpdate } = useRequestQueryMutation("/patient/update");


    const initialValue = {
        nationality: !loading && contactData?.address.length > 0 && contactData?.address[0]?.city ? contactData?.address[0]?.city?.country?.uuid : "",
        country: !loading && contactData?.address.length > 0 && contactData?.address[0]?.city ? contactData?.address[0]?.city?.country?.uuid : "",
        region: !loading && contactData?.address.length > 0 && contactData?.address[0]?.city ? contactData?.address[0]?.city?.uuid : "",
        zip_code: !loading && contactData?.address.length > 0 ? (contactData?.address[0]?.postalCode ? contactData?.address[0]?.postalCode : "") : "",
        email: "",
        id_card_number: "",
        family_doctor: "",
        profession: "",
        address:
            !loading && contactData?.address[0] ? (contactData?.address[0].street ? contactData?.address[0].street : "") : "",
        phones:
            !loading && contactData?.contact?.length > 0
                ? contactData.contact.map((contact: any) => ({
                    code: contact.code,
                    value: `${contact.code}${contact.value}`,
                    isWhatsapp: !!contact?.isWhatsapp,
                    relation: PatientContactRelation.find(relation => relation.value === contact.contactRelation)?.key ?? "himself",
                    firstName: contact.contactSocial?.firstName ?? "",
                    lastName: contact.contactSocial?.lastName ?? ""
                }))
                : [{
                    code: doctor_country?.phone,
                    value: "",
                    isWhatsapp: false,
                    relation: "himself",
                    firstName: "",
                    lastName: ""
                }]
    }
    const [flattenedObject, setFlattenedObject] = useState(flattenObject(initialValue));
    const [contactRelations] = useState(PatientContactRelation.map(relation => ({
        ...relation,
        label: t(`social_insured.${relation.label}`, { ns: "common" })
    })));

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: RegisterPatientSchema,
        onSubmit: (values) => {
            console.log("ok", values);
        },
    });

    const { values, errors, getFieldProps, setFieldValue } = formik;

    const { data: httpStatesResponse } = useRequestQuery(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const handleAddPhone = () => {
        const phone = [...values.phones, {
            code: doctor_country?.phone,
            value: "",
            isWhatsapp: false,
            relation: "himself",
            firstName: "",
            lastName: ""
        }];
        setFieldValue("phones", phone);
    }

    const handleRemovePhone = (index: number) => {
        const phones = [...values.phones];
        phones.splice(index, 1);
        formik.setFieldValue("phones", phones);
    };

    const getCountryByCode = (code: string) => {
        return countriesData.find(country => country.phone === code)
    }

    const handleUpdatePatient = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('country', values.country);
        params.append('region', values.region);
        params.append('zip_code', values.zip_code);
        params.append('phone', JSON.stringify(values.phones.map((phone: any) => ({
            code: phone.code,
            value: phone.value.replace(phone.code, ""),
            type: "phone",
            contact_type: contacts?.length > 0 && contacts[0].uuid,
            is_whatsapp: phone.isWhatsapp,
            contact_relation: PatientContactRelation.find(relation => relation.key === phone.relation)?.value,
            contact_social: {
                first_name: phone.firstName,
                last_name: phone.lastName
            },
            is_public: false,
            is_support: false
        }))));
        params.append('address', JSON.stringify({
            [router.locale as string]: values.address
        }));

        medicalEntityHasUser && triggerPatientUpdate({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/contact/${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                setLoadingRequest(false);
                invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/contact/${router.locale}`]);
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
                                        value: values.phones[0].value,
                                        relation: "himself",
                                        firstName: "",
                                        lastName: ""
                                    }]
                            }
                        }
                    } as any;
                    dispatch(setSelectedEvent(event));
                }
                enqueueSnackbar(t(`config.add-patient.alert.patient-edit`), { variant: "success" });
            }
        });
    }

    const states = (httpStatesResponse as HttpResponse)?.data as any[];
    const editable = defaultEditStatus.patientDetailContactCard;
    const disableActions = defaultEditStatus.personalInsuranceCard || defaultEditStatus.personalInfoCard;

    useEffect(() => {
        contactData && setFlattenedObject(flattenObject(initialValue));
    }, [contactData]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!editable) {
            const flattenValues = flattenObject(values);
            const changedValues = checkObjectChange(flattenedObject, flattenValues);
            if (Object.keys(changedValues).length > 0 || Object.keys(flattenedObject).length !== Object.keys(flattenValues).length) {
                handleUpdatePatient();
            }
        }
    }, [editable]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <RootStyled>
                    <CardHeader title={
                        <Typography variant="subtitle1" fontSize={18}>
                            {t("config.add-patient.contact")}
                        </Typography>
                    }
                        action={
                            <IconButton size="small" sx={{
                                svg: {
                                    transform: openPanel.includes("contact") ? "" : "scale(-1)",
                                    transition: "transform 0.3s"
                                }
                            }}>
                                <IconUrl path="ic-outline-arrow-up" width={16} height={16} />
                            </IconButton>

                        }
                        sx={{
                            cursor: 'pointer',
                            ".MuiCardHeader-action": {
                                alignSelf: 'center'
                            }
                        }}
                        onClick={() => handleTogglePanels("contact")}
                    />
                    <Collapse in={openPanel.includes("contact")}>
                        <CardContent>
                            <Stack spacing={2}>
                                {/* <Grid container>
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
                                                t("config.add-patient.contact")
                                            )}
                                        </Typography>
                                    </Box>
                                    {editable ?
                                        <Stack direction={"row"} spacing={2} mt={1} justifyContent='flex-end'>
                                            <LoadingButton
                                                onClick={() => setEditable({
                                                    ...defaultEditStatus,
                                                    patientDetailContactCard: false
                                                })}
                                                disabled={Object.keys(errors).length > 0}
                                                className='btn-add'
                                                sx={{margin: 'auto'}}
                                                size='small'
                                                startIcon={<SaveAsIcon/>}>
                                                {t('config.add-patient.register')}
                                            </LoadingButton>
                                        </Stack>
                                        :
                                        <LoadingButton
                                            loading={loadingRequest}
                                            loadingPosition={"start"}
                                            disabled={disableActions}
                                            onClick={() => {
                                                setEditable({
                                                    personalInsuranceCard: false,
                                                    personalInfoCard: false,
                                                    patientDetailContactCard: true
                                                });
                                            }}
                                            startIcon={<IconUrl
                                                {...(disableActions && {color: "white"})}
                                                path={"setting/edit"}/>}
                                            color="primary" size="small">
                                            {t("config.add-patient.edit")}
                                        </LoadingButton>
                                    }
                                </Toolbar>
                            </AppBar>

                            <Grid container spacing={1.2}
                                  onClick={() => {
                                      if (!editable) {
                                          setEditable({
                                              personalInsuranceCard: false,
                                              personalInfoCard: false,
                                              patientDetailContactCard: true
                                          });
                                      }
                                  }}>
                                <Divider textAlign="left" sx={{width: "100%"}}>
                                    <Typography
                                        mt={-1}
                                        className="label"
                                        variant="body2"
                                        color="text.secondary">
                                        {t("config.add-patient.address-group")}
                                    </Typography>
                                </Divider>

                                <Grid item md={12} sm={12} xs={12}
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
                                                {t("config.add-patient.address")}
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
                                                    placeholder={t("config.add-patient.address-placeholder")}
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
                                                {t("config.add-patient.country")}
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
                                                    disabled={!countries_api || !editable}
                                                    autoHighlight
                                                    disableClearable
                                                    size="small"
                                                    value={countries_api?.find((country: CountryModel) => country.uuid === getFieldProps("country").value) ?
                                                        countries_api.find((country: CountryModel) => country.uuid === getFieldProps("country").value) : null}
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
                                                    options={countries_api ? countries_api?.filter((country: CountryModel) => country.hasState) : []}
                                                    loading={!countries_api}
                                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                                    isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                                    renderOption={(props, option) => (
                                                        <MenuItem {...props}>
                                                            {option?.code && <Avatar
                                                                sx={{
                                                                    width: 26,
                                                                    height: 18,
                                                                    borderRadius: 0.6
                                                                }}
                                                                alt={"flags"}
                                                                src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
                                                            />}
                                                            <Typography sx={{ml: 1}}>{option.name}</Typography>
                                                        </MenuItem>
                                                    )}
                                                    renderInput={params => {
                                                        const country = countries_api?.find((country: CountryModel) => country.uuid === getFieldProps("country").value);
                                                        params.InputProps.startAdornment = country && (
                                                            <InputAdornment position="start">
                                                                {country?.code && <Avatar
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 16,
                                                                        borderRadius: 0.6,
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
                                                                          placeholder={t("config.add-patient.country-placeholder")}
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
                                                {t("config.add-patient.region")}
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
                                                    disabled={!states || !editable}
                                                    autoHighlight
                                                    disableClearable
                                                    size="small"
                                                    value={states?.find(country => country.uuid === getFieldProps("region").value) ?
                                                        states.find(country => country.uuid === getFieldProps("region").value) : null}
                                                    onChange={(e, state: any) => {
                                                        setFieldValue("region", state.uuid);
                                                        setFieldValue("zip_code", state.zipCode);
                                                    }}
                                                    sx={{color: "text.secondary"}}
                                                    options={states ? states : []}
                                                    loading={!states}
                                                    getOptionLabel={(option) => option?.name ? option.name : ""}
                                                    isOptionEqualToValue={(option: any, value) => option.name === value?.name}
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
                                                                                      placeholder={t("config.add-patient.region-placeholder")}
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
                                                {t("config.add-patient.zip_code")}
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
                                                    placeholder={t("config.add-patient.zip_code-placeholder")}
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
                                {values.phones.length > 0 && <Divider textAlign="left" sx={{width: "100%"}}>
                                    <Typography
                                        mt={2}
                                        className="label"
                                        variant="body2"
                                        color="text.secondary">
                                        {t("config.add-patient.telephone")}
                                    </Typography>
                                </Divider>}
                                <FieldArray
                                    name={"phones"}
                                    render={() => (values.phones.map((phone: any, index: number) => (
                                            <Grid key={index} item md={12} sm={12} xs={12}>
                                                <Stack direction="row" alignItems="self-start">
                                                    <Grid item md={index === 0 || !editable ? 12 : 10}
                                                          {...(!editable && {className: 'grid-container-border'})}
                                                          sm={12}
                                                          xs={12}
                                                          sx={{
                                                              "& .Input-select": {
                                                                  marginLeft: "-0.8rem"
                                                              }
                                                          }}>
                                                        {loading ? (
                                                            <Skeleton variant="text"/>
                                                        ) : (
                                                            <fieldset>
                                                                <legend>
                                                                    <Typography
                                                                        mr={isMobile ? 1 : 2.4}
                                                                        className="label"
                                                                        variant="body2"
                                                                        color="text.secondary">
                                                                        {`${t("config.add-patient.phone")}  ${values.phones.length > 1 ? ("N° " + (index + 1)) : ""}`}
                                                                    </Typography>
                                                                </legend>
                                                                <Stack alignItems={"center"}
                                                                       alignContent={"center"}
                                                                       spacing={editable ? (Boolean(errors.phones && (errors.phones as any)[index]) ? 3 : 1) : 0}>
                                                                    <Stack direction={"row"} alignItems={"flex-start"}
                                                                           spacing={0}
                                                                           sx={{width: "100%"}}
                                                                           {...(editable && {
                                                                               sx: {
                                                                                   border: `1px solid ${theme.palette.grey['A100']}`,
                                                                                   borderRadius: .6,
                                                                                   height: 38,
                                                                                   width: "100%"
                                                                               }
                                                                           })}>
                                                                        <Grid item md={3.5} sm={5} xs={5}>
                                                                            <Autocomplete
                                                                                size={"small"}
                                                                                disabled={!editable}
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
                                                                                                       placeholder={t("config.add-patient.relation-placeholder")}/>)
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item md={8.5} sm={7} xs={7}>
                                                                            {phone?.code && <PhoneInput
                                                                                ref={phoneInputRef}
                                                                                international
                                                                                disabled={!editable}
                                                                                fullWidth
                                                                                error={Boolean(errors.phones && (errors.phones as any)[index])}
                                                                                withCountryCallingCode
                                                                                {...((editable && Boolean(errors.phones && (errors.phones as any)[index])) &&
                                                                                    {
                                                                                        helperText: `${t("phone_format", {ns: "common"})}: ${getFieldProps(`phones[${index}].value`)?.value ?
                                                                                            getFieldProps(`phones[${index}].value`).value : ""}`
                                                                                    })}
                                                                                InputProps={{
                                                                                    sx: {
                                                                                        "& .MuiOutlinedInput-root input": {
                                                                                            paddingLeft: 1
                                                                                        }
                                                                                    },
                                                                                    startAdornment: (
                                                                                        <InputAdornment
                                                                                            position="start"
                                                                                            sx={{
                                                                                                maxWidth: "3rem",
                                                                                                ...((isMobile || !editable) && {
                                                                                                    "& .MuiAutocomplete-root": {
                                                                                                        width: 20
                                                                                                    },
                                                                                                }),
                                                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                                                    outline: "none",
                                                                                                    borderColor: "transparent"
                                                                                                },
                                                                                                "& fieldset": {
                                                                                                    border: "none!important",
                                                                                                    boxShadow: "none!important"
                                                                                                },
                                                                                            }}>
                                                                                            <Stack direction={'row'}
                                                                                                   alignItems={"center"}
                                                                                                   spacing={3}>
                                                                                                <CountrySelect
                                                                                                    showCountryFlagOnly={true}
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
                                                                                                {(phone?.isWhatsapp && !editable) &&
                                                                                                    <IconUrl
                                                                                                        sx={{ml: 5}}
                                                                                                        width={"16"}
                                                                                                        height={"16"}
                                                                                                        path={"ic-whatsapp"}
                                                                                                        className="ic-tell"
                                                                                                    />}
                                                                                            </Stack>

                                                                                        </InputAdornment>)
                                                                                }}
                                                                                country={getCountryByCode(phone.code)?.code as any}
                                                                                value={phone?.value ? phone.value : ""}
                                                                                onChange={value => setFieldValue(`phones[${index}].value`, value)}
                                                                                inputComponent={CustomInput as any}
                                                                            />}
                                                                        </Grid>
                                                                    </Stack>
                                                                    <Stack direction={"row"} alignItems={"flex-start"}
                                                                           pl={1.8}
                                                                           spacing={0}
                                                                           sx={{width: "100%"}}>
                                                                        {values.phones[index].relation !== "himself" &&
                                                                            <Grid container spacing={.5}>
                                                                                <Grid item md={6} sm={6} xs={12}>
                                                                                    <Stack
                                                                                        direction="row"
                                                                                        spacing={1}
                                                                                        alignItems="center">
                                                                                        <Grid item md={2.5} sm={6} xs={3}>
                                                                                            <Typography
                                                                                                className="label"
                                                                                                variant="body2"
                                                                                                color="text.secondary"
                                                                                                noWrap>
                                                                                                {t("config.add-patient.first-name")}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            {...(editable && {className: "grid-border"})}
                                                                                            item md={9.5} sm={6} xs={9}>
                                                                                            {loading ? (
                                                                                                <Skeleton variant="text"/>
                                                                                            ) : (
                                                                                                <InputBase
                                                                                                    fullWidth
                                                                                                    size={"small"}
                                                                                                    color={"info"}
                                                                                                    placeholder={t("config.add-patient.first-name-placeholder")}
                                                                                                    readOnly={!editable}
                                                                                                    {...getFieldProps(`phones[${index}].firstName`)}
                                                                                                />
                                                                                            )}
                                                                                        </Grid>
                                                                                    </Stack>
                                                                                </Grid>
                                                                                <Grid item md={6} sm={6} xs={12}>
                                                                                    <Stack
                                                                                        ml={1}
                                                                                        direction="row"
                                                                                        spacing={1}
                                                                                        alignItems="center">
                                                                                        <Grid item md={2} sm={6} xs={3}>
                                                                                            <Typography
                                                                                                className="label"
                                                                                                variant="body2"
                                                                                                color="text.secondary"
                                                                                                noWrap>
                                                                                                {t("config.add-patient.last-name")}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            {...(editable && {className: "grid-border"})}
                                                                                            item md={10} sm={6} xs={9}>
                                                                                            {loading ? (
                                                                                                <Skeleton variant="text"/>
                                                                                            ) : (
                                                                                                <InputBase
                                                                                                    fullWidth
                                                                                                    placeholder={t("config.add-patient.last-name-placeholder")}
                                                                                                    readOnly={!editable}
                                                                                                    {...getFieldProps(`phones[${index}].lastName`)}
                                                                                                />
                                                                                            )}
                                                                                        </Grid>
                                                                                    </Stack>
                                                                                </Grid>
                                                                            </Grid>}
                                                                    </Stack>
                                                                </Stack>
                                                            </fieldset>
                                                        )}
                                                    </Grid>
                                                    {editable && <Grid
                                                        item
                                                        xs={index === 0 ? 1 : 2}
                                                        md={index === 0 ? 1 : 2}>
                                                        <Stack
                                                            direction={"row"}
                                                            justifyContent={"center"}
                                                            alignItems={"center"}
                                                            spacing={1.2}
                                                            sx={{
                                                                position: "relative",
                                                                top: "1.3rem"
                                                            }}>
                                                            <ToggleButtonStyled
                                                                disabled={!editable}
                                                                id="toggle-button"
                                                                onClick={() => setFieldValue(`phones[${index}].isWhatsapp`, !values.phones[index].isWhatsapp)}
                                                                value="toggle"
                                                                className={"toggle-button"}
                                                                sx={{
                                                                    minWidth: 34,
                                                                    ml: 1,
                                                                    ...((!editable && !values.phones[index].isWhatsapp) && {display: "none"}),
                                                                    ...(values.phones[index].isWhatsapp && {border: "none"}),
                                                                    background: values.phones[index].isWhatsapp ? theme.palette.primary.main : theme.palette.grey['A500']
                                                                }}>
                                                                <IconUrl width={19} height={19}
                                                                         path={`ic-whatsapp${values.phones[index].isWhatsapp ? '-white' : ''}`}/>
                                                            </ToggleButtonStyled>

                                                            {(index > 0 && editable) && <IconButton
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
                                                    </Grid>}
                                                </Stack>
                                            </Grid>
                                        )
                                    ))}/>
                                <Button size={"small"} sx={{width: 100, mt: 1}} onClick={handleAddPhone}
                                        startIcon={<AddIcon/>}>
                                    {t("config.add-patient.add")}
                                </Button>
                            </Grid>
                        </Grid> */}
                                <FieldArray
                                    name={"phones"}
                                    render={() => (values.phones.map((phone: any, index: number) => (
                                        <Stack direction={"row"} spacing={2} key={index}>
                                            <FormControl fullWidth sx={{ flex: 1.5 }}>
                                                <Typography gutterBottom color="grey.500">{t("config.add-patient.relation")}
                                                    {" "} <span className="required">*</span>
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
                                                        return (<TextField {...(values.phones[index].relation && {
                                                            sx: {
                                                                ".MuiInputBase-root": {
                                                                    bgcolor: theme.palette.grey[50]
                                                                }
                                                            }
                                                        })} {...params}
                                                            placeholder={t("config.add-patient.relation-placeholder")} />)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormControl fullWidth sx={{

                                                flex: 3,
                                                ".MuiInputBase-input": {
                                                    borderLeft: 1,
                                                    borderColor: 'divider',
                                                    ml: 1
                                                },

                                                ...(phone.value && {
                                                    ".MuiInputBase-root": {
                                                        "&.MuiInputBase-root": {
                                                            bgcolor: theme.palette.grey[50]
                                                        }
                                                    }
                                                })
                                            }}>
                                                <Typography gutterBottom color="grey.500">{t("config.add-patient.phone")}
                                                    {" "} <span className="required">*</span>
                                                </Typography>
                                                {phone?.code && <PhoneInput
                                                    ref={phoneInputRef}
                                                    international
                                                    fullWidth
                                                    error={Boolean(errors.phones && (errors.phones as any)[index])}
                                                    withCountryCallingCode
                                                    {...((editable && Boolean(errors.phones && (errors.phones as any)[index])) &&
                                                    {
                                                        helperText: `${t("phone_format", { ns: "common" })}: ${getFieldProps(`phones[${index}].value`)?.value ?
                                                            getFieldProps(`phones[${index}].value`).value : ""}`
                                                    })}
                                                    InputProps={{
                                                        sx: {
                                                            "& .MuiOutlinedInput-root input": {
                                                                paddingLeft: 1
                                                            }
                                                        },
                                                        startAdornment: (
                                                            <InputAdornment
                                                                position="start"
                                                                sx={{
                                                                    maxWidth: "3rem",
                                                                    ...((isMobile || !editable) && {
                                                                        "& .MuiAutocomplete-root": {
                                                                            width: 20
                                                                        },
                                                                    }),
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        outline: "none",
                                                                        borderColor: "transparent"
                                                                    },
                                                                    "& fieldset": {
                                                                        border: "none!important",
                                                                        boxShadow: "none!important"
                                                                    },
                                                                }}>
                                                                <Stack direction={'row'}
                                                                    alignItems={"center"}
                                                                    spacing={3}>
                                                                    <CountrySelect
                                                                        showCountryFlagOnly={true}
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

                                                                        {...(isMobile && { small: true })}
                                                                        initCountry={{
                                                                            code: getCountryByCode(values.phones[index]?.code) ? getCountryByCode(values.phones[index].code)?.code : doctor_country?.code,
                                                                            name: getCountryByCode(values.phones[index]?.code) ? getCountryByCode(values.phones[index].code)?.name : doctor_country?.name,
                                                                            phone: getCountryByCode(values.phones[index]?.code) ? getCountryByCode(values.phones[index].code)?.phone : doctor_country?.phone
                                                                        }}
                                                                        onSelect={(state: any) => {
                                                                            setFieldValue(`phones[${index}].value`, "");
                                                                            setFieldValue(`phones[${index}].code`, state.phone);
                                                                        }} />

                                                                </Stack>

                                                            </InputAdornment>)
                                                    }}
                                                    country={getCountryByCode(phone.code)?.code as any}
                                                    value={phone?.value ? phone.value : ""}
                                                    onChange={value => setFieldValue(`phones[${index}].value`, value)}
                                                    inputComponent={CustomInput as any}
                                                />}
                                            </FormControl>
                                            {phone?.isWhatsapp &&
                                                <Link sx={{ flex: .25, alignSelf: 'flex-end' }} underline="none" href={`https://wa.me/${phone.value}`} target="_blank">
                                                    <CustomIconButton style={{ minHeight: 38, minWidth: 38 }} sx={{ bgcolor: theme.palette.common.white, border: 1, borderColor: 'divider' }}>
                                                        <IconUrl
                                                            width={"16"}
                                                            height={"16"}
                                                            path={"ic-whatsapp"}
                                                            className="ic-tell"
                                                        />
                                                    </CustomIconButton>
                                                </Link>
                                            }
                                        </Stack>
                                    )))}
                                />


                            </Stack>
                        </CardContent>
                    </Collapse>
                    <CardHeader title={
                        <Typography variant="subtitle1" fontSize={18}>
                            {t("config.add-patient.additional_info")}
                        </Typography>
                    }
                        action={
                            <IconButton size="small" sx={{
                                svg: {
                                    transform: openPanel.includes("info") ? "" : "scale(-1)",
                                    transition: "transform 0.3s"
                                }
                            }}>
                                <IconUrl path="ic-outline-arrow-up" width={16} height={16} />
                            </IconButton>

                        }
                        sx={{
                            cursor: 'pointer',
                            ".MuiCardHeader-action": {
                                alignSelf: 'center'
                            }
                        }}
                        onClick={() => handleTogglePanels("info")}
                    />
                    <Collapse in={openPanel.includes("info")} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Stack spacing={2}>
                                <FormControl>
                                    <Typography gutterBottom color="grey.500">{t("config.add-patient.address")}
                                        {" "} <span className="required">*</span>
                                    </Typography>
                                    <TextField
                                        placeholder={t("config.add-patient.address-placeholder")}
                                        {...getFieldProps("address")}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconUrl path="ic-outline-location" width={20} height={20} color={theme.palette.grey[400]} />
                                                </InputAdornment>
                                            )
                                        }}

                                    />
                                </FormControl>
                                <Stack direction='row' spacing={2}>
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.country")}</Typography>
                                        <Autocomplete
                                            id={"country"}
                                            disabled={!countries_api}
                                            autoHighlight
                                            disableClearable
                                            size="small"
                                            value={countries_api?.find((country: CountryModel) => country.uuid === getFieldProps("country").value) ?
                                                countries_api.find((country: CountryModel) => country.uuid === getFieldProps("country").value) : null}
                                            onChange={(e, v: any) => {
                                                setFieldValue("country", v.uuid);
                                            }}
                                            options={countries_api ? countries_api?.filter((country: CountryModel) => country.hasState) : []}
                                            loading={!countries_api}
                                            getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                            isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                            renderOption={(props, option) => (
                                                <MenuItem {...props}>
                                                    {option?.code && <Avatar
                                                        sx={{
                                                            width: 26,
                                                            height: 18,
                                                            borderRadius: 0.6
                                                        }}
                                                        alt={"flags"}
                                                        src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
                                                    />}
                                                    <Typography sx={{ ml: 1 }}>{option.name}</Typography>
                                                </MenuItem>
                                            )}
                                            renderInput={params => {
                                                const country = countries_api?.find((country: CountryModel) => country.uuid === getFieldProps("country").value);
                                                params.InputProps.startAdornment = country && (
                                                    <InputAdornment position="start">
                                                        {country?.code && <Avatar
                                                            sx={{
                                                                width: 24,
                                                                height: 16,
                                                                borderRadius: 0.6,
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
                                                    placeholder={t("config.add-patient.country-placeholder")}
                                                    variant="outlined" fullWidth />;
                                            }} />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.region")}</Typography>
                                        <Autocomplete
                                            id={"region"}
                                            disabled={!states}
                                            autoHighlight
                                            disableClearable
                                            size="small"
                                            value={states?.find(country => country.uuid === getFieldProps("region").value) ?
                                                states.find(country => country.uuid === getFieldProps("region").value) : null}
                                            onChange={(e, state: any) => {
                                                setFieldValue("region", state.uuid);
                                                setFieldValue("zip_code", state.zipCode);
                                            }}
                                            sx={{ color: "text.secondary" }}
                                            options={states ? states : []}
                                            loading={!states}
                                            getOptionLabel={(option) => option?.name ? option.name : ""}
                                            isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                            renderOption={(props, option) => (
                                                <MenuItem
                                                    {...props}
                                                    key={option.uuid}
                                                    value={option.uuid}>
                                                    <Typography sx={{ ml: 1 }}>{option.name}</Typography>
                                                </MenuItem>
                                            )}
                                            renderInput={params => <TextField color={"info"}
                                                {...params}
                                                placeholder={t("config.add-patient.region-placeholder")}
                                                sx={{ paddingLeft: 0 }}
                                                variant="outlined"
                                                fullWidth />} />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.zip_code")}</Typography>
                                        <TextField
                                            placeholder={t("config.add-patient.zip_code-placeholder")}
                                            {...getFieldProps("zip_code")}
                                        />
                                    </FormControl>
                                </Stack>
                                <FormControl fullWidth>
                                    <Typography gutterBottom color="grey.500">{t("config.add-patient.email")}</Typography>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconUrl path="ic-outline-sms" width={20} height={20} color={theme.palette.grey[400]} />
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder={t("config.add-patient.email-placeholder")}
                                        {...getFieldProps("email")}
                                    />
                                </FormControl>
                                <Stack direction='row' spacing={2}>
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.nationality")}</Typography>

                                        <Autocomplete
                                            id={"nationality"}
                                            autoHighlight
                                            disableClearable
                                            size="small"
                                            value={countries_api.find((country: CountryModel) => country.uuid === getFieldProps("nationality").value) ?
                                                countries_api.find((country: CountryModel) => country.uuid === getFieldProps("nationality").value) : ""}
                                            onChange={(e, v: any) => {
                                                setFieldValue("nationality", v.uuid);
                                            }}
                                            sx={{ color: "text.secondary" }}
                                            options={countries_api}
                                            loading={countries_api.length === 0}
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
                                                const country = countries?.find((country: CountryModel) => country.uuid === getFieldProps("nationality").value);
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
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.id_card_number")}</Typography>
                                        <TextField
                                            placeholder={t("config.add-patient.id_card_number_placeholder")}
                                            {...getFieldProps("id_card_number")}
                                        />
                                    </FormControl>
                                </Stack>
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.profession")}</Typography>
                                        <TextField
                                            placeholder={t("config.add-patient.profession-placeholder")}
                                            {...getFieldProps("profession")}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <Typography gutterBottom color="grey.500">{t("config.add-patient.family_doctor")}</Typography>
                                        <TextField
                                            placeholder={t("config.add-patient.family_doctor-placeholder")}
                                            {...getFieldProps("profession")}
                                        />
                                    </FormControl>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Collapse>
                </RootStyled>
            </Form>
        </FormikProvider>
    );
}

export default PatientContactDetailCard;
