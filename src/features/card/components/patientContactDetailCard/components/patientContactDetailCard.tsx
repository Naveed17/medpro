import React, {useState} from "react";
import RootStyled from "./overrides/rootStyle";
import {
    Typography,
    Skeleton,
    CardContent,
    Grid,
    Stack,
    Box,
    InputBase, AppBar, Toolbar, Button, IconButton,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useFormik, Form, FormikProvider} from "formik";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import IconUrl from "@themes/urlIcon";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {Session} from "next-auth";

function PatientContactDetailCard({...props}) {
    const {patient, mutate: mutatePatientData, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const [editable, setEditable] = useState(false);

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            address:
                !loading && patient?.address[0] ? patient?.address[0].street : "--",
            telephone:
                !loading && patient.contact.length > 0
                    ? `${patient.contact[0].code ? patient.contact[0].code : ""}${
                        patient.contact[0].value
                    }`
                    : "--",
            email: !loading && patient.email ? patient.email : "--",
            region:
                !loading && patient?.address[0] ? patient?.address[0].city.name : "--",
            postalCode:
                !loading && patient?.address[0] ? patient?.address[0].postalCode : "--",
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const handleUpdatePatient = () => {
        const params = new FormData();
        params.append('phone', JSON.stringify({
            code: patient.contact[0].code,
            value: values.telephone,
            type: "phone",
            "contact_type": patient.contact[0].uuid,
            "is_public": false,
            "is_support": false
        }));
        params.append('email', values.email);
        params.append('address', JSON.stringify({
            fr: values.address
        }));

        triggerPatientUpdate({
            method: "PUT",
            url: "/api/medical-entity/" + medical_entity.uuid + '/patients/' + patient?.uuid + '/' + router.locale,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        }).then(() => {
            setEditable(false);
            mutatePatientData();
            enqueueSnackbar(t(`alert.patient-edit`, {ns: 'common'}), {variant: "success"});
        });
    }

    const {handleSubmit, values, touched, errors, getFieldProps} = formik;

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config.add-patient",
    });
    if (!ready) return <div>Loading...</div>;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <Typography
                    variant="body1"
                    color="text.primary"
                    fontFamily="Poppins"
                    gutterBottom>
                    {loading ? (
                        <Skeleton variant="text" sx={{maxWidth: 200}}/>
                    ) : (
                        t("contact")
                    )}
                </Typography>
                <RootStyled>
                    <CardContent>
                        <Grid container>
                            <AppBar position="static" color={"transparent"}>
                                <Toolbar variant="dense">
                                    <Box sx={{flexGrow: 1}}/>
                                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                        {editable ?
                                            <Stack mt={1} justifyContent='flex-end'>
                                                <Button onClick={() => handleUpdatePatient()}
                                                        className='btn-add'
                                                        sx={{margin: 'auto'}}
                                                        size='small'
                                                        startIcon={<SaveAsIcon/>}>
                                                    {t('register')}
                                                </Button>
                                            </Stack>
                                            :
                                            <IconButton onClick={() => setEditable(true)} color="inherit" size="small">
                                                <IconUrl path={"setting/edit"}/>
                                            </IconButton>
                                        }
                                    </Box>
                                </Toolbar>
                            </AppBar>
                            <Grid container spacing={1.2}>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row"
                                           spacing={1}
                                           alignItems="center">
                                        <Grid item md={2.5} sm={6} xs={6}>
                                            <Typography variant="body1" color="text.secondary" noWrap>
                                                {t("telephone")}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} sm={6} xs={6}>
                                            {loading ? (
                                                <Skeleton variant="text"/>
                                            ) : (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center">
                                                    {patient?.contact[0]?.code && <Box
                                                        component="img"
                                                        src={`https://flagcdn.com/w20/tn.png`}
                                                        srcSet={`https://flagcdn.com/w40/tn.png 2x`}
                                                        sx={{width: 22}}
                                                    />}
                                                    <InputBase
                                                        error={Boolean(touched.telephone && errors.telephone)}
                                                        readOnly={!editable}
                                                        {...getFieldProps("telephone")}
                                                    />
                                                </Stack>
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row" alignItems="flex-start">
                                        <Typography
                                            className="label"
                                            variant="body2"
                                            color="text.secondary"
                                            width="50%">
                                            {t("email")}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton width={100}/>
                                        ) : (
                                            <InputBase
                                                sx={{width: "50%"}}
                                                inputProps={{
                                                    style: {
                                                        background: "white",
                                                        fontSize: 14,
                                                    },
                                                }}
                                                {...getFieldProps("email")}
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row" alignItems="flex-start">
                                        <Typography
                                            className="label"
                                            variant="body2"
                                            color="text.secondary"
                                            width="50%">
                                            {t("region")}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton width={100}/>
                                        ) : (
                                            <InputBase
                                                sx={{width: "50%"}}
                                                inputProps={{
                                                    style: {
                                                        background: "white",
                                                        fontSize: 14,
                                                    },
                                                }}
                                                {...getFieldProps("region")}
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row" alignItems="flex-start">
                                        <Typography
                                            className="label"
                                            variant="body2"
                                            color="text.secondary"
                                            width="50%">
                                            {t("address")}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton width={100}/>
                                        ) : (
                                            <InputBase
                                                sx={{width: "50%"}}
                                                inputProps={{
                                                    style: {
                                                        background: "white",
                                                        fontSize: 14,
                                                    },
                                                }}
                                                {...getFieldProps("address")}
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Stack direction="row" alignItems="flex-start">
                                        <Typography
                                            className="label"
                                            variant="body2"
                                            color="text.secondary"
                                            width="50%">
                                            {t("zip_code")}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton width={100}/>
                                        ) : (
                                            <InputBase
                                                sx={{width: "50%"}}
                                                inputProps={{
                                                    style: {
                                                        background: "white",
                                                        fontSize: 14,
                                                    },
                                                }}
                                                {...getFieldProps("postalCode")}
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </RootStyled>
            </Form>
        </FormikProvider>
    );
}

export default PatientContactDetailCard;
