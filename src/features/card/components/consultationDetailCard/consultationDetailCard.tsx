import React, {useEffect, useRef, useState} from 'react'
import {Autocomplete, Box, CardContent, MenuItem, Stack, TextField, Typography} from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'
import {Form, FormikProvider, useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {SetExam, SetListen} from "@features/toolbar/components/consultationIPToolbar/actions";
import {consultationSelector} from "@features/toolbar";
import {LoadingScreen} from "@features/loadingScreen";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import moment from "moment-timezone";
import {pxToRem} from "@themes/formatFontSize";
import RecondingBoxStyle from './overrides/recordingBoxStyle';

function CIPPatientHistoryCard({...props}) {
    const {exam: defaultExam, changes, setChanges, uuind, appointement} = props
    const {exam, listen} = useAppSelector(consultationSelector);
    const [cReason, setCReason] = useState<ConsultationReasonModel[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    let [time, setTime] = useState('00:00');
    let [oldNote, setOldNote] = useState('');
    const dispatch = useAppDispatch();
    const {
        transcript,
        resetTranscript,
        listening,
    } = useSpeechRecognition();


    const intervalref = useRef<number | null>(null);
    const storageData = JSON.parse(localStorage.getItem(`consultation-data-${uuind}`) as string);
    const app_data = defaultExam?.appointment_data;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            motif: storageData?.motif ? storageData.motif :
                (app_data?.consultation_reason ? app_data?.consultation_reason.uuid : ""),
            notes: storageData?.notes ? storageData.notes :
                (app_data?.notes ? app_data?.notes.value : ""),
            diagnosis: storageData?.diagnosis ? storageData.diagnosis :
                (app_data?.diagnostics ? app_data?.diagnostics.value : ""),
            treatment: exam.treatment,
        },
        onSubmit: async (values) => {
            console.log('ok', values);
        },
    });

    const {handleSubmit, values, setFieldValue} = formik;

    useEffect(() => {
        if (defaultExam) {
            setCReason(defaultExam?.consultation_reasons);
            // set data data from local storage to redux
            dispatch(
                SetExam({
                    ...values
                })
            );
            localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                ...values
            }));
            console.log(values)
        }
    }, [defaultExam]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isStarted) {
            const notes = `${(oldNote ? oldNote : "")}  ${transcript}`;
            setFieldValue("notes", notes);
            localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                ...storageData,
                notes
            }));
            // set data data from local storage to redux
            dispatch(
                SetExam({
                    notes
                })
            );
        }
    }, [isStarted, setFieldValue, transcript])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const item = changes.find((change: { name: string }) => change.name === "fiche")
        item.checked = Object.values(values).filter(val => val !== '').length > 0;
        setChanges([...changes])
    }, [values])// eslint-disable-line react-hooks/exhaustive-deps

    const startListening = () => {
        SpeechRecognition.startListening({continuous: true, language: 'fr-FR'}).then(() => {
            setIsStarted(true);
            dispatch(SetListen('observation'));
            setOldNote(values.notes);
            if (intervalref.current !== null) return;
            intervalref.current = window.setInterval(() => {
                time = moment(time, 'mm:ss').add(1, 'second').format('mm:ss')
                setTime(time);
            }, 1000);
        })
    }

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" padding={pxToRem(13)} direction="row" alignItems="center"
                   justifyContent={"space-between"} borderBottom={1}
                   borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body1" component="div" color="secondary"
                            fontWeight={600}>
                    <Icon path='ic-edit-file-pen'/>
                    {t("review")}
                </Typography>
            </Stack>
            <CardContent style={{padding: 20}}>
                <FormikProvider value={formik}>
                    <Stack
                        spacing={2}
                        component={Form}
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSubmit}>

                        <Box width={1}>
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                {t("reason_for_consultation")}
                            </Typography>
                            <Autocomplete
                                id={"motif"}
                                disabled={!cReason}
                                autoHighlight
                                disableClearable
                                size="small"
                                value={cReason.find(reason => reason.uuid === values.motif) ?
                                    cReason.find(reason => reason.uuid === values.motif) : ""}
                                onChange={(e, state: any) => {
                                    setFieldValue("motif", state.uuid);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...storageData,
                                        motif: state.uuid
                                    }));
                                    // set data data from local storage to redux
                                    dispatch(
                                        SetExam({
                                            motif: state.uuid
                                        })
                                    );
                                }}
                                sx={{color: "text.secondary"}}
                                options={cReason ? cReason : []}
                                loading={cReason?.length === 0}
                                getOptionLabel={(option) => option?.name ? option.name : ""}
                                isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                renderOption={(props, option) => (
                                    <MenuItem
                                        {...props}
                                        key={'xyq' + option.uuid}
                                        value={option.uuid}>
                                        {option.name}
                                    </MenuItem>
                                )}
                                renderInput={params => <TextField color={"info"}
                                                                  {...params}
                                                                  placeholder={"--"}
                                                                  sx={{paddingLeft: 0}}
                                                                  variant="outlined" fullWidth/>}/>
                        </Box>
                        <Box>
                            {<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                    {t("notes")}
                                </Typography>
                                {(listen === '' || listen === 'observation') && <>
                                    {/*<Typography onClick={() => {
                                        appointement.latestAppointments.map((app: any) => {
                                            const note = app.appointment.appointmentData.find((appdata: any) => appdata.name === "notes")
                                            if (note && note.value !== '')
                                                console.log(app.appointment.dayDate,note.value);
                                        })
                                    }}>Voir historique</Typography>*/}
                                    {
                                        listening && isStarted ? <RecondingBoxStyle onClick={() => {
                                            if (intervalref.current) {
                                                window.clearInterval(intervalref.current);
                                                intervalref.current = null;
                                            }
                                            SpeechRecognition.stopListening();
                                            resetTranscript();
                                            setTime('00:00');
                                            setIsStarted(false)
                                            dispatch(SetListen(''));
                                        }}>
                                            <PauseCircleFilledRoundedIcon style={{fontSize: 14, color: "white"}}/>
                                            <div className={"recording-text"}>{time}</div>
                                            <div className="recording-circle"></div>

                                        </RecondingBoxStyle> : <RecondingBoxStyle onClick={() => {
                                            resetTranscript();
                                            startListening()
                                        }}>
                                            <PlayCircleFilledRoundedIcon style={{fontSize: 16, color: "white"}}/>
                                            <div className="recording-text">{t('listen')}</div>
                                            <MicRoundedIcon style={{fontSize: 14, color: "white"}}/>
                                        </RecondingBoxStyle>
                                    }
                                </>}
                            </Stack>}
                            <TextField
                                fullWidth
                                multiline
                                rows={10}
                                value={values.notes}
                                onChange={event => {
                                    setFieldValue("notes", event.target.value);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...storageData,
                                        notes: event.target.value
                                    }));
                                    // set data data from local storage to redux
                                    dispatch(
                                        SetExam({
                                            notes: event.target.value
                                        })
                                    );
                                }}
                                placeholder={t("hint_text")}
                            />
                        </Box>
                        <Box width={1}>
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                {t("diagnosis")}
                            </Typography>
                            <TextField
                                fullWidth
                                id={"diagnosis"}
                                size="small"
                                value={values.diagnosis}
                                multiline={true}
                                rows={10}
                                onChange={event => {
                                    setFieldValue("diagnosis", event.target.value);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...storageData,
                                        diagnosis: event.target.value
                                    }));
                                    // set data data from local storage to redux
                                    dispatch(
                                        SetExam({
                                            diagnosis: event.target.value
                                        })
                                    );
                                }}
                                sx={{color: "text.secondary"}}/>
                        </Box>
                        {/*<Box>
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                {t("treatment")}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                placeholder={t("enter_your_dosage")}
                                value={values.treatment}
                                onChange={event => {
                                    setFieldValue("treatment", event.target.value);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...values,
                                        treatment: event.target.value
                                    }));
                                }}
                            />
                        </Box>*/}
                    </Stack>
                </FormikProvider>
            </CardContent>
        </ConsultationDetailCardStyled>
    )
}

export default CIPPatientHistoryCard
