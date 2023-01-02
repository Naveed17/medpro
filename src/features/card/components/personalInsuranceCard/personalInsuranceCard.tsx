import React, {memo, useState} from "react";
// hook
import {useTranslation} from "next-i18next";
import {Form, FormikProvider, useFormik} from "formik";
// material
import {
    AppBar,
    Autocomplete,
    Box,
    Button,
    CardContent,
    Collapse, DialogActions,
    Divider, FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Typography, useTheme
} from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useSnackbar} from "notistack";
import Icon from "@themes/urlIcon";
import Select from '@mui/material/Select';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {DatePicker as CustomDatePicker} from "@features/datepicker";
import moment from "moment-timezone";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {LoadingButton} from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingScreen} from "@features/loadingScreen";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import {SocialInsured} from "@app/constants";
import {countries as dialCountries} from "@features/countrySelect/countries";
import {isValidPhoneNumber} from "libphonenumber-js";
import AddIcon from '@mui/icons-material/Add';
import {Dialog} from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import DeleteIcon from '@mui/icons-material/Delete';

function PersonalInsuranceCard({...props}) {
    const {patient, mutatePatientDetails, mutatePatientList = null, loading} = props;

    const {data: session} = useSession();
    const theme = useTheme();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [editable, setEditable] = useState(false);
    const [insuranceDialog, setInsuranceDialog] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config.add-patient",
    });

    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const notEmpty = Yup.string()
        .ensure() // Transforms undefined and null values to an empty string.
        .test('Only Empty?', 'Cannot be only empty characters', (value) => {
            return value.split(' ').join('').length !== 0;
        });

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
        insurances: Yup.array().of(
            Yup.object().shape({
                insurance_number: Yup.string()
                    .min(3, t("assurance-num-error"))
                    .max(50, t("assurance-num-error"))
                    .required(t("assurance-num-error")),
                insurance_uuid: Yup.string()
                    .min(3, t("assurance-type-error"))
                    .max(50, t("assurance-type-error"))
                    .required(t("assurance-type-error")),
                insurance_social: Yup.object().shape({
                    firstName: Yup.string()
                        .min(3, t("first-name-error"))
                        .max(50, t("first-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("first-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.firstName
                        }),
                    lastName: Yup.string()
                        .min(3, t("last-name-error"))
                        .max(50, t("last-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("last-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.lastName
                        }),
                    birthday: Yup.string()
                        .nullable()
                        .min(3, t("birthday-error"))
                        .max(50, t("birthday-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("birthday-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.birthday
                        }),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string().test({
                            name: 'phone-value-test',
                            message: t("telephone-error"),
                            test: (value, ctx: any) => ctx.from[2].value.insurance_type === "0" ||
                                isValidPhoneNumber(`${ctx.from[0].value.code}${value}`)
                        }),
                        type: Yup.string(),
                        contact_type: Yup.string(),
                        is_public: Yup.boolean(),
                        is_support: Yup.boolean()
                    })
                }),
                insurance_type: Yup.string(),
                expand: Yup.boolean()
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
            email: !loading && patient.email ? patient.email : "",
            cin: !loading && patient.idCard ? patient.idCard : "",
            insurances: !loading && patient.insurances.length > 0 ? patient.insurances.map((insurance: any) => ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid,
                insurance_social: insurance.insuredPerson && {
                    firstName: insurance.insuredPerson.firstName,
                    lastName: insurance.insuredPerson.lastName,
                    birthday: insurance.insuredPerson.birthday,
                    phone: {
                        code: insurance.insuredPerson.contact.code,
                        value: insurance.insuredPerson.contact.value,
                        type: "phone",
                        contact_type: patient.contact[0].uuid,
                        is_public: false,
                        is_support: false
                    }
                },
                insurance_type: insurance.type ? insurance.type.toString() : "0",
                expand: insurance.type ? insurance.type.toString() !== "0" : false
            })) : [] as InsurancesModel[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async () => {
            handleUpdatePatient();
        },
    });

    const handleAddInsurance = () => {
        const insurance = [...values.insurances, {
            insurance_uuid: "",
            insurance_number: "",
            insurance_social: {
                firstName: "",
                lastName: "",
                birthday: null,
                phone: {
                    code: "+216",
                    value: "",
                    type: "phone",
                    contact_type: patient.contact[0].uuid,
                    is_public: false,
                    is_support: false
                }
            },
            insurance_type: "",
            expand: false
        }];
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
        params.append('phone', JSON.stringify(
            patient.contact.filter((contact: ContactModel) => contact.type === "phone").map((phone: any) => ({
                code: phone.code,
                value: phone.value,
                type: "phone",
                "contact_type": patient.contact[0].uuid,
                "is_public": false,
                "is_support": false
            }))));
        params.append('email', values.email);
        params.append('id_card', values.cin);
        values.insurances.map((insurance: InsurancesModel) => {
            if (insurance.insurance_type === "0") {
                delete insurance['insurance_social'];
            }
        });
        params.append('insurance', JSON.stringify(values.insurances.filter(
            (insurance: InsurancesModel) => insurance.insurance_number.length > 0)));
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
            mutatePatientDetails();
            if (mutatePatientList) {
                mutatePatientList();
            }
            enqueueSnackbar(t(`alert.patient-edit`), {variant: "success"});
        });
    }

    const {handleSubmit, values, errors, touched, getFieldProps, setFieldValue} = formik;

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
                                            t("assurance")
                                        )}
                                    </Typography>
                                </Box>
                                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                    <Button
                                        className='btn-add'
                                        onClick={() => {
                                            handleAddInsurance();
                                            setInsuranceDialog(true);
                                            setEditable(true);
                                        }}
                                        startIcon={<AddIcon/>}
                                        size="small">
                                        {t("add")}
                                    </Button>
                                </Box>
                            </Toolbar>
                        </AppBar>
                        {patient?.insurances.map((insurance: any, index: number) => (
                            <Grid container key={`${index}-${insurance.insurance_uuid}`}>
                                <Stack sx={{
                                    ...(index === 0 && {
                                        marginTop: 1
                                    }),
                                    width: "inherit"
                                }} direction="row" alignItems="center">
                                    <Grid item md={12} sm={12} xs={12}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <>
                                                <Grid container spacing={1.2}>
                                                    <Grid item xs={6} md={3}>
                                                        {(() => {
                                                            const insur = insurances?.find(ins => ins.uuid === insurance.insurance.uuid);
                                                            return (<Stack direction={"row"}>
                                                                {insur?.logoUrl &&
                                                                    <Box component={"img"}
                                                                         width={20} height={20}
                                                                         alt={"insurance"}
                                                                         src={insur?.logoUrl}/>}
                                                                <Typography
                                                                    ml={1}>{insur?.name}</Typography>
                                                            </Stack>)
                                                        })()}
                                                    </Grid>
                                                    <Grid item xs={6} md={2}>
                                                        <Stack direction={"row"}
                                                               justifyContent={"space-between"}
                                                               alignItems={"center"}>
                                                            <Typography
                                                                variant={"body2"}
                                                            >
                                                                {insurance.insuranceNumber}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Stack direction={"row"}
                                                               justifyContent={"space-between"}
                                                               alignItems={"center"}>
                                                            <Typography
                                                                variant={"body2"}
                                                            >
                                                                {SocialInsured.find(insur => insur.value === insurance.type.toString())?.label}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6} md={4}>
                                                        <Stack direction={"row"} alignItems={"end"} spacing={1}
                                                               justifyContent={"flex-end"}>
                                                            <IconButton
                                                                className='btn-add'
                                                                onClick={() => {
                                                                    handleAddInsurance();
                                                                    setInsuranceDialog(true);
                                                                    setEditable(true);
                                                                }}
                                                                size="small">
                                                                <IconUrl path={"setting/edit"}/>
                                                            </IconButton>
                                                            <IconButton
                                                                color={"error"}
                                                                sx={{
                                                                    mr: 1.5,
                                                                    "& svg": {
                                                                        width: 20,
                                                                        height: 20
                                                                    },
                                                                }}
                                                                onClick={() => {
                                                                    handleRemoveInsurance(index);
                                                                }}
                                                                size="small">
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                                {(values.insurances.length - 1) !== index &&
                                                    <Divider sx={{marginBottom: 1}}/>}
                                            </>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>))
                        }
                    </Paper>
                </PersonalInfoStyled>
                <Dialog
                    {...{
                        sx: {
                            minHeight: 300
                        }
                    }}
                    data={{
                        insurances, values, formik, patient, loading,
                        getFieldProps, setFieldValue, touched, errors, t
                    }}
                    color={theme.palette.primary.main}
                    contrastText={theme.palette.primary.contrastText}
                    dialogClose={() => {
                        setInsuranceDialog(false);
                    }}
                    action={"add_insurance"}
                    open={insuranceDialog}
                    title={t(`add-insurance`)}
                    actionDialog={
                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                                width: "100%",
                                "& .MuiDialogActions-root": {
                                    'div': {
                                        width: "100%",
                                    }
                                }
                            }}>
                            <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                                <Button
                                    onClick={() => {
                                        handleAddInsurance();
                                    }}
                                    startIcon={<AddIcon/>}>
                                    {t("add-insurance-more")}
                                </Button>
                                <Stack direction={"row"} spacing={1.2}>
                                    <Button
                                        sx={{
                                            color: theme.palette.grey[600],
                                        }}
                                        onClick={() => {
                                            setInsuranceDialog(false);
                                            setFieldValue("insurances", []);
                                        }}
                                        startIcon={<CloseIcon/>}>
                                        {t("cancel")}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setInsuranceDialog(false);
                                            handleUpdatePatient();
                                        }}
                                        disabled={!!errors?.insurances || values.insurances.length === 0}
                                        variant="contained"
                                        startIcon={<Icon path="ic-dowlaodfile"/>}>
                                        {t("register")}
                                    </Button>
                                </Stack>
                            </Stack>
                        </DialogActions>
                    }
                />
            </Form>
        </FormikProvider>
    );
}

export default PersonalInsuranceCard;
