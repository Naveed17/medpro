import React, {useCallback, useEffect} from "react";
import AutoCompleteMulti from "./autoCompleteMulti";
import {
    Stack,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import {FormikProvider, useFormik, Form} from "formik";
import * as data from "./data";
import {
    leftActionBarSelector, setFilter
} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import _ from "lodash";

function ProductFilter({...props}) {
    const {t, OnSearch} = props;
    const dispatch = useAppDispatch();

    const {query: filter} = useAppSelector(leftActionBarSelector);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: filter?.inventory?.name || "",
            brand: filter?.inventory?.brand || [],
            categories: filter?.inventory?.categories || [],
            stock: filter?.inventory?.stock || [],
            isHidden: filter?.inventory?.isHidden || false,
            isForAppointment: filter?.inventory?.isForAppointment || false,
        },
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const onChangeInput = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    const {setFieldValue, values} = formik;

    useEffect(() => {
        const data = {
            ...values,
            brand: values.brand.map((item: any) => item?.name),
            categories: values.categories.map((item: any) => item?.name),
            stock: values.stock.map((item: any) => item?.name),
        };
        onChangeInput(data);
    }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

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
                            if (e.target.value.length > 0) {
                                dispatch(setFilter({
                                        inventory: {
                                            ...filter?.inventory,
                                            name: e.target.value,
                                        }
                                    })
                                );
                            } else {
                                const query = _.omit(filter?.inventory, "name");
                                dispatch(setFilter({inventory: query}));
                            }
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
                            if (value.length > 0) {
                                dispatch(setFilter({
                                    inventory: {
                                        ...filter?.inventory,
                                        brand: value,
                                    }
                                }));
                            } else {
                                const query = _.omit(filter?.inventory, "brand");
                                dispatch(setFilter({inventory: query}));
                            }
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
                            if (value.length > 0) {
                                dispatch(setFilter({
                                    inventory: {
                                        ...filter?.inventory,
                                        categories: value
                                    }
                                }));
                            } else {
                                const query = _.omit(filter?.inventory, "categories");
                                dispatch(setFilter({inventory: query}));
                            }
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
                            if (value.length > 0) {
                                dispatch(setFilter({
                                    inventory: {
                                        ...filter?.inventory,
                                        stock: value
                                    }
                                }));
                            } else {
                                const query = _.omit(filter?.inventory, "stock");
                                dispatch(setFilter({inventory: query}));
                            }
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
                                dispatch(setFilter({
                                    inventory: {
                                        ...filter?.inventory,
                                        isHidden: e.target.checked
                                    }
                                }));
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
                                dispatch(setFilter({
                                    inventory: {
                                        ...filter?.inventory,
                                        isForAppointment: e.target.checked,
                                    }
                                }));
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
