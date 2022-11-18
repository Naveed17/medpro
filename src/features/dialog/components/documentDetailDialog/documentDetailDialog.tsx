import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import DocumentDetailDialogStyled from './overrides/documentDetailDialogstyle';
import {useTranslation} from 'next-i18next'
import {capitalize} from 'lodash'
import React, {useEffect, useRef, useState} from 'react';
import {Document, Page, pdfjs} from "react-pdf";
import IconUrl from '@themes/urlIcon';
import jsPDF from "jspdf";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import autoTable from 'jspdf-autotable';
import {Certificat, Fees, Header, Prescription, RequestedAnalysis} from "@features/files";
import moment from "moment/moment";
import RequestedMedicalImaging from "@features/files/components/requested-medical-imaging/requested-medical-imaging";
import {useAppDispatch} from "@app/redux/hooks";
import {SetSelectedDialog} from "@features/toolbar";
import {Session} from "next-auth";
import {useSnackbar} from "notistack";
import printJS from 'print-js'
import Dialog from "@mui/material/Dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DocumentDetailDialog({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const {data: {state, setOpenDialog}} = props
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const [name, setName] = useState(state.name);
    const {data: user} = session as Session;
    const [openAlert, setOpenAlert] = useState(false);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {enqueueSnackbar} = useSnackbar();

    const list = [
        {
            title: 'document_type',
            value: t(state.type),

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
            value: moment().format("DD/MM/YYYY"),
        }
    ]

    const [file, setFile] = useState<string>('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const componentRef = useRef<any>(null)
    const [hide, sethide] = useState<boolean>(false);
    const [header, setHeader] = useState(null);

    const actionButtons = [
        {
            title: 'print',
            icon: "ic-imprime",
            disabled: state.type === 'photo'
        },
        /* {
             title: 'share',
             icon: "ic-send"
         },*/
        {
            title: hide ? 'show' : 'hide',
            icon: "ic-menu2",
            disabled: state.type === 'photo'
        },
        {
            title: 'download',
            icon: "ic-dowlaodfile"
        },
        {
            title: 'edit',
            icon: "ic-edit-gray",
            disabled: state.type !== 'prescription' || !state.uuid
        },
        {
            title: 'delete',
            icon: "icdelete",
            disabled: !state.uuid
        }
    ];

    const addFooters = (doc: any) => {
        const pageCount = doc.internal.getNumberOfPages()

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        doc.setPage(pageCount)
        //for (let i = 1; i <= pageCount; i++) {
        doc.text('Signature', doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 30, {
            align: 'center'
        })

        /*for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.text('footer', 15, doc.internal.pageSize.height - 20, {
                align: 'center'
            })
        }*/
        // }
    }

    useEffect(() => {
        const doc = new jsPDF({
            format: 'a5'
        });
        if (!hide && header) {
            autoTable(doc, {
                html: '#header',
                useCss: true
            })
        }

        if (state.type === 'prescription') {
            autoTable(doc, {
                html: '#prescription',
                useCss: true,
                includeHiddenHtml: true,
                styles: {fillColor: [255, 255, 255]},
                startY: 40
            })
            addFooters(doc)
            const uri = doc.output('bloburi').toString()
            setFile(uri)
        } else if (state.type === 'requested-analysis') {
            autoTable(doc, {
                html: '#requested-analysis',
                useCss: true,
                includeHiddenHtml: true,
                styles: {fillColor: [255, 255, 255]},
                startY: 40
            })
            addFooters(doc)
            const uri = doc.output('bloburi').toString()
            setFile(uri)
        } else if (state.type === 'requested-medical-imaging') {
            autoTable(doc, {
                html: '#requested-medical-imaging',
                useCss: true,
                includeHiddenHtml: true,
                styles: {fillColor: [255, 255, 255]},
                startY: 40
            })
            addFooters(doc)
            const uri = doc.output('bloburi').toString()
            setFile(uri)
        } else if (state.type === 'write_certif') {

            autoTable(doc, {
                html: '#certificat',
                useCss: true,
                includeHiddenHtml: true,
                styles: {fillColor: [255, 255, 255]},
                startY: 40
            })
            addFooters(doc)
            const uri = doc.output('bloburi').toString()
            setFile(uri)
        } else if (state.type === 'fees') {
            autoTable(doc, {
                html: '#fees',
                useCss: true,
                includeHiddenHtml: true,
                styles: {fillColor: [255, 255, 255]},
                startY: 40
            })
            addFooters(doc)
            const uri = doc.output('bloburi').toString()
            setFile(uri)
        } else setFile(state.uri)

        // doc.save()
    }, [state, hide, header])

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    const {data: httpHeaderData} = useRequest({
        method: "GET",
        url: `/api/medical-professional/${medical_professional.uuid}/documents_header/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    }, {fallbackData: undefined, ...{revalidate: true, populateCache: true}});

    const handleClickOpen = () => {
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    const handleYes = () => {
        router.push("/dashboard/settings/documents").then(() => {
            setOpenAlert(false);
        })
    };

    useEffect(() => {
        if (httpHeaderData) {
            setHeader((httpHeaderData as HttpResponse).data)
            if ((httpHeaderData as HttpResponse).data.length !== undefined)
                handleClickOpen()
        }
    }, [httpHeaderData])

    const handlePrint = () => {
        printJS({printable: file, type: 'pdf', showModal: true})
    }

    const {trigger} = useRequestMutation(null, "/documents");

    const handleActions = (action: string) => {
        switch (action) {
            case "print":
                handlePrint();
                break;
            case "delete":
                trigger({
                    method: "DELETE",
                    url: `/api/medical-entity/agendas/appointments/documents/${state.uuid}/${router.locale}`,
                    headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
                }, {revalidate: true, populateCache: true}).then(() => {
                    state.mutate()
                    setOpenDialog(false)
                });

                break;
            case "edit":
                switch (state.type) {
                    case "prescription":
                        const prescriptions: { dosage: any; drugUuid: any; duration: any; durationType: any; name: any; note: any; }[] = []
                        state.info.map((drug: { dosage: any; standard_drug: { uuid: any; commercial_name: any; }; duration: any; duration_type: any; note: any; }) => {
                            prescriptions.push({
                                dosage: drug.dosage,
                                drugUuid: drug.standard_drug.uuid,
                                duration: drug.duration,
                                durationType: drug.duration_type,
                                name: drug.standard_drug.commercial_name,
                                note: drug.note
                            })
                        })
                        dispatch(SetSelectedDialog({
                            action: 'medical_prescription',
                            state: prescriptions,
                            uuid: state.uuidDoc
                        }))
                        break;
                }

                break;
            case "hide":
                sethide(!hide)
                break;
            case "show":
                sethide(!hide)
                break;
            case "download":
                if (file) {
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
                } else {
                    alert('no file to download')
                }
                break;
            default:
                break;
        }
    }

    const rename = () => {
        const form = new FormData();
        form.append('attribute', "name");
        form.append('value', name);
        trigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/documents/${state.uuid}/${router.locale}`,
            data: form,
            headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
        }, {revalidate: true, populateCache: true}).then(() => {
            state.mutate()
            enqueueSnackbar(t("renameWithsuccess"), {variant: 'success'})

        });


    }

    if (!ready) return <>loading translations...</>;

    return (
        <DocumentDetailDialogStyled>
            {header && <Header data={header}/>}

            {state.type === 'write_certif' && <Certificat data={state}/>}
            {state.type === 'prescription' && <Prescription data={state}/>}
            {state.type === 'requested-analysis' && <RequestedAnalysis data={state}/>}
            {state.type === 'requested-medical-imaging' &&
                <RequestedMedicalImaging data={state}/>}

            {state.type === 'fees' && <Fees data={state}></Fees>}
            <Grid container spacing={5}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        {state.type !== 'photo' && <Box sx={{
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
                                    <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                                ))}

                            </Document>
                        </Box>}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {state.type === 'photo' && <img src={state.uri} style={{marginLeft: 20}} alt={"img"}/>}
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4} className="sidebar">
                    <List>
                        {
                            actionButtons.map((button, idx) =>
                                <ListItem key={idx} onClick={() => handleActions(button.title)}>
                                    <ListItemButton disabled={button.disabled}
                                                    className={button.title === "delete" ? "btn-delete" : ""}>
                                        <ListItemIcon>
                                            <IconUrl path={button.icon}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t(button.title)}/>
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                        <ListItem className='secound-list'>
                            <ListItemButton disableRipple sx={{flexDirection: "column", alignItems: 'flex-start'}}>
                                <Typography color='text.secondary'>
                                    {t('document_name')}
                                </Typography>
                                <TextField
                                    value={name}
                                    onChange={(ev) => setName(ev.target.value)}
                                    inputRef={input => input && input.focus()}

                                />
                                <Button size='small' className='btn-modi' onClick={() => rename()}>
                                    <IconUrl path="ic-edit"/>
                                    {t('modifier')}
                                </Button>
                            </ListItemButton>
                        </ListItem>
                        {
                            list.map((item, idx) =>
                                <ListItem className='secound-list' key={idx}>
                                    <ListItemButton disableRipple
                                                    sx={{flexDirection: "column", alignItems: 'flex-start'}}>
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

            <Dialog
                open={openAlert}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent>
                    <Typography variant={"h6"} mb={2}>{t('alertTitle')}</Typography>
                    <DialogContentText id="alert-dialog-description">
                        {t('alertDesc')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('notNow')}</Button>
                    <Button onClick={handleYes} autoFocus>
                        {t('now')}
                    </Button>
                </DialogActions>
            </Dialog>
        </DocumentDetailDialogStyled>
    )
}

export default DocumentDetailDialog