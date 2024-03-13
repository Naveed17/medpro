import React, {ReactElement, useEffect, useState} from "react";
import {AdminLayout, configSelector} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {Box, LinearProgress, Stack, Button} from "@mui/material";
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
import {MobileContainer} from "@themes/mobileContainer";
import {DoctorsMobileCard, NoDataCard} from "@features/card";
import {DrawerBottom} from "@features/drawerBottom";
import IconUrl from "@themes/urlIcon";
import {Doctors as DoctorsFilter} from '@features/leftActionBar'
import {Dialog as CustomDialog} from "@features/dialog";

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

    const {t, ready, i18n} = useTranslation("doctors");
    const {opened: openSideBar} = useAppSelector(sideBarSelector);
    const {direction} = useAppSelector(configSelector);

    const [filter, setFilter] = useState(false);
    const [openAddDoctorDialog, setOpenAddDoctorDialog] = useState(false);

    const page = parseInt((new URL(location.href)).searchParams.get("page") || "1");

    const {data: httpUsersResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/admin/users/${router.locale}`
    }, {
        refetchOnWindowFocus: false,
        variables: {
            query: `?page=${page}&limit=10&professionals=true`
        }
    });

    const handleTableEvent = (action: string, data: any) => {
        console.log(action, data);
        switch (action) {
            case "EDIT_DOCTOR":
                router.push(`${router.pathname}/${data.uuid}`, `${router.pathname}/${data.uuid}`, {locale: router.locale});
                break;
            case "DELETE_DOCTOR":

                break;
        }
    }

    const handleAddDoctor = () => {
        setOpenAddDoctorDialog(true);
    }

    const users = ((httpUsersResponse as HttpResponse)?.data?.list ?? []) as UserModel[];

    useEffect(() => {
        //reload resources from cdn servers
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
                <DoctorToolbar {...{t, title: "sub-header.list_title", handleAddDoctor}} />
            </SubHeader>
            <Box className="container">
                <LinearProgress sx={{
                    visibility: !httpUsersResponse ? "visible" : "hidden"
                }} color="warning"/>
                {users.length > 0 ?
                    <>
                        <DesktopContainer>
                            <Otable
                                headers={headCells}
                                handleEvent={handleTableEvent}
                                rows={users}
                                from={"doctors"}
                                {...{t}}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {users.map((item) => (
                                    <React.Fragment key={item.uuid}>
                                        <DoctorsMobileCard {...{
                                            t,
                                            row: item,
                                            edit: (prop: any) => console.log(prop)
                                        }} />
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </MobileContainer>
                    </>
                    : <NoDataCard ns={"doctors"} t={t} data={{
                        mainIcon: "ic-user3",
                        title: "no-data.title",
                        description: "no-data.description",
                    }}/>}
            </Box>
            <MobileContainer>
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
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

            <CustomDialog
                action={"doctor"}
                {...{
                    t,
                    direction
                }}
                open={openAddDoctorDialog}
                data={{
                    closeDraw: () => setOpenAddDoctorDialog(false)
                }}
                size={"sm"}
                fullWidth
                title={t("dialogs.doctor-dialog.title")}
                dialogClose={() => setOpenAddDoctorDialog(false)}
            />
            <DrawerBottom
                handleClose={() => setFilter(false)}
                open={filter}
                title={t("filter.title")}>
                <DoctorsFilter/>
            </DrawerBottom>
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
