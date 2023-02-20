import {GetStaticProps, GetStaticPaths} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
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
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {addUser, tableActionSelector} from "@features/table";
import {agendaSelector} from "@features/calendar";
import {FormStyled} from "@features/forms";
import {LoadingScreen} from "@features/loadingScreen";

function NewUser() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {tableState} = useAppSelector(tableActionSelector);
    const {agendas} = useAppSelector(agendaSelector);

    const [agendaRoles, setAgendaRoles] = useState(agendas);
    const [user] = useState(tableState.editUser);
    const [roles, setRoles] = useState([
        {id: "read", name: "Accès en lecture"},
        {id: "write", name: "Accès en écriture"}
    ]);

    const {t, ready} = useTranslation("settings");

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("users.new.ntc"))
            .max(50, t("users.new.ntl"))
            .required(t("users.new.nameReq")),
        email: Yup.string()
            .email(t("users.new.mailInvalid"))
            .required(t("users.new.mailReq")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            role: "",
            agendas: agendaRoles.map(agenda => ({...agenda, role: ""})),
            professionnel: user.professionnel || false,
            email: user.email || "",
            name: user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : "",
            message: user.message || "",
            admin: user.admin || false,
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            dispatch(addUser({...values}));
            router.push("/dashboard/settings/users");
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

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("users.new.path")}</p>
                </RootStyled>
            </SubHeader>

            <Box className="container">
                <FormikProvider value={formik}>
                    <FormStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Typography marginBottom={2} gutterBottom>
                            {t("users.new.user")}
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
                                                {t("users.new.pro")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.professionnel}
                                                        onChange={() => {
                                                            setFieldValue("professionnel", true);
                                                        }}
                                                    />
                                                }
                                                label={t("users.new.yes")}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!values.professionnel}
                                                        onChange={() => {
                                                            setFieldValue("professionnel", false);
                                                        }}
                                                    />
                                                }
                                                label={t("users.new.no")}
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
                                                {t("users.new.mail")}{" "}
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
                                                {t("users.new.name")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("users.new.tname")}
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
                                                label={t("users.new.admin")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                        <Typography marginBottom={2} gutterBottom>
                            {t("users.new.roles")}
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
                                            {t("users.new.all")}
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
                            {t("users.new.send")}
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
                                                {t("users.new.message")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={9}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("users.new.tmessage")}
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
                            <Button type="submit" variant="contained" color="primary">
                                {t("motif.dialog.save")}
                            </Button>
                        </Stack>
                    </FormStyled>
                </FormikProvider>
            </Box>
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default NewUser;

NewUser.auth = true;

NewUser.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
