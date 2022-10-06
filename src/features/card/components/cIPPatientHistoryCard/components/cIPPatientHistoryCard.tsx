import React from 'react'
import {CardContent, Stack, Typography,} from "@mui/material";
import CIPPatientHistoryCardStyled from './overrides/cIPPatientHistoryCardStyle';
import {capitalize} from 'lodash'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'

function CIPPatientHistoryCard({data,appuuid, children}: { data: any,appuuid:string, children?: React.ReactNode }) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    if (!ready) return <>loading translations...</>;
    return (
        <CIPPatientHistoryCardStyled style={{border:data.appointment.uuid === appuuid ? '2px solid #FFD400':''}}>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1}
                   borderColor="divider">
                <Typography display='flex' alignItems="center" component="div" fontWeight={600}>
                    <Icon path={'ic-doc'}/>
                    {capitalize(t('reason_for_consultation'))} {data?.appointment.consultationReason ? <>: {data?.appointment.consultationReason.name}</> : <>:
                    --</>}
                </Typography>
                <Typography variant='body2' color="text.secondary" ml="auto">
                    {data?.appointment.dayDate}
                </Typography>
            </Stack>
            <CardContent>
                {children}
            </CardContent>
        </CIPPatientHistoryCardStyled>
    )
}

export default CIPPatientHistoryCard