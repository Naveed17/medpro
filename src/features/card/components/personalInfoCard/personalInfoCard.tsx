import React, { memo, useEffect, useState } from "react";
// hook
import { useTranslation } from "next-i18next";
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
    AppBar, Autocomplete, Avatar,
    Box,
    CardContent,
    CardHeader,
    Collapse,
    Grid, IconButton, InputAdornment,
    InputBase, ListItem, ListItemText,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Typography,
    useTheme,
    alpha
} from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import IconUrl from "@themes/urlIcon";
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment-timezone";
import { LoadingButton } from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { agendaSelector, setSelectedEvent } from "@features/calendar";
import { dashLayoutSelector } from "@features/base";
import { checkObjectChange, flattenObject, getBirthday, useMedicalEntitySuffix } from "@lib/hooks";


import { LoadingScreen } from "@features/loadingScreen";
import { AsyncAutoComplete } from "@features/autoComplete";
import CalendarPickerIcon from "@themes/overrides/icons/calendarPickerIcon";
import { InputStyled } from "@features/tabPanel";

export const MyTextInput: any = memo(({ ...props }) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

function PersonalInfo({ ...props }) {
    const {
        patient, mutatePatientDetails, mutatePatientList = null,
        mutateAgenda = null, countries_api,
        loading = false, editable: defaultEditStatus, setEditable
    } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const [openPanels, setOpenPanels] = useState<string[]>([])
    const [loadingRequest, setLoadingRequest] = useState(false);

    const { t, ready } = useTranslation("patient", { keyPrefix: "config.add-patient" });
    const { t: commonTranslation } = useTranslation("common");
    const { selectedEvent: appointment } = useAppSelector(agendaSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

    const { trigger: triggerPatientUpdate } = useRequestQueryMutation("/patient/update");
    const { trigger: triggerAddressedBy } = useRequestQueryMutation("/patient/addressed-by/add");
    const handleTogglePanels = (panel: string) => {
        const newOpenPanels = openPanels.includes(panel) ? openPanels.filter(item => item !== panel) : [...openPanels, panel];
        setOpenPanels(newOpenPanels);
    }
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
        picture: { url: "", file: "" },
        gender: !loading && patient.gender
            ? patient.gender === "M" ? "1" : "2"
            : "",
        firstName: !loading ? `${patient.firstName.trim()}` : "",
        lastName: !loading ? `${patient.lastName.trim()}` : "",
        birthdate: !loading && patient.birthdate ? patient.birthdate : "",
        old: !loading && patient.birthdate ? getBirthday(patient.birthdate).years : "",
        email: !loading && patient.email && patient.email !== "null" ? patient.email : "",
        cin: !loading && patient.idCard && patient.idCard !== "null" ? patient.idCard : "",
        addressedBy: !loading && patient.addressedBy && patient.addressedBy?.length > 0 ? patient.addressedBy[0] : "",
        civilStatus: !loading && patient.civilStatus && patient.civilStatus !== "null" ? patient.civilStatus : "",
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
        values.addressedBy?.uuid && params.append('addressed_by', values.addressedBy.uuid);
        values.civilStatus?.uuid && params.append('civil_status', values.civilStatus.uuid);
        values.birthdate?.length > 0 && params.append('birthdate', values.birthdate);
        patient.note && params.append('note', patient.note);

        medicalEntityHasUser && triggerPatientUpdate({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/infos/${router.locale}`,
            data: params,
        }, {
            onSuccess: () => {
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
                enqueueSnackbar(t(`alert.patient-edit`), { variant: "success" });
            }
        });
    }

    const { handleSubmit, values, errors, touched, getFieldProps, setFieldValue } = formik;
    const editable = defaultEditStatus.personalInfoCard;
    const disableActions = defaultEditStatus.personalInsuranceCard || defaultEditStatus.patientDetailContactCard;
    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("picture.url", URL.createObjectURL(file));
        setFieldValue("picture.file", file);
    }
    useEffect(() => {
        if (!editable) {
            const changedValues = checkObjectChange(flattenedObject, values);
            if (Object.keys(changedValues).length > 0) {
                handleSubmit();
            }
        }
    }, [editable]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <PersonalInfoStyled>
                    <Paper sx={{ border: 'none', borderRadius: 0 }}>
                        {/* <AppBar position="static" color={"transparent"}>
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
                        </AppBar> */}

                        {/* <Grid container spacing={1}
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
                            <Grid sx={{ "& .MuiGrid-item": { pt: .4 } }} item md={6} sm={6} xs={12}>
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
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                                {...getFieldProps("gender")}>
                                                <MenuItem
                                                    value={1}>{t(getBirthday(patient.birthdate).years < 18 ? "male" : "mr")}</MenuItem>
                                                <MenuItem
                                                    value={2}>{t(getBirthday(patient.birthdate).years < 18 ? "female" : "mrs")}</MenuItem>
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
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                            <Skeleton variant="text" />
                                        ) : (
                                            <DatePicker
                                                readOnly={!editable}
                                                format={"dd/MM/yyyy"}
                                                value={values.birthdate ? moment(values.birthdate, "DD-MM-YYYY").toDate() : null}
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
                                                slots={{
                                                    openPickerIcon: CalendarPickerIcon,
                                                }}
                                                slotProps={{ textField: { size: "small" } }}
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
                                            {t("old")}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
                                        ) : (
                                            <InputBase
                                                placeholder={t("email-placeholder")}
                                                readOnly={!editable}
                                                type={"email"}
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
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                        {...(editable && { className: "grid-border" })}
                                        item md={8} sm={6} xs={9}>
                                        {loading ? (
                                            <Skeleton variant="text" />
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
                                            <Skeleton width={100} />
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
                                                            sx={{ ml: 1 }}>{option.nationality}</Typography>
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
                                                        sx={{ paddingLeft: 0 }}
                                                        placeholder={t("nationality")}
                                                        variant="outlined" fullWidth />;
                                                }} />
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
                                            {t("addressed-by")}
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
                                            <Skeleton width={100} />
                                        ) : (
                                            <AsyncAutoComplete
                                                freeSolo
                                                loading={loadingRequest}
                                                value={values.addressedBy}
                                                {...(editable && {
                                                    sx: {
                                                        color: "text.secondary",
                                                        borderRadius: .6,
                                                        border: `1px solid ${theme.palette.grey['A100']}`
                                                    }
                                                })}
                                                url={`${urlMedicalEntitySuffix}/addressedBy/${router.locale}`}
                                                onChangeData={(event: any) => {
                                                    if (event?.inputValue || typeof event === "string") {
                                                        // Create a new value from the user input
                                                        setLoadingRequest(true);
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
                                                            onSettled: () => setLoadingRequest(false)
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
                                                            name: `${t("add")} "${inputValue}"`,
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
                                                placeholder={t("addressed-by-placeholder")}
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
                                            {t("civil-status")}
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
                                            <Skeleton width={100} />
                                        ) : (
                                            <AsyncAutoComplete
                                                value={values.civilStatus}
                                                {...(editable && {
                                                    sx: {
                                                        color: "text.secondary",
                                                        borderRadius: .6,
                                                        border: `1px solid ${theme.palette.grey['A100']}`
                                                    }
                                                })}
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
                                                        <ListItemText primary={`${option?.name}`} />
                                                    </ListItem>
                                                )}
                                                isOptionEqualToValue={(option: any, value: any) => option?.uuid === value?.uuid}
                                                placeholder={t("civil-status-placeholder")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                        </Grid> */}
                        <CardHeader title={
                            <Typography variant="subtitle1" fontSize={18}>
                                {t("personal-info")}
                            </Typography>
                        }
                            action={
                                <IconButton size="small" sx={{
                                    svg: {
                                        transform: openPanels.includes("personal") ? "" : "scale(-1)"
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
                            onClick={() => handleTogglePanels("personal")}
                        />
                        <Collapse in={openPanels.includes("personal")}>
                            <CardContent>
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <Box position='relative' width={70} height={70}
                                        sx={{
                                            '.close': {
                                                opacity: 0,
                                                visibility: 'hidden',
                                                transition: 'all .2s ease-in-out'
                                            },
                                            '&:hover .close': {
                                                opacity: 1,
                                                visibility: 'visible'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{ width: 70, height: 70, cursor: 'pointer' }}
                                            component='label'
                                            htmlFor="contained-button-file"
                                            src={values.picture.url}
                                        >
                                            <InputStyled
                                                onChange={(e) => handleDrop(e.target.files as FileList)}
                                                id="contained-button-file"
                                                type="file"
                                            />
                                            <IconUrl path="ic-linear-camera-add" width={28} height={28} />
                                        </Avatar>
                                        {values.picture.url && (
                                            <IconButton
                                                className="close"
                                                size="small"
                                                disableRipple
                                                onClick={() => {
                                                    setFieldValue("picture", { url: "", file: null });
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    background: alpha(theme.palette.grey['A100'], .6),
                                                    top: 2,
                                                    right: 2,
                                                    p: .25

                                                }}
                                            >
                                                <IconUrl path="ic-x" width={16} height={16} />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Collapse>
                    </Paper>
                </PersonalInfoStyled>
            </Form>
        </FormikProvider >
    );
}

export default PersonalInfo;
