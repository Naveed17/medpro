import React, {ReactElement, useEffect, useState} from "react";
import {AdminLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {StaffToolbar} from "@features/toolbar";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Stack,
    Theme,
    Typography
} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {Otable, resetUser} from "@features/table";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {LoadingScreen} from "@features/loadingScreen";
import {NewUserDialog} from "@features/dialog";
import {setStepperIndex, stepperSelector} from "@features/stepper";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {sideBarSelector, toggleSideBar} from "@features/menu";
import {MobileContainer} from "@themes/mobileContainer";
import {NoDataCard, StaffMobileCard} from "@features/card";
import {DrawerBottom} from "@features/drawerBottom";
import IconUrl from "@themes/urlIcon";
import {Staff as StaffFilter} from '@features/leftActionBar'
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";

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
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready, i18n} = useTranslation("staff");
    const {currentStep} = useAppSelector(stepperSelector);
    const {opened: openSideBar} = useAppSelector(sideBarSelector);
    const [filter, setFilter] = useState(false)
    const [loadingReq, setLoadingReq] = useState(false)
    const [newUserDialog, setNewUserDialog] = useState<boolean>(false)
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);

    const page = parseInt((new URL(location.href)).searchParams.get("page") || "1");

    const {data: httpStaffResponse, mutate: mutateStaff} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/admin/users/${router.locale}`
    }, {
        refetchOnWindowFocus: false,
        variables: {
            query: `?page=${page}&limit=10`
        }
    });

    const {trigger: triggerStaffDelete} = useRequestQueryMutation("/staff/delete");

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

    const handleDeleteStaff = () => {
        setLoadingReq(true);
        selectedStaff && triggerStaffDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/users/${selectedStaff.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alerts.delete-staff.success"), {variant: 'success'})
                setDeleteDialog(false);
                setTimeout(() => setLoadingReq(false));
                mutateStaff();
            },
            onError: () => setLoadingReq(false)
        });
    }

    const handleTableEvent = (action: string, data: any) => {
        switch (action) {
            case "EDIT_STAFF":
                router.push(`${router.pathname}/${data.uuid}`, `${router.pathname}/${data.uuid}`, {locale: router.locale});
                break;
            case "DELETE_STAFF":
                setSelectedStaff(data);
                setDeleteDialog(true);
                break;
        }
    }

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["staff"]);
        if (!openSideBar) {
            dispatch(toggleSideBar(false));
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const users = ((httpStaffResponse as HttpResponse)?.data?.list ?? []) as UserModel[];

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
                <StaffToolbar {...{t, handleAddStaff}} />
            </SubHeader>
            <Box className="container">
                {users.length > 0 ?
                    <>
                        <DesktopContainer>
                            <LinearProgress sx={{
                                visibility: !httpStaffResponse ? "visible" : "hidden"
                            }} color="warning"/>
                            <Otable
                                headers={headCells}
                                handleEvent={handleTableEvent}
                                rows={users}
                                from={"staff"}
                                {...{t}}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {users.map((item) => (
                                    <StaffMobileCard key={item.uuid} {...{row: item, t}}
                                                     handleEvent={handleTableEvent}/>
                                ))}
                            </Stack>
                        </MobileContainer>
                    </>
                    :
                    <NoDataCard ns={"staff"} t={t} data={{
                        mainIcon: "ic-user3",
                        title: "no-data.title",
                        description: "no-data.description",
                    }}/>
                }
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
                <DrawerBottom
                    handleClose={() => setFilter(false)}
                    open={filter}
                    title={t("filter.title")}>
                    <StaffFilter/>
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
                        {...{t}}
                        type={"assignment"}
                        onNextPreviStep={handleNextPreviStep}
                        onClose={handleCloseNewUserDialog}/>
                </Dialog>

                <Dialog
                    PaperProps={{
                        sx: {
                            width: "100%"
                        }
                    }}
                    maxWidth="sm"
                    open={deleteDialog}>
                    <DialogTitle
                        sx={{
                            bgcolor: (theme: Theme) => theme.palette.error.main,
                            px: 1,
                            py: 2,

                        }}>
                        {t(`dialogs.delete-dialog.title`)}
                    </DialogTitle>
                    <DialogContent style={{paddingTop: 20}}>
                        <Stack alignItems={"center"} spacing={2} sx={{minHeight: 100}}>
                            <Typography sx={{textAlign: "center"}}
                                        fontWeight={"bold"}>{t("dialogs.delete-dialog.sub-title")}</Typography>
                            <Typography sx={{textAlign: "center"}} fontSize={13} variant={"caption"}>
                                {t(`dialogs.delete-dialog.description`)}
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                        <Stack direction="row" justifyContent={"space-between"} width={"100%"}>
                            <Button
                                variant={"text-black"}
                                onClick={() => {
                                    setDeleteDialog(false);
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("dialogs.cancel")}
                            </Button>
                            <LoadingButton
                                variant="contained"
                                loading={loadingReq}
                                onClick={handleDeleteStaff}
                                color="error"
                                startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                                {t("dialogs.delete")}
                            </LoadingButton>
                        </Stack>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'staff']))
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
