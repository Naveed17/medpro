import React, { ChangeEvent } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, FormikProps } from "formik";
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
import { addPatientSelector, onAddPatient } from "@features/customStepper";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import _ from "lodash";

interface MyValues {
  group: string;
  name: string;
  firstName: string;
  dob: any;
  phone: number | string;
  gender: string;
}
interface touchedProps {
  dob: any;
  name: string;
  firstName: string;
  phone: string | number;
}
export default function AddPatientStep1({ ...props }) {
  const { t, onNext } = props;
  const { stepsData } = useAppSelector(addPatientSelector);
  const dispatch = useAppDispatch();
  const isAlreadyExist = _.keys(stepsData.step1).length > 0;

  const [selected, setslected] = React.useState<any>(null);
  // const settings = useSettings();
  // const { popupDataSet } = settings;
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("add-patient.name-error"))
      .max(50, t("add-patient.name-error"))
      .required(t("add-patient.name-error")),
    firstName: Yup.string()
      .min(3, t("add-patient.first-name-error"))
      .max(50, t("add-patient.first-name-error"))
      .required(t("add-patient.first-name-error")),
    phone: Yup.string()
      .min(9, t("add-patient.telephone-error"))
      .matches(phoneRegExp, t("add-patient.telephone-error"))
      .required(t("add-patient.telephone-error")),
    dob: Yup.object().shape({
      day: Yup.string().required(t("add-patient.date-error")),
      month: Yup.string().required(t("add-patient.date-error")),
      year: Yup.string().required(t("add-patient.date-error")),
    }),
  });

  const formik: FormikProps<MyValues> = useFormik<MyValues>({
    initialValues: {
      group: isAlreadyExist ? stepsData.step1.group : "",
      name: isAlreadyExist ? stepsData.step1.name : "aasd",
      firstName: isAlreadyExist ? stepsData.step1.firstName : "asdasd",
      dob: isAlreadyExist
        ? stepsData.step1.dob
        : {
            day: 1,
            month: 1,
            year: 1,
          },
      phone: isAlreadyExist ? stepsData.step1.phone : 123123123,
      gender: isAlreadyExist ? stepsData.step1.gender : "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      handleChange(null, values);
    },
  });
  const handleChange = (event: ChangeEvent | null, values: object) => {
    // popupDataSet({ step1: values });
    onNext(1);
    dispatch(onAddPatient({ ...stepsData, step1: values }));
  };
  const { values, handleSubmit, isSubmitting, getFieldProps } = formik;

  const touched = formik.values as touchedProps;
  const errors = formik.errors as touchedProps;

  return (
    <FormikProvider value={formik}>
      <Stack
        sx={{ height: "100%" }}
        component={Form}
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography mt={1} variant="h6" color="text.primary" sx={{ mb: 4 }}>
          {t("add-patient.personal-info")}
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("add-patient.group")}
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
                    : t("add-patient.group-placeholder")
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
                  label={t("add-patient.mr")}
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio size="small" />}
                  label={t("add-patient.mrs")}
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
              {t("add-patient.name")}{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              variant="outlined"
              placeholder={t("add-patient.name-placeholder")}
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
              {t("add-patient.first-name")}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              placeholder={t("add-patient.first-name-placeholder")}
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={
                Boolean(touched.firstName && errors.firstName)
                  ? String(errors.firstName)
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
              {t("add-patient.date-of-birth")}
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
                      : t("add-patient.day")
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
                      : t("add-patient.month")
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
                      : t("add-patient.year")
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
              {t("add-patient.telephone")}{" "}
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
          mt={"auto"}
        >
          <Button variant="text-black" color="primary">
            {t("add-patient.cancel")}
          </Button>
          <Button variant="contained" type="submit" color="primary">
            {t("add-patient.next")}
          </Button>
        </Stack>
      </Stack>
    </FormikProvider>
  );
}
