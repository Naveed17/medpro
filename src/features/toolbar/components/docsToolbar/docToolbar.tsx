import {Button, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useCallback} from "react";

function DocToolbar() {
    const {t} = useTranslation("docs");

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("sub-header.sub-title")}
            </Typography>
        </Stack>
    )
}

export default DocToolbar
