import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
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
    List, ListItemText, ListItem, Drawer
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
import {Dialog} from "@features/dialog";
import {duplicatedSelector, resetDuplicated} from "@features/duplicateDetected";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {onOpenPatientDrawer, Otable, tableActionSelector} from "@features/table";
import dynamic from "next/dynamic";

const DuplicateDetected = dynamic(() => import("@features/duplicateDetected/components/duplicateDetected"));
const PatientDetail = dynamic(() => import("@features/dialog/components/patientDetail/components/patientDetail"));
const FileUploadProgress = dynamic(() => import("@features/fileUploadProgress/components/fileUploadProgress"));

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

const headImportDataCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: "name",
        align: 'left',
        sortable: true,
    }, {
        id: 'source',
        numeric: false,
        disablePadding: true,
        label: "source",
        align: 'left',
        sortable: true,
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'action',
        align: 'right',
        sortable: false
    },
];

function ImportData() {
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();

    const {patient: duplicatedPatient} = useAppSelector(duplicatedSelector);
    const {direction} = useAppSelector(configSelector);
    const {patientId} = useAppSelector(tableActionSelector);

    const [settingsTab, setSettingsTab] = useState({
        activeTab: null,
        loading: false
    });
    const [typeImport, setTypeImport] = useState([
        {label: "Patients", key: "1"},
        {label: "Toutes les données", key: "2"},
    ]);
    const [files, setFiles] = useState<any[]>([]);
    const [warningAlertContainer, setWarningAlertContainer] = useState(false);
    const [infoAlertContainer, setInfoAlertContainer] = useState(false);
    const [errorsDuplication, setErrorsDuplication] = useState<Array<{
        key: string;
        row: string;
        data: Array<PatientImportModel>;
        fixed: boolean;
    }>>([]);
    const [infoDuplication, setInfoDuplication] = useState<Array<{
        key: string;
        row: string;
        data: PatientModel | null;
        fixed: boolean;
    }>>([]);
    const [duplicatedData, setDuplicatedData] = useState<any>(null);
    const [fileLength, setFileLength] = useState(0);
    const [duplicateDetectedDialog, setDuplicateDetectedDialog] = useState(false);
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);

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
            handleClick();
        },
    });

    const handleClick = () => {
        enqueueSnackbar("You're report is ready", {
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            content: (key, message) =>
                <CircularProgressbarCard {...{t}} id={key} message={message}/>,
        });
    };

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
        setFileLength(0);
    };

    const handleDuplicatedPatient = () => {
        setDuplicateDetectedDialog(false);
        (errorsDuplication.find(err => err.key === duplicatedData.key) as any).fixed = true;
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
                                    {t("history")}
                                </Typography>

                                <Otable
                                    {...{t}}
                                    headers={headImportDataCells}
                                    isItemSelected
                                    rows={[
                                        {
                                            key: "1",
                                            date: "11/12/2022",
                                            source: "Med",
                                            collapse: [{
                                                errors: <Alert
                                                    sx={{
                                                        marginBottom: 1
                                                    }}
                                                    action={
                                                        <Button variant={"contained"} color="error" size="small">
                                                            {t('load-file')}
                                                        </Button>
                                                    }
                                                    severity="error">
                                                    <AlertTitle>{t("error.title")}</AlertTitle>
                                                    {t("error.loading-error")} — <strong>{`${t("error.column")} acte ${t("error.missing")}, ${t("error.re-upload")}`}</strong>
                                                </Alert>,
                                                warning: <Alert
                                                    action={
                                                        <Button variant={"contained"}
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setWarningAlertContainer(!warningAlertContainer);
                                                                }}
                                                                color="warning" size="small">
                                                            {t('error.see-all')}
                                                        </Button>
                                                    }
                                                    sx={{
                                                        marginBottom: 1
                                                    }}
                                                    severity="warning">
                                                    <Box onClick={(event) => {
                                                        event.stopPropagation();
                                                        setWarningAlertContainer(!warningAlertContainer);
                                                    }}>
                                                        <AlertTitle>{t("error.warning-title")}</AlertTitle>
                                                        {t("error.loading-error")} — <strong>{` ${errorsDuplication.length} ${t("error.duplicated")} , ${t("error.re-duplicate")}`}</strong>
                                                    </Box>
                                                    <Collapse in={warningAlertContainer} timeout="auto" unmountOnExit>
                                                        <List>
                                                            {errorsDuplication.map((error, index) => (<ListItem
                                                                key={error.key}
                                                                disableGutters
                                                                secondaryAction={
                                                                    <Button variant={"contained"}
                                                                            sx={{
                                                                                visibility: !error.fixed ? "visible" : "hidden"
                                                                            }}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                setDuplicatedData(error);
                                                                                setDuplicateDetectedDialog(true);
                                                                            }}
                                                                            color="warning" size="small">
                                                                        {t('error.fix-duplication')}
                                                                    </Button>
                                                                }>
                                                                <strong>{index} .</strong>
                                                                <ListItemText sx={{
                                                                    textDecorationLine: error.fixed ? "line-through" : "none"
                                                                }}
                                                                              primary={`${t("error.duplicated-row")} ${error.row}`}/>
                                                            </ListItem>))}
                                                        </List>
                                                    </Collapse>
                                                </Alert>,
                                                info: <Alert
                                                    action={
                                                        <Button variant={"contained"}
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setInfoAlertContainer(!infoAlertContainer);
                                                                }}
                                                                color="info" size="small">
                                                            {t('error.see-all')}
                                                        </Button>
                                                    }
                                                    sx={{
                                                        marginBottom: 1
                                                    }}
                                                    severity="info">
                                                    <Box onClick={(event) => {
                                                        event.stopPropagation();
                                                        setInfoAlertContainer(!infoAlertContainer);
                                                    }}>
                                                        <AlertTitle>{t("error.info-title")}</AlertTitle>
                                                        {t("error.loading-error")} — <strong>{` ${infoDuplication.length} ${t("error.warning-insert")} , ${t("error.re-duplicate")}`}</strong>
                                                    </Box>
                                                    <Collapse in={infoAlertContainer} timeout="auto" unmountOnExit>
                                                        <List>
                                                            {infoDuplication.map((info, index) => (<ListItem
                                                                key={info.key}
                                                                disableGutters
                                                                secondaryAction={
                                                                    <Button variant={"contained"}
                                                                            sx={{
                                                                                visibility: !info.fixed ? "visible" : "hidden"
                                                                            }}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                console.log(info)
                                                                                dispatch(onOpenPatientDrawer({patientId: info?.data && info?.data.uuid}));
                                                                                setPatientDetailDrawer(true);
                                                                            }}
                                                                            color="warning" size="small">
                                                                        {t('error.see-details')}
                                                                    </Button>
                                                                }>
                                                                <strong>{index} .</strong>
                                                                <ListItemText sx={{
                                                                    textDecorationLine: info.fixed ? "line-through" : "none"
                                                                }}
                                                                              primary={`${t("error.warning-row")} ${info.data?.firstName} ${info.data?.lastName} ${t("error.warning-row-detail")}`}/>
                                                            </ListItem>))}
                                                        </List>
                                                    </Collapse>
                                                </Alert>
                                            }]
                                        }
                                    ]}
                                    from={"import_data"}/>

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
                    return duplicatedData && <DuplicateDetected data={duplicatedData}/>
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

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}
            >
                <PatientDetail
                    {...{isAddAppointment: false, patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}/>
            </Drawer>
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
