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
    FormControlLabel,
    Checkbox
} from '@mui/material';
import React, {useState} from 'react'
import MoreVert from "@mui/icons-material/MoreVert";
import * as Yup from "yup";
import AddIcon from '@mui/icons-material/Add'
import {useCashBox,} from "@lib/hooks/rest";
import {useAppSelector} from '@lib/redux/hooks';
import {agendaSelector} from '@features/calendar';
import {Form, FormikProvider, useFormik} from 'formik';
import RootSyled from './overrides/rootStyle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {CustomSwitch} from '@features/buttons';
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";
import {useRequestQueryMutation} from "@lib/axios";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {startCase} from "lodash";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import IconUrl from "@themes/urlIcon";

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

    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [openCollapseFeature, setOpenCollapseFeature] = useState('');
    const [loading, setLoading] = useState(false);

    const {data: user} = session as Session;
    const features = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;

    const {trigger: featurePermissionsTrigger} = useRequestQueryMutation("/feature/permissions/all");
    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");

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
                })) : [feature]
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
        if (props?.features?.length > 0) {
            props?.features?.forEach((data: any) => {
                const slug = data?.feature?.slug;
                values.roles[slug].map((role: any, idx: number) => {
                    setFieldValue(`roles[${slug}][${idx}].permissions`, data?.profile?.permissions?.map((permission: PermissionModel) => ({
                        ...permission,
                        checked: true
                    })))
                    setFieldValue(`roles[${slug}][${idx}].profile`, data?.profile?.uuid);
                });
            });
        } else {
            setValues({
                role_name: props?.name,
                roles: initData()
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
        Object.entries(values.roles).map((role: any) => {
            const hasPermissions = role[1].reduce((permissions: any[], feature: FeatureModel) => [...(permissions ?? []), ...(feature?.permissions?.filter(permission => permission?.checked) ?? [])], [])?.length > 0;
            if (hasPermissions) {
                features[role[0]] = role[1].map((feature: any) => ({
                    object: feature?.featureEntity?.uuid,
                    featureProfile: feature?.profile,
                    permissions: feature?.permissions?.reduce((permissions: string[], permission: PermissionModel) => [...(permissions ?? []), ...(permission?.checked ? [permission.uuid] : [])], [])
                }))
            }
        });

        form.append("permissions", JSON.stringify(features));
        triggerProfileUpdate({
            method: selectedProfile ? "PUT" : "POST",
            url: `${urlMedicalEntitySuffix}/profile/${selectedProfile ? `${selectedProfile.uuid}/` : ""}${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                enqueueSnackbar(t(selectedProfile ? "updated-role" : "created-role"), {variant: "success"});
                invalidateQueries([`${urlMedicalEntitySuffix}/profile/${router.locale}`]);
                setLoading(false);
            },
            onSettled: () => setLoading(false)
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
                        {profiles.map((profile: any) => (
                            <ListItem
                                onClick={() => {
                                    setSelectedProfile(profile);
                                    handleSelectedRole(profile);
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
                                <ListItem key={role[0]}
                                          className={`motif-list ${openCollapseFeature === role[0] ? "selected" : ""}`}
                                          onClick={() => {
                                              const slug = role[0];
                                              const roles = role[1];
                                              if (openCollapseFeature !== slug) {
                                                  featurePermissionsTrigger({
                                                      method: "GET",
                                                      url: `${urlMedicalEntitySuffix}/permissions/${router.locale}?feature=${slug}`
                                                  }, {
                                                      onSuccess: (result) => {
                                                          const permissions = (result?.data as HttpResponse)?.data;
                                                          values.roles[slug].map((role: any, idx: number) => setFieldValue(`roles[${slug}][${idx}].permissions`, permissions.map((permission: PermissionModel, index: number) => ({
                                                              ...permission,
                                                              checked: roles[idx].permissions?.at(index)?.checked ?? false
                                                          }))));
                                                      }
                                                  });
                                              }
                                              setOpenCollapseFeature(openCollapseFeature === slug ? "" : slug);
                                          }}
                                          secondaryAction={
                                              <>
                                                  {openCollapseFeature === role[0] ? <ExpandLess/> : <ExpandMore/>}
                                              </>
                                          }>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <Typography fontSize={16} fontWeight={600}
                                                    variant='subtitle1'>
                                            {menuTranslation(`main-menu.${role[0]}`)}
                                        </Typography>

                                        <Badge sx={{ml: 2}}
                                               badgeContent={role[1].reduce((permissions: any[], feature: FeatureModel) => [...(permissions ?? []), ...(feature?.permissions?.filter(permission => permission?.checked) ?? [])], [])?.length}
                                               color="primary"/>
                                    </Stack>

                                    <Collapse in={role[0] === openCollapseFeature} onClick={(e) => e.stopPropagation()}>
                                        {role[1].map((featurePermission: any, index: number) =>
                                            <Box key={featurePermission?.uuid} p={2} className="collapse-wrapper">
                                                {featurePermission?.featureEntity &&
                                                    <FormControlLabel
                                                        control={<CustomSwitch
                                                            checked={featurePermission?.featureEntity?.checked ?? false}/>}
                                                        onChange={(event: any) => setFieldValue(`roles[${role[0]}][${index}].featureEntity.checked`, event.target.checked)}
                                                        label={featurePermission?.featureEntity?.name}/>}
                                                <Box mt={2} className="permissions-wrapper">
                                                    {featurePermission?.permissions?.map((permission: PermissionModel, idx: number) => (
                                                        <FormControlLabel
                                                            key={idx}
                                                            control={<Checkbox
                                                                checked={permission?.checked as any ?? false}/>}
                                                            onChange={(event: any) => setFieldValue(`roles[${role[0]}][${index}].permissions[${idx}].checked`, event.target.checked)}
                                                            label={permission.name}/>
                                                    ))}
                                                </Box>
                                            </Box>)}
                                    </Collapse>
                                </ListItem>
                            ))}
                        </List>
                    </FormikProvider>
                </Paper>
            </Grid>
        </RootSyled>

    )
}

export default UsersTabs
