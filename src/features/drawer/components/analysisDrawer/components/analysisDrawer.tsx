import * as Yup from "yup";
import {useFormik, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    TextField,
    Button
} from "@mui/material";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {LoadingButton} from "@mui/lab";
import PaperStyled from "./overrides/paperStyled";

function Analysis({...props}) {
    const {mutateEvent, data, t} = props;
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const [loading, setLoading] = useState(false);

    const {trigger: triggerAnalysisAdd} = useRequestQueryMutation("/settings/analysis/add");
    const {trigger: triggerAnalysisUpdate} = useRequestQueryMutation("/settings/analysis/update");

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
            form.append("name", values.name);
            form.append("abbreviation", values.abbreviation || null);
            form.append("unit", "123");
            if (data) {
                urlMedicalProfessionalSuffix && triggerAnalysisUpdate({
                    method: "PUT",
                    url: `${urlMedicalProfessionalSuffix}/analysis/${data.uuid}/${router.locale}`,
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
                urlMedicalProfessionalSuffix && triggerAnalysisAdd({
                    method: "POST",
                    url: `${urlMedicalProfessionalSuffix}/analysis/${router.locale}`,
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
                <Card sx={{height: "auto", overflowY: "auto"}}>
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
                                    {t("table.abbreviation")}{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t("drawer.type_analysis_abbreviation")}
                                    required
                                    fullWidth
                                    value={values.abbreviation ?? ""}
                                    onChange={(e) => setFieldValue("abbreviation", e.target.value)}
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

export default Analysis;
