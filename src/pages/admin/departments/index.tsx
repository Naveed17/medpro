import React, { ReactElement, useState } from "react";
import { AdminLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { Box, Button, Stack } from "@mui/material";
import { DesktopContainer } from "@themes/desktopConainter";
import { useTranslation } from "next-i18next";
import { LoadingScreen } from "@features/loadingScreen";
import { Otable } from "@features/table";
import { DepartmentToolbar } from "@features/toolbar";
import { MobileContainer } from "@themes/mobileContainer";
import { DepartmentMobileCard, NoDataCard } from "@features/card";
import IconUrl from "@themes/urlIcon";
import { DrawerBottom } from "@features/drawerBottom";
import { Department as DepartmentFilter } from '@features/leftActionBar'
const headCells = [
    {
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "name",
        sortable: false,
        align: "left",
    },
    {
        id: "department",
        numeric: false,
        disablePadding: false,
        label: "department",
        align: "left",
        sortable: true,
    },
    {
        id: "department-head",
        numeric: false,
        disablePadding: false,
        label: "department-head",
        align: "center",
        sortable: true,
    },
    {
        id: "status",
        numeric: true,
        disablePadding: false,
        label: "status",
        align: "center",
        sortable: true,
    },
    {
        id: "date",
        numeric: true,
        disablePadding: false,
        label: "date",
        align: "center",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "empty",
        align: "center",
        sortable: false,
    },
];

function Departments() {
    const { t, ready } = useTranslation("departments", { keyPrefix: "config" });
    const [filter, setFilter] = useState(false);
    if (!ready) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: { xs: "column", md: "row" },
                        py: { md: 0, xs: 2 },
                    },
                }}>
                <DepartmentToolbar {...{ t }} />
            </SubHeader>
            <Box className="container">
                {[1, 3].length > 0 ?
                    <>
                        <DesktopContainer>
                            <Otable
                                headers={headCells}
                                rows={[1, 2]}
                                from={"department"}
                                {...{ t }}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {[1, 2].map((row, idx) => (

                                    <DepartmentMobileCard key={idx} {...{ t, row }} />
                                ))}

                            </Stack>
                        </MobileContainer>
                    </>
                    : <NoDataCard ns={"departments"} t={t} data={{
                        mainIcon: "ic-deparment",
                        title: "no-data.title",
                        description: "no-data.description",
                    }} />
                }
            </Box>
            <MobileContainer>
                <Button
                    startIcon={<IconUrl path="ic-filter" />}
                    variant="filter"
                    onClick={() => setFilter(true)}
                    sx={{
                        position: "fixed",
                        bottom: 50,
                        transform: "translateX(-50%)",
                        left: "50%",
                        zIndex: 999,

                    }}>
                    {t("filter.title")} (0)
                </Button>
            </MobileContainer>
            <DrawerBottom
                handleClose={() => setFilter(false)}
                open={filter}
                title={t("filter.title")}>
                <DepartmentFilter />
            </DrawerBottom>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'departments']))
    }
})

Departments.auth = true

Departments.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default Departments
