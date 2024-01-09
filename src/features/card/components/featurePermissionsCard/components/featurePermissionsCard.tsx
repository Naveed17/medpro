import {
    Autocomplete,
    Box,
    Button,
    FormControl, FormHelperText,
    Grid, IconButton,
    ListItem, ListItemSecondaryAction, ListItemText,
    MenuItem,
    Select,
    Stack, TextField,
    Typography, useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import React, {useRef, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useCashBox} from "@lib/hooks/rest";
import {useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Dialog as CustomDialog} from "@features/dialog";
import {configSelector} from "@features/base";

function FeaturePermissionsCard({...props}) {
    const {t, features, values, getFieldProps, setFieldValue} = props;
    const {cashboxes} = useCashBox();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const theme = useTheme();
    const refContainer = useRef(null);

    const {agendas} = useAppSelector(agendaSelector);
    const {direction} = useAppSelector(configSelector);

    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [openFeatureProfileDialog, setOpenFeatureProfileDialog] = useState(false);

    const {trigger: profilePermissionsTrigger} = useRequestQueryMutation("/settings/profile/permissions/get");
    const {trigger: deleteProfileTrigger} = useRequestQueryMutation("/settings/profile/delete");

    const handleProfilePermissions = (index: number, hasProfileSet?: boolean) => {
        const feature = features?.find((profile: any) => profile.uuid === (values.roles[index] as any)?.feature);
        if (feature?.slug === "cashbox") {
            profilePermissionsTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/cash-box/profiles/${router.locale}`
            }, {
                onSuccess: (result) => {
                    const profiles = (result?.data as HttpResponse)?.data;
                    setFieldValue(`roles[${index}].featureProfiles`, profiles);
                    if (hasProfileSet) {
                        setFieldValue(`roles[${index}].profileUuid`, profiles[profiles?.length - 1].uuid);
                    }
                    setLoading(false);
                },
                onError: () => setLoading(false)
            });
        } else {
            setFieldValue(`roles[${index}].featureProfiles`, []);
        }
    }

    const handleDeleteProfile = (uuid: string, index: number) => {
        setLoading(true);
        deleteProfileTrigger({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/cash-box/profiles/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                handleProfilePermissions(index);
                setLoading(false);
            },
            onError: () => setLoading(false)
        });
    }

    return (
        <>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography m={2} gutterBottom color="text.secondary">
                    {t("users.features-access")} :
                </Typography>

                <Button
                    sx={{height: 34}}
                    variant={"contained"}
                    size={"small"}
                    onClick={() => {
                        setFieldValue(`roles`, [
                            ...values.roles,
                            {
                                feature: "",
                                featureUuid: "",
                                featureRoles: [],
                                featureProfiles: [],
                                profileUuid: ""
                            }]).then(() => {
                            (refContainer.current as any)?.scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                            });
                        });
                    }}
                    startIcon={<AddIcon/>}>
                    {t("users.add-feature-access")}
                </Button>
            </Stack>
            {values.roles.map((role: any, index: number) => (
                <Box mb={2} ml={2} key={`role-${index}`}>
                    <Grid
                        container
                        spacing={{lg: 2, xs: 1}}
                        alignItems="center">
                        <Grid item xs={12} lg={2}>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="feature-select-label"
                                    id={"feature"}
                                    {...getFieldProps(`roles[${index}].feature`)}
                                    onChange={event => {
                                        setFieldValue(`roles[${index}].feature`, event.target.value);
                                        const profile = features?.find((profile: any) => profile.uuid === event.target.value);
                                        const selectedFeatures = values.roles.reduce((roles: any[], role: any) => [...(roles ?? []), ...((role?.feature === event.target.value) ? [role?.featureUuid] : [])], []);

                                        switch (profile?.slug) {
                                            case "agenda":
                                                setFieldValue(`roles[${index}].featureRoles`, agendas.filter(feature => !selectedFeatures.includes(feature?.uuid)));
                                                break;
                                            case "cashbox":
                                                console.log("values.roles", values.roles)
                                                setFieldValue(`roles[${index}].featureRoles`, cashboxes.filter(feature => !selectedFeatures.includes(feature?.uuid)));
                                                break;
                                            default:
                                                setFieldValue(`roles[${index}].featureRoles`, []);
                                                break;
                                        }
                                        setFieldValue(`roles[${index}].featureProfiles`, []);
                                    }}
                                    renderValue={selected => {
                                        if ((selected as any).length === 0) {
                                            return <em>{t("users.feature")}</em>;
                                        }
                                        const profile = features?.find((profile: any) => profile.uuid === selected);
                                        return <Typography>{profile?.name}</Typography>
                                    }}
                                    displayEmpty
                                    sx={{color: "text.secondary"}}>
                                    {features?.map((profile: any) =>
                                        <MenuItem key={profile.uuid}
                                                  value={profile.uuid}>{profile.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        {(values.roles[index] as any).featureRoles?.length > 0 &&
                            <Grid item xs={12} lg={2}>
                                <FormControl size="small" fullWidth>
                                    <Select
                                        labelId="feature-uuid-select-label"
                                        id={"feature-uuid"}
                                        {...getFieldProps(`roles[${index}].featureUuid`)}
                                        renderValue={selected => {
                                            if ((selected as any).length === 0) {
                                                return <em>{t("users.feature-uuid")}</em>;
                                            }
                                            const profile = (values.roles[index] as any).featureRoles?.find((profile: any) => profile.uuid === selected);
                                            return <Typography>{profile?.name}</Typography>
                                        }}
                                        onChange={event => {
                                            setFieldValue(`roles[${index}].featureUuid`, event.target.value);
                                            handleProfilePermissions(index);
                                        }}
                                        displayEmpty
                                        sx={{color: "text.secondary"}}>
                                        {(values.roles[index] as any).featureRoles.map((profile: any) =>
                                            <MenuItem key={profile.uuid}
                                                      value={profile.uuid}>{profile.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>}
                        <Grid item xs={12}
                              lg={(values.roles[index] as any).featureRoles?.length > 0 ? 4.4 : 6.4}>
                            <Autocomplete
                                id={"feature-profile"}
                                autoHighlight
                                size="small"
                                value={(values.roles[index] as any).featureProfiles.find((profile: ProfileModel) => profile.uuid === (values.roles[index] as any)?.profileUuid) ?? null}
                                onChange={(e, profile) => {
                                    e.stopPropagation();
                                    console.log("profile", profile)
                                    setFieldValue(`roles[${index}].profileUuid`, profile?.uuid);
                                }}
                                options={(values.roles[index] as any).featureProfiles}
                                getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                                renderOption={(props, option) => (
                                    <ListItem {...props}>
                                        <ListItemText primary={option?.name}/>
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedProfile(option);
                                                    setSelectedFeature(index);
                                                    setTimeout(() => setOpenFeatureProfileDialog(true));
                                                }}
                                                sx={{
                                                    ml: 1
                                                }}
                                                edge={"end"}
                                                size="small">
                                                <IconUrl
                                                    color={theme.palette.primary.main}
                                                    path="ic-edit-patient"/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteProfile(option.uuid, index)}
                                                sx={{
                                                    ml: 1,
                                                    "& .react-svg": {
                                                        " & svg": {
                                                            height: 20,
                                                            width: 20
                                                        },
                                                    }
                                                }}
                                                edge={"end"}
                                                size="small">
                                                <IconUrl
                                                    color={theme.palette.error.main}
                                                    path="ic-trash"/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                                renderInput={params =>
                                    <TextField
                                        {...params}
                                        color={"info"}
                                        sx={{paddingLeft: 0}}
                                        placeholder={t("users.profile-feature")}
                                        variant="outlined"
                                        fullWidth/>}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3.6}>
                            <Stack direction={"row"} alignItems={"center"}
                                   spacing={1.2}
                                   justifyContent={"space-between"}>
                                <Button
                                    disabled={(values.roles[index] as any).feature?.length === 0}
                                    onClick={() => {
                                        setSelectedProfile(null);
                                        setSelectedFeature(index);
                                        setTimeout(() => setOpenFeatureProfileDialog(true));
                                    }}
                                    sx={{height: 34}}
                                    size={"small"}
                                    startIcon={<AddIcon/>}>
                                    {t("users.add-feature-profile")}
                                </Button>
                                <IconButton
                                    onClick={() => {
                                        const roles = [...values.roles];
                                        roles.splice(index, 1);
                                        setFieldValue(`roles`, values.roles.length > 0 ? roles : [])
                                    }}
                                    sx={{
                                        ml: 1,
                                        "& .react-svg": {
                                            " & svg": {
                                                height: 20,
                                                width: 20
                                            },
                                        }
                                    }}
                                    size="small"
                                    disableRipple>
                                    <IconUrl color={theme.palette.error.main}
                                             path="ic-trash"/>
                                </IconButton>
                            </Stack>
                        </Grid>
                    </Grid>
                    {/*<FormHelperText error>Vous définissez déjà les autorisations pour cette
                        fonctionnalité</FormHelperText>*/}

                </Box>))}
            <div ref={refContainer}/>
            <CustomDialog
                {...{direction}}
                action={"add-feature-profile"}
                open={openFeatureProfileDialog}
                data={{
                    t,
                    selected: selectedProfile,
                    feature: features?.find((profile: any) => profile.uuid === (values.roles[selectedFeature] as any)?.feature),
                    handleClose: () => {
                        setOpenFeatureProfileDialog(false);
                        handleProfilePermissions(selectedFeature, true);
                    }
                }}
                title={t("users.add_new_feature_profile")}
                size={"lg"}
                sx={{py: 0}}
                dialogClose={() => setOpenFeatureProfileDialog(false)}
            />
        </>
    )
}

export default FeaturePermissionsCard;
