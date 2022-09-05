import { Grid, Stack, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, TextField, Button } from '@mui/material'
import { useFormik, Form, FormikProvider } from "formik";
import DocumentDetailDialogStyled from './overrides/documentDetailDialogtyle';
import { useTranslation } from 'next-i18next'
import { capitalize } from 'lodash'
import React, { useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import { actionButtons, list } from './config'
import IconUrl from '@themes/urlIcon';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DocumentDetailDialog() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const formik = useFormik({
        initialValues: {
            name: "xyz",
        },
        onSubmit: async (values) => {
        },
    });
    const [file, setFile] = useState('/static/files/sample.pdf');
    const [numPages, setNumPages] = useState<number | null>(null);
    const [readonly, setreadonly] = useState<boolean>(true);
    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
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
                                    mx: 'auto'
                                }
                            }}>
                                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                    ))}

                                </Document>
                            </Box>
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <List>
                        {
                            actionButtons.map((button, idx) =>
                                <ListItem key={idx}>
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