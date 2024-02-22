import React, { ReactElement } from "react";
import { AdminLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { Box } from "@mui/material";
import { DesktopContainer } from "@themes/desktopConainter";
import { useTranslation } from "next-i18next";
import { LoadingScreen } from "@features/loadingScreen";
import { Otable } from "@features/table";
import { DoctorToolbar } from "@features/toolbar";
import { useRequestQuery } from "@lib/axios";
import { useRouter } from "next/router";
import { useMedicalEntitySuffix } from "@lib/hooks";

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
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        align: "left",
        sortable: true,
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
        id: "speciality",
        numeric: false,
        disablePadding: false,
        label: "speciality",
        align: "center",
        sortable: true,
    },
    {
        id: "contact",
        numeric: true,
        disablePadding: false,
        label: "contact",
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
        id: "join-date",
        numeric: true,
        disablePadding: false,
        label: "join-date",
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

function Doctors() {
    const router = useRouter();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { t, ready } = useTranslation("doctors", { keyPrefix: "config" });

    const { data: httpUsersResponse } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const users = ((httpUsersResponse as HttpResponse)?.data?.filter((user: UserModel) => user.isProfessional) ?? []) as UserModel[];

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
                <DoctorToolbar {...{ t, title: "sub-header.list_title" }} />
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={users}
                        from={"doctors"}
                        {...{ t }}
                    />
                </DesktopContainer>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'doctors']))
    }
})

Doctors.auth = true

Doctors.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default Doctors
