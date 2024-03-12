import React, { ReactElement } from "react";
import { DashLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import { LoadingScreen } from "@features/loadingScreen";
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Link, List, ListItem, ListItemIcon, Paper, Stack, Typography, useTheme } from "@mui/material";
import { CustomIconButton } from "@features/buttons";
import IconAdd from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import { RdvRequestCard } from "@features/card";
import { TimeLine } from "@features/timeline";
import { ConditionalWrapper } from "@lib/hooks";
import Zoom from "react-medium-image-zoom";
import { ImageHandler } from "@features/image";
import { AgendaTimeLine } from "@features/agendaTimeline";
function Dashboard() {
    const theme = useTheme()
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
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: (theme) => theme.shadows[5]
                                }}
                            >
                                <CardContent>

                                    <Typography mb={2} gutterBottom variant="subtitle1" fontWeight={600}>
                                        {t("appointments")}
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item md={5} xs={12}>
                                            <AgendaTimeLine />
                                        </Grid>
                                        <Grid item md={7} xs={12}>
                                            <Paper sx={{ p: 1.5, border: 'none', bgcolor: theme => theme.palette.background.default }}>
                                                <Stack spacing={2}>
                                                    <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
                                                        <ConditionalWrapper
                                                            condition={false}
                                                            wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                                                <Avatar
                                                                    src={"/static/icons/men-avatar.svg"}
                                                                    sx={{
                                                                        width: 35,
                                                                        height: 35,
                                                                        borderRadius: 1
                                                                    }}>
                                                                    <IconUrl width={"35"} height={"35"} path="men-avatar" />
                                                                </Avatar>
                                                                <Stack>
                                                                    <Typography fontWeight={600} color="primary">
                                                                        Patient name
                                                                    </Typography>
                                                                    <Stack direction='row' alignItems='center' spacing={1}>
                                                                        <IconUrl path={"ic-folder"} color={theme.palette.text.secondary} width={16} height={16} />
                                                                        <Typography variant="body2" color={'text.secondary'}>
                                                                            {t("file_no")} {" "} 15/9
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                        </ConditionalWrapper>
                                                        <Stack direction='row' alignItems='center' spacing={.5}>
                                                            <IconUrl path="ic-agenda-jour" width={14} height={14} />
                                                            <Typography fontWeight={500} variant="body2">
                                                                10/12/2022
                                                            </Typography>
                                                            <IconUrl path="ic-time" width={14} height={14} />
                                                            <Typography fontWeight={500} variant="body2">
                                                                10:00
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                    <List disablePadding>
                                                        <ListItem sx={{ px: 0 }}>
                                                            <ListItemIcon sx={{ minWidth: 146 }}>
                                                                <Typography variant="body2" color="text.secondary">{t("assigned_doctor")}</Typography>
                                                            </ListItemIcon>
                                                            <Typography fontWeight={500}>
                                                                Dr Ghassen BOULAHIA
                                                            </Typography>
                                                        </ListItem>
                                                        <ListItem sx={{ px: 0 }}>
                                                            <ListItemIcon sx={{ minWidth: 146 }}>
                                                                <Typography variant="body2" color="text.secondary">{t("type")}</Typography>
                                                            </ListItemIcon>
                                                            <Typography fontWeight={500}>
                                                                Consultation
                                                            </Typography>
                                                        </ListItem>
                                                        <ListItem sx={{ px: 0 }}>
                                                            <ListItemIcon sx={{ minWidth: 146 }}>
                                                                <Typography variant="body2" color="text.secondary">{t("reason")}</Typography>
                                                            </ListItemIcon>
                                                            <Typography fontWeight={500}>
                                                                Apnée de sommeil
                                                            </Typography>
                                                        </ListItem>
                                                        <Divider sx={{ my: 1 }} />
                                                        <ListItem sx={{ px: 0 }}>
                                                            <ListItemIcon sx={{ minWidth: 146 }}>
                                                                <Typography variant="body2" color="text.secondary">{t("last_visit")}</Typography>
                                                            </ListItemIcon>
                                                            <Typography fontWeight={500}>
                                                                08-12-2023
                                                            </Typography>
                                                        </ListItem>
                                                        <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                                                            <ListItemIcon sx={{ minWidth: 146 }}>
                                                                <Typography variant="body2" color="text.secondary">{t("documents")}</Typography>
                                                            </ListItemIcon>
                                                            <Stack spacing={1}>
                                                                {Array.from({ length: 2 }).map((_, idx) => (
                                                                    <Card
                                                                        key={idx}
                                                                        sx={{
                                                                            borderRadius: "12px",
                                                                            border: "none",
                                                                            boxShadow: (theme) => theme.shadows[5]
                                                                        }}>
                                                                        <CardContent sx={{ px: "8px !important", py: "4px !important" }}>
                                                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                                                <ImageHandler
                                                                                    width={17} height={23}
                                                                                    alt={"image/png"}
                                                                                    src={"/static/img/doc-1.png"}
                                                                                />
                                                                                <Typography variant="body2" fontWeight={500}>
                                                                                    Complete morphology.pdf
                                                                                </Typography>
                                                                            </Stack>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}

                                                            </Stack>
                                                        </ListItem>
                                                    </List>
                                                    <Button variant="contained">
                                                        {t("add_doc")}
                                                    </Button>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>
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

                                    <Typography mb={2} gutterBottom variant="subtitle1" fontWeight={600}>
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
                                    <TimeLine data={
                                        [
                                            {
                                                time: "09:30",
                                                children: <Typography variant="body2" color="textSecondary">
                                                    <Link underline="none">
                                                        Dr.Henry Markhay
                                                    </Link>
                                                    {" "} Completed the Patient visit with {" "}
                                                    <Link underline="none">Walid Tanazefti</Link>
                                                </Typography>,
                                                color: 'success'

                                            },
                                            {
                                                time: "10:00",
                                                children:
                                                    <>
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
                                                    </>
                                                ,
                                                color: 'primary'
                                            },
                                            {
                                                time: "10:15",
                                                children: <Typography variant="body2" fontWeight={600} fontSize={13}>
                                                    Make deposit
                                                    <Link underline="none" color="success.main">
                                                        {" "} USD 700 {" "}
                                                    </Link>
                                                    to ESL
                                                </Typography>,
                                                color: 'error'
                                            }
                                        ]

                                    } />
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
