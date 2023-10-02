import React, {useEffect, useState} from 'react'
import {
    Autocomplete,
    Box,
    CardContent,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'
import {Form, FormikProvider, useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {SetExam, SetListen} from "@features/toolbar/components/consultationIPToolbar/actions";
import {consultationSelector} from "@features/toolbar";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import CircularProgress from "@mui/material/CircularProgress";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {RecButton} from "@features/buttons";
import {dashLayoutSelector} from "@features/base";
import {filterReasonOptions, useMedicalEntitySuffix} from "@lib/hooks";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import dynamic from "next/dynamic";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {debounce} from "lodash";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {Editor} from "@tinymce/tinymce-react";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function CIPPatientHistoryCard({...props}) {
    const {
        exam: defaultExam,
        changes,
        setChanges,
        app_uuid,
        hasDataHistory,
        seeHistory,
        closed,
        handleClosePanel,
        isClose,
        agenda,
        trigger: triggerAppointmentEdit
    } = props;
    const router = useRouter();
    const theme = useTheme();

    const dispatch = useAppDispatch();
    const {transcript, resetTranscript, listening} = useSpeechRecognition();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {exam, listen} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [loadingReq, setLoadingReq] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    let [oldNote, setOldNote] = useState('');
    let [diseases, setDiseases] = useState<string[]>([]);
    const [closeExam, setCloseExam] = useState<boolean>(closed);
    const [hide, setHide] = useState<boolean>(false);
    const [editNote, setEditNote] = useState<boolean>(false);
    const [editDiagnosic, setEditDiagnosic] = useState<boolean>(false);

    const {trigger: triggerAddReason} = useRequestQueryMutation("/motif/add");
    const {trigger: triggerDiseases} = useRequestQueryMutation("/diseases");

    const {data: httpConsultReasonResponse, mutate: mutateReasonsData} = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medicalEntityHasUser && {variables: {query: '?sort=true'}})
    });

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data;


    const app_data = defaultExam?.appointment_data;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            motif: app_data?.consultation_reason ? app_data?.consultation_reason.map((reason: ConsultationReasonModel) => reason.uuid) : [],
            notes: app_data?.notes ? app_data?.notes.value : "",
            diagnosis: app_data?.diagnostics ? app_data?.diagnostics.value : "",
            disease: app_data?.disease && app_data?.disease.value.length > 0 ? app_data?.disease.value.split(',') : [],
            treatment: exam.treatment,
        },
        onSubmit: async (values) => {
            console.log('ok', values);
        },
    });

    const {handleSubmit, values, setFieldValue} = formik;
    const startStopRec = () => {
        if (listening && isStarted) {
            SpeechRecognition.stopListening();
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
            setOldNote(values.notes);
        })
    }
    const handleReasonChange = (reasons: ConsultationReasonModel[]) => {
        handleOnChange('consultation_reason', reasons.map(reason => reason.uuid))
        setFieldValue("motif", reasons.map(reason => reason.uuid));
        // set data data from local storage to redux
        dispatch(
            SetExam({
                motif: reasons.map(reason => reason.uuid)
            })
        );
    }
    const addNewReason = (name: string) => {
        setLoadingReq(true);
        const params = new FormData();
        params.append("color", "#0696D6");
        params.append("duration", "15");
        params.append("isEnabled", "true");
        params.append("translations", JSON.stringify({
            [router.locale as string]: name
        }));

        medicalEntityHasUser && triggerAddReason({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`,
            data: params
        }, {
            onSuccess: () => mutateReasonsData().then((result: any) => {
                const {status} = result?.data;
                const reasonsUpdated = (result?.data as HttpResponse)?.data as ConsultationReasonModel[];
                if (status === "success") {
                    handleReasonChange([...reasons.filter((reason: {
                        uuid: any;
                    }) => exam.motif.includes(reason.uuid)), reasonsUpdated[0]]);
                }
                setLoadingReq(false);
            })
        });
    }

    const findDiseases = (name: string) => {
        triggerDiseases({
            method: "GET",
            url: `/api/private/diseases/${router.locale}?name=${name}`
        }, {
            onSuccess: res => {
                let resultats: any[] = [];
                (res as any).data.data.map((r: { data: { title: { [x: string]: any; }; }; }) => {
                    resultats.push(r.data.title['@value']);
                });
                setDiseases(resultats);
            }
        });
    }

    const handleOnChange = (event: string, newValue: any) => {
        setFieldValue(event, newValue);
        // set data data from local storage to redux
        dispatch(
            SetExam({
                [`${event}`]: newValue
            })
        );
        saveChanges(event, newValue);
    }

    const saveChanges = (ev: string, newValue: any) => {
        const form = new FormData();
        form.append(ev === 'diagnosis' ? 'diagnostic' : ev, newValue);

        triggerAppointmentEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        })
    }

    useEffect(() => {
        setHide(closed && !isClose)
    }, [isClose, closed])

    useEffect(() => {
        dispatch(
            SetExam({
                motif: app_data?.consultation_reason ?
                    app_data?.consultation_reason.map((reason: ConsultationReasonModel) => reason.uuid) : [],
                notes: app_data?.notes ? app_data?.notes.value : "",
                diagnosis: app_data?.diagnostics ? app_data?.diagnostics.value : "",
                disease: app_data?.disease && app_data?.disease.value.length > 0 ? app_data?.disease.value.split(',') : [],
                treatment: exam.treatment
            })
        );
    }, [app_data])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isStarted) {
            const notes = `${(oldNote ? oldNote : "")}  ${transcript}`;
            setFieldValue("notes", notes);

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

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" padding={'0.45rem'}
                   direction="row"
                   alignItems="center"
                   justifyContent={hide ? "" : "space-between"}
                   spacing={2}
                   borderBottom={hide ? 0 : 1}
                   sx={{
                       position: hide ? "absolute" : "static",
                       transform: hide ? "rotate(90deg)" : "rotate(0)",
                       transformOrigin: "left",
                       width: hide ? "44.5rem" : "auto",
                       left:  23,
                       top: -26,
                   }}
                   borderColor="divider">
                {hide && <IconButton
                    sx={{display: {xs: "none", md: "flex"}}}
                    onClick={() => {
                        setCloseExam(!closeExam);
                        handleClosePanel(!closeExam);
                    }}
                    className="btn-collapse"
                    disableRipple>
                    <KeyboardArrowDownRoundedIcon/>
                </IconButton>}
                <Typography display='flex' alignItems="center" variant="body1" component="div" color="secondary"
                            fontWeight={600}>
                    <Icon path='ic-edit-file-pen'/>
                    {t("review")}
                </Typography>

                {!hide && <IconButton
                    sx={{display: {xs: "none", md: "flex"}}}
                    onClick={() => {
                        setCloseExam(!closeExam);
                        handleClosePanel(!closeExam);
                    }}
                    className="btn-collapse"
                    disableRipple>
                    <ArrowForwardIosIcon/>
                </IconButton>}
            </Stack>
            <CardContent style={{padding: 20}}>
                <FormikProvider value={formik}>
                    <Stack
                        spacing={2}
                        component={Form}
                        autoComplete="off"
                        noValidate
                        style={{display: hide ? "none" : "block"}}
                        onSubmit={handleSubmit}>

                        <Box width={1}>
                            <Typography variant="body2" paddingBottom={1} fontWeight={500}>
                                {t("reason_for_consultation")}
                            </Typography>
                            <Autocomplete
                                id={"motif"}
                                disabled={!reasons}
                                freeSolo
                                multiple
                                autoHighlight
                                disableClearable
                                size="small"
                                value={values.motif && reasons ? reasons.filter((reason: {
                                    uuid: any;
                                }) => values.motif.includes(reason.uuid)) : []}
                                onChange={(e, newValue: any) => {
                                    e.stopPropagation();
                                    const addReason = newValue.find((val: any) => Object.keys(val).includes("inputValue"))
                                    if (addReason) {
                                        // Create a new value from the user input
                                        addNewReason(addReason.inputValue);
                                    } else {
                                        handleReasonChange(newValue);
                                    }

                                }}
                                filterOptions={(options, params) => filterReasonOptions(options, params, t)}
                                sx={{color: "text.secondary"}}
                                options={reasons ? reasons.filter((item: { isEnabled: any; }) => item.isEnabled) : []}
                                loading={reasons?.length === 0}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.name;
                                }}
                                isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                                renderOption={(props, option) => (
                                    <Stack key={option.uuid ? option.uuid : "-1"}>
                                        {!option.uuid && <Divider/>}
                                        <MenuItem
                                            {...props}
                                            {...(!option.uuid && {sx: {color: theme.palette.error.main}})}
                                            value={option.uuid}>
                                            {!option.uuid && <AddOutlinedIcon/>}
                                            {option.name}
                                        </MenuItem>
                                    </Stack>
                                )}
                                renderInput={params => <TextField color={"info"}
                                                                  {...params}
                                                                  InputProps={{
                                                                      ...params.InputProps,
                                                                      endAdornment: (
                                                                          <React.Fragment>
                                                                              {loadingReq ?
                                                                                  <CircularProgress color="inherit"
                                                                                                    size={20}/> : null}
                                                                              {params.InputProps.endAdornment}
                                                                          </React.Fragment>
                                                                      ),
                                                                  }}
                                                                  placeholder={"--"}
                                                                  sx={{paddingLeft: 0}}
                                                                  variant="outlined" fullWidth/>}/>
                        </Box>
                        <Box>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                <Typography variant="body2" fontWeight={500}>
                                    {t("notes")}
                                </Typography>
                                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                    {(listen === '' || listen === 'observation') && <>
                                        {hasDataHistory &&
                                            <Typography
                                                color={"primary"} style={{cursor: "pointer"}}
                                                onClick={() => seeHistory()}>
                                                {t('seeHistory')}
                                            </Typography>}
                                    </>}
                                    <RecButton
                                        small
                                        onClick={() => {
                                            startStopRec();
                                        }}/>
                                </Stack>
                            </Stack>
                            {
                                !editNote && <div className={"contentPreview"}
                                               onClick={() => {
                                                   setEditNote(true)
                                               }}
                                               dangerouslySetInnerHTML={{__html: values.notes ? values.notes : '<p class="preview">--</p>'}}/>
                            }
                            {
                                editNote && <Editor
                                value={values.notes}
                                apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                                onEditorChange={(event) => {
                                    setFieldValue("notes", event);
                                }}
                                onBlur={()=>{
                                    saveChanges("notes",values.notes)
                                }}
                                init={{
                                    branding: false,
                                    statusbar: false,
                                    menubar: false,
                                    height: 200,
                                    toolbar_mode: 'scrolling',
                                    plugins: " advlist anchor autolink autosave charmap codesample directionality  emoticons    help image insertdatetime link  lists media   nonbreaking pagebreak searchreplace table visualblocks visualchars wordcount",
                                    toolbar: "bold italic underline forecolor backcolor  |fontsize fontfamily|  align lineheight checklist bullist numlist  ",
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}/>
                            }
                        </Box>
                        <Box width={1}>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                <Typography variant="body2" fontWeight={500}>
                                    {t("diagnosis")}
                                </Typography>
                            </Stack>
                            {
                                !editDiagnosic && <div className={"contentPreview"}
                                                  onClick={() => {
                                                      setEditDiagnosic(true)
                                                  }}
                                                  dangerouslySetInnerHTML={{__html: values.diagnosis ? values.diagnosis : '<p class="preview">--</p>'}}/>
                            }
                            {
                                editDiagnosic && <Editor
                                    value={values.diagnosis}
                                    apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                                    onEditorChange={(event) => {
                                        setFieldValue("diagnosis", event)
                                    }}
                                    onBlur={()=>{saveChanges("diagnosis",values.diagnosis)}}
                                    init={{
                                        branding: false,
                                        statusbar: false,
                                        menubar: false,
                                        height: 200,
                                        toolbar_mode: 'scrolling',
                                        plugins: " advlist anchor autolink autosave charmap codesample directionality  emoticons    help image insertdatetime link  lists media   nonbreaking pagebreak searchreplace table visualblocks visualchars wordcount",
                                        toolbar: "bold italic underline forecolor backcolor  |fontsize fontfamily|  align lineheight checklist bullist numlist  ",
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}/>
                            }
                        </Box>
                        <Box width={1}>
                            <Typography variant="body2" paddingBottom={1} fontWeight={500}>
                                {t("disease")}
                            </Typography>
                            <Autocomplete
                                id={"diseases"}
                                freeSolo
                                multiple
                                autoHighlight
                                disableClearable
                                size="small"
                                value={values.disease}
                                onChange={(e, newValue: any) => {
                                    e.stopPropagation();
                                    //handleDiseasesChange(newValue)
                                    handleOnChange("disease", newValue)
                                }}
                                filterOptions={(options, params) => {
                                    const {inputValue} = params;
                                    if (inputValue.length > 0) options.unshift(inputValue)
                                    return options
                                }}
                                sx={{color: "text.secondary"}}
                                options={diseases}
                                renderInput={params => <TextField color={"info"}
                                                                  {...params}
                                                                  InputProps={{
                                                                      ...params.InputProps,
                                                                      endAdornment: (
                                                                          <React.Fragment>
                                                                              {loadingReq ?
                                                                                  <CircularProgress color="inherit"
                                                                                                    size={20}/> : null}
                                                                              {params.InputProps.endAdornment}
                                                                          </React.Fragment>
                                                                      ),
                                                                  }}
                                                                  placeholder={"--"}
                                                                  sx={{paddingLeft: 0}}
                                                                  onChange={(ev) => {
                                                                      findDiseases(ev.target.value)
                                                                  }}
                                                                  variant="outlined" fullWidth/>}/>
                        </Box>
                    </Stack>
                </FormikProvider>
            </CardContent>
        </ConsultationDetailCardStyled>
    )
}

export default CIPPatientHistoryCard
