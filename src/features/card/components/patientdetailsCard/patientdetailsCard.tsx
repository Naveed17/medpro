//material-ui
import { Box, Button, Typography, Badge, Skeleton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
// styled
import { RootStyled } from "./overrides";

// utils
import Icon from "@themes/urlIcon";
import { pxToRem } from "@themes/formatFontSize";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@app/redux/hooks";
import moment from "moment-timezone";
import { timerSelector } from "@features/card";
import MenIcon from "@themes/overrides/icons/menIcon";
import WomenIcon from "@themes/overrides/icons/womenIcon";
import { QrCodeScanner } from '@features/qrCodeScanner'
function PatientDetailsCard({ ...props }) {
    const { patient, onConsultation, loading } = props;
    const { isActive } = useAppSelector(timerSelector);
    const { t, ready } = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    if (!ready) return <>loading translations...</>;
    return (
        <RootStyled>
            <Badge
                color="success"
                variant="dot"
                invisible={patient?.nextAppointments.length === 0}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                {loading ? (
                    <Skeleton
                        variant="rectangular"
                        width={pxToRem(59)}
                        height={pxToRem(59)}
                        sx={{ borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1 }}
                    />
                ) : (
                    <Box
                        component="img"
                        src={patient?.gender === "M"
                            ? "/static/icons/men-avatar.svg"
                            : "/static/icons/women-avatar.svg"}
                        width={pxToRem(59)}
                        height={pxToRem(59)}
                        sx={{ borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1 }}
                    />
                )}
            </Badge>
            <Box mx={1}>
                <Typography
                    color="text.primary"
                    sx={{
                        fontFamily: "Poppins",
                        fontSize: 19,
                        mb: 1,
                        textAlign: { md: "left", sm: "center", xs: "center" },
                    }}
                >
                    {loading ? (
                        <Skeleton variant="text" width={150} />
                    ) : (
                        `${patient?.firstName} ${patient?.lastName}`
                    )}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                    className="date-birth"
                >
                    {loading ? (
                        <Skeleton variant="text" width={150} />
                    ) : (
                        <>
                            <Icon path="ic-anniverssaire" />
                            {patient?.birthdate} -{" "}
                            {patient?.birthdate &&
                                (`${moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), "years")} ${t("years")}`)}
                        </>
                    )}
                </Typography>
            </Box>
            <div>
                {loading ? (
                    <Skeleton variant="text" width={150} />
                ) : (
                    <Typography
                        visibility={"hidden"}
                        variant="body2" component="span" className="alert">
                        <Icon path="danger" />
                        {t("duplicate")}
                    </Typography>
                )}

                <Typography
                    variant="body2"
                    color="primary"
                    component="span"
                    className="email-link"
                >
                    {loading ? (
                        <Skeleton variant="text" width={100} />
                    ) : (
                        patient?.email && <>
                            <Icon path="ic-message-contour" />
                            {patient?.email}
                        </>
                    )}
                </Typography>
            </div>
            <Box
                display="flex"
                alignItems="center"
                sx={{ ml: { md: 1, sm: 0, xs: 0 }, mt: { md: 4, sm: 1, xs: 1 } }}
            >
                {loading ? (
                    <Skeleton variant="text" width={100} />
                ) : (
                    <>
                        {patient?.telephone && (
                            <>
                                <Icon path="ic-tel" />
                                <Typography variant="body2">{patient?.telephone}</Typography>
                            </>
                        )}
                    </>
                )}
            </Box>
            {onConsultation &&
                <>{loading ? (
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            ml: { md: "auto", xs: 0 },
                            maxWidth: { md: 193, xs: "100%" },
                            minHeight: { md: 60, xs: 40 },
                            width: 153,
                            my: 2,
                            borderRadius: "4px",
                        }}
                    />
                ) : (
                    <Button
                        disabled={isActive}
                        onClick={onConsultation}
                        variant="contained"
                        color="warning"
                        startIcon={<PlayCircleIcon />}
                        sx={{
                            ml: { md: "auto", sm: 0, xs: 0 },
                            maxWidth: { md: 193, xs: "100%" },
                            my: 2,
                        }}
                    >
                        {t("start-consultation")}
                    </Button>
                )}
                </>
            }
            <Box ml={{ lg: 'auto', xs: 0 }}>
                <QrCodeScanner value="123" width={80} height={80} />
            </Box>
        </RootStyled>
    );
}

export default PatientDetailsCard;
