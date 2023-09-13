import React, { useEffect } from "react";
import AutoCompleteMulti from "./autoCompleteMulti";
import {
  Stack,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { FormikProvider, useFormik, Form } from "formik";
import * as data from "./data";
function ProductFilter({ ...props }) {
  const { t, OnSearch } = props;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      brand: [],
      categories: [],
      stock: [],
      isHidden: false,
      isForAppointment: false,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { getFieldProps, setFieldValue, values } = formik;
  useEffect(() => {
    OnSearch({
      ...values,
      brand: values.brand.map((item: any) => item.name),
      categories: values.categories.map((item: any) => item.name),
      stock: values.stock.map((item: any) => item.name),
    });
  }, [values]);
  return (
    <FormikProvider value={formik}>
      <Stack spacing={1} component={Form} noValidate>
        <Stack spacing={0.5}>
          <Typography>{t("name")}</Typography>
          <TextField
            placeholder={t("placeholder_name")}
            {...getFieldProps("name")}
          />
        </Stack>
        <Stack spacing={0.5}>
          <Typography>{t("brand")}</Typography>
          <AutoCompleteMulti
            t={t}
            placeholder={t("placeholder_brand")}
            data={data.BrandsName}
            onChange={(value: any) => {
              setFieldValue("brand", value);
            }}
            value={values.brand}
          />
        </Stack>
        <Stack spacing={0.5}>
          <Typography>{t("category")}</Typography>
          <AutoCompleteMulti
            t={t}
            placeholder={t("placeholder_category")}
            data={data.CategoriesName}
            onChange={(value: any) => {
              setFieldValue("categories", value);
            }}
            value={values.categories}
          />
        </Stack>
        <Stack spacing={0.5}>
          <Typography>{t("stock")}</Typography>
          <AutoCompleteMulti
            t={t}
            placeholder={t("placeholder_stock")}
            data={data.ProductsName}
            onChange={(value: any) => {
              setFieldValue("stock", value);
            }}
            value={values.stock}
          />
        </Stack>
        <FormControlLabel
          control={<Checkbox {...getFieldProps("isHidden")} />}
          label={t("is_hidden")}
        />
        <FormControlLabel
          control={<Checkbox {...getFieldProps("isForAppointment")} />}
          label={t("is_for_appointment")}
        />
      </Stack>
    </FormikProvider>
  );
}

export default ProductFilter;
