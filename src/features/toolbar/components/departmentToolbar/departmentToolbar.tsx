import React from "react";
import {Stack, Typography} from "@mui/material";
import {CustomIconButton} from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";

function DepartmentToolbar({...props}) {
    const {t, handleAddStaff} = props;

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("config.sub-header.title")}
            </Typography>

            <CustomIconButton
                onClick={handleAddStaff}
                variant="filled"
                sx={{p: .8}}
                color={"primary"}
                size={"small"}>
                <AgendaAddViewIcon/>
            </CustomIconButton>
        </Stack>
    )
}

export default DepartmentToolbar
