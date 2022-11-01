//material-ui
import {Box, List, ListItem, IconButton, Button} from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import {RootStyled} from "./overrides";
import {useTranslation} from "next-i18next";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {dialogPatientDetailSelector, toggleEdit} from "@features/dialog";

function PatientDetailsToolbar({...props}) {
    const dispatch = useAppDispatch();

    const {edit} = useAppSelector(dialogPatientDetailSelector);
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    if (!ready) return <>loading translations...</>;

    return (
        <RootStyled sx={{minWidth: {md: 726, xs: "100%"}}}>
            <Box className="header">
                <nav>
                    <List sx={{display: "flex"}}>
                        <ListItem disablePadding sx={{marginRight: "20px"}}>
                            <Button
                                onClick={() => dispatch(toggleEdit())}
                                variant="contained"
                                color="primary"
                                disabled={edit}
                                startIcon={<Icon path="ic-edit"/>}
                            >
                                {t("edit")}
                            </Button>
                        </ListItem>
                        <ListItem disablePadding>
                            <IconButton
                                onClick={() => props.onClose()}
                                color="primary"
                                edge="start"
                            >
                                <Icon path="ic-x"/>
                            </IconButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
        </RootStyled>
    );
}

export default PatientDetailsToolbar;
