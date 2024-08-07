import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout, dashLayoutSelector } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { SubHeader } from "@features/subHeader";
import {
    Avatar,
    Box,
    Card,
    CardContent, Chip,
    Grid, LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import { StatsToolbar } from "@features/toolbar";
import { merge } from 'lodash';
import { ChartsOption, ChartStyled } from "@features/charts";
import IconUrl from "@themes/urlIcon";
import { toggleSideBar } from "@features/menu";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { useRouter } from "next/router";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { agendaSelector } from "@features/calendar";
import { CalendarViewButton } from "@features/buttons";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import moment from "moment-timezone";
import { startCase } from 'lodash';
import { LoadingScreen } from "@features/loadingScreen";
import { TabPanel } from "@features/tabPanel";
import NumberIcon from "@themes/overrides/icons/numberIcon";
import TimerIcon from "@themes/overrides/icons/timerIcon";
import { BorderLinearProgressStyled, StatsProgressCard } from "@features/card";
import { useCountries } from "@lib/hooks/rest";
import { DefaultCountry } from "@lib/constants";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { renderToString } from "react-dom/server";
import Image from "next/image";
import { Breadcrumbs } from "@features/breadcrumbs";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function Statistics() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { countries } = useCountries();
    const router = useRouter();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { t, ready, i18n } = useTranslation(["stats", "common"]);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const { config: agenda } = useAppSelector(agendaSelector);

    const [value, setValue] = React.useState(0);
    const [viewChart, setViewChart] = useState('month');
    const [periodChartData, setPeriodChartData] = useState<any[]>([]);
    const [fullScreenChart, setFullScreenChart] = useState({ "act": false, "motif": false, "type": false });
    const [state, setState] = useState({
        rdv_type: {
            view: "numbers",
            RDV_TYPE_OPTIONS: [
                { value: "numbers", label: "Numbers", text: "Numbers", icon: NumberIcon, format: "N" },
                { value: "duration", label: "Duration", text: "Durée", icon: TimerIcon, format: "T" },
            ],
        },
        act_by_rdv: {
            view: "numbers",
            ACT_BY_RDV_OPTIONS: [
                { value: "numbers", label: "Numbers", text: "Numbers", icon: NumberIcon, format: "N" },
            ]
        },
        motif_by_consult: {
            view: "numbers",
            MOTIF_BY_CONSULT_OPTIONS: [
                { value: "numbers", label: "Numbers", text: "Numbers", icon: NumberIcon, format: "N" },
                { value: "duration", label: "Duration", text: "Durée", icon: TimerIcon, format: "T" }
            ]
        }
    })
    const [schedules, setSchedules] = useState<any>([]);
    const [selectedConsultationReason, setSelectedConsultationReason] = useState<any>(null);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const { data: statsAppointmentHttp } = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointment-stats/${router.locale}?format=${viewChart}`
    } : null, ReactQueryNoValidateConfig);

    const { data: statsPatientHttp } = useRequestQuery(statsAppointmentHttp && medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patient-stats/${router.locale}?format=${viewChart}`
    } : null, ReactQueryNoValidateConfig);

    const { trigger: triggerConsultationReason } = useRequestQueryMutation("/stats/consultation-reason/get");

    const increasePercentage = (newVal: number, oldVAl: number) => {
        const percentage = ((newVal - oldVAl) / newVal) * 100;
        return percentage && percentage !== -Infinity ? Math.ceil(percentage) : "--";
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const { rdv_type, act_by_rdv, motif_by_consult } = state
    const appointmentStats = ((statsAppointmentHttp as HttpResponse)?.data ?? []) as any;
    const start = moment().add(1, `${viewChart}s` as any);
    const durations = Array.from({ length: 12 }, (_) => moment(start.subtract(1, `${viewChart}s` as any)).set({
        ...(viewChart === "month" && { date: 1 }),
        hour: 0,
        minute: 0,
        millisecond: 0
    })).reverse();
    const appointmentPerPeriod = (appointmentStats?.period ? durations.map(duration => appointmentStats.period[`${duration.format("DD-MM-YYYY")} 00:00`] ?? 0) : []) as any[];
    const salesPerPeriod = (appointmentStats?.ca ? durations.map(duration => appointmentStats.ca.find((sale: any) => sale.key === `${duration.format("DD-MM-YYYY")}`)?.sum_fees ?? 0) : []) as any[];
    const motifPerPeriod = (appointmentStats?.motif ?? []) as any[];
    const actPerPeriod = (appointmentStats?.act ?? []) as any[];
    const typePerPeriod = (appointmentStats?.type ?? []) as any[];
    const statsPerPeriod = (appointmentStats?.stats ?? null) as any;
    const patientStats = ((statsPatientHttp as HttpResponse)?.data ?? []) as any;
    const patientPerPeriod = (patientStats?.period ? durations.map(duration => patientStats.period[`${duration.format("DD-MM-YYYY")} 00:00`] ?? 0) : []) as any[];
    const patientPerAge = (patientStats?.age ? Object.values(patientStats.age) : []) as any[];
    const patientPerGender = (patientStats?.gender ? Object.values(patientStats.gender) : []) as any[];
    const patientPerLocation = (patientStats?.location ? Object.values(patientStats.location).map((location: any) => ({
        ...location,
        ...countries.find(country => country.uuid === location.key)
    })) : []) as any[];
    const patientPerIncreasePercentage = increasePercentage(patientPerPeriod[appointmentPerPeriod.length - 1], patientPerPeriod[appointmentPerPeriod.length - 2])
    const VIEW_OPTIONS = [
        { value: "day", label: "Day", text: "Jour", icon: TodayIcon, format: "D" },
        //{value: "week", label: "Weeks", text: "Semaine", icon: DayIcon, format: "wo"},
        { value: "month", label: "Months", text: "Mois", icon: WeekIcon, format: "MMM" }
    ];
    const genders = {
        "f": "female",
        "m": "male",
        "u": "other"
    }
    const colors = [theme.palette.primary.main, theme.palette.warning.main, theme.palette.expire.main, theme.palette.error.main];
    const handleConsultationReasonSet = (consultation: ConsultationReasonModel) => {
        setSelectedConsultationReason({
            ...consultation,
            location: [],
            age: [],
            gender: []
        });
        if (consultation?.uuid) {
            setLoadingRequest(true);
            medicalEntityHasUser && triggerConsultationReason({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/motif-stats/${consultation?.uuid}/${router.locale}`,
            }, {
                onSuccess: (result) => {
                    const consultReasonStats = (result?.data as HttpResponse)?.data;
                    setSelectedConsultationReason({
                        ...consultation,
                        location: consultReasonStats?.per_location.map((location: any) => ({
                            ...location,
                            ...countries.find(country => country.uuid === location.key)
                        })) ?? [],
                        age: consultReasonStats?.per_age,
                        gender: consultReasonStats?.per_gender
                    });
                },
                onSettled: () => setLoadingRequest(false)
            })
        }
    }

    useEffect(() => {
        if (statsPerPeriod) {
            const days = {
                "MON": "Monday",
                "TUE": "Tuesday",
                "WED": "Wednesday",
                "THU": "Thursday",
                "FRI": "Friday",
                "SAT": "Saturday",
                "SUN": "Sunday"
            }
            let schedulesData: any = []
            Object.entries(days).forEach(
                day => {
                    if (statsPerPeriod.common_start_time && statsPerPeriod.common_end_time) {
                        if (statsPerPeriod.common_start_time[day[1]]) {
                            schedulesData.push({
                                x: t(`days.${day[0]}`, { ns: "common" }),
                                y: [moment.duration(statsPerPeriod.common_start_time[day[1]]).asHours(), moment.duration(statsPerPeriod.common_end_time[day[1]]).asHours()]
                            })
                        }
                    }
                })
            setSchedules(schedulesData)
        }
    }, [statsPerPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (statsPatientHttp && (appointmentPerPeriod.length > 0 || patientPerPeriod.length > 0)) {
            setPeriodChartData([
                {
                    name: t('patients'),
                    data: patientPerPeriod.slice(-12)
                },
                {
                    name: t('appointments'),
                    data: appointmentPerPeriod.slice(-12)
                },
                {
                    name: t('sales'),
                    data: salesPerPeriod.slice(-12)
                },
            ])
        }
    }, [patientStats]); // eslint-disable-line react-hooks/exhaustive-deps
    const tabsData = ["tab_all", "tab_rdv", "tab_patients", "tab_working_time"]
    const breadcrumbsData = [
        {
            title: "Statistics",
            href: "/dashboard/statistics",
        },
        {
            title: t("sub-header.tabs." + tabsData[value]),
            href: null,
        }

    ]
    useEffect(() => {
        dispatch(toggleSideBar(true));
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["stats", "common"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading"} />);
    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        py: 2
                    },
                }}>
                <Stack width={1}>
                    <Breadcrumbs data={breadcrumbsData} />
                    <Typography variant="subtitle1" mt={1}>
                        {t("sub-header.title")}
                    </Typography>
                    <StatsToolbar {...{ handleChange, value, tabsData }} />
                </Stack>
            </SubHeader>

            <LinearProgress sx={{
                visibility: loadingRequest ? "visible" : "hidden"
            }} color="warning" />
            <Box className="container">
                <TabPanel padding={.1} value={value} index={0}>
                    <Grid container spacing={2} mb={3}>
                        {(!fullScreenChart.motif && !fullScreenChart.act && !fullScreenChart.type) &&
                            <>
                                <Grid item xs={12} md={2}>
                                    <Stack spacing={2} height={1}>
                                        <Card
                                            sx={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: theme.shadows[5],
                                                flex: 1,
                                            }}>
                                            <CardContent sx={{ height: "100%" }}>
                                                <Stack spacing={2} justifyContent={"center"} height={"100%"}>
                                                    <IconUrl path={"stats/ic-calendar-card"} />
                                                    <Stack>
                                                        <Typography
                                                            fontSize={14}
                                                            fontWeight={"bold"}
                                                            variant="body2">
                                                            {t("appointments")}
                                                        </Typography>
                                                        <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                            {appointmentPerPeriod.reduce((total: number, val: number) => total + val, 0)}
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
                                            <CardContent sx={{ height: "100%" }}>
                                                <Stack spacing={2} justifyContent={"center"} height={"100%"}>
                                                    <IconUrl path={"stats/ic-document-card"} />
                                                    <Stack>
                                                        <Typography
                                                            fontSize={14}
                                                            fontWeight={"bold"}
                                                            variant="body2">
                                                            {t(`rdv-per.${viewChart}`)}
                                                        </Typography>
                                                        <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                            {appointmentPerPeriod[appointmentPerPeriod.length - 1]}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} item md={6}>
                                    <Card
                                        sx={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: theme.shadows[5],
                                            height: 1
                                        }}>
                                        <CardContent sx={{ pb: 0 }}>
                                            <Stack ml={2} direction={"row"} spacing={2}
                                                justifyContent={"space-between"}>
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
                                                    series={periodChartData}
                                                    options={merge(ChartsOption(), {
                                                        xaxis: {
                                                            position: "top",
                                                            categories: durations.map(date =>
                                                                startCase(date.format(VIEW_OPTIONS.find(view => view.value === viewChart)?.format).replace('.', '')))
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
                                                    height={300}
                                                />
                                            </ChartStyled>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card
                                        sx={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: theme.shadows[5],
                                            height: 1
                                        }}>
                                        <CardContent>
                                            <Typography variant="subtitle1"
                                                fontWeight={700}>{t("working_hours")}</Typography>
                                            <Stack direction='row' alignItems='center' mt={2}>
                                                <Stack width={1}>
                                                    <Typography variant="h6" fontWeight={700}>
                                                        {statsPerPeriod?.day_common_start_time ? moment(statsPerPeriod.day_common_start_time, "HH:mm").format("H") : "--"}
                                                        <Typography variant="caption" fontWeight={500}>h</Typography>
                                                        {" "}
                                                        {statsPerPeriod?.day_common_start_time ? moment(statsPerPeriod.day_common_start_time, "HH:mm").format("mm") : "--"}
                                                        <Typography variant="caption" fontWeight={500}>min</Typography>
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {t("start_time")}
                                                    </Typography>
                                                </Stack>
                                                <Stack width={1} pl={2} borderLeft={1} borderColor='divider'>
                                                    <Typography variant="h6" fontWeight={700}>
                                                        {statsPerPeriod?.day_common_end_time ? moment(statsPerPeriod.day_common_end_time, "HH:mm").format("H") : "--"}<Typography
                                                            variant="caption" fontWeight={500}>h</Typography>
                                                        {" "}
                                                        {statsPerPeriod?.day_common_end_time ? moment(statsPerPeriod.day_common_end_time, "HH:mm").format("mm") : "--"}<Typography
                                                            variant="caption"
                                                            fontWeight={500}>min</Typography>
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {t("end_time")}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <ChartStyled>
                                                <Chart
                                                    type='rangeBar'
                                                    series={[{ data: schedules }]}
                                                    options={merge(ChartsOption(), {
                                                        chart: {
                                                            height: 350,
                                                            type: 'rangeBar',
                                                            distributed: true,
                                                            dataLabels: {
                                                                hideOverflowingLabels: false
                                                            }
                                                        },
                                                        dataLabels: {
                                                            enabled: false,
                                                            textAnchor: 'start',
                                                            formatter: function (val: string) {
                                                                const duration = moment.duration(val, 'hours');
                                                                return `${duration.hours()}:${duration.minutes()} h`
                                                            },
                                                        },
                                                        tooltip: {
                                                            custom: ({ seriesIndex, dataPointIndex, w }: any) => {
                                                                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                                                                return renderToString(
                                                                    <Card>
                                                                        <CardContent>
                                                                            <Typography
                                                                                variant={"body2"}><strong>{data.x}</strong> : {data.y.map((item: number, index: number) => {
                                                                                    const duration = moment.duration(item, 'hours');
                                                                                    return `${duration.hours()}:${duration.minutes()} h ${index === 0 ? '- ' : ''}`
                                                                                })}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>);
                                                            }
                                                        },
                                                        fill: {
                                                            opacity: 1
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
                                                            },
                                                        },
                                                        plotOptions: {
                                                            bar: {
                                                                columnWidth: '48%',
                                                                borderRadius: 3
                                                            }
                                                        },
                                                        yaxis: {
                                                            labels: {
                                                                show: true,
                                                                formatter: (val: string) => {
                                                                    const duration = moment.duration(val, 'hours');
                                                                    return `${duration.hours()}:${duration.minutes()} h`;
                                                                }
                                                            }
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
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2} height={"100%"}>
                                        <Card
                                            sx={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: theme.shadows[5]
                                            }}>
                                            <CardContent>
                                                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={"center"}>
                                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}
                                                        width={1}>
                                                        <IconUrl path={"stats/ic-user-card"} />
                                                        <Stack>
                                                            <Typography fontWeight={600} fontSize={24}
                                                                variant="caption">
                                                                {patientPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                                            </Typography>
                                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                                {t("all-patients")}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack my={{ xs: 2, md: 0 }} px={{ xs: 0, md: 2 }} mr={{ xs: 0, md: 2 }}
                                                        direction={"row"} spacing={1.2} alignItems={"center"}
                                                        width={1}
                                                        borderRight={{ xs: 0, md: 1.5 }} borderLeft={{ xs: 0, md: 1.5 }}
                                                        borderColor={{ xs: 'transparent', md: 'divider' }}>
                                                        <IconUrl path={"stats/ic-new-patients-card"} />
                                                        <Stack>
                                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                                <Typography fontWeight={600} fontSize={24}
                                                                    variant="caption">
                                                                    {patientPerPeriod[patientPerPeriod.length - 1]}
                                                                </Typography>

                                                                <Stack direction={"row"}>
                                                                    <IconUrl
                                                                        path={patientPerIncreasePercentage !== "--" ? (patientPerIncreasePercentage < 0 ? "ic-down-left" : "ic-up-right") : "ic-up-right"}
                                                                        color={patientPerIncreasePercentage !== "--" ? (patientPerIncreasePercentage < 0 ? theme.palette.error.main : theme.palette.success.main) : theme.palette.success.main} />
                                                                    <Typography fontWeight={700} fontSize={14}
                                                                        color={patientPerIncreasePercentage !== "--" ? (patientPerIncreasePercentage < 0 ? "error.main" : "success.main") : "success.main"}
                                                                        variant="body2">{increasePercentage(patientPerPeriod[appointmentPerPeriod.length - 1], patientPerPeriod[appointmentPerPeriod.length - 2])} % </Typography>
                                                                </Stack>
                                                            </Stack>
                                                            <Typography fontSize={12} fontWeight={500} variant="body2">
                                                                {t("new-patients")}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}
                                                        width={1}>
                                                        <IconUrl path={"stats/ic-waiting-hour-card"} />
                                                        <Stack>
                                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                                <Typography lineHeight={1} fontWeight={600}
                                                                    fontSize={24}
                                                                    variant="subtitle1">
                                                                    {statsPerPeriod ? statsPerPeriod["waiting_time"] : "--"}
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
                                        <Card
                                            sx={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: theme.shadows[5]
                                            }}>
                                            <CardContent>
                                                <Typography mb={2} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_location")}</Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={5} sx={{ position: "relative" }}>
                                                        <Image src={"/static/img/earth.png"}
                                                            style={{
                                                                position: "absolute",
                                                                left: "30%",
                                                                top: "38%"
                                                            }}
                                                            alt={"earth"}
                                                            width={window.innerWidth * 0.09}
                                                            height={window.innerHeight * 0.1} />
                                                        <ChartStyled>
                                                            <Chart
                                                                type='donut'
                                                                series={
                                                                    patientPerLocation.reduce((locations: any[], location: any) => [...(locations ?? []), location.doc_count], [])
                                                                }
                                                                options={
                                                                    merge(ChartsOption(), {
                                                                        labels: patientPerLocation.reduce((locations: any[], location: any) => [...(locations ?? []), location.name], []),
                                                                        plotOptions: {
                                                                            pie: {
                                                                                donut: {
                                                                                    size: "80%",
                                                                                    labels: {
                                                                                        show: false,

                                                                                    },

                                                                                }
                                                                            },

                                                                        },
                                                                        legend: {
                                                                            show: false
                                                                        },
                                                                        stroke: {
                                                                            radius: 50, innerRadius: 50,
                                                                        }

                                                                    } as any)

                                                                }
                                                            />
                                                        </ChartStyled>
                                                    </Grid>
                                                    <Grid item xs={12} md={7}>
                                                        <Stack direction="row" alignItems='center'
                                                            spacing={2}
                                                            justifyContent={{ xs: 'center', md: 'stretch' }}
                                                            sx={{ py: { xs: 2, md: 0 } }}>
                                                            <Stack
                                                                width={"100%"}
                                                                sx={{
                                                                    border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                    borderRadius: 2,
                                                                    padding: 1
                                                                }}>
                                                                <Typography fontWeight={700} color='primary'
                                                                    fontSize={28}
                                                                    variant="subtitle1">
                                                                    {Math.round(patientPerLocation.find(location => location.code === doctor_country?.code)?.doc_count / patientPerLocation.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "__"}
                                                                    <Typography fontSize={12} fontWeight={500}
                                                                        variant="caption">
                                                                        %
                                                                    </Typography>
                                                                </Typography>
                                                                <Typography fontSize={12} fontWeight={500}
                                                                    variant="body2">
                                                                    {t("national")}
                                                                </Typography>
                                                            </Stack>
                                                            <Stack
                                                                width={"100%"}
                                                                sx={{
                                                                    border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                    borderRadius: 2,
                                                                    padding: 1
                                                                }}>
                                                                <Typography fontWeight={700} color='warning.main'
                                                                    fontSize={28}
                                                                    variant="subtitle1">
                                                                    {Math.round(patientPerLocation.reduce((total: number, val: any) => total + (doctor_country?.code !== val.code ? val.doc_count : 0), 0) / patientPerLocation.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "__"}
                                                                    <Typography fontSize={12} fontWeight={500}
                                                                        variant="caption">
                                                                        %
                                                                    </Typography>
                                                                </Typography>
                                                                <Typography fontSize={12} fontWeight={500}
                                                                    variant="body2">
                                                                    {t("inter_national")}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                        <List sx={{ mt: 2 }}>
                                                            {patientPerLocation.map((country, idx) => (
                                                                <ListItem
                                                                    key={idx}
                                                                    disablePadding
                                                                    sx={{ pb: 1 }}
                                                                    secondaryAction={<Typography fontWeight={600}>
                                                                        {`${Math.round(country.doc_count / patientPerLocation.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)} %`}
                                                                    </Typography>}>
                                                                    <ListItemIcon sx={{ minWidth: 45 }}>
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 30,
                                                                                height: 22,
                                                                                borderRadius: 0.5
                                                                            }}
                                                                            alt={"flags"}
                                                                            src={`https://flagcdn.com/${country.code}.svg`}
                                                                        />
                                                                    </ListItemIcon>
                                                                    <ListItemText sx={{ m: 0 }} primary={country.name} />
                                                                </ListItem>
                                                            ))}

                                                        </List>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack direction={{ xs: "column", md: 'row' }} spacing={2} height={1}>
                                        <Card
                                            sx={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: theme.shadows[5],
                                                height: 1,
                                                width: 1
                                            }}>
                                            <CardContent>
                                                <Typography mb={{ xs: 1, md: 7 }} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_age")}</Typography>
                                                <ChartStyled>
                                                    <Chart
                                                        type='donut'
                                                        series={
                                                            patientPerAge.reduce((patients: any[], patient: any) => [...(patients ?? []), patient.doc_count], [])
                                                        }
                                                        options={
                                                            merge(ChartsOption(), {
                                                                labels: patientPerAge.reduce((patients: any[], patient: any) => [...(patients ?? []), `${patient.key} ans `], []),
                                                                dataLabels: {
                                                                    enabled: false,
                                                                    style: {
                                                                        colors: [theme.palette.text.primary],
                                                                    },
                                                                    dropShadow: {
                                                                        enabled: false
                                                                    },
                                                                    formatter: function (val: number, opts: any) {
                                                                        return opts.w.config.series[opts.seriesIndex]
                                                                    },
                                                                },
                                                                plotOptions: {
                                                                    pie: {
                                                                        dataLabels: {
                                                                            offset: 50
                                                                        },
                                                                        donut: {
                                                                            size: "30%",
                                                                            labels: {
                                                                                show: false
                                                                            }
                                                                        }
                                                                    },
                                                                },
                                                                legend: {
                                                                    show: false,
                                                                    formatter: (label: any, opts: {
                                                                        w: {
                                                                            globals: { series: { [x: string]: any; }; };
                                                                        };
                                                                        seriesIndex: string | number;
                                                                    }) => {
                                                                        return `${label} : ${Math.round(opts.w.globals.series[opts.seriesIndex] / patientPerAge.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "_"}%`
                                                                    },
                                                                    horizontalAlign: 'center',
                                                                },
                                                                stroke: {
                                                                    width: 0
                                                                }
                                                            } as any)
                                                        }
                                                        height={280}
                                                    />
                                                </ChartStyled>
                                                <Stack alignItems='center'
                                                    direction={'row'}
                                                    justifyContent='center'
                                                    pt={4}
                                                    pb={{ xs: 6, md: 0 }}
                                                    spacing={1}>
                                                    {patientPerAge?.map((gender: any, index: number) =>
                                                        <Chip
                                                            sx={{
                                                                borderRadius: 1,
                                                                backgroundColor: colors[index],
                                                                color: theme.palette.white.lighter,
                                                                fontWeight: "bold"
                                                            }}
                                                            key={index}
                                                            label={gender.key} />
                                                    )}
                                                </Stack>
                                            </CardContent >
                                        </Card >
                                        <Card
                                            sx={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: theme.shadows[5],
                                                height: 1,
                                                width: 1
                                            }}>
                                            <CardContent>
                                                <Typography
                                                    mb={{ xs: 1, md: 7 }} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_gender")}</Typography>
                                                <ChartStyled>
                                                    <Chart
                                                        type='donut'
                                                        series={
                                                            patientPerGender.reduce((gender: any[], val: any) => [...(gender ?? []), val.key !== "u" && val.doc_count], [])
                                                        }
                                                        options={
                                                            merge(ChartsOption(), {
                                                                labels: patientPerGender.map(gender => t(genders[gender.key as keyof typeof genders])),
                                                                legend: {
                                                                    show: false
                                                                },
                                                                colors: [theme.palette.primary.main, theme.palette.error.main],
                                                                plotOptions: {
                                                                    pie: {
                                                                        donut: {
                                                                            labels: {
                                                                                show: false
                                                                            },
                                                                        }
                                                                    },
                                                                },
                                                                stroke: {
                                                                    width: 0
                                                                },
                                                            } as any)
                                                        }
                                                    />
                                                </ChartStyled>
                                                <Stack direction='row'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    spacing={2}
                                                    mt={2}>
                                                    {patientPerGender.filter(gender => gender.key !== "u").map((gender, index) =>
                                                        <Stack key={gender.key} direction={"row"} alignItems={"center"}>
                                                            <Stack alignItems={"center"} sx={{
                                                                border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                borderRadius: 2,
                                                                padding: 1
                                                            }}>
                                                                <Typography fontWeight={700}
                                                                    color={index === 0 ? 'primary' : 'error.main'}
                                                                    fontSize={28}
                                                                    variant="subtitle1">
                                                                    {Math.round(gender?.doc_count / (patientPerGender.reduce((total: number, val: any) => total + val.doc_count, 0)) * 100) || "__"}
                                                                    <Typography fontSize={12} fontWeight={500}
                                                                        variant="caption">
                                                                        %
                                                                    </Typography>
                                                                </Typography>
                                                                <Typography fontSize={12} fontWeight={500}
                                                                    variant="body2">
                                                                    {t(genders[gender.key as keyof typeof genders])}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack >
                                                    )
                                                    }
                                                </Stack >
                                            </CardContent >
                                        </Card >
                                    </Stack >
                                </Grid >
                            </>
                        }
                        {
                            ((!fullScreenChart.motif && !fullScreenChart.act) || fullScreenChart.type) &&
                            <Grid item xs={12} md={fullScreenChart.type ? 12 : 4}>
                                <StatsProgressCard
                                    {...{ t, theme, fullScreenChart }}
                                    type={"type"}
                                    view={rdv_type.view}
                                    handleFullChart={(data: any) => setFullScreenChart(data)}
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
                                    subtitle={t("rdv_type")}
                                    total={typePerPeriod.length}
                                    icon={"stats/ic-acte-secpndaire"}
                                    data={typePerPeriod.slice(0, fullScreenChart.type ? typePerPeriod.length : 5).map((type: any) => ({
                                        ...type,
                                        name: type.key,
                                        color: "#5bb5ff",
                                        numbers: type.doc_count,
                                        duration: type.mean_duration,
                                        value: Math.round(type.doc_count / typePerPeriod.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)
                                    }))}
                                />
                            </Grid>
                        }
                        {
                            ((!fullScreenChart.motif && !fullScreenChart.type) || fullScreenChart.act) &&
                            <Grid item xs={12} md={fullScreenChart.act ? 12 : 4}>
                                <StatsProgressCard
                                    {...{ t, theme, fullScreenChart }}
                                    type={"act"}
                                    view={act_by_rdv.view}
                                    handleFullChart={(data: any) => setFullScreenChart(data)}
                                    views={act_by_rdv.ACT_BY_RDV_OPTIONS}
                                    onSelect={(viewOption: string) => setState({
                                        ...state,
                                        act_by_rdv: {
                                            ...act_by_rdv,
                                            view: viewOption,
                                        }
                                    })}
                                    data={actPerPeriod.slice(0, fullScreenChart.act ? actPerPeriod.length : 5).map((type: any) => ({
                                        ...type,
                                        name: type.key,
                                        color: "#ffd95b",
                                        numbers: type.doc_count,
                                        value: Math.round(type.doc_count / actPerPeriod.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)
                                    }))}
                                    icon={"stats/ic-acte"}
                                    subtitle={t("act_per_visit")}
                                    total={actPerPeriod.length}
                                />
                            </Grid>
                        }
                        {
                            ((!fullScreenChart.type && !fullScreenChart.act) || fullScreenChart.motif) &&
                            <Grid item xs={12} md={fullScreenChart.motif ? 12 : 4}>
                                <StatsProgressCard
                                    {...{ t, theme, fullScreenChart }}
                                    type={"motif"}
                                    view={motif_by_consult.view}
                                    handleFullChart={(data: any) => setFullScreenChart(data)}
                                    views={motif_by_consult.MOTIF_BY_CONSULT_OPTIONS}
                                    onSelect={(viewOption: string) => setState({
                                        ...state,
                                        motif_by_consult: {
                                            ...motif_by_consult,
                                            view: viewOption,
                                        }
                                    })}
                                    data={motifPerPeriod.slice(0, fullScreenChart.motif ? motifPerPeriod.length : 5).map((type: any) => ({
                                        ...type,
                                        name: type.key,
                                        color: "#ff5b6e",
                                        numbers: type.doc_count,
                                        duration: type.mean_duration,
                                        value: Math.round(type.doc_count / motifPerPeriod.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)
                                    }))}
                                    icon={"stats/ic-stethoscope"}
                                    subtitle={t("reason")}
                                    total={motifPerPeriod.length}
                                />
                            </Grid>
                        }
                    </Grid >
                </TabPanel >
                <TabPanel padding={.1} value={value} index={1}>
                    <Grid container spacing={2}>
                        {(!fullScreenChart.motif && !fullScreenChart.act && !fullScreenChart.type) &&
                            <>
                                <Grid item xs={12} md={2}>
                                    <Stack spacing={2} height={1}>
                                        <Card
                                            sx={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: theme.shadows[5],
                                                flex: 1,
                                            }}>
                                            <CardContent sx={{ height: "100%" }}>
                                                <Stack spacing={2} justifyContent={"center"} height={"100%"}>
                                                    <IconUrl path={"stats/ic-calendar-card"} />
                                                    <Stack>
                                                        <Typography
                                                            fontSize={14}
                                                            fontWeight={"bold"}
                                                            variant="body2">
                                                            {t("appointments")}
                                                        </Typography>
                                                        <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                            {appointmentPerPeriod.reduce((total: number, val: number) => total + val, 0)}
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
                                            <CardContent sx={{ height: "100%" }}>
                                                <Stack spacing={2} justifyContent={"center"} height={"100%"}>
                                                    <IconUrl path={"stats/ic-document-card"} />
                                                    <Stack>
                                                        <Typography
                                                            fontSize={14}
                                                            fontWeight={"bold"}
                                                            variant="body2">
                                                            {t(`rdv-per.${viewChart}`)}
                                                        </Typography>
                                                        <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                            {appointmentPerPeriod[appointmentPerPeriod.length - 1]}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Grid >
                                <Grid item xs={12} md={6}>
                                    <Card
                                        sx={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: theme.shadows[5],
                                            height: 1
                                        }}>
                                        <CardContent sx={{ pb: 0 }}>
                                            <Stack ml={2} direction={"row"} spacing={2}
                                                justifyContent={"space-between"}>
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
                                                    series={periodChartData}
                                                    options={merge(ChartsOption(), {
                                                        xaxis: {
                                                            position: "top",
                                                            categories: durations.map(date =>
                                                                startCase(date.format(VIEW_OPTIONS.find(view => view.value === viewChart)?.format).replace('.', '')))
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
                                                    height={260}
                                                />
                                            </ChartStyled>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        }

                        {
                            ((!fullScreenChart.type && !fullScreenChart.act) || fullScreenChart.motif) &&
                            <Grid item xs={12} md={fullScreenChart.motif ? 12 : 4}>
                                <StatsProgressCard
                                    {...{ t, theme, fullScreenChart }}
                                    type={"motif"}
                                    view={motif_by_consult.view}
                                    handleFullChart={(data: any) => setFullScreenChart(data)}
                                    views={motif_by_consult.MOTIF_BY_CONSULT_OPTIONS}
                                    onSelect={(viewOption: string) => setState({
                                        ...state,
                                        motif_by_consult: {
                                            ...motif_by_consult,
                                            view: viewOption,
                                        }
                                    })}
                                    data={motifPerPeriod.slice(0, fullScreenChart.motif ? motifPerPeriod.length : 5).map((type: any) => ({
                                        ...type,
                                        name: type.key,
                                        color: "#ff5b6e",
                                        numbers: type.doc_count,
                                        duration: type.mean_duration,
                                        value: Math.round(type.doc_count / motifPerPeriod.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)
                                    }))}
                                    icon={"stats/ic-stethoscope"}
                                    subtitle={t("reason")}
                                    total={motifPerPeriod.length}
                                />
                            </Grid>
                        }

                        {
                            ((!fullScreenChart.motif && !fullScreenChart.act) || fullScreenChart.type) &&
                            <Grid item xs={12} md={fullScreenChart.type ? 12 : 6}>
                                <StatsProgressCard
                                    {...{ t, theme, fullScreenChart }}
                                    type={"type"}
                                    view={rdv_type.view}
                                    handleFullChart={(data: any) => setFullScreenChart(data)}
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
                                    subtitle={t("rdv_type")}
                                    total={typePerPeriod.length}
                                    icon={"stats/ic-acte-secpndaire"}
                                    data={typePerPeriod.slice(0, fullScreenChart.type ? typePerPeriod.length : 5).map((type: any) => ({
                                        ...type,
                                        name: type.key,
                                        color: "#5bb5ff",
                                        numbers: type.doc_count,
                                        duration: type.mean_duration,
                                        value: Math.round(type.doc_count / typePerPeriod.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)
                                    }))}
                                />
                            </Grid>
                        }

                        {
                            ((!fullScreenChart.motif && !fullScreenChart.type) || fullScreenChart.act) &&
                            <Grid item xs={12} md={fullScreenChart.act ? 12 : 6}>
                                <StatsProgressCard
                                    {...{ t, theme, fullScreenChart }}
                                    type={"act"}
                                    view={act_by_rdv.view}
                                    handleFullChart={(data: any) => setFullScreenChart(data)}
                                    views={act_by_rdv.ACT_BY_RDV_OPTIONS}
                                    onSelect={(viewOption: string) => setState({
                                        ...state,
                                        act_by_rdv: {
                                            ...act_by_rdv,
                                            view: viewOption,
                                        }
                                    })}
                                    data={actPerPeriod.slice(0, fullScreenChart.act ? actPerPeriod.length : 5).map((type: any) => ({
                                        ...type,
                                        name: type.key,
                                        color: "#ffd95b",
                                        numbers: type.doc_count,
                                        value: Math.round(type.doc_count / actPerPeriod.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)
                                    }))}
                                    icon={"stats/ic-acte"}
                                    subtitle={t("act_per_visit")}
                                    total={actPerPeriod.length}
                                />
                            </Grid>
                        }
                    </Grid >
                </TabPanel >
                <TabPanel padding={.3} value={value} index={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                            <Stack spacing={2}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5]
                                    }}>
                                    <CardContent>
                                        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={"center"}>
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
                                            <Stack my={{ xs: 2, md: 0 }} px={{ xs: 0, md: 2 }} mr={{ xs: 0, md: 2 }}
                                                direction={"row"} spacing={1.2} alignItems={"center"} width={1}
                                                borderRight={{ xs: 0, md: 1.5 }} borderLeft={{ xs: 0, md: 1.5 }}
                                                borderColor={{ xs: 'transparent', md: 'divider' }}>
                                                <IconUrl path={"stats/ic-new-patients-card"} />
                                                <Stack>
                                                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                        <Typography fontWeight={600} fontSize={24} variant="caption">
                                                            {patientPerPeriod[patientPerPeriod.length - 1]}
                                                        </Typography>

                                                        <Stack direction={"row"}>
                                                            <IconUrl
                                                                path={patientPerIncreasePercentage !== "--" ? (patientPerIncreasePercentage < 0 ? "ic-down-left" : "ic-up-right") : "ic-up-right"}
                                                                color={patientPerIncreasePercentage !== "--" ? (patientPerIncreasePercentage < 0 ? theme.palette.error.main : theme.palette.success.main) : theme.palette.success.main} />
                                                            <Typography fontWeight={700} fontSize={14}
                                                                color={patientPerIncreasePercentage !== "--" ? (patientPerIncreasePercentage < 0 ? "error.main" : "success.main") : "success.main"}
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
                                                        <Typography lineHeight={1} fontWeight={600} fontSize={24}
                                                            variant="subtitle1">
                                                            {statsPerPeriod ? statsPerPeriod["waiting_time"] : "--"}
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
                                </Card >
                                <Card
                                    sx={{
                                        minHeight: 646,
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                    }}>
                                    <CardContent>
                                        <Typography mb={2} variant="subtitle1"
                                            fontWeight={700}>{t("patient_by_location")}</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={8} sx={{ position: "relative" }}>
                                                <Image src={"/static/img/earth.png"}
                                                    style={{
                                                        position: "absolute",
                                                        left: "33%",
                                                        top: "28%"
                                                    }}
                                                    alt={"earth"}
                                                    width={window.innerWidth * 0.13}
                                                    height={window.innerHeight * 0.12} />
                                                <ChartStyled>
                                                    <Chart
                                                        type='donut'
                                                        series={
                                                            patientPerLocation.reduce((locations: any[], location: any) => [...(locations ?? []), location.doc_count], [])
                                                        }
                                                        options={
                                                            merge(ChartsOption(), {
                                                                labels: patientPerLocation.reduce((locations: any[], location: any) => [...(locations ?? []), location.name], []),
                                                                plotOptions: {
                                                                    pie: {

                                                                        donut: {
                                                                            size: "80%",
                                                                            labels: {
                                                                                show: false,

                                                                            },

                                                                        }
                                                                    },

                                                                },
                                                                legend: {
                                                                    show: false
                                                                },
                                                                stroke: {
                                                                    radius: 50, innerRadius: 50,
                                                                }

                                                            } as any)

                                                        }
                                                        height={330}
                                                    />
                                                </ChartStyled>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Stack spacing={2}>
                                                    <Stack
                                                        sx={{
                                                            border: `2px dotted ${theme.palette.grey['A300']}`,
                                                            borderRadius: 2,
                                                            padding: 2
                                                        }}>
                                                        <Typography fontWeight={700} color='primary' fontSize={56}
                                                            variant="subtitle1">
                                                            {Math.round((patientPerLocation.find(location => location.code === doctor_country.code)?.doc_count ?? 0) / patientPerLocation.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "__"}
                                                            <Typography fontSize={18} fontWeight={700}
                                                                variant="caption">
                                                                %
                                                            </Typography>
                                                        </Typography>
                                                        <Typography fontSize={24} fontWeight={700} variant="body2">
                                                            {t("national")}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack
                                                        sx={{
                                                            border: `2px dotted ${theme.palette.grey['A300']}`,
                                                            borderRadius: 2,
                                                            padding: 2
                                                        }}>
                                                        <Typography fontWeight={700} color='warning.main' fontSize={56}
                                                            variant="subtitle1">
                                                            {Math.round(patientPerLocation.reduce((total: number, val: any) => total + (doctor_country.code !== val.code ? val.doc_count : 0), 0) / patientPerLocation.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "__"}
                                                            <Typography fontSize={18} fontWeight={500}
                                                                variant="caption">
                                                                %
                                                            </Typography>
                                                        </Typography>
                                                        <Typography fontSize={24} fontWeight={700} variant="body2">
                                                            {t("inter_national")}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <List sx={{ mt: 2 }}>
                                                    {patientPerLocation.map((country, idx) => (
                                                        <ListItem
                                                            key={idx}
                                                            disablePadding
                                                            sx={{ pb: 1 }}
                                                            secondaryAction={<Typography fontWeight={600}>
                                                                {country.doc_count}
                                                            </Typography>}>
                                                            <ListItemIcon sx={{ minWidth: 45 }}>
                                                                <Avatar
                                                                    sx={{
                                                                        width: 30,
                                                                        height: 22,
                                                                        borderRadius: 0.5
                                                                    }}
                                                                    alt={"flags"}
                                                                    src={`https://flagcdn.com/${country.code}.svg`}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText sx={{ m: 0 }} primary={country.name} />
                                                        </ListItem>
                                                    ))}

                                                </List>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Stack >
                        </Grid >
                        <Grid item xs={12} md={5}>
                            <Stack spacing={2} height={1}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        height: 1,
                                        width: 1
                                    }}>
                                    <CardContent>
                                        <Typography mb={2} variant="subtitle1"
                                            fontWeight={700}>{t("patient_by_gender")}</Typography>
                                        <Stack direction='row' alignItems='center'>
                                            <Stack width={"33%"} spacing={2}>
                                                {patientPerGender.filter(gender => gender.key !== "u").map((gender, index) =>
                                                    <Stack key={gender.key} alignItems={"center"}>
                                                        <Stack alignItems={"center"}
                                                            sx={{
                                                                border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                borderRadius: 2,
                                                                padding: 2
                                                            }}>
                                                            <Typography fontWeight={700}
                                                                color={index === 0 ? 'primary' : 'error.main'}
                                                                fontSize={28}
                                                                variant="subtitle1">
                                                                {Math.round(gender?.doc_count / (patientPerGender.reduce((total: number, val: any) => total + val.doc_count, 0)) * 100) || "__"}
                                                                <Typography fontSize={12} fontWeight={500}
                                                                    variant="caption">
                                                                    %
                                                                </Typography>
                                                            </Typography>
                                                            <Typography fontSize={12} fontWeight={500}
                                                                variant="body2">
                                                                {t(genders[gender.key as keyof typeof genders])}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack >
                                                )}
                                            </Stack >
                                            <ChartStyled>
                                                <Chart
                                                    type='donut'
                                                    series={
                                                        patientPerGender.reduce((gender: any[], val: any) => [...(gender ?? []), val.key !== "u" && val.doc_count], [])
                                                    }
                                                    options={
                                                        merge(ChartsOption(), {
                                                            labels: patientPerGender.map(gender => t(genders[gender.key as keyof typeof genders])),
                                                            legend: {
                                                                show: false
                                                            },
                                                            colors: [theme.palette.primary.main, theme.palette.error.main],
                                                            plotOptions: {
                                                                pie: {
                                                                    donut: {
                                                                        labels: {
                                                                            show: false,

                                                                        },

                                                                    }
                                                                },
                                                            },
                                                            stroke: {
                                                                width: 0
                                                            },
                                                        } as any)
                                                    }
                                                />
                                            </ChartStyled>
                                        </Stack >

                                    </CardContent >
                                </Card >
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        height: 1,
                                        width: 1
                                    }}>
                                    <CardContent>
                                        <Stack direction={"row"} alignItems={"center"}
                                            spacing={6}
                                            justifyContent={"center"}>
                                            <Stack>
                                                <Typography mb={2} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_age")}</Typography>
                                                <ChartStyled sx={{ pb: 6 }}>
                                                    <Chart
                                                        type='donut'
                                                        series={
                                                            patientPerAge.reduce((patients: any[], patient: any) => [...(patients ?? []), patient.doc_count], [])
                                                        }
                                                        options={
                                                            merge(ChartsOption(), {
                                                                labels: patientPerAge.reduce((patients: any[], patient: any) => [...(patients ?? []), `${patient.key} ans `], []),
                                                                dataLabels: {
                                                                    enabled: false,
                                                                    style: {
                                                                        colors: [theme.palette.text.primary],
                                                                    },
                                                                    dropShadow: {
                                                                        enabled: false
                                                                    },
                                                                    formatter: function (val: number, opts: any) {
                                                                        return opts.w.config.series[opts.seriesIndex]
                                                                    },
                                                                },
                                                                plotOptions: {
                                                                    pie: {
                                                                        dataLabels: {
                                                                            offset: 40
                                                                        },
                                                                        donut: {
                                                                            size: "30%",

                                                                            labels: {
                                                                                show: false,

                                                                            },

                                                                        }
                                                                    },

                                                                },
                                                                legend: {
                                                                    show: false,
                                                                    formatter: (label: any, opts: {
                                                                        w: {
                                                                            globals: { series: { [x: string]: any; }; };
                                                                        };
                                                                        seriesIndex: string | number;
                                                                    }) => {
                                                                        return `${label} : ${Math.round(opts.w.globals.series[opts.seriesIndex] / patientPerAge.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "_"}%`
                                                                    },
                                                                    horizontalAlign: 'center',
                                                                },
                                                                stroke: {
                                                                    width: 0
                                                                }
                                                            } as any)

                                                        }
                                                        height={320}
                                                    />
                                                </ChartStyled>
                                            </Stack >
                                            <Stack alignItems='center'
                                                justifyContent='center'
                                                spacing={1}>
                                                {patientPerAge?.map((gender: any, index: number) =>
                                                    <Chip
                                                        sx={{
                                                            borderRadius: 1,
                                                            backgroundColor: colors[index],
                                                            color: theme.palette.white.lighter,
                                                            fontWeight: "bold"
                                                        }}
                                                        key={index}
                                                        label={gender.key} />
                                                )}
                                            </Stack>
                                        </Stack >
                                    </CardContent >
                                </Card >
                            </Stack >
                        </Grid >
                    </Grid >
                </TabPanel >
                <TabPanel padding={.3} value={value} index={3}>
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12}>
                            <Stack spacing={2}>
                                <Card sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5],
                                }}>
                                    <CardContent>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <IconUrl path="stats/ic-start" />
                                            <Stack width={1}>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {statsPerPeriod?.day_common_start_time ? moment(statsPerPeriod.day_common_start_time, "HH:mm").format("H") : "--"}
                                                    <Typography variant="caption" fontWeight={500}>h</Typography>
                                                    {" "}
                                                    {statsPerPeriod?.day_common_start_time ? moment(statsPerPeriod.day_common_start_time, "HH:mm").format("mm") : "--"}
                                                    <Typography variant="caption" fontWeight={500}>min</Typography>
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {t("start_time")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                                <Card sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5],
                                }}>
                                    <CardContent>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <IconUrl path="stats/ic-end" />
                                            <Stack width={1}>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {statsPerPeriod?.day_common_end_time ? moment(statsPerPeriod.day_common_end_time, "HH:mm").format("H") : "--"}
                                                    <Typography variant="caption" fontWeight={500}>h</Typography>
                                                    {" "}
                                                    {statsPerPeriod?.day_common_end_time ? moment(statsPerPeriod.day_common_end_time, "HH:mm").format("mm") : "--"}
                                                    <Typography variant="caption" fontWeight={500}>min</Typography>
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {t("end_time")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5],
                                    height: 1
                                }}>
                                <CardContent>
                                    <Typography mb={2} variant="subtitle1"
                                        fontWeight={700}>{t("working_hours")}</Typography>

                                    <ChartStyled>
                                        <Chart
                                            type='rangeBar'
                                            series={[{ data: schedules }]}
                                            options={merge(ChartsOption(), {
                                                chart: {
                                                    height: 350,
                                                    type: 'rangeBar'
                                                },
                                                bar: {
                                                    dataLabels: {
                                                        position: 'top'
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: true,
                                                    textAnchor: 'start',
                                                    formatter: function (val: string, opt: any) {
                                                        const startTime = schedules[opt.dataPointIndex].y[0];
                                                        const durationStart = moment.duration(startTime, 'hours');
                                                        const durationEnd = moment.duration(val, 'hours');
                                                        return `${durationStart.hours()}:${durationStart.minutes()} h - ${durationEnd.hours()}:${durationEnd.minutes()} h`
                                                    },
                                                    offsetX: -44,
                                                    dropShadow: {
                                                        enabled: true,
                                                        opacity: 0.5
                                                    },
                                                    style: {
                                                        colors: ['#333'],
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                    },
                                                    background: {
                                                        enabled: true,
                                                        color: theme.palette.primary.main,
                                                        borderRadius: 4,
                                                        padding: 4,
                                                        opacity: 0.9,
                                                        borderWidth: 1,
                                                        borderColor: '#fff'
                                                    },
                                                },
                                                tooltip: {
                                                    custom: ({ seriesIndex, dataPointIndex, w }: any) => {
                                                        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                                                        return renderToString(
                                                            <Card>
                                                                <CardContent>
                                                                    <Typography
                                                                        variant={"body2"}><strong>{data.x}</strong> : {data.y.map((item: number, index: number) => {
                                                                            const duration = moment.duration(item, 'hours');
                                                                            return `${duration.hours()}:${duration.minutes()} h ${index === 0 ? '- ' : ''}`
                                                                        })}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>);
                                                    }
                                                },
                                                fill: {
                                                    opacity: 1
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
                                                    },
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        columnWidth: '48%',
                                                        borderRadius: 3
                                                    }
                                                },
                                                yaxis: {
                                                    labels: {
                                                        show: true,
                                                        formatter: (val: string) => {
                                                            const duration = moment.duration(val, 'hours');
                                                            return `${duration.hours()}:${duration.minutes()} h`;
                                                        }
                                                    }
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
                        </Grid>
                    </Grid>

                </TabPanel>
                <TabPanel padding={.3} value={value} index={4}>
                    <Grid container spacing={2} mb={3}>
                        <Grid xs={12} item md={4}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5],
                                    height: 1
                                }}>
                                <CardContent sx={{ pb: 0 }}>
                                    <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1} mb={2}>
                                        <IconUrl path={"ic-consultation-reasons"} />
                                        <Stack>
                                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                                {motifPerPeriod.length}
                                            </Typography>
                                            <Typography fontSize={{ md: 11, xl: 12 }} fontWeight={500} variant="body2">
                                                {t("reason")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    {motifPerPeriod.map((motif: any, index: number) => (
                                        <Stack spacing={0} key={index} mb={.3}>
                                            <Card
                                                sx={{
                                                    ...(motif.key === selectedConsultationReason?.key && { backgroundColor: "#E6F7FE" }),
                                                    border: "none",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => handleConsultationReasonSet(motif)}>
                                                <CardContent>
                                                    <Stack direction='row' alignItems='center'
                                                        justifyContent='space-between'>
                                                        <Typography variant="body2"
                                                            fontWeight={800}>{startCase(t(motif.key))}</Typography>
                                                        <Typography fontSize={20} fontWeight={600}
                                                            lineHeight={1.2}>{motif.doc_count}
                                                        </Typography>
                                                    </Stack>
                                                    <BorderLinearProgressStyled bgcolor={"#ff5b6e"}
                                                        variant="determinate"
                                                        value={motif.doc_count} />
                                                </CardContent>
                                            </Card>
                                        </Stack>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} item md={8}>
                            <Stack spacing={2}>
                                <Stack>
                                    <Card
                                        sx={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: theme.shadows[5],
                                            height: 1
                                        }}>
                                        <CardContent sx={{ pb: 0 }}>
                                            <Stack mb={1}>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    {startCase(t(selectedConsultationReason?.key)) ?? "--"}
                                                </Typography>
                                                <Typography fontSize={{ md: 11, xl: 12 }} fontWeight={500}
                                                    variant="body2">
                                                    {t("consultation_reson", { ns: "common" })}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" alignItems={"center"} sx={{ width: "100%" }}
                                                spacing={1.2}>
                                                <Card
                                                    sx={{
                                                        border: `1px dotted ${theme.palette.grey['A300']}`,
                                                        cursor: "pointer",
                                                        width: "100%"
                                                    }}>
                                                    <CardContent>
                                                        <Stack direction='row' alignItems='center'
                                                            justifyContent='space-between'>
                                                            <Typography variant="body2"
                                                                fontWeight={800}>{startCase(t("count"))}</Typography>
                                                            <Typography fontSize={20} fontWeight={600}
                                                                lineHeight={1.2}>{selectedConsultationReason?.doc_count}
                                                            </Typography>
                                                        </Stack>

                                                        <BorderLinearProgressStyled bgcolor={"#ff5b6e"}
                                                            variant="determinate"
                                                            value={selectedConsultationReason?.doc_count ?? 0} />
                                                    </CardContent>
                                                </Card>

                                                <Card
                                                    sx={{
                                                        border: `1px dotted ${theme.palette.grey['A300']}`,
                                                        cursor: "pointer",
                                                        width: "100%"
                                                    }}>
                                                    <CardContent>
                                                        <Stack direction='row' alignItems='center'
                                                            justifyContent='space-between'>
                                                            <Typography variant="body2"
                                                                fontWeight={800}>{startCase(t("duration"))}</Typography>
                                                            <Typography fontSize={16} fontWeight={600}
                                                                lineHeight={1.2}>{selectedConsultationReason?.mean_duration} min
                                                            </Typography>
                                                        </Stack>

                                                        <BorderLinearProgressStyled bgcolor={"#ff5b6e"}
                                                            variant="determinate"
                                                            value={parseInt(selectedConsultationReason?.mean_duration) || 0} />
                                                    </CardContent>
                                                </Card>
                                            </Stack>

                                        </CardContent>
                                    </Card>
                                </Stack>
                                <Stack spacing={2}>
                                    <Card
                                        sx={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: theme.shadows[5]
                                        }}>
                                        <CardContent>
                                            <Typography mb={2} variant="subtitle1"
                                                fontWeight={700}>{t("patient_by_location")}</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={5} sx={{ position: "relative" }}>
                                                    <Image src={"/static/img/earth.png"}
                                                        style={{
                                                            position: "absolute",
                                                            left: "27%",
                                                            top: "39%"
                                                        }}
                                                        alt={"earth"}
                                                        width={180}
                                                        height={30} />
                                                    <ChartStyled>
                                                        <Chart
                                                            type='donut'
                                                            series={
                                                                selectedConsultationReason?.location?.reduce((locations: any[], location: any) => [...(locations ?? []), location.doc_count], []) ?? []
                                                            }
                                                            options={
                                                                merge(ChartsOption(), {
                                                                    labels: selectedConsultationReason?.location?.reduce((locations: any[], location: any) => [...(locations ?? []), location.name], []) ?? [],
                                                                    plotOptions: {
                                                                        pie: {
                                                                            donut: {
                                                                                size: "80%",
                                                                                labels: {
                                                                                    show: false,
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    legend: {
                                                                        show: false
                                                                    },
                                                                    stroke: {
                                                                        radius: 50, innerRadius: 50,
                                                                    }
                                                                } as any)
                                                            }
                                                        />
                                                    </ChartStyled>
                                                </Grid>
                                                <Grid item xs={12} md={7}>
                                                    <Stack direction="row"
                                                        alignItems='center'
                                                        width={"100%"}
                                                        spacing={2}
                                                        justifyContent={{ xs: 'center', md: 'stretch' }}
                                                        sx={{ py: { xs: 2, md: 0 } }}>
                                                        <Stack
                                                            width={"100%"}
                                                            sx={{
                                                                border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                borderRadius: 2,
                                                                padding: 1
                                                            }}>
                                                            <Typography fontWeight={700} color='primary'
                                                                fontSize={28}
                                                                variant="subtitle1">
                                                                {Math.round(selectedConsultationReason?.location?.find((location: any) => location.code === doctor_country?.code)?.doc_count / selectedConsultationReason?.location?.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "__"}
                                                                <Typography fontSize={12} fontWeight={500}
                                                                    variant="caption">
                                                                    %
                                                                </Typography>
                                                            </Typography>
                                                            <Typography fontSize={12} fontWeight={500}
                                                                variant="body2">
                                                                {t("national")}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack
                                                            width={"100%"}
                                                            sx={{
                                                                border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                borderRadius: 2,
                                                                padding: 1
                                                            }}>
                                                            <Typography fontWeight={700} color='warning.main'
                                                                fontSize={28}
                                                                variant="subtitle1">
                                                                {Math.round(selectedConsultationReason?.location?.reduce((total: number, val: any) => total + (doctor_country?.code !== val.code ? val.doc_count : 0), 0) / selectedConsultationReason?.location?.reduce((total: number, val: any) => total + val.doc_count, 0) * 100) || "__"}
                                                                <Typography fontSize={12} fontWeight={500}
                                                                    variant="caption">
                                                                    %
                                                                </Typography>
                                                            </Typography>
                                                            <Typography fontSize={12} fontWeight={500}
                                                                variant="body2">
                                                                {t("inter_national")}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                    <List sx={{ mt: 2 }}>
                                                        {selectedConsultationReason?.location?.map((country: any, idx: number) => (
                                                            <ListItem
                                                                key={idx}
                                                                disablePadding
                                                                sx={{ pb: 1 }}
                                                                secondaryAction={<Typography fontWeight={600}>
                                                                    {`${Math.round(country.doc_count / selectedConsultationReason?.location?.reduce((total: number, val: any) => total + val.doc_count, 0) * 100)} %`}
                                                                </Typography>}>
                                                                <ListItemIcon sx={{ minWidth: 45 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 32,
                                                                            height: 24,
                                                                            borderRadius: 0.5
                                                                        }}
                                                                        alt={"flags"}
                                                                        src={`https://flagcdn.com/${country.code}.svg`}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemText sx={{ m: 0 }} primary={country.name} />
                                                            </ListItem>
                                                        ))}

                                                    </List>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Stack>
                                <Stack>
                                    <Grid item xs={12} md={12}>
                                        <Stack direction={{ xs: "column", md: 'row' }} spacing={2}>
                                            <Card
                                                sx={{
                                                    borderRadius: "12px",
                                                    border: "none",
                                                    boxShadow: theme.shadows[5],
                                                    height: 'auto',
                                                    width: 1
                                                }}>
                                                <CardContent>
                                                    <Stack direction={"row"} alignItems={"center"}
                                                        justifyContent={"center"}>
                                                        <Stack>
                                                            <Typography mb={3} variant="subtitle1"
                                                                fontWeight={700}>{t("patient_by_age")}</Typography>
                                                            <ChartStyled>
                                                                <Chart
                                                                    type='donut'
                                                                    series={
                                                                        selectedConsultationReason?.age?.reduce((patients: any[], patient: any) => [...(patients ?? []), patient.doc_count], []) ?? []
                                                                    }
                                                                    options={
                                                                        merge(ChartsOption(), {
                                                                            labels: selectedConsultationReason?.age?.reduce((patients: any[], patient: any) => [...(patients ?? []), `${patient.key} ans `], []) ?? [],
                                                                            dataLabels: {
                                                                                enabled: true,
                                                                                style: {
                                                                                    colors: [theme.palette.white.lighter],
                                                                                },
                                                                                dropShadow: {
                                                                                    enabled: false
                                                                                },
                                                                                formatter: function (val: number, opts: any) {
                                                                                    return selectedConsultationReason?.age[opts.seriesIndex]?.key ?? ""
                                                                                },
                                                                            },
                                                                            plotOptions: {
                                                                                pie: {
                                                                                    donut: {
                                                                                        size: "30%",
                                                                                        labels: {
                                                                                            show: false
                                                                                        }
                                                                                    }
                                                                                },
                                                                            },
                                                                            colors,
                                                                            legend: {
                                                                                show: false,
                                                                                formatter: (label: any, opts: {
                                                                                    w: {
                                                                                        globals: {
                                                                                            series: {
                                                                                                [x: string]: any;
                                                                                            };
                                                                                        };
                                                                                    };
                                                                                    seriesIndex: string | number;
                                                                                }) => {
                                                                                    return `${label} : ${Math.round(opts.w.globals.series[opts.seriesIndex] / (selectedConsultationReason?.age?.reduce((total: number, val: any) => total + val.doc_count, 0) ?? 0) * 100) || "_"}%`
                                                                                },
                                                                                horizontalAlign: 'center',
                                                                            },
                                                                            stroke: {
                                                                                width: 0
                                                                            }
                                                                        } as any)
                                                                    }
                                                                    height={280}
                                                                />
                                                            </ChartStyled>
                                                        </Stack>
                                                        <Stack alignItems='center'
                                                            justifyContent='center'
                                                            pt={4}
                                                            spacing={1}>
                                                            {selectedConsultationReason?.age?.map((gender: any, index: number) =>
                                                                <Chip
                                                                    sx={{
                                                                        borderRadius: 1,
                                                                        backgroundColor: colors[index],
                                                                        color: theme.palette.white.lighter,
                                                                        fontWeight: "bold"
                                                                    }}
                                                                    key={index}
                                                                    label={gender.key} />
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                            <Card
                                                sx={{
                                                    borderRadius: "12px",
                                                    border: "none",
                                                    boxShadow: theme.shadows[5],
                                                    height: 1,
                                                    width: 1
                                                }}>
                                                <CardContent>
                                                    <Stack direction={"row"} alignItems={"center"}
                                                        justifyContent={"center"}>
                                                        <Stack>
                                                            <Typography
                                                                mb={7} variant="subtitle1"
                                                                fontWeight={700}>{t("patient_by_gender")}</Typography>
                                                            <ChartStyled>
                                                                <Chart
                                                                    type='donut'
                                                                    series={
                                                                        selectedConsultationReason?.gender?.reduce((gender: any[], val: any) => [...(gender ?? []), ...(val.key !== "u" ? [val.doc_count] : [])], []) ?? []
                                                                    }
                                                                    options={
                                                                        merge(ChartsOption(), {
                                                                            labels: selectedConsultationReason?.gender?.map((gender: any) => t(genders[gender.key as keyof typeof genders])) ?? [],
                                                                            legend: {
                                                                                show: false
                                                                            },
                                                                            colors: [theme.palette.primary.main, theme.palette.error.main],
                                                                            plotOptions: {
                                                                                pie: {
                                                                                    donut: {
                                                                                        labels: {
                                                                                            show: false
                                                                                        },
                                                                                    }
                                                                                },
                                                                            },
                                                                            stroke: {
                                                                                width: 0
                                                                            },
                                                                        } as any)
                                                                    }
                                                                />
                                                            </ChartStyled>
                                                        </Stack>


                                                        <Stack alignItems='center'
                                                            justifyContent='center'
                                                            spacing={2}
                                                            mt={2}>
                                                            {selectedConsultationReason?.gender?.filter((gender: any) => gender.key !== "u").map((gender: any, index: number) =>
                                                                <Stack key={gender.key} direction={"row"}
                                                                    alignItems={"center"}>
                                                                    <Stack alignItems={"center"}
                                                                        sx={{
                                                                            border: `2px dotted ${theme.palette.grey['A300']}`,
                                                                            borderRadius: 2,
                                                                            padding: 1
                                                                        }}>
                                                                        <Typography fontWeight={700}
                                                                            color={index === 0 ? 'primary' : 'error.main'}
                                                                            fontSize={28}
                                                                            variant="subtitle1">
                                                                            {Math.round(gender?.doc_count / (selectedConsultationReason?.gender?.reduce((total: number, val: any) => total + val.doc_count, 0)) * 100) || "__"}
                                                                            <Typography fontSize={12} fontWeight={500}
                                                                                variant="caption">
                                                                                %
                                                                            </Typography>
                                                                        </Typography>
                                                                        <Typography fontSize={12} fontWeight={500}
                                                                            variant="body2">
                                                                            {t(genders[gender.key as keyof typeof genders])}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Stack>
                                    </Grid>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Box >
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
