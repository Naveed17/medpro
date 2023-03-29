import {
    Box,
    Button,
    Card,
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
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {SetSelectedDialog} from "@features/toolbar";
import {Session} from "next-auth";
import Dialog from "@mui/material/Dialog";
import {LoadingScreen} from "@features/loadingScreen";
import {useReactToPrint} from "react-to-print";
import moment from "moment";
import ReactPlayer from "react-player";
import AudioPlayer from "react-h5-audio-player";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {Dialog as CustomDialog} from "@features/dialog";
import {configSelector} from "@features/base";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PreviewA4 from "@features/files/components/previewA4";

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
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [name, setName] = useState(state.name);
    const [note, setNote] = useState(state.description ? state.description : "");
    const [date, setDate] = useState(moment(state.createdAt, 'DD-MM-YYYY HH:mm').format("DD/MM/YYYY"));
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const [file, setFile] = useState<string>('');
    const [openRemove, setOpenRemove] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [menu, setMenu] = useState(true);
    const [isImg, setIsImg] = useState(false);
    const componentRef = useRef<any>(null)
    const [header, setHeader] = useState(null);
    const [error, setError] = useState(false);
    const [data, setData] = useState<any>({
        background: {show: false, content: ''},
        header: {show: true, x: 0, y: 0},
        footer: {show: false, x: 0, y: 234, content: ''},
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8},
        date: {show: true, prefix: 'Le ', content: '[ 00 / 00 / 0000 ]', x: 0, y: 155, textAlign: "center"},
        patient: {show: true, prefix: 'Nom & prénom: ', content: 'MOHAMED ALI', x: 40, y: 55},
        size: 'portraitA5',
        content: {
            show: true,
            maxHeight: 500,
            maxWidth: 130,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 70
        }
    })
    const {direction} = useAppSelector(configSelector);
    const generatedDocs = ['prescription', 'requested-analysis', 'requested-medical-imaging', 'write_certif', 'fees']
    const multimedias = ['video', 'audio', 'photo'];
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
    const selected = {
        title: t('askRemovedoc'),
        subtitle: t('subtitleRemovedoc'),
        icon: "/static/icons/ic-text.svg",
        name1: name,
        name2: t(state.type),
        data: props,
    }
    const actionButtons = [
        {
            title: 'print',
            icon: "ic-imprime",
            disabled: multimedias.some(media => media === state.type)
        },
        {
            title: data.header.show ? 'hide' : 'show',
            icon: "ic-menu2",
            disabled: multimedias.some(media => media === state.type) || !generatedDocs.some(media => media === state.type)
        }, {
            title: data.title.show ? 'hidetitle' : 'showtitle',
            icon: "ft14-text",
            disabled: multimedias.some(media => media === state.type) || !generatedDocs.some(media => media === state.type)
        }, {
            title: data.patient.show ? 'hidepatient' : 'showpatient',
            icon: "text-strikethrough",
            disabled: multimedias.some(media => media === state.type) || !generatedDocs.some(media => media === state.type)
        },
        {
            title: 'settings',
            icon: "ic-setting",
            disabled: multimedias.some(media => media === state.type) || !generatedDocs.some(media => media === state.type)
        },
        {
            title: 'download',
            icon: "ic-dowlaodfile",
        },
        {
            title: 'edit',
            icon: "ic-edit-gray",
            disabled: (state.type !== 'prescription' && state.type !== 'write_certif' && state.type !== 'requested-analysis') || !state.uuid
        },
        {
            title: 'delete',
            icon: "icdelete",
            disabled: !state.uuid
        }
    ];

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const {trigger} = useRequestMutation(null, "/documents");

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity?.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;

    const {data: httpHeaderData} = useRequest(medical_professional ? {
        method: "GET",
        url: `/api/medical-professional/${medical_professional.uuid}/documents_header/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

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

    const downloadF = () => {
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

    const handleActions = (action: string) => {
        switch (action) {
            case "print":
                handlePrint();
                break;
            case "delete":
                setOpenRemove(true)
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
                    case "requested-analysis":
                        let res: AnalysisModel[] = []
                        state.info.map((info: any) => {
                            res.push({...info.analysis, note: info.note});
                        });
                        dispatch(SetSelectedDialog({
                            action: 'balance_sheet_request',
                            state: res,
                            uuid: state.uuidDoc
                        }))
                        break;
                    case "write_certif":
                        dispatch(SetSelectedDialog({
                            action: 'write_certif',
                            state: state,
                            uuid: state.certifUuid
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
            case "hidepatient":
            case "showpatient":
                data.patient.show = !data.patient.show
                setData({...data})
                break;
            case "download":
                if (generatedDocs.some(doc => doc == state.type))
                    printNow();
                else {
                    downloadF();
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
            state.mutateDetails && state.mutateDetails()
            //enqueueSnackbar(t("renameWithsuccess"), {variant: 'success'})
        });
    }

    const eventHandler = (ev: any, location: { x: any; y: any; }, from: string) => {
        data[from].x = location.x
        data[from].y = location.y
        setData({...data})
    }

    useEffect(() => {
        setIsImg(state.detectedType?.split('/')[0] === 'image')
        setFile(state.uri)
    }, [state])

    useEffect(() => {
        if (httpHeaderData) {
            const docInfo = (httpHeaderData as HttpResponse).data
            if (!docInfo.header) {
                //handleClickOpen();
                console.log("no header");
                setLoading(false)
            } else {
                setOpenAlert(false);
                setData(docInfo.data)
                setHeader(docInfo.header)
                setLoading(false)
            }
        }
    }, [httpHeaderData])

    const dialogSave = (state: any) => {
        setLoading(true);
        setLoadingRequest && setLoadingRequest(true);
        trigger({
            method: "DELETE",
            url: `/api/medical-entity/${documentViewIndex === 0 ? "agendas/appointments" : (medical_entity.uuid + "/patients/" + patient?.uuid)}/documents/${state.uuid}/${router.locale}`,
            headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
        }, {revalidate: true, populateCache: true}).then(() => {
            state.mutate && state.mutate();
            state.mutateDetails && state.mutateDetails()
            setOpenRemove(false);
            setLoading(false);
            (documentViewIndex === 1 && mutatePatientDocuments) && mutatePatientDocuments();
            setLoadingRequest && setLoadingRequest(false);
            setOpenDialog && setOpenDialog(false);
        });
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <DocumentDetailDialogStyled>
            <Grid container>
                <Grid item xs={12} md={menu ? 8 : 11}>
                    <Stack spacing={2}>
                        {
                            !multimedias.some(multi => multi === state.type) &&
                            <Box style={{minWidth: '148mm', margin: 'auto'}}>
                                <Box ref={componentRef}>
                                    {
                                        generatedDocs.some(doc => doc === state.type) &&
                                        <div>
                                            {!loading && <PreviewA4  {...{
                                                eventHandler,
                                                data,
                                                values: header,
                                                state: state.type === "fees" && state.info.length === 0 ? {
                                                    ...state,
                                                    info: [{
                                                        fees: state.consultationFees,
                                                        hiddenData: true,
                                                        act: {
                                                            name: "Consultation",
                                                        },
                                                        qte: 1
                                                    }]
                                                } : state,
                                                date,
                                                loading,
                                                t
                                            }} />}
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
                                            {!isImg && !error && <Document ref={
                                                componentRef} file={file}
                                                                           loading={t('wait')}
                                                                           onLoadSuccess={onDocumentLoadSuccess}
                                                                           onLoadError={() => {
                                                                               setError(true)
                                                                           }}
                                            >
                                                {Array.from(new Array(numPages), (el, index) => (
                                                    <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                                                ))}

                                            </Document>}
                                            {!isImg && error && <Card style={{padding: 10}} onClick={downloadF}>
                                                <Stack alignItems={"center"} spacing={1} justifyContent={"center"}>
                                                    <IconUrl width={100} height={100} path={"ic-download"}/>
                                                    <Typography>{t('ureadbleFile')}</Typography>
                                                    <Typography fontSize={12}
                                                                style={{opacity: 0.5}}>{t('downloadnow')}</Typography>
                                                </Stack>
                                            </Card>}

                                            {isImg && <Box component={"img"} src={state.uri}
                                                           sx={{marginLeft: 2, maxWidth: "100%"}}
                                                           alt={"img"}/>}
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
                <Grid item xs={12} md={menu ? 4 : 1} className="sidebar" color={"white"} style={{background: "white"}}>
                    {menu ? <List>
                        <ListItem className='secound-list'>
                            <ListItemButton onClick={() => {
                                setMenu(false)
                            }}>
                                <ListItemIcon>
                                    <CloseFullscreenIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("close")}/>
                            </ListItemButton>
                        </ListItem>
                        {
                            actionButtons.map((button, idx) =>
                                <ListItem key={idx} onClick={() => handleActions(button.title)}>
                                    {!button.disabled && <ListItemButton
                                        className={button.title === "delete" ? "btn-delete" : ""}>
                                        <ListItemIcon>
                                            <IconUrl path={button.icon}/>
                                        </ListItemIcon>
                                        {menu && <ListItemText primary={t(button.title)}/>}
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
                                    onBlur={() => {
                                        editDoc("description", note)
                                    }}
                                    onChange={(ev) => {
                                        setNote(ev.target.value)
                                        document.getElementById('note-input')?.focus()
                                    }}/>
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
                                    onBlur={() => editDoc("name", name)}
                                    onChange={(ev) => {
                                        setName(ev.target.value)
                                        document.getElementById('name-input')?.focus()
                                    }}
                                />
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
                    </List> : <>


                        <List>

                            <ListItem onClick={() => {
                                setMenu(true)
                            }} disablePadding sx={{display: 'block'}}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            margin: 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <OpenInFullIcon/>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>

                            {
                                actionButtons.map((button, idx) =>
                                    !button.disabled &&
                                    <ListItem key={`${idx}-item`} onClick={() => handleActions(button.title)}
                                              disablePadding sx={{display: 'block'}}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: 'center',
                                                px: 2.5,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    margin: 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <IconUrl path={button.icon}/>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            }


                        </List>
                    </>}
                </Grid>
            </Grid>

            <CustomDialog action={"remove"}
                          direction={direction}
                          open={openRemove}
                          data={selected}
                          color={(theme: Theme) => theme.palette.error.main}
                          title={t('removedoc')}
                          t={t}
                          actionDialog={
                              <DialogActions>
                                  <Button onClick={() => {
                                      setOpenRemove(false);
                                  }}
                                          startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                                  <LoadingButton variant="contained"
                                                 sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                                 onClick={() => dialogSave(state)}>{t('remove')}</LoadingButton>
                              </DialogActions>
                          }
            />

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
