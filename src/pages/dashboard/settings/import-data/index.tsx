import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {SubHeader} from "@features/subHeader";
import {
    Typography,
    Box, TextField, Card, CardContent, Grid, MenuItem, Select, Stack
} from "@mui/material";
import {useAppDispatch} from "@app/redux/hooks";
import {LoadingScreen} from "@features/loadingScreen";
import {FormikProvider, Form, useFormik} from "formik";
import {UploadFile} from "@features/uploadFile";
import {FileuploadProgress} from "@features/fileUploadProgress";

function ImportData() {
    const dispatch = useAppDispatch();

    const [typeImport, setTypeImport] = useState([
        {label: "Patients", key: "1"},
        {label: "Rendez-vous", key: "2"},
        {label: "Toutes les données", key: "3"},
    ]);
    const [softwareImport, setSoftwareImport] = useState([
        {label: "Med", key: "1"},
        {label: "MedWin", key: "2"}
    ]);
    const [files, setFiles] = useState<any[]>([]);

    const {t, ready} = useTranslation("settings", {keyPrefix: "import-data"});

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            type: "",
            file: "",
            software: "",
            comment: ""
        },
        onSubmit: async (values, {setErrors, setSubmitting}) => {

        },
    });

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
    };

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm
    } = formik;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    console.log(values);

    return (
        <>
            <SubHeader>
                <Typography>{t("path")}</Typography>
            </SubHeader>
            <Box className="container">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Typography
                            textTransform="uppercase"
                            fontWeight={600}
                            marginBottom={2}
                            gutterBottom>
                            {t("tittle")}
                        </Typography>
                        <Card className="venue-card">
                            <CardContent>
                                <Box mb={2}>
                                    <Grid
                                        container
                                        spacing={{lg: 2, xs: 1}}
                                        alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography
                                                textAlign={{lg: "right", xs: "left"}}
                                                color="text.secondary"
                                                variant="body2"
                                                fontWeight={400}>
                                                {t("type")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <Select
                                                fullWidth
                                                id={"type"}
                                                size="small"
                                                {...getFieldProps("type")}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (selected?.length === 0) {
                                                        return <em>{t(`type-placeholder`)}</em>;
                                                    }
                                                    const type = typeImport?.find(type => type.key === selected);
                                                    return (<Typography>{type?.label}</Typography>);
                                                }}
                                            >
                                                {typeImport.map(type => (<MenuItem
                                                    key={type.key}
                                                    value={type.key}>{type.label}</MenuItem>))}
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Grid
                                        container
                                        spacing={{lg: 2, xs: 1}}
                                        alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography
                                                textAlign={{lg: "right", xs: "left"}}
                                                color="text.secondary"
                                                variant="body2"
                                                fontWeight={400}>
                                                {t("software")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <Select
                                                fullWidth
                                                id={"software"}
                                                size="small"
                                                {...getFieldProps("software")}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (selected?.length === 0) {
                                                        return <em>{t(`software-placeholder`)}</em>;
                                                    }
                                                    const software = softwareImport?.find(type => type.key === selected);
                                                    return (<Typography>{software?.label}</Typography>);
                                                }}
                                            >
                                                {softwareImport.map(type => (<MenuItem
                                                    key={type.key}
                                                    value={type.key}>{type.label}</MenuItem>))}
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Grid
                                        container
                                        spacing={{lg: 2, xs: 1}}
                                        alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography
                                                textAlign={{lg: "right", xs: "left"}}
                                                color="text.secondary"
                                                variant="body2"
                                                fontWeight={400}>
                                                {t("file")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>

                                            {files.length === 0 &&
                                                <UploadFile
                                                    files={files}
                                                    onDrop={(acceptedFiles: File[]) => {
                                                        setFiles([...files, ...acceptedFiles]);
                                                    }}
                                                    accept={".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}
                                                    singleFile/>}

                                            <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                                                {files?.map((file: any, index: number) => (
                                                    <FileuploadProgress
                                                        {...{handleRemove}}
                                                        key={index}
                                                        file={file}
                                                        progress={100}
                                                    />
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Form>
                </FormikProvider>
            </Box>
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

export default ImportData;

ImportData.auth = true;

ImportData.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
