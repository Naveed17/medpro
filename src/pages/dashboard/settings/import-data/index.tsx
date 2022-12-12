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
import {FileuploadProgress} from "@features/fileUploadProgress";
import {SettingsTabs} from "@features/tabPanel";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import Papa from "papaparse";
import {read, utils} from "xlsx";
import {CircularProgressbarCard} from "@features/card";
import {useSnackbar} from "notistack";
import {Dialog, PatientDetail} from "@features/dialog";
import {DuplicateDetected, duplicatedSelector, resetDuplicated} from "@features/duplicateDetected";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {onOpenPatientDrawer, tableActionSelector} from "@features/table";

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
    const {direction} = useAppSelector(configSelector);
    const {patientId} = useAppSelector(tableActionSelector);

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
    const [infoAlertContainer, setInfoAlertContainer] = useState(false);
    const [errorsDuplication, setErrorsDuplication] = useState([
        {
            key: "1",
            row: "324",
            data: [{
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
                }],
            fixed: false
        }, {
            key: "2",
            row: "24",
            data: [{
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
                "lastname": "Ahmed",
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
                }],
            fixed: false
        }, {
            key: "3",
            row: "304",
            data: [{
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
                "lastname": "Imed",
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
                }],
            fixed: false
        }, {
            key: "0",
            row: "124",
            data: [{
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
                "lastname": "Karim",
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
                }],
            fixed: false
        }]);
    const [infoDuplication, setInfoDuplication] = useState([
        {
            key: "1",
            row: "324",
            data: {
                "uuid": "d831a503-8dfa-4c6e-bff0-ac0c32cfb9a6",
                "email": "",
                "birthdate": "18-04-1962",
                "firstName": "test ",
                "lastName": "patient",
                "gender": "M",
                "account": null,
                "address": [],
                "contact": [
                    {
                        "uuid": "a28a4f30-601f-42c6-b95b-4a0355cf4dee",
                        "value": "5151515151",
                        "type": "phone",
                        "contactType": {
                            "uuid": "9dea764e-1ba7-4022-b381-c045bf6e321a",
                            "name": "Téléphone"
                        },
                        "isPublic": false,
                        "isSupport": false,
                        "isVerified": false,
                        "description": null,
                        "code": "+216"
                    }
                ],
                "insurances": [],
                "isParent": false,
                "nextAppointment": null,
                "previousAppointments": {
                    "uuid": "26795b1a-136d-4375-a9e6-5275293d3b7a",
                    "type": {
                        "uuid": "b410fe0a-8715-4fe7-8d57-2c9def51285d",
                        "name": "Consultation",
                        "color": "#1BC47D",
                        "icon": "ic-consultation",
                        "code": 1
                    },
                    "dayDate": "08-12-2022",
                    "startTime": "09:30",
                    "endTime": "09:45",
                    "duration": 15,
                    "isVip": false,
                    "status": 1,
                    "instruction": null,
                    "consultationReason": null,
                    "createdAt": "09-12-2022 11:40",
                    "patient": {
                        "uuid": "d831a503-8dfa-4c6e-bff0-ac0c32cfb9a6",
                        "email": "",
                        "birthdate": "18-04-1962",
                        "firstName": "test ",
                        "lastName": "patient",
                        "gender": "M",
                        "contact": [
                            {
                                "uuid": "a28a4f30-601f-42c6-b95b-4a0355cf4dee",
                                "value": "5151515151",
                                "type": "phone",
                                "contactType": {
                                    "uuid": "9dea764e-1ba7-4022-b381-c045bf6e321a",
                                    "name": "Téléphone"
                                },
                                "isPublic": false,
                                "isSupport": false,
                                "isVerified": false,
                                "description": null,
                                "code": "+216"
                            }
                        ],
                        "antecedents": {
                            "way_of_life": [],
                            "allergic": [],
                            "treatment": [],
                            "family_antecedents": [],
                            "surgical_antecedents": [],
                            "medical_antecedents": []
                        },
                        "hasAccount": false,
                        "idCard": ""
                    },
                    "overlapEvent": true,
                    "PatientHasAgendaAppointment": false,
                    "fees": null
                },
                "familyDoctor": "",
                "hasAccount": false,
                "idCard": ""
            },
            fixed: false
        }
    ]);
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
                                    {t("title")}
                                </Typography>
                                {/* Error Alert */}
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
                                    <AlertTitle>{t("error.title")}</AlertTitle>
                                    {t("error.loading-error")} — <strong>{`${t("error.column")} acte ${t("error.missing")}, ${t("error.re-upload")}`}</strong>
                                </Alert>
                                {/* Warning Alert */}
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
                                    <AlertTitle>{t("error.warning-title")}</AlertTitle>
                                    {t("error.loading-error")} — <strong>{` ${errorsDuplication.length} ${t("error.duplicated")} , ${t("error.re-duplicate")}`}</strong>
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
                                                }} primary={`${t("error.duplicated-row")} ${error.row}`}/>
                                            </ListItem>))}
                                        </List>
                                    </Collapse>
                                </Alert>
                                {/* Info Alert */}
                                <Alert
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setInfoAlertContainer(!infoAlertContainer);
                                    }}
                                    action={
                                        <Button variant={"contained"} color="info" size="small">
                                            {t('error.see-all')}
                                        </Button>
                                    }
                                    sx={{
                                        marginBottom: 1
                                    }}
                                    severity="info">
                                    <AlertTitle>{t("error.info-title")}</AlertTitle>
                                    {t("error.loading-error")} — <strong>{` ${infoDuplication.length} ${t("error.warning-insert")} , ${t("error.re-duplicate")}`}</strong>
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
                                                                dispatch(onOpenPatientDrawer({patientId: info?.data.uuid}));
                                                                setPatientDetailDrawer(true);
                                                            }}
                                                            color="warning" size="small">
                                                        {t('error.see-details')}
                                                    </Button>
                                                }>
                                                <strong>{index} .</strong>
                                                <ListItemText sx={{
                                                    textDecorationLine: info.fixed ? "line-through" : "none"
                                                }} primary={`${t("error.warning-row")} ${info.data.firstName} ${info.data.lastName} ${t("error.warning-row-detail")}`}/>
                                            </ListItem>))}
                                        </List>
                                    </Collapse>
                                </Alert>
                                {/* Layout */}
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
