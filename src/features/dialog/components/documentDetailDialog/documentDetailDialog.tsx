import {
    Grid,
    Stack,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    TextField,
    Button
} from '@mui/material'
import { useFormik, Form, FormikProvider } from "formik";
import DocumentDetailDialogStyled from './overrides/documentDetailDialogstyle';
import { useReactToPrint } from 'react-to-print'
import { useTranslation } from 'next-i18next'
import { capitalize } from 'lodash'
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import { actionButtons } from './config'
import IconUrl from '@themes/urlIcon';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from "moment";
import { useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { PdfTempleteOne, PdfTempleteTwo } from '@features/files'
import dynamic from "next/dynamic";
import html2pdf from "html2pdf.js";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DocumentDetailDialog({ ...props }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })

    const { data: { state, setDialog } } = props
    console.log(props);
    const router = useRouter();
    const { data: session, status } = useSession();


    const formik = useFormik({
        initialValues: {
            name: state.name,
        },
        onSubmit: async (values) => {
        },
    });

    const list = [
        {
            title: 'document_type',
            value: state.type,

        },
        {
            title: 'patient',
            value: state.patient,
        },
        {
            title: 'created_by',
            value: 'Moi',
        },
        {
            title: 'created_on',
            value: '12/05/2002',
        }
    ]

    const [file, setFile] = useState<string>('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const componentRef = useRef<any>(null)
    const [readonly, setreadonly] = useState<boolean>(true);
    const [hide, sethide] = useState<boolean>(false);
    useEffect(() => {

    }, [state])

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const { trigger } = useRequestMutation(null, "/documents");


    const handleActions = (action: string) => {
        switch (action) {
            case "print":
                handlePrint();
                break;
            case "delete":
                trigger({
                    method: "DELETE",
                    url: "/api/medical-entity/agendas/appointments/documents/" + state.uuid + '/' + router.locale,
                    headers: { ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}` }
                }, { revalidate: true, populateCache: true }).then(() => {
                    // mutate()
                });

                break;
            case "edit":
                console.log(state.info[0])
                //setDialog('draw_up_an_order')
                break;
            case "hide":
                sethide(!hide)
                break;
            case "download":
                html2pdf(componentRef.current, {
                    margin: 1,
                    filename: 'document.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { dpi: 192, letterRendering: true },
                    jsPDF: { unit: 'in', format: 'a5', orientation: 'portrait' }
                })
                // if (file) {
                //     fetch(file).then(response => {
                //         response.blob().then(blob => {
                //             const fileURL = window.URL.createObjectURL(blob);
                //             // Setting various property values
                //             let alink = document.createElement('a');
                //             alink.href = fileURL;
                //             alink.download = file.split(/(\\|\/)/g).pop() as string
                //             alink.click();
                //         })
                //     })
                // } else {
                //     alert('no file to download')
                // }
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
                            {/* <Box sx={{
                                '.react-pdf__Page': {
                                    marginBottom: 1,
                                    '.react-pdf__Page__canvas': {
                                        mx: 'auto',
                                    }
                                }
                            }}>
                                <Document ref={
                                    componentRef} file={file} onLoadSuccess={onDocumentLoadSuccess}
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                    ))}

                                </Document>
                            </Box> */}
                            <Box ref={componentRef} width="90%" mx="auto">
                                <PdfTempleteTwo hide={hide} />
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
                                    <ListItemButton disableRipple
                                        sx={{ flexDirection: "column", alignItems: 'flex-start' }}>
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