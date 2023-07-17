import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {SubHeader} from "@features/subHeader";
import {
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    TextField,
    Stack,
} from "@mui/material";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {SubFooter} from "@features/subFooter";
import {LoadingButton} from "@mui/lab";
import {setLock} from "@features/appLock";
import {useAppDispatch} from "@lib/redux/hooks";
import {toggleSideBar} from "@features/menu";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));


function AppLock() {
    const dispatch = useAppDispatch();
    const {t, ready} = useTranslation("settings", {keyPrefix: "appLock"});

    const validationSchema = Yup.object().shape({
        currentPassword: localStorage.getItem("app_lock") ? Yup.string().required("This field is required") : Yup.string(),
        newPassword: Yup.string().required("This field is required"),
        confirmPassword: Yup.string().when("newPassword", {
            is: (val: any) => (!!(val && val.length > 0)),
            then: Yup.string()
                .required("This Field is Required")
                .oneOf([Yup.ref("newPassword")], "Both password need to be the same"),
        }),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            localStorage.setItem("app_lock", values.confirmPassword);
            localStorage.setItem('lock-on', "true");
            resetForm();
            dispatch(setLock(true));
            dispatch(toggleSideBar(true));
        }
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        resetForm
    } = formik;

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <Typography>{t("path")}</Typography>
            </SubHeader>
            <Box className="container">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Typography
                            textTransform="uppercase"
                            fontWeight={600}
                            marginBottom={2}
                            gutterBottom>
                            {t("tittle")}
                        </Typography>
                        <Card className="venue-card">
                            <CardContent>
                                {localStorage.getItem("app_lock") && <Box mb={2}>
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
                                                {t("current")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("current")}
                                                fullWidth
                                                type={"password"}
                                                helperText={
                                                    touched.currentPassword && errors.currentPassword
                                                }
                                                error={Boolean(
                                                    touched.currentPassword && errors.currentPassword
                                                )}
                                                required
                                                {...getFieldProps("currentPassword")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>}
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
                                                {t("new")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("new")}
                                                fullWidth
                                                type={"password"}
                                                helperText={touched.newPassword && errors.newPassword}
                                                error={Boolean(
                                                    touched.newPassword && errors.newPassword
                                                )}
                                                required
                                                {...getFieldProps("newPassword")}
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
                                                {t("confirm")}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("confirm")}
                                                fullWidth
                                                helperText={
                                                    touched.confirmPassword && errors.confirmPassword
                                                }
                                                error={Boolean(
                                                    touched.confirmPassword && errors.confirmPassword
                                                )}
                                                required
                                                {...getFieldProps("confirmPassword")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                        <SubFooter>
                            <Stack width={1} direction="row" justifyContent="flex-end">
                                <LoadingButton
                                    disabled={localStorage.getItem("app_lock") ?
                                        localStorage.getItem("app_lock") !== values.currentPassword :
                                        values.confirmPassword.length === 0 || values.confirmPassword !== values.newPassword}
                                    type="submit" variant="contained">
                                    {t("save")}
                                </LoadingButton>
                            </Stack>
                        </SubFooter>
                    </Form>
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

export default AppLock;

AppLock.auth = true;

AppLock.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
