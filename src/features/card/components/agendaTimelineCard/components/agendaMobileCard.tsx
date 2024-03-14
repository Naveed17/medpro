import React from 'react'
import { StyledCard } from './overrides/cardStyle'
import { CardContent, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import OnGogingCircleIcon from '@themes/overrides/icons/onGogingCircleIcon'
function AgendaMobileCard() {
    return (
        <StyledCard>
            <CardContent>
                <Stack direction='row' alignItems='center'>
                    <OnGogingCircleIcon />
                    <Typography mx={1} variant='body2' fontWeight={600}>Amrou Bouhawela</Typography>
                    <Stack direction='row' alignItems='center' spacing={.5} ml="auto">
                        <IconUrl path="ic-time" width={16} height={16} />
                        <Typography fontSize={10} variant='body2'>09:45</Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </StyledCard>
    )
}

export default AgendaMobileCard