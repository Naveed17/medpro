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
    useTheme,
    DialogActions,
    Button,
    Alert,
    AlertTitle,
    Collapse,
    List, ListItemText, ListItem
} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import {FormikProvider, Form, useFormik} from "formik";
import {UploadFile} from "@features/uploadFile";
import {FileuploadProgress} from "@features/fileUploadProgress";
import {SettingsTabs} from "@features/tabPanel";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import Papa from "papaparse";
import {read, utils} from "xlsx";
import {CircularProgressbarCard} from "@features/card";
import {useSnackbar} from "notistack";
import {Dialog} from "@features/dialog";
import {DuplicateDetected, duplicatedSelector, resetDuplicated} from "@features/duplicateDetected";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";

const TabData = [
    {
        key: "med",
        icon: "Med-logo_",
        label: "tabs.med",
        content: "tabs.content-1",
    },
    {
        key: "medWin",
        icon: <Box mt={1} width={64} height={24} component="img" src={"/static/img/logo-wide.png"}/>,
        label: "tabs.medWin",
        content: "tabs.content-2",
    },
    {
        key: "file",
        icon: "ic-upload",
        variant: "default",
        label: "tabs.file",
        content: "tabs.content-3",
    },
];

function ImportData() {
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();

    const {patient: duplicatedPatient} = useAppSelector(duplicatedSelector);

    const [settingsTab, setSettingsTab] = useState({
        activeTab: null,
        loading: false
    });
    const [typeImport, setTypeImport] = useState([
        {label: "Patients", key: "1"},
        {label: "Rendez-vous", key: "2"},
        {label: "Toutes les données", key: "3"},
    ]);
    const [files, setFiles] = useState<any[]>([]);
    const [warningAlertContainer, setWarningAlertContainer] = useState(false);
    const [duplicatedData, setDuplicatedData] = useState<any[]>([{
        "city": "Bizerte",
        "gender": 1,
        "number": 2869,
        "address": null,
        "contact": "97 234 730",
        "birthday": {
            "date": "1968-05-01 00:00:00.000000",
            "timezone": "UTC",
            "timezone_type": 3
        },
        "lastname": "Ridha",
        "firstname": "Marnissi",
        "insurance": {
            "insurance": null,
            "insuranceNumber": "001157151109",
            "insuranceRelation": 0
        },
        "profession": null,
        "maritalStatus": "Marié(e)",
        "addressedDoctor": "Gheribi riadh"
    },
        {
            "city": "Bizerte",
            "gender": 1,
            "number": 522,
            "address": "23 576 362",
            "contact": null,
            "birthday": {
                "date": "1968-05-01 00:00:00.000000",
                "timezone": "UTC",
                "timezone_type": 3
            },
            "lastname": "Ridha",
            "firstname": "Marnissi",
            "insurance": {
                "insurance": null,
                "insuranceNumber": "000065822580",
                "insuranceRelation": 0
            },
            "profession": "SANS PROFESSION",
            "maritalStatus": "Marié(e)",
            "addressedDoctor": null
        }]);
    const [fileLength, setFileLength] = useState(0);
    const [duplicateDetectedDialog, setDuplicateDetectedDialog] = useState(false);

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "import-data"});

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            type: "",
            file: "",
            source: "med",
            comment: ""
        },
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            if (values.source !== "med") {
                setDuplicateDetectedDialog(true);
            } else {
                handleClick();
            }
        },
    });

    const handleClick = () => {
        enqueueSnackbar("You're report is ready", {
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            },
            content: (key, message) => <CircularProgressbarCard {...{t}} id={key} message={message}/>,
        });
    };

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
        setFileLength(0);
    };

    const handleDuplicatedPatient = () => {
        setDuplicateDetectedDialog(false);
        console.log(duplicatedPatient);
        dispatch(resetDuplicated());
    }

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

    return (
        <>
            <SubHeader>
                <Typography>{t("path")}</Typography>
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
                                <Typography
                                    textTransform="uppercase"
                                    fontWeight={600}
                                    marginBottom={2}
                                    gutterBottom>
                                    {t("title")}
                                </Typography>
                                <Alert
                                    sx={{
                                        marginBottom: 1
                                    }}
                                    action={
                                        <Button variant={"contained"} color="error" size="small">
                                            {t('load-file')}
                                        </Button>
                                    }
                                    severity="error">
                                    <AlertTitle>Erreur</AlertTitle>
                                    {t("error.loading-error")} — <strong>{`${t("error.column")} acte ${t("error.missing")}, ${t("error.re-upload")}`}</strong>
                                </Alert>

                                <Alert
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setWarningAlertContainer(!warningAlertContainer);
                                    }}
                                    action={
                                        <Button variant={"contained"} color="warning" size="small">
                                            {t('error.see-all')}
                                        </Button>
                                    }
                                    sx={{
                                        marginBottom: 1
                                    }}
                                    severity="warning">
                                    <AlertTitle>Avertissement</AlertTitle>
                                    {t("error.loading-error")} — <strong>{` 30 ${t("error.duplicated")} , ${t("error.re-duplicate")}`}</strong>
                                    <Collapse in={warningAlertContainer} timeout="auto" unmountOnExit>
                                        <List>
                                            {Array.from(new Array(20)).map((value, index) => (<ListItem
                                                key={index}
                                                disableGutters
                                                secondaryAction={
                                                    <Button variant={"contained"}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setDuplicateDetectedDialog(true);
                                                            }}
                                                            color="warning" size="small">
                                                        {t('error.fix-duplication')}
                                                    </Button>
                                                }>
                                                <ListItemText primary={`${t("error.duplicated-row")}`}/>
                                            </ListItem>))}
                                        </List>
                                    </Collapse>
                                </Alert>
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
                                                    <FileuploadProgress
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
            <Dialog
                {...{
                    sx: {
                        minHeight: 340
                    }
                }}
                color={theme.palette.primary.main}
                contrastText={theme.palette.primary.contrastText}
                dialogClose={() => {
                    setDuplicateDetectedDialog(false);
                }}
                action={() => {
                    return <DuplicateDetected data={duplicatedData}/>
                }}
                actionDialog={
                    <DialogActions
                        sx={{
                            justifyContent: "space-between",
                            width: "100%",
                            "& .MuiDialogActions-root": {
                                'div': {
                                    width: "100%",
                                }
                            }
                        }}>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                            <Button onClick={() => setDuplicateDetectedDialog(false)} startIcon={<CloseIcon/>}>
                                {t("dialog.later")}
                            </Button>
                            <Box>
                                <Button sx={{marginRight: 1}} color={"inherit"} startIcon={<CloseIcon/>}>
                                    {t("dialog.no-duplicates")}
                                </Button>
                                <Button
                                    onClick={handleDuplicatedPatient}
                                    variant="contained"
                                    startIcon={<IconUrl path="ic-dowlaodfile"></IconUrl>}>
                                    {t("dialog.save")}
                                </Button>
                            </Box>
                        </Stack>

                    </DialogActions>
                }
                open={duplicateDetectedDialog}
                title={t(`dialog.title`)}
            />
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
