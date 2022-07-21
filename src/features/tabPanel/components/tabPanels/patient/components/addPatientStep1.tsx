import React, { ChangeEvent } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  Stack,
  FormHelperText,
} from "@mui/material";
import { CountrySelect } from "@features/countrySelect";
import { addPatientSelector, onAddPatient } from "@features/tabPanel";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { useTranslation } from "next-i18next";

function AddPatientStep1({ ...props }) {
  const { onNext } = props;
  const { stepsData } = useAppSelector(addPatientSelector);
  const dispatch = useAppDispatch();
  const [selected, setslected] = React.useState<any>(null);

  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-patient",
  });
  if (!ready) return <>loading translations...</>;

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("name-error"))
      .max(50, t("name-error"))
      .required(t("name-error")),
    firstName: Yup.string()
      .min(3, t("first-name-error"))
      .max(50, t("first-name-error"))
      .required(t("first-name-error")),
    phone: Yup.string()
      .min(9, t("telephone-error"))
      .matches(phoneRegExp, t("telephone-error"))
      .required(t("telephone-error")),
    dob: Yup.object().shape({
      day: Yup.string().required(t("date-error")),
      month: Yup.string().required(t("date-error")),
      year: Yup.string().required(t("date-error")),
    }),
  });

  const formik = useFormik({
    initialValues: {
      group: stepsData.step1.group,
      name: stepsData.step1.name,
      firstName: stepsData.step1.firstName,
      dob: stepsData.step1.dob,
      phone: stepsData.step1.phone,
      gender: stepsData.step1.gender,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      handleChange(null, values);
    },
  });
  const handleChange = (event: ChangeEvent | null, values: object) => {
    onNext(1);
    dispatch(onAddPatient({ ...stepsData, step1: values }));
  };
  const { values, handleSubmit, touched, errors, isSubmitting, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Stack
        sx={{ height: "100%" }}
        component={Form}
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Stack spacing={2} className="inner-section">
          <Typography mt={1} variant="h6" color="text.primary" sx={{ mb: 2 }}>
            {t("personal-info")}
          </Typography>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("group")}
            </Typography>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id={"group"}
                size="small"
                {...getFieldProps("group")}
                value={values.group}
                displayEmpty={true}
                sx={{ color: "text.secondary" }}
                renderValue={(value) =>
                  value?.length
                    ? Array.isArray(value)
                      ? value.join(", ")
                      : value
                    : t("group-placeholder")
                }
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="gender" {...getFieldProps("gender")}>
                <FormControlLabel
                  value="Male"
                  control={<Radio size="small" />}
                  label={t("mr")}
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio size="small" />}
                  label={t("mrs")}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              component="span"
            >
              {t("name")}{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              variant="outlined"
              placeholder={t("name-placeholder")}
              size="small"
              fullWidth
              {...getFieldProps("name")}
              error={Boolean(touched.name && errors.name)}
              helperText={
                Boolean(touched.name && errors.name)
                  ? String(errors.name)
                  : undefined
              }
            />
          </Box>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              component="span"
            >
              {t("first-name")}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              placeholder={t("first-name-placeholder")}
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={
                Boolean(touched.firstName && errors.firstName)
                  ? errors.firstName
                  : undefined
              }
            />
          </Box>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              component="span"
            >
              {t("date-of-birth")}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <Stack spacing={3} direction={{ xs: "column", lg: "row" }}>
              <FormControl size="small" fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id={"day"}
                  {...getFieldProps("dob.day")}
                  value={values.dob.day}
                  displayEmpty={true}
                  sx={{ color: "text.secondary" }}
                  renderValue={(value: string) =>
                    value?.length
                      ? Array.isArray(value)
                        ? value.join(", ")
                        : value
                      : t("day")
                  }
                  error={Boolean(touched.dob && errors.dob)}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
                {touched.dob && errors.dob && (
                  <FormHelperText error sx={{ px: 2, mx: 0 }}>
                    {touched.dob?.day && errors.dob?.day}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl size="small" fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id={"day"}
                  {...getFieldProps("dob.month")}
                  value={values.dob.month}
                  displayEmpty={true}
                  sx={{ color: "text.secondary" }}
                  renderValue={(value) =>
                    value?.length
                      ? Array.isArray(value)
                        ? value.join(", ")
                        : value
                      : t("month")
                  }
                  error={Boolean(touched.dob && errors.dob)}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
                {touched.dob && errors.dob && (
                  <FormHelperText error sx={{ px: 2, mx: 0 }}>
                    {touched.dob.month && errors.dob.month}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl size="small" fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id={"day"}
                  {...getFieldProps("dob.year")}
                  value={values.dob.year}
                  displayEmpty={true}
                  sx={{ color: "text.secondary" }}
                  renderValue={(value) =>
                    value?.length
                      ? Array.isArray(value)
                        ? value.join(", ")
                        : value
                      : t("year")
                  }
                  error={Boolean(touched.dob && errors.dob)}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
                {touched.dob && errors.dob && (
                  <FormHelperText error sx={{ px: 2, mx: 0 }}>
                    {touched.dob.year && errors.dob.year}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Box>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              component="span"
            >
              {t("telephone")}{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={6} lg={4} xs={12}>
                <CountrySelect selected={(v: any) => setslected(v)} />
              </Grid>
              <Grid item md={6} lg={8} xs={12}>
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  {...getFieldProps("phone")}
                  error={Boolean(touched.phone && errors.phone)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {selected?.phone}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            {touched.phone && errors.phone && (
              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                {touched.phone && errors.phone}
              </FormHelperText>
            )}
          </Box>
        </Stack>
        <Stack
          spacing={3}
          direction="row"
          justifyContent="flex-end"
          className="action"
        >
          <Button variant="text-black" color="primary">
            {t("cancel")}
          </Button>
          <Button variant="contained" type="submit" color="primary">
            {t("next")}
          </Button>
        </Stack>
      </Stack>
    </FormikProvider>
  );
}
export default AddPatientStep1;
