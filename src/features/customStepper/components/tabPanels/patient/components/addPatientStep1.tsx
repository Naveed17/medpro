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
export default function AddPatientStep1({
  onNext,
}: {
  onNext: (data: any) => void;
}) {
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
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required("Name required"),
    firstName: Yup.string()
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required(
        "The first name must contain at least 3 characters, without special characters"
      ),
    phone: Yup.string()
      .min(9, "Not a valid number")
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone number required"),
    dob: Yup.object().shape({
      day: Yup.string().required("Day is required"),
      month: Yup.string().required("Month is required"),
      year: Yup.string().required("Year is required"),
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
          Information personnelle
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Group
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
                    : "Group"
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
                  label="Mr"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio size="small" />}
                  label="Mrs"
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
              Nom{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Type the patient's name"
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
              First name
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              placeholder="Enter the patient's first name"
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
              Date de naissance{" "}
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
                      : "Day"
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
                      : "Month"
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
                      : "Year"
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
              Numéro de téléphone{" "}
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
            Annuler
          </Button>
          <Button variant="contained" type="submit" color="primary">
            Suivant
          </Button>
        </Stack>
      </Stack>
    </FormikProvider>
  );
}
