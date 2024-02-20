import React, {useState} from 'react'
import DialogStyled from './overrides/dialogStyle';
import {
    Badge,
    Box,
    Button,
    Collapse,
    FormControlLabel,
    List,
    ListItem,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import {Add} from '@mui/icons-material';
import {useRouter} from 'next/router';
import {groupPermissionsByFeature, useMedicalEntitySuffix} from '@lib/hooks';
import {useRequestQueryMutation} from '@lib/axios';
import {useTranslation} from 'next-i18next';
import {CustomSwitch} from '@features/buttons';
import {TreeCheckbox} from '@features/treeViewCheckbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {FacebookCircularProgress} from '@features/progressUI';
import {startCase} from "lodash";

function AuthorizationStep({...props}) {
    const {t, formik, profiles, openFeatureCollapse, setFeatureCollapse} = props;
    const {getFieldProps, touched, errors, values, setFieldValue} = formik;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {t: menuTranslation} = useTranslation("menu");
    const [loadingReq, setLoadingReq] = useState(false);
    const router = useRouter()
    const [openCollapseFeature, setOpenCollapseFeature] = useState('');
    const {trigger: featurePermissionsTrigger} = useRequestQueryMutation("/feature/permissions/all");

    const HandleFeatureCollapse = (slug: string, roles: any) => {
        if (openCollapseFeature !== slug) {
            setLoadingReq(true);
            featurePermissionsTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/permissions/${router.locale}?feature=${slug}`
            }, {
                onSuccess: (result) => {
                    const permissions = (result?.data as HttpResponse)?.data;
                    values.roles[slug].map((role: any, idx: number) => setFieldValue(`roles[${slug}][${idx}].permissions`, groupPermissionsByFeature(permissions).map((permission: any, index: number) => ({
                            ...permission,
                            collapseIn: roles[idx].permissions[index]?.collapseIn ?? false,
                            children: permission.children.map((item: PermissionModel, permissionIdx: number) => ({
                                ...item,
                                checked: roles[idx].permissions.find((permission: PermissionModel) => permission.uuid === item.slug?.split("__")[1])?.children.at(permissionIdx)?.checked ?? false
                            }))
                        }))
                    ));
                },
                onSettled: () => setLoadingReq(false)
            });
        }
        setOpenCollapseFeature(openCollapseFeature === slug ? "" : slug);
    }
    const handleSelectedPermissionCount = (role: FeatureModel[]) => {
        return role.reduce((features: any[], feature: FeatureModel) =>
            [...(features ?? []),
                ...(feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                    [...(permissions ?? []),
                        ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [])], [])?.length;
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
    return (
        <DialogStyled spacing={2}>
            <Typography fontWeight={600} fontSize={20}>
                {t("dialog.role")}
            </Typography>

            {!openFeatureCollapse &&
                <>
                    <RadioGroup
                        className='role-input-group'
                        {...getFieldProps("selectedRole")}>
                        {profiles.map((profile: ProfileModel, index: number) => (
                            <FormControlLabel
                                className='role-label'
                                value={profile.uuid}
                                key={`${index}--${profile.uuid}`}
                                control={<Radio disableRipple
                                                checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                                label={startCase(profile.name)}/>
                        ))}
                    </RadioGroup>
                    <Button
                        onClick={() => setFeatureCollapse(true)}
                        startIcon={<Add/>} className='add-role' variant='contained' color='info'>
                        {t("dialog.add_role")}
                    </Button>
                </>
            }
            <Paper sx={{p: 2, borderRadius: 2, display: openFeatureCollapse ? "block" : "none"}}>
                <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{xs: 'flex-start', sm: 'center'}}
                       spacing={{xs: 1, sm: 2}}>
                    <Typography minWidth={100}>
                        {t("role_name")}
                        <Typography variant="caption" color="error">
                            *
                        </Typography>
                    </Typography>
                    <TextField
                        fullWidth
                        value={values.role_name ?? ""}
                        {...getFieldProps("role_name")}
                        placeholder={t("role_name")}
                        error={Boolean(touched.role_name && errors.role_name)}
                    />
                </Stack>
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
                                       badgeContent={handleSelectedPermissionCount(role[1])}
                                       color="primary"/>
                            </Stack>
                            <Collapse in={role[0] === openCollapseFeature} onClick={(e) => e.stopPropagation()}>
                                {role[1].map((featurePermission: any, index: number) =>
                                    <Box key={featurePermission?.uuid} p={2} className="collapse-wrapper">
                                        {featurePermission?.featureEntity &&
                                            <FormControlLabel
                                                sx={{paddingTop: 2}}
                                                control={<CustomSwitch
                                                    checked={featurePermission?.featureEntity?.checked ?? false}/>}
                                                onChange={(event: any) => setFieldValue(`roles[${role[0]}][${index}].featureEntity.checked`, event.target.checked)}
                                                label={featurePermission?.featureEntity?.name}/>}
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

            </Paper>

        </DialogStyled>
    )
}

export default AuthorizationStep
