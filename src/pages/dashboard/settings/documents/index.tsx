import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {Box, Button, Card, CardContent, Grid, Stack, TextField, Typography,} from "@mui/material";
import {useTranslation} from "next-i18next";
import {SubHeader} from "@features/subHeader";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DesktopContainer} from "@themes/desktopConainter";
import {Document as DocumentPDF, Page, pdfjs} from "react-pdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Header} from "@features/files";
import {useFormik} from "formik";
import dynamic from "next/dynamic";

const ReportEditor = dynamic(() => import("@features/reportEditor/reportEditor"), {
    ssr: false,
});

function ConsultationType() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const [file, setFile] = useState('');
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


    useEffect(() => {
        autoTable(doc, {
            html: '#header',
            useCss: true
        })

        // const pageCount = doc.internal.getNumberOfPages()

        doc.html('<div style="font-size: 5px">ربك تكست هو اول موقع يسمح لزواره الكرام بتحويل الكتابة العربي الى كتابة مفهومة من قبل اغلب برامج التصميم مثل الفوتوشوب و ا</div>', {
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


                    <Header {...values}></Header>
                    <Grid container spacing={2}>
                        <Grid item md={8}>

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
                        </Grid>
                        <Grid item md={4}>
                            <DocumentPDF file={file} onLoadSuccess={onDocumentLoadSuccess}>
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
