//material-ui
import {
    Avatar,
    Box,
    Button, Grid,
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
import {InputStyled, setAppointmentSubmit} from "@features/tabPanel";
import React, {useRef, useState} from "react";
import {CropImage} from "@features/image";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import CloseIcon from "@mui/icons-material/Close";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import {agendaSelector, setSelectedEvent, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {getBirthdayFormat, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {dashLayoutSelector} from "@features/base";
import dynamic from "next/dynamic";
import {Label} from "@features/label";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import moment from "moment-timezone";
import {timerSelector} from "@features/card";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function PatientDetailsCard({...props}) {
    const {
        isBeta,
        patient,
        patientPhoto,
        onConsultation,
        mutatePatientList,
        mutateAgenda,
        loading = false,
        setEditableSection,
        rest,
        devise,
        roles
    } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const ref = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fiche_id: !loading && patient.fiche_id ? patient.fiche_id : "",
            picture: {
                url: (!loading && patientPhoto ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url : ""),
                file: ""
            },
            name: !loading ? `${patient.firstName.charAt(0).toUpperCase()}${patient.firstName.slice(1).toLowerCase()} ${patient.lastName}` : "",
            birthdate: !loading && patient.birthdate ? patient.birthdate : "",
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {t: commonTranslation} = useTranslation("common");
    const {selectedEvent: appointment, config: agendaConfig} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser, appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {isActive} = useAppSelector(timerSelector);

    const {values, getFieldProps, setFieldValue} = formik;

    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [editable, setEditable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);

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
                    const slugConsultation = `/dashboard/consultation/${data[0]}`;
                    router.push({pathname: slugConsultation, query: {inProgress: true}}, slugConsultation, {locale: router.locale});
                }
            },
            onSettled: () => setRequestLoading(false)
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
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`,
                data: params
            }, {
                onSuccess: () => {
                    setRequestLoading(false);
                    mutatePatientList && mutatePatientList();
                    mutateAgenda && mutateAgenda();
                    invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/infos/${router.locale}`]);
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
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`,
                data: params
            }, {
                onSuccess: () => {
                    setRequestLoading(false);
                    mutatePatientList && mutatePatientList();
                    mutateAgenda && mutateAgenda();
                    invalidateQueries([
                        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/documents/profile-photo/${router.locale}`,
                        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/infos/${router.locale}`]);
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

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <RootStyled direction={"row"} justifyContent={"space-between"}>
                    <Grid container spacing={1.2}>
                        <Grid item md={9}>
                            <Stack direction={"row"} spacing={1.2}>
                                {loading ? (
                                    <Skeleton
                                        variant="rectangular"
                                        width={pxToRem(100)}
                                        height={pxToRem(100)}
                                        sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
                                    />
                                ) : (
                                    <label htmlFor="contained-button-file" style={{cursor: "pointer", height: 100}}>
                                        <InputStyled
                                            id="contained-button-file"
                                            onChange={(e) => handleDrop(e.target.files as FileList)}
                                            type="file"
                                        />
                                        <Avatar
                                            src={values.picture.url}
                                            sx={{
                                                width: 100, height: 100, "& svg": {
                                                    padding: 1.5
                                                }
                                            }}
                                        >
                                            <IconUrl path="ic-user-profile"/>
                                        </Avatar>
                                        <IconButton
                                            onClick={() => {
                                                document.getElementById('contained-button-file')?.click()
                                            }}
                                            type="button"
                                            className={"import-avatar"}
                                        >
                                            <IconUrl path="ic-return-photo"/>
                                        </IconButton>
                                    </label>
                                )}

                                <Box mx={1} sx={{width: "100%"}}>
                                    {loading ? (
                                        <Skeleton variant="text" width={150}/>
                                    ) : (
                                        <Stack
                                            sx={{width: "100%"}}
                                            direction={"row"}
                                            alignItems={"center"}
                                            justifyContent="space-between">
                                            <InputBase
                                                readOnly
                                                {...(patient?.nationality && {
                                                    startAdornment: <Tooltip title={patient.nationality.nationality}>
                                                        <Avatar
                                                            sx={{width: 18, height: 18, mr: .5, ml: -.2, borderRadius: 4}}
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
                                            {isBeta && rest > 0 && <Label
                                                variant='filled'
                                                sx={{
                                                    "& .MuiSvgIcon-root": {
                                                        width: 16,
                                                        height: 16,
                                                        pl: 0
                                                    }
                                                }}
                                                color={rest > 0 ? "expire" : "success"}>
                                                <Typography sx={{fontSize: 12}}>
                                                    {commonTranslation(rest > 0 ? "credit" : "wallet")} {`${rest > 0 ? '-' : '+'} ${Math.abs(rest)}`} {devise}</Typography>
                                            </Label>}
                                        </Stack>
                                    )}

                                    <Stack direction={isMobile ? "column" : "row"}>
                                        {loading ? (
                                            <Skeleton variant="text" width={150}/>
                                        ) : (
                                            <>
                                                {patient?.birthdate && <Stack
                                                    className={"date-birth"}
                                                    direction={isMobile ? "column" : "row"} alignItems="center">
                                                    <Stack direction={"row"} alignItems="center">
                                                        <IconUrl width={"13"} height={"14"} path="ic-anniverssaire"/>
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
                                            <Skeleton {...(!isMobile && {sx: {ml: 1}})} variant="text" width={150}/>
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
                                        <Skeleton variant="text" width={150}/>
                                        :
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
                                                                <Stack mr={.5} direction={"row"} alignItems={"center"}
                                                                       justifyContent={"center"}>
                                                                    <FolderRoundedIcon
                                                                        sx={{color: "gray", width: 16, height: 16, mr: 1}}/>
                                                                    <Typography variant={"body2"} sx={{width: 50}}>Fiche
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
                                                                                    <SaveAsIcon fontSize={"small"}
                                                                                                color={"primary"}/>
                                                                                </IconButton>
                                                                                <IconButton
                                                                                    sx={{p: 0}}
                                                                                    size='small'
                                                                                    color={"error"}
                                                                                    onClick={() => setEditable(false)}
                                                                                >
                                                                                    <CloseIcon fontSize={"small"}/>
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
                                                                                    startIcon={<SaveAsIcon/>}>
                                                                                    {t('register')}
                                                                                </LoadingButton>
                                                                                <Button
                                                                                    size='small'
                                                                                    color={"error"}
                                                                                    onClick={() => setEditable(false)}
                                                                                    startIcon={<CloseIcon/>}
                                                                                >
                                                                                    {t(`cancel`)}
                                                                                </Button>
                                                                            </>)
                                                                        :
                                                                        (isMobile ?
                                                                            <IconButton
                                                                                onClick={() => handleUpdateFicheID()}>
                                                                                <IconUrl
                                                                                    color={theme.palette.primary.main}
                                                                                    path='ic-duotone'/>
                                                                            </IconButton>
                                                                            :
                                                                            <Button size="small"
                                                                                    color={"primary"}
                                                                                    onClick={() => handleUpdateFicheID()}
                                                                                    startIcon={<IconUrl
                                                                                        color={theme.palette.primary.main}
                                                                                        path='ic-duotone'/>
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
                                                            {...getFieldProps("fiche_id")}/>

                                                    </Stack>
                                                )}
                                            </Typography>
                                        </Stack>}
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            {/*                        <div>
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
                        </div>*/}
                            {!roles.includes('ROLE_SECRETARY') && (
                                <Box>
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
                                        <LoadingButton
                                            loading={requestLoading}
                                            onClick={startConsultationFormPatient}
                                            disabled={isActive}
                                            variant="contained"
                                            sx={{
                                                ml: {md: "auto", xs: 0},
                                                maxWidth: {md: 193, xs: "100%"},
                                                minHeight: {md: 60, xs: 40}
                                            }}
                                            color="warning"
                                            startIcon={<PlayCircleIcon/>}>
                                            <Typography
                                                component='strong' variant={"body2"}
                                                fontSize={13}>{t("start-consultation")}</Typography>
                                        </LoadingButton>
                                    )}
                                </Box>
                            )}
                        </Grid>

                        {/*{patient && (
                        <Box ml={{lg: onConsultation ? "1rem" : "auto", xs: 0}}>
                            <QrCodeScanner value={patient?.uuid} width={100} height={100}/>
                        </Box>
                    )}*/}
                    </Grid>
                </RootStyled>
            </Form>
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
        </FormikProvider>
    );
}

export default PatientDetailsCard;
