import React, { useState } from 'react'
import DialogStyled from './overrides/dialogStyle';
import { Badge, Box, Button, Collapse, FormControlLabel, List, ListItem, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import IconUrl from '@themes/urlIcon';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useMedicalEntitySuffix } from '@lib/hooks';
import { useRequestQueryMutation } from '@lib/axios';
import { useTranslation } from 'next-i18next';
import { CustomSwitch } from '@features/buttons';
import { TreeCheckbox } from '@features/treeViewCheckbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
function Step2({ ...props }) {
    const { t, formik, openFeatureCollapse, setFeatureCollapse } = props;
    const { getFieldProps, touched, errors, values, setFieldValue } = formik;
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { t: menuTranslation } = useTranslation("menu");
    const router = useRouter()
    const [openCollapseFeature, setOpenCollapseFeature] = useState('');
    const { trigger: featurePermissionsTrigger } = useRequestQueryMutation("/feature/permissions/all");
    const HandleFeatureCollapse = (slug: string, roles: any) => {
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
    }
    return (
        <DialogStyled spacing={2}>
            <Typography fontWeight={600} fontSize={20}>
                {t("dialog.role")}
            </Typography>
            <RadioGroup
                className='role-input-group'
                {...getFieldProps("selectedRole")}
            >
                {
                    ["dr", "secretary", "accountant"].map((item, index) => (
                        <FormControlLabel className='role-label' value={t("dialog." + item)} key={index} control={<Radio disableRipple checkedIcon={<IconUrl path="ic-radio-check" />} />} label={t("dialog." + item)} />
                    ))
                }

            </RadioGroup>
            {
                !openFeatureCollapse && (
                    <Button
                        onClick={() => setFeatureCollapse(true)}
                        startIcon={<Add />} className='add-role' variant='contained' color='info'>
                        {t("dialog.add_role")}
                    </Button>
                )
            }
            <Paper sx={{ p: 2, borderRadius: 2, display: openFeatureCollapse ? "block" : "none" }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={{ xs: 1, sm: 2 }}>
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
                </Stack>
                <List sx={{ pb: 0 }}>
                    {Object.entries(values?.roles)?.map((role: any) => (
                        <ListItem key={role[0]}
                            className={`motif-list ${openCollapseFeature === role[0] ? "selected" : ""}`}
                            onClick={() => HandleFeatureCollapse(role[0], role[1])}
                            secondaryAction={
                                <>
                                    {openCollapseFeature === role[0] ? <ExpandLess /> : <ExpandMore />}
                                </>
                            }>
                            <Stack direction={"row"} alignItems={"center"}>
                                <Typography fontSize={16} fontWeight={600}
                                    variant='subtitle1'>
                                    {menuTranslation(`main-menu.${role[0]}`)}
                                </Typography>

                                <Badge sx={{ ml: 2 }}
                                    badgeContent={role[1].reduce((permissions: any[], feature: FeatureModel) => [...(permissions ?? []), ...(feature?.permissions?.filter(permission => permission?.checked) ?? [])], [])?.length}
                                    color="primary" />
                            </Stack>

                            <Collapse in={role[0] === openCollapseFeature} onClick={(e) => e.stopPropagation()}>
                                {role[1].map((featurePermission: any, index: number) =>
                                    <Box key={featurePermission?.uuid} p={2} className="collapse-wrapper">
                                        {featurePermission?.featureEntity &&
                                            <FormControlLabel
                                                control={<CustomSwitch
                                                    checked={featurePermission?.featureEntity?.checked ?? false} />}
                                                onChange={(event: any) => setFieldValue(`roles[${role[0]}][${index}].featureEntity.checked`, event.target.checked)}
                                                label={featurePermission?.featureEntity?.name} />}
                                        <Box mt={2} className="permissions-wrapper">
                                            <TreeCheckbox
                                                disabled={featurePermission?.hasOwnProperty('featureEntity') ? !featurePermission?.featureEntity?.checked : false}
                                                data={featurePermission?.permissions ?? []}
                                                onNodeCheck={(uuid: string, value: boolean) => setFieldValue(`roles[${role[0]}][${index}].permissions[${featurePermission?.permissions.findIndex((permission: PermissionModel) => permission.uuid === uuid)}].checked`, value)}
                                                t={t} />
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

export default Step2