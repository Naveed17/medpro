import React from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Typography,
  Card,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Switch,
  TextField,
  Grid,
  InputAdornment,
  Button,
  Select,
  InputLabel,
  MenuItem,
  Stack,
  FormHelperText,
  IconButton,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import { CountrySelect } from "@features/countrySelect";
//redux
// import { useSelector } from "react-redux";
// settings
// import useSettings from "@settings/useSettings";

export default function AddPatientStep2({ onNext, stepData, data }) {
  // const settings = useSettings();
  // const { popupDataSet } = settings;
  // const { popupData } = useSelector((state) => state.actionState);
  const RegisterSchema = Yup.object().shape({});
  const formik = useFormik({
    initialValues: {
      region: data ? data.region : "Ariana",
      zipCode: data ? data.zipCode : "",
      address: data ? data.address : "",
      email: data ? data.email : "",
      cin: data ? data.cin : "",
      from: data ? data.from : "",
      insurance: data ? data.insurance : [],
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      handleChange(null, values);
    },
  });
  const handleChange = (event, values) => {
    // popupDataSet({ ...popupData, step2: values });
    onNext(2);
    stepData(values);
  };
  const { values, handleSubmit, getFieldProps } = formik;
  const handleAddInsurance = () => {
    const insurance = [...values.insurance, { name: "", number: "" }];
    formik.setFieldValue("insurance", insurance);
  };
  const handleRemoveInsurance = (index) => {
    const insurance = [...values.insurance];
    insurance.splice(index, 1);
    formik.setFieldValue("insurance", insurance);
  };
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
          Information supplémentaires
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Region
              </Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id={"region"}
                  size="small"
                  {...getFieldProps("region")}
                  value={values.region}
                  displayEmpty={true}
                  sx={{ color: "text.secondary" }}
                  renderValue={(value) =>
                    value?.length
                      ? Array.isArray(value)
                        ? value.join(", ")
                        : value
                      : "Region"
                  }
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Zip Code
              </Typography>
              <TextField
                variant="outlined"
                placeholder="1004"
                size="small"
                fullWidth
                {...getFieldProps("zipCode")}
              />
            </Grid>
          </Grid>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Address
            </Typography>
            <TextField
              variant="outlined"
              multiline
              rows={3}
              placeholder="Enter the patient's address"
              size="small"
              fullWidth
              {...getFieldProps("address")}
            />
          </Box>
          <Box>
            <Typography sx={{ mb: 1.5 }}>
              <IconButton
                // onClick={handleAddInsurance}
                variant="success-light"
                sx={{
                  mr: 1.5,
                  "& svg": {
                    width: 20,
                    height: 20,
                    "& path": {
                      fill: (theme) => theme.palette.text.primary,
                    },
                  },
                }}
              >
                <Icon path="ic-plus" />
              </IconButton>
              Insurance
            </Typography>
            <Box>
              {/* {values.insurance.map((_, index) => (
                <Grid container spacing={2} sx={{ mt: index > 0 ? 1 : 0 }}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <Select
                        id={"assurance"}
                        size="small"
                        {...getFieldProps(`insurance[${index}].name`)}
                        value={values.insurance[index]?.name}
                        displayEmpty={true}
                        sx={{ color: "text.secondary" }}
                        renderValue={(value) =>
                          value?.length
                            ? Array.isArray(value)
                              ? value.join(", ")
                              : value
                            : "Assurance"
                        }
                      >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        variant="outlined"
                        placeholder="Enter the insurance number"
                        size="small"
                        fullWidth
                        {...getFieldProps(`insurance[${index}].number`)}
                      />
                      <IconButton
                        onClick={() => handleRemoveInsurance(index)}
                        variant="error-light"
                        sx={{
                          mr: 1.5,
                          "& svg": {
                            width: 20,
                            height: 20,
                            "& path": {
                              fill: (theme) => theme.palette.text.primary,
                            },
                          },
                        }}
                      >
                        <Icon path="ic-moin" />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              ))} */}
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              E-mail
            </Typography>
            <TextField
              placeholder="Enter the patient's email address"
              type="email"
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("email")}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              CIN
            </Typography>
            <TextField
              placeholder="Enter the patient's CIN"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("cin")}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              From
            </Typography>
            <TextField
              placeholder="Who?"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("from")}
            />
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
  e;
}
