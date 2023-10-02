import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox, Dialog,
    DialogActions, DialogContent, DialogTitle,
    FormControlLabel,
    Grid,
    List,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import dynamic from "next/dynamic";
import {ModelDot} from "@features/modelDot";
import AddIcon from "@mui/icons-material/Add";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {Dialog as CustomDialog, setParentModel} from "@features/dialog";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
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

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function CertifDialog({...props}) {
    const {data} = props
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const router = useRouter();
    const theme = useTheme();
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("consultation");
    const {direction} = useAppSelector(configSelector);

    let [colors, setColors] = useState(["#FEBD15", "#FF9070", "#DF607B", "#9A5E8A", "#526686", "#96B9E8", "#0696D6", "#56A97F"]);
    const [value, setValue] = useState<string>(data.state.content);
    const [selectedColor, setSelectedColor] = useState(["#0696D6"]);
    const [title, setTitle] = useState<string>('');
    const [isStarted, setIsStarted] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const [selected, setSelected] = useState<any>();
    const [selectedModel, setSelectedModel] = useState<any>(null);
    let [oldNote, setOldNote] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(data.state.documentHeader ? data.state.documentHeader : "");
    const [initialOpenData, setInitialOpenData] = useState<any[]>([]);
    const [treeData, setTreeData] = useState<any[]>([]);
    const [openAddParentDialog, setOpenAddParentDialog] = useState(false);
    const [parentModelName, setParentModelName] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const contentBtns = [
        {name: '{patient}', title: 'patient', show: true},
        {name: '{doctor}', title: 'doctor', show: true},
        {name: '{aujourd\'hui}', title: 'today', show: true},
        {name: '{age}', title: 'age', show: data.state.brithdate},
        {name: '{cin}', title: 'cin', show: data.state.cin},
    ];

    const {trigger: triggerModelsCreate} = useRequestQueryMutation("/certif-models/create");
    const {trigger: triggerModelsUpdate} = useRequestQueryMutation("/certif-models/update");
    const {trigger: triggerModelParent} = useRequestQueryMutation("consultation/certif-models/parent");

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
        setValue(model.content);
        data.state.content = model.content;
        data.state.title = model.title;
        data.state.documentHeader = model.documentHeader
        data.setState(data.state)
        setTitle(model?.title ?? "")
        setSelectedTemplate(model.documentHeader)
        setSelectedColor([model.color])
        setSelectedModel(model);
    }

    const saveModel = () => {
        const form = new FormData();
        form.append('content', value);
        form.append('color', selectedColor[0]);
        form.append('title', title);
        form.append('header', selectedTemplate);

        triggerModelsCreate({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
            data: form
        }, {
            onSuccess: () => mutateModel().then(() => {
                setSelectedTemplate('')
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

    const dialogSave = () => {
        triggerModelsUpdate(selected.request, {
            onSuccess: () => {
                mutateModel().then(() => {
                    setOpenRemove(false);
                })
            }
        });
    }

    const addVal = (val: string) => {
        (window as any).tinymce.execCommand('mceInsertContent', false, val);
    }

    const saveChanges = () => {
        const form = new FormData();
        form.append('content', value);
        form.append('color', selectedColor[0]);
        form.append('title', title);
        triggerModelsUpdate({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${selectedModel.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateModel().then(() => {
                    enqueueSnackbar(t("consultationIP.updated"), {variant: 'success'})
                });
            }
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
                mutateParentModel().then((result: any) => {
                    setOpenAddParentDialog(false);
                    setParentModelName("");
                });
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId}: any) => {

    }

    const switchModel = (data: any) => {
        selectModel(data);
    }

    useEffect(() => {
        if (httpParentModelResponse && httpModelResponse) {
            const ParentModels = (httpParentModelResponse as HttpResponse).data;
            const template: CertifModel[] = [];
            const modelsList = (httpModelResponse as HttpResponse).data;
            modelsList.map((model: CertifModel) => {
                const stringToHTML = new DOMParser().parseFromString(model.content, 'text/html').body.firstChild
                template.push({
                    id: model.uuid,
                    parent: "1",
                    color: model.color ? model.color : '#0696D6',
                    text: model.title ? model.title : 'Sans titre',
                    name: model.title ? model.title : 'Sans titre',
                    content: model.content,
                    documentHeader: model.documentHeader,
                    preview: (stringToHTML as HTMLElement)?.innerHTML,
                    data: model
                });
            });
            setTreeData([...ParentModels.map((model: any, index: number) => ({
                id: (++index).toString(),
                isDefault: model.name === "Default",
                parent: 0,
                droppable: true,
                text: model.name === "Default" ? "Répertoire par défaut" : model.name
            })), ...template.reverse()])
        }
    }, [httpParentModelResponse, httpModelResponse]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (data)
            setTitle(data.state.title)
    }, [data])

    useEffect(() => {
        if (isStarted) {
            setValue(oldNote + ' ' + transcript)
        }
    }, [transcript, isStarted]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpDocumentHeader) {
            const docInfo = (httpDocumentHeader as HttpResponse).data
            setTemplates(docInfo)
        }
    }, [httpDocumentHeader])

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Box>
            <Grid container>
                <Grid item xs={12} md={9}>
                    <List sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        overflowX: "scroll",
                        height: '24rem',
                        paddingRight: 2
                    }}>
                        <Stack spacing={1}>
                            <Typography style={{color: "gray"}} fontSize={12}>{t('consultationIP.title')}</Typography>
                            <Stack alignItems={"center"} spacing={1} direction={"row"}>
                                <TextField
                                    style={{width: "100%"}}
                                    value={title}
                                    onChange={(ev) => {
                                        setTitle(ev.target.value)
                                        data.state.title = ev.target.value;
                                        data.setState(data.state)
                                    }}/>
                                {selectedColor.map(color => (
                                    <ModelDot
                                        key={color}
                                        color={color}
                                        onClick={() => {
                                            if (selectedColor.length === 1)
                                                setSelectedColor([...colors])
                                            else {
                                                setSelectedColor([color])
                                                colors.splice(colors.findIndex(c => c === color), 1)
                                                setColors([...colors, color])
                                            }
                                        }}>
                                    </ModelDot>
                                ))}
                            </Stack>
                            <div style={{display: "flex"}}>
                                <Typography style={{color: "gray"}} fontSize={12} mt={1}
                                            mb={1}>{t('consultationIP.alertTitle')}</Typography>
                                <div style={{marginLeft: 15}}>
                                    {templates.map((doc: any) => (<FormControlLabel
                                        key={doc.uuid}
                                        control={
                                            <Checkbox checked={selectedTemplate === doc.uuid}
                                                      onChange={() => {
                                                          setSelectedTemplate(doc.uuid)
                                                          data.state.documentHeader = doc.uuid
                                                          data.setState(data.state)
                                                      }} name={doc.uuid}/>
                                        }
                                        label={doc.title}
                                    />))}
                                </div>
                            </div>

                            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mt={1}>
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <Typography style={{color: "gray"}} fontSize={12} mt={1}
                                                mb={1}>{t('consultationIP.contenu')}</Typography>
                                    {contentBtns.filter(cb => cb.show).map(cb => (
                                        <Tooltip key={cb.name} title={t(`consultationIP.${cb.title}_placeholder`)}>
                                            <Button onClick={() => {
                                                addVal(cb.name)
                                            }} size={"small"}> <AddIcon/> {t(`consultationIP.${cb.title}`)}</Button>
                                        </Tooltip>))}
                                </Stack>
                                <RecButton
                                    small
                                    onClick={() => {
                                        startStopRec();
                                    }}/>
                            </Stack>

                            <Editor
                                value={value}
                                apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                                onEditorChange={(res) => {
                                    data.state.content = res;
                                    data.setState(data.state)
                                    setValue(res)
                                }}
                                init={{
                                    branding: false,
                                    statusbar: false,
                                    menubar: false,
                                    plugins: " advlist anchor autolink autosave charmap codesample directionality  emoticons    help image insertdatetime link  lists media   nonbreaking pagebreak searchreplace table visualblocks visualchars wordcount",
                                    toolbar: "blocks fontfamily fontsize | bold italic underline forecolor backcolor | align lineheight checklist bullist numlist ",
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}/>
                        </Stack>
                    </List>
                </Grid>
                <Grid item xs={12} md={3} style={{borderLeft: `1px solid ${theme.palette.grey[200]}`}}>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant={'h6'} marginLeft={2} marginTop={1}>{t('Models')}</Typography>
                        <Button sx={{ml: 'auto', height: 1}}
                                size='small'
                                disabled={title.length === 0 || value.length === 0}
                                onClick={() => {
                                    saveModel()
                                }}
                                startIcon={<AddIcon/>}>
                            {t('consultationIP.createAsModel')}
                        </Button>
                    </Stack>

                    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                        <TreeStyled className={"app"}>
                            <Tree
                                tree={treeData}
                                rootId={0}
                                render={(node, {depth, isOpen, onToggle}) => (
                                    <CustomNode
                                        {...{
                                            node,
                                            switchModel,
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
                </Grid>
            </Grid>

            <CustomDialog
                action={"remove"}
                direction={direction}
                open={openRemove}
                data={selected}
                color={(theme: Theme) => theme.palette.error.main}
                title={t('consultationIP.removedoc')}
                t={t}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenRemove(false);
                        }}
                                startIcon={<CloseIcon/>}>{t('consultationIP.cancel')}</Button>
                        <LoadingButton variant="contained"
                                       sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                       onClick={dialogSave}>{t('consultationIP.remove')}</LoadingButton>
                    </DialogActions>
                }
            />

            <Dialog
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        width: "100%",
                    },
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
            </Dialog>
        </Box>
    )
}

export default CertifDialog
