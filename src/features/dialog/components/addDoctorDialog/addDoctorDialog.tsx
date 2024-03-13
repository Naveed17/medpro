import {FormikProvider, useFormik} from "formik";
import PaperStyled from "./overrides/PaperStyled";
import Grid from "@mui/material/Grid";
import {
    Button,
    CircularProgress,
    DialogActions,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import Autocomplete from "@mui/material/Autocomplete";
import {useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import * as Yup from "yup";

function AddDoctorDialog({...props}) {
    const {data} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation("doctors");

    const [openAutoCompleteDepartment, setOpenAutoCompleteDepartment] = useState(false);
    const [loadingReqDepartment, setLoadingReqDepartment] = useState(false);
    const [departments, setDepartments] = useState<DepartmentModel[]>([]);
    const [loading, setLoading] = useState(false);

    const {trigger: getDepartmentTrigger} = useRequestQueryMutation("/admin/users/department");

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, t("config.add-patient.country-error")).required(),
        lastName: Yup.string().min(2, t("config.add-patient.region-error")).required(),
        email: Yup.string().email().required(),
        departments: Yup.array().of(
            Yup.object().shape({
                uuid: Yup.string(),
                name: Yup.string()
            })),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            departments: []
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("values", values);
        }
    });

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteDepartment) {
            return undefined;
        }

        (async () => {
            setLoadingReqDepartment(true);
            getDepartmentTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/admin/departments/${router.locale}`
            }, {
                onSuccess: (result) => {
                    setDepartments((result?.data as HttpResponse)?.data);
                    setLoadingReqDepartment(false);
                }
            });
        })();
    }, [openAutoCompleteDepartment]); // eslint-disable-line react-hooks/exhaustive-deps

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
                <Grid container spacing={1}>
                    <Grid item md={12} xs={12}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            {t("dialogs.doctor-dialog.firstName")}
                            <Typography color='error' variant='caption'>*</Typography>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <TextField
                                {...getFieldProps("firstName")}
                                fullWidth
                                placeholder={t("dialogs.doctor-dialog.firstName-placeholder")} variant="outlined"/>
                        </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            {t("dialogs.doctor-dialog.lastName")}
                            <Typography color='error' variant='caption'>*</Typography>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <TextField
                                {...getFieldProps("lastName")}
                                fullWidth
                                placeholder={t("dialogs.doctor-dialog.lastName-placeholder")} variant="outlined"/>
                        </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            {t("dialogs.doctor-dialog.email")}
                            <Typography color='error' variant='caption'>*</Typography>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <TextField
                                {...getFieldProps("email")}
                                fullWidth
                                placeholder={t("dialogs.doctor-dialog.email-placeholder")} variant="outlined"/>
                        </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            {t("dialogs.doctor-dialog.department")}
                        </Typography>

                        <Autocomplete
                            size={"small"}
                            value={values.departments}
                            multiple
                            noOptionsText={t("dialogs.doctor-dialog.no-department")}
                            disableClearable
                            sx={{
                                width: "100%",
                                "& .MuiSelect-select": {
                                    background: "white",
                                }
                            }}
                            id="department-select"
                            open={openAutoCompleteDepartment}
                            onOpen={() => setOpenAutoCompleteDepartment(true)}
                            onClose={() => setOpenAutoCompleteDepartment(false)}
                            onChange={(e, department) => setFieldValue("departments", department)}
                            getOptionLabel={(option: any) => option?.name ?? ""}
                            isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                            options={departments}
                            renderOption={(props, option) => (
                                <ListItem {...props}>
                                    <ListItemText primary={option?.name ?? ""}/>
                                </ListItem>
                            )}
                            renderInput={params =>
                                <TextField
                                    {...params}
                                    color={"info"}
                                    sx={{paddingLeft: 0}}
                                    placeholder={t("dialogs.doctor-dialog.department-placeholder")}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loadingReqDepartment ?
                                                    <CircularProgress color="inherit" size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    variant="outlined"
                                    fullWidth/>}
                        />
                    </Grid>
                </Grid>
                <DialogActions>
                    <Stack
                        mt={2}
                        width={"100%"}
                        justifyContent="space-between"
                        spacing={2}
                        direction={"row"}>
                        <Button
                            variant={"text-black"}
                            onClick={data.closeDraw}>
                            {t("dialogs.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            disabled={Object.keys(errors).length > 0}
                            type="submit" variant="contained" color="primary">
                            {t("dialogs.doctor-dialog.save")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </PaperStyled>
        </FormikProvider>
    )
}

export default AddDoctorDialog;
