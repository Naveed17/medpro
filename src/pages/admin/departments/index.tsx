import React, {ReactElement, useEffect, useState} from "react";
import {AdminLayout, configSelector} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {Box, Drawer} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Otable} from "@features/table";
import {DepartmentToolbar} from "@features/toolbar";
import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {MotifTypeDialog} from "@features/motifTypeDialog";
import {useAppSelector} from "@lib/redux/hooks";
import AddDepartmentDialog from "../../../features/dialog/components/addDepartmentDialog/addDepartmentDialog";

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
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready, i18n} = useTranslation("departments", {keyPrefix: "config"});
    const {direction} = useAppSelector(configSelector);

    const [openAddDrawer, setOpenAddDrawer] = useState(false);

    const {data: httpDepartmentsResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/admin/departments/${router.locale}`,
    }, ReactQueryNoValidateConfig);

    useEffect(() => {
        //reload locize resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["departments"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const departments = (httpDepartmentsResponse as HttpResponse)?.data ?? [];

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
                <DepartmentToolbar {...{t}} handleAddStaff={() => setOpenAddDrawer(true)}/>
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={departments}
                        from={"department"}
                        {...{t}}
                    />
                </DesktopContainer>

                <Drawer anchor={"right"} open={openAddDrawer} dir={direction} onClose={() => setOpenAddDrawer(false)}>
                    <AddDepartmentDialog
                        closeDraw={() => setOpenAddDrawer(false)}/>
                </Drawer>
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
