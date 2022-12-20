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

function PatientDetailsCard({...props}) {
    const {patient, onConsultation, loading} = props;

    const theme = useTheme();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: !loading && `${patient.firstName} ${patient.lastName}`,
            birthdate: !loading ? patient.birthdate : "",
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {getFieldProps} = formik;

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    const [picture, setPicture] = useState('');
    const [open, setOpen] = useState(false);


    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setPicture(URL.createObjectURL(file))
        setOpen(true);
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
                                    width={pxToRem(59)}
                                    height={pxToRem(59)}
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
                                        src={picture === '' ? patient?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg" : picture}
                                        sx={{width: 80, height: 80, background: "none"}}
                                    >
                                        <IconUrl path="ic-user-profile"/>
                                    </Avatar>
                                    <IconButton
                                        sx={{
                                            minWidth: 20
                                        }}
                                        type="button"
                                        size={"small"}
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
                                    <Icon path="ic-anniverssaire"/>
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
                            <Stack direction={"row"} alignItems="flex-start" mt={0}>
                                <Typography
                                    variant="body2"
                                    color="primary"
                                    component="span"
                                    className="email-link">
                                    {loading ? (
                                        <Skeleton variant="text" width={100}/>
                                    ) : (
                                        patient?.email && (
                                            <>
                                                <Icon path="ic-message-contour"/>
                                                {patient?.email}
                                            </>
                                        )
                                    )}
                                </Typography>
                            </Stack>
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
                open={open}
                img={picture}
                setOpen={setOpen}
                setPicture={setPicture}
                setFieldValue={null}
            />
        </FormikProvider>
    );
}

export default PatientDetailsCard;
