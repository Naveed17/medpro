import { Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import React from 'react'

function MedicalImagingMobileCard({...props}) {
    const {data,edit} = props
  return (
    <Card>
        <CardContent>
            <Stack direction="row" alignItems='center' justifyContent="space-between">
                <Typography variant="subtitle2" className='ellipsis' maxWidth={250}>{data.name}</Typography>
                 <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                        <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={() => edit(data, "edit")}>
                            <IconUrl path="setting/edit"/>
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={() => edit(data, "delete")}>
                            <IconUrl path="setting/icdelete"/>
                        </IconButton>
                    </Stack>
            </Stack>
        </CardContent>
    </Card>
  )
}

export default MedicalImagingMobileCard