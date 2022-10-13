import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  DialogActions,
  useMediaQuery,
  Theme,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { SubFooter } from "@features/subFooter";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { Otable } from "@features/table";
import { useTranslation } from "next-i18next";
import { Dialog } from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "@app/redux/hooks";
import { tableActionSelector } from "@features/table";
import { PaymentMobileCard } from "@features/card";
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import DialogTitle from "@mui/material/DialogTitle";
import MuiDialog from "@mui/material/Dialog";
import Icon from "@themes/urlIcon";
import { useTheme } from "@mui/material";
import { Label } from "@features/label";
const rows = [
  {
    uuid: 1,
    date: "10/10/2022",
    time: "15:30",
    name: "Ali tounsi",
    insurance: {
      img: "assurance-2",
      name: "CARTE ASSURANCES",
    },
    type: "consultation",
    payment_type: ["ic-argent", "ic-card-pen"],
    billing_status: "yes",
    amount: 200,
  },
  {
    uuid: 2,
    date: "10/10/2022",
    time: "15:30",
    name: "Ali tounsi",
    insurance: {
      img: "assurance-2",
      name: "CARTE ASSURANCES",
    },
    type: "consultation",
    payment_type: ["ic-argent"],
    billing_status: "no",
    amount: -200,
  },
  {
    uuid: 3,
    date: "10/10/2022",
    time: "15:30",
    name: "Ali tounsi",
    insurance: {
      img: "assurance-2",
      name: "CARTE ASSURANCES",
    },
    type: "consultation",
    payment_type: ["ic-argent"],
    billing_status: "yes",
    amount: 0,
  },
  {
    uuid: 4,
    date: "10/10/2022",
    time: "15:30",
    name: "Ali tounsi",
    insurance: {
      img: "assurance-2",
      name: "CARTE ASSURANCES",
    },
    type: "consultation",
    payment_type: ["ic-argent"],
    billing_status: "",
    amount: 100,
  },
  {
    uuid: 5,
    date: "10/10/2022",
    time: "15:30",
    name: "Ali tounsi",
    insurance: {
      img: "assurance-2",
      name: "CARTE ASSURANCES",
    },
    type: "",
    payment_type: ["ic-argent"],
    billing_status: "yes",
    amount: -10,
  },
  {
    uuid: 6,
    date: "10/10/2022",
    time: "15:30",
    name: "Ali tounsi",
    insurance: "",
    type: "check",
    payment_type: ["ic-argent"],
    billing_status: "yes",
    amount: 10,
    collapse: [
      {
        uuid: 61,
        date: "10/10/2022",
        time: "15:30",
        payment_type: [
          {
            name: "credit_card",
            icon: "ic-argent",
          },
        ],
        billing_status: "yes",
        amount: 10,
      },
      {
        uuid: 62,
        date: "10/10/2022",
        time: "15:30",
        payment_type: [
          {
            name: "credit_card",
            icon: "ic-argent",
          },
        ],
        billing_status: "yes",
        amount: 10,
      },
    ],
  },
  {
    uuid: 7,
    date: "10/10/2022",
    time: "15:30",
    name: "",
    insurance: "",
    type: "check",
    payment_type: ["ic-argent"],
    billing_status: "yes",
    amount: 10,
  },
  {
    uuid: 8,
    date: "10/10/2022",
    date2: "10 Avril 2022",
    time: "15:30",
    name: "Asma Anderson",
    insurance: "",
    type: "check",
    payment_type: ["ic-argent"],
    billing_status: "yes",
    amount: 10,
    pending: 600,
    method: {
      name: "credit_card",
      icon: "ic-card",
    },
  },
];
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}
const headCells: readonly HeadCell[] = [
  {
    id: "select-all",
    numeric: false,
    disablePadding: true,
    label: "checkbox",
    sortable: false,
    align: "left",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: true,
    label: "date",
    sortable: true,
    align: "left",
  },
  {
    id: "time",
    numeric: true,
    disablePadding: false,
    label: "time",
    sortable: true,
    align: "left",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "name",
    sortable: true,
    align: "left",
  },
  {
    id: "insurance",
    numeric: true,
    disablePadding: false,
    label: "insurance",
    sortable: true,
    align: "left",
  },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "type",
    sortable: true,
    align: "left",
  },
  {
    id: "payment_type",
    numeric: true,
    disablePadding: false,
    label: "payment_type",
    sortable: true,
    align: "left",
  },
  {
    id: "billing_status",
    numeric: true,
    disablePadding: false,
    label: "billing_status",
    sortable: true,
    align: "left",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "amount",
    sortable: true,
    align: "left",
  },
];
function Payment() {
  const theme = useTheme() as Theme;
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [open, setOpen] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const { t, ready } = useTranslation("payment");
  const [collapseDate, setCollapseData] = useState<any>(null);
  const handleClose = () => setOpen(false);
  const handleCloseCollapse = () => setCollapse(false);
  const handleSave = () => setOpen(false);
  const handleEdit = (props: any) => {
    setSelected(props);
    setOpen(true);
  };
  const handleCollapse = (props: any) => {
    setCollapseData(props);
    setCollapse(true);
  };
  const { addBilling } = useAppSelector(tableActionSelector);
  return (
    <>
      <SubHeader>
        <Stack
          direction="row"
          width={1}
          justifyContent="space-between"
          alignItems="center">
          <Typography>{t("path")}</Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="subtitle2">{t("total")}</Typography>
            <Typography variant="h6">1 140 TND</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">I</Typography>
              <Button
                variant="contained"
                color="error"
                {...(isMobile && {
                  size: "small",
                  sx: { minWidth: 40 },
                })}>
                - {!isMobile && t("btn_header_1")}
              </Button>
              <Button
                variant="contained"
                color="success"
                {...(isMobile && {
                  size: "small",
                  sx: { minWidth: 40 },
                })}
                onClick={() => {
                  setOpen(true);
                  setSelected(null);
                }}>
                + {!isMobile && t("btn_header_2")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </SubHeader>

      <Box className="container">
        <DesktopContainer>
          <Otable
            headers={headCells}
            rows={rows}
            from={"payment"}
            t={t}
            edit={handleEdit}
          />
        </DesktopContainer>
        <MobileContainer>
          <Stack spacing={2}>
            {rows.map((card, idx) => (
              <React.Fragment key={idx}>
                <PaymentMobileCard
                  data={card}
                  t={t}
                  edit={handleEdit}
                  getCollapseData={handleCollapse}
                />
              </React.Fragment>
            ))}
          </Stack>
          <Box pb={6} />
        </MobileContainer>
      </Box>

      <SubFooter>
        <Stack
          spacing={3}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          width={1}>
          <Button variant="text-black">{t("receive")}</Button>
          <Button
            disabled={addBilling ? addBilling.length === 0 : true}
            variant="contained"
            onClick={() => console.log(addBilling)}>
            {t("billing")}
          </Button>
        </Stack>
      </SubFooter>
      <Dialog
        action={"payment_dialog"}
        open={open}
        data={{ t, selected }}
        size={"md"}
        direction={"ltr"}
        title={t("dialog_title")}
        dialogClose={handleClose}
        actionDialog={
          <DialogActions>
            <Button onClick={handleClose} startIcon={<CloseIcon />}>
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<IconUrl path="ic-dowlaodfile" />}>
              {t("save")}
            </Button>
          </DialogActions>
        }
      />
      <MuiDialog
        PaperProps={{
          style: {
            margin: 4,
            width: "100%",
            paddingBottom: 16,
          },
        }}
        onClose={handleCloseCollapse}
        open={collapse}>
        <DialogTitle
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            position: "relative",
          }}>
          Data
          <IconButton
            aria-label="close"
            onClick={handleCloseCollapse}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[0],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <List sx={{ pt: 3 }}>
          {collapseDate?.map((col: any, idx: number) => (
            <ListItem
              key={idx}
              sx={{
                "&:not(:last-child)": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}>
              <Stack
                sx={{
                  ".react-svg svg": {
                    width: (theme) => theme.spacing(1.5),
                    path: {
                      fill: (theme) => theme.palette.text.primary,
                    },
                  },
                }}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width={1}>
                <Stack spacing={0.5} direction="row" alignItems="center">
                  <Icon path="ic-agenda-jour" />
                  <Typography fontWeight={600}>{col.date}</Typography>
                </Stack>
                <Stack spacing={0.5} direction="row" alignItems="center">
                  <Icon path="setting/ic-time" />
                  <Typography fontWeight={600} className="date">
                    {col.time}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing={1}>
                  {col.payment_type.map((type: any, i: number) => (
                    <Stack
                      key={i}
                      direction="row"
                      alignItems="center"
                      spacing={1}>
                      <Icon path={type.icon} />
                      <Typography color="text.primary" variant="body2">
                        {t("table." + type.name)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing={2}>
                  {col.billing_status ? (
                    <Label
                      className="label"
                      variant="ghost"
                      color={
                        col.billing_status === "yes" ? "success" : "error"
                      }>
                      {t("table." + col.billing_status)}
                    </Label>
                  ) : (
                    <Typography>--</Typography>
                  )}
                  <Typography
                    color={
                      (col.amount > 0 && "success.main") ||
                      (col.amount < 0 && "error.main") ||
                      "text.primary"
                    }
                    fontWeight={700}>
                    {col.amount}
                  </Typography>
                </Stack>
              </Stack>
            </ListItem>
          ))}
        </List>
      </MuiDialog>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      fallback: false,
      ...(await serverSideTranslations(context.locale as string, [
        "common",
        "menu",
        "payment",
      ])),
    },
  };
};

Payment.auth = true;

Payment.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default Payment;
