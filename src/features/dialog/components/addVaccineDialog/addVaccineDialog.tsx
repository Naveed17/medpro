import { Stack, TextField, Typography } from "@mui/material";
import { useFormik, Form, FormikProvider } from "formik";
import { DatePicker } from "@features/datepicker";
import React from "react";

function AddVaccineDialog({ ...props }) {
  const {
    data: { t },
  } = props;
  const formik = useFormik({
    initialValues: {
      name: "",
      number: "",
      date: new Date(),
    },
    onSubmit: async (values) => {},
  });
  const { values, getFieldProps, handleSubmit, setFieldValue } = formik;
  return (
    <FormikProvider value={formik}>
      <Stack
        spacing={5}
        component={Form}
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Typography>{t("name_the_vaccination")}</Typography>
          <TextField
            fullWidth
            placeholder={t("name_the_vaccination")}
            {...getFieldProps("name")}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography>{t("lot_number")}</Typography>
          <TextField
            fullWidth
            placeholder={t("lot_number")}
            {...getFieldProps("number")}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography>{t("date_of_injection")}</Typography>
          <DatePicker
            value={values.date}
            onChange={(newValue: any) => {
              setFieldValue("date", newValue);
            }}
          />
        </Stack>
      </Stack>
    </FormikProvider>
  );
}

export default AddVaccineDialog;
