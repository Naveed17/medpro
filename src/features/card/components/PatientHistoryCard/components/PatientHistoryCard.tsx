import React from 'react'
import { CardContent, Stack, Typography, } from "@mui/material";
import PatientHistoryCardStyled from './overrides/PatientHistoryCardStyle';
import { capitalize } from 'lodash'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next'

function PatientHistoryCard({ data, appuuid, t, children }: { data: any, appuuid: string, children?: React.ReactNode, t: any }) {
    return (
        <PatientHistoryCardStyled style={{ border: data.appointment.uuid === appuuid ? '2px solid #FFD400' : '' }}>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1}
                borderColor="divider">
                <Typography display='flex' alignItems="center" component="div" fontWeight={600}>
                    <Icon path={'ic-doc'} />
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
        </PatientHistoryCardStyled>
    )
}

export default PatientHistoryCard