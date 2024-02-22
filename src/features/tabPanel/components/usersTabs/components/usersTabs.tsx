import {
    Badge,
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    Paper,
    Typography,
    Theme,
    Stack,
    TextField,
    Divider,
    Collapse,
    Box,
    FormControlLabel, DialogActions, DialogTitle, DialogContent, Dialog
} from '@mui/material';
import React, {useState} from 'react'
import MoreVert from "@mui/icons-material/MoreVert";
import * as Yup from "yup";
import AddIcon from '@mui/icons-material/Add'
import {useCashBox,} from "@lib/hooks/rest";
import {useAppSelector} from '@lib/redux/hooks';
import {agendaSelector} from '@features/calendar';
import {Form, FormikProvider, useFormik} from 'formik';
import RootSyled from './overrides/rootUserStyled';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {CustomIconButton, CustomSwitch} from '@features/buttons';
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";
import {useRequestQueryMutation} from "@lib/axios";
import {getPermissionsCount, groupPermissionsByFeature, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {startCase} from "lodash";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import IconUrl from "@themes/urlIcon";
import {TreeCheckbox} from "@features/treeViewCheckbox";
import {FacebookCircularProgress} from "@features/progressUI";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {Dialog as CustomDialog, dialogSelector} from "@features/dialog";

function UsersTabs({...props}) {
    const {t, profiles, handleContextMenu} = props
    const {cashboxes} = useCashBox();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t: menuTranslation} = useTranslation("menu");
    const {agendas} = useAppSelector(agendaSelector);
    const {cashBoxDialogData} = useAppSelector(dialogSelector);

    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [openCollapseFeature, setOpenCollapseFeature] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingReq, setLoadingReq] = useState(false);
    const [openAddCashBoxDialog, setOpenAddCashBoxDialog] = useState<boolean>(false);
    const [deleteCashBoxDialog, setDeleteCashBoxDialog] = useState(false);
    const [selectedCashBox, setSelectedCashBox] = useState<any>(null);

    const {data: user} = session as Session;
    const features = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    const {trigger: featurePermissionsTrigger} = useRequestQueryMutation("/feature/permissions/all");
    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");
    const {trigger: triggerCreateCashbox} = useRequestQueryMutation("/payment/cashbox/delete");
    const {trigger: triggerDeleteCashbox} = useRequestQueryMutation("/payment/cashbox/create");

    const initData = () => {
        const featuresInit: any = {};
        features?.map((feature: any) => {
            Object.assign(featuresInit, {
                [feature.slug]: feature?.hasProfile ? (feature.slug === "agenda" ? agendas : cashboxes).map(featureEntity => ({
                    ...feature,
                    featureEntity: {
                        ...featureEntity,
                        checked: false
                    },
                    permissions: []
                })) : [{
                    ...feature,
                    permissions: []
                }]
            });
        });
        return featuresInit
    }

    const RoleSchema = Yup.object().shape({
        role_name: Yup.string().min(3, t("role-error")).required(),
    });

    const formik = useFormik({
            enableReinitialize: true,
            initialValues: {
                role_name: "",
                roles: initData()
            },
            onSubmit: (values) => {
                console.log(values)
            },
            validationSchema: RoleSchema,
        }
    )

    const {getFieldProps, values, errors, touched, setFieldValue, setValues, handleSubmit} = formik;

    const handleSelectedRole = (props: any) => {
        setValues({
            role_name: props?.name,
            roles: initData()
        });
        if (props?.features?.length > 0) {
            props?.features?.forEach((data: any) => {
                const slug = data?.feature?.slug;
                const groupedPermissions = groupPermissionsByFeature(data?.profile?.permissions);
                const featureIndex = values.roles[slug].findIndex((role: any) => data[slug] && role.featureEntity.uuid === data[slug].uuid);
                const currentIndex = featureIndex === -1 ? 0 : featureIndex;

                if (data[slug]) {
                    setFieldValue(`roles[${slug}][${currentIndex}].featureEntity.checked`, true);
                }
                setFieldValue(`roles[${slug}][${currentIndex}].permissions`, groupedPermissions.map((permission: any) => ({
                    ...permission,
                    collapseIn: true,
                    children: permission.children.map((item: PermissionModel) => ({
                        ...item,
                        checked: true
                    }))
                })));
                setFieldValue(`roles[${slug}][${currentIndex}].profile`, data?.profile?.uuid);
            });
        }
    }

    const resetFormData = () => {
        setSelectedProfile(null);
        setValues({
            role_name: "",
            roles: initData()
        });
        setOpenCollapseFeature("");
    }

    const handleSetProfile = () => {
        setLoading(true);
        const form = new FormData();
        const features: any = {};

        form.append("name", selectedProfile?.name ?? values.role_name);
        Object.entries(values.roles).forEach((role: any) => {
            const hasFeaturePermissions = role[1].reduce((features: any[], feature: FeatureModel) => {
                const permissions = feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                    [...(permissions ?? []),
                        ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [];
                return [
                    ...(features ?? []),
                    ...((feature?.hasOwnProperty('featureEntity') ? (feature?.featureEntity?.checked ? permissions : []) : permissions) ?? [])]
            }, []).length > 0;

            if (hasFeaturePermissions) {
                features[role[0]] = role[1].reduce((features: FeatureModel[], feature: FeatureModel) => {
                    const permissions = feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                        [...(permissions ?? []),
                            ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [];

                    const hasPermissions = feature?.hasOwnProperty('featureEntity') ? (feature?.featureEntity?.checked && (permissions.length ?? 0) > 0) : (permissions.length ?? 0) > 0;
                    return [
                        ...(features ?? []),
                        ...(hasPermissions ? [{
                            object: feature?.featureEntity?.uuid,
                            featureProfile: feature?.profile,
                            permissions: permissions.map((permission: PermissionModel) => permission.uuid)
                        }] : [])
                    ];
                }, [])
            }
        });

        form.append("features", JSON.stringify(features));

        triggerProfileUpdate({
            method: selectedProfile ? "PUT" : "POST",
            url: `${urlMedicalEntitySuffix}/profile/${selectedProfile ? `${selectedProfile.uuid}/` : ""}${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                enqueueSnackbar(t(selectedProfile ? "updated-role" : "created-role"), {variant: "success"});
                invalidateQueries([`${urlMedicalEntitySuffix}/profile/${router.locale}`]);
                resetFormData();
            },
            onSettled: () => setLoading(false)
        });
    }

    const HandleFeatureCollapse = (slug: string, roles: any, collapsed?: boolean) => {
        if (openCollapseFeature !== slug || collapsed) {
            setLoadingReq(true);
            featurePermissionsTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/permissions/${router.locale}?feature=${slug}`
            }, {
                onSuccess: (result) => {
                    const permissions = (result?.data as HttpResponse)?.data;
                    const groupedPermissions = groupPermissionsByFeature(permissions);
                    values.roles[slug].forEach((role: any, idx: number) => {
                        setFieldValue(`roles[${slug}][${idx}].permissions`,
                            groupedPermissions.map((permission: any) => {
                                const featurePermissions = roles[idx].permissions;
                                return {
                                    ...permission,
                                    collapseIn: featurePermissions[0]?.collapseIn ?? false,
                                    children: permission.children.map((item: PermissionModel) => {
                                        const permissions = featurePermissions.find((permission: PermissionModel) => permission.uuid === item.slug?.split("__")[1]);
                                        return {
                                            ...item,
                                            checked: permissions?.children.reduce((permissions: string[], permission: PermissionModel) => [...(permissions ?? []), ...(permission.checked ? [permission.uuid] : [])], []).includes(item.uuid) ?? false
                                        }
                                    })
                                }
                            }))
                    });
                },
                onSettled: () => setLoadingReq(false)
            });
        }

        if (!collapsed) {
            setOpenCollapseFeature(openCollapseFeature === slug ? "" : slug);
        }
    }

    const handleTreeCheck = (uuid: string, value: boolean, hasChildren: boolean, group: string, featurePermission: any, role: any, index: number) => {
        if (hasChildren) {
            const groupUuid = featurePermission?.permissions.findIndex((permission: PermissionModel) => permission.uuid === uuid);
            setFieldValue(`roles[${role[0]}][${index}].permissions[${groupUuid}]`, {
                ...featurePermission?.permissions[groupUuid],
                checked: value,
                children: featurePermission?.permissions[groupUuid].children.map((permission: PermissionModel) => ({
                    ...permission,
                    checked: value
                }))
            });
        } else {
            const permissionUuid = featurePermission?.permissions.findIndex((permission: PermissionModel) => permission.uuid === group);
            const permissionChildIndex = featurePermission?.permissions[permissionUuid].children.findIndex((permission: PermissionModel) => permission.uuid === uuid);
            const field = `roles[${role[0]}][${index}].permissions[${permissionUuid}].children[${permissionChildIndex}].checked`;
            setFieldValue(field, value);
        }
    }

    const handleCreateCashBox = () => {
        setLoadingReq(true);
        const form = new FormData();
        form.append("name", cashBoxDialogData?.name ?? "");
        triggerCreateCashbox({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`,
            data: form
        }, {
            onSuccess: () => invalidateQueries([`${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`]).then(() => {
                setOpenAddCashBoxDialog(false);
                setOpenCollapseFeature("");
            }),
            onSettled: () => setLoadingReq(false)
        });
    }

    const handleDeleteCashBox = () => {
        setLoadingReq(true);
        triggerDeleteCashbox({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${selectedCashBox}/${router.locale}`,
        }, {
            onSuccess: async () => invalidateQueries([`${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`]).then(() => {
                setDeleteCashBoxDialog(false);
                setOpenCollapseFeature("");
            }),
            onSettled: () => setLoadingReq(false)
        });
    }

    return (
        <RootSyled container spacing={2}>
            <Grid item xs={12} md={3}>
                <Paper sx={{p: 2, borderRadius: 1}}>
                    <Button variant="contained" onClick={resetFormData} fullWidth>
                        <AddIcon/>
                        {t("add_role")}
                    </Button>
                    <Typography my={2} fontWeight={600} variant="subtitle1">
                        {t("roles")}
                    </Typography>
                    <List disablePadding>
                        {profiles.map((profile: ProfileModel) => (
                            <ListItem
                                onClick={() => {
                                    setSelectedProfile(profile);
                                    handleSelectedRole(profile);
                                    setOpenCollapseFeature("");
                                }}
                                sx={{
                                    px: 1,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    ".MuiListItemSecondaryAction-root": {right: 0},
                                    ...(selectedProfile?.uuid === profile?.uuid && {
                                        bgcolor: (theme: Theme) => theme.palette.info.main,
                                    })
                                }}
                                secondaryAction={
                                    <IconButton onClick={(e) => handleContextMenu(e, selectedProfile)} disableRipple
                                                size="small"
                                                edge="end" aria-label="more">
                                        <MoreVert
                                            sx={{fontSize: 16, color: (theme: Theme) => theme.palette.text.secondary}}/>
                                    </IconButton>
                                }
                                key={profile.uuid}>
                                <Typography variant="body1" fontWeight={400} color="text.primary">
                                    {startCase(profile.name)}
                                </Typography>
                            </ListItem>
                        ))}

                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
                <Paper sx={{p: 2, borderRadius: 2}}>
                    <FormikProvider value={formik}>
                        <Stack component={Form}
                               spacing={{xs: 1, md: 2}}
                               direction={{xs: 'column', md: 'row'}}
                               justifyContent={"space-between"}
                               alignItems={{xs: 'stretch', md: 'center'}}
                               autoComplete="off"
                               onSubmit={handleSubmit}
                               noValidate>
                            {selectedProfile === null ? <>
                                    <Typography minWidth={100}>
                                        {t("role_name")}
                                        <Typography variant="caption" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        {...getFieldProps("role_name")}
                                        placeholder={t("role_name")}
                                        error={Boolean(touched.role_name && errors.role_name)}
                                    />
                                </> :
                                <Typography fontSize={16} fontWeight={800}>
                                    {startCase(selectedProfile?.name)}
                                </Typography>
                            }

                            <Stack direction='row' alignItems='center' spacing={2}>
                                <Button fullWidth variant='text-black' onClick={resetFormData}>
                                    {t("cancel")}
                                </Button>
                                <LoadingButton
                                    {...{loading}}
                                    disabled={values?.role_name === ""}
                                    loadingPosition={"start"}
                                    type="submit"
                                    sx={{minWidth: 130}}
                                    variant="contained"
                                    onClick={handleSetProfile}
                                    startIcon={<IconUrl path="iconfinder_save"/>}>
                                    {t("save")}
                                </LoadingButton>
                            </Stack>
                        </Stack>
                        <Divider sx={{mt: 2}}/>
                        <List sx={{pb: 0}}>
                            {Object.entries(values?.roles)?.map((role: any) => (
                                <ListItem
                                    key={role[0]}
                                    className={`motif-list ${openCollapseFeature === role[0] ? "selected" : ""}`}
                                    onClick={() => HandleFeatureCollapse(role[0], role[1])}
                                    secondaryAction={
                                        <Stack direction={"row"}>
                                            {(openCollapseFeature === role[0] && loadingReq) &&
                                                <FacebookCircularProgress size={20}/>}
                                            {openCollapseFeature === role[0] ? <ExpandLess/> : <ExpandMore/>}
                                        </Stack>
                                    }>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <Typography fontSize={16} fontWeight={600}
                                                    variant='subtitle1'>
                                            {menuTranslation(`main-menu.${role[0]}`)}
                                        </Typography>

                                        <Badge sx={{ml: 2}}
                                               badgeContent={getPermissionsCount(role[1])}
                                               color="primary"/>
                                    </Stack>
                                    <Collapse in={role[0] === openCollapseFeature} onClick={(e) => e.stopPropagation()}>
                                        {role[1].map((featurePermission: any, index: number) =>
                                            <Box key={`${index}-${featurePermission?.uuid}`} p={2}
                                                 className="collapse-wrapper">
                                                {featurePermission?.featureEntity &&
                                                    <Stack direction={"row"} alignItems={"center"}
                                                           justifyContent={"space-between"}>
                                                        <FormControlLabel
                                                            sx={{paddingTop: 2}}
                                                            control={<CustomSwitch
                                                                checked={featurePermission?.featureEntity?.checked ?? false}/>}
                                                            onChange={(event: any) => {
                                                                setFieldValue(`roles[${role[0]}][${index}].featureEntity.checked`, event.target.checked);
                                                                if (!event.target.checked) {
                                                                    setFieldValue(`roles[${role[0]}][${index}].permissions[0]`, {
                                                                        ...values.roles[role[0]][index].permissions[0],
                                                                        checked: false,
                                                                        children: featurePermission.permissions[0].children.map((permission: PermissionModel) => ({
                                                                            ...permission,
                                                                            checked: false
                                                                        }))
                                                                    });
                                                                }
                                                            }}
                                                            label={featurePermission?.featureEntity?.name}/>
                                                        {featurePermission.root === "cashbox" &&
                                                            (index === 0 ?
                                                                <CustomIconButton
                                                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                                        event.stopPropagation();
                                                                        setOpenAddCashBoxDialog(true);
                                                                    }}
                                                                    variant="filled"
                                                                    color={"primary"}
                                                                    size={"small"}>
                                                                    <AgendaAddViewIcon/>
                                                                </CustomIconButton>
                                                                :
                                                                <CustomIconButton
                                                                    onClick={() => {
                                                                        setSelectedCashBox(featurePermission?.featureEntity?.uuid);
                                                                        setTimeout(() => setDeleteCashBoxDialog(true));
                                                                    }}
                                                                    variant="filled"
                                                                    sx={{p: .4}}
                                                                    color={"error"}
                                                                    size={"small"}>
                                                                    <IconUrl color={"white"} path="ic-trash"/>
                                                                </CustomIconButton>)
                                                        }
                                                    </Stack>
                                                }
                                                <Box mt={2} className="permissions-wrapper">
                                                    <TreeCheckbox
                                                        {...{t}}
                                                        disabled={featurePermission?.hasOwnProperty('featureEntity') ? !featurePermission?.featureEntity?.checked : false}
                                                        data={featurePermission?.permissions ?? []}
                                                        onCollapseIn={(uuid: string, value: boolean) => setFieldValue(`roles[${role[0]}][${index}].permissions[${featurePermission?.permissions.findIndex((permission: PermissionModel) => permission.uuid === uuid)}].collapseIn`, value)}
                                                        onNodeCheck={(uuid: string, value: boolean, hasChildren: boolean, group: string) => handleTreeCheck(uuid, value, hasChildren, group, featurePermission, role, index)}
                                                    />
                                                </Box>
                                            </Box>)}
                                    </Collapse>
                                </ListItem>
                            ))}
                        </List>
                    </FormikProvider>
                </Paper>
            </Grid>
            <CustomDialog
                action={'createCashBox'}
                open={openAddCashBoxDialog}
                data={{t}}
                size={"sm"}
                title={t('newCash')}
                dialogClose={() => setOpenAddCashBoxDialog(false)}
                actionDialog={
                    <DialogActions>
                        <Button
                            variant={"text-black"}
                            onClick={() => setOpenAddCashBoxDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {t('cancel')}
                        </Button>
                        <LoadingButton
                            loading={loadingReq}
                            loadingPosition={"start"}
                            variant="contained"
                            onClick={handleCreateCashBox}
                            startIcon={<Icon
                                path='iconfinder_save'/>}>
                            {t('save')}
                        </LoadingButton>
                    </DialogActions>
                }/>

            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%"
                    }
                }}
                maxWidth="sm"
                open={deleteCashBoxDialog}>
                <DialogTitle
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.error.main,
                        px: 1,
                        py: 2,

                    }}>
                    {t(`dialog.delete-cashBox-title`)}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t(`dialog.delete-cashBox-desc`)}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant={"text-black"}
                            onClick={() => setDeleteCashBoxDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loadingReq}
                            loadingPosition={"start"}
                            color="error"
                            onClick={() => handleDeleteCashBox()}
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </RootSyled>
    )
}

export default UsersTabs
