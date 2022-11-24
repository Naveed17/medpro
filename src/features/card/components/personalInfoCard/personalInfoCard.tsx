import React, {useState} from "react";
// hook
import {useTranslation} from "next-i18next";
import {useFormik, Form, FormikProvider} from "formik";
// material
import {
    Box,
    Typography,
    Paper,
    Grid,
    Skeleton,
    InputBase, AppBar, Toolbar, IconButton, MenuItem, TextField
} from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {Stack} from "@mui/system";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {PhoneRegExp} from "@features/tabPanel";
import {useSnackbar} from "notistack";
import IconUrl from "@themes/urlIcon";
import Select from '@mui/material/Select';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment-timezone";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";

function PersonalInfo({...props}) {
    const {patient, mutate: mutatePatientData, mutatePatientList = null, loading} = props;

    const {data: session} = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [editable, setEditable] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config.add-patient",
    });

    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
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
        address: Yup.string()
            .min(3, t("name-error"))
            .max(50, t("name-error")),
        email: Yup.string()
            .email('Invalid email format'),
        birthdate: Yup.string(),
        cin: Yup.number(),
        telephone: Yup.string()
            .min(8, t("telephone-error"))
            .matches(PhoneRegExp, t("telephone-error"))
            .required(t("telephone-error")),
        insurances: Yup.array()
            .of(
                Yup.object().shape({
                    insurance_number: Yup.string().min(3, t("insurances-error")),
                    insurance_uuid: Yup.string().min(3, t("insurances-error"))
                })
            )
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
            telephone:
                !loading && patient.contact.length > 0
                    ? patient.contact[0].value
                    : "",
            email: !loading && patient.email ? patient.email : "",
            cin: !loading && patient.idCard ? patient.idCard : "",
            insurances: !loading && patient.insurances.length > 0 ? patient.insurances.map((insurance: any) => ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid
            })) : [{
                insurance_number: "",
                insurance_uuid: ""
            }] as {
                insurance_number: string;
                insurance_uuid: string;
            }[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async (values) => {
            handleUpdatePatient();
        },
    });

    const handleAddInsurance = () => {
        const insurance = [...values.insurances, {insurance_uuid: "", insurance_number: ""}];
        setFieldValue("insurances", insurance);
    }

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurances];
        insurance.splice(index, 1);
        formik.setFieldValue("insurances", insurance);
    };

    const handleUpdatePatient = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('first_name', values.firstName);
        params.append('last_name', values.lastName);
        params.append('gender', values.gender);
        params.append('phone', JSON.stringify({
            code: patient.contact[0].code,
            value: values.telephone,
            type: "phone",
            "contact_type": patient.contact[0].uuid,
            "is_public": false,
            "is_support": false
        }));
        params.append('email', values.email);
        params.append('id_card', values.cin);
        params.append('insurance', JSON.stringify(values.insurances));
        values.birthdate.length > 0 && params.append('birthdate', values.birthdate);
        params.append('address', JSON.stringify({
            fr: values.address
        }));

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
            mutatePatientData();
            if (mutatePatientList) {
                mutatePatientList();
            }
            enqueueSnackbar(t(`alert.patient-edit`), {variant: "success"});
        });
    }

    const {handleSubmit, values, errors, touched, getFieldProps, setFieldValue} = formik;
    if (!ready) return <div>Loading...</div>;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <PersonalInfoStyled
                    sx={{
                        mt: "0.5rem",
                        "& .MuiSelect-select": {
                            padding: "0 2rem 0 1rem"
                        },
                        "& .MuiInputBase-root": {
                            background: "no-repeat!important",
                            "&:hover": {
                                backgroundColor: "none"
                            },
                        },
                        "& fieldset": {
                            border: "none!important",
                            boxShadow: "none!important"
                        },
                        "& .MuiPaper-root": {
                            pt: 0
                        },
                        "& .MuiAppBar-root": {
                            border: "none",
                            borderBottom: "1px solid #E0E0E0",
                            height: 46,
                            mb: 2,
                            "& .MuiTypography-root": {
                                fontSize: 14,
                                pt: 0
                            }
                        },
                        "& .MuiToolbar-root": {
                            float: "right",
                            padding: 0
                        }
                    }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: 14
                        }}
                        color="text.primary"
                        gutterBottom>
                        {loading ? (
                            <Skeleton variant="text" sx={{maxWidth: 200}}/>
                        ) : (
                            t("personal-info")
                        )}
                    </Typography>
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
                                <Box sx={{flexGrow: 1}}/>
                                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                    {editable ?
                                        <Stack mt={1} justifyContent='flex-end'>
                                            <LoadingButton
                                                onClick={() => handleUpdatePatient()}
                                                loading={loadingRequest}
                                                className='btn-add'
                                                sx={{margin: 'auto'}}
                                                size='small'
                                                startIcon={<SaveAsIcon/>}>
                                                {t('register')}
                                            </LoadingButton>
                                        </Stack>
                                        :
                                        <IconButton onClick={() => setEditable(true)} color="inherit" size="small">
                                            <IconUrl path={"setting/edit"}/>
                                        </IconButton>
                                    }
                                </Box>
                            </Toolbar>
                        </AppBar>
                        <Grid container spacing={1.2}>
                            <Grid item md={4} sm={6} xs={6}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={2.5} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("gender")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={7.5} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <Select
                                                sx={{
                                                    "& .MuiSvgIcon-root": {
                                                        display: !editable ? "none" : "inline-block"
                                                    }
                                                }}
                                                size="small"
                                                readOnly={!editable}
                                                error={Boolean(touched.gender && errors.gender)}
                                                {...getFieldProps("gender")}
                                            >
                                                <MenuItem value={1}>Mr</MenuItem>
                                                <MenuItem value={2}>Mrs</MenuItem>
                                            </Select>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={4} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("first-name")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8} sm={6} xs={6}>
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
                            <Grid item md={4} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("last-name")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8} sm={6} xs={6}>
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
                            <Grid item md={5} sm={6} xs={6}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={2.5} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("birthdate")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={7.5} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    readOnly={!editable}
                                                    disableOpenPicker
                                                    inputFormat={"dd/MM/yyyy"}
                                                    mask="__/__/____"
                                                    value={values.birthdate && moment(values.birthdate, "DD-MM-YYYY")}
                                                    onChange={date => {
                                                        const dateInput = moment(date)
                                                        if (dateInput.isValid()) {
                                                            setFieldValue("birthdate", dateInput.format("DD-MM-YYYY"))
                                                        }
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={7} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("email")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8.5} sm={6} xs={6}>
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
                            <Grid item md={5} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("cin")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={9} sm={6} xs={6}>
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
                            {values.insurances.map((insurance: any, index: number) => (
                                <Grid item md={7} sm={6} xs={6} key={`${index}-${insurance.insurance_uuid}`}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center">
                                        <Grid item md={2.5} sm={6} xs={6}>
                                            <Typography variant="body1" color="text.secondary" noWrap>
                                                {t("assurance")}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={10} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton variant="text"/>
                                            ) : (
                                                <Stack
                                                    direction="row"
                                                    alignItems="center">
                                                    <Select
                                                        sx={{
                                                            "& .MuiSvgIcon-root": {
                                                                display: !editable ? "none" : "inline-block"
                                                            }
                                                        }}
                                                        readOnly={!editable}
                                                        id={"assurance"}
                                                        size="small"
                                                        {...getFieldProps(`insurances[${index}].insurance_uuid`)}
                                                        displayEmpty
                                                        renderValue={(selected) => {
                                                            if (!selected) {
                                                                return <em>{t("assurance-placeholder")}</em>;
                                                            }

                                                            const insurance = insurances?.find(insurance => insurance.uuid === selected);
                                                            return <Box key={insurance?.uuid}
                                                                        component="img" width={20} height={20}
                                                                        src={insurance?.logoUrl}/>
                                                        }}
                                                    >
                                                        {insurances?.map(insurance => (
                                                            <MenuItem
                                                                key={insurance.uuid}
                                                                value={insurance.uuid}>
                                                                <Box key={insurance.uuid}
                                                                     component="img" width={20} height={20}
                                                                     src={insurance.logoUrl}/>
                                                                <Typography
                                                                    sx={{ml: 1}}>{insurance.name}</Typography>
                                                            </MenuItem>)
                                                        )}
                                                    </Select>
                                                    <InputBase
                                                        fullWidth
                                                        placeholder={t("assurance-phone-error")}
                                                        readOnly={!editable}
                                                        {...getFieldProps(`insurances[${index}].insurance_number`)}
                                                    />
                                                </Stack>

                                            )}
                                        </Grid>
                                        {(editable && index === 0) ? <>
                                            <IconButton
                                                onClick={() => handleRemoveInsurance(index)}
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
                                            </IconButton>
                                            <IconButton
                                                onClick={handleAddInsurance}
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
                                            onClick={() => handleRemoveInsurance(index)}
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
                                </Grid>))}
                        </Grid>
                    </Paper>
                </PersonalInfoStyled>

            </Form>
        </FormikProvider>
    );
}

export default PersonalInfo;
