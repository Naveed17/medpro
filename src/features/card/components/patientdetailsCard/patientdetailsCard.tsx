//material-ui
import {
    Box,
    Button,
    Typography,
    Badge,
    Skeleton,
    InputBase,
    Stack,
    useTheme,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
// styled
import {RootStyled} from "./overrides";

// utils
import Icon from "@themes/urlIcon";
import {pxToRem} from "@themes/formatFontSize";
import {useTranslation} from "next-i18next";
import {useAppSelector} from "@app/redux/hooks";
import moment from "moment-timezone";
import {timerSelector} from "@features/card";
import {QrCodeScanner} from "@features/qrCodeScanner";
import {useFormik, Form, FormikProvider} from "formik";
import MaskedInput from "react-text-mask";

function PatientDetailsCard({...props}) {
    const {patient, onConsultation, loading} = props;

    const theme = useTheme();
    const {isActive} = useAppSelector(timerSelector);
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
    const {handleSubmit, values, getFieldProps} = formik;
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });
    if (!ready) return <>loading translations...</>;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <RootStyled>
                    <Badge
                        color="success"
                        variant="dot"
                        invisible={patient?.nextAppointments.length === 0}
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
                            <Box
                                component="img"
                                src={
                                    patient?.gender === "M"
                                        ? "/static/icons/men-avatar.svg"
                                        : "/static/icons/women-avatar.svg"
                                }
                                width={pxToRem(59)}
                                height={pxToRem(59)}
                                sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
                            />
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
                                        {moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), "years")}
                                        {t("years").toLowerCase()}
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
                            <Skeleton variant="text" width={100}/>
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
                    {onConsultation && (
                        <>
                            {loading ? (
                                <Skeleton
                                    variant="rectangular"
                                    sx={{
                                        ml: {md: "auto", xs: 0},
                                        maxWidth: {md: 193, xs: "100%"},
                                        minHeight: {md: 60, xs: 40},
                                        width: 153,
                                        my: 2,
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
                    )}
                    {patient && (
                        <Box ml={{lg: onConsultation ? "1rem" : "auto", xs: 0}}>
                            <QrCodeScanner value={patient?.uuid} width={100} height={100}/>
                        </Box>
                    )}
                </RootStyled>
            </Form>
        </FormikProvider>
    );
}

export default PatientDetailsCard;
