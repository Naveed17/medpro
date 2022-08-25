import { Card, CardContent, Grid, Typography, List, ListItem, ListItemIcon, Button, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'next-i18next'
import RootStled from './overrides/rootStyle';
import CircleIcon from '@mui/icons-material/Circle';
function MotifCard({ data }: any) {
    const { t, ready } = useTranslation('consultation', { keyPrefix: 'consultationIP' })
    if (!ready) return <>loading translations...</>
    return (
        <RootStled>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card className="motif-card">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={700}>
                                    {t('tracking_data')}
                                </Typography>
                                <Button size="small" sx={{ ml: 'auto' }}>{t('see_the_curve')}</Button>
                            </Stack>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <CircleIcon />
                                    </ListItemIcon>
                                    {t('weight')} : {data.weight} KG
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CircleIcon />
                                    </ListItemIcon>
                                    {t('height')} : {data.height} CM
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CircleIcon />
                                    </ListItemIcon>
                                    IMC:
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CircleIcon />
                                    </ListItemIcon>
                                    {t('temperature')} : {data.temperature}
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="motif-card">
                        <CardContent>
                            <Typography variant="body2" fontWeight={700}>
                                {t('diagonistic')}
                            </Typography>
                            <List dense>
                                {
                                    data.diseases.map((disease: any) => (
                                        <ListItem key={`list-${disease}`}>
                                            <ListItemIcon>
                                                <CircleIcon />
                                            </ListItemIcon>
                                            {t(disease)}
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </RootStled>

    )
}

export default MotifCard