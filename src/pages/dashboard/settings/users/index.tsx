import React, { ReactElement, useState } from "react";
import { DashLayout, dashLayoutSelector } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { configSelector } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { RootStyled } from "@features/toolbar";
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
    Grid,
    Paper,
    List,
    ListItem,
    IconButton,
    Badge,
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
import { useCashBox, useSendNotification } from "@lib/hooks/rest";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Redirect } from "@features/redirect";
import AddIcon from '@mui/icons-material/Add'
import { TabPanel } from "@features/tabPanel";
import MoreVert from "@mui/icons-material/MoreVert";
import { agendaSelector } from "@features/calendar";

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
    /*{
        id: "status",
        numeric: false,
        disablePadding: false,
        label: "access",
        align: "center",
        sortable: true,
    },*/
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
    const { data: session } = useSession();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { enqueueSnackbar } = useSnackbar();
    const { trigger: triggerNotificationPush } = useSendNotification();
    const dispatch = useAppDispatch();
    const { cashboxes } = useCashBox();
    const { agendas } = useAppSelector(agendaSelector);
    const { t, ready } = useTranslation("settings", { keyPrefix: "users.config" });
    const { direction } = useAppSelector(configSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const [tabvalue, setTabValue] = React.useState(0);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any>("");
    const [open, setOpen] = useState(false);
    const [profileRoles, setProfileRoles] = useState<any[]>([]);
    const { jti, id: currentUser } = session?.user as any;
    const { data: user } = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles;

    const { trigger: triggerUserUpdate } = useRequestQueryMutation("/users/update");
    const { trigger: triggerUserDelete } = useRequestQueryMutation("/users/delete");
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const { data: httpUsersResponse, mutate } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const { data: httpProfilesResponse } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const users = ((httpUsersResponse as HttpResponse)?.data ?? []) as UserModel[];
    const profiles = ((httpProfilesResponse as HttpResponse)?.data ?? []) as ProfileModel[];
    const selectedRole = (props: any) => {
        const data = props?.features?.map((data: any) => ({
            slug: data?.feature?.slug ?? "",
            feature: data[data?.feature?.slug] ?? "",
            hasMultipleInstance: data?.feature?.hasProfile ?? false,
            featureRoles: data?.feature?.hasProfile ? (data?.feature?.slug === "cashbox" ? cashboxes : agendas) : [],
            featureProfiles: [],
            profile: data?.profile ?? ""
        }));
        setProfileRoles(data)
    }
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
    const features: any = {};
    profileRoles.map((role: any) => {
        features[role?.slug] = [{ object: role?.feature?.uuid, featureProfile: role?.profile?.uuid }]
    });

    const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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
        setSelected(props);
        setDeleteDialog(true);
    }

    const deleteUser = () => {
        setLoading(true);
        triggerUserDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/users/${selected.uuid}/${router.locale}`
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

    if (!ready)
        return (
            <LoadingScreen
                button
                text={"loading-error"}
            />
        );

    if (roles.includes('ROLE_SECRETARY')) {
        return <Redirect to='/dashboard/settings' />
    }
    console.log(profileRoles)
    return (
        <>
            <SubHeader>
                <Stack direction="row" alignItems="center" justifyContent="space-between" width={1}>
                    <Tabs value={tabvalue} onChange={handleChangeTabs} aria-label="">
                        <Tab disableRipple label={t("all_users")} {...a11yProps(0)} />
                        <Tab disableRipple label={t("roles_permissons")} {...a11yProps(1)} />
                    </Tabs>
                    {
                        tabvalue === 0 &&
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ minWidth: 45, px: 0 }}
                            onClick={() => {
                                dispatch(resetUser());
                                router.push(`/dashboard/settings/users/new`);
                            }}
                        >
                            <AddIcon />
                        </Button>

                    }

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
                                    {...{ t, currentUser, profiles, handleChange }}
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
                </TabPanel>
                <TabPanel value={tabvalue} index={1} padding={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <Button variant="contained" fullWidth>
                                    <AddIcon />
                                    {t("add_role")}
                                </Button>
                                <Typography my={2} fontWeight={600} variant="subtitle1">
                                    {t("role")}
                                </Typography>
                                <List disablePadding>
                                    {profiles.map((profile) => (
                                        <ListItem
                                            onClick={() => {
                                                setSelectedProfile(profile);
                                                selectedRole(profile)
                                            }}
                                            sx={{
                                                px: 1, borderRadius: 2, cursor: 'pointer', ".MuiListItemSecondaryAction-root": { right: 0 },
                                                ...(selectedProfile?.uuid === profile?.uuid && {
                                                    bgcolor: (theme: Theme) => theme.palette.info.main,
                                                })

                                            }}
                                            secondaryAction={
                                                <IconButton disableRipple size="small" edge="end" aria-label="more">
                                                    <MoreVert sx={{ fontSize: 16, color: (theme: Theme) => theme.palette.text.secondary }} />
                                                </IconButton>
                                            }
                                            key={profile.uuid}>
                                            {profile.name}
                                            <Badge badgeContent={4} color="info" sx={{ position: 'absolute', right: 40 }} />
                                        </ListItem>
                                    ))}

                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={9}></Grid>
                    </Grid>
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
                <AccessMenage {...{ t }} />
            </Drawer>
            <Dialog PaperProps={{
                sx: {
                    width: "100%"
                }
            }} maxWidth="sm" open={deleteDialog}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2,

                }}>
                    {t("dialog.delete-user-title")}
                </DialogTitle>
                <DialogContent style={{ paddingTop: 20 }}>
                    <Typography>
                        {t("dialog.delete-user-desc")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ borderTop: 1, borderColor: "divider", px: 1, py: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <Button
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
                            onClick={() => deleteUser()}
                            startIcon={<IconUrl path="setting/icdelete" color="white" />}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
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
