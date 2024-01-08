import * as Yup from "yup";
import {useFormik, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    TextField,
    Button,

} from "@mui/material";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";

import {useSnackbar} from "notistack";
import {useInvalidateQueries} from "@lib/hooks";
import {LoadingButton} from "@mui/lab";
import PaperStyled from "./overrides/paperStyled";

function DrugsDrawer({...props}) {
    const {data, t} = props;
    const {enqueueSnackbar} = useSnackbar();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const {trigger: triggerDrugsAdd} = useRequestQueryMutation("/settings/drugs/add");

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("drawer.required.ntc"))
            .max(50, t("drawer.required.ntl"))
            .required(t("drawer.required.name")),
        dci: Yup.string().nullable(),
        form: Yup.string().nullable(),
        laboratory: Yup.string().nullable()
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: data ? (data.commercial_name as string) : "",
            dci: data ? data.dci : null,
            form: data ? data.form : null,
            laboratory: data ? data.laboratory : null,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const form = new FormData();
            form.append("commercial_name", values.name);
            form.append("dosages", "[]");
            form.append("dci", values.dci || "");
            form.append("form", values.form || "");
            form.append("laboratory", values.laboratory || "");

            triggerDrugsAdd({
                method: data ? "PUT" : "POST",
                url: `/api/private/drugs/${data ? `${data.uuid}/` : ""}${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    enqueueSnackbar(t(`alert.${data ? "edit" : "add"}`), {variant: "success"});
                    invalidateQueries([`/api/private/drugs/${router.locale}`]);
                    props.closeDraw();
                    setLoading(false);
                }
            });
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
                                    placeholder={t("drawer.type_drug_name")}
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
                                    {t("table.dci")}{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t("drawer.type_drug_dci")}
                                    required
                                    fullWidth
                                    value={values.dci ?? ""}
                                    onChange={(e) => setFieldValue("dci", e.target.value)}
                                    helperText={(touched.dci && errors.dci) as any}
                                    error={Boolean(touched.dci && errors.dci)}
                                />
                            </Stack>
                            <Stack width={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom>
                                    {t("table.form")}{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t("drawer.type_drug_form")}
                                    required
                                    fullWidth
                                    value={values.form ?? ""}
                                    onChange={(e) => setFieldValue("form", e.target.value)}
                                    helperText={(touched.form && errors.form) as any}
                                    error={Boolean(touched.form && errors.form)}
                                />
                            </Stack>
                            <Stack width={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom>
                                    {t("table.laboratory")}{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t("drawer.type_drug_laboratory")}
                                    required
                                    fullWidth
                                    value={values.laboratory ?? ""}
                                    onChange={(e) => setFieldValue("laboratory", e.target.value)}
                                    helperText={(touched.laboratory && errors.laboratory) as any}
                                    error={Boolean(touched.laboratory && errors.laboratory)}
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
                    <LoadingButton
                        {...{loading}}
                        disabled={values.name.length === 0 || Object.keys(errors).length > 0}
                        type="submit" variant="contained" color="primary">
                        {t("drawer.save")}
                    </LoadingButton>
                </Stack>
            </PaperStyled>
        </FormikProvider>
    );
}

export default DrugsDrawer;
