import React, {useState} from 'react'
import {Box, Button, DialogActions, DialogTitle, IconButton, Stack} from '@mui/material'
import DialogStyled from './overrides/dialogStyle'
import {Stepper, stepperSelector, setStepperIndex} from '@features/stepper'
import {useAppDispatch, useAppSelector} from '@lib/redux/hooks';
import CloseIcon from "@mui/icons-material/Close";
import InfoStep from './infoStep';
import AuthorizationStep from './authorizationStep';
import AssignmentStep from "./assignmentStep";
import {DefaultCountry} from '@lib/constants';
import {Session} from 'next-auth';
import {useSession} from 'next-auth/react';
import {FormikProvider, useFormik, Form} from 'formik';
import {isValidPhoneNumber} from "libphonenumber-js";
import * as Yup from 'yup';
import {LoadingButton} from '@mui/lab';
import {agendaSelector} from '@features/calendar';
import {useCashBox, useContactType} from '@lib/hooks/rest';
import {SuccessCard} from '@features/card';
import {useInvalidateQueries, useMedicalEntitySuffix} from '@lib/hooks';
import {useSnackbar} from 'notistack';
import {useRequestQueryMutation} from '@lib/axios';
import {useRouter} from 'next/router';
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";

function NewUserDialog({...props}) {
    const {profiles, onNextPreviStep, onClose, type = "authorization"} = props
    const {contacts} = useContactType();
    const router = useRouter();
    const {data: session} = useSession();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {cashboxes} = useCashBox();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("settings", {keyPrefix: "users.config"});
    const {agendas} = useAppSelector(agendaSelector);
    const {currentStep} = useAppSelector(stepperSelector);

    const [openFeatureCollapse, setFeatureCollapse] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stepperData] = useState([
        {
            title: "dialog.info"
        },
        {
            title: `dialog.${type === "authorization" ? "role_permissions" : "role_assignments"}`
        },
        {
            title: "dialog.end"
        }
    ]);
    const {data: userSession} = session as Session;
    const medical_entity = (userSession as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const features = (userSession as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    const {trigger: triggerUserAdd} = useRequestQueryMutation("/users/add");
    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("users/profile/add");

    const initFormData = () => {
        const featuresInit: any = {};
        features?.map((feature: any) => {
            Object.assign(featuresInit, {
                [feature.slug]: feature?.hasProfile ? (["agenda", "consultation"].includes(feature.slug) ? agendas : cashboxes).map(featureEntity => ({
                    ...feature,
                    featureEntity: {
                        ...featureEntity,
                        checked: false
                    },
                    permissions: []
                })) : [{
                    ...feature,
                    permissions: []
                }]
            });
        });
        return featuresInit
    }

    const handleCreateUser = () => {
        setLoading(true);
        const form = new FormData();
        form.append('username', values.name);
        form.append('email', values.email);
        form.append('is_active', 'true');
        form.append('is_accepted', 'true');
        form.append('is_public', "true");
        form.append('is_default', "true");
        form.append('firstname', values.first_name);
        form.append('lastname', values.last_name);
        values.phones.length > 0 && form.append('phone', JSON.stringify(values.phones.map((phoneData: any) => ({
            code: phoneData.dial?.phone,
            value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
            type: "phone",
            contact_type: contacts[0].uuid,
            is_public: false,
            is_support: false
        }))));
        form.append('password', values.password);

        const features: any = {};
        Object.entries(values.roles).forEach((role: any) => {
            const hasFeaturePermissions = role[1].reduce((features: any[], feature: FeatureModel) => {
                const permissions = feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                    [...(permissions ?? []),
                        ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [];
                return [
                    ...(features ?? []),
                    ...((feature?.hasOwnProperty('featureEntity') ? (feature?.featureEntity?.checked ? permissions : []) : permissions) ?? [])]
            }, []).length > 0;

            if (hasFeaturePermissions) {
                features[role[0]] = role[1].reduce((features: FeatureModel[], feature: FeatureModel) => {
                    const permissions = feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                        [...(permissions ?? []),
                            ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [];

                    const hasPermissions = feature?.hasOwnProperty('featureEntity') ? (feature?.featureEntity?.checked && (permissions.length ?? 0) > 0) : (permissions.length ?? 0) > 0;
                    return [
                        ...(features ?? []),
                        ...(hasPermissions ? [{
                            object: feature?.featureEntity?.uuid,
                            featureProfile: feature?.profile,
                            permissions: permissions.map((permission: PermissionModel) => permission.uuid)
                        }] : [])
                    ];
                }, [])
            }
        });
        console.log("roles", values.roles)
        form.append("features", JSON.stringify(features));
        triggerUserAdd({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/users/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alert.add_user_success"), {variant: "success"});
                setLoading(false);
                dispatch(setStepperIndex(currentStep + 1))
                invalidateQueries([`${urlMedicalEntitySuffix}/mehus/${router.locale}`]);
            },
            onError: () => {
                setLoading(false);
                enqueueSnackbar(t("alert.went_wrong"), {variant: "error"});
            }
        });
    }

    const validationSchema = [
        Yup.object().shape({
            name: Yup.string().min(3).max(50).required(),
            email: Yup.string().email().required(),
            first_name: Yup.string().required(),
            password: Yup.string().required(),
            generatePassword: Yup.boolean().required(),
            resetPassword: Yup.boolean().required(),
            phones: Yup.array().of(
                Yup.object().shape({
                    dial: Yup.object().shape({
                        code: Yup.string(),
                        label: Yup.string(),
                        phone: Yup.string(),
                    }),
                    phone: Yup.string()
                        .test({
                            name: "is-phone",
                            message: t("telephone-error"),
                            test: (value) => {
                                return value ? isValidPhoneNumber(value) : false
                            }
                        }),
                })
            ),
            confirm_password: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field),
            ...(openFeatureCollapse && currentStep === 1 ? {
                role_name: Yup.string().min(3, t("role-error")).required(),
            } : {})
        }),
        Yup.object().shape({
            ...(type === "authorization" ? {
                roles: Yup.object().shape(
                    features?.reduce((features: any, feature: any) => ({
                        ...(features ?? {}), ...{
                            [feature.slug]: Yup.array().of(Yup.object().shape({
                                name: Yup.string(),
                                hasProfile: Yup.boolean(),
                                featureEntity: Yup.object().shape({
                                    name: Yup.string(),
                                    uuid: Yup.string()
                                }),
                                uuid: Yup.string(),
                                slug: Yup.string(),
                                root: Yup.string(),
                                permissions: Yup.array().of(
                                    Yup.object().shape({
                                        name: Yup.string(),
                                        uuid: Yup.string()
                                    })
                                )
                            }))
                        }
                    }), {})
                )
            } : {
                department: Yup.string(),
                assigned_doctors: Yup.array().of(Yup.string())
            })
        })
    ];

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            first_name: '',
            last_name: '',
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            email: '',
            generatePassword: false,
            resetPassword: true,
            roles: initFormData(),
            department: "",
            assigned_doctors: [],
            password: '',
            confirm_password: ''
        },
        onSubmit: () => {
            if (currentStep === stepperData.length - 1) {
                onClose()
                return;
            }
            if (currentStep === stepperData.length - 2) {
                handleCreateUser();
            } else {
                dispatch(setStepperIndex(currentStep + 1))
            }
        },
        validationSchema: validationSchema[currentStep]
    });
    const {handleSubmit, values} = formik

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <DialogStyled>
            <DialogTitle bgcolor="primary.main" component={Stack} direction='row' justifyContent='space-between'>
                {t("dialog.add_user")}
                <IconButton
                    onClick={onClose}
                    size='small' disableRipple>
                    <CloseIcon htmlColor='white'/>
                </IconButton>
            </DialogTitle>
            <Box px={{xs: 0, sm: 2}} py={3} bgcolor="background.default">
                <Stepper
                    {...{t, stepperData}}
                    tabIndex={currentStep}
                    minWidth={660}
                    padding={0}
                />
            </Box>

            <FormikProvider value={formik}>
                <Form noValidate onSubmit={handleSubmit}>
                    <Box px={{xs: 2, sm: 4}} py={2}>
                        {currentStep === 0 && <InfoStep {...{formik, t, doctor_country}} />}
                        {currentStep === 1 &&
                            (type === 'authorization' ?
                                    <AuthorizationStep {...{
                                        formik,
                                        t,
                                        profiles,
                                        openFeatureCollapse,
                                        setFeatureCollapse
                                    }} />
                                    :
                                    <AssignmentStep {...{
                                        formik,
                                        t
                                    }} />
                            )
                        }
                        {currentStep === 2 &&
                            <Stack alignItems='center' sx={{'.MuiTypography-root': {textAlign: 'center'}}}>
                                <SuccessCard
                                    data={{
                                        title: t("dialog.success_title"),
                                        description: t("dialog.success_desc")
                                    }}
                                />
                            </Stack>}
                    </Box>
                    <DialogActions className='dialog-action'>
                        <Button
                            onClick={() => {
                                onNextPreviStep();
                            }}
                            variant='text-black'>
                            {t(`dialog.${currentStep > 0 ? 'back' : 'cancel'}`)}
                        </Button>
                        <LoadingButton
                            loading={loading}
                            type='submit'
                            variant='contained'
                            color='primary'>
                            {currentStep === stepperData.length - 1 ? t("dialog.finish") : t("dialog.next")}
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </FormikProvider>
        </DialogStyled>
    )
}

export default NewUserDialog
