//material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    IconButton,
    InputBase,
    Link,
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
import Can from "@features/casl/can";
import {useProfilePhoto} from "@lib/hooks/rest";
import {CustomIconButton} from "@features/buttons";
import {useInsurances} from "@lib/hooks/rest";

function PatientDetailsCard({...props}) {
    const {
        isBeta,
        contactData,
        patient,
        mutatePatientList,
        mutateAgenda,
        loading = false,
        setEditableSection,
        walletMutate,
        closePatientDialog,
        rest,
        devise,
        patientInsurances = [],
    } = props;
    const dispatch = useAppDispatch();
    const {insurances} = useInsurances();
    const router = useRouter();
    const theme = useTheme();
    const ref = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {patientPhoto} = useProfilePhoto({patientId: patient?.uuid, hasPhoto: patient?.hasPhoto});

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
                            query: {
                                inProgress: true,
                                agendaUuid: agendaConfig?.uuid
                            }
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
                    <Stack spacing={2}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <Stack direction='row' alignItems='center' spacing={2}>
                                {loading ? <Skeleton
                                        variant="rectangular"
                                        width={pxToRem(80)}
                                        height={pxToRem(80)}
                                        sx={{borderRadius: pxToRem(10)}}
                                    /> :
                                    <Avatar
                                        src={values.picture.url}
                                        className='patient-avatar'>
                                        <IconUrl path={patient.gender === "M" ? "men-avatar" : "women-avatar"}/>
                                    </Avatar>
                                }
                                <Stack spacing={.3}>
                                    <Typography component='div' fontWeight={600} color="primary" fontSize={18}
                                                variant='subtitle1'>
                                        {loading ? <Skeleton width={100}/> : values.name}
                                    </Typography>
                                    <Stack sx={{display: {xs: 'none', sm: 'flex'}}} direction='row' alignItems='center'
                                           spacing={.5}>
                                        <IconUrl path="ic-outline-call" width={16} height={16}
                                                 color={theme.palette.text.secondary}/>
                                        <Typography component={'div'} fontWeight={500} color='text.secondary'>
                                            {loading ? <Skeleton width={100}/> :
                                                <span>{contactData && ((contactData?.contact[0] as ContactModel)?.code + "  " + (contactData?.contact[0] as ContactModel)?.value) || "--"}</span>}
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={.5}>
                                        <IconUrl path="ic-outline-cake"/>
                                        {
                                            loading ? <Skeleton width={100}/> :
                                                patient?.birthdate &&
                                                <Typography
                                                    component='div'
                                                    fontWeight={500} color='text.secondary'
                                                >
                                                    {values.birthdate} {" "}
                                                    <Typography component='span' sx={{
                                                        display: {
                                                            xs: 'none',
                                                            sm: 'inline'
                                                        }
                                                    }}>({" "}{getBirthdayFormat(patient, t)}{" "})</Typography>
                                                </Typography>}
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack direction='row' alignItems="center" spacing={1}>
                                <Link
                                    underline="none"
                                    href={`tel:${(contactData?.contact[0] as ContactModel)?.code}${(contactData?.contact[0] as ContactModel)?.value}`}
                                >
                                    <CustomIconButton color="success">
                                        <IconUrl path="ic-filled-call" width={20} height={20}/>
                                    </CustomIconButton>
                                </Link>
                                <CustomIconButton sx={{display: {xs: 'none', sm: 'inline-flex'}}}>
                                    <IconUrl path="ic-outline-sms-edit" color={theme.palette.text.secondary} width={20}
                                             height={20}/>
                                </CustomIconButton>
                                <CustomIconButton sx={{display: {xs: 'none', sm: 'inline-flex'}}}>
                                    <IconUrl path="ic-outline-square-share-line" color={theme.palette.text.secondary}
                                             width={20} height={20}/>
                                </CustomIconButton>
                                <CustomIconButton>
                                    <IconUrl path="ic-Filled-more-vertical" color={theme.palette.text.secondary}
                                             width={20} height={20}/>
                                </CustomIconButton>
                            </Stack>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Label color="success"
                                   sx={{color: theme.palette.success.main, fontSize: 14, fontWeight: 500}}>
                                {commonTranslation('credit')}
                                <Typography mx={.5} fontSize={14} fontWeight={600} variant="caption">123</Typography>
                                {devise}
                            </Label>
                            {isBeta && rest > 0 &&
                                <div onClick={() => {
                                    setOpenPaymentDialog(true)
                                }}>
                                    <Label variant='filled' sx={{
                                        color: theme.palette.error.main,
                                        background: theme.palette.error.lighter,
                                        fontWeight: 500,
                                        fontSize: 14
                                    }}>
                                        {!isMobile && <span
                                        >{commonTranslation('debit')}</span>}
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
                            <AvatarGroup max={3} sx={{flexDirection: 'row', display: {xs: 'none', sm: 'flex'}}}>
                                {patientInsurances?.map((insurance: any, index: number) => (
                                    (() => {
                                        const insuranceItem = insurances?.find(ins => ins.uuid === insurance.insurance.uuid);
                                        return (
                                            <Tooltip key={index} title={insuranceItem?.name}>
                                                {insuranceItem?.logoUrl ?
                                                    <Avatar
                                                        alt={insuranceItem?.name}
                                                        src={insuranceItem?.logoUrl.url}
                                                        className='assurance-avatar' variant={"circular"}>
                                                        <IconUrl path="ic-img"/>
                                                    </Avatar>
                                                    : <></>
                                                }

                                            </Tooltip>
                                        )
                                    })()
                                ))}
                            </AvatarGroup>
                        </Stack>
                        <LoadingButton
                            loading={requestLoading}
                            onClick={startConsultationFormPatient}
                            variant="contained"
                            color="warning"
                            startIcon={<IconUrl path="ic-filled-play-1" width={16} height={16}/>}>
                            <Typography
                                component='strong' variant={"body2"}
                                fontSize={13}>{t("start-consultation")}</Typography>
                        </LoadingButton>
                    </Stack>
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
