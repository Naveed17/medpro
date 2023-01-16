// components
import React, {useEffect, useRef, useState} from "react";
import ConsultationStyled from "./overrides/consultationStyled";
import {
    Avatar,
    Box,
    Button,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import Content from "./content";
import {collapse as collapseData} from "./config";
import {upperFirst} from "lodash";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import moment from "moment-timezone";
import {toggleSideBar} from "@features/sideBarMenu";
import {appLockSelector} from "@features/appLock";
import {onOpenPatientDrawer} from "@features/table";
import {LoadingScreen} from "@features/loadingScreen";
import {pxToRem} from "@themes/formatFontSize";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import Zoom from "react-medium-image-zoom";
import RecondingBoxStyle from "@features/card/components/consultationDetailCard/overrides/recordingBoxStyle";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import PauseCircleFilledRoundedIcon from "@mui/icons-material/PauseCircleFilledRounded";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import MicRoundedIcon from "@mui/icons-material/MicRounded";

function Consultation() {
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();
    const {t, ready} = useTranslation("consultation", {keyPrefix: "filter"});
    const {patient} = useAppSelector(consultationSelector);
    const {lock} = useAppSelector(appLockSelector);

    const [loading, setLoading] = useState<boolean>(true);
    const [number, setNumber] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [isNote, setIsNote] = useState(false);
    const [collapse, setCollapse] = useState<any>(-1);
    const [isStarted, setIsStarted] = useState(false);
    let [time, setTime] = useState('00:00');

    const intervalref = useRef<number | null>(null);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    useEffect(() => {
        if (isStarted) {
            setNote(transcript);
        }
    }, [transcript, isStarted])

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const {data: httpPatientPhotoResponse} = useRequest(patient?.hasPhoto ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const editPatientInfo = () => {
        const params = new FormData();
        if (patient) {
            params.append('note', note);
            patient.fiche_id && params.append('fiche_id', patient.fiche_id);
            patient.email && params.append('email', patient.email);
            patient.family_doctor && params.append('family_doctor', patient.family_doctor);
            patient.profession && params.append('profession', patient.profession);
            patient.birthdate && params.append('birthdate', patient.birthdate);
            params.append('first_name', patient.firstName);
            params.append('last_name', patient.lastName);
            params.append('phone', JSON.stringify(patient.contact));
            params.append('gender', patient.gender);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('country', patient?.address[0]?.city?.country?.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('region', patient?.address[0]?.city?.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('zip_code', patient?.address[0]?.postalCode);
            patient?.address && patient?.address.length > 0 && patient?.address[0].street && params.append('address', patient?.address[0]?.street);
            patient.idCard && params.append('idCard', patient.idCard);
        }

        triggerPatientUpdate({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient?.uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        }).then(() => {

        });
    }

    useEffect(() => {
        if (patient && !lock) {
            dispatch(toggleSideBar(false));
            setNumber(patient.contact[0]);
            setEmail(patient.email);
            setNote(patient.note ? patient.note : "");
            setName(`${patient.firstName} ${patient.lastName}`);
            setLoading(false);
        }
    }, [patient]); // eslint-disable-line react-hooks/exhaustive-deps

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <ConsultationStyled>
            <Box className="header">
                <Box className="about">
                    <label htmlFor="contained-button-file">
                        <Zoom>
                            <Avatar
                                src={patientPhoto ? patientPhoto : (patient?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                                sx={{width: 59, height: 59, marginLeft: 2, marginRight: 2, borderRadius: 2}}>
                                <IconUrl width={"59"} height={"59"} path="men-avatar"/>
                            </Avatar>
                        </Zoom>
                    </label>

                    <Box>
                        {loading ?
                            <>
                                <Skeleton width={130} variant="text"/>
                                <Skeleton variant="text"/>
                                <Skeleton variant="text"/>
                                <Skeleton variant="text"/>
                            </> : <Box style={{cursor: 'pointer'}}>

                                <Typography variant="body1" color='primary.main'
                                            sx={{fontFamily: 'Poppins'}}>{name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {patient?.birthdate} (
                                    {patient?.birthdate
                                        ? moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), "years")
                                        : "--"}{" "}
                                    {t("year")})
                                </Typography>

                                {number && <Typography component="div"
                                                       sx={{
                                                           display: 'flex',
                                                           alignItems: 'center',
                                                           '& .react-svg': {mr: 0.8},
                                                           mb: (0.3)
                                                       }}
                                                       variant="body2" color="text.secondary"><Icon path="ic-phone"/>
                                    {(number.code ? number.code + ' ' : '') + number.value}
                                </Typography>}

                                <Typography component="div"
                                            sx={{display: 'flex', alignItems: 'center', '& .react-svg': {mr: 0.8}}}
                                            variant="body2" color="text.secondary"><Icon path="ic-message-contour"/>
                                    {email ? email : t('addMail')}
                                </Typography>

                            </Box>}
                    </Box>

                    <Box onClick={() => {
                        dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                    }}>
                        <IconButton size={"small"} sx={{position: "absolute", top: 20, right: 10}}>
                            <Icon path={'ic-duotone'}/>
                        </IconButton>
                    </Box>

                </Box>
                {patient?.fiche_id && <Stack spacing={1} mb={-2} mt={2} ml={3}>
                    {/*{false && <Alert icon="ic-danger" color="warning" sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                    <Typography color="text.primary">{upperFirst(t(`duplicate detection`))}</Typography>
                </Alert>}*/}
                    <Button variant="consultationIP" startIcon={<FolderRoundedIcon/>}
                            sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0, px: 1.5}}>
                        {upperFirst(t('ficheID'))} <span style={{fontWeight:"bold"}}>{patient?.fiche_id}</span>
                    </Button>
                </Stack>}
                <Box className="contact" ml={1}>
                    <ListItem
                        className="list-parent"
                        style={{padding: '13px 15px 3px 0'}}
                        onClick={() => {
                            setIsNote(!isNote)
                        }}>
                        <ListItemIcon>
                            <Icon path={'ic-text'}/>
                        </ListItemIcon>
                        <Typography fontWeight={700}>
                            {upperFirst(t("note"))}
                        </Typography>
                        <IconButton size="small" sx={{ml: "auto"}}>
                            <Icon path="ic-expand-more"/>
                        </IconButton>
                    </ListItem>

                    {!isNote && note &&
                        <Stack direction={"row"} spacing={1} justifyContent={"space-between"}
                               mr={2}>
                            <Typography fontStyle={"italic"}
                                        whiteSpace={'pre-line'}
                                        onClick={() => {
                                            setIsNote(true)
                                        }}
                                        variant="body2" color="text.secondary" mt={1}>
                                {note}
                            </Typography>

                            <IconButton size={"small"} onClick={() => {
                                setIsNote(!isNote)
                            }}>
                                <Icon path={'ic-duotone'}/>
                            </IconButton>
                        </Stack>
                    }

                    <Collapse in={isNote}>
                        <Box mr={2}>
                            <Stack alignItems={"end"} mt={1}>
                                {
                                    listening && isStarted ? <RecondingBoxStyle onClick={() => {

                                        if (intervalref.current) {
                                            window.clearInterval(intervalref.current);
                                            intervalref.current = null;
                                        }
                                        SpeechRecognition.stopListening();
                                        resetTranscript();
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
                                        <div className="recording-text">{t('listen')}</div>
                                        <MicRoundedIcon style={{fontSize: 14, color: "white"}}/>
                                    </RecondingBoxStyle>
                                }
                            </Stack>

                            <TextField inputProps={{style: {fontSize: 12, padding: 0}}}
                                       placeholder={t('writenote')}
                                       fullWidth
                                       multiline
                                       style={{marginTop: 5}}
                                       value={note}
                                       onChange={(val) => {
                                           setNote(val.target.value)
                                       }
                                       }
                                       rows={3}/>
                            <Button
                                onClick={() => {
                                    setIsNote(false);
                                    editPatientInfo()
                                }}
                                size="small"
                                //startIcon={<Add/>}
                                style={{paddingBottom: pxToRem(0), marginTop: 10}}>
                                {t("save")}
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            </Box>

            <Stack ml={-1.25}>
                <List dense>
                    {collapseData?.map((col, idx: number) => (
                        <React.Fragment key={`list-item-${idx}`}>
                            <ListItem
                                className="list-parent"
                                onClick={() => setCollapse(collapse === col.id ? "" : col.id)}
                            >
                                <ListItemIcon>
                                    <Icon path={col.icon}/>
                                </ListItemIcon>
                                <Typography fontWeight={700}>
                                    {upperFirst(t(col.title))}
                                    {col.id === 2 && (
                                        <Typography
                                            fontWeight={500}
                                            ml={1}
                                            component="span"
                                        ></Typography>
                                    )}
                                </Typography>
                                <IconButton size="small" sx={{ml: "auto"}}>
                                    <Icon path="ic-expand-more"/>
                                </IconButton>
                            </ListItem>
                            <ListItem sx={{p: 0}}>
                                <Collapse in={collapse === col.id} sx={{width: 1}}>
                                    <Box px={1.5}>
                                        <Content id={col.id} patient={patient}/>
                                    </Box>
                                </Collapse>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Stack>
        </ConsultationStyled>
    );
}

export default Consultation;
