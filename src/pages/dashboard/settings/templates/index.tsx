import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {
    Box,
    Button,
    Card,
    CardContent,
    DialogActions,
    Divider,
    Drawer,
    IconButton,
    LinearProgress,
    Stack,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import dynamic from "next/dynamic";
import TemplateStyled from "@features/pfTemplateDetail/components/overrides/templateStyled";
import {AddButton} from "@features/pfTemplateDetail";
import {RootStyled, SetSelectedDialog} from "@features/toolbar";
import AddIcon from "@mui/icons-material/Add";
import {SubHeader} from "@features/subHeader";
import PreviewA4 from "@features/files/components/previewA4";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {a11yProps, capitalizeFirst, useMedicalProfessionalSuffix,} from "@lib/hooks";
import CloseIcon from "@mui/icons-material/Close";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {CertifModelDrawer} from "@features/drawer";
import IconUrl from "@themes/urlIcon";
import {useSnackbar} from "notistack";
import {Dialog, handleDrawerAction} from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Theme} from "@mui/material/styles";
import {SwitchPrescriptionUI} from "@features/buttons";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {TabPanel} from "@features/tabPanel";
import {startCase} from 'lodash';
import {Page} from "@features/page";
import Can from "@features/casl/can";

const LoadingScreen = dynamic(() => import("@features/loadingScreen/components/loadingScreen"));

function TemplatesConfig() {
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(["settings", "common"], {
        keyPrefix: "documents.config",
    });
    const {t: tConsultation} = useTranslation("consultation");
    const {direction} = useAppSelector(configSelector);

    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<DocTemplateModel[]>([]);
    const [isDefault, setIsDefault] = useState<DocTemplateModel | null>(null);
    const [isHovering, setIsHovering] = useState("");
    const [open, setOpen] = useState(false);
    const [editDoc, setEditDoc] = useState(false);
    const [data, setData] = useState<any>(null);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>([]);
    const [action, setAction] = useState("");
    const [info, setInfo] = useState<null | string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [state, setState] = useState<any[]>([]);
    const [model, setModel] = useState<any>(null);
    const [prescriptionTabIndex, setPrescriptionTabIndex] = useState(0);
    const [certificateTabIndex, setCertificateTabIndex] = useState(0);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const {trigger: triggerModelDelete} = useRequestQueryMutation(
        "/settings/certifModel/delete"
    );
    const {trigger: triggerEditPrescriptionModel} = useRequestQueryMutation(
        "/consultation/prescription/model/edit"
    );

    const {data: httpDocumentHeader} = useRequestQuery(
        urlMedicalProfessionalSuffix
            ? {
                method: "GET",
                url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`,
            }
            : null
    );

    const {data: httpModelResponse, mutate: mutateCertificate} =
        useRequestQuery(
            urlMedicalProfessionalSuffix
                ? {
                    method: "GET",
                    url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
                }
                : null
        );

    const {data: httpParentModelResponse, mutate: mutateParentModel} =
        useRequestQuery(
            urlMedicalProfessionalSuffix
                ? {
                    method: "GET",
                    url: `${urlMedicalProfessionalSuffix}/certificate-modal-folders/${router.locale}`,
                }
                : null
        );

    const {data: httpPrescriptionResponse, mutate: mutatePrescription} =
        useRequestQuery(
            urlMedicalProfessionalSuffix
                ? {
                    method: "GET",
                    url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`,
                }
                : null
        );

    const {data: httpAnalysesResponse, mutate: mutateAnalyses} =
        useRequestQuery(
            urlMedicalProfessionalSuffix
                ? {
                    method: "GET",
                    url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${router.locale}`,
                }
                : null
        );

    const closeDraw = () => {
        setOpen(false);
        setEditDoc(false);
    };
    const handleMouseOver = (id: string | undefined) => {
        setIsHovering(id ? id : "");
    };
    const handleMouseOut = () => {
        setIsHovering("");
    };
    const edit = (res: any) => {
        router.push(res.header.data.isNew ?`/dashboard/settings/templates/new/${res.uuid}` :`/dashboard/settings/templates/${res.uuid}`);
    };

    const handleEditDoc = (res: CertifModel) => {
        setEditDoc(true);
        setData(res);
        setAction("editDoc");
        setTimeout(() => setOpen(true));
    }

    const removeDoc = (res: CertifModel) => {
        triggerModelDelete(
            {
                method: "DELETE",
                url: `${urlMedicalProfessionalSuffix}/certificate-modals/${res.uuid}/${router.locale}`,
            },
            {
                onSuccess: () =>
                    (certificateTabIndex === 0
                            ? mutateCertificate()
                            : mutateParentModel()
                    ).then(() => enqueueSnackbar(t("removed"), {variant: "success"})),
            }
        );
    };

    const removePrescription = (uuid: string) => {
        triggerModelDelete(
            {
                method: "DELETE",
                url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${uuid}/${router.locale}`,
            },
            {
                onSuccess: () => {
                    mutatePrescription().then(() => {
                        enqueueSnackbar(t("removed"), {variant: "error"});
                    });
                },
            }
        );
    };

    const removeAnalyses = (uuid: string) => {
        triggerModelDelete(
            {
                method: "DELETE",
                url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${uuid}/${router.locale}`,
            },
            {
                onSuccess: () => {
                    mutateAnalyses().then(() => {
                        enqueueSnackbar(t("removed"), {variant: "error"});
                    });
                },
            }
        );
    };

    const handleSwitchUI = () => {
        setOpenDialog(false);
        setInfo(null);
        setInfo(getPrescriptionUI());
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        if (info === "balance_sheet_request") {
            mutateAnalyses();
        }
        setOpenDialog(false);
        setInfo(null);
        dispatch(SetSelectedDialog(null));
    };

    const editPrescriptionModel = () => {
        const form = new FormData();
        form.append("drugs", JSON.stringify(state));
        form.append("name", model?.name);
        form.append("parent", model?.parent);
        triggerEditPrescriptionModel(
            {
                method: "PUT",
                url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${model?.uuid}/${router.locale}`,
                data: form,
            },
            {
                onSuccess: () => {
                    mutatePrescription().then(() => {
                        enqueueSnackbar(t("updated"), {variant: "success"});
                        setOpenDialog(false);
                        setTimeout(() => setInfo(null));
                        dispatch(SetSelectedDialog(null));
                    });
                },
            }
        );
    };

    useEffect(() => {
        if (httpDocumentHeader) {
            const dcs = (httpDocumentHeader as HttpResponse).data;
            dcs.forEach((dc: DocTemplateModel) => {
                if (dc.isDefault) setIsDefault(dc);
                if (dc.file) {
                    dc.header.data.background.content = dc.file;
                }
            });
            isDefault === null && dcs.length > 0 && setIsDefault(dcs[0]);
            setDocs(dcs);
            setTimeout(() => {
                setLoading(false);
            }, 2500);
        }
    }, [httpDocumentHeader]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const res: any[] = [];
        if (httpAnalysesResponse) {
            const analysis = (httpAnalysesResponse as HttpResponse)
                ?.data as AnalysisModelModel[];
            analysis.forEach((r) => {
                const info = r.analyses.map((ra) => ({analysis: ra, note: ""}));
                res.push({uuid: r.uuid, name: r.name, info});
            });
            setAnalysis(res);
        }
    }, [httpAnalysesResponse]);

    const prescriptionFolders = ((httpPrescriptionResponse as HttpResponse)
        ?.data ?? []) as PrescriptionParentModel[];
    const certificateModel = ((httpModelResponse as HttpResponse)?.data ??
        []) as CertifModel[];
    const certificateFolderModel = ((httpParentModelResponse as HttpResponse)
        ?.data ?? []) as any[];
    const onClickEventCertificate = (prop: any) => {
        switch (prop) {
            case "unfolded":
                setEditDoc(false);
                setData(null);
                setAction("editDoc");
                setTimeout(() => setOpen(true));
                break;
            default:
                setData({folder: prop.uuid});
                setAction("editDoc");
                setTimeout(() => setOpen(true));
                break;
        }
    }
    const onClickEventPrescription = () => {
        setInfo(getPrescriptionUI());
        setModel(null);
        setOpenDialog(true);
    }
    if (!ready) return <LoadingScreen button text={"loading-error"}/>;

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

            <Can I={"manage"} a={"settings"} field={"settings__templates__layout__show"}>
                <Box
                    bgcolor={(theme) => theme.palette.background.default}
                    sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                    <TemplateStyled>
                        {!loading && (
                            <Box p={2}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Typography textTransform="uppercase" fontWeight={600}>
                                        {t("layout")}
                                    </Typography>
                                    <Can I={"manage"} a={"settings"} field={"settings__templates__layout__create"}>
                                        <Button
                                            onClick={() => {
                                                router.push(`/dashboard/settings/templates/new`);
                                            }}
                                            variant="contained"
                                            startIcon={<IconUrl path={"ic-doc-add"}/>}>
                                            {t("btnAdd")}
                                        </Button>
                                    </Can>
                                </Stack>
                                <Divider sx={{mt: 2}}/>
                            </Box>
                        )}

                        <CardContent>
                            <Can I={"manage"} a={"settings"} field={"settings__templates__layout__create"}>
                                <Stack spacing={2} className="add-doc-wrapper">
                                    <div
                                        className={"portraitA4"}
                                        onClick={() => {
                                            router.push(`/dashboard/settings/templates/new`);
                                        }}
                                        style={{
                                            width: "100%",
                                            border: `1px dashed ${theme.palette.primary.main}`,
                                            height: "100%",
                                            transform: "scale(1)",
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 25,
                                        }}>
                                        <Card
                                            sx={{
                                                alignItems: "center",
                                                display: "flex",
                                                justifyContent: "center",
                                                height: "100%",
                                                border: "none",
                                                transform: {xs: "scale(1)", md: "scale(.8)"},
                                            }}
                                        />
                                    </div>
                                    <Typography
                                        className={"empty-preview"}
                                        variant="caption" fontSize={10}>
                                        {startCase(t("blankDoc"))}
                                    </Typography>
                                </Stack>
                            </Can>
                            {docs.map((res) => (
                                <Stack key={res.uuid} spacing={2}>
                                    <Box className={"container"}>
                                        <div
                                            onMouseOver={() => {
                                                handleMouseOver(res.uuid);
                                            }}
                                            onMouseOut={handleMouseOut}>
                                            {res.header.data.isNew ?
                                                <Box>
                                                    <Page  {...{
                                                        data: res.header.data,
                                                        setData,
                                                        state: null,
                                                        header: res.header.header,
                                                        setHeader: null,
                                                        onReSize: null,
                                                        setOnResize: null
                                                    }}/></Box>
                                                : <PreviewA4
                                                    {...{
                                                        eventHandler: null,
                                                        nbPage: 1,
                                                        data: res.header.data,
                                                        values: res.header.header,
                                                        state: null,
                                                        loading,
                                                    }}
                                                />}
                                        </div>
                                        <Can I={"manage"} a={"settings"} field={"settings__templates__layout__update"}>
                                            {isHovering === res.uuid && (
                                                <Stack
                                                    className={"edit-btn"}
                                                    justifyContent="center"
                                                    direction={"row"}
                                                    onMouseOver={() => {
                                                        handleMouseOver(res.uuid);
                                                    }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            edit(res.uuid);
                                                        }}>
                                                        <IconUrl color={theme.palette.primary.main}
                                                                 path="ic-edit-patient"/>
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        </Can>
                                    </Box>
                                    <Stack
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                        alignItems={"center"}>
                                        <Typography
                                            className={"doc-title empty-preview"}>{startCase(res.title)}</Typography>
                                        <div className={"heading"}>
                                            {res.header.data.size === "portraitA4" ? "A4" : "A5"}
                                        </div>
                                    </Stack>
                                </Stack>
                            ))}
                        </CardContent>
                    </TemplateStyled>
                </Box>
            </Can>

            <Can I={"manage"} a={"settings"} field={"settings__templates__models__show"}>
                <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: "0 16px 16px 16px"}}}>
                    <TemplateStyled>
                        <Box p={2}>
                            <Stack
                                width={1}
                                direction={{xs: 'column-reverse', sm: 'row'}}
                                alignItems="center"
                                justifyContent="space-between"
                                borderBottom={{xs: 0, sm: `1px solid ${theme.palette.divider}`}}
                                display={{xs: "grid", sm: 'flex'}}>
                                <Tabs
                                    value={certificateTabIndex}
                                    onChange={(event, value) => setCertificateTabIndex(value)}
                                    aria-label="balance sheet tabs"
                                    variant={isMobile ? "scrollable" : 'standard'}
                                    scrollButtons={false}
                                    sx={{
                                        mb: {xs: 2, sm: 0},
                                        borderBottom: {xs: `1px solid ${theme.palette.divider}`, sm: 0},

                                    }}>
                                    <Tab
                                        disableFocusRipple
                                        disableRipple
                                        label={t("unfolded")}
                                        {...a11yProps(0)}
                                    />
                                    {certificateFolderModel.map((folder) => (
                                        <Tab
                                            key={folder.uuid}
                                            disableFocusRipple
                                            disableRipple
                                            label={capitalizeFirst(folder.name)}
                                            {...a11yProps(0)}
                                        />
                                    ))}
                                </Tabs>
                                <Can I={"manage"} a={"settings"} field={"settings__templates__models__create"}>
                                    <Stack ml={{sm: 2}} direction={"row"} spacing={1} alignItems={"center"}>
                                        <AddButton {...{
                                            t,
                                            onClickEvent: onClickEventCertificate,
                                            list: [{name: "unfolded"}, ...certificateFolderModel]
                                        }} />
                                    </Stack>
                                </Can>
                            </Stack>
                        </Box>
                        <TabPanel padding={0.1} index={0} value={certificateTabIndex}>
                            <CardContent>
                                <Can I={"manage"} a={"settings"} field={"settings__templates__models__create"}>
                                    <Stack spacing={2} className="add-doc-wrapper">
                                        <div
                                            className={"portraitA4"}
                                            onClick={() => {
                                                setEditDoc(false);
                                                setData(null);
                                                setAction("editDoc");
                                                setTimeout(() => setOpen(true));
                                            }}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                transform: "scale(1)",
                                                border: `1px dashed ${theme.palette.primary.main}`,
                                                backgroundColor: theme.palette.background.default,
                                                borderRadius: 25,
                                            }}>
                                            <Card
                                                sx={{
                                                    alignItems: "center",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    height: "100%",
                                                    border: "none",
                                                    transform: {xs: "scale(1)", md: "scale(.8)"},
                                                }}
                                            />
                                        </div>
                                        <Typography className={'empty-preview'} variant="caption" fontSize={10}>
                                            {startCase(t("blankDoc"))}
                                        </Typography>
                                    </Stack>
                                </Can>
                                {isDefault &&
                                    certificateModel.map((res) => (
                                        <Stack direction="column" key={res.uuid} spacing={2}>
                                            <Box className={"container"}>
                                                <div
                                                    onMouseOver={() => {
                                                        handleMouseOver(res.uuid);
                                                    }}
                                                    onMouseOut={handleMouseOut}>
                                                    <PreviewA4
                                                        {...{
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
                                                                type: "write_certif",
                                                            },
                                                            loading,
                                                        }}
                                                    />
                                                </div>
                                                {isHovering === res.uuid && (
                                                    <Stack
                                                        justifyContent="center"
                                                        className={"edit-btn"}
                                                        direction={"row"}
                                                        onMouseOver={() => {
                                                            handleMouseOver(res.uuid);
                                                        }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setData(res);
                                                                setAction("showDoc");
                                                                setTimeout(() => setOpen(true));
                                                            }}>
                                                            <IconUrl width={20} height={20}
                                                                     color={theme.palette.primary.main}
                                                                     path="ic-open-eye"/>
                                                        </IconButton>
                                                        <Can I={"manage"} a={"settings"}
                                                             field={"settings__templates__models__update"}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    handleEditDoc(res);
                                                                }}>
                                                                <IconUrl color={theme.palette.primary.main}
                                                                         path="ic-edit-patient"/>
                                                            </IconButton>
                                                        </Can>
                                                        <Can I={"manage"} a={"settings"}
                                                             field={"settings__templates__models__delete"}>
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    '& .react-svg svg': {
                                                                        width: 18,
                                                                        height: 18
                                                                    }
                                                                }}
                                                                onClick={() => {
                                                                    removeDoc(res);
                                                                }}>
                                                                <IconUrl color={theme.palette.error.main}
                                                                         path="ic-trash"/>
                                                            </IconButton>
                                                        </Can>
                                                    </Stack>
                                                )}
                                            </Box>
                                            <Stack direction={"row"} className={"title-content"}>
                                                <Typography className={"title"}>{res.title}</Typography>
                                                <div
                                                    className={"color-content"}
                                                    style={{background: res.color}}
                                                ></div>
                                            </Stack>
                                        </Stack>
                                    ))}
                            </CardContent>
                        </TabPanel>
                        {certificateFolderModel.map((certificate, index: number) => (
                            <TabPanel
                                padding={0.1}
                                key={certificate.uuid}
                                index={index + 1}
                                value={certificateTabIndex}>
                                <CardContent>
                                    <Stack spacing={2} className="add-doc-wrapper">
                                        <div
                                            className={"portraitA4"}
                                            onClick={() => {
                                                setTimeout(() => setOpen(true));
                                                setData({folder: certificate.uuid});
                                                setAction("editDoc");
                                            }}
                                            style={{
                                                width: "100%",
                                                border: `1px dashed ${theme.palette.primary.main}`,
                                                height: "100%",
                                                transform: "scale(1)",
                                                backgroundColor: theme.palette.background.default,
                                                borderRadius: 25,
                                            }}>
                                            <Card
                                                sx={{
                                                    alignItems: "center",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    height: "100%",
                                                    border: "none",
                                                    transform: {xs: "scale(1)", md: "scale(.8)"},
                                                }}
                                            />
                                        </div>
                                        <Typography
                                            className={"empty-preview"}
                                            variant="caption" fontSize={10}>
                                            {startCase(t("blankDoc"))}
                                        </Typography>
                                    </Stack>
                                    {isDefault &&
                                        certificate.files.map((res: any) => (
                                            <Stack key={res.uuid} spacing={2}>
                                                <Box className={"container"}>
                                                    <div
                                                        onMouseOver={() => {
                                                            handleMouseOver(res.uuid);
                                                        }}
                                                        onMouseOut={handleMouseOut}
                                                    >
                                                        <PreviewA4
                                                            {...{
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
                                                                    type: "write_certif",
                                                                },
                                                                loading,
                                                            }}
                                                        />
                                                    </div>
                                                    {isHovering === res.uuid && (
                                                        <Stack
                                                            className={"edit-btn"}
                                                            direction={"row"}
                                                            justifyContent="center"
                                                            onMouseOver={() => {
                                                                handleMouseOver(res.uuid);
                                                            }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    setData(res);
                                                                    setAction("showDoc");
                                                                    setTimeout(() => setOpen(true));
                                                                }}>
                                                                <IconUrl width={20} height={20}
                                                                         color={theme.palette.primary.main}
                                                                         path="ic-open-eye"/>
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    handleEditDoc({
                                                                        ...res,
                                                                        folder: certificate.uuid,
                                                                    });
                                                                }}>
                                                                <IconUrl color={theme.palette.primary.main}
                                                                         path="ic-edit-patient"/>
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    '& .react-svg svg': {
                                                                        width: 18,
                                                                        height: 18
                                                                    }
                                                                }}
                                                                onClick={() => {
                                                                    removeDoc(res);
                                                                }}>
                                                                <IconUrl color={theme.palette.error.main}
                                                                         path="ic-trash"/>
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Box>
                                                <Stack direction={"row"} className={"title-content"}>
                                                    <Typography className={"title"}>{startCase(res.title)}</Typography>
                                                    <div
                                                        className={"color-content"}
                                                        style={{background: res.color}}
                                                    ></div>
                                                </Stack>
                                            </Stack>
                                        ))}
                                </CardContent>
                            </TabPanel>
                        ))}
                    </TemplateStyled>
                </Box>
            </Can>

            <Can I={"manage"} a={"settings"} field={"settings__templates__prescriptions__show"}>
                <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: "0 16px 16px 16px"}}}>
                    <TemplateStyled>
                        <Box px={2} pt={2}>
                            <Stack
                                direction={{xs: 'column-reverse', sm: 'row'}}
                                alignItems="center"
                                justifyContent="space-between"
                                borderBottom={{xs: 0, sm: `1px solid ${theme.palette.divider}`}}
                                display={{xs: "grid", sm: 'flex'}}>
                                <Tabs
                                    value={prescriptionTabIndex}
                                    onChange={(event, value) => setPrescriptionTabIndex(value)}
                                    aria-label="balance sheet tabs"
                                    variant={isMobile ? "scrollable" : 'standard'}
                                    scrollButtons={false}
                                    sx={{
                                        mb: {xs: 2, sm: 0},
                                        borderBottom: {xs: `1px solid ${theme.palette.divider}`, sm: 0}
                                    }}>
                                    {prescriptionFolders.map((folder) => (
                                        <Tab
                                            key={folder.uuid}
                                            disableFocusRipple
                                            disableRipple
                                            label={capitalizeFirst(folder.name)}
                                            {...a11yProps(0)}
                                        />
                                    ))}
                                </Tabs>
                                <Can I={"manage"} a={"settings"} field={"settings__templates__prescriptions__create"}>
                                    <AddButton {...{
                                        t,
                                        onClickEvent: onClickEventPrescription,
                                        list: prescriptionFolders
                                    }} />
                                </Can>
                            </Stack>
                        </Box>
                        {prescriptionFolders.map((folder, index: number) => (
                            <TabPanel
                                padding={0.1}
                                key={index}
                                value={prescriptionTabIndex}
                                {...{index}}>
                                <CardContent>
                                    <Can I={"manage"} a={"settings"}
                                         field={"settings__templates__prescriptions__create"}>
                                        <Stack spacing={2} className="add-doc-wrapper">
                                            <div
                                                className={"portraitA4"}
                                                onClick={() => {
                                                    setInfo(getPrescriptionUI());
                                                    setModel(null);
                                                    setOpenDialog(true);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    border: `1px dashed ${theme.palette.primary.main}`,
                                                    height: "100%",
                                                    transform: "scale(1)",
                                                    backgroundColor: theme.palette.background.default,
                                                    borderRadius: 25,
                                                }}>
                                                <Card
                                                    sx={{
                                                        alignItems: "center",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        height: "100%",
                                                        border: "none",
                                                        transform: {xs: "scale(1)", md: "scale(.8)"},
                                                    }}/>
                                            </div>
                                            <Typography
                                                className={"empty-preview"}
                                                variant="caption" fontSize={10}>
                                                {startCase(t("blankDoc"))}
                                            </Typography>
                                        </Stack>
                                    </Can>
                                    {isDefault &&
                                        folder.prescriptionModels.map((card: any) => (
                                            <Stack key={card.uuid} spacing={2}>
                                                <Box className={"container"}>
                                                    <div
                                                        onMouseOver={() => {
                                                            handleMouseOver(card.uuid);
                                                        }}
                                                        onMouseOut={handleMouseOut}>
                                                        <PreviewA4
                                                            {...{
                                                                eventHandler: null,
                                                                data: isDefault?.header.data,
                                                                values: isDefault?.header.header,
                                                                nbPage: 1,
                                                                t,
                                                                state: {
                                                                    info: card.prescriptionModalHasDrugs.map(
                                                                        (pmhd: any) => ({
                                                                            ...pmhd,
                                                                            standard_drug: {
                                                                                commercial_name: pmhd.name,
                                                                                uuid: pmhd.drugUuid,
                                                                            },
                                                                        })
                                                                    ),
                                                                    description: "",
                                                                    doctor: "",
                                                                    name: "prescription",
                                                                    patient: "Patient",
                                                                    title: card.name,
                                                                    type: "prescription",
                                                                },
                                                                loading,
                                                            }}
                                                        />
                                                    </div>

                                                    {isHovering === card.uuid && (
                                                        <Stack
                                                            className={"edit-btn"}
                                                            direction={"row"}
                                                            justifyContent="center"
                                                            onMouseOver={() => {
                                                                handleMouseOver(card.uuid);
                                                            }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    const prescriptionModalHasDrugs =
                                                                        card.prescriptionModalHasDrugs.map(
                                                                            (pmhd: any) => ({
                                                                                ...pmhd,
                                                                                standard_drug: {
                                                                                    commercial_name: pmhd.name,
                                                                                    uuid: pmhd.drugUuid,
                                                                                },
                                                                            })
                                                                        );
                                                                    setData({
                                                                        uuid: card.uuid,
                                                                        name: card.name,
                                                                        parent:
                                                                        prescriptionFolders[prescriptionTabIndex]
                                                                            .uuid,
                                                                        prescriptionModalHasDrugs,
                                                                    });
                                                                    setAction("showPrescription");
                                                                    setTimeout(() => setOpen(true));
                                                                }}>
                                                                <IconUrl width={20} height={20}
                                                                         color={theme.palette.primary.main}
                                                                         path="ic-open-eye"/>
                                                            </IconButton>

                                                            <Can I={"manage"} a={"settings"}
                                                                 field={"settings__templates__prescriptions__update"}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        const prescriptionModalHasDrugs =
                                                                            card.prescriptionModalHasDrugs.map(
                                                                                (pmhd: any) => ({
                                                                                    ...pmhd,
                                                                                    standard_drug: {
                                                                                        commercial_name: pmhd.name,
                                                                                        uuid: pmhd.drugUuid,
                                                                                    },
                                                                                })
                                                                            );
                                                                        setModel({
                                                                            uuid: card.uuid,
                                                                            name: card.name,
                                                                            parent:
                                                                            prescriptionFolders[prescriptionTabIndex]
                                                                                .uuid,
                                                                            prescriptionModalHasDrugs,
                                                                        });
                                                                        setState(prescriptionModalHasDrugs);
                                                                        setInfo(getPrescriptionUI());
                                                                        setOpenDialog(true);
                                                                    }}>
                                                                    <IconUrl color={theme.palette.primary.main}
                                                                             path="ic-edit-patient"/>
                                                                </IconButton>
                                                            </Can>
                                                            <Can I={"manage"} a={"settings"}
                                                                 field={"settings__templates__prescriptions__delete"}>
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        '& .react-svg svg': {
                                                                            width: 18,
                                                                            height: 18
                                                                        }
                                                                    }}
                                                                    onClick={() => {
                                                                        removePrescription(card.uuid);
                                                                    }}>
                                                                    <IconUrl color={theme.palette.error.main}
                                                                             path="ic-trash"/>
                                                                </IconButton>
                                                            </Can>
                                                        </Stack>
                                                    )}
                                                </Box>
                                                <Stack
                                                    direction={"row"}
                                                    onMouseOver={() => {
                                                        handleMouseOver(card.uuid);
                                                    }}
                                                    className={"title-content"}>
                                                    <Typography className={"title"}>{startCase(card.name)}</Typography>
                                                </Stack>
                                            </Stack>
                                        ))}
                                </CardContent>
                            </TabPanel>
                        ))}
                    </TemplateStyled>
                </Box>
            </Can>

            <Can I={"manage"} a={"settings"} field={"settings__templates__analyses__show"}>
                <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: "0  16px 16px"}}}>
                    <TemplateStyled>
                        <Box px={2} pt={2}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between">
                                <Typography textTransform="uppercase" ml={2} fontWeight={600}>
                                    {t("analyses")}
                                </Typography>

                                <Can I={"manage"} a={"settings"} field={"settings__templates__analyses__create"}>
                                    <Button
                                        onClick={() => {
                                            setInfo("balance_sheet_request");
                                            setOpenDialog(true);
                                        }}
                                        variant="contained"
                                        startIcon={<IconUrl path={"ic-doc-add"}/>}>
                                        {t("btnAdd")}
                                    </Button>
                                </Can>
                            </Stack>
                            <Divider sx={{mt: 2}}/>
                        </Box>
                        <CardContent>
                            <Can I={"manage"} a={"settings"} field={"settings__templates__analyses__create"}>
                                <Stack spacing={2} className="add-doc-wrapper">
                                    <div
                                        className={"portraitA4"}
                                        onClick={() => {
                                            setInfo("balance_sheet_request");
                                            setOpenDialog(true);
                                        }}
                                        style={{
                                            width: "100%",
                                            border: `1px dashed ${theme.palette.primary.main}`,
                                            height: "100%",
                                            transform: "scale(1)",
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 25,
                                        }}>
                                        <Card
                                            sx={{
                                                alignItems: "center",
                                                display: "flex",
                                                justifyContent: "center",
                                                height: "100%",
                                                border: "none",
                                                transform: {xs: "scale(1)", md: "scale(.8)"},
                                            }}/>
                                    </div>
                                    <Typography
                                        className={"empty-preview"}
                                        variant="caption" fontSize={10}>
                                        {startCase(t("blankDoc"))}
                                    </Typography>
                                </Stack>
                            </Can>
                            {isDefault &&
                                !loading &&
                                analysis.map((card: any) => (
                                    <Stack key={card.uuid} spacing={2}>
                                        <Box className={"container"}>
                                            <div
                                                onMouseOver={() => {
                                                    handleMouseOver(card.uuid);
                                                }}
                                                onMouseOut={handleMouseOut}>
                                                <PreviewA4
                                                    {...{
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
                                                            type: "requested-analysis",
                                                        },
                                                        loading,
                                                    }}
                                                />
                                            </div>

                                            {isHovering === card.uuid && (
                                                <Stack
                                                    className={"edit-btn"}
                                                    direction={"row"}
                                                    justifyContent="center"
                                                    onMouseOver={() => {
                                                        handleMouseOver(card.uuid);
                                                    }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setTimeout(() => setOpen(true));
                                                            setData(card);
                                                            setAction("showAnalyses");
                                                        }}>
                                                        <IconUrl width={20} height={20}
                                                                 color={theme.palette.primary.main} path="ic-open-eye"/>
                                                    </IconButton>
                                                    <Can I={"manage"} a={"settings"}
                                                         field={"settings__templates__analyses__update"}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                let analysis: AnalysisModel[] = [];
                                                                card.info.map(
                                                                    (info: { analysis: AnalysisModel }) => {
                                                                        analysis.push(info.analysis);
                                                                    }
                                                                );
                                                                setState(analysis);
                                                                setModel(card);
                                                                setInfo("balance_sheet_request");
                                                                setOpenDialog(true);
                                                            }}>
                                                            <IconUrl color={theme.palette.primary.main}
                                                                     path="ic-edit-patient"/>
                                                        </IconButton>
                                                    </Can>
                                                    <Can I={"manage"} a={"settings"}
                                                         field={"settings__templates__analyses__delete"}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                '& .react-svg svg': {
                                                                    width: 18,
                                                                    height: 18
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                removeAnalyses(card.uuid);
                                                            }}>
                                                            <IconUrl color={theme.palette.error.main} path="ic-trash"/>
                                                        </IconButton>
                                                    </Can>
                                                </Stack>
                                            )}
                                        </Box>
                                        <Stack direction={"row"} className={"title-content"}>
                                            <Typography className={"title"}>{startCase(card.name)}</Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                        </CardContent>
                    </TemplateStyled>
                </Box>
            </Can>

            <Drawer anchor={"right"} {...{open}} dir={direction} onClose={closeDraw}>
                <Toolbar sx={{bgcolor: theme.palette.common.white}}>
                    <Stack alignItems="flex-end" width={1}>
                        <IconButton onClick={closeDraw} disableRipple>
                            <CloseIcon/>
                        </IconButton>
                    </Stack>
                </Toolbar>

                {(action === "editDoc" || action === "showDoc") && (
                    <CertifModelDrawer
                        {...{
                            isDefault,
                            action,
                            editDoc,
                            certificateFolderModel,
                            closeDraw,
                            data,
                            onSubmit: () =>
                                certificateTabIndex === 0
                                    ? mutateCertificate()
                                    : mutateParentModel(),
                        }}
                    />
                )}

                {action === "showPrescription" && (
                    <Box padding={2}>
                        <PreviewA4
                            {...{
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
                                    type: "prescription",
                                },
                                loading,
                            }}
                        />
                    </Box>
                )}

                {action === "showAnalyses" && (
                    <Box padding={2}>
                        <PreviewA4
                            {...{
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
                                    type: "requested-analysis",
                                },
                                loading,
                            }}
                        />
                    </Box>
                )}
            </Drawer>

            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{state, setState, t: tConsultation, setOpenDialog, model}}
                    size={
                        ["medical_prescription", "medical_prescription_cycle"].includes(
                            info
                        )
                            ? "xl"
                            : "lg"
                    }
                    direction={"ltr"}
                    sx={{height: 400}}
                    title={tConsultation(info)}
                    dialogClose={handleCloseDialog}
                    {...(["medical_prescription", "medical_prescription_cycle"].includes(
                        info
                    ) && {
                        headerDialog: (
                            <DialogTitle
                                sx={{
                                    backgroundColor: (theme: Theme) => theme.palette.primary.main,
                                    position: "relative",
                                }}
                                id="scroll-dialog-title"
                            >
                                <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                >
                                    {tConsultation(`consultationIP.${info}`)}
                                    <SwitchPrescriptionUI
                                        {...{
                                            t: tConsultation,
                                            keyPrefix: "consultationIP",
                                            handleSwitchUI,
                                        }}
                                    />
                                </Stack>
                            </DialogTitle>
                        ),
                    })}
                    actionDialog={
                        <DialogActions sx={{width: "100%"}}>
                            <Stack
                                sx={{width: "100%"}}
                                direction={"row"}
                                justifyContent={
                                    info === "medical_prescription_cycle"
                                        ? "space-between"
                                        : "flex-end"
                                }
                            >
                                {info === "medical_prescription_cycle" && (
                                    <Button
                                        startIcon={<AddIcon/>}
                                        onClick={() => {
                                            dispatch(handleDrawerAction("addDrug"));
                                        }}
                                    >
                                        {tConsultation("consultationIP.add_drug")}
                                    </Button>
                                )}
                                <Stack direction={"row"} spacing={1.2}>
                                    <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                        {t("close")}
                                    </Button>
                                    {info === getPrescriptionUI() && model && (
                                        <Button
                                            onClick={() => {
                                                editPrescriptionModel();
                                            }}
                                            startIcon={<SaveRoundedIcon/>}
                                        >
                                            {t("save")}
                                        </Button>
                                    )}
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
