import React, {useState} from "react";
// hook
import {useTranslation} from "next-i18next";
import {Form, FormikProvider, useFormik} from "formik";
// material
import {
    AppBar, Avatar,
    Box,
    Button, DialogActions,
    Divider,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Toolbar,
    Typography, useTheme
} from "@mui/material";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useSnackbar} from "notistack";
import Icon from "@themes/urlIcon";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {LoadingButton} from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingScreen} from "@features/loadingScreen";
import {DefaultCountry, SocialInsured} from "@app/constants";
import {isValidPhoneNumber} from "libphonenumber-js";
import AddIcon from '@mui/icons-material/Add';
import {Dialog} from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import DeleteIcon from '@mui/icons-material/Delete';
import {useAppSelector} from "@app/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useUrlSuffix} from "@app/hooks";

function PersonalInsuranceCard({...props}) {
    const {
        patient, mutatePatientDetails, mutatePatientList = null,
        mutateAgenda = null, loading, editable
    } = props;

    const {data: session} = useSession();
    const theme = useTheme();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    const urlMedicalEntitySuffix = useUrlSuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const [insuranceDialog, setInsuranceDialog] = useState(false);
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
        insurances: Yup.array().of(
            Yup.object().shape({
                insurance_key: Yup.string(),
                insurance_number: Yup.string()
                    .min(3, t("assurance-num-error"))
                    .max(50, t("assurance-num-error")),
                insurance_uuid: Yup.string()
                    .min(3, t("assurance-type-error"))
                    .max(50, t("assurance-type-error"))
                    .required(t("assurance-type-error")),
                insurance_social: Yup.object().nullable().shape({
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
                            test: (value, ctx: any) => {
                                const isValidPhone = value ? isValidPhoneNumber(value) : false;
                                return ctx.from[2].value.insurance_type === "0" || isValidPhone;
                            }
                        }),
                        type: Yup.string(),
                        contact_type: Yup.string(),
                        is_public: Yup.boolean(),
                        is_support: Yup.boolean()
                    })
                }),
                insurance_type: Yup.string(),
                expand: Yup.boolean(),
                online: Yup.boolean()
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
                    ? patient.address[0].street
                    : "",
            email: !loading && patient.email ? patient.email : "",
            cin: !loading && patient.idCard ? patient.idCard : "",
            insurances: !loading && patient.insurances.length > 0 ? patient.insurances.map((insurance: any) => ({
                insurance_key: insurance.uuid,
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid,
                insurance_social: insurance.insuredPerson && {
                    firstName: insurance.insuredPerson.firstName,
                    lastName: insurance.insuredPerson.lastName,
                    birthday: insurance.insuredPerson.birthday,
                    phone: {
                        code: insurance.insuredPerson.contact.code,
                        value: `${insurance.insuredPerson.contact.code}${insurance.insuredPerson.contact.value}`,
                        type: "phone",
                        contact_type: patient.contact[0].uuid,
                        is_public: false,
                        is_support: false
                    }
                },
                insurance_type: insurance.type ? insurance.type.toString() : "0",
                expand: insurance.type ? insurance.type.toString() !== "0" : false,
                online: true
            })) : [] as InsurancesModel[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async () => {
            handleUpdatePatient();
        },
    });

    const handleResetDialogInsurance = () => {
        setInsuranceDialog(false);
        const insurances = [...values.insurances].map(insure => insure.insurance_key?.length > 0 ?
            {...insure, online: true} : insure);
        handleRemoveInsurance(insurances.findIndex((insure: InsurancesModel) => !insure.online && insure.insurance_key?.length === 0), insurances);
    }

    const handleDeleteInsurance = (insurance: InsuranceModel) => {
        const indexInsur = values.insurances.findIndex((insur: InsurancesModel) =>
            insur.insurance_key === insurance.uuid);
        const insurances = handleRemoveInsurance(indexInsur);
        handleUpdatePatient(insurances);
    }

    const handleEditInsurance = (insurance: InsuranceModel) => {
        const insurances = [...values.insurances].map(insure => insure.insurance_key === insurance.uuid ?
            {
                ...insure,
                online: false
            } : insure)
        insurances.sort(a => !a.online ? -1 : 1);
        setFieldValue("insurances", insurances);
        setInsuranceDialog(true);
    }

    const handleAddInsurance = () => {
        const insurance = [{
            insurance_key: "",
            insurance_uuid: "",
            insurance_number: "",
            insurance_social: {
                firstName: "",
                lastName: "",
                birthday: null,
                phone: {
                    code: doctor_country?.phone,
                    value: "",
                    type: "phone",
                    contact_type: patient.contact[0].uuid,
                    is_public: false,
                    is_support: false
                }
            },
            insurance_type: "0",
            expand: false,
            online: false
        }, ...values.insurances];
        setFieldValue("insurances", insurance);
    }

    const handleRemoveInsurance = (index: number, insurances?: InsurancesModel[]) => {
        const insurance = [...(insurances ? insurances : values.insurances)];
        index >= 0 && insurance.splice(index, 1);
        setFieldValue("insurances", insurance);
        return insurance;
    };

    const handleUpdatePatient = (insurances?: InsurancesModel[]) => {
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
        patient.note && params.append('note', patient.note);
        patient.profession && params.append('profession', patient.profession);
        patient.familyDoctor && params.append('family_doctor', patient.familyDoctor);
        patient.nationality && params.append('nationality', patient.nationality.uuid);
        const updatedInsurances: any[] = [];
        (insurances ? insurances : values.insurances).map((insurance: InsurancesModel) => {
            let phone = null;
            if (insurance.insurance_type === "0") {
                delete insurance['insurance_social'];
            }

            if (insurance.insurance_social) {
                const localPhone = insurance.insurance_social.phone;
                phone = localPhone.value.replace(localPhone.code, "");
            }

            updatedInsurances.push({
                ...insurance,
                ...(phone && {
                    insurance_social: {
                        ...insurance.insurance_social,
                        phone: {
                            ...insurance.insurance_social?.phone,
                            contact_type: patient.contact[0].uuid,
                            value: phone as string
                        }
                    }
                })
            })
        });
        params.append('insurance', JSON.stringify(updatedInsurances));
        values.birthdate.length > 0 && params.append('birthdate', values.birthdate);
        params.append('address', JSON.stringify({
            fr: values.address
        }));
        patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('country', patient?.address[0]?.city?.country?.uuid);
        patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('region', patient?.address[0]?.city?.uuid);
        patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('zip_code', patient?.address[0]?.postalCode);
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
                            p: 1.5, borderWidth: 0,
                            ...((loading || patient?.insurances.length === 0) && {
                                "& .MuiAppBar-root": {
                                    borderBottom: "none"
                                },
                                pb: 0
                            })
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
                                <LoadingButton
                                    disabled={editable}
                                    loading={loadingRequest}
                                    className='btn-add'
                                    onClick={() => {
                                        handleAddInsurance();
                                        setInsuranceDialog(true);
                                    }}
                                    startIcon={<AddIcon/>}
                                    size="small">
                                    {t("add")}
                                </LoadingButton>
                            </Toolbar>
                        </AppBar>
                        {patient?.insurances.map((insurance: any, index: number) => (
                            <Grid container key={`${index}-${insurance.uuid}`}>
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
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 20,
                                                                            height: 20,
                                                                            borderRadius: 0.4
                                                                        }}
                                                                        alt="insurance"
                                                                        src={insur?.logoUrl}
                                                                    />}
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
                                                    {!editable && <Grid pt={.5} pb={.5} item xs={6} md={4}>
                                                        <Stack direction={"row"} alignItems={"start"} spacing={1}
                                                               justifyContent={"flex-end"}>
                                                            <IconButton
                                                                disabled={loadingRequest}
                                                                className='btn-add'
                                                                onClick={() => handleEditInsurance(insurance)}
                                                                size="small">
                                                                <IconUrl path={"setting/edit"}/>
                                                            </IconButton>
                                                            <IconButton
                                                                disabled={loadingRequest}
                                                                className='icon-button'
                                                                color={"error"}
                                                                sx={{
                                                                    paddingTop: .4,
                                                                    "& svg": {
                                                                        width: 18,
                                                                        height: 18
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteInsurance(insurance)}
                                                                size="small">
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Stack>
                                                    </Grid>}
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
                    dialogClose={handleResetDialogInsurance}
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
                                <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={1.2}>
                                    <LoadingButton
                                        loading={loadingRequest}
                                        sx={{
                                            color: theme.palette.grey[600],
                                        }}
                                        onClick={handleResetDialogInsurance}
                                        startIcon={<CloseIcon/>}>
                                        {t("cancel")}
                                    </LoadingButton>
                                    <LoadingButton
                                        loading={loadingRequest}
                                        onClick={() => {
                                            setInsuranceDialog(false);
                                            handleUpdatePatient();
                                        }}
                                        disabled={!!errors?.insurances || values.insurances.filter((insur: InsurancesModel) => !insur.online).length === 0}
                                        variant="contained"
                                        startIcon={<Icon path="ic-dowlaodfile"/>}>
                                        {t("register")}
                                    </LoadingButton>
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
