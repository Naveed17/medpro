import { Box, Stack, Typography, IconButton } from '@mui/material'
import Icon from '@themes/urlIcon'
function RoomToolbar() {
    return (
        <Stack direction='row' justifyContent="space-between" width={1} alignItems="center">
            <Typography>
                Salle d’attente
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