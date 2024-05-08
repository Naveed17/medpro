import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout, dashLayoutSelector } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { configSelector } from "@features/base";
import { SubHeader } from "@features/subHeader";
import {
    Box,
    Button,
    Stack,
    Drawer,
    DialogContent,
    Typography,
    DialogActions,
    DialogTitle,
    Dialog,
    Theme,
    MenuItem,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { Otable, resetUser } from "@features/table";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { NoDataCard } from "@features/card";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { LoadingScreen } from "@features/loadingScreen";
import IconUrl from "@themes/urlIcon";
import { AccessMenage } from "@features/drawer";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from "notistack";
import { UserMobileCard } from '@features/card';
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import { useSendNotification } from "@lib/hooks/rest";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Redirect } from "@features/redirect";
import { ActionMenu } from "@features/menu";
import { CustomIconButton } from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import { NewUserDialog } from "@features/dialog";
import { setStepperIndex, stepperSelector } from "@features/stepper";
import Can from "@features/casl/can";

const CardData = {
    mainIcon: "ic-user",
    title: "no-data.user.title",
    description: "no-data.user.description",
    buttonText: "no-data.user.button-text",
    buttonIcon: "ic-agenda-+",
    buttonVariant: "warning",
};

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        align: "left",
        sortable: true,
    },
    {
        id: "fonction",
        numeric: false,
        disablePadding: false,
        label: "fonction",
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
    {
        id: "lastActive",
        numeric: true,
        disablePadding: false,
        label: "lastActive",
        align: "center",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "action",
        align: "center",
        sortable: false,
    },
];

function Users() {
    const router = useRouter();
    const { data: session } = useSession();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { enqueueSnackbar } = useSnackbar();
    const { trigger: triggerNotificationPush } = useSendNotification();
    const dispatch = useAppDispatch();

    const { t, ready, i18n } = useTranslation("settings", { keyPrefix: "users.config" });
    const { direction } = useAppSelector(configSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const { currentStep } = useAppSelector(stepperSelector);
    const [tabvalue, setTabValue] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteActionDialog, setDeleteActionDialog] = useState("user");
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedProfile, setSelectedProfile] = useState<any>("");
    const [open, setOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [newUserDialog, setNewUserDialog] = useState<boolean>(false)

    const { jti, id: currentUser } = session?.user as any;
    const { data: user } = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles;

    const { trigger: triggerUserUpdate } = useRequestQueryMutation("/users/update");
    const { trigger: triggerUserDelete } = useRequestQueryMutation("/users/delete");
    const { trigger: triggerProfileUpdate } = useRequestQueryMutation("/profile/update");

    const { data: httpUsersResponse, mutate } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const users = ((httpUsersResponse as HttpResponse)?.data ?? []) as UserModel[];
    const popoverActions = [{
        icon: <IconUrl path="ic-trash" color="white" />,
        title: "delete-role",
        action: "onDeleteRole"
    }]

    const handleDocPermission = (action: string, props: any, value: any) => {
        const form = new FormData();
        form.append("attribute", action);
        form.append("value", value);
        triggerUserUpdate({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/edit/user/${props.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutate();
                enqueueSnackbar(t("updated"), { variant: "success" });
                if (action === "isDocSee") {
                    medicalEntityHasUser && triggerNotificationPush({
                        action: "push",
                        root: "all",
                        message: " ",
                        content: JSON.stringify({
                            mutate: `${urlMedicalEntitySuffix}/professionals/${router.locale}`,
                            fcm_session: jti
                        })
                    });
                }
            }
        });
    }

    const handleClose = () => {
        setContextMenu(null);
    }

    const OnMenuActions = (action: string) => {
        switch (action) {
            case "onDeleteRole":
                setDeleteActionDialog("profile");
                setTimeout(() => setDeleteDialog(true));
                break;
        }
        handleClose();
    }

    const handleChange = (action: string, props: any, event: any) => {
        switch (action) {
            case "PROFILE":
                handleDocPermission("profile", props, event);
                break;
            default:
                handleDocPermission(action === "ACCESS" ? "isActive" : "isDocSee", props, event.target.checked);
                break;
        }
    }

    const closeDraw = () => {
        setOpen(false);
    }

    const onDelete = (props: any) => {
        setSelectedUser(props);
        setDeleteActionDialog("user");
        setTimeout(() => setDeleteDialog(true));
    }

    const deleteUser = () => {
        setLoading(true);
        triggerUserDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/users/${selectedUser.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("delete_success"), { variant: 'success' })
                setDeleteDialog(false);
                setTimeout(() => setLoading(false));
                mutate();
            },
            onError: () => setLoading(false)
        });
    }

    const deleteProfile = () => {
        setLoading(true);
        triggerProfileUpdate({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/profile/${selectedProfile?.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                setLoading(false);
                setDeleteDialog(false);
            }
        })
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
        switch (action) {
            case "onUserDetail":

                break;
        }
    }

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    if (roles.includes('ROLE_SECRETARY')) {
        return <Redirect to='/dashboard/settings' />
    }

    return (
        <>
            {users && users.length > 0 ? (
                <>
                    <DesktopContainer>
                        <Otable
                            toolbar={<Stack mb={4} direction="row" alignItems="center" mt={2} justifyContent="space-between" width={1}>
                                <Typography color="text.primary" variant="subtitle1" fontWeight={600}>{t("users")}</Typography>
                                <Can I={"manage"} a={"settings"} field={"settings__users__create"}>
                                    {tabvalue === 0 &&
                                        <CustomIconButton
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.stopPropagation();
                                                dispatch(resetUser());
                                                setNewUserDialog(true);
                                            }}
                                            variant="filled"
                                            sx={{ p: .6 }}
                                            color={"primary"}
                                            size={"small"}>
                                            <AgendaAddViewIcon />
                                        </CustomIconButton>}
                                </Can>
                            </Stack>}
                            headers={headCells}
                            handleEvent={(action: string, eventData: EventModal) => handleTableEvent(action, eventData)}
                            rows={users}
                            from={"users"}
                            {...{ t, currentUser, handleChange }}
                            edit={onDelete}
                        />
                    </DesktopContainer>
                    <MobileContainer>
                        <Stack spacing={1}>
                            {users.map((user) => (
                                <React.Fragment key={user.uuid}>
                                    <UserMobileCard data={user} t={t} />
                                </React.Fragment>
                            ))}
                        </Stack>
                    </MobileContainer>
                </>
            ) : (
                <NoDataCard t={t} ns={"settings"} data={CardData} />
            )}
            <Drawer
                PaperProps={{
                    sx: {
                        maxWidth: 650,
                        width: "100%",
                    },
                }}
                anchor={"right"}
                open={open}
                dir={direction}
                onClose={closeDraw}>
                <AccessMenage {...{ t }} />
            </Drawer>

            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%"
                    }
                }}
                maxWidth="sm"
                open={deleteDialog}>
                <DialogTitle
                >
                    {t(`dialog.delete-${deleteActionDialog}-title`)}
                </DialogTitle>
                <DialogContent style={{ paddingTop: 20 }}>
                    <Typography>
                        {t(`dialog.delete-${deleteActionDialog}-desc`)}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ borderTop: 1, borderColor: "divider", px: 1, py: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant={"text-black"}
                            onClick={() => {
                                setDeleteDialog(false);
                            }}
                            startIcon={<CloseIcon />}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => deleteActionDialog === "user" ? deleteUser() : deleteProfile()}
                            startIcon={<IconUrl path="setting/icdelete" color="white" />}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog >

            <ActionMenu {...{ contextMenu, handleClose }}>
                {popoverActions.map((v: any, index) => (
                    <MenuItem
                        key={index}
                        className="popover-item"
                        onClick={() => OnMenuActions(v.action)}>
                        {v.icon}
                        <Typography fontSize={15} sx={{ color: "#fff" }}>
                            {t(v.title)}
                        </Typography>
                    </MenuItem>
                ))}
            </ActionMenu>
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
                    onNextPreviStep={handleNextPreviStep}
                    onClose={handleCloseNewUserDialog} />
            </Dialog>

        </>
    );
}


export default Users;
