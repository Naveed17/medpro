import React, {ReactElement, useEffect} from "react";
import {AdminLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {Box, LinearProgress} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Otable} from "@features/table";
import {DoctorToolbar} from "@features/toolbar";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {sideBarSelector, toggleSideBar} from "@features/menu";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";

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
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready, i18n} = useTranslation("doctors", {keyPrefix: "config"});
    const {opened: openSideBar} = useAppSelector(sideBarSelector);

    const {data: httpUsersResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const handleTableEvent = (action: string, data: any) => {
        console.log(action, data);
        switch (action) {
            case "EDIT_DOCTOR":

                break;
            case "DELETE_DOCTOR":

                break;
        }
    }

    const users = ((httpUsersResponse as HttpResponse)?.data?.filter((user: UserModel) => user.isProfessional) ?? []) as UserModel[];

    useEffect(() => {
        //reload locize resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["doctors"]);
        if (!openSideBar) {
            dispatch(toggleSideBar(false));
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
                <DoctorToolbar {...{t, title: "sub-header.list_title"}} />
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <LinearProgress sx={{
                        visibility: !httpUsersResponse ? "visible" : "hidden"
                    }} color="warning"/>
                    <Otable
                        headers={headCells}
                        handleEvent={handleTableEvent}
                        rows={users}
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
