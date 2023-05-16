import {useTranslation} from "next-i18next";
import React, {useEffect, useRef, useState} from "react";
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
    tooltipClasses,
    Typography
} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import dynamic from "next/dynamic";
import {ModelDot} from "@features/modelDot";
import AddIcon from "@mui/icons-material/Add";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {TooltipProps} from "@mui/material/Tooltip";
import {styled} from "@mui/system";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import RecondingBoxStyle from "@features/card/components/consultationDetailCard/overrides/recordingBoxStyle";
import PauseCircleFilledRoundedIcon from "@mui/icons-material/PauseCircleFilledRounded";
import moment from "moment-timezone";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import IconUrl from "@themes/urlIcon";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {Dialog as CustomDialog} from "@features/dialog";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {useMedicalProfessionalSuffix} from "@lib/hooks";

const CKeditor = dynamic(() => import('@features/CKeditor/ckEditor'), {
    ssr: false,
});

function CertifDialog({...props}) {
    const {data} = props
    const urlMedicalProfessionalSuffix = useMedicalProfessionalSuffix();
    const {data: session} = useSession();
    const router = useRouter();
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();

    const {direction} = useAppSelector(configSelector);

    const colors = ["#FEBD15", "#FF9070", "#DF607B", "#9A5E8A", "#526686", "#96B9E8", "#0696D6", "#56A97F"];
    const [value, setValue] = useState<string>(data.state.content);
    const [selectedColor, setSelectedColor] = useState(["#0696D6"]);
    const [title, setTitle] = useState<string>('');
    const [models, setModels] = useState<CertifModel[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    let [time, setTime] = useState('00:00');
    const [openRemove, setOpenRemove] = useState(false);
    const [selected, setSelected] = useState<any>();
    let [oldNote, setOldNote] = useState('');

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const intervalref = useRef<number | null>(null);

    useEffect(() => {
        if (isStarted) {
            setValue(oldNote + ' ' + transcript)
        }
    }, [transcript, isStarted]) // eslint-disable-line react-hooks/exhaustive-deps

    const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            border: '1px solid #dadde9',
        },
    }));

    const {trigger} = useRequestMutation(null, "/certif-models");

    const {data: httpModelResponse, mutate} = useRequest({
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const selectModel = (model: CertifModel) => {
        setValue(model.content);
        data.state.content = model.content;
        data.state.title = model.title;
        data.setState(data.state)
        setTitle(model.title)
        setSelectedColor([model.color])
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
            mutate().then(() => {
                const stringToHTML = new DOMParser().parseFromString(value, 'text/html').body.firstChild
                models.unshift({
                    color: selectedColor[0],
                    name: title,
                    title: title,
                    preview: (stringToHTML as HTMLElement)?.innerHTML,
                    content: value
                });
                setModels([...models])
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

    const dialogSave = () => {
        trigger(selected.request, {revalidate: true, populateCache: true}).then(() => {
            mutate().then(r => {
                setOpenRemove(false);
                console.log('place removed successfully', r);
            });
        });
    }

    const addVal = (val: string) => {
        const doc = new DOMParser().parseFromString(value, 'text/html')
        const collection = doc.body.lastElementChild as HTMLElement
        if (collection)
            collection.innerText += ' ' + val;

        doc.body.removeChild(doc.body.lastElementChild as HTMLElement)
        doc.body.append(collection)
        setValue(doc.body.innerHTML.toString());

    }

    const {t, ready} = useTranslation("consultation");

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <Box>
            <Grid container>
                <Grid item xs={12} md={9} className={'container-scroll'}>
                    <Box style={{height: 200}} color={'primary.main'}>
                        <Box style={{paddingRight: 20}}>
                            <Typography style={{color: "gray"}} fontSize={12}
                                        mb={1}>{t('consultationIP.title')}</Typography>
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
                                            else setSelectedColor([color])
                                        }}>
                                    </ModelDot>
                                ))}
                            </Stack>

                            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mt={1}>
                                <Stack direction={"row"} alignItems={"center"}>
                                    <Typography style={{color: "gray"}} fontSize={12} mt={1}
                                                mb={1}>{t('consultationIP.contenu')}</Typography>
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="gray" style={{cursor: 'pointer'}} onClick={() => {
                                                    addVal('{patient}')
                                                }}
                                                            fontSize={12}>{"{patient} : nom du patient"}</Typography>
                                                <Typography color="gray" style={{cursor: 'pointer'}} onClick={() => {
                                                    addVal('{doctor}')
                                                }}
                                                            fontSize={12}>{"{doctor} : nom du médecin"}</Typography>
                                                <Typography color="gray" style={{cursor: 'pointer'}} onClick={() => {
                                                    addVal('{aujourd\'hui}')
                                                }}
                                                            fontSize={12}>{"{aujourd'hui} :date d'aujourd'hui"}</Typography>
                                            </React.Fragment>
                                        }
                                    >
                                        <InfoRoundedIcon style={{color: '#ccc', width: '0.7em', margin: '0 5px'}}/>
                                    </HtmlTooltip>
                                </Stack>
                                {
                                    listening && isStarted ? <RecondingBoxStyle onClick={() => {

                                        if (intervalref.current) {
                                            window.clearInterval(intervalref.current);
                                            intervalref.current = null;
                                        }
                                        SpeechRecognition.stopListening();
                                        resetTranscript();
                                        setOldNote(value)
                                        setIsStarted(false)

                                        setTime('00:00');
                                    }}>
                                        <PauseCircleFilledRoundedIcon style={{fontSize: 14, color: "white"}}/>
                                        <div className={"recording-text"}>{time}</div>
                                        <div className="recording-circle"></div>

                                    </RecondingBoxStyle> : <RecondingBoxStyle onClick={() => {
                                        resetTranscript();
                                        setIsStarted(true)
                                        SpeechRecognition.startListening({
                                            continuous: true,
                                            language: 'fr-FR'
                                        }).then(() => {

                                        })
                                        if (intervalref.current !== null) return;
                                        intervalref.current = window.setInterval(() => {
                                            time = moment(time, 'mm:ss').add(1, 'second').format('mm:ss')
                                            setTime(time);
                                        }, 1000);
                                    }}>
                                        <PlayCircleFilledRoundedIcon style={{fontSize: 16, color: "white"}}/>
                                        <div className="recording-text">{t('consultationIP.listen')}</div>
                                        <MicRoundedIcon style={{fontSize: 14, color: "white"}}/>
                                    </RecondingBoxStyle>
                                }
                            </Stack>

                            <CKeditor
                                name="description"
                                value={value}
                                onChange={(res: React.SetStateAction<string>) => {
                                    data.state.content = res;
                                    data.setState(data.state)
                                    setValue(res)
                                }}
                                editorLoaded={true}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={3} style={{borderLeft: '1px solid #DDDDDD'}}>

                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant={'h6'} marginLeft={2} marginTop={1}>{t('Models')}</Typography>
                        <Button sx={{ml: 'auto', height: 1}}
                                size='small'
                                disabled={title.length === 0 || value.length === 0}
                                onClick={() => {
                                    saveModel();
                                }}
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
                            <Box key={`models-${index}`}>
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
