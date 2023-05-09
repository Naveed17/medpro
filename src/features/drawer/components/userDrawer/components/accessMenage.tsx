import { DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Theme } from "@mui/material";
import {
  Toolbar,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  Dialog,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import IconUrl from "@themes/urlIcon";
import AccessMenageStyled from "./overrides/accessMenageStyle";
import { useAppSelector } from "@app/redux/hooks";
import { Dialog as CustomDialog } from "@features/dialog";
import { configSelector } from "@features/base";
import { AddVisitorDialog } from "@features/dialog";
import { useRequest,useRequestMutation } from "@app/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
function AccessMenage({ ...props }) {
  const { direction } = useAppSelector(configSelector);
  const router = useRouter();
  const { t } = props;
  const [info, setInfo] = useState("");
  const [profiles,setProfiles] = useState<any>([]);
  const [loading,setLoading] =useState(false);
  const [mainLoading,setMainLoading] =useState(false);
  const [open, setOpen] = useState(false);
   const { data: session } = useSession();
  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const { data: httpProfilesResponse,mutate, } = useRequest({
    method: "GET",
    url: `/api/medical-entity/${medical_entity.uuid}/profile`,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  
   useEffect(() => {
    setMainLoading(true)
    new Promise(function (resolve, reject) {
   if (httpProfilesResponse){
    resolve(
      setProfiles((httpProfilesResponse as HttpResponse)?.data)
     )
    }
    }).finally(() => setMainLoading(false))
    }, [httpProfilesResponse])
    
  const [openVisitorDialog, setVisitorDialog] = useState(false);
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  
  const [selected, setSelected] = useState<any>(null);
  const {trigger} = useRequestMutation(null, "/profile");
  const onDelete = (props: any) => {
    setSelected(props);
    setDeleteDialog(true);
  };
  const deleteProfile = ()=>{
    setLoading(true);
    trigger({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/profile/${selected.uuid}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
          setLoading(false);
          setDeleteDialog(false);
          mutate();
        })
  }
       
  const handleClose = () =>
    setTimeout(() => {
      setVisitorDialog(false);
      setOpen(false);
      setSelected(null);
    }, 2000);
  useEffect(() => {
    handleClose();
  }, [openVisitorDialog]);
  
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
      <List>
        {(mainLoading ? Array.from({length:5}): profiles)?.map((item: any, i: number) => (
          <ListItem key={item ? item.uuid:i}>
            {
              !item ? <Skeleton width={100} />: <Typography>{item.name}</Typography>
            }
            <Stack spacing={0.5} ml="auto" direction="row" alignItems="center">
              {
                !item ? <Skeleton width={25} height={40} />:  (
                <IconButton
                onClick={() => {
                  setSelected(item);
                  setInfo("add-new-role");
                  setOpen(true);
                }}
                size="small"
                disableRipple>
                <IconUrl path="setting/edit" />
              </IconButton>
              )}
              
             {
              !item ? <Skeleton width={25} height={40} />:  
              (<IconButton
                onClick={() => onDelete(item)}
                size="small"
                disableRipple>
                <IconUrl path="setting/icdelete" />
              </IconButton>
              )
              }
            </Stack>
          </ListItem>
        ))}
      </List>
      <CustomDialog
        action={info}
        open={open}
        direction={direction}
        data={{ t, selected,handleMutate:mutate,
          handleVisitor:setVisitorDialog,
          handleClose:() =>{setOpen(false) ;setSelected(null)}}}
        {...(info === "add-new-role" && {
          title: t("add_a_new_role"),
          size: "md",
          sx:{py:0},
          dialogClose: () => setOpen(false),
        })}
        {...(info === "add-visitor" && {
          size: "xs",
          dialogClose: () => setOpen(false),
        })}
      />
      <Dialog maxWidth="xs" open={openVisitorDialog}>
        <AddVisitorDialog t={t} />
      </Dialog>
        <Dialog PaperProps={{sx:{
        width: "100%"
      }}} maxWidth="sm" open={openDeleteDialog}>
        <DialogTitle sx={{
          bgcolor: (theme:Theme) => theme.palette.error.main,
          px:1,
          py:2,

        }}>
         {t("dialog.delete-profile-title")}
        </DialogTitle>
        <DialogContent style={{paddingTop:20}}>
          <Typography>
          {t("dialog.delete-profile-desc")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{borderTop:1,borderColor:"divider",px:1 ,py:2}}>
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
              onClick={() => deleteProfile()}
              startIcon={<IconUrl path="setting/icdelete" color="white" />}>
              {t("dialog.delete")}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </AccessMenageStyled>
  );
}

export default AccessMenage;
