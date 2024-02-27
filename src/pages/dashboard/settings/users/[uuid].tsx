import {GetStaticProps, GetStaticPaths} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState, memo, useRef} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import moment from "moment-timezone";
import {useFormik, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    Box,
    TextField,
    Grid,
    Button,
    IconButton, Tab, Tabs, Paper, List, ListItem, Divider, Badge, Collapse
} from "@mui/material";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {ContainerLayoutStyled, DashLayout, dashLayoutSelector} from "@features/base";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {addUser} from "@features/table";
import {agendaSelector} from "@features/calendar";
import {FormStyled} from "@features/forms";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {DatePicker} from "@features/datepicker";
import {LoadingButton} from "@mui/lab";
import {
    a11yProps,
    getPermissionsCount,
    groupPermissionsByFeature,
    mergeArrayByKey,
    useMedicalEntitySuffix
} from "@lib/hooks";
import {useSnackbar} from "notistack";
import {CountrySelect} from "@features/countrySelect";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {isValidPhoneNumber} from "libphonenumber-js";
import PhoneInput from "react-phone-number-input/input";
import {TabPanel, CustomInput, RootUserStyled} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import AddIcon from "@mui/icons-material/Add";
import {startCase} from "lodash";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {TreeCheckbox} from "@features/treeViewCheckbox";
import {useCashBox} from "@lib/hooks/rest";
import {NoDataCard} from "@features/card";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function ModifyUser() {
    const router = useRouter();
    const phoneInputRef = useRef(null);
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: session} = useSession();

    const {t, ready} = useTranslation("settings");
    const {agendas} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [loading, setLoading] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [agendaRoles] = useState(agendas);
    const [roles, setRoles] = useState<any[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [openCollapseFeature, setOpenCollapseFeature] = useState('');
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [selectedFeatureEntity, setSelectedFeatureEntity] = useState<any>(null);
    const [loadingReq, setLoadingReq] = useState(false);

    const {cashboxes} = useCashBox(tabIndex === 1);

    const {data: userData} = session as Session;
    const medical_entity = (userData as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const {uuid} = router.query;
    const {id: currentUser} = session?.user as any;

    const {data: httpUserResponse, error} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/users/${uuid}/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const {trigger: triggerUserUpdate} = useRequestQueryMutation("/user/update");
    const {trigger: featurePermissionsTrigger} = useRequestQueryMutation("/feature/permissions/update");

    const user = (httpUserResponse as HttpResponse)?.data ?? null;
    const features = (userData as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features ?? [];
    const readOnly = user?.ssoId !== currentUser

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("users.ntc"))
            .max(50, t("users.ntl"))
            .required(t("users.nameReq")),
        email: Yup.string()
            .email(t("users.mailInvalid"))
            .required(t("users.mailReq")),
        birthdate: Yup.string().nullable(),
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        phones: Yup.array().of(
            Yup.object().shape({
                dial: Yup.object().shape({
                    code: Yup.string(),
                    label: Yup.string(),
                    phone: Yup.string(),
                }),
                phone: Yup.string()
                    .test({
                        name: "is-phone",
                        message: t("telephone-error"),
                        test: (value) => {
                            return value ? isValidPhoneNumber(value) : false
                        }
                    })
            })
        ),
        oldPassword: Yup.string().when('password', {
            is: (val: string) => val && val.length > 0,
            then: (schema) => schema.required(t("password-error"))
        }),
        password: Yup.string(),
        confirmPassword: Yup.string().when('password', (password, field) =>
            password ? field.oneOf([Yup.ref('password')]) : field),
    });

    const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }

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

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            role: "",
            agendas: agendaRoles.map(agenda => ({...agenda, role: ""})),
            isProfessional: user?.isProfessional || false,
            email: user?.email || "",
            name: user?.userName || "",
            message: user?.message || "",
            admin: user?.admin || false,
            consultation_fees: user?.ConsultationFees || "",
            birthdate: user?.birthDate || null,
            firstName: user?.FirstName || " ",
            lastName: user?.lastName || " ",
            phones: [],
            profile: user?.profile?.uuid || "",
            oldPassword: "",
            password: "",
            confirmPassword: "",
            roles: initData()
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const form = new FormData();
            if (tabIndex === 0) {
                form.append('username', values.name);
                form.append('email', values.email);
                form.append('is_owner', values.admin);
                form.append('is_active', 'true');
                form.append('is_professional', values.isProfessional);
                form.append('is_accepted', 'true');
                form.append('is_public', "true");
                form.append('is_default', "true");
                values.birthdate && form.append('birthdate', moment(values.birthdate).format("DD/MM/YYYY"));
                form.append('firstname', values.firstName);
                form.append('lastname', values.lastName);
                values.phones.length > 0 && form.append('phone', JSON.stringify(values.phones.map((phoneData: any) => ({
                    code: phoneData.dial?.phone,
                    value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
                    type: "phone",
                    is_public: false,
                    is_support: false
                }))));
                form.append('profile', values.profile);
                form.append('oldPassword', values.oldPassword);
                form.append('password', values.password);

                triggerUserUpdate({
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/edit/user/${uuid}/${router.locale}`,
                    data: form
                }, {
                    onSuccess: () => {
                        enqueueSnackbar(t("users.alert.update"), {variant: "error"});
                        setLoading(false)
                        dispatch(addUser({...values}));
                        router.push("/dashboard/settings/users");
                    },
                    onError: () => {
                        setLoading(false);
                        enqueueSnackbar(t("users.alert.went_wrong"), {variant: "error"});
                    }
                });
            } else {
                const feature = selectedFeatureEntity ? values.roles[selectedFeature].find((feature: FeatureModel) => feature.featureEntity?.uuid === selectedFeatureEntity.uuid) : values.roles[selectedFeature][0];
                const permissions = feature?.permissions?.reduce((permissions: any[], permission: PermissionModel) =>
                    [...(permissions ?? []),
                        ...(permission.children?.filter(permission => permission?.checked) ?? [])], []) ?? [];

                form.append('permissions', JSON.stringify(Object.assign({}, permissions.map((permission: PermissionModel) => permission.uuid))));
                form.append('user', medicalEntityHasUser as string);
                if (selectedFeatureEntity) {
                    form.append('object', JSON.stringify({
                        uuid: selectedFeatureEntity.uuid,
                        type: selectedFeature
                    }));
                }

                triggerUserUpdate({
                    method: feature?.profile ? "PUT" : "POST",
                    url: `${urlMedicalEntitySuffix}/features/${selectedFeature}/profiles${feature?.profile ? `/${feature?.profile}` : ""}/${router.locale}`,
                    data: form
                }, {
                    onSuccess: () => {
                        enqueueSnackbar(t(`users.alert.updated-role`), {variant: "success"});
                        setLoading(false)

                    },
                    onError: () => {
                        setLoading(false);
                        enqueueSnackbar(t("users.alert.went_wrong"), {variant: "error"});
                    }
                });
            }
        }
    });

    const handleTreeCheck = (uuid: string, value: boolean, hasChildren: boolean, group: string, featurePermission: any, index: number) => {
        if (hasChildren) {
            const groupUuid = featurePermission?.permissions.findIndex((permission: PermissionModel) => permission.uuid === uuid);
            setFieldValue(`roles[${selectedFeature}][${index}].permissions[${groupUuid}]`, {
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
            const field = `roles[${selectedFeature}][${index}].permissions[${permissionUuid}].children[${permissionChildIndex}].checked`;
            setFieldValue(field, value);
        }
    }

    const HandleFeatureSelect = (slug: string, roles: any, hasProfile?: boolean, entity?: any) => {
        if (!hasProfile) {
            setLoadingReq(true);
            featurePermissionsTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/permissions/${router.locale}?feature=${slug}`
            }, {
                onSuccess: (result) => {
                    setSelectedFeature(slug);
                    const permissions = (result?.data as HttpResponse)?.data;
                    const groupedPermissions = groupPermissionsByFeature(permissions);

                    if (entity) {
                        values.roles[slug].forEach((role: any, featureEntityIndex: number) =>
                            setFieldValue(
                                `roles[${slug}][${featureEntityIndex}].featureEntity.checked`,
                                role.featureEntity.uuid === entity.uuid));
                    }

                    medicalEntityHasUser && featurePermissionsTrigger({
                        method: "GET",
                        url: `${urlMedicalEntitySuffix}/features/${slug}/mehu/${user?.uuid}/profiles/${router.locale}${entity ? `?object=${entity.uuid}` : ""}`
                    }, {
                        onSuccess: (result) => {
                            const profiles = (result?.data as HttpResponse)?.data ?? [];
                            const featureProfileIndex = entity ? values.roles[slug].findIndex((role: any) => role.featureEntity?.uuid === entity.uuid) : 0;
                            const feature = values.roles[slug][featureProfileIndex];
                            const allFeaturePermissions = feature.permissions;
                            const permissionsGrouped = profiles.length > 0 ?
                                groupPermissionsByFeature(mergeArrayByKey(permissions, profiles[0].permissions.map((permission: PermissionModel) => ({
                                    ...permission,
                                    checked: true
                                })), "uuid"))
                                : allFeaturePermissions;
                            setFieldValue(`roles[${slug}][${featureProfileIndex}].profile`, profiles[0]?.uuid);
                            setFieldValue(`roles[${slug}][${featureProfileIndex}].permissions`,
                                groupedPermissions.map((permission: any) => ({
                                    ...permission,
                                    collapseIn: permissionsGrouped[0]?.collapseIn ?? false,
                                    children: permission.children.map((item: PermissionModel) => {
                                        const permissions = permissionsGrouped.find((permission: PermissionModel) => permission.uuid === item.slug?.split("__")[1]);
                                        return {
                                            ...item,
                                            checked: permissions?.children.reduce((permissions: string[], permission: PermissionModel) => [...(permissions ?? []), ...(permission.checked ? [permission.uuid] : [])], []).includes(item.uuid) ?? false
                                        }
                                    })
                                })))
                        },
                        onSettled: () => setLoadingReq(false)
                    });
                },
                onSettled: () => setLoadingReq(false)
            });
        } else {
            setOpenCollapseFeature(openCollapseFeature === slug ? "" : slug);
            setRoles([]);
        }
    }

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
    } = formik;

    if (!ready || error) {
        return <LoadingScreen button {...(error ? {
            OnClick: () => router.push('/dashboard/settings/users'),
            text: 'loading-error-404-reset'
        } : {})}/>;
    }

    return (
        <>
            <SubHeader sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Stack direction="row" alignItems="center" mt={2} justifyContent="space-between" width={1}>
                    <Tabs value={tabIndex} onChange={handleChangeTabs} aria-label="">
                        <Tab disableRipple label={t("users.config.personal-info")} {...a11yProps(0)} />
                        {readOnly && <Tab disableRipple label={t("users.config.roles_permissons")} {...a11yProps(1)} />}
                    </Tabs>
                </Stack>
            </SubHeader>

            <ContainerLayoutStyled className="container">
                <FormikProvider value={formik}>
                    <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <TabPanel value={tabIndex} index={0} padding={0}>
                            <Typography marginBottom={2} gutterBottom>
                                {t("users.user")}
                            </Typography>
                            <Card className="venue-card">
                                <CardContent>
                                    <Box mb={2}>
                                        <Grid
                                            container
                                            spacing={{lg: 2, xs: 1}}
                                            alignItems="center">
                                            <Grid item xs={12} lg={2}>
                                                <Typography
                                                    textAlign={{lg: "right", xs: "left"}}
                                                    color="text.secondary"
                                                    variant="body2"
                                                    fontWeight={400}>
                                                    {t("users.mail")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={10}>
                                                <TextField
                                                    disabled={readOnly}
                                                    variant="outlined"
                                                    placeholder={t("exemple@mail.com")}
                                                    fullWidth
                                                    error={Boolean(touched.email && errors.email)}
                                                    required
                                                    {...getFieldProps("email")}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mb={2}>
                                        <Grid
                                            container
                                            spacing={{lg: 2, xs: 1}}
                                            alignItems="center">
                                            <Grid item xs={12} lg={2}>
                                                <Typography
                                                    textAlign={{lg: "right", xs: "left"}}
                                                    color="text.secondary"
                                                    variant="body2"
                                                    fontWeight={400}>
                                                    {t("users.name")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={10}>
                                                <TextField
                                                    disabled
                                                    variant="outlined"
                                                    placeholder={t("users.tname")}
                                                    fullWidth
                                                    required
                                                    error={Boolean(touched.name && errors.name)}
                                                    {...getFieldProps("name")}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mb={2}>
                                        <Grid
                                            container
                                            spacing={{lg: 2, xs: 1}}
                                            alignItems="center">
                                            <Grid item xs={12} lg={2}>
                                                <Typography
                                                    textAlign={{lg: "right", xs: "left"}}
                                                    color="text.secondary"
                                                    variant="body2"
                                                    fontWeight={400}>
                                                    {t("users.birthdate")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={10}>
                                                <DatePicker
                                                    value={values.birthdate}
                                                    onChange={(newValue: any) => {
                                                        setFieldValue("birthdate", newValue);
                                                    }}
                                                    InputProps={{
                                                        error: Boolean(touched.birthdate && errors.birthdate),
                                                        sx: {
                                                            button: {
                                                                p: 0
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mb={2}>
                                        <Grid
                                            container
                                            spacing={{lg: 2, xs: 1}}
                                            alignItems="center">
                                            <Grid item xs={12} lg={2}>
                                                <Typography
                                                    textAlign={{lg: "right", xs: "left"}}
                                                    color="text.secondary"
                                                    variant="body2"
                                                    fontWeight={400}>
                                                    {t("users.firstname")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={10}>
                                                <TextField
                                                    disabled={readOnly}
                                                    variant="outlined"
                                                    placeholder={t("users.firstname")}
                                                    fullWidth
                                                    required
                                                    error={Boolean(touched.firstName && errors.firstName)}
                                                    {...getFieldProps("firstName")}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mb={2}>
                                        <Grid
                                            container
                                            spacing={{lg: 2, xs: 1}}
                                            alignItems="center">
                                            <Grid item xs={12} lg={2}>
                                                <Typography
                                                    textAlign={{lg: "right", xs: "left"}}
                                                    color="text.secondary"
                                                    variant="body2"
                                                    fontWeight={400}>
                                                    {t("users.lastname")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} lg={10}>
                                                <TextField
                                                    disabled={readOnly}
                                                    {...getFieldProps("lastName")}
                                                    variant="outlined"
                                                    placeholder={t("users.lastname")}
                                                    fullWidth
                                                    required
                                                    error={Boolean(touched.lastName && errors.lastName)}

                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {values.phones.map((phoneObject: any, index: number) => (
                                        <Box mb={2} key={index}>
                                            <Grid
                                                container
                                                spacing={{lg: 2, xs: 1}}
                                                alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography
                                                        textAlign={{lg: "right", xs: "left"}}
                                                        color="text.secondary"
                                                        variant="body2"
                                                        fontWeight={400}>
                                                        {t("users.phone")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={10}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={4}>
                                                            <PhoneCountry
                                                                initCountry={getFieldProps(`phones[${index}].dial`).value}
                                                                onSelect={(state: any) => {
                                                                    setFieldValue(`phones[${index}].phone`, "");
                                                                    setFieldValue(`phones[${index}].dial`, state);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={7.5}>
                                                            {phoneObject && <PhoneInput
                                                                ref={phoneInputRef}
                                                                international
                                                                fullWidth
                                                                withCountryCallingCode
                                                                error={Boolean(errors.phones && (errors.phones as any)[index])}
                                                                country={phoneObject.dial?.code.toUpperCase() as any}
                                                                value={getFieldProps(`phones[${index}].phone`) ?
                                                                    getFieldProps(`phones[${index}].phone`).value : ""}
                                                                onChange={value => setFieldValue(`phones[${index}].phone`, value)}
                                                                inputComponent={CustomInput as any}
                                                            />}
                                                        </Grid>
                                                        <Grid item xs={12} md={.5}>
                                                            <IconButton
                                                                sx={{mt: .2, p: 1, ml: -1}}
                                                                onClick={() => {
                                                                    const phones = [...values.phones];
                                                                    phones.splice(index, 1)
                                                                    setFieldValue(`phones`, values.phones.length > 0 ? phones : [])
                                                                }}
                                                                size="small">
                                                                <IconUrl path="setting/icdelete"/>
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                    {!readOnly && <Box mb={4} ml={5}>
                                        <Button
                                            size={"small"}
                                            onClick={() => {
                                                setFieldValue(`phones`, [
                                                    ...values.phones,
                                                    {
                                                        phone: "", dial: doctor_country
                                                    }])
                                            }}
                                            startIcon={<AddIcon/>}>
                                            {t("lieux.new.addNumber")}
                                        </Button>
                                    </Box>}

                                </CardContent>
                            </Card>

                            {!readOnly && <>
                                <Typography marginBottom={2} gutterBottom>
                                    {t("users.password")}
                                </Typography>
                                <Card className="venue-card">
                                    <CardContent>
                                        <Box mb={2}>
                                            <Grid
                                                container
                                                spacing={{lg: 2, xs: 1}}
                                                alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography
                                                        textAlign={{lg: "right", xs: "left"}}
                                                        color="text.secondary"
                                                        variant="body2"
                                                        fontWeight={400}>
                                                        {t("users.oldPassword")}{" "}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <TextField
                                                        disabled={readOnly}
                                                        type="password"
                                                        variant="outlined"
                                                        placeholder={t("users.oldPassword")}
                                                        fullWidth
                                                        required
                                                        error={Boolean(touched.oldPassword && errors.oldPassword)}
                                                        {...getFieldProps("oldPassword")}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box mb={2}>
                                            <Grid
                                                container
                                                spacing={{lg: 2, xs: 1}}
                                                alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography
                                                        textAlign={{lg: "right", xs: "left"}}
                                                        color="text.secondary"
                                                        variant="body2"
                                                        fontWeight={400}>
                                                        {t("users.password")}{" "}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <TextField
                                                        disabled={readOnly}
                                                        type="password"
                                                        variant="outlined"
                                                        placeholder={t("users.password")}
                                                        fullWidth
                                                        required
                                                        error={Boolean(touched.password && errors.password)}
                                                        {...getFieldProps("password")}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box mb={2}>
                                            <Grid
                                                container
                                                spacing={{lg: 2, xs: 1}}
                                                alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography
                                                        textAlign={{lg: "right", xs: "left"}}
                                                        color="text.secondary"
                                                        variant="body2"
                                                        fontWeight={400}>
                                                        {t("users.confirm_password")}{" "}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <TextField
                                                        disabled={readOnly}
                                                        type="password"
                                                        variant="outlined"
                                                        placeholder={t("users.confirm_password")}
                                                        fullWidth
                                                        required
                                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                                        {...getFieldProps("confirmPassword")}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </>}


                            <div style={{paddingBottom: "50px"}}></div>
                            <Stack
                                className="bottom-section"
                                justifyContent="flex-end"
                                spacing={2}
                                direction={"row"}>
                                <Button onClick={() => router.back()}>
                                    {t("motif.dialog.cancel")}
                                </Button>
                                {!readOnly && <LoadingButton
                                    {...{loading}}
                                    disabled={Object.keys(errors).length > 0}
                                    type="submit" variant="contained" color="primary">
                                    {t("motif.dialog.save")}
                                </LoadingButton>}
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1} padding={0}>
                            <RootUserStyled container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Paper sx={{px: 2, pb: 2, pt: 1, borderRadius: 1}}>
                                        <Typography my={2} fontSize={16} fontWeight={800} variant="body2">
                                            {startCase(t("features"))}
                                        </Typography>
                                        <List disablePadding>
                                            {Object.entries(values?.roles)?.map((role: any) => (
                                                <ListItem
                                                    onClick={() => {
                                                        setSelectedFeatureEntity(null);
                                                        HandleFeatureSelect(role[0], role[1], role[1][0].hasProfile);
                                                    }}
                                                    className={`motif-list`}
                                                    sx={{
                                                        py: 1,
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        ".MuiListItemSecondaryAction-root": {right: 0}
                                                    }}
                                                    {...(role[1][0]?.hasProfile && {
                                                            secondaryAction:
                                                                <Stack direction={"row"}>
                                                                    {openCollapseFeature.includes(role[0]) ?
                                                                        <ExpandLess/> :
                                                                        <ExpandMore/>}
                                                                </Stack>
                                                        }
                                                    )}
                                                    key={role[0]}>
                                                    <Stack direction={"row"} alignItems={"center"} width={"100%"}
                                                           justifyContent={"space-between"} spacing={2}>
                                                        <Typography fontSize={14} fontWeight={600} variant='caption'>
                                                            {startCase(role[0])}
                                                        </Typography>

                                                        {role[1][0]?.hasProfile && <Badge sx={{ml: 2}}
                                                                                          badgeContent={role[1].length}
                                                                                          color="info"/>}
                                                    </Stack>
                                                    <Collapse
                                                        {...(openCollapseFeature.includes(role[0]) && {
                                                            sx: {
                                                                marginTop: "1rem",
                                                                width: 200
                                                            }
                                                        })}
                                                        in={openCollapseFeature.includes(role[0])}
                                                        onClick={(e) => e.stopPropagation()}>
                                                        {role[1].map((featurePermission: any, index: number) =>
                                                            <Box
                                                                key={`${index}-${featurePermission?.uuid}`}
                                                                p={2}
                                                                onClick={event => {
                                                                    event.stopPropagation();
                                                                    setSelectedFeatureEntity(featurePermission.featureEntity);
                                                                    setSelectedFeature(role[0]);
                                                                    HandleFeatureSelect(role[0], role[1], false, featurePermission.featureEntity);
                                                                }}
                                                                className={`motif-list ${selectedFeatureEntity?.uuid === featurePermission?.featureEntity?.uuid ? "selected" : ""}`}>
                                                                <Stack direction={"row"} alignItems={"center"}
                                                                       justifyContent={"space-between"}>
                                                                    <Typography fontSize={14} fontWeight={600}
                                                                                variant='subtitle1'>
                                                                        {featurePermission.featureEntity?.name}
                                                                    </Typography>
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Collapse>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Paper sx={{p: 2, borderRadius: 2}}>
                                        <Stack
                                            spacing={{xs: 1, md: 2}}
                                            direction={{xs: 'column', md: 'row'}}
                                            justifyContent={"space-between"}
                                            alignItems={{xs: 'stretch', md: 'center'}}>
                                            <Stack direction={"row"} alignItems={"center"} spacing={1} width={"100%"}>
                                                <Typography fontSize={16} fontWeight={600}>
                                                    {startCase(selectedFeature)}
                                                </Typography>
                                                {!!selectedFeatureEntity &&
                                                    <Stack direction={"row"} pt={.36} alignItems={"center"}
                                                           spacing={.5}>
                                                        <span>{"=>"}</span>
                                                        <Typography fontSize={14} fontWeight={600}>
                                                            {startCase(selectedFeatureEntity.name)}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                <Badge sx={{pl: 1}}
                                                       badgeContent={getPermissionsCount(values.roles[selectedFeature] ?? [])}
                                                       color="primary"/>
                                            </Stack>

                                            <LoadingButton
                                                {...{loading}}
                                                loadingPosition={"start"}
                                                disabled={getPermissionsCount(values.roles[selectedFeature] ?? []) === 0}
                                                type="submit"
                                                sx={{minWidth: 130}}
                                                variant="contained"
                                                startIcon={<IconUrl path="iconfinder_save"/>}>
                                                {t("users.config.save")}
                                            </LoadingButton>
                                        </Stack>
                                        <Divider sx={{mt: 2}}/>
                                        <ListItem className={"motif-list"}>
                                            <Collapse in={true}>
                                                {values.roles[selectedFeature]?.map((featurePermission: any, index: number) =>
                                                    (featurePermission?.featureEntity?.checked || !featurePermission.hasProfile) &&
                                                    <Box key={`${index}-${featurePermission?.uuid}`} pr={4}
                                                         className={"collapse-wrapper permissions-wrapper"}>
                                                        <TreeCheckbox
                                                            {...{t}}
                                                            data={featurePermission?.permissions ?? []}
                                                            onCollapseIn={(uuid: string, value: boolean) => setFieldValue(`roles[${selectedFeature}][${index}].permissions[${featurePermission?.permissions.findIndex((permission: PermissionModel) => permission.uuid === uuid)}].collapseIn`, value)}
                                                            onNodeCheck={(uuid: string, value: boolean, hasChildren: boolean, group: string) => handleTreeCheck(uuid, value, hasChildren, group, featurePermission, index)}
                                                        />
                                                    </Box>)}
                                                {!selectedFeature && <NoDataCard
                                                    {...{t}}
                                                    ns={"settings"}
                                                    data={{
                                                        mainIcon: "setting/ic-users",
                                                        title: "users.config.no-data.permissions.title",
                                                        description: "users.config.no-data.permissions.description"
                                                    }}/>}

                                            </Collapse>
                                        </ListItem>
                                    </Paper>
                                </Grid>
                            </RootUserStyled>
                            <div style={{paddingBottom: "50px"}}></div>
                            <Stack
                                className="bottom-section"
                                justifyContent="flex-end"
                                spacing={2}
                                direction={"row"}>
                                <Button onClick={() => router.back()}>
                                    {t("motif.dialog.cancel")}
                                </Button>
                            </Stack>
                        </TabPanel>
                    </FormStyled>
                </FormikProvider>
            </ContainerLayoutStyled>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "common",
                "menu",
                "patient",
                "settings",
            ])),
        },
    }
};

export default ModifyUser;

ModifyUser.auth = true;

ModifyUser.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
