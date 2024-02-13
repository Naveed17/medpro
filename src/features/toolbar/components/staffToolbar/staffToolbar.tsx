import React from "react";
import {Stack, Typography} from "@mui/material";
import {CustomIconButton} from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";

function StaffToolbar({...props}) {
    const {t} = props;

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("sub-header.title")}
            </Typography>

            <CustomIconButton
                variant="filled"
                sx={{p: .8}}
                color={"primary"}
                size={"small"}>
                <AgendaAddViewIcon/>
            </CustomIconButton>
        </Stack>
    )
}

export default StaffToolbar
