import React from 'react'
import { CardContent, Stack, Typography, } from "@mui/material";
import CIPPatientHistoryCardStyled from './overrides/cIPPatientHistoryCardStyle';
import { capitalize } from 'lodash'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next'
function CIPPatientHistoryCard({ data, children }: { data: any, children?: React.ReactNode }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    if (!ready) return <>loading translations...</>;
    return (
        <CIPPatientHistoryCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1} borderColor="divider">
                <Typography display='flex' alignItems="center" component="div" fontWeight={600}>
                    <Icon path={data.icon} />
                    {capitalize(t(data.title))} {data.type && <>:{t(data.type)}</>}
                </Typography>
                <Typography variant='body2' color="text.secondary" ml="auto">
                    {data.date}
                </Typography>
            </Stack>
            <CardContent>
                {children}
            </CardContent>
        </CIPPatientHistoryCardStyled>
    )
}

export default CIPPatientHistoryCard