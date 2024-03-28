import React, {useEffect, useState} from "react";
import {Card, Checkbox, FormControlLabel, Grid, Stack, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import moment from "moment/moment";
import {
    sizeBoy,
    sizeGirl,
    weightBoy,
    weightGirl
} from "@features/tabPanel/components/consultationTabs/pediatrician18Chart/chartData";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});


function Pediatrician18Charts({...props}) {


    const [state, setState] = useState<any>(null);
    const [height, setHeight] = useState<boolean>(false);
    const [weight, setWeight] = useState<boolean>(true);

    const {sheet, birthdate, gender, modelData, date, t} = props;

    useEffect(() => {
        let patientHeight: { x: number, y: number }[] = []
        let patientWeight: { x: number, y: number }[] = []
        let series: any[] = [];
        let colors: string[] = []
        let dashArray: number[] = [];

        if (sheet && sheet.taille && height) {
            Object.keys(sheet.taille.data).map(date => {
                const nbYear = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "years")
                let item = patientHeight.find(w => w.x === nbYear);
                if (item) item.y = sheet.taille.data[date]
                else
                    patientHeight.push({
                        x: nbYear,
                        y: sheet.taille.data[date]
                    })
            })

            series = [...series, ...(gender === "F" ? sizeGirl : sizeBoy), {
                name: t('pediatrician.size'),
                data: patientHeight
            }]
            colors = [...colors, '#a31f34', '#ea9999', '#ea9999', '#a31f34', '#076e67']
            dashArray = [...dashArray, 0, 3, 3, 0, 0]
        }

        if (sheet && sheet.poids && weight) {
            Object.keys(sheet.poids.data).map((date: string) => {
                const nbYear = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "years")
                let item = patientWeight.find(w => w.x === nbYear);
                if (nbYear > 0) {
                    if (item)
                        item.y = sheet.poids.data[date]
                    else
                        patientWeight.push({
                            x: nbYear,
                            y: sheet.poids.data[date]
                        })
                }
            })
            const nbYear = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "years")

            if (modelData?.poids) {
                let df = patientWeight.find(w => w.x === nbYear)
                if (df !== undefined)
                    df.y = modelData.poids
                else {
                    patientWeight.push({
                        x: patientWeight.find(w => w.x === nbYear) ? nbYear + 1 : nbYear,
                        y: modelData.poids
                    })
                }
            }
            if (modelData?.taille) {
                let df = patientHeight.find(w => w.x === nbYear)
                if (df !== undefined)
                    df.y = modelData.taille
                else {
                    patientHeight.push({
                        x: patientHeight.find(w => w.x === nbYear) ? nbYear + 1 : nbYear,
                        y: modelData.taille
                    })
                }
            }

            series = [...series, ...(gender === "F" ? weightGirl : weightBoy), {
                name: t('pediatrician.weight'),
                data: patientWeight
            }]
            colors = [...colors, '#3d85c6', '#9fc5e8', '#9fc5e8', '#3d85c6', '#cc0000']
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
                legend: {
                    verticalAlign: "center",
                    position: 'right'
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

    }, [sheet, birthdate, height, weight, t]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Grid container spacing={1} marginBottom={2}>
            <Grid item xs={12}>
                <Card>
                    <Typography textAlign={"center"}
                                variant={"subtitle1"}
                                fontWeight={"bold"}
                                marginTop={1}>
                        {`${t('pediatrician.growth')} ${t(`pediatrician.${gender === "F" ? "girl" : "boy"}`)}`}
                    </Typography>
                    <Typography textAlign={"center"} fontSize={12}
                                style={{opacity: 0.5}}>{t('pediatrician.18years')}</Typography>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} paddingLeft={2}>
                        <Typography fontWeight={"bold"}>{t('pediatrician.filter')}</Typography>
                        <FormControlLabel control={<Checkbox checked={weight} onChange={(ev) => {
                            setWeight(ev.target.checked)
                        }}/>} label={t('pediatrician.weight')}/>
                        <FormControlLabel control={<Checkbox checked={height} onChange={(ev) => {
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
                </Card>
            </Grid>
        </Grid>
    )
}

export default Pediatrician18Charts;
