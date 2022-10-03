import React from 'react'
import {CardContent, Stack, Typography,} from "@mui/material";
import CIPPatientHistoryCardStyled from './overrides/cIPPatientHistoryCardStyle';
import {capitalize} from 'lodash'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'

function CIPPatientHistoryCard({data, children}: { data: any, children?: React.ReactNode }) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    if (!ready) return <>loading translations...</>;
    return (
        <CIPPatientHistoryCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1}
                   borderColor="divider">
                <Typography display='flex' alignItems="center" component="div" fontWeight={600}>
                    <Icon path={'ic-doc'}/>
                    {capitalize(t('reason_for_consultation'))} {data?.consultationReason ? <>: {data?.consultationReason.name}</> : <>:
                    --</>}
                </Typography>
                <Typography variant='body2' color="text.secondary" ml="auto">
                    {data?.dayDate}
                </Typography>
            </Stack>
            <CardContent>
                {children}
            </CardContent>
        </CIPPatientHistoryCardStyled>
    )
}

export default CIPPatientHistoryCard