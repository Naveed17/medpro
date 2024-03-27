import React, {ReactElement, useEffect, useState} from "react";
import {AdminLayout, configSelector} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {
    Box,
    Button,
    DialogActions,
    DialogContent, LinearProgress,
    Stack, Theme,
    Typography
} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Otable} from "@features/table";
import {DepartmentToolbar} from "@features/toolbar";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {Dialog as CustomDialog} from "@features/dialog";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useSnackbar} from "notistack";
import {MobileContainer} from "@themes/mobileContainer";
import {DepartmentMobileCard, NoDataCard} from "@features/card";

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
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready, i18n} = useTranslation("departments");
    const {direction} = useAppSelector(configSelector);

    const [openAddDrawer, setOpenAddDrawer] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [loadingReq, setLoadingReq] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentModel | null>(null);

    const {
        data: httpDepartmentsResponse,
        mutate: mutateDepartments,
        isLoading: isDepartmentsLoading
    } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/admin/departments/${router.locale}`,
    }, ReactQueryNoValidateConfig);

    const {trigger: deleteDepartmentTrigger} = useRequestQueryMutation("/department/delete");

    const handleDeleteDepartment = () => {
        setLoadingReq(true)
        deleteDepartmentTrigger({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/admin/departments/${selectedDepartment?.uuid}/${router.locale}`,
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("dialogs.delete-department-dialog.alert.success"), {variant: "success"})
                mutateDepartments();
                setDeleteDialog(false);
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    const handleTableEvent = (action: string, data: any) => {
        setSelectedDepartment(data);
        switch (action) {
            case "EDIT_DEPARTMENT":
                setOpenAddDrawer(true);
                break;
            case "DELETE_DEPARTMENT":
                setDeleteDialog(true);
                break;
        }
    }

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["departments"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const departments = ((httpDepartmentsResponse as HttpResponse)?.data ?? []) as DepartmentModel[];

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
                <DepartmentToolbar {...{t}} handleAddStaff={() => {
                    setSelectedDepartment(null);
                    setOpenAddDrawer(true);
                }}/>
            </SubHeader>

            <LinearProgress
                sx={{visibility: !httpDepartmentsResponse ? "visible" : "hidden"}}
                color="warning"/>

            <Box className="container">
                <DesktopContainer>
                    <Otable
                        {...{t}}
                        prefix={"config"}
                        headers={headCells}
                        handleEvent={handleTableEvent}
                        rows={departments}
                        from={"department"}
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Stack spacing={2}>
                        {departments.map((row, idx) => (
                            <DepartmentMobileCard key={idx} {...{t, row}} handleEvent={handleTableEvent}/>
                        ))}
                    </Stack>
                </MobileContainer>

                {(!isDepartmentsLoading && departments.length === 0) && <NoDataCard
                    {...{t}}
                    ns={"departments"}
                    data={{
                        mainIcon: "ic-deparment",
                        title: "no-data.title",
                        description: "no-data.description",
                    }}/>}

                <CustomDialog
                    action={"department"}
                    {...{direction}}
                    open={openAddDrawer}
                    data={{
                        data: selectedDepartment,
                        closeDraw: () => setOpenAddDrawer(false)
                    }}
                    size={"sm"}
                    fullWidth
                    title={t("dialogs.department-dialog.title")}
                    dialogClose={() => setOpenAddDrawer(false)}
                />

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
                        {t(`dialogs.delete-department-dialog.title`)}
                    </DialogTitle>
                    <DialogContent sx={{textAlign: "center"}} style={{paddingTop: 20}}>
                        <Stack spacing={2}>
                            <Typography sx={{textAlign: "center"}}
                                        fontWeight={"bold"}>{t("dialogs.delete-department-dialog.sub-title")}</Typography>
                            <Typography fontSize={13} variant={"caption"}>
                                {t(`dialogs.delete-department-dialog.description`)}
                            </Typography>
                        </Stack>

                    </DialogContent>
                    <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                        <Stack direction="row" spacing={1} justifyContent={"space-between"} width={"100%"}>
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
                                color="error"
                                onClick={handleDeleteDepartment}
                                startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                                {t("dialogs.delete-department-dialog.delete")}
                            </LoadingButton>
                        </Stack>
                    </DialogActions>
                </Dialog>
            </Box>
            <MobileContainer>
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
                    variant="filter"
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
