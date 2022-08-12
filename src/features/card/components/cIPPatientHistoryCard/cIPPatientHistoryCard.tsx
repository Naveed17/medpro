import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Stack, Typography, } from "@mui/material";
import CIPPatientHistoryCardStyled from './overrides/cIPPatientHistoryCardStyle'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next'
function CIPPatientHistoryCard({ data }: { data: any }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    if (!ready) return <>loading translations...</>;
    return (
        <CIPPatientHistoryCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1} borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body2" component="div" color="secondary" fontWeight={500}>
                    <Icon path='ic-doc' />
                    {t(data.title)}
                </Typography>
                <Typography variant='body2' color="text.secondary" ml="auto">
                    {data.date}
                </Typography>
            </Stack>
            <List dense>
                {data.actions.map((item: any) => (
                    <ListItem key={item.id}>
                        <ListItemIcon>
                            <Icon path="ic-plus" />
                        </ListItemIcon>
                        <ListItemText primary={t(item.name)} />
                    </ListItem>
                ))}
            </List>
        </CIPPatientHistoryCardStyled>
    )
}

export default CIPPatientHistoryCard