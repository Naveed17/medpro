import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import { Stack, Box, Card, CardContent, Avatar, Typography, Button, styled, useTheme, Divider, Tabs, Tab } from "@mui/material";
import Zoom from "react-medium-image-zoom";
import { useRouter } from "next/router";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { DoctorToolbar } from "@features/toolbar";
import { ConditionalWrapper, a11yProps } from "@lib/hooks";
import IconUrl from "@themes/urlIcon";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { DoctorAboutTab, DoctorSettingsTab, TabPanel } from "@features/tabPanel";
import { LatLngBoundsExpression } from "leaflet";


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
    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/admin/doctors'),
                text: 'loading-error-404-reset'
            } : {})}
        />
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
                        <DoctorAboutTab {...{ t, cords, outerBounds, theme }} />
                    </TabPanel>
                    <TabPanel padding={.1} value={value} index={1}>
                        <DoctorSettingsTab {...{ t, theme }} />
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
