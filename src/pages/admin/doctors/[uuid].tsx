import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import { Stack, Box, Card, CardContent, Avatar, Typography, Button, styled, useTheme, Divider, Tabs, Tab, Grid, List, ListItem, Link, ListItemText } from "@mui/material";
import Zoom from "react-medium-image-zoom";
import { useRouter } from "next/router";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { DoctorToolbar } from "@features/toolbar";
import { ConditionalWrapper, a11yProps } from "@lib/hooks";
import IconUrl from "@themes/urlIcon";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { TabPanel } from "@features/tabPanel";
import dynamic from "next/dynamic";
import { LatLngBoundsExpression } from "leaflet";
import { Label } from "@features/label";
const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    minWidth: 300,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.primary.main
    },
}));


function DoctorDetails() {
    const router = useRouter();
    const theme = useTheme()
    const { t, ready } = useTranslation("doctors", { keyPrefix: "config" });
    const [value, setValue] = React.useState(0);
    const [outerBounds, setOuterBounds] = useState<LatLngBoundsExpression>([]);
    const [cords, setCords] = useState<any[]>([]);
    const error = false
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const cordsFunc = () => setTimeout(() => {
        setCords([{
            "name": "Cabinet",
            "points": [
                "36.8142971",
                "10.1820436"
            ]
        }])
    }, 3000)
    useEffect(() => {
        const bounds: any[] = []
        navigator.geolocation.getCurrentPosition(function (position) {
            bounds.push([position.coords.latitude, position.coords.longitude]);
        });
        setOuterBounds(bounds);
        cordsFunc()

    }, [cords])
    console.log(cords)
    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/admin/doctors'),
                text: 'loading-error-404-reset'
            } : {})}
        />;
    }



    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        py: { md: 0, xs: 2 },
                    },
                }}>
                <DoctorToolbar {...{ t, title: "sub-header.doctor_title" }} />
            </SubHeader>

            <Box className="container">
                <Stack spacing={2}>
                    <Card sx={{ border: 'none', borderRadius: 1.5, overflow: 'visible' }}>
                        <CardContent sx={{ p: "30px 30px 0!important" }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between'>
                                <Stack direction={"row"} alignItems={{ xs: 'flex-start', md: "center" }} spacing={2}>
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
                                            Dr Ghassen BOULAHIA
                                        </Typography>
                                        <Typography variant="body2">
                                            Gynécologue Obstétricien
                                        </Typography>
                                        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'row' }} spacing={1}>
                                            <Stack direction='row' alignItems='center' spacing={.5}>
                                                <IconUrl width={16} height={16} path="ic-deparment" />
                                                <Typography variant="body2" color="text.secondary">Gynecology</Typography>
                                            </Stack>
                                            <Stack direction='row' alignItems='center' spacing={.5}>
                                                <IconUrl width={16} height={16} path="ic-pin-2" />
                                                <Typography variant="body2" color="text.secondary">Centre Urbain Nord Tunis Tunisie</Typography>
                                            </Stack>
                                            <Stack direction='row' alignItems='center' spacing={.5}>
                                                <IconUrl width={16} height={16} path="ic-email" />
                                                <Typography variant="body2" color="text.secondary">ghassen.boulahia@med.com</Typography>
                                            </Stack>
                                            <Stack direction='row' alignItems='center' spacing={.5}>
                                                <IconUrl width={16} height={16} path="phone" />
                                                <Typography variant="body2" color="text.secondary">+216 50 504 838</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack spacing={2} mt={{ xs: 3, md: 0 }} direction={{ xs: 'column-reverse', md: 'column' }} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                                    <Button variant="contained">
                                        {t("send_msg")}
                                    </Button>
                                    <Stack spacing={1}>
                                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                            <Typography fontWeight={700} color={theme.palette.grey['B903']}>
                                                {t("profil_status")}
                                            </Typography>
                                            <Typography fontWeight={700}>
                                                80%
                                            </Typography>
                                        </Stack>
                                        <BorderLinearProgress variant="determinate" value={80} />
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Divider sx={{ my: 3 }} />
                            <Tabs
                                value={value}
                                onChange={handleChange}>
                                {["about", "settings"].map((title, idx) => (
                                    <Tab
                                        key={`tabHeader-${idx}`}
                                        disableRipple
                                        label={t(`tabs.${title}`)}
                                        {...a11yProps(idx)}

                                    />)
                                )}
                            </Tabs>
                        </CardContent>
                    </Card>
                    <TabPanel padding={.1} value={value} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("personal_info")}
                                            </Typography>
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
                                                {t("doctor_location")}
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
                            <Grid item xs={12} md={4}>
                                <Stack spacing={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("pro_qualifications")}
                                            </Typography>
                                            <Typography>
                                                {t("specialist_in")} Gynécologie-obstétrique
                                            </Typography>
                                            <Typography>
                                                Ancien praticien des hôpitaux de Paris Diplômé des universités françaises en :
                                            </Typography>
                                            <List disablePadding sx={{ mb: 2 }}>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: .2 }} primary="* Infertilité et Assistance médicale à la procréation" />
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: 0.2 }} primary="* Échographie obstétricale et gynécologique" />
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: 0.2 }} primary="* Chirurgie Vaginale" />
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: 0.2 }} primary="* Traitement du Polapsus Urogénital" />
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: 0.2 }} primary="* Hystéroscopie opératoire" />
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: 0.2 }} primary="* Colposcopie" />
                                                </ListItem>
                                                <ListItem disablePadding>
                                                    <ListItemText sx={{ m: 0.2 }} primary="* Maladies du Sein" />
                                                </ListItem>
                                            </List>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("spoken_lang")}
                                            </Typography>
                                            <List disablePadding>
                                                {
                                                    ["Français", "Anglais"].map((lang, idx) =>
                                                        <ListItem disablePadding key={idx}>
                                                            <ListItemText sx={{ m: .1 }} primary={lang} />
                                                        </ListItem>
                                                    )

                                                }
                                            </List>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("acts_&_care")}
                                            </Typography>
                                            <Stack mt={1} direction='row' flexWrap="wrap" alignItems='center' sx={{ gap: 1 }}>
                                                {
                                                    ["Hystéroscopie thérapeutique", "Suivi de grossesse", "Hystérectomie", "Traitement des prolapsus du plancher pelvien", "Stérilité du couple", "Echographie 3D", "FIV (Fécondation in vitro)", "Plastie de la vulve et du périnée", "Frottis cervico-vaginal"].map((act, idx) =>
                                                        <Label key={idx} variant="filled" sx={{ bgcolor: theme.palette.grey["B905"] }}>
                                                            {act}
                                                        </Label>
                                                    )
                                                }


                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("scheduled_shifts")}
                                            </Typography>
                                            <List>
                                                {
                                                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) =>
                                                        <ListItem disablePadding key={idx}

                                                            sx={{ py: .5 }}
                                                        >
                                                            <ListItemText sx={{ m: 0, span: { fontWeight: 600 } }} primary={day} />
                                                            <Label variant="filled" sx={{ fontSize: 14, fontWeight: 600, bgcolor: theme.palette.background.default, borderRadius: 1, px: 1.5, py: 1, height: 37 }}>
                                                                10:00 AM - 01:00 PM
                                                            </Label>
                                                        </ListItem>
                                                    )
                                                }


                                            </List>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("price_list")}
                                            </Typography>
                                            <List>
                                                {
                                                    ["Consultation simple", "Consultation endométriose 1ere fois", "Echographie pelvienne", "Pose dispositif intra utérin (DIU)", "Retrait ou changement dispositif intra utérin (DIU)", "Colposcopie", "Hystéroscopie"].map((day, idx) =>
                                                        <ListItem disablePadding key={idx}

                                                            sx={{ py: .5 }}
                                                        >
                                                            <ListItemText sx={{ m: 0, maxWidth: 180, span: { fontWeight: 600 } }} primary={day} />
                                                            <Label variant="filled" sx={{ fontSize: 14, ml: 'auto', fontWeight: 600, bgcolor: theme.palette.background.default, borderRadius: 1, px: 1.5, py: 1, height: 37 }}>
                                                                70 TND - 100 TND
                                                            </Label>
                                                        </ListItem>
                                                    )
                                                }


                                            </List>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel padding={.1} value={value} index={1}>
                        <Card>
                            <CardContent>fasd</CardContent>
                        </Card>
                    </TabPanel>
                </Stack>
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
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'doctors']))
    }
})


export default DoctorDetails;

DoctorDetails.auth = true;

DoctorDetails.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
