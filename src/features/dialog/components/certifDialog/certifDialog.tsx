import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    DialogActions,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import {ModelDot} from "@features/modelDot";
import AddIcon from "@mui/icons-material/Add";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import IconUrl from "@themes/urlIcon";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {Dialog as CustomDialog} from "@features/dialog";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {Editor} from "@tinymce/tinymce-react";
import {RecButton} from "@features/buttons";
import {useSnackbar} from "notistack";

function CertifDialog({...props}) {
    const {data} = props
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {data: session} = useSession();
    const router = useRouter();
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();

    const {direction} = useAppSelector(configSelector);

    let [colors, setColors] = useState(["#FEBD15", "#FF9070", "#DF607B", "#9A5E8A", "#526686", "#96B9E8", "#0696D6", "#56A97F"]);
    const [value, setValue] = useState<string>(data.state.content);
    const [selectedColor, setSelectedColor] = useState(["#0696D6"]);
    const [title, setTitle] = useState<string>('');
    const [models, setModels] = useState<CertifModel[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const [selected, setSelected] = useState<any>();
    const [selectedModel, setSelectedModel] = useState<any>(null);
    let [oldNote, setOldNote] = useState('');
    const {enqueueSnackbar} = useSnackbar();

    const contentBtns = [
        {name: '{patient}', title: 'patient', desc: "Nom du patient"},
        {name: '{doctor}', title: 'doctor', desc: "Nom du doctor"},
        {name: '{aujourd\'hui}', title: 'today', desc: "Date aujourd'hui"},
    ];

    const {trigger} = useRequestMutation(null, "/certif-models");

    const {data: httpModelResponse, mutate} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);
    const selectModel = (model: CertifModel) => {
        setValue(model.content);
        data.state.content = model.content;
        data.state.title = model.title;
        data.setState(data.state)
        setTitle(model.title)
        setSelectedColor([model.color])
        setSelectedModel(model);
    }
    const saveModel = () => {
        const form = new FormData();
        form.append('content', value);
        form.append('color', selectedColor[0]);
        form.append('title', title);
        trigger({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }, {
            revalidate: true,
            populateCache: true
        }).then(() => {
            mutate();
        })

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
        trigger(selected.request, {revalidate: true, populateCache: true}).then(() => {
            mutate().then(() => {
                setOpenRemove(false);
            })
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
        trigger({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/certificate-modals/${selectedModel.uuid}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }, {
            revalidate: true,
            populateCache: true
        }).then(() => {
            mutate().then(() => {
                enqueueSnackbar(t("consultationIP.updated"), {variant: 'success'})
            });
        })
    }

    useEffect(() => {
        if (httpModelResponse) {
            const template: CertifModel[] = [];
            const modelsList = (httpModelResponse as HttpResponse).data;
            modelsList.map((model: CertifModel) => {
                const stringToHTML = new DOMParser().parseFromString(model.content, 'text/html').body.firstChild
                template.push({
                    uuid: model.uuid,
                    color: model.color ? model.color : '#0696D6',
                    title: model.title ? model.title : 'Sans titre',
                    name: model.title ? model.title : 'Sans titre',
                    content: model.content,
                    preview: (stringToHTML as HTMLElement)?.innerHTML
                });
            });
            setModels(template.reverse())
        }
    }, [httpModelResponse, selectedColor]);

    useEffect(() => {
        if (data)
            setTitle(data.state.title)
    }, [data])

    useEffect(() => {
        if (isStarted) {
            setValue(oldNote + ' ' + transcript)
        }
    }, [transcript, isStarted]) // eslint-disable-line react-hooks/exhaustive-deps

    const {t, ready} = useTranslation("consultation");

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

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
                            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mt={1}>
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <Typography style={{color: "gray"}} fontSize={12} mt={1}
                                                mb={1}>{t('consultationIP.contenu')}</Typography>
                                    {contentBtns.map(cb => (<Tooltip key={cb.name} title={t(`consultationIP.${cb.title}_placeholder`)}>
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
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen textcolor',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                        'bold italic backcolor forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                }}
                            />
                        </Stack>
                    </List>
                </Grid>
                <Grid item xs={12} md={3} style={{borderLeft: '1px solid #DDDDDD'}}>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant={'h6'} marginLeft={2} marginTop={1}>{t('Models')}</Typography>
                        <Button sx={{ml: 'auto', height: 1}}
                                size='small'
                                disabled={title.length === 0 || value.length === 0}
                                onClick={saveModel}
                                startIcon={<AddIcon/>}>
                            {t('consultationIP.createAsModel')}
                        </Button>
                    </Stack>
                    <List sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        overflowX: "scroll",
                        height: '21rem'
                    }}>
                        {models.map((item, index) => (
                            <Box key={`models-${index}`} style={{opacity : selectedModel ? selectedModel.uuid === item.uuid ? 1:.7:1}}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: item.color,
                                            color: "white",
                                            textTransform: "uppercase"
                                        }}>{item.title[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        onClick={() => {
                                            selectModel(item)
                                        }}
                                        primary={item.title}
                                        className={"resume3Lines"}
                                        secondary={
                                            <React.Fragment>
                                                {item.preview}
                                            </React.Fragment>
                                        }
                                    />

                                    <Stack>
                                        {selectedModel && selectedModel.uuid === item.uuid &&
                                            <Tooltip title={t("consultationIP.edit_template")}>
                                                <IconButton size="small" onClick={saveChanges}>
                                                    <IconUrl path="setting/edit"/>
                                                </IconButton>
                                            </Tooltip>}
                                        <Tooltip title={t("consultationIP.delete_template")}>
                                            <IconButton size="small"
                                                        onClick={() => {
                                                            setSelected({
                                                                title: t('consultationIP.askRemovemodel'),
                                                                subtitle: t('consultationIP.subtitleRemovemodel'),
                                                                icon: "/static/icons/ic-text.svg",
                                                                name1: item.title,
                                                                name2: t('consultationIP.model'),
                                                                request: {
                                                                    method: "DELETE",
                                                                    url: `${urlMedicalProfessionalSuffix}/certificate-modals/${item.uuid}`,
                                                                    headers: {
                                                                        ContentType: 'application/x-www-form-urlencoded',
                                                                        Authorization: `Bearer ${session?.accessToken}`
                                                                    },
                                                                }
                                                            })
                                                            setOpenRemove(true);
                                                        }}>
                                                <IconUrl path="setting/icdelete"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </Box>
                        ))}

                        {models.length === 0 &&
                            <Stack spacing={2}>
                                <Typography textAlign={"center"} color={"gray"} fontSize={12}>
                                    ( {t("consultationIP.list_empty")} )
                                </Typography>
                                <List>
                                    {
                                        Array.from({length: 3}).map((_, idx) =>
                                            idx === 0 ? <ListItem key={idx} sx={{py: .5}}>
                                                    <Skeleton width={300} height={8} variant="rectangular"/>
                                                </ListItem> :
                                                <ListItem key={idx} sx={{py: .5}}>
                                                    <Skeleton width={10} height={8} variant="rectangular"/>
                                                    <Skeleton sx={{ml: 1}} width={130} height={8}
                                                              variant="rectangular"/>
                                                </ListItem>
                                        )
                                    }

                                </List>
                            </Stack>
                        }
                    </List>
                </Grid>
            </Grid>

            <CustomDialog action={"remove"}
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
        </Box>
    )
}

export default CertifDialog
