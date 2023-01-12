//material-ui
import {
    Avatar,
    Badge,
    Box,
    Button,
    IconButton,
    InputBase,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
// styled
import {RootStyled} from "./overrides";

// utils
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {pxToRem} from "@themes/formatFontSize";
import {useTranslation} from "next-i18next";
import moment from "moment-timezone";
import {Form, FormikProvider, useFormik} from "formik";
import MaskedInput from "react-text-mask";
import {LoadingScreen} from "@features/loadingScreen";
import {InputStyled} from "@features/tabPanel";
import React, {useState} from "react";
import {CropImage} from "@features/cropImage";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import {HtmlTooltip} from "@features/tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

function PatientDetailsCard({...props}) {
    const {patient, patientPhoto, onConsultation, mutatePatientList, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fiche_id: !loading && patient.fiche_id ? patient.fiche_id : "",
            picture: {url: !loading && patientPhoto ? patientPhoto : "", file: ""},
            name: !loading ? `${patient.firstName.charAt(0).toUpperCase()}${patient.firstName.slice(1).toLowerCase()} ${patient.lastName}` : "",
            birthdate: !loading && patient.birthdate ? patient.birthdate : "",
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {values, getFieldProps, setFieldValue} = formik;

    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [editable, setEditable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update/photo");

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("picture.url", URL.createObjectURL(file));
        setFieldValue("picture.file", file);
        setOpenUploadPicture(true);
    };

    const uploadPatientDetail = () => {
        setRequestLoading(true);
        const params = new FormData();
        if (patient) {
            params.append('first_name', patient.firstName);
            params.append('last_name', patient.lastName);
            params.append('phone', JSON.stringify(patient.contact));
            params.append('gender', patient.gender);
            values.picture.url.length > 0 && params.append('photo', values.picture.file);
            values.fiche_id?.length > 0 && params.append('fiche_id', values.fiche_id);
            patient.email && params.append('email', patient.email);
            patient.family_doctor && params.append('family_doctor', patient.family_doctor);
            patient.profession && params.append('profession', patient.profession);
            patient.birthdate && params.append('birthdate', patient.birthdate);
            patient.note && params.append('note', patient.note);
            patient.idCard && params.append('idCard', patient.idCard);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('country', patient?.address[0]?.city?.country?.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('region', patient?.address[0]?.city?.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('zip_code', patient?.address[0]?.postalCode);
            patient?.address && patient?.address.length > 0 && patient?.address[0].street && params.append('address', patient?.address[0]?.street);

            triggerPatientUpdate({
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient?.uuid}/${router.locale}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
                data: params,
            }).then(() => {
                setRequestLoading(false);
                mutatePatientList();
            });
        }
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <RootStyled direction={"row"} justifyContent={"space-between"}>
                    <Box sx={{display: "inline-flex"}}>
                        <Badge
                            color="success"
                            variant="dot"
                            invisible={patient?.nextAppointments.length === 0 || loading}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}>
                            {loading ? (
                                <Skeleton
                                    variant="rectangular"
                                    width={pxToRem(100)}
                                    height={pxToRem(100)}
                                    sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
                                />
                            ) : (
                                <label htmlFor="contained-button-file" style={{cursor: "pointer"}}>
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
                        </Badge>
                        <Box mx={1}>
                            {loading ? (
                                <Skeleton variant="text" width={150}/>
                            ) : (
                                <Stack direction={"row"} spacing={1} alignItems={"center"}>

                                    <InputBase
                                        readOnly
                                        inputProps={{
                                            style: {
                                                background: "white",
                                                fontSize: pxToRem(14),
                                                fontWeight: "bold"
                                            },
                                        }}
                                        {...getFieldProps("name")}
                                    />

                                    {patient?.nationality &&
                                        <Tooltip title={patient.nationality.nationality}>
                                            <IconButton>
                                                <Image width={15} height={14}
                                                       alt={"flag"}
                                                       src={`https://flagcdn.com/${patient.nationality.code}.svg`}/>
                                            </IconButton>
                                        </Tooltip>

                                    }
                                </Stack>
                            )}

                            {loading ? (
                                <Skeleton variant="text" width={150}/>
                            ) : (
                                <>
                                    {
                                        patient?.birthdate && <Stack
                                            className={"date-birth"}
                                            direction={"row"} alignItems="center">
                                            <Icon width={"13"} height={"14"} path="ic-anniverssaire"/>
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
                                            {patient?.birthdate &&
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    component="span">
                                                    -{" "}
                                                    ({moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), "years")}
                                                    {" "}
                                                    {t("years").toLowerCase()})
                                                </Typography>}
                                        </Stack>
                                    }
                                </>
                            )}
                            {loading ?
                                <Skeleton variant="text" width={150}/>
                                :
                                <Stack direction={"row"} alignItems="center">
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        color={"gray"}
                                        className="email-link">
                                        {loading ? (
                                            <Skeleton variant="text" width={100}/>
                                        ) : (
                                            <>
                                                <Icon path="ic-message-contour"/>
                                                <Typography {...(!patient?.email && {color: "primary"})}
                                                            variant={"body2"}>{patient?.email ? patient?.email : t('add-email')}</Typography>
                                            </>
                                        )}
                                    </Typography>
                                </Stack>}
                            {loading ?
                                <Skeleton variant="text" width={150}/>
                                :
                                <Stack direction={"row"} alignItems="center">
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        color={"gray"}>
                                        {loading ? (
                                            <Skeleton variant="text" width={100}/>
                                        ) : (
                                            <Stack direction={"row"} alignItems={"center"}>
                                                <Icon width={"14"} height={"14"} path="ic-doc"/>
                                                <InputBase
                                                    className={"input-base-custom"}
                                                    readOnly={!editable}
                                                    inputProps={{
                                                        style: {
                                                            fontSize: pxToRem(12),
                                                            width: values.fiche_id.length > 0 ? "fit-content" : "240px"
                                                        },
                                                    }}
                                                    placeholder={t("fiche_placeholder")}
                                                    {...getFieldProps("fiche_id")}/>
                                                {editable ?
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
                                                    </>
                                                    :
                                                    <IconButton size="small"
                                                                onClick={() => setEditable(true)}
                                                                sx={{
                                                                    padding: "4px",
                                                                    "& .react-svg": {
                                                                        margin: 0,
                                                                    }
                                                                }}>
                                                        <IconUrl path='ic-duotone'/>
                                                    </IconButton>}
                                            </Stack>
                                        )}
                                    </Typography>
                                </Stack>}
                        </Box>
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
                        {/* {onConsultation && (
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
                                    <Button
                                        onClick={onConsultation}
                                        variant="contained"
                                        color="warning"
                                        startIcon={<PlayCircleIcon/>}
                                        sx={{
                                            ml: {md: "auto", sm: 0, xs: 0},
                                            maxWidth: {md: 193, xs: "100%"},
                                            my: 2,
                                            display: isActive ? "none" : "inline-flex",
                                        }}>
                                        {t("start-consultation")}
                                    </Button>
                                )}
                            </>
                        )}*/}
                    </Box>

                    {patient && (
                        <Box ml={{lg: onConsultation ? "1rem" : "auto", xs: 0}}>
                            {/*
                            <QrCodeScanner value={patient?.uuid} width={100} height={100}/>
*/}
                        </Box>
                    )}
                </RootStyled>
            </Form>
            <CropImage
                {...{setFieldValue}}
                filedName={"picture.url"}
                open={openUploadPicture}
                img={values.picture.url}
                setOpen={(status: boolean) => {
                    setOpenUploadPicture(status);
                    uploadPatientDetail();
                }}
            />
        </FormikProvider>
    );
}

export default PatientDetailsCard;
