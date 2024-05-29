import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    TextField,
    Button,

} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";

import {useSnackbar} from "notistack";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {LoadingButton} from "@mui/lab";

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
    height: "100%",
    border: "none",
    minWidth: "650px",
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
        width: "100%",
    },
    boxShadow: theme.customShadows.motifDialog,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
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
    ".react-svg": {
        svg: {
            width: 20,
            height: 20,
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: "auto",
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        borderTop: `3px solid ${theme.palette.grey["A700"]}`,
    },
}));

function MedicalImagingDrawer({...props}) {
    const {mutateEvent,data,t} = props;
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {trigger: triggerMedicalImagingAdd} = useRequestQueryMutation("/settings/medical-imaging/add");
    const {trigger: triggerMedicalImagingUpdate} = useRequestQueryMutation("/settings/medical-imaging/update");
     const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
     const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("drawer.required.ntc"))
            .max(50, t("drawer.required.ntl"))
            .required(t("drawer.required.name")),
            abbreviation: Yup.string()
            .min(2, t("drawer.required.ntc"))
            .max(10, t("drawer.required.ntl"))
            .required(t("drawer.required.abbreviation")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: data ? (data.name as string) : "",
            abbreviation: data ? data.abbreviation : null,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const form = new FormData();
            form.append("name",  values.name);
            form.append("abbreviation", values.abbreviation || null);
            form.append("specialities", "");
            if (data) {
                urlMedicalProfessionalSuffix && triggerMedicalImagingUpdate({
                    method: "PUT",
                    url: `${urlMedicalProfessionalSuffix}/medical-imaging/${data.uuid}/${router.locale}`,
                    data: form
                }, {
                    onSuccess: () => {
                        enqueueSnackbar(t(`alert.edit`), {variant: "success"});
                        mutateEvent();
                        props.closeDraw();
                        setLoading(false);
                    }
                });
            } else {
                urlMedicalProfessionalSuffix && triggerMedicalImagingAdd({
                    method: "POST",
                    url: `${urlMedicalProfessionalSuffix}/medical-imaging/${router.locale}`,
                    data: form
                }, {
                    onSuccess: () => {
                        enqueueSnackbar(t(`alert.add`), {variant: "success"});
                        mutateEvent();
                        props.closeDraw();
                        setLoading(false);
                    }
                });
            }
        },
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
    } = formik;

    return (
        <FormikProvider value={formik}>
            <PaperStyled
                autoComplete="off"
                noValidate
                className="root"
                onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    {data
                        ? t("drawer.edit")
                        : t("drawer.add")}
                </Typography>
                <Typography
                    variant="body1"
                    fontWeight={400}
                    margin={"16px 0"}
                    gutterBottom>
                    {t("drawer.info")}
                </Typography>
                <Card sx={{height: 1, maxHeight: 400, overflowY: "auto"}}>
                    <CardContent>
                        <Stack spacing={2}>
                                <Stack width={1}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom>
                                        {t("drawer.nom")}{" "}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("drawer.type_analysis_name")}
                                        required
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        {...getFieldProps("name")}
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                </Stack>
                                <Stack width={1}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom>
                                        {t("drawer.abbreviation")}{" "}
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("drawer.type_analysis_abbreviation")}
                                        required
                                        fullWidth
                                        value={values.abbreviation ?? ""}
                                        onChange={(e) => setFieldValue("abbreviation",e.target.value)}
                                        helperText={(touched.abbreviation && errors.abbreviation) as any}
                                        error={Boolean(touched.abbreviation && errors.abbreviation)}

                                    />
                                </Stack>
                            </Stack>
                    </CardContent>
                </Card>
                <Stack
                    className="bottom-section"
                    justifyContent="flex-end"
                    spacing={2}
                    direction={"row"}>
                    <Button onClick={props.closeDraw}>
                        {t("drawer.cancel")}
                    </Button>
                    <LoadingButton {...{loading}} type="submit" variant="contained" color="primary">
                        {t("drawer.save")}
                    </LoadingButton>
                </Stack>
            </PaperStyled>
        </FormikProvider>
    );
}

export default MedicalImagingDrawer;
