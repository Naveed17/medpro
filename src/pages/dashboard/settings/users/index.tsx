import React, {ReactElement, useState} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {configSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
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
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {Otable, resetUser} from "@features/table";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {NoDataCard} from "@features/card";
import {useRequest, useRequestMutation} from "@lib/axios";
import {LoadingScreen} from "@features/loadingScreen";
import IconUrl from "@themes/urlIcon";
import {AccessMenage} from "@features/drawer";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useSession} from "next-auth/react";
import {LoadingButton} from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import {useSnackbar} from "notistack";
import {UserMobileCard} from '@features/card';
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";

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
        label: "request",
        align: "center",
        sortable: true,
    },
    {
        id: "admin",
        numeric: false,
        disablePadding: false,
        label: "accessSetting",
        align: "center",
        sortable: true,
    },
    // {
    //     id: "access",
    //     numeric: true,
    //     disablePadding: false,
    //     label: "access",
    //     align: "center",
    //     sortable: true,
    // },
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
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {enqueueSnackbar} = useSnackbar();
    const {t, ready} = useTranslation("settings", {keyPrefix: "users.config"});

    const {data: httpUsersResponse, mutate} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    const users = (httpUsersResponse as HttpResponse)?.data as UserModel[];
    const [deleteDialog, setDeleteDialog] = useState(false);
    const {trigger} = useRequestMutation(null, "/users");
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any>("");
    const {direction} = useAppSelector(configSelector);
    const [open, setOpen] = useState(false);
    const handleChange = (props: any, event: any) => {
        const form = new FormData();
        form.append("attribute", "isActive");
        form.append("value", JSON.stringify(event.target.checked));
        trigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/edit/user/${props.uuid}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`},
        }).then(() => {
            mutate();
            enqueueSnackbar(t("updated"), {variant: "success"});
        })
    };
    const closeDraw = () => {
        setOpen(false);
    }

    const onDelete = (props: any) => {
        setSelected(props);
        setDeleteDialog(true);
    }
    const deleteUser = () => {
        setLoading(true);
        trigger({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/users/${selected.uuid}/${router.locale}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            enqueueSnackbar(t("delete_success"), {variant: 'success'})
            setLoading(false);
            setDeleteDialog(false);
            mutate();
        }).catch(() => {
            setLoading(false);
        });
    }

    if (!ready)
        return (
            <LoadingScreen

                button
                text={"loading-error"}
            />
        );

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                        sx={{
                            display: {xs: "none", md: "flex"},
                        }}
                        onClick={() => setOpen(true)}
                        startIcon={<IconUrl path="ic-setting"/>}
                        variant="contained">
                        {t("access_management")}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={() => {
                            dispatch(resetUser());
                            router.push(`/dashboard/settings/users/new`);
                        }}
                        color="success">
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <Box className="container">
                {users && users.length > 0 ? (
                    <>
                        <DesktopContainer>
                            <Otable
                                headers={headCells}
                                rows={users}
                                from={"users"}
                                {...{t, handleChange}}
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
                <AccessMenage t={t}/>
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
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t("dialog.delete-user-desc")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
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
                            onClick={() => deleteUser()}
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
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
