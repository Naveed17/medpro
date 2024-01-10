import {Box, DialogActions, DialogContent, DialogTitle, Theme} from "@mui/material";
import {
    Toolbar,
    Stack,
    Typography,
    Button,
    Dialog
} from "@mui/material";
import React, {useState} from "react";
import IconUrl from "@themes/urlIcon";
import AccessMenageStyled from "./overrides/accessMenageStyle";
import {useAppSelector} from "@lib/redux/hooks";
import {Dialog as CustomDialog} from "@features/dialog";
import {configSelector} from "@features/base";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {LoadingButton} from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import {NoDataCard} from "@features/card";
import {Otable} from "@features/table";
import {DesktopContainer} from "@themes/desktopConainter";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";

function AccessMenage({...props}) {
    const {t} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {direction} = useAppSelector(configSelector);

    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [mainLoading, setMainLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setDeleteDialog] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const TableHead = [
        {
            id: "name",
            label: "name",
            align: "left",
            sortable: true,
        },
        {
            id: "action",
            label: "action",
            align: "right",
            sortable: false,
        },
    ];

    const {data: httpProfilesResponse, mutate: mutateProfiles, isLoading: isProfilesLoading} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");

    const onDelete = (props: any) => {
        setSelected(props);
        setDeleteDialog(true);
    }

    const deleteProfile = () => {
        setLoading(true);
        triggerProfileUpdate({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/profile/${selected}/${router.locale}`
        }, {
            onSuccess: () => {
                setLoading(false);
                setDeleteDialog(false);
                mutateProfiles();
            }
        })
    }

    const handleTableEvent = (props: any) => {
        switch (props?.action) {
            case "DELETE_PROFILE":
                onDelete(props?.row.uuid);
                break;
        }
    }

    const profiles = ((httpProfilesResponse as HttpResponse)?.data ?? []) as ProfileModel[];

    return (
        <AccessMenageStyled spacing={2} height={1}>
            <Toolbar>
                <Stack
                    width={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Typography variant="h6">{t("access_management")}</Typography>
                    <Button
                        onClick={() => {
                            setInfo("add-new-role");
                            setOpen(true);
                            setSelected(null);
                        }}
                        variant="contained"
                        color="success">
                        {t("add_new_role")}
                    </Button>
                </Stack>
            </Toolbar>
            <Box className="container">
                <DesktopContainer>
                    {profiles?.length === 0 && !mainLoading ?
                        <Stack height={1} alignItems="center" justifyContent="center">
                            <NoDataCard
                                {...{t}}
                                ns={"settings"}
                                data={{
                                    mainIcon: "ic-user",
                                    title: "no-data.role.title",
                                    description: "no-data.role.description",
                                }}/>
                        </Stack>
                        :
                        <Otable
                            {...{t}}
                            headers={TableHead}
                            handleEvent={handleTableEvent}
                            rows={profiles}
                            from={"profile"}
                        />}
                </DesktopContainer>
            </Box>

            <CustomDialog
                action={info}
                open={open}
                direction={direction}
                data={{
                    t, selected, handleMutate: mutateProfiles,
                    handleClose: () => {
                        setOpen(false);
                        setSelected(null)
                    }
                }}
                {...(info === "add-new-role" && {
                    title: t("add_a_new_role"),
                    size: "lg",
                    sx: {py: 0},
                    dialogClose: () => setOpen(false),
                })}/>

            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%"
                    }
                }} maxWidth="sm" open={openDeleteDialog}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2
                }}>
                    {t("dialog.delete-profile-title")}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t("dialog.delete-profile-desc")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="text-black"
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
                            onClick={() => deleteProfile()}
                            startIcon={<IconUrl path="ic-trash"/>}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </AccessMenageStyled>
    );
}

export default AccessMenage;
