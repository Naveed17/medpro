import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout, dashLayoutSelector } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { SubHeader } from "@features/subHeader";
import { Box, Button, Card, CardContent, Grid, IconButton, LinearProgress, LinearProgressProps, Stack, Typography, linearProgressClasses, styled, useTheme } from "@mui/material";
import { StatsToolbar } from "@features/toolbar";
import { merge } from 'lodash';
import { ChartsOption, ChartStyled } from "@features/charts";
import IconUrl from "@themes/urlIcon";
import { toggleSideBar } from "@features/menu";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useRequestQuery } from "@lib/axios";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { useRouter } from "next/router";
import { convertHexToRGBA, useMedicalEntitySuffix } from "@lib/hooks";
import { agendaSelector } from "@features/calendar";
import { CalendarViewButton } from "@features/buttons";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import moment from "moment-timezone";
import { startCase } from 'lodash';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { LoadingScreen } from "@features/loadingScreen";
import { TabPanel } from "@features/tabPanel";
import NumberIcon from "@themes/overrides/icons/numberIcon";
import TimerIcon from "@themes/overrides/icons/timerIcon";
interface ProgressProps extends LinearProgressProps {
    bgcolor?: string;
}
const BorderLinearProgress = styled(LinearProgress)<ProgressProps>(({ theme, bgcolor }) => ({
    borderRadius: 5,
    height: 6,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: bgcolor

    },
}));
function Statistics() {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const { t, ready } = useTranslation(["stats", "common"]);
    const router = useRouter();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const [value, setValue] = React.useState(0);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const { config: agenda } = useAppSelector(agendaSelector);

    const [viewChart, setViewChart] = useState('month');
    const [fullChart, setFullChart] = useState<any>({ "act": false, "motif": false });
    const [state, setState] = useState(
        {
            rdv_type: {
                view: "numbers",
                RDV_TYPE_OPTIONS: [
                    { value: "numbers", label: "Numbers", text: "Numbers", icon: NumberIcon, format: "N" }
                ],
            },
            act_by_rdv: {
                view: "duration",
                ACT_BY_RDV_OPTIONS: [
                    { value: "duration", label: "Duration", text: "Durée", icon: TimerIcon, format: "T" },
                ]
            }


        }
    )
    const { rdv_type, act_by_rdv } = state
    const { data: statsAppointmentHttp } = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointment-stats/${router.locale}?format=${viewChart}`
    } : null, ReactQueryNoValidateConfig);

    const { data: statsPatientHttp } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patient-per-period/${router.locale}?format=month`
    } : null, ReactQueryNoValidateConfig);

    const increasePercentage = (newVal: number, oldVAl: number) => {
        const percentage = ((newVal - oldVAl) / newVal) * 100;
        return percentage ? Math.ceil(percentage) : "--";
    }
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    useEffect(() => {
        dispatch(toggleSideBar(true));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const patientPerPeriod = (statsPatientHttp ? Object.values((statsPatientHttp as HttpResponse)?.data) : []) as any[];
    const appointmentStats = ((statsAppointmentHttp as HttpResponse)?.data ?? []) as any;
    const appointmentPerPeriod = (appointmentStats?.period ? Object.values(appointmentStats.period) : []) as any[];
    const appointmentPerPeriodKeys = (appointmentStats?.period ? Object.keys(appointmentStats.period) : []) as any[];
    const motifPerPeriod = (appointmentStats?.motif ?? []) as any[];
    const actPerPeriod = (appointmentStats?.act ?? []) as any[];
    const VIEW_OPTIONS = [
        { value: "day", label: "Day", text: "Jour", icon: TodayIcon, format: "D" },
        { value: "week", label: "Weeks", text: "Semaine", icon: DayIcon, format: "wo" },
        { value: "month", label: "Months", text: "Mois", icon: WeekIcon, format: "MMM" }
    ];

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"} />);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: { xs: "column", md: "row" },
                        py: { md: 0, xs: 2 },
                    },
                }}>
                <StatsToolbar {...{ handleChange, value }} />
            </SubHeader>
            <Box className="container">
                <TabPanel padding={.1} value={value} index={0}>
                    <Grid container spacing={2} mb={3}>
                        <Grid item md={2}>
                            <Stack spacing={2} height={1}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        flex: 1,
                                    }}>
                                    <CardContent sx={{ pb: 0 }}>
                                        <Stack spacing={2}>
                                            <IconUrl path={"stats/ic-calendar-card"} />
                                            <Stack>
                                                <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                    {appointmentPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                                </Typography>
                                                <Typography fontWeight={500} variant="body2">
                                                    {t("appointments")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        flex: 1,
                                    }}>
                                    <CardContent sx={{ pb: 0 }}>
                                        <Stack spacing={2}>
                                            <IconUrl path={"stats/ic-document-card"} />
                                            <Stack>
                                                <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                    {appointmentPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                                </Typography>
                                                <Typography fontWeight={500} variant="body2">
                                                    {t("rdv_per-min")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                        <Grid item md={6}>
                            {(!fullChart.motif && !fullChart.act) &&
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5]
                                    }}>
                                    <CardContent sx={{ pb: 0 }}>
                                        <Stack ml={2} direction={"row"} spacing={2} justifyContent={"space-between"}>
                                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                                {t("activity")}
                                            </Typography>
                                            <CalendarViewButton
                                                {...{ t }}
                                                view={viewChart}
                                                sx={{
                                                    "& .MuiButtonBase-root": {
                                                        marginRight: '1rem'
                                                    },
                                                    "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                                        fontSize: 20
                                                    }
                                                }}
                                                views={VIEW_OPTIONS}
                                                onSelect={(viewOption: string) => setViewChart(viewOption)}
                                            />
                                        </Stack>
                                        <ChartStyled>
                                            <Chart
                                                type="area"
                                                series={[
                                                    { name: 'patients', data: patientPerPeriod.slice(-12) },
                                                    {
                                                        name: 'appointments',
                                                        data: appointmentPerPeriod.slice(-12)
                                                    },
                                                ]}
                                                options={merge(ChartsOption(), {
                                                    xaxis: {
                                                        position: "top",
                                                        categories: appointmentPerPeriodKeys.map(date =>
                                                            startCase(moment(date, "DD-MM-YYYY HH:mm").format(VIEW_OPTIONS.find(view => view.value === viewChart)?.format).replace('.', ''))).slice(-12)
                                                    },
                                                    tooltip: { x: { show: false }, marker: { show: false } },
                                                    colors: ['#1BC47D', '#FEC400'],
                                                    grid: {
                                                        show: true,
                                                        strokeDashArray: 0,
                                                        position: 'back',
                                                        xaxis: {
                                                            lines: {
                                                                show: false
                                                            }
                                                        },
                                                        yaxis: {
                                                            lines: {
                                                                show: true
                                                            }
                                                        },
                                                        row: {
                                                            colors: undefined,
                                                            opacity: 0.5
                                                        },
                                                        column: {
                                                            colors: undefined,
                                                            opacity: 0.5
                                                        },
                                                        padding: {
                                                            top: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            left: 10
                                                        },
                                                    }
                                                }) as any}
                                                height={240}
                                            />
                                        </ChartStyled>
                                    </CardContent>
                                </Card>
                            }
                        </Grid>
                        <Grid item md={4}></Grid>
                        <Grid item md={7}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-user-card"} />
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    {patientPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("patients")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack px={2} mr={2} direction={"row"} spacing={1.2} alignItems={"center"} width={1} borderRight={1.5} borderLeft={1.5} borderColor={'divider'}>
                                            <IconUrl path={"stats/ic-new-patients-card"} />
                                            <Stack>
                                                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                    <Typography fontWeight={600} fontSize={24} variant="caption">
                                                        {patientPerPeriod[patientPerPeriod.length - 1]}
                                                    </Typography>

                                                    <Stack direction={"row"}>
                                                        <IconUrl path={"ic-up-right"} />
                                                        <Typography fontWeight={700} fontSize={14}
                                                            color="success.main"
                                                            variant="body2">{increasePercentage(patientPerPeriod[appointmentPerPeriod.length - 1], patientPerPeriod[appointmentPerPeriod.length - 2])} % </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("new-patients")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-waiting-hour-card"} />
                                            <Stack>
                                                <Stack direction={"row"} spacing={1} alignItems={"flex-end"}>
                                                    <Typography lineHeight={1} fontWeight={600} fontSize={24} variant="subtitle1">
                                                        34
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        min
                                                    </Typography>
                                                </Stack>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("avg_time_patient")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={5}></Grid>
                        <Grid item md={4}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1} alignItems={"center"} >
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-acte-secpndaire"} />
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    44
                                                </Typography>
                                                <Typography fontSize={{ md: 11, xl: 12 }} fontWeight={500} variant="body2">
                                                    {t("rdv_type")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <CalendarViewButton
                                            {...{ t }}
                                            view={rdv_type.view}
                                            sx={{
                                                "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                                    fontSize: 14
                                                }
                                            }}
                                            views={rdv_type.RDV_TYPE_OPTIONS}
                                            onSelect={(viewOption: string) => setState({
                                                ...state,
                                                rdv_type: {
                                                    ...rdv_type,
                                                    view: viewOption,
                                                }
                                            })}
                                        />
                                        <IconButton disableRipple>
                                            <IconUrl path={"stats/maximize-square"} />
                                        </IconButton>
                                    </Stack>
                                    <Stack spacing={1} mt={2}>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("consultation")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>154</Typography>

                                            </Stack>
                                            <BorderLinearProgress bgcolor="#FF715B" variant="determinate" value={50} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("apci")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>80</Typography>

                                            </Stack>
                                            <BorderLinearProgress bgcolor="#34D1BF" variant="determinate" value={30} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("next")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>197</Typography>
                                            </Stack>
                                            <BorderLinearProgress bgcolor="#0496FF" variant="determinate" value={80} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("check")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>243</Typography>
                                            </Stack>
                                            <BorderLinearProgress bgcolor="#6665DD" variant="determinate" value={90} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("echo")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>119</Typography>
                                            </Stack>
                                            <BorderLinearProgress bgcolor="#DE0D92" variant="determinate" value={60} />
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={4}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1} alignItems={"center"} >
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-acte-secpndaire"} />
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    44
                                                </Typography>
                                                <Typography fontSize={{ md: 11, xl: 12 }} fontWeight={500} variant="body2">
                                                    {t("rdv_type")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <CalendarViewButton
                                            {...{ t }}
                                            view={rdv_type.view}
                                            sx={{
                                                "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                                    fontSize: 14
                                                }
                                            }}
                                            views={rdv_type.RDV_TYPE_OPTIONS}
                                            onSelect={(viewOption: string) => setState({
                                                ...state,
                                                rdv_type: {
                                                    ...rdv_type,
                                                    view: viewOption,
                                                }
                                            })}
                                        />
                                        <IconButton disableRipple>
                                            <IconUrl path={"stats/maximize-square"} />
                                        </IconButton>
                                    </Stack>
                                    <Stack spacing={1} mt={2}>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("consultation")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>154</Typography>

                                            </Stack>
                                            <BorderLinearProgress bgcolor="#FF715B" variant="determinate" value={50} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("apci")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>80</Typography>

                                            </Stack>
                                            <BorderLinearProgress bgcolor="#34D1BF" variant="determinate" value={30} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("next")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>197</Typography>
                                            </Stack>
                                            <BorderLinearProgress bgcolor="#0496FF" variant="determinate" value={80} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("check")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>243</Typography>
                                            </Stack>
                                            <BorderLinearProgress bgcolor="#6665DD" variant="determinate" value={90} />
                                        </Stack>
                                        <Stack spacing={.3}>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                                <Typography variant="body2" fontWeight={500}>{t("echo")}</Typography>
                                                <Typography fontSize={20} fontWeight={600} lineHeight={1.2}>119</Typography>
                                            </Stack>
                                            <BorderLinearProgress bgcolor="#DE0D92" variant="determinate" value={60} />
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>


                        {/* <Grid item xs={12} md={3}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                        <IconUrl path={"stats/ic-calendar-card"} />
                                        <Stack>
                                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                                {appointmentPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                            </Typography>
                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                {t("appointments")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                        <IconUrl path={"stats/ic-agenda-card"} />
                                        <Stack>
                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    {appointmentPerPeriod[appointmentPerPeriod.length - 1]}
                                                </Typography>

                                                <Stack direction={"row"}>
                                                    <IconUrl path={"ic-up-right"} />
                                                    <Typography fontWeight={700} fontSize={14}
                                                        color="success.main"
                                                        variant="body2">{increasePercentage(appointmentPerPeriod[appointmentPerPeriod.length - 1], patientPerPeriod[appointmentPerPeriod.length - 2])} % </Typography>
                                                </Stack>
                                            </Stack>
                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                {t("new-appointments")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5],
                                    '.btn-list-action': {
                                        backgroundColor: convertHexToRGBA(theme.palette.warning.main, 0.15),
                                        borderRadius: "8px",
                                        padding: "10px",
                                    }
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                        <IconUrl path={"stats/ic-user-card"} />
                                        <Stack>
                                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                                {patientPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                            </Typography>
                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                {t("patients")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                        <IconUrl path={"stats/ic-new-patients-card"} />
                                        <Stack>
                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    {patientPerPeriod[patientPerPeriod.length - 1]}
                                                </Typography>

                                                <Stack direction={"row"}>
                                                    <IconUrl path={"ic-up-right"} />
                                                    <Typography fontWeight={700} fontSize={14}
                                                        color="success.main"
                                                        variant="body2">{increasePercentage(patientPerPeriod[appointmentPerPeriod.length - 1], patientPerPeriod[appointmentPerPeriod.length - 2])} % </Typography>
                                                </Stack>
                                            </Stack>
                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                {t("new-patients")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        {(!fullChart.motif && !fullChart.act) && <Grid item xs={12} md={12}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack ml={2} direction={"row"} spacing={2} justifyContent={"space-between"}>
                                        <Typography fontWeight={600} fontSize={24} variant="caption">
                                            {t("activity")}
                                        </Typography>
                                        <CalendarViewButton
                                            {...{ t }}
                                            view={viewChart}
                                            sx={{
                                                "& .MuiButtonBase-root": {
                                                    marginRight: '1rem'
                                                },
                                                "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                                    fontSize: 20
                                                }
                                            }}
                                            views={VIEW_OPTIONS}
                                            onSelect={(viewOption: string) => setViewChart(viewOption)}
                                        />
                                    </Stack>
                                    <ChartStyled>
                                        <Chart
                                            type="area"
                                            series={[
                                                { name: 'patients', data: patientPerPeriod.slice(-12) },
                                                {
                                                    name: 'appointments',
                                                    data: appointmentPerPeriod.slice(-12)
                                                },
                                            ]}
                                            options={merge(ChartsOption(), {
                                                xaxis: {
                                                    position: "top",
                                                    categories: appointmentPerPeriodKeys.map(date =>
                                                        startCase(moment(date, "DD-MM-YYYY HH:mm").format(VIEW_OPTIONS.find(view => view.value === viewChart)?.format).replace('.', ''))).slice(-12)
                                                },
                                                tooltip: { x: { show: false }, marker: { show: false } },
                                                colors: ['#1BC47D', '#FEC400'],
                                                grid: {
                                                    show: true,
                                                    strokeDashArray: 0,
                                                    position: 'back',
                                                    xaxis: {
                                                        lines: {
                                                            show: false
                                                        }
                                                    },
                                                    yaxis: {
                                                        lines: {
                                                            show: true
                                                        }
                                                    },
                                                    row: {
                                                        colors: undefined,
                                                        opacity: 0.5
                                                    },
                                                    column: {
                                                        colors: undefined,
                                                        opacity: 0.5
                                                    },
                                                    padding: {
                                                        top: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        left: 10
                                                    },
                                                }
                                            }) as any}
                                            height={240}
                                        />
                                    </ChartStyled>
                                </CardContent>
                            </Card>
                        </Grid>}
                        {!fullChart.act && <Grid item xs={12} md={fullChart.motif ? 12 : 6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack ml={2} alignItems={"center"} direction={"row"} spacing={2}
                                        justifyContent={"space-between"}>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                            <IconUrl width={40} height={40} path={"ic-analyse-stats"} />
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    {motifPerPeriod.length}
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("Reason")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Button
                                            size={"small"}
                                            variant="text-black"
                                            onClick={() => setFullChart({ ...fullChart, motif: !fullChart.motif })}>
                                            {fullChart.motif ? <CloseFullscreenRoundedIcon /> : <OpenInFullRoundedIcon />}
                                            <Typography>{t(`see-${fullChart.motif || fullChart.act ? 'less' : 'more'}`)}</Typography>
                                        </Button>
                                    </Stack>
                                    <ChartStyled>
                                        <Chart
                                            type="bar"
                                            series={[{
                                                data: motifPerPeriod?.reduce((motifs, item) => [...(motifs ?? []), item.doc_count], []).splice(0, fullChart.motif ? motifPerPeriod.length : 5)
                                            }]}
                                            options={merge(ChartsOption(), {
                                                plotOptions: {
                                                    bar: {
                                                        barHeight: 10,
                                                        distributed: true,
                                                        horizontal: true,
                                                        borderRadius: 5,
                                                        borderRadiusApplication: "end",
                                                        borderRadiusOnAllStackedSeries: true
                                                    },
                                                    dataLabels: {
                                                        position: "bottom"
                                                    }
                                                },
                                                colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa'],
                                                stroke: {
                                                    width: 1,
                                                    colors: ['#fff']
                                                },
                                                grid: {
                                                    xaxis: {
                                                        lines: {
                                                            show: true
                                                        }
                                                    },
                                                    yaxis: {
                                                        lines: {
                                                            show: false
                                                        }
                                                    }
                                                },
                                                xaxis: {
                                                    position: "top",
                                                    categories: motifPerPeriod?.reduce((motifs, item) => [...(motifs ?? []), item.key], []).splice(0, fullChart.motif ? motifPerPeriod.length : 5),
                                                },
                                                yaxis: {
                                                    labels: {
                                                        show: false
                                                    }
                                                },
                                                tooltip: {
                                                    theme: 'dark',
                                                    x: {
                                                        show: false
                                                    },
                                                    y: {
                                                        title: {
                                                            formatter: (seriesIndex: string, data: any) => {
                                                                return data.w.config.xaxis.categories[data.dataPointIndex];
                                                            }
                                                        }
                                                    }
                                                }
                                            }) as any}
                                            height={fullChart.motif ? 480 : 240}
                                        />
                                    </ChartStyled>
                                </CardContent>
                            </Card>
                        </Grid>}
                        {!fullChart.motif && <Grid item xs={12} md={fullChart.act ? 12 : 6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack ml={2} alignItems={"center"} direction={"row"} spacing={2}
                                        justifyContent={"space-between"}>

                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                            <IconUrl width={40} height={40} path={"ic-act-stats"} />
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    {actPerPeriod.length}
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("act")}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        <Button
                                            size={"small"}
                                            variant="text-black"
                                            onClick={() => setFullChart({ ...fullChart, act: !fullChart.act })}>
                                            {fullChart.act ? <CloseFullscreenRoundedIcon /> : <OpenInFullRoundedIcon />}
                                            <Typography>{fullChart.motif || fullChart.act ? t('see-less') : t('see-more')}</Typography>
                                        </Button>
                                    </Stack>

                                    <ChartStyled>
                                        <Chart
                                            type="bar"
                                            series={[{
                                                data: actPerPeriod?.reduce((motifs, item) => [...(motifs ?? []), item.doc_count], []).splice(0, fullChart.act ? actPerPeriod.length : 5)
                                            }]}
                                            options={merge(ChartsOption(), {
                                                chart: {
                                                    height: 350,
                                                    type: 'rangeBar',
                                                    zoom: {
                                                        enabled: false
                                                    }
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        barHeight: 10,
                                                        distributed: true,
                                                        horizontal: true,
                                                        borderRadius: 5,
                                                        borderRadiusApplication: "end",
                                                        borderRadiusOnAllStackedSeries: true
                                                    },
                                                    dataLabels: {
                                                        position: "bottom"
                                                    }
                                                },
                                                colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa'],
                                                stroke: {
                                                    width: 1,
                                                    colors: ['#fff']
                                                },
                                                grid: {
                                                    xaxis: {
                                                        lines: {
                                                            show: true
                                                        }
                                                    },
                                                    yaxis: {
                                                        lines: {
                                                            show: false
                                                        }
                                                    }
                                                },
                                                xaxis: {
                                                    position: "top",
                                                    categories: actPerPeriod?.reduce((motifs, item) => [...(motifs ?? []), item.key], []).splice(0, fullChart.act ? actPerPeriod.length : 5),
                                                },
                                                yaxis: {
                                                    labels: {
                                                        show: false
                                                    }
                                                },
                                                tooltip: {
                                                    theme: 'dark',
                                                    x: {
                                                        show: false
                                                    },
                                                    y: {
                                                        title: {
                                                            formatter: (seriesIndex: string, data: any) => {
                                                                return data.w.config.xaxis.categories[data.dataPointIndex];
                                                            }
                                                        }
                                                    }
                                                }
                                            }) as any}
                                            height={fullChart.act ? 480 : 240}
                                        />
                                    </ChartStyled>
                                </CardContent>
                            </Card>
                        </Grid> */
                        }



                        {/* 
                        {(!fullChart.motif && !fullChart.act) && <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: theme.shadows[5]
                            }}>
                            <CardContent sx={{pb: 0}}>
                                <Stack ml={2} alignItems={"center"} direction={"row"} spacing={2}
                                       justifyContent={"space-between"}>
                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                        <IconUrl color={theme.palette.primary.main} width={40} height={40}
                                                 path={"ic-payment"}/>
                                        <Stack>
                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    9000
                                                </Typography>

                                                <Stack direction={"row"}>
                                                    <IconUrl path={"ic-up-right"}/>
                                                    <Typography fontWeight={700} fontSize={14} color="success.main"
                                                                variant="body2">4 % </Typography>
                                                </Stack>
                                            </Stack>
                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                Revenue Total
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <ChartStyled>
                                    <Chart
                                        type="bar"
                                        series={[
                                            {
                                                data: [
                                                    {
                                                        x: '2008',
                                                        y: [2800, 4500]
                                                    },
                                                    {
                                                        x: '2009',
                                                        y: [3200, 4100]
                                                    },
                                                    {
                                                        x: '2010',
                                                        y: [2950, 7800]
                                                    },
                                                    {
                                                        x: '2011',
                                                        y: [3000, 4600]
                                                    },
                                                    {
                                                        x: '2012',
                                                        y: [3500, 4100]
                                                    },
                                                    {
                                                        x: '2013',
                                                        y: [4500, 6500]
                                                    },
                                                    {
                                                        x: '2014',
                                                        y: [4100, 5600]
                                                    }
                                                ]
                                            }
                                        ]}
                                        options={merge(ChartsOption(), {
                                            chart: {
                                                height: 350,
                                                type: 'rangeBar',
                                                zoom: {
                                                    enabled: false
                                                }
                                            },
                                            plotOptions: {
                                                bar: {
                                                    columnWidth: '14%',
                                                    distributed: false,
                                                    borderRadius: 4
                                                }
                                            },
                                            grid: {
                                                strokeDashArray: 0,
                                                position: 'back',
                                                xaxis: {
                                                    lines: {
                                                        show: true
                                                    }
                                                },
                                                yaxis: {
                                                    lines: {
                                                        show: false
                                                    }
                                                },
                                                padding: {
                                                    top: 0,
                                                    right: 5,
                                                    bottom: 5,
                                                    left: 5
                                                },
                                            },
                                            xaxis: {
                                                tickPlacement: 'on'
                                            }
                                        }) as any}
                                        height={240}
                                    />
                                </ChartStyled>
                            </CardContent>
                        </Card>
                    </Grid>}
                    
                    */}
                    </Grid>
                </TabPanel>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'stats']))
    }
})

export default Statistics

Statistics.auth = true;

Statistics.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
