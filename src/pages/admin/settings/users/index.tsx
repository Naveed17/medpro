import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState, } from "react";
import { AdminLayout, DashLayout, dashLayoutSelector, } from "@features/base";
import {

    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Theme, Typography,

} from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { SubHeader } from "@features/subHeader";
import { LoadingScreen } from "@features/loadingScreen";
import AddIcon from '@mui/icons-material/Add';
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import { NoDataCard, UserMobileCard } from "@features/card";
import { Otable } from "@features/table";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSendNotification } from "@lib/hooks/rest";
import { useSnackbar } from "notistack";
import { useAppSelector } from "@lib/redux/hooks";
import { LoadingButton } from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
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
function Users() {

    const { t, ready } = useTranslation("settings", { keyPrefix: "users.config" });
    const router = useRouter();
    const { data: session } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const [loading, setLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>("");
    const [deleteActionDialog, setDeleteActionDialog] = useState("user");
    const { jti, id: currentUser } = session?.user as any;
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { trigger: triggerUserUpdate } = useRequestQueryMutation("/users/update");
    const { trigger: triggerUserDelete } = useRequestQueryMutation("/users/delete");
    const { trigger: triggerNotificationPush } = useSendNotification();
    const { data: httpUsersResponse, mutate } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const { data: httpProfilesResponse, mutate: mutateProfiles } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const users = ((httpUsersResponse as HttpResponse)?.data ?? []) as UserModel[];
    const profiles = ((httpProfilesResponse as HttpResponse)?.data ?? []) as ProfileModel[];
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
    if (!ready) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t("users")}
                    </Typography>
                    <Button startIcon={<AddIcon />} variant="contained" color="primary" sx={{ ml: "auto" }}>
                        {t("add_user")}
                    </Button>
                </RootStyled>
            </SubHeader>
            <Box className="container">
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
            </Box>
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
                            onClick={() => deleteActionDialog === "user" && deleteUser()}
                            startIcon={<IconUrl path="setting/icdelete" color="white" />}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    )
        ;
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});
export default Users;

Users.auth = true;

Users.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
