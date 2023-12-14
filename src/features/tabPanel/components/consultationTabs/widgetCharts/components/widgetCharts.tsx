import React from "react";
import {Card, Grid, Stack, useMediaQuery} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import {Label} from "@features/label";
import {MobileContainer as smallScreen} from "@lib/constants";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function WidgetCharts({...props}) {

    const {
        sheet,
        mini
    } = props;

    let data: any[] = [];
    const isMobile = useMediaQuery(`(max-width:${smallScreen}px)`);

    const getCategories = (key: string) => {
        let res: string[] = [];
        Object.keys(sheet[key].data).map(val => res.push(val))
        return res
    }

    const getData = (key: string) => {
        let res: string[] = [];
        Object.keys(sheet[key].data).map(val => res.push(sheet[key].data[val]))
        return res
    }

    const getDesc = (key: string) => {
        let res: string[] = [];
        res.push(`${sheet[key].label} ${sheet[key].description ? `(${sheet[key].description})`:''}`)
        return res
    }

    sheet && Object.keys(sheet).map(key => {
        data.push({
            option: {
                chart: {
                    id: `chart-${key}`,
                    toolbar: {
                        show: false
                    }
                },
                xaxis: {
                    categories: getCategories(key)
                },
                markers: {
                    size: 5
                },
                stroke: {
                    width: 2
                },
                color:"0696D6"
            }, series: [{
                name: `${getDesc(key)}`,
                data: getData(key)
            }]
        })
    });
console.log(data)
    return (
        <Stack spacing={1}>
            <Grid container spacing={1} marginBottom={2}>
                {
                    data.filter(chart => chart.series[0].data.length > 1).map((chart, index) => (
                        <Grid item key={`chart-${index}`} xs={mini ||isMobile ? 12 : 6}>
                            <Stack>
                                <Stack spacing={2} mb={2} alignItems="flex-start">
                                    <Label variant="filled" color="warning">
                                        {chart.series[0].name}
                                    </Label>
                                </Stack>
                                <Card style={{paddingRight: 2}}>
                                    <ApexChart type="line" options={chart.option} series={chart.series} height={200}
                                               width={500}/>
                                </Card>
                            </Stack>
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default WidgetCharts;
