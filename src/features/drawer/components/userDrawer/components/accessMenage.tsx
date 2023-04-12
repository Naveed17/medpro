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
import React, { useState, useEffect } from "react";
import IconClose from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import AccessMenageStyled from "./overrides/accessMenageStyle";
import { useAppSelector } from "@app/redux/hooks";
import { Dialog as CustomDialog } from "@features/dialog";
import { configSelector } from "@features/base";
import { AddVisitorDialog } from "@features/dialog";
function AccessMenage({ ...props }) {
  const { direction } = useAppSelector(configSelector);
  const { t } = props;
  const [info, setInfo] = useState("");
  const [open, setOpen] = useState(false);
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
  const handleNewRole = () => {
    setData([...data, values]);
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
  console.log(data);
  return (
    <AccessMenageStyled spacing={2}>
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
        {data?.map((item: any, i: number) => (
          <ListItem key={item.id}>
            <Typography>{item.role_name}</Typography>
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
      <CustomDialog
        action={info}
        open={open}
        direction={direction}
        data={{ t, selected, setValues }}
        {...(info === "add-new-role" && {
          title: t("add_a_new_role"),
          size: "md",
          dialogClose: () => setOpen(false),
          actionDialog: (
            <Stack
              width={1}
              direction="row"
              spacing={2}
              justifyContent="flex-end">
              <Button
                onClick={() => setOpen(false)}
                variant="text-black"
                startIcon={<IconClose />}>
                {t("cancel")}
              </Button>
              <Button
                onClick={() => {
                  if (selected) {
                    handleUpdate();
                  } else {
                    handleNewRole();
                  }
                  setVisitorDialog(true);
                }}
                variant="contained"
                startIcon={<IconUrl path="ic-dowlaodfile" />}>
                {t("save")}
              </Button>
            </Stack>
          ),
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
