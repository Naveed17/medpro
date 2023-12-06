import {DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Theme} from "@mui/material";
import {
    Toolbar,
    Stack,
    Typography,
    Button,
    List,
    ListItem,
    Dialog,
} from "@mui/material";
import React, {useState, useEffect} from "react";
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

const CardData = {
    mainIcon: "ic-user",
    title: "no-data.role.title",
    description: "no-data.role.description",
};

function AccessMenage({...props}) {
    const {t} = props;
    const {data: session} = useSession();

    const {direction} = useAppSelector(configSelector);

    const [info, setInfo] = useState("");
    const [profiles, setProfiles] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [mainLoading, setMainLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setDeleteDialog] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerProfileUpdate} = useRequestQueryMutation("/profile/update");
    const {data: httpProfilesResponse, mutate,} = useRequestQuery({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/profile`
    });

    useEffect(() => {
        setMainLoading(true)
        new Promise((resolve) => {
            if (httpProfilesResponse) {
                resolve(
                    setProfiles((httpProfilesResponse as HttpResponse)?.data)
                )
            }
        }).finally(() => setMainLoading(false))
    }, [httpProfilesResponse])

    const onDelete = (props: any) => {
        setSelected(props);
        setDeleteDialog(true);
    }

    const deleteProfile = () => {
        setLoading(true);
        triggerProfileUpdate({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/profile/${selected.uuid}`
        }, {
            onSuccess: () => {
                setLoading(false);
                setDeleteDialog(false);
                mutate();
            }
        })
    }

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
            {profiles?.length === 0 && !mainLoading ?
                <Stack height={1} alignItems="center" justifyContent="center">
                    <NoDataCard t={t} ns={"settings"} data={CardData}/>
                </Stack>
                :
                <List>
                    {(mainLoading ? Array.from({length: 5}) : profiles)?.map((item: any, i: number) => (
                        <ListItem key={item ? item.uuid : i}>
                            {
                                !item ? <Skeleton width={100}/> : <Typography>{item.name}</Typography>
                            }
                            <Stack spacing={0.5} ml="auto" direction="row" alignItems="center">
                                {
                                    !item ? <Skeleton width={25} height={40}/> : (
                                        <IconButton
                                            onClick={() => {
                                                setSelected(item);
                                                setInfo("add-new-role");
                                                setOpen(true);
                                            }}
                                            size="small"
                                            disableRipple>
                                            <IconUrl path="setting/edit"/>
                                        </IconButton>
                                    )}

                                {
                                    !item ? <Skeleton width={25} height={40}/> :
                                        (<IconButton
                                                onClick={() => onDelete(item)}
                                                size="small"
                                                disableRipple>
                                                <IconUrl path="setting/icdelete"/>
                                            </IconButton>
                                        )
                                }
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            }
            <CustomDialog
                action={info}
                open={open}
                direction={direction}
                data={{
                    t, selected, handleMutate: mutate,
                    handleClose: () => {
                        setOpen(false);
                        setSelected(null)
                    }
                }}
                {...(info === "add-new-role" && {
                    title: t("add_a_new_role"),
                    size: "md",
                    sx: {py: 0},
                    dialogClose: () => setOpen(false),
                })}

            />
            <Dialog PaperProps={{
                sx: {
                    width: "100%"
                }
            }} maxWidth="sm" open={openDeleteDialog}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2,

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
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </AccessMenageStyled>
    );
}

export default AccessMenage;
