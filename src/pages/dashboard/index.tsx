import React, { ReactElement } from "react";
import { DashLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import { LoadingScreen } from "@features/loadingScreen";
import { Box, Card, CardContent, Grid, Link, List, ListItem, ListItemIcon, Stack, Typography } from "@mui/material";
import { CustomIconButton } from "@features/buttons";
import IconAdd from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import { RdvRequestCard } from "@features/card";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
    TimelineDot
} from '@mui/lab';
function Dashboard() {
    const { t, ready } = useTranslation("dashboard");
    if (!ready) return <LoadingScreen button text={"loading-error"} />;
    return (
        <>
            <SubHeader>
                <Stack direction="row" alignItems='center' justifyContent='space-between' width={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t("sub-header.title")}
                    </Typography>
                    <CustomIconButton color="primary">
                        <IconAdd />
                    </CustomIconButton>
                </Stack>

            </SubHeader>
            <Box className="container">
                <Grid container spacing={2}>
                    <Grid xs={12} item md={8}>
                        <Stack spacing={2}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: (theme) => theme.shadows[5]
                                }}>
                                <CardContent sx={{ p: 2 }}>

                                    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={"center"}>
                                        <Stack
                                            borderRight={{ xs: 0, md: 1.5 }}
                                            borderColor={{ xs: 'transparent', md: 'divider' }}
                                            mr={{ xs: 0, md: 2 }}
                                            direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-calendar-card"} />
                                            <Stack>
                                                <Typography fontWeight={700} lineHeight={1} variant="h6">
                                                    1500
                                                </Typography>
                                                <Typography fontWeight={500} variant="body2">
                                                    {t("appointments")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack mt={{ xs: 2, md: 0 }} direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-user-card"} />
                                            <Stack>
                                                <Typography fontWeight={700} lineHeight={1} variant="h6">
                                                    956
                                                </Typography>
                                                <Typography fontWeight={500} variant="body2">
                                                    {t("total_patients")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack my={{ xs: 2, md: 0 }} px={{ xs: 0, md: 2 }} mr={{ xs: 0, md: 2 }}
                                            direction={"row"} spacing={1.2} alignItems={"center"} width={1}
                                            borderRight={{ xs: 0, md: 1.5 }} borderLeft={{ xs: 0, md: 1.5 }}
                                            borderColor={{ xs: 'transparent', md: 'divider' }}>
                                            <IconUrl path={"stats/ic-new-patients-card"} />
                                            <Stack>
                                                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                    <Typography fontWeight={700} lineHeight={1} variant="h6">
                                                        125
                                                    </Typography>

                                                    <Stack direction={"row"}>
                                                        <IconUrl path={"ic-up-right"} />
                                                        <Typography fontWeight={700}
                                                            color="success.main"
                                                            variant="body2">4 % </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Typography fontWeight={500} variant="body2">
                                                    {t("new-patients")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                                            <IconUrl path={"stats/ic-waiting-hour-card"} />
                                            <Stack>
                                                <Stack direction={"row"} spacing={1} alignItems={"flex-end"}>
                                                    <Typography fontWeight={700} lineHeight={1} variant="h6">
                                                        34
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {t("min")}
                                                    </Typography>
                                                </Stack>
                                                <Typography fontSize={12} fontWeight={500} variant="body2">
                                                    {t("avg_wait_time")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid xs={12} item md={4}>
                        <Stack spacing={2}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: (theme) => theme.shadows[5]
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>

                                    <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                        {t("rdv-request")}
                                    </Typography>
                                    <Stack spacing={2}>
                                        {Array.from({ length: 3 }).map((_, idx) => (
                                            <React.Fragment key={idx}>
                                                <RdvRequestCard />
                                            </React.Fragment>
                                        ))}

                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: (theme) => theme.shadows[5]
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {t("recent_activities")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        890,344 {t("activities")}
                                    </Typography>
                                    <Timeline

                                        sx={{
                                            p: 0,
                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                flex: 0.2,
                                            },
                                        }}
                                    >
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{ fontWeight: 600, pl: 0, pr: .5, textAlign: 'left' }}>
                                                09:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="success" />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" color="textSecondary">
                                                    <Link underline="none">
                                                        Dr.Henry Markhay
                                                    </Link>
                                                    {" "} Completed the Patient visit with {" "}
                                                    <Link underline="none">Walid Tanazefti</Link>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{ fontWeight: 600, pl: 0, pr: .5, textAlign: 'left' }}>
                                                09:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="secondary" />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Bernardo James Uploaded 2 new documents to Mohamed belagha file
                                                    </Typography>
                                                </Stack>
                                                <List disablePadding>


                                                    <ListItem sx={{ px: 0, py: .5 }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                                            <IconUrl width={30} height={30} path="pdf" />
                                                        </ListItemIcon>
                                                        <Stack spacing={.1}>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                Airplus Guideline
                                                            </Typography>
                                                            <Typography variant='caption' color='textSecondary'>
                                                                12 mb
                                                            </Typography>
                                                        </Stack>
                                                    </ListItem>

                                                    <ListItem sx={{ px: 0, py: .5 }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                                            <IconUrl width={30} height={30} path="ic-doc-file" />
                                                        </ListItemIcon>
                                                        <Stack spacing={.1}>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                FureStibe requirements
                                                            </Typography>
                                                            <Typography variant='caption' color='textSecondary'>
                                                                8 kb
                                                            </Typography>
                                                        </Stack>
                                                    </ListItem>

                                                </List>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{ fontWeight: 600, pl: 0, pr: .5, textAlign: 'left' }}>
                                                14:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="error" />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" fontWeight={600} fontSize={13}>
                                                    Make deposit
                                                    <Link underline="none" color="success.main">
                                                        {" "} USD 700 {" "}
                                                    </Link>
                                                    to ESL
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{ fontWeight: 600, pl: 0, pr: .5, textAlign: 'left' }}>
                                                21:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="error" />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" fontWeight={600} fontSize={13}>
                                                    New order placed {" "}
                                                    <Link underline="none" color="success.main">
                                                        #XF-2356
                                                    </Link>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                </CardContent>
                            </Card>
                        </Stack>

                    </Grid>
                </Grid>
            </Box>
        </>

    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'dashboard']))
    }
})

Dashboard.auth = true

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Dashboard
