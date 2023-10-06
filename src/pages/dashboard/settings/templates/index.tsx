import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {
    Box,
    Button,
    DialogActions,
    Drawer,
    IconButton,
    LinearProgress,
    Stack, Tab, Tabs,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import dynamic from "next/dynamic";
import TemplateStyled from "@features/pfTemplateDetail/components/overrides/templateStyled";
import {RootStyled, SetSelectedDialog} from "@features/toolbar";
import AddIcon from "@mui/icons-material/Add";
import {SubHeader} from "@features/subHeader";
import PreviewA4 from "@features/files/components/previewA4";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {a11yProps, capitalizeFirst, useMedicalProfessionalSuffix} from "@lib/hooks";
import CloseIcon from "@mui/icons-material/Close";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {CertifModelDrawer} from "@features/CertifModelDrawer";
import IconUrl from "@themes/urlIcon";
import {useSnackbar} from "notistack";
import {Dialog, handleDrawerAction} from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Theme} from "@mui/material/styles";
import {SwitchPrescriptionUI} from "@features/buttons";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {TabPanel} from "@features/tabPanel";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function TemplatesConfig() {
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});
    const {t: tConsultation} = useTranslation("consultation");
    const {direction} = useAppSelector(configSelector);

    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<DocTemplateModel[]>([]);
    const [isDefault, setIsDefault] = useState<DocTemplateModel | null>(null);
    const [isHovering, setIsHovering] = useState("");
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any>(null);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>([]);
    const [action, setAction] = useState("");
    const [info, setInfo] = useState<null | string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [state, setState] = useState<any[]>([]);
    const [model, setModel] = useState<any>(null);
    const [prescriptionTabIndex, setPrescriptionTabIndex] = useState(0);
    const [certificateTabIndex, setCertificateTabIndex] = useState(0);

    const {trigger: triggerModelDelete} = useRequestQueryMutation("/settings/certifModel/delete");
    const {trigger: triggerEditPrescriptionModel} = useRequestQueryMutation("/consultation/prescription/model/edit");

    const {data: httpDocumentHeader} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`
    } : null);

    const {
        data: httpModelResponse,
        isLoading: isCertificateModelLoading,
        mutate: mutateCertif
    } = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`
    } : null);

    const {
        data: httpParentModelResponse,
        isLoading: isParentModelLoading
    } = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modal-folders/${router.locale}`
    } : null);

    const {
        data: httpPrescriptionResponse,
        isLoading: isPrescriptionLoading,
        mutate: mutatePrescription
    } = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`
    } : null);

    const {data: httpAnalysesResponse, mutate: mutateAnalyses} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${router.locale}`
    } : null);

    const closeDraw = () => {
        setOpen(false);
    };
    const handleMouseOver = (id: string | undefined) => {
        setIsHovering(id ? id : "");
    };
    const handleMouseOut = () => {
        setIsHovering("");
    };
    const edit = (id: string | undefined) => {
        router.push(`/dashboard/settings/templates/${id}`);
    }
    const editDoc = (res: CertifModel) => {
        setOpen(true)
        setData(res);
        setAction("editDoc")
    }

    const removeDoc = (res: CertifModel) => {
        const isFoldedCertificate = certificateModel.findIndex(certificate => certificate.uuid === res.uuid) === -1;
        triggerModelDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/${isFoldedCertificate ? "certificate-modal-folders/" : "certificate-modals/"}/${res.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                mutateCertif().then(() => {
                    enqueueSnackbar(t("removed"), {variant: "error"});
                });
            }
        });
    }

    const removePrescription = (uuid: string) => {
        triggerModelDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                mutatePrescription().then(() => {
                    enqueueSnackbar(t("removed"), {variant: "error"});
                });
            }
        })
    }

    const removeAnalyses = (uuid: string) => {
        triggerModelDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                mutateAnalyses().then(() => {
                    enqueueSnackbar(t("removed"), {variant: "error"});
                });
            }
        })
    }

    const handleSwitchUI = () => {
        setOpenDialog(false);
        setInfo(null);
        setInfo(getPrescriptionUI());
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        if (info === 'balance_sheet_request') {
            mutateAnalyses()
        }
        setOpenDialog(false);
        setInfo(null);
        dispatch(SetSelectedDialog(null))
    }

    const editPrescriptionModel = () => {
        const form = new FormData();
        form.append("drugs", JSON.stringify(state));
        form.append("name", model?.name);
        form.append("parent", model?.parent);
        triggerEditPrescriptionModel({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${model?.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutatePrescription().then(() => {
                    enqueueSnackbar(t("updated"), {variant: "success"});
                    setOpenDialog(false);
                    setTimeout(() => setInfo(null));
                    dispatch(SetSelectedDialog(null))
                });
            }
        });
    }

    useEffect(() => {
        if (httpDocumentHeader) {
            const dcs = (httpDocumentHeader as HttpResponse).data;
            dcs.forEach((dc: DocTemplateModel) => {
                if (dc.isDefault) setIsDefault(dc);
                if (dc.file) {
                    dc.header.data.background.content = dc.file
                }
            });
            (isDefault === null && dcs.length > 0) && setIsDefault(dcs[0]);
            setDocs(dcs)
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [httpDocumentHeader]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const res: any[] = [];
        if (httpAnalysesResponse) {
            const analysis = (httpAnalysesResponse as HttpResponse)?.data as AnalysisModelModel[]
            analysis.forEach(r => {
                const info = r.analyses.map((ra) => ({analysis: ra, note: ''}))
                res.push({uuid: r.uuid, name: r.name, info})
            });
            setAnalysis(res);
        }
    }, [httpAnalysesResponse])

    const prescriptionFolders = ((httpPrescriptionResponse as HttpResponse)?.data ?? []) as PrescriptionParentModel[];
    const certificateModel = ((httpModelResponse as HttpResponse)?.data ?? []) as CertifModel[];
    const certificateFolderModel = ((httpParentModelResponse as HttpResponse)?.data ?? []) as any[];

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
            </SubHeader>
            <LinearProgress
                sx={{visibility: loading ? "visible" : "hidden"}}
                color="warning"
            />

            {!loading && <Box bgcolor={"#eff2f9"} mt={-1} pt={2} pl={2}>
                <Typography
                    textTransform="uppercase"
                    fontWeight={600}>
                    {t("layout")}
                </Typography>
            </Box>}
            <Box
                bgcolor={'#eff2f9'}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <TemplateStyled>
                    <div className={"portraitA4"} onClick={() => {
                        router.push(`/dashboard/settings/templates/new`);
                    }} style={{
                        marginTop: 25,
                        marginRight: 30,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                    </div>
                    {docs.map(res => (
                        <Box key={res.uuid} className={"container"}>
                            <div onMouseOver={() => {
                                handleMouseOver(res.uuid)
                            }}
                                 onMouseOut={handleMouseOut}>
                                <PreviewA4  {...{
                                    eventHandler: null,
                                    nbPage: 1,
                                    data: res.header.data,
                                    values: res.header.header,
                                    state: null,
                                    loading
                                }} />
                            </div>
                            {isHovering === res.uuid &&
                                <Stack className={"edit-btn"} direction={"row"} onMouseOver={() => {
                                    handleMouseOver(res.uuid)
                                }}>
                                    <IconButton size="small" onClick={() => {
                                        edit(res.uuid)
                                    }}>
                                        <IconUrl path="setting/edit"/>
                                    </IconButton>
                                </Stack>
                            }
                            {isHovering === res.uuid &&
                                <Stack direction={"row"} onMouseOver={() => {
                                    handleMouseOver(res.uuid)
                                }} justifyContent={"space-between"}
                                       style={{position: "absolute", bottom: 10, width: "85%", left: 10}}
                                       alignItems={"center"}>
                                    <Typography className={"doc-title"}>{res.title}</Typography>
                                    <div className={"heading"}>
                                        {res.header.data.size === 'portraitA4' ? 'A4' : 'A5'}
                                    </div>
                                </Stack>}
                        </Box>
                    ))}
                </TemplateStyled>
            </Box>

            <Typography
                textTransform="uppercase"
                mt={2}
                marginLeft={2}
                fontWeight={600}>
                {t("document")}
            </Typography>

            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: "0 16px 16px 16px"}}}>

                <Box sx={{borderBottom: 1, mb: 1, borderColor: "divider"}}>
                    <Tabs
                        value={certificateTabIndex}
                        onChange={(event, value) => setCertificateTabIndex(value)}
                        aria-label="balance sheet tabs">
                        <Tab
                            icon={<DescriptionRoundedIcon/>}
                            iconPosition="start"
                            disableFocusRipple
                            disableRipple
                            label={t("unfolded")}
                            {...a11yProps(0)}/>
                        {certificateFolderModel.map(folder => <Tab
                            key={folder.uuid}
                            icon={<FolderRoundedIcon/>}
                            iconPosition="start"
                            disableFocusRipple
                            disableRipple
                            label={capitalizeFirst(folder.name)}
                            {...a11yProps(0)}/>)}
                    </Tabs>
                </Box>

                <TabPanel
                    padding={.1}
                    index={0}
                    value={certificateTabIndex}>
                    <TemplateStyled>
                        <div className={"portraitA4"} onClick={() => {
                            setOpen(true)
                            setData(null);
                            setAction("editDoc")
                        }} style={{
                            marginTop: 25,
                            marginRight: 30,
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                        </div>

                        {isDefault && !isCertificateModelLoading && certificateModel.map(res => (
                            <Box key={res.uuid} className={"container"}>
                                <div
                                    onMouseOver={() => {
                                        handleMouseOver(res.uuid)
                                    }}
                                    onMouseOut={handleMouseOut}>
                                    <PreviewA4  {...{
                                        eventHandler: null,
                                        data: isDefault?.header.data,
                                        values: isDefault?.header.header,
                                        nbPage: 1,
                                        state: {
                                            content: res.content,
                                            description: "",
                                            doctor: "",
                                            name: "certif",
                                            patient: "Patient",
                                            title: res.title,
                                            type: "write_certif"
                                        },
                                        loading
                                    }} />
                                </div>
                                {isHovering === res.uuid &&
                                    <Stack className={"edit-btn"} direction={"row"} onMouseOver={() => {
                                        handleMouseOver(res.uuid)
                                    }}>
                                        <IconButton size="small" onClick={() => {
                                            setData(res);
                                            setAction("showDoc");
                                            setOpen(true);
                                        }}>
                                            <IconUrl path="setting/ic-voir"/>
                                        </IconButton>
                                        <IconButton size="small" onClick={() => {
                                            editDoc(res)
                                        }}>
                                            <IconUrl path="setting/edit"/>
                                        </IconButton>
                                        <IconButton size="small" onClick={() => {
                                            removeDoc(res);
                                        }}>
                                            <IconUrl path="setting/icdelete"/>
                                        </IconButton>
                                    </Stack>
                                }
                                {isHovering === res.uuid && <Stack direction={"row"}
                                                                   onMouseOver={() => {
                                                                       handleMouseOver(res.uuid)
                                                                   }}
                                                                   className={"title-content"}>
                                    <Typography className={"title"}>{res.title}</Typography>
                                    <div className={"color-content"} style={{background: res.color}}></div>
                                </Stack>}
                            </Box>
                        ))}
                    </TemplateStyled>
                </TabPanel>

                {!isParentModelLoading && certificateFolderModel.map((certificate, index: number) =>
                    <TabPanel
                        padding={.1}
                        key={certificate.uuid}
                        index={index + 1}
                        value={certificateTabIndex}>
                        <TemplateStyled>
                            <div className={"portraitA4"} onClick={() => {
                                setOpen(true)
                                setData({folder: certificate.uuid});
                                setAction("editDoc")
                            }} style={{
                                marginTop: 25,
                                marginRight: 30,
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center"
                            }}>
                                <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                            </div>
                            {isDefault && certificate.files.map((res: any) => (
                                <Box key={res.uuid} className={"container"}>
                                    <div onMouseOver={() => {
                                        handleMouseOver(res.uuid)
                                    }}
                                         onMouseOut={handleMouseOut}>
                                        <PreviewA4  {...{
                                            eventHandler: null,
                                            data: isDefault?.header.data,
                                            values: isDefault?.header.header,
                                            nbPage: 1,
                                            state: {
                                                content: res.content,
                                                description: "",
                                                doctor: "",
                                                name: "certif",
                                                patient: "Patient",
                                                title: res.title,
                                                type: "write_certif"
                                            },
                                            loading
                                        }} />
                                    </div>
                                    {isHovering === res.uuid &&
                                        <Stack className={"edit-btn"} direction={"row"} onMouseOver={() => {
                                            handleMouseOver(res.uuid)
                                        }}>
                                            <IconButton size="small" onClick={() => {
                                                setData(res);
                                                setAction("showDoc");
                                                setOpen(true);
                                            }}>
                                                <IconUrl path="setting/ic-voir"/>
                                            </IconButton>
                                            <IconButton size="small" onClick={() => {
                                                editDoc({...res, folder: certificate.uuid})
                                            }}>
                                                <IconUrl path="setting/edit"/>
                                            </IconButton>
                                            <IconButton size="small" onClick={() => {
                                                removeDoc(res);
                                            }}>
                                                <IconUrl path="setting/icdelete"/>
                                            </IconButton>
                                        </Stack>
                                    }
                                    {isHovering === res.uuid && <Stack direction={"row"}
                                                                       onMouseOver={() => {
                                                                           handleMouseOver(res.uuid)
                                                                       }}
                                                                       className={"title-content"}>
                                        <Typography className={"title"}>{res.title}</Typography>
                                        <div className={"color-content"} style={{background: res.color}}></div>
                                    </Stack>}
                                </Box>
                            ))}
                        </TemplateStyled>
                    </TabPanel>)}
            </Box>

            <Typography
                textTransform="uppercase"
                ml={2}
                fontWeight={600}>
                {t("prescription")}
            </Typography>

            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: "0 16px 16px 16px"}}}>
                <Box sx={{borderBottom: 1, mb: 1, borderColor: "divider"}}>
                    <Tabs
                        value={prescriptionTabIndex}
                        onChange={(event, value) => setPrescriptionTabIndex(value)}
                        aria-label="balance sheet tabs">
                        {prescriptionFolders.map(folder => <Tab
                            key={folder.uuid}
                            icon={<FolderRoundedIcon/>}
                            iconPosition="start"
                            disableFocusRipple
                            disableRipple
                            label={capitalizeFirst(folder.name)}
                            {...a11yProps(0)}/>)}
                    </Tabs>
                </Box>
                {prescriptionFolders.map((folder, index: number) => <TabPanel
                    padding={.1}
                    key={index}
                    value={prescriptionTabIndex} {...{index}}>
                    <TemplateStyled>
                        <div className={"portraitA4"} onClick={() => {
                            setInfo(getPrescriptionUI());
                            setModel(null);
                            setOpenDialog(true);
                        }} style={{
                            marginTop: 25,
                            marginRight: 30,
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                        </div>

                        {isDefault && !isPrescriptionLoading && folder.prescriptionModels.map((card: any) => (
                            <Box key={card.uuid} className={"container"}>
                                <div
                                    onMouseOver={() => {
                                        handleMouseOver(card.uuid)
                                    }}
                                    onMouseOut={handleMouseOut}>
                                    <PreviewA4  {...{
                                        eventHandler: null,
                                        data: isDefault?.header.data,
                                        values: isDefault?.header.header,
                                        nbPage: 1,
                                        t,
                                        state: {
                                            info: card.prescriptionModalHasDrugs.map((pmhd: any) =>
                                                ({
                                                    ...pmhd,
                                                    standard_drug: {commercial_name: pmhd.name, uuid: pmhd.drugUuid}
                                                })),
                                            description: "",
                                            doctor: "",
                                            name: "prescription",
                                            patient: "Patient",
                                            title: card.name,
                                            type: "prescription"
                                        },
                                        loading
                                    }} />
                                </div>

                                {isHovering === card.uuid &&
                                    <Stack className={"edit-btn"} direction={"row"} onMouseOver={() => {
                                        handleMouseOver(card.uuid)
                                    }}>
                                        <IconButton size="small" onClick={() => {
                                            const prescriptionModalHasDrugs = card.prescriptionModalHasDrugs.map((pmhd: any) =>
                                                ({
                                                    ...pmhd,
                                                    standard_drug: {commercial_name: pmhd.name, uuid: pmhd.drugUuid}
                                                }))
                                            setData({
                                                uuid: card.uuid,
                                                name: card.name,
                                                parent: prescriptionFolders[prescriptionTabIndex].uuid,
                                                prescriptionModalHasDrugs
                                            });
                                            setAction("showPrescription");
                                            setOpen(true);
                                        }}>
                                            <IconUrl path="setting/ic-voir"/>
                                        </IconButton>

                                        <IconButton size="small" onClick={() => {
                                            const prescriptionModalHasDrugs = card.prescriptionModalHasDrugs.map((pmhd: any) =>
                                                ({
                                                    ...pmhd,
                                                    standard_drug: {commercial_name: pmhd.name, uuid: pmhd.drugUuid}
                                                }))
                                            setModel({
                                                uuid: card.uuid,
                                                name: card.name,
                                                parent: prescriptionFolders[prescriptionTabIndex].uuid,
                                                prescriptionModalHasDrugs
                                            })
                                            setState(prescriptionModalHasDrugs);
                                            setInfo(getPrescriptionUI());
                                            setOpenDialog(true);
                                        }}>
                                            <IconUrl path="setting/edit"/>
                                        </IconButton>

                                        <IconButton size="small" onClick={() => {
                                            removePrescription(card.uuid);
                                        }}>
                                            <IconUrl path="setting/icdelete"/>
                                        </IconButton>
                                    </Stack>
                                }

                                {isHovering === card.uuid && <Stack direction={"row"}
                                                                    onMouseOver={() => {
                                                                        handleMouseOver(card.uuid)
                                                                    }}
                                                                    className={"title-content"}>
                                    <Typography className={"title"}>{card.name}</Typography>
                                </Stack>}
                            </Box>
                        ))}
                    </TemplateStyled>
                </TabPanel>)}
            </Box>

            <Typography
                textTransform="uppercase"
                ml={2}
                fontWeight={600}>
                {t("analyses")}
            </Typography>

            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <TemplateStyled>
                    <div className={"portraitA4"} onClick={() => {
                        setInfo('balance_sheet_request');
                        setOpenDialog(true);
                    }} style={{
                        marginTop: 25,
                        marginRight: 30,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                    </div>

                    {isDefault && !loading && analysis.map((card: any) => (
                        <Box key={card.uuid} className={"container"}>
                            <div onMouseOver={() => {
                                handleMouseOver(card.uuid)
                            }}
                                 onMouseOut={handleMouseOut}>
                                <PreviewA4  {...{
                                    eventHandler: null,
                                    data: isDefault?.header.data,
                                    values: isDefault?.header.header,
                                    nbPage: 1,
                                    t,
                                    state: {
                                        info: card.info,
                                        description: "",
                                        doctor: "",
                                        name: "requested-analysis",
                                        patient: "Patient",
                                        title: card.name,
                                        type: "requested-analysis"
                                    },
                                    loading
                                }} />
                            </div>

                            {isHovering === card.uuid &&
                                <Stack className={"edit-btn"} direction={"row"} onMouseOver={() => {
                                    handleMouseOver(card.uuid)
                                }}>
                                    <IconButton size="small" onClick={() => {
                                        setOpen(true)
                                        setData(card);
                                        setAction("showAnalyses")
                                    }}>
                                        <IconUrl path="setting/ic-voir"/>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => {

                                        let analysis: AnalysisModel[] = [];
                                        card.info.map((info: { analysis: AnalysisModel; }) => {
                                            analysis.push(info.analysis)
                                        })
                                        setState(analysis);
                                        setModel(card)
                                        setInfo('balance_sheet_request');
                                        setOpenDialog(true);
                                    }}>
                                        <IconUrl path="setting/edit"/>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => {
                                        removeAnalyses(card.uuid);
                                    }}>
                                        <IconUrl path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                            }
                            {isHovering === card.uuid && <Stack direction={"row"}
                                                                onMouseOver={() => {
                                                                    handleMouseOver(card.uuid)
                                                                }}
                                                                className={"title-content"}>
                                <Typography className={"title"}>{card.name}</Typography>
                            </Stack>}
                        </Box>
                    ))
                    }
                </TemplateStyled>
            </Box>

            <Drawer
                anchor={"right"}
                open={open}
                dir={direction}
                onClose={closeDraw}>

                <Toolbar sx={{bgcolor: theme.palette.common.white}}>
                    <Stack alignItems="flex-end" width={1}>
                        <IconButton onClick={closeDraw} disableRipple>
                            <CloseIcon/>
                        </IconButton>
                    </Stack>
                </Toolbar>

                {(action === 'editDoc' || action === 'showDoc') && <CertifModelDrawer {...{
                    isDefault,
                    action,
                    certificateFolderModel,
                    closeDraw,
                    data,
                    mutate: mutateCertif
                }}/>}

                {action === 'showPrescription' &&
                    <Box padding={2}>
                        <PreviewA4  {...{
                            eventHandler: null,
                            data: isDefault?.header.data,
                            values: isDefault?.header.header,
                            nbPage: 1,
                            t,
                            state: {
                                info: data?.prescriptionModalHasDrugs,
                                description: "",
                                doctor: "",
                                name: "prescription",
                                patient: "Patient",
                                title: data?.name,
                                type: "prescription"
                            },
                            loading
                        }} />
                    </Box>
                }

                {
                    action === 'showAnalyses' &&
                    <Box padding={2}>
                        <PreviewA4  {...{
                            eventHandler: null,
                            data: isDefault?.header.data,
                            values: isDefault?.header.header,
                            nbPage: 1,
                            t,
                            state: {
                                info: data.info,
                                description: "",
                                doctor: "",
                                name: "requested-analysis",
                                patient: "Patient",
                                title: data.name,
                                type: "requested-analysis"
                            },
                            loading
                        }} />
                    </Box>
                }
            </Drawer>


            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{state, setState, t: tConsultation, setOpenDialog, model}}
                    size={["medical_prescription", "medical_prescription_cycle"].includes(info) ? "xl" : "lg"}
                    direction={"ltr"}
                    sx={{height: 400}}
                    title={tConsultation(info)}
                    dialogClose={handleCloseDialog}
                    {...(["medical_prescription", "medical_prescription_cycle"].includes(info) && {
                        headerDialog: (<DialogTitle
                                sx={{
                                    backgroundColor: (theme: Theme) => theme.palette.primary.main,
                                    position: "relative",
                                }}
                                id="scroll-dialog-title">
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    {tConsultation(`consultationIP.${info}`)}
                                    <SwitchPrescriptionUI {...{
                                        t: tConsultation,
                                        keyPrefix: 'consultationIP',
                                        handleSwitchUI
                                    }} />
                                </Stack>
                            </DialogTitle>
                        )
                    })}
                    actionDialog={
                        <DialogActions sx={{width: "100%"}}>
                            <Stack sx={{width: "100%"}}
                                   direction={"row"}
                                   justifyContent={info === "medical_prescription_cycle" ? "space-between" : "flex-end"}>
                                {info === "medical_prescription_cycle" &&
                                    <Button startIcon={<AddIcon/>} onClick={() => {
                                        dispatch(handleDrawerAction("addDrug"));
                                    }}>
                                        {tConsultation("consultationIP.add_drug")}
                                    </Button>}
                                <Stack direction={"row"} spacing={1.2}>
                                    <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                        {t("close")}
                                    </Button>
                                    {info === getPrescriptionUI() && model && <Button onClick={() => {
                                        editPrescriptionModel()
                                    }} startIcon={<SaveRoundedIcon/>}>
                                        {t("save")}
                                    </Button>}
                                </Stack>
                            </Stack>
                        </DialogActions>
                    }
                />
            )}
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "consultation",
            "settings",
        ])),
    },
});
export default TemplatesConfig;

TemplatesConfig.auth = true;

TemplatesConfig.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
