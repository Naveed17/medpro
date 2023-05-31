import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {useTranslation} from "next-i18next";
import {SubHeader} from "@features/subHeader";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    MenuItem,
    Select,
    Stack,
    Typography,
    useTheme,
    Theme,
    styled,
} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import {Form, FormikProvider, useFormik} from "formik";
import {UploadFile} from "@features/uploadFile";
import {SettingsTabs} from "@features/tabPanel";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import Papa from "papaparse";
import readXlsxFile from "read-excel-file";
import {useAppSelector} from "@lib/redux/hooks";
import dynamic from "next/dynamic";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {agendaSelector} from "@features/calendar";
import {tableActionSelector} from "@features/table";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {DefaultCountry} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";

const RootStyled = styled(Box)(({theme}: { theme: Theme }) => ({
    ".tab-item": {
        [theme.breakpoints.down("md")]: {
            maxWidth: "50%",
        },
        ".MuiCard-root": {
            [theme.breakpoints.down("md")]: {
                padding: 0,
            },
            ".MuiCardContent-root": {
                [theme.breakpoints.down("md")]: {
                    justifyContent: "center",
                    padding: theme.spacing(2),
                    paddingBottom: theme.spacing(2),
                },
                ".tab-content": {
                    [theme.breakpoints.down("md")]: {
                        display: "none",
                    },
                },
            },
        },
    },
}));
const FileUploadProgress = dynamic(
    () =>
        import(
            "@features/progressUI/components/fileUploadProgress/components/fileUploadProgress"
            )
);

function ImportData() {
    const router = useRouter();
    const {data: session} = useSession();
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            type: "",
            file: "",
            source: "med-pro",
            comment: "",
        },
        onSubmit: async () => {
            checkImportData();
        },
    });

    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {importData} = useAppSelector(tableActionSelector);
    const {mutate: mutateOnGoing} = useAppSelector(dashLayoutSelector);
    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "import-data"});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;

    const [cancelDialog, setCancelDialog] = useState<boolean>(false);
    const [TabData] = useState([
        {
            key: "med-pro",
            icon: "Med-logo_",
            label: "tabs.med",
            content: "tabs.content-1",
        },
        ...(doctor_country?.code === "tn"
            ? [
                {
                    key: "med-win",
                    icon: "ic-upload",
                    variant: "default",
                    label: "tabs.file",
                    content: "tabs.content-2",
                },
            ]
            : []),
        /*{
                key: "med-link",
                icon: "ic-upload",
                variant: "default",
                label: "tabs.file",
                content: "tabs.content-3",
            },*/
    ]);
    const [loading, setLoading] = useState<boolean>(false);
    const [uriFile, setUriFile] = useState<string>("");
    const [settingsTab, setSettingsTab] = useState({
        activeTab: null,
        loading: false,
    });
    const [typeImport] = useState([
        // {label: "Patients", key: "1"},
        {label: "Toutes les données", key: "2"},
    ]);
    const [files, setFiles] = useState<any[]>([]);
    const [errorsImport, setErrorsImport] = useState<any[]>([]);
    const [fileLength, setFileLength] = useState(0);

    const {trigger: triggerImportData} = useRequestMutation(
        null,
        "/import/data"
    );

    const {data: httpFileResponse} = useRequest({
        method: "GET",
        url: `/api/public/med-link/patient/file/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    });

    useEffect(() => {
        if (httpFileResponse)
            setUriFile((httpFileResponse as HttpResponse).data.file);
    }, [httpFileResponse]);

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
            readXlsxFile(f).then(rows => {
                setFileLength(rows.length);
            }).catch(error => console.log(error));
        }
        setFiles([...files, ...acceptedFiles]);
    };

    const checkImportData = () => {
        const importStatus = importData.data.find(
            (data) => data.method === values.source
        );
        if (!importStatus) {
            handleImportData();
        } else {
            setCancelDialog(true);
        }
    };

    const handleImportData = () => {
        setErrorsImport([]);
        setLoading(true);
        const params = new FormData();
        params.append("method", values.source);
        params.append(
            "withAppointments",
            (values.source === "med-pro" && values.type === "2").toString()
        );
        params.append("agenda", agendaConfig?.uuid as string);
        files.length > 0 && params.append("document", files[0]);

        triggerImportData({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/import/data/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`},
        }).then(
            (value: any) => {
                if (value?.data.status === "success") {
                    // refresh on going api
                    mutateOnGoing && mutateOnGoing();
                    setLoading(false);
                    setCancelDialog(false);
                    localStorage.setItem("import-data", "true");
                    setFiles([]);
                    importData.mutate && importData.mutate();
                    router.push("/dashboard/settings/data");
                }
            },
            (reason) => {
                if (reason?.response.status === 400) {
                    const errors = Object.entries(reason?.response.data.data).map(
                        ([key, value]: [string, any]) => ({
                            row: key,
                            data: value,
                        })
                    );
                    setErrorsImport(errors);
                }
                setLoading(false);
            }
        );
    };

    const {values, handleSubmit, getFieldProps, setFieldValue} = formik;

    if (!ready)
        return (
            <LoadingScreen
                error
                button={"loading-error-404-reset"}
                text={"loading-error"}
            />
        );

    return (
        <RootStyled>
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
                    getIndex={setSettingsTab}
                />
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card className="venue-card">
                            <CardContent>
                                {errorsImport.length > 0 && (
                                    <Alert
                                        sx={{
                                            marginBottom: 1,
                                        }}
                                        action={
                                            <LoadingButton
                                                {...{loading}}
                                                onClick={() => checkImportData()}
                                                variant={"contained"}
                                                color="error"
                                                size="small">
                                                {t("load-file")}
                                            </LoadingButton>
                                        }
                                        severity="error">
                                        <AlertTitle>{t("error.title")}</AlertTitle>
                                        {t("error.loading-error")}
                                        <List>
                                            {errorsImport.map((error, index) => (
                                                <ListItem key={index}>
                                                    —{" "}
                                                    <strong>{` ${error.data[0]} ${t("error.missing")} ${t(
                                                        "error.line"
                                                    )} ${error.row}, ${t("error.re-upload")}`}</strong>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Alert>
                                )}

                                {/* Layout */}
                                <Typography
                                    textTransform="uppercase"
                                    fontWeight={600}
                                    marginBottom={2}
                                    gutterBottom>
                                    {t("title")}
                                </Typography>
                                {settingsTab.activeTab === 0 && (
                                    <Box mb={2} mt={2}>
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
                                                        const type = typeImport?.find(
                                                            (type) => type.key === selected
                                                        );
                                                        return <Typography>{type?.label}</Typography>;
                                                    }}>
                                                    {typeImport.map((type) => (
                                                        <MenuItem key={type.key} value={type.key}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                                {settingsTab.activeTab === 1 && (
                                    <Box mb={6} mt={2}>
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
                                                <a href={uriFile} download>
                                                    <Stack
                                                        sx={{
                                                            cursor: "pointer",
                                                        }}
                                                        justifyContent={"center"}
                                                        alignItems={"center"}>
                                                        <Icon
                                                            width={"80"}
                                                            height={"80"}
                                                            path={"ic-download"}
                                                        />
                                                        <Typography variant={"body2"}>
                                                            {t("file-modele-placeholder")}
                                                        </Typography>
                                                    </Stack>
                                                </a>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                                {settingsTab.activeTab !== 0 && (
                                    <Box mb={2} mt={2}>
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
                                                {files.length === 0 && (
                                                    <UploadFile
                                                        files={files}
                                                        onDrop={handleOnDropFile}
                                                        accept={{
                                                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                                                [".csv", ".xls", ".xlsm"],
                                                        }}
                                                        singleFile
                                                        maxFiles={1}
                                                    />
                                                )}

                                                <Stack
                                                    spacing={2}
                                                    maxWidth={{xs: "100%", md: "100%"}}>
                                                    {files?.map((file: any, index: number) => (
                                                        <FileUploadProgress
                                                            {...{handleRemove}}
                                                            key={index}
                                                            file={file}
                                                            progress={100}
                                                        />
                                                    ))}
                                                    {fileLength > 0 && (
                                                        <Typography variant={"body2"}>{`${t(
                                                            "file-length"
                                                        )} ${fileLength} ${t("file-process")}`}</Typography>
                                                    )}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                                <LoadingButton
                                    {...{loading}}
                                    disabled={
                                        (settingsTab.activeTab === 0 && values.type === "") ||
                                        (settingsTab.activeTab !== 0 && files.length === 0)
                                    }
                                    type={"submit"}
                                    sx={{
                                        marginTop: 4,
                                    }}
                                    variant={"contained"}
                                    fullWidth>
                                    {t(settingsTab.activeTab !== 0 ? "load-file" : "load-data")}
                                </LoadingButton>
                            </CardContent>
                        </Card>
                    </Form>
                </FormikProvider>
            </Box>

            <Dialog
                color={theme.palette.warning.main}
                contrastText={theme.palette.warning.contrastText}
                dialogClose={() => setCancelDialog(false)}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}} variant="subtitle1">
                                {t(`dialogs.check-dialog.sub-title`)}{" "}
                            </Typography>
                            <Typography sx={{textAlign: "center"}} margin={2}>
                                {t(`dialogs.check-dialog.description`)}
                            </Typography>
                        </Box>
                    );
                }}
                open={cancelDialog}
                title={t(`dialogs.check-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setCancelDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {t(`dialogs.check-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"warning"}
                            onClick={() => handleImportData()}
                            startIcon={
                                <Icon
                                    height={"18"}
                                    width={"18"}
                                    color={"white"}
                                    path="ic-upload-3"></Icon>
                            }>
                            {t(`dialogs.check-dialog.confirm`)}
                        </LoadingButton>
                    </>
                }
            />
        </RootStyled>
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
