import {useSnackbar} from "notistack";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

function CloseSnackbarAction({id}: any) {
    const {closeSnackbar} = useSnackbar();
    return (
        <IconButton
            className={"snackbar-notification-action"}
            onClick={() => {
                closeSnackbar(id)
            }}>
            <CloseIcon/>
        </IconButton>)
}

export default CloseSnackbarAction;
