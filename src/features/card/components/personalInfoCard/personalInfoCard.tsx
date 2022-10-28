import React from "react";
// hook
import { useTranslation } from "next-i18next";
import { useFormik, Form, FormikProvider } from "formik";
import MaskedInput from "react-text-mask";
// material
import {
  Box,
  Typography,
  Paper,
  Grid,
  Skeleton,
  InputBase,
  useTheme,
} from "@mui/material";

// dumy data
const data = {
  personal: [
    // {
    //   name: "group",
    //   value: "groupe x",
    // },
    // {
    //   name: "region",
    //   value: "Ariana",
    // },
    // {
    //   name: "civility",
    //   value: "Mr",
    // },
    {
      name: "address",
    },
    {
      name: "name",
    },
    // {
    //   name: "zip",
    //   value: "1004",
    // },
    {
      name: "birthdate",
    },
    // {
    //   name: "assurance",
    //   value: "",
    // },
    {
      name: "telephone",
    },
    // {
    //   name: "cin",
    //   value: "",
    // },
    {
      name: "email",
    },
    // {
    //   name: "from",
    //   value: "",
    // },
  ],
};

function PersonalInfo({ ...props }) {
  const theme = useTheme();
  const { patient, loading } = props;
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "config.add-patient",
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: !loading ? `${patient.firstName} ${patient.lastName}` : "-",
      birthdate: !loading ? patient.birthdate : "-",
      address:
        !loading && patient.address.length > 0
          ? patient.address[0].city.name + ", " + patient.address[0].street
          : "-",
      telephone:
        !loading && patient.contact.length > 0
          ? `${patient.contact[0].code ? patient.contact[0].code : ""}${
              patient.contact[0].value
            }`
          : "-",
      email: !loading && patient.email ? patient.email : "-",
    },
    onSubmit: async (values) => {
      console.log("ok", values);
    },
  });
  console.log(patient);
  const { handleSubmit, values, getFieldProps } = formik;
  if (!ready) return <div>Loading...</div>;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate>
        <Box
          sx={{
            "& .MuiPaper-root .MuiTypography-root": {
              fontSize: 12,
            },
          }}>
          <Typography
            variant="body1"
            color="text.primary"
            fontFamily="Poppins"
            gutterBottom>
            {loading ? (
              <Skeleton variant="text" sx={{ maxWidth: 200 }} />
            ) : (
              t("personal-info")
            )}
          </Typography>
          <Paper sx={{ p: 1.5, borderWidth: 0 }}>
            <Grid container spacing={1.2}>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.secondary" noWrap>
                  {t("address")}
                </Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  <InputBase
                    inputProps={{
                      style: {
                        background: "white",
                        fontSize: 14,
                      },
                    }}
                    {...getFieldProps("address")}
                  />
                )}
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.secondary" noWrap>
                  {t("name")}
                </Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  <InputBase
                    inputProps={{
                      style: {
                        background: "white",
                        fontSize: 14,
                      },
                    }}
                    {...getFieldProps("name")}
                  />
                )}
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.secondary" noWrap>
                  {t("telephone")}
                </Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  <InputBase
                    inputProps={{
                      style: {
                        background: "white",
                        fontSize: 14,
                      },
                    }}
                    {...getFieldProps("telephone")}
                  />
                )}
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.secondary" noWrap>
                  {t("birthdate")}
                </Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  <MaskedInput
                    style={{
                      border: "none",
                      outline: "none",
                      width: 75,
                    }}
                    mask={[
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    placeholderChar={"\u2000"}
                    {...getFieldProps("birthdate")}
                    showMask
                  />
                )}
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                <Typography variant="body1" color="text.secondary" noWrap>
                  {t("email")}
                </Typography>
              </Grid>
              <Grid item md={3} sm={6} xs={6}>
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  <InputBase
                    inputProps={{
                      style: {
                        background: "white",
                        fontSize: 14,
                      },
                    }}
                    {...getFieldProps("email")}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default PersonalInfo;
