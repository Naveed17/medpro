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
import {Document, Page, pdfjs} from "react-pdf";

import DocumentDetailDialogStyled from './overrides/documentDetailDialogstyle';
import {useTranslation} from 'next-i18next'
import {capitalize} from 'lodash'
import React, {useEffect, useRef, useState} from 'react';
import IconUrl from '@themes/urlIcon';
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useAppDispatch} from "@app/redux/hooks";
import {SetSelectedDialog} from "@features/toolbar";
import {Session} from "next-auth";
import {useSnackbar} from "notistack";
import Dialog from "@mui/material/Dialog";
import {LoadingScreen} from "@features/loadingScreen";
import {useReactToPrint} from "react-to-print";
import Preview from "@features/files/components/preview";
import moment from "moment";
import ReactPlayer from "react-player";
import AudioPlayer from "react-h5-audio-player";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DocumentDetailDialog({...props}) {
    const {
        data: {
            state,
            setOpenDialog,
            patient,
            mutatePatientDocuments = null,
            documentViewIndex = 0,
            setLoadingRequest = null
        }
    } = props
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [name, setName] = useState(state.name);
    const [note, setNote] = useState(state.description);
    const [date, setDate] = useState(moment(state.createdAt, 'DD-MM-YYYY HH:mm').format("DD/MM/YYYY"));
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const [file, setFile] = useState<string>('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const componentRef = useRef<any>(null)
    const [header, setHeader] = useState(null);
    const [data, setData] = useState<any>({
        background: {show: false, content: ''},
        header: {show: true, x: 0, y: 0},
        size: 'portraitA5',
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8},
        date: {show: true, prefix: 'Le ', content: '[ ../../.... ]', x: 412, y: 35},
        footer: {show: true, x: 0, y: 140, content: ''},
        patient: {show: true, prefix: '', content: 'MohamedALI', x: 120, y: 55},
        content: {
            show: true,
            maxHeight: 400,
            maxWidth: 130,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 70
        }
    })

    const generatedDocs = ['prescription', 'requested-analysis', 'requested-medical-imaging', 'write_certif', 'fees']
    const multimedias = ['video', 'audio', 'photo']
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
        }
    ]
    const actionButtons = [
        {
            title: 'print',
            icon: "ic-imprime",
            disabled: multimedias.some(media => media === state.type)
        },
        {
            title: data.header.show ? 'hide' : 'show',
            icon: "ic-menu2",
            disabled: multimedias.some(media => media === state.type)
        }, {
            title: data.title.show ? 'hidetitle' : 'showtitle',
            icon: "ic-menu2",
            disabled: multimedias.some(media => media === state.type)
        },
        {
            title: 'settings',
            icon: "ic-setting",
            disabled: multimedias.some(media => media === state.type)
        },
        {
            title: 'download',
            icon: "ic-dowlaodfile",
            disabled: multimedias.some(media => media === state.type)
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

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {trigger} = useRequestMutation(null, "/documents");

    const {data: httpHeaderData} = useRequest({
        method: "GET",
        url: `/api/medical-professional/${medical_professional.uuid}/documents_header/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    const handleClickOpen = () => {
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    const handleYes = () => {
        router.push("/dashboard/settings/docs").then(() => {
            setOpenAlert(false);
        })
    };

    const handlePrint = () => {
        printNow()
    }

    const printNow = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${t(state.type)} ${state.patient}`
    })

    const handleActions = (action: string) => {
        switch (action) {
            case "print":
                handlePrint();
                break;
            case "delete":
                setLoadingRequest && setLoadingRequest(true);
                trigger({
                    method: "DELETE",
                    url: `/api/medical-entity/${documentViewIndex === 0 ? "agendas/appointments" : (medical_entity.uuid + "/patients/" + patient?.uuid)}/documents/${state.uuid}/${router.locale}`,
                    headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
                }, {revalidate: true, populateCache: true}).then(() => {
                    state.mutate();
                    (documentViewIndex === 1 && mutatePatientDocuments) && mutatePatientDocuments();
                    setLoadingRequest && setLoadingRequest(false);
                    setOpenDialog(false);
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
            case "show":
                data.header.show = !data.header.show
                setData({...data})
                break;
            case "hidetitle":
            case "showtitle":
                data.title.show = !data.title.show
                setData({...data})
                break;
            case "download":
                if (generatedDocs.some(doc => doc == state.type))
                    printNow();
                else {
                    fetch(file).then(response => {
                        response.blob().then(blob => {
                            const fileURL = window.URL.createObjectURL(blob);
                            let alink = document.createElement('a');
                            alink.href = fileURL;
                            alink.download = `${state.type} ${state.patient}`
                            alink.click();
                        })
                    })
                }
                break;
            case "settings":
                router.push("/dashboard/settings/docs").then(() => {
                })
                break;
            default:
                break;
        }
    }

    const editDoc = (attribute: string, value: string) => {
        const form = new FormData();
        form.append('attribute', attribute);
        form.append('value', value);
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

    const eventHandler = (ev: any, location: { x: any; y: any; }, from: string) => {
        data[from].x = location.x
        data[from].y = location.y
        setData({...data})
    }

    useEffect(() => {
        setFile(state.uri)
    }, [state])

    useEffect(() => {
        if (httpHeaderData) {
            const docInfo = (httpHeaderData as HttpResponse).data
            if (!docInfo.header) {
                //handleClickOpen();
            } else {
                setOpenAlert(false);
                setData(docInfo.data)
                setHeader(docInfo.header)
                setLoading(false)
            }
        }
    }, [httpHeaderData])

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <DocumentDetailDialogStyled>
            <Grid container>
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        {
                            !multimedias.some(multi => multi === state.type) &&
                            <Box style={{width: '148mm', margin: 'auto'}}>
                                <Box ref={componentRef}>
                                    {
                                        generatedDocs.some(doc => doc === state.type) &&
                                        <div>
                                            <Preview  {...{
                                                eventHandler,
                                                data,
                                                values: header,
                                                state,
                                                date,
                                                loading,
                                                t
                                            }} />
                                            {loading && <div className={data.size ? data.size : "portraitA5"}></div>}
                                        </div>
                                    }
                                    {
                                        !generatedDocs.some(doc => doc === state.type) &&
                                        <Box sx={{
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
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        }
                        {
                            multimedias.some(multi => multi === state.type) &&
                            <Box>
                                {state.type === 'photo' &&
                                    <Box component={"img"} src={state.uri} sx={{marginLeft: 2, maxWidth: "100%"}}
                                         alt={"img"}/>}
                                {state.type === 'video' && <ReactPlayer url={file} controls={true}/>}
                                {state.type === 'audio' && <Box padding={2}><AudioPlayer autoPlay src={file}/></Box>}
                            </Box>
                        }
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4} className="sidebar" color={"white"} style={{background: "white"}}>
                    <List>
                        {
                            actionButtons.map((button, idx) =>
                                <ListItem key={idx} onClick={() => handleActions(button.title)}>
                                    {!button.disabled && <ListItemButton
                                        className={button.title === "delete" ? "btn-delete" : ""}>
                                        <ListItemIcon>
                                            <IconUrl path={button.icon}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t(button.title)}/>
                                    </ListItemButton>}
                                </ListItem>
                            )
                        }
                        <ListItem className='secound-list'>
                            <ListItemButton disableRipple sx={{flexDirection: "column", alignItems: 'flex-start'}}>
                                <Typography color='text.secondary'>
                                    {t('document_note')}
                                </Typography>
                                <TextField
                                    value={note}
                                    id={'note-input'}
                                    multiline
                                    rows={4}
                                    onChange={(ev) => {
                                        setNote(ev.target.value)
                                        document.getElementById('note-input')?.focus()
                                    }}/>
                                <Button size='small' className='btn-modi' onClick={() => editDoc("description", note)}>
                                    <IconUrl path="ic-edit"/>
                                    {t('modifier')}
                                </Button>
                            </ListItemButton>
                        </ListItem>
                        <ListItem className='secound-list'>
                            <ListItemButton disableRipple sx={{flexDirection: "column", alignItems: 'flex-start'}}>
                                <Typography color='text.secondary'>
                                    {t('document_name')}
                                </Typography>
                                <TextField
                                    value={name}
                                    id={'name-input'}
                                    onChange={(ev) => {
                                        setName(ev.target.value)
                                        document.getElementById('name-input')?.focus()
                                    }}
                                />
                                <Button size='small' className='btn-modi' onClick={() => editDoc("name", name)}>
                                    <IconUrl path="ic-edit"/>
                                    {t('modifier')}
                                </Button>
                            </ListItemButton>
                        </ListItem>
                        <ListItem className='secound-list'>
                            <ListItemButton disableRipple sx={{flexDirection: "column", alignItems: 'flex-start'}}>
                                <Typography color='text.secondary'>
                                    {t('created_on')}
                                </Typography>
                                <TextField
                                    value={date}
                                    id={'date-input'}
                                    onChange={(ev) => {
                                        setDate(ev.target.value);
                                        document.getElementById('date-input')?.focus()
                                    }}
                                />
                                {/*<Button size='small' className='btn-modi' onClick={() => console.log(date)}>
                                    <IconUrl path="ic-edit"/>
                                    {t('modifier')}
                                </Button>*/}
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
