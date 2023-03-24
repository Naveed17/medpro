import React, {memo, useState} from "react";
// hook
import {useTranslation} from "next-i18next";
import {Form, FormikProvider, useFormik} from "formik";
// material
import {
    AppBar,
    Box,
    Button,
    Grid,
    InputBase,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useSnackbar} from "notistack";
import IconUrl from "@themes/urlIcon";
import Select from '@mui/material/Select';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment-timezone";
import {LoadingButton} from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingScreen} from "@features/loadingScreen";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, setSelectedEvent} from "@features/calendar";
import {Theme} from "@mui/material/styles";

export const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

function PersonalInfo({...props}) {
    const {
        patient, mutatePatientDetails, mutatePatientList = null, mutateAgenda = null,
        loading, editable: defaultEditStatus, setEditable, currentSection, setCurrentSection
    } = props;

    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [loadingRequest, setLoadingRequest] = useState(false);

    const {selectedEvent: appointment} = useAppSelector(agendaSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});

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
        address: Yup.string(),
        email: Yup.string()
            .email('Invalid email format'),
        birthdate: Yup.string(),
        profession: Yup.string(),
        cin: Yup.string(),
        familyDoctor: Yup.string()
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            gender: !loading && patient.gender
                ? patient.gender === "M" ? "1" : "2"
                : "",
            firstName: !loading ? `${patient.firstName.trim()}` : "",
            lastName: !loading ? `${patient.lastName.trim()}` : "",
            birthdate: !loading && patient.birthdate ? patient.birthdate : "",
            address:
                !loading && patient.address.length > 0
                    ? patient.address[0].city?.name + ", " + patient.address[0].street
                    : "",
            email: !loading && patient.email ? patient.email : "",
            cin: !loading && patient.idCard ? patient.idCard : "",
            profession: !loading && patient.profession ? patient.profession : "",
            familyDoctor: !loading && patient.familyDoctor ? patient.familyDoctor : ""
        },
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
        params.append('phone', JSON.stringify(
            patient.contact.filter((contact: ContactModel) => contact.type === "phone").map((phone: any) => ({
                code: phone.code,
                value: phone.value.replace(phone.code, ""),
                type: "phone",
                "contact_type": patient.contact[0].uuid,
                "is_public": false,
                "is_support": false
            }))));
        params.append('email', values.email);
        params.append('id_card', values.cin);
        params.append('profession', values.profession);
        params.append('family_doctor', values.familyDoctor);
        values.birthdate?.length > 0 && params.append('birthdate', values.birthdate);
        params.append('address', JSON.stringify({
            fr: values.address
        }));
        patient.note && params.append('note', patient.note);
        patient.nationality && params.append('nationality', patient.nationality.uuid);
        patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('country', patient?.address[0]?.city?.country?.uuid);
        patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('region', patient?.address[0]?.city?.uuid);
        patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('zip_code', patient?.address[0]?.postalCode);

        triggerPatientUpdate({
            method: "PUT",
            url: "/api/medical-entity/" + medical_entity.uuid + '/patients/' + patient?.uuid + '/' + router.locale,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        }).then(() => {
            setLoadingRequest(false);
            setEditable(false);
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
    const editable = currentSection === "PersonalInfo" && defaultEditStatus;
    const disableActions = defaultEditStatus && currentSection !== "PersonalInfo";

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

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
                                            disabled={Object.keys(errors).length > 0}
                                            loading={loadingRequest}
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
                                            setCurrentSection("PersonalInfo");
                                            setEditable(true);
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

                        <Grid container spacing={1}
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
                                        item md={8} sm={6} xs={9}>
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
                                                        setFieldValue("birthdate", dateInput.isValid() ? dateInput.format("DD-MM-YYYY") : "");
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
                        </Grid>
                    </Paper>
                </PersonalInfoStyled>
            </Form>
        </FormikProvider>
    );
}

export default PersonalInfo;
