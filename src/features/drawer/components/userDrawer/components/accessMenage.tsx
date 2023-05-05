import { IconButton } from "@mui/material";
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
import { useRequest } from "@app/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
function AccessMenage({ ...props }) {
  const { direction } = useAppSelector(configSelector);
  const router = useRouter();
  const { t } = props;
  const [info, setInfo] = useState("");
  const [profiles,setProfiles] = useState<any>([])
  const [open, setOpen] = useState(false);
   const { data: session } = useSession();
  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const { data: httpProfilesResponse,mutate } = useRequest({
    method: "GET",
    url: `/api/medical-entity/${medical_entity.uuid}/profile`,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  
   useEffect(() => {
        if (httpProfilesResponse)
            setProfiles((httpProfilesResponse as HttpResponse)?.data)
    }, [httpProfilesResponse])
    
  const [data, setData] = useState([
    {
      id: 1,
      role_name: "xyz",
      permissions: [
        {
          id: 1,
          label: "agenda_management",
          value: false,
          insideList: [
            {
              id: "01",
              label: "add_appointment",
              value: false,
            },
            {
              id: "02",
              label: "add_appointment",
              value: false,
              insideList: [
                {
                  id: "001",
                  label: "add_appointment",
                  value: false,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "agenda_management",
          value: false,
          insideList: [
            {
              id: "01",
              label: "add_appointment",
              value: false,
            },
            {
              id: "02",
              label: "add_appointment",
              value: false,
              insideList: [
                {
                  id: "001",
                  label: "add_appointment",
                  value: false,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          label: "agenda_management",
          value: false,
          insideList: [
            {
              id: "01",
              label: "add_appointment",
              value: false,
            },
            {
              id: "02",
              label: "add_appointment",
              value: false,
              insideList: [
                {
                  id: "001",
                  label: "add_appointment",
                  value: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  const [openVisitorDialog, setVisitorDialog] = useState(false);
  const [selected, setSelected] = useState(null) as any;
  const [values, setValues] = useState(null) as any;
  const onDelete = (props: any) => {
    const filtered = data.filter((item) => item.id !== props.id);
    setData(filtered);
  };
 
  const handleUpdate = () => {
    const newArray = [...data];
    const upd_obj = newArray.findIndex((obj) => obj.id === selected.id);
    newArray[upd_obj].role_name = values.role_name;
    newArray[upd_obj].permissions = values.permissions;
    setData(newArray);
  };
  const handleClose = () =>
    setTimeout(() => {
      setVisitorDialog(false);
      setOpen(false);
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
      {profiles?.length > 0 ? (
      <List>
        {profiles?.map((item: any, i: number) => (
          <ListItem key={item.id}>
            <Typography>{item.name}</Typography>
            <Stack spacing={0.5} ml="auto" direction="row" alignItems="center">
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
              <IconButton
                onClick={() => onDelete(item)}
                size="small"
                disableRipple>
                <IconUrl path="setting/icdelete" />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>
      ):(
        <Stack px={2} alignItems='center' height={1} justifyContent='center'>
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
      )}
      <CustomDialog
        action={info}
        open={open}
        direction={direction}
        data={{ t, selected, setValues,handleMutate:mutate,handleVisitor:setVisitorDialog,handleClose:() =>setOpen(false) }}
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
    </AccessMenageStyled>
  );
}

export default AccessMenage;
