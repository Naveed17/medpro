import {Card, CardContent, Grid, Typography, List, ListItem, ListItemIcon, Stack, Box} from '@mui/material'
import React from 'react'
import {useTranslation} from 'next-i18next'
import RootStled from './overrides/rootStyle';
import CircleIcon from '@mui/icons-material/Circle';

function MotifCard({...props}) {
    const {data} = props;
    const models = data.appointmentData.find((appData: { type: string }) => appData.type === 'models')
    const notmodels = data.appointmentData.find((appData: { type: string }) => appData.type !== 'models')

    const {t, ready} = useTranslation('consultation', {keyPrefix: 'consultationIP'})
    if (!ready) return <>loading translations...</>
    return (
        <RootStled>
            <Grid container spacing={2}>
                {models && <Grid item xs={12} md={6}>
                    <Card className="motif-card">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between"
                                   textTransform={"capitalize"}>
                                <Typography variant="body2" fontWeight={700} marginBottom={1}>
                                    {t('tracking_data')}
                                </Typography>
                                {/*
                                <Button size="small" sx={{ml: 'auto'}}>{t('see_the_curve')}</Button>
*/}
                            </Stack>
                            <List dense style={{marginLeft: 20, textTransform: 'capitalize'}}>
                                {Object.keys(JSON.parse(models.value)).map((ml, idx) => (
                                    ml !== "submit" && <ListItem key={'modelData' + idx}>
                                        <ListItemIcon>
                                            <CircleIcon/>
                                        </ListItemIcon>
                                        {ml} : {JSON.parse(models.value)[ml] ? JSON.parse(models.value)[ml] : '--'}
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>}

                {notmodels && <Grid item xs={12} md={6}>
                    <Card className="motif-card">
                        <CardContent>
                            {data.appointmentData.map((data: { name: string, value: string }, idx: number) => (
                                data.name !== 'models' && <Box key={'data-appointement' + idx}>
                                    <Typography variant="body2" fontWeight={700}
                                                textTransform={"capitalize"}>
                                        {data.name}
                                    </Typography>
                                    <List style={{marginLeft: 20}}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CircleIcon/>
                                            </ListItemIcon>
                                            {data.value}
                                        </ListItem>
                                    </List>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>}

            </Grid>
        </RootStled>
    )
}

export default MotifCard