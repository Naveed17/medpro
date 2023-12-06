import React from 'react'
import {Box, Stack} from '@mui/material'

function MedAIDialog({...props}) {

    const {data} = props
    return (
        <Box>
            <Stack direction={"row"} spacing={1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img style={{width: 35, height: 35}} src={"/static/img/medical-robot.png"} alt={"ai doctor logo"}/>
                <div style={{background: 'rgba(145, 158, 171, 0.16)', padding: 10, borderRadius: 10}}>{data.response}</div>
            </Stack>
        </Box>
    )
}

export default MedAIDialog
