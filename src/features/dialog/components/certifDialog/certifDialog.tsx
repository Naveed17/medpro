import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Collapse,
    Dialog as MuiDialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {Dialog, prescriptionSelector, setParentModel} from "@features/dialog";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {Editor} from "@tinymce/tinymce-react";
import {RecButton} from "@features/buttons";
import {useSnackbar} from "notistack";
import {getBackendOptions, MultiBackend, Tree} from "@minoru/react-dnd-treeview";
import TreeStyled from "@features/dialog/components/medicalPrescriptionCycleDialog/overrides/treeStyled";
import {CustomDragPreview, CustomNode} from "@features/treeView";
import {DndProvider} from "react-dnd";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import IconUrl from "@themes/urlIcon";
import {tinymcePlugins, tinymceToolbar} from "@lib/constants";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {agendaSelector} from "@features/calendar";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

import {LoadingScreen} from "@features/loadingScreen";
import CertifDialogStyled from "@features/dialog/components/certifDialog/certifDialogStyle";

function CertifDialog({...props}) {
    const {data, fullScreen} = props
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const router = useRouter();
    const theme = useTheme();
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {t, ready} = useTranslation("consultation");
    const {direction} = useAppSelector(configSelector);
    const {parent: modelParent} = useAppSelector(prescriptionSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [value, setValue] = useState<string>(data.state.content);
    const [selectedColor, setSelectedColor] = useState(["#0696D6"]);
    const [title, setTitle] = useState<string>('');
    const [folder, setFolder] = useState<string>("");
    const [isStarted, setIsStarted] = useState(false);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    let [oldNote, setOldNote] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(data.state.documentHeader ? data.state.documentHeader : "");
    const [initialOpenData, setInitialOpenData] = useState<any[]>([]);
    const [treeData, setTreeData] = useState<any[]>([]);
    const [openAddParentDialog, setOpenAddParentDialog] = useState(false);
    const [parentModelName, setParentModelName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [editModel, setEditModel] = useState(false);
    const [deleteModelDialog, setDeleteModelDialog] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<string>("");
    const [openCertificateModelDialog, setOpenCertificateModelDialog] = useState(false);
    const [height, setHeight] = React.useState(340);
    const [expanded, setExpanded] = useState(false);
    const [expandedAntecedent, setExpandedAntecedent] = useState(false);
    const [expandedMotif, setExpandedMotif] = useState(false);
    const [expandedActs, setExpandedActs] = useState(false);
    const [traking, setTraking] = useState<any[]>([]);
    const [antecedents, setAntecedents] = useState<string[]>([]);
    const [motifs, setMotifs] = useState<string[]>([]);
    const [acts, setActs] = useState<string[]>([]);
    const hasAntecedents = Object.keys(data.patient.antecedents).reduce((total, key) => total + data.patient.antecedents[key], 0) > 0
    const hasMotif = data.sheetExam.appointment_data.consultation_reason.length > 0
    const contentBtns = [
        {name: '{patient}', title: 'patient', show: true},
        {name: '{doctor}', title: 'doctor', show: true},
        {name: '{aujourd\'hui}', title: 'today', show: true},
        {name: '{age}', title: 'age', show: data.state.brithdate},
        {name: '{birthdate}', title: 'birthdate', show: data.state.brithdate},
        {name: '{cin}', title: 'cin', show: data.state.cin}
    ];

    const {trigger: triggerModelsCreate} = useRequestQueryMutation("/certif-models/create");
    const {trigger: triggerModelsUpdate} = useRequestQueryMutation("/certif-models/update");
    const {trigger: triggerModelParent} = useRequestQueryMutation("consultation/certif-models/parent");
    const {trigger: triggerFolderSwitch} = useRequestQueryMutation("/certif-models/folder/edit");
    const {trigger: triggerFolderDelete} = useRequestQueryMutation("/certif-models/delete");
    const {trigger: triggerGetData} = useRequestQueryMutation("/patient/data");

    const {data: httpModelResponse, mutate: mutateModel} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {
        data: httpParentModelResponse,
        mutate: mutateParentModel
    } = useRequestQuery(httpModelResponse && urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modal-folders/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpDocumentHeader} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const selectModel = (model: CertifModel) => {
        setValue(model?.content ?? "");
        data.state.content = model?.content ?? "";
        data.state.title = model?.title ?? "";
        data.state.documentHeader = model?.documentHeader ?? ""
        data.setState(data.state)
        setTitle(model?.title ?? "")
        setSelectedTemplate(model?.documentHeader ?? "")
        setSelectedColor([model?.color ?? ""])
        setFolder(model?.folder ?? "");
    }

    const saveModel = () => {
        const form = new FormData();
        form.append('content', value);
        form.append('color', selectedColor[0]);
        form.append('title', title);
        form.append('header', selectedTemplate);
        folder && form.append('folder', folder);

        triggerModelsCreate({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
            data: form
        }, {
            onSuccess: () => mutateModel().then(() => {
                mutateParentModel();
            })
        });
    }

    const startStopRec = () => {
        if (listening && isStarted) {
            SpeechRecognition.stopListening();
            resetTranscript();
            setIsStarted(false)

        } else {
            startListening();
        }
    }

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({continuous: true, language: 'fr-FR'}).then(() => {
            setIsStarted(true);
            setOldNote(value)
        })
    }

    const addVal = (val: string) => {
        (window as any).tinymce.execCommand('mceInsertContent', false, val);
    }

    const saveChanges = () => {
        setLoading(true);
        const form = new FormData();
        form.append('content', value);
        form.append('color', selectedColor[0]);
        form.append('title', title);
        folder && form.append('folder', folder);

        triggerModelsUpdate({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${selectedModel.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateParentModel();
                mutateModel().then(() => {
                    enqueueSnackbar(t("consultationIP.updated"), {variant: 'success'});
                    setEditModel(false);
                });
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleAddParentModel = () => {
        setLoading(true);
        const form = new FormData();
        form.append("name", parentModelName);
        triggerModelParent({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/certificate-modal-folders/${router.locale}`,
            data: form,
        }, {
            onSuccess: () => {
                mutateParentModel().then(() => {
                    setOpenAddParentDialog(false);
                    setParentModelName("");
                });
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleMoveFolderRequest = (ModelSourceId: string, parentTargetId: string, loading?: boolean) => {
        const form = new FormData();
        form.append("attribute", "folder");
        form.append("value", parentTargetId);
        triggerFolderSwitch({
            method: "PATCH",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${ModelSourceId}/${router.locale}`,
            data: form
        }, {
            ...(loading && {
                onSettled: () => {
                    setLoading(false);
                    mutateModel();
                    mutateParentModel().then(() => setOpenCertificateModelDialog(false));
                }
            })
        });
    }

    const handleDeleteFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        triggerFolderDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/${selectedModel.parent === 0 && selectedModel.hasOwnProperty("isDefault") ? "certificate-modal-folders/" : "certificate-modals/"}${selectedModel.id}/${router.locale}`
        }, {
            onSuccess: () => {
                setSelectedModel(null);
                mutateModel();
                mutateParentModel().then(() => setDeleteModelDialog(false));
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleDeleteModel = (props: any) => {
        setSelectedModel(props.node);
        setDialogAction(props.node.parent === 0 ? "parent" : "model");
        setDeleteModelDialog(true);
    }

    const handleMoveModel = (props: any) => {
        dispatch(setParentModel(props.node.parent));
        setSelectedModel(props.node);
        setOpenCertificateModelDialog(true);
    }

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId}: any) => {
        handleMoveFolderRequest(dragSourceId, dropTargetId);
        setTreeData(newTree);
    }

    const switchModel = (node: any) => {
        selectModel(node.data);
        setSelectedModel({...node.data, id: node.id});
        setEditModel(false);
    }

    const handleEditModel = (props: any) => {
        selectModel(props.node.data);
        setSelectedModel({...props.node.data, id: props.node.id});
        setEditModel(true);
    }

    const showTrakingData = () => {
        medicalEntityHasUser && !expanded && traking.length === 0 && triggerGetData({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agenda?.uuid}/appointments/${data.appuuid}/consultation-data/${router.locale}`
        }, {
            onSuccess: (result) => {
                const data = result.data.data
                if (data) {
                    let res: { key: string, value: string, description: string }[] = [];
                    Object.keys(data).filter(key => data[key] !== "").forEach(key => {
                        res.push({
                            key: data[key].label,
                            value: (Object.values(data[key].data)[0] as string),
                            description: data[key].description
                        })
                    })
                    setTraking(res)
                }
            }
        })
        setExpanded(!expanded)
        setExpandedAntecedent(false)
        setExpandedActs(false)
        setExpandedMotif(false)
    }

    const showAntecedentData = () => {
        medicalEntityHasUser && !expandedAntecedent && antecedents.length === 0 && triggerGetData({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${data.patient.uuid}/antecedents/${router.locale}`
        }, {
            onSuccess: (result) => {
                const res = result.data.data
                let ant: string[] = [];
                Object.keys(res).forEach(key => {
                    res[key].map((asc: { name: string; }) => ant.push(asc.name))
                })
                setAntecedents(ant)
            }
        })
        setExpandedAntecedent(!expandedAntecedent)
        setExpanded(false)
        setExpandedActs(false)
        setExpandedMotif(false)
    }

    const showMotifData = () => {
        let _motifs: string[] = [];
        if (!expandedMotif && motifs.length === 0) {
            data.sheetExam.appointment_data.consultation_reason.map((cr: { name: string; }) => {
                _motifs.push(cr.name)
            })
            setMotifs(_motifs);
        }
        setExpandedMotif(!expandedMotif)
        setExpanded(false)
        setExpandedActs(false)
        setExpandedAntecedent(false)
    }

    const showActsData = () => {
        medicalEntityHasUser && !expandedActs && agenda && acts.length === 0 && triggerGetData({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/appointments/${data.appuuid}/acts/${router.locale}`
        }, {
            onSuccess: (result) => {
                const res = result.data.data
                const _acts: string[] = [];
                res.acts?.map((act: { name: string; }) => _acts.push(act.name))
                setActs(_acts)
            }
        })
        setExpandedActs(!expandedActs)
        setExpanded(false)
        setExpandedMotif(false)
        setExpandedAntecedent(false)
    }

    const ParentModels = (httpParentModelResponse as HttpResponse)?.data ?? [];
    const modelsList = (httpModelResponse as HttpResponse)?.data ?? [];

    useEffect(() => {
        const certifiesModel: any[] = [];
        ParentModels.map((model: any) => {
            certifiesModel.push(...[
                {
                    id: model.uuid,
                    isDefault: model.name === "Default",
                    parent: 0,
                    droppable: true,
                    text: model.name === "Default" ? "Répertoire par défaut" : model.name
                },
                ...model.files.map((certifie: any) => ({
                    id: certifie.uuid,
                    parent: model.uuid,
                    color: model.color ? model.color : theme.palette.text.primary,
                    text: certifie.title,
                    data: {...certifie, folder: model.uuid}
                }))
            ]);
        });
        modelsList.length > 0 && certifiesModel.push(...modelsList.map((model: CertifModel) => ({
            id: model.uuid,
            parent: 0,
            color: model.color ? model.color : '#0696D6',
            text: model.title ? model.title : 'Sans titre',
            data: model
        })));
        setTreeData(certifiesModel);
    }, [ParentModels, modelsList]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (data)
            setTitle(data.state.title)
    }, [data])

    useEffect(() => {
        if (isStarted)
            setValue(oldNote + ' ' + transcript)
    }, [transcript, isStarted]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpDocumentHeader) {
            const docInfo = (httpDocumentHeader as HttpResponse).data
            setTemplates(docInfo)
        }
    }, [httpDocumentHeader])

    useEffect(() => {
        setHeight(fullScreen ? (window.innerHeight > 800 ? 580 : 480) : 280);
    }, [fullScreen, window.innerHeight])  // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <CertifDialogStyled>
            <Grid container sx={{height: "100%"}}>
                <Grid item xs={12} md={fullScreen ? 12 : 9}>
                    <List sx={{
                        width: '100%',
                        bgColor: 'background.paper',
                        paddingRight: 2
                    }}>
                        <Stack spacing={1}>
                            {!fullScreen && <Stack direction={"row"} spacing={2} sx={{width: "100%"}}>
                                <Stack sx={{width: "100%"}}>
                                    <Typography style={{color: "gray"}}
                                                fontSize={12}>{t('consultationIP.title')}</Typography>
                                    <Stack alignItems={"center"} spacing={1} direction={"row"}>
                                        <TextField
                                            style={{width: "100%"}}
                                            value={title}
                                            onChange={(ev) => {
                                                setTitle(ev.target.value)
                                                data.state.title = ev.target.value;
                                                data.setState(data.state)
                                            }}/>
                                    </Stack>
                                </Stack>

                                <Stack sx={{width: "100%"}}>
                                    <Typography style={{color: "gray"}}
                                                fontSize={12}>{t('consultationIP.dir')}</Typography>
                                    <Select
                                        size={"small"}
                                        value={folder}
                                        onChange={(e) => setFolder(e.target.value)}>
                                        {ParentModels.map((folder: any, index: number) => <MenuItem
                                            key={index}
                                            value={folder.uuid}>{folder.name}</MenuItem>)}
                                    </Select>
                                </Stack>

                                <Stack sx={{width: "100%"}}>
                                    <Typography style={{color: "gray"}}
                                                fontSize={12}>{t('consultationIP.alertTitle')}</Typography>
                                    <Select
                                        size={"small"}
                                        value={selectedTemplate}
                                        onChange={(e) => {
                                            setSelectedTemplate(e.target.value);
                                            data.state.documentHeader = e.target.value;
                                            data.setState(data.state);
                                        }}>
                                        {templates.map((template: any, index: number) => <MenuItem
                                            key={index}
                                            value={template.uuid}>{template.title}</MenuItem>)}
                                    </Select>
                                </Stack>
                            </Stack>}

                            {!fullScreen && <Typography style={{color: "gray"}} fontSize={12} mt={1}
                                                        mb={1}>{t('consultationIP.contenu')}</Typography>}

                            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mt={1}>
                                <Stack direction={"row"} alignItems={"center"} spacing={1} style={{flexWrap: "wrap"}}>
                                    {contentBtns.filter(cb => cb.show).map(cb => (
                                        <Tooltip key={cb.name} title={t(`consultationIP.${cb.title}_placeholder`)}>
                                            <Button color={"info"}
                                                    variant="outlined"
                                                    style={{marginBottom: 5}}
                                                    onClick={() => {
                                                        addVal(cb.name)
                                                    }} size={"small"}> <AddIcon/> {t(`consultationIP.${cb.title}`)}
                                            </Button>
                                        </Tooltip>))}
                                    <Button color={expanded ? "primary" : "info"}
                                            variant="outlined"
                                            style={{marginBottom: 5}}
                                            onClick={() => showTrakingData()}
                                            size={"small"}>
                                        {t(`consultationIP.tracking_data`)}
                                        {expanded ? <KeyboardArrowUpRoundedIcon/> : <KeyboardArrowDownRoundedIcon/>}
                                    </Button>

                                    {hasAntecedents && <Button color={expandedAntecedent ? "primary" : "info"}
                                                               variant="outlined"
                                                               style={{marginBottom: 5}}
                                                               onClick={() => showAntecedentData()}
                                                               size={"small"}>
                                        {t(`consultationIP.antecedent`)}
                                        {expandedAntecedent ? <KeyboardArrowUpRoundedIcon/> :
                                            <KeyboardArrowDownRoundedIcon/>}
                                    </Button>}

                                    {hasMotif && <Button color={expandedMotif ? "primary" : "info"}
                                                         variant="outlined"
                                                         style={{marginBottom: 5}}
                                                         onClick={() => showMotifData()} size={"small"}>
                                        {t(`consultationIP.consultation_reason`)}
                                        {expandedMotif ? <KeyboardArrowUpRoundedIcon/> :
                                            <KeyboardArrowDownRoundedIcon/>}
                                    </Button>}

                                    <Button color={expandedActs ? "primary" : "info"}
                                            variant="outlined"
                                            style={{marginBottom: 5}}
                                            onClick={() => showActsData()} size={"small"}>
                                        {t(`consultationIP.acts`)}
                                        {expandedActs ? <KeyboardArrowUpRoundedIcon/> :
                                            <KeyboardArrowDownRoundedIcon/>}
                                    </Button>
                                </Stack>
                                <RecButton
                                    small
                                    onClick={() => {
                                        startStopRec();
                                    }}/>
                            </Stack>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <div className={'suggestion'}>
                                    {traking.map(item => (
                                        <Button color={"info"}
                                                variant="outlined"
                                                onClick={() => {
                                                    addVal(`${item.key}: ${item.value.toString()} ${item.description}`)
                                                }}
                                                style={{width: "fit-content", margin: 2}}
                                                key={item.key}
                                                size={"small"}> <AddIcon/> {item.key} ({item.value} {item.description})
                                        </Button>
                                    ))}
                                    {traking.length === 0 && <Typography className={'empty'}>{t('noData')}</Typography>}
                                </div>
                            </Collapse>
                            <Collapse in={expandedAntecedent} timeout="auto" unmountOnExit>
                                <div className={'suggestion'}>
                                    {antecedents.map((item, index) => (
                                        <Button style={{width: "fit-content", margin: 2}}
                                                onClick={() => {
                                                    addVal(item.toString())
                                                }}
                                                color={"info"}
                                                variant="outlined"
                                                key={`antecedent${index}`}
                                                size={"small"}> <AddIcon/> {item}
                                        </Button>
                                    ))}
                                    {antecedents.length === 0 &&
                                        <Typography className={'empty'}>{t('noData')}</Typography>}
                                </div>
                            </Collapse>
                            <Collapse in={expandedMotif} timeout="auto" unmountOnExit>
                                <div className={'suggestion'}>
                                    {motifs.map((item, index) => (
                                        <Button color={"info"}
                                                variant="outlined"
                                                style={{width: "fit-content", margin: 2}} onClick={() => {
                                            addVal(item.toString())
                                        }}
                                                key={`motif${index}`}
                                                size={"small"}> <AddIcon/> {item}
                                        </Button>
                                    ))}
                                    {motifs.length === 0 && <Typography className={'empty'}>{t('noData')}</Typography>}
                                </div>
                            </Collapse>
                            <Collapse in={expandedActs} timeout="auto" unmountOnExit>
                                <div className={'suggestion'}>
                                    {acts.map((item, index) => (
                                        <Button color={"info"}
                                                variant="outlined"
                                                style={{width: "fit-content", margin: 2}} onClick={() => {
                                            addVal(item.toString())
                                        }}
                                                key={`motif${index}`}
                                                size={"small"}> <AddIcon/> {item}
                                        </Button>
                                    ))}
                                    {acts.length === 0 && <Typography className={'empty'}>{t('noData')}</Typography>}
                                </div>
                            </Collapse>
                            <div style={{height, paddingBottom: "1rem"}}>
                                <Editor
                                    value={value}
                                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                    onEditorChange={(res) => {
                                        data.state.content = res;
                                        data.setState(data.state)
                                        setValue(res)
                                    }}
                                    init={{
                                        width: "100%",
                                        height: "100%",
                                        branding: false,
                                        statusbar: false,
                                        menubar: false,
                                        plugins: tinymcePlugins,
                                        toolbar: tinymceToolbar,
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}/>
                            </div>
                        </Stack>
                    </List>
                </Grid>
                {!fullScreen && <Grid item xs={12} md={3} style={{borderLeft: `1px solid ${theme.palette.grey[200]}`}}>
                    <Stack>
                        {editModel ?
                            <Stack direction={"row"} spacing={1} justifyContent={"end"}>
                                <LoadingButton
                                    {...{loading}}
                                    loadingPosition="start"
                                    color="warning"
                                    size={"small"}
                                    onClick={() => {
                                        saveChanges();
                                    }}
                                    className="custom-button"
                                    variant="contained"
                                    startIcon={<EditIcon/>}>
                                    {t("consultationIP.editModel")} {t("consultationIP.model")}
                                </LoadingButton>

                                <Button
                                    size='small'
                                    onClick={() => setEditModel(false)}
                                    disabled={loading}>
                                    {t('consultationIP.cancel')}
                                </Button>
                            </Stack>
                            : <Button sx={{ml: 'auto', height: 1}}
                                      size='small'
                                      disabled={title.length === 0 || value.length === 0}
                                      onClick={() => {
                                          saveModel()
                                      }}
                                      startIcon={<AddIcon/>}>
                                {t('consultationIP.createAsModel')}
                            </Button>}
                    </Stack>

                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant={'h6'} marginLeft={2}>{t('Models')}</Typography>

                    </Stack>

                    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                        <TreeStyled {...{fullScreen, innerHeight: window.innerHeight}} className={"app"}>
                            <Tree
                                tree={treeData}
                                rootId={0}
                                render={(node, {depth, isOpen, onToggle}) => (
                                    <CustomNode
                                        {...{
                                            selectedNode: selectedModel?.id,
                                            node,
                                            switchModel,
                                            handleEditModel,
                                            handleDeleteModel,
                                            handleMoveModel,
                                            depth,
                                            isOpen,
                                            onToggle
                                        }}
                                    />
                                )}
                                sort={false}
                                enableAnimateExpand={true}
                                initialOpen={initialOpenData}
                                dragPreviewRender={(monitorProps) => (
                                    <CustomDragPreview monitorProps={monitorProps}/>
                                )}
                                onDrop={handleDrop}
                                classes={{
                                    root: "root",
                                    draggingSource: "draggingSource",
                                    dropTarget: "dropTarget"
                                }}
                            />
                        </TreeStyled>
                    </DndProvider>

                    <Button
                        size={"small"}
                        onClick={() => setOpenAddParentDialog(true)}
                        sx={{alignSelf: "flex-start", mb: 1, ml: 1}}
                        color={"primary"}
                        startIcon={<AddRoundedIcon/>}>
                        {t("consultationIP.new_file")}
                    </Button>
                </Grid>}
            </Grid>


            <MuiDialog
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        width: "100%"
                    }
                }}
                onClose={() => setOpenAddParentDialog(false)}
                open={openAddParentDialog}>
                <DialogTitle
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.primary.main,
                        mb: 2,
                    }}>
                    {t("consultationIP.add_group_model")}
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {t("consultationIP.group_model_name")}
                    </Typography>
                    <TextField
                        fullWidth
                        value={parentModelName}
                        onChange={(e) => {
                            setParentModelName(e.target.value);
                        }}
                        placeholder={t("consultationIP.group_model_name_placeholder")}
                    />
                </DialogContent>
                <DialogActions>
                    <Stack
                        width={1}
                        spacing={2}
                        direction="row"
                        justifyContent="flex-end">
                        <Button
                            variant="text-black"
                            onClick={() => {
                                setOpenAddParentDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("consultationIP.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            disabled={parentModelName.length === 0}
                            onClick={handleAddParentModel}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}
                            variant="contained">
                            {t("consultationIP.save")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </MuiDialog>

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteModelDialog(false)}
                sx={{direction}}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`consultationIP.dialogs.delete-${dialogAction}-dialog.sub-title`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`consultationIP.dialogs.delete-${dialogAction}-dialog.description`)}</Typography>
                        </Box>)
                }}
                open={deleteModelDialog}
                title={t(`consultationIP.dialogs.delete-${dialogAction}-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setDeleteModelDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {t(`consultationIP.dialogs.delete-${dialogAction}-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={handleDeleteFolder}
                            startIcon={<IconUrl height={"18"} width={"18"} color={"white"} path="icdelete"/>}>
                            {t(`consultationIP.dialogs.delete-${dialogAction}-dialog.confirm`)}
                        </LoadingButton>
                    </>
                }
            />

            <Dialog
                {...{direction}}
                color={theme.palette.warning.main}
                contrastText={theme.palette.warning.contrastText}
                action={"medical_prescription_model"}
                open={openCertificateModelDialog}
                data={{t, models: ParentModels, selectedModel, color: "warning", setOpenAddParentDialog}}
                dialogClose={() => setOpenCertificateModelDialog(false)}
                size="md"
                title={`${t("consultationIP.move_the_template_in_folder")} "${selectedModel?.text}"`}
                actionDialog={(
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Button
                            variant="text-black"
                            onClick={() => {
                                setOpenCertificateModelDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("consultationIP.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition={"start"}
                            color={"warning"}
                            startIcon={<DriveFileMoveOutlinedIcon/>}
                            onClick={() => {
                                setLoading(true);
                                handleMoveFolderRequest(selectedModel?.id, modelParent, true);
                            }}
                            variant="contained">
                            {t("consultationIP.save")}
                        </LoadingButton>
                    </Stack>
                )}/>
        </CertifDialogStyled>
    )
}

export default CertifDialog
