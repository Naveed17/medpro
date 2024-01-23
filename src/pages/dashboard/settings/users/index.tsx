import React, {ReactElement, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {configSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
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
    Tabs,
    Tab,
    MenuItem,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {Otable, resetUser} from "@features/table";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {NoDataCard} from "@features/card";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {LoadingScreen} from "@features/loadingScreen";
import IconUrl from "@themes/urlIcon";
import {AccessMenage} from "@features/drawer";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {LoadingButton} from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import {useSnackbar} from "notistack";
import {UserMobileCard} from '@features/card';
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {useSendNotification} from "@lib/hooks/rest";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {Redirect} from "@features/redirect";
import {TabPanel, UsersTabs} from "@features/tabPanel";
import {ActionMenu} from "@features/menu";
import {CustomIconButton} from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";

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
        id: "role",
        numeric: false,
        disablePadding: false,
        label: "role",
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

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Users() {
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {enqueueSnackbar} = useSnackbar();
    const {trigger: triggerNotificationPush} = useSendNotification();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("settings", {keyPrefix: "users.config"});
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [tabvalue, setTabValue] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteActionDialog, setDeleteActionDialog] = useState("user");
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>("");
    const [selectedProfile, setSelectedProfile] = useState<any>("");
    const [open, setOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const {jti, id: currentUser} = session?.user as any;
    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles;

    const {trigger: triggerUserUpdate} = useRequestQueryMutation("/users/update");
    const {trigger: triggerUserDelete} = useRequestQueryMutation("/users/delete");
    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");

    const {data: httpUsersResponse, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const {data: httpProfilesResponse, mutate: mutateProfiles} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const users = ((httpUsersResponse as HttpResponse)?.data ?? []) as UserModel[];
    const profiles = ((httpProfilesResponse as HttpResponse)?.data ?? []) as ProfileModel[];
    const popoverActions = [{
        icon: <IconUrl path="ic-trash" color="white"/>,
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
                enqueueSnackbar(t("updated"), {variant: "success"});
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

    const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }

    const handleContextMenu = (event: MouseEvent, profile: any) => {
        event.preventDefault();
        setSelectedProfile(profile);
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                } : null,
        );
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
                enqueueSnackbar(t("delete_success"), {variant: 'success'})
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
                mutateProfiles();
            }
        })
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    if (roles.includes('ROLE_SECRETARY')) {
        return <Redirect to='/dashboard/settings'/>
    }

    return (
        <>
            <SubHeader sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Stack direction="row" alignItems="center" mt={2} justifyContent="space-between" width={1}>
                    <Tabs value={tabvalue} onChange={handleChangeTabs} aria-label="">
                        <Tab disableRipple label={t("all_users")} {...a11yProps(0)} />
                        <Tab disableRipple label={t("roles_permissons")} {...a11yProps(1)} />
                    </Tabs>
                    {tabvalue === 0 && <CustomIconButton
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            dispatch(resetUser());
                            router.push(`/dashboard/settings/users/new`);
                        }}
                        variant="filled"
                        sx={{p: .8}}
                        color={"primary"}
                        size={"small"}>
                        <AgendaAddViewIcon/>
                    </CustomIconButton>}
                </Stack>
            </SubHeader>
            <Box className="container">
                <TabPanel value={tabvalue} index={0} padding={0}>
                    {users && users.length > 0 ? (
                        <>
                            <DesktopContainer>
                                <Otable
                                    headers={headCells}
                                    rows={users}
                                    from={"users"}
                                    {...{t, currentUser, profiles, handleChange}}
                                    edit={onDelete}
                                />
                            </DesktopContainer>
                            <MobileContainer>
                                <Stack spacing={1}>
                                    {users.map((user) => (
                                        <React.Fragment key={user.uuid}>
                                            <UserMobileCard data={user} t={t}/>
                                        </React.Fragment>
                                    ))}
                                </Stack>
                            </MobileContainer>
                        </>
                    ) : (
                        <NoDataCard t={t} ns={"settings"} data={CardData}/>
                    )}
                </TabPanel>
                <TabPanel value={tabvalue} index={1} padding={0}>
                    <UsersTabs {...{profiles, t, handleContextMenu}} />
                </TabPanel>
            </Box>
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
                <AccessMenage {...{t}} />
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
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.error.main,
                        px: 1,
                        py: 2,

                    }}>
                    {t(`dialog.delete-${deleteActionDialog}-title`)}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t(`dialog.delete-${deleteActionDialog}-desc`)}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant={"text-black"}
                            onClick={() => {
                                setDeleteDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => deleteActionDialog === "user" ? deleteUser() : deleteProfile()}
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>

            <ActionMenu {...{contextMenu, handleClose}}>
                {popoverActions.map((v: any, index) => (
                    <MenuItem
                        key={index}
                        className="popover-item"
                        onClick={() => OnMenuActions(v.action)}>
                        {v.icon}
                        <Typography fontSize={15} sx={{color: "#fff"}}>
                            {t(v.title)}
                        </Typography>
                    </MenuItem>
                ))}
            </ActionMenu>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});

export default Users;

Users.auth = true;

Users.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
