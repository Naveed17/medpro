import { ChangeEvent } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Typography,
  Box,
  FormControl,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import Icon from "@themes/urlIcon";

import { addPatientSelector, onAddPatient } from "@features/customStepper";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import _ from "lodash";

import { useTranslation } from "next-i18next";

export default function AddPatientStep2({ ...props }) {
  const { onNext, t } = props;
  const { stepsData } = useAppSelector(addPatientSelector);
  const dispatch = useAppDispatch();
  const isAlreadyExist = _.keys(stepsData.step2).length > 0;
  const RegisterSchema = Yup.object().shape({});
  const formik = useFormik({
    initialValues: {
      region: isAlreadyExist ? stepsData.step2.region : "Ariana",
      zipCode: isAlreadyExist ? stepsData.step2.zipCode : "",
      address: isAlreadyExist ? stepsData.step2.address : "",
      email: isAlreadyExist ? stepsData.step2.email : "",
      cin: isAlreadyExist ? stepsData.step2.cin : "",
      from: isAlreadyExist ? stepsData.step2.from : "",
      insurance: isAlreadyExist ? stepsData.step2.insurance : [],
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      handleChange(null, values);
    },
  });
  const handleChange = (event: ChangeEvent | null, { ...values }) => {
    // popupDataSet({ ...popupData, step2: values });
    onNext(2);
    dispatch(onAddPatient({ ...stepsData, step2: values }));
  };
  const { values, handleSubmit, getFieldProps } = formik;
  const handleAddInsurance = () => {
    const insurance = [...values.insurance, { name: "", number: "" }];
    formik.setFieldValue("insurance", insurance);
  };
  const handleRemoveInsurance = (index: number) => {
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
          {t("add-patient.additional-information")}
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("add-patient.region")}
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
                      : t("add-patient.region-placeholder")
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
                {t("add-patient.zip")}
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
              {t("add-patient.address")}
            </Typography>
            <TextField
              variant="outlined"
              multiline
              rows={3}
              placeholder={t("add-patient.address-placeholder")}
              size="small"
              fullWidth
              {...getFieldProps("address")}
            />
          </Box>
          <Box>
            <Typography sx={{ mb: 1.5 }}>
              <IconButton
                onClick={handleAddInsurance}
                className="success-light"
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
              {t("add-patient.assurance")}
            </Typography>
            <Box>
              {values.insurance.map((val, index: number) => (
                <Grid
                  key={Math.random()}
                  container
                  spacing={2}
                  sx={{ mt: index > 0 ? 1 : 0 }}
                >
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
                            : t("add-patient.assurance")
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
                        placeholder={t("add-patient.assurance-phone-error")}
                        size="small"
                        fullWidth
                        {...getFieldProps(`insurance[${index}].number`)}
                      />
                      <IconButton
                        onClick={() => handleRemoveInsurance(index)}
                        className="error-light"
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
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("add-patient.email")}
            </Typography>
            <TextField
              placeholder={t("add-patient.email-placeholder")}
              type="email"
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("email")}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("add-patient.cin")}
            </Typography>
            <TextField
              placeholder={t("add-patient.cin-placeholder")}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              {...getFieldProps("cin")}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("add-patient.from")}
            </Typography>
            <TextField
              placeholder={t("add-patient.from-placeholder")}
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
            {t("add-patient.return")}
          </Button>
          <Button variant="contained" type="submit" color="primary">
            {t("add-patient.register")}
          </Button>
        </Stack>
      </Stack>
    </FormikProvider>
  );
}
