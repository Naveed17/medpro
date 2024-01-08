import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState, useEffect, memo, useRef} from "react";
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
    Select,
    Button,
    FormControlLabel,
    Checkbox,
    MenuItem,
    FormControl,
    IconButton,
    useTheme,
    Avatar,
    InputAdornment,
    Autocomplete,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {configSelector, DashLayout} from "@features/base";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {addUser} from "@features/table";
import {FormStyled} from "@features/forms";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DatePicker} from "@features/datepicker";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import {CountrySelect} from "@features/countrySelect";
import {DefaultCountry} from "@lib/constants";
import PhoneInput from "react-phone-number-input/input";
import {CustomInput} from "@features/tabPanel";
import {isValidPhoneNumber} from "libphonenumber-js";
import {useCashBox, useContactType} from "@lib/hooks/rest";
import AddIcon from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import {agendaSelector} from "@features/calendar";
import {Dialog as CustomDialog} from "@features/dialog";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import DeleteIcon from "@mui/icons-material/Delete";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function NewUser() {
    const {contacts} = useContactType();
    const router = useRouter();
    const phoneInputRef = useRef(null);
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const {cashboxes} = useCashBox();
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("settings");
    const {agendas} = useAppSelector(agendaSelector);
    const {direction} = useAppSelector(configSelector);

    const [loading, setLoading] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [agendaRoles] = useState<any[]>([]);
    const [featureRoles, setFeatureRoles] = useState<any[]>([]);
    const [openFeatureProfileDialog, setOpenFeatureProfileDialog] = useState(false);

    const {data: userSession} = session as Session;
    const medical_entity = (userSession as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;

    const {data: httpProfilesResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile`
    }, ReactQueryNoValidateConfig);

    const {trigger: profilePermissionsTrigger} = useRequestQueryMutation("/settings/profile/permissions/get");
    const {trigger: deleteProfileTrigger} = useRequestQueryMutation("/settings/profile/delete");
    const {trigger: triggerUserAdd} = useRequestQueryMutation("/users/add");

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, t("users.ntc")).max(50, t("users.ntl")).required(t("users.nameReq")),
        email: Yup.string().email(t("users.mailInvalid")).required(t("users.mailReq")),
        birthdate: Yup.string().nullable(),
        firstname: Yup.string().required(),
        lastname: Yup.string().required(),
        password: Yup.string().required(),
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
                    }),
            })
        ),
        confirmPassword: Yup.string().when('password', (password, field) =>
            password ? field.required().oneOf([Yup.ref('password')]) : field),
        profile: Yup.string().required(),
        roles: Yup.array().of(
            Yup.object().shape({
                feature: Yup.string(),
                featureUuid: Yup.string(),
                featureRoles: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string(),
                        uuid: Yup.string()
                    })
                ),
                featureProfiles: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string(),
                        uuid: Yup.string()
                    })
                ),
                profileUuid: Yup.string()
            })
        )
    });

    const formik = useFormik({
        initialValues: {
            role: "",
            agendas: agendaRoles.map((agenda: any) => ({...agenda, role: ""})),
            professionnel: false,
            email: "",
            name: "",
            message: "",
            admin: false,
            consultation_fees: "",
            birthdate: null,
            firstname: "",
            lastname: "",
            phones: [],
            password: "",
            confirmPassword: "",
            profile: "",
            roles: []
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const form = new FormData();
            form.append('username', values.name);
            form.append('email', values.email);
            form.append('is_owner', JSON.stringify(values.admin));
            form.append('is_active', 'true');
            form.append('is_professional', JSON.stringify(values.professionnel));
            form.append('is_accepted', 'true');
            form.append('is_public', "true");
            form.append('is_default', "true");
            values.birthdate && form.append('birthdate', moment(values.birthdate).format("DD/MM/YYYY"));
            form.append('firstname', values.firstname);
            form.append('lastname', values.lastname);
            values.phones.length > 0 && form.append('phone', JSON.stringify(values.phones.map((phoneData: any) => ({
                code: phoneData.dial?.phone,
                value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
                type: "phone",
                contact_type: contacts[0].uuid,
                is_public: false,
                is_support: false
            }))));
            form.append('password', values.password);
            !values.admin && form.append('profile', values.profile);

            triggerUserAdd({
                method: "POST",
                url: `/api/medical-entity/${medical_entity.uuid}/users/${router.locale}`,
                data: form
            }, {
                onSuccess: () => {
                    enqueueSnackbar(t("users.alert.success"), {variant: "success"});
                    setLoading(false)
                    dispatch(addUser({...values}));
                    router.push("/dashboard/settings/users");
                }
            });

        },
    });

    const profiles = ((httpProfilesResponse as HttpResponse)?.data ?? []) as ProfileModel[];
    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue
    } = formik;

    const handleProfilePermissions = (index: number, hasProfileSet?: boolean) => {
        const feature = featureRoles?.find((profile: ProfileModel) => profile.uuid === (values.roles[index] as any)?.feature);
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

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);
    console.log("values", values)
    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("users.path_new")}</p>
                </RootStyled>
            </SubHeader>

            <Box className="container">
                <FormikProvider value={formik}>
                    <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
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
                                                {t("users.birthdate")}
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
                                                variant="outlined"
                                                placeholder={t("users.firstname")}
                                                fullWidth
                                                required
                                                error={Boolean(touched.firstname && errors.firstname)}
                                                {...getFieldProps("firstname")}
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
                                                variant="outlined"
                                                placeholder={t("users.lastname")}
                                                fullWidth
                                                required
                                                error={Boolean(touched.lastname && errors.lastname)}
                                                {...getFieldProps("lastname")}
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
                                                            sx={{
                                                                mt: .2, p: 1, ml: -1,
                                                                "& .react-svg": {
                                                                    " & svg": {
                                                                        height: 24,
                                                                        width: 24
                                                                    },
                                                                }
                                                            }}
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
                                <Box mb={4} ml={5}>
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

                        <Typography marginBottom={2} gutterBottom>
                            {t("users.roles")}
                        </Typography>

                        <Card className="venue-card">
                            <CardContent>
                                {!values.admin && <Box mb={2}>
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
                                                {t("users.profile")}{" "}

                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <FormControl size="small" fullWidth
                                                         error={Boolean(touched.profile && errors.profile)}>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id={"role"}
                                                    {...getFieldProps("profile")}
                                                    onChange={(event) => {
                                                        console.log("event", event)
                                                        setFieldValue("profile", event.target.value);
                                                        setFeatureRoles(profiles.find(profile => profile?.uuid === event.target.value)?.features ?? [])
                                                    }}
                                                    renderValue={selected => {
                                                        if (selected.length === 0) {
                                                            return <em>{t("users.profile")}</em>;
                                                        }
                                                        const profile = profiles?.find(profile => profile.uuid === selected);
                                                        return <Typography>{profile?.name}</Typography>
                                                    }}
                                                    displayEmpty
                                                    sx={{color: "text.secondary"}}>
                                                    {profiles.map(profile =>
                                                        <MenuItem key={profile.uuid}
                                                                  value={profile.uuid}>{profile.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>}
                                <Box mb={2}>
                                    <Grid
                                        container
                                        spacing={{lg: 2, xs: 1}}
                                        alignItems="center">
                                        <Grid item xs={12} lg={2}></Grid>
                                        <Grid item xs={12} lg={10}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.admin}
                                                        onClick={() => {
                                                            setFieldValue("admin", !values.admin);
                                                        }}
                                                    />
                                                }
                                                label={t("users.admin")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                {!values.admin &&
                                    <>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Typography m={2} gutterBottom color="text.secondary">
                                                {t("users.features-access")} :
                                            </Typography>

                                            <Button
                                                sx={{height: 34}}
                                                disabled={values.profile === ""}
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
                                                        }])
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
                                                                    const profile = featureRoles?.find(profile => profile.uuid === event.target.value);
                                                                    switch (profile?.slug) {
                                                                        case "agenda":
                                                                            setFieldValue(`roles[${index}].featureRoles`, agendas);
                                                                            break;
                                                                        case "cashbox":
                                                                            setFieldValue(`roles[${index}].featureRoles`, cashboxes);
                                                                            break;
                                                                        default:
                                                                            setFieldValue(`roles[${index}].featureRoles`, []);
                                                                            break;
                                                                    }
                                                                    setFieldValue(`roles[${index}].featureProfiles`, []);
                                                                }}
                                                                renderValue={selected => {
                                                                    if (selected.length === 0) {
                                                                        return <em>{t("users.feature")}</em>;
                                                                    }
                                                                    const profile = featureRoles?.find(profile => profile.uuid === selected);
                                                                    return <Typography>{profile?.name}</Typography>
                                                                }}
                                                                displayEmpty
                                                                sx={{color: "text.secondary"}}>
                                                                {featureRoles.map(profile =>
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
                                                                        if (selected.length === 0) {
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
                                            </Box>))}
                                    </>
                                }
                            </CardContent>
                        </Card>

                        <div style={{paddingBottom: "50px"}}></div>
                        <Stack
                            className="bottom-section"
                            justifyContent="flex-end"
                            spacing={2}
                            direction={"row"}>
                            <Button onClick={() => router.back()}>
                                {t("motif.dialog.cancel")}
                            </Button>
                            <LoadingButton
                                disabled={values.email.length === 0 || Object.keys(errors).length > 0}
                                loading={loading} type="submit" variant="contained" color="primary">
                                {t("motif.dialog.save")}
                            </LoadingButton>
                        </Stack>
                    </FormStyled>
                </FormikProvider>
            </Box>

            <CustomDialog
                {...{direction}}
                action={"add-feature-profile"}
                open={openFeatureProfileDialog}
                data={{
                    t,
                    selected: selectedProfile,
                    feature: featureRoles?.find((profile: ProfileModel) => profile.uuid === (values.roles[selectedFeature] as any)?.feature),
                    handleClose: () => {
                        setOpenFeatureProfileDialog(false);
                        handleProfilePermissions(selectedFeature, true);
                    }
                }}
                title={t("users.add_new_feature_profile")}
                size={"md"}
                sx={{py: 0}}
                dialogClose={() => setOpenFeatureProfileDialog(false)}
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});
export default NewUser;

NewUser.auth = true;

NewUser.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
