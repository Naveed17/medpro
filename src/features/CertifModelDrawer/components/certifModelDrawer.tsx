import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import dynamic from "next/dynamic";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import ItemCheckboxPF from "@themes/overrides/itemCheckboxPF";
import {LoadingScreen} from "@features/loadingScreen";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import ReactDOM from "react-dom/client";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {SearchInput} from "@features/input";
import {useSWRConfig} from "swr";
import {Editor} from '@tinymce/tinymce-react';

const FormBuilder: any = dynamic(
    () => import("@formio/react").then((mod: any) => mod.Form),
    {
        ssr: false,
    }
);

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: "#F0F7FA",
    borderRadius: 0,
    minWidth: "650px",
    height: "100%",
    border: "none",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
    },
    "& .container": {
        maxHeight: 680,
        overflowY: "auto",
        "& .MuiCard-root": {
            border: "none",
            "& .MuiCardContent-root": {
                padding: theme.spacing(2),
            },
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        position: "fixed",
        width: "650px",
        bottom: 0,
        borderTop: `3px solid ${theme.palette.grey["A700"]}`,
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
    "& fieldset legend": {
        display: "none",
    },
}));

function CertifModelDrawer({...props}) {
    const {data: session} = useSession();
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {mutate} = useSWRConfig();

    const {data,action}= props;
    console.log(data);

    const {t, ready} = useTranslation("settings", {keyPrefix: "templates.config.dialog"});

    const colors = [
        "#FEBD15",
        "#FF9070",
        "#DF607B",
        "#9A5E8A",
        "#526686",
        "#96B9E8",
        "#72D0BE",
        "#56A97F",
    ];
    const [modelColor, setModelColor] = useState(data ? data.color : "#FEBD15");
    const [loading, setLoading] = useState(false);
    const [components, setComponents] = useState<any[]>([]);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("nameReq"))
            .max(50, t("ntl"))
            .required(t("nameReq")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: data ? (data.title as string) : "",
            content:data ? (data.content as string) : "",
        },
        validationSchema,
        onSubmit: async (values) => {

        },
    });

    const {
        errors,
        touched,
        handleSubmit,
        getFieldProps,
    } = formik;

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <Box style={{background: "black"}}>
            {action === "see" && (
                <FormikProvider value={formik}>
                    <PaperStyled
                        autoComplete="off"
                        noValidate
                        className="root"
                        onSubmit={handleSubmit}>
                        <Stack spacing={2} direction="row" sx={{marginBottom: "2rem"}}>
                            <ModelDot
                                key={modelColor}
                                color={modelColor}
                                selected={false}></ModelDot>
                            <Typography variant="h6" gutterBottom>
                                {t("title") + data.label}
                            </Typography>
                        </Stack>

                        <FormBuilder
                            form={{
                                display: "form",
                                components: components,
                            }}
                        />
                    </PaperStyled>
                </FormikProvider>
            )}
            {action !== "see" && (
                <FormikProvider value={formik}>
                    <PaperStyled
                        autoComplete="off"
                        noValidate
                        className="root"
                        onSubmit={handleSubmit}>
                        <Typography variant="h6" gutterBottom>
                            {data ? t("titleEdit") : t("titleAdd")}
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={400}
                            margin={"16px 0"}
                            gutterBottom>
                            {t("info")}
                        </Typography>

                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <FormControl size="small" fullWidth>
                                        <Typography
                                            variant="body2"
                                            marginTop={2}
                                            marginBottom={1}
                                            gutterBottom>
                                            {t("named")}
                                        </Typography>

                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            helperText={touched.title && errors.title}
                                            {...getFieldProps("name")}
                                            error={Boolean(touched.title && errors.title)}></TextField>

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

                                        <Editor
                                            value={""}
                                            apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                                            onEditorChange={(res) => {
                                                data.state.content = res;
                                                data.setState(data.state)
                                               // setValue(res)
                                            }}
                                            init={{
                                                branding: false,
                                                statusbar: false,
                                                menubar: false,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen textcolor',
                                                    'insertdatetime media table paste code help wordcount'
                                                ],
                                                toolbar: 'undo redo | formatselect | ' +
                                                    'bold italic backcolor forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | '
                                                    ,
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                            }}
/>
                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>


                        <div style={{height: 70}}></div>

                        <Stack
                            className="bottom-section"
                            justifyContent="flex-end"
                            spacing={2}
                            direction={"row"}>
                            <Button onClick={props.closeDraw}>{t("cancel")}</Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="contained"
                                color="primary">
                                {t("save")}
                            </Button>
                        </Stack>
                    </PaperStyled>
                </FormikProvider>
            )}
        </Box>
    );
}

export default CertifModelDrawer;
