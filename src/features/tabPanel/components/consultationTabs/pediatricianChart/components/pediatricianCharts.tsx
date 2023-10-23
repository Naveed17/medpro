import React, {useEffect, useState} from "react";
import {Card, Checkbox, FormControlLabel, Grid, Stack, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import moment from "moment/moment";
import {height36, weight36} from "@features/tabPanel/components/consultationTabs/pediatricianChart/chartData";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function PediatricianCharts({...props}) {


    const [state, setState] = useState<any>(null);
    const [height, setHeight] = useState<boolean>(true);
    const [weight, setWeight] = useState<boolean>(true);

    const {sheet, birthdate, t} = props;
    useEffect(() => {
        let patientHeight: { x: number, y: number }[] = []
        let patientWeight: { x: number, y: number }[] = []
        let series: any[] = [];
        let colors: string[] = []
        let dashArray: number[] = [];
        if (sheet && sheet.taille && height) {
            Object.keys(sheet.taille.data).map(date => {
                patientHeight.push({
                    x: moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months"),
                    y: sheet.taille.data[date]
                })
            })

            series = [...series, ...height36, {
                name: t('pediatrician.size'),
                data: patientHeight
            }]
            colors = [...colors, '#9fc5e8', '#D0E4E0', '#D0E4E0', '#9fc5e8', '#741b47']
            dashArray = [...dashArray, 0, 3, 3, 0, 0]
        }
        if (sheet && sheet.poids && weight) {
            Object.keys(sheet.poids.data).map(date => {
                patientWeight.push({
                    x: moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months"),
                    y: sheet.poids.data[date]
                })
            })
            series = [...series, ...weight36, {
                name: t('pediatrician.weight'),
                data: patientWeight
            }]
            colors = [...colors, '#3d85c6', '#ffe599', '#ffe599', '#3d85c6', '#cc0000']
            dashArray = [...dashArray, 0, 3, 3, 0, 0]

        }
        setState({
            series,
            options: {
                chart: {
                    height: 350,
                    toolbar: {
                        tools: {
                            download: true,
                            selection: false,
                            zoom: false,
                            zoomin: true,
                            zoomout: true,
                            pan: false,
                            reset: false,
                            customIcons: []
                        },
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                    }
                },
                dataLabels: {
                    enabled: false
                },
                colors,
                markers: {
                    size: [0, 0, 0, 0, 5, 0, 0, 0, 0, 5]
                },
                stroke: {
                    width: 2,
                    dashArray
                },
            },
        })
    }, [sheet, birthdate, height, weight, t])

    return (
        <Grid container spacing={1} marginBottom={2}>
            <Grid item xs={12}>
                {birthdate && state && state.series.length > 0 && <Card>
                    <Typography textAlign={"center"} variant={"subtitle1"} fontWeight={"bold"}
                                marginTop={1}>{t('pediatrician.growth')}</Typography>
                    <Typography textAlign={"center"} fontSize={12}
                                style={{opacity: 0.5}}>{t('pediatrician.3years')}</Typography>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} paddingLeft={2}>
                        <Typography fontWeight={"bold"}>{t('pediatrician.filter')}</Typography>
                        <FormControlLabel control={<Checkbox checked={weight} onChange={(ev) => {
                            if (ev.target.checked || height)
                                setWeight(ev.target.checked)
                        }}/>} label={t('pediatrician.weight')}/>
                        <FormControlLabel control={<Checkbox checked={height} onChange={(ev) => {
                            if (ev.target.checked || weight)
                                setHeight(ev.target.checked)
                        }}/>} label={t('pediatrician.size')}/>
                    </Stack>
                    {state && <ApexChart type="line"
                                         stroke={{
                                             curve: 'smooth',
                                             dashArray: 2,
                                             width: 1
                                         }}
                                         options={state.options}
                                         series={state.series}/>}
                </Card>}
            </Grid>
        </Grid>
    )
}

export default PediatricianCharts;
