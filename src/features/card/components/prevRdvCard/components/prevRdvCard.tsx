import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import React, { useState } from 'react'
import CardStyled from './overrides/cardStyle'
import { Stack, Theme, Typography, useTheme } from '@mui/material'
import { CustomIconButton } from '@features/buttons'
import IconUrl from '@themes/urlIcon'
import { Label } from '@features/label'
function PrevRdvCard() {
    const theme = useTheme();
    return (

        <CardStyled
            sx={{
                px: 0,
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}
        >
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot variant='outlined' color='primary' />

                </TimelineSeparator>
                <TimelineContent>

                </TimelineContent>
            </TimelineItem>
        </CardStyled>

    )
}

export default PrevRdvCard