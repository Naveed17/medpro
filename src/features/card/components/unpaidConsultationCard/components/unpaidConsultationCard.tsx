import React from 'react'
import CardStyled from './overrides/cardStyle'
import { CardContent, IconButton, Stack, Typography,useTheme,Theme, Link, Tooltip, Avatar } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import { Label } from '@features/label';
import { ConditionalWrapper } from '@lib/hooks';
import { ImageHandler } from '@features/image';
import moment from 'moment-timezone';
function UnpaidConsultationCard({...props}) {
    const {t,devise,row,handleEvent,insurances} = props;
    const theme:Theme = useTheme();
    console.log(row)
  return (
    <CardStyled>
        <CardContent>
            <Stack spacing={1}>
            <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
                <ConditionalWrapper
                        condition={!row.patient?.isArchived}
                        wrapper={(children: any) => <Link
                            sx={{cursor: "pointer"}}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEvent({action: "PATIENT_DETAILS", row: row.patient, event});
                            }}
                            underline="none">{children}</Link>}>
                        {`${row.patient.firstName} ${row.patient.lastName}`}
                    </ConditionalWrapper>
                <IconButton className='btn-cash' 
                 onClick={event => {
                                event.stopPropagation();
                                handleEvent({action: "PAYMENT", row, event});
                            }}
                >
                    <IconUrl path="ic-argent" color="white" width={20} height={20}/>
                </IconButton>
            </Stack>
            <Stack direction='row' alignItems='center' alignSelf='flex-start' className='rdv-date-row' spacing={1}>
               <Stack direction={"row"} justifyContent={"center"}>
                    {
                        row.patient.insurances.length > 0 ? row.patient.insurances.map((insurance: any) => (
                            <Tooltip
                                key={insurance.insurance?.uuid + "ins"}
                                title={insurance.name}>
                                <Avatar variant={"circular"}>
                                    <ImageHandler
                                        alt={insurance?.name}
                                        src={insurances.find((ins:any) => ins.uuid === insurance?.uuid)?.logoUrl.url}
                                    />
                                </Avatar>
                            </Tooltip>
                        )) : 
                        <Tooltip        
                        title={'No Insurance Data'}>
                        <Typography>--</Typography>
                        </Tooltip>
                    }
                </Stack>
                <Stack direction='row' alignItems='center' spacing={.5}>
                    <IconUrl path="ic-agenda" width={11} height={11} color={theme.palette.text.primary}/>
                    <Typography variant='body2' fontWeight={500}>
                        {moment(row.dayDate,'DD-MM-YYYY').format('DD-MM-YYYY')}
                    </Typography>
                    <IconUrl path="ic-time" width={11} height={11} color={theme.palette.text.primary}/>
                    <Typography variant='body2' fontWeight={500}>
                        {row.startTime}
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
                        {row.fees ? row.fees : row.appointmentRestAmount} {devise}
                    </strong>
                    {devise}
                </Label>
                 <Label variant='filled' color='success'>
                    {t("amount_paid")}
                    <strong>
                        { row.fees ? row.fees - row.appointmentRestAmount : 0}
                    </strong>
                    {devise}
                </Label>
                <Label variant='filled' color='error' className='rest-pay-label'>
                    {t("rest_pay")}
                    <strong>
                        {row.appointmentRestAmount} {devise}
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