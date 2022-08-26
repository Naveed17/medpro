import React from 'react'
import CipCardStyled from './overrides/cipCardStyle'
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import { Label } from '@features/label';
import { IconButton, Stack, Typography, Box } from '@mui/material';
function CipCard() {
    return (
        <CipCardStyled>
            <Stack spacing={{ xs: 1, md: 2 }} direction='row' alignItems="center" px={{ xs: 0.7, md: 1.7 }}>
                <IconButton size="small">
                    <PlayCircleRoundedIcon />
                </IconButton>
                <Typography color="common.white" display={{ xs: 'none', md: "block" }}>
                    Muhammad Ali
                </Typography>
                <Box>
                    <Typography color="common.white" variant='caption'>
                        12:12:00
                    </Typography>
                </Box>
                <Label color='warning' variant='filled' className='label'>
                    En cours
                </Label>
            </Stack>
        </CipCardStyled>
    )
}

export default CipCard