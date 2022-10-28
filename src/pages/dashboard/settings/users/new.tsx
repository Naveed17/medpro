import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import {useFormik, Form, FormikProvider} from "formik";
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
import {styled, Theme} from "@mui/material/styles";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {DashLayout} from "@features/base";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {addUser, tableActionSelector} from "@features/table";
import {uniqueId} from "lodash";

const FormStyled = styled(Form)(({theme}) => ({
    "& .MuiCard-root": {
        border: "none",
        marginBottom: theme.spacing(2),
        "& .MuiCardContent-root": {
            padding: theme.spacing(3, 2),
            paddingRight: theme.spacing(5),
        },
    },
    "& .form-control": {
        "& .MuiInputBase-root": {
            paddingLeft: theme.spacing(0.5),
            "& .MuiInputBase-input": {
                paddingLeft: 0,
            },
            "& .MuiInputAdornment-root": {
                "& .MuiOutlinedInput-root": {
                    border: "none",
                    fieldset: {
                        border: "1px solid transparent",
                        boxShadow: "none",
                    },
                    background: "transparent",
                    "&:hover": {
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                        },
                    },
                    "&.Mui-focused": {
                        background: "transparent",
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                            outline: "none",
                        },
                    },
                },
            },
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(-2),
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1,
        width: "100%",
        borderTop: `3px solid ${theme.palette.background.default}`,
    },
}));

function NewUser() {
    const dispatch = useAppDispatch();
    const state = useAppSelector(tableActionSelector);
    // from backend
    const agendas = [
        {name: "Clinical"},
        {name: "Hospital"},
        {name: "Place 3"},
        {name: "Place 4"},
    ];

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
            professionnel: false,
            email: "",
            name: "",
            message: "",
            admin: false,
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            dispatch(addUser({...values, id: uniqueId()}));
            router.push("/dashboard/settings/users");
        },
    });
    const router = useRouter();
    if (!ready) return <>loading translations...</>;

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
    } = formik;

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
                                                helperText={touched.email && errors.email}
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
                                                helperText={touched.name && errors.name}
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
                                                id={"duration"}
                                                {...getFieldProps("duration")}
                                                value={1}
                                                displayEmpty={true}
                                                sx={{color: "text.secondary"}}
                                                renderValue={(value) => t("motif.dialog.selectGroupe")}>
                                                <MenuItem value="1">1</MenuItem>
                                                <MenuItem value="2">2</MenuItem>
                                                <MenuItem value="3">3</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                            {agendas.map((item, index) => (
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
                                                label={item.name}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={7}>
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id={"duration"}
                                                    value={1}
                                                    displayEmpty={true}
                                                    sx={{color: "text.secondary", padding: 0}}
                                                    renderValue={(value) =>
                                                        t("motif.dialog.selectGroupe")
                                                    }>
                                                    <MenuItem value="1">1</MenuItem>
                                                    <MenuItem value="2">2</MenuItem>
                                                    <MenuItem value="3">3</MenuItem>
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
            "settings",
        ])),
    },
});
export default NewUser;

NewUser.auth = true;

NewUser.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
