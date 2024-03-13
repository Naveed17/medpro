import {FormikProvider, useFormik} from "formik";
import PaperStyled from "./overrides/PaperStyled";
import {
    Autocomplete,
    Button,
    CircularProgress, DialogActions,
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
import _ from "lodash";

function AddDepartmentDialog({...props}) {
    const router = useRouter();
    const {data} = props.data;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {enqueueSnackbar} = useSnackbar();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t} = useTranslation("departments");

    const [openAutoCompleteUser, setOpenAutoCompleteUser] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingReqUser, setLoadingReqUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openAutoCompleteAssignedUser, setOpenAutoCompleteAssignedUser] = useState(false);
    const [loadingReqAssignedUser, setLoadingReqAssignedUser] = useState(false);
    const [assignedUser, setAssignedUser] = useState<UserModel[]>([]);

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
            staff: data ? data.assigned : [],
            status: data ? data.status === 1 : true
        },
        validationSchema,
        onSubmit: async (values) => {
            const form = new FormData();
            form.append("name", values.name);
            form.append("medicalEntityHasUser", (values.user as any)?.uuid);
            form.append("status", values.status ? "1" : "0");
            form.append("assigned", _.map(values.staff, "uuid").join(","));
            addDepartmentTrigger({
                method: data ? "PUT" : "POST",
                url: `${urlMedicalEntitySuffix}/admin/departments/${data ? `${data.uuid}/` : ""}${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    enqueueSnackbar(t(`dialogs.department-dialog.alert.${data ? "update-success" : "add-success"}`), {variant: "success"})
                    invalidateQueries([`${urlMedicalEntitySuffix}/admin/departments/${router.locale}`]);
                    setLoading(false);
                    props.data.closeDraw();
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
    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteAssignedUser) {
            return undefined;
        }

        (async () => {
            setLoadingReqAssignedUser(true);
            getUsersTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/admin/users/${router.locale}`
            }, {
                onSuccess: (result) => {
                    setAssignedUser((result?.data as HttpResponse)?.data ?? []);
                    setLoadingReqAssignedUser(false);
                }
            });
        })();
    }, [openAutoCompleteAssignedUser]); // eslint-disable-line react-hooks/exhaustive-deps

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
                            noOptionsText={t("dialogs.department-dialog.no_users")}
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

                    <Typography fontWeight={600} fontSize={18}>
                        {t("dialogs.department-dialog.add-staff")}
                    </Typography>

                    <Grid item md={12} xs={12} mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom>
                            {t("dialogs.department-dialog.assignedUser")}
                        </Typography>
                        <Autocomplete
                            size={"small"}
                            value={values.staff}
                            multiple
                            disableClearable
                            sx={{
                                maxHeight: 35,
                                "& .MuiSelect-select": {
                                    background: "white",
                                }
                            }}
                            id="profile-select"
                            open={openAutoCompleteAssignedUser}
                            onOpen={() => setOpenAutoCompleteAssignedUser(true)}
                            onClose={() => setOpenAutoCompleteAssignedUser(false)}
                            onChange={(e, staff) => setFieldValue("staff", staff)}
                            getOptionLabel={(option: any) => option?.userName ?? ""}
                            filterOptions={(options, {inputValue}) => options.filter(item => item.firstName?.includes(inputValue) || item.lastName?.includes(inputValue))}
                            isOptionEqualToValue={(option: any, value) => option?.uuid === value?.uuid}
                            options={assignedUser}
                            noOptionsText={t("dialogs.department-dialog.no_assignedUser")}
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
                                    placeholder={t("dialogs.department-dialog.assignedUser-placeholder")}
                                    helperText={(touched.user && errors.user) as any}
                                    error={Boolean(touched.user && errors.user)}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loadingReqAssignedUser ?
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
                        width={"100%"}
                        justifyContent="space-between"
                        spacing={2}
                        direction={"row"}>
                        <Button
                            variant={"text-black"}
                            onClick={props.data.closeDraw}>
                            {t("dialogs.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            disabled={values.name?.length === 0 || Object.keys(errors).length > 0}
                            type="submit" variant="contained" color="primary">
                            {t("dialogs.department-dialog.save")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </PaperStyled>
        </FormikProvider>
    )
}

export default AddDepartmentDialog;
