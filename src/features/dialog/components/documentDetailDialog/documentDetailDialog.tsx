import { Grid, Stack, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, TextField, Button } from '@mui/material'
import { useFormik, Form, FormikProvider } from "formik";
import DocumentDetailDialogStyled from './overrides/documentDetailDialogstyle';
import { useReactToPrint } from 'react-to-print'
import { useTranslation } from 'next-i18next'
import { capitalize } from 'lodash'
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import { actionButtons, list } from './config'
import IconUrl from '@themes/urlIcon';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DocumentDetailDialog({ ...props }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const formik = useFormik({
        initialValues: {
            name: "xyz",
        },
        onSubmit: async (values) => {
        },
    });
    const { data: { state } } = props

    const [file, setFile] = useState(state);
    const [numPages, setNumPages] = useState<number | null>(null);
    const componentRef = useRef(null)
    const [readonly, setreadonly] = useState<boolean>(true);
    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }
    const handlePrint = useReactToPrint({
        onPrintError: (error) => console.log(error),
        content: () => componentRef.current,
    });

    const handleActions = (action: string) => {
        switch (action) {
            case "print":
                handlePrint();
                break;
            case "download":
                fetch(file).then(response => {
                    response.blob().then(blob => {
                        const fileURL = window.URL.createObjectURL(blob);
                        // Setting various property values
                        let alink = document.createElement('a');
                        alink.href = fileURL;
                        alink.download = file.split(/(\\|\/)/g).pop() as string
                        alink.click();
                    })
                })

                break;
            default:
                break;
        }
    }
    const { values, handleSubmit, getFieldProps } = formik;
    if (!ready) return <>loading translations...</>;
    return (
        <DocumentDetailDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={8}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <Box sx={{
                                '.react-pdf__Page__canvas': {
                                    mx: 'auto',
                                }
                            }}>
                                <Document ref={
                                    componentRef} file={file} onLoadSuccess={onDocumentLoadSuccess}
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                    ))}

                                </Document>
                            </Box>
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={4} className="sidebar">
                    <List>
                        {
                            actionButtons.map((button, idx) =>
                                <ListItem key={idx} onClick={() => handleActions(button.title)}>
                                    <ListItemButton className={button.title === "delete" ? "btn-delete" : ""}>
                                        <ListItemIcon>
                                            <IconUrl path={button.icon} />
                                        </ListItemIcon>
                                        <ListItemText primary={t(button.title)} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                        <ListItem className='secound-list'>
                            <ListItemButton disableRipple sx={{ flexDirection: "column", alignItems: 'flex-start' }}>
                                <Typography color='text.secondary'>
                                    {t('document_name')}
                                </Typography>
                                <TextField
                                    {...getFieldProps('name')}
                                    inputProps={{
                                        readOnly: readonly
                                    }}
                                    inputRef={input => input && input.focus()}

                                />
                                <Button size='small' className='btn-modi' onClick={
                                    () => setreadonly(!readonly)

                                }>
                                    <IconUrl path="ic-edit" />
                                    {t('modifier')}
                                </Button>
                            </ListItemButton>
                        </ListItem>
                        {
                            list.map((item, idx) =>
                                <ListItem className='secound-list' key={idx}>
                                    <ListItemButton disableRipple sx={{ flexDirection: "column", alignItems: 'flex-start' }}>
                                        <Typography color='text.secondary'>
                                            {capitalize(t(item.title))}
                                        </Typography>
                                        <Typography fontWeight={700}>
                                            {item.value}
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                            )
                        }

                    </List>
                </Grid>
            </Grid>
        </DocumentDetailDialogStyled>
    )
}

export default DocumentDetailDialog