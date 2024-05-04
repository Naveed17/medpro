import React, { useState } from 'react'
import RootStyled from './overrides/rootStyle'
import { Button, ButtonGroup, Card, CardContent, CardHeader, Paper, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import { CustomIconButton } from '@features/buttons';
import dynamic from 'next/dynamic';
import { ChartsOption, ChartStyled } from "@features/charts";
import { merge } from 'lodash';
import { NextRdvCard, PrevRdvCard } from '@features/card';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
function MedicalRec({ ...props }) {
    const { t, theme } = props

    const [charView, setChartView] = useState<string>("A");
    const input = React.useRef<any>();
    return (
        <RootStyled className='medical-rec'>
            <Stack spacing={2}>
                <Card>
                    <CardHeader
                        sx={{
                            '.MuiCardHeader-action': {
                                alignSelf: 'center'
                            }
                        }}
                        action={
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <ButtonGroup
                                    className='chart-view'
                                    disableElevation
                                    variant="outlined"
                                    color="info"
                                >
                                    <Button className={charView === "A" ? "active" : ""} onClick={() => setChartView("A")}>
                                        <IconUrl path="ic-outline-presention-chart" />
                                    </Button>
                                    <Button className={charView === "B" ? "active" : ""} onClick={() => setChartView("B")}>
                                        <IconUrl path="ic-outline-menu" />
                                    </Button>
                                </ButtonGroup>
                                <CustomIconButton>
                                    <IconUrl path="ic-plus" width={16} height={16} />
                                </CustomIconButton>
                            </Stack>
                        }
                        title={<Typography color={theme.palette.grey[900]} variant='h6' fontWeight={600} fontSize={20}>
                            {t("measure")}
                        </Typography>}
                        subheader={<Typography color={theme.palette.grey[500]} fontWeight={600} variant='subtitle2'>{t("last_measurement")} 04/17/2024</Typography>}
                    />
                    <CardContent>
                        <Stack display="grid" sx={{
                            gridTemplateColumns: {
                                xs: `repeat(1,minmax(0,1fr))`,
                                md: `repeat(2, minmax(0, 1fr))`,
                                xl: `repeat(4, minmax(0, 1fr))`
                            },
                            gap: 1,


                        }}>
                            <Paper className='chart-wrapper'>
                                <CardHeader
                                    sx={{ p: 0 }}
                                    avatar={
                                        <CustomIconButton sx={{ bgcolor: theme.palette.success.lighter }}>
                                            <IconUrl path="ic-weight" />
                                        </CustomIconButton>
                                    }

                                    title={<Typography lineHeight={1.2} variant='subtitle2' fontWeight={600}>
                                        {t("weight")}
                                    </Typography>}
                                    subheader={
                                        <Stack spacing={-0.5}>
                                            <Typography color="text.primary" variant='caption' component='div' fontWeight={600}>
                                                <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                    74
                                                </Typography>
                                                kg</Typography>
                                        </Stack>
                                    }
                                />
                                <ChartStyled>
                                    <Chart
                                        type="area"
                                        series={
                                            [{
                                                name: "Series 1",
                                                data: [10, 0, 20, 0, 30, 0, 40],
                                                color: theme.palette.success.main,

                                            }
                                            ]}
                                        options={merge(ChartsOption(), {
                                            xaxis: {
                                                labels: {
                                                    show: false,
                                                }
                                            },
                                            yaxis: {
                                                labels: {
                                                    offsetX: -10,
                                                    formatter: (value: number) => { return Math.trunc(value) },
                                                }
                                            },

                                        }) as any}
                                        height={150} />
                                </ChartStyled>
                            </Paper>
                            <Paper className='chart-wrapper'>
                                <CardHeader
                                    sx={{ p: 0 }}
                                    avatar={
                                        <CustomIconButton sx={{ bgcolor: theme.palette.primary.lighter }}>
                                            <IconUrl path="ic-oxygen" />
                                        </CustomIconButton>
                                    }

                                    title={<Typography lineHeight={1.2} variant='subtitle2' fontWeight={600}>
                                        {t("oxygen")}
                                    </Typography>}
                                    subheader={
                                        <Stack spacing={-0.5}>
                                            <Typography color="text.primary" variant='caption' component='div' fontWeight={600}>
                                                <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                    98
                                                </Typography>
                                                %</Typography>
                                        </Stack>
                                    }
                                />
                                <ChartStyled>
                                    <Chart
                                        type="area"
                                        series={
                                            [{
                                                name: "Series 1",
                                                data: [10, 0, 20, 0, 30, 0, 100],
                                                color: theme.palette.primary.main,

                                            }
                                            ]}
                                        options={merge(ChartsOption(), {
                                            xaxis: {
                                                labels: {

                                                    show: false,
                                                }
                                            },
                                            yaxis: {
                                                labels: {
                                                    offsetX: -15,
                                                    formatter: (value: number) => { return Math.trunc(value) },
                                                }
                                            },

                                        }) as any}
                                        height={150} />
                                </ChartStyled>
                            </Paper>
                            <Paper className='chart-wrapper'>
                                <CardHeader
                                    sx={{ p: 0 }}
                                    avatar={
                                        <CustomIconButton sx={{ bgcolor: theme.palette.error.lighter }}>
                                            <IconUrl path="ic-filled-heart-pulse-2" />
                                        </CustomIconButton>
                                    }

                                    title={<Typography lineHeight={1.2} variant='subtitle2' fontWeight={600}>
                                        {t("heart_rate")}
                                    </Typography>}
                                    subheader={
                                        <Stack spacing={-0.5}>
                                            <Typography color="text.primary" variant='caption' component='div' fontWeight={600}>
                                                <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                    88
                                                </Typography>
                                                bpm</Typography>
                                        </Stack>
                                    }
                                />
                                <ChartStyled>
                                    <Chart
                                        type="line"
                                        series={
                                            [{
                                                name: "Series 1",
                                                data: [72, 76, 72, 75, 72, 77, 72, 76, 72, 75],
                                                color: theme.palette.error.main,

                                            }
                                            ]}
                                        options={merge(ChartsOption(), {
                                            stroke: {
                                                width: 2,
                                                curve: 'straight',
                                                lineCap: 'round'
                                            },
                                            xaxis: {
                                                labels: {
                                                    show: false,
                                                }
                                            },
                                            yaxis: {
                                                labels: {
                                                    offsetX: -10,
                                                    formatter: (value: number) => { return Math.trunc(value) },
                                                }
                                            },

                                        }) as any}
                                        height={150} />
                                </ChartStyled>
                            </Paper>
                            <Paper className='chart-wrapper'>
                                <CardHeader
                                    sx={{ p: 0 }}
                                    avatar={
                                        <CustomIconButton sx={{ bgcolor: theme.palette.grey[50] }}>
                                            <IconUrl path="ic-filled-triangle-grid" />
                                        </CustomIconButton>
                                    }

                                    title={<Typography lineHeight={1.2} variant='subtitle2' fontWeight={600}>
                                        {t("glucose")}
                                    </Typography>}
                                    subheader={
                                        <Stack spacing={-0.5}>
                                            <Typography color="text.primary" variant='caption' component='div' fontWeight={600}>
                                                <Typography mr={.5} fontSize={18} component='span' fontWeight={600}>
                                                    211
                                                </Typography>
                                                mg/dl</Typography>
                                        </Stack>
                                    }
                                />
                                <ChartStyled>
                                    <Chart
                                        type="area"
                                        series={
                                            [{
                                                name: "Series 1",
                                                data: [72, 76, 72, 75, 72, 76, 72, 76, 72, 75],
                                                color: theme.palette.divider,

                                            }
                                            ]}
                                        options={merge(ChartsOption(), {
                                            stroke: {
                                                width: 3,
                                                curve: 'smooth',
                                                lineCap: 'round'
                                            },
                                            xaxis: {
                                                labels: {
                                                    show: false,
                                                }
                                            },
                                            yaxis: {
                                                labels: {
                                                    offsetX: -10,
                                                    formatter: (value: number) => { return Math.trunc(value) },
                                                }
                                            },

                                        }) as any}
                                        height={150} />
                                </ChartStyled>
                            </Paper>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader
                        sx={{
                            '.MuiCardHeader-action': {
                                alignSelf: 'center'
                            }
                        }}
                        title={
                            <Typography variant='subtitle2' fontSize={20} fontWeight={600}>
                                {t("examen_history")}
                            </Typography>
                        }
                        action={
                            <CustomIconButton>
                                <IconUrl path="ic-outline-filter" />
                            </CustomIconButton>
                        }
                    />
                    <CardContent>
                        <Typography variant='subtitle2' fontWeight={600}>
                            {t("next_rdv")}
                        </Typography>
                        <NextRdvCard />
                        <Typography variant='subtitle2' fontWeight={600}>
                            {t("prev_rdv")}
                        </Typography>
                        <PrevRdvCard />
                    </CardContent>
                </Card>
            </Stack>
        </RootStyled>
    )
}

export default MedicalRec