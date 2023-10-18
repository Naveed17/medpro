import React from "react";
import {Stack} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function PediatricianCharts({...props}) {

    const state = {

        series: [
            {
                name: 'TEAM A',
                data: [2, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 26, 33, 38, 41]
            },
            {
                name: 'TEAM B',
                data: [3, 8, 10, 12, 13, 14, 15.5, 17, 18, 20, 21.5, 23, 25, 27, 31, 35.5, 42, 46, 49]
            },
            {
                name: 'Dashed',
                data: [3, 9, 11, 13, 15, 16, 17.5, 19, 21, 24, 26, 28, 31, 35, 39, 45, 50, 54, 56]
            },
            {
                name: 'TEAM B',
                data: [3, 10, 13, 14, 16, 18, 20, 22, 24.5, 27.5, 31, 33.5, 37, 41.5, 47.5, 54.5, 59, 61.5, 63]
            },

            {
                name: 'TEAM B',
                data: [3, 12, 15, 17, 19, 22, 25, 28, 31, 35, 39, 43, 49, 56, 65, 72, 76, 77, 78]
            },
            {
                name: 'Dashed',
                data: [3, 13, 16, 18, 21, 24, 27, 31, 35, 39, 43, 48, 55, 64, 74, 80.5, 84, 85, 85.5]
            }
        ],
        options: {
            chart:{
                height: 350,

            },
            dataLabels: {
                enabled: false
            },
            colors: ['#546E7A', '#2E93fA'],
            stroke: {
                width: 2,
                dashArray: [3,0,3, 0, 0,3]
            },
            xaxis: {
                categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            }
        },


    };

    return (
        <Stack spacing={1}>
            {

                <ApexChart type="line"
                           stroke={{
                               curve: 'smooth',
                               dashArray: 2,
                               width: 1,

                           }}
                           options={state.options}
                           series={state.series}/>

            }
        </Stack>
    )
}

export default PediatricianCharts;
