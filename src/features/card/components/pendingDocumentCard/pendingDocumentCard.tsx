import React from 'react'
import PendingDocumentCardStyled from './overrides/pendingDocumentCardStyle'
import { Label } from '@features/label';
import { IconButton, Stack, Typography, } from '@mui/material';
import IconUrl from '@themes/urlIcon';
function CipCard({ ...props }) {
    const { data, t, closeDocument } = props
    return (
        <PendingDocumentCardStyled>
            <Stack spacing={{ xs: 1, md: 2 }} direction='row' alignItems="center">
                <IconButton size="small">
                    <IconUrl path={data.icon} />
                </IconButton>
                <Typography color="common.white">
                    {data.name}
                </Typography>

                <Label color='warning' variant='filled' className='label'>
                    {t(data.status)}
                </Label>
                <IconButton size="small" className='btn-close' onClick={() => closeDocument(data.id)}>
                    <IconUrl path="ic-x" />
                </IconButton>
            </Stack>
        </PendingDocumentCardStyled>
    )
}

export default CipCard