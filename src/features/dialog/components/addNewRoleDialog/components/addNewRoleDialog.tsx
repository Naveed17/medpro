import React, {useEffect, useState} from "react";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import RootStyled from "./overrides/rootStyle";
import {
    Box,
    Button,
    Stack,
    TextField,
    FormControlLabel,
    Switch,
    Typography
} from "@mui/material";
import IconClose from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useRequestQueryMutation} from "@lib/axios";
import {LoadingButton} from "@mui/lab";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import {usePermissions} from "@lib/hooks/rest";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {FeaturePermissionsCard} from "@features/card";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

function AddNewRoleDialog({...props}) {
    const {data: {selected, handleMutate, handleClose}} = props;
    const {enqueueSnackbar} = useSnackbar();
    const {permissions: allPermissions} = usePermissions();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: session} = useSession();

    const {t} = useTranslation(["settings", "common"]);

    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState<any>([]);

    const {data: user} = session as Session;
    const features = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    const {trigger: triggerProfileCreate} = useRequestQueryMutation("/profile/create");
    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");

    useEffect(() => {
        if (allPermissions) {
            const permissions = allPermissions.map((item: any) => {
                return {
                    ...item,
                    value: false,
                    children: []
                };
            });
            const updatePermissions = handleUpdatedPermissions(permissions);
            setPermissions(updatePermissions);
        }
    }, [allPermissions]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUpdatedPermissions = (permissions: any) => {
        if (selected) {
            const permissionsArray = [...permissions];
            return permissionsArray.map(permission => ({
                ...permission,
                value: selected.features.map((feature: FeatureModel) => feature.uuid).includes(permission.uuid)
            }))
        } else {
            return permissions
        }
    };

    const RoleSchema = Yup.object().shape({
        role_name: Yup.string().required(),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            role_name: selected ? selected?.name : "",
            description: selected ? selected?.description : "",
            is_standard: selected ? selected?.is_standard ?? true : true,
            permissions,
            roles: []
        },
        onSubmit: async (values) => {
            setLoading(true);
            // get all the permissions uuid which are checked
            const checkedPermissions = [];
            for (let i = 0; i < values.permissions?.length; i++) {
                if (values.permissions[i].value && values.permissions[i].children.length === 0) {
                    checkedPermissions.push(values.permissions[i].uuid);
                }
                if (values.permissions[i].children.length > 0) {
                    for (let j = 0; j < values.permissions[i].children.length; j++) {
                        if (values.permissions[i].children[j].value) {
                            checkedPermissions.push(values.permissions[i].children[j].uuid);
                        }
                    }
                }

            }
            const form = new FormData();
            form.append("name", values.role_name);
            form.append("description", values.description);
            form.append("is_standard ", values.is_standard.toString());
            form.append("features", JSON.stringify(checkedPermissions.join(",")));
            if (selected) {
                triggerProfileUpdate({
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/profile/${selected.uuid}`,
                    data: form
                }, {
                    onSuccess: () => {
                        enqueueSnackbar(t("users.alert.updated-role"), {variant: "success"})
                        handleMutate();
                        handleClose();
                        setLoading(false)
                    },
                    onError: () => setLoading(false)
                });
            } else {
                triggerProfileCreate({
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/profile`,
                    data: form
                }, {
                    onSuccess: () => {
                        enqueueSnackbar(t("users.alert.added-role"), {variant: "success"})
                        handleMutate();
                        handleClose();
                        setLoading(false)
                    },
                    onError: () => setLoading(false)
                });
            }
        },
        validationSchema: RoleSchema,
    });

    const {getFieldProps, values, setFieldValue, touched, errors} = formik;

    function checkAllValuesTrue(obj: any) {
        if (obj.hasOwnProperty("value") && obj.value === false) {
            return false;
        }
        if (obj.hasOwnProperty("children")) {
            for (let i = 0; i < obj.children.length; i++) {
                if (!checkAllValuesTrue(obj.children[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    let allValuesTrue = true;
    if (allPermissions) {
        for (let i = 0; i < values.permissions?.length; i++) {
            if (!checkAllValuesTrue(values.permissions[i])) {
                allValuesTrue = false;
                break;
            }
        }
    }

    const handleToggleAllSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const newPermissions = values.permissions.map((permission: any) => {
                permission.value = true;
                if (permission.children) {
                    permission.children = permission.children.map(
                        (insidePermission: any) => {
                            insidePermission.value = true;
                            return insidePermission;
                        }
                    );
                }
                return permission;
            });
            setFieldValue("permissions", newPermissions);
        } else {
            const newPermissions = values.permissions.map((permission: any) => {
                permission.value = false;
                if (permission.children) {
                    permission.children = permission.children.map(
                        (insidePermission: any) => {
                            insidePermission.value = false;
                            return insidePermission;
                        }
                    );
                }

                return permission;
            });

            setFieldValue("permissions", newPermissions);
        }
    }

    const handleNodeCheck = (id: string, checked: boolean) => {
        const updatedData = values.permissions.map((node: any) => {
            if (node.uuid === id) {
                return {
                    ...node,
                    value: checked,
                    children: node.children.map((child: any) => ({
                        ...child,
                        value: checked
                    }))
                }

            }
            return {
                ...node,
                children: node.children.map((child: any) =>
                    child.uuid === id ? {...child, value: checked} : {...child}
                )
            };
        });
        const checkedData = updatedData.map((item: any) => {
            if (item.children.length > 0) {
                item.value = !!item.children.every((child: any) => child.value === true)
            }
            return item;
        });
        setFieldValue("permissions", checkedData);
    }

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
                            <FeaturePermissionsCard {...{t, features, values, getFieldProps, setFieldValue}}/>
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
                            disabled={values.permissions.filter((permission: any) => permission.value).length === 0 || values.role_name.length === 0}
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
