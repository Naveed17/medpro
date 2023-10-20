import {Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";

function StatsToolbar() {

    const {t} = useTranslation("stats");

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("sub-header.title")}
            </Typography>
        </Stack>
    )
}

export default StatsToolbar
