import React, {useState} from "react";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import RootStyled from "./overrides/rootStyle";
import {Box, Button, FormControlLabel, Stack, Switch, TextField, Typography} from "@mui/material";
import IconClose from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useRequestQueryMutation} from "@lib/axios";
import {LoadingButton} from "@mui/lab";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import {useCashBox, usePermissions} from "@lib/hooks/rest";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {FeaturePermissionsCard} from "@features/card";

import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";

function AddNewRoleDialog({...props}) {
    const {data: {selected, handleClose}} = props;
    const {enqueueSnackbar} = useSnackbar();
    const {permissions: features} = usePermissions();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const {cashboxes} = useCashBox();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t} = useTranslation(["settings", "common"]);
    const {agendas} = useAppSelector(agendaSelector);

    const [loading, setLoading] = useState(false);

    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");

    const RoleSchema = Yup.object().shape({
        role_name: Yup.string().required(),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            role_name: selected?.name ?? "",
            description: selected?.description ?? "",
            is_standard: selected?.is_standard ?? true,
            roles: selected?.features?.map((data: any) => ({
                feature: data?.feature?.slug ?? "",
                featureUuid: data[data?.feature?.slug] ?? "",
                hasMultipleInstance: data?.feature?.hasProfile ?? false,
                featureRoles: data?.feature?.hasProfile ? (data?.feature?.slug === "cashbox" ? cashboxes : agendas) : [],
                featureProfiles: [],
                profileUuid: data?.profile ?? ""
            })) ?? [{
                feature: "",
                featureUuid: "",
                hasMultipleInstance: false,
                featureRoles: [],
                featureProfiles: [],
                profileUuid: ""
            }]
        },
        onSubmit: async (values) => {
            setLoading(true);
            // get all the permissions uuid which are checked
            const form = new FormData();
            form.append("name", values.role_name);
            form.append("description", values.description);
            form.append("standard", values.is_standard.toString());

            const features: any = {};
            values.roles.map((role: any) => {
                features[role?.feature] = [{object: role?.featureUuid, featureProfile: role?.profileUuid}]
            });

            form.append("features", JSON.stringify(features));

            triggerProfileUpdate({
                method: selected ? "PUT" : "POST",
                url: `${urlMedicalEntitySuffix}/profile/${selected ? `${selected.uuid}/` : ""}${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    enqueueSnackbar(t("users.alert.updated-role"), {variant: "success"})
                    invalidateQueries([`${urlMedicalEntitySuffix}/profile/${router.locale}`]);
                    handleClose();
                    setLoading(false)
                },
                onError: () => setLoading(false)
            });
        },
        validationSchema: RoleSchema,
    });

    const {getFieldProps, values, setFieldValue, touched, errors} = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <Form noValidate>
                    <RootStyled spacing={2} height={400} overflow='scroll' pt={2}>
                        <Stack spacing={2}>
                            <Typography gutterBottom textTransform="uppercase">
                                {t("users.dialog.role_name")}
                            </Typography>
                            <TextField
                                {...getFieldProps("role_name")}
                                placeholder={t("users.dialog.role_name")}
                                error={Boolean(touched.role_name && errors.role_name)}
                            />
                            <Typography gutterBottom textTransform="uppercase">
                                {t("users.dialog.description")}
                            </Typography>
                            <TextField
                                {...getFieldProps("description")}
                                placeholder={t("users.dialog.description_placeholder")}
                                multiline
                                rows={2}
                            />
                            <FormControlLabel
                                control={<Switch {...getFieldProps("is_standard")} checked={values.is_standard}/>}
                                label={t("users.dialog.is_standard")}/>
                        </Stack>
                        <Box className="permissions-wrapper">
                            <FeaturePermissionsCard {...{t, features, values, setFieldValue}}/>
                        </Box>
                    </RootStyled>

                    <Stack
                        p={1}
                        direction="row"
                        spacing={2}
                        borderTop={1}
                        borderColor="divider"
                        ml={-3}
                        mr={-3}
                        mt={2}
                        justifyContent="flex-end">
                        <Button
                            onClick={() => handleClose()}
                            variant="text-black"
                            startIcon={<IconClose/>}>
                            {t("users.dialog.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition={"start"}
                            type="submit"
                            variant="contained"
                            startIcon={<IconUrl path="iconfinder_save"/>}>
                            {t("users.dialog.save")}
                        </LoadingButton>
                    </Stack>
                </Form>
            </FormikProvider>
        </>
    );
}

export default AddNewRoleDialog;
