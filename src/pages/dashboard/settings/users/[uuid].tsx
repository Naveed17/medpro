import {GetStaticProps, GetStaticPaths} from "next";
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
} from "@mui/material";
import {Theme} from "@mui/material/styles";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {DashLayout} from "@features/base";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {addUser, tableActionSelector} from "@features/table";
import {agendaSelector} from "@features/calendar";
import {FormStyled} from "@features/forms";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {DatePicker} from "@features/datepicker";
import {LoadingButton} from "@mui/lab";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useSnackbar} from "notistack";
import {CountrySelect} from "@features/countrySelect";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {isValidPhoneNumber} from "libphonenumber-js";
import PhoneInput from "react-phone-number-input/input";
import {
    CustomInput,

} from "@features/tabPanel";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function ModifyUser() {
    const router = useRouter();
    const phoneInputRef = useRef(null);
    const {enqueueSnackbar} = useSnackbar()
    const {uuid} = router.query;
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: session} = useSession();
    const {t, ready} = useTranslation("settings");
    const [loading, setLoading] = useState(false);
    const {agendas} = useAppSelector(agendaSelector);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [agendaRoles] = useState(agendas);
    const [user, setUser] = useState<any>({});
    const {data: userData} = session as Session;
    const medical_entity = (userData as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const [roles] = useState([
        {id: "read", name: "Accès en lecture"},
        {id: "write", name: "Accès en écriture"}
    ]);
    const {trigger} = useRequestMutation(null, "/users");

    const {data: httpProfilesResponse,} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile`
    });
    const {data: httpUserResponse, error} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/users/${uuid}/${router.locale}`
    });

    useEffect(() => {
        if (httpProfilesResponse) {
            setProfiles((httpProfilesResponse as HttpResponse)?.data)
        }
    }, [httpProfilesResponse]);
    useEffect(() => {
        const user = (httpUserResponse as HttpResponse)?.data
        if (error) {
            setUser(null)
        } else if (user) {
            setUser(user)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [httpUserResponse, error])

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("users.ntc"))
            .max(50, t("users.ntl"))
            .required(t("users.nameReq")),
        email: Yup.string()
            .email(t("users.mailInvalid"))
            .required(t("users.mailReq")),
        consultation_fees: Yup.string()
            .required(),
        birthdate: Yup.string()
            .required(),
        FirstName: Yup.string()
            .required(),
        lastName: Yup.string()
            .required(),
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
                    .required(),
            })
        ),
        profile: Yup.string()
            .required(),
    });
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
            FirstName: user?.FirstName || "",
            lastName: user?.lastName || "",
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            profile: user?.profile?.uuid || ""
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const form = new FormData();
            form.append('username', values.name);
            form.append('email', values.email);
            form.append('is_owner', values.admin);
            form.append('is_active', 'true');
            form.append('is_professional', values.isProfessional);
            form.append('is_accepted', 'true');
            form.append('is_public', "true");
            form.append('is_default', "true");
            form.append('consultation_fees', values.consultation_fees);
            form.append('birthdate', moment(values.birthdate).format("DD/MM/YYYY"));
            form.append('firstname', values.FirstName);
            form.append('lastname', values.lastName);
            form.append('phone', JSON.stringify(values.phones.map(phoneData => ({
                code: phoneData.dial?.phone,
                value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
                type: "phone",
                is_public: false,
                is_support: false
            }))));
            form.append('profile', values.profile);
            trigger({
                method: "PUT",
                url: `${urlMedicalEntitySuffix}/users/${uuid}/${router.locale}`,
                data: form
            }).then(() => {
                enqueueSnackbar(t("users.alert.update"), {variant: "error"});
                setLoading(false)
                dispatch(addUser({...values}));
                router.push("/dashboard/settings/users");
            }).catch(() => {
                setLoading(false);
                enqueueSnackbar(t("users.alert.went_wrong"), {variant: "error"});
            })

        },
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
    } = formik;
    if (!ready) return (<LoadingScreen
        {...(uuid && {
            error: true,
            button: 'loading-error-404-reset',
            text: 'loading-error'
        })}
    />);

    if (!user) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error-data-404"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("users.path_update")}</p>
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
                                                {t("users.pro")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.isProfessional}
                                                        onChange={() => {
                                                            setFieldValue("isProfessional", true);
                                                        }}
                                                    />
                                                }
                                                label={t("users.yes")}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!values.isProfessional}
                                                        onChange={() => {
                                                            setFieldValue("isProfessional", false);
                                                        }}
                                                    />
                                                }
                                                label={t("users.no")}
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
                                                {t("users.consultation_fees")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                placeholder={t("users.consultation_fees")}
                                                fullWidth
                                                required
                                                error={Boolean(touched.consultation_fees && errors.consultation_fees)}
                                                {...getFieldProps("consultation_fees")}
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
                                                variant="outlined"
                                                placeholder={t("users.firstname")}
                                                fullWidth
                                                required
                                                error={Boolean(touched.FirstName && errors.FirstName)}
                                                {...getFieldProps("FirstName")}
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
                                {values.phones.map((phoneObject, index: number) => (
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
                                                    {t("users.phone")}{" "}
                                                    <Typography component="span" color="error">
                                                        *
                                                    </Typography>
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
                                                    <Grid item xs={12} md={8}>
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
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}

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
                                </Box>
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
                            </CardContent>
                        </Card>
                        <Typography marginBottom={2} gutterBottom>
                            {t("users.roles")}
                        </Typography>
                        <Card>
                            <Box mb={2}>
                                <Grid
                                    container
                                    spacing={{lg: 2, xs: 1}}
                                    justifyContent="center"
                                    sx={{
                                        background: (theme: Theme) => theme.palette.primary.light,
                                        borderBottom: `1px solid ${(theme: Theme) =>
                                            theme.palette.divider}`,
                                    }}
                                    padding={"16px"}
                                    alignItems="center">
                                    <Grid item xs={12} lg={4}>
                                        <Typography variant="body2" fontWeight={400}>
                                            {t("users.all")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} lg={7}>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id={"role"}
                                                {...getFieldProps("role")}
                                                onChange={event => {
                                                    setFieldValue("role", event.target.value);
                                                    agendaRoles.map((agenda, index) => {
                                                        setFieldValue(`agendas[${index}].role`, event.target.value);
                                                    })
                                                }}
                                                renderValue={selected => {
                                                    if (selected.length === 0) {
                                                        return <em>{t("users.config.roleAccess")}</em>;
                                                    }
                                                    const role = roles?.find(role => role.id === selected);
                                                    return <Typography>{role?.name}</Typography>
                                                }}
                                                displayEmpty
                                                sx={{color: "text.secondary"}}>
                                                {roles.map(role =>
                                                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                            {values.agendas.map((agenda, index) => (
                                <Box mb={2} key={index}>
                                    <Grid
                                        container
                                        spacing={{lg: 2, xs: 1}}
                                        justifyContent="center"
                                        padding={"0 20px 16px"}
                                        margin={0}
                                        sx={{
                                            borderBottom:
                                                index !== agendas.length - 1
                                                    ? `1px solid ${(theme: Theme) =>
                                                        theme.palette.divider}`
                                                    : "0",
                                        }}
                                        alignItems="center">
                                        <Grid item xs={12} lg={4}>
                                            <FormControlLabel
                                                control={<Checkbox/>}
                                                label={agenda.name}

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={7}>
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    placeholder={"motif.dialog.selectGroupe"}
                                                    displayEmpty={true}
                                                    {...getFieldProps(`agendas[${index}].role`)}
                                                    sx={{color: "text.secondary", padding: 0}}
                                                    renderValue={selected => {
                                                        if (selected.length === 0) {
                                                            return <em>{t("users.config.roleAccess")}</em>;
                                                        }
                                                        const role = roles?.find(role => role.id === selected);
                                                        return <Typography>{role?.name}</Typography>
                                                    }}>
                                                    {roles.map(role => <MenuItem key={role.id}
                                                                                 value={role.id}>{role.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Card>
                        <Typography marginBottom={2} gutterBottom>
                            {t("users.send")}
                        </Typography>
                        <Card>
                            <CardContent>
                                <Box mb={2}>
                                    <Grid
                                        container
                                        spacing={{lg: 2, xs: 1}}
                                        alignItems="flex-start">
                                        <Grid item xs={12} lg={2}>
                                            <Typography
                                                textAlign={{lg: "right", xs: "left"}}
                                                color="text.secondary"
                                                variant="body2"
                                                fontWeight={400}>
                                                {t("users.message")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={9}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("users.tmessage")}
                                                multiline
                                                rows={4}
                                                fullWidth
                                                required
                                                {...getFieldProps("message")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
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
                            <LoadingButton loading={loading} type="submit" variant="contained" color="primary">
                                {t("motif.dialog.save")}
                            </LoadingButton>
                        </Stack>
                    </FormStyled>
                </FormikProvider>
            </Box>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async ({...props}) => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({locale, params}) => {

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
