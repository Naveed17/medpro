//material-ui
import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    InputBase,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
// styled
import {RootStyled} from "./overrides";
// utils
import IconUrl from "@themes/urlIcon";
import {pxToRem} from "@themes/formatFontSize";
import {useTranslation} from "next-i18next";

import {Form, FormikProvider, useFormik} from "formik";
import MaskedInput from "react-text-mask";
import {InputStyled} from "@features/tabPanel";
import React, {useRef, useState} from "react";
import {CropImage} from "@features/image";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import CloseIcon from "@mui/icons-material/Close";
import {agendaSelector, openDrawer, setSelectedEvent} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {getBirthdayFormat, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import {Label} from "@features/label";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import moment from "moment-timezone";
import {timerSelector} from "@features/card";
import {LoadingScreen} from "@features/loadingScreen";
import {Dialog} from "@features/dialog";
import {setMessage, setOpenChat} from "@features/chat/actions";
import {setDialog} from "@features/topNavBar";

function PatientDetailsCard({...props}) {
    const {
        isBeta,
        patient,
        patientPhoto,
        mutatePatientList,
        mutateAgenda,
        loading = false,
        setEditableSection,
        walletMutate,
        closePatientDialog,
        rest,
        devise,
        roles
    } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const ref = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fiche_id: !loading && patient.fiche_id ? patient.fiche_id : "",
            picture: {
                url: (!loading && patientPhoto ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url : ""),
                file: ""
            },
            name: !loading ? `${patient.firstName?.charAt(0).toUpperCase()}${patient.firstName.slice(1).toLowerCase()} ${patient.lastName}` : "",
            birthdate: !loading && patient.birthdate ? patient.birthdate : "",
        },
        onSubmit: () => {
            return undefined
        }
    });

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {t: commonTranslation} = useTranslation("common");
    const {selectedEvent: appointment, config: agendaConfig} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser, appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {isActive} = useAppSelector(timerSelector);
    const {direction} = useAppSelector(configSelector);

    const {values, getFieldProps, setFieldValue} = formik;

    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [editable, setEditable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

    const {trigger: triggerPatientUpdate} = useRequestQueryMutation("/patient/update/photo");
    const {trigger: triggerAddAppointment} = useRequestQueryMutation("/agenda/appointment/add");

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("picture.url", URL.createObjectURL(file));
        setFieldValue("picture.file", file);
        setOpenUploadPicture(true);
    }

    const startConsultationFormPatient = () => {
        setRequestLoading(true);
        const form = new FormData();
        form.append('dates', JSON.stringify([{
            "start_date": moment().format('DD-MM-YYYY'),
            "start_time": `${moment().format('HH')}:${Math.round(parseInt(moment().format('mm')))}`
        }]));
        form.append('title', `${patient?.firstName} ${patient?.lastName}`);
        form.append('patient_uuid', patient?.uuid as string);
        appointmentTypes && form.append('type', appointmentTypes[0].uuid);
        form.append('duration', '15');

        triggerAddAppointment({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${router.locale}`,
            data: form
        }, {
            onSuccess: (value: any) => {
                const {data, status} = value?.data;
                if (status === 'success') {
                    if (!isActive) {
                        const slugConsultation = `/dashboard/consultation/${data[0]}`;
                        router.push({
                            pathname: slugConsultation,
                            query: {inProgress: true}
                        }, slugConsultation, {locale: router.locale}).then(() => {
                            closePatientDialog && closePatientDialog();
                            setRequestLoading(false);
                        });
                    } else {
                        const defEvent = {
                            publicId: data[0],
                            extendedProps: {
                                patient
                            }
                        } as any;
                        dispatch(setSelectedEvent(defEvent));
                        dispatch(openDrawer({type: "view", open: false}));
                        dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
                        closePatientDialog && closePatientDialog();
                        setRequestLoading(false);
                    }

                }
            }
        });
    }

    const uploadPatientDetail = () => {
        setRequestLoading(true);
        const params = new FormData();
        if (patient) {
            params.append('attribute', 'fiche_id');
            params.append('value', values.fiche_id);

            medicalEntityHasUser && triggerPatientUpdate({
                method: "PATCH",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/${router.locale}`,
                data: params
            }, {
                onSuccess: () => {
                    setRequestLoading(false);
                    mutatePatientList && mutatePatientList();
                    mutateAgenda && mutateAgenda();
                    invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/infos/${router.locale}`]);
                    if (appointment) {
                        const event = {
                            ...appointment,
                            extendedProps: {
                                ...appointment.extendedProps,
                                photo: values.picture.file
                            }
                        } as any;
                        dispatch(setSelectedEvent(event));
                    }
                }
            });
        }
    }

    const handleUpdateFicheID = () => {
        setEditableSection({
            patientDetailContactCard: false,
            personalInsuranceCard: false,
            personalInfoCard: false
        });
        setEditable(true);
    }

    const uploadPatientPhoto = () => {
        setRequestLoading(true);
        const params = new FormData();
        if (patient) {
            params.append('attribute', 'photo');
            params.append('photo', values.picture.file);

            medicalEntityHasUser && triggerPatientUpdate({
                method: "PATCH",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/${router.locale}`,
                data: params
            }, {
                onSuccess: () => {
                    mutatePatientList && mutatePatientList();
                    mutateAgenda && mutateAgenda();
                    invalidateQueries([
                        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/documents/profile-photo/${router.locale}`,
                        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/infos/${router.locale}`]);
                    if (appointment) {
                        const event = {
                            ...appointment,
                            extendedProps: {
                                ...appointment.extendedProps,
                                photo: values.picture.file
                            }
                        } as any;
                        dispatch(setSelectedEvent(event));
                    }
                },
                onSettled: () => setRequestLoading(false)
            });
        }
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <RootStyled>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate>
                    <Grid container
                          spacing={1.2}
                          direction="row"
                          justifyContent="space-between">
                        <Grid item xs={12}>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 2, sm: 1.2}}>
                                {loading ? (
                                    <Skeleton
                                        variant="rectangular"
                                        width={pxToRem(100)}
                                        height={pxToRem(100)}
                                        sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
                                    />
                                ) : (

                                    <Box sx={{alignSelf: {xs: 'center', sm: "flex-start"}}} component={"label"}
                                         htmlFor="contained-button-file"
                                         style={{
                                             position: "relative",
                                             zIndex: 1,
                                             cursor: "pointer",
                                             display: 'inline-flex',
                                             width: 118,
                                             height: 118,
                                         }}>
                                        <InputStyled
                                            id="contained-button-file"
                                            onChange={(e) => handleDrop(e.target.files as FileList)}
                                            type="file"
                                        />
                                        <Avatar
                                            src={values.picture.url}
                                            sx={{width: 118, height: 118}}>
                                            <IconUrl path="ic-image"/>
                                        </Avatar>
                                        <IconButton
                                            color="primary"
                                            type="button"
                                            sx={{
                                                position: "absolute",
                                                bottom: 6,
                                                padding: .5,
                                                right: 6,
                                                zIndex: 1,
                                                pointerEvents: "none",
                                                bgcolor: "#fff !important",

                                            }}
                                            style={{
                                                minWidth: 32,
                                                minHeight: 32,
                                            }}>
                                            <IconUrl path="ic-camera-add" width={18}
                                                     height={18}/>
                                        </IconButton>
                                    </Box>
                                )}

                                <Box mx={1} sx={{width: "100%"}}>
                                    {loading ? (
                                        <Skeleton variant="text" width={150}/>
                                    ) : (
                                        <Stack
                                            sx={{width: "100%"}}
                                            direction={"row"}
                                            alignItems={"start"}
                                            justifyContent="space-between">
                                            <Stack>
                                                <InputBase
                                                    readOnly
                                                    {...(patient?.nationality?.code && {
                                                        startAdornment: <Tooltip
                                                            title={patient.nationality.nationality}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 18,
                                                                    height: 18,
                                                                    mr: .5,
                                                                    ml: -.2,
                                                                    borderRadius: 4
                                                                }}
                                                                alt={"flag"}
                                                                src={`https://flagcdn.com/${patient.nationality.code}.svg`}/>
                                                        </Tooltip>
                                                    })}
                                                    inputProps={{
                                                        style: {
                                                            background: "white",
                                                            fontSize: pxToRem(14),
                                                            fontWeight: "bold"
                                                        },
                                                    }}
                                                    {...getFieldProps("name")}
                                                />

                                                <Stack direction={isMobile ? "column" : "row"}>
                                                    {loading ? (
                                                        <Skeleton variant="text" width={150}/>
                                                    ) : (
                                                        <>
                                                            {patient?.birthdate && <Stack
                                                                className={"date-birth"}
                                                                direction={isMobile ? "column" : "row"}
                                                                alignItems="center">
                                                                <Stack direction={"row"} alignItems="center">
                                                                    <IconUrl width={"13"} height={"14"}
                                                                             path="ic-anniverssaire"/>
                                                                    <Box
                                                                        sx={{
                                                                            input: {
                                                                                color: theme.palette.text.secondary,
                                                                            },
                                                                        }}>
                                                                        <MaskedInput
                                                                            readOnly
                                                                            style={{
                                                                                border: "none",
                                                                                outline: "none",
                                                                                width: 75,
                                                                            }}
                                                                            mask={[
                                                                                /\d/,
                                                                                /\d/,
                                                                                "-",
                                                                                /\d/,
                                                                                /\d/,
                                                                                "-",
                                                                                /\d/,
                                                                                /\d/,
                                                                                /\d/,
                                                                                /\d/,
                                                                            ]}
                                                                            placeholderChar={"\u2000"}
                                                                            {...getFieldProps("birthdate")}
                                                                            showMask
                                                                        />
                                                                    </Box>
                                                                </Stack>

                                                                {patient?.birthdate &&
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        component="span">
                                                                        -{" "}
                                                                        ({" "}{getBirthdayFormat(patient, t)}{" "})
                                                                    </Typography>}
                                                            </Stack>
                                                            }
                                                        </>
                                                    )}

                                                    {((patient?.email || patient?.email && patient?.birthdate) && !isMobile) &&
                                                        <Typography color={"gray"} variant={"body2"} ml={1}
                                                                    mt={.3}> / </Typography>}

                                                    {loading ?
                                                        <Skeleton {...(!isMobile && {sx: {ml: 1}})} variant="text"
                                                                  width={150}/>
                                                        :
                                                        <Stack direction={"row"} alignItems="center">
                                                            <Typography
                                                                variant="body2"
                                                                component="span"
                                                                color={"gray"}
                                                                className="email-link">
                                                                {loading ? (
                                                                    <Skeleton variant="text" width={100}/>
                                                                ) : patient?.email && (
                                                                    <>
                                                                        <IconUrl path="ic-message-contour"/>
                                                                        <Typography {...(!patient?.email && {color: "primary"})}
                                                                                    variant={"body2"}>{patient?.email}</Typography>
                                                                    </>
                                                                )}
                                                            </Typography>
                                                        </Stack>}
                                                </Stack>

                                                {(patient?.familyDoctor && !isMobile) && (loading ? (
                                                    <Skeleton variant="text" width={150}/>
                                                ) : (
                                                    patient?.familyDoctor &&
                                                    <Tooltip title={t("family_doctor")}>
                                                        <InputBase
                                                            readOnly
                                                            startAdornment={
                                                                <Stack direction={"row"}>
                                                                    <IconUrl width={15} height={15} color={"gray"}
                                                                             path="ic-docotor"/>
                                                                    <Typography sx={{width: 150, color: "gray"}}
                                                                                variant={"body2"}>{t("family_doctor")}{":"}</Typography>
                                                                </Stack>}
                                                            inputProps={{
                                                                style: {
                                                                    color: "gray",
                                                                    fontSize: pxToRem(12)
                                                                },
                                                            }}
                                                            value={patient.familyDoctor}/>
                                                    </Tooltip>
                                                ))}

                                                {loading ?
                                                    <Skeleton variant="text" width={150}/> :
                                                    <Stack ml={"-1px"} direction={"row"} alignItems="center">
                                                        <Typography
                                                            variant="body2"
                                                            component="span"
                                                            color={"gray"}>
                                                            {loading ? (
                                                                <Skeleton variant="text" width={100}/>
                                                            ) : (
                                                                <Stack alignItems={"center"}>
                                                                    <InputBase
                                                                        {...{ref}}
                                                                        className={"input-base-custom"}
                                                                        startAdornment={
                                                                            <Stack mr={.5} spacing={.5}
                                                                                   direction={"row"}
                                                                                   alignItems={"center"}
                                                                                   justifyContent={"center"}>
                                                                                <IconUrl path="ic-folder" width={16}
                                                                                         height={16}
                                                                                         color={theme.palette.text.secondary}/>
                                                                                <Typography variant={"body2"}
                                                                                            sx={{width: 50}}>Fiche
                                                                                    N°</Typography>
                                                                            </Stack>}
                                                                        readOnly={!editable}
                                                                        endAdornment={
                                                                            <Stack direction={"row"} spacing={1.2}>
                                                                                {editable ?
                                                                                    (isMobile ?
                                                                                        <>
                                                                                            <IconButton
                                                                                                onClick={() => {
                                                                                                    setEditable(false);
                                                                                                    uploadPatientDetail();
                                                                                                }}
                                                                                                size='small'>
                                                                                                <SaveAsIcon
                                                                                                    fontSize={"small"}
                                                                                                    color={"primary"}/>
                                                                                            </IconButton>
                                                                                            <IconButton
                                                                                                sx={{p: 0}}
                                                                                                size='small'
                                                                                                color={"error"}
                                                                                                onClick={() => setEditable(false)}>
                                                                                                <CloseIcon
                                                                                                    fontSize={"small"}/>
                                                                                            </IconButton>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <LoadingButton
                                                                                                loading={requestLoading}
                                                                                                onClick={() => {
                                                                                                    setEditable(false);
                                                                                                    uploadPatientDetail();
                                                                                                }}
                                                                                                className='btn-add'
                                                                                                sx={{margin: 'auto'}}
                                                                                                size='small'
                                                                                                startIcon={
                                                                                                    <SaveAsIcon/>}>
                                                                                                {t('register')}
                                                                                            </LoadingButton>
                                                                                            {/*<Button
                                                                                    size='small'
                                                                                    color={"error"}
                                                                                    onClick={() => setEditable(false)}
                                                                                    startIcon={<CloseIcon/>}
                                                                                >
                                                                                    {t(`cancel`)}
                                                                                </Button>*/}
                                                                                        </>)
                                                                                    :
                                                                                    (isMobile ?
                                                                                        <IconButton
                                                                                            onClick={() => handleUpdateFicheID()}>
                                                                                            <IconUrl
                                                                                                color={theme.palette.primary.main}
                                                                                                path={"setting/edit"}/>
                                                                                        </IconButton>
                                                                                        :
                                                                                        <Button size="small"
                                                                                                color={"primary"}
                                                                                                onClick={() => handleUpdateFicheID()}
                                                                                                startIcon={<IconUrl
                                                                                                    color={theme.palette.primary.main}
                                                                                                    path='setting/edit'/>
                                                                                                }
                                                                                                sx={{
                                                                                                    "& .react-svg": {
                                                                                                        margin: 0,
                                                                                                    }
                                                                                                }}>
                                                                                            {t('edit')}
                                                                                        </Button>)}
                                                                            </Stack>}
                                                                        inputProps={{
                                                                            style: {
                                                                                textOverflow: "ellipsis",
                                                                                color: "gray",
                                                                                fontSize: pxToRem(12),
                                                                                width: values.fiche_id.length > 0 ? `80px` : "40px"
                                                                            },
                                                                        }}
                                                                        placeholder={"-"}
                                                                        {...getFieldProps("fiche_id")} />

                                                                </Stack>
                                                            )}
                                                        </Typography>
                                                    </Stack>}
                                            </Stack>

                                            <Stack spacing={1}>
                                                <Stack spacing={2} direction={isMobile ? "column" : "row"}
                                                       alignItems={"center"}
                                                       justifyContent={isMobile ? "center" : "flex-end"}>
                                                    {isBeta && rest > 0 &&
                                                        <div onClick={() => {
                                                            setOpenPaymentDialog(true)
                                                        }}>
                                                            <Label variant='filled' sx={{
                                                                color: theme.palette.error.main,
                                                                background: theme.palette.error.lighter
                                                            }}>
                                                                {!isMobile && <span
                                                                    style={{fontSize: 11}}>{commonTranslation('credit')}</span>}
                                                                <span style={{
                                                                    fontSize: 14,
                                                                    marginLeft: 5,
                                                                    marginRight: 5,
                                                                    fontWeight: "bold"
                                                                }}>{rest}</span>
                                                                <span>{devise}</span>
                                                            </Label>
                                                        </div>
                                                    }
                                                    <IconButton
                                                        sx={{
                                                            backgroundColor: theme.palette.background.default,
                                                            borderRadius: 8
                                                        }}
                                                        onClick={() => {
                                                            closePatientDialog && closePatientDialog();
                                                            dispatch(setOpenChat(true))
                                                            dispatch(setMessage(`&lt; <span class="tag" id="${patient.uuid}">${patient.firstName} ${patient.lastName} </span><span class="afterTag"> > </span>`))
                                                        }}>
                                                        <IconUrl
                                                            path={"chat"}
                                                            color={theme.palette.text.secondary}
                                                            width={20} height={20}/>
                                                    </IconButton>
                                                </Stack>

                                                {!roles.includes('ROLE_SECRETARY') && (
                                                    <>
                                                        {loading ? (
                                                            <Skeleton
                                                                variant="rectangular"
                                                                sx={{
                                                                    ml: {md: "auto", xs: 0},
                                                                    maxWidth: {md: 193, xs: "100%"},
                                                                    minHeight: {md: 60, xs: 40},
                                                                    width: 153,
                                                                    borderRadius: "4px",
                                                                }}
                                                            />
                                                        ) : (
                                                            !isMobile ? <LoadingButton
                                                                    loading={requestLoading}
                                                                    onClick={startConsultationFormPatient}
                                                                    variant="contained"
                                                                    sx={{
                                                                        ml: {md: "auto", xs: 0},
                                                                        maxWidth: {md: 193, xs: "100%"},
                                                                    }}
                                                                    color="warning"
                                                                    startIcon={<PlayCircleIcon/>}>
                                                                    <Typography
                                                                        component='strong' variant={"body2"}
                                                                        fontSize={13}>{t("start-consultation")}</Typography>
                                                                </LoadingButton>
                                                                :
                                                                <IconButton
                                                                    disabled={isActive}
                                                                    sx={{
                                                                        borderRadius: 8
                                                                    }}
                                                                    onClick={startConsultationFormPatient}>
                                                                    <PlayCircleIcon/>
                                                                </IconButton>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Stack>
                                    )}
                                </Box>
                            </Stack>
                        </Grid>
                        {/* <Grid item md={3}>
                                                  <div>
                            {loading ? (
                                <Skeleton variant="text" width={150}/>
                            ) : (
                                <Stack direction={"row"} alignItems="center">
                                    <Typography
                                        visibility={"hidden"}
                                        variant="body2"
                                        component="span"
                                        className="alert">
                                        <Icon path="danger"/>
                                        {t("duplicate")}
                                    </Typography>
                                </Stack>
                            )}
                        </div>

                        </Grid>*/}
                    </Grid>
                </Form>
            </FormikProvider>
            <CropImage
                {...{setFieldValue}}
                filedName={"picture.url"}
                open={openUploadPicture}
                img={values.picture.url}
                setOpen={(status: boolean) => {
                    setOpenUploadPicture(status);
                    uploadPatientPhoto();
                }}
            />

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 460
                    }
                }}
                open={openPaymentDialog}
                data={{
                    patient,
                    setOpenPaymentDialog,
                    mutatePatient: () => {
                        mutatePatientList && mutatePatientList();
                        mutateAgenda && mutateAgenda()
                        walletMutate && walletMutate()
                    }
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title", {ns: "payment"})}
                dialogClose={() => {
                    setOpenPaymentDialog(false)
                }}
            />
        </RootStyled>
    );
}

export default PatientDetailsCard;
