import {Stepper, stepperSelector, setStepperIndex} from '@features/stepper';
import {Otable} from '@features/table';
import {useAppDispatch, useAppSelector} from '@lib/redux/hooks';
import {Box, Button, DialogActions, DialogContent, Paper, Stack} from '@mui/material'
import {FormikProvider, useFormik, Form} from 'formik';
import * as Yup from 'yup';
import React, {useState} from 'react'
import Step1 from './step1';
import {TabPanel} from '@features/tabPanel';
import Step2 from './step2';
import Step3 from './step3';

const stepperData = [
    {
        title: "dialog.step-1",
    },
    {
        title: "dialog.step-2",
    },
    {
        title: "dialog.step-3",
    },
];
const TableHead = [
    {
        id: "user",
        label: "user",
        align: "left",
        sortable: true,
    },
    {
        id: "func",
        label: "func",
        align: "left",
        sortable: false,
    },
    {
        id: "email",
        label: "email",
        align: "left",
        sortable: false,
    },
    {
        id: "password",
        label: "password",
        align: "left",
        sortable: false,
    },
];

function RestPasswordDialog({...props}) {
    const {data: {t, theme, handleClose}} = props;
    const {currentStep} = useAppSelector(stepperSelector);

    const dispatch = useAppDispatch()
    const [rows, setRows] = useState([{
        uuid: 1,
        firstName: "Jhon",
        lastName: "Doe",
        hasPhoto: false
    }]);
    const validationSchema = Yup.object().shape({
        password: Yup.string().required(
            t("validation.password_required")),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password')], t("validation.password_match")),
        email_the_pass: Yup.string()
            .email(t("validation.email_error"))

    })
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            password: "",
            confirm_password: "",
            doPassSentToEmail: false,
            email_the_pass: "",
            resetPassword: ""
        },
        onSubmit: async () => {
            if (currentStep === stepperData.length - 1) {
                dispatch(setStepperIndex(0));
                handleClose();
                return

            }
            dispatch(setStepperIndex(currentStep + 1));
        },
        validationSchema,
    })
    const {handleSubmit, setFieldValue} = formik;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue("password_type", (event.target as HTMLInputElement).value);
    };
    return (
        <Stack>
            <Paper
                sx={{
                    px: 2,
                    py: 3,
                    border: "none",
                    borderRadius: 0,
                    bgcolor: (theme) => theme.palette.background.default,
                }}
            >
                <Stepper
                    {...{stepperData}}
                    t={t}
                    minWidth={662}
                    padding={0}
                />
            </Paper>
            <DialogContent sx={{pb: 0}}>
                <Stack spacing={2}>
                    {
                        currentStep !== 2 && <Otable
                            headers={TableHead}
                            from="rest-pass"
                            t={t}
                            rows={rows}
                        />
                    }
                    <FormikProvider value={formik}>
                        <Stack component={Form} spacing={2} autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <TabPanel value={currentStep} index={0} padding={.3}>
                                <Step1 {...{formik, t, theme, handleChange}} />
                            </TabPanel>
                            <TabPanel value={currentStep} index={1} padding={.3}>
                                <Step2 {...{formik, t, theme}} />
                            </TabPanel>
                            <TabPanel value={currentStep} index={2} padding={.3}>
                                <Step3 {...{t}} />
                            </TabPanel>
                            <Box>
                                <DialogActions sx={{mx: -3, boxShadow: "0px -1px 1px 0px rgba(0, 150, 214, 0.45)"}}>
                                    <Button
                                        onClick={() => {
                                            dispatch(setStepperIndex(0));
                                            handleClose()
                                        }}
                                        variant='text-black' sx={{mr: 'auto'}}>
                                        {t("dialog.cancel")}
                                    </Button>
                                    <Button variant='contained' type='submit'>
                                        {currentStep === 1 ? t("dialog.send_email_close") : currentStep === 2 ? t("dialog.finish") : t("dialog.reset")}

                                    </Button>
                                </DialogActions>
                            </Box>
                        </Stack>
                    </FormikProvider>
                </Stack>
            </DialogContent>
        </Stack>
    )
}

export default RestPasswordDialog
