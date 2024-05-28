import { CustomIconButton } from '@features/buttons';
import { Card, CardHeader, Typography, useTheme, CardContent, Stack, Paper, TextField } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React from 'react'
import PanelStyled from './overrides/panelStyle';
import { NextRdvCard, PrevRdvCard } from '@features/card';

function MedicalRec({ ...props }) {
    const theme = useTheme();
    const { t } = props
    return (
        <PanelStyled>
            <Card sx={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
                <CardHeader
                    sx={{
                        pb: 0,
                        '.MuiCardHeader-action': {
                            alignSelf: 'center'
                        }
                    }}

                    title={<Typography color={theme.palette.grey[900]} variant='subtitle1' fontWeight={600} fontSize={18}>
                        {t("measure")}
                    </Typography>}

                />
                <CardContent>
                    <Stack display="grid" sx={{
                        gridTemplateColumns: {
                            xs: `repeat(1,minmax(0,1fr))`,
                            md: `repeat(2, minmax(0, 1fr))`,
                        },
                        gap: 1,


                    }}>
                        <Paper className='measure-wrapper'>
                            <CardHeader
                                sx={{ p: 0 }}
                                avatar={
                                    <CustomIconButton sx={{ bgcolor: theme.palette.success.lighter }}>
                                        <IconUrl path="ic-weight" />
                                    </CustomIconButton>
                                }

                                title={<Typography lineHeight={1.2} fontWeight={600}>
                                    {t("weight")}
                                </Typography>}
                                subheader={
                                    <Stack spacing={-0.5}>
                                        <Typography color="text.primary" variant='caption' component='div' fontWeight={400}>
                                            <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                74
                                            </Typography>
                                            kg</Typography>
                                    </Stack>
                                }
                            />
                        </Paper>
                        <Paper className='measure-wrapper'>
                            <CardHeader
                                sx={{ p: 0 }}
                                avatar={
                                    <CustomIconButton sx={{ bgcolor: theme.palette.primary.lighter }}>
                                        <IconUrl path="ic-oxygen" />
                                    </CustomIconButton>
                                }

                                title={<Typography lineHeight={1.2} fontWeight={600}>
                                    {t("oxygen")}
                                </Typography>}
                                subheader={
                                    <Stack spacing={-0.5}>
                                        <Typography color="text.primary" variant='caption' component='div' fontWeight={400}>
                                            <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                98
                                            </Typography>
                                            %</Typography>
                                    </Stack>
                                }
                            />
                        </Paper>
                        <Paper className='measure-wrapper'>
                            <CardHeader
                                sx={{ p: 0 }}
                                avatar={
                                    <CustomIconButton sx={{ bgcolor: theme.palette.error.lighter }}>
                                        <IconUrl path="ic-filled-heart-pulse-2" />
                                    </CustomIconButton>
                                }

                                title={<Typography lineHeight={1.2} fontWeight={600}>
                                    {t("heart_rate")}
                                </Typography>}
                                subheader={
                                    <Stack spacing={-0.5}>
                                        <Typography color="text.primary" variant='caption' component='div' fontWeight={400}>
                                            <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                88
                                            </Typography>
                                            bpm</Typography>
                                    </Stack>
                                }
                            />
                        </Paper>
                        <Paper className='measure-wrapper'>
                            <CardHeader
                                sx={{ p: 0 }}
                                avatar={
                                    <CustomIconButton sx={{ bgcolor: theme.palette.grey[50] }}>
                                        <IconUrl path="ic-filled-triangle-grid" />
                                    </CustomIconButton>
                                }

                                title={<Typography lineHeight={1.2} fontWeight={600}>
                                    {t("glucose")}
                                </Typography>}
                                subheader={
                                    <Stack spacing={-0.5}>
                                        <Typography color="text.primary" variant='caption' component='div' fontWeight={400}>
                                            <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                211
                                            </Typography>
                                            mg/dl</Typography>
                                    </Stack>
                                }
                            />
                        </Paper>
                    </Stack>
                    <Stack spacing={1} mt={2}>
                        <Stack>
                            <Typography gutterBottom variant='subtitle1' fontSize={18}>
                                {t("examen_history")}
                            </Typography>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <TextField
                                    fullWidth
                                    placeholder={t("search")}
                                    InputProps={{
                                        startAdornment: <IconUrl path="ic-search" />
                                    }}
                                />
                                <CustomIconButton icon="ic-outline-filter" />
                            </Stack>
                        </Stack>
                        <Typography variant='subtitle2' fontSize={18} fontWeight={600}>
                            {t("next_rdv")}
                        </Typography>
                        <NextRdvCard />
                        <Typography variant='subtitle2' fontSize={18} fontWeight={600}>
                            {t("prev_rdv")}
                        </Typography>
                        <PrevRdvCard />
                    </Stack>
                </CardContent>
            </Card>
        </PanelStyled>
    )
}

export default MedicalRec