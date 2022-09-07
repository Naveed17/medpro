import React from 'react'
import PendingDocumentCardStyled from './overrides/pendingDocumentCardStyle'
import { Label } from '@features/label';
import { IconButton, Stack, Typography, } from '@mui/material';
import IconUrl from '@themes/urlIcon';
function CipCard() {
    return (
        <PendingDocumentCardStyled>
            <Stack spacing={{ xs: 1, md: 2 }} direction='row' alignItems="center" px={{ xs: 0.7, md: 1.7 }}>
                <IconButton size="small">
                    <IconUrl path="ic-analyse" />
                </IconButton>
                <Typography color="common.white" display={{ xs: 'none', md: "block" }}>
                    Demande bilan
                </Typography>

                <Label color='warning' variant='filled' className='label'>
                    En cours
                </Label>
                <IconButton size="small">
                    <IconUrl path="ic-x" />
                </IconButton>
            </Stack>
        </PendingDocumentCardStyled>
    )
}

export default CipCard