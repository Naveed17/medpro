import {Box, Grid, IconButton, Stack, Typography} from "@mui/material";
import OcrDocsDialogStyled from "./overrides/ocrDocsDialogStyled";
import MobileUi from "./mobileUi";
import IconUrl from "@themes/urlIcon";
import {InputStyled} from "@features/tabPanel";
import React, {useCallback, useState} from "react";
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {ImageHandler} from "@features/image";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function OcrDocsDialog({...props}) {
    const {t, data, onDeleteDoc, onUploadDoc, onRetryDoc, onClose, isMobile} = props.data;

    const [files, setFiles] = useState([...data]);

    const handleUploadDoc = useCallback((files: FileList) => {
        onUploadDoc(files);
    }, [onUploadDoc]);

    const handleRetryDoc = useCallback((uuid: string) => {
        onRetryDoc(uuid);
    }, [onRetryDoc]);

    const handleDeleteDoc = useCallback((uuid: string) => {
        onDeleteDoc(uuid);
    }, [onDeleteDoc]);

    const handleDrop = (acceptedFiles: FileList) => {
        setFiles([...files, ...acceptedFiles]);
        handleUploadDoc(acceptedFiles);
    }

    return (
        <OcrDocsDialogStyled>
            {!isMobile ? (
                <Grid container spacing={1.2}>
                    {files.map((file: any, index: number) =>
                        <Grid key={index} item xs={12} md={3.5}>
                            <Stack className={'container__document'} sx={{position: 'relative'}} alignItems={"center"}>
                                {(file instanceof File && file.type !== "image/png") ?
                                    <Document {...{file}} className={'textLayer'}>
                                        <Page pageNumber={1}/>
                                    </Document>
                                    :
                                    file.type === "image/png" && <Box p={6}>
                                        <ImageHandler
                                            width={130} height={130}
                                            alt={"image/png"}
                                            src={URL.createObjectURL(file)}
                                        /></Box>}
                                <Stack
                                    className={`document_actions${file instanceof File && file.type !== "image/png" ? "" : "_"}`}
                                    spacing={1}
                                    alignItems={"center"}>
                                    {!(file instanceof File) && <Box p={6}>
                                        <IconUrl width={120} height={120} path={'ic-doc-upload'}/>
                                    </Box>}

                                    <Stack
                                        direction={"row"}
                                        spacing={2}>
                                        <IconButton
                                            {...(file instanceof File && {sx: {opacity: 0.5}})}
                                            disabled={file instanceof File}
                                            onClick={() => handleRetryDoc(file?.uuid)}
                                            className="btn-list-action">
                                            <IconUrl path="ic-rotate" width={20} height={20}/>
                                        </IconButton>
                                        <IconButton
                                            {...(file instanceof File && {sx: {opacity: 0.5}})}
                                            disabled={file instanceof File}
                                            onClick={() => handleDeleteDoc(file?.uuid)}
                                            color={"error"}
                                            className="btn-list-action">
                                            <IconUrl path="ic-delete" width={20} height={20}/>
                                        </IconButton>
                                    </Stack>
                                    <Typography
                                        className={"document_name"}>{file instanceof File ? file.name : file.title}</Typography>
                                    <Typography
                                        color={"gray"}
                                        fontSize={10}
                                        fontWeight={400}>{t('doc-status.pending')}</Typography>
                                </Stack>
                            </Stack>
                        </Grid>)}
                    <Grid item xs={12} md={3.5}>
                        <label htmlFor="contained-button-file-dialog">
                            <InputStyled
                                id="contained-button-file-dialog"
                                onChange={(e) => handleDrop(e.target.files as FileList)}
                                type="file"
                                multiple
                            />
                            <Box className={"upload-trigger"}>
                                <Stack className={'upload-icon'} alignItems={"center"}>
                                    <IconUrl path={'ic-upload-square'}/>
                                    <Typography sx={{mt: '1Rem'}} fontSize={12}
                                                fontWeight={400}>{t('dialogs.add-dialog.upload-title')}</Typography>
                                    <Typography color={"primary.main"} fontSize={12}
                                                fontWeight={500}>{t('dialogs.add-dialog.upload-sub-title')}</Typography>
                                </Stack>
                            </Box>
                        </label>
                    </Grid>
                </Grid>
            ) : (
                <MobileUi {...{files, onClose, handleDrop, handleDeleteDoc, t}}/>
            )}

            {
                files.length > 0 && (
                    <Stack className={'alert-card'} direction={"row"} alignItems={"center"} spacing={1.2}>
                        <IconUrl path={'ic-warning'}/>
                        <Stack spacing={1.2}>
                            <Typography fontSize={14}
                                        fontWeight={500}>{t('dialogs.add-dialog.notification-title')}</Typography>
                            <Typography className={'alert-card-description'} fontSize={12}
                                        fontWeight={400}>{t('dialogs.add-dialog.notification-desc')}</Typography>
                        </Stack>
                    </Stack>)
            }

        </OcrDocsDialogStyled>
    )
}

export default OcrDocsDialog;
