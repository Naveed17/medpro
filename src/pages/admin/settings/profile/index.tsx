import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { memo, ReactElement, useEffect, useRef, useState } from "react";
import { DashLayout, dashLayoutSelector } from "@features/base";
import {
    Typography,
    Grid,
    Avatar,
    Skeleton,
    Stack,
    Box,
    IconButton,
    Card,
    CardContent, TextField, Theme, MenuItem, InputAdornment, Autocomplete, FormControl, ListItem, List, Link, useTheme, Button
} from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { SubHeader } from "@features/subHeader";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { toggleSideBar } from "@features/menu";
import { appLockSelector } from "@features/appLock";
import { LoadingScreen } from "@features/loadingScreen";
import { CustomInput, InputStyled } from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import { FormikProvider, useFormik } from "formik";
import PhoneInput from "react-phone-number-input/input";
import { CustomIconButton } from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import { DefaultCountry } from "@lib/constants";
import { CountrySelect } from "@features/countrySelect";
import { useCountries } from "@lib/hooks/rest";
import { countries as dialCountries } from "@features/countrySelect/countries";
import { useRequestQuery } from "@lib/axios";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { useRouter } from "next/router";
import { ConditionalWrapper } from "@lib/hooks";
import Zoom from "react-medium-image-zoom";
const PhoneCountry: any = memo(({ ...props }) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";
import dynamic from 'next/dynamic';
import { LatLngBoundsExpression } from "leaflet";
const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});
function Profile() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { countries } = useCountries("nationality=true");
    const phoneInputRef = useRef(null);
    const router = useRouter();
    const theme = useTheme()
    const { t, ready } = useTranslation("settings", { keyPrefix: "profile" });
    const { lock } = useAppSelector(appLockSelector);
    const { medicalProfessionalData } = useAppSelector(dashLayoutSelector);
    const [outerBounds, setOuterBounds] = useState<LatLngBoundsExpression>([]);
    const [cords, setCords] = useState<any[]>([]);
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            picture: { url: "", file: "" },
            organization: "",
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            country: "",
            state: "",
            zip_code: "",
            address: "",
            email: ""
        },
        onSubmit: async (values) => {
            console.log("values", values)
        },
    })

    const {
        handleSubmit,
        values,
        touched,
        errors,
        getFieldProps,
        setFieldValue,
    } = formik;

    const { data: httpStatesResponse } = useRequestQuery(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("picture.url", URL.createObjectURL(file));
        setFieldValue("picture.file", file);
        setOpenUploadPicture(true);
    }

    useEffect(() => {
        if (medicalProfessionalData) {
            const medical_professional = medicalProfessionalData.medical_professional as MedicalProfessionalModel;
            setName(medical_professional?.publicName);
            setLoading(false);
        }

        if (!lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, medicalProfessionalData, user]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (countries?.length > 0) {
            setCountriesData(countries.sort((country: CountryModel) =>
                dialCountries.find(dial => dial.code.toLowerCase() === country.code.toLowerCase() && dial.suggested) ? 1 : -1).reverse());
        }
    }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        const bounds: any[] = []
        navigator.geolocation.getCurrentPosition(function (position) {
            bounds.push([position.coords.latitude, position.coords.longitude]);
        });
        setOuterBounds(bounds);
        setCords([{
            "name": "Cabinet",
            "points": [
                "36.8142971",
                "10.1820436"
            ]
        }])

    }, [])

    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    if (!ready) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <Grid container spacing={1} direction="row" alignItems="center">
                        <Grid item>
                            {loading ? (
                                <Skeleton sx={{ borderRadius: 1 }} variant="rectangular">
                                    <Avatar src="/static/img/avatar.svg" />
                                </Skeleton>
                            ) : (
                                <Avatar
                                    src={
                                        medical_entity.profilePhoto
                                            ? medical_entity.profilePhoto
                                            : "/static/icons/Med-logo_.svg"
                                    }
                                />
                            )}
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                {loading ? <Skeleton width={150} variant="text" /> : name}
                            </Typography>
                        </Grid>
                        <Grid item ml="auto">
                            <Button variant="contained">
                                {t("save")}
                            </Button>
                        </Grid>
                    </Grid>
                </RootStyled>
            </SubHeader>
            <Box className="container">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Stack spacing={2}>
                            <Card sx={{ overflow: 'visible' }}>
                                <CardContent>
                                    <Stack alignItems={"center"} spacing={2} mb={2}>
                                        <ConditionalWrapper
                                            condition={false}
                                            wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                            <Avatar
                                                {...(true && { className: "zoom" })}
                                                src={"/static/icons/men-avatar.svg"}
                                                sx={{
                                                    "& .injected-svg": {
                                                        margin: 0
                                                    },
                                                    width: 75,
                                                    height: 75,
                                                    borderRadius: 2

                                                }}>
                                                <IconUrl width={75} height={75} path="men-avatar" />
                                            </Avatar>

                                        </ConditionalWrapper>
                                        <Stack spacing={.5}>
                                            <Typography variant="subtitle2" fontWeight={700} color="primary">
                                                Soukra medical
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                        <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                            {t("contact_info")}
                                        </Typography>
                                        <IconButton size="small" sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                            <IconUrl path="ic-edit-pen" />
                                        </IconButton>
                                    </Stack>
                                    <List disablePadding>
                                        <ListItem disablePadding sx={{ py: .5 }}>
                                            <Typography width={140} variant="body2" color='text.secondary'>
                                                {t("full_name")}
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                Dr Ghassen BOULAHIA
                                            </Typography>
                                        </ListItem>
                                        <ListItem disablePadding sx={{ py: .5 }}>
                                            <Typography width={140} variant="body2" color='text.secondary'>
                                                {t("cin")}
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                02165102
                                            </Typography>
                                        </ListItem>
                                        <ListItem disablePadding sx={{ py: .5 }}>
                                            <Typography width={140} variant="body2" color='text.secondary'>
                                                {t("birthdate")}
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                29 juin 1972
                                            </Typography>
                                        </ListItem>
                                        <ListItem disablePadding sx={{ py: .5, alignItems: 'flex-start' }}>
                                            <Typography width={140} variant="body2" color='text.secondary'>
                                                {t("mobile")}
                                            </Typography>
                                            <Stack spacing={1.25}>
                                                <Stack direction='row' alignItems='center' spacing={1}>
                                                    <Avatar
                                                        sx={{
                                                            width: 27,
                                                            height: 18,
                                                            borderRadius: 0
                                                        }}
                                                        alt={"flags"}
                                                        src={`https://flagcdn.com/tn.svg`}
                                                    />
                                                    <Typography fontWeight={500}>
                                                        +216 22 469 495
                                                    </Typography>
                                                </Stack>
                                                <Stack direction='row' alignItems='center' spacing={1}>
                                                    <Avatar
                                                        sx={{
                                                            width: 27,
                                                            height: 18,
                                                            borderRadius: 0
                                                        }}
                                                        alt={"flags"}
                                                        src={`https://flagcdn.com/tn.svg`}
                                                    />
                                                    <Typography fontWeight={500}>
                                                        +216 22 469 495
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </ListItem>
                                        <ListItem disablePadding sx={{ py: .5 }}>
                                            <Typography width={140} variant="body2" color='text.secondary'>
                                                {t("email")}
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                ghassen.boulahia@med.com
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                        {t("org_location")}
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Stack direction='row' spacing={1}>
                                            <IconUrl width={16} height={16} path="ic-pin-2" color={theme.palette.primary.main} />
                                            <Link underline="none" fontWeight={500} fontSize={12}>
                                                Centre médical clinique les Jasmins - 6ème Étage Centre Urbain Nord 1082 Tunis Tunisie
                                            </Link>
                                        </Stack>
                                        <Stack maxHeight={300}>
                                            <Maps data={cords}
                                                outerBounds={outerBounds}
                                                draggable={false} />
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("time_and_agenda_title")}
                                            </Typography>
                                            <IconButton size="small" sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                                <IconUrl path="ic-edit-pen" />
                                            </IconButton>
                                        </Stack>
                                        <List disablePadding>
                                            <ListItem disablePadding sx={{ py: .5 }}>
                                                <Typography width={140} variant="body2" color='text.secondary'>
                                                    {t("time_zone")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    (GMT +01:00) Tunis
                                                </Typography>
                                            </ListItem>
                                            <ListItem disablePadding sx={{ py: .5 }}>
                                                <Typography width={140} variant="body2" color='text.secondary'>
                                                    {t("time_format")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    24 hours (e.g. 21:00)
                                                </Typography>
                                            </ListItem>
                                            <ListItem disablePadding sx={{ py: .5 }}>
                                                <Typography width={140} variant="body2" color='text.secondary'>
                                                    {t("week_start")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    Monday
                                                </Typography>
                                            </ListItem>
                                        </List>
                                        <Stack spacing={1} alignItems='flex-start'>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("lang")}
                                            </Typography>
                                            <Button variant="google" sx={{ bgcolor: theme => theme.palette.info.main, fontWeight: 600, border: "none" }}>
                                                English
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Stack spacing={1} alignItems='flex-start'>
                                        <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                            {t("password")}
                                        </Typography>
                                        <Button variant="google" sx={{ bgcolor: theme => theme.palette.grey["A500"], border: "none" }}>
                                            {t("change_password")}
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
        ;
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});
export default Profile;

Profile.auth = true;

Profile.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
