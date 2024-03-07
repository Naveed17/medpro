import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {SubHeader} from "@features/subHeader";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import {StatsToolbar} from "@features/toolbar";
import {merge} from 'lodash';
import {ChartsOption, ChartStyled} from "@features/charts";
import IconUrl from "@themes/urlIcon";
import {toggleSideBar} from "@features/menu";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {agendaSelector} from "@features/calendar";
import {CalendarViewButton} from "@features/buttons";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import moment from "moment-timezone";
import {startCase} from 'lodash';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
import {LoadingScreen} from "@features/loadingScreen";
import {TabPanel} from "@features/tabPanel";
import NumberIcon from "@themes/overrides/icons/numberIcon";
import TimerIcon from "@themes/overrides/icons/timerIcon";
import {StatsProgressCard} from "@features/card";

const actData = [
    {
        name: "Acte 1",
        color: "#FF715B",
        time: 12,
        value: 50
    },
    {
        name: "Acte 2",
        color: "#34D1BF",
        time: 20,
        value: 10
    },
    {
        name: "Acte 3",
        color: "#0496FF",
        time: 16,
        value: 80
    },
    {

        name: "Acte 4",
        color: "#6665DD",
        time: 40,
        value: 60
    },
    {
        name: "Acte 5",
        color: "#DE0D92",
        time: 30,
        value: 70
    }
];
const consultationData = [
    {
        name: "angina",
        color: "#FF715B",
        numbers: 154,
        value: 50
    },
    {
        name: "flu",
        color: "#34D1BF",
        numbers: 20,
        value: 10
    },
    {
        name: "respiratory_infections",
        color: "#0496FF",
        numbers: 16,
        value: 80
    },
    {

        name: "ecg",
        color: "#6665DD",
        numbers: 40,
        value: 60
    },
    {
        name: "migraine",
        color: "#DE0D92",
        numbers: 30,
        value: 70
    }
];
const consultationTypeData = [
    {
        name: "consultation",
        color: "#FF715B",
        numbers: 154,
        value: 50
    },
    {
        name: "apci",
        color: "#34D1BF",
        numbers: 20,
        value: 10
    },
    {
        name: "next",
        color: "#0496FF",
        numbers: 16,
        value: 80
    },
    {

        name: "check",
        color: "#6665DD",
        numbers: 40,
        value: 60
    },
    {
        name: "echo",
        color: "#DE0D92",
        numbers: 30,
        value: 70
    }
];
const countries = [
    {
        code: "tn",
        name: "Tunisie",
        value: 234
    },
    {
        code: "ly",
        name: "Libya",
        value: 145
    },
    {
        code: "ma",
        name: "Maroc",
        value: 145
    },
    {
        code: "dz",
        name: "Algerie",
        value: 45
    },
    {
        code: "fr",
        name: "France",
        value: 22
    }

]

function Statistics() {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const {t, ready, i18n} = useTranslation(["stats", "common"]);
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const [value, setValue] = React.useState(0);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [viewChart, setViewChart] = useState('month');
    const [fullChart, setFullChart] = useState<any>({"act": false, "motif": false});
    const [state, setState] = useState(
        {
            rdv_type: {
                view: "numbers",
                RDV_TYPE_OPTIONS: [
                    {value: "numbers", label: "Numbers", text: "Numbers", icon: NumberIcon, format: "N"}
                ],
            },
            act_by_rdv: {
                view: "duration",
                ACT_BY_RDV_OPTIONS: [
                    {value: "duration", label: "Duration", text: "Durée", icon: TimerIcon, format: "T"},
                ]
            },
            motif_by_consult: {
                view: "numbers",
                MOTIF_BY_CONSULT_OPTIONS: [
                    {value: "numbers", label: "Numbers", text: "Numbers", icon: NumberIcon, format: "N"}
                ]
            }


        }
    )
    const {rdv_type, act_by_rdv, motif_by_consult} = state
    const {data: statsAppointmentHttp} = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointment-stats/${router.locale}?format=${viewChart}`
    } : null, ReactQueryNoValidateConfig);

    const {data: statsPatientHttp} = useRequestQuery(medicalEntityHasUser ? {
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
        {value: "day", label: "Day", text: "Jour", icon: TodayIcon, format: "D"},
        {value: "week", label: "Weeks", text: "Semaine", icon: DayIcon, format: "wo"},
        {value: "month", label: "Months", text: "Mois", icon: WeekIcon, format: "MMM"}
    ];

    useEffect(() => {
        //reload locize resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["stats", "common"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    },
                }}>
                <StatsToolbar {...{handleChange, value}} />
            </SubHeader>
            <Box className="container">
                <TabPanel padding={.1} value={value} index={0}>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={2} height={1}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        flex: 1,
                                    }}>
                                    <CardContent sx={{pb: 0}}>
                                        <Stack spacing={2}>
                                            <IconUrl path={"stats/ic-calendar-card"}/>
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
                                    <CardContent sx={{pb: 0}}>
                                        <Stack spacing={2}>
                                            <IconUrl path={"stats/ic-document-card"}/>
                                            <Stack>
                                                <Typography fontWeight={700} fontSize={24} variant="subtitle1">
                                                    {appointmentPerPeriod[appointmentPerPeriod.length - 1]}
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
                        <Grid xs={12} item md={6}>
                            {(!fullChart.motif && !fullChart.act) &&
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        height: 1
                                    }}>
                                    <CardContent sx={{pb: 0}}>
                                        <Stack ml={2} direction={"row"} spacing={2} justifyContent={"space-between"}>
                                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                                {t("activity")}
                                            </Typography>
                                            <CalendarViewButton
                                                {...{t}}
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
                                                    {name: 'patients', data: patientPerPeriod.slice(-12)},
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
                                                    tooltip: {x: {show: false}, marker: {show: false}},
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
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5],
                                    height: 1
                                }}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={700}>{t("working_hours")}</Typography>
                                    <Stack direction='row' alignItems='center' mt={2}>
                                        <Stack width={1}>
                                            <Typography variant="h6" fontWeight={700}>
                                                9<Typography variant="caption" fontWeight={500}>h</Typography>
                                                {" "}
                                                35<Typography variant="caption" fontWeight={500}>min</Typography>
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {t("start_time")}
                                            </Typography>
                                        </Stack>
                                        <Stack width={1} pl={2} borderLeft={1} borderColor='divider'>
                                            <Typography variant="h6" fontWeight={700}>
                                                16<Typography variant="caption" fontWeight={500}>h</Typography>
                                                {" "}
                                                51<Typography variant="caption" fontWeight={500}>min</Typography>
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {t("end_time")}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <ChartStyled>
                                        <Chart
                                            type='bar'

                                            series={
                                                [
                                                    {
                                                        name: 'PRODUCT A',
                                                        data: [44, 55, 41, 67, 22, 43, 16]
                                                    }, {
                                                    name: 'PRODUCT B',
                                                    data: [13, 23, 20, 8, 13, 27, 14]
                                                }, {
                                                    name: 'PRODUCT C',
                                                    data: [11, 17, 15, 15, 21, 14, 12]
                                                }
                                                ]
                                            }
                                            options={merge(ChartsOption(), {
                                                chart: {
                                                    type: 'bar',
                                                    stacked: true,

                                                },
                                                plotOptions: {
                                                    bar: {
                                                        horizontal: false,
                                                        borderRadius: 3,
                                                        columnWidth: '30%',
                                                    },
                                                },
                                                xaxis: {
                                                    type: 'day',
                                                    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'
                                                    ],
                                                },

                                                fill: {
                                                    opacity: 1
                                                },
                                                legend: {
                                                    show: false
                                                }

                                            }) as any}
                                            height={240}
                                        />
                                    </ChartStyled>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5]
                                    }}>
                                    <CardContent>

                                        <Stack direction={{xs: 'column', md: 'row'}} alignItems={"center"}>
                                            <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                                <IconUrl path={"stats/ic-user-card"}/>
                                                <Stack>
                                                    <Typography fontWeight={600} fontSize={24} variant="caption">
                                                        {patientPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                                    </Typography>
                                                    <Typography fontSize={12} fontWeight={500} variant="body2">
                                                        {t("patients")}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack my={{xs: 2, md: 0}} px={{xs: 0, md: 2}} mr={{xs: 0, md: 2}}
                                                   direction={"row"} spacing={1.2} alignItems={"center"} width={1}
                                                   borderRight={{xs: 0, md: 1.5}} borderLeft={{xs: 0, md: 1.5}}
                                                   borderColor={{xs: 'transparent', md: 'divider'}}>
                                                <IconUrl path={"stats/ic-new-patients-card"}/>
                                                <Stack>
                                                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                        <Typography fontWeight={600} fontSize={24} variant="caption">
                                                            {patientPerPeriod[patientPerPeriod.length - 1]}
                                                        </Typography>

                                                        <Stack direction={"row"}>
                                                            <IconUrl path={"ic-up-right"}/>
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
                                                <IconUrl path={"stats/ic-waiting-hour-card"}/>
                                                <Stack>
                                                    <Stack direction={"row"} spacing={1} alignItems={"flex-end"}>
                                                        <Typography lineHeight={1} fontWeight={600} fontSize={24}
                                                                    variant="subtitle1">
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
                                            <Grid item xs={12} md={5}>
                                                <ChartStyled>
                                                    <Chart
                                                        type='donut'
                                                        series={
                                                            [65, 35]
                                                        }
                                                        options={

                                                            merge(ChartsOption(), {
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
                                                       justifyContent={{xs: 'center', md: 'stretch'}}
                                                       sx={{py: {xs: 2, md: 0}}}>
                                                    <Stack minWidth={60}>
                                                        <Typography fontWeight={700} color='primary' fontSize={28}
                                                                    variant="subtitle1">
                                                            65
                                                            <Typography fontSize={12} fontWeight={500}
                                                                        variant="caption">
                                                                %
                                                            </Typography>
                                                        </Typography>
                                                        <Typography fontSize={12} fontWeight={500} variant="body2">
                                                            {t("national")}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack pl={1} ml={1} borderLeft={1.5} borderColor={'divider'}>
                                                        <Typography fontWeight={700} color='warning.main' fontSize={28}
                                                                    variant="subtitle1">
                                                            35
                                                            <Typography fontSize={12} fontWeight={500}
                                                                        variant="caption">
                                                                %
                                                            </Typography>
                                                        </Typography>
                                                        <Typography fontSize={12} fontWeight={500} variant="body2">
                                                            {t("inter_national")}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <List>
                                                    {countries.map((country, idx) => (
                                                        <ListItem
                                                            key={idx}
                                                            disablePadding
                                                            sx={{pb: 1}}
                                                            secondaryAction={<Typography fontWeight={600}>
                                                                {country.value}
                                                            </Typography>}
                                                        >
                                                            <ListItemIcon sx={{minWidth: 45}}>
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
                                                            <ListItemText sx={{m: 0}} primary={country.name}/>
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
                            <Stack direction={{xs: "column", md: 'row'}} spacing={2} height={1}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        height: 1,
                                        width: 1
                                    }}>
                                    <CardContent>
                                        <Typography mb={7} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_age")}</Typography>
                                        <ChartStyled>
                                            <Chart
                                                type='donut'
                                                series={
                                                    [44, 55, 13, 43, 22]
                                                }
                                                options={
                                                    merge(ChartsOption(), {
                                                        dataLabels: {
                                                            enabled: true,

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
                                                                        show: false,

                                                                    },

                                                                }
                                                            },

                                                        },
                                                        legend: {
                                                            show: true,
                                                            formatter: (label: any, opts: {
                                                                w: { globals: { series: { [x: string]: any; }; }; };
                                                                seriesIndex: string | number;
                                                            }) => {
                                                                return opts.w.globals.series[opts.seriesIndex]
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
                                        <Typography mb={7} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_gender")}</Typography>
                                        <ChartStyled>
                                            <Chart
                                                type='donut'
                                                series={
                                                    [65, 35]
                                                }
                                                options={
                                                    merge(ChartsOption(), {
                                                        legend: {
                                                            show: false
                                                        },
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
                                        <Stack direction='row' alignItems='center' justifyContent='center' mt={2}>
                                            <Stack>
                                                <Typography fontWeight={700} color='warning.main' fontSize={28}
                                                            variant="subtitle1">
                                                    35
                                                    <Typography fontSize={12} fontWeight={500} variant="caption">
                                                        %
                                                    </Typography>
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("male")}
                                                </Typography>
                                            </Stack>
                                            <Stack pl={2} ml={2} borderLeft={1.5} borderColor={'divider'}>
                                                <Typography fontWeight={700} color='primary' fontSize={28}
                                                            variant="subtitle1">
                                                    65
                                                    <Typography fontSize={12} fontWeight={500} variant="caption">
                                                        %
                                                    </Typography>
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("female")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsProgressCard
                                {...{t, theme}}
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
                                subtitle={t("rdv_type")}
                                total={44}
                                icon={"stats/ic-acte-secpndaire"}
                                data={consultationTypeData}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsProgressCard {...{t, theme}}
                                               view={act_by_rdv.view}
                                               views={act_by_rdv.ACT_BY_RDV_OPTIONS}
                                               onSelect={(viewOption: string) => setState({
                                                   ...state,
                                                   act_by_rdv: {
                                                       ...act_by_rdv,
                                                       view: viewOption,
                                                   }
                                               })}
                                               data={actData}
                                               icon={"stats/ic-acte"}
                                               subtitle={t("act_per_visit")}
                                               total={8}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsProgressCard {...{t, theme}}
                                               view={motif_by_consult.view}
                                               views={motif_by_consult.MOTIF_BY_CONSULT_OPTIONS}
                                               onSelect={(viewOption: string) => setState({
                                                   ...state,
                                                   motif_by_consult: {
                                                       ...motif_by_consult,
                                                       view: viewOption,
                                                   }
                                               })}
                                               data={consultationData}
                                               icon={"stats/ic-stethoscope"}
                                               subtitle={t("reason")}
                                               total={44}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel padding={.1} value={value} index={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={2}>
                            <Stack spacing={2} height={1}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        flex: 1,
                                    }}>
                                    <CardContent sx={{pb: 0}}>
                                        <Stack spacing={2}>
                                            <IconUrl path={"stats/ic-calendar-card"}/>
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
                                    <CardContent sx={{pb: 0}}>
                                        <Stack spacing={2}>
                                            <IconUrl path={"stats/ic-document-card"}/>
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
                        <Grid item xs={12} md={6}>
                            {(!fullChart.motif && !fullChart.act) &&
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        height: 1
                                    }}>
                                    <CardContent sx={{pb: 0}}>
                                        <Stack ml={2} direction={"row"} spacing={2} justifyContent={"space-between"}>
                                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                                {t("activity")}
                                            </Typography>
                                            <CalendarViewButton
                                                {...{t}}
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
                                                    {name: 'patients', data: patientPerPeriod.slice(-12)},
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
                                                    tooltip: {x: {show: false}, marker: {show: false}},
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
                        <Grid item xs={12} md={4}>
                            <StatsProgressCard {...{t, theme}}
                                               view={motif_by_consult.view}
                                               views={motif_by_consult.MOTIF_BY_CONSULT_OPTIONS}
                                               onSelect={(viewOption: string) => setState({
                                                   ...state,
                                                   motif_by_consult: {
                                                       ...motif_by_consult,
                                                       view: viewOption,
                                                   }
                                               })}
                                               data={consultationData}
                                               icon={"stats/ic-stethoscope"}
                                               subtitle={t("reason")}
                                               total={44}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StatsProgressCard
                                {...{t, theme}}
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
                                subtitle={t("rdv_type")}
                                total={44}
                                icon={"stats/ic-acte-secpndaire"}
                                data={consultationTypeData}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StatsProgressCard {...{t, theme}}
                                               view={act_by_rdv.view}
                                               views={act_by_rdv.ACT_BY_RDV_OPTIONS}
                                               onSelect={(viewOption: string) => setState({
                                                   ...state,
                                                   act_by_rdv: {
                                                       ...act_by_rdv,
                                                       view: viewOption,
                                                   }
                                               })}
                                               data={actData}
                                               icon={"stats/ic-acte"}
                                               subtitle={t("act_per_visit")}
                                               total={8}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel padding={.3} value={value} index={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                            <Stack spacing={2} height={1}>
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5]
                                    }}>
                                    <CardContent>

                                        <Stack direction={{xs: 'column', md: 'row'}} alignItems={"center"}>
                                            <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                                <IconUrl path={"stats/ic-user-card"}/>
                                                <Stack>
                                                    <Typography fontWeight={600} fontSize={24} variant="caption">
                                                        {patientPerPeriod.reduce((total: number, val: number) => total + val, 0)}
                                                    </Typography>
                                                    <Typography fontSize={12} fontWeight={500} variant="body2">
                                                        {t("patients")}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack my={{xs: 2, md: 0}} px={{xs: 0, md: 2}} mr={{xs: 0, md: 2}}
                                                   direction={"row"} spacing={1.2} alignItems={"center"} width={1}
                                                   borderRight={{xs: 0, md: 1.5}} borderLeft={{xs: 0, md: 1.5}}
                                                   borderColor={{xs: 'transparent', md: 'divider'}}>
                                                <IconUrl path={"stats/ic-new-patients-card"}/>
                                                <Stack>
                                                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                        <Typography fontWeight={600} fontSize={24} variant="caption">
                                                            {patientPerPeriod[patientPerPeriod.length - 1]}
                                                        </Typography>

                                                        <Stack direction={"row"}>
                                                            <IconUrl path={"ic-up-right"}/>
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
                                                <IconUrl path={"stats/ic-waiting-hour-card"}/>
                                                <Stack>
                                                    <Stack direction={"row"} spacing={1} alignItems={"flex-end"}>
                                                        <Typography lineHeight={1} fontWeight={600} fontSize={24}
                                                                    variant="subtitle1">
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
                                <Card
                                    sx={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: theme.shadows[5],
                                        height: {xs: 'auto', md: '100%'}
                                    }}>
                                    <CardContent>
                                        <Typography mb={2} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_location")}</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={8}>
                                                <ChartStyled>
                                                    <Chart
                                                        type='donut'
                                                        series={
                                                            [65, 35]
                                                        }
                                                        options={

                                                            merge(ChartsOption(), {
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
                                                <Stack>
                                                    <Stack pb={1}>
                                                        <Typography fontWeight={700} color='primary' fontSize={56}
                                                                    variant="subtitle1">
                                                            65
                                                            <Typography fontSize={18} fontWeight={700}
                                                                        variant="caption">
                                                                %
                                                            </Typography>
                                                        </Typography>
                                                        <Typography fontSize={24} fontWeight={700} variant="body2">
                                                            {t("national")}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack borderTop={1.5} borderColor={'divider'}>
                                                        <Typography fontWeight={700} color='warning.main' fontSize={56}
                                                                    variant="subtitle1">
                                                            35
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
                                                <List>
                                                    {countries.map((country, idx) => (
                                                        <ListItem
                                                            key={idx}
                                                            disablePadding
                                                            sx={{pb: 1}}
                                                            secondaryAction={<Typography fontWeight={600}>
                                                                {country.value}
                                                            </Typography>}
                                                        >
                                                            <ListItemIcon sx={{minWidth: 45}}>
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
                                                            <ListItemText sx={{m: 0}} primary={country.name}/>
                                                        </ListItem>
                                                    ))}

                                                </List>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
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
                                            <Stack width={"33%"}>
                                                <Stack pb={1}>
                                                    <Typography fontWeight={700} color='warning.main' fontSize={28}
                                                                variant="subtitle1">
                                                        35
                                                        <Typography fontSize={12} fontWeight={500} variant="caption">
                                                            %
                                                        </Typography>
                                                    </Typography>
                                                    <Typography fontSize={12} fontWeight={500} variant="body2">
                                                        {t("male")}
                                                    </Typography>
                                                </Stack>
                                                <Stack borderTop={1.5} borderColor={'divider'}>
                                                    <Typography fontWeight={700} color='primary' fontSize={28}
                                                                variant="subtitle1">
                                                        65
                                                        <Typography fontSize={12} fontWeight={500} variant="caption">
                                                            %
                                                        </Typography>
                                                    </Typography>
                                                    <Typography fontSize={12} fontWeight={500} variant="body2">
                                                        {t("female")}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <ChartStyled>
                                                <Chart
                                                    type='donut'
                                                    series={
                                                        [65, 35]
                                                    }
                                                    options={
                                                        merge(ChartsOption(), {
                                                            legend: {
                                                                show: false
                                                            },
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
                                        <Typography mb={2} variant="subtitle1"
                                                    fontWeight={700}>{t("patient_by_age")}</Typography>
                                        <ChartStyled sx={{mb: 3}}>
                                            <Chart
                                                type='donut'
                                                series={
                                                    [44, 55, 13, 43, 22]
                                                }
                                                options={
                                                    merge(ChartsOption(), {
                                                        dataLabels: {
                                                            enabled: true,

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
                                                            show: true,
                                                            formatter: (label: any, opts: {
                                                                w: { globals: { series: { [x: string]: any; }; }; };
                                                                seriesIndex: string | number;
                                                            }) => {
                                                                return opts.w.globals.series[opts.seriesIndex]
                                                            },
                                                            horizontalAlign: 'center',

                                                        },

                                                        stroke: {
                                                            width: 0
                                                        }
                                                    } as any)

                                                }
                                                height={260}
                                            />
                                        </ChartStyled>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </TabPanel>
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
                                            <IconUrl path="stats/ic-start"/>
                                            <Stack width={1}>
                                                <Typography variant="h6" fontWeight={700}>
                                                    9<Typography variant="caption" fontWeight={500}>h</Typography>
                                                    {" "}
                                                    35<Typography variant="caption" fontWeight={500}>min</Typography>
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
                                            <IconUrl path="stats/ic-end"/>
                                            <Stack width={1}>
                                                <Typography variant="h6" fontWeight={700}>
                                                    16<Typography variant="caption" fontWeight={500}>h</Typography>
                                                    {" "}
                                                    51<Typography variant="caption" fontWeight={500}>min</Typography>
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
                                            type='bar'

                                            series={
                                                [
                                                    {
                                                        name: 'PRODUCT A',
                                                        data: [44, 55, 41, 67, 22, 43, 16]
                                                    }, {
                                                    name: 'PRODUCT B',
                                                    data: [13, 23, 20, 8, 13, 27, 14]
                                                }, {
                                                    name: 'PRODUCT C',
                                                    data: [11, 17, 15, 15, 21, 14, 12]
                                                }
                                                ]
                                            }
                                            options={merge(ChartsOption(), {
                                                chart: {
                                                    type: 'bar',
                                                    stacked: true,

                                                },
                                                plotOptions: {
                                                    bar: {
                                                        horizontal: false,
                                                        borderRadius: 3,
                                                        columnWidth: '10%',
                                                    },
                                                },
                                                xaxis: {
                                                    type: 'day',
                                                    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'
                                                    ],
                                                },

                                                fill: {
                                                    opacity: 1
                                                },
                                                legend: {
                                                    show: false
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
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
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
