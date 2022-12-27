//material-ui
import {Avatar, Badge, Box, IconButton, InputBase, Skeleton, Stack, Typography, useTheme,} from "@mui/material";
// styled
import {RootStyled} from "./overrides";

// utils
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {pxToRem} from "@themes/formatFontSize";
import {useTranslation} from "next-i18next";
import moment from "moment-timezone";
import {QrCodeScanner} from "@features/qrCodeScanner";
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

function PatientDetailsCard({...props}) {
    const {patient, onConsultation, loading} = props;

    const theme = useTheme();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            picture: !loading ? patient.photo : "",
            name: !loading ? `${patient.firstName.charAt(0).toUpperCase()}${patient.firstName.slice(1).toLowerCase()} ${patient.lastName}` : "",
            birthdate: !loading ? patient.birthdate : "",
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {values, getFieldProps, setFieldValue} = formik;

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    const [openUploadPicture, setOpenUploadPicture] = useState(false);

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update_photo");
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;


    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        const params = new FormData();
        if (patient) {
            params.append('first_name', patient.firstName)
            params.append('last_name', patient.lastName)
            params.append('phone', JSON.stringify(patient.contact))
            params.append('gender', patient.gender)
            params.append('photo', file)
        }

        triggerPatientUpdate({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient?.uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        });

    };

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
                                        src={values.picture}
                                        sx={{
                                            width: 100, height: 100, "& svg": {
                                                padding: 1.5
                                            }
                                        }}
                                    >
                                        <IconUrl path="ic-user-profile"/>
                                    </Avatar>
                                    <IconButton
                                        onClick={()=>{
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
                            )}

                            {loading ? (
                                <Skeleton variant="text" width={150}/>
                            ) : (
                                <Stack
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
                        </Box>
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
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ml: {md: 1, sm: 0, xs: 0}, mt: {md: 4, sm: 1, xs: 1}}}>
                            {loading ? (
                                <Skeleton
                                    variant="text"
                                    width={100}
                                    sx={{marginRight: 1}}/>
                            ) : (
                                <>
                                    {patient?.telephone && (
                                        <>
                                            <Icon path="ic-tel"/>
                                            <Typography variant="body2">
                                                {patient?.telephone}
                                            </Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
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
                            <QrCodeScanner value={patient?.uuid} width={100} height={100}/>
                        </Box>
                    )}
                </RootStyled>
            </Form>
            <CropImage
                {...{setFieldValue}}
                filedName={"picture"}
                open={openUploadPicture}
                img={values.picture}
                setOpen={setOpenUploadPicture}
            />
        </FormikProvider>
    );
}

export default PatientDetailsCard;
