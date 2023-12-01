import React from 'react'
import CardStyled from './overrides/cardStyle'
import { CardContent, IconButton, Stack, Typography,useTheme,Theme } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import { Label } from '@features/label';
function UnpaidConsultationCard({...props}) {
    const {t,devise} = props;
    const theme:Theme = useTheme();
  return (
    <CardStyled>
        <CardContent>
            <Stack spacing={1}>
            <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
                <Typography color='primary' fontWeight={500}>
                    Patient Name
                </Typography>
                <IconButton className='btn-cash'>
                    <IconUrl path="ic-argent" color="white" width={20} height={20}/>
                </IconButton>
            </Stack>
            <Stack direction='row' alignItems='center' alignSelf='flex-start' className='rdv-date-row' spacing={1}>
                <Typography variant='body2' fontWeight={500}>
                    Consultation
                </Typography>
                <Stack direction='row' alignItems='center' spacing={.5}>
                    <IconUrl path="ic-agenda" width={11} height={11} color={theme.palette.text.primary}/>
                    <Typography variant='body2' fontWeight={500}>
                        10/10/2022
                    </Typography>
                    <IconUrl path="ic-time" width={11} height={11} color={theme.palette.text.primary}/>
                    <Typography variant='body2' fontWeight={500}>
                        10:00
                    </Typography>
                </Stack>
            
            </Stack>
            <Stack 
            className='labels-group'
            direction='row'
            alignItems='center'
            gap={1}
            sx={{
                
                strong:{mx:1}

            }}>
                <Label variant='filled' color='info'>
                    {t("total")}
                    <strong>
                        400
                    </strong>
                    {devise}
                </Label>
                 <Label variant='filled' color='success'>
                    {t("amount_paid")}
                    <strong>
                        400
                    </strong>
                    {devise}
                </Label>
                <Label variant='filled' color='error' className='rest-pay-label'>
                    {t("rest_pay")}
                    <strong>
                        400
                    </strong>
                    {devise}
                
                </Label>
            </Stack>
            </Stack>
        </CardContent>
    </CardStyled>
  )
}

export default UnpaidConsultationCard