//material-ui
import {Box, Button, Typography, Badge, Skeleton} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {useRouter} from "next/router";
// styled
import {RootStyled} from "./overrides";

// utils
import Icon from "@themes/urlIcon";
import {pxToRem} from "@themes/formatFontSize";
import {useTranslation} from "next-i18next";
import {useAppSelector} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";
import moment from "moment-timezone";

function PatientdetailsCard({...props}) {
    const {patient, loading} = props;
    const {patientId} = useAppSelector(tableActionSelector);
    const router = useRouter();
    const {query} = router;
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });
    if (!ready) return <>loading translations...</>;
    return (
        <RootStyled>
            <Badge
                color="success"
                variant="dot"
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
                        sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
                    />
                ) : (
                    <Box
                        component="img"
                        src={"/static/img/150-13 6.png"}
                        width={pxToRem(59)}
                        height={pxToRem(59)}
                        sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
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
                        textAlign: {md: "left", sm: "center", xs: "center"},
                    }}
                >
                    {loading ? (
                        <Skeleton variant="text" width={150}/>
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
                        <Skeleton variant="text" width={150}/>
                    ) : (
                        <>
                            <Icon path="ic-anniverssaire"/>
                            {patient?.birthdate} -{" "}
                            {moment().diff(new Date(patient?.birthdate), "years")}{" "}
                            {t("years")}
                        </>
                    )}
                </Typography>
            </Box>
            <div>
                {loading ? (
                    <Skeleton variant="text" width={150}/>
                ) : (
                    <Typography variant="body2" component="span" className="alert">
                        <Icon path="danger"/>
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
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <>
                            <Icon path="ic-message-contour"/>
                            {t("add-email")}
                        </>
                    )}
                </Typography>
            </div>
            <Box
                display="flex"
                alignItems="center"
                sx={{ml: {md: 1, sm: 0, xs: 0}, mt: {md: 4, sm: 1, xs: 1}}}
            >
                {loading ? (
                    <Skeleton variant="text" width={100}/>
                ) : (
                    <>
                        {patient?.telephone && (
                            <>
                                <Icon path="ic-tel"/>
                                <Typography variant="body2">{patient?.telephone}</Typography>
                            </>
                        )}
                    </>
                )}
            </Box>
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
                    onClick={() => {
                        router.push({query}, `/dashboard/consultation/${patientId}`, {
                            locale: router.locale,
                        });
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={<PlayCircleIcon/>}
                    sx={{
                        ml: {md: "auto", sm: 0, xs: 0},
                        maxWidth: {md: 193, xs: "100%"},
                        my: 2,
                    }}
                >
                    {t("start-consultation")}
                </Button>
            )}
        </RootStyled>
    );
}

export default PatientdetailsCard;
