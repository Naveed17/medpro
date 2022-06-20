import { Box, Stack, Typography, IconButton } from '@mui/material'
import { useTranslation } from "next-i18next";
import Icon from '@themes/urlIcon'
function RoomToolbar() {
    const { t, ready } = useTranslation('waitingRoom');
    if (!ready) return (<>loading translations...</>);
    return (
        <Stack direction='row' justifyContent="space-between" width={1} alignItems="center">
            <Typography>
                {t('subheader.title')}
            </Typography>
            <IconButton
                sx={{
                    transform: "rotate(90deg)"
                    , svg: {
                        width: 20,
                        height: 20,
                    }
                }}

                color="inherit"
            >
                <Icon path="ic-menu" />
            </IconButton>
        </Stack>
    )
}

export default RoomToolbar