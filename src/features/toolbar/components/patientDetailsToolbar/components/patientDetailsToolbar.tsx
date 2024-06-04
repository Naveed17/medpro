//material-ui
import {IconButton, CardHeader, useTheme, Typography, Stack, useMediaQuery} from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import {RootStyled} from "./overrides";
import {CustomIconButton} from "@features/buttons";

function PatientDetailsToolbar({...props}) {
    const {onClose, t, fiche_id} = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <RootStyled sx={{minWidth: {md: 600, xs: "100%"}}}>
            <CardHeader
                className="header"
                avatar={
                    <CustomIconButton sx={{bgcolor: theme.palette.primary.lighter}}>
                        <Icon path="ic-filled-user-id" width={32} height={32} color={theme.palette.primary.main}/>
                    </CustomIconButton>
                }
                title={<Typography variant="subtitle1">
                    {isMobile ? t("medical_record") : t("medical_rec_title")}
                </Typography>}
                subheader={
                    <Typography variant="subtitle2" color="grey.500">
                        {t("file_no")} {fiche_id ? fiche_id : "--"}
                    </Typography>
                }
                action={
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <IconButton size="small">
                            <Icon path="ic-outline-maximize-3" width={16} height={16}
                                  color={theme.palette.text.secondary}/>
                        </IconButton>
                        <IconButton size="small" onClick={() => onClose()}>
                            <Icon path="ic-x" width={16} height={16} color={theme.palette.text.secondary}/>
                        </IconButton>
                    </Stack>
                }
            />
        </RootStyled>
    );
}

export default PatientDetailsToolbar;
