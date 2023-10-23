import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {SubHeader} from "@features/subHeader";
import {Box, Card, CardContent, Grid, Typography, useTheme} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {StatsToolbar} from "@features/toolbar";
import {merge} from 'lodash';
import {ChartsOption, ChartStyled} from "@features/charts";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Statistics() {
    const theme = useTheme();

    const {t, ready} = useTranslation("stats");

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
                        <Grid item xs={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography sx={{mb: 4}} variant="subtitle1">
                                        Vues sur profil
                                    </Typography>
                                    <ChartStyled>
                                        <Chart
                                            type="area"
                                            series={[
                                                {name: 'series1', data: [31, 40, 28, 51, 42, 109, 100]},
                                            ]}
                                            options={merge(ChartsOption(), {
                                                xaxis: {
                                                    type: 'datetime',
                                                    categories: [
                                                        '2018-09-19T00:00:00.000Z',
                                                        '2018-09-19T01:30:00.000Z',
                                                        '2018-09-19T02:30:00.000Z',
                                                        '2018-09-19T03:30:00.000Z',
                                                        '2018-09-19T04:30:00.000Z',
                                                        '2018-09-19T05:30:00.000Z',
                                                        '2018-09-19T06:30:00.000Z'
                                                    ]
                                                },
                                                tooltip: {x: {format: 'dd/MM/yy HH:mm'}},
                                                grid: {
                                                    show: true,
                                                    borderColor: theme.palette.divider,
                                                    strokeDashArray: 0,
                                                    position: 'back',
                                                    xaxis: {
                                                        lines: {
                                                            show: true
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
                                            height={320}
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
