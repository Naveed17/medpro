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
import {
  setFilter,
  leftActionBarSelector,
  setFilterData,
} from "@features/leftActionBar";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";

function ProductFilter({ ...props }) {
  const { t, OnSearch } = props;
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector(leftActionBarSelector);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (filter as any)?.name || "",
      brand: (filter as any)?.brand || [],
      categories: (filter as any)?.categories || [],
      stock: (filter as any)?.stock || [],
      isHidden: (filter as any)?.isHidden || false,
      isForAppointment: (filter as any)?.isForAppointment || false,
    },

    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { setFieldValue, values } = formik;
  useEffect(() => {
    const data = {
      ...values,
      brand: values.brand.map((item: any) => item?.name),
      categories: values.categories.map((item: any) => item?.name),
      stock: values.stock.map((item: any) => item?.name),
    };
    OnSearch(data);
  }, [values]);
  return (
    <FormikProvider value={formik}>
      <Stack spacing={1} component={Form} noValidate>
        <Stack spacing={0.5}>
          <Typography>{t("name")}</Typography>
          <TextField
            placeholder={t("placeholder_name")}
            value={values.name}
            onChange={(e) => {
              setFieldValue("name", e.target.value);
              dispatch(
                setFilterData({
                  ...filter,
                  name: e.target.value,
                })
              );
            }}
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
              dispatch(
                setFilterData({
                  ...filter,
                  brand: value,
                })
              );
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
              dispatch(
                setFilterData({
                  ...filter,
                  categories: value,
                })
              );
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
              dispatch(
                setFilterData({
                  ...filter,
                  stock: value,
                })
              );
            }}
            value={values.stock}
          />
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.isHidden}
              onChange={(e) => {
                setFieldValue("isHidden", e.target.checked);
                dispatch(
                  setFilterData({
                    ...filter,
                    isHidden: e.target.checked,
                  })
                );
              }}
            />
          }
          label={t("is_hidden")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.isForAppointment}
              onChange={(e) => {
                setFieldValue("isForAppointment", e.target.checked);
                dispatch(
                  setFilterData({
                    ...filter,
                    isForAppointment: e.target.checked,
                  })
                );
              }}
            />
          }
          label={t("is_for_appointment")}
        />
      </Stack>
    </FormikProvider>
  );
}

export default ProductFilter;
