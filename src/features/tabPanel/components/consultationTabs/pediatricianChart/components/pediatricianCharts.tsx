import React, {useEffect, useState} from "react";
import {Card, Checkbox, FormControlLabel, Grid, Stack, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import moment from "moment/moment";
import {
    cranien36,
    height36,
    weight36
} from "@features/tabPanel/components/consultationTabs/pediatricianChart/chartData";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function PediatricianCharts({...props}) {


    const [state, setState] = useState<any>(null);
    const [height, setHeight] = useState<boolean>(false);
    const [weight, setWeight] = useState<boolean>(true);
    const [perimetreCranien, setPerimetreCranien] = useState<boolean>(false);

    const {sheet, birthdate, t} = props;
    useEffect(() => {
        let patientHeight: { x: number, y: number }[] = []
        let patientWeight: { x: number, y: number }[] = []
        let patientPC: { x: number, y: number }[] = []
        let series: any[] = [];
        let colors: string[] = []
        let dashArray: number[] = [];
        if (sheet && sheet.taille && height) {
            Object.keys(sheet.taille.data).map(date => {
                const nbMonth = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months");
                patientHeight.push({
                    x: patientHeight.find(w => w.x === nbMonth) ? nbMonth + 1 : nbMonth,
                    y: sheet.taille.data[date]
                })
            })

            series = [...series, ...height36, {
                name: t('pediatrician.size'),
                data: patientHeight
            }]
            colors = [...colors, '#a31f34', '#ea9999', '#ea9999', '#a31f34', '#076e67']
            dashArray = [...dashArray, 0, 3, 3, 0, 0]
        }
        if (sheet && sheet.poids && weight) {
            Object.keys(sheet.poids.data).map(date => {
                const nbMonth = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months")
                patientWeight.push({
                    x: patientWeight.find(w => w.x === nbMonth) ? nbMonth + 1 : nbMonth,
                    y: sheet.poids.data[date]
                })
            })
            series = [...series, ...weight36, {
                name: t('pediatrician.weight'),
                data: patientWeight
            }]
            colors = [...colors, '#3d85c6', '#9fc5e8', '#9fc5e8', '#3d85c6', '#cc0000']
            dashArray = [...dashArray, 0, 3, 3, 0, 0]
        }
        if (sheet && sheet.perimetreCranien && perimetreCranien) {
            Object.keys(sheet.perimetreCranien.data).map(date => {
                const nbMonth = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months")
                patientPC.push({
                    x: patientPC.find(w => w.x === nbMonth) ? nbMonth + 1 : nbMonth,
                    y: sheet.perimetreCranien.data[date]
                })
            })
            series = [...series, ...cranien36, {
                name: t('pediatrician.perimetreCranien'),
                data: patientPC
            }]
            colors = [...colors, '#009c6b', '#a2c4c9', '#a2c4c9', '#009c6b', '#ff8916']
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
                    size: [0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5]
                },
                stroke: {
                    width: 2,
                    dashArray
                },
            },
        })
    }, [sheet, birthdate, height, weight, perimetreCranien, t])

    return (
        <Grid container spacing={1} marginBottom={2}>
            <Grid item xs={12}>
                <Card>
                    <Typography textAlign={"center"} variant={"subtitle1"} fontWeight={"bold"}
                                marginTop={1}>{t('pediatrician.growth')}</Typography>
                    <Typography textAlign={"center"} fontSize={12}
                                style={{opacity: 0.5}}>{t('pediatrician.3years')}</Typography>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} paddingLeft={2}>
                        <Typography fontWeight={"bold"}>{t('pediatrician.filter')}</Typography>
                        <FormControlLabel control={<Checkbox checked={weight} onChange={(ev) => {
                            setWeight(ev.target.checked)
                        }}/>} label={t('pediatrician.weight')}/>
                        <FormControlLabel control={<Checkbox checked={height} onChange={(ev) => {
                            setHeight(ev.target.checked)
                        }}/>} label={t('pediatrician.size')}/>
                        <FormControlLabel control={<Checkbox checked={perimetreCranien} onChange={(ev) => {
                            setPerimetreCranien(ev.target.checked)
                        }}/>} label={t('pediatrician.perimetreCranien')}/>

                    </Stack>
                    {state && <ApexChart type="line"
                                         stroke={{
                                             curve: 'smooth',
                                             dashArray: 2,
                                             width: 1
                                         }}
                                         options={state.options}
                                         series={state.series}/>}
                </Card>
            </Grid>
        </Grid>
    )
}

export default PediatricianCharts;
