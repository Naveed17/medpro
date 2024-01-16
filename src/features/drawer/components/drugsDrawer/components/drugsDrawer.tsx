import * as Yup from "yup";
import {useFormik, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    TextField,
    Button, ListItem, ListItemText, CircularProgress, Autocomplete,

} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";

import {useSnackbar} from "notistack";
import {useInvalidateQueries, useMedicalProfessionalSuffix} from "@lib/hooks";
import {LoadingButton} from "@mui/lab";
import PaperStyled from "./overrides/paperStyled";

function DrugsDrawer({...props}) {
    const {data, t} = props;
    const {enqueueSnackbar} = useSnackbar();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const [loadingReqForm, setLoadingReqForm] = useState(false);
    const [loadingReqDci, setLoadingReqDci] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openAutoCompleteForm, setOpenAutoCompleteForm] = useState(false);
    const [openAutoCompleteLaboratory, setOpenAutoCompleteLaboratory] = useState(false);
    const [openAutoCompleteDci, setOpenAutoCompleteDci] = useState(false);
    const [forms, setForms] = useState([]);
    const [laboratorys, setLaboratorys] = useState([]);
    const [dcis, setDcis] = useState([]);

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
            dci: data.dci?.uuid ?? null,
            form: data.form?.uuid ?? null,
            laboratory: data.laboratory?.uuid ?? null
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const form = new FormData();
            form.append("name", values.name);
            form.append("dosages", "[]");
            form.append("dci", values.dci || " ");
            form.append("form", values.form || " ");
            form.append("laboratory", values.laboratory || " ");

            triggerDrugsAdd({
                method: data ? "PUT" : "POST",
                url: `${urlMedicalProfessionalSuffix}/drugs/${data ? `${data.uuid}/` : ""}${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    enqueueSnackbar(t(`alert.${data ? "edit" : "add"}`), {variant: "success"});
                    invalidateQueries([`${urlMedicalProfessionalSuffix}/drugs/${router.locale}`]);
                    props.closeDraw();
                },
                onSettled: () => setLoading(false)
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

    const {trigger: drugsTrigger} = useRequestQueryMutation("/settings/drugs/get");

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteForm) {
            return undefined;
        }

        (async () => {
            setLoading(true);
            drugsTrigger({
                method: "GET",
                url: `/api/private/drugs-forms`
            }, {
                onSuccess: (result) => {
                    setForms((result?.data as HttpResponse)?.data);
                    setLoading(false);
                }
            });
        })();
    }, [openAutoCompleteForm]); // eslint-disable-line react-hooks/exhaustive-deps

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteLaboratory) {
            return undefined;
        }

        (async () => {
            setLoadingReqForm(true);
            drugsTrigger({
                method: "GET",
                url: `/api/private/laboratories`
            }, {
                onSuccess: (result) => {
                    setLaboratorys((result?.data as HttpResponse)?.data);
                    setLoadingReqForm(false);
                }
            });
        })();
    }, [openAutoCompleteLaboratory]); // eslint-disable-line react-hooks/exhaustive-deps

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteDci) {
            return undefined;
        }

        (async () => {
            setLoadingReqDci(true);
            drugsTrigger({
                method: "GET",
                url: `/api/private/dcis`
            }, {
                onSuccess: (result) => {
                    setDcis((result?.data as HttpResponse)?.data);
                    setLoadingReqDci(false);
                }
            });
        })();
    }, [openAutoCompleteDci]); // eslint-disable-line react-hooks/exhaustive-deps

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
                                <Autocomplete
                                    size={"small"}
                                    value={dcis.find((dci: any) => dci?.uuid === values.dci) ?? null}
                                    disableClearable
                                    sx={{
                                        maxHeight: 35,
                                        "& .MuiSelect-select": {
                                            background: "white",
                                        }
                                    }}
                                    id="profile-select"
                                    open={openAutoCompleteDci}
                                    onOpen={() => setOpenAutoCompleteDci(true)}
                                    onClose={() => setOpenAutoCompleteDci(false)}
                                    onChange={(e, dci) => setFieldValue("dci", dci?.uuid)}
                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                                    options={dcis}
                                    renderOption={(props, option) => (
                                        <ListItem {...props}>
                                            <ListItemText primary={option?.name}/>
                                        </ListItem>
                                    )}
                                    renderInput={params =>
                                        <TextField
                                            {...params}
                                            color={"info"}
                                            sx={{paddingLeft: 0}}
                                            placeholder={t("drawer.type_drug_dci")}
                                            helperText={(touched.dci && errors.dci) as any}
                                            error={Boolean(touched.dci && errors.dci)}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingReqDci ?
                                                            <CircularProgress color="inherit" size={20}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                            variant="outlined"
                                            fullWidth/>}
                                />
                            </Stack>
                            <Stack width={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom>
                                    {t("table.form")}{" "}
                                </Typography>
                                <Autocomplete
                                    size={"small"}
                                    value={forms.find((form: any) => form?.uuid === values.form) ?? null}
                                    disableClearable
                                    sx={{
                                        maxHeight: 35,
                                        "& .MuiSelect-select": {
                                            background: "white",
                                        }
                                    }}
                                    id="profile-select"
                                    open={openAutoCompleteForm}
                                    onOpen={() => setOpenAutoCompleteForm(true)}
                                    onClose={() => setOpenAutoCompleteForm(false)}
                                    onChange={(e, form) => setFieldValue("form", form?.uuid)}
                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                                    options={forms}
                                    renderOption={(props, option) => (
                                        <ListItem {...props}>
                                            <ListItemText primary={option?.name}/>
                                        </ListItem>
                                    )}
                                    renderInput={params =>
                                        <TextField
                                            {...params}
                                            color={"info"}
                                            sx={{paddingLeft: 0}}
                                            placeholder={t("drawer.type_drug_form")}
                                            helperText={(touched.form && errors.form) as any}
                                            error={Boolean(touched.form && errors.form)}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loading ?
                                                            <CircularProgress color="inherit" size={20}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                            variant="outlined"
                                            fullWidth/>}
                                />
                            </Stack>
                            <Stack width={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom>
                                    {t("table.laboratory")}{" "}
                                </Typography>
                                <Autocomplete
                                    size={"small"}
                                    value={laboratorys.find((laboratory: any) => laboratory?.uuid === values.form) ?? null}
                                    disableClearable
                                    sx={{
                                        maxHeight: 35,
                                        "& .MuiSelect-select": {
                                            background: "white",
                                        }
                                    }}
                                    id="laboratory-select"
                                    open={openAutoCompleteLaboratory}
                                    onOpen={() => setOpenAutoCompleteLaboratory(true)}
                                    onClose={() => setOpenAutoCompleteLaboratory(false)}
                                    onChange={(e, laboratory) => setFieldValue("laboratory", laboratory?.uuid)}
                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                                    options={laboratorys}
                                    renderOption={(props, option) => (
                                        <ListItem {...props}>
                                            <ListItemText primary={option?.name}/>
                                        </ListItem>
                                    )}
                                    renderInput={params =>
                                        <TextField
                                            {...params}
                                            color={"info"}
                                            sx={{paddingLeft: 0}}
                                            placeholder={t("drawer.type_drug_laboratory")}
                                            helperText={(touched.laboratory && errors.laboratory) as any}
                                            error={Boolean(touched.laboratory && errors.laboratory)}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingReqForm ?
                                                            <CircularProgress color="inherit" size={20}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                            variant="outlined"
                                            fullWidth/>}
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
                        disabled={values.name?.length === 0 || Object.keys(errors).length > 0}
                        type="submit" variant="contained" color="primary">
                        {t("drawer.save")}
                    </LoadingButton>
                </Stack>
            </PaperStyled>
        </FormikProvider>
    );
}

export default DrugsDrawer;
