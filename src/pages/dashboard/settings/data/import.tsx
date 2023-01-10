import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {SubHeader} from "@features/subHeader";
import {
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    Stack,
    useTheme, AlertTitle, Alert, List, ListItem
} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import {FormikProvider, Form, useFormik} from "formik";
import {UploadFile} from "@features/uploadFile";
import {SettingsTabs} from "@features/tabPanel";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import Papa from "papaparse";
import {read, utils} from "xlsx";
import {CircularProgressbarCard} from "@features/card";
import {useSnackbar} from "notistack";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import dynamic from "next/dynamic";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {agendaSelector} from "@features/calendar";

const FileUploadProgress = dynamic(() => import("@features/fileUploadProgress/components/fileUploadProgress"));

const TabData = [
    {
        key: "med-pro",
        icon: "Med-logo_",
        label: "tabs.med",
        content: "tabs.content-1",
    },
/*    {
        key: "med-win",
        icon: <Box mt={1} width={64} height={24} component="img" src={"/static/img/logo-wide.png"}/>,
        label: "tabs.medWin",
        content: "tabs.content-2",
    },*/
    {
        key: "med-link",
        icon: "ic-upload",
        variant: "default",
        label: "tabs.file",
        content: "tabs.content-3",
    },
];

function ImportData() {
    const router = useRouter();
    const {data: session} = useSession();
    const {enqueueSnackbar} = useSnackbar();

    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerImportData} = useRequestMutation(null, "/import/data");

    const [loading, setLoading] = useState<boolean>(false);
    const [settingsTab, setSettingsTab] = useState({
        activeTab: null,
        loading: false
    });
    const [typeImport, setTypeImport] = useState([
        {label: "Patients", key: "1"},
        {label: "Toutes les données", key: "2"},
    ]);
    const [files, setFiles] = useState<any[]>([]);
    const [errorsImport, setErrorsImport] = useState<any[]>([]);
    const [fileLength, setFileLength] = useState(0);


    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "import-data"});

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            type: "",
            file: "",
            source: "med-pro",
            comment: ""
        },
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            handleImportData();
        },
    });

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
        setFileLength(0);
    };

    const handleOnDropFile = (acceptedFiles: File[]) => {
        // Passing CSV file data to parse using Papa.parse
        if (acceptedFiles[0].type === "text/csv") {
            Papa.parse(acceptedFiles[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    setFileLength(results.data.length);
                },
            });
        } else {
            // XLSX file
            const f = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e?.target?.result;
                let readedData = read(data, {type: 'binary'});
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                /* Convert array to json*/
                const dataParse = utils.sheet_to_json(ws, {header: 1});
                setFileLength(dataParse.length);
            };
            reader.readAsBinaryString(f)
        }
        setFiles([...files, ...acceptedFiles]);
    }

    const handleImportData = () => {
        setErrorsImport([]);
        setLoading(true);
        const params = new FormData();
        params.append('method', values.source);
        params.append('withAppointments', (values.source === "med-pro" && values.type === "2").toString());
        params.append('agenda', agendaConfig?.uuid as string);
        files.length > 0 && params.append('document', files[0]);

        triggerImportData({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/import/data/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then((value: any) => {
            if (value?.data.status === 'success') {
                enqueueSnackbar("Importing data in progress", {
                    persist: true,
                    preventDuplicate: true,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    },
                    content: (key, message) =>
                        <CircularProgressbarCard {...{t}} id={key} message={message}/>,
                });
                setLoading(false);
                localStorage.setItem("import-data", "true");
                setFiles([]);
                router.push('/dashboard/settings/data');
            }
        }, reason => {
            if (reason?.response.status === 400) {
                const errors = Object.entries(reason?.response.data.data).map(([key, value]: [string, any]) => ({
                    row: key,
                    data: value
                }));
                setErrorsImport(errors);
            }
            setLoading(false);
        });
    }

    const {
        values,
        handleSubmit,
        getFieldProps,
        setFieldValue
    } = formik;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <Typography>{t("path-import")}</Typography>
            </SubHeader>
            <Box className="container">
                <SettingsTabs
                    {...{t}}
                    data={TabData}
                    initIndex={0}
                    OnSelectTab={(index: number) => {
                        setFieldValue("source", TabData[index].key);
                    }}
                    getIndex={setSettingsTab}/>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card className="venue-card">
                            <CardContent>
                                {errorsImport.length > 0 && <Alert
                                    sx={{
                                        marginBottom: 1
                                    }}
                                    action={
                                        <LoadingButton
                                            {...{loading}}
                                            onClick={() => handleImportData()}
                                            variant={"contained"} color="error" size="small">
                                            {t('load-file')}
                                        </LoadingButton>
                                    }
                                    severity="error">
                                    <AlertTitle>{t("error.title")}</AlertTitle>
                                    {t("error.loading-error")}
                                    <List>
                                        {errorsImport.map((error, index) =>
                                            <ListItem key={index}>
                                                — <strong>{` ${error.data[0]} ${t("error.missing")} ${t("error.line")} ${error.row}, ${t("error.re-upload")}`}</strong>
                                            </ListItem>)}
                                    </List>

                                </Alert>}

                                {/* Layout */}
                                <Typography
                                    textTransform="uppercase"
                                    fontWeight={600}
                                    marginBottom={2}
                                    gutterBottom>
                                    {t("title")}
                                </Typography>
                                {settingsTab.activeTab === 0 && <Box mb={2} mt={2}>
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
                                </Box>}
                                {settingsTab.activeTab === 2 && <Box mb={6} mt={2}>
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
                                                {t("file-modele")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <a href={"/static/files/Med_fichier_modele.xlsx"} download>
                                                <Stack
                                                    sx={{
                                                        cursor: "pointer"
                                                    }}
                                                    justifyContent={"center"} alignItems={"center"}>

                                                    <Icon width={"80"} height={"80"} path={"ic-download"}/>
                                                    <Typography
                                                        variant={"body2"}>{t("file-modele-placeholder")}</Typography>
                                                </Stack>
                                            </a>
                                        </Grid>
                                    </Grid>
                                </Box>}
                                {settingsTab.activeTab !== 0 && <Box mb={2} mt={2}>
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
                                                    onDrop={handleOnDropFile}
                                                    accept={{
                                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".csv", ".xls"]
                                                    }}
                                                    singleFile
                                                    maxFiles={1}/>}

                                            <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                                                {files?.map((file: any, index: number) => (
                                                    <FileUploadProgress
                                                        {...{handleRemove}}
                                                        key={index}
                                                        file={file}
                                                        progress={100}
                                                    />
                                                ))}
                                                {fileLength > 0 &&
                                                    <Typography
                                                        variant={"body2"}>{`${t('file-length')} ${fileLength} ${t('file-process')}`}</Typography>}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>}
                                <LoadingButton
                                    {...{loading}}
                                    disabled={settingsTab.activeTab === 0 && values.type === "" ||
                                        settingsTab.activeTab !== 0 && files.length === 0}
                                    type={"submit"}
                                    sx={{
                                        marginTop: 4
                                    }} variant={"contained"} fullWidth>
                                    {t(settingsTab.activeTab !== 0 ? "load-file" : "load-data")}
                                </LoadingButton>
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
            "patient",
            "settings",
        ])),
    },
});

export default ImportData;

ImportData.auth = true;

ImportData.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
