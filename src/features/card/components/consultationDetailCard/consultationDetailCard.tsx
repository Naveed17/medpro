import React, {useEffect, useState} from 'react'
import {Autocomplete, Box, CardContent, MenuItem, Stack, TextField, Typography} from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'
import {Form, FormikProvider, useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {SetExam, SetListen} from "@features/toolbar/components/consultationIPToolbar/actions";
import {consultationSelector} from "@features/toolbar";
import {LoadingScreen} from "@features/loadingScreen";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {pxToRem} from "@themes/formatFontSize";
import CircularProgress from "@mui/material/CircularProgress";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {RecButton} from "@features/buttons";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function CIPPatientHistoryCard({...props}) {
    const {
        exam: defaultExam,
        changes,
        setChanges,
        uuind,
        notes,
        diagnostics,
        seeHistory,
        seeHistoryDiagnostic
    } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const {transcript, resetTranscript, listening} = useSpeechRecognition();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {exam, listen} = useAppSelector(consultationSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [loadingReq, setLoadingReq] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    let [oldNote, setOldNote] = useState('');

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerAddReason} = useRequestMutation(null, "/motif/add");

    const {
        data: httpConsultReasonResponse,
        mutate: mutateReasonsData
    } = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}?sort=true`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const storageData = JSON.parse(localStorage.getItem(`consultation-data-${uuind}`) as string);
    const app_data = defaultExam?.appointment_data;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            motif: storageData?.motif ? storageData.motif :
                (app_data?.consultation_reason ?
                    app_data?.consultation_reason.map((reason: ConsultationReasonModel) => reason.uuid) : []),
            notes: storageData?.notes ? storageData.notes : (app_data?.notes ? app_data?.notes.value : ""),
            diagnosis: storageData?.diagnosis ? storageData.diagnosis : (app_data?.diagnostics ? app_data?.diagnostics.value : ""),
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
        setFieldValue("motif", reasons.map(reason => reason.uuid));
        localStorage.setItem(`consultation-data-${uuind}`, JSON.stringify({
            ...storageData,
            motif: reasons.map(reason => reason.uuid)
        }));
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
            fr: name
        }));

        medicalEntityHasUser && triggerAddReason({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => mutateReasonsData().then((result: any) => {
            const {status} = result?.data;
            const reasonsUpdated = (result?.data as HttpResponse)?.data as ConsultationReasonModel[];
            if (status === "success") {
                handleReasonChange([...reasons.filter(reason => exam.motif.includes(reason.uuid)), reasonsUpdated[0]]);
            }
            setLoadingReq(false);
        }));
    }

    useEffect(() => {
        dispatch(
            SetExam({
                motif: storageData?.motif ? storageData.motif :
                    (app_data?.consultation_reason ?
                        app_data?.consultation_reason.map((reason: ConsultationReasonModel) => reason.uuid) : []),
                notes: storageData?.notes ? storageData.notes : (app_data?.notes ? app_data?.notes.value : ""),
                diagnosis: storageData?.diagnosis ? storageData.diagnosis : (app_data?.diagnostics ? app_data?.diagnostics.value : ""),
                treatment: exam.treatment
            })
        );
    }, [app_data])// eslint-disable-line react-hooks/exhaustive-deps

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

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];

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
                                value={values.motif && reasons ? reasons.filter(reason => values.motif.includes(reason.uuid)) : []}
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
                                filterOptions={(options, params) => {
                                    const {inputValue} = params;
                                    const filtered = options.filter(option => [option.name.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue.toLowerCase() === option.name.toLowerCase());
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            name: `${t('add_reason')} "${inputValue}"`,
                                        });
                                    }
                                    return filtered;
                                }}
                                sx={{color: "text.secondary"}}
                                options={reasons ? reasons.filter(item => item.isEnabled) : []}
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
                                    <MenuItem
                                        {...props}
                                        key={option.uuid ? option.uuid : "-1"}
                                        value={option.uuid}>
                                        {option.name}
                                    </MenuItem>
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
                                        {notes?.length > 0 &&
                                            <Typography color={"primary"} style={{cursor: "pointer"}} onClick={() => {
                                                seeHistory()
                                            }}>{t('seeHistory')}</Typography>}
                                    </>}
                                    <RecButton
                                        small
                                        onClick={() => {
                                            startStopRec();
                                        }}/>
                                </Stack>
                            </Stack>
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
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                <Typography variant="body2" fontWeight={500}>
                                    {t("diagnosis")}
                                </Typography>

                                {diagnostics.length > 0 &&
                                    <Typography color={"primary"} style={{cursor: "pointer"}} onClick={() => {
                                        seeHistoryDiagnostic()
                                    }}>{t('seeHistory')}</Typography>}
                            </Stack>

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
                                }}/>
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
