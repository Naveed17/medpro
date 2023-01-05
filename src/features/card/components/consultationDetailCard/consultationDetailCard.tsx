import React, {useEffect, useRef, useState} from 'react'
import {Box, Button, CardContent, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'
import {Form, FormikProvider, useFormik} from "formik";
import {ModelDot} from "@features/modelDot";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {SetExam} from "@features/toolbar/components/consultationIPToolbar/actions";
import {consultationSelector} from "@features/toolbar";
import {LoadingScreen} from "@features/loadingScreen";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {styled} from '@mui/material/styles';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import moment from "moment-timezone";
import {pxToRem} from "@themes/formatFontSize";
import {useRequestMutation} from "@app/axios";
import RecondingBoxStyle from './overrides/recordingBoxStyle';



function CIPPatientHistoryCard({...props}) {
    const {exam: defaultExam, changes, setChanges, uuind, agenda, mutateDoc, medical_entity, session, router} = props
    const {exam} = useAppSelector(consultationSelector);
    const [cReason, setCReason] = useState<ConsultationReasonModel[]>([]);
    const dispatch = useAppDispatch();
    const {
        transcript,
        listening,
    } = useSpeechRecognition();

    let [time, setTime] = useState('00:00');

    const intervalref = useRef<number | null>(null);

    const formik = useFormik({
        initialValues: {
            motif: exam.motif,
            notes: exam.notes,
            diagnosis: exam.diagnosis,
            treatment: exam.treatment,
        },
        onSubmit: async (values) => {
            console.log('ok', values);
        },
    });

    const {handleSubmit, values, setFieldValue} = formik;




    useEffect(() => {
        setCReason(defaultExam?.consultation_reasons)
    }, [defaultExam]);

    useEffect(() => {
        setFieldValue("notes", transcript);
    }, [setFieldValue, transcript])

    useEffect(() => {
        if (exam) {
            Object.entries(exam).map((value) => {
                setFieldValue(value[0], value[1]);
            });
        }
    }, [exam, setFieldValue]);

    useEffect(() => {
        const item = changes.find((change: { name: string }) => change.name === "fiche")
        item.checked = Object.values(values).filter(val => val !== '').length > 0;
        setChanges([...changes])
    }, [values])// eslint-disable-line react-hooks/exhaustive-deps

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
                <button hidden={true} className={'sub-exam'} onClick={() => {
                    dispatch(SetExam(values))
                }}></button>
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
                            <Select
                                fullWidth
                                id={"motif"}
                                size="small"
                                value={values.motif}
                                onChange={event => {
                                    setFieldValue("motif", event.target.value);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...values,
                                        motif: event.target.value
                                    }));
                                }}
                                displayEmpty
                                renderValue={selected => {
                                    if (selected.length === 0) {
                                        return <em>--</em>;
                                    }

                                    const creason = cReason?.find(cr => cr.uuid === selected);
                                    return (
                                        <Box sx={{display: "inline-flex"}}>
                                            <Typography>{creason?.name}</Typography>
                                        </Box>
                                    )
                                }}>
                                {
                                    cReason?.map(cr => (
                                        <MenuItem key={'xyq' + cr.uuid} value={cr.uuid}>
                                            <ModelDot color={cr.color} selected={false} size={21} sizedot={13}
                                                      padding={3} marginRight={15}></ModelDot>
                                            {cr.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </Box>
                        <Box>
                            {<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                    {t("notes")}
                                </Typography>
                                {
                                    listening ? <RecondingBoxStyle onClick={() => {
                                        console.log('hello')

                                        if (intervalref.current) {
                                            window.clearInterval(intervalref.current);
                                            intervalref.current = null;
                                        }
                                        SpeechRecognition.stopListening();

                                        setTime('00:00');
                                    }}>
                                        <PauseCircleFilledRoundedIcon style={{fontSize: 14, color: "white"}}/>
                                        <div className={"recording-text"}>{time}</div>
                                        <div className="recording-circle"></div>

                                    </RecondingBoxStyle> : <RecondingBoxStyle onClick={() => {

                                        SpeechRecognition.startListening({continuous: true}).then(() => {

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
                            </Stack>}
                            <TextField
                                fullWidth
                                multiline
                                rows={9}
                                value={values.notes}
                                onChange={event => {
                                    setFieldValue("notes", event.target.value);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...values,
                                        notes: event.target.value
                                    }));
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
                                onChange={event => {
                                    setFieldValue("diagnosis", event.target.value);
                                    localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
                                        ...values,
                                        diagnosis: event.target.value
                                    }));
                                }}
                                sx={{color: "text.secondary"}}/>
                        </Box>
                        <Box>
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
                        </Box>
                    </Stack>
                </FormikProvider>
            </CardContent>
        </ConsultationDetailCardStyled>
    )
}

export default CIPPatientHistoryCard
