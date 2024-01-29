import React, {useState} from 'react'
import {Box, Button, DialogActions, DialogTitle, IconButton, Stack} from '@mui/material'
import DialogStyled from './overrides/dialogStyle'
import {Stepper, stepperSelector, setStepperIndex} from '@features/stepper'
import {useAppDispatch, useAppSelector} from '@lib/redux/hooks';
import CloseIcon from "@mui/icons-material/Close";
import Step1 from './step1';
import Step2 from './step2';
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

const stepperData = [
    {
        title: "dialog.user"
    },
    {
        title: "dialog.role_permissions"
    },
    {
        title: "dialog.end"
    }
];

function NewUserDialog({...props}) {
    const {t, profiles, onNextPreviStep, onClose} = props
    const {contacts} = useContactType();
    const router = useRouter();
    const {data: session} = useSession();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {cashboxes} = useCashBox();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {agendas} = useAppSelector(agendaSelector);
    const {currentStep} = useAppSelector(stepperSelector);

    const [openFeatureCollapse, setFeatureCollapse] = useState(false);
    const [loading, setLoading] = useState(false);

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
                [feature.slug]: feature?.hasProfile ? (feature.slug === "agenda" ? agendas : cashboxes).map(featureEntity => ({
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
        values.selectedRole.length > 0 && form.append('profile', values.selectedRole);
        values.phones.length > 0 && form.append('phone', JSON.stringify(values.phones.map((phoneData: any) => ({
            code: phoneData.dial?.phone,
            value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
            type: "phone",
            contact_type: contacts[0].uuid,
            is_public: false,
            is_support: false
        }))));
        form.append('password', values.password);
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

    const handleCreateProfile = () => {
        setLoading(true);
        const form = new FormData();
        const features: any = {};

        form.append("name", values.role_name);
        Object.entries(values.roles).map((role: any) => {
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

        form.append("features", JSON.stringify(features));

        triggerProfileUpdate({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/profile/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("created-role"), {variant: "success"});
                invalidateQueries([`${urlMedicalEntitySuffix}/profile/${router.locale}`]);
                setFeatureCollapse(false);
            },
            onSettled: () => setLoading(false)
        });
    }

    const validationSchema = [
        Yup.object().shape({
            name: Yup.string().min(3).max(50).required(),
            email: Yup.string().email().required(),
            first_name: Yup.string().required(),
            password: Yup.string().required(),
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
            selectedRole: Yup.string().when("$condition", (condition, schema) =>
                openFeatureCollapse ? schema : schema.required()
            ),
            role_name: Yup.string().when("$condition", (condition, schema) =>
                !openFeatureCollapse ? schema : schema.required()
            ),
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
        })
    ];
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            first_name: '',
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            email: '',
            selectedRole: "",
            roles: initFormData(),
            role_name: '',
            password: '',
            confirm_password: '',

        },
        onSubmit: () => {
            if (currentStep === stepperData.length - 1) {
                onClose()
                return;
            }
            if (currentStep === stepperData.length - 2) {
                if (openFeatureCollapse) {
                    handleCreateProfile();
                } else {
                    handleCreateUser();
                }
            } else {
                dispatch(setStepperIndex(currentStep + 1))
            }
        },
        validationSchema: validationSchema[currentStep]
    });
    const {handleSubmit, errors, values} = formik
    console.log(errors, values);
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
                    {...{stepperData}}
                    tabIndex={currentStep}
                    t={t}
                    minWidth={660}
                    padding={0}
                />
            </Box>

            <FormikProvider value={formik}>
                <Form noValidate onSubmit={handleSubmit}>
                    <Box px={{xs: 2, sm: 4}} py={2}>
                        {currentStep === 0 && <Step1 {...{formik, t, doctor_country}} />}
                        {currentStep === 1 &&
                            <Step2 {...{formik, t, profiles, openFeatureCollapse, setFeatureCollapse}} />}
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
                                if (openFeatureCollapse) {
                                    setFeatureCollapse(false);
                                } else {
                                    onNextPreviStep();
                                }
                            }}
                            variant='text-black'>
                            {t("dialog.cancel")}
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
