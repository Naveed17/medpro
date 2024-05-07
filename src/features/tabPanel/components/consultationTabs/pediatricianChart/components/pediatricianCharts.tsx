import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, FormControlLabel, Grid, Stack, Typography, useTheme} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import moment from "moment/moment";
import {
    cranien36,
    height36,
    weight36
} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import {useGeneratePdfTemplate} from "@lib/hooks";
import {merge} from "lodash";
import {ChartsOption} from "@features/charts";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});

function PediatricianCharts({...props}) {
    const theme = useTheme();
    const {generatePdfTemplate} = useGeneratePdfTemplate();

    const [state, setState] = useState<any>({
        series: [],
        options: {
            chart: {
                id: "chart-growth",
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
            colors: [],
            markers: {
                size: [0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5]
            },
            stroke: {
                width: 2,
                dashArray: []
            },

        },
    });
    const [height, setHeight] = useState<boolean>(false);
    const [weight, setWeight] = useState<boolean>(true);
    const [perimetreCranien, setPerimetreCranien] = useState<boolean>(false);

    const {patient, sheet, birthdate, modelData, date, t} = props;


    useEffect(() => {
        let patientHeight: { x: number, y: number }[] = []
        let patientWeight: { x: number, y: number }[] = []
        let patientPC: { x: number, y: number }[] = []
        let series: any[] = [];
        let colors: string[] = []
        let dashArray: number[] = [];
        if (sheet && sheet.taille && height) {
            Object.keys(sheet.taille.data).forEach(date => {
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

            const nbMonth = moment(date, 'DD-MM-YYYY').diff(moment(birthdate, 'DD-MM-YYYY'), "months")

            if (modelData?.poids) {
                let df = patientWeight.find(w => w.x === nbMonth)
                if (df !== undefined)
                    df.y = modelData.poids
                else {
                    patientWeight.push({
                        x: patientWeight.find(w => w.x === nbMonth) ? nbMonth + 1 : nbMonth,
                        y: modelData.poids
                    })
                }
            }
            if (modelData?.taille) {
                let df = patientHeight.find(w => w.x === nbMonth)
                if (df !== undefined)
                    df.y = modelData.taille
                else {
                    patientHeight.push({
                        x: patientHeight.find(w => w.x === nbMonth) ? nbMonth + 1 : nbMonth,
                        y: modelData.taille
                    })
                }
            }
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
                    id: "chart-growth",
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
    }, [sheet, birthdate, height, weight, perimetreCranien]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Grid container spacing={1} marginBottom={2}>
            <Grid item xs={12}>
                <Card>
                    <Typography textAlign={"center"} variant={"subtitle1"} fontWeight={"bold"}
                                marginTop={1}>{t('pediatrician.growth')}</Typography>
                    <Typography textAlign={"center"} fontSize={12}
                                style={{opacity: 0.5}}>{t('pediatrician.3years')}</Typography>
                    <Stack direction={"row"} alignItems={"center"} paddingLeft={2} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
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
                        <Button
                            variant="text-black"
                            size={"small"}
                            sx={{
                                mr: 1,
                                border: `1px solid ${theme.palette.grey["200"]}`,
                                bgcolor: theme => theme.palette.grey['A500'],
                            }}
                            onClick={async (event) => {
                                event.stopPropagation();
                                await generatePdfTemplate(patient, sheet);
                            }}
                            startIcon={<IconUrl path="menu/ic-print" width={20} height={20}/>}>
                            {t("consultationIP.print")}
                        </Button>
                    </Stack>
                    <ApexChart
                        type="line"
                        options={merge(ChartsOption(), state.options)}
                        series={state.series}/>
                </Card>
            </Grid>
        </Grid>
    )
}

export default PediatricianCharts;
