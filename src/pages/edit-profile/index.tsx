import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { TopNavBar } from "@features/topNavBar";
import { MainMenuStyled } from "@features/menu";
import { CheckProfileStatus } from "@features/checkProfileStatus";
import { LoadingScreen } from "@features/loadingScreen";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { Info, Document, Actes, Cabinet, stepperProfileSelector, TabPanel, LinearProgress } from "@features/tabPanel";
import { useAppSelector } from "@lib/redux/hooks";
import { CustomStepper } from "@features/customStepper";
import Link from "next/link";
import IconUrl from "@themes/urlIcon";
import { SuccessCard } from "@features/card";

const stepperData = [
    {
        title: "steps.step-1",
        subtitle: "steps.subtitle-1"

    },
    {
        title: "steps.step-2",
        subtitle: "steps.subtitle-2"

    },


];

function EditProfile() {
    const { data: session, status } = useSession();
    const { currentStepper: stepperIndex } = useAppSelector(stepperProfileSelector);
    const router = useRouter();
    const theme = useTheme()
    const loading = status === 'loading';

    const { step } = router.query;
    const [currentStepper, setCurrentStepper] = useState(step ? (parseInt(step as string, 0) - 1) : stepperIndex);
    const { t, ready } = useTranslation('editProfile', { keyPrefix: 'steppers' });
    const profilePercentage = (100 / stepperData.length) * (currentStepper === 0 ? currentStepper : currentStepper + 1)
    // get user session data
    const { data: user } = session as Session;
    if (!ready || loading) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <Box className="container"
            sx={{
                background: `linear-gradient(180deg, ${theme.palette.background.default} 60%, ${theme.palette.primary.main} 0%);`,
                height: '100%'
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack spacing={1}>
                                <Link href="/">
                                    <Avatar
                                        alt="logo"
                                        src="/static/icons/Med-logo_.svg"
                                        sx={{ width: 71, height: 71 }}
                                    />
                                </Link>
                                <List sx={{
                                    "&:before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        top: 42,
                                        left: 35,
                                        width: 0,
                                        height: "calc(100% - 84px)",
                                        borderLeft: "1px dashed #E4E6EF",
                                    }
                                }}>
                                    {
                                        stepperData.map((tab, i) => (
                                            <ListItem alignItems="flex-start" key={i}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: currentStepper === i ? "primary.main" : currentStepper < i ? "info.main" : "info.main",
                                                            color: currentStepper === i ? "common.white" : currentStepper < i ? "primary.main" : "common.white",
                                                        }}

                                                    >
                                                        {currentStepper > i ? <IconUrl path="ic-check" color={theme.palette.primary.main} /> : i + 1}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography

                                                            color={
                                                                currentStepper === i ? "textPrimary" : currentStepper < i ? "textSecondary" : "textPrimary"
                                                            }
                                                            variant="subtitle2">
                                                            {t(tab.title)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                color={
                                                                    currentStepper === i ? "textSecondary" : currentStepper < i ? theme.palette.grey[300] : "textSecondary"
                                                                }
                                                                component="span"
                                                                variant="body2"
                                                                fontWeight={500}

                                                            >
                                                                {t(tab.subtitle)}
                                                            </Typography>

                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                    }

                                </List>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Card>
                        <CardHeader
                            sx={{
                                flexDirection: { xs: 'column', md: 'row' },
                                ".MuiCardHeader-action": {
                                    alignSelf: { xs: 'flex-start', md: 'flex-end' },
                                    marginBottom: .5,
                                    marginTop: { xs: 1, md: 0 }
                                }
                            }}
                            action={
                                <Stack spacing={.5} alignSelf="flex-end">
                                    <Stack direction="row" alignItems='center' justifyContent='space-between'>
                                        <Typography fontWeight={500} color={theme.palette.grey["B904"]}>{t("profile_status")}</Typography>
                                        <Typography fontWeight={700} color={theme.palette.white.darker}>
                                            {profilePercentage} %
                                        </Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={profilePercentage} />
                                </Stack>
                            }
                            title={currentStepper === 0 ? t("stepper-0.title") : t("title-complete")}
                            subheader={currentStepper === 0 ? <Typography>
                                {t("stepper-0.sub-title")}
                            </Typography> : <Typography>
                                {t("sub-title-complete")}
                            </Typography>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <TabPanel padding={0} value={currentStepper} index={0}>
                                <Info {...{ handleNext: () => setCurrentStepper(currentStepper + 1) }} />
                            </TabPanel>
                            <TabPanel padding={0} value={currentStepper} index={1}>
                                <SuccessCard
                                    data={{
                                        title: t("success_title"),
                                        description: t("success_desc")
                                    }}
                                />
                                <Stack width={1} alignItems='flex-end' mt={10}>
                                    <Button variant="contained">
                                        {t('explore')}
                                    </Button>
                                </Stack>
                            </TabPanel>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

        </Box>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'editProfile']))
        }
    }
}

export default EditProfile;

EditProfile.auth = true;

EditProfile.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainMenuStyled className="header-main">
            <TopNavBar />
            <Box className="body-main">
                <Toolbar />
                <Box component="main">
                    {page}
                </Box>
            </Box>
        </MainMenuStyled>
    )
}