import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { Typography, Stack, TextField, Grid, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import React from "react";
import { useTranslation } from "next-i18next";
import { width } from "@mui/system";
import {LoadingScreen} from "@features/loadingScreen";

const PaperStyled = styled(Form)(({ theme }) => ({

    borderRadius: 0,
    height: '100%',
    border: 'none',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    '& .container': {
        maxHeight: 680,
        overflowY: 'auto',
        '& .MuiCard-root': {
            border: 'none',
            '& .MuiCardContent-root': {
                padding: theme.spacing(2),
            }
        }
    },
    '& .bottom-section': {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        position: 'absolute',
        width: '100%',
        bottom: 0,
        borderTop: `3px solid ${theme.palette.grey['A700']}`,
    }
}));

function InstructionDetails({ ...props }) {

    const { t, ready } = useTranslation('settings');

    const validationSchema = Yup.object().shape({
        instruction: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq')),
    });


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            instruction: ''
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

    return (
        <FormikProvider value={formik}>
            <PaperStyled autoComplete="off"
                noValidate
                className='root'
                onSubmit={handleSubmit}>

                <Typography variant="h6" gutterBottom>
                    {props.data ? t('instructions.update') : t('instructions.add')}
                </Typography>

                <Typography variant="body2" sx={{ margin: '20px 0 10px' }} gutterBottom>
                    {t('instructions.insctruction')}{" "}
                    <Typography component="span" color="error">
                        *
                    </Typography>
                </Typography>
                <TextField variant="outlined"
                    placeholder={t('instructions.tinsctruction')}
                    multiline
                    sx={{ width: { lg: 568 } }}
                    rows={4}
                    fullWidth
                    required
                    {...getFieldProps("instruction")} />

                <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                    <Button onClick={props.closeDraw}>
                        {t('motif.dialog.cancel')}
                    </Button>
                    <Button type='submit' variant="contained" color="primary">
                        {t('motif.dialog.save')}
                    </Button>
                </Stack>

            </PaperStyled>
        </FormikProvider>
    )
}

export default InstructionDetails;
