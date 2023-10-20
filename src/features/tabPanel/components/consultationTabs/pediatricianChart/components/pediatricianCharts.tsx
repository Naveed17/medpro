import React, {useEffect, useState} from "react";
import {Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, Stack, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import moment from "moment/moment";
import {height36, weight36} from "@features/tabPanel/components/consultationTabs/pediatricianChart/chartData";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function PediatricianCharts({...props}) {


    const [state, setState] = useState<any>(null);
    const [height, setHeight] = useState<boolean>(false);
    const [weight, setWeight] = useState<boolean>(true);

    const {sheet, birthdate} = props;
    useEffect(() => {
        let patientHeight: { x: number, y: number }[] = []
        let patientWeight: { x: number, y: number }[] = []
        let series: any[] = [];
        let colors:string[]=[]
        if (sheet && sheet.taille && height) {
            Object.keys(sheet.taille.data).map(date => {
                patientHeight.push({
                    x: moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months"),
                    y: sheet.taille.data[date]
                })
            })

            series = [...series, ...height36, {
                name: 'taille',
                data: patientHeight
            }]
            colors = [...colors,'#9fc5e8', '#D0E4E0', '#D0E4E0', '#9fc5e8', '#741b47']
        }
        if (sheet && sheet.poids && weight) {
            Object.keys(sheet.poids.data).map(date => {
                patientWeight.push({
                    x: moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months"),
                    y: sheet.poids.data[date]
                })
            })
            series = [...series, ...weight36, {
                name: 'poids',
                data: patientWeight
            }]
            colors = [...colors,'#3d85c6', '#ffe599', '#ffe599', '#3d85c6', '#cc0000']

        }
        setState(
            {
                series,
                options: {
                    chart: {
                        height: 350,
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
                        dashArray: [0, 3, 3, 0]//[3, 0, 3, 0, 3, 0, 3]
                    },
                    /*yaxis: {
                        min: 30,
                        max: 115,
                        tickAmount: 17
                    }*/
                },
            }
        )
    }, [sheet, birthdate, height, weight])

    return (
        <Grid container spacing={1} marginBottom={2}>
            <Grid item xs={10}>
                <Card>
                    <Typography textAlign={"center"} variant={"subtitle1"} fontWeight={"bold"} marginTop={1}>Croissance</Typography>
                    <Typography textAlign={"center"} marginBottom={2} fontSize={12} style={{opacity:0.5}}>des filles et des garçons de la naissance à 3ans</Typography>
                    {state && <ApexChart type="line"
                                         stroke={{
                                             curve: 'smooth',
                                             dashArray: 2,
                                             width: 1,

                                         }}
                                         options={state.options}
                                         series={state.series}/>}
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography>Filter</Typography>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={weight} onChange={(ev) => {
                                    setWeight(ev.target.checked)
                                }}/>} label="Poids"/>
                                <FormControlLabel control={<Checkbox checked={height} onChange={(ev) => {
                                    setHeight(ev.target.checked)
                                }}/>} label="Taille"/>
                            </FormGroup>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default PediatricianCharts;
