import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material'
import {Document, Page} from "react-pdf";

import DocumentDetailDialogStyled from './overrides/documentDetailDialogstyle';
import {useTranslation} from 'next-i18next'
import {capitalize} from 'lodash'
import React, {useEffect, useRef, useState} from 'react';
import IconUrl from '@themes/urlIcon';
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {SetSelectedDialog} from "@features/toolbar";
import {Session} from "next-auth";
import Dialog from "@mui/material/Dialog";
import PreviewA4 from "@features/files/components/previewA4";

import {useReactToPrint} from "react-to-print";
import moment from "moment";
import ReactPlayer from "react-player";
import AudioPlayer from "react-h5-audio-player";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {Dialog as CustomDialog} from "@features/dialog";
import {configSelector, dashLayoutSelector} from "@features/base";
import {
    downloadFileAsPdf,
    generatePdfFromHtml,
    getMimeTypeFromArrayBuffer,
    useMedicalEntitySuffix,
    useMedicalProfessionalSuffix
} from "@lib/hooks";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import {useSnackbar} from "notistack";
import {FacebookCircularProgress} from "@features/progressUI";
import {LoadingScreen} from "@features/loadingScreen";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {Doc} from "@features/page";
import {generatedDocs, multiMedias, slugs} from "@lib/constants";
import {downloadFileFromUrl} from "@lib/hooks/downloadFileFromUrl";

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
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [name, setName] = useState(state?.name);
    const [note, setNote] = useState(state?.description ? state?.description : "");
    const [date, setDate] = useState(moment(state?.createdAt, 'DD-MM-YYYY HH:mm').format("DD/MM/YYYY"));
    const [loading, setLoading] = useState(true);
    const [loadingReq, setLoadingReq] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [file, setFile] = useState<any>('');
    const [openRemove, setOpenRemove] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [menu, setMenu] = useState(true);
    const [isImg, setIsImg] = useState(false);
    const componentRef = useRef<any[]>([])
    const previewDocRef = useRef<any>(null)
    const [header, setHeader] = useState(null);
    const [docs, setDocs] = useState([]);
    const [urls, setUrls] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [error, setError] = useState(false);
    const [docPageOffset] = useState(1);
    const [data, setData] = useState<any>({
        background: {show: false, content: ''},
        header: {show: true, page: docPageOffset, x: 0, y: 0},
        footer: {show: false, x: 0, y: 234, content: ''},
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8},
        date: {show: true, prefix: 'Le ', content: '[ 00 / 00 / 0000 ]', x: 0, y: 155, textAlign: "right"},
        patient: {show: true, prefix: 'Nom & prénom: ', content: 'MOHAMED ALI', x: 40, y: 55},
        cin: {show: false, prefix: 'CIN : ', content: '', x: 40, y: 274},
        age: {show: true, content: '', x: 40, y: 316},
        size: 'portraitA4',
        content: {
            show: true,
            maxHeight: 600,
            maxWidth: 130,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 150
        }
    })
    const [sendEmailDrawer, setSendEmailDrawer] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const [onReSize, setOnResize] = useState(true)
    const [editMode, setEditMode] = useState(false);
    const [bg2ePage, setBg2ePage] = useState(true);
    const [downloadMode, setDownloadMode] = useState(false);

    const {direction} = useAppSelector(configSelector);

    const list = [
        {
            title: 'document_type',
            value: t(state?.type),

        },
        {
            title: 'patient',
            value: state?.patient,
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
        name2: t(state?.type),
        data: props,
    }
    const actionButtons: any[] = [
        {
            title: 'print',
            icon: "menu/ic-print",
            disabled: multiMedias.some(media => media === state?.type)
        },
        {
            title: 'email',
            icon: "menu/ic-send-message",
        },
        {
            title: 'settings',
            icon: "docs/ic-note",
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        },
        {
            title: 'download',
            icon: "menu/ic-download-square",
        },
        {
            title: 'edit',
            icon: "ic-edit-patient",
            disabled: (state?.type !== 'prescription' && state?.type !== 'write_certif' && state?.type !== 'requested-analysis' && state?.type !== 'requested-medical-imaging') || !state?.uuid
        },
        {
            title: 'delete',
            icon: "ic-trash",
            disabled: !state?.uuid
        },
        ...(data.isNew ? [{
            title: 'editMode',
            icon: `text-selection`,
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        }] : []),
        ...(data.isNew ? [{
            title: 'bg2ePage',
            icon: `menu/${bg2ePage ? 'ic-eye-closed' : 'ic-open-eye'}`,
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        }] : []),
        ...(!data.isNew ? [{
            title: data.header.show ? 'hide' : 'show',
            icon: `menu/${!data.header.show ? 'ic-open-eye' : 'ic-eye-closed'}`,
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        }] : []),
        ...(!data.isNew ? [{
            title: data.header.page === 0 ? 'hide-header-page.hide' : 'hide-header-page.show',
            icon: `menu/${!data.header.page ? 'ic-open-eye' : 'ic-eye-closed'}`,
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        }] : []),
        {
            title: data.title.show ? 'hidetitle' : 'showtitle',
            icon: `menu/${!data.title.show ? 'ic-open-eye' : 'ic-eye-closed'}`,
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        },
        {
            title: data.patient.show ? 'hidepatient' : 'showpatient',
            icon: `menu/${data.patient.show ? 'ic-cancel-patient' : 'ic-user'}`,
            disabled: multiMedias.some(media => media === state?.type) || !generatedDocs.some(media => media === state?.type)
        }
    ]

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const general_information = (user as UserDataResponse).general_information;

    const {trigger: triggerDocumentUpdate} = useRequestQueryMutation("/documents/update");
    const {trigger: triggerDocumentDelete} = useRequestQueryMutation("/documents/delete");
    const {trigger: triggerEmilSend} = useRequestQueryMutation("/documents/email/send");

    const {data: httpDocumentHeader} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    const handleClose = () => {
        setOpenAlert(false);
    }

    const handleYes = () => {
        const selected: any = docs.find((doc: any) => doc.uuid === selectedTemplate);
        if (selected) {
            setLoading(true);
            setData({
                ...selected.header.data,
                background: {show: selected.header.data.background.show, content: selected.file ? selected.file : ''}
            })
            setOnResize(true)
            setHeader(selected.header.header)
            setUrls(selected.documentsUrl)
            setOpenAlert(false);
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    const handlePrint = () => {
        printNow();
    }

    const printNow = useReactToPrint({
        content: () => previewDocRef.current,
        documentTitle: `${t(state?.type)} ${state?.patient}`,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            setIsPrinting(false);
        }
    })

    const handleActions =  async (action: string) => {
        switch (action) {
            case "print":
                handlePrint();
                break;
            case "email":
                setDownloadMode(true);
                setEditMode(false)
                setSendEmailDrawer(true);
                if (generatedDocs.some(doc => doc == state?.type)) {
                        const file = await generatePdfFromHtml(componentRef, "blob");
                        setDownloadMode(false);
                        setPreviewDoc(file);
                } else {
                    const photoUrlBytes = await fetch(file.url, {
                        // Fix CROSS origin issues with no-cache header
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    }).then((res) => res.arrayBuffer());
                    const photoExtension = getMimeTypeFromArrayBuffer(photoUrlBytes);
                    const fileData = new File([new Blob([photoUrlBytes])], `report${new Date().toISOString()}`, {type: photoExtension?.type})
                    setPreviewDoc(fileData);
                }
                break;
            case "delete":
                setOpenRemove(true)
                break;
            case "edit":
                switch (state?.type) {
                    case "prescription":
                        setOpenDialog(false);
                        dispatch(SetSelectedDialog({
                            action: 'medical_prescription_cycle',
                            state: state?.info.map((drug: any) => ({
                                cycles: drug.cycles,
                                drugUuid: drug.standard_drug?.uuid,
                                name: drug.drugName
                            })),
                            uuid: state?.uuidDoc,
                            appUuid: state?.appUuid
                        }))
                        break;
                    case "requested-analysis":
                        let res: AnalysisModel[] = []
                        state?.info.map((info: any) => {
                            res.push({...info.analysis, note: info.note});
                        });
                        dispatch(SetSelectedDialog({
                            action: 'balance_sheet_request',
                            state: res,
                            uuid: state?.uuidDoc
                        }))
                        break;
                    case "requested-medical-imaging":
                        let mi: MIModel[] = []
                        state?.info.map((info: any) => {
                            mi.push({
                                uuid: info['medical-imaging'].uuid,
                                name: info['medical-imaging'].name,
                                note: info.note
                            });
                        });
                        dispatch(SetSelectedDialog({
                            action: 'medical_imagery',
                            state: mi,
                            uuid: state?.uuidDoc
                        }))
                        break;
                    case "write_certif":
                        setOpenDialog(false);

                        dispatch(SetSelectedDialog({
                            action: 'write_certif',
                            state: state,
                            uuid: state?.certifUuid
                        }))
                        break;
                }
                break;
            case "hide":
            case "show":
                setData({
                    ...data,
                    header: {
                        ...data.header,
                        show: !data.header.show
                    }
                });
                break;
            case "hidetitle":
            case "showtitle":
                data.title.show = !data.title.show
                setData({...data})
                break;
            case "hide-header-page.hide":
            case "hide-header-page.show":
                setData({
                    ...data,
                    header: {
                        ...data.header,
                        page: (data.header.page === 0 ? 1 : 0)
                    }
                });
                break;
            case "hidepatient":
            case "showpatient":
                data.patient.show = !data.patient.show
                setData({...data})
                break;
            case "download":
                if (generatedDocs.some(doc => doc == state?.type)) {
                    setEditMode(false)
                    setDownloadMode(true);
                    await downloadFileAsPdf(componentRef, `${state?.type} ${state?.patient}`, data.isNew, setDownloadMode);
                } else {
                    downloadFileFromUrl(file.url, `${state?.type} ${state?.patient}`);
                }
                break;
            case "settings":
                setOpenAlert(true)
                break;
            case "editMode":
                setEditMode(prev => !prev)
                break;
            case "bg2ePage":
                setBg2ePage(prev => !prev)
                break;
            default:
                break;
        }
    }

    const editDoc = (attribute: string, value: string) => {
        const form = new FormData();
        form.append('attribute', attribute);
        form.append('value', value);
        triggerDocumentUpdate({
            method: "PATCH",
            url:
                `${urlMedicalEntitySuffix}/documents/${state?.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                state?.mutate()
                state?.mutateDetails && state?.mutateDetails()
                //enqueueSnackbar(t("renameWithsuccess"), {variant: 'success'})
            }
        });
    }

    const eventHandler = (ev: any, location: {
        x: any;
        y: any;
    }, from: string) => {
        data[from].x = location.x
        data[from].y = location.y
        setData({...data})
    }

    const dialogSave = (state: any) => {
        setLoading(true);
        setLoadingRequest && setLoadingRequest(true);
        if (state?.type === "quote") {
            medicalEntityHasUser && triggerDocumentDelete({
                    method: "DELETE",
                    url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/quotes/${state?.uuid}/${router.locale}`
                },
                {
                    onSuccess: () => {
                        state?.mutate && state?.mutate();
                        setOpenRemove(false);
                        setLoading(false);
                        setLoadingRequest && setLoadingRequest(false);
                        setOpenDialog && setOpenDialog(false);
                    }
                }
            );
        } else {
            medicalEntityHasUser && triggerDocumentDelete({
                method: "DELETE",
                url: `/api/medical-entity/${documentViewIndex === 0 ? "agendas/appointments" : `${medical_entity.uuid}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}`}/documents/${state?.uuid}/${router.locale}`
            }, {
                onSuccess: () => {
                    state?.mutate && state?.mutate();
                    state?.mutateDetails && state?.mutateDetails()
                    setOpenRemove(false);
                    setLoading(false);
                    (documentViewIndex === 1 && mutatePatientDocuments) && mutatePatientDocuments();
                },
                onSettled: () => {
                    setLoadingRequest && setLoadingRequest(false);
                    setOpenDialog && setOpenDialog(false);
                }
            });
        }
    }

    const doc = ((file instanceof File) || file?.url) && <Document
        {...(componentRef?.current && {ref: (element) => (componentRef.current as any)[0] = element})}
        file={file.url}
        loading={t('wait')}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => {
            setError(true)
        }}>
        {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
        ))}
    </Document>;

    const handleSendEmail = async (data: any) => {
        setLoadingReq(true);
        const form = new FormData();
        form.append('receiver', data.receiver);
        form.append('sender', general_information.email);
        form.append('subject', data.subject);
        form.append('content', data.content);
        if (data.withFile) {
            form.append('files[]', previewDoc);
        }

        triggerEmilSend({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/send-mail/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                setSendEmailDrawer(false);
                enqueueSnackbar(t("sendEmailWithsuccess"), {variant: 'success'});
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    useEffect(() => {
        setIsImg(state?.detectedType?.split('/')[0] === 'image')
        setFile(state?.uri)
    }, [state])

    useEffect(() => {
        if (state?.print && previewDocRef.current) {
            setIsPrinting(true);
            setTimeout(() => handlePrint(), 1000);
        }
    }, [state?.print, previewDocRef.current]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpDocumentHeader) {
            const docInfo = (httpDocumentHeader as HttpResponse).data
            setDocs(docInfo);
            if (docInfo.length === 0) {
                setLoading(false)
            } else {
                setOpenAlert(false);

                if (state.documentHeader) {
                    setSelectedTemplate(state.documentHeader)
                    const _template = docInfo.find((template: {
                        uuid: string;
                    }) => template.uuid === state.documentHeader)
                    if (_template) {
                        setData({
                            ..._template.header.data,
                            header: {
                                ..._template.header.data.header,
                                page: docPageOffset
                            },
                            background: {
                                show: _template.header.data.background.show,
                                content: _template.file ? _template.file : ''
                            }
                        })
                        setHeader(_template.header.header)
                        setUrls(_template.documentsUrl)
                    }
                } else {
                    const templates: any[] = [];
                    const slug = slugs[generatedDocs.findIndex(gd => gd === state?.type)];
                    docInfo.map((di: {
                        types: any[];
                    }) => {
                        if (di.types.find(type => type.slug === slug))
                            templates.push(di)
                    })
                    if (templates.length > 0) {
                        setSelectedTemplate(templates[0].uuid);
                        setData({
                            ...templates[0].header.data,
                            header: {
                                ...templates[0].header.data.header,
                                page: docPageOffset
                            },
                            background: {
                                show: templates[0].header.data.background.show,
                                content: templates[0].file ? templates[0].file : ''
                            }
                        })
                        setHeader(templates[0].header.header)
                        setUrls(templates[0].documentsUrl)
                    } else {
                        const defaultdoc = docInfo.find((di: {
                            isDefault: any;
                        }) => di.isDefault);
                        if (defaultdoc) {
                            setSelectedTemplate(defaultdoc.uuid)
                            setData({
                                ...defaultdoc.header.data,
                                header: {
                                    ...defaultdoc.header.data.header,
                                    page: docPageOffset
                                },
                                background: {
                                    show: defaultdoc.header.data.background.show,
                                    content: defaultdoc.file ? defaultdoc.file : ''
                                }
                            })
                            setHeader(defaultdoc.header.header)
                            setUrls(defaultdoc.documentsUrl)
                        } else {
                            setSelectedTemplate(docInfo[0].uuid)
                            setData({
                                ...docInfo[0].header.data,
                                header: {
                                    ...docInfo[0].header.data.header,
                                    page: docPageOffset
                                },
                                background: {
                                    show: docInfo.header?.data.background.show,
                                    content: docInfo.file ? docInfo.file : ''
                                }
                            })
                            setHeader(docInfo[0].header.header)
                            setUrls(docInfo[0].documentsUrl)
                        }
                    }
                }
                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            }
        }
    }, [httpDocumentHeader, state]) // eslint-disable-line react-hooks/exhaustive-deps

    const generatedDocsNode = generatedDocs.some(doc => doc === state?.type) &&
        <div>
            {loading ? <div className={data.size ? data.size : "portraitA5"}></div> :
                data.isNew ? <Box ref={previewDocRef}>
                    <Doc {...{
                        data,
                        setData,
                        componentRef,
                        header, setHeader,
                        date,
                        onReSize, setOnResize,
                        urlMedicalProfessionalSuffix,
                        docs: urls,t,
                        editMode, bg2ePage, downloadMode,
                        setDocs: setUrls,
                        state: (state?.type === "fees" || state?.type == 'quote') && state?.info.length === 0 ? {
                            ...state,
                            info: [{
                                fees: state?.consultationFees,
                                hiddenData: true,
                                act: {
                                    name: "Consultation",
                                },
                                qte: 1
                            }]
                        } : state
                    }}/>
                </Box> : <PreviewA4
                    {...{
                        previewDocRef,
                        componentRef,
                        eventHandler,
                        data,
                        values: header,
                        state: (state?.type === "fees" || state?.type == 'quote') && state?.info.length === 0 ? {
                            ...state,
                            info: [{
                                fees: state?.consultationFees,
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
            {/* {!loading && <PreviewA4
                {...{
                    previewDocRef,
                    componentRef,
                    eventHandler,
                    data,
                    values: header,
                    state: (state?.type === "fees" || state?.type == 'quote') && state?.info.length === 0 ? {
                        ...state,
                        info: [{
                            fees: state?.consultationFees,
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
                }} />}*/}
        </div>

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <DocumentDetailDialogStyled>
            {loading || isPrinting && <Card className={'loading-card'}>
                <CardContent>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={1.2}>
                        <FacebookCircularProgress size={20}/>
                        <Typography fontSize={16} fontWeight={600}>{t(loading ? 'generate':'printing')}</Typography>
                    </Stack>
                </CardContent>
            </Card>}

            <Grid container>
                <Grid item xs={12} md={menu ? 8 : 11}>
                    <Stack spacing={2}>

                        {!multiMedias.some(multi => multi === state?.type) &&
                            <Box style={{minWidth: '148mm', margin: 'auto'}}>
                                <Box id={"previewID"}>
                                    {generatedDocsNode}
                                    {!generatedDocs.some(doc => doc === state?.type) &&
                                        <Box sx={{
                                            '.react-pdf__Page': {
                                                marginBottom: 1,
                                                '.react-pdf__Page__canvas': {
                                                    mx: 'auto',
                                                }
                                            }
                                        }}>
                                            {!isImg && !error && doc}
                                            {!isImg && error && <Card style={{padding: 10}}>
                                                <Stack alignItems={"center"} spacing={1} justifyContent={"center"}>
                                                    <IconUrl width={100} height={100} path={"ic-corrupted"}/>
                                                    <Typography>{t('ureadbleFile')}</Typography>
                                                    <Typography fontSize={12}
                                                                style={{opacity: 0.5}}>{t('downloadnow')}</Typography>
                                                    <Button
                                                        onClick={() => downloadFileFromUrl(file?.url, `${state?.type} ${state?.patient}`)}
                                                        color={"info"}
                                                        variant="outlined"
                                                        startIcon={<IconUrl path="menu/ic-download-square"
                                                                            width={20}
                                                                            height={20}/>}>
                                                        {t('download')}
                                                    </Button>
                                                </Stack>
                                            </Card>}

                                            {isImg && <TransformWrapper initialScale={1}>
                                                {({zoomIn, zoomOut, resetTransform}) => (
                                                    <React.Fragment>
                                                        <Stack justifyContent={"end"} mr={2}>
                                                            <ToggleButtonGroup className={"zoombar"} size="small"
                                                                               aria-label="Small sizes">
                                                                <ToggleButton onClick={() => zoomIn()} value="left"
                                                                              aria-label="left aligned">
                                                                    <ZoomInIcon/>
                                                                </ToggleButton>
                                                                <ToggleButton onClick={() => zoomOut()} value="left"
                                                                              aria-label="left aligned">
                                                                    <ZoomOutIcon/>
                                                                </ToggleButton>
                                                                <ToggleButton onClick={() => resetTransform()}
                                                                              value="left"
                                                                              aria-label="left aligned">
                                                                    <CenterFocusWeakIcon/>
                                                                </ToggleButton>
                                                            </ToggleButtonGroup>
                                                        </Stack>
                                                        <TransformComponent>
                                                            <Box component={"img"} src={state?.uri.url}
                                                                 sx={{marginLeft: 2, maxWidth: "100%"}}
                                                                 alt={"img"}/>
                                                        </TransformComponent>
                                                    </React.Fragment>
                                                )}</TransformWrapper>
                                            }
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        }
                        {multiMedias.some(multi => multi === state?.type) &&
                            <Box>
                                {state?.type === 'photo' &&
                                    <TransformWrapper initialScale={1}>
                                        {({zoomIn, zoomOut, resetTransform}) => (
                                            <React.Fragment>
                                                <Stack justifyContent={"end"} direction={"row"} mr={2} ml={2}>
                                                    <ToggleButtonGroup className={"zoombar"} size="small"
                                                                       aria-label="Small sizes">
                                                        <ToggleButton onClick={() => zoomIn()} value="left"
                                                                      aria-label="left aligned">
                                                            <ZoomInIcon/>
                                                        </ToggleButton>
                                                        <ToggleButton onClick={() => zoomOut()} value="left"
                                                                      aria-label="left aligned">
                                                            <ZoomOutIcon/>
                                                        </ToggleButton>
                                                        <ToggleButton onClick={() => resetTransform()} value="left"
                                                                      aria-label="left aligned">
                                                            <CenterFocusWeakIcon/>
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Stack>
                                                <TransformComponent>
                                                    <Box component={"img"} src={state?.uri.url}
                                                         sx={{marginLeft: 2, maxWidth: "100%"}}
                                                         alt={"img"}/></TransformComponent>
                                            </React.Fragment>

                                        )}</TransformWrapper>}
                                {state?.type === 'video' && <ReactPlayer url={file.url} controls={true}/>}
                                {state?.type === 'audio' &&
                                    <Box padding={2}><AudioPlayer autoPlay src={file.url}/></Box>}
                            </Box>
                        }
                    </Stack>
                </Grid>
                <Grid item xs={12} md={menu ? 4 : 1} className="sidebar" color={"white"} style={{background: "white"}}>
                    {menu ? <List>
                            {actionButtons.map((button, idx) =>
                                <ListItem key={idx} onClick={() => handleActions(button.title)}>
                                    {!button.disabled && <ListItemButton
                                        className={button.title === "delete" ? "btn-delete" : ""}>
                                        <ListItemIcon>
                                            <IconUrl path={button.icon}/>
                                        </ListItemIcon>
                                        {menu && <ListItemText sx={{ml: 1}} primary={t(button.title)}/>}
                                    </ListItemButton>}
                                </ListItem>)}
                            <ListItem className='secound-list'>
                                <ListItemButton onClick={() => {
                                    setMenu(false)
                                }}>
                                    <ListItemIcon>
                                        <IconUrl path="menu/ic-close-menu"/>
                                    </ListItemIcon>
                                    <ListItemText sx={{ml: 1}} primary={t("close")}/>
                                </ListItemButton>
                            </ListItem>
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
                        </List> :
                        <List>
                            <ListItem
                                onClick={() => {
                                    setMenu(true)
                                }} disablePadding sx={{display: 'block'}}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: 'center',
                                        px: 2.5,
                                    }}>
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            margin: 'auto',
                                            justifyContent: 'center',
                                        }}>
                                        <IconUrl width={24} height={24} path={'menu/ic-open-menu'}/>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>

                            {actionButtons.map((button, idx) =>
                                !button.disabled &&
                                <ListItem key={`${idx}-item`} onClick={() => handleActions(button.title)}
                                          disablePadding sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: 'center',
                                            px: 2.5,
                                        }}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                margin: 'auto',
                                                justifyContent: 'center',
                                            }}>
                                            <IconUrl path={button.icon}/>
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>)
                            }
                        </List>
                    }
                </Grid>
            </Grid>

            <CustomDialog
                {...{direction}}
                action={"remove"}
                open={openRemove}
                data={selected}
                color={(theme: Theme) => theme.palette.error.main}
                title={t('removedoc')}
                actionDialog={
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant={"text-black"} onClick={() => {
                            setOpenRemove(false);
                        }}
                            startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                        <LoadingButton variant="contained"
                                       sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                       onClick={() => dialogSave(state)}>{t('remove')}</LoadingButton>
                    </Stack>
                }
            />

            <Dialog
                open={openAlert}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent>
                    <Typography variant={"h6"} mb={2}>{t('alertTitle')}</Typography>
                    {docs.map((doc: any) => (<FormControlLabel
                        key={doc.uuid}
                        control={
                            <Checkbox checked={selectedTemplate === doc.uuid}
                                      onChange={() => {
                                          //PATCH
                                          editDoc("header", doc.uuid)
                                          setSelectedTemplate(doc.uuid)
                                      }} name={doc.uuid}/>
                        }
                        label={doc.title}
                    />))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('notNow')}</Button>
                    <Button onClick={handleYes} autoFocus>
                        {t('now')}
                    </Button>
                </DialogActions>
            </Dialog>

            <CustomDialog
                action={"send-email"}
                open={sendEmailDrawer}
                data={{
                    patient,
                    preview: previewDoc,
                    loading: loadingReq,
                    title: state?.title ?? "", t,
                    handleSendEmail
                }}
                onClose={() => setSendEmailDrawer(false)}
                aria-labelledby="email-dialog-title"
                aria-describedby="email-dialog-description"
                title={t("email")}
            />
        </DocumentDetailDialogStyled>
    )
}

export default DocumentDetailDialog
