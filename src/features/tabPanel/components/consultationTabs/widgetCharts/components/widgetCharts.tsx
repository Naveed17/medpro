import React from "react";
import {Stack} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import {merge} from "lodash";
import {ChartsOption} from "@features/charts";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function WidgetCharts({...props}) {
    const {sheet, selectedKey} = props;

    const getCategories = () => {
        let res: string[] = [];
        sheet && Object.keys(sheet[selectedKey]?.data).map(val => res.push(val))
        return res
    }

    const getData = () => {
        let res: string[] = [];
        Object.keys(sheet[selectedKey].data).map(val => res.push(sheet[selectedKey].data[val]))
        return res
    }

    const getDesc = () => {
        let res: string[] = [];
        res.push(`${sheet[selectedKey].label} ${sheet[selectedKey].description ? `(${sheet[selectedKey].description})` : ''}`)
        return res
    }

    const chart = sheet && {
        option: {
            chart: {
                id: `chart-${selectedKey}`,
                toolbar: {
                    show: false
                }
            },
            xaxis: {
                categories: getCategories()
            },
            markers: {
                size: 5
            },
            stroke: {
                width: 2
            },
            color: "0696D6"
        }, series: [{
            name: `${getDesc()}`,
            data: getData()
        }]
    }

    return (
        <Stack spacing={1}>
            <ApexChart type="line"
                       options={merge(ChartsOption(), chart.option)}
                       series={chart.series}
                       height={200}
                       width={500}/>
        </Stack>
    )
}

export default WidgetCharts;
