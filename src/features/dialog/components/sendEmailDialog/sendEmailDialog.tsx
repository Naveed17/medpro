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
import React, {useCallback, useState} from "react";
import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import {Document, Page} from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {ImageHandler} from "@features/image";

function SendEmailDialog({...props}) {
    const {preview, patient, t, title, handleSendEmail, loading} = props.data;

    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

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

    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages);
    }

    const changePage = (offset: number) => {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    const previousPage = () => {
        changePage(-1);
    }

    const nextPage = () => {
        changePage(1);
    }

    const {values, isValid, getFieldProps} = formik;

    return (
        <FormikProvider value={formik}>
            <Grid container spacing={1.4} pl={.8}>
                {preview && <Grid
                    item xs={12} md={3.7}
                    sx={{
                        ...(!preview.type.includes("image") && {boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}),
                        mt: 2
                    }}>
                    <Box
                        sx={{scale: preview.type.includes("image") ? "1" : "0.4", transformOrigin: "top left", height: 340}}>
                        {preview.type.includes("image") ?
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={URL.createObjectURL(preview)}
                                id="displayFile"
                                height="100%"
                                width="100%"
                                alt={"File"}/> :
                            <Document
                                file={preview}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={t('wait')}>
                                <Page pageNumber={pageNumber}/>
                            </Document>}
                    </Box>
                    {!preview.type.includes("image") && <div className="page-controls">
                        <button
                            type="button"
                            disabled={pageNumber <= 1}
                            onClick={previousPage}>‹
                        </button>
                        <span>{`${pageNumber} of ${numPages}`}</span>
                        <button
                            disabled={numPages ? pageNumber >= numPages : true}
                            onClick={nextPage}>›
                        </button>
                    </div>}
                </Grid>}
                <Grid item xs={12} md={preview ? 8.3 : 12}>
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

                        {preview && <FormControlLabel
                            control={<Checkbox
                                checked={values.withFile}
                                {...getFieldProps("withFile")}/>}
                            label={t("send_document_joint")}/>}
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
