import React, {memo, useEffect, useState} from "react";
// hook
import {useTranslation} from "next-i18next";
import {Form, FormikProvider, useFormik} from "formik";
// material
import {
    AppBar, Autocomplete, Avatar,
    Box,
    Button,
    Grid, InputAdornment,
    InputBase,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useSnackbar} from "notistack";
import IconUrl from "@themes/urlIcon";
import Select from '@mui/material/Select';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import moment from "moment-timezone";
import {LoadingButton} from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import CloseIcon from "@mui/icons-material/Close";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, setSelectedEvent} from "@features/calendar";
import {dashLayoutSelector} from "@features/base";
import {checkObjectChange, flattenObject, getBirthday, useMedicalEntitySuffix} from "@lib/hooks";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

export const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

function PersonalInfo({...props}) {
    const {
        patient, mutatePatientDetails, mutatePatientList = null,
        mutateAgenda = null, countries_api,
        loading = false, editable: defaultEditStatus, setEditable
    } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const [loadingRequest, setLoadingRequest] = useState(false);

    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    const {t: commonTranslation} = useTranslation("common");
    const {selectedEvent: appointment} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const RegisterPatientSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, t("name-error"))
            .max(50, t("name-error"))
            .required(t("name-error")),
        lastName: Yup.string()
            .min(3, t("name-error"))
            .max(50, t("name-error"))
            .required(t("name-error")),
        email: Yup.string()
            .email('Invalid email format'),
        birthdate: Yup.string(),
        old: Yup.string(),
        profession: Yup.string(),
        cin: Yup.string(),
        familyDoctor: Yup.string(),
        nationality: Yup.string()
    });

    const initialValue = {
        gender: !loading && patient.gender
            ? patient.gender === "M" ? "1" : "2"
            : "",
        firstName: !loading ? `${patient.firstName.trim()}` : "",
        lastName: !loading ? `${patient.lastName.trim()}` : "",
        birthdate: !loading && patient.birthdate ? patient.birthdate : "",
        old: !loading && patient.birthdate ? getBirthday(patient.birthdate).years : "",
        email: !loading && patient.email && patient.email !== "null" ? patient.email : "",
        cin: !loading && patient.idCard && patient.idCard !== "null" ? patient.idCard : "",
        profession: !loading && patient.profession && patient.profession !== "null" ? patient.profession : "",
        familyDoctor: !loading && patient.familyDoctor && patient.familyDoctor !== "null" ? patient.familyDoctor : "",
        nationality: !loading && patient?.nationality && patient.nationality !== "null" ? patient.nationality.uuid : ""
    };
    const flattenedObject = flattenObject(initialValue);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema: RegisterPatientSchema,
        onSubmit: async () => {
            handleUpdatePatient();
        },
    });

    const handleUpdatePatient = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('first_name', values.firstName);
        params.append('last_name', values.lastName);
        params.append('gender', values.gender);
        params.append('email', values.email);
        params.append('id_card', values.cin);
        params.append('profession', values.profession);
        params.append('family_doctor', values.familyDoctor);
        params.append('nationality', values.nationality);
        values.birthdate?.length > 0 && params.append('birthdate', values.birthdate);
        patient.note && params.append('note', patient.note);

        medicalEntityHasUser && triggerPatientUpdate({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/infos/${router.locale}`,
            data: params,
        }).then(() => {
            setLoadingRequest(false);
            mutatePatientDetails && mutatePatientDetails();
            mutatePatientList && mutatePatientList();
            mutateAgenda && mutateAgenda();

            if (appointment) {
                const event = {
                    ...appointment,
                    title: `${values.firstName} ${values.lastName}`,
                    extendedProps: {
                        ...appointment.extendedProps,
                        patient: {
                            ...appointment.extendedProps.patient,
                            ...values,
                            gender: values.gender === '1' ? 'M' : 'F'
                        }
                    }
                } as any;
                dispatch(setSelectedEvent(event));
            }
            enqueueSnackbar(t(`alert.patient-edit`), {variant: "success"});
        });
    }

    const {handleSubmit, values, errors, touched, getFieldProps, setFieldValue} = formik;
    const editable = defaultEditStatus.personalInfoCard;
    const disableActions = defaultEditStatus.personalInsuranceCard || defaultEditStatus.patientDetailContactCard;

    useEffect(() => {
        if (!editable) {
            const changedValues = checkObjectChange(flattenedObject, values);
            if (Object.keys(changedValues).length > 0) {
                handleSubmit();
            }
        }
    }, [editable]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <PersonalInfoStyled>
                    <Paper
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: 12,
                                pt: 0
                            },
                            p: 1.5, borderWidth: 0
                        }}>
                        <AppBar position="static" color={"transparent"}>
                            <Toolbar variant="dense">
                                <Box sx={{flexGrow: 1}}>
                                    <Typography
                                        variant="body1"
                                        sx={{fontWeight: "bold"}}
                                        gutterBottom>
                                        {loading ? (
                                            <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                        ) : (
                                            t("personal-info")
                                        )}
                                    </Typography>
                                </Box>
                                {editable ?
                                    <Stack direction={"row"} spacing={2} mt={1} justifyContent='flex-end'>
                                        <Button
                                            onClick={() => setEditable({...defaultEditStatus, personalInfoCard: false})}
                                            color={"error"}
                                            className='btn-cancel'
                                            sx={{margin: 'auto'}}
                                            size='small'
                                            startIcon={<CloseIcon/>}>
                                            {t('cancel')}
                                        </Button>
                                        <LoadingButton
                                            onClick={() => setEditable({...defaultEditStatus, personalInfoCard: false})}
                                            disabled={Object.keys(errors).length > 0}
                                            className='btn-add'
                                            sx={{margin: 'auto'}}
                                            size='small'
                                            startIcon={<SaveAsIcon/>}>
                                            {t('register')}
                                        </LoadingButton>
                                    </Stack>
                                    :
                                    <LoadingButton
                                        loading={loadingRequest}
                                        loadingPosition={"start"}
                                        disabled={disableActions}
                                        onClick={() => {
                                            setEditable({
                                                patientDetailContactCard: false,
                                                personalInsuranceCard: false,
                                                personalInfoCard: true
                                            });
                                        }}
                                        startIcon={<IconUrl
                                            {...(disableActions && {color: "white"})}
                                            path={"setting/edit"}/>}
                                        color="primary" size="small">
                                        {t("edit")}
                                    </LoadingButton>
                                }
                            </Toolbar>
                        </AppBar>

                        <Grid container spacing={1}
                              onClick={() => {
                                  if (!editable) {
                                      setEditable({
                                          patientDetailContactCard: false,
                                          personalInsuranceCard: false,
                                          personalInfoCard: true
                                      });
                                  }
                              }}
                              sx={{
                                  marginTop: "0.4rem"
                              }}>
                            <Grid sx={{"& .MuiGrid-item": {pt: .4}}} item md={6} sm={6} xs={12}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyItems={"center"}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("gender")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable ? {
                                                sx: {
                                                    border: `1px solid ${theme.palette.grey['A100']}`,
                                                    borderRadius: .5,
                                                    height: 31,
                                                    "& .MuiSelect-select": {
                                                        pl: 1.5
                                                    }
                                                }
                                            } :
                                            {
                                                sx: {
                                                    "& .MuiSelect-select": {
                                                        p: 0
                                                    }
                                                }
                                            })}
                                        item md={8} sm={6} xs={9}
                                    >
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <Select
                                                fullWidth
                                                sx={{
                                                    pl: 0,
                                                    "& .MuiSvgIcon-root": {
                                                        display: !editable ? "none" : "inline-block"
                                                    }
                                                }}
                                                size="medium"
                                                readOnly={!editable}
                                                error={Boolean(touched.gender && errors.gender)}
                                                {...getFieldProps("gender")}
                                            >
                                                <MenuItem value={1}>{t("mr")}</MenuItem>
                                                <MenuItem value={2}>{t("mrs")}</MenuItem>
                                            </Select>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("first-name")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("name-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.firstName && errors.firstName)}
                                                {...getFieldProps("firstName")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("last-name")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("name-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.lastName && errors.lastName)}
                                                {...getFieldProps("lastName")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("birthdate")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        className={`datepicker-grid-border ${!editable ? "datepicker-style" : ""}`}
                                        {...(editable ? {
                                            sx: {
                                                border: `1px solid ${theme.palette.grey['A100']}`,
                                                borderRadius: 1,
                                            }
                                        } : {
                                            sx: {
                                                "& .MuiOutlinedInput-root button": {
                                                    display: "none"
                                                }
                                            }
                                        })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    readOnly={!editable}
                                                    inputFormat={"dd/MM/yyyy"}
                                                    mask="__/__/____"
                                                    value={values.birthdate ? moment(values.birthdate, "DD-MM-YYYY") : null}
                                                    onChange={date => {
                                                        const dateInput = moment(date);
                                                        setFieldValue("birthdate", dateInput.isValid() ? dateInput.format("DD-MM-YYYY") : null);
                                                        if (dateInput.isValid()) {
                                                            const old = getBirthday(dateInput.format("DD-MM-YYYY")).years;
                                                            setFieldValue("old", old > 120 ? "" : old);
                                                        } else {
                                                            setFieldValue("old", "");
                                                        }
                                                    }}
                                                    renderInput={(params) => <TextField size={"small"} {...params} />}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("old")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("old-placeholder")}
                                                endAdornment={<Typography
                                                    mr={1}>{commonTranslation(`times.years`)}</Typography>}
                                                readOnly={!editable}
                                                error={Boolean(touched.email && errors.email)}
                                                value={values.old ?? ""}
                                                onChange={event => {
                                                    const old = parseInt(event.target.value);
                                                    setFieldValue("old", old ? old : "");
                                                    if (old) {
                                                        setFieldValue("birthdate", (values.birthdate ?
                                                            moment(values.birthdate, "DD-MM-YYYY") : moment()).set("year", moment().get("year") - old).format("DD-MM-YYYY")
                                                        );
                                                    }
                                                }}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("email")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("email-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.email && errors.email)}
                                                {...getFieldProps("email")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("cin")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("cin-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.cin && errors.cin)}
                                                {...getFieldProps("cin")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("profession")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("profession-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.cin && errors.cin)}
                                                {...getFieldProps("profession")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>

                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={3}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("family_doctor")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && {className: "grid-border"})}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("family_doctor-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.cin && errors.cin)}
                                                {...getFieldProps("familyDoctor")}
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
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton width={100}/>
                                        ) : (
                                            <Autocomplete
                                                id={"nationality"}
                                                disabled={!countries_api || !editable}
                                                autoHighlight
                                                disableClearable
                                                size="small"
                                                value={countries_api?.find((country: CountryModel) => country.uuid === getFieldProps("nationality").value) ?
                                                    countries_api.find((country: CountryModel) => country.uuid === getFieldProps("nationality").value) : null}
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
                                                options={countries_api ? [...new Map(countries_api.map((country: CountryModel) => [country["nationality"], country])).values()] : []}
                                                loading={!countries_api}
                                                getOptionLabel={(option: any) => option?.nationality ? option.nationality : ""}
                                                isOptionEqualToValue={(option: any, value) => option.nationality === value?.nationality}
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
                                                        <Typography
                                                            sx={{ml: 1}}>{option.nationality}</Typography>
                                                    </MenuItem>
                                                )}
                                                renderInput={params => {
                                                    const country = countries_api?.find((country: CountryModel) => country.uuid === getFieldProps("nationality").value);
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
                        </Grid>
                    </Paper>
                </PersonalInfoStyled>
            </Form>
        </FormikProvider>
    );
}

export default PersonalInfo;
