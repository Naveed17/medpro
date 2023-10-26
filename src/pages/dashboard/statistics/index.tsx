import React, {ReactElement, useEffect} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {SubHeader} from "@features/subHeader";
import {Box, Card, CardContent, Grid, Stack, Typography, useTheme} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {StatsToolbar} from "@features/toolbar";
import {merge} from 'lodash';
import {ChartsOption, ChartStyled} from "@features/charts";
import IconUrl from "@themes/urlIcon";
import {useSession} from "next-auth/react";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {toggleSideBar} from "@features/menu";
import {useAppDispatch} from "@lib/redux/hooks";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Statistics() {
    const theme = useTheme();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("stats");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    useEffect(() => {
        dispatch(toggleSideBar(true));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                <StatsToolbar/>
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{pb: 0}}>
                                    <Stack ml={2} direction={"row"} spacing={2}>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                            <IconUrl path={"ic-user3"}/>
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    1500
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    Patients
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                            <IconUrl path={"ic-user4"}/>
                                            <Stack>
                                                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                    <Typography fontWeight={600} fontSize={24} variant="caption">
                                                        900
                                                    </Typography>

                                                    <Stack direction={"row"}>
                                                        <IconUrl path={"ic-up-right"}/>
                                                        <Typography fontWeight={700} fontSize={14} color="success.main"
                                                                    variant="body2">4 % </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    Nouveaux patients
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>


                                    <ChartStyled>
                                        <Chart
                                            type="area"
                                            series={[
                                                {name: 'series1', data: [31, 40, 28, 51, 42, 109, 100]},
                                            ]}
                                            options={merge(ChartsOption(), {
                                                xaxis: {
                                                    position: "top",
                                                    categories: [
                                                        'Jan',
                                                        'Feb',
                                                        'Mar',
                                                        'Apr',
                                                        'May',
                                                        'Jun',
                                                        'Jul',
                                                        'Aug'
                                                    ]
                                                },
                                                tooltip: {x: {show: false}, marker: {show: false}},
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
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{pb: 0}}>
                                    <Stack ml={2} direction={"row"} spacing={2}>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                            <IconUrl width={40} height={40} path={"ic-document"}/>
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    3400
                                                </Typography>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    Motif Consultations
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <ChartStyled>
                                        <Chart
                                            type="bar"
                                            series={[{
                                                data: [400, 430, 448, 470]
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
                                                    categories: ['Motif 1', 'Motif 2', 'Motif 3', 'Motif 4'],
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
                                                            formatter: function () {
                                                                return ''
                                                            }
                                                        }
                                                    }
                                                }
                                            }) as any}
                                            height={240}
                                        />
                                    </ChartStyled>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{pb: 0}}>
                                    <Stack ml={2} direction={"row"} spacing={2}>
                                        <Stack direction={"row"} spacing={1.2}>
                                            <Stack>
                                                <Typography fontWeight={600} fontSize={24} variant="caption">
                                                    Revenue par acte
                                                </Typography>
                                                <Typography color={"text.backgound"} fontSize={12} fontWeight={500}
                                                            variant="body2">
                                                    Les revenus affichés en {devise}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <ChartStyled>
                                        <Chart
                                            type="bar"
                                            series={[{
                                                data: [1400, 5430, 8448, 22470]
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
                                                    categories: ['acte 1', 'acte 2', 'acte 3', 'acte 4'],
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
                                                            formatter: function () {
                                                                return ''
                                                            }
                                                        }
                                                    }
                                                }
                                            }) as any}
                                            height={240}
                                        />
                                    </ChartStyled>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: theme.shadows[5]
                                }}>
                                <CardContent sx={{pb: 0}}>
                                    <Stack ml={2} direction={"row"} spacing={2}>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                                            <IconUrl color={theme.palette.primary.main} width={40} height={40} path={"ic-payment"}/>
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
                        </Grid>
                    </Grid>
                </DesktopContainer>
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
