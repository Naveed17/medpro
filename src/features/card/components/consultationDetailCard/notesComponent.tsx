import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {RecButton} from "@features/buttons";
import {Editor} from "@tinymce/tinymce-react";
import {MobileContainer, tinymcePlugins, tinymceToolbar} from "@lib/constants";
import React, {useEffect, useState} from "react";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {consultationSelector, SetExam, SetListen} from "@features/toolbar";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";

function NotesComponent({...props}) {

    const {
        saveChanges,
        values,
        setFieldValue,
        t,
        oldNote,
        hasDataHistory,
        mutateSheetData,
        seeHistory,
        isStarted, setIsStarted,
        modelContent,
        fullOb, setFullOb,
        loadChanges, setLoadChanges,
        loading,
        typing, setTyping
    } = props

    const [showToolbar, setShowToolbar] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState("");
    const [openModel, setOpenModel] = useState(false);
    const [titleModel, setTitleModel] = useState("");

    const {transcript, resetTranscript, listening} = useSpeechRecognition();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {listen} = useAppSelector(consultationSelector);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    const dispatch = useAppDispatch();

    const {trigger: triggerObModels} = useRequestQueryMutation("/observation-models");

    const {
        data: httpObservationModelsResponse,
        mutate: mutateObMData
    } = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/observations/${router.locale}`
    } : null, {...ReactQueryNoValidateConfig});

    const models = (httpObservationModelsResponse as HttpResponse)?.data;

    const startStopRec = () => {
        if (listening && isStarted) {
            SpeechRecognition.stopListening();
            setLoadChanges(true)
            saveChanges("notes", values.notes)
            oldNote.current = values.notes;
            resetTranscript();
            setIsStarted(false)
            dispatch(SetListen(''));

        } else {
            startListening();
        }

    }

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({continuous: true, language: 'fr-FR'}).then(() => {
            setIsStarted(true);
            dispatch(SetListen('observation'));
        })
    }

    const saveModel = () => {
        const params = new FormData();
        params.append("content", modelContent.current);
        params.append("title", titleModel);
        triggerObModels({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/observations/${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                mutateObMData().then(() => {
                    setOpenModel(false)
                    setTitleModel('')
                })
            }
        });
    }

    const deleteModel = (itemUuid: string) => {
        triggerObModels({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/observations/${itemUuid}/${router.locale}`,
        }, {
            onSuccess: () => {
                mutateObMData()
            }
        });
    }

    useEffect(() => {
        if (isStarted) {
            const notes = `${(oldNote.current ? oldNote.current : "")}  ${transcript}`;
            setFieldValue("notes", notes);
            dispatch(
                SetExam({
                    notes
                })
            );
        }
    }, [isStarted, setFieldValue, transcript])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("online", () => {
                setTyping("online")
                setTimeout(() => {
                    setTyping("")
                }, 2000)
            });
            window.addEventListener("offline", () => {
                setTyping("offline")
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}
                   mb={1}>
                <Typography variant="body2" fontWeight={500}>
                    {t("notes")}
                </Typography>
                <Stack direction={"row"} spacing={1.2} alignItems={"center"}>

                    {typing === "saved" &&
                        <IconUrl width={20} height={20} path={"ic-saved"}/>}
                    {/*
                    {typing === "typing" &&
                        <IconUrl width={20} height={20} className={"image-clignote"} path={"typing"}/>}
*/}
                    {typing === "offline" &&
                        <IconUrl width={20} height={20} className={"image-clignote"} path={"no-wifi"}/>}
                    {typing === "error" &&
                        <IconUrl width={20} height={20} className={"image-clignote"} path={"ic-error-save"}/>}

                    {(listen === '' || listen === 'observation') &&
                        <Stack direction={"row"} alignItems={"center"} spacing={1.2} ml={1}>
                            {models && models.length > 0 && !isMobile && <Select
                                labelId="select-type"
                                id="select-type"
                                renderValue={selected => {
                                    if (selected.length === 0) {
                                        return <Typography fontSize={12}>{t("models")}</Typography>;
                                    } else {
                                        const model = models?.find((m: {
                                            uuid: string;
                                        }) => m.uuid === selected);
                                        // setFieldValue("notes", model.content);
                                        return <Typography fontSize={12}>{model?.title}</Typography>
                                    }
                                }}
                                value={selectedModel}
                                onChange={(ev) => {
                                    setSelectedModel(ev.target.value)
                                    const model = models?.find((m: {
                                        uuid: string;
                                    }) => m.uuid === ev.target.value);
                                    setFieldValue('notes', model.content)
                                    saveChanges("notes", model.content)
                                }}
                                displayEmpty
                                sx={{
                                    ".MuiSelect-select": {
                                        bgcolor: "white",
                                        padding: 1
                                    },
                                    ".MuiSelect-icon": {
                                        top: 'calc(50% - 0.35em)',
                                        height: '0.7em'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: (theme: Theme) => theme.palette.back.main,

                                            ".MuiMenuItem-root": {
                                                "&:not(:last-child)": {
                                                    mb: 1,
                                                },
                                                borderColor: "divider",
                                                "&:hover": {
                                                    bgcolor: (theme: Theme) =>
                                                        theme.palette.info.main,
                                                    borderRadius: 1,
                                                    img: {
                                                        filter: "brightness(0) invert(1)",
                                                    }
                                                },
                                            },
                                        },
                                    },
                                }}>
                                {models && models.map((model: any) => (
                                    <MenuItem value={model.uuid} key={model.uuid}>
                                        <Stack direction="row"
                                               alignItems="center"
                                               style={{width: "100%"}}
                                               spacing={2}
                                               justifyContent={"space-between"}>
                                            <Typography fontSize={12}>{model.title}</Typography>
                                            <IconButton style={{width: 15, height: 15, paddingTop: 0}} onClick={(e) => {
                                                e.stopPropagation();
                                                deleteModel(model.uuid);
                                            }}>
                                                <IconUrl width={10} height={10} path={"icdelete"}/>
                                            </IconButton>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                            }
                            {hasDataHistory &&
                                <Tooltip title={t('history')}>
                                    <IconButton className={"btn-full"} size={"small"}
                                                onClick={() => seeHistory()}>
                                        <IconUrl path={'history'}/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </Stack>}
                    <Tooltip title={t('toolbar')}>
                        <IconButton
                            className={"btn-full"} size={"small"}
                            disabled={loadChanges}
                            onClick={() => {
                                mutateSheetData && mutateSheetData()
                                setShowToolbar(!showToolbar)
                            }}>
                            <IconUrl path={'tools'}/>
                        </IconButton>
                    </Tooltip>
                    <RecButton
                        small
                        onClick={() => {
                            startStopRec();
                        }}/>
                    <Tooltip title={t(fullOb ? 'reduce' : "zoom")}>
                        <IconButton size={"small"} onClick={(e) => {
                            e.stopPropagation();
                            mutateSheetData && mutateSheetData()
                            setFullOb(!fullOb)
                        }} className={"btn-full"} style={{marginRight: 0, marginLeft: 5}}>
                            <IconUrl path={'fullscreen'}/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>


            {showToolbar && <Editor
                value={values.notes}
                tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                onEditorChange={(event) => {
                    //debouncedOnChange("notes", event)
                    setTyping("typing")
                    setFieldValue("notes", event)
                }}
                onBlur={() => saveChanges("notes", values.notes)}

                disabled={isStarted || loading || typing === "offline"}
                init={{
                    branding: false,
                    statusbar: false,
                    menubar: false,
                    height: fullOb ? "50vh" : 400,
                    toolbar_mode: 'wrap',
                    plugins: tinymcePlugins,
                    toolbar: tinymceToolbar,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}/>}

            {
                !showToolbar && <Editor
                    value={values.notes}
                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                    onEditorChange={(event) => {
                        //debouncedOnChange("notes", event)
                        setTyping("typing")
                        setFieldValue("notes", event)
                    }}
                    onBlur={() => saveChanges("notes", values.notes)}
                    disabled={isStarted || loading || typing === "offline"}
                    init={{
                        branding: false,
                        statusbar: false,
                        menubar: false,
                        height: fullOb ? "50vh" : 200,
                        toolbar: false,
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}/>
            }
            <Stack justifyContent={"flex-end"} direction={"row"} mt={-4}>
                <Tooltip title={t('saveAsModel')}>
                    <IconButton className={"btn-full bookmark"}
                                onClick={() => {
                                    setOpenModel(true)
                                }}
                                size={"small"}>
                        <IconUrl path={'bookmark'}/>
                    </IconButton>
                </Tooltip>
            </Stack>

            <Dialog
                open={openModel}
                scroll={'paper'}
                fullWidth={true}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description">
                <DialogTitle sx={{backgroundColor: theme.palette.primary.main}} id="scroll-dialog-title">
                    {t('model')}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <TextField placeholder={t("title")}
                               style={{width: "100%"}}
                               value={titleModel}
                               onChange={(ev) => {
                                   setTitleModel(ev.target.value);
                               }}></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenModel(false)
                    }}>{t('cancel')}</Button>
                    <Button disabled={titleModel.length === 0} onClick={() => {
                        saveModel()
                    }}>{t('save')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default NotesComponent;
