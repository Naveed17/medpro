import {FormikProvider, useFormik} from "formik";
import PaperStyled from "./overrides/PaperStyled";
import {
    Autocomplete,
    Button,
    CircularProgress,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import {useRequestQueryMutation} from "@lib/axios";
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {CustomSwitch} from "@features/buttons";
import {useSnackbar} from "notistack";

function AddDepartmentDialog({...props}) {
    const router = useRouter();
    const {data} = props;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {enqueueSnackbar} = useSnackbar();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t} = useTranslation("departments");

    const [openAutoCompleteUser, setOpenAutoCompleteUser] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingReqUser, setLoadingReqUser] = useState(false);
    const [loading, setLoading] = useState(false);

    const {trigger: getUsersTrigger} = useRequestQueryMutation("/department/users/get");
    const {trigger: addDepartmentTrigger} = useRequestQueryMutation("/department/add");

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("drawer.required.ntc"))
            .max(50, t("drawer.required.ntl"))
            .required(t("drawer.required.name")),
        status: Yup.boolean(),
        user: Yup.object().shape({
            uuid: Yup.string(),
            name: Yup.string()
        }).nullable()
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: data ? data.name : "",
            user: data ? data.headOfService : null,
            status: data ? data.status === 1 : true
        },
        validationSchema,
        onSubmit: async (values) => {
            const form = new FormData();
            form.append("name", values.name);
            form.append("medicalEntityHasUser", (values.user as any)?.uuid);
            form.append("status", values.status ? "1" : "0");
            addDepartmentTrigger({
                method: data ? "PUT" : "POST",
                url: `${urlMedicalEntitySuffix}/admin/departments/${data ? `${data.uuid}/` : ""}${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    enqueueSnackbar(t(`dialogs.department-dialog.alert.${data ? "update-success" : "add-success"}`), {variant: "success"})
                    invalidateQueries([`${urlMedicalEntitySuffix}/admin/departments/${router.locale}`]);
                    setLoading(false);
                    props.closeDraw();
                },
                onError: () => setLoading(false)
            });
        },
    });
    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteUser) {
            return undefined;
        }

        (async () => {
            setLoadingReqUser(true);
            getUsersTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/admin/users/${router.locale}?professionals=true`
            }, {
                onSuccess: (result) => {
                    setUsers((result?.data as HttpResponse)?.data ?? []);
                    setLoadingReqUser(false);
                }
            });
        })();
    }, [openAutoCompleteUser]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue
    } = formik;

    return (
        <FormikProvider value={formik}>
            <PaperStyled
                autoComplete="off"
                noValidate
                className="root"
                onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    {t("dialogs.department-dialog.title")}
                </Typography>

                <Grid container spacing={1}>
                    <Grid item md={12} xs={12}>
                        <Typography variant="body2" color="text.secondary" mt={3} mb={1}>
                            {t("dialogs.department-dialog.name")}
                        </Typography>
                        <FormControl fullWidth size="small">
                            <TextField
                                {...getFieldProps("name")}
                                fullWidth
                                placeholder={t("dialogs.department-dialog.name-placeholder")} variant="outlined"/>
                        </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom>
                            {t("dialogs.department-dialog.user")}
                        </Typography>
                        <Autocomplete
                            size={"small"}
                            value={values.user ?? null}
                            disableClearable
                            sx={{
                                maxHeight: 35,
                                "& .MuiSelect-select": {
                                    background: "white",
                                }
                            }}
                            id="profile-select"
                            open={openAutoCompleteUser}
                            onOpen={() => setOpenAutoCompleteUser(true)}
                            onClose={() => setOpenAutoCompleteUser(false)}
                            onChange={(e, user) => setFieldValue("user", user)}
                            getOptionLabel={(option: any) => option?.uuid ? `${option?.firstName} ${option?.lastName}` : ""}
                            isOptionEqualToValue={(option: any, value) => option?.uuid === value?.uuid}
                            options={users}
                            renderOption={(props, option) => (
                                <ListItem {...props}>
                                    <ListItemText primary={`${option?.firstName} ${option?.lastName}`}/>
                                </ListItem>
                            )}
                            renderInput={params =>
                                <TextField
                                    {...params}
                                    color={"info"}
                                    sx={{paddingLeft: 0}}
                                    placeholder={t("dialogs.department-dialog.user-placeholder")}
                                    helperText={(touched.user && errors.user) as any}
                                    error={Boolean(touched.user && errors.user)}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loadingReqUser ?
                                                    <CircularProgress color="inherit" size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    variant="outlined"
                                    fullWidth/>}
                        />
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                            <Typography variant="body2" color="text.secondary" my={3}>
                                {t("dialogs.department-dialog.status")}
                            </Typography>
                            <CustomSwitch
                                className="custom-switch"
                                name="active"
                                onChange={(e) => {
                                    setFieldValue("status", e.target.checked)
                                }}
                                checked={values.status}
                            />
                        </Stack>

                    </Grid>
                </Grid>
                <Stack
                    className="bottom-section"
                    justifyContent="flex-end"
                    spacing={2}
                    direction={"row"}>
                    <Button onClick={props.closeDraw}>
                        {t("dialogs.department-dialog.cancel")}
                    </Button>
                    <LoadingButton
                        {...{loading}}
                        disabled={values.name?.length === 0 || Object.keys(errors).length > 0}
                        type="submit" variant="contained" color="primary">
                        {t("dialogs.department-dialog.save")}
                    </LoadingButton>
                </Stack>
            </PaperStyled>
        </FormikProvider>
    )
}

export default AddDepartmentDialog;
