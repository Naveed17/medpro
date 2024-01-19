import { Badge, Button, Grid, IconButton, List, ListItem, Paper, Typography, Theme, Stack, TextField, Divider, Collapse, Box, FormControlLabel, Checkbox } from '@mui/material';
import React, { useState } from 'react'
import MoreVert from "@mui/icons-material/MoreVert";
import * as Yup from "yup";
import AddIcon from '@mui/icons-material/Add'
import { useCashBox, } from "@lib/hooks/rest";
import { useAppSelector } from '@lib/redux/hooks';
import { agendaSelector } from '@features/calendar';
import { Form, FormikProvider, useFormik } from 'formik';
import RootSyled from './overrides/rootStyle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CustomSwitch } from '@features/buttons';
function UsersTabs({ ...props }) {
    const { t, profiles, handleContextMenu } = props
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [open, setOpen] = useState('');
    const [roles, setRoles] = useState<any>([]);
    const { cashboxes } = useCashBox();
    const { agendas } = useAppSelector(agendaSelector);
    const selectedRole = (props: any) => {
        const data = props?.features?.map((data: any) => ({
            slug: data?.feature?.slug ?? "",
            feature: data[data?.feature?.slug] ?? "",
            hasMultipleInstance: data?.feature?.hasProfile ?? false,
            featureRoles: data?.feature?.hasProfile ? (data?.feature?.slug === "cashbox" ? cashboxes : agendas) : [],
            featureProfiles: [],
            profile: data?.profile ?? ""
        }));
        setRoles(data)
    }
    const features: any = {};
    roles.map((role: any) => {
        features[role?.slug] = [{ object: role?.feature?.uuid, featureProfile: role?.profile?.uuid }]
    });
    const RoleSchema = Yup.object().shape({
        role_name: Yup.string().min(3, t("role-error")).required(),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            role_name: "",
        },
        onSubmit: (values) => { console.log(values) },
        validationSchema: RoleSchema,
    }
    )
    const { getFieldProps, errors, touched } = formik;
    return (
        <RootSyled container spacing={2}>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Button variant="contained" fullWidth>
                        <AddIcon />
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
                                    selectedRole(profile);
                                    setOpen("");
                                }}
                                sx={{
                                    px: 1, borderRadius: 2, cursor: 'pointer', ".MuiListItemSecondaryAction-root": { right: 0 },
                                    ...(selectedProfile?.uuid === profile?.uuid && {
                                        bgcolor: (theme: Theme) => theme.palette.info.main,
                                    })

                                }}
                                secondaryAction={
                                    <IconButton onClick={(e) => handleContextMenu(e)} disableRipple size="small" edge="end" aria-label="more">
                                        <MoreVert sx={{ fontSize: 16, color: (theme: Theme) => theme.palette.text.secondary }} />
                                    </IconButton>
                                }
                                key={profile.uuid}>
                                {profile.name}
                                <Badge badgeContent={profile?.features?.length} color="info" sx={{ position: 'absolute', right: 40 }} />
                            </ListItem>
                        ))}

                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <FormikProvider value={formik}>
                        <Stack component={Form}
                            spacing={{ xs: 1, md: 2 }}
                            direction={{ xs: 'column', md: 'row' }}
                            alignItems={{ xs: 'stretch', md: 'center' }}
                            autoComplete="off"
                            noValidate>
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
                            <Stack direction='row' alignItems='center' spacing={2}>
                                <Button fullWidth variant='text-black'>
                                    {t("cancel")}
                                </Button>
                                <Button fullWidth variant="contained">
                                    {t("save")}
                                </Button>
                            </Stack>
                        </Stack>
                        <Divider sx={{ mt: 2 }} />
                        <List sx={{ pb: 0 }}>
                            {roles.map((role: any) => (
                                <ListItem key={role.slug}
                                    className={`motif-list ${open === role.slug ? "selected" : ""}`}
                                    onClick={() => setOpen(open === role.slug ? "" : role.slug)}
                                    secondaryAction={
                                        <>
                                            {open === role.slug ? <ExpandLess /> : <ExpandMore />}
                                        </>
                                    }
                                >
                                    <Typography fontWeight={600} variant='subtitle1'>{t(role.slug)}</Typography>
                                    <Collapse in={role.slug === open} onClick={(e) => e.stopPropagation()}>
                                        <Box p={2} className="collapse-wrapper">
                                            <FormControlLabel control={<CustomSwitch defaultChecked />} label="Agenda A" />
                                            <Box mt={2} className="permissions-wrapper">
                                                {Array.from({ length: 10 }).map((_, idx) => (
                                                    <FormControlLabel key={idx} control={<Checkbox defaultChecked />} label={`permission-${idx}`} />
                                                ))}

                                            </Box>
                                        </Box>
                                    </Collapse>
                                </ListItem>
                            ))}
                        </List>
                    </FormikProvider>
                </Paper>
            </Grid>
        </RootSyled >

    )
}

export default UsersTabs