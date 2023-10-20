import * as Yup from "yup";
import {FormikProvider, useFormik} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import React, {useCallback, useState} from "react";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {Editor} from '@tinymce/tinymce-react';
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import PreviewA4 from "@features/files/components/previewA4";
import AddIcon from "@mui/icons-material/Add";
import {useSnackbar} from "notistack";
import PaperStyled from "@features/CertifModelDrawer/components/overrides/paperStyled";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {tinymcePlugins, tinymceToolbar} from "@lib/constants";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function CertifModelDrawer({...props}) {
    const {data, editDoc = false, action, isDefault, certificateFolderModel, onSubmit, closeDraw} = props;
    const router = useRouter();
    const theme = useTheme();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("settings", {keyPrefix: "templates.config.dialog"});

    let colors = ["#FEBD15", "#FF9070", "#DF607B", "#9A5E8A", "#526686", "#96B9E8", "#0696D6", "#56A97F"];

    const {trigger: triggerSettingsModel} = useRequestQueryMutation("/settings/certifModel");

    const [modelColor, setModelColor] = useState(data ? data.color : "#FEBD15");
    const [selectedSugg, setSelectedSugg] = useState(-1);
    const loading = false;

    const contentBtns = [
        {name: '{patient}', title: 'patient', desc: "Nom du patient"},
        {name: '{doctor}', title: 'doctor', desc: "Nom du doctor"},
        {name: '{aujourd\'hui}', title: 'today', desc: "Date aujourd'hui"},
    ];

    const {data: httpSuggestions} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/default-document`
    }, ReactQueryNoValidateConfig);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, t("nameReq"))
            .max(50, t("ntl"))
            .required(t("nameReq")),
        folder: Yup.string()
            .min(3, t("nameReq"))
            .max(50, t("ntl"))
            .required(t("nameReq")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: data?.title ?? "",
            folder: data?.folder ?? "",
            content: data?.content ?? ""
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("values");
        },
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = formik;

    const handleOnSubmit = useCallback(() => {
        onSubmit();
    }, [onSubmit]);

    const addVal = (val: string) => {
        (window as any).tinymce.execCommand('mceInsertContent', false, val);
    }

    const handleSubmitData = () => {
        const form = new FormData();
        form.append('content', values.content);
        form.append('color', modelColor);
        form.append('title', values.title);
        values.folder?.length > 0 && form.append('folder', values.folder);
        let url = `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`
        if (editDoc) {
            url = `${urlMedicalProfessionalSuffix}/certificate-modals/${data.uuid}/${router.locale}`
        }
        triggerSettingsModel({
            method: editDoc ? "PUT" : "POST",
            url,
            data: form,
        }, {
            onSuccess: () => {
                closeDraw();
                handleOnSubmit();
                enqueueSnackbar(t(data ? "updated" : "created"), {variant: 'success'})
            }
        });
    }
    const suggestions = (httpSuggestions as HttpResponse)?.data ?? [];

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <Box>
            {action === "showDoc" ? <Box padding={5}>
                    <PreviewA4  {...{
                        eventHandler: null,
                        data: isDefault?.header.data,
                        values: isDefault?.header.header,
                        state: {
                            content: data.content,
                            description: "",
                            doctor: "",
                            name: "certif",
                            patient: "Patient",
                            title: data.title,
                            type: "write_certif"
                        },
                        loading
                    }} />
                </Box> :
                <FormikProvider value={formik}>
                    <Box style={{marginTop: 20, marginRight: 20, marginLeft: 20}}>
                        <Typography variant="h6">
                            {editDoc ? t("titleEditDoc") : t("titleAddDoc")}
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={400}
                            gutterBottom>
                            {t("info")}
                        </Typography>
                    </Box>

                    {suggestions.length > 0 && <><Box style={{marginTop: 20, marginRight: 20, marginLeft: 20}}>
                        <Typography
                            variant="body2"
                            marginTop={2}
                            marginBottom={1}
                            gutterBottom>
                            {t("suggestions")}
                        </Typography>

                        <Box style={{overflowX: "auto", marginBottom: 10, maxWidth: 570}}>
                            <Stack direction={"row"} spacing={1} mt={2} mb={2} alignItems={"center"}>
                                {suggestions.map((sug: any, index: number) => (
                                    <div key={`sug${index}`}>
                                        <Card style={{
                                            width: "fit-content",
                                            border: selectedSugg === index ? `2px solid${theme.palette.primary.main}` : ''
                                        }}
                                              onClick={() => {
                                                  setFieldValue("title", sug.title)
                                                  setModelColor(sug.color)
                                                  setFieldValue('content', sug.content)
                                                  setSelectedSugg(index);
                                              }}>
                                            <Stack direction={"row"} spacing={1} padding={2}>
                                                <ModelDot
                                                    key={sug.color}
                                                    color={sug.color}
                                                    size={20}
                                                    sizedot={12}
                                                    padding={3} marginRight={5}
                                                    selected={false}/>
                                                <Typography variant="body2" style={{cursor: "pointer"}}>
                                                    {sug.title}
                                                </Typography>
                                            </Stack>
                                        </Card>
                                    </div>

                                ))}
                            </Stack>
                        </Box>
                    </Box>

                        <Box style={{marginRight: 20, marginLeft: 20}}>
                            <Typography
                                variant="body2"
                                marginTop={2}
                                marginBottom={1}
                                gutterBottom>
                                {t("info")}
                                {selectedSugg > -1 && <span onClick={
                                    () => {
                                        setSelectedSugg(-1)
                                        setFieldValue("title", "")
                                        setModelColor("")
                                        setFieldValue('content', "")
                                    }}
                                                            style={{
                                                                color: theme.palette.primary.main,
                                                                cursor: "pointer"
                                                            }}>{` ${suggestions[selectedSugg]?.title}`} (x)</span>}
                            </Typography>
                        </Box></>}
                    <Card style={{margin: 20, marginBottom: 60, maxWidth: 650}}>
                        <CardContent>
                            <Typography
                                variant="body2"
                                marginTop={2}
                                marginBottom={1}
                                gutterBottom>
                                {t("name")}
                            </Typography>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                helperText={touched.title && errors.title as string}
                                {...getFieldProps("title")}
                                error={Boolean(touched.title && errors.title)}/>

                            <Typography
                                marginTop={2}
                                marginBottom={1}
                                fontSize={12}>{t('dir')}</Typography>
                            <Select
                                sx={{width: "100%"}}
                                size={"small"}
                                {...getFieldProps("folder")}>
                                {certificateFolderModel.map((folder: any, index: number) => <MenuItem
                                    key={index}
                                    value={folder.uuid}>{folder.name}</MenuItem>)}
                            </Select>

                            <Typography
                                variant="body2"
                                marginTop={2}
                                marginBottom={1}
                                gutterBottom>
                                {t("selectColor")}
                            </Typography>

                            <Stack spacing={1} direction={"row"}>
                                {colors.map((color) => (
                                    <ModelDot
                                        key={color}
                                        color={color}
                                        onClick={() => {
                                            setModelColor(color);
                                        }}
                                        selected={color === modelColor}></ModelDot>
                                ))}
                            </Stack>
                            <Typography
                                variant="body2"
                                marginTop={2}
                                marginBottom={1}
                                gutterBottom>
                                {t("content")}
                            </Typography>

                            {contentBtns.map(cb => (<Tooltip key={cb.name} title={t(`${cb.title}_placeholder`)}>
                                <Button style={{marginBottom: 5}} onClick={() => {
                                    addVal(cb.name)
                                }} size={"small"}> <AddIcon/> {t(`${cb.title}`)}</Button>
                            </Tooltip>))}

                            <Editor
                                value={getFieldProps("content").value}
                                apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                                onEditorChange={(res) => {
                                    setFieldValue('content', res)
                                }}
                                init={{
                                    branding: false,
                                    statusbar: false,
                                    menubar: false,
                                    plugins: tinymcePlugins,
                                    toolbar: tinymceToolbar,
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                }}
                            />

                        </CardContent>
                    </Card>
                    <PaperStyled
                        autoComplete="off"
                        noValidate
                        className="root"
                        onSubmit={handleSubmit}>
                        <Stack
                            className="bottom-section"
                            justifyContent="flex-end"
                            spacing={2}
                            direction={"row"}>
                            <Button onClick={props.closeDraw}>{t("cancel")}</Button>
                            <Button
                                onClick={handleSubmitData}
                                disabled={loading}
                                variant="contained"
                                color="primary">
                                {t("save")}
                            </Button>
                        </Stack>
                    </PaperStyled>
                </FormikProvider>}

        </Box>
    );
}

export default CertifModelDrawer;
