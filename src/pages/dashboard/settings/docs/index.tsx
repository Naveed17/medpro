import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {pdfjs} from "react-pdf";
import {useFormik} from "formik";
import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Stack,
    TextField, ToggleButton, ToggleButtonGroup,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useReactToPrint} from "react-to-print";
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {UploadFile} from "@features/uploadFile";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {FileuploadProgress} from "@features/progressUI";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@lib/swr/swrProvider";
import Zoom from "@mui/material/Zoom";
import PreviewA4 from "@features/files/components/previewA4";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {Editor} from '@tinymce/tinymce-react';
import {useMedicalProfessionalSuffix} from "@lib/hooks";

function DocsConfig() {
    const {data: session} = useSession();
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const router = useRouter();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const componentRef = useRef<HTMLDivElement>(null);
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const [files, setFiles] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        background: {show: false, content: ''},
        header: {show: true, x: 0, y: 0},
        footer: {show: false, x: 0, y: 234, content: ''},
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8},
        date: {show: true, prefix: 'Le ', content: '[ 00 / 00 / 0000 ]', x: 0, y: 155, textAlign: "center"},
        patient: {show: true, prefix: 'Nom & prénom: ', content: 'MOHAMED ALI', x: 40, y: 55},
        size: 'portraitA4',
        content: {
            show: true,
            maxHeight: 400,
            maxWidth: 130,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 70
        }
    })

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});

    const {trigger} = useRequestMutation(null, "/MP/header");

    const {data: httpData, mutate: mutateDocumentHeader} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/documents_header/${router.locale}`
    } : null, SWRNoValidateConfig);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        data.date.textAlign = newAlignment;
        setData({...data});
    };


    const printNow = () => {
        handlePrint()
    }

    const handleDrop = React.useCallback((acceptedFiles: File[]) => {
            let reader = new FileReader();
            reader.onload = (ev) => {
                data.background.content = (ev.target?.result as string)
                data.background.show = true;
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
            left1: "",
            left2: "",
            left3: "",
            right1: "",
            right2: "",
            right3: ""
        }
    })

    let {values, getFieldProps, setFieldValue} = formik;


    const eventHandler = (ev: any, location: { x: any; y: any; }, from: string) => {
        data[from].x = location.x
        data[from].y = location.y
        setData({...data})
    }

    const save = () => {
        const form = new FormData();
        data.background.content = "";
        form.append('document_header', JSON.stringify({header: values, data}));
        trigger({
            method: "PATCH",
            url: `${urlMedicalProfessionalSuffix}/documents_header/${router.locale}`,
            data: form
        }, TriggerWithoutValidation).then(() => {
            mutateDocumentHeader();
        })
        enqueueSnackbar(t("updated"), {variant: 'success'})

    }

    useEffect(() => {
        if (httpData) {
            const docInfo = (httpData as HttpResponse).data

            if (docInfo.header) {
                setFieldValue("left1", docInfo.header.left1);
                setFieldValue("left2", docInfo.header.left2);
                setFieldValue("left3", docInfo.header.left3);
                setFieldValue("right1", docInfo.header.right1);
                setFieldValue("right2", docInfo.header.right2);
                setFieldValue("right3", docInfo.header.right3);
            }

            if (docInfo.data) {
                if (docInfo.data.footer === undefined)
                    setData({...docInfo.data, footer: {show: true, x: 0, y: 140, content: ''}})
                else
                    setData(docInfo.data)
            }

            setTimeout(() => {
                setLoading(false)
            }, 1000)

            setTimeout(() => {
                const footer = document.getElementById('footer');
                if (footer && docInfo.data.footer) footer.innerHTML = docInfo.data.footer.content
            }, 1200)

        }
    }, [httpData, setFieldValue])

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={5}>
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
                            <Stack direction={"row"}>
                                <Tooltip title={t("preview")} TransitionComponent={Zoom}>
                                    <IconButton onClick={printNow} sx={{
                                        border: "1px solid",
                                        mr: 1,
                                        borderRadius: 2,
                                        color: theme.palette.grey[400]
                                    }}>
                                        <LocalPrintshopRoundedIcon
                                            style={{color: theme.palette.grey[400], fontSize: 16}}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("save")} TransitionComponent={Zoom}>
                                    <IconButton onClick={save} sx={{
                                        border: "1px solid",
                                        mr: 1,
                                        borderRadius: 2,
                                        color: "primary.main"
                                    }}>
                                        <SaveRoundedIcon color={"primary"} style={{fontSize: 16}}/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>

                        <List
                            sx={{width: '100%', bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader">

                            <Typography fontSize={12} color={'#999'} mb={1}>{t('titleModel')}{" "}
                                <Typography component="span" color="error">
                                    *
                                </Typography>
                            </Typography>
                            <TextField
                                variant="outlined"
                                placeholder={t('titleholder')}
                                required
                                type={"number"}
                                style={{marginBottom: 15}}
                                value={title}
                                onChange={(ev) => {
                                    setTitle(ev.target.value)
                                }}
                                fullWidth/>

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

                            {/*we will add it late*/}
                            {/*<fieldset style={{marginBottom: 10}}>
                                    <legend>{t('paperSize')}</legend>
                                    <ListItem style={{padding: 0, marginBottom: 5}}>
                                        <Checkbox
                                            checked={data.size === 'portraitA5'}
                                            onChange={(ev) => {
                                                data.size = 'portraitA5';
                                                data.content.maxWidth = 130;
                                                setData({...data})
                                            }}
                                        />
                                        <ListItemText primary={t("A5")}/>
                                    </ListItem>
                                    <ListItem style={{padding: 0, marginBottom: 5}}>
                                        <Checkbox
                                            checked={data.size === 'portraitA4'}
                                            onChange={(ev) => {
                                                data.size = 'portraitA4';
                                                data.content.maxWidth = 190;
                                                setData({...data})
                                            }}
                                        />
                                        <ListItemText primary={t("A4")}/>
                                    </ListItem>
                                </fieldset>*/}
                            {/*Import document*/}
                            <ListItem style={{padding: 0, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.background.show}
                                    onChange={(ev) => {
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
                                        accept={{'image/jpeg': ['.png', '.jpeg', '.jpg']}}
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

                            {/*Footer config*/}
                            {data.footer && <Box>
                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.footer?.show}
                                        onChange={(ev) => {
                                            data.footer.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("footer")}/>
                                </ListItem>

                                {!loading && <Collapse in={data.footer.show} timeout="auto" unmountOnExit>
                                    <Editor
                                        value={data.footer.content}
                                        apiKey='5z2ufor849kkaz900ye60ztlyfbx8jr7d6uubg6hbgjs5b2j'
                                        onEditorChange={(res) => {
                                            data.footer.content = res;
                                            setData({...data});
                                        }}
                                        init={{}}
                                    />
                                </Collapse>}
                            </Box>}


                            {/*Title document*/}
                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.title.show}
                                    onChange={(ev) => {
                                        data.title.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("title")}/>
                            </ListItem>
                            {/*
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
*/}

                            {/*Date*/}

                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.date.show}
                                    onChange={(ev) => {
                                        data.date.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("date")}/>
                            </ListItem>
                            <Collapse in={data.date.show} timeout="auto" unmountOnExit>
                                <fieldset>
                                    <legend>{t('configDate')}</legend>

                                    <Stack padding={1}>
                                        <ToggleButtonGroup
                                            value={data.date.textAlign}
                                            exclusive
                                            onChange={handleAlignment}
                                            aria-label="text alignment">
                                            <ToggleButton value="left" aria-label="left aligned">
                                                <FormatAlignLeftIcon/>
                                            </ToggleButton>
                                            <ToggleButton value="center" aria-label="centered">
                                                <FormatAlignCenterIcon/>
                                            </ToggleButton>
                                            <ToggleButton value="right" aria-label="right aligned">
                                                <FormatAlignRightIcon/>
                                            </ToggleButton>
                                            <ToggleButton value="justify" aria-label="justified" disabled>
                                                <FormatAlignJustifyIcon/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Stack>

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
                        </List>
                    </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                    {<Box padding={2}>
                        <Box style={{margin: 'auto', paddingTop: 20}}>
                            <Box ref={componentRef}>
                                <PreviewA4  {...{eventHandler, data, values, loading}} />
                                {loading &&
                                    <div className={data.size ? data.size : "portraitA5"} style={{padding: 20}}>
                                        {Array.from(Array(30)).map((item, key) => (
                                            <Skeleton key={key}></Skeleton>))}
                                    </div>}
                            </Box>
                        </Box>

                    </Box>}
                </Grid>
            </Grid>
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
export default DocsConfig;

DocsConfig.auth = true;

DocsConfig.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
