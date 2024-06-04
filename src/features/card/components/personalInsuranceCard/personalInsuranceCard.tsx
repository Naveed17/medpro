import React, { useState } from "react";
// hook
import { useTranslation } from "next-i18next";
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
    AppBar,
    Box,
    Button,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import CloseIcon from "@mui/icons-material/Close";
import { DefaultCountry, SocialInsured } from "@lib/constants";
import { isValidPhoneNumber } from "libphonenumber-js";
import AddIcon from '@mui/icons-material/Add';
import { Dialog } from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import { useAppSelector } from "@lib/redux/hooks";
import { dashLayoutSelector } from "@features/base";
import { prepareInsurancesData, useMedicalEntitySuffix } from "@lib/hooks";
import { useInsurances } from "@lib/hooks/rest";

import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";

import { LoadingScreen } from "@features/loadingScreen";
import { PatientInsurance } from "@features/patientInsurance";
import { ImageHandler } from "@features/image";

function PersonalInsuranceCard({ ...props }) {
    const {
        patient, mutatePatientList = null, contacts,
        mutateAgenda = null, loading, editable, setEditable
    } = props;

    const { data: session } = useSession();
    const theme = useTheme();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { insurances } = useInsurances();

    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const [open, setOpen] = useState<boolean>(true)
    const [insuranceDialog, setInsuranceDialog] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [requestAction, setRequestAction] = useState("POST");
    const { t, ready } = useTranslation(["patient", "common"]);
    const handleTogglePanel = () => {
        setOpen(!open)
    }
    const { trigger: triggerPatientUpdate } = useRequestQueryMutation("/patient/update");

    const {
        data: httpPatientInsurancesResponse,
        mutate: mutatePatientInsurances
    } = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/insurances/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const RegisterPatientSchema = Yup.object().shape({
        insurances: Yup.array().of(
            Yup.object().shape({
                insurance_key: Yup.string(),
                insurance_number: Yup.string()
                    .min(3, t("config.add-patient.assurance-num-error"))
                    .max(50, t("config.add-patient.assurance-num-error")),
                insurance_uuid: Yup.string()
                    .min(3, t("config.add-patient.assurance-type-error"))
                    .max(50, t("config.add-patient.assurance-type-error"))
                    .required(t("config.add-patient.assurance-type-error")),
                insurance_social: Yup.object().nullable().shape({
                    firstName: Yup.string()
                        .min(3, t("config.add-patient.first-name-error"))
                        .max(50, t("config.add-patient.first-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("config.add-patient.first-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.firstName
                        }),
                    lastName: Yup.string()
                        .min(3, t("config.add-patient.last-name-error"))
                        .max(50, t("config.add-patient.last-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("config.add-patient.last-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.lastName
                        }),
                    birthday: Yup.string().nullable(),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string().test({
                            name: 'phone-value-test',
                            message: t("config.add-patient.telephone-error"),
                            test: (value, ctx: any) => {
                                const isValidPhone = value ? (value.length > 0 ? isValidPhoneNumber(value) : true) : true;
                                return (ctx.from[2].value.insurance_type === "0" || isValidPhone);
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
    const prepareInsuranceInstance = (insurance: PatientInsurancesModel, extraProps?: any) => {
        return {
            insurance_key: insurance.uuid,
            insurance_number: insurance.insuranceNumber,
            insurance_uuid: insurance.insurance?.uuid,
            insurance_social: insurance.insuredPerson && {
                firstName: insurance.insuredPerson.firstName,
                lastName: insurance.insuredPerson.lastName,
                birthday: insurance.insuredPerson.birthday,
                phone: {
                    code: insurance.insuredPerson.contact ? insurance.insuredPerson.contact.code : doctor_country?.phone,
                    value: insurance.insuredPerson.contact && insurance.insuredPerson.contact.value?.length > 0 ? `${insurance.insuredPerson.contact.code}${insurance.insuredPerson.contact.value}` : "",
                    type: "phone",
                    contact_type: contacts?.length > 0 && contacts[0].uuid,
                    is_public: false,
                    is_support: false
                }
            },
            insurance_type: insurance.type ? insurance.type.toString() : "0",
            expand: insurance.type ? insurance.type.toString() !== "0" : false,
            online: false,
            ...extraProps
        }
    }
    const patientInsurances = (httpPatientInsurancesResponse as HttpResponse)?.data as PatientInsurancesModel[];
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            insurances: !loading && patientInsurances?.length > 0 ? patientInsurances.map((insurance: any) => prepareInsuranceInstance(insurance, { online: true })) : [] as InsurancesModel[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async () => {
            handleUpdatePatient();
        }
    });

    const handleResetDialogInsurance = () => {
        setInsuranceDialog(false);
        const insurances = [...values.insurances].map(insure => insure.insurance_key?.length > 0 ?
            { ...insure, online: true } : insure);
        handleRemoveInsurance(insurances.findIndex((insure: InsurancesModel) => !insure.online && insure.insurance_key?.length === 0), insurances);
    }

    const handleDeleteInsurance = (insurance: InsuranceModel) => {
        setEditable({
            patientDetailContactCard: false,
            personalInsuranceCard: false,
            personalInfoCard: false
        });
        setLoadingRequest(true);
        medicalEntityHasUser && triggerPatientUpdate({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/insurances/${insurance.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                setLoadingRequest(false);
                mutatePatientInsurances();
                mutatePatientList && mutatePatientList();
                mutateAgenda && mutateAgenda();
            }
        });
    }

    const handleEditInsurance = (insurance: PatientInsurancesModel) => {
        setEditable({
            patientDetailContactCard: false,
            personalInsuranceCard: false,
            personalInfoCard: false
        });
        const insurances = [prepareInsuranceInstance(insurance)]
        setRequestAction("PUT");
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
                    contact_type: contacts?.length > 0 && contacts[0].uuid,
                    is_public: false,
                    is_support: false
                }
            },
            insurance_type: `0`,
            expand: false,
            online: false
        }];
        setRequestAction("POST");
        setFieldValue("insurances", insurance);
    }

    const handleMultiAddInsurance = () => {
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
                    contact_type: contacts?.length > 0 && contacts[0].uuid,
                    is_public: false,
                    is_support: false
                }
            },
            insurance_type: `0`,
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

    const handleUpdatePatient = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('insurance', JSON.stringify(prepareInsurancesData({
            insurances: values.insurances,
            contact: contacts?.length > 0 && contacts[0].uuid
        })));

        medicalEntityHasUser && triggerPatientUpdate({
            method: requestAction,
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/insurances/${requestAction === "PUT" ? `${values.insurances[0].insurance_key}/` : ""}${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                setLoadingRequest(false);
                mutatePatientInsurances();
                mutatePatientList && mutatePatientList();
                mutateAgenda && mutateAgenda();
                enqueueSnackbar(t(`config.add-patient.alert.patient-edit`), { variant: "success" });
            }
        });
    }

    const { handleSubmit, values, errors, touched, getFieldProps, setFieldValue } = formik;

    if (!ready) return (<LoadingScreen button text={"loading-error"} />);
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <PersonalInfoStyled>
                    <Paper
                        sx={{
                            borderWidth: 0,
                            borderRadius: 0,
                            ...((loading || patientInsurances?.length === 0) && {
                                "& .MuiAppBar-root": {
                                    borderBottom: "none"
                                },
                                pb: 0
                            })
                        }}>
                        <PatientInsurance {...{
                            patientInsurances,
                            mutatePatientInsurances,
                            patient,
                            urlMedicalEntitySuffix,
                            medicalEntityHasUser
                        }} />
                    </Paper>
                </PersonalInfoStyled>
                <Dialog
                    {...{
                        sx: {
                            minHeight: 300
                        }
                    }}
                    data={{
                        insurances, values, formik, requestAction, loading,
                        getFieldProps, setFieldValue, touched, errors, t
                    }}
                    color={theme.palette.primary.main}
                    contrastText={theme.palette.primary.contrastText}
                    dialogClose={handleResetDialogInsurance}
                    action={"add_insurance"}
                    open={insuranceDialog}
                    title={t(`config.add-patient.assurance`)}
                    actionDialog={
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{ width: "100%" }}>
                            {requestAction !== "PUT" && <Button
                                onClick={() => {
                                    handleMultiAddInsurance();
                                }}
                                startIcon={<AddIcon />}>
                                {t("config.add-patient.add-insurance-more")}
                            </Button>}
                            <Stack direction={"row"}
                                {...(requestAction === "PUT" && { sx: { width: "100%" } })}
                                justifyContent={"flex-end"}
                                alignItems={"center"}
                                spacing={1.2}>
                                <LoadingButton
                                    loading={loadingRequest}
                                    sx={{
                                        color: theme.palette.grey[600],
                                    }}
                                    onClick={handleResetDialogInsurance}
                                    startIcon={<CloseIcon />}>
                                    {t("config.add-patient.cancel")}
                                </LoadingButton>
                                <LoadingButton
                                    loading={loadingRequest}
                                    onClick={() => {
                                        setInsuranceDialog(false);
                                        handleUpdatePatient();
                                    }}
                                    disabled={!!errors?.insurances || (values.insurances as any[]).filter((insur: InsurancesModel) => !insur.online).length === 0}
                                    variant="contained"
                                    startIcon={<IconUrl path="iconfinder_save" />}>
                                    {t("config.add-patient.register")}
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    }
                />
            </Form>
        </FormikProvider>
    );
}

export default PersonalInsuranceCard;
