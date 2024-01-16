import {
    Autocomplete,
    Box,
    Button, CircularProgress,
    FormControl, FormHelperText,
    Grid, IconButton,
    ListItem, ListItemSecondaryAction, ListItemText,
    Stack, TextField,
    Typography, useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import React, {useEffect, useRef, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useCashBox} from "@lib/hooks/rest";
import {useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Dialog as CustomDialog} from "@features/dialog";
import {configSelector} from "@features/base";

function FeaturePermissionsCard({...props}) {
    const {t, features, values, setFieldValue} = props;
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
    const [openAutoComplete, setOpenAutoComplete] = useState({index: 0, value: false});

    const {trigger: profilePermissionsTrigger} = useRequestQueryMutation("/settings/profile/permissions/get");
    const {trigger: deleteProfileTrigger} = useRequestQueryMutation("/settings/profile/delete");

    const handleProfilePermissions = (index: number, hasProfileSet?: boolean, slug?: string) => {
        setLoading(true);
        profilePermissionsTrigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/features/${slug}/profiles/${router.locale}`
        }, {
            onSuccess: (result) => {
                const profiles = (result?.data as HttpResponse)?.data;
                setFieldValue(`roles[${index}].featureProfiles`, profiles);
                if (hasProfileSet) {
                    setFieldValue(`roles[${index}].profileUuid`, profiles[profiles?.length - 1]);
                }
                setLoading(false);
            },
            onError: () => setLoading(false)
        });
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

    const loadingReq = openAutoComplete.value && (values.roles[selectedFeature] as any)?.featureProfiles.length === 0;
    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!loadingReq) {
            return undefined;
        }

        (async () => {
            handleProfilePermissions(selectedFeature, false, (values.roles[selectedFeature] as any)?.feature);
        })();
    }, [loadingReq]); // eslint-disable-line react-hooks/exhaustive-deps


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
                                hasMultipleInstance: false,
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
                                <Autocomplete
                                    id={"feature"}
                                    size="small"
                                    value={features.find((feature: any) => feature.slug === role.feature) ?? null}
                                    onChange={(e, feature) => {
                                        if (feature) {
                                            const slug = feature.slug;
                                            setFieldValue(`roles[${index}].feature`, slug);
                                            setFieldValue(`roles[${index}].hasMultipleInstance`, feature.hasProfile);

                                            const selectedFeatures = values.roles.reduce((roles: any[], role: any) => [...(roles ?? []), ...((role?.feature === slug) ? [role?.featureUuid] : [])], []);
                                            switch (slug) {
                                                case "agenda":
                                                    setFieldValue(`roles[${index}].featureRoles`, agendas.filter(feature => !selectedFeatures.includes(feature?.uuid)));
                                                    break;
                                                case "cashbox":
                                                    setFieldValue(`roles[${index}].featureRoles`, cashboxes.filter(feature => !selectedFeatures.includes(feature?.uuid)));
                                                    break;
                                                default:
                                                    setFieldValue(`roles[${index}].featureRoles`, []);
                                                    setTimeout(() => handleProfilePermissions(index, false, slug), 1000);
                                                    break;
                                            }
                                            setFieldValue(`roles[${index}].featureProfiles`, []);
                                        } else {
                                            setFieldValue(`roles[${index}].feature`, "");
                                            setFieldValue(`roles[${index}].featureUuid`, "");
                                            setFieldValue(`roles[${index}].profileUuid`, "");
                                        }
                                    }}
                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                                    renderOption={(props, option) => (
                                        <ListItem {...props}>
                                            <ListItemText primary={option?.name}/>
                                        </ListItem>
                                    )}
                                    options={features}
                                    sx={{color: "text.secondary"}}
                                    renderInput={params =>
                                        <TextField
                                            {...params}
                                            color={"info"}
                                            sx={{paddingLeft: 0}}
                                            placeholder={t("users.feature-uuid")}
                                            variant="outlined"
                                            fullWidth/>}/>
                            </FormControl>
                        </Grid>
                        {role.featureRoles?.length > 0 &&
                            <Grid item xs={12} lg={2}>
                                <FormControl size="small" fullWidth>
                                    <Autocomplete
                                        autoHighlight
                                        size="small"
                                        id={"feature-uuid"}
                                        value={role.featureRoles.find((profile: ProfileModel) => profile.uuid === role?.featureUuid?.uuid) ?? null}
                                        options={role.featureRoles}
                                        getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                        isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                                        renderOption={(props, option) => (
                                            <ListItem {...props}>
                                                <ListItemText primary={option?.name}/>
                                            </ListItem>
                                        )}
                                        onChange={(e, feature) => {
                                            setFieldValue(`roles[${index}].featureUuid`, feature);
                                            handleProfilePermissions(index, false, role?.feature);
                                        }}
                                        sx={{color: "text.secondary"}}
                                        renderInput={params =>
                                            <TextField
                                                {...params}
                                                color={"info"}
                                                sx={{paddingLeft: 0}}
                                                placeholder={t("users.feature-uuid")}
                                                variant="outlined"
                                                fullWidth/>}
                                    />
                                </FormControl>
                            </Grid>}
                        <Grid item xs={12}
                              lg={role.featureRoles?.length > 0 ? 4.4 : 6.4}>
                            <Autocomplete
                                loading={loadingReq && openAutoComplete.index === index}
                                id={"feature-profile"}
                                disableClearable
                                disabled={role.feature === ""}
                                autoHighlight
                                size="small"
                                open={openAutoComplete["index"] === index && openAutoComplete["value"]}
                                onOpen={() => {
                                    setSelectedFeature(index);
                                    setTimeout(() => setOpenAutoComplete({index, value: true}));
                                }}
                                onClose={() => {
                                    setOpenAutoComplete({index, value: false});
                                }}
                                value={role.featureProfiles.find((profile: ProfileModel) => profile.uuid === role?.profileUuid?.uuid) ?? null}
                                inputValue={role?.profileUuid?.name ?? ""}
                                onInputChange={(event, value, reason) => {
                                    if (reason !== 'reset') {
                                        setFieldValue(`roles[${index}].profileUuid`, value)
                                    }
                                }}
                                onChange={(e, profile) => {
                                    e.stopPropagation();
                                    setFieldValue(`roles[${index}].profileUuid`, profile);
                                }}
                                filterOptions={(options, params) => {
                                    return options;
                                }}
                                options={(values.roles[index] as any).featureProfiles}
                                getOptionLabel={(option: any) => typeof option === "string" ? option : (option?.name ?? "")}
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
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loadingReq && openAutoComplete.index === index ?
                                                        <CircularProgress color="inherit" size={20}/> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                        fullWidth/>}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3.6}>
                            <Stack direction={"row"} alignItems={"center"}
                                   spacing={1.2}
                                   justifyContent={"space-between"}>
                                <Button
                                    disabled={role.feature?.length === 0}
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
                    {(values.roles[index] &&
                            role.featureRoles?.length === 0 &&
                            role.hasMultipleInstance) &&
                        <FormHelperText error>Vous définissez déjà les autorisations pour cette
                            fonctionnalité</FormHelperText>}

                </Box>))}
            <div ref={refContainer}/>
            <CustomDialog
                {...{direction}}
                action={"add-feature-profile"}
                open={openFeatureProfileDialog}
                data={{
                    t,
                    selected: selectedProfile,
                    featureSlug: (values.roles[selectedFeature] as any)?.feature,
                    handleClose: (data: any) => {
                        setOpenFeatureProfileDialog(false);
                        data?.refresh && handleProfilePermissions(selectedFeature, true, (values.roles[selectedFeature] as any)?.feature);
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
