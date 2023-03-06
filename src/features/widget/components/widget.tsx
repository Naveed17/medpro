import React, { memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ModelDot } from "@features/modelDot";
import ConsultationModalStyled from "./overrides/modalConsultationStyle";
import IconUrl from "@themes/urlIcon";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
const Form: any = dynamic(
    () => import("@formio/react").then((mod: any) => mod.Form),
    {
      ssr: false,
    }
);

const variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
  },
};

const WidgetForm: any = memo(({ src, ...props }: any) => {
  let cmp: any[] = [];
  const { modal, appuuid, data, changes, setChanges } = props;
  if (modal) {
    cmp = [...modal];
  }

  /* Previous data
    cmp.map(spec => {
         spec.components.map(composant =>{
             const old = composant.description? composant.description :''
             composant.description = `${old} (90${old})`
         })
     })
     console.log(cmp)*/

  return (
      <>
        <Form
            onChange={(ev: any) => {
              localStorage.setItem("Modeldata" + appuuid, JSON.stringify(ev.data));
              const item = changes.find(
                  (change: { name: string }) => change.name === "patientInfo"
              );
              item.checked =
                  Object.values(ev.data).filter((val) => val !== "").length > 0;
              setChanges([...changes]);
            }}
            // @ts-ignore
            submission={{
              data: localStorage.getItem(`Modeldata${appuuid}`)
                  ? JSON.parse(localStorage.getItem(`Modeldata${appuuid}`) as string)
                  : data,
            }}
            form={{
              display: "form",
              components: cmp,
            }}
        />
      </>
  );
});
WidgetForm.displayName = "widget-form";

function Widget({ ...props }) {
  const {
    modal,
    setModal,
    data,
    models,
    appuuid,
    changes,
    setChanges,
    handleClosePanel,
  } = props;
  const [open, setOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [change, setChange] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [closePanel, setClosePanel] = useState<boolean>(false);
  const [defaultModal, setDefaultModal] = useState<ModalModel>({
    color: "#FEBD15",
    hasData: false,
    isEnabled: true,
    label: "--",
    structure: [],
    uuid: "",
  });

  useEffect(() => {
    if (modal) {
      setDefaultModal(modal.default_modal);
    }
  }, [modal]);

  const handleClickAway = () => {
    setOpen(!open);
  };

  const handleClick = (prop: ModalModel) => {
    modal.default_modal = prop;
    setModal(modal);
    setDefaultModal(prop);
    localStorage.setItem(
        `Model-${appuuid}`,
        JSON.stringify({
          data: {},
          default_modal: prop,
        })
    );
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setChange(false);
  };

  const handleChange = () => {
    setChange(true);
  };

  return (
      <>
        <ConsultationModalStyled
            sx={{
              height: { xs: "30vh", md: "44.5rem" },
              position: "relative",
              width: closePanel ? 50 : "auto",
            }}>
          <Stack
              spacing={1}
              p={2}
              py={1}
              direction="row"
              alignItems="center"
              className="card-header"
              sx={{
                position: closePanel ? "absolute" : "static",
                transform: closePanel ? "rotate(90deg)" : "rotate(0)",
                transformOrigin: "left",
                width: closePanel ? "44.5rem" : "auto",
                left: 23,
                top: -26,
              }}
              bgcolor={alpha(defaultModal?.color, 0.3)}>
            <IconButton
                sx={{ display: { xs: "none", md: "flex" } }}
                onClick={() => {
                  setClosePanel(!closePanel);
                  handleClosePanel(!closePanel);
                }}
                className="btn-collapse"
                disableRipple>
              <ArrowBackIosIcon />
            </IconButton>
            <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                width={1}
                onClick={() => {
                  handleClickAway();
                }}
                sx={{ cursor: "pointer" }}>
              <ModelDot color={defaultModal?.color} selected={false} />
              <Typography fontWeight={600}>
                Données de suivi : {defaultModal?.label}
              </Typography>
              {!closePanel && <IconUrl path="ic-flesh-bas-y" />}
            </Stack>
          </Stack>

          <CardContent
              sx={{
                bgcolor: alpha(defaultModal?.color, 0.1),
                overflowX: "scroll",
                display: closePanel ? "none" : "block",
              }}>
            <motion.div
                hidden={!open}
                variants={variants}
                initial="initial"
                animate={open ? "animate" : "initial"}
                exit="initial">
              <Paper className="menu-list">
                <MenuList>
                  {models?.map((item: any, idx: number) => (
                      <Box key={"widgt-x-" + idx}>
                        {item.isEnabled && (
                            <MenuItem
                                key={`model-item-${idx}`}
                                onClick={() => handleClick(item)}>
                              <ListItemIcon>
                                <ModelDot
                                    color={item.color}
                                    selected={false}
                                    size={21}
                                    sizedot={13}
                                    padding={3}
                                />
                              </ListItemIcon>
                              <ListItemText
                                  style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                  }}>
                                {item.label}
                              </ListItemText>
                            </MenuItem>
                        )}
                      </Box>
                  ))}
                </MenuList>
              </Paper>
            </motion.div>
            <Box>
              {models?.map(
                  (m: any) =>
                      m.uuid === modal.default_modal.uuid && (
                          <WidgetForm
                              {...{ appuuid, changes, setChanges, data }}
                              key={m.uuid}
                              modal={m.structure}></WidgetForm>
                      )
              )}
              {pageLoading &&
                  Array.from({ length: 3 }).map((_, idx) => (
                      <Box key={`loading-box-${idx}`}>
                        <Typography alignSelf="center" marginBottom={2} marginTop={2}>
                          <Skeleton width={130} variant="text" />
                        </Typography>
                        <Card className="loading-card">
                          <Stack spacing={2}>
                            <List style={{ marginTop: 25 }}>
                              {Array.from({ length: 4 }).map((_, idx) => (
                                  <ListItem
                                      key={`skeleton-item-${idx}`}
                                      sx={{ py: 0.5 }}>
                                    <Skeleton width={"40%"} variant="text" />
                                    <Skeleton
                                        sx={{ ml: 1 }}
                                        width={"50%"}
                                        variant="text"
                                    />
                                  </ListItem>
                              ))}
                            </List>
                          </Stack>
                        </Card>
                      </Box>
                  ))}
            </Box>
          </CardContent>
        </ConsultationModalStyled>
        {/* <Dialog action={'consultation-modal'}
                    open={openDialog}
                    data={{data: modalConfig, change}}
                    change={change}
                    max
                    size={"lg"}
                    direction={'ltr'}
                    title={'Personaliser les données de suivi'}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                    startIcon={<CloseIcon/>}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                    {...(!change ? {onClick: handleChange} : {onClick: handleCloseDialog})}
                                    startIcon={<IconUrl
                                        path='ic-dowlaodfile'></IconUrl>}>
                                {change ? t('save') : t('apply')}
                            </Button>
                        </DialogActions>
                    }/>*/}
      </>
  );
}

export default React.memo(Widget);
