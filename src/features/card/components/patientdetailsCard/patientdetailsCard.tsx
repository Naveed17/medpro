//material-ui
import {Box, Button, Typography, Badge} from "@mui/material";
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

function PatientdetailsCard() {
    const {patient} = useAppSelector(tableActionSelector);
    console.log(patient);
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
                <Box
                    component="img"
                    src={"/static/img/150-13 6.png"}
                    width={pxToRem(59)}
                    height={pxToRem(59)}
                    sx={{borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1}}
                />
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
                    {patient && patient.firstName + ' ' + patient.lastName}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                    className="date-birth"
                >
                    <Icon path="ic-anniverssaire"/>
                    {patient && patient.birthdate + ' - ' + moment().diff(patient.birthdate, "years") + ' ans'}
                </Typography>
            </Box>
            {/*            <div>
                {false && <Typography variant="body2" component="span" className="alert">
                    <Icon path="danger"/>
                    {t("duplicate")}
                </Typography>}
                <Typography
                    variant="body2"
                    color="primary"
                    component="span"
                    className="email-link"
                >
                    <Icon path="ic-message-contour"/>
                    {t("add-email")}
                </Typography>
            </div>*/}
            <Box
                display="flex"
                alignItems="center"
                sx={{ml: {md: 1, sm: 0, xs: 0}, mt: {md: 4, sm: 1, xs: 1}}}
            >
                <Icon path="ic-tel"/>
                <Typography variant="body2">{patient && patient.contact[0].value}</Typography>
            </Box>
            <Button
                onClick={() => {
                    router.push({query}, `/dashboard/consultation/${patient.uuid}`, {locale: router.locale});
                }}
                variant="contained"
                color="warning"
                startIcon={<PlayCircleIcon/>}
                sx={{
                    ml: {md: "auto", sm: 0, xs: 0},
                    maxWidth: {md: 193, sm: "100%", xs: "100%"},
                    height: pxToRem(60),
                    borderRadius: pxToRem(10),
                    my: 2,
                }}
            >
                <span style={{textAlign: 'initial'}}>{t("start-consultation")}</span>
            </Button>
        </RootStyled>
    );
}

export default PatientdetailsCard;
