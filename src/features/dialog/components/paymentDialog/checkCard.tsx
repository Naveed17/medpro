import { Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React, { useState } from 'react'
import CheckBoxIcon from '@mui/icons-material/Check';
function CheckCard({...props}) {
    const {t,idx,check} = props;
    
    const [expand, setExpand] = useState(true);
    
  return (
    <Stack className='check-container' spacing={2}>
        {
            expand ? (
     <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Typography display='inline-flex' alignItems='center' variant='subtitle2'>#{idx+1}
        <Typography variant='body1' ml={2}>
            {t('check_title')}
        </Typography>
          
        </Typography>   
          <IconButton className='expand-icon' onClick={()=>setExpand(false)}>
                <CheckBoxIcon/>
            </IconButton>            
        </Stack>
        ):(
            <Card>
                <CardContent></CardContent>
            </Card>
        )
        }
    </Stack>
  )
}

export default CheckCard