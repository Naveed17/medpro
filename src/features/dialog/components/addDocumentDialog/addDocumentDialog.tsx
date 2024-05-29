import React, {useEffect, useState} from "react";
import {
    CircularProgress,
    Dialog,
    DialogContent,
    Grid, IconButton, Menu,
    MenuItem,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import AddDocumentDialogStyled from "./overrides/addDocumentDialogStyle";
import {DocumentButton} from "@features/buttons";
import {useTranslation} from "next-i18next";
import {FileuploadProgress} from "@features/progressUI";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import IconUrl from "@themes/urlIcon";
import Resizer from "react-image-file-resizer";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {LoadingScreen} from "@features/loadingScreen";
import {ImageHandler} from "@features/image";
import useStopwatch from "@lib/hooks/useStopwatch";
import {useAudioRecorder} from "react-audio-voice-recorder";

function AddDocumentDialog({...props}) {
    const {data} = props;
    const router = useRouter();
    const theme = useTheme();
    const {
        minutes,
        seconds,
        start: startWatch,
        reset: resetWatch
    } = useStopwatch({autoStart: false});
    const {
        startRecording,
        stopRecording,
        recordingBlob,
        isPaused
    } = useAudioRecorder();

    const {t, ready} = useTranslation("common");

    const [files, setFiles] = useState<any[]>([]);
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorData, setAnchorData] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);

    const openMenu = Boolean(anchorEl);

    const {data: httpTypeResponse} = useRequestQuery({
        method: "GET",
        url: `/api/private/document/types/${router.locale}`
    }, ReactQueryNoValidateConfig);

    useEffect(() => {
        if (httpTypeResponse) {
            setLoading(false);
        }
    }, [httpTypeResponse]);

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file.file !== file));
    };

    const closeMenu = () => {
        setAnchorEl(null);
        setAnchorData(null);
    }

    const startRecord = () => {
        closeMenu();
        setIsRecording(true);
        startRecording();
        startWatch();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoad(true);
        const filesAccepted = e.target.files;
        let docs: any = [];
        if (filesAccepted) {
            Array.from(filesAccepted).forEach((file) => {
                if (file.size > 40000000) {
                    setError(`big`);
                    setLoad(false);
                    return null;
                } else if (file.name.length > 80) {
                    setError(`long`);
                    setLoad(false);
                    return null;
                } else {
                    if (file.type.includes('image')) {
                        Resizer.imageFileResizer(file,
                            850,
                            850,
                            file.type.split('/')[1],
                            80,
                            0,
                            (uri) => {
                                docs.push({type: type, file: uri, progress: 100})
                                setFiles([...files, ...docs]);
                                setLoad(false);
                            },
                            "file")
                    } else {
                        docs.push({type, file, progress: 100})
                        setTimeout(() => {
                            setFiles([...files, ...docs]);
                            setLoad(false);
                        }, 1000);
                    }
                }
            })
        } else {
            setLoad(false);
        }

        setTimeout(() => {
            const el = document.getElementById("label")
            if (el)
                el.scrollIntoView(true);
            setError('')
        }, 1500);

        if (anchorEl) {
            closeMenu();
        }
    }

    useEffect(() => {
        if (!recordingBlob) return;

        const file = new File([recordingBlob], `Enregistrement audio`, {
            type: 'audio/mpeg',
            lastModified: Date.now()
        });

        let audio: any = [];
        audio.push({type, file, progress: 100})
        setFiles([...files, ...audio]);
        setIsRecording(false);
        resetWatch(0, false);
        // recordingBlob will be present at this point after 'stopRecording' has been called
    }, [recordingBlob]) // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        data.state.files = files;
        data.setState(data.state);
        data.handleUpdateFiles && data.handleUpdateFiles(files);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <AddDocumentDialogStyled>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Typography fontWeight={600} mb={2} variant="subtitle2">
                        {t("type_of_document")}
                    </Typography>
                    <Grid container spacing={1} mt={2} margin={"auto"}>
                        {loading
                            ? Array.from(new Array(6)).map((val, idx) => (
                                <Grid key={"loading-card-" + idx} item xs={6} sm={4} md={2}>
                                    <DocumentButton
                                        selected={""}
                                        height={100}
                                        paddingTop={20}
                                        loading
                                        active={data.state.type}
                                    />
                                </Grid>
                            ))
                            : ((httpTypeResponse as HttpResponse)?.data ?? []).map(
                                (item: any, index: number) => (
                                    <Grid key={index} item xs={6} sm={4} md={2}>
                                        <DocumentButton
                                            {...{t}}
                                            type={item.slug}
                                            icon={item.logo.url}
                                            active={data.state.type}
                                            lable={item.name}
                                            acceptedFormat={item.acceptedFormat}
                                            uuid={item.uuid}
                                            selected={type}
                                            height={100}
                                            onChange={handleChange}
                                            onClick={(v: string, event: React.MouseEvent<HTMLElement>) => {
                                                setType(v);
                                                setAnchorData(item);
                                                data.state.type = v;
                                                data.setState(data.state);
                                                if (item.slug === "audio") {
                                                    setAnchorEl(event.currentTarget)
                                                }
                                            }}
                                        />
                                    </Grid>
                                )
                            )}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    {(isRecording || files.length === 0) &&
                        <Stack width={{xs: "100%", md: "80%"}}
                               margin={"auto"}
                               mt={6}
                               spacing={1}
                               padding={2}
                               border={`1px dashed ${theme.palette.grey["200"]}`}
                               borderRadius={2}>
                            {isRecording ?
                                <Stack alignItems={"center"} spacing={2}>
                                    <Typography>{t("start-record")}</Typography>
                                    <Stack alignItems={"center"} spacing={.5}>
                                        <IconButton className={"micro"}
                                                    onClick={(event: any) => {
                                                        event.stopPropagation();
                                                        stopRecording();
                                                    }}>
                                            <IconUrl path={"ic-stop-record"}
                                                     color={theme.palette.text.primary} width={30}
                                                     height={30}/>
                                        </IconButton>

                                        <Typography className={"recording-text"}
                                                    id={'timer'}
                                                    style={{fontSize: 14, ...(isPaused && {color: theme.palette.text.primary})}}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Typography>
                                    </Stack>
                                </Stack>
                                :
                                <Stack alignItems={"center"} spacing={2}>
                                    <div style={{width: "fit-content", margin: "auto"}}>
                                        <IconUrl path="fileadd" width={80} height={80}/>
                                    </div>
                                    <Stack alignItems={"center"} spacing={.5}>
                                        {load && <div style={{width: "fit-content", margin: "auto"}}>
                                            <CircularProgress style={{margin: "auto"}}/>
                                        </div>}
                                        <Typography variant="subtitle1"
                                                    color="text.primary"
                                                    textAlign={"center"}>{t("type_of_document")}</Typography>
                                        <Typography textAlign={"center"} fontSize={12}>{t("to_upload")}</Typography>
                                    </Stack>
                                </Stack>
                            }
                        </Stack>}
                    <Stack spacing={2} maxWidth="90%" width={1} mx="auto" mt={3}>
                        <Grid container spacing={1} alignItems="flex-start">
                            < Grid item xs={12} lg={12}>
                                {files.length > 0 && <Typography
                                    mt={1}
                                    mb={1}
                                    id={"label"}
                                    color="text.secondary"
                                    variant="body2"
                                    fontWeight={600}>
                                    {t("name_of_the_document")}
                                </Typography>}

                                <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                                    {files?.map((file: any, index: number) => (
                                        <FileuploadProgress
                                            key={index}
                                            file={file.file}
                                            progress={file.progress}
                                            handleRemove={handleRemove}
                                        />
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={closeMenu}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
                <MenuItem>
                    <Stack onClick={() => startRecord()} direction={"row"} alignItems={"center"} spacing={1}>
                        <ImageHandler src={anchorData?.logo.url} width="20" height="20"/>
                        <Typography>{t("record-audio")}</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <ImageHandler src={"/static/icons/fileadd.svg"} width="20" height="20"/>
                        <Typography>{t("upload-audio")}</Typography>
                        <input type="file" accept={anchorData?.acceptedFormat} multiple={true}
                               onChange={handleChange}
                               style={{
                                   width: '100%',
                                   height: '100%',
                                   position: 'absolute',
                                   left: 0,
                                   top: 0,
                                   opacity: 0
                               }}/>
                    </Stack>
                </MenuItem>
            </Menu>
            <Dialog
                open={error !== ''}
                aria-labelledby="draggable-dialog-title">
                <DialogContent>
                    <Stack spacing={1} alignItems={"center"}>
                        <IconUrl path={"fileError"} width={30} height={30}/>
                        <Typography>{t(error)}</Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
        </AddDocumentDialogStyled>
    );
}

export default AddDocumentDialog;
