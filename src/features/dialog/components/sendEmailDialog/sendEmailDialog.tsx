import {
    Box,
    CardActions, Checkbox,
    FormControl, FormControlLabel,
    Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import TextareaAutosizeStyled from "./overrides/TextareaAutosizeStyled";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import React, {useCallback} from "react";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import {Document, Page} from "react-pdf";

function SendEmailDialog({...props}) {
    const {preview, patient, t, title, handleSendEmail, loading} = props.data;

    const validationSchema = Yup.object().shape({
        receiver: Yup.string().email(t("error.mailInvalid")).required(t("error.receiver")),
        subject: Yup.string().required(t("error.subject")),
        content: Yup.string().required(t("error.content"))
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            receiver: patient?.email ?? "",
            subject: title,
            content: "",
            withFile: true
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const sendEmailCallback = useCallback((values: any) => {
        handleSendEmail(values);
    }, [handleSendEmail]) // eslint-disable-line react-hooks/exhaustive-deps

    const {values, isValid, getFieldProps} = formik;

    return (
        <FormikProvider value={formik}>
            <Grid container spacing={1.4} pl={.8}>
                <Grid item xs={12} md={3.7} sx={{boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", mt: 2}}>
                    <Box sx={{scale: "0.4", transformOrigin: "top left", maxHeight: 340}}>
                        <Document
                            file={preview}
                            loading={t('wait')}>
                            {preview && Array.from(new Array(1), (el, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                            ))}
                        </Document>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8.3}>
                    <Box ml={2}>
                        <Stack>
                            <Typography style={{color: "gray"}}
                                        fontSize={12}>{t('receiver')}</Typography>
                            <TextField
                                style={{width: "100%"}}
                                {...getFieldProps("receiver")}/>
                        </Stack>

                        <Stack>
                            <Typography style={{color: "gray"}}
                                        fontSize={12}>{t('subject')}</Typography>
                            <TextField
                                style={{width: "100%"}}
                                {...getFieldProps("subject")}/>
                        </Stack>

                        <Stack>
                            <Typography style={{color: "gray"}}
                                        fontSize={12}>{t('content')}</Typography>
                            <FormControl fullWidth size="small">
                                <TextareaAutosizeStyled
                                    minRows={4}
                                    {...getFieldProps("content")}/>
                            </FormControl>
                        </Stack>

                        <FormControlLabel
                            control={<Checkbox
                                checked={values.withFile}
                                {...getFieldProps("withFile")}/>}
                            label={t("send_document_joint")}/>
                    </Box>

                </Grid>
            </Grid>

            <CardActions>
                <LoadingButton
                    {...{loading}}
                    loadingPosition={"start"}
                    disabled={!isValid}
                    sx={{marginLeft: 'auto'}}
                    onClick={() => sendEmailCallback(values)}
                    variant="contained"
                    startIcon={<SaveRoundedIcon/>}>
                    {t("save")}
                </LoadingButton>
            </CardActions>
        </FormikProvider>)
}

export default SendEmailDialog
