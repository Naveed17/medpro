import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Checkbox, FormControlLabel, Grid, Stack, Typography, useTheme} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import dynamic from "next/dynamic";
import moment from "moment/moment";
import {
    sizeBoy,
    sizeGirl,
    weightBoy,
    weightGirl
} from "@features/tabPanel/components/consultationTabs/pediatrician18Chart/chartData";
import IconUrl from "@themes/urlIcon";
import {PDFDocument, rgb} from "pdf-lib";
import fontkit from '@pdf-lib/fontkit';
import {merge} from "lodash";
import {ChartsOption} from "@features/charts";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});

function Pediatrician18Charts({...props}) {
    const theme = useTheme();

    const [state, setState] = useState<any>(null);
    const [height, setHeight] = useState<boolean>(false);
    const [weight, setWeight] = useState<boolean>(true);

    const {patient, sheet, birthdate, gender, modelData, date, t} = props;

    const generatePdfTemplate = async () => {
        // init doc
        const pdfDoc = await PDFDocument.create();
        //init font kit
        pdfDoc.registerFontkit(fontkit);
        //load font and embed it to pdf document
        const fontBytes = await fetch("/static/fonts/KidsBoys/KidsBoys.otf").then((res) => res.arrayBuffer());
        const customFont = await pdfDoc.embedFont(fontBytes);
        // load template pdf
        const docFile = await fetch("/static/files/bebe-templete-pink.pdf").then((res) => res.arrayBuffer());
        const templatePdfDoc = await PDFDocument.load(docFile);
        const pinkColor = rgb(0.9450980392156862, 0.4470588235294118, 0.6);
        const copiedPages = await pdfDoc.copyPages(templatePdfDoc, templatePdfDoc.getPageIndices());
        // ApexCharts export chart image
        ApexCharts.exec("chart-growth", "dataURI").then(async ({imgURI}: any) => {
            console.log(imgURI);
            const chartGrowthBytes = await fetch(imgURI).then((res) => res.arrayBuffer())
            console.log("chartGrowthBytes", imgURI, chartGrowthBytes)
            const chartGrowth = await pdfDoc.embedPng(chartGrowthBytes);
            const chartGrowthDims = chartGrowth.scale(0.35);
            copiedPages[0].drawImage(chartGrowth, {
                x: 420,
                y: 68,
                width: chartGrowthDims.width,
                height: chartGrowthDims.height,
            })
            // draw bebe coordination
            copiedPages[0].drawText('Je m\'appelle', {
                x: 115,
                y: 344,
                size: 12,
                font: customFont,
                color: pinkColor
            })
            console.log("patient", patient);
            copiedPages[0].drawText(`${patient.firstName} ${patient.lastName}`, {
                x: 170,
                y: 344,
                size: 16,
                font: customFont,
                color: pinkColor
            })
            copiedPages[0].drawText(`née le ${birthdate}`, {
                x: 134,
                y: 326,
                size: 12,
                font: customFont,
                color: pinkColor
            })
            copiedPages[0].drawText(`Ma Maman Salma & Mon Papa Sélim`, {
                x: 110,
                y: 310,
                size: 12,
                font: customFont,
                color: pinkColor
            })
            // Draw bebe First acts
            copiedPages[0].drawText(patient.firstName, {
                x: 354,
                y: 512,
                size: 16,
                font: customFont,
                color: pinkColor
            })
            copiedPages[0].drawText('13 / 06 / 2023', {
                x: 396,
                y: 480,
                size: 12,
                font: customFont,
                color: pinkColor
            })
            // Draw bebe poid/taille
            const weight = Object.values(sheet.poids.data).slice(-1)[0] as string;
            copiedPages[0].drawText(`${weight} Kg`, {
                x: 98,
                y: 240,
                size: 14,
                font: customFont,
                color: pinkColor
            })

            const size = Object.values(sheet.taille.data).slice(-1)[0]?.toString();
            copiedPages[0].drawText(`${size?.slice(-3, 1) ?? "0"} m ${size?.slice(-2)}`, {
                x: 216,
                y: 240,
                size: 14,
                font: customFont,
                color: pinkColor
            })
            // Draw bebe eye color
            copiedPages[0].drawCircle({
                x: 91.2,
                y: 58.8,
                size: 2.6,
                color: pinkColor
            })

            // Add page tok pdf file
            pdfDoc.addPage(copiedPages[0]);
            // Save as base64
            const mergedPdf = await pdfDoc.saveAsBase64();
            // Dynamic import print-js and print file
            const printJS = (await import('print-js')).default
            printJS({printable: mergedPdf, type: 'pdf', base64: true})
        });
    }

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
                    id: "chart-growth",
                    height: 350,
                    //fontFamily: "KidsBoys",
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
                    <Stack direction={"row"} alignItems={"center"} paddingLeft={2} justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                            <Typography fontWeight={"bold"}>{t('pediatrician.filter')}</Typography>
                            <FormControlLabel control={<Checkbox checked={weight} onChange={(ev) => {
                                setWeight(ev.target.checked)
                            }}/>} label={t('pediatrician.weight')}/>
                            <FormControlLabel control={<Checkbox checked={height} onChange={(ev) => {
                                setHeight(ev.target.checked)
                            }}/>} label={t('pediatrician.size')}/>
                        </Stack>

                        {state && <Button
                            variant="text-black"
                            size={"small"}
                            sx={{
                                mr: 1,
                                border: `1px solid ${theme.palette.grey["200"]}`,
                                bgcolor: theme => theme.palette.grey['A500'],
                            }}
                            onClick={async (event) => {
                                event.stopPropagation();
                                await generatePdfTemplate();
                            }}
                            startIcon={<IconUrl path="menu/ic-print" width={20} height={20}/>}>
                            {t("consultationIP.print")}
                        </Button>}
                    </Stack>
                    {state && <ApexChart
                        type="line"
                        options={merge(ChartsOption(), state.options)}
                        series={state.series}/>}
                </Card>
            </Grid>
        </Grid>
    )
}

export default Pediatrician18Charts;
