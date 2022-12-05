import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DesktopContainer} from "@themes/desktopConainter";
import {pdfjs} from "react-pdf";
import {useFormik} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {LoadingScreen} from "@features/loadingScreen";
import {useReactToPrint} from "react-to-print";
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {UploadFile} from "@features/uploadFile";
import FileuploadProgress from "../../../../features/fileUploadProgress/components/fileUploadProgress";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import Preview from "./preview";

function DocsConfig() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const router = useRouter();

    const [files, setFiles] = useState<any[]>([]);
    const [data, setData] = useState<any>({
        background: {show: false, content: ''},
        header: {show: true, x: 0, y: 0},
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8},
        date: {show: true, prefix: 'Le ', content: '[ ../../.... ]', x: 412, y: 35},
        patient: {show: true, prefix: '', content: 'Foulen ben foulen', x: 120, y: 55},
        content: {
            show: true,
            maxHeight: 400,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 70
        }
    })

    const {trigger} = useRequestMutation(null, "/MP/header");
    const {enqueueSnackbar} = useSnackbar();
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const printNow = () => {
        handlePrint()
    }

    const handleDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            let reader = new FileReader();
            reader.onload = (ev) => {
                data.background.content = (ev.target?.result as string)
                setData({...data})
            }
            reader.readAsDataURL(acceptedFiles[0]);
            setFiles([...files, ...acceptedFiles]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files]
    );

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
        data.background.content = ''
        setData({...data})
    };

    const formik = useFormik({
        children: undefined,
        component: undefined,
        initialErrors: undefined,
        initialTouched: undefined,
        innerRef: undefined,
        isInitialValid: undefined,

        onSubmit: async (values) => {
            return values;
        },

        enableReinitialize: true,
        initialValues: {
            left1: "Dr",
            left2: "",
            left3: "",
            right1: "Tel: ",
            right2: "Fix: ",
            right3: ""
        }
    })

    let {values, getFieldProps, setFieldValue} = formik;

    const {data: httpData} = useRequest({
        method: "GET",
        url: `/api/medical-professional/${medical_professional.uuid}/documents_header/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    },SWRNoValidateConfig);

    useEffect(() => {
        if (httpData) {
            const docInfo = (httpData as HttpResponse).data

            setFieldValue("left1", docInfo.header.left1);
            setFieldValue("left2", docInfo.header.left2);
            setFieldValue("left3", docInfo.header.left3);
            setFieldValue("right1", docInfo.header.right1);
            setFieldValue("right2", docInfo.header.right2);
            setFieldValue("right3", docInfo.header.right3);

            if (docInfo.data) setData(docInfo.data)

        }
    }, [httpData, setFieldValue])


    const {t, ready} = useTranslation(["settings", "common"], {
        keyPrefix: "documents.config",
    });

    const eventHandler = (ev: any, location: { x: any; y: any; }, from: string) => {
        console.log(location.x, location.y)
        data[from].x = location.x
        data[from].y = location.y
        setData({...data})
    }

    const save = () => {
        const form = new FormData();
        form.append('document_header', JSON.stringify({header: values, data}));
        trigger({
            method: "PATCH",
            url: `/api/medical-professional/${medical_professional.uuid}/documents_header/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation)
        enqueueSnackbar(t("updated"), {variant: 'success'})

    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            {/*<SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography color="text.primary">{t("path")}</Typography>

                        <Typography ml={1}>Imprimer un test</Typography>
                    </IconButton>
                </Stack>
            </SubHeader>*/}
            <DesktopContainer>
                <Grid container>
                    <Grid item md={5}>
                        <Box padding={2} style={{background: "white"}}
                             borderRight={'1px solid #c7c6c7'}
                             height={'100%'}>
                            <Stack direction={"row"}
                                   alignItems={"center"}
                                   paddingBottom={1}
                                   borderBottom={'1px solid rgba(0,0,0,.1)'}
                                   justifyContent={"space-between"}>
                                <Typography fontSize={16}>
                                    {t('proprety')}
                                </Typography>
                                <IconButton color={"primary"} onClick={printNow}>
                                    <LocalPrintshopRoundedIcon/>
                                </IconButton>
                            </Stack>

                            <List
                                sx={{width: '100%', bgcolor: 'background.paper'}}
                                component="nav"
                                aria-labelledby="nested-list-subheader">

                                {/*Content*/}
                                <fieldset style={{marginBottom: 10}}>
                                    <legend>{t('configContent')}</legend>
                                    <Typography fontSize={12} color={'#999'} mb={1}>{t('maxHeight')}</Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={"400"}
                                        required
                                        type={"number"}
                                        value={data.content.maxHeight}
                                        onChange={(ev) => {
                                            data.content.maxHeight = ev.target.value
                                            setData({...data})
                                        }}
                                        fullWidth/>
                                    <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                        : {data.content.x} , y : {data.content.y}</Typography>
                                </fieldset>

                                {/*Import document*/}
                                <ListItem style={{padding: 0, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.background.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            data.background.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("background")}/>
                                </ListItem>
                                <Collapse in={data.background.show} timeout="auto" unmountOnExit>
                                    {files.length === 0 &&
                                        <UploadFile
                                            files={files}
                                            accept={{
                                                'image/jpeg': ['.png', '.jpeg', '.jpg']
                                            }}
                                            onDrop={handleDrop}
                                            singleFile={true}/>}

                                    <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                                        {files?.map((file: any, index: number) => (
                                            <FileuploadProgress
                                                key={index}
                                                file={file}
                                                progress={100}
                                                handleRemove={handleRemove}
                                            />
                                        ))}
                                    </Stack>
                                </Collapse>

                                {/*Header config*/}
                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.header.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            data.header.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("header")}/>
                                </ListItem>
                                <Collapse in={data.header.show} timeout="auto" unmountOnExit>
                                    <Card>
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                    <Typography color={'#999'}
                                                                fontSize={12}>{t('leftSide')}</Typography>
                                                    <Typography color={'#999'}
                                                                fontSize={12}>{t('rightSide')}</Typography>
                                                </Stack>

                                                <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("case1")}
                                                        required
                                                        {...getFieldProps("left1")}
                                                        fullWidth/>

                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("case1")}
                                                        required
                                                        inputProps={{
                                                            style: {
                                                                textAlign: "right"
                                                            },
                                                        }}
                                                        {...getFieldProps("right1")}
                                                        fullWidth/>
                                                </Stack>
                                                <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("case2")}
                                                        required
                                                        {...getFieldProps("left2")}
                                                        fullWidth/>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("case2")}
                                                        inputProps={{
                                                            style: {
                                                                textAlign: "right"
                                                            },
                                                        }}
                                                        {...getFieldProps("right2")}
                                                        required
                                                        fullWidth/>
                                                </Stack>
                                                <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("case3")}
                                                        required
                                                        multiline
                                                        rows={4}
                                                        {...getFieldProps("left3")}

                                                        fullWidth/>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("case3")}
                                                        required
                                                        multiline
                                                        rows={4}
                                                        inputProps={{
                                                            style: {
                                                                textAlign: "right"
                                                            },
                                                        }}
                                                        {...getFieldProps("right3")}
                                                        fullWidth/>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Collapse>

                                {/*Title document*/}
                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.title.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            data.title.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("title")}/>
                                </ListItem>
                                <Collapse in={data.title.show} timeout="auto" unmountOnExit>
                                    <fieldset>
                                        <legend>{t('configTitle')}</legend>
                                        <Typography fontSize={12} color={'#999'} mb={1}>{t('nom')}</Typography>
                                        <TextField
                                            variant="outlined"
                                            placeholder={t("nameDoc")}
                                            required

                                            value={data.title.content}
                                            onChange={(ev) => {
                                                data.title.content = ev.target.value
                                                setData({...data})
                                            }}
                                            fullWidth/>
                                        <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                            : {data.title.x} , y : {data.title.y}</Typography>
                                    </fieldset>
                                </Collapse>

                                {/*Date*/}
                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.date.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            data.date.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("date")}/>
                                </ListItem>
                                <Collapse in={data.date.show} timeout="auto" unmountOnExit>
                                    <fieldset>
                                        <legend>{t('configDate')}</legend>
                                        <Typography fontSize={12} color={'#999'} mb={1}>{t('prefix')}</Typography>
                                        <TextField
                                            variant="outlined"
                                            placeholder={t("le")}
                                            required
                                            value={data.date.prefix}
                                            onChange={(ev) => {
                                                data.date.prefix = ev.target.value
                                                setData({...data})
                                            }}
                                            fullWidth/>
                                        <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                            : {data.date.x} , y : {data.date.y}</Typography>
                                    </fieldset>
                                </Collapse>

                                {/*Patient name*/}
                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.patient.show}
                                        onChange={(ev) => {
                                            data.patient.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("patient")}/>
                                </ListItem>
                                <Collapse in={data.patient.show} timeout="auto" unmountOnExit>
                                    <fieldset>
                                        <legend>{t('configPatient')}</legend>
                                        <Typography fontSize={12} color={'#999'} mb={1}>{t('prefix')}</Typography>
                                        <TextField
                                            variant="outlined"
                                            placeholder={t("firstName")}
                                            required
                                            value={data.patient.prefix}
                                            onChange={(ev) => {
                                                data.patient.prefix = ev.target.value
                                                setData({...data})
                                            }}
                                            fullWidth/>
                                        <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                            : {data.patient.x} , y : {data.patient.y}</Typography>
                                    </fieldset>
                                </Collapse>

                                {/*Save Button*/}
                                <Stack justifyContent="flex-end" marginTop={1}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={save}
                                        sx={{ml: "auto"}}>
                                        {t("save")}
                                    </Button>
                                </Stack>
                            </List>
                        </Box>
                    </Grid>

                    <Grid item md={7}>
                        <Box padding={2}>
                            <Box style={{width: '148mm', margin: 'auto'}}>
                                <Box ref={componentRef}>
                                    <Preview  {...{eventHandler, data, values}} />
                                </Box>
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
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
export default DocsConfig;

DocsConfig.auth = true;

DocsConfig.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
