import React, { ReactElement, useState } from "react";
import { DashLayout, configSelector } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import { DesktopContainer } from "@themes/desktopConainter";
import { Otable } from "@features/table";
import { SubHeader } from "@features/subHeader";
import { DefaultCountry } from "@lib/constants";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@lib/redux/hooks";
import AddIcon from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
import { InventoryDrawer } from "@features/drawer";
import { InventoryMobileCard, NoDataCard } from "@features/card";
import { MobileContainer } from "@themes/mobileContainer";
const data = [
  {
    uuid: "1",
    name: "Product-1",
    qte: 10,
    before_amount: 100,
    after_amount: 100,
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
    id: "select",
    numeric: false,
    disablePadding: true,
    label: "#",
    sortable: false,
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "name",
    sortable: true,
    align: "center",
  },
  {
    id: "qte",
    numeric: true,
    disablePadding: true,
    label: "quality",
    sortable: true,
    align: "center",
  },
  {
    id: "before_amount",
    numeric: true,
    disablePadding: false,
    label: "before_amount",
    sortable: true,
    align: "center",
  },
  {
    id: "after_amount",
    numeric: true,
    disablePadding: false,
    label: "after_amount",
    sortable: true,
    align: "center",
  },
  {
    id: "total",
    numeric: true,
    disablePadding: false,
    label: "total",
    sortable: false,
    align: "center",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "actions",
    sortable: false,
    align: "center",
  },
];
function Inventory() {
  const [openViewDrawer, setOpenViewDrawer] = useState<boolean>(false);
  const [selectedRow, setSelected] = useState<any>("");
  const [open, setOpen] = useState<boolean>(false);
  const [rows, setRows] = useState<any[]>(data);
  const { direction } = useAppSelector(configSelector);
  const { t } = useTranslation("inventory");
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    ?.medical_entity as MedicalEntityModel;
  const doctor_country = medical_entity.country
    ? medical_entity.country
    : DefaultCountry;
  const devise = doctor_country.currency?.name;
  const editProduct = (row: any, from: any) => {
    if (from === "edit") {
      setOpenViewDrawer(true);
      setSelected(row);
    }
    if (from === "change") {
      const updated = rows.map((item: any) => {
        if (item.uuid === row.uuid) {
          item = row;
        }
        return item;
      });
      setRows(updated);
    }
    if (from === "delete") {
      setOpen(true);
      setSelected(row);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelected("");
  };
  const handleDelete = () => {
    setRows(rows.filter((item: any) => item.uuid !== selectedRow.uuid));
    setOpen(false);
    setSelected("");
  };
  console.log(rows);
  return (
    <>
      <SubHeader>
        <Stack
          width={1}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{t("title")}</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="success"
            onClick={() => {
              setOpenViewDrawer(true);
              setSelected("");
            }}
          >
            {t("add")}
          </Button>
        </Stack>
      </SubHeader>
      <Stack className="container">
        {rows.length > 0 ? (
          <>
            <DesktopContainer>
              <Otable
                headers={headCells}
                rows={rows}
                from={"inventory"}
                t={t}
                edit={editProduct}
                devise={devise}
              />
            </DesktopContainer>
            <MobileContainer>
              <Stack spacing={1}>
                {rows.map((item: any, index: number) => (
                  <React.Fragment key={index}>
                    <InventoryMobileCard
                      {...{
                        t,
                        data: item,
                        edit: editProduct,
                        devise,
                      }}
                    />
                  </React.Fragment>
                ))}
              </Stack>
            </MobileContainer>
          </>
        ) : (
          <NoDataCard
            t={t}
            ns={"inventory"}
            data={{
              mainIcon: "ic-agenda-+",
              title: "no-data.title",
              description: "no-data.description",
            }}
          />
        )}
      </Stack>
      <Drawer
        anchor={"right"}
        open={openViewDrawer}
        dir={direction}
        onClose={() => {
          setOpenViewDrawer(false);
          setSelected("");
        }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "30rem",
          },
        }}
      >
        <InventoryDrawer
          {...{
            t,
            handleClose: () => setOpenViewDrawer(false),
            setSelected,
            data: selectedRow,
            devise,
            setRows,
            edit: editProduct,
          }}
        />
      </Drawer>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        PaperProps={{
          sx: {
            width: "100%",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            bgcolor: (theme: Theme) => theme.palette.error.main,
            mb: 3,
          }}
        >
          {t("dialog.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("dialog.description")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text-black"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            {t("dialog.cancel")}
          </Button>
          <Button
            startIcon={<IconUrl path="setting/icdelete" color="white" />}
            variant="contained"
            color="error"
            onClick={handleDelete}
            autoFocus
          >
            {t("dialog.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    fallback: false,
    ...(await serverSideTranslations(locale as string, [
      "common",
      "menu",
      "inventory",
    ])),
  },
});

Inventory.auth = true;

Inventory.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default Inventory;
