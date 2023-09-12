import React from "react";
import DrawerStyled from "./overrides/drawerStyle";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import SaveIcon from "@mui/icons-material/Save";
function InventoryDrawer({ ...props }) {
  const { t, handleClose, devise, setSelected, data, edit, setRows } = props;
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    qte: Yup.number().required(),
    before_amount: Yup.number().required(),
    after_amount: Yup.number().required(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data ? data.name : "",
      qte: data ? data.qte : 1,
      before_amount: data ? data.before_amount : "",
      after_amount: data ? data.after_amount : "",
    },
    onSubmit: async (values) => {
      if (data) {
        edit(
          {
            ...data,
            ...values,
          },
          "change"
        );
      } else {
        setRows((prev: any) => [
          ...prev,
          {
            uuid: `${Math.floor(Math.random())}`,
            ...values,
          },
        ]);
      }
      handleClose();
    },
    validationSchema,
  });

  const { values, handleSubmit, touched, errors, getFieldProps } = formik;
  return (
    <DrawerStyled>
      <Box className="drawer-header">
        <Typography variant="h6">
          {t("table.total")}: {values.qte * values.after_amount} {devise}
        </Typography>
        <IconButton
          onClick={() => {
            handleClose();
            setSelected("");
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <FormikProvider value={formik}>
        <Stack component={Form} onSubmit={handleSubmit} padding={2} width={1}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    component="label"
                  >
                    {t("table.name")}
                  </Typography>
                  <TextField
                    placeholder={t("table.name")}
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    component="label"
                  >
                    {t("table.quality")}
                  </Typography>
                  <TextField
                    type="number"
                    placeholder={t("table.quality")}
                    {...getFieldProps("qte")}
                    error={Boolean(touched.qte && errors.qte)}
                  />
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  spacing={1}
                >
                  <Stack spacing={0.5} width={1}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      component="label"
                    >
                      {t("table.before_amount")} ({devise})
                    </Typography>
                    <TextField
                      type="number"
                      placeholder={t("table.before_amount")}
                      {...getFieldProps("before_amount")}
                      error={Boolean(
                        touched.before_amount && errors.before_amount
                      )}
                    />
                  </Stack>
                  <Stack spacing={0.5} width={1}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      component="label"
                    >
                      {t("table.after_amount")} ({devise})
                    </Typography>
                    <TextField
                      type="number"
                      placeholder={t("table.after_amount")}
                      {...getFieldProps("after_amount")}
                      error={Boolean(
                        touched.after_amount && errors.after_amount
                      )}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Stack
            bgcolor="common.white"
            padding={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{
              position: "fixed",
              bottom: 0,
              maxWidth: "30rem",
              width: "100%",
              right: 0,
            }}
          >
            <Stack spacing={1} direction="row" alignItems="center">
              <Button
                onClick={() => {
                  handleClose();
                  setSelected("");
                }}
                startIcon={<CloseIcon />}
                variant="text-black"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                {t("save")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </FormikProvider>
    </DrawerStyled>
  );
}

export default InventoryDrawer;
