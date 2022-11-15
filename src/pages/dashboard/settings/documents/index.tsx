import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DesktopContainer} from "@themes/desktopConainter";
import {Document as DocumentPDF, Page, pdfjs} from "react-pdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {useFormik} from "formik";
import dynamic from "next/dynamic";
import {PDFDocument, rgb, StandardFonts,} from 'pdf-lib';
import {SubHeader} from "@features/subHeader";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import WebViewer from '@pdftron/webviewer'
const ReportEditor = dynamic(() => import("@features/editor/editor"), {
    ssr: false,
});

function ConsultationType() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const [file, setFile] = useState('');
    const [docFile, setDocFile] = useState<any>('');
    const [numPages, setNumPages] = useState<number | null>(null);


    const formik = useFormik({
        children: undefined,
        component: undefined,
        initialErrors: undefined,
        initialTouched: undefined,
        innerRef: undefined,
        isInitialValid: undefined,

        onSubmit: async (values, {setErrors, setSubmitting}) => {
            return values;
        },

        enableReinitialize: true,
        initialValues: {
            name: "Dr",
            speciality: "",
            diplome: "",
            tel: "Tel: ",
            fax: "Fax: ",
            email: ""
        }
    })

    const {values, getFieldProps} = formik;

    const doc = new jsPDF({
        format: 'a5'
    });

    const modifyDoc = async () => {
        const url = '/static/files/cnam.pdf'
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Courier)

        const pages = pdfDoc.getPages()
        console.log(pages)
        const firstPage = pages[0]
        const {width, height} = firstPage.getSize()
        firstPage.setFont(helveticaFont)

        //Ref dossier
        firstPage.drawText('XXXXXXX', {x: width - 99, y: height - 106, size: 9})

        //Identifiant Unique
        let IUX = 290;
        let diff = 16;
        for (let i = 0; i < 10; i++) {
            firstPage.drawText(i.toString(), {x: width - IUX, y: height - 189, size: 10})
            IUX -= diff
            if (i > 5) diff = 15
        }

        //CNSS
        firstPage.drawText('X', {x: width - 289, y: height - 212, size: 9})

        //CNRPS
        firstPage.drawText('X', {x: width - 212, y: height - 212, size: 9})

        //Bilaterale
        firstPage.drawText('X', {x: width - 82, y: height - 212, size: 9})

        //LastName
        firstPage.drawText('Foulen', {x: width - 337, y: height - 249, size: 9})

        //FirstName
        firstPage.drawText('Ben foulen', {x: width - 345, y: height - 269, size: 9})

        //Adresse
        const adress = '13th Street. 47 W 13th St, New York, NY 10011, USA. 20 Cooper Square. 20 Cooper Square, New York.' //, NY 10003, USA. 2nd Street Dorm.
        firstPage.drawText(adress.substring(0, 45), {x: width - 338, y: height - 286, size: 9})
        firstPage.drawText(adress.substring(45, adress.length), {x: width - 369, y: height - 304, size: 9})

        //CONSULTATIONS ET ACTES DE SOINS DENTAIRES
        const form = pdfDoc.getForm()

        //Date
        let yPOS =  height - 113;
        for (let i = 0; i < 6; i++) {
            const textField = form.createTextField(`date${i}`)
            textField.addToPage(firstPage, {
                x: width - 784,
                y: yPOS,
                width: 42,
                height: 10,
                backgroundColor: rgb(1, 1, 1),
                borderWidth: 0
            })
            yPOS-= 23
        }

        //DENT
        yPOS =  height - 113;
        for (let i = 0; i < 6; i++) {
            const textField = form.createTextField(`dent${i}`)
            textField.addToPage(firstPage, {
                x: width - 736,
                y: yPOS,
                width: 20,
                height: 10,
                backgroundColor: rgb(1, 1, 1),
                borderWidth: 0
            })
            yPOS-= 23
        }

        //CODE ACTE
        yPOS =  height - 113;
        for (let i = 0; i < 6; i++) {
            const textField = form.createTextField(`act${i}`)
            textField.addToPage(firstPage, {
                x: width - 707,
                y: yPOS,
                width: 78,
                height: 10,
                backgroundColor: rgb(1, 1, 1),
                borderWidth: 0
            })
            yPOS-= 23
        }

        //END OF CONSULTATIONS ET ACTES DE SOINS DENTAIRES
        const pdfBytes = await pdfDoc.saveAsBase64({
            dataUri: true
        })
        setDocFile(pdfBytes)

    }

    const download = () => {
        if (docFile) {
            fetch(docFile).then(response => {
                response.blob().then(blob => {
                    const fileURL = window.URL.createObjectURL(blob);
                    // Setting various property values
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    alink.download = file.split(/(\\|\/)/g).pop() as string
                    alink.click();
                })
            })
        }
    }

/*
    useEffect(() => {
        autoTable(doc, {
            html: '#header',
            useCss: true
        })

        // const pageCount = doc.internal.getNumberOfPages()

        doc.setLanguage('ar-SA')
        doc.text('ربك تكست ', 1, 20)

        doc.processArabic("ربك تكست")
        doc.setFont('trado');

        var arabic = 'مرحبا';
        var arabic_with_diacritics = 'مَرْحَبًا';

        doc.setFontSize(40);

        doc.text(arabic, 200, 40, {align: 'right'});
        doc.text(arabic_with_diacritics, 200, 80, {align: 'right'});

        doc.html('<div style="font-size: 5px">ربك تكست هو  العربي </div>', {
            callback: function (doc) {
                const uri = doc.output('bloburi').toString()
                setFile(uri)
            },
            x: 10,
            y: doc.internal.pageSize.height - 30
        })
        const uri = doc.output('bloburi').toString()
        setFile(uri)

    }, [values])// eslint-disable-line react-hooks/exhaustive-deps
*/

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    const {t, ready} = useTranslation(["settings", "common"], {
        keyPrefix: "documents.config",
    });

    if (!ready) return <>loading translations...</>;


    return (

        <>
            <SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography color="text.primary">{t("path")}</Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {

                        }}
                        sx={{ml: "auto"}}>
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <DesktopContainer>
                <Box
                    sx={{
                        p: {xs: "40px 8px", sm: "30px 8px", md: 2},
                        "& table": {tableLayout: "fixed"},
                    }}>

                    <Button onClick={modifyDoc}>OKOKOKOKOKOKOKOKOKOKOKOK</Button>
                    <Button onClick={download}>Download</Button>

                    <Grid container spacing={2}>
                        {/*<Grid item md={0}>

                                <Typography
                                    variant="body1"
                                    fontWeight={400}
                                    margin={"16px 0"}
                                    gutterBottom>
                                    {t("header")}
                                </Typography>
                                <ReportEditor/>

                                <Card>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("name")}
                                                    required
                                                    {...getFieldProps("name")}
                                                    fullWidth/>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("tel")}
                                                    required
                                                    {...getFieldProps("tel")}
                                                    fullWidth/>
                                            </Stack>
                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("speciality")}
                                                    required
                                                    {...getFieldProps("speciality")}
                                                    fullWidth/>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("fax")}
                                                    {...getFieldProps("fax")}
                                                    required
                                                    fullWidth/>
                                            </Stack>
                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("name")}
                                                    required
                                                    {...getFieldProps("diplome")}
                                                    fullWidth/>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("email")}
                                                    required
                                                    {...getFieldProps("email")}
                                                    fullWidth/>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>*/}
                        <Grid item md={12}>
                            <DocumentPDF file={docFile} onLoadSuccess={onDocumentLoadSuccess}>
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Page key={`page_${index + 1}`} pageNumber={index + 1}/>
                                ))}
                            </DocumentPDF>
                        </Grid>
                    </Grid>
                </Box>
            </DesktopContainer>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings",
        ])),
    },
});
export default ConsultationType;

ConsultationType.auth = true;

ConsultationType.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
