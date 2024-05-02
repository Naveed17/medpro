import React, { useState } from 'react'
import RootStyled from './overrides/rootStyle'
import { Alert, Avatar, AvatarGroup, Button, ButtonGroup, Card, CardContent, CardHeader, Collapse, FormControl, FormHelperText, Grid, IconButton, Paper, Stack, TextField, Theme, Tooltip, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import moment from "moment-timezone";
import { CustomIconButton } from '@features/buttons';
import { Label } from '@features/label';
import dynamic from 'next/dynamic';
import { ChartsOption, ChartStyled } from "@features/charts";
import { merge } from 'lodash';
import { NextRdvCard, PrevRdvCard } from '@features/card';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const diseaseData = ["pregnancy_and_childbirth", "psychomotor_development", "risk_factors", "allergic", "family_antecedents", "previous_surgery"]
function MedicalRec({ ...props }) {
    const { t, devise, theme } = props
    const [editNote, setEditNote] = useState(false);
    const [diseaseCollapse, setDiseaseCollapse] = useState<number>(-1);
    const [charView, setChartView] = useState<string>("A");
    const input = React.useRef<any>();
    return (
        <RootStyled className='medical-rec'>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <Stack direction='row' alignItems='center' spacing={2}>
                                        <Avatar
                                            src="/static/img/25.png"
                                            className='patient-avatar'>
                                            <IconUrl path="ic-image" />
                                        </Avatar>
                                        <Stack spacing={.3}>
                                            <Typography fontWeight={600} color="primary" variant='subtitle1'>
                                                User Name
                                            </Typography>
                                            <Stack direction='row' alignItems='center' spacing={.5}>
                                                <IconUrl path="ic-outline-cake" />
                                                <Typography fontWeight={500} color='text.secondary'>
                                                    29/06/1989 {`(${moment().diff(moment("29/06/1989", "DD-MM-YYYY"), 'years')}ans)`}
                                                </Typography>
                                            </Stack>
                                            <AvatarGroup max={3} sx={{ flexDirection: 'row' }}>
                                                <Tooltip title={"assurance-1"}>
                                                    <Avatar
                                                        src={"/static/img/assurance-1.png"}
                                                        alt={"assurance-1"}
                                                        className='assurance-avatar' variant={"circular"}>

                                                    </Avatar>
                                                </Tooltip>
                                                <Tooltip title={"assurance-2"}>
                                                    <Avatar
                                                        src={"/static/img/assurance-2.png"}
                                                        alt={"assurance-2"}
                                                        className='assurance-avatar' variant={"circular"}>

                                                    </Avatar>
                                                </Tooltip>
                                            </AvatarGroup>
                                        </Stack>
                                    </Stack>
                                    <CustomIconButton color="success">
                                        <IconUrl path="ic-filled-call" width={20} height={20} />
                                    </CustomIconButton>
                                </Stack>
                                <Stack spacing={1}>
                                    <Alert className='alert-primary' icon={<IconUrl path="ic-folder" />} severity="primary">
                                        <Typography fontWeight={600} variant='subtitle2'>
                                            Fiche N° 15/9
                                        </Typography>
                                    </Alert>
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                        <Label color='success' sx={{ width: 1, height: 28 }}>
                                            <Typography fontWeight={500} component='span' color='success.main'>
                                                {t("credit")} 0 {devise}
                                            </Typography>
                                        </Label>
                                        <Label color='error' sx={{ width: 1, height: 28 }}>
                                            <Typography fontWeight={500} component='span' color='error.main'>
                                                {t("debit")} 0 {devise}
                                            </Typography>
                                        </Label>
                                    </Stack>
                                    <Alert icon={false} className='appoint-alert'>
                                        <Stack direction='row' alignItems='center' spacing={2}>
                                            <CustomIconButton className="btn-upcoming" disableRipple>
                                                <IconUrl path="ic-agenda-jour" width={21} height={21} color={theme.palette.primary.main} />
                                            </CustomIconButton>
                                            <Stack>
                                                <Typography fontWeight={600} color="text.primary" variant='subtitle2'>
                                                    {t("upcoming")}
                                                </Typography>
                                                <Typography fontWeight={600} color="text.primary" variant='subtitle1'>
                                                    2 {" "}
                                                    <Typography variant='caption'>
                                                        {t("appointments")}
                                                    </Typography>
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Alert>
                                    <Alert icon={false} className='appoint-alert'>
                                        <Stack direction='row' alignItems='center' spacing={2}>
                                            <CustomIconButton className="btn-completed" disableRipple>
                                                <IconUrl path="ic-agenda-tick" width={21} height={21} color={theme.palette.success.main} />
                                            </CustomIconButton>
                                            <Stack>
                                                <Typography fontWeight={600} color="text.primary" variant='subtitle2'>
                                                    {t("completed")}
                                                </Typography>
                                                <Typography fontWeight={600} color="text.primary" variant='subtitle1'>
                                                    12 {" "}
                                                    <Typography variant='caption'>
                                                        {t("appointments")}
                                                    </Typography>
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Alert>
                                </Stack>
                                <Stack spacing={1.5}>
                                    <Button color='warning' variant='contained' startIcon={<IconUrl path="ic-filled-play" />}>
                                        {t("start_consultation")}

                                    </Button>
                                    <Button variant='contained' startIcon={<IconUrl path="ic-agenda-plus" />}>
                                        {t("add_rdv")}
                                    </Button>
                                    <Button className='btn-dup' disableRipple variant='text-black' startIcon={<IconUrl path="ic-danger" color={theme.palette.error.main} />}>
                                        {t("duplicate")}
                                    </Button>
                                </Stack>
                                <FormControl fullWidth className='note-wrapper'>
                                    <TextField
                                        inputRef={input}
                                        sx={{ border: 'none !important' }}
                                        multiline rows={3} label="Note"
                                        InputProps={{
                                            endAdornment: <IconButton onClick={() => {
                                                var updated;
                                                setEditNote((prev) => {
                                                    updated = !prev;
                                                    return updated;
                                                });
                                                if (updated) {
                                                    input?.current.focus();
                                                }

                                            }} size='small'><IconUrl width={17} height={17} color={theme.palette.text.secondary} path={editNote ? "ic-check-circle" : "ic-edit-pen"} /></IconButton>,
                                            readOnly: !editNote
                                        }}
                                        InputLabelProps={{ shrink: true }} />
                                    <FormHelperText component={Stack} direction='row' alignItems='center' spacing={1}>
                                        <IconUrl path="ic-agenda-jour" color={theme.palette.text.secondary} width={16} height={16} />
                                        <Typography color="text.secondary" variant='caption' fontSize={14}>
                                            DD/MM/YYYY
                                        </Typography>
                                    </FormHelperText>
                                </FormControl>
                                {diseaseData.map((item: string, idx: number) =>
                                    <Card key={idx} className="disease-card">
                                        <CardHeader
                                            onClick={() => setDiseaseCollapse(
                                                diseaseCollapse === idx ? -1 : idx
                                            )}
                                            avatar={
                                                <IconUrl path="ic-outline-arrow-square-down" />
                                            }

                                            title={t(item)}

                                        />
                                        <Collapse in={diseaseCollapse === idx}>
                                            <CardContent>
                                                <Button sx={{ px: 1 }} variant="primary-light" size='small' startIcon={<IconUrl path="ic-plus" width={16} height={16} />}>
                                                    {t("add")}
                                                </Button>
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                )}

                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
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
                </Grid>
            </Grid>
        </RootStyled>
    )
}

export default MedicalRec