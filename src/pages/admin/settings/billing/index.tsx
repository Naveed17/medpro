import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement } from "react";
import { Box, Button, Card, CardContent, Stack, Typography, styled, useMediaQuery } from "@mui/material";
import { AdminLayout } from "@features/base";
import { useTranslation } from "next-i18next";
import { LoadingScreen } from "@features/loadingScreen";
import { SubHeader } from "@features/subHeader";
import { RootStyled } from "@features/toolbar";
import AddIcon from "@mui/icons-material/Add";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Otable } from "@features/table";
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 7,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.primary.main,
    },
}));
const headCells = [
    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        align: "left",
        sortable: true,
    },
    {
        id: "invoice_no",
        numeric: false,
        disablePadding: false,
        label: "invoice_no",
        align: "center",
        sortable: true,
    },
    {
        id: "description",
        numeric: false,
        disablePadding: false,
        label: "description",
        align: "center",
        sortable: true,
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        align: "center",
        sortable: true,
    },
    {
        id: "status",
        numeric: false,
        disablePadding: false,
        label: "status",
        align: "center",
        sortable: true,
    },

];
function Billing() {
    const { t, ready } = useTranslation("settings", { keyPrefix: "billing.config" });
    if (!ready) return (<LoadingScreen button text={"loading-error"} />);
    return (
        <React.Fragment>
            <SubHeader>
                <RootStyled>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t("users")}
                    </Typography>
                    <Button startIcon={<AddIcon />} variant="contained" color="primary" sx={{ ml: "auto" }}>
                        {t("add_user")}
                    </Button>
                </RootStyled>
            </SubHeader>
            <Box className="container">
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Stack spacing={1}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {t("plan_details")}
                                    </Typography>
                                    <Button variant="contained">
                                        {t("upgrade")}
                                    </Button>
                                </Stack>
                                <Stack direction='row' alignItems='center' spacing={3}>
                                    <Stack direction='row' alignItems="center" justifyContent="space-between" width={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {t("plan")}
                                        </Typography>
                                        <Button variant="google" sx={{ bgcolor: theme => theme.palette.info.main }}>
                                            {t("medical_group_practice")}
                                        </Button>
                                    </Stack>
                                    <Stack direction='row' alignItems="center" justifyContent="space-between" width={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {t("doctors")}
                                        </Typography>
                                        <Stack spacing={.5} maxWidth={340} width={1} ml={1}>
                                            <Stack direction='row' alignItems="center" justifyContent='space-between'>
                                                <Typography color="textSecondary">
                                                    {t("doctors_users")}
                                                </Typography>
                                                <Typography fontWeight={700} color="textSecondary">
                                                    2 {t("of")} 4 {t("users")}
                                                </Typography>
                                            </Stack>
                                            <BorderLinearProgress variant="determinate" value={50} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack direction='row' alignItems='center' spacing={3}>
                                    <Stack direction='row' alignItems="center" justifyContent="space-between" width={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {t("next_payment")}
                                        </Typography>
                                        <Typography>
                                            4990 TND on Oct 31st, 2024
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' alignItems="center" justifyContent="space-between" width={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {t("staff")}
                                        </Typography>
                                        <Stack spacing={.5} maxWidth={340} width={1} ml={1}>
                                            <Stack direction='row' alignItems="center" justifyContent='space-between'>
                                                <Typography color="textSecondary">
                                                    {t("staff_users")}
                                                </Typography>
                                                <Typography fontWeight={700} color="textSecondary">
                                                    2 {t("of")} 4 {t("users")}
                                                </Typography>
                                            </Stack>
                                            <BorderLinearProgress variant="determinate" value={50} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Otable
                        toolbar={<Typography mb={2} variant="subtitle1" fontWeight={600}>{t("table.table_heading")}</Typography>}
                        headers={headCells}
                        rows={[1, 2]}
                        from={"billing-history"}
                        {...{ t }}

                    />
                </Stack>
            </Box>
        </React.Fragment>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'settings']))
    }
})

export default Billing

Billing.auth = true

Billing.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
