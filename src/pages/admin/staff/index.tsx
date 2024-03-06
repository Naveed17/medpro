import React, { ReactElement, useEffect, useState } from "react";
import { AdminLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { StaffToolbar } from "@features/toolbar";
import { Box, Button, Dialog, LinearProgress, Stack } from "@mui/material";
import { DesktopContainer } from "@themes/desktopConainter";
import { Otable, resetUser } from "@features/table";
import { useRouter } from "next/router";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { useTranslation } from "next-i18next";
import { useRequestQuery } from "@lib/axios";
import { LoadingScreen } from "@features/loadingScreen";
import { NewUserDialog } from "@features/dialog";
import { setStepperIndex, stepperSelector } from "@features/stepper";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { sideBarSelector, toggleSideBar } from "@features/menu";
import { MobileContainer } from "@themes/mobileContainer";
import { NoDataCard, StaffMobileCard } from "@features/card";
import { DrawerBottom } from "@features/drawerBottom";
import IconUrl from "@themes/urlIcon";
import { Staff as StaffFilter } from '@features/leftActionBar'

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
        id: "function",
        numeric: false,
        disablePadding: false,
        label: "function",
        align: "center",
        sortable: true,
    },
    {
        id: "contact",
        numeric: false,
        disablePadding: false,
        label: "contact",
        align: "center",
        sortable: true,
    },
    {
        id: "email",
        numeric: false,
        disablePadding: false,
        label: "email",
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

function Staff() {
    const router = useRouter();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const { t, ready, i18n } = useTranslation("staff", { keyPrefix: "config" });
    const { currentStep } = useAppSelector(stepperSelector);
    const { opened: openSideBar } = useAppSelector(sideBarSelector);
    const [filter, setFilter] = useState(false)
    const [newUserDialog, setNewUserDialog] = useState<boolean>(false)

    const { data: httpUsersResponse } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const handleAddStaff = () => {
        dispatch(resetUser());
        setNewUserDialog(true);
    }

    const handleCloseNewUserDialog = () => {
        setNewUserDialog(false)
        dispatch(setStepperIndex(0))
    }

    const handleNextPreviStep = () => {
        if (currentStep == 0) {
            setNewUserDialog(false)
        } else {
            dispatch(setStepperIndex(currentStep - 1))
        }
    }

    const handleTableEvent = (action: string, data: any) => {
        console.log(action, data);
        switch (action) {
            case "EDIT_DOCTOR":

                break;
            case "DELETE_DOCTOR":

                break;
        }
    }

    useEffect(() => {
        //reload locize resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["staff"]);
        if (!openSideBar) {
            dispatch(toggleSideBar(false));
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const users = ((httpUsersResponse as HttpResponse)?.data?.filter((user: UserModel) => !user.isProfessional) ?? []) as UserModel[];

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
                <StaffToolbar {...{ t, handleAddStaff }} />
            </SubHeader>
            <Box className="container">
                {users.length > 0 ?
                    <>
                        <DesktopContainer>
                            <LinearProgress sx={{
                                visibility: !httpUsersResponse ? "visible" : "hidden"
                            }} color="warning" />
                            <Otable
                                headers={headCells}
                                handleEvent={handleTableEvent}
                                rows={users}
                                from={"staff"}
                                {...{ t }}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {users.map((item) => (
                                    <StaffMobileCard key={item.uuid} {...{ row: item, t }} handleEvent={handleTableEvent} />
                                ))}
                            </Stack>
                        </MobileContainer>
                    </>
                    :
                    <NoDataCard ns={"staff"} t={t} data={{
                        mainIcon: "ic-user3",
                        title: "no-data.title",
                        description: "no-data.description",
                    }} />
                }
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
                    <StaffFilter />
                </DrawerBottom>
                <Dialog
                    maxWidth="md"
                    PaperProps={{
                        sx: {
                            width: '100%',
                            m: 1
                        }
                    }}
                    open={newUserDialog}
                    onClose={handleCloseNewUserDialog}>
                    <NewUserDialog
                        {...{ t }}
                        type={"assignment"}
                        onNextPreviStep={handleNextPreviStep}
                        onClose={handleCloseNewUserDialog} />
                </Dialog>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'staff', 'settings']))
    }
})

Staff.auth = true

Staff.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default Staff
