import React, {useEffect, useState} from "react";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import RootStyled from "./overrides/rootStyle";
import {
    Box,
    Button,
    Card,
    Stack,
    TextField,
    FormControlLabel,
    Checkbox,
    Switch,
    Skeleton,
    Typography
} from "@mui/material";
import IconClose from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useSession} from "next-auth/react";
import {useRequestMutation} from "@lib/axios";
import {Session} from "next-auth";
import {LoadingButton} from "@mui/lab";
import {useTranslation} from "next-i18next";
import {TreeCheckbox} from "@features/treeViewCheckbox";
import {useSnackbar} from "notistack";
import {usePermissions} from "@lib/hooks/rest";
import {useMedicalEntitySuffix} from "@lib/hooks";

function AddNewRoleDialog({...props}) {
    const {data: {selected, handleMutate, handleClose}} = props;
    const {enqueueSnackbar} = useSnackbar();
    const {data: session} = useSession();
    const {permissions: allPermissions} = usePermissions();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {t} = useTranslation(["settings", "common"]);

    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState<any>([]);

    const {trigger} = useRequestMutation(null, "/profile");


    useEffect(() => {
        if (allPermissions) {
            console.log("allPermissions", allPermissions)
            const permissions = allPermissions.map((item: any) => {
                return {
                    ...item,
                    value: false,
                    children: item.children.map((child: any) => {
                        return {
                            ...child,
                            value: false,
                        }
                    })
                };
            });
            const updatePermissions = handleUpdatedPermissions(permissions);
            setPermissions(updatePermissions);
        }
    }, [allPermissions]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUpdatedPermissions = (permissions: any) => {
        if (selected) {
            const permissionsArray = [...permissions]
            selected.permissions.forEach((permission: any) => {
                permissionsArray.forEach((item: any) => {
                    if (item.uuid === permission.parent) {
                        item.value = true;
                        item.children.forEach((child: any) => {
                            if (child.uuid === permission.uuid) {
                                child.value = true;
                            }
                        })
                    }
                })
            });
            return permissionsArray
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
            form.append("permissions", JSON.stringify(checkedPermissions.join(",")));
            if (selected) {
                trigger({
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/profile/${selected.uuid}`,
                    data: form,
                    headers: {Authorization: `Bearer ${session?.accessToken}`}
                }).then(() => {
                    enqueueSnackbar(t("users.alert.updated-role"), {variant: "success"})
                    handleMutate();
                    handleClose();
                    setLoading(false)
                }).catch((err) => {
                    enqueueSnackbar(err?.response?.data?.message, {variant: "error"})
                    setLoading(false)

                })
            } else {
                trigger({
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/profile`,
                    data: form,
                    headers: {Authorization: `Bearer ${session?.accessToken}`}
                }).then(() => {
                    enqueueSnackbar(t("users.alert.added-role"), {variant: "success"})
                    handleMutate();
                    handleClose();
                    setLoading(false)
                }).catch((err) => {
                    enqueueSnackbar(err?.response?.data?.message, {variant: "error"})
                    setLoading(false)

                })
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
    };
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
                item.value = item.children.every((child: any) => child.value === true) ? true : false
            }
            return item;
        });
        setFieldValue("permissions", checkedData);
    };
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
                                rows={4}
                            />
                            <FormControlLabel
                                control={<Switch {...getFieldProps("is_standard")} checked={values.is_standard}/>}
                                label={t("users.dialog.is_standard")}/>
                        </Stack>
                        <Box className="permissions-wrapper">
                            <Typography gutterBottom>{t("users.dialog.select_permissions")}</Typography>
                            <Card>
                                <Box py={1} px={2}>
                                    {allPermissions ?
                                        <FormControlLabel
                                            className="bold-label"
                                            control={<Checkbox onChange={handleToggleAllSelect}/>}
                                            label={t("users.dialog.select_all")}
                                            checked={allValuesTrue}
                                        />
                                        : <Stack direction="row" spacing={2} alignItems="center">
                                            <Skeleton width={22} height={35}/>
                                            <Skeleton width={120}/>
                                        </Stack>
                                    }
                                </Box>
                                <TreeCheckbox data={values.permissions} onNodeCheck={handleNodeCheck} t={t}/>
                            </Card>
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
                            type="submit"
                            variant="contained"
                            loading={loading}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("users.dialog.save")}
                        </LoadingButton>
                    </Stack>
                </Form>
            </FormikProvider>
        </>
    );
}

export default AddNewRoleDialog;
