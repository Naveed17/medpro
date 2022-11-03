//material-ui
import {Box, List, ListItem, IconButton} from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import {RootStyled} from "./overrides";

function PatientDetailsToolbar({...props}) {
    const {onClose} = props;

    return (
        <RootStyled sx={{minWidth: {md: 726, xs: "100%"}}}>
            <Box className="header">
                <nav>
                    <List sx={{display: "flex"}}>
                        <ListItem disablePadding>
                            <IconButton
                                onClick={() => onClose()}
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
