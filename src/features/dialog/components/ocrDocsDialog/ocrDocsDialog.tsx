import {Box, Grid, IconButton, Stack, Typography} from "@mui/material";
import OcrDocsDialogStyled from "./overrides/ocrDocsDialogStyled";
import IconUrl from "@themes/urlIcon";
import {InputStyled} from "@features/tabPanel";
import React, {useState} from "react";
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import BorderLinearProgress from "./overrides/BorderLinearProgress";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function OcrDocsDialog({...props}) {
    const {t, files, setFiles, handleDeleteDoc} = props.data;

    const handleDrop = (acceptedFiles: FileList) => {
        setFiles([...files, acceptedFiles[0]]);
    }

    const handleUploadDoc = (file: File) => {
        console.log("file", file);
    }

    return (
        <OcrDocsDialogStyled>
            <Grid container spacing={1.2}>
                {files.map((file: File, index: number) =>
                    <Grid key={index} item xs={12} md={3.5}>
                        <Stack className={'container__document'} sx={{position: 'relative'}} alignItems={"center"}>
                            <Document {...{file}} className={'textLayer'}>
                                <Page pageNumber={1}/>
                            </Document>
                            <Stack className={'document_actions'} spacing={1} alignItems={"center"}>
                                <Stack direction={"row"} spacing={2}>
                                    <IconButton
                                        onClick={() => handleUploadDoc(file)}
                                        className="btn-list-action">
                                        <IconUrl path="ic-rotate" width={20} height={20}/>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteDoc(index)}
                                        color={"error"}
                                        className="btn-list-action">
                                        <IconUrl path="ic-delete" width={20} height={20}/>
                                    </IconButton>
                                </Stack>
                                <Typography className={"document_name"}>{file.name}</Typography>
                                <BorderLinearProgress variant="determinate" value={30}/>
                            </Stack>
                        </Stack>
                    </Grid>)}
                <Grid item xs={12} md={3.5}>
                    <label htmlFor="contained-button-file">
                        <InputStyled
                            id="contained-button-file"
                            onChange={(e) => handleDrop(e.target.files as FileList)}
                            type="file"
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
            <Stack className={'alert-card'} direction={"row"} alignItems={"center"} spacing={1.2}>
                <IconUrl path={'ic-warning'}/>
                <Stack spacing={1.2}>
                    <Typography fontSize={14} fontWeight={500}>{t('dialogs.add-dialog.notification-title')}</Typography>
                    <Typography className={'alert-card-description'} fontSize={12}
                                fontWeight={400}>{t('dialogs.add-dialog.notification-desc')}</Typography>
                </Stack>
            </Stack>
        </OcrDocsDialogStyled>
    )
}

export default OcrDocsDialog;
