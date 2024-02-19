import React, {ReactElement} from "react";
import {AdminLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {Box} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Otable} from "@features/table";
import {DepartmentToolbar} from "@features/toolbar";

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
        align: "center",
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
    const {t, ready} = useTranslation("departments", {keyPrefix: "config"});

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    },
                }}>
                <DepartmentToolbar {...{t}}/>
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={[]}
                        from={"doctors"}
                        {...{t}}
                    />
                </DesktopContainer>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
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
