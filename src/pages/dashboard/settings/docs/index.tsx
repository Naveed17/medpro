import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useRef, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DesktopContainer} from "@themes/desktopConainter";
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
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {LoadingScreen} from "@features/loadingScreen";
import {useReactToPrint} from "react-to-print";
import Preview from "./preview";
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {UploadFile} from "@features/uploadFile";
import FileuploadProgress from "../../../../features/fileUploadProgress/components/fileUploadProgress";

function DocsConfig() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const router = useRouter();

    const [background, setBackground] = useState({show: false, content: ''});
    const [header, setHeader] = useState({show: true, content: '/static/img/scan.jpg', x: 0, y: 0});
    const [title, setTitle] = useState({show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8});
    const [date, setDate] = useState({show: true, content: '21/11/2022', x: 412, y: 35});
    const [patient, setPatient] = useState({show: true, content: 'Foulen ben foulen', x: 104, y: 40});
    const [files, setFiles] = useState<any[]>([]);

    const [file, setFile] = useState('');
    const [pos, setPos] = useState(0);
    const [docFile, setDocFile] = useState<any>('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const {trigger} = useRequestMutation(null, "/MP/header");
    const {enqueueSnackbar} = useSnackbar();
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const printNow = () => {
        handlePrint()
    }

    const handleDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            let reader = new FileReader();
            reader.onload = (ev) => {
                background.content = (ev.target?.result as string)
                setBackground({...background})
            }
            reader.readAsDataURL(acceptedFiles[0]);
            setFiles([...files, ...acceptedFiles]);
        },
        [files]
    );

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
        background.content = ''
        setBackground({...background})
    };

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
            fix: "Fix: ",
            email: ""
        }
    })

    let {values, getFieldProps, setFieldValue} = formik;

    const {data: httpData} = useRequest({
        method: "GET",
        url: `/api/medical-professional/${medical_professional.uuid}/documents_header/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });


    const {t, ready} = useTranslation(["settings", "common"], {
        keyPrefix: "documents.config",
    });

    const eventHandler = (e: { type: any; }, data: any) => {
        console.log(data.x, data.y);
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
                                    Propriétés du modèle
                                </Typography>
                                <IconButton color={"primary"} onClick={printNow}>
                                    <LocalPrintshopRoundedIcon/>
                                </IconButton>
                            </Stack>

                            <List
                                sx={{width: '100%', bgcolor: 'background.paper'}}
                                component="nav"
                                aria-labelledby="nested-list-subheader">


                                <ListItem  style={{padding: 0, marginBottom: 5}}>
                                    <Checkbox
                                        checked={background.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            background.show = ev.target.checked;
                                            setBackground({...background})
                                        }}
                                    />
                                    <ListItemText primary={t("background")}/>
                                </ListItem>

                                <Collapse in={background.show} timeout="auto" unmountOnExit>
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

                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={header.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            header.show = ev.target.checked;
                                            setHeader({...header})
                                        }}
                                    />
                                    <ListItemText primary={t("header")}/>
                                </ListItem>

                                <Collapse in={header.show} timeout="auto" unmountOnExit>
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
                                                        {...getFieldProps("fix")}
                                                        required
                                                        fullWidth/>
                                                </Stack>
                                                <Stack direction={"row"} justifyContent={"space-between"} spacing={4}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("diplome")}
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
                                </Collapse>

                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={title.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            title.show = ev.target.checked;
                                            setTitle({...title})
                                        }}
                                    />
                                    <ListItemText primary={t("title")}/>
                                </ListItem>

                                <Collapse in={title.show} timeout="auto" unmountOnExit>
                                    <fieldset>
                                        <legend>Glisser title pour changer sa position</legend>
                                        <Typography>x: {title.x}</Typography>
                                        <Typography>y: {title.y}</Typography>
                                    </fieldset>
                                </Collapse>

                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={date.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            date.show = ev.target.checked;
                                            setDate({...date})
                                        }}
                                    />
                                    <ListItemText primary={t("date")}/>
                                </ListItem>

                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={patient.show}
                                        onChange={(ev) => {
                                            console.log(ev.target.checked)
                                            patient.show = ev.target.checked;
                                            setPatient({...patient})
                                        }}
                                    />
                                    <ListItemText primary={t("patient")}/>
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>

                    <Grid item md={7}>
                        <Box padding={2}>
                            <Box style={{width: '148.5mm', margin: 'auto'}}>
                                <Box ref={componentRef}>
                                    <Preview  {...{background, header, title, eventHandler, date, patient}} />
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
