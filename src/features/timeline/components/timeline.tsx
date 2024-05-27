import React from 'react'
import {
    Timeline as MuiTimeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
    TimelineDot
} from '@mui/lab';

function Timeline({...props}) {
    const {data = []} = props
    return (
        <MuiTimeline
            sx={{
                p: 0,
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                },
            }
            }>
            {data.map((timeline: any, idx: number) =>
                <TimelineItem key={idx}>
                    <TimelineOppositeContent
                        sx={{fontWeight: 600, pl: 0, pr: .5, textAlign: 'left'}}>
                        {timeline.time}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color={timeline.color ?? 'primary'}/>
                        {idx !== data.length - 1 && <TimelineConnector/>}
                    </TimelineSeparator>
                    <TimelineContent>
                        {timeline.children}
                    </TimelineContent>
                </TimelineItem>
            )}

        </MuiTimeline>
    )
}

export default Timeline
