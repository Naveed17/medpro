import React from 'react'
import { Box, Button, DialogActions, DialogTitle, IconButton, Stack } from '@mui/material'
import DialogStyled from './overrides/dialogStyle'
import { Stepper, stepperSelector, setStepperIndex } from '@features/stepper'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import CloseIcon from "@mui/icons-material/Close";
import Stept1 from './stept1';
import { DefaultCountry } from '@lib/constants';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { FormikProvider, useFormik, Form } from 'formik';
import { isValidPhoneNumber } from "libphonenumber-js";
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
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
function NewUserDialog({ ...props }) {
    const { t, handleClose } = props
    const { currentStep } = useAppSelector(stepperSelector);
    const { data: session } = useSession();
    const { data: userSession } = session as Session;
    const dispatch = useAppDispatch();
    const medical_entity = (userSession as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const validationSchema = Yup.object().shape({
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
        confirmPassword: Yup.string().when('password', (password, field) =>
            password ? field.required().oneOf([Yup.ref('password')]) : field),
        roles: Yup.array().of(
            Yup.object().shape({
                slug: Yup.string(),
                feature: Yup.string(),
                hasMultipleInstance: Yup.boolean(),
                featureProfiles: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string(),
                        uuid: Yup.string()
                    })
                ),
                featureRoles: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string(),
                        uuid: Yup.string()
                    })
                ),
                profile: Yup.string()
            })
        )
    });
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
            email: ''
        },
        onSubmit: (values) => {
            dispatch(setStepperIndex(currentStep + 1))
        },
        validationSchema,
    });
    const { handleSubmit } = formik
    return (
        <DialogStyled>
            <DialogTitle bgcolor="primary.main" component={Stack} direction='row' justifyContent='space-between'>
                {t("dialog.add_user")}
                <IconButton onClick={() => {
                    handleClose();
                    dispatch(setStepperIndex(0))
                }}
                    size='small' disableRipple>
                    <CloseIcon color='white' />
                </IconButton>
            </DialogTitle>
            <Box px={2} py={3} bgcolor="background.default">
                <Stepper
                    {...{ stepperData }}
                    tabIndex={currentStep}
                    t={t}
                    minWidth={660}
                    padding={0}
                />
            </Box>

            <FormikProvider value={formik}>
                <Form noValidate onSubmit={handleSubmit}>
                    <Box px={4} py={2}>
                        {currentStep === 0 && <Stept1 {...{ formik, t, doctor_country }} />}
                    </Box>
                    <DialogActions className='dialog-action'>
                        <Button
                            onClick={() => {
                                handleClose();
                                dispatch(setStepperIndex(0))
                            }}
                            variant='text-black'>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            type='submit'
                            variant='contained'
                            color='primary'
                        >
                            {t("dialog.next")}
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </FormikProvider>
        </DialogStyled >
    )
}

export default NewUserDialog