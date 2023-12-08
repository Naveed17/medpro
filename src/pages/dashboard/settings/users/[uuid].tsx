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
    Select,
    Button,
    FormControlLabel,
    Checkbox,
    MenuItem,
    FormControl, IconButton,
} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {DashLayout} from "@features/base";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {addUser} from "@features/table";
import {agendaSelector} from "@features/calendar";
import {FormStyled} from "@features/forms";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
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
import IconUrl from "@themes/urlIcon";
import AddIcon from "@mui/icons-material/Add";

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

    const [loading, setLoading] = useState(false);
    const [agendaRoles] = useState(agendas);

    const {data: userData} = session as Session;
    const medical_entity = (userData as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const {uuid} = router.query;

    const {data: httpUserResponse, error} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/users/${uuid}/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const {trigger: triggerUserUpdate} = useRequestQueryMutation("/user/update");

    const user = (httpUserResponse as HttpResponse)?.data ?? null;

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("users.ntc"))
            .max(50, t("users.ntl"))
            .required(t("users.nameReq")),
        email: Yup.string()
            .email(t("users.mailInvalid"))
            .required(t("users.mailReq")),
        birthdate: Yup.string().nullable(),
        FirstName: Yup.string().required(),
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
        profile: Yup.string().required(),
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
            phones: [],
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
            values.birthdate && form.append('birthdate', moment(values.birthdate).format("DD/MM/YYYY"));
            form.append('firstname', values.FirstName);
            form.append('lastname', values.lastName);
            values.phones.length > 0 && form.append('phone', JSON.stringify(values.phones.map((phoneData: any) => ({
                code: phoneData.dial?.phone,
                value: phoneData.phone.replace(phoneData.dial?.phone as string, ""),
                type: "phone",
                is_public: false,
                is_support: false
            }))));
            form.append('profile', values.profile);
            triggerUserUpdate({
                method: "PUT",
                url: `${urlMedicalEntitySuffix}/users/${uuid}/${router.locale}`,
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

    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/settings/users'),
                text: 'loading-error-404-reset'
            } : {})}
        />;
    }

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
                                                            sx={{mt: .5}}
                                                            onClick={() => {
                                                                const phones = [...values.phones];
                                                                console.log(phones, index)
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
